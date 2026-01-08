'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: string;
  details: string | null;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  interests: string[];
  painPoints: string[];
  budget: string | null;
  timeline: string | null;
  companySize: string | null;
  location: string | null;
  status: string;
  score: number;
  source: string | null;
  meetingScheduled: boolean;
  meetingDate: string | null;
  conversationPhase: string | null;
  turnCount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  activities: Activity[];
}

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchLead();
  }, [resolvedParams.id]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${resolvedParams.id}`);
      const data = await res.json();

      if (data.lead) {
        setLead(data.lead);
        setNotes(data.lead.notes || '');
        setStatus(data.lead.status);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, status })
      });

      if (res.ok) {
        await fetchLead();
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead || !confirm('Estas seguro de eliminar este lead?')) return;

    try {
      const res = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/leads');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getStatusBadge = (s: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-green-100 text-green-800',
      CONTACTED: 'bg-blue-100 text-blue-800',
      QUALIFIED: 'bg-purple-100 text-purple-800',
      PROPOSAL: 'bg-yellow-100 text-yellow-800',
      NEGOTIATION: 'bg-orange-100 text-orange-800',
      WON: 'bg-teal-100 text-teal-800',
      LOST: 'bg-red-100 text-red-800',
    };
    return colors[s] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      lead_created: '🆕',
      lead_updated: '✏️',
      status_changed: '🔄',
      meeting_scheduled: '📅',
      email_sent: '📧',
      note_added: '📝',
    };
    return icons[type] || '📌';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead no encontrado</p>
        <Link href="/admin/leads" className="text-teal-600 mt-2 inline-block">
          ← Volver a leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link href="/admin/leads" className="text-teal-600 text-sm hover:underline mb-2 inline-block">
            ← Volver a leads
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{lead.name || 'Sin nombre'}</h1>
          <p className="text-gray-500">{lead.company || 'Sin empresa'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & Company */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informacion de Contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="text-gray-900">{lead.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Telefono</p>
                <p className="text-gray-900">{lead.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Rol</p>
                <p className="text-gray-900">{lead.role || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Ubicacion</p>
                <p className="text-gray-900">{lead.location || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Tamano Empresa</p>
                <p className="text-gray-900">{lead.companySize || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Budget</p>
                <p className="text-gray-900">{lead.budget || '-'}</p>
              </div>
            </div>
          </div>

          {/* Interests & Pain Points */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Intereses y Necesidades</h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Intereses</p>
                <div className="flex flex-wrap gap-2">
                  {lead.interests.length > 0 ? lead.interests.map((i, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {i}
                    </span>
                  )) : <span className="text-gray-400">-</span>}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Pain Points</p>
                <div className="flex flex-wrap gap-2">
                  {lead.painPoints.length > 0 ? lead.painPoints.map((p, idx) => (
                    <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {p}
                    </span>
                  )) : <span className="text-gray-400">-</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Conversation */}
          {lead.messages.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Conversacion ({lead.messages.length} mensajes)
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {lead.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-50 ml-8'
                        : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {msg.role === 'user' ? 'Usuario' : 'Tunix'}
                    </p>
                    <p className="text-sm text-gray-800">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Agregar notas sobre este lead..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Score */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado</h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Status</p>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${lead.score >= 70 ? 'bg-green-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-gray-400'}`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-900">{lead.score}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Fuente</p>
                <p className="text-gray-900">{lead.source || '-'}</p>
              </div>

              {lead.meetingScheduled && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 uppercase mb-1">Reunion Agendada</p>
                  <p className="text-purple-900 font-medium">
                    {lead.meetingDate ? formatDate(lead.meetingDate) : 'Fecha no especificada'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sesion</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Fase</span>
                <span className="text-gray-900">{lead.conversationPhase || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Turnos</span>
                <span className="text-gray-900">{lead.turnCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Creado</span>
                <span className="text-gray-900">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Actualizado</span>
                <span className="text-gray-900">{formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad</h2>
            <div className="space-y-3">
              {lead.activities.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin actividad</p>
              ) : (
                lead.activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <span>{getActivityIcon(activity.type)}</span>
                    <div>
                      <p className="text-gray-900">{activity.details || activity.type}</p>
                      <p className="text-gray-400 text-xs">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
