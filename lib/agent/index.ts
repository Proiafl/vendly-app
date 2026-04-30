import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { createServiceClient } from "@/lib/supabase/server";

function getClients() {
  return {
    anthropic: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
    openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  };
}

interface AgentInput {
  tenantId: string;
  conversationId: string;
  userMessage: string;
}

interface AgentOutput {
  reply: string;
  shouldEscalate: boolean;
}

interface TenantConfig {
  agent_name: string;
  agent_tone: string;
  business_context: string | null;
}

export async function runAgent(input: AgentInput): Promise<AgentOutput> {
  const { anthropic, openai } = getClients();
  const supabase = createServiceClient();

  const [tenantRes, contextRes] = await Promise.all([
    supabase
      .from("tenants")
      .select("agent_name, agent_tone, business_context")
      .eq("id", input.tenantId)
      .single(),
    supabase
      .from("agent_context")
      .select("messages")
      .eq("conversation_id", input.conversationId)
      .maybeSingle(),
  ]);

  const tenant: TenantConfig = tenantRes.data ?? {
    agent_name: "Asistente",
    agent_tone: "profesional",
    business_context: null,
  };

  const history: Array<{ role: string; content: string }> =
    contextRes.data?.messages ?? [];

  // RAG: vectorizar la pregunta y buscar chunks relevantes
  let ragContext = "";
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input.userMessage,
    });
    const embedding = embeddingRes.data[0].embedding;

    const { data: chunks } = await supabase.rpc("search_knowledge", {
      p_tenant_id: input.tenantId,
      p_embedding: embedding,
      p_limit: 5,
    });

    if (chunks?.length) {
      ragContext =
        "\n\nInformación relevante del negocio:\n" +
        chunks.map((c: any) => c.content).join("\n---\n");
    }
  } catch {
    // RAG no crítico, continúa sin él
  }

  const systemPrompt = buildSystemPrompt(tenant, ragContext);

  // Historial recortado a los últimos 10 mensajes
  const recentHistory = history.slice(-10);

  const messages: Anthropic.MessageParam[] = [
    ...recentHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: input.userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: systemPrompt,
    messages,
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  const shouldEscalate = reply.includes("[ESCALAR_HUMANO]");
  const cleanReply = reply.replace("[ESCALAR_HUMANO]", "").trim();

  // Persistir historial actualizado
  const updatedHistory = [
    ...recentHistory,
    { role: "user", content: input.userMessage },
    { role: "assistant", content: cleanReply },
  ];

  await supabase.from("agent_context").upsert(
    {
      conversation_id: input.conversationId,
      messages: updatedHistory,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "conversation_id" }
  );

  return { reply: cleanReply, shouldEscalate };
}

function buildSystemPrompt(tenant: TenantConfig, ragContext: string): string {
  return `Eres ${tenant.agent_name}, un asistente de ventas ${tenant.agent_tone}.
Tu objetivo es responder preguntas, resolver dudas y guiar al cliente hacia una compra.
Responde siempre en el mismo idioma que el cliente.
Sé conciso: máximo 3 oraciones por respuesta (esto es WhatsApp/Instagram).
No uses asteriscos, markdown ni emojis excesivos.

Si el cliente pide hablar con un humano, o si la situación requiere intervención humana,
incluye exactamente [ESCALAR_HUMANO] al inicio de tu respuesta.
${tenant.business_context ? `\nContexto del negocio:\n${tenant.business_context}` : ""}${ragContext}`;
}
