/**
 * API Route: Contact Form
 * Receives contact form data and sends email via Resend
 */

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'contacto@tunixlabs.com';

// Validation schema for contact form
const ContactFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Email invalido'),
  asunto: z.string().min(3, 'El asunto es muy corto'),
  mensaje: z.string().min(10, 'El mensaje es muy corto'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = ContactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nombre, email, asunto, mensaje } = result.data;

    // Check if Resend is configured
    if (!resend) {
      console.error('[Contact] Resend no configurado - RESEND_API_KEY no definida');
      return NextResponse.json(
        { error: 'Servicio de email no disponible temporalmente' },
        { status: 503 }
      );
    }

    // Send email
    const emailResult = await resend.emails.send({
      from: 'TunixLabs Web <noreply@tunixlabs.com>',
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `[Contacto Web] ${asunto}`,
      html: generateContactEmailHtml({ nombre, email, asunto, mensaje }),
    });

    console.log('[Contact] Email enviado:', emailResult);

    return NextResponse.json(
      { success: true, message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact] Error:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}

/**
 * Generate HTML email for contact form submission
 */
function generateContactEmailHtml(data: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}): string {
  const { nombre, email, asunto, mensaje } = data;
  const timestamp = new Date().toLocaleString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
        .field { margin-bottom: 20px; background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #0d9488; }
        .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .value { font-size: 16px; color: #111827; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
        .reply-btn { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">${timestamp}</p>
        </div>

        <div class="content">
          <div class="field">
            <div class="label">De</div>
            <div class="value"><strong>${nombre}</strong></div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}" style="color: #0d9488;">${email}</a></div>
          </div>

          <div class="field">
            <div class="label">Asunto</div>
            <div class="value">${asunto}</div>
          </div>

          <div class="field">
            <div class="label">Mensaje</div>
            <div class="message-box">${mensaje.replace(/\n/g, '<br>')}</div>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${email}?subject=Re: ${asunto}" class="reply-btn">Responder a ${nombre}</a>
          </div>
        </div>

        <div class="footer">
          <p>Este mensaje fue enviado desde el formulario de contacto de tunixlabs.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
