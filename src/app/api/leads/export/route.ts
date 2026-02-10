/**
 * API Route: /api/leads/export
 * GET: Exportar leads a CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, getClientIP } from '@/lib/auth';
import { exportLimiter } from '@/lib/rateLimit';
import { sanitizeForCSV } from '@/lib/validation/sanitize';

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const ip = getClientIP(request);
  const rl = exportLimiter.check(ip);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // Parametros de filtro opcionales
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
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

    // Obtener leads con hard limit
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10000
    });

    // Generar CSV
    const headers = [
      'ID',
      'Nombre',
      'Empresa',
      'Email',
      'Telefono',
      'Rol',
      'Intereses',
      'Pain Points',
      'Budget',
      'Timeline',
      'Tamano Empresa',
      'Ubicacion',
      'Status',
      'Score',
      'Fuente',
      'Reunion Agendada',
      'Fecha Reunion',
      'Fase Conversacion',
      'Turnos',
      'Notas',
      'Creado',
      'Actualizado'
    ];

    const rows = leads.map(lead => [
      sanitizeForCSV(lead.id),
      sanitizeForCSV(lead.name || ''),
      sanitizeForCSV(lead.company || ''),
      sanitizeForCSV(lead.email || ''),
      sanitizeForCSV(lead.phone || ''),
      sanitizeForCSV(lead.role || ''),
      sanitizeForCSV((lead.interests || []).join('; ')),
      sanitizeForCSV((lead.painPoints || []).join('; ')),
      sanitizeForCSV(lead.budget || ''),
      sanitizeForCSV(lead.timeline || ''),
      sanitizeForCSV(lead.companySize || ''),
      sanitizeForCSV(lead.location || ''),
      sanitizeForCSV(lead.status),
      sanitizeForCSV(lead.score.toString()),
      sanitizeForCSV(lead.source || ''),
      sanitizeForCSV(lead.meetingScheduled ? 'Si' : 'No'),
      sanitizeForCSV(lead.meetingDate ? new Date(lead.meetingDate).toISOString() : ''),
      sanitizeForCSV(lead.conversationPhase || ''),
      sanitizeForCSV(lead.turnCount.toString()),
      sanitizeForCSV(lead.notes || ''),
      sanitizeForCSV(new Date(lead.createdAt).toISOString()),
      sanitizeForCSV(new Date(lead.updatedAt).toISOString())
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Retornar como archivo CSV
    const filename = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Error exportando leads:', error);
    return NextResponse.json(
      { error: 'Error exporting leads' },
      { status: 500 }
    );
  }
}
