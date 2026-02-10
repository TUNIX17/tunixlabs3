/**
 * API Route: /api/webhooks/calendly
 * POST: Recibir webhooks de Calendly cuando se agenda una reunion
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendMeetingNotification } from '@/lib/email/resend';

interface CalendlyWebhookPayload {
  event: 'invitee.created' | 'invitee.canceled';
  payload: {
    event_type: {
      uuid: string;
      name: string;
    };
    event: {
      uuid: string;
      start_time: string;
      end_time: string;
    };
    invitee: {
      uuid: string;
      name: string;
      email: string;
      timezone: string;
    };
    questions_and_answers?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

/**
 * Verify Calendly HMAC webhook signature.
 * Calendly signature format: t=timestamp,v1=signature
 */
function verifyCalendlySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    const parts: Record<string, string> = {};
    signatureHeader.split(',').forEach(part => {
      const [key, value] = part.split('=', 2);
      parts[key] = value;
    });

    const timestamp = parts['t'];
    const signature = parts['v1'];
    if (!timestamp || !signature) return false;

    const payload = `${timestamp}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch (error) {
    console.error('[Calendly] Signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body first for signature verification
    const rawBody = await request.text();
    let body: CalendlyWebhookPayload;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.warn('[Calendly] Invalid JSON body');
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
    const signature = request.headers.get('Calendly-Webhook-Signature');

    if (webhookSecret) {
      if (!signature || !verifyCalendlySignature(rawBody, signature, webhookSecret)) {
        console.warn('[Calendly] Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn('[Calendly] CALENDLY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    console.log('[Calendly] Webhook recibido:', body.event);

    // Solo procesar eventos de reunion creada
    if (body.event !== 'invitee.created') {
      return NextResponse.json({ received: true, action: 'ignored' });
    }

    const { invitee, event: eventData } = body.payload;

    // Buscar lead por email
    let lead = await prisma.lead.findFirst({
      where: { email: invitee.email }
    });

    if (lead) {
      // Actualizar lead existente
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          name: lead.name || invitee.name,
          meetingScheduled: true,
          meetingDate: new Date(eventData.start_time),
          calendlyEventId: eventData.uuid,
          status: 'QUALIFIED' // Subir status si agenda reunion
        }
      });

      // Actividad de reunion agendada
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'meeting_scheduled',
          details: `Reunion agendada para ${new Date(eventData.start_time).toLocaleString('es-CL')}`
        }
      });

      console.log('[Calendly] Lead actualizado:', lead.id);

    } else {
      // Crear nuevo lead desde Calendly
      lead = await prisma.lead.create({
        data: {
          name: invitee.name,
          email: invitee.email,
          meetingScheduled: true,
          meetingDate: new Date(eventData.start_time),
          calendlyEventId: eventData.uuid,
          source: 'calendly',
          status: 'QUALIFIED',
          location: invitee.timezone,
          score: 50 // Score base para leads de Calendly
        }
      });

      // Actividad de creacion
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'lead_created',
          details: 'Lead creado desde Calendly con reunion agendada'
        }
      });

      console.log('[Calendly] Nuevo lead creado:', lead.id);
    }

    // Enviar notificacion por email
    try {
      await sendMeetingNotification(lead);
    } catch (emailError) {
      console.error('[Calendly] Error enviando notificacion:', emailError);
    }

    return NextResponse.json({ received: true, action: 'processed' });

  } catch (error) {
    console.error('[Calendly] Error procesando webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

// Return 405 Method Not Allowed for GET requests (prevent info disclosure)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
