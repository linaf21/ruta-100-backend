# Setup Google OAuth (Supabase)

## 1) Crear el cliente OAuth en Google Cloud

1. Ir a Google Cloud Console > Google Auth Platform > Clients.
2. Crear un OAuth Client ID de tipo **Web application**.
3. En **Authorized JavaScript origins** agregar:
   - `http://localhost:3000`
   - `http://localhost:8081`
4. En **Authorized redirect URIs** agregar el callback de Supabase:
   - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
5. Guardar el **Client ID** y **Client Secret**.

## 2) Habilitar Google en Supabase

1. Abrir Supabase Dashboard > Authentication > Providers > Google.
2. Activar el provider.
3. Pegar el Client ID y Client Secret.
4. Guardar.

## 3) Configurar redirect URLs en Supabase

En Authentication > URL Configuration:
- Site URL: `http://localhost:8081`
- Redirect URLs permitidas:
  - `exp://127.0.0.1:8081`
  - `exp://localhost:8081`
  - `ruta100://auth/callback`
  - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`

## 4) Variables necesarias para Expo

En el frontend, usar:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 5) Verificación rápida

1. Correr la app Expo.
2. Iniciar login con Google.
3. Confirmar que vuelve a la app y queda una sesión activa.

## Nota

No uses la `service_role` key en la app móvil. Solo la `anon` key pública.
