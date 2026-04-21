-- Condición de catálogo: Open box (además de nuevo y seminuevo).
-- Ejecutar en Supabase → SQL.

alter table public.products drop constraint if exists products_condition_check;

alter table public.products
  add constraint products_condition_check
  check (condition in ('nuevo', 'seminuevo', 'openbox'));

comment on column public.products.condition is
  'Estado comercial: nuevo (sellado), seminuevo, openbox.';
