create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories(user_id);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  month varchar(7) not null check (month ~ '^\d{4}-\d{2}$'),
  limit_amount numeric(12,2) not null check (limit_amount > 0),
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, month, category_id)
);

create index if not exists budgets_user_id_idx on public.budgets(user_id);
create index if not exists budgets_month_idx on public.budgets(month);
create index if not exists budgets_category_id_idx on public.budgets(category_id);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  budget_id uuid not null references public.budgets(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  description text not null,
  month varchar(7) not null check (month ~ '^\d{4}-\d{2}$'),
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_id_idx on public.expenses(user_id);
create index if not exists expenses_month_idx on public.expenses(month);
create index if not exists expenses_user_month_idx on public.expenses(user_id, month);
create index if not exists expenses_category_id_idx on public.expenses(category_id);