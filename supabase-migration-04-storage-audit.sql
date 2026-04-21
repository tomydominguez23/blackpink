-- Paso 4: bucket storage + auditoria (despues del paso 3)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

drop policy if exists "public_read_product_images" on storage.objects;
drop policy if exists "admin_insert_product_images" on storage.objects;
drop policy if exists "admin_update_product_images" on storage.objects;
drop policy if exists "editor_insert_product_images" on storage.objects;
drop policy if exists "editor_update_product_images" on storage.objects;
drop policy if exists "admin_delete_product_images" on storage.objects;

create policy "public_read_product_images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

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

create policy "admin_delete_product_images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

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

select 1 as paso_4_ok;
