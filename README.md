# Ruta 100 Backend (Supabase)

Backend separado para Ruta 100 con:
- PostgreSQL (Supabase)
- Auth con Google (OAuth)
- Row Level Security (RLS)
- Edge Functions para lógica sensible
- Storage para avatares y media

## 1) Requisitos

- Node.js 20+
- Supabase CLI
- Cuenta en Supabase

## 2) Flujo recomendado

1. Crear un proyecto nuevo en Supabase.
2. Copiar `.env.example` a `.env` y completar variables.
3. Iniciar sesión y vincular el proyecto:
   - `npm run supabase:login`
   - `npm run supabase:link`
4. Aplicar migraciones:
   - `npm run db:push`
5. Desplegar funciones:
   - `npm run functions:deploy`

## 3) Auth Google

Seguir la guía en `docs/SETUP_GOOGLE_OAUTH.md`.

## 4) Integración con Expo

Seguir la guía en `docs/EXPO_INTEGRATION.md`.

## 5) Estructura

- `supabase/migrations`: esquema SQL y políticas RLS
- `supabase/functions`: funciones edge
- `docs`: guías operativas
- `database.types.ts`: tipos TypeScript del esquema

## 6) Módulos MVP incluidos

- `profiles`: datos de usuario
- `products`: catálogo básico
- `favorites`: favoritos por usuario
- `visited_places`: lugares visitados
- `badges`: logros básicos
- `avatars` bucket en storage
- Edge functions:
   - `create-visited-entry`
   - `toggle-favorite`
   - `get-my-progress`
   - `upsert-profile`
   - `seed-my-products`

## 7) Funciones disponibles

1. `create-visited-entry` (POST)
- Registra una visita del usuario autenticado.
- Si llega a 5 visitas, intenta otorgar la insignia `explorer_5`.

2. `toggle-favorite` (POST)
- Body: `{ "product_id": "<uuid>" }`
- Agrega o elimina favorito para el usuario autenticado.

3. `get-my-progress` (GET)
- Devuelve resumen del usuario autenticado:
   - visited
   - badges
   - favorites
   - total
   - progress

4. `upsert-profile` (POST/PUT)
- Body opcional:
   - `{ "display_name": "Lina" }`
   - `{ "avatar_url": "https://..." }`
   - o ambos campos
- Actualiza el perfil del usuario autenticado y retorna perfil actualizado.

5. `seed-my-products` (POST)
- Inserta un set de productos demo para el usuario autenticado.
- Idempotente por defecto: si ya tienes productos, no vuelve a insertar.
- Para forzar re-seed: body `{ "force": true }`.

## 8) Costo

Con 1-2 usuarios, el plan free de Supabase es suficiente para iniciar.

## 9) Ejemplos de consumo

- Revisa ejemplos listos con `curl` en `docs/API_EXAMPLES.md`.
