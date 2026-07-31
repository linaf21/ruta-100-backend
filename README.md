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
- Edge function `create-visited-entry`

## 7) Costo

Con 1-2 usuarios, el plan free de Supabase es suficiente para iniciar.
