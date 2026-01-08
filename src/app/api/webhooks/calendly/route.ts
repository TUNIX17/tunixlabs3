/**
 * API Route: /api/webhooks/calendly
 * POST: Recibir webhooks de Calendly cuando se agenda una reunion
 */

import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    // Verificar webhook secret (opcional pero recomendado)
    const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
    const signature = request.headers.get('Calendly-Webhook-Signature');

    if (webhookSecret && signature) {
      // TODO: Implementar verificacion de firma HMAC
      // Por ahora solo log
      console.log('[Calendly] Webhook signature presente');
    }

    const body: CalendlyWebhookPayload = await request.json();

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

    return NextResponse.json({
      received: true,
      action: 'processed',
      leadId: lead.id
    });

  } catch (error) {
    console.error('[Calendly] Error procesando webhook:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

// Calendly puede enviar GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Calendly webhook endpoint activo'
  });
}
