import { NextRequest, NextResponse } from "next/server";
import { verifyMetaSignature, parseInstagramEvent } from "@/lib/meta/verify";
import { sendInstagramText } from "@/lib/meta/sender";
import { runAgent } from "@/lib/agent";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  processInstagramEvent(body).catch(console.error);

  return NextResponse.json({ status: "ok" });
}

async function processInstagramEvent(body: any) {
  const event = parseInstagramEvent(body);
  if (!event) return;

  const supabase = createServiceClient();

  // Identificar tenant por page_id
  const { data: routing } = await supabase
    .from("phone_routing")
    .select("tenant_id, channel_id")
    .eq("page_id", event.pageId)
    .maybeSingle();

  if (!routing) {
    console.warn("No tenant found for page_id:", event.pageId);
    return;
  }

  const { tenant_id, channel_id } = routing;

  const { data: channel } = await supabase
    .from("tenant_channels")
    .select("access_token")
    .eq("id", channel_id)
    .single();

  if (!channel) return;

  // Encontrar o crear contacto por ig_username
  const { data: existing } = await supabase
    .from("contacts")
    .select("id")
    .eq("tenant_id", tenant_id)
    .eq("ig_username", event.senderId)
    .maybeSingle();

  let contactId: string;
  if (existing) {
    contactId = existing.id;
  } else {
    const { data: created } = await supabase
      .from("contacts")
      .insert({ tenant_id, ig_username: event.senderId })
      .select("id")
      .single();
    if (!created) return;
    contactId = created.id;
  }

  // Encontrar o crear conversación
  const { data: convExisting } = await supabase
    .from("conversations")
    .select("id, ai_handling")
    .eq("tenant_id", tenant_id)
    .eq("contact_id", contactId)
    .eq("channel_type", "instagram")
    .eq("status", "open")
    .maybeSingle();

  let conversation = convExisting;
  if (!conversation) {
    const { data: created } = await supabase
      .from("conversations")
      .insert({
        tenant_id,
        contact_id: contactId,
        channel_type: "instagram",
        channel_id,
      })
      .select("id, ai_handling")
      .single();
    if (!created) return;
    conversation = created;
  }

  if (!conversation!.ai_handling) return;

  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id,
    role: "user",
    content: event.text,
    meta_message_id: event.messageId,
  });

  const { reply, shouldEscalate } = await runAgent({
    tenantId: tenant_id,
    conversationId: conversation.id,
    userMessage: event.text,
  });

  await sendInstagramText(event.senderId, reply, channel.access_token);

  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id,
    role: "assistant",
    content: reply,
  });

  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      ...(shouldEscalate && { ai_handling: false }),
    })
    .eq("id", conversation.id);
}
