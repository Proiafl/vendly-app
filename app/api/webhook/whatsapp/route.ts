import { NextRequest, NextResponse } from "next/server";
import { verifyMetaSignature, parseWhatsAppEvent } from "@/lib/meta/verify";
import { sendWhatsAppText, markWhatsAppRead } from "@/lib/meta/sender";
import { runAgent } from "@/lib/agent";
import { createServiceClient } from "@/lib/supabase/server";

// Verificación del webhook (GET)
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

// Recepción de mensajes (POST)
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Responder 200 inmediatamente para evitar retries de Meta
  const body = JSON.parse(rawBody);
  processWhatsAppEvent(body).catch(console.error);

  return NextResponse.json({ status: "ok" });
}

async function processWhatsAppEvent(body: any) {
  const event = parseWhatsAppEvent(body);
  if (!event) return;

  const supabase = createServiceClient();

  // Identificar tenant por phone_number_id
  const { data: routing } = await supabase
    .from("phone_routing")
    .select("tenant_id, channel_id")
    .eq("phone_number_id", event.phoneNumberId)
    .maybeSingle();

  if (!routing) {
    console.warn("No tenant found for phone_number_id:", event.phoneNumberId);
    return;
  }

  const { tenant_id, channel_id } = routing;

  // Obtener access_token del canal
  const { data: channel } = await supabase
    .from("tenant_channels")
    .select("access_token")
    .eq("id", channel_id)
    .single();

  if (!channel) return;

  // Marcar mensaje como leído
  await markWhatsAppRead(event.phoneNumberId, event.messageId, channel.access_token);

  // Encontrar o crear contacto
  const contact = await upsertContact(supabase, tenant_id, {
    phone: event.from,
    name: event.contactName,
  });

  // Encontrar o crear conversación
  const conversation = await upsertConversation(supabase, {
    tenant_id,
    contact_id: contact.id,
    channel_type: "whatsapp",
    channel_id,
  });

  // Si la IA no está manejando esta conversación, salir
  if (!conversation.ai_handling) return;

  // Guardar mensaje del usuario
  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id,
    role: "user",
    content: event.text,
    meta_message_id: event.messageId,
  });

  // Correr agente IA
  const { reply, shouldEscalate } = await runAgent({
    tenantId: tenant_id,
    conversationId: conversation.id,
    userMessage: event.text,
  });

  // Enviar respuesta
  await sendWhatsAppText(event.phoneNumberId, event.from, reply, channel.access_token);

  // Guardar respuesta del asistente
  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id,
    role: "assistant",
    content: reply,
  });

  // Actualizar last_message_at
  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      ...(shouldEscalate && { ai_handling: false }),
    })
    .eq("id", conversation.id);
}

async function upsertContact(
  supabase: any,
  tenantId: string,
  data: { phone: string; name: string }
) {
  const { data: existing } = await supabase
    .from("contacts")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("phone", data.phone)
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("contacts")
    .insert({ tenant_id: tenantId, phone: data.phone, name: data.name })
    .select("id")
    .single();

  return created;
}

async function upsertConversation(
  supabase: any,
  data: {
    tenant_id: string;
    contact_id: string;
    channel_type: string;
    channel_id: string;
  }
) {
  const { data: existing } = await supabase
    .from("conversations")
    .select("id, ai_handling")
    .eq("tenant_id", data.tenant_id)
    .eq("contact_id", data.contact_id)
    .eq("channel_type", data.channel_type)
    .eq("status", "open")
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("conversations")
    .insert({
      tenant_id: data.tenant_id,
      contact_id: data.contact_id,
      channel_type: data.channel_type,
      channel_id: data.channel_id,
    })
    .select("id, ai_handling")
    .single();

  return created;
}
