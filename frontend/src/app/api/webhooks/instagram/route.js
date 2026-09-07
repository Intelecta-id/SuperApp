import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const verifyToken = process.env.META_VERIFY_TOKEN || 'intelecta_meta_verify_secret';

// GET: Meta Webhook Verification
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// POST: Process incoming Instagram DM message
export async function POST(request) {
  try {
    const payload = await request.json();

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('webhook_logs').insert({
        source: 'instagram',
        payload,
        response_status: 200,
        status: 'processed',
      });

      const entries = payload?.entry || [];
      for (const entry of entries) {
        for (const msg of entry?.messaging || []) {
          if (msg.message && !msg.message.is_echo) {
            const senderId = msg.sender?.id;
            const text = msg.message?.text || '';

            await supabase.from('leads').insert({
              source: 'instagram',
              name: `IG User ${senderId?.slice(-4) || 'Guest'}`,
              message: text,
              status: 'new',
              metadata: { ig_sender_id: senderId, raw: msg },
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
