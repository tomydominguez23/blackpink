-- =============================================================================
-- Stock compartido entre publicaciones (mismo inventario físico, distinto precio)
-- Ej.: listado "Sellado" (canónico) + listado "Open Box" (espejo).
--
-- - Columna: stock_source_product_id → UUID del producto dueño del stock (null = propio).
-- - Solo puede apuntar a un producto que NO sea a su vez espejo (cadena plana).
-- - Al guardar un espejo, la BD copia stock total y stock por capacidad (_variants) del dueño.
-- - Al actualizar el dueño, se propagan stock y stocks por GB a todos los espejos.
-- - mark_order_paid_and_decrement_stock descuenta siempre del dueño si la línea es un espejo.
--
-- Ejecutar en Supabase → SQL (proyecto existente).
-- =============================================================================

alter table public.products
  add column if not exists stock_source_product_id uuid references public.products (id) on delete set null;

alter table public.products
  drop constraint if exists products_stock_source_not_self;

alter table public.products
  add constraint products_stock_source_not_self
  check (stock_source_product_id is null or stock_source_product_id <> id);

create index if not exists idx_products_stock_source
  on public.products (stock_source_product_id)
  where stock_source_product_id is not null;

-- Une stocks por capacidad (gb) del padre al hijo; conserva precios/oldPrice del hijo.
create or replace function public.merge_specs_variants_stock(child_specs jsonb, parent_specs jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  out jsonb;
  child_vars jsonb;
  parent_vars jsonb;
  merged jsonb;
begin
  out := coalesce(child_specs, '{}'::jsonb);
  child_vars := out #> '{_variants}';
  parent_vars := coalesce(parent_specs, '{}'::jsonb) #> '{_variants}';

  if child_vars is null or jsonb_typeof(child_vars) <> 'array' then
    return out;
  end if;

  if parent_vars is null or jsonb_typeof(parent_vars) <> 'array' then
    return out;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_set(
        cv,
        '{stock}',
        to_jsonb(
          coalesce(
            (
              select (pv ->> 'stock')::integer
              from jsonb_array_elements(parent_vars) pv
              where lower(trim(pv ->> 'gb')) = lower(trim(cv ->> 'gb'))
              limit 1
            ),
            0
          )
        ),
        true
      )
    ),
    '[]'::jsonb
  )
  into merged
  from jsonb_array_elements(child_vars) cv;

  return jsonb_set(out, '{_variants}', merged, true);
end;
$$;

create or replace function public.sync_stock_mirrors_for_owner(p_owner_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_row public.products%rowtype;
begin
  select * into owner_row from public.products where id = p_owner_id;
  if not found then
    return;
  end if;

  update public.products c
  set
    stock = owner_row.stock,
    specs = public.merge_specs_variants_stock(c.specs, owner_row.specs),
    published = case
      when owner_row.stock <= 0 then false
      else c.published
    end,
    updated_at = now()
  where c.stock_source_product_id = p_owner_id;
end;
$$;

revoke all on function public.sync_stock_mirrors_for_owner(uuid) from public;

-- Antes de insertar/actualizar un espejo: validar dueño y alinear stock + variantes.
create or replace function public.trg_products_normalize_mirror_stock_biu()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  src public.products%rowtype;
begin
  if new.stock_source_product_id is null then
    return new;
  end if;

  if new.stock_source_product_id = new.id then
    raise exception 'stock_source_product_id no puede ser el mismo id';
  end if;

  if exists (select 1 from public.products c where c.stock_source_product_id = new.id) then
    raise exception 'Este producto ya es dueño de stock de otros listados; no puede depender de otro';
  end if;

  select * into src from public.products where id = new.stock_source_product_id;
  if not found then
    raise exception 'Producto dueño de stock no existe: %', new.stock_source_product_id;
  end if;

  if src.stock_source_product_id is not null then
    raise exception 'El dueño de stock no puede ser otro espejo; elegí el producto canónico';
  end if;

  new.stock := src.stock;
  new.specs := public.merge_specs_variants_stock(coalesce(new.specs, '{}'::jsonb), src.specs);
  return new;
end;
$$;

drop trigger if exists trg_products_normalize_mirror_stock on public.products;
create trigger trg_products_normalize_mirror_stock
before insert or update of stock_source_product_id, stock, specs
on public.products
for each row
when (new.stock_source_product_id is not null)
execute function public.trg_products_normalize_mirror_stock_biu();

-- Tras cambiar stock o specs del dueño, propagar a espejos.
create or replace function public.trg_products_after_owner_stock_specs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.sync_stock_mirrors_for_owner(new.id);
  return new;
end;
$$;

drop trigger if exists trg_products_after_owner_stock_specs on public.products;
create trigger trg_products_after_owner_stock_specs
after update of stock, specs on public.products
for each row
execute function public.trg_products_after_owner_stock_specs();

-- RPC de pedidos: descontar del dueño si la línea apunta a un espejo.
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

comment on column public.products.stock_source_product_id is
  'Si no es null, este listado replica stock (y stocks por GB en specs._variants) del producto indicado.';
