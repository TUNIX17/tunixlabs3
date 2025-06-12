import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiEye, FiZap, FiSettings, FiCamera, FiMessageCircle, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiEye className="h-8 w-8 text-orange-500" />, 
    title: 'Procesamiento y Análisis de Imágenes',
    desc: 'Interpretación y extracción de información valiosa de imágenes y videos, reconocimiento de patrones y detección de anomalías.'
  },
  {
    icon: <FiCamera className="h-8 w-8 text-orange-500" />, 
    title: 'Reconocimiento y Detección en Tiempo Real',
    desc: 'Identificación y seguimiento de objetos, personas o vehículos en entornos dinámicos.'
  },
  {
    icon: <FiSettings className="h-8 w-8 text-orange-500" />, 
    title: 'Inspección de Calidad Automatizada',
    desc: 'Examen de productos en líneas de fabricación, detección de defectos y verificación de ensamblajes.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-orange-500" />, 
    title: 'Análisis de Video Inteligente',
    desc: 'Procesamiento de flujos de video para detectar eventos, patrones de comportamiento y actividades sospechosas.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-orange-500" />, 
    title: 'Reconocimiento Facial y Biométrico',
    desc: 'Sistemas para autenticación segura, control de acceso y personalización de experiencias.'
  },
];

const VisionArtificialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-orange-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Visión Artificial - TunixLabs</title>
        <meta name="description" content="Desarrollamos sistemas de visión por computadora para el reconocimiento de imágenes, análisis de video y automatización de procesos visuales." />
        <meta name="keywords" content="visión artificial, computer vision, reconocimiento de imágenes, análisis de video, automatización visual, IA, inteligencia artificial, TunixLabs" />
        <meta property="og:title" content="Visión Artificial - TunixLabs" />
        <meta property="og:description" content="Desarrollamos sistemas de visión por computadora para el reconocimiento de imágenes, análisis de video y automatización de procesos visuales." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/vision-artificial" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/vision-artificial" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-pink-200 animate-gradient-x drop-shadow-lg">
            Visión Artificial
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Automatiza procesos y mejora la calidad con visión artificial empresarial. Soluciones de análisis de imágenes y video para control de calidad, seguridad, retail y salud.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-xl transition-all duration-300 text-white animate-bounce">
              <FiMessageCircle className="h-6 w-6 mr-3" />
              Implementa la Visión Artificial en tu negocio
            </Link>
          </div>
        </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-orange-700 dark:text-orange-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Soluciones de visión artificial para automatizar la interpretación de imágenes y videos, optimizar procesos y extraer información valiosa.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-orange-100 dark:border-orange-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiEye className="h-10 w-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-orange-700 dark:text-orange-300">Procesamiento y Análisis de Imágenes</h3>
            <p className="text-gray-700 dark:text-gray-300">Interpretación y extracción de información valiosa de imágenes y videos.</p>
          </div>
          {/* Card 2 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-orange-100 dark:border-orange-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiCamera className="h-10 w-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-orange-700 dark:text-orange-300">Reconocimiento y Detección en Tiempo Real</h3>
            <p className="text-gray-700 dark:text-gray-300">Identificación y seguimiento de objetos, personas o vehículos en entornos dinámicos.</p>
          </div>
          {/* Card 3 */}
          <div className="group bg-white/90 dark:bg-gray-800/90 border border-orange-100 dark:border-orange-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <FiSettings className="h-10 w-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-orange-700 dark:text-orange-300">Inspección de Calidad Automatizada</h3>
            <p className="text-gray-700 dark:text-gray-300">Examen de productos en líneas de fabricación, detección de defectos y verificación de ensamblajes.</p>
          </div>
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-700 dark:text-orange-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiTrendingUp className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">Automatización y Precisión</h3>
            <p className="text-gray-700 dark:text-gray-300">Reduce errores humanos y acelera procesos mediante análisis visual automatizado.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">Control de Calidad Mejorado</h3>
            <p className="text-gray-700 dark:text-gray-300">Detecta defectos y anomalías en tiempo real, asegurando altos estándares de producción.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiBarChart2 className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">Toma de Decisiones Ágil</h3>
            <p className="text-gray-700 dark:text-gray-300">Obtén información visual procesable para optimizar operaciones y seguridad.</p>
          </div>
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-700 dark:text-orange-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiCloud className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">Frameworks de Visión</h3>
            <p className="text-gray-700 dark:text-gray-300">OpenCV, TensorFlow, PyTorch, Keras para procesamiento y modelado visual.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiDatabase className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">Plataformas Cloud</h3>
            <p className="text-gray-700 dark:text-gray-300">AWS Rekognition, Google Vision AI, Azure Computer Vision para análisis escalable.</p>
          </div>
          <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-orange-100 dark:border-orange-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="mb-4"><FiZap className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold mb-2 text-orange-700 dark:text-orange-300">Integración Industrial</h3>
            <p className="text-gray-700 dark:text-gray-300">Cámaras inteligentes, PLCs, sistemas SCADA y APIs industriales.</p>
          </div>
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-700 dark:text-orange-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-xl border-2 border-orange-300 dark:border-orange-700 mr-2">1</span><div><h3 className="text-lg font-bold mb-1 text-orange-700 dark:text-orange-300">Diagnóstico y Objetivos</h3><p className="text-gray-700 dark:text-gray-300">Analizamos necesidades y definimos casos de uso visuales de alto impacto.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-xl border-2 border-orange-300 dark:border-orange-700 mr-2">2</span><div><h3 className="text-lg font-bold mb-1 text-orange-700 dark:text-orange-300">Desarrollo y Entrenamiento</h3><p className="text-gray-700 dark:text-gray-300">Modelamos y entrenamos algoritmos de visión adaptados a tu entorno.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-xl border-2 border-orange-300 dark:border-orange-700 mr-2">3</span><div><h3 className="text-lg font-bold mb-1 text-orange-700 dark:text-orange-300">Implementación y Pruebas</h3><p className="text-gray-700 dark:text-gray-300">Integramos la solución y validamos resultados en campo o producción.</p></div></li>
            <li className="flex items-start gap-4 animate-fade-in-up"><span className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-xl border-2 border-orange-300 dark:border-orange-700 mr-2">4</span><div><h3 className="text-lg font-bold mb-1 text-orange-700 dark:text-orange-300">Capacitación y Optimización</h3><p className="text-gray-700 dark:text-gray-300">Entrenamos a tu equipo y optimizamos la solución según resultados y feedback.</p></div></li>
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-orange-100 via-pink-50 to-white dark:from-orange-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-orange-700 dark:text-orange-300">¿Listo para potenciar tu empresa con visión artificial?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-xl transition-all duration-300 text-white animate-bounce">
            <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una consultoría gratuita
          </Link>
      </section>
    </div>
  );
};

export default VisionArtificialPage; 