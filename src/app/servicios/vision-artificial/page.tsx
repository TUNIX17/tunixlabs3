import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiEye, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-sky-500" />, 
    title: 'Automatización y Precisión',
    desc: 'Automatiza inspecciones, controles de calidad y monitoreo visual con precisión superior y reducción de errores.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-sky-500" />, 
    title: 'Analítica Visual Avanzada',
    desc: 'Extrae insights de imágenes y videos en tiempo real para optimizar procesos y tomar decisiones informadas.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-sky-500" />, 
    title: 'Escalabilidad y Eficiencia',
    desc: 'Procesa grandes volúmenes de datos visuales, escalando operaciones sin incrementar recursos.'
  },
];

const tecnologias = [
  {
    icon: <FiEye className="h-8 w-8 text-sky-500" />,
    title: 'Redes Neuronales y Deep Learning',
    desc: 'TensorFlow, PyTorch, OpenCV, YOLO, Detectron2 y modelos de visión artificial de última generación.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-sky-500" />,
    title: 'Procesamiento y Almacenamiento',
    desc: 'Big Data, Data Lakes, GPUs, APIs y pipelines para gestión eficiente de imágenes y video.'
  },
  {
    icon: <FiCloud className="h-8 w-8 text-sky-500" />,
    title: 'Integración y Analítica',
    desc: 'APIs, ERPs, CRMs, sistemas industriales y dashboards para visualización y control.'
  },
];

const queOfrecemos = [
  {
    icon: <FiEye className="h-10 w-10 text-sky-500 mb-4" />,
    title: 'Reconocimiento de Imágenes y Video',
    desc: 'Identificación, clasificación y seguimiento automático de objetos, personas y patrones.'
  },
  {
    icon: <FiZap className="h-10 w-10 text-sky-500 mb-4" />,
    title: 'Automatización de Inspección y Control',
    desc: 'Soluciones para control de calidad, seguridad, monitoreo y procesos industriales.'
  },
  {
    icon: <FiCloud className="h-10 w-10 text-sky-500 mb-4" />,
    title: 'Analítica Visual y Dashboards',
    desc: 'Visualización de resultados, alertas inteligentes y analítica avanzada para toma de decisiones.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Objetivos',
    desc: 'Analizamos procesos y necesidades para definir casos de uso de visión artificial de alto impacto.'
  },
  {
    title: 'Desarrollo y Entrenamiento',
    desc: 'Diseñamos, entrenamos e integramos modelos de visión artificial en tus sistemas.'
  },
  {
    title: 'Implementación y Pruebas',
    desc: 'Integramos, probamos y ajustamos la solución en entornos reales para máxima precisión.'
  },
  {
    title: 'Monitoreo y Optimización',
    desc: 'Monitorizamos el desempeño, optimizamos y escalamos la solución según resultados.'
  },
];

const VisionArtificialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-sky-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Visión Artificial - TunixLabs</title>
        <meta name="description" content="Impulsa la eficiencia y precisión de tu empresa con soluciones de visión artificial: reconocimiento de imágenes, automatización de inspección y analítica visual avanzada." />
        <meta name="keywords" content="visión artificial, computer vision, reconocimiento de imágenes, deep learning, automatización de inspección, analítica visual, TunixLabs" />
        <meta property="og:title" content="Visión Artificial - TunixLabs" />
        <meta property="og:description" content="Impulsa la eficiencia y precisión de tu empresa con soluciones de visión artificial: reconocimiento de imágenes, automatización de inspección y analítica visual avanzada." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/vision-artificial" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/vision-artificial" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-400 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Volver a Servicios
          </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-blue-200 animate-gradient-x drop-shadow-lg">
            Visión Artificial
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa la eficiencia y precisión de tu empresa con soluciones de visión artificial: reconocimiento de imágenes, automatización de inspección y analítica visual avanzada. Transforma tus procesos con inteligencia visual de última generación.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Solicita una consultoría en Visión Artificial
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-sky-700 dark:text-sky-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones de visión artificial para automatizar inspecciones, extraer insights visuales y optimizar procesos. Reconocimiento de imágenes, analítica avanzada y dashboards para transformar tu negocio.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-sky-100 dark:border-sky-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-sky-700 dark:text-sky-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-sky-700 dark:text-sky-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-sky-100 dark:border-sky-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-sky-700 dark:text-sky-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-sky-700 dark:text-sky-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-sky-100 dark:border-sky-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-sky-700 dark:text-sky-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-sky-700 dark:text-sky-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold text-xl border-2 border-sky-300 dark:border-sky-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-sky-700 dark:text-sky-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-sky-100 via-blue-50 to-white dark:from-sky-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-sky-700 dark:text-sky-300">¿Listo para transformar tu empresa con Visión Artificial?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría en Visión Artificial
        </Link>
      </section>
    </div>
  );
};

export default VisionArtificialPage; 