'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { FiMail, FiMessageCircle, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

export default function ContactoPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setStatus('success');
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>
      <Head>
        <title>Contacto | TunixLabs</title>
        <meta name="description" content="Contactanos para asesoria, proyectos o colaboraciones en IA, automatizacion y tecnologia." />
      </Head>

      {/* HERO - Neumorphic */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Hablemos de tu proyecto
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: '#718096', lineHeight: '1.7' }}>
            Completa el formulario o escribenos directamente. Nuestro equipo te respondera en menos de 24h.
          </p>
        </div>
      </section>

      {/* FORMULARIO Y DATOS - Neumorphic */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="neu-raised p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2d3748' }}>
            <FiMessageCircle className="h-6 w-6" style={{ color: 'var(--neu-primary)' }} />
            Envianos un mensaje
          </h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(145deg, #22c55e, #16a34a)' }}>
                <FiCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2d3748' }}>Mensaje enviado</h3>
              <p style={{ color: '#718096' }}>Te responderemos pronto a tu correo.</p>
              <button
                onClick={() => setStatus('idle')}
                className="neu-btn-primary mt-6"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Tu nombre"
                    className="neu-input"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="neu-input"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Asunto</label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  required
                  placeholder="Sobre que quieres hablar?"
                  className="neu-input"
                  value={formData.asunto}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={5}
                  placeholder="Cuentanos tu idea o consulta..."
                  className="neu-input resize-none"
                  value={formData.mensaje}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <FiAlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#dc2626' }} />
                  <span style={{ color: '#dc2626' }}>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="neu-btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FiSend className="h-5 w-5" /> Enviar mensaje
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Datos de contacto */}
        <div className="neu-raised p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2d3748' }}>
              <FiMail className="h-6 w-6" style={{ color: 'var(--neu-primary)' }} />
              Contacto directo
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiMail className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </div>
                <span style={{ color: 'var(--text-muted)' }}>contacto@tunixlabs.com</span>
              </div>
              <a
                href="https://wa.me/56930367979?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios%20de%20IA."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="neu-service-icon flex-shrink-0 transition-all duration-300 group-hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0, background: 'linear-gradient(145deg, #25D366, #128C7E)' }}>
                  <BsWhatsapp className="h-5 w-5 text-white" />
                </div>
                <span style={{ color: 'var(--text-muted)' }} className="group-hover:text-green-600 transition-colors">Escríbenos por WhatsApp</span>
              </a>
            </div>

          </div>

          <div className="neu-pressed p-6 rounded-xl text-center">
            <p className="text-lg font-semibold mb-3 neu-gradient-text">Prefieres una reunion?</p>
            <a
              href="https://wa.me/56930367979?text=Hola,%20me%20gustaría%20agendar%20una%20reunión%20para%20discutir%20mi%20proyecto."
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn-primary inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(145deg, #25D366, #128C7E)' }}
            >
              <BsWhatsapp className="h-5 w-5" />
              Agenda por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 neu-bg text-center" style={{ color: '#718096' }}>
        <p>&copy; 2026 TunixLabs. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
