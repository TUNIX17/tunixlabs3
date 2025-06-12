import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiBarChart2, FiTrendingUp, FiTarget, FiDatabase, FiMessageCircle, FiZap, FiCloud, FiLayers, FiPieChart } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-purple-500" />,
    title: 'Toma de Decisiones Estratégicas',
    desc: 'Transforma datos complejos en información clara y accionable para decisiones informadas y proactivas.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-purple-500" />,
    title: 'Optimización de la Eficiencia Operativa',
    desc: 'Identifica cuellos de botella y automatiza tareas repetitivas para reducir costos y mejorar la productividad.'
  },
  {
    icon: <FiTarget className="h-8 w-8 text-purple-500" />,
    title: 'Identificación de Oportunidades de Mercado',
    desc: 'Descubre tendencias, comportamientos y nichos emergentes para anticiparte a la competencia.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-purple-500" />,
    title: 'Mejora de la Relación con el Cliente',
    desc: 'Comprende el comportamiento y preferencias de tus clientes para personalizar servicios y aumentar la fidelización.'
  },
  {
    icon: <FiPieChart className="h-8 w-8 text-purple-500" />,
    title: 'Ventaja Competitiva Sostenible',
    desc: 'Obtén una visión clara del mercado y adapta tus estrategias para mantener el liderazgo.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8 text-pink-500" />,
    title: 'Plataformas BI Líderes',
    desc: 'Tableau, Power BI, Looker, Qlik Sense y Sisense para dashboards y visualizaciones avanzadas.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-pink-500" />,
    title: 'Bases de Datos y Data Warehouses',
    desc: 'SQL Server, PostgreSQL, MySQL, MongoDB, Cassandra, Snowflake, Redshift, BigQuery.'
  },
  {
    icon: <FiLayers className="h-8 w-8 text-pink-500" />,
    title: 'Herramientas ETL',
    desc: 'Talend, Informatica, Apache NiFi para extracción, transformación y carga de datos.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-pink-500" />,
    title: 'Lenguajes y Librerías de Análisis',
    desc: 'Python (Pandas, NumPy, Scikit-learn), R para análisis estadístico y modelado predictivo.'
  },
  {
    icon: <FiCloud className="h-8 w-8 text-pink-500" />,
    title: 'Servicios de IA y Machine Learning',
    desc: 'Azure ML, Google Cloud AI Platform, AWS SageMaker para análisis predictivo y clasificación.'
  },
];

const proceso = [
  {
    step: '1',
    title: 'Evaluación y Planificación Estratégica',
    desc: 'Analizamos tus necesidades, definimos KPIs y diseñamos una estrategia integral de BI alineada a tus objetivos.'
  },
  {
    step: '2',
    title: 'Extracción, Transformación y Carga (ETL)',
    desc: 'Recolectamos, limpiamos y preparamos datos de diversas fuentes para asegurar calidad y consistencia.'
  },
  {
    step: '3',
    title: 'Modelado y Almacenamiento de Datos',
    desc: 'Estructuramos los datos en modelos eficientes para análisis y visualización.'
  },
  {
    step: '4',
    title: 'Desarrollo de Dashboards y Reportes',
    desc: 'Creamos visualizaciones dinámicas y reportes automatizados para una exploración profunda de los datos.'
  },
  {
    step: '5',
    title: 'Análisis Predictivo y Capacitación',
    desc: 'Integramos IA para pronósticos y capacitamos a tu equipo en el uso de herramientas BI.'
  },
  {
    step: '6',
    title: 'Monitoreo y Optimización Continua',
    desc: 'Ajustamos y optimizamos la solución para máxima eficiencia y relevancia.'
  },
];

const BusinessIntelligencePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Business Intelligence - TunixLabs</title>
        <meta name="description" content="Desarrollamos dashboards interactivos y reportes automatizados para monitorear el rendimiento de tu negocio en tiempo real." />
        <meta name="keywords" content="business intelligence, BI, análisis de datos, dashboards, reportes, toma de decisiones, inteligencia de negocio, IA, TunixLabs" />
        <meta property="og:title" content="Business Intelligence - TunixLabs" />
        <meta property="og:description" content="Desarrollamos dashboards interactivos y reportes automatizados para monitorear el rendimiento de tu negocio en tiempo real." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/business-intelligence" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/business-intelligence" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-pink-200 animate-gradient-x drop-shadow-lg">
            Business Intelligence con IA
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Convierte tus datos en decisiones inteligentes con BI potenciado por IA. Dashboards interactivos, análisis predictivo y reportes automáticos para anticipar tendencias y crecer.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Impulsa tus decisiones con Business Intelligence
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-purple-700 dark:text-purple-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones de Business Intelligence potenciadas por IA, diseñadas para transformar tus datos en decisiones estratégicas.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-purple-100 dark:border-purple-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiBarChart2 className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">Dashboards Interactivos</h3>
            <p className="text-gray-700 dark:text-gray-300">Visualiza y explora tus datos en tiempo real con paneles personalizables y atractivos.</p>
        </div>
          {/* Card 2 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-purple-100 dark:border-purple-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiZap className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">Análisis Predictivo con IA</h3>
            <p className="text-gray-700 dark:text-gray-300">Anticipa tendencias y oportunidades mediante modelos avanzados de machine learning.</p>
          </div>
          {/* Card 3 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-purple-100 dark:border-purple-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiDatabase className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">Integración de Datos Multifuente</h3>
            <p className="text-gray-700 dark:text-gray-300">Unifica información de diversas fuentes para una visión 360° de tu negocio.</p>
          </div>
        </div>
      </section>
      {/* BENEFICIOS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-purple-700 dark:text-purple-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((b, i) => (
            <div key={b.title} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-purple-100 dark:border-purple-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
              <div className="mb-4">{b.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-purple-700 dark:text-purple-300">{b.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-pink-700 dark:text-pink-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((t, i) => (
            <div key={t.title} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-pink-100 dark:border-pink-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
              <div className="mb-4">{t.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-pink-700 dark:text-pink-300">{t.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* PROCESO DE IMPLEMENTACIÓN */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-purple-700 dark:text-purple-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {proceso.map((p, i) => (
              <li key={p.title} className="flex items-start gap-4 animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-xl border-2 border-purple-300 dark:border-purple-700 mr-2">{p.step}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-purple-700 dark:text-purple-300">{p.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-purple-100 via-pink-50 to-white dark:from-purple-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">¿Listo para transformar tus datos en decisiones?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl transition-all duration-300 text-white animate-bounce">
            <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría gratuita
          </Link>
      </section>
    </div>
  );
};

export default BusinessIntelligencePage; 