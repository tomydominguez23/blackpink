-- ============================================================
-- Supabase schema para Black Pinckl (seguro + producción)
-- Ejecutar en SQL Editor de Supabase (todo el bloque)
-- ============================================================

-- Extensión para UUID
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1) Tabla de perfiles y roles (vinculada a auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'seller' check (role in ('admin', 'seller', 'catalog', 'sales')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Actualiza updated_at automáticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Crea perfil automáticamente cuando se crea un usuario en Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'seller')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 2) Funciones helper de autorización (RLS)
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

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

-- ------------------------------------------------------------
-- 3) Catálogo de productos (panel inventario + web pública)
-- ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  external_id text unique, -- ej: custom-123, iphone-xr
  imei varchar(15) unique check (imei is null or imei ~ '^[0-9]{15}$'),
  title text not null,
  category text not null check (category in ('iphone', 'mac', 'ipad', 'watch', 'airpods', 'otros')),
  category_label text not null,
  condition text not null check (condition in ('nuevo', 'seminuevo', 'openbox')),
  price integer not null check (price >= 0),
  old_price integer check (old_price is null or old_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  cover_image_url text,
  images jsonb not null default '[]'::jsonb,
  description text default '',
  long_description text default '',
  specs jsonb not null default '{}'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  capacities jsonb not null default '[]'::jsonb,
  charger_price integer check (charger_price is null or charger_price >= 0),
  published boolean not null default false,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- Stock compartido entre listados (sellado / open box): ver supabase-migration-stock-source-product.sql
alter table public.products
  add column if not exists stock_source_product_id uuid references public.products (id) on delete set null;

create index if not exists idx_products_stock_source
  on public.products (stock_source_product_id)
  where stock_source_product_id is not null;

create index if not exists idx_products_published_stock on public.products (published, stock);
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_updated_at on public.products (updated_at desc);

-- ------------------------------------------------------------
-- 3b) Pedidos y descuento de stock al confirmar pago (pasarela / webhook)
--     Ver también supabase-migration-orders-and-stock-on-payment.sql en proyectos ya creados.
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'failed', 'cancelled')),
  provider text,
  provider_payment_id text,
  customer_email text,
  total_amount integer check (total_amount is null or total_amount >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  shipped_at timestamptz
);

create unique index if not exists idx_orders_provider_payment
  on public.orders (provider, provider_payment_id)
  where provider is not null and provider_payment_id is not null;

create index if not exists idx_orders_status on public.orders (status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  product_external_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_order_items_product on public.order_items (product_id);

-- ------------------------------------------------------------
-- 3c) Auditoría de productos y conteo diario del asistente IA
-- ------------------------------------------------------------
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

