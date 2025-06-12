import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCode, FiZap, FiTarget, FiRefreshCcw, FiShield, FiMessageCircle, FiTrendingUp, FiBarChart2, FiCloud, FiDatabase } from 'react-icons/fi';

const DesarrollosWebPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-20 pb-16">
      <Head>
        <title>Desarrollos Web con IA - TunixLabs</title>
        <meta name="description" content="Creamos experiencias web interactivas y escalables, potenciadas con inteligencia artificial para una funcionalidad y rendimiento superiores." />
        <meta name="keywords" content="desarrollo web, inteligencia artificial, sitios web, aplicaciones web, SEO, UX, UI, Next.js, React, Node.js" />
        <meta property="og:title" content="Desarrollos Web con IA - TunixLabs" />
        <meta property="og:description" content="Creamos experiencias web interactivas y escalables, potenciadas con inteligencia artificial para una funcionalidad y rendimiento superiores." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/desarrollos-web" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/desarrollos-web" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link href="/inicio" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Desarrollo Web con IA
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Desarrolla webs inteligentes y automatizadas con IA de última generación. Creamos sitios web que integran chatbots, personalización dinámica, motores de recomendación y automatización de procesos. Optimizamos la experiencia de usuario y el SEO mediante herramientas IA, asegurando conectividad total con tus sistemas y APIs.
          </p>
        </div>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
          <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
            Desarrollo de sitios web y aplicaciones a medida, integrando IA, automatización y optimización avanzada para tu presencia digital.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiCode className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Desarrollo Web a Medida</h3>
              <p className="text-gray-700 dark:text-gray-300">Sitios y aplicaciones personalizados, responsive y accesibles, adaptados a tu negocio.</p>
            </div>
            {/* Card 2 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiZap className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Integración de IA y Automatización</h3>
              <p className="text-gray-700 dark:text-gray-300">Implementación de chatbots, personalización dinámica y automatización de procesos.</p>
            </div>
            {/* Card 3 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiBarChart2 className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Optimización SEO y Performance</h3>
              <p className="text-gray-700 dark:text-gray-300">Mejoramos el posicionamiento, la velocidad y la experiencia de usuario para maximizar resultados.</p>
        </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">Beneficios Clave</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiTrendingUp className="h-8 w-8 text-indigo-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Presencia Digital Potente</h3>
              <p className="text-gray-700 dark:text-gray-300">Impulsa tu marca con sitios web modernos, rápidos y atractivos.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiZap className="h-8 w-8 text-indigo-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Escalabilidad y Flexibilidad</h3>
              <p className="text-gray-700 dark:text-gray-300">Soluciones adaptadas a tu crecimiento y necesidades futuras.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-indigo-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Conversión y Resultados</h3>
              <p className="text-gray-700 dark:text-gray-300">Optimiza la experiencia de usuario para aumentar leads y ventas.</p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">Tecnologías Usadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-indigo-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Frameworks Web</h3>
              <p className="text-gray-700 dark:text-gray-300">Next.js, React, Node.js para interfaces de usuario modernas y backend robusto.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiCloud className="h-8 w-8 text-indigo-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Librerías y Frameworks de IA/ML</h3>
              <p className="text-gray-700 dark:text-gray-300">TensorFlow, PyTorch, Scikit-learn para el desarrollo de modelos de aprendizaje automático.</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4"><FiDatabase className="h-8 w-8 text-indigo-500" /></div>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Bases de Datos</h3>
              <p className="text-gray-700 dark:text-gray-300">NoSQL y SQL para almacenamiento escalable y eficiente de datos.</p>
          </div>
        </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300 animate-fade-in-up">Nuestro Proceso</h2>
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 text-center border border-indigo-100 dark:border-indigo-900 animate-fade-in-up">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Comprendemos tus necesidades y utilizamos IA para identificar las mejores oportunidades de optimización y personalización en tu presencia web.</p>
            <ol className="list-decimal list-inside text-left text-gray-700 dark:text-gray-300 space-y-2 mx-auto max-w-2xl">
              <li>Análisis y Estrategia con IA</li>
              <li>Diseño y Experiencia de Usuario (UX/UI) Inteligente</li>
              <li>Desarrollo y Entrenamiento de Modelos IA</li>
              <li>Implementación, SEO y Seguridad con IA</li>
              <li>Mantenimiento, Monitoreo y Optimización Continua</li>
          </ol>
        </div>
        </section>

        <div className="text-center mt-12">
          <Link href="/contacto" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 neon-border md:py-5 md:text-lg md:px-10 transition-all duration-300">
            <FiMessageCircle className="h-6 w-6 mr-3" />
            Hablemos de tu proyecto web con IA
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesarrollosWebPage; 