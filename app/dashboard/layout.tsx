"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: membership } = await supabase
        .from("tenant_users")
        .select("tenant_id, tenants(name)")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!membership) { router.push("/onboarding"); return; }
      setTenant(membership.tenants);
      setLoading(false);
    }
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div style={{ minHeight: "100vh", background: "#09090b", color: "#f4f4f5", padding: 40 }}>Cargando...</div>;

  const nav = [
    { href: "/dashboard", label: "Resumen", icon: "⬡" },
    { href: "/dashboard/agente", label: "Agente IA", icon: "◈" },
    { href: "/dashboard/inbox", label: "Inbox", icon: "◉" },
    { href: "/dashboard/pipeline", label: "Pipeline", icon: "◧" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#09090b", color: "#f4f4f5", fontFamily: "Inter, sans-serif" }}>
      <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: "24px 0", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Vendly<span style={{ color: "#10b981" }}>.</span></span>
          </Link>
          <p style={{ fontSize: 11, color: "#52525b", marginTop: 4 }}>{tenant?.name}</p>
        </div>
        <nav style={{ padding: "12px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, textDecoration: "none", color: pathname === item.href ? "#fff" : "#a1a1aa", background: pathname === item.href ? "rgba(255,255,255,0.05)" : "transparent", fontSize: 13, fontWeight: 500 }} className="dash-nav-link">
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={async () => { await createClient().auth.signOut(); router.push("/login"); }} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#52525b", fontSize: 13, textAlign: "left", cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      <style>{`.dash-nav-link:hover { background: rgba(255,255,255,0.05); color: #fff !important; }`}</style>
    </div>
  );
}
