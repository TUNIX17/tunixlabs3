/**
 * API Route: /api/leads/analytics
 * Proporciona datos agregados para graficos del dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface FunnelItem {
  stage: string;
  count: number;
  percentage: number;
}

export async function GET(request: NextRequest) {
  try {
    const authError = requireAuth(request);
    if (authError) return authError;

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

      // Leads de los ultimos 30 dias (se agrupan por dia en memoria; evita SQL
      // crudo atado a nombres de tabla/columna que el schema de Prisma no usa)
      prisma.lead.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true }
      }),

      // Scores de todos los leads (para la distribucion por rango)
      prisma.lead.findMany({
        select: { score: true }
      }),

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

    // Formatear datos por dia (agrupados por fecha YYYY-MM-DD, en orden)
    const countsByDay = new Map<string, number>();
    for (const { createdAt } of leadsByDay) {
      const day = createdAt.toISOString().slice(0, 10);
      countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
    }
    const dailyData = Array.from(countsByDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        count
      }));

    // Formatear datos de score (mismos rangos que antes, ordenados por rango)
    const rangeOf = (score: number) =>
      score >= 0 && score <= 25 ? '0-25'
      : score > 25 && score <= 50 ? '26-50'
      : score > 50 && score <= 75 ? '51-75'
      : score > 75 && score <= 100 ? '76-100'
      : 'unknown';
    const countsByRange = new Map<string, number>();
    for (const { score } of scoreDistribution) {
      const range = rangeOf(score);
      countsByRange.set(range, (countsByRange.get(range) ?? 0) + 1);
    }
    const scoreData = Array.from(countsByRange.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([range, count]) => ({ range, count }));

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
      { error: 'Error loading analytics' },
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
