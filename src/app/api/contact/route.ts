/**
 * API Route: Contact Form
 * Saves the message as a Lead, then notifies by email (Resend) and Telegram.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendMessage, getOwnerChatId, TelegramError } from '@/lib/telegram/bot';
import { ContactFormSchema } from '@/lib/validation/schemas';
import { getClientIP } from '@/lib/auth';
import { contactLimiter } from '@/lib/rateLimit';
import { escapeHtml, sanitizeEmailSubject } from '@/lib/validation/sanitize';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'contacto@tunixlabs.com';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateCheck = contactLimiter.check(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const result = ContactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const contact = result.data;

    // Save first: the lead shows up in /admin/leads even if both
    // notifications fail. Before, the email was the only record.
    const leadId = await saveContactLead(contact);
    const [emailed, notified] = await Promise.all([
      sendContactEmail(contact),
      notifyTelegram(contact),
    ]);

    if (!leadId && !emailed) {
      // The forms map this code to a translated message with WhatsApp and email.
      return NextResponse.json(
        { error: 'No pude recibir tu mensaje.', code: 'CONTACT_UNAVAILABLE' },
        { status: 500 }
      );
    }
    if (!emailed && !notified) {
      console.error(`[Contact] Lead ${leadId} guardado sin email ni Telegram: revisar /admin/leads`);
    }

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

type ContactInput = z.infer<typeof ContactFormSchema>;

/** Returns the lead id, or null if it could not be saved. */
async function saveContactLead({ nombre, email, asunto, mensaje }: ContactInput): Promise<string | null> {
  const message = { role: 'user', content: `${asunto}\n\n${mensaje}` };
  try {
    // Same email as an earlier lead (voice agent, Calendly, a previous
    // message): append to it, like /api/leads/capture does, instead of
    // creating a duplicate. emailSequenceActive goes false either way:
    // someone who wrote by hand gets a personal reply, not the automated
    // welcome / case-study / offer sequence.
    const existing = await prisma.lead.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (existing) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: {
          emailSequenceActive: false,
          messages: { create: message },
          activities: { create: { type: 'lead_updated', details: 'Mensaje desde contact-form' } },
        },
      });
      return existing.id;
    }
    const lead = await prisma.lead.create({
      data: {
        name: nombre,
        email,
        source: 'contact-form',
        notes: asunto,
        emailSequenceActive: false,
        messages: { create: message },
        activities: { create: { type: 'lead_created', details: 'Lead capturado desde contact-form' } },
      },
      select: { id: true },
    });
    return lead.id;
  } catch (error) {
    // Class and code only: Prisma error messages can echo the visitor's data.
    const code = (error as { code?: string } | null)?.code ?? '';
    console.error('[Contact] No se pudo guardar el lead:', error instanceof Error ? error.name : 'unknown', code);
    return null;
  }
}

async function sendContactEmail({ nombre, email, asunto, mensaje }: ContactInput): Promise<boolean> {
  if (!resend) {
    console.error('[Contact] Resend no configurado - RESEND_API_KEY no definida');
    return false;
  }
  try {
    // resend v6 does not throw on API errors: it returns { error }.
    const { error } = await resend.emails.send({
      from: 'TunixLabs Web <noreply@tunixlabs.com>',
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `[Contacto Web] ${sanitizeEmailSubject(asunto)}`,
      html: generateContactEmailHtml({
        nombre: escapeHtml(nombre),
        email: escapeHtml(email),
        asunto: escapeHtml(sanitizeEmailSubject(asunto)),
        mensaje: escapeHtml(mensaje),
      }),
    });
    if (error) {
      console.error('[Contact] Resend rechazó el email:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Contact] Error enviando email:', error);
    return false;
  }
}

async function notifyTelegram({ nombre, email, asunto, mensaje }: ContactInput): Promise<boolean> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_OWNER_CHAT_ID) {
    console.error('[Contact] Telegram no configurado - faltan TELEGRAM_BOT_TOKEN o TELEGRAM_OWNER_CHAT_ID');
    return false;
  }
  // Cut by code points so a split emoji doesn't make Telegram reject the text.
  const body = Array.from(mensaje).slice(0, 3000).join('');
  try {
    await sendMessage(getOwnerChatId(), `📩 Contacto web · ${nombre} <${email}>\n\n${asunto}\n\n${body}`);
    return true;
  } catch (error) {
    console.error(
      '[Contact] Aviso a Telegram falló:',
      error instanceof TelegramError ? error.message : error
    );
    return false;
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
