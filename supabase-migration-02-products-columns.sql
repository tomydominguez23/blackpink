-- Paso 2: perfiles + columnas products (ejecutar despues del paso 1)
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'seller', 'catalog', 'sales'));

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

select 1 as paso_2_ok;
