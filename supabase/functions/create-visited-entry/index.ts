import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const jwt = authHeader.replace("Bearer ", "").trim();
    const {
      data: { user },
      error: userError,
    } = await admin.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid user token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { place_name, place_description, latitude, longitude } = body;

    if (!place_name || typeof place_name !== "string") {
      return new Response(JSON.stringify({ error: "place_name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await admin.from("visited_places").insert({
      user_id: user.id,
      place_name,
      place_description: place_description ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { count, error: countError } = await admin
      .from("visited_places")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      return new Response(JSON.stringify({ error: countError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const totalVisited = count ?? 0;

    if (totalVisited >= 5) {
      await admin.from("badges").upsert(
        {
          user_id: user.id,
          code: "explorer_5",
          title: "Explorer",
          description: "Visited at least 5 places",
        },
        { onConflict: "user_id,code" }
      );
    }

    return new Response(JSON.stringify({ ok: true, total_visited: totalVisited }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
