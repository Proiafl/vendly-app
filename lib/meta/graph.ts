const GRAPH_URL = "https://graph.facebook.com/v20.0";

export async function exchangeCodeForToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    code,
  });

  const res = await fetch(`${GRAPH_URL}/oauth/access_token?${params}`);
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: shortToken,
  });

  const res = await fetch(`${GRAPH_URL}/oauth/access_token?${params}`);
  if (!res.ok) throw new Error(`Long-lived token failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

export interface WhatsAppAccount {
  phoneNumberId: string;
  phoneNumber: string;
  wabaId: string;
}

export async function getWhatsAppAccounts(
  token: string
): Promise<WhatsAppAccount[]> {
  const res = await fetch(
    `${GRAPH_URL}/me/businesses?fields=owned_whatsapp_business_accounts{phone_numbers{id,display_phone_number}}&access_token=${token}`
  );
  const data = await res.json();

  const accounts: WhatsAppAccount[] = [];
  for (const biz of data.data ?? []) {
    for (const waba of biz.owned_whatsapp_business_accounts?.data ?? []) {
      for (const phone of waba.phone_numbers?.data ?? []) {
        accounts.push({
          phoneNumberId: phone.id,
          phoneNumber: phone.display_phone_number,
          wabaId: waba.id,
        });
      }
    }
  }
  return accounts;
}

export interface InstagramAccount {
  pageId: string;
  igUserId: string;
  name: string;
}

export async function getInstagramAccounts(
  token: string
): Promise<InstagramAccount[]> {
  const res = await fetch(
    `${GRAPH_URL}/me/accounts?fields=id,name,instagram_business_account&access_token=${token}`
  );
  const data = await res.json();

  return (data.data ?? [])
    .filter((p: any) => p.instagram_business_account)
    .map((p: any) => ({
      pageId: p.id,
      igUserId: p.instagram_business_account.id,
      name: p.name,
    }));
}

export async function subscribePageToWebhook(
  pageId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${GRAPH_URL}/${pageId}/subscribed_apps`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscribed_fields: ["messages"] }),
  });
  if (!res.ok) throw new Error(`Webhook subscribe failed: ${await res.text()}`);
}
