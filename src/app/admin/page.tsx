'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Cargar charts dinamicamente para evitar problemas de SSR
const StatusPieChart = dynamic(
  () => import('@/components/admin/charts/StatusPieChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const LeadsLineChart = dynamic(
  () => import('@/components/admin/charts/LeadsLineChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const ScoreBarChart = dynamic(
  () => import('@/components/admin/charts/ScoreBarChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface Stats {
  total: number;
  new: number;
  qualified: number;
  meetings: number;
  won: number;
}

interface RecentLead {
  id: string;
  name: string | null;
  company: string | null;
  email: string | null;
  status: string;
  score: number;
  createdAt: string;
}

interface AnalyticsData {
  totalLeads: number;
  byStatus: { name: string; value: number; status: string }[];
  byDay: { date: string; count: number }[];
  byScore: { range: string; count: number }[];
  engagementMetrics: {
    avgSessionDuration: number;
    avgTurnCount: number;
  };
}

function ChartSkeleton() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-pulse bg-gray-200 rounded w-full h-full"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, qualified: 0, meetings: 0, won: 0 });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch leads and analytics in parallel
      const [leadsRes, analyticsRes] = await Promise.all([
        fetch('/api/leads?limit=100'),
        fetch('/api/leads/analytics')
      ]);

      const leadsData = await leadsRes.json();
      const analyticsData = await analyticsRes.json();

      if (leadsData.leads) {
        const leads = leadsData.leads;

        // Calculate stats
        const newStats: Stats = {
          total: leadsData.pagination.total,
          new: leads.filter((l: RecentLead) => l.status === 'NEW').length,
          qualified: leads.filter((l: RecentLead) => l.status === 'QUALIFIED').length,
          meetings: leads.filter((l: RecentLead & { meetingScheduled?: boolean }) => l.meetingScheduled).length,
          won: leads.filter((l: RecentLead) => l.status === 'WON').length
        };

        setStats(newStats);
        setRecentLeads(leads.slice(0, 5));
      }

      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: '👥', color: 'bg-blue-500' },
    { label: 'Nuevos', value: stats.new, icon: '🆕', color: 'bg-green-500' },
    { label: 'Calificados', value: stats.qualified, icon: '✅', color: 'bg-purple-500' },
    { label: 'Reuniones', value: stats.meetings, icon: '📅', color: 'bg-orange-500' },
    { label: 'Ganados', value: stats.won, icon: '🏆', color: 'bg-teal-500' },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-green-100 text-green-800',
      CONTACTED: 'bg-blue-100 text-blue-800',
      QUALIFIED: 'bg-purple-100 text-purple-800',
      PROPOSAL: 'bg-yellow-100 text-yellow-800',
      WON: 'bg-teal-100 text-teal-800',
      LOST: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vista general de leads capturados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} text-white p-3 rounded-lg text-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Metrics */}
      {analytics?.engagementMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg text-2xl">⏱️</div>
              <div>
                <p className="text-3xl font-bold">
                  {formatDuration(analytics.engagementMetrics.avgSessionDuration)}
                </p>
                <p className="text-white/80 text-sm">Duracion Promedio de Sesion</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg text-2xl">💬</div>
              <div>
                <p className="text-3xl font-bold">
                  {analytics.engagementMetrics.avgTurnCount}
                </p>
                <p className="text-white/80 text-sm">Turnos Promedio por Conversacion</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads por Estado</h3>
          {analytics?.byStatus ? (
            <StatusPieChart data={analytics.byStatus} />
          ) : (
            <ChartSkeleton />
          )}
        </div>

        {/* Leads Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads Ultimos 30 Dias</h3>
          {analytics?.byDay ? (
            <LeadsLineChart data={analytics.byDay} />
          ) : (
            <ChartSkeleton />
          )}
        </div>

        {/* Score Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribucion de Score</h3>
          {analytics?.byScore ? (
            <ScoreBarChart data={analytics.byScore} />
          ) : (
            <ChartSkeleton />
          )}
        </div>
      </div>

      {/* Recent Leads & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Leads Recientes</h2>
            <Link
              href="/admin/leads"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No hay leads aun</p>
                <p className="text-sm mt-1">Los leads capturados por el voice agent apareceran aqui</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold">
                      {(lead.name || lead.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {lead.name || 'Sin nombre'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lead.company || lead.email || 'Sin datos'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      Score: {lead.score}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rapidas</h2>

          <div className="space-y-3">
            <Link
              href="/api/leads/export"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors"
            >
              <span className="text-xl">📥</span>
              <div>
                <p className="font-medium text-gray-900">Exportar CSV</p>
                <p className="text-xs text-gray-500">Descargar todos los leads</p>
              </div>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors"
            >
              <span className="text-xl">🔍</span>
              <div>
                <p className="font-medium text-gray-900">Buscar Leads</p>
                <p className="text-xs text-gray-500">Filtrar y buscar</p>
              </div>
            </Link>

            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors"
            >
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-medium text-gray-900">Ir al Sitio</p>
                <p className="text-xs text-gray-500">Probar voice agent</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
