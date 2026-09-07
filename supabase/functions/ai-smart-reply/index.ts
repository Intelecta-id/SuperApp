// ==============================================================================
// Supabase Edge Function: AI Copilot & Smart Reply Generator
// ==============================================================================
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt, context, channel_type } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Default intelligent response fallback if key not configured
    let reply = `Terima kasih atas pesannya. Tim Intelecta siap membantu mewujudkan solusi digital Anda. Kami akan menganalisis kebutuhan proyek ini dan segera menghubungi Anda kembali.`;

    if (OPENAI_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Anda adalah AI Operator untuk Intelecta (Konsultan & Developer Solusi Digital: Web Development, Mobile App, & Web App). Berikan balasan yang profesional, ringkas, dan persuasif. Konteks kanal: ${channel_type || "omnichannel"}.`
            },
            {
              role: "user",
              content: `Pesan masuk klien: "${prompt}"\nKonteks riwayat: ${JSON.stringify(context || {})}`
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        reply = data.choices[0].message.content;
      }
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
