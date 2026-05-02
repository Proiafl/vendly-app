import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";

// PATCH /api/agent — actualizar config del agente (nombre, tono, contexto)
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return NextResponse.json({ error: "No tenant" }, { status: 403 });

  const body = await req.json();
  const allowed = ["agent_name", "agent_tone", "business_context"] as const;
  const update: Record<string, string> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  const { data, error } = await supabase
    .from("tenants")
    .update(update)
    .eq("id", membership.tenant_id)
    .select("agent_name, agent_tone, business_context")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tenant: data });
}
