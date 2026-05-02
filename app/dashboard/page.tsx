"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: membership } = await supabase
        .from("tenant_users")
        .select("tenant_id, role, tenants(name, agent_name)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!membership) {
        router.push("/onboarding");
        return;
      }

      const tenantId = membership.tenant_id;

      const [metricsRes, inboxRes] = await Promise.all([
        supabase
          .from("v_tenant_metrics")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("day", { ascending: false })
          .limit(7),
        supabase
          .from("v_inbox")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("last_message_at", { ascending: false })
          .limit(5)
      ]);

      const metrics = metricsRes.data ?? [];
      const totalConversations = metrics.reduce((s: number, r: any) => s + (r.conversations ?? 0), 0);
      const totalMessages = metrics.reduce((s: number, r: any) => s + (r.messages ?? 0), 0);
      const aiResponses = metrics.reduce((s: number, r: any) => s + (r.ai_responses ?? 0), 0);

      setData({
        metrics,
        inbox: inboxRes.data ?? [],
        stats: { totalConversations, totalMessages, aiResponses }
      });
      setLoading(false);
    }
    loadData();
  }, [supabase, router]);

  if (loading) return <div style={{ padding: 40, color: "#fff" }}>Cargando dashboard...</div>;

  const statStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "24px 20px",
  };

  const channelColors: Record<string, string> = {
    whatsapp: "#10b981",
    instagram: "#ec4899",
    web: "#6366f1",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Resumen</h1>
      <p style={{ color: "#71717a", fontSize: 14, marginBottom: 32 }}>Últimos 7 días de actividad del agente.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Conversaciones", value: data.stats.totalConversations },
          { label: "Mensajes", value: data.stats.totalMessages },
          { label: "Respuestas IA", value: data.stats.aiResponses },
        ].map((s) => (
          <div key={s.label} style={statStyle}>
            <p style={{ fontSize: 11, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Últimas conversaciones</h2>
          <a href="/dashboard/inbox" style={{ fontSize: 12, color: "#10b981", textDecoration: "none" }}>Ver todas →</a>
        </div>
        {!data.inbox?.length ? (
          <p style={{ textAlign: "center", color: "#52525b", fontSize: 13, padding: "32px 0" }}>
            Sin conversaciones aún. Conectá WhatsApp o Instagram para empezar.
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {data.inbox.map((conv: any) => (
              <li key={conv.id} style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#e4e4e7", fontWeight: 500, marginBottom: 2 }}>
                    {conv.contact_name ?? conv.contact_phone ?? conv.contact_ig ?? "Contacto"}
                  </p>
                  <p style={{ fontSize: 12, color: "#52525b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 300 }}>
                    {conv.last_message}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: `${channelColors[conv.channel_type] ?? "#6366f1"}20`,
                    color: channelColors[conv.channel_type] ?? "#a1a1aa",
                    border: `1px solid ${channelColors[conv.channel_type] ?? "#6366f1"}40`,
                    textTransform: "capitalize",
                  }}>
                    {conv.channel_type}
                  </span>
                  {!conv.ai_handling && (
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                      Humano
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
