import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiMessageCircle, FiZap, FiSettings, FiHeadphones, FiTrendingUp, FiBarChart2, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-blue-500" />, 
    title: 'Disponibilidad 24/7 y Respuesta Inmediata',
    desc: 'Atiende consultas y solicitudes en cualquier momento, sin tiempos de espera, mejorando la satisfacción y fidelización.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-blue-500" />, 
    title: 'Automatización y Eficiencia Operativa',
    desc: 'Reduce carga operativa, errores y costos, liberando tiempo para tareas de mayor valor.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-blue-500" />, 
    title: 'Personalización y Conversión',
    desc: 'Ofrece experiencias hiperpersonalizadas, recomendaciones y ventas automatizadas que incrementan la conversión.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8 text-blue-500" />,
    title: 'Plataformas Conversacionales y NLP',
    desc: 'Dialogflow, Microsoft Bot Framework, Rasa, OpenAI GPT, BERT y servicios cloud para comprensión y generación de lenguaje natural.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-blue-500" />,
    title: 'Machine Learning y Analítica',
    desc: 'Modelos predictivos, análisis de sentimiento y aprendizaje continuo para mejorar la experiencia y resultados.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-blue-500" />,
    title: 'Integración Multicanal y Seguridad',
    desc: 'APIs, CRMs, ERPs, WhatsApp, web, apps y protocolos de seguridad para una experiencia omnicanal y protección de datos.'
  },
];

const queOfrecemos = [
  {
    icon: <FiUsers className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Chatbots y Voicebots Personalizados',
    desc: 'Desarrollo de asistentes conversacionales adaptados a cada sector, canal y objetivo de negocio.'
  },
  {
    icon: <FiCloud className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Integración Multicanal',
    desc: 'Conexión con WhatsApp, web, apps, redes sociales y sistemas empresariales para atención y automatización total.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Automatización de Soporte y Ventas',
    desc: 'Automatiza respuestas, ventas y procesos, mejorando la experiencia del usuario y la conversión.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Objetivos',
    desc: 'Analizamos necesidades, procesos y definimos casos de uso conversacionales de alto impacto.'
  },
  {
    title: 'Desarrollo y Entrenamiento',
    desc: 'Diseñamos, entrenamos e integramos el asistente virtual en tus canales y sistemas.'
  },
  {
    title: 'Implementación y Pruebas',
    desc: 'Integramos, probamos y ajustamos el bot en tus sistemas reales para máxima precisión y seguridad.'
  },
  {
    title: 'Capacitación y Optimización',
    desc: 'Entrenamos a tu equipo y optimizamos el asistente según resultados, feedback y analítica.'
  },
];

const AsistentesIAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Asistentes Virtuales IA - TunixLabs</title>
        <meta name="description" content="Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Disponibilidad 24/7, personalización, integración multicanal y resultados de negocio." />
        <meta name="keywords" content="asistentes IA, chatbots, inteligencia artificial conversacional, atención al cliente, automatización, experiencia del cliente, NLP, machine learning, TunixLabs" />
        <meta property="og:title" content="Asistentes Virtuales IA - TunixLabs" />
        <meta property="og:description" content="Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Disponibilidad 24/7, personalización, integración multicanal y resultados de negocio." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/asistentes-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/asistentes-ia" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-green-200 animate-gradient-x drop-shadow-lg">
            Asistentes Virtuales IA
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Disponibilidad 24/7, personalización, integración multicanal y resultados de negocio. Creamos asistentes IA personalizados para cada sector, integrados en todos tus canales y sistemas, con seguridad y analítica avanzada.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Transforma tu atención al cliente con Asistentes IA
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-blue-700 dark:text-blue-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Asistentes virtuales inteligentes que automatizan la atención, resuelven dudas y optimizan procesos de interacción con clientes y empleados. Integración multicanal, personalización y analítica avanzada para maximizar resultados.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-blue-100 dark:border-blue-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-700 dark:text-blue-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-700 dark:text-blue-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-700 dark:text-blue-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xl border-2 border-blue-300 dark:border-blue-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-green-100 via-teal-50 to-white dark:from-green-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300">¿Listo para transformar tu atención y automatización?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría gratuita
        </Link>
      </section>
    </div>
  );
};

export default AsistentesIAPage; 