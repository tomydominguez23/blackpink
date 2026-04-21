-- Solo arreglo subida de imagenes (product-images) para colores / inventario.
-- Base ya funcionando: ejecutar esto en Supabase SQL Editor.
-- Requisito: tu usuario de Auth debe tener fila en public.profiles con role
--   'admin', 'seller' o 'catalog' (sales no puede subir al bucket con esta politica).

-- 1) Funciones usadas por las politicas (por si faltan o estan desactualizadas)
create or replace function public.is_admin()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = ''admin'')';

create or replace function public.is_product_editor()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in (''admin'',''seller'',''catalog''))';

-- 2) Bucket: mas tipos MIME (iPhone HEIC, GIF) y limite un poco mayor
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  15728640,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/gif'
  ]
)
on conflict (id) do update
set public = true,
    file_size_limit = 15728640,
    allowed_mime_types = array[
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/gif'
    ];

-- 3) Politicas storage: admin O editor de catalogo pueden insertar/actualizar
alter table storage.objects enable row level security;

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

create policy "staff_insert_product_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (public.is_admin() or public.is_product_editor())
);

create policy "staff_update_product_images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and (public.is_admin() or public.is_product_editor()))
with check (bucket_id = 'product-images' and (public.is_admin() or public.is_product_editor()));

create policy "admin_delete_product_images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

select 1 as storage_color_upload_fix_ok;
