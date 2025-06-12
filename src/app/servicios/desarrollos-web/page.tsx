import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCode, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-indigo-500" />, 
    title: 'Experiencias Personalizadas',
    desc: 'Diseño UX/UI centrado en el usuario, adaptado a cada cliente y sector, que maximiza la conversión y la satisfacción.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-indigo-500" />, 
    title: 'Eficiencia y Automatización',
    desc: 'Automatización de flujos, integración de IA y dashboards para optimizar procesos y reducir costos.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-indigo-500" />, 
    title: 'Escalabilidad y Analítica',
    desc: 'Soluciones escalables, con analítica avanzada y monitoreo en tiempo real para impulsar el crecimiento.'
  },
];

const tecnologias = [
  {
    icon: <FiCode className="h-8 w-8 text-indigo-500" />,
    title: 'Frameworks Modernos',
    desc: 'React, Next.js, Node.js, Tailwind, integrados con APIs y microservicios para máxima flexibilidad.'
  },
  {
    icon: <FiCloud className="h-8 w-8 text-indigo-500" />,
    title: 'IA y Automatización',
    desc: 'Integración de IA, chatbots, personalización dinámica y automatización de procesos de negocio.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-indigo-500" />,
    title: 'Dashboards y Analítica',
    desc: 'Paneles de control intuitivos, analítica avanzada y monitoreo centralizado de métricas clave.'
  },
];

const queOfrecemos = [
  {
    icon: <FiCode className="h-10 w-10 text-indigo-500 mb-4" />,
    title: 'Desarrollo Web a Medida',
    desc: 'Sitios y aplicaciones web personalizados, optimizados para SEO, performance y conversión.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-indigo-500 mb-4" />,
    title: 'Integración de IA y Automatización',
    desc: 'Soluciones inteligentes: chatbots, personalización, flujos automáticos y conectividad con sistemas empresariales.'
  },
  {
    icon: <FiCloud className="h-10 w-10 text-indigo-500 mb-4" />,
    title: 'Dashboards y Analítica Web',
    desc: 'Paneles de control, reportes y analítica en tiempo real para la toma de decisiones.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Objetivos',
    desc: 'Analizamos tu negocio, público y objetivos para definir la mejor estrategia digital.'
  },
  {
    title: 'Diseño y Prototipado',
    desc: 'Creamos wireframes y prototipos UX/UI alineados a la experiencia y conversión.'
  },
  {
    title: 'Desarrollo e Integración',
    desc: 'Construimos la solución web, integramos IA, automatización y sistemas empresariales.'
  },
  {
    title: 'Despliegue, Capacitación y Optimización',
    desc: 'Lanzamos, capacitamos a tu equipo y optimizamos con analítica y feedback.'
  },
];

const DesarrollosWebPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Desarrollos Web - TunixLabs</title>
        <meta name="description" content="Impulsa tu negocio con desarrollos web personalizados: UX, automatización, IA, dashboards, integración y analítica avanzada. Soluciones escalables y orientadas a resultados." />
        <meta name="keywords" content="desarrollos web, desarrollo web, automatización, inteligencia artificial, dashboards, analítica, integración, TunixLabs" />
        <meta property="og:title" content="Desarrollos Web - TunixLabs" />
        <meta property="og:description" content="Impulsa tu negocio con desarrollos web personalizados: UX, automatización, IA, dashboards, integración y analítica avanzada. Soluciones escalables y orientadas a resultados." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/desarrollos-web" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/desarrollos-web" />
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
            Desarrollos Web
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa tu negocio con desarrollos web personalizados: UX, automatización, IA, dashboards, integración y analítica avanzada. Soluciones escalables y orientadas a resultados para transformar tu presencia digital.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Solicita una consultoría web gratuita
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones web a medida, integrando automatización, IA, dashboards y analítica para maximizar la conversión y la eficiencia de tu empresa.
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
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">¿Listo para transformar tu presencia digital?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría web gratuita
        </Link>
      </section>
    </div>
  );
};

export default DesarrollosWebPage; 