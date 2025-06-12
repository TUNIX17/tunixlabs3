import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiMessageCircle, FiZap, FiUsers, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-teal-500" />, 
    title: 'Optimización de Tiempo y Costos',
    desc: 'Automatiza tareas repetitivas, reduce errores y libera recursos para estrategias creativas, logrando ahorros de hasta 40% en operaciones.'
  },
  {
    icon: <FiUsers className="h-8 w-8 text-teal-500" />, 
    title: 'Personalización y Experiencia del Cliente',
    desc: 'Ofrece campañas hiperpersonalizadas y recomendaciones predictivas que aumentan la conversión y la fidelización.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-teal-500" />, 
    title: 'Decisiones Basadas en Datos',
    desc: 'Analiza grandes volúmenes de datos en tiempo real para identificar oportunidades y optimizar el ROI de tus campañas.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8 text-teal-500" />,
    title: 'IA y Machine Learning',
    desc: 'Modelos predictivos, segmentación avanzada y personalización dinámica con plataformas como Salesforce Einstein, Google Ads Smart Campaigns y HubSpot.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-teal-500" />,
    title: 'Integraciones Empresariales',
    desc: 'APIs, CRMs, ERPs y herramientas de analítica para centralizar información y automatizar flujos de trabajo.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-teal-500" />,
    title: 'Automatización Omnicanal',
    desc: 'Gestión de campañas, lead scoring y comunicación personalizada en email, redes sociales, web y mensajería.'
  },
];

const queOfrecemos = [
  {
    icon: <FiBarChart2 className="h-10 w-10 text-teal-500 mb-4" />,
    title: 'Segmentación Inteligente',
    desc: 'Identifica y agrupa audiencias objetivo mediante análisis de datos y machine learning para campañas más efectivas.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-teal-500 mb-4" />,
    title: 'Lead Scoring Automatizado',
    desc: 'Prioriza prospectos con mayor probabilidad de conversión usando IA y análisis predictivo.'
  },
  {
    icon: <FiUsers className="h-10 w-10 text-teal-500 mb-4" />,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-teal-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
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
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-teal-600 via-green-500 to-teal-400 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-green-200 animate-gradient-x drop-shadow-lg">
            Automatización de Marketing y Ventas con IA
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa tus ventas y optimiza campañas con automatización inteligente. Integramos IA, machine learning y automatización omnicanal para segmentar, personalizar y maximizar el ROI de tus campañas. Toma decisiones basadas en datos y escala tu marketing sin límites.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 shadow-xl transition-all duration-300 text-white animate-bounce">
            <FiMessageCircle className="h-6 w-6 mr-3" />
            Impulsa tus ventas con IA
          </Link>
        </div>
      </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-teal-700 dark:text-teal-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones de automatización de marketing con IA para segmentar, personalizar y maximizar el ROI de tus campañas. Integramos plataformas líderes, modelos predictivos y flujos omnicanal para transformar tu marketing digital.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-teal-100 dark:border-teal-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-teal-700 dark:text-teal-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700 dark:text-teal-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700 dark:text-teal-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700 dark:text-teal-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xl border-2 border-teal-300 dark:border-teal-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-teal-700 dark:text-teal-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-teal-100 via-green-50 to-white dark:from-teal-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-teal-700 dark:text-teal-300">¿Listo para transformar tu marketing?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría gratuita
        </Link>
      </section>
    </div>
  );
};

export default AutomatizacionMarketingIAPage; 