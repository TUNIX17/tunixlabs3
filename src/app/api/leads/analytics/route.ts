/**
 * API Route: /api/leads/analytics
 * Proporciona datos agregados para graficos del dashboard
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface ByStatusItem {
  status: string;
  _count: number;
}

interface ByDayItem {
  date: string;
  count: number;
}

interface ByScoreItem {
  range: string;
  count: number;
}

interface FunnelItem {
  stage: string;
  count: number;
  percentage: number;
}

export async function GET() {
  try {
    // Obtener fecha hace 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Ejecutar todas las queries en paralelo
    const [
      totalLeads,
      byStatus,
      leadsByDay,
      scoreDistribution,
      recentLeads,
      avgSessionDuration,
      avgTurnCount
    ] = await Promise.all([
      // Total leads
      prisma.lead.count(),

      // Leads por status
      prisma.lead.groupBy({
        by: ['status'],
        _count: true
      }),

      // Leads por dia (ultimos 30 dias)
      prisma.$queryRaw<{ date: string; count: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM leads
        WHERE created_at >= ${thirtyDaysAgo}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,

      // Distribucion de scores
      prisma.$queryRaw<{ range: string; count: bigint }[]>`
        SELECT
          CASE
            WHEN score >= 0 AND score <= 25 THEN '0-25'
            WHEN score > 25 AND score <= 50 THEN '26-50'
            WHEN score > 50 AND score <= 75 THEN '51-75'
            WHEN score > 75 AND score <= 100 THEN '76-100'
            ELSE 'unknown'
          END as range,
          COUNT(*) as count
        FROM leads
        GROUP BY range
        ORDER BY range
      `,

      // Leads recientes con score alto
      prisma.lead.findMany({
        where: {
          score: { gte: 50 }
        },
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          score: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Promedio de duracion de sesion
      prisma.lead.aggregate({
        _avg: {
          sessionDurationSeconds: true
        },
        where: {
          sessionDurationSeconds: { not: null }
        }
      }),

      // Promedio de turnos
      prisma.lead.aggregate({
        _avg: {
          turnCount: true
        },
        where: {
          turnCount: { gt: 0 }
        }
      })
    ]);

    // Formatear datos por status
    const statusData = byStatus.map((item: { status: string; _count: number }) => ({
      name: formatStatus(item.status),
      value: item._count,
      status: item.status
    }));

    // Formatear datos por dia
    const dailyData = leadsByDay.map((item: { date: string; count: bigint }) => ({
      date: new Date(item.date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
      count: Number(item.count)
    }));

    // Formatear datos de score
    const scoreData = scoreDistribution.map((item: { range: string; count: bigint }) => ({
      range: item.range,
      count: Number(item.count)
    }));

    // Calcular funnel de conversion
    const funnel = calculateFunnel(byStatus);

    // Metricas de engagement
    const engagementMetrics = {
      avgSessionDuration: avgSessionDuration._avg.sessionDurationSeconds
        ? Math.round(avgSessionDuration._avg.sessionDurationSeconds)
        : 0,
      avgTurnCount: avgTurnCount._avg.turnCount
        ? Math.round(avgTurnCount._avg.turnCount * 10) / 10
        : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        byStatus: statusData,
        byDay: dailyData,
        byScore: scoreData,
        funnel,
        recentHighScoreLeads: recentLeads,
        engagementMetrics
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Analytics] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * Formatear status para mostrar
 */
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'NEW': 'Nuevo',
    'CONTACTED': 'Contactado',
    'QUALIFIED': 'Calificado',
    'PROPOSAL': 'Propuesta',
    'WON': 'Ganado',
    'LOST': 'Perdido'
  };
  return statusMap[status] || status;
}

/**
 * Calcular funnel de conversion
 */
function calculateFunnel(byStatus: { status: string; _count: number }[]): FunnelItem[] {
  const statusOrder = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON'];
  const total = byStatus.reduce((sum, item) => sum + item._count, 0);

  if (total === 0) {
    return statusOrder.map(stage => ({
      stage: formatStatus(stage),
      count: 0,
      percentage: 0
    }));
  }

  let accumulated = total;
  return statusOrder.map(stage => {
    const item = byStatus.find(s => s.status === stage);
    const count = item?._count || 0;
    const percentage = Math.round((accumulated / total) * 100);
    accumulated -= count;

    return {
      stage: formatStatus(stage),
      count,
      percentage
    };
  });
}
