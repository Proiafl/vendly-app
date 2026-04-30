const GRAPH_URL = "https://graph.facebook.com/v20.0";

async function graphPost(path: string, token: string, body: object) {
  const res = await fetch(`${GRAPH_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta API error: ${err}`);
  }
  return res.json();
}

export async function sendWhatsAppText(
  phoneNumberId: string,
  to: string,
  text: string,
  token: string
) {
  return graphPost(`/${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body: text },
  });
}

export async function markWhatsAppRead(
  phoneNumberId: string,
  messageId: string,
  token: string
) {
  return graphPost(`/${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  });
}

export async function sendWhatsAppTemplate(
  phoneNumberId: string,
  to: string,
  templateName: string,
  languageCode: string,
  components: object[],
  token: string
) {
  return graphPost(`/${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  });
}

export async function sendInstagramText(
  recipientId: string,
  text: string,
  token: string
) {
  return graphPost(`/me/messages`, token, {
    recipient: { id: recipientId },
    message: { text },
  });
}
