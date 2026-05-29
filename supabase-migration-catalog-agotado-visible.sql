-- Catálogo público: productos publicados aunque stock total sea 0 (la ficha muestra Agotado por variante).
drop policy if exists "products_public_read_catalog" on public.products;

create policy "products_public_read_catalog"
on public.products
for select
to anon, authenticated
using (published = true);

drop trigger if exists trg_products_auto_unpublish_zero_stock on public.products;
drop function if exists public.products_auto_unpublish_zero_stock();

-- Tras un pago: solo bajar stock, no despublicar (sigue visible como Agotado).
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
