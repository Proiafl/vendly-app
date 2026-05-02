import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getServiceClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user already has a tenant
  const { data: existing } = await userClient
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return Response.json({ tenantId: existing.tenant_id }, { headers: corsHeaders });
  }

  const { name } = await req.json();
  if (!name?.trim()) return Response.json({ error: "name required" }, { status: 400 });

  const admin = getServiceClient();

  const { data: tenant, error: tErr } = await admin
    .from("tenants")
    .insert({ name: name.trim() })
    .select("id")
    .single();

  if (tErr) return Response.json({ error: tErr.message }, { status: 500, headers: corsHeaders });

  const { error: mErr } = await admin
    .from("tenant_users")
    .insert({ tenant_id: tenant.id, user_id: user.id, role: "owner" });

  if (mErr) return Response.json({ error: mErr.message }, { status: 500, headers: corsHeaders });

  return Response.json({ tenantId: tenant.id }, { headers: corsHeaders });
});
