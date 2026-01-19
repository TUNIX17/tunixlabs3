import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiUserCheck, FiMessageCircle, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Diagnóstico Estratégico y Personalizado',
    desc: 'Identificamos oportunidades de alto impacto y diseñamos una hoja de ruta de IA alineada a tus objetivos de negocio.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Aceleración de la Innovación',
    desc: 'Implementa IA de forma ágil y segura, reduciendo riesgos y maximizando el retorno de inversión.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Resultados Medibles y Sostenibles',
    desc: 'Logra mejoras tangibles en eficiencia, ingresos y experiencia del cliente, con acompañamiento experto.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Plataformas y Frameworks IA',
    desc: 'TensorFlow, PyTorch, Azure AI, Google Cloud AI, AWS AI, OpenAI, HuggingFace y más.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración y Analítica de Datos',
    desc: 'ETL, Data Lakes, BigQuery, Snowflake, APIs y herramientas de visualización para una IA robusta.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización y Machine Learning',
    desc: 'Modelos predictivos, NLP, visión artificial, RPA y soluciones personalizadas para cada industria.'
  },
];

const queOfrecemos = [
  {
    icon: <FiUserCheck className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Consultoría Estratégica de IA',
    desc: 'Diagnóstico, roadmap y casos de uso de IA adaptados a tu sector y madurez digital.'
  },
  {
    icon: <FiCloud className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Implementación y Acompañamiento',
    desc: 'Desarrollo, integración y despliegue de soluciones IA con acompañamiento experto de principio a fin.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Capacitación y Change Management',
    desc: 'Formación, gestión del cambio y transferencia de conocimiento para asegurar adopción y éxito.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Oportunidades',
    desc: 'Analizamos procesos, datos y objetivos para identificar oportunidades de IA de alto impacto.'
  },
  {
    title: 'Roadmap y Diseño de Solución',
    desc: 'Definimos la hoja de ruta, casos de uso y arquitectura óptima para tu organización.'
  },
  {
    title: 'Implementación y Pruebas',
    desc: 'Desarrollamos, integramos y validamos la solución IA en tus sistemas y procesos.'
  },
  {
    title: 'Capacitación y Optimización',
    desc: 'Entrenamos a tu equipo y optimizamos la solución según resultados y feedback.'
  },
];

const ConsultoriaIAPage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>
      <Head>
        <title>Consultoría IA - TunixLabs</title>
        <meta name="description" content="Impulsa la transformación digital de tu empresa con consultoría estratégica de IA: diagnóstico, roadmap, implementación y resultados de negocio." />
        <meta name="keywords" content="consultoría IA, inteligencia artificial, transformación digital, roadmap IA, machine learning, automatización, TunixLabs" />
        <meta property="og:title" content="Consultoría IA - TunixLabs" />
        <meta property="og:description" content="Impulsa la transformación digital de tu empresa con consultoría estratégica de IA: diagnóstico, roadmap, implementación y resultados de negocio." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/consultoria-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/consultoria-ia" />
      </Head>

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Consultoría IA
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa la transformación digital de tu empresa con consultoría estratégica de IA: diagnóstico, roadmap, implementación y resultados de negocio. Acompañamos a tu organización en todo el ciclo de vida de la IA, desde la estrategia hasta la adopción y optimización.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría IA gratuita
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones IA a Medida</h2>
        </div>

        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Consultoría estratégica de IA para identificar oportunidades, diseñar soluciones a medida, implementar y acompañar la transformación digital de tu empresa.
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para transformar tu empresa con IA?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría IA gratuita
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

export default ConsultoriaIAPage;
