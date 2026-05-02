"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { callFunction } from "@/lib/functions";

interface Chunk {
  id: string;
  content: string;
  source: string;
  created_at: string;
}

interface AgentConfig {
  agent_name: string;
  agent_tone: string;
  business_context: string;
}

const TONES = [
  { value: "profesional", label: "Profesional" },
  { value: "amigable", label: "Amigable" },
  { value: "vendedor", label: "Vendedor agresivo" },
  { value: "formal", label: "Formal" },
];

async function getTokenAndTenant() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const userId = session?.user?.id ?? null;
  if (!token || !userId) return { token: null, tenantId: null };
  const { data } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", userId)
    .maybeSingle();
  return { token, tenantId: data?.tenant_id ?? null };
}

export default function AgentePage() {
  const [config, setConfig] = useState<AgentConfig>({ agent_name: "", agent_tone: "profesional", business_context: "" });
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [newContent, setNewContent] = useState("");
  const [newSource, setNewSource] = useState("manual");
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const loadChunks = useCallback(async () => {
    const { token } = await getTokenAndTenant();
    if (!token) return;
    const res = await callFunction("knowledge", { token });
    if (res.ok) {
      const data = await res.json();
      setChunks(data.chunks ?? []);
    }
  }, []);

  useEffect(() => { loadChunks(); }, [loadChunks]);

  async function saveConfig() {
    setSaving(true);
    setError("");
    const { token, tenantId } = await getTokenAndTenant();
    if (!token || !tenantId) { setError("Sesión no válida"); setSaving(false); return; }

    const supabase = createClient();
    const { error: dbErr } = await supabase
      .from("tenants")
      .update({
        agent_name: config.agent_name,
        agent_tone: config.agent_tone,
        business_context: config.business_context,
      })
      .eq("id", tenantId);

    setSaving(false);
    if (dbErr) {
      setError(dbErr.message ?? "Error al guardar");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function addChunk() {
    if (!newContent.trim()) return;
    setAdding(true);
    setError("");
    const { token } = await getTokenAndTenant();
    if (!token) { setError("Sesión no válida"); setAdding(false); return; }

    const res = await callFunction("knowledge", {
      method: "POST",
      body: { content: newContent.trim(), source: newSource },
      token,
    });
    setAdding(false);
    if (res.ok) {
      setNewContent("");
      await loadChunks();
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al agregar");
    }
  }

  async function deleteChunk(id: string) {
    const { token } = await getTokenAndTenant();
    if (!token) return;
    await callFunction("knowledge", { method: "DELETE", token, params: { id } });
    setChunks((prev) => prev.filter((c) => c.id !== id));
  }

  const sectionStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
  };

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, color: "#71717a", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" };
  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#f4f4f5", fontSize: 14, outline: "none", boxSizing: "border-box" };
  const btnPrimary: React.CSSProperties = { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const btnDanger: React.CSSProperties = { background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Configuración del Agente IA</h1>
      <p style={{ color: "#71717a", fontSize: 14, marginBottom: 32 }}>
        Personaliza cómo se comporta tu agente y entrénalo con el contexto de tu negocio.
      </p>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <section style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 20 }}>
          <span style={{ color: "#10b981", marginRight: 8 }}>◈</span>Personalidad del Agente
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Nombre del Agente</label>
            <input
              style={inputStyle}
              placeholder="Ej: Sofía, Max, Vendly IA"
              value={config.agent_name}
              onChange={(e) => setConfig((p) => ({ ...p, agent_name: e.target.value }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Tono de voz</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={config.agent_tone}
              onChange={(e) => setConfig((p) => ({ ...p, agent_tone: e.target.value }))}
            >
              {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Contexto del negocio</label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            placeholder="Ej: Somos una tienda de ropa deportiva en Buenos Aires. Enviamos a todo el país. Nuestros precios están en ARS..."
            value={config.business_context}
            onChange={(e) => setConfig((p) => ({ ...p, business_context: e.target.value }))}
          />
          <p style={{ fontSize: 11, color: "#52525b", marginTop: 4 }}>
            Descripción general que el agente usa en cada conversación.
          </p>
        </div>

        <button style={btnPrimary} onClick={saveConfig} disabled={saving}>
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar configuración"}
        </button>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
          <span style={{ color: "#10b981", marginRight: 8 }}>◉</span>Base de Conocimiento (RAG)
        </h2>
        <p style={{ fontSize: 13, color: "#71717a", marginBottom: 20 }}>
          Añadí preguntas frecuentes, detalles de productos, políticas de envío u otra información que el agente debe conocer. Cada bloque se vectoriza automáticamente.
        </p>

        <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Contenido</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              placeholder="Ej: El envío estándar tarda 3-5 días hábiles y tiene un costo de $500. El envío express demora 24hs y cuesta $1200."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Fuente (referencia)</label>
              <input
                style={inputStyle}
                placeholder="FAQ, Catálogo, Política de devoluciones..."
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              />
            </div>
            <button style={btnPrimary} onClick={addChunk} disabled={adding || !newContent.trim()}>
              {adding ? "Procesando..." : "+ Agregar"}
            </button>
          </div>
        </div>

        {chunks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#52525b", fontSize: 13, padding: "24px 0" }}>
            No hay conocimiento cargado aún. Agregá el primero arriba.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#d4d4d8", lineHeight: 1.5, margin: 0, wordBreak: "break-word" }}>
                    {chunk.content.length > 200 ? chunk.content.slice(0, 200) + "…" : chunk.content}
                  </p>
                  <p style={{ fontSize: 11, color: "#52525b", marginTop: 4 }}>
                    {chunk.source} · {new Date(chunk.created_at).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <button style={btnDanger} onClick={() => deleteChunk(chunk.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
