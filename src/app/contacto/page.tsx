import React from 'react';
import Head from 'next/head';
import { FiMail, FiPhone, FiUser, FiMessageCircle, FiSend, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function ContactoPage() {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      <Head>
        <title>Contacto | TunixLabs</title>
        <meta name="description" content="Contactanos para asesoria, proyectos o colaboraciones en IA, automatizacion y tecnologia." />
      </Head>

      {/* HERO - Neumorphic */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-300 mix-blend-multiply opacity-20 filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-300 mix-blend-multiply opacity-20 filter blur-3xl"></div>

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

          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Nombre</label>
                <input id="nombre" name="nombre" type="text" required placeholder="Tu nombre" className="neu-input" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Email</label>
                <input id="email" name="email" type="email" required placeholder="tu@email.com" className="neu-input" />
              </div>
            </div>

            <div>
              <label htmlFor="asunto" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Asunto</label>
              <input id="asunto" name="asunto" type="text" required placeholder="Sobre que quieres hablar?" className="neu-input" />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Mensaje</label>
              <textarea id="mensaje" name="mensaje" required rows={5} placeholder="Cuentanos tu idea o consulta..." className="neu-input resize-none" />
            </div>

            <button type="submit" className="neu-btn-primary w-full flex items-center justify-center gap-2 mt-2">
              <FiSend className="h-5 w-5" /> Enviar mensaje
            </button>
          </form>
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
                <span style={{ color: '#718096' }}>contacto@tunixlabs.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiPhone className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </div>
                <span style={{ color: '#718096' }}>+34 600 123 456</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d3748' }}>Redes sociales</h3>
              <div className="flex gap-4">
                <a href="#" aria-label="Instagram" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiInstagram className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </a>
                <a href="#" aria-label="LinkedIn" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiLinkedin className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </a>
                <a href="#" aria-label="Twitter" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiTwitter className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </a>
              </div>
            </div>
          </div>

          <div className="neu-pressed p-6 rounded-xl text-center">
            <p className="text-lg font-semibold mb-3 neu-gradient-text">Prefieres una reunion?</p>
            <a href="mailto:contacto@tunixlabs.com" className="neu-btn-primary inline-block">
              Agenda una videollamada
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