import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Obtener tenant del usuario
  const { data: membership } = await userClient
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return Response.json({ error: "No tenant" }, { status: 403 });
  const tenantId = membership.tenant_id;

  // GET: listar chunks
  if (req.method === "GET") {
    const { data } = await userClient
      .from("knowledge_chunks")
      .select("id, content, source, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    return Response.json({ chunks: data ?? [] }, { headers: corsHeaders });
  }

  // POST: crear chunk con embedding
  if (req.method === "POST") {
    const { content, source = "manual" } = await req.json();
    if (!content?.trim()) return Response.json({ error: "content required" }, { status: 400 });

    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
    const embRes = await openai.embeddings.create({ model: "text-embedding-3-small", input: content });
    const embedding = embRes.data[0].embedding;

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await adminClient
      .from("knowledge_chunks")
      .insert({ tenant_id: tenantId, content, embedding, source })
      .select("id, content, source, created_at")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
    return Response.json({ chunk: data }, { headers: corsHeaders });
  }

  // DELETE: eliminar chunk
  if (req.method === "DELETE") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    await userClient.from("knowledge_chunks").delete().eq("id", id).eq("tenant_id", tenantId);
    return Response.json({ ok: true }, { headers: corsHeaders });
  }

  return new Response("Method not allowed", { status: 405 });
});
