-- Paso 3: IMEI, indice external_id, RLS products (despues del paso 2)
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

select 1 as paso_3_ok;
