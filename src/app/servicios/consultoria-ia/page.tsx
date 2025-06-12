import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiMessageCircle, FiUsers, FiClipboard, FiRefreshCcw, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiBarChart2 className="h-8 w-8 text-red-500" />, 
    title: 'Estrategia y Planificación de IA',
    desc: 'Definimos una hoja de ruta clara para la adopción de la IA, alineada con tus objetivos de negocio.'
  },
  {
    icon: <FiClipboard className="h-8 w-8 text-red-500" />, 
    title: 'Identificación y Desarrollo de Casos de Uso',
    desc: 'Descubrimos y priorizamos casos de uso de IA que generan valor real y optimizan procesos.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-red-500" />, 
    title: 'Selección e Implementación de Tecnología',
    desc: 'Asesoramos en la elección de plataformas y herramientas de IA, supervisando la integración exitosa.'
  },
  {
    icon: <FiUsers className="h-8 w-8 text-red-500" />, 
    title: 'Gobernanza y Ética de la IA',
    desc: 'Establecemos marcos de gobernanza para un uso responsable y ético de la IA.'
  },
  {
    icon: <FiRefreshCcw className="h-8 w-8 text-red-500" />, 
    title: 'Capacitación y Adopción Organizacional',
    desc: 'Desarrollamos programas de formación y fomentamos una cultura de innovación basada en datos.'
  },
];

const ConsultoriaIAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-pink-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Consultoría IA - TunixLabs</title>
        <meta name="description" content="Te asesoramos en la implementación de estrategias de IA que maximizan el retorno de inversión y minimizan riesgos." />
        <meta name="keywords" content="consultoría IA, asesoría inteligencia artificial, estrategia IA, implementación IA, transformación digital, optimización, ROI, gestión de riesgos, TunixLabs" />
        <meta property="og:title" content="Consultoría IA - TunixLabs" />
        <meta property="og:description" content="Te asesoramos en la implementación de estrategias de IA que maximizan el retorno de inversión y minimizan riesgos." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/consultoria-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/consultoria-ia" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-200 animate-gradient-x drop-shadow-lg">
            Consultoría en IA
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa la transformación digital de tu empresa con consultoría estratégica en IA. Te acompañamos desde el diagnóstico hasta la implementación, alineando la inteligencia artificial con tus objetivos de negocio.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Recibe asesoría experta en IA
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-red-700 dark:text-red-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Consultoría estratégica en IA: desde la definición de la hoja de ruta hasta la implementación y capacitación, alineada a tus objetivos de negocio.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-red-100 dark:border-red-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiBarChart2 className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">Estrategia y Planificación de IA</h3>
            <p className="text-gray-700 dark:text-gray-300">Definimos una hoja de ruta clara y alineada a tus objetivos para la adopción de IA.</p>
          </div>
          {/* Card 2 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-red-100 dark:border-red-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiClipboard className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">Casos de Uso Personalizados</h3>
            <p className="text-gray-700 dark:text-gray-300">Identificamos, priorizamos y desarrollamos casos de uso de IA de alto impacto.</p>
          </div>
          {/* Card 3 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-red-100 dark:border-red-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiZap className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">Implementación y Capacitación</h3>
            <p className="text-gray-700 dark:text-gray-300">Acompañamos la integración tecnológica y formamos a tu equipo para el éxito en IA.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-red-700 dark:text-red-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100 dark:border-red-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiTrendingUp className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-300">Visión Estratégica</h3>
            <p className="text-gray-700 dark:text-gray-300">Define una hoja de ruta clara para la adopción de IA alineada a tus objetivos de negocio.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100 dark:border-red-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-300">Reducción de Riesgos</h3>
            <p className="text-gray-700 dark:text-gray-300">Identifica oportunidades y amenazas, minimizando riesgos en la implementación de IA.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100 dark:border-red-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-300">Aceleración de Resultados</h3>
            <p className="text-gray-700 dark:text-gray-300">Implementa soluciones de IA de forma ágil y medible, maximizando el retorno de inversión.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-red-700 dark:text-red-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100 dark:border-red-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiCloud className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-300">Plataformas de IA</h3>
            <p className="text-gray-700 dark:text-gray-300">Azure AI, Google Cloud AI, AWS AI, IBM Watson para soluciones empresariales.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100 dark:border-red-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiDatabase className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-300">Herramientas de Analítica</h3>
            <p className="text-gray-700 dark:text-gray-300">Power BI, Tableau, Looker, Python (Pandas, Scikit-learn), R.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100 dark:border-red-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-red-700 dark:text-red-300">Automatización y RPA</h3>
            <p className="text-gray-700 dark:text-gray-300">UiPath, Automation Anywhere, Power Automate para procesos inteligentes.</p>
          </div>
        </div>
      </section>
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-red-700 dark:text-red-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-bold text-xl border-2 border-red-300 dark:border-red-700 mr-2">1</span><div><h3 className="text-lg font-bold mb-1 text-red-700 dark:text-red-300">Diagnóstico y Estrategia</h3><p className="text-gray-700 dark:text-gray-300">Analizamos tu negocio, identificamos oportunidades y definimos la estrategia de IA.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-bold text-xl border-2 border-red-300 dark:border-red-700 mr-2">2</span><div><h3 className="text-lg font-bold mb-1 text-red-700 dark:text-red-300">Desarrollo de Casos de Uso</h3><p className="text-gray-700 dark:text-gray-300">Seleccionamos y priorizamos los casos de uso de mayor impacto y viabilidad.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-bold text-xl border-2 border-red-300 dark:border-red-700 mr-2">3</span><div><h3 className="text-lg font-bold mb-1 text-red-700 dark:text-red-300">Implementación y Pruebas</h3><p className="text-gray-700 dark:text-red-300">Desarrollamos, integramos y probamos las soluciones de IA en tus procesos.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-bold text-xl border-2 border-red-300 dark:border-red-700 mr-2">4</span><div><h3 className="text-lg font-bold mb-1 text-red-700 dark:text-red-300">Capacitación y Optimización</h3><p className="text-gray-700 dark:text-gray-300">Formamos a tu equipo y optimizamos la solución según resultados y feedback.</p></div></li>
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-red-100 via-pink-50 to-white dark:from-red-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-red-700 dark:text-red-300">¿Listo para transformar tu empresa con IA?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-xl transition-all duration-300 text-white animate-bounce">
            <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría gratuita
          </Link>
      </section>
    </div>
  );
};

export default ConsultoriaIAPage; 