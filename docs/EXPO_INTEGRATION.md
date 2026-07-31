# Expo Integration Guide

## 1) Variables en app Expo

Agregar en `.env` del frontend:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 2) Scheme en app.json

Asegurar:

```json
{
  "expo": {
    "scheme": "ruta100"
  }
}
```

## 3) Flujo OAuth recomendado

1. Generar redirect URI con `makeRedirectUri`.
2. Llamar `supabase.auth.signInWithOAuth` con:
   - `provider: "google"`
   - `options.redirectTo`
   - `options.skipBrowserRedirect: true`
3. Abrir `openAuthSessionAsync`.
4. En retorno, extraer `access_token` y `refresh_token`.
5. Guardar sesion con `supabase.auth.setSession`.

## 4) Deep links

Configurar listener para links entrantes y completar sesion si llega por URL.

## 5) Seguridad

- Nunca exponer `service_role`.
- Confiar en RLS para aislar datos por usuario.
