/**
 * API Route: /api/leads/[id]
 * GET: Obtener lead por ID
 * PUT: Actualizar lead
 * DELETE: Eliminar lead
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });

  } catch (error) {
    console.error('Error obteniendo lead:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar que existe
    const existing = await prisma.lead.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Track de cambios para actividad
    const changes: string[] = [];
    if (body.status && body.status !== existing.status) {
      changes.push(`Status: ${existing.status} → ${body.status}`);
    }
    if (body.notes && body.notes !== existing.notes) {
      changes.push('Notas actualizadas');
    }

    // Actualizar lead
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        company: body.company ?? existing.company,
        email: body.email ?? existing.email,
        phone: body.phone ?? existing.phone,
        role: body.role ?? existing.role,
        interests: body.interests ?? existing.interests,
        painPoints: body.painPoints ?? existing.painPoints,
        budget: body.budget ?? existing.budget,
        timeline: body.timeline ?? existing.timeline,
        companySize: body.companySize ?? existing.companySize,
        location: body.location ?? existing.location,
        status: body.status ?? existing.status,
        score: body.score ?? existing.score,
        notes: body.notes ?? existing.notes,
        meetingScheduled: body.meetingScheduled ?? existing.meetingScheduled,
        meetingDate: body.meetingDate ? new Date(body.meetingDate) : existing.meetingDate
      }
    });

    // Registrar actividad si hubo cambios significativos
    if (changes.length > 0) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: body.status !== existing.status ? 'status_changed' : 'lead_updated',
          details: changes.join(', ')
        }
      });
    }

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error('Error actualizando lead:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verificar que existe
    const existing = await prisma.lead.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar lead (cascade elimina messages y activities)
    await prisma.lead.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Lead eliminado' });

  } catch (error) {
    console.error('Error eliminando lead:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
