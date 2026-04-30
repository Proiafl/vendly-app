import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getWhatsAppAccounts,
  getInstagramAccounts,
  subscribePageToWebhook,
} from "@/lib/meta/graph";

export async function POST(req: NextRequest) {
  try {
    const { code, tenantId } = await req.json();

    if (!code || !tenantId) {
      return NextResponse.json({ error: "Missing code or tenantId" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verificar sesión
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verificar que el usuario pertenece al tenant
    const { data: membership } = await supabase
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", tenantId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Intercambiar código por token corto, luego token largo (60 días)
    const shortToken = await exchangeCodeForToken(code);
    const longToken = await getLongLivedToken(shortToken);
    const tokenExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

    const { createServiceClient } = await import("@/lib/supabase/server");
    const adminSupabase = createServiceClient();

    // Procesar cuentas de WhatsApp
    const waAccounts = await getWhatsAppAccounts(longToken);
    for (const wa of waAccounts) {
      const { data: channel } = await adminSupabase
        .from("tenant_channels")
        .upsert(
          {
            tenant_id: tenantId,
            channel_type: "whatsapp",
            phone_number_id: wa.phoneNumberId,
            phone_number: wa.phoneNumber,
            waba_id: wa.wabaId,
            access_token: longToken,
            token_expires_at: tokenExpiresAt,
          },
          { onConflict: "tenant_id,phone_number_id" }
        )
        .select("id")
        .single();

      if (channel) {
        await adminSupabase.from("phone_routing").upsert(
          {
            phone_number_id: wa.phoneNumberId,
            tenant_id: tenantId,
            channel_id: channel.id,
          },
          { onConflict: "phone_number_id" }
        );
      }
    }

    // Procesar cuentas de Instagram
    const igAccounts = await getInstagramAccounts(longToken);
    for (const ig of igAccounts) {
      const { data: channel } = await adminSupabase
        .from("tenant_channels")
        .upsert(
          {
            tenant_id: tenantId,
            channel_type: "instagram",
            page_id: ig.pageId,
            ig_user_id: ig.igUserId,
            access_token: longToken,
            token_expires_at: tokenExpiresAt,
          },
          { onConflict: "tenant_id,page_id" }
        )
        .select("id")
        .single();

      if (channel) {
        // Suscribir page al webhook de Instagram
        await subscribePageToWebhook(ig.pageId, longToken);

        await adminSupabase.from("phone_routing").upsert(
          {
            page_id: ig.pageId,
            tenant_id: tenantId,
            channel_id: channel.id,
          },
          { onConflict: "page_id" }
        );
      }
    }

    // Marcar tenant como onboarded
    await adminSupabase
      .from("tenants")
      .update({ onboarded_at: new Date().toISOString() })
      .eq("id", tenantId);

    return NextResponse.json({
      success: true,
      whatsapp: waAccounts.length,
      instagram: igAccounts.length,
    });
  } catch (err: any) {
    console.error("Meta callback error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
