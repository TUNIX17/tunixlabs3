import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiMessageCircle, FiZap, FiUsers, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiBarChart2 className="h-8 w-8 text-teal-500" />, 
    title: 'Segmentación Inteligente',
    desc: 'Identificación y agrupación de audiencias objetivo mediante análisis de datos y machine learning.'
  },
  {
    icon: <FiTrendingUp className="h-8 w-8 text-teal-500" />, 
    title: 'Lead Scoring Automatizado',
    desc: 'Priorización de prospectos con mayor probabilidad de conversión usando IA.'
  },
  {
    icon: <FiUsers className="h-8 w-8 text-teal-500" />, 
    title: 'Personalización de Campañas',
    desc: 'Adaptación dinámica de mensajes, ofertas y canales para cada segmento.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-teal-500" />, 
    title: 'Automatización de Flujos',
    desc: 'Ejecución automática de campañas, seguimiento de leads y análisis de resultados en tiempo real.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-teal-500" />, 
    title: 'Análisis y Optimización Continua',
    desc: 'Medición de KPIs, análisis de resultados y ajustes automáticos para maximizar el ROI.'
  },
];

const AutomatizacionMarketingIAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-teal-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Automatización de Marketing y Ventas con IA - TunixLabs</title>
        <meta name="description" content="Segmenta, personaliza y automatiza campañas de marketing y ventas con inteligencia artificial." />
        <meta name="keywords" content="automatización marketing, ventas inteligentes, lead scoring IA, campañas automatizadas, IA, inteligencia artificial, TunixLabs" />
        <meta property="og:title" content="Automatización de Marketing y Ventas con IA - TunixLabs" />
        <meta property="og:description" content="Segmenta, personaliza y automatiza campañas de marketing y ventas con inteligencia artificial." />
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
            Aumenta tus ventas y optimiza campañas con automatización inteligente. Implementamos IA para segmentación avanzada, lead scoring, personalización de campañas y análisis de resultados en tiempo real.
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
          Soluciones de automatización de marketing con IA para segmentar, personalizar y maximizar el ROI de tus campañas.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-teal-100 dark:border-teal-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiBarChart2 className="h-10 w-10 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-teal-700 dark:text-teal-300">Segmentación Inteligente</h3>
            <p className="text-gray-700 dark:text-gray-300">Identifica y agrupa audiencias objetivo mediante análisis de datos y machine learning.</p>
          </div>
          {/* Card 2 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-teal-100 dark:border-teal-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiTrendingUp className="h-10 w-10 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-teal-700 dark:text-teal-300">Lead Scoring Automatizado</h3>
            <p className="text-gray-700 dark:text-gray-300">Prioriza prospectos con mayor probabilidad de conversión usando IA.</p>
          </div>
          {/* Card 3 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-teal-100 dark:border-teal-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiUsers className="h-10 w-10 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-teal-700 dark:text-teal-300">Personalización de Campañas</h3>
            <p className="text-gray-700 dark:text-gray-300">Adapta mensajes y ofertas dinámicamente para cada segmento y canal.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700 dark:text-teal-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiTrendingUp className="h-8 w-8 text-teal-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">Aumento de Conversión</h3>
            <p className="text-gray-700 dark:text-gray-300">Automatiza campañas y segmenta audiencias para maximizar el retorno de inversión en marketing.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-teal-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">Reducción de Costos</h3>
            <p className="text-gray-700 dark:text-gray-300">Optimiza recursos y reduce errores humanos mediante flujos automatizados y lead scoring inteligente.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-teal-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">Mejor Experiencia de Cliente</h3>
            <p className="text-gray-700 dark:text-gray-300">Personaliza mensajes y ofertas en tiempo real, mejorando la satisfacción y fidelización.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700 dark:text-teal-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiCloud className="h-8 w-8 text-teal-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">Plataformas de Automatización</h3>
            <p className="text-gray-700 dark:text-gray-300">HubSpot, ActiveCampaign, Salesforce Marketing Cloud, Zapier.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiDatabase className="h-8 w-8 text-teal-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">Integraciones de Datos</h3>
            <p className="text-gray-700 dark:text-gray-300">APIs, CRMs, ERPs y herramientas de analítica para centralizar información.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-teal-100 dark:border-teal-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-teal-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-teal-700 dark:text-teal-300">IA y Machine Learning</h3>
            <p className="text-gray-700 dark:text-gray-300">Modelos de predicción, segmentación y personalización de campañas.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-teal-700 dark:text-teal-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xl border-2 border-teal-300 dark:border-teal-700 mr-2">1</span><div><h3 className="text-lg font-bold mb-1 text-teal-700 dark:text-teal-300">Diagnóstico y Objetivos</h3><p className="text-gray-700 dark:text-gray-300">Analizamos tu proceso actual y definimos objetivos claros de automatización.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xl border-2 border-teal-300 dark:border-teal-700 mr-2">2</span><div><h3 className="text-lg font-bold mb-1 text-teal-700 dark:text-teal-300">Diseño de Flujos</h3><p className="text-gray-700 dark:text-gray-300">Creamos flujos personalizados y seleccionamos las herramientas adecuadas.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xl border-2 border-teal-300 dark:border-teal-700 mr-2">3</span><div><h3 className="text-lg font-bold mb-1 text-teal-700 dark:text-teal-300">Implementación y Pruebas</h3><p className="text-gray-700 dark:text-gray-300">Configuramos, integramos y probamos los sistemas para asegurar resultados óptimos.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xl border-2 border-teal-300 dark:border-teal-700 mr-2">4</span><div><h3 className="text-lg font-bold mb-1 text-teal-700 dark:text-teal-300">Capacitación y Optimización</h3><p className="text-gray-700 dark:text-gray-300">Entrenamos a tu equipo y optimizamos los flujos según resultados y feedback.</p></div></li>
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