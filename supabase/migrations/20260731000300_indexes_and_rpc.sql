-- Performance indexes
create index if not exists idx_products_owner_id on public.products (owner_id);
create index if not exists idx_favorites_user_id on public.favorites (user_id);
create index if not exists idx_favorites_product_id on public.favorites (product_id);
create index if not exists idx_visited_places_user_id on public.visited_places (user_id);
create index if not exists idx_badges_user_id on public.badges (user_id);

-- Toggle favorite for current authenticated user
create or replace function public.toggle_favorite(p_product_id uuid)
returns table (favorited boolean, favorite_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_existing_id uuid;
  v_new_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select id
  into v_existing_id
  from public.favorites
  where user_id = v_user_id
    and product_id = p_product_id
  limit 1;

  if v_existing_id is not null then
    delete from public.favorites where id = v_existing_id;
    return query select false, null::uuid;
  else
    insert into public.favorites (user_id, product_id)
    values (v_user_id, p_product_id)
    returning id into v_new_id;

    return query select true, v_new_id;
  end if;
end;
$$;

-- Get app progress summary for current authenticated user
create or replace function public.get_my_progress()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_visited_count int;
  v_badges_count int;
  v_favorites_count int;
  v_total_experiences int := 100;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select count(*)::int into v_visited_count
  from public.visited_places
  where user_id = v_user_id;

  select count(*)::int into v_badges_count
  from public.badges
  where user_id = v_user_id;

  select count(*)::int into v_favorites_count
  from public.favorites
  where user_id = v_user_id;

  return jsonb_build_object(
    'visited', v_visited_count,
    'badges', v_badges_count,
    'favorites', v_favorites_count,
    'total', v_total_experiences,
    'progress', case
      when v_total_experiences = 0 then 0
      else round((v_visited_count::numeric / v_total_experiences::numeric) * 100)
    end
  );
end;
$$;

grant execute on function public.toggle_favorite(uuid) to authenticated;
grant execute on function public.get_my_progress() to authenticated;
