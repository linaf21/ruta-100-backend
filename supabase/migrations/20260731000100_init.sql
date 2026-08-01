-- Extensions
create extension if not exists pgcrypto;

-- Profiles: one row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products catalog scoped by owner for MVP
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Favorites per user
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

-- Visited places per user
create table if not exists public.visited_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_name text not null,
  place_description text,
  latitude double precision,
  longitude double precision,
  visited_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Badges achieved by user
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique(user_id, code)
);

-- Auto update timestamp helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger on profiles and products
create or replace trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- Create profile after sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.favorites enable row level security;
alter table public.visited_places enable row level security;
alter table public.badges enable row level security;

-- Profiles policies
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Products policies
create policy "products_select_authenticated"
on public.products
for select
to authenticated
using (true);

create policy "products_insert_own"
on public.products
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "products_update_own"
on public.products
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "products_delete_own"
on public.products
for delete
to authenticated
using (auth.uid() = owner_id);

-- Favorites policies
create policy "favorites_select_own"
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "favorites_insert_own"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "favorites_delete_own"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);

-- Visited places policies
create policy "visited_select_own"
on public.visited_places
for select
to authenticated
using (auth.uid() = user_id);

create policy "visited_insert_own"
on public.visited_places
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "visited_update_own"
on public.visited_places
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "visited_delete_own"
on public.visited_places
for delete
to authenticated
using (auth.uid() = user_id);

-- Badges policies
create policy "badges_select_own"
on public.badges
for select
to authenticated
using (auth.uid() = user_id);

create policy "badges_insert_own"
on public.badges
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "badges_update_own"
on public.badges
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "badges_delete_own"
on public.badges
for delete
to authenticated
using (auth.uid() = user_id);
