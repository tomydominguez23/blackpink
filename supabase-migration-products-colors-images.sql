-- Productos: colores, specs (_colorImages), JSONB, RLS, Storage
-- Supabase -> SQL Editor. Idempotente. Copiar TODO el archivo (sin lineas de markdown).

-- 1) Funciones helper (sin dollar-quotes para evitar errores al pegar)
create or replace function public.is_admin()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = ''admin'')';

create or replace function public.is_staff()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in (''admin'',''seller'',''catalog'',''sales''))';

create or replace function public.is_product_editor()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in (''admin'',''seller'',''catalog''))';

-- 2) Roles en profiles
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'seller', 'catalog', 'sales'));

-- 3) Columnas products
alter table public.products add column if not exists external_id text;
alter table public.products add column if not exists category_label text;
alter table public.products add column if not exists old_price integer;
alter table public.products add column if not exists cover_image_url text;
alter table public.products add column if not exists images jsonb;
alter table public.products add column if not exists long_description text;
alter table public.products add column if not exists specs jsonb;
alter table public.products add column if not exists reviews jsonb;
alter table public.products add column if not exists colors jsonb;
alter table public.products add column if not exists capacities jsonb;
alter table public.products add column if not exists charger_price integer;
alter table public.products add column if not exists published boolean;
alter table public.products add column if not exists created_by uuid references auth.users(id);
alter table public.products add column if not exists updated_by uuid references auth.users(id);

update public.products set images = '[]'::jsonb where images is null;
update public.products set specs = '{}'::jsonb where specs is null;
update public.products set reviews = '[]'::jsonb where reviews is null;
update public.products set colors = '[]'::jsonb where colors is null;
update public.products set capacities = '[]'::jsonb where capacities is null;

alter table public.products alter column images set default '[]'::jsonb;
alter table public.products alter column specs set default '{}'::jsonb;
alter table public.products alter column reviews set default '[]'::jsonb;
alter table public.products alter column colors set default '[]'::jsonb;
alter table public.products alter column capacities set default '[]'::jsonb;

alter table public.products alter column images set not null;
alter table public.products alter column specs set not null;
alter table public.products alter column reviews set not null;
alter table public.products alter column colors set not null;
alter table public.products alter column capacities set not null;

update public.products set category_label = initcap(category)
where (category_label is null or trim(category_label) = '')
  and category is not null;

update public.products set category_label = 'Otros'
where category_label is null or trim(category_label) = '';

alter table public.products alter column category_label set not null;

alter table public.products alter column published set default false;
update public.products set published = false where published is null;
alter table public.products alter column published set not null;

-- 4) IMEI
update public.products
set imei = null
where imei is not null
  and (btrim(imei::text) = '' or btrim(imei::text) !~ '^[0-9]{15}$');

alter table public.products alter column imei drop not null;
alter table public.products drop constraint if exists products_imei_check;
alter table public.products drop constraint if exists products_imei_format_chk;
alter table public.products
  add constraint products_imei_format_chk
  check (imei is null or imei::text ~ '^[0-9]{15}$');

update public.products
set external_id = null
where external_id is not null and btrim(external_id) = '';

alter table public.products drop constraint if exists products_external_id_key;
drop index if exists public.products_external_id_unique;
create unique index if not exists products_external_id_unique
  on public.products (external_id)
  where external_id is not null;

-- 5) RLS products
alter table public.products enable row level security;

drop policy if exists "products_public_read_catalog" on public.products;
drop policy if exists "products_staff_read_all" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_staff_insert" on public.products;
drop policy if exists "products_staff_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;

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

-- 6) Storage
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

-- 7) Auditoria
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

select 1 as ok_migration_products;
