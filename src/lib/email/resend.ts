/**
 * Servicio de Email con Resend
 * Notificaciones de nuevos leads
 */

import { Resend } from 'resend';
import type { Lead } from '@prisma/client';

// Cliente Resend (puede ser null si no esta configurado)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'contacto@tunixlabs.com';

/**
 * Enviar notificacion de nuevo lead
 */
export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  if (!resend) {
    console.warn('[Email] Resend no configurado - RESEND_API_KEY no definida');
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: 'Tunix <noreply@tunixlabs.com>',
      to: NOTIFICATION_EMAIL,
      subject: `🎯 Nuevo Lead: ${lead.name || 'Sin nombre'} - ${lead.company || 'Sin empresa'}`,
      html: generateLeadEmailHtml(lead)
    });

    console.log('[Email] Notificacion enviada:', result);
    return true;
  } catch (error) {
    console.error('[Email] Error enviando notificacion:', error);
    return false;
  }
}

/**
 * Enviar notificacion de reunion agendada
 */
export async function sendMeetingNotification(lead: Lead): Promise<boolean> {
  if (!resend) {
    console.warn('[Email] Resend no configurado - RESEND_API_KEY no definida');
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: 'Tunix <noreply@tunixlabs.com>',
      to: NOTIFICATION_EMAIL,
      subject: `📅 Reunion Agendada: ${lead.name || 'Sin nombre'} - ${lead.company || 'Sin empresa'}`,
      html: generateMeetingEmailHtml(lead)
    });

    console.log('[Email] Notificacion de reunion enviada:', result);
    return true;
  } catch (error) {
    console.error('[Email] Error enviando notificacion de reunion:', error);
    return false;
  }
}

/**
 * Generar HTML del email de nuevo lead
 */
function generateLeadEmailHtml(lead: Lead): string {
  const scoreColor = lead.score >= 70 ? '#22c55e' : lead.score >= 40 ? '#f59e0b' : '#6b7280';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .score { display: inline-block; background: ${scoreColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .field { margin-bottom: 16px; }
        .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 16px; color: #111827; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 13px; }
        .cta { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Nuevo Lead Capturado</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Via ${lead.source || 'voice-agent'}</p>
        </div>

        <div class="content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
              <h2 style="margin: 0; font-size: 20px;">${lead.name || 'Sin nombre'}</h2>
              <p style="margin: 4px 0 0; color: #6b7280;">${lead.company || 'Sin empresa'}</p>
            </div>
            <span class="score">Score: ${lead.score}</span>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value">${lead.email || 'No proporcionado'}</div>
          </div>

          <div class="field">
            <div class="label">Telefono</div>
            <div class="value">${lead.phone || 'No proporcionado'}</div>
          </div>

          ${lead.interests && lead.interests.length > 0 ? `
          <div class="field">
            <div class="label">Intereses</div>
            <div class="tags">
              ${lead.interests.map(i => `<span class="tag">${i}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          ${lead.painPoints && lead.painPoints.length > 0 ? `
          <div class="field">
            <div class="label">Pain Points</div>
            <div class="tags">
              ${lead.painPoints.map(p => `<span class="tag" style="background: #fee2e2; color: #dc2626;">${p}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">Fase de Conversacion</div>
            <div class="value">${lead.conversationPhase || 'No especificada'}</div>
          </div>

          <div class="field">
            <div class="label">Reunion Agendada</div>
            <div class="value">${lead.meetingScheduled ? '✅ Si' : '❌ No'}</div>
          </div>

          <a href="https://tunixlabs.com/admin/leads/${lead.id}" class="cta">Ver en CRM →</a>
        </div>

        <div class="footer">
          <p>TunixLabs - Sistema de Captura de Leads</p>
          <p>Este email fue generado automaticamente</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generar HTML del email de reunion agendada
 */
function generateMeetingEmailHtml(lead: Lead): string {
  const meetingDateStr = lead.meetingDate
    ? new Date(lead.meetingDate).toLocaleString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Fecha no especificada';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .meeting-box { background: white; border: 2px solid #7c3aed; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .field { margin-bottom: 16px; }
        .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 16px; color: #111827; }
        .cta { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">📅 Reunion Agendada</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Un lead ha agendado una llamada</p>
        </div>

        <div class="content">
          <div class="meeting-box">
            <h2 style="margin: 0 0 12px; color: #7c3aed;">Detalles de la Reunion</h2>
            <p style="font-size: 18px; margin: 0;"><strong>${meetingDateStr}</strong></p>
          </div>

          <div class="field">
            <div class="label">Nombre</div>
            <div class="value">${lead.name || 'Sin nombre'}</div>
          </div>

          <div class="field">
            <div class="label">Empresa</div>
            <div class="value">${lead.company || 'Sin empresa'}</div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value">${lead.email || 'No proporcionado'}</div>
          </div>

          <a href="https://tunixlabs.com/admin/leads/${lead.id}" class="cta">Ver Lead en CRM →</a>
        </div>

        <div class="footer">
          <p>TunixLabs - Sistema de Captura de Leads</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
  sendLeadNotification,
  sendMeetingNotification
};
