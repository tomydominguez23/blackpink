-- =============================================================================
-- Pedidos + descuento de stock al confirmar pago (pasarela / webhook)
-- Ejecutar en Supabase → SQL (proyecto existente).
--
-- Flujo recomendado:
-- 1) Tu backend o Edge Function crea una fila en `orders` (status=pending) y
--    líneas en `order_items` (product_id = uuid de public.products, quantity).
-- 2) Envías al cliente a la pasarela (Webpay, Mercado Pago, Flow, etc.).
-- 3) Cuando la pasarela notifica "pago aprobado", tu webhook llama a la RPC
--    `mark_order_paid_and_decrement_stock(order_id)` o despliegas la Edge
--    Function incluida en /supabase/functions/payment-confirm/
--
-- La RPC es idempotente: solo actúa si status = 'pending'; evita doble descuento.
-- =============================================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled')),
  provider text,
  provider_payment_id text,
  customer_email text,
  total_amount integer check (total_amount is null or total_amount >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
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

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Sin políticas públicas: solo service_role / dashboard (evitar manipular pedidos desde el navegador).

-- Descuenta stock de una sola vez y marca el pedido como pagado.
create or replace function public.mark_order_paid_and_decrement_stock(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
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
    update public.products
    set
      stock = stock - r.quantity,
      published = case
        when stock - r.quantity <= 0 then false
        else published
      end,
      updated_at = now()
    where id = r.product_id and stock >= r.quantity;

    if not found then
      return jsonb_build_object(
        'ok', false,
        'error', 'insufficient_stock',
        'product_id', r.product_id
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

comment on function public.mark_order_paid_and_decrement_stock(uuid) is
  'Llamar desde webhook de pago (service role). Confirma pedido pending y descuenta stock.';
