import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, channel_type, context } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;

    let reply = `Terima kasih atas pesannya. Tim Intelecta siap membantu mewujudkan solusi digital Anda. Kami akan menganalisis kebutuhan proyek ini dan segera menghubungi Anda kembali.`;

    if (openAiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openAiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Anda adalah AI Operator untuk Intelecta (Konsultan & Developer Solusi Digital: Web Development, Mobile App, & Web App). Berikan balasan yang profesional, ringkas, dan persuasif. Konteks kanal: ${channel_type || 'omnichannel'}.`,
              },
              {
                role: 'user',
                content: `Pesan klien: "${prompt}"\nKonteks: ${JSON.stringify(context || {})}`,
              },
            ],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        if (data?.choices?.[0]?.message?.content) {
          reply = data.choices[0].message.content;
        }
      } catch (aiErr) {
        console.warn('AI API completion error, using default response:', aiErr.message);
      }
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
