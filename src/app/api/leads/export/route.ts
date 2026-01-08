/**
 * API Route: /api/leads/export
 * GET: Exportar leads a CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    // Obtener todos los leads
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
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
      lead.id,
      lead.name || '',
      lead.company || '',
      lead.email || '',
      lead.phone || '',
      lead.role || '',
      (lead.interests || []).join('; '),
      (lead.painPoints || []).join('; '),
      lead.budget || '',
      lead.timeline || '',
      lead.companySize || '',
      lead.location || '',
      lead.status,
      lead.score.toString(),
      lead.source || '',
      lead.meetingScheduled ? 'Si' : 'No',
      lead.meetingDate ? new Date(lead.meetingDate).toISOString() : '',
      lead.conversationPhase || '',
      lead.turnCount.toString(),
      (lead.notes || '').replace(/"/g, '""'),
      new Date(lead.createdAt).toISOString(),
      new Date(lead.updatedAt).toISOString()
    ]);

    // Escapar campos CSV
    const escapeCSV = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
