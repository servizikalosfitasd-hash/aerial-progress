import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:kalos.fit.asd@outlook.it",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const sender = userData?.user;
    if (!sender) return json({ error: "unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const targetUserId: string | undefined = body?.userId;
    const preview: string = String(body?.body ?? "").slice(0, 140);
    if (!targetUserId || typeof targetUserId !== "string") {
      return json({ error: "userId is required" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Only admins may push to another user's devices.
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: sender.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "forbidden" }, 403);
    if (targetUserId === sender.id) return json({ sent: 0 });

    const { data: subs, error } = await admin
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", targetUserId);
    if (error) return json({ error: error.message }, 500);

    const payload = JSON.stringify({
      title: "Kalos Fit — Nuovo messaggio",
      body: preview || "Hai un nuovo messaggio dal tuo coach",
      url: "/messaggi",
      tag: "kalos-message",
    });

    let sent = 0;
    const stale: string[] = [];
    await Promise.all(
      (subs ?? []).map(async (s: any) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
          );
          sent++;
        } catch (e: any) {
          const code = e?.statusCode;
          if (code === 404 || code === 410) stale.push(s.id);
          else console.error("push error", code, e?.body ?? e?.message);
        }
      }),
    );

    if (stale.length) {
      await admin.from("push_subscriptions").delete().in("id", stale);
    }

    return json({ sent, removed: stale.length });
  } catch (e: any) {
    console.error(e);
    return json({ error: e?.message ?? "unexpected error" }, 500);
  }
});
