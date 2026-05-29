-- Despublica automáticamente cuando el stock llega a 0 (panel, API o RPC).
create or replace function public.products_auto_unpublish_zero_stock()
returns trigger
language plpgsql
as $$
begin
  if coalesce(new.stock, 0) <= 0 then
    new.published := false;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_products_auto_unpublish_zero_stock on public.products;
create trigger trg_products_auto_unpublish_zero_stock
  before insert or update of stock on public.products
  for each row
  execute function public.products_auto_unpublish_zero_stock();
