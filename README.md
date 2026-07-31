# Ruta 100 Backend (Supabase)

Backend separado para Ruta 100 con:
- PostgreSQL (Supabase)
- Auth con Google (OAuth)
- Row Level Security (RLS)
- Edge Functions para logica sensible

## 1) Requisitos

- Node.js 20+
- Supabase CLI
- Cuenta en Supabase

## 2) Flujo recomendado

1. Crear un proyecto nuevo en Supabase.
2. Copiar `.env.example` a `.env` y completar variables.
3. Login y link:
   - `npm run supabase:login`
   - `npm run supabase:link`
4. Aplicar migraciones:
   - `npm run db:push`
5. Desplegar funciones:
   - `npm run functions:deploy`

## 3) Auth Google

Seguir la guia en `docs/SETUP_GOOGLE_OAUTH.md`.

## 4) Integracion con Expo

Seguir la guia en `docs/EXPO_INTEGRATION.md`.

## 5) Estructura

- `supabase/migrations`: esquema SQL y politicas RLS
- `supabase/functions`: funciones edge
- `docs`: guias operativas

## 6) Costo

Con 1-2 usuarios, el plan free de Supabase es suficiente para iniciar.
