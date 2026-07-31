import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const demoProducts = [
  {
    name: 'Monserrate Viewpoint',
    description: 'High altitude city viewpoint with walking trails.',
    image_url: 'https://images.unsplash.com/photo-1470004914212-05527e49370b',
  },
  {
    name: 'Historic Downtown Walk',
    description: 'Guided route around classic architecture landmarks.',
    image_url: 'https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b',
  },
  {
    name: 'Coffee Tasting Experience',
    description: 'Local coffee workshop with tasting flight.',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
  },
  {
    name: 'Street Art Route',
    description: 'Urban mural exploration in creative neighborhoods.',
    image_url: 'https://images.unsplash.com/photo-1470163395405-d2b80e7450ed',
  },
  {
    name: 'Night Market Food Tour',
    description: 'Popular local snacks and artisan food stands.',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
  },
];

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
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

    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;

    if (!force) {
      const { count, error: countError } = await admin
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      if (countError) {
        return new Response(JSON.stringify({ error: countError.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if ((count ?? 0) > 0) {
        return new Response(
          JSON.stringify({
            ok: true,
            seeded: false,
            reason: 'user already has products',
            existing_count: count,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    }

    const rows = demoProducts.map((item) => ({
      owner_id: user.id,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
    }));

    const { data, error } = await admin
      .from('products')
      .insert(rows)
      .select('id, name, created_at');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        seeded: true,
        inserted_count: data?.length ?? 0,
        products: data ?? [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
