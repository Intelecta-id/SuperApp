// ==============================================================================
// Supabase Edge Function: Corporate Web Leads Receiver
// ==============================================================================
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const WEBHOOK_SHARED_SECRET = Deno.env.get("CORPORATE_WEB_SECRET") || "intelecta_corp_web_secret";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const authHeader = req.headers.get("X-Intelecta-Secret");
    if (authHeader !== WEBHOOK_SHARED_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized webhook signature" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }

    const body = await req.json();
    const { name, email, phone, company, message, source, estimated_budget } = body;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Save lead to database
    const { data: lead, error } = await supabase.from("leads").insert({
      name: name || "Website Visitor",
      email,
      phone,
      company,
      message,
      source: source || "web_contact",
      status: "new",
      estimated_value: estimated_budget || 0,
      metadata: body,
    }).select().single();

    if (error) throw error;

    // Log the webhook
    await supabase.from("webhook_logs").insert({
      source: source || "web_contact",
      payload: body,
      response_status: 201,
      status: "success",
    });

    return new Response(JSON.stringify({ success: true, lead_id: lead.id }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
