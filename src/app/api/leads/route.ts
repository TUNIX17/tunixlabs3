/**
 * API Route: /api/leads
 * GET: Listar leads con filtros
 * POST: Crear lead manual
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parametros de filtro
    const status = searchParams.get('status') as LeadStatus | null;
    const search = searchParams.get('search');
    const source = searchParams.get('source');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.createdAt as Record<string, Date>).lte = new Date(endDate);
      }
    }

    // Obtener leads con paginacion
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { messages: true, activities: true }
          }
        }
      }),
      prisma.lead.count({ where })
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error listando leads:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos minimos
    if (!body.name && !body.email) {
      return NextResponse.json(
        { error: 'Se requiere nombre o email' },
        { status: 400 }
      );
    }

    // Verificar si ya existe por email
    if (body.email) {
      const existing = await prisma.lead.findFirst({
        where: { email: body.email }
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Ya existe un lead con este email', leadId: existing.id },
          { status: 409 }
        );
      }
    }

    // Crear lead
    const lead = await prisma.lead.create({
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
        source: body.source || 'manual',
        notes: body.notes,
        status: body.status || 'NEW'
      }
    });

    // Actividad de creacion
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'lead_created',
        details: 'Lead creado manualmente'
      }
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });

  } catch (error) {
    console.error('Error creando lead:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
