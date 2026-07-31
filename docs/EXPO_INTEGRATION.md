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

```ts
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = makeRedirectUri({ scheme: 'ruta100' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === 'success') {
    const url = result.url;
    const params = new URL(url).searchParams;
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token });
    }
  }
}
```

## 4) Deep links

Configurar listener para links entrantes y completar sesión si llega por URL.

## 5) Seguridad

- Nunca exponer `service_role`.
- Confiar en RLS para aislar datos por usuario.
