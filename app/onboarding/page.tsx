"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { callFunction } from "@/lib/functions";
import { useRouter } from "next/navigation";
import ConnectChannels from "@/components/onboarding/ConnectChannels";

type Step = "auth-check" | "empresa" | "canales" | "listo";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("auth-check");
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  // Note: supabase client is created inside useEffect and async functions to avoid re-render loops

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: membership } = await supabase
        .from("tenant_users")
        .select("tenant_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership) {
        setTenantId(membership.tenant_id);
        setStep("canales");
      } else {
        setStep("empresa");
      }
    }
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const { data: { session } } = await createClient().auth.getSession();
    const token = session?.access_token;
    if (!token) { setError("Sesión expirada"); setLoading(false); return; }

    const res = await callFunction("create-tenant", {
      method: "POST",
      body: { name: name.trim() },
      token,
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Error al crear empresa"); return; }
    setTenantId(data.tenantId);
    setStep("canales");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#f4f4f5",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  if (step === "auth-check") {
    return (
      <div style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#71717a", fontSize: 14 }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
          Vendly<span style={{ color: "#10b981" }}>.</span>
        </span>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 24 }}>
          {["empresa", "canales", "listo"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                background: step === s ? "#10b981" : (["empresa", "canales", "listo"].indexOf(step) > i ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.07)"),
                color: step === s ? "#fff" : (["empresa", "canales", "listo"].indexOf(step) > i ? "#10b981" : "#52525b"),
                border: step === s ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}>
                {["empresa", "canales", "listo"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              {i < 2 && <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.08)" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Step 1: Empresa */}
        {step === "empresa" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              Bienvenido a Vendly
            </h1>
            <p style={{ color: "#71717a", fontSize: 14, marginBottom: 28 }}>
              Primero, contanos cómo se llama tu negocio.
            </p>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={createEmpresa}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, color: "#71717a", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Nombre del negocio
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="Ej: Tienda Deportiva Sur"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "13px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading || !name.trim() ? 0.6 : 1,
                }}
              >
                {loading ? "Creando..." : "Continuar"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Canales */}
        {step === "canales" && tenantId && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            <ConnectChannels
              tenantId={tenantId}
              onComplete={() => setStep("listo")}
            />
            <div style={{ padding: "0 32px 24px", textAlign: "center" }}>
              <button
                onClick={() => setStep("listo")}
                style={{ background: "none", border: "none", color: "#52525b", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
              >
                Omitir por ahora, conectar después
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Listo */}
        {step === "listo" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              Todo listo
            </h1>
            <p style={{ color: "#71717a", fontSize: 14, marginBottom: 32 }}>
              Tu agente IA ya está configurado. Podés empezar a usarlo desde el dashboard.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "linear-gradient(135deg,#10b981,#059669)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "13px 32px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ir al dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
