/**
 * API Route: /api/leads
 * GET: Listar leads con filtros
 * POST: Crear lead manual
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, getClientIP } from '@/lib/auth';
import { CreateLeadSchema, LeadQuerySchema } from '@/lib/validation/schemas';
import { apiLimiter } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    const authError = requireAuth(request);
    if (authError) return authError;

    const ip = getClientIP(request);
    const rl = apiLimiter.check(ip);
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);

    // Validate and parse query parameters with Zod
    const parsed = LeadQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { status, search, source, startDate, endDate, page, limit } = parsed.data;

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
      { error: 'Error loading leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = requireAuth(request);
    if (authError) return authError;

    const ip = getClientIP(request);
    const rl = apiLimiter.check(ip);
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();

    // Validate body with Zod
    const parsed = CreateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid lead data' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verificar si ya existe por email
    if (data.email) {
      const existing = await prisma.lead.findFirst({
        where: { email: data.email }
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A lead with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Crear lead - status always defaults to NEW (not settable from request)
    const lead = await prisma.lead.create({
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
        source: data.source || 'manual',
        notes: data.notes,
        status: 'NEW'
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
      { error: 'Error creating lead' },
      { status: 500 }
    );
  }
}
