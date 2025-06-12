import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiUserCheck, FiMessageCircle, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-cyan-500" />, 
    title: 'Diagnóstico Estratégico y Personalizado',
    desc: 'Identificamos oportunidades de alto impacto y diseñamos una hoja de ruta de IA alineada a tus objetivos de negocio.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-cyan-500" />, 
    title: 'Aceleración de la Innovación',
    desc: 'Implementa IA de forma ágil y segura, reduciendo riesgos y maximizando el retorno de inversión.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-cyan-500" />, 
    title: 'Resultados Medibles y Sostenibles',
    desc: 'Logra mejoras tangibles en eficiencia, ingresos y experiencia del cliente, con acompañamiento experto.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8 text-cyan-500" />,
    title: 'Plataformas y Frameworks IA',
    desc: 'TensorFlow, PyTorch, Azure AI, Google Cloud AI, AWS AI, OpenAI, HuggingFace y más.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-cyan-500" />,
    title: 'Integración y Analítica de Datos',
    desc: 'ETL, Data Lakes, BigQuery, Snowflake, APIs y herramientas de visualización para una IA robusta.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-cyan-500" />,
    title: 'Automatización y Machine Learning',
    desc: 'Modelos predictivos, NLP, visión artificial, RPA y soluciones personalizadas para cada industria.'
  },
];

const queOfrecemos = [
  {
    icon: <FiUserCheck className="h-10 w-10 text-cyan-500 mb-4" />,
    title: 'Consultoría Estratégica de IA',
    desc: 'Diagnóstico, roadmap y casos de uso de IA adaptados a tu sector y madurez digital.'
  },
  {
    icon: <FiCloud className="h-10 w-10 text-cyan-500 mb-4" />,
    title: 'Implementación y Acompañamiento',
    desc: 'Desarrollo, integración y despliegue de soluciones IA con acompañamiento experto de principio a fin.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-cyan-500 mb-4" />,
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-cyan-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
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
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-cyan-700 via-blue-700 to-cyan-500 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 animate-gradient-x drop-shadow-lg">
            Consultoría IA
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa la transformación digital de tu empresa con consultoría estratégica de IA: diagnóstico, roadmap, implementación y resultados de negocio. Acompañamos a tu organización en todo el ciclo de vida de la IA, desde la estrategia hasta la adopción y optimización.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Solicita una consultoría IA gratuita
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-cyan-700 dark:text-cyan-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Consultoría estratégica de IA para identificar oportunidades, diseñar soluciones a medida, implementar y acompañar la transformación digital de tu empresa.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-cyan-100 dark:border-cyan-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-cyan-700 dark:text-cyan-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-cyan-700 dark:text-cyan-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-cyan-100 dark:border-cyan-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-cyan-700 dark:text-cyan-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-cyan-700 dark:text-cyan-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-cyan-100 dark:border-cyan-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-cyan-700 dark:text-cyan-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-cyan-700 dark:text-cyan-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-bold text-xl border-2 border-cyan-300 dark:border-cyan-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-cyan-700 dark:text-cyan-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-cyan-100 via-blue-50 to-white dark:from-cyan-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-cyan-700 dark:text-cyan-300">¿Listo para transformar tu empresa con IA?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría IA gratuita
        </Link>
      </section>
    </div>
  );
};

export default ConsultoriaIAPage; 