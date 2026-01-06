import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiPieChart, FiTrendingUp, FiDatabase, FiZap, FiCloud, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Decisiones Basadas en Datos',
    desc: 'Convierte datos en insights accionables para tomar decisiones estratégicas y anticipar tendencias.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Visualización y Accesibilidad',
    desc: 'Dashboards interactivos y reportes automáticos para monitorear KPIs en tiempo real desde cualquier dispositivo.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización y Eficiencia',
    desc: 'Automatiza la recolección, procesamiento y análisis de datos, reduciendo errores y tiempos de entrega.'
  },
];

const tecnologias = [
  {
    icon: <FiPieChart className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Herramientas BI y Visualización',
    desc: 'Power BI, Tableau, Looker, Google Data Studio y dashboards personalizados.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración de Datos',
    desc: 'ETL, Data Warehousing, APIs, BigQuery, Snowflake, integración de fuentes internas y externas.'
  },
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Analítica Avanzada e IA',
    desc: 'Machine learning, analítica predictiva, segmentación y modelos de forecasting para anticipar oportunidades.'
  },
];

const queOfrecemos = [
  {
    icon: <FiBarChart2 className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Dashboards y Reportes Personalizados',
    desc: 'Visualiza tus métricas clave en tiempo real y toma decisiones informadas con dashboards a medida.'
  },
  {
    icon: <FiDatabase className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración de Múltiples Fuentes',
    desc: 'Unifica datos de CRMs, ERPs, plataformas web, redes sociales y más en un solo lugar.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización de Análisis y Alertas',
    desc: 'Recibe alertas inteligentes y reportes automáticos para reaccionar a tiempo ante cambios críticos.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Requerimientos',
    desc: 'Analizamos tus objetivos, fuentes de datos y necesidades de negocio para definir la mejor estrategia BI.'
  },
  {
    title: 'Integración y Modelado',
    desc: 'Conectamos, limpiamos y modelamos los datos para asegurar calidad y consistencia.'
  },
  {
    title: 'Desarrollo de Dashboards',
    desc: 'Diseñamos dashboards y reportes interactivos alineados a tus KPIs y procesos.'
  },
  {
    title: 'Capacitación y Optimización',
    desc: 'Entrenamos a tu equipo y optimizamos la solución según feedback y evolución del negocio.'
  },
];

const BusinessIntelligencePage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      <Head>
        <title>Business Intelligence - TunixLabs</title>
        <meta name="description" content="Impulsa la toma de decisiones estratégicas con soluciones de Business Intelligence: dashboards, analítica avanzada, integración de datos y automatización de reportes." />
        <meta name="keywords" content="business intelligence, BI, dashboards, analítica de datos, integración de datos, automatización de reportes, machine learning, TunixLabs" />
        <meta property="og:title" content="Business Intelligence - TunixLabs" />
        <meta property="og:description" content="Impulsa la toma de decisiones estratégicas con soluciones de Business Intelligence: dashboards, analítica avanzada, integración de datos y automatización de reportes." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/business-intelligence" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/business-intelligence" />
      </Head>

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-300 mix-blend-multiply opacity-20 filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-300 mix-blend-multiply opacity-20 filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Business Intelligence
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa la toma de decisiones estratégicas con soluciones de Business Intelligence: dashboards, analítica avanzada, integración de datos y automatización de reportes. Convierte tus datos en ventajas competitivas y anticipa oportunidades de negocio.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría BI gratuita
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones BI a Medida</h2>
          <p className="text-lg max-w-2xl mx-auto mt-4" style={{ color: '#718096' }}>
            Soluciones BI a medida para visualizar, analizar y automatizar la gestión de tus datos. Dashboards, integración de fuentes y analítica avanzada para potenciar tu negocio.
          </p>
        </div>

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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para potenciar tu negocio con Business Intelligence?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría BI gratuita
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

export default BusinessIntelligencePage;
