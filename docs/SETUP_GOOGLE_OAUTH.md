# Setup Google OAuth (Supabase)

## 1) Configurar OAuth en Google Cloud

1. Ir a Google Cloud Console > Google Auth Platform > Clients.
2. Crear OAuth Client ID de tipo **Web application**.
3. En Authorized redirect URIs, agregar el callback de Supabase:
   - `https://<PROJECT-REF>.supabase.co/auth/v1/callback`
4. Guardar Client ID y Client Secret.

## 2) Configurar proveedor Google en Supabase

1. Abrir Supabase Dashboard > Authentication > Providers > Google.
2. Activar provider Google.
3. Pegar Client ID y Client Secret.
4. Guardar cambios.

## 3) Configurar Redirect URLs en Supabase

Authentication > URL Configuration:
- Site URL: `http://localhost:8081`
- Redirect URLs permitidas:
  - `exp://127.0.0.1:8081`
  - `exp://localhost:8081`
  - `ruta100://auth/callback`

## 4) Verificacion rapida

1. Ejecutar app Expo.
2. Iniciar login con Google.
3. Confirmar retorno a la app y sesion activa.

## Nota

No uses service role key en la app movil. Solo `anon` key publica.
