# API Examples (Edge Functions)

Set these env vars first:

```bash
export SUPABASE_PROJECT_REF="YOUR_PROJECT_REF"
export SUPABASE_ACCESS_TOKEN="USER_JWT_ACCESS_TOKEN"
```

Base URL:

```bash
https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1
```

## 1) create-visited-entry

```bash
curl -X POST "https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/create-visited-entry" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "place_name": "Museo del Oro",
    "place_description": "Centro histórico",
    "latitude": 4.6019,
    "longitude": -74.0721
  }'
```

## 2) toggle-favorite

```bash
curl -X POST "https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/toggle-favorite" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "00000000-0000-0000-0000-000000000000"
  }'
```

## 3) get-my-progress

```bash
curl "https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/get-my-progress" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
```

## 4) upsert-profile

```bash
curl -X POST "https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/upsert-profile" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Lina Franco",
    "avatar_url": "https://example.com/avatar.jpg"
  }'
```

