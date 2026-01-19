import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle, FiSettings } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización de Tareas Repetitivas',
    desc: 'Libera a tu equipo de tareas manuales y repetitivas, permitiendo que se enfoquen en actividades de mayor valor.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Reducción de Errores y Costos',
    desc: 'Minimiza errores humanos, reduce costos operativos y mejora la calidad de los procesos.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Eficiencia y Escalabilidad',
    desc: 'Aumenta la productividad, acelera tiempos de respuesta y escala procesos sin incrementar recursos.'
  },
];

const tecnologias = [
  {
    icon: <FiSettings className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Plataformas RPA Líderes',
    desc: 'UiPath, Automation Anywhere, Blue Prism, Power Automate y bots personalizados.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración de Sistemas',
    desc: 'APIs, ERPs, CRMs, legacy systems y conectores para automatización de punta a punta.'
  },
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Analítica y Orquestación',
    desc: 'Monitorización, analítica de procesos y orquestación centralizada para control y optimización.'
  },
];

const queOfrecemos = [
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización de Procesos de Negocio',
    desc: 'Identificamos, diseñamos y automatizamos procesos clave para maximizar eficiencia y ROI.'
  },
  {
    icon: <FiSettings className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Desarrollo de Bots Personalizados',
    desc: 'Creamos robots de software adaptados a tus sistemas, reglas y necesidades específicas.'
  },
  {
    icon: <FiCloud className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración y Soporte Continuo',
    desc: 'Integramos RPA con tus sistemas y brindamos soporte y optimización continua.'
  },
];

const pasos = [
  {
    title: 'Identificación y Análisis de Procesos',
    desc: 'Analizamos tus procesos para detectar oportunidades de automatización de alto impacto.'
  },
  {
    title: 'Diseño y Desarrollo de Bots',
    desc: 'Modelamos, desarrollamos y configuramos bots adaptados a tus flujos y sistemas.'
  },
  {
    title: 'Implementación y Pruebas',
    desc: 'Integramos, probamos y ajustamos los bots en tus entornos reales para máxima precisión.'
  },
  {
    title: 'Monitoreo y Optimización',
    desc: 'Monitorizamos el desempeño, optimizamos y escalamos la automatización según resultados.'
  },
];

const RPAPage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>
      <Head>
        <title>RPA - Automatización Robótica de Procesos | TunixLabs</title>
        <meta name="description" content="Optimiza y automatiza procesos de negocio con RPA: bots, integración de sistemas, reducción de errores y eficiencia operativa." />
        <meta name="keywords" content="RPA, automatización robótica de procesos, bots, eficiencia operativa, reducción de errores, integración de sistemas, TunixLabs" />
        <meta property="og:title" content="RPA - Automatización Robótica de Procesos | TunixLabs" />
        <meta property="og:description" content="Optimiza y automatiza procesos de negocio con RPA: bots, integración de sistemas, reducción de errores y eficiencia operativa." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/rpa" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/rpa" />
      </Head>

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            RPA - Automatización Robótica de Procesos
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Optimiza y automatiza procesos de negocio con RPA: bots, integración de sistemas, reducción de errores y eficiencia operativa. Escala tu productividad y transforma tu empresa con robots de software inteligentes.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría RPA gratuita
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones RPA a Medida</h2>
        </div>

        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Soluciones RPA para automatizar tareas, reducir errores y escalar procesos de negocio. Bots personalizados, integración de sistemas y soporte continuo para maximizar tu eficiencia.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="neu-raised p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
              <div className="neu-service-icon mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: '#2d3748' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Beneficios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Beneficios Clave</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((item, i) => (
            <div key={i} className="neu-raised p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
              <div className="neu-service-icon mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: '#2d3748' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tecnologias - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Tecnologías Usadas</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tecnologias.map((item, i) => (
            <div key={i} className="neu-raised p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
              <div className="neu-service-icon mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: '#2d3748' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proceso - Neumorphic */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Proceso
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Nuestro Proceso</h2>
        </div>

        <div className="neu-raised p-6 sm:p-8 rounded-2xl">
          <ol className="space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--neu-primary)' }}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#2d3748' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA Final - Neumorphic */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para escalar tu eficiencia con RPA?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría RPA gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 neu-bg text-center" style={{ color: '#718096' }}>
        <p>&copy; 2026 TunixLabs. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default RPAPage;
