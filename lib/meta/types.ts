export interface MetaWebhookBody {
  object: string;
  entry: MetaEntry[];
}

export interface MetaEntry {
  id: string;
  changes?: MetaChange[];
  messaging?: MetaMessaging[];
}

export interface MetaChange {
  value: MetaChangeValue;
  field: string;
}

export interface MetaChangeValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: MetaContact[];
  messages?: MetaMessage[];
  statuses?: MetaStatus[];
}

export interface MetaContact {
  profile: { name: string };
  wa_id: string;
}

export interface MetaMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string };
  audio?: { id: string; mime_type: string };
  video?: { id: string; mime_type: string };
  document?: { id: string; filename: string; mime_type: string };
}

export interface MetaStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
}

export interface MetaMessaging {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: Array<{ type: string; payload: { url: string } }>;
  };
}

export interface ParsedWhatsAppEvent {
  phoneNumberId: string;
  from: string;
  messageId: string;
  text: string;
  contactName: string;
  timestamp: string;
}

export interface ParsedInstagramEvent {
  pageId: string;
  senderId: string;
  messageId: string;
  text: string;
  timestamp: number;
}
