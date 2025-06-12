import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiMessageCircle, FiZap, FiSettings, FiHeadphones, FiTrendingUp, FiBarChart2, FiCloud, FiDatabase } from 'react-icons/fi';

const AsistentesIAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-20 pb-16">
      <Head>
        <title>Asistentes IA - TunixLabs</title>
        <meta name="description" content="Creamos asistentes virtuales inteligentes que mejoran la experiencia de tus clientes y optimizan la atención al cliente." />
        <meta name="keywords" content="asistentes IA, chatbots, inteligencia artificial conversacional, atención al cliente, automatización, experiencia del cliente, IA, TunixLabs" />
        <meta property="og:title" content="Asistentes IA - TunixLabs" />
        <meta property="og:description" content="Creamos asistentes virtuales inteligentes que mejoran la experiencia de tus clientes y optimizan la atención al cliente." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/asistentes-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/asistentes-ia" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link href="/inicio" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600">
            Asistentes Virtuales IA
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Creamos asistentes IA personalizados para cada sector, integrados en todos tus canales (web, WhatsApp, apps, redes sociales y voz). Nuestros agentes conversacionales comprenden lenguaje natural, analizan sentimientos y ejecutan tareas, conectándose con tus sistemas (CRM, ERP, etc.). Garantizamos privacidad, transparencia y una experiencia omnicanal de alto valor.
          </p>
        </div>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-blue-700 dark:text-blue-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
          <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
            Asistentes virtuales inteligentes que automatizan la atención, resuelven dudas y optimizan procesos de interacción con clientes y empleados.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-blue-100 dark:border-blue-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiUsers className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Chatbots y Voicebots Personalizados</h3>
              <p className="text-gray-700 dark:text-gray-300">Desarrollo de asistentes conversacionales adaptados a cada sector y canal.</p>
            </div>
            {/* Card 2 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-blue-100 dark:border-blue-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiCloud className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Integración Multicanal</h3>
              <p className="text-gray-700 dark:text-gray-300">Conexión con WhatsApp, web, apps, redes sociales y sistemas empresariales.</p>
            </div>
            {/* Card 3 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-blue-100 dark:border-blue-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiZap className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Automatización de Soporte y Ventas</h3>
              <p className="text-gray-700 dark:text-gray-300">Automatiza respuestas, ventas y procesos, mejorando la experiencia del usuario.</p>
        </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-700 dark:text-blue-300 animate-fade-in-up">Beneficios Clave</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiTrendingUp className="h-8 w-8 text-blue-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Disponibilidad 24/7</h3>
              <p className="text-gray-700 dark:text-gray-300">Atiende consultas y solicitudes en cualquier momento, sin tiempos de espera.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiZap className="h-8 w-8 text-blue-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Automatización de Procesos</h3>
              <p className="text-gray-700 dark:text-gray-300">Reduce carga operativa y errores, liberando tiempo para tareas de mayor valor.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-blue-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Mejora de la Experiencia</h3>
              <p className="text-gray-700 dark:text-gray-300">Ofrece respuestas rápidas, personalizadas y multicanal, aumentando la satisfacción.</p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-700 dark:text-blue-300 animate-fade-in-up">Tecnologías Usadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiCloud className="h-8 w-8 text-blue-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Plataformas Conversacionales</h3>
              <p className="text-gray-700 dark:text-gray-300">Dialogflow, Microsoft Bot Framework, Rasa, Twilio, WhatsApp Business API.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiDatabase className="h-8 w-8 text-blue-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">NLP y Machine Learning</h3>
              <p className="text-gray-700 dark:text-gray-300">OpenAI GPT, spaCy, BERT, transformers, servicios cloud de IA.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiZap className="h-8 w-8 text-blue-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Integración Multicanal</h3>
              <p className="text-gray-700 dark:text-gray-300">APIs, webhooks, CRMs y plataformas de mensajería.</p>
          </div>
        </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-700 dark:text-blue-300 animate-fade-in-up">Nuestro Proceso</h2>
          <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
            <ol className="flex-1 space-y-6">
              <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xl border-2 border-blue-300 dark:border-blue-700 mr-2">1</span><div><h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-300">Diagnóstico y Objetivos</h3><p className="text-gray-700 dark:text-gray-300">Analizamos necesidades y definimos casos de uso conversacionales de alto impacto.</p></div></li>
              <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xl border-2 border-blue-300 dark:border-blue-700 mr-2">2</span><div><h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-300">Desarrollo y Entrenamiento</h3><p className="text-gray-700 dark:text-gray-300">Diseñamos, entrenamos e integramos el asistente virtual en tus canales.</p></div></li>
              <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xl border-2 border-blue-300 dark:border-blue-700 mr-2">3</span><div><h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-300">Implementación y Pruebas</h3><p className="text-gray-700 dark:text-gray-300">Integramos, probamos y ajustamos el bot en tus sistemas reales.</p></div></li>
              <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xl border-2 border-blue-300 dark:border-blue-700 mr-2">4</span><div><h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-300">Capacitación y Optimización</h3><p className="text-gray-700 dark:text-gray-300">Entrenamos a tu equipo y optimizamos el asistente según resultados y feedback.</p></div></li>
          </ol>
        </div>
        </section>

        <div className="text-center mt-12">
          <Link href="/contacto" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 neon-border md:py-5 md:text-lg md:px-10 transition-all duration-300">
            <FiMessageCircle className="h-6 w-6 mr-3" />
            Transforma tu atención al cliente con Asistentes IA
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AsistentesIAPage; 