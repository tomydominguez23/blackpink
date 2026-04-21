-- Paso 1: funciones RLS (ejecutar solo este archivo)
create or replace function public.is_admin()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = ''admin'')';

create or replace function public.is_staff()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in (''admin'',''seller'',''catalog'',''sales''))';

create or replace function public.is_product_editor()
returns boolean
language sql
stable
as 'select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in (''admin'',''seller'',''catalog''))';

select 1 as paso_1_ok;
