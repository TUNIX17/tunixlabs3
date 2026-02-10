/**
 * API Route: /api/leads/capture
 * Captura leads desde el voice agent
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendLeadNotification } from '@/lib/email/resend';
import { requireProxyAuth, getClientIP } from '@/lib/auth';
import { CaptureLeadSchema } from '@/lib/validation/schemas';
import { captureLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const authError = requireProxyAuth(request);
  if (authError) return authError;

  const ip = getClientIP(request);
  const rl = captureLimiter.check(ip);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();

    // Validate body with Zod
    const parsed = CaptureLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid capture data' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Validar que hay datos minimos
    const hasMinimalData = data.name || data.email || (data.interests && data.interests.length > 0);

    if (!hasMinimalData) {
      return NextResponse.json(
        { error: 'At least name, email, or interests is required' },
        { status: 400 }
      );
    }

    // Buscar lead existente por sessionId o email
    let existingLead = null;

    if (data.sessionId) {
      existingLead = await prisma.lead.findFirst({
        where: { sessionId: data.sessionId }
      });
    }

    if (!existingLead && data.email) {
      existingLead = await prisma.lead.findFirst({
        where: { email: data.email }
      });
    }

    let lead;

    if (existingLead) {
      // Actualizar lead existente (merge de datos)
      lead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name: data.name || existingLead.name,
          company: data.company || existingLead.company,
          email: data.email || existingLead.email,
          phone: data.phone || existingLead.phone,
          role: data.role || existingLead.role,
          interests: data.interests?.length ? data.interests : existingLead.interests,
          painPoints: data.painPoints?.length ? data.painPoints : existingLead.painPoints,
          budget: data.budget || existingLead.budget,
          timeline: data.timeline || existingLead.timeline,
          companySize: data.companySize || existingLead.companySize,
          location: data.location || existingLead.location,
          conversationPhase: data.conversationPhase || existingLead.conversationPhase,
          turnCount: data.turnCount ?? existingLead.turnCount,
          updatedAt: new Date()
        }
      });

      // Agregar actividad de actualizacion
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'lead_updated',
          details: `Datos actualizados desde ${data.source || 'voice-agent'}`
        }
      });
    } else {
      // Crear nuevo lead
      lead = await prisma.lead.create({
        data: {
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          role: data.role,
          interests: data.interests || [],
          painPoints: data.painPoints || [],
          budget: data.budget,
          timeline: data.timeline,
          companySize: data.companySize,
          location: data.location,
          meetingScheduled: false,
          sessionId: data.sessionId,
          conversationPhase: data.conversationPhase,
          turnCount: data.turnCount || 0,
          sessionDurationSeconds: data.sessionDurationSeconds,
          source: data.source || 'voice-agent',
          score: calculateLeadScore(data)
        }
      });

      // Agregar actividad de creacion
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'lead_created',
          details: `Lead capturado desde ${data.source || 'voice-agent'}`
        }
      });

      // Enviar notificacion por email si hay datos relevantes
      if (data.email || data.name) {
        try {
          await sendLeadNotification(lead);

          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: 'email_sent',
              details: 'Notificacion de nuevo lead enviada'
            }
          });
        } catch (emailError) {
          console.error('Error enviando notificacion:', emailError);
          // No fallar si el email no se envia
        }
      }
    }

    // Guardar mensajes de la conversacion si los hay
    if (data.messages && data.messages.length > 0) {
      await prisma.message.createMany({
        data: data.messages.map(msg => ({
          leadId: lead.id,
          role: msg.role,
          content: msg.content
        }))
      });
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      isNew: !existingLead,
      message: existingLead ? 'Lead actualizado' : 'Lead creado'
    });

  } catch (error) {
    console.error('Error capturando lead:', error);
    return NextResponse.json(
      { error: 'Error capturing lead' },
      { status: 500 }
    );
  }
}

/**
 * Calcular score del lead basado en datos disponibles
 * Score mejorado con factores de engagement
 */
function calculateLeadScore(data: {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interests?: string[];
  painPoints?: string[];
  budget?: string;
  timeline?: string;
  companySize?: string;
  turnCount?: number;
  sessionDurationSeconds?: number;
  meetingScheduled?: boolean;
  conversationPhase?: string;
}): number {
  let score = 0;

  // ===== DATOS DE CONTACTO (max 45) =====
  if (data.name) score += 10;
  if (data.email) score += 15;
  if (data.phone) score += 10;
  if (data.company) score += 10;

  // ===== CALIFICACION (max 35) =====
  // Intereses con bonus por multiples
  if (data.interests && data.interests.length > 0) {
    score += 10;
    if (data.interests.length >= 2) score += 5;  // Multiples intereses
  }

  // Pain points con bonus por multiples
  if (data.painPoints && data.painPoints.length > 0) {
    score += 10;
    if (data.painPoints.length >= 2) score += 5;  // Multiples problemas
  }

  if (data.budget) score += 15;
  if (data.timeline) score += 10;
  if (data.companySize) score += 5;

  // ===== ENGAGEMENT (max 30) =====
  // Turnos de conversacion
  if (data.turnCount) {
    if (data.turnCount >= 5) score += 5;   // Conversacion moderada
    if (data.turnCount >= 10) score += 5;  // Conversacion larga
  }

  // Duracion de sesion
  if (data.sessionDurationSeconds) {
    const minutes = data.sessionDurationSeconds / 60;
    if (minutes >= 2) score += 5;   // Sesion > 2 min
    if (minutes >= 5) score += 5;   // Sesion > 5 min
  }

  // Hora del dia (horario laboral Chile: 9-18)
  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 18) score += 3;

  // ===== INTENT SIGNALS (max 25) =====
  // Reunion agendada es la senal mas fuerte
  if (data.meetingScheduled) score += 20;

  // Fase de conversacion
  if (data.conversationPhase === 'booking') score += 15;
  else if (data.conversationPhase === 'presentation') score += 10;
  else if (data.conversationPhase === 'qualification') score += 5;

  return Math.min(score, 100); // Max 100
}
