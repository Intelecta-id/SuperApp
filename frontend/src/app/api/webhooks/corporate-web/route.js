import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sharedSecret = process.env.CORPORATE_WEB_SECRET || 'intelecta_corp_web_secret';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('X-Intelecta-Secret');
    if (authHeader !== sharedSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook signature' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, company, message, source, estimated_budget } = body;

    let leadId = null;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: lead, error } = await supabase.from('leads').insert({
        name: name || 'Website Visitor',
        email,
        phone,
        company,
        message,
        source: source || 'web_contact',
        status: 'new',
        estimated_value: estimated_budget || 0,
        metadata: body,
      }).select('id').single();

      if (error) throw error;
      leadId = lead?.id;

      await supabase.from('webhook_logs').insert({
        source: source || 'web_contact',
        payload: body,
        response_status: 201,
        status: 'success',
      });
    }

    return NextResponse.json({ success: true, lead_id: leadId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
