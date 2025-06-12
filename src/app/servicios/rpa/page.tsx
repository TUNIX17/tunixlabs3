import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle, FiSettings } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-orange-500" />, 
    title: 'Automatización de Tareas Repetitivas',
    desc: 'Libera a tu equipo de tareas manuales y repetitivas, permitiendo que se enfoquen en actividades de mayor valor.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-orange-500" />, 
    title: 'Reducción de Errores y Costos',
    desc: 'Minimiza errores humanos, reduce costos operativos y mejora la calidad de los procesos.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-orange-500" />, 
    title: 'Eficiencia y Escalabilidad',
    desc: 'Aumenta la productividad, acelera tiempos de respuesta y escala procesos sin incrementar recursos.'
  },
];

const tecnologias = [
  {
    icon: <FiSettings className="h-8 w-8 text-orange-500" />,
    title: 'Plataformas RPA Líderes',
    desc: 'UiPath, Automation Anywhere, Blue Prism, Power Automate y bots personalizados.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-orange-500" />,
    title: 'Integración de Sistemas',
    desc: 'APIs, ERPs, CRMs, legacy systems y conectores para automatización de punta a punta.'
  },
  {
    icon: <FiCloud className="h-8 w-8 text-orange-500" />,
    title: 'Analítica y Orquestación',
    desc: 'Monitorización, analítica de procesos y orquestación centralizada para control y optimización.'
  },
];

const queOfrecemos = [
  {
    icon: <FiZap className="h-10 w-10 text-orange-500 mb-4" />,
    title: 'Automatización de Procesos de Negocio',
    desc: 'Identificamos, diseñamos y automatizamos procesos clave para maximizar eficiencia y ROI.'
  },
  {
    icon: <FiSettings className="h-10 w-10 text-orange-500 mb-4" />,
    title: 'Desarrollo de Bots Personalizados',
    desc: 'Creamos robots de software adaptados a tus sistemas, reglas y necesidades específicas.'
  },
  {
    icon: <FiCloud className="h-10 w-10 text-orange-500 mb-4" />,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-orange-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
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
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-400 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-orange-200 animate-gradient-x drop-shadow-lg">
            RPA - Automatización Robótica de Procesos
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Optimiza y automatiza procesos de negocio con RPA: bots, integración de sistemas, reducción de errores y eficiencia operativa. Escala tu productividad y transforma tu empresa con robots de software inteligentes.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Solicita una consultoría RPA gratuita
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-orange-700 dark:text-orange-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones RPA para automatizar tareas, reducir errores y escalar procesos de negocio. Bots personalizados, integración de sistemas y soporte continuo para maximizar tu eficiencia.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-orange-100 dark:border-orange-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-orange-700 dark:text-orange-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-700 dark:text-orange-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-700 dark:text-orange-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-700 dark:text-orange-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-xl border-2 border-orange-300 dark:border-orange-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-orange-700 dark:text-orange-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-orange-100 via-yellow-50 to-white dark:from-orange-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-orange-700 dark:text-orange-300">¿Listo para escalar tu eficiencia con RPA?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría RPA gratuita
        </Link>
      </section>
    </div>
  );
};

export default RPAPage; 