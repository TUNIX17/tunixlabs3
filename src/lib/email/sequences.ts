/**
 * Email Sequences Service
 * Maneja el envio automatico de emails de nurturing
 */

import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { getWelcomeEmailSubject, getWelcomeEmailHtml } from './templates/welcome';
import { getCaseStudyEmailSubject, getCaseStudyEmailHtml } from './templates/case-study';
import { getOfferCallEmailSubject, getOfferCallEmailHtml } from './templates/offer-call';

// Lazy initialization para evitar error en build
let resendClient: Resend | null = null;

const getResend = (): Resend => {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurada');
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

// Configuracion de secuencia (en horas)
const SEQUENCE_CONFIG = {
  WELCOME: { emailNumber: 1, delayHours: 0 },       // Inmediato
  CASE_STUDY: { emailNumber: 2, delayHours: 24 },   // 24h despues
  OFFER_CALL: { emailNumber: 3, delayHours: 48 },   // 48h despues
};

interface SequenceResult {
  processed: number;
  emailsSent: number;
  errors: string[];
}

/**
 * Procesa todas las secuencias de email pendientes
 * Llamado por el cron job cada hora
 */
export async function processEmailSequences(): Promise<SequenceResult> {
  const result: SequenceResult = {
    processed: 0,
    emailsSent: 0,
    errors: []
  };

  try {
    // Buscar leads elegibles para secuencia
    const leads = await prisma.lead.findMany({
      where: {
        email: { not: null },
        emailSequenceActive: true,
        lastEmailSent: { lt: 3 }, // No ha recibido todos los emails
        status: { in: ['NEW', 'CONTACTED'] } // Solo leads activos
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`[Sequences] Procesando ${leads.length} leads elegibles`);

    for (const lead of leads) {
      result.processed++;

      try {
        const hoursSinceCreation = getHoursSince(lead.createdAt);
        const hoursSinceLastEmail = lead.lastEmailSentAt
          ? getHoursSince(lead.lastEmailSentAt)
          : hoursSinceCreation;

        // Determinar que email enviar
        const nextEmail = determineNextEmail(
          lead.lastEmailSent,
          hoursSinceCreation,
          hoursSinceLastEmail
        );

        if (nextEmail) {
          const success = await sendSequenceEmail(lead, nextEmail);
          if (success) {
            result.emailsSent++;
          } else {
            result.errors.push(`Lead ${lead.id}: Fallo envio email ${nextEmail}`);
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        result.errors.push(`Lead ${lead.id}: ${errorMsg}`);
        console.error(`[Sequences] Error procesando lead ${lead.id}:`, error);
      }
    }

    console.log(`[Sequences] Resultado: ${result.emailsSent} emails enviados de ${result.processed} procesados`);

  } catch (error) {
    console.error('[Sequences] Error general:', error);
    result.errors.push(error instanceof Error ? error.message : 'Error general');
  }

  return result;
}

/**
 * Determina cual email enviar basado en el estado actual
 */
function determineNextEmail(
  lastEmailSent: number,
  hoursSinceCreation: number,
  hoursSinceLastEmail: number
): number | null {
  // Email 1: Welcome (inmediato, si no se ha enviado)
  if (lastEmailSent === 0 && hoursSinceCreation >= SEQUENCE_CONFIG.WELCOME.delayHours) {
    return 1;
  }

  // Email 2: Case Study (24h despues del ultimo email)
  if (lastEmailSent === 1 && hoursSinceLastEmail >= SEQUENCE_CONFIG.CASE_STUDY.delayHours) {
    return 2;
  }

  // Email 3: Offer Call (24h despues del ultimo email, 48h desde creacion)
  if (lastEmailSent === 2 && hoursSinceLastEmail >= 24 && hoursSinceCreation >= SEQUENCE_CONFIG.OFFER_CALL.delayHours) {
    return 3;
  }

  return null;
}

/**
 * Envia un email de la secuencia
 */
async function sendSequenceEmail(
  lead: {
    id: string;
    email: string | null;
    name: string | null;
    interests: string[];
    lastEmailSent: number;
  },
  emailNumber: number
): Promise<boolean> {
  if (!lead.email) return false;

  // Verificar API key
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Sequences] RESEND_API_KEY no configurada, simulando envio');
    // Actualizar estado aunque no se envie (para testing)
    await updateLeadAfterEmail(lead.id, emailNumber);
    return true;
  }

  const leadName = lead.name || 'estimado/a';
  let subject: string;
  let html: string;

  switch (emailNumber) {
    case 1:
      subject = getWelcomeEmailSubject(leadName);
      html = getWelcomeEmailHtml({ leadName, interests: lead.interests });
      break;
    case 2:
      subject = getCaseStudyEmailSubject();
      html = getCaseStudyEmailHtml({ leadName, interests: lead.interests });
      break;
    case 3:
      subject = getOfferCallEmailSubject(leadName);
      html = getOfferCallEmailHtml({ leadName });
      break;
    default:
      console.error(`[Sequences] Email number ${emailNumber} no reconocido`);
      return false;
  }

  try {
    const { error } = await getResend().emails.send({
      from: 'Alejandro de TunixLabs <noreply@tunixlabs.com>',
      to: lead.email,
      subject,
      html
    });

    if (error) {
      console.error(`[Sequences] Error Resend:`, error);
      return false;
    }

    // Actualizar lead y crear actividad
    await updateLeadAfterEmail(lead.id, emailNumber);

    console.log(`[Sequences] Email ${emailNumber} enviado a ${lead.email}`);
    return true;

  } catch (error) {
    console.error(`[Sequences] Error enviando email:`, error);
    return false;
  }
}

/**
 * Actualiza el lead despues de enviar un email
 */
async function updateLeadAfterEmail(leadId: string, emailNumber: number): Promise<void> {
  const emailNames = ['', 'Bienvenida', 'Caso de Exito', 'Oferta Llamada'];

  await prisma.$transaction([
    // Actualizar lead
    prisma.lead.update({
      where: { id: leadId },
      data: {
        lastEmailSent: emailNumber,
        lastEmailSentAt: new Date(),
        // Si es el ultimo email, marcar como CONTACTED
        ...(emailNumber === 3 ? { status: 'CONTACTED' } : {})
      }
    }),
    // Crear actividad
    prisma.activity.create({
      data: {
        leadId,
        type: 'email_sent',
        details: `Email de secuencia enviado: ${emailNames[emailNumber]}`
      }
    })
  ]);
}

/**
 * Calcula las horas transcurridas desde una fecha
 */
function getHoursSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
}

/**
 * Desactiva la secuencia para un lead (unsubscribe)
 */
export async function unsubscribeLead(leadId: string): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: { emailSequenceActive: false }
  });

  await prisma.activity.create({
    data: {
      leadId,
      type: 'lead_updated',
      details: 'Lead se dio de baja de la secuencia de emails'
    }
  });
}

/**
 * Envia email de bienvenida inmediatamente (para nuevos leads)
 */
export async function sendWelcomeEmailImmediately(
  leadId: string,
  email: string,
  name: string | null,
  interests: string[]
): Promise<boolean> {
  // Verificar si ya se envio
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { lastEmailSent: true }
  });

  if (lead && lead.lastEmailSent > 0) {
    console.log(`[Sequences] Lead ${leadId} ya recibio email de bienvenida`);
    return false;
  }

  return sendSequenceEmail(
    { id: leadId, email, name, interests, lastEmailSent: 0 },
    1
  );
}
