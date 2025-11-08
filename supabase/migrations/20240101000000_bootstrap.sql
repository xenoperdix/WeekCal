set check_function_bodies = off;

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.food_items (
  id bigserial primary key,
  source text not null default 'local',
  name text not null,
  brand text,
  barcode text,
  nutrients_per_100g jsonb not null default '{}'::jsonb,
  default_serving_g numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  method_md text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_items (
  id bigserial primary key,
  recipe_id bigint not null references public.recipes(id) on delete cascade,
  food_item_id bigint not null references public.food_items(id) on delete restrict,
  grams numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diary_entries (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  occurred_at timestamptz not null,
  food_item_id bigint references public.food_items(id) on delete set null,
  recipe_id bigint references public.recipes(id) on delete set null,
  grams numeric not null,
  nutrients_cache jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.targets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  kcal integer,
  protein_g integer,
  carbs_g integer,
  fat_g integer,
  fibre_g integer,
  sodium_mg integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  weekly_kcal integer not null default 14000,
  start_of_week text not null default 'monday',
  carryover_enabled boolean not null default true,
  carryover_cap_kcal integer not null default 2000,
  protein_floor_g integer not null default 120,
  fibre_floor_g integer not null default 25,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_on date not null,
  weight_kg numeric not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.food_items
  alter column updated_at set default now();

alter table public.recipes
  alter column updated_at set default now();

alter table public.recipe_items
  alter column updated_at set default now();

alter table public.diary_entries
  alter column updated_at set default now();

alter table public.targets
  alter column updated_at set default now();

alter table public.weekly_settings
  alter column updated_at set default now();

alter table public.weight_logs
  alter column updated_at set default now();

create index if not exists diary_entries_user_occurred_idx on public.diary_entries(user_id, occurred_at desc);
create index if not exists weight_logs_user_measured_idx on public.weight_logs(user_id, measured_on);

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_items enable row level security;
alter table public.diary_entries enable row level security;
alter table public.targets enable row level security;
alter table public.weekly_settings enable row level security;
alter table public.weight_logs enable row level security;
alter table public.food_items enable row level security;

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own recipes" on public.recipes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own diary" on public.diary_entries
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own targets" on public.targets
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own weekly settings" on public.weekly_settings
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own weight logs" on public.weight_logs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage recipe items" on public.recipe_items
  for all using (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_items.recipe_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_items.recipe_id and r.user_id = auth.uid()
    )
  );

create policy "Public read food items" on public.food_items
  for select using (true);

create policy "Service manage food items" on public.food_items
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create view public.v_daily_floors as
select
  user_id,
  (timezone('Europe/London', occurred_at))::date as day,
  sum(coalesce((nutrients_cache ->> 'protein_g')::numeric, 0)) as protein_g,
  sum(coalesce((nutrients_cache ->> 'fibre_g')::numeric, 0)) as fibre_g
from public.diary_entries
where occurred_at is not null
group by user_id, (timezone('Europe/London', occurred_at))::date;

create view public.v_weekly_intake as
select
  user_id,
  date_trunc('week', timezone('Europe/London', occurred_at))::date as week_start,
  sum(coalesce((nutrients_cache ->> 'kcal')::numeric, 0)) as kcal_total,
  sum(coalesce((nutrients_cache ->> 'protein_g')::numeric, 0)) as protein_g_total,
  sum(coalesce((nutrients_cache ->> 'fibre_g')::numeric, 0)) as fibre_g_total
from public.diary_entries
where occurred_at is not null
group by user_id, date_trunc('week', timezone('Europe/London', occurred_at))::date;

create view public.v_rolling7_intake as
with daily as (
  select
    user_id,
    (timezone('Europe/London', occurred_at))::date as day,
    sum(coalesce((nutrients_cache ->> 'kcal')::numeric, 0)) as kcal
  from public.diary_entries
  where occurred_at is not null
  group by user_id, (timezone('Europe/London', occurred_at))::date
)
select
  user_id,
  day as anchor_day,
  sum(kcal) over (
    partition by user_id
    order by day
    rows between 6 preceding and current row
  ) as kcal_rolling7
from daily;
