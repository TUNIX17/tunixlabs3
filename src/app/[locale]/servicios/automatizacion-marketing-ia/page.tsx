import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiMessageCircle, FiZap, FiUsers, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Optimización de Tiempo y Costos',
    desc: 'Automatiza tareas repetitivas, reduce errores y libera recursos para estrategias creativas, logrando ahorros de hasta 40% en operaciones.'
  },
  {
    icon: <FiUsers className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Personalización y Experiencia del Cliente',
    desc: 'Ofrece campañas hiperpersonalizadas y recomendaciones predictivas que aumentan la conversión y la fidelización.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Decisiones Basadas en Datos',
    desc: 'Analiza grandes volúmenes de datos en tiempo real para identificar oportunidades y optimizar el ROI de tus campañas.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'IA y Machine Learning',
    desc: 'Modelos predictivos, segmentación avanzada y personalización dinámica con plataformas como Salesforce Einstein, Google Ads Smart Campaigns y HubSpot.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integraciones Empresariales',
    desc: 'APIs, CRMs, ERPs y herramientas de analítica para centralizar información y automatizar flujos de trabajo.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización Omnicanal',
    desc: 'Gestión de campañas, lead scoring y comunicación personalizada en email, redes sociales, web y mensajería.'
  },
];

const queOfrecemos = [
  {
    icon: <FiBarChart2 className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Segmentación Inteligente',
    desc: 'Identifica y agrupa audiencias objetivo mediante análisis de datos y machine learning para campañas más efectivas.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Lead Scoring Automatizado',
    desc: 'Prioriza prospectos con mayor probabilidad de conversión usando IA y análisis predictivo.'
  },
  {
    icon: <FiUsers className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Personalización de Campañas',
    desc: 'Adapta mensajes, ofertas y canales en tiempo real para cada segmento, maximizando la relevancia y el engagement.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Objetivos',
    desc: 'Analizamos tus procesos y definimos metas SMART para la automatización y el crecimiento.'
  },
  {
    title: 'Selección de Herramientas y Diseño de Flujos',
    desc: 'Elegimos plataformas líderes y diseñamos flujos personalizados alineados a tus sistemas y objetivos.'
  },
  {
    title: 'Integración y Entrenamiento',
    desc: 'Conectamos la IA con tus datos, CRM y canales, entrenando modelos para máxima precisión.'
  },
  {
    title: 'Implementación y Optimización Continua',
    desc: 'Desplegamos, medimos resultados y ajustamos campañas para maximizar el ROI y la satisfacción del cliente.'
  },
];

const AutomatizacionMarketingIAPage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>
      <Head>
        <title>Automatización de Marketing y Ventas con IA - TunixLabs</title>
        <meta name="description" content="Automatiza campañas, personaliza experiencias y toma decisiones inteligentes con IA. Soluciones de marketing y ventas para maximizar conversión, eficiencia y ROI." />
        <meta name="keywords" content="automatización marketing, IA, inteligencia artificial, lead scoring, personalización, campañas automatizadas, machine learning, CRM, TunixLabs" />
        <meta property="og:title" content="Automatización de Marketing y Ventas con IA - TunixLabs" />
        <meta property="og:description" content="Automatiza campañas, personaliza experiencias y toma decisiones inteligentes con IA. Soluciones de marketing y ventas para maximizar conversión, eficiencia y ROI." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/automatizacion-marketing-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/automatizacion-marketing-ia" />
      </Head>

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Automatización de Marketing y Ventas con IA
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa tus ventas y optimiza campañas con automatización inteligente. Integramos IA, machine learning y automatización omnicanal para segmentar, personalizar y maximizar el ROI de tus campañas. Toma decisiones basadas en datos y escala tu marketing sin límites.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Impulsa tus ventas con IA
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones de Marketing con IA</h2>
        </div>
        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Soluciones de automatización de marketing con IA para segmentar, personalizar y maximizar el ROI de tus campañas. Integramos plataformas líderes, modelos predictivos y flujos omnicanal para transformar tu marketing digital.
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para transformar tu marketing?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría gratuita
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

export default AutomatizacionMarketingIAPage;
