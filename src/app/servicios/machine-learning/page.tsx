import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCpu, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-fuchsia-500" />, 
    title: 'Predicción y Toma de Decisiones',
    desc: 'Anticipa tendencias, demanda y comportamientos con modelos predictivos avanzados.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-fuchsia-500" />, 
    title: 'Automatización Inteligente',
    desc: 'Optimiza procesos, reduce errores y personaliza experiencias con IA adaptativa.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-fuchsia-500" />, 
    title: 'Escalabilidad y Analítica Avanzada',
    desc: 'Procesa grandes volúmenes de datos y escala soluciones de machine learning según tus necesidades.'
  },
];

const tecnologias = [
  {
    icon: <FiCpu className="h-8 w-8 text-fuchsia-500" />,
    title: 'Frameworks y Plataformas ML',
    desc: 'TensorFlow, PyTorch, Scikit-learn, Keras, Azure ML, Google AI Platform, AWS SageMaker.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-fuchsia-500" />,
    title: 'Gestión y Procesamiento de Datos',
    desc: 'Big Data, Data Lakes, ETL, APIs, pipelines y almacenamiento eficiente para entrenamiento y despliegue.'
  },
  {
    icon: <FiCloud className="h-8 w-8 text-fuchsia-500" />,
    title: 'Integración y Despliegue',
    desc: 'APIs, microservicios, ERPs, CRMs y dashboards para soluciones ML integradas y accesibles.'
  },
];

const queOfrecemos = [
  {
    icon: <FiCpu className="h-10 w-10 text-fuchsia-500 mb-4" />,
    title: 'Desarrollo de Modelos Predictivos',
    desc: 'Creamos modelos de machine learning para predicción, clasificación, segmentación y recomendación.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-fuchsia-500 mb-4" />,
    title: 'Automatización y Personalización',
    desc: 'Soluciones de IA para automatizar procesos, personalizar experiencias y optimizar resultados.'
  },
  {
    icon: <FiCloud className="h-10 w-10 text-fuchsia-500 mb-4" />,
    title: 'Integración y Analítica ML',
    desc: 'Despliegue de modelos, integración con sistemas y dashboards para monitoreo y toma de decisiones.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Objetivos',
    desc: 'Analizamos tus datos, procesos y objetivos para definir casos de uso de machine learning de alto impacto.'
  },
  {
    title: 'Desarrollo y Entrenamiento',
    desc: 'Diseñamos, entrenamos y validamos modelos ML adaptados a tus necesidades.'
  },
  {
    title: 'Implementación y Despliegue',
    desc: 'Integramos y desplegamos los modelos en tus sistemas para uso real y escalable.'
  },
  {
    title: 'Monitoreo y Optimización',
    desc: 'Monitorizamos el desempeño, optimizamos y evolucionamos los modelos según resultados.'
  },
];

const MachineLearningPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-fuchsia-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Machine Learning - TunixLabs</title>
        <meta name="description" content="Impulsa tu negocio con soluciones de machine learning: modelos predictivos, automatización inteligente, analítica avanzada e integración con tus sistemas." />
        <meta name="keywords" content="machine learning, modelos predictivos, automatización inteligente, analítica avanzada, integración IA, TunixLabs" />
        <meta property="og:title" content="Machine Learning - TunixLabs" />
        <meta property="og:description" content="Impulsa tu negocio con soluciones de machine learning: modelos predictivos, automatización inteligente, analítica avanzada e integración con tus sistemas." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/machine-learning" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/machine-learning" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-400 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-100 to-purple-200 animate-gradient-x drop-shadow-lg">
            Machine Learning
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa tu negocio con soluciones de machine learning: modelos predictivos, automatización inteligente, analítica avanzada e integración con tus sistemas. Transforma tus datos en resultados tangibles y escalables.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Solicita una consultoría en Machine Learning
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-fuchsia-700 dark:text-fuchsia-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones de machine learning para anticipar tendencias, automatizar procesos y personalizar experiencias. Modelos predictivos, integración y analítica avanzada para transformar tu negocio.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-fuchsia-100 dark:border-fuchsia-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-fuchsia-700 dark:text-fuchsia-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-fuchsia-700 dark:text-fuchsia-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-fuchsia-100 dark:border-fuchsia-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-fuchsia-700 dark:text-fuchsia-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-fuchsia-700 dark:text-fuchsia-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-fuchsia-100 dark:border-fuchsia-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-fuchsia-700 dark:text-fuchsia-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-fuchsia-700 dark:text-fuchsia-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-300 font-bold text-xl border-2 border-fuchsia-300 dark:border-fuchsia-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-fuchsia-700 dark:text-fuchsia-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-fuchsia-100 via-purple-50 to-white dark:from-fuchsia-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-fuchsia-700 dark:text-fuchsia-300">¿Listo para transformar tu negocio con Machine Learning?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría en Machine Learning
        </Link>
      </section>
    </div>
  );
};

export default MachineLearningPage; 