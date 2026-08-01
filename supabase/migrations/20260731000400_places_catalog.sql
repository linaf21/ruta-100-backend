-- Global catalog of places (shared for all users)
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  department text not null,
  region text,
  category text,
  description text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  image_url text,
  source_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_places_department on public.places (department);
create index if not exists idx_places_category on public.places (category);
create index if not exists idx_places_is_active on public.places (is_active);

alter table public.places enable row level security;

create policy "places_select_all"
on public.places
for select
using (true);

create or replace trigger trg_places_updated_at
before update on public.places
for each row
execute function public.set_updated_at();

-- Link user visits to canonical places when available
alter table public.visited_places
add column if not exists place_id uuid references public.places(id) on delete set null;

create index if not exists idx_visited_places_place_id on public.visited_places (place_id);
