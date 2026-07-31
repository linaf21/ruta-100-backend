# Backend Roadmap (Next Steps)

## Done

- Base schema with RLS (`profiles`, `products`, `favorites`, `visited_places`, `badges`)
- Storage bucket `avatars` with ownership policy
- Edge function `create-visited-entry`
- RPC function `toggle_favorite(p_product_id uuid)`
- RPC function `get_my_progress()`
- Edge function `toggle-favorite`
- Edge function `get-my-progress`
- Edge function `upsert-profile`

## Next suggested work

1. Add product seed migration with demo rows and ownership strategy.
2. Add profile avatar upload flow (signed upload + profile update integration).
3. Add badge unlock rules table (config-driven instead of hardcoded threshold).
4. Add idempotency key handling in write operations.
5. Add simple API contract tests for edge functions.
6. Add a minimal audit table for critical actions.

## Deployment checklist

1. `npm run supabase:login`
2. `npm run supabase:link`
3. `npm run db:push`
4. `npm run functions:deploy:all`
5. Validate in Supabase Dashboard:
   - RLS enabled on all public tables
   - Policies created
   - Functions deployed and responding
