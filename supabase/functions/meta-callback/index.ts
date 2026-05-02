import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getWhatsAppAccounts,
  getInstagramAccounts,
  subscribePageToWebhook,
} from "../_shared/meta.ts";
import { getServiceClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { code, tenantId } = await req.json();
    if (!code || !tenantId) {
      return Response.json({ error: "Missing code or tenantId" }, { status: 400 });
    }

    // Verificar sesion del usuario via JWT del header Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: membership } = await userClient
      .from("tenant_users")
      .select("role")
      .eq("tenant_id", tenantId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) return Response.json({ error: "Forbidden" }, { status: 403 });

    const shortToken = await exchangeCodeForToken(code);
    const longToken = await getLongLivedToken(shortToken);
    const tokenExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

    const adminSupabase = getServiceClient();

    // WhatsApp
    const waAccounts = await getWhatsAppAccounts(longToken);
    for (const wa of waAccounts) {
      const { data: ch } = await adminSupabase
        .from("tenant_channels")
        .upsert({
          tenant_id: tenantId,
          channel_type: "whatsapp",
          phone_number_id: wa.phoneNumberId,
          phone_number: wa.phoneNumber,
          waba_id: wa.wabaId,
          access_token: longToken,
          token_expires_at: tokenExpiresAt,
        }, { onConflict: "tenant_id,phone_number_id" })
        .select("id").single();

      if (ch) {
        await adminSupabase.from("phone_routing").upsert(
          { phone_number_id: wa.phoneNumberId, tenant_id: tenantId, channel_id: ch.id },
          { onConflict: "phone_number_id" }
        );
      }
    }

    // Instagram
    const igAccounts = await getInstagramAccounts(longToken);
    for (const ig of igAccounts) {
      const { data: ch } = await adminSupabase
        .from("tenant_channels")
        .upsert({
          tenant_id: tenantId,
          channel_type: "instagram",
          page_id: ig.pageId,
          ig_user_id: ig.igUserId,
          access_token: longToken,
          token_expires_at: tokenExpiresAt,
        }, { onConflict: "tenant_id,page_id" })
        .select("id").single();

      if (ch) {
        await subscribePageToWebhook(ig.pageId, longToken);
        await adminSupabase.from("phone_routing").upsert(
          { phone_number_id: ig.pageId, page_id: ig.pageId, tenant_id: tenantId, channel_id: ch.id },
          { onConflict: "phone_number_id" }
        );
      }
    }

    await adminSupabase.from("tenants")
      .update({ onboarded_at: new Date().toISOString() })
      .eq("id", tenantId);

    return Response.json({ success: true, whatsapp: waAccounts.length, instagram: igAccounts.length },
      { headers: corsHeaders });
  } catch (err: any) {
    console.error("meta-callback error:", err);
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
});
