-- =============================================================================
-- Panel admin: lectura de pedidos para staff, estado "enviado", políticas RLS.
-- Ejecutar en Supabase → SQL (proyecto existente que ya tiene orders).
-- =============================================================================

alter table public.orders add column if not exists shipped_at timestamptz;

alter table public.orders drop constraint if exists orders_status_check;

alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'paid', 'shipped', 'failed', 'cancelled'));

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
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

comment on column public.orders.shipped_at is 'Fecha en que el pedido pasó a enviado (logística).';
