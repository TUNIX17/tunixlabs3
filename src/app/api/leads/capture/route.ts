/**
 * API Route: /api/leads/capture
 * Captura leads desde el voice agent
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendLeadNotification } from '@/lib/email/resend';

interface CaptureLeadRequest {
  // Datos del lead
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  role?: string;
  interests?: string[];
  painPoints?: string[];
  budget?: string;
  timeline?: string;
  companySize?: string;
  location?: string;
  meetingScheduled?: boolean;

  // Datos de la sesion
  sessionId?: string;
  conversationPhase?: string;
  turnCount?: number;
  source?: string;

  // Mensajes de la conversacion
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptureLeadRequest = await request.json();

    // Validar que hay datos minimos
    const hasMinimalData = body.name || body.email || (body.interests && body.interests.length > 0);

    if (!hasMinimalData) {
      return NextResponse.json(
        { error: 'Se requiere al menos nombre, email o intereses' },
        { status: 400 }
      );
    }

    // Buscar lead existente por sessionId o email
    let existingLead = null;

    if (body.sessionId) {
      existingLead = await prisma.lead.findFirst({
        where: { sessionId: body.sessionId }
      });
    }

    if (!existingLead && body.email) {
      existingLead = await prisma.lead.findFirst({
        where: { email: body.email }
      });
    }

    let lead;

    if (existingLead) {
      // Actualizar lead existente (merge de datos)
      lead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name: body.name || existingLead.name,
          company: body.company || existingLead.company,
          email: body.email || existingLead.email,
          phone: body.phone || existingLead.phone,
          role: body.role || existingLead.role,
          interests: body.interests?.length ? body.interests : existingLead.interests,
          painPoints: body.painPoints?.length ? body.painPoints : existingLead.painPoints,
          budget: body.budget || existingLead.budget,
          timeline: body.timeline || existingLead.timeline,
          companySize: body.companySize || existingLead.companySize,
          location: body.location || existingLead.location,
          meetingScheduled: body.meetingScheduled ?? existingLead.meetingScheduled,
          conversationPhase: body.conversationPhase || existingLead.conversationPhase,
          turnCount: body.turnCount ?? existingLead.turnCount,
          updatedAt: new Date()
        }
      });

      // Agregar actividad de actualizacion
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'lead_updated',
          details: `Datos actualizados desde ${body.source || 'voice-agent'}`
        }
      });
    } else {
      // Crear nuevo lead
      lead = await prisma.lead.create({
        data: {
          name: body.name,
          company: body.company,
          email: body.email,
          phone: body.phone,
          role: body.role,
          interests: body.interests || [],
          painPoints: body.painPoints || [],
          budget: body.budget,
          timeline: body.timeline,
          companySize: body.companySize,
          location: body.location,
          meetingScheduled: body.meetingScheduled || false,
          sessionId: body.sessionId,
          conversationPhase: body.conversationPhase,
          turnCount: body.turnCount || 0,
          source: body.source || 'voice-agent',
          score: calculateLeadScore(body)
        }
      });

      // Agregar actividad de creacion
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: 'lead_created',
          details: `Lead capturado desde ${body.source || 'voice-agent'}`
        }
      });

      // Enviar notificacion por email si hay datos relevantes
      if (body.email || body.name) {
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
    if (body.messages && body.messages.length > 0) {
      await prisma.message.createMany({
        data: body.messages.map(msg => ({
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Calcular score del lead basado en datos disponibles
 */
function calculateLeadScore(data: CaptureLeadRequest): number {
  let score = 0;

  // Datos de contacto (+10 cada uno)
  if (data.name) score += 10;
  if (data.email) score += 15;
  if (data.phone) score += 10;
  if (data.company) score += 10;

  // Calificacion (+10 cada uno)
  if (data.interests && data.interests.length > 0) score += 10;
  if (data.painPoints && data.painPoints.length > 0) score += 10;
  if (data.budget) score += 15;
  if (data.timeline) score += 10;
  if (data.companySize) score += 5;

  // Reunion agendada (+20)
  if (data.meetingScheduled) score += 20;

  // Fase de conversacion
  if (data.conversationPhase === 'booking') score += 15;
  else if (data.conversationPhase === 'presentation') score += 10;
  else if (data.conversationPhase === 'qualification') score += 5;

  return Math.min(score, 100); // Max 100
}
