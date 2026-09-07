// ==============================================================================
// Supabase Edge Function: Instagram & Meta Graph Webhook Receiver
// ==============================================================================
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const META_VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN") || "intelecta_meta_verify_secret";

serve(async (req: Request) => {
  const url = new URL(req.url);

  // 1. Meta Webhook Verification Challenge (GET)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Verification failed", { status: 403 });
  }

  // 2. Process incoming webhook payload (POST)
  if (req.method === "POST") {
    try {
      const payload = await req.json();
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Log webhook reception
      await supabase.from("webhook_logs").insert({
        source: "instagram",
        payload: payload,
        response_status: 200,
        status: "processed"
      });

      // Parse Instagram messaging entries
      const entries = payload?.entry || [];
      for (const entry of entries) {
        const messagings = entry.messaging || [];
        for (const msg of messagings) {
          if (msg.message && !msg.message.is_echo) {
            const senderId = msg.sender?.id;
            const text = msg.message?.text || "";

            // Insert into leads or omnichannel chat
            await supabase.from("leads").insert({
              source: "instagram",
              name: `IG User ${senderId?.slice(-4) || "Guest"}`,
              message: text,
              status: "new",
              metadata: { ig_sender_id: senderId, raw_message: msg }
            });
          }
        }
      }

      return new Response(JSON.stringify({ status: "success" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
