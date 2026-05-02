"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Revisa tu email para confirmar tu cuenta, luego ingresa.");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#f4f4f5",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
              Vendly<span style={{ color: "#10b981" }}>.</span>
            </span>
          </Link>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 32,
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 28, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.15s",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#09090b" : "#71717a",
                }}
              >
                {t === "login" ? "Ingresar" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "10px 14px", color: "#34d399", fontSize: 13, marginBottom: 20 }}>
              {success}
            </div>
          )}

          <form onSubmit={tab === "login" ? handleLogin : handleSignup}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#71717a", marginBottom: 6, fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="tu@email.com"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, color: "#71717a", marginBottom: 6, fontWeight: 500 }}>
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
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
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "..." : tab === "login" ? "Ingresar" : "Crear cuenta gratis"}
            </button>
          </form>

          {tab === "login" && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#52525b", marginTop: 20 }}>
              ¿No tenés cuenta?{" "}
              <button onClick={() => setTab("signup")} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", fontSize: 13 }}>
                Registrate gratis
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
