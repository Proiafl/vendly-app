import { createHmac, timingSafeEqual } from "node:crypto";

// ── Webhook verification ──────────────────────────────────────────────────────

export function verifyMetaSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = Deno.env.get("META_APP_SECRET")!;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// ── Webhook parsers ───────────────────────────────────────────────────────────

export function parseWhatsAppEvent(body: any) {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const msg = change?.value?.messages?.[0];
    if (!msg || msg.type !== "text") return null;
    return {
      phoneNumberId: change.value.metadata.phone_number_id as string,
      from: msg.from as string,
      text: msg.text.body as string,
      messageId: msg.id as string,
      contactName: change.value.contacts?.[0]?.profile?.name ?? "Cliente",
    };
  } catch {
    return null;
  }
}

export function parseInstagramEvent(body: any) {
  try {
    const entry = body.entry?.[0];
    const msg = entry?.messaging?.[0];
    if (!msg?.message?.text) return null;
    return {
      pageId: entry.id as string,
      senderId: msg.sender.id as string,
      text: msg.message.text as string,
      messageId: msg.message.mid as string,
    };
  } catch {
    return null;
  }
}

// ── Message senders ───────────────────────────────────────────────────────────

export async function sendWhatsAppText(
  phoneNumberId: string, to: string, text: string, token: string
) {
  await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } }),
  });
}

export async function markWhatsAppRead(phoneNumberId: string, messageId: string, token: string) {
  await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: messageId }),
  });
}

export async function sendInstagramText(recipientId: string, text: string, token: string) {
  await fetch(`https://graph.facebook.com/v20.0/me/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ recipient: { id: recipientId }, message: { text } }),
  });
}

// ── OAuth helpers ─────────────────────────────────────────────────────────────

export async function exchangeCodeForToken(code: string): Promise<string> {
  const appId = Deno.env.get("META_APP_ID")!;
  const appSecret = Deno.env.get("META_APP_SECRET")!;
  const redirectUri = Deno.env.get("META_REDIRECT_URI")!;
  const url = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.access_token) throw new Error(data.error?.message ?? "Token exchange failed");
  return data.access_token;
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const appId = Deno.env.get("META_APP_ID")!;
  const appSecret = Deno.env.get("META_APP_SECRET")!;
  const url = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.access_token) throw new Error("Long-lived token exchange failed");
  return data.access_token;
}

export async function getWhatsAppAccounts(token: string) {
  const res = await fetch(
    `https://graph.facebook.com/v20.0/me/businesses?fields=owned_whatsapp_business_accounts{phone_numbers{id,display_phone_number,verified_name}}&access_token=${token}`
  );
  const data = await res.json();
  const accounts: Array<{ phoneNumberId: string; phoneNumber: string; wabaId: string }> = [];
  for (const biz of data.data ?? []) {
    for (const waba of biz.owned_whatsapp_business_accounts?.data ?? []) {
      for (const phone of waba.phone_numbers?.data ?? []) {
        accounts.push({ phoneNumberId: phone.id, phoneNumber: phone.display_phone_number, wabaId: waba.id });
      }
    }
  }
  return accounts;
}

export async function getInstagramAccounts(token: string) {
  const res = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?fields=instagram_business_account{id},id,name&access_token=${token}`
  );
  const data = await res.json();
  const accounts: Array<{ pageId: string; igUserId: string }> = [];
  for (const page of data.data ?? []) {
    if (page.instagram_business_account) {
      accounts.push({ pageId: page.id, igUserId: page.instagram_business_account.id });
    }
  }
  return accounts;
}

export async function subscribePageToWebhook(pageId: string, token: string) {
  await fetch(`https://graph.facebook.com/v20.0/${pageId}/subscribed_apps`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ subscribed_fields: ["messages"] }),
  });
}
