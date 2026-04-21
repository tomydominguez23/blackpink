-- =============================================================================
-- Panel: roles catalog/sales, auditoría de productos, uso del asistente IA.
-- Ejecutar en Supabase → SQL Editor (proyecto existente).
-- =============================================================================

-- 1) Roles ampliados
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'seller', 'catalog', 'sales'));

-- 2) Helpers RLS
create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'seller', 'catalog', 'sales')
  );
$$;

create or replace function public.is_product_editor()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'seller', 'catalog')
  );
$$;

create or replace function public.is_order_manager()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'seller', 'sales')
  );
$$;

-- 3) Políticas products: editar insert/update quien gestiona catálogo
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;

create policy "products_staff_insert"
on public.products
for insert
to authenticated
with check (public.is_product_editor());

create policy "products_staff_update"
on public.products
for update
to authenticated
using (public.is_product_editor())
with check (public.is_product_editor());

create policy "products_admin_delete"
on public.products
for delete
to authenticated
using (public.is_admin());

-- 4) Pedidos: vendedores de ventas pueden actualizar estado (con política existente solo admin)
drop policy if exists "orders_admin_update" on public.orders;

create policy "orders_staff_update"
on public.orders
for update
to authenticated
using (public.is_order_manager())
with check (public.is_order_manager());

-- 5) Auditoría de productos
create table if not exists public.product_audit_log (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  actor_email text,
  action text not null,
  summary text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_audit_product on public.product_audit_log (product_id);
create index if not exists idx_product_audit_created on public.product_audit_log (created_at desc);

alter table public.product_audit_log enable row level security;

drop policy if exists "product_audit_staff_select" on public.product_audit_log;
drop policy if exists "product_audit_staff_insert" on public.product_audit_log;

create policy "product_audit_staff_select"
on public.product_audit_log
for select
to authenticated
using (public.is_staff());

create policy "product_audit_staff_insert"
on public.product_audit_log
for insert
to authenticated
with check (
  public.is_staff()
  and (actor_id is null or actor_id = auth.uid())
);

-- 6) Conteo diario invocaciones asistente (solo service_role escribe desde Edge; opcional lectura admin)
create table if not exists public.assistant_usage_daily (
  day date primary key,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.assistant_usage_daily enable row level security;

drop policy if exists "assistant_usage_admin_read" on public.assistant_usage_daily;

create policy "assistant_usage_admin_read"
on public.assistant_usage_daily
for select
to authenticated
using (public.is_admin());

comment on table public.product_audit_log is 'Historial de cambios relevantes en productos (panel).';
comment on table public.assistant_usage_daily is 'Límite de uso OpenAI por día; actualizado por Edge Function assistant-query.';

-- 7) Storage: quien edita catálogo puede subir imágenes de producto
drop policy if exists "admin_insert_product_images" on storage.objects;
drop policy if exists "admin_update_product_images" on storage.objects;

create policy "editor_insert_product_images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_product_editor());

create policy "editor_update_product_images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_product_editor())
with check (bucket_id = 'product-images' and public.is_product_editor());

-- 8) RPC atómica: uso diario asistente (solo service_role)
create or replace function public.assistant_usage_try_increment(p_max integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  d date := (timezone('utc', now()))::date;
  cur int;
  newv int;
begin
  if p_max is null or p_max < 1 then
    p_max := 500;
  end if;

  insert into public.assistant_usage_daily as u (day, request_count, updated_at)
  values (d, 0, now())
  on conflict (day) do nothing;

  select request_count into cur
  from public.assistant_usage_daily
  where day = d
  for update;

  if cur is null then
    cur := 0;
  end if;

  if cur >= p_max then
    return jsonb_build_object('ok', false, 'count', cur, 'max', p_max);
  end if;

  newv := cur + 1;
  update public.assistant_usage_daily
  set request_count = newv, updated_at = now()
  where day = d;

  return jsonb_build_object('ok', true, 'count', newv, 'max', p_max);
end;
$$;

revoke all on function public.assistant_usage_try_increment(integer) from public;
grant execute on function public.assistant_usage_try_increment(integer) to service_role;

