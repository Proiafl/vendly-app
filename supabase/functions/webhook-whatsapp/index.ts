import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { verifyMetaSignature, parseWhatsAppEvent, sendWhatsAppText, markWhatsAppRead } from "../_shared/meta.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { runAgent } from "../_shared/agent.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  // GET: Meta webhook verification
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === Deno.env.get("META_WEBHOOK_VERIFY_TOKEN")) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // POST: incoming message
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // Responde 200 inmediatamente, procesa en background
  EdgeRuntime.waitUntil(processEvent(body));

  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

async function processEvent(body: any) {
  const event = parseWhatsAppEvent(body);
  if (!event) return;

  const supabase = getServiceClient();

  const { data: routing } = await supabase
    .from("phone_routing")
    .select("tenant_id, channel_id")
    .eq("phone_number_id", event.phoneNumberId)
    .maybeSingle();

  if (!routing) return;

  const { tenant_id, channel_id } = routing;

  const { data: channel } = await supabase
    .from("tenant_channels")
    .select("access_token")
    .eq("id", channel_id)
    .single();

  if (!channel) return;

  await markWhatsAppRead(event.phoneNumberId, event.messageId, channel.access_token);

  // Upsert contacto
  const { data: existing } = await supabase
    .from("contacts")
    .select("id")
    .eq("tenant_id", tenant_id)
    .eq("phone", event.from)
    .maybeSingle();

  let contactId: string;
  if (existing) {
    contactId = existing.id;
  } else {
    const { data: created } = await supabase
      .from("contacts")
      .insert({ tenant_id, phone: event.from, name: event.contactName })
      .select("id")
      .single();
    if (!created) return;
    contactId = created.id;
  }

  // Upsert conversacion
  const { data: convExisting } = await supabase
    .from("conversations")
    .select("id, ai_handling")
    .eq("tenant_id", tenant_id)
    .eq("contact_id", contactId)
    .eq("channel_type", "whatsapp")
    .eq("status", "open")
    .maybeSingle();

  let conversation = convExisting;
  if (!conversation) {
    const { data: created } = await supabase
      .from("conversations")
      .insert({ tenant_id, contact_id: contactId, channel_type: "whatsapp", channel_id })
      .select("id, ai_handling")
      .single();
    if (!created) return;
    conversation = created;
  }

  if (!conversation.ai_handling) return;

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

  await sendWhatsAppText(event.phoneNumberId, event.from, reply, channel.access_token);

  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id,
    role: "assistant",
    content: reply,
  });

  await supabase.from("conversations").update({
    last_message_at: new Date().toISOString(),
    ...(shouldEscalate && { ai_handling: false }),
  }).eq("id", conversation.id);
}
