/**
 * API Route: /api/leads/[id]
 * GET: Obtener lead por ID
 * PUT: Actualizar lead
 * DELETE: Eliminar lead
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { UpdateLeadSchema } from '@/lib/validation/schemas';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth(request);
  if (authError) return authError;

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
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });

  } catch (error) {
    console.error('Error obteniendo lead:', error);
    return NextResponse.json(
      { error: 'Error loading lead' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate body with Zod (UpdateLeadSchema does not allow score)
    const parsed = UpdateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update data' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verificar que existe
    const existing = await prisma.lead.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Track de cambios para actividad
    const changes: string[] = [];
    if (data.status && data.status !== existing.status) {
      changes.push(`Status: ${existing.status} → ${data.status}`);
    }
    if (data.notes && data.notes !== existing.notes) {
      changes.push('Notas actualizadas');
    }

    // Actualizar lead - score is never set from the request body
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        company: data.company ?? existing.company,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
        role: data.role ?? existing.role,
        interests: data.interests ?? existing.interests,
        painPoints: data.painPoints ?? existing.painPoints,
        budget: data.budget ?? existing.budget,
        timeline: data.timeline ?? existing.timeline,
        companySize: data.companySize ?? existing.companySize,
        location: data.location ?? existing.location,
        status: data.status ?? existing.status,
        notes: data.notes ?? existing.notes,
      }
    });

    // Registrar actividad si hubo cambios significativos
    if (changes.length > 0) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: data.status !== existing.status ? 'status_changed' : 'lead_updated',
          details: changes.join(', ')
        }
      });
    }

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error('Error actualizando lead:', error);
    return NextResponse.json(
      { error: 'Error updating lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    // Verificar que existe
    const existing = await prisma.lead.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Lead not found' },
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
      { error: 'Error deleting lead' },
      { status: 500 }
    );
  }
}
