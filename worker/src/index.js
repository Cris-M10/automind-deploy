export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const contentType = request.headers.get('content-type') || '';
      let name, email, subject, message;

      if (contentType.includes('application/json')) {
        const body = await request.json();
        name = body.name || '';
        email = body.email || '';
        subject = body.subject || 'Contacto desde M25 AutoMind';
        message = body.message || '';
      } else {
        const formData = await request.formData();
        name = formData.get('name')?.toString() || '';
        email = formData.get('email')?.toString() || '';
        subject = formData.get('subject')?.toString() || 'Contacto desde M25 AutoMind';
        message = formData.get('message')?.toString() || '';
      }

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: 'Faltan campos obligatorios' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'M25 AutoMind <contacto@automindec.com>',
          to: env.TO_EMAIL,
          reply_to: email,
          subject: `[M25 AutoMind] ${subject}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px"><h2 style="color:#8c1445;border-bottom:2px solid #8c1445;padding-bottom:10px">Nuevo mensaje de contacto</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px 0;color:#666;font-weight:bold">Nombre:</td><td style="padding:10px 0">${name}</td></tr><tr><td style="padding:10px 0;color:#666;font-weight:bold">Email:</td><td style="padding:10px 0">${email}</td></tr><tr><td style="padding:10px 0;color:#666;font-weight:bold">Asunto:</td><td style="padding:10px 0">${subject}</td></tr></table><div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-top:20px"><p style="color:#666;font-weight:bold;margin-bottom:8px">Mensaje:</p><p style="color:#333;line-height:1.6">${message.replace(/\n/g, '<br>')}</p></div><p style="color:#999;font-size:12px;margin-top:30px">Enviado desde el formulario de M25 AutoMind</p></div>`,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error('Resend error:', error);
        return new Response(
          JSON.stringify({ error: 'Error al enviar el correo' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};
