import OpenAI from "npm:openai@4";
import { getServiceClient } from "./supabase.ts";

interface AgentInput {
  tenantId: string;
  conversationId: string;
  userMessage: string;
}

export async function runAgent(input: AgentInput) {
  const supabase = getServiceClient();
  const gemini = new OpenAI({
    apiKey: Deno.env.get("GOOGLE_AI_API_KEY"),
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

  const [tenantRes, contextRes] = await Promise.all([
    supabase.from("tenants").select("agent_name, agent_tone, business_context").eq("id", input.tenantId).single(),
    supabase.from("agent_context").select("messages").eq("conversation_id", input.conversationId).maybeSingle(),
  ]);

  const tenant = tenantRes.data ?? { agent_name: "Asistente", agent_tone: "profesional", business_context: null };
  const history: Array<{ role: string; content: string }> = contextRes.data?.messages ?? [];

  // RAG
  let ragContext = "";
  try {
    const embRes = await openai.embeddings.create({ model: "text-embedding-3-small", input: input.userMessage });
    const embedding = embRes.data[0].embedding;
    const { data: chunks } = await supabase.rpc("search_knowledge", {
      p_tenant_id: input.tenantId,
      p_embedding: embedding,
      p_limit: 5,
    });
    if (chunks?.length) {
      ragContext = "\n\nInformación relevante del negocio:\n" + chunks.map((c: any) => c.content).join("\n---\n");
    }
  } catch { /* RAG no critico */ }

  const systemPrompt = `Eres ${tenant.agent_name}, un asistente de ventas ${tenant.agent_tone}.
Tu objetivo es responder preguntas, resolver dudas y guiar al cliente hacia una compra.
Responde siempre en el mismo idioma que el cliente.
Sé conciso: máximo 3 oraciones por respuesta (esto es WhatsApp/Instagram).
No uses asteriscos, markdown ni emojis excesivos.
Si el cliente pide hablar con un humano, incluye exactamente [ESCALAR_HUMANO] al inicio de tu respuesta.
${tenant.business_context ? `\nContexto del negocio:\n${tenant.business_context}` : ""}${ragContext}`;

  const recentHistory = history.slice(-10);

  const response = await gemini.chat.completions.create({
    model: "gemini-2.5-flash",
    max_tokens: 500,
    messages: [
      { role: "system", content: systemPrompt },
      ...recentHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: input.userMessage },
    ],
  });

  const reply = response.choices[0]?.message?.content ?? "";
  const shouldEscalate = reply.includes("[ESCALAR_HUMANO]");
  const cleanReply = reply.replace("[ESCALAR_HUMANO]", "").trim();

  const updatedHistory = [
    ...recentHistory,
    { role: "user", content: input.userMessage },
    { role: "assistant", content: cleanReply },
  ];

  await supabase.from("agent_context").upsert(
    { conversation_id: input.conversationId, messages: updatedHistory, updated_at: new Date().toISOString() },
    { onConflict: "conversation_id" }
  );

  return { reply: cleanReply, shouldEscalate };
}
