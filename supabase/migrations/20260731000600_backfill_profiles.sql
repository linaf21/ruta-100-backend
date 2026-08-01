-- Backfill profiles for users that may exist in auth.users without a public profile.
insert into public.profiles (id, display_name, avatar_url)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  u.raw_user_meta_data->>'avatar_url'
from auth.users u
where not exists (
  select 1
  from public.profiles p
  where p.id = u.id
);
