-- IMEI opcional en productos (ejecutar una vez en SQL Editor de Supabase si la tabla ya existía con NOT NULL)
-- Varios productos pueden tener imei NULL; la unicidad solo aplica cuando hay valor.

alter table public.products drop constraint if exists products_imei_check;
alter table public.products alter column imei drop not null;
alter table public.products add constraint products_imei_format_chk
  check (imei is null or imei ~ '^[0-9]{15}$');
