import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiSettings, FiMessageCircle, FiZap, FiBarChart2, FiRefreshCcw, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiSettings className="h-8 w-8 text-yellow-500" />, 
    title: 'Automatización de Procesos Empresariales',
    desc: 'Implementamos robots de software que ejecutan tareas administrativas, gestión de datos, generación de reportes y más, sin intervención humana.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-yellow-500" />, 
    title: 'Integración con IA',
    desc: 'Combinamos RPA con inteligencia artificial para automatizar procesos complejos que requieren toma de decisiones, reconocimiento de documentos y procesamiento de lenguaje natural.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-yellow-500" />, 
    title: 'Reducción de Errores y Costos',
    desc: 'Minimiza errores humanos y reduce los costes operativos al automatizar tareas repetitivas y de alto volumen.'
  },
  {
    icon: <FiRefreshCcw className="h-8 w-8 text-yellow-500" />, 
    title: 'Escalabilidad y Flexibilidad',
    desc: 'Nuestras soluciones se adaptan al crecimiento de tu empresa y a la variabilidad de la demanda.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-yellow-500" />, 
    title: 'Implementación Rápida',
    desc: 'Despliegue ágil y sin interrupciones en tus sistemas existentes.'
  },
];

const RpaPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-yellow-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>RPA con IA - TunixLabs</title>
        <meta name="description" content="Automatiza tareas repetitivas y procesos administrativos con robots de software inteligentes impulsados por IA." />
        <meta name="keywords" content="RPA, automatización robótica de procesos, robots de software, IA, inteligencia artificial, automatización empresarial, TunixLabs" />
        <meta property="og:title" content="RPA con IA - TunixLabs" />
        <meta property="og:description" content="Automatiza tareas repetitivas y procesos administrativos con robots de software inteligentes impulsados por IA." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/rpa" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/rpa" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-orange-200 animate-gradient-x drop-shadow-lg">
            Automatización Robótica de Procesos (RPA)
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Optimiza la eficiencia operativa con RPA impulsado por IA. Automatiza tareas repetitivas y procesos administrativos mediante robots de software inteligentes.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Descubre el poder de la automatización con RPA
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-yellow-700 dark:text-yellow-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Automatización robótica de procesos (RPA) para digitalizar, optimizar y escalar operaciones empresariales.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-yellow-100 dark:border-yellow-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiSettings className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Automatización de Procesos</h3>
            <p className="text-gray-700 dark:text-gray-300">Robots de software que ejecutan tareas administrativas y gestión de datos sin intervención humana.</p>
          </div>
          {/* Card 2 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-yellow-100 dark:border-yellow-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiZap className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Integración con IA</h3>
            <p className="text-gray-700 dark:text-gray-300">Automatización de procesos complejos con inteligencia artificial y procesamiento de lenguaje natural.</p>
          </div>
          {/* Card 3 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-yellow-100 dark:border-yellow-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiBarChart2 className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Reducción de Errores y Costos</h3>
            <p className="text-gray-700 dark:text-gray-300">Minimiza errores humanos y reduce costes operativos al automatizar tareas repetitivas.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-yellow-700 dark:text-yellow-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-yellow-100 dark:border-yellow-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiTrendingUp className="h-8 w-8 text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Ahorro de Costos</h3>
            <p className="text-gray-700 dark:text-gray-300">Reduce gastos operativos y errores humanos mediante la automatización de procesos repetitivos.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-yellow-100 dark:border-yellow-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Escalabilidad y Flexibilidad</h3>
            <p className="text-gray-700 dark:text-gray-300">Adapta y expande la automatización a medida que crece tu negocio, sin grandes inversiones adicionales.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-yellow-100 dark:border-yellow-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Mejora de la Productividad</h3>
            <p className="text-gray-700 dark:text-gray-300">Permite a tu equipo enfocarse en tareas de mayor valor, aumentando la eficiencia global.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-yellow-700 dark:text-yellow-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-yellow-100 dark:border-yellow-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiCloud className="h-8 w-8 text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Plataformas RPA</h3>
            <p className="text-gray-700 dark:text-gray-300">UiPath, Automation Anywhere, Blue Prism, Power Automate.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-yellow-100 dark:border-yellow-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiDatabase className="h-8 w-8 text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Integraciones Empresariales</h3>
            <p className="text-gray-700 dark:text-gray-300">ERP, CRM, sistemas legacy y APIs para automatizar procesos de punta a punta.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-yellow-100 dark:border-yellow-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">IA y Analítica</h3>
            <p className="text-gray-700 dark:text-gray-300">Machine learning, OCR, NLP y analítica avanzada para procesos inteligentes.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-yellow-700 dark:text-yellow-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-bold text-xl border-2 border-yellow-300 dark:border-yellow-700 mr-2">1</span><div><h3 className="text-lg font-bold mb-1 text-yellow-700 dark:text-yellow-300">Análisis de Procesos</h3><p className="text-gray-700 dark:text-gray-300">Identificamos tareas repetitivas y áreas de oportunidad para automatizar.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-bold text-xl border-2 border-yellow-300 dark:border-yellow-700 mr-2">2</span><div><h3 className="text-lg font-bold mb-1 text-yellow-700 dark:text-yellow-300">Diseño y Desarrollo</h3><p className="text-gray-700 dark:text-gray-300">Modelamos y programamos robots de software adaptados a tus necesidades.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-bold text-xl border-2 border-yellow-300 dark:border-yellow-700 mr-2">3</span><div><h3 className="text-lg font-bold mb-1 text-yellow-700 dark:text-yellow-300">Implementación y Pruebas</h3><p className="text-gray-700 dark:text-gray-300">Integramos, probamos y ajustamos los bots en tus sistemas reales.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-bold text-xl border-2 border-yellow-300 dark:border-yellow-700 mr-2">4</span><div><h3 className="text-lg font-bold mb-1 text-yellow-700 dark:text-yellow-300">Capacitación y Optimización</h3><p className="text-gray-700 dark:text-gray-300">Formamos a tu equipo y optimizamos los procesos según resultados y feedback.</p></div></li>
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-yellow-100 via-orange-50 to-white dark:from-yellow-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-yellow-700 dark:text-yellow-300">¿Listo para automatizar tu empresa?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría gratuita
        </Link>
      </section>
    </div>
  );
};

export default RpaPage; 