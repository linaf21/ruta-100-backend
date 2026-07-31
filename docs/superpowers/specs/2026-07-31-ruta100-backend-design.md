# Ruta 100 Backend Design (MVP)

## Goal

Crear un backend gratuito, personal y compartible para 1-2 usuarios adicionales, con inicio de sesion real por usuario usando Gmail.

## Recommended Architecture

- Supabase como backend administrado.
- PostgreSQL como base de datos principal.
- Supabase Auth con Google OAuth.
- RLS en todas las tablas para aislamiento por usuario.
- Edge Functions para logica sensible.
- Expo app como cliente movil.

## Core Components

1. Auth:
- Login con Google.
- Sesion persistente en cliente.

2. Data:
- profiles
- products
- favorites
- visited_places
- badges

3. Security:
- Politicas RLS por `auth.uid()`.
- Bloqueo de service_role en cliente.

4. Functions:
- `create-visited-entry` para registrar visita y otorgar badges basicos.

## Data Flow

1. Usuario inicia OAuth con Google en Expo.
2. Supabase devuelve tokens por deep link.
3. Cliente setea sesion.
4. Cliente realiza CRUD permitido por RLS.
5. Logica sensible se ejecuta en Edge Functions.

## Error Handling

- Errores de OAuth: fallback a reintento de login.
- Errores de DB: mensajes de UI + log tecnico.
- Conflictos de datos: constraints en DB (ejemplo: favorites unicos).

## Free Deployment Plan

1. Supabase free tier para DB/Auth/Storage/Functions.
2. Repo separado de backend con migraciones SQL versionadas.
3. Frontend Expo con EAS Update para distribuir a testers.

## Testing Strategy

- Pruebas manuales de login/logout.
- Verificacion de aislamiento RLS con dos cuentas.
- Prueba de insercion en favorites y visited_places.
- Prueba de edge function para entrega de badge.

## Scope Boundaries

Incluye:
- Backend base funcional
- Google login
- Seguridad por usuario

No incluye (fase posterior):
- Observabilidad avanzada
- Jobs programados
- Backoffice administrativo
