import crypto from "crypto";
import type {
  MetaWebhookBody,
  ParsedWhatsAppEvent,
  ParsedInstagramEvent,
} from "./types";

export function verifyMetaSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", process.env.META_APP_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace("sha256=", "")),
    Buffer.from(expected)
  );
}

export function parseWhatsAppEvent(
  body: MetaWebhookBody
): ParsedWhatsAppEvent | null {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    if (!message || message.type !== "text") return null;

    return {
      phoneNumberId: change.metadata.phone_number_id,
      from: message.from,
      messageId: message.id,
      text: message.text?.body ?? "",
      contactName: change.contacts?.[0]?.profile.name ?? "",
      timestamp: message.timestamp,
    };
  } catch {
    return null;
  }
}

export function parseInstagramEvent(
  body: MetaWebhookBody
): ParsedInstagramEvent | null {
  try {
    const entry = body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    if (!messaging?.message?.text) return null;

    return {
      pageId: entry.id,
      senderId: messaging.sender.id,
      messageId: messaging.message.mid,
      text: messaging.message.text,
      timestamp: messaging.timestamp,
    };
  } catch {
    return null;
  }
}
