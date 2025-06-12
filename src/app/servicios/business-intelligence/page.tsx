import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiPieChart, FiTrendingUp, FiDatabase, FiZap, FiCloud, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-indigo-500" />, 
    title: 'Decisiones Basadas en Datos',
    desc: 'Convierte datos en insights accionables para tomar decisiones estratégicas y anticipar tendencias.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-indigo-500" />, 
    title: 'Visualización y Accesibilidad',
    desc: 'Dashboards interactivos y reportes automáticos para monitorear KPIs en tiempo real desde cualquier dispositivo.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-indigo-500" />, 
    title: 'Automatización y Eficiencia',
    desc: 'Automatiza la recolección, procesamiento y análisis de datos, reduciendo errores y tiempos de entrega.'
  },
];

const tecnologias = [
  {
    icon: <FiPieChart className="h-8 w-8 text-indigo-500" />,
    title: 'Herramientas BI y Visualización',
    desc: 'Power BI, Tableau, Looker, Google Data Studio y dashboards personalizados.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-indigo-500" />,
    title: 'Integración de Datos',
    desc: 'ETL, Data Warehousing, APIs, BigQuery, Snowflake, integración de fuentes internas y externas.'
  },
  {
    icon: <FiCloud className="h-8 w-8 text-indigo-500" />,
    title: 'Analítica Avanzada e IA',
    desc: 'Machine learning, analítica predictiva, segmentación y modelos de forecasting para anticipar oportunidades.'
  },
];

const queOfrecemos = [
  {
    icon: <FiBarChart2 className="h-10 w-10 text-indigo-500 mb-4" />,
    title: 'Dashboards y Reportes Personalizados',
    desc: 'Visualiza tus métricas clave en tiempo real y toma decisiones informadas con dashboards a medida.'
  },
  {
    icon: <FiDatabase className="h-10 w-10 text-indigo-500 mb-4" />,
    title: 'Integración de Múltiples Fuentes',
    desc: 'Unifica datos de CRMs, ERPs, plataformas web, redes sociales y más en un solo lugar.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-indigo-500 mb-4" />,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
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
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-500 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-blue-200 animate-gradient-x drop-shadow-lg">
            Business Intelligence
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa la toma de decisiones estratégicas con soluciones de Business Intelligence: dashboards, analítica avanzada, integración de datos y automatización de reportes. Convierte tus datos en ventajas competitivas y anticipa oportunidades de negocio.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Solicita una consultoría BI gratuita
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones BI a medida para visualizar, analizar y automatizar la gestión de tus datos. Dashboards, integración de fuentes y analítica avanzada para potenciar tu negocio.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xl border-2 border-indigo-300 dark:border-indigo-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-indigo-700 dark:text-indigo-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-indigo-100 via-blue-50 to-white dark:from-indigo-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">¿Listo para potenciar tu negocio con Business Intelligence?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría BI gratuita
        </Link>
      </section>
    </div>
  );
};

export default BusinessIntelligencePage; 