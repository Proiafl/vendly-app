import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import OpenAI from "openai";
import { createClient, createServiceClient } from "@/lib/supabase/server";


async function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function getTenantId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.tenant_id ?? null;
}

// GET /api/knowledge — listar chunks del tenant
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getTenantId(supabase, user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 403 });

  const { data, error } = await supabase
    .from("knowledge_chunks")
    .select("id, content, source, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ chunks: data });
}

// POST /api/knowledge — crear chunk con embedding
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getTenantId(supabase, user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 403 });

  const { content, source } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "content required" }, { status: 400 });

  const openai = await getOpenAI();
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: content.trim(),
  });

  const svc = createServiceClient();
  const { data, error } = await svc
    .from("knowledge_chunks")
    .insert({
      tenant_id: tenantId,
      content: content.trim(),
      source: source ?? "manual",
      embedding: embeddingRes.data[0].embedding,
    })
    .select("id, content, source, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ chunk: data }, { status: 201 });
}

// DELETE /api/knowledge?id=xxx
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantId = await getTenantId(supabase, user.id);
  if (!tenantId) return NextResponse.json({ error: "No tenant" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("knowledge_chunks")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
