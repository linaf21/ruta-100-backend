import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

type Payload = {
  display_name?: string;
  avatar_url?: string;
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST' && req.method !== 'PUT') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const jwt = authHeader.replace('Bearer ', '').trim();
    const {
      data: { user },
      error: userError,
    } = await admin.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as Payload;

    const displayName = body.display_name?.trim();
    const avatarUrl = body.avatar_url?.trim();

    if (displayName && displayName.length > 60) {
      return new Response(JSON.stringify({ error: 'display_name too long (max 60)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (avatarUrl && avatarUrl.length > 500) {
      return new Response(JSON.stringify({ error: 'avatar_url too long (max 500)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates: Record<string, string> = {};

    if (displayName !== undefined) updates.display_name = displayName;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: 'Nothing to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await admin
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, display_name, avatar_url, updated_at')
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, profile: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