create table if not exists public.assistant_usage_daily (
  day date primary key,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

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

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Staff puede listar pedidos en el panel; solo admin actualiza estado (p. ej. enviado).
drop policy if exists "orders_staff_select" on public.orders;
create policy "orders_staff_select"
on public.orders
for select
to authenticated
using (public.is_staff());

drop policy if exists "order_items_staff_select" on public.order_items;
create policy "order_items_staff_select"
on public.order_items
for select
to authenticated
using (public.is_staff());

drop policy if exists "orders_admin_update" on public.orders;
drop policy if exists "orders_staff_update" on public.orders;
create policy "orders_staff_update"
on public.orders
for update
to authenticated
using (public.is_order_manager())
with check (public.is_order_manager());

create or replace function public.mark_order_paid_and_decrement_stock(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  target_id uuid;
begin
  if not exists (
    select 1 from public.orders where id = p_order_id and status = 'pending'
  ) then
    return jsonb_build_object(
      'ok', false,
      'error', 'order_not_pending_or_missing'
    );
  end if;

  if not exists (
    select 1 from public.order_items where order_id = p_order_id
  ) then
    return jsonb_build_object(
      'ok', false,
      'error', 'no_line_items'
    );
  end if;

  for r in
    select product_id, quantity from public.order_items where order_id = p_order_id
  loop
    select coalesce(p.stock_source_product_id, p.id)
    into target_id
    from public.products p
    where p.id = r.product_id;

    if target_id is null then
      return jsonb_build_object(
        'ok', false,
        'error', 'product_missing',
        'product_id', r.product_id
      );
    end if;

    update public.products
    set
      stock = stock - r.quantity,
      published = case
        when stock - r.quantity <= 0 then false
        else published
      end,
      updated_at = now()
    where id = target_id and stock >= r.quantity;

    if not found then
      return jsonb_build_object(
        'ok', false,
        'error', 'insufficient_stock',
        'product_id', r.product_id,
        'resolved_stock_owner', target_id
      );
    end if;
  end loop;

  update public.orders
  set status = 'paid', paid_at = coalesce(paid_at, now())
  where id = p_order_id and status = 'pending';

  return jsonb_build_object('ok', true, 'order_id', p_order_id);
end;
$$;

revoke all on function public.mark_order_paid_and_decrement_stock(uuid) from public;
grant execute on function public.mark_order_paid_and_decrement_stock(uuid) to service_role;

-- ------------------------------------------------------------
-- 4) Trade-in (módulo "Vende tu equipo")
-- ------------------------------------------------------------
create table if not exists public.tradein_settings (
  id integer primary key default 1 check (id = 1),
  increment_per_tier integer not null default 12000 check (increment_per_tier >= 0),
  fixed_deduction integer not null default 8000 check (fixed_deduction >= 0),
  min_percent_floor numeric(4,3) not null default 0.350 check (min_percent_floor >= 0.100 and min_percent_floor <= 1.000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tradein_settings_updated_at on public.tradein_settings;
create trigger trg_tradein_settings_updated_at
before update on public.tradein_settings
for each row
execute function public.set_updated_at();

insert into public.tradein_settings (id, increment_per_tier, fixed_deduction, min_percent_floor)
values (1, 12000, 8000, 0.350)
on conflict (id) do nothing;

create table if not exists public.tradein_categories (
  id text primary key,
  name text not null,
  img_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tradein_categories_updated_at on public.tradein_categories;
create trigger trg_tradein_categories_updated_at
before update on public.tradein_categories
for each row
execute function public.set_updated_at();

create table if not exists public.tradein_models (
  id text primary key,
  category_id text not null references public.tradein_categories(id) on delete cascade,
  name text not null,
  year text,
  base integer not null check (base >= 0),
  img_url text,
  capacities jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tradein_models_updated_at on public.tradein_models;
create trigger trg_tradein_models_updated_at
before update on public.tradein_models
for each row
execute function public.set_updated_at();

-- Seed categorías trade-in
insert into public.tradein_categories (id, name, img_url) values
('iphone', 'iPhone', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=160&h=160&fit=crop&q=80'),
('imac', 'iMac', 'https://images.unsplash.com/photo-1527443224154-c4bbf5b8f4ff?w=160&h=160&fit=crop&q=80'),
('accesorios', 'Accesorios', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=160&h=160&fit=crop&q=80'),
('macbook', 'MacBook', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&h=160&fit=crop&q=80'),
('ipad', 'iPad', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=160&h=160&fit=crop&q=80'),
('watch', 'Apple Watch', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=160&h=160&fit=crop&q=80'),
('videojuegos', 'Videojuegos', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=160&h=160&fit=crop&q=80'),
('camaras', 'Cámaras', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&h=160&fit=crop&q=80'),
('drones', 'Drones', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=160&h=160&fit=crop&q=80')
on conflict (id) do update
set name = excluded.name,
    img_url = excluded.img_url,
    active = true,
    updated_at = now();

-- Seed modelos trade-in
insert into public.tradein_models (id, category_id, name, year, base, img_url, capacities) values
('ip6s', 'iphone', 'iPhone 6S', '2015', 20000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=320&fit=crop&q=80', '[16,32,64,128]'::jsonb),
('ip13', 'iphone', 'iPhone 13', '2021', 220000, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=320&h=320&fit=crop&q=80', '[128,256,512]'::jsonb),
('ip11', 'iphone', 'iPhone 11', '2019', 140000, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=320&h=320&fit=crop&q=80', '[64,128,256]'::jsonb),
('imac24', 'imac', 'iMac 24"', null, 890000, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=320&h=320&fit=crop&q=80', '[256,512,1024]'::jsonb),
('airpods', 'accesorios', 'AirPods Pro', null, 120000, 'https://images.unsplash.com/photo-1606220945770-b2b6ce2aef0e?w=320&h=320&fit=crop&q=80', '[]'::jsonb),
('mba-m2', 'macbook', 'MacBook Air M2', null, 720000, 'https://images.unsplash.com/photo-1661961112951-fadf717756d6?w=320&h=320&fit=crop&q=80', '[256,512,1024]'::jsonb),
('ipad10', 'ipad', 'iPad 10.ª gen.', null, 180000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&h=320&fit=crop&q=80', '[64,256]'::jsonb),
('s8', 'watch', 'Apple Watch Series 8', null, 160000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=320&h=320&fit=crop&q=80', '[32,64]'::jsonb),
('ps4', 'videojuegos', 'PlayStation 4', null, 150000, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=320&h=320&fit=crop&q=80', '[500,1000]'::jsonb),
('gopro', 'camaras', 'GoPro Hero', null, 180000, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=320&h=320&fit=crop&q=80', '[32,64,128]'::jsonb),
('dji', 'drones', 'DJI Mini', null, 320000, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=320&h=320&fit=crop&q=80', '[]'::jsonb)
on conflict (id) do update
set category_id = excluded.category_id,
    name = excluded.name,
    year = excluded.year,
    base = excluded.base,
    img_url = excluded.img_url,
    capacities = excluded.capacities,
    active = true,
    updated_at = now();

-- ------------------------------------------------------------
-- 5) RLS (Row Level Security)
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.tradein_settings enable row level security;
alter table public.tradein_categories enable row level security;
alter table public.tradein_models enable row level security;

-- Limpieza de políticas existentes (idempotente)
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
drop policy if exists "products_public_read_catalog" on public.products;
drop policy if exists "products_staff_read_all" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_staff_insert" on public.products;
drop policy if exists "products_staff_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;
drop policy if exists "tradein_public_read_settings" on public.tradein_settings;
drop policy if exists "tradein_admin_write_settings" on public.tradein_settings;
drop policy if exists "tradein_public_read_categories" on public.tradein_categories;
drop policy if exists "tradein_admin_write_categories" on public.tradein_categories;
drop policy if exists "tradein_public_read_models" on public.tradein_models;
drop policy if exists "tradein_admin_write_models" on public.tradein_models;

-- Profiles
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- Products
create policy "products_public_read_catalog"
on public.products
for select
to anon, authenticated
using (published = true and stock > 0);

create policy "products_staff_read_all"
on public.products
for select
to authenticated
using (public.is_staff());

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

-- Trade-in settings
create policy "tradein_public_read_settings"
on public.tradein_settings
for select
to anon, authenticated
using (true);

create policy "tradein_admin_write_settings"
on public.tradein_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Trade-in categories
create policy "tradein_public_read_categories"
on public.tradein_categories
for select
to anon, authenticated
using (active = true);

create policy "tradein_admin_write_categories"
on public.tradein_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Trade-in models
create policy "tradein_public_read_models"
on public.tradein_models
for select
to anon, authenticated
using (active = true);

create policy "tradein_admin_write_models"
on public.tradein_models
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.product_audit_log enable row level security;
alter table public.assistant_usage_daily enable row level security;

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

drop policy if exists "assistant_usage_admin_read" on public.assistant_usage_daily;

create policy "assistant_usage_admin_read"
on public.assistant_usage_daily
for select
to authenticated
using (public.is_admin());

-- ------------------------------------------------------------
-- 6) Supabase Storage para imágenes de productos
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

-- Políticas storage.objects
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

-- ------------------------------------------------------------
-- 7) Recomendación post-instalación
-- ------------------------------------------------------------
-- 1) Crea un usuario admin en Auth.
-- 2) Luego dale rol admin manualmente:
--    update public.profiles set role='admin' where id='TU_USER_UUID';
-- 3) Rota la service_role key si estuvo expuesta.

-- ------------------------------------------------------------
-- 8) Assets web dinámicos (logo, banners, iconos)
-- ------------------------------------------------------------
create table if not exists public.site_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('logo', 'banner', 'icon')),
  asset_key text, -- para iconos específicos, ej: header_cart, header_whatsapp
  title text not null default '',
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_assets_updated_at on public.site_assets;
create trigger trg_site_assets_updated_at
before update on public.site_assets
for each row
execute function public.set_updated_at();

create index if not exists idx_site_assets_type_active_order
  on public.site_assets (asset_type, is_active, sort_order);

alter table public.site_assets enable row level security;

drop policy if exists "site_assets_public_read_active" on public.site_assets;
drop policy if exists "site_assets_admin_read_all" on public.site_assets;
drop policy if exists "site_assets_admin_insert" on public.site_assets;
drop policy if exists "site_assets_admin_update" on public.site_assets;
drop policy if exists "site_assets_admin_delete" on public.site_assets;

create policy "site_assets_public_read_active"
on public.site_assets
for select
to anon, authenticated
using (is_active = true);

create policy "site_assets_admin_read_all"
on public.site_assets
for select
to authenticated
using (public.is_admin());

create policy "site_assets_admin_insert"
on public.site_assets
for insert
to authenticated
with check (public.is_admin());

create policy "site_assets_admin_update"
on public.site_assets
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "site_assets_admin_delete"
on public.site_assets
for delete
to authenticated
using (public.is_admin());

