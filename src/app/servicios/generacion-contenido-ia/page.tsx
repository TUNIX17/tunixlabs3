import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiMessageCircle, FiEdit, FiImage, FiSearch, FiZap, FiLayers, FiTrendingUp, FiBarChart2, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8 text-pink-500" />, 
    title: 'Ahorro de Tiempo y Recursos',
    desc: 'Automatiza la creación de textos, imágenes y videos, reduciendo el esfuerzo manual y acelerando la producción de campañas.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-pink-500" />, 
    title: 'Consistencia y Escalabilidad',
    desc: 'Genera contenido coherente y adaptado a múltiples canales y audiencias, manteniendo la calidad a gran escala.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-pink-500" />, 
    title: 'Optimización SEO y Engagement',
    desc: 'Crea textos e imágenes optimizados para buscadores y maximiza la interacción con tu audiencia.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8 text-pink-500" />,
    title: 'Plataformas Generativas',
    desc: 'OpenAI GPT, DALL·E, Midjourney, Jasper, Copy.ai para generación de texto e imágenes personalizadas.'
  },
  {
    icon: <FiDatabase className="h-8 w-8 text-pink-500" />,
    title: 'Integraciones de CMS y Automatización',
    desc: 'WordPress, Contentful, HubSpot, Shopify y APIs para publicación y gestión automatizada de contenido.'
  },
  {
    icon: <FiZap className="h-8 w-8 text-pink-500" />,
    title: 'Herramientas de Optimización',
    desc: 'SurferSEO, Grammarly, Google Analytics y sistemas de analítica para mejorar calidad y resultados.'
  },
];

const queOfrecemos = [
  {
    icon: <FiEdit className="h-10 w-10 text-pink-500 mb-4" />,
    title: 'Copywriting y Creatividad Automática',
    desc: 'Textos para blogs, productos, emails y campañas, adaptados a tu tono, objetivos y SEO.'
  },
  {
    icon: <FiImage className="h-10 w-10 text-pink-500 mb-4" />,
    title: 'Imágenes y Videos Personalizados',
    desc: 'Recursos visuales únicos y creativos para campañas, redes sociales y branding.'
  },
  {
    icon: <FiSearch className="h-10 w-10 text-pink-500 mb-4" />,
    title: 'Optimización SEO con IA',
    desc: 'Contenido optimizado para buscadores, análisis de palabras clave y tendencias para mayor visibilidad.'
  },
];

const pasos = [
  {
    title: 'Brief y Estrategia',
    desc: 'Definimos objetivos, tono, audiencias y canales de distribución del contenido.'
  },
  {
    title: 'Generación y Curación',
    desc: 'Creamos y revisamos textos, imágenes y videos con IA y expertos humanos para máxima calidad.'
  },
  {
    title: 'Publicación y Optimización',
    desc: 'Automatizamos la publicación y optimizamos el contenido según métricas, feedback y resultados de negocio.'
  },
];

const GeneracionContenidoIAPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-950 dark:to-pink-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Generación de Contenido con IA - TunixLabs</title>
        <meta name="description" content="Crea textos, imágenes y videos personalizados mediante IA, optimizados para SEO, engagement y resultados de negocio. Automatiza y escala tu marketing de contenidos." />
        <meta name="keywords" content="generación de contenido, IA, inteligencia artificial, copywriting automático, contenido inteligente, marketing digital, SEO, automatización, TunixLabs" />
        <meta property="og:title" content="Generación de Contenido con IA - TunixLabs" />
        <meta property="og:description" content="Crea textos, imágenes y videos personalizados mediante IA, optimizados para SEO, engagement y resultados de negocio. Automatiza y escala tu marketing de contenidos." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/generacion-contenido-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/generacion-contenido-ia" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-pink-600 via-red-500 to-pink-400 py-20 px-4 flex flex-col items-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center z-10">
          <Link href="/inicio" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-red-200 animate-gradient-x drop-shadow-lg">
            Generación de Contenido con IA
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
            Impulsa tu marketing y comunicación con generación de contenido inteligente. Automatiza la creación de textos, imágenes y videos personalizados, optimizados para SEO, engagement y resultados de negocio. Escala tu estrategia de contenidos con IA generativa y creatividad a gran escala.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-xl transition-all duration-300 text-white animate-bounce">
            <FiMessageCircle className="h-6 w-6 mr-3" />
            Automatiza tu contenido con IA
          </Link>
        </div>
      </div>
      </section>
      {/* ¿Qué ofrecemos? */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-pink-700 dark:text-pink-300 animate-fade-in-up">¿Qué ofrecemos?</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
          Generación de contenido automatizado y personalizado con IA: textos, imágenes y videos adaptados a tu marca, objetivos y canales. Integramos creatividad, automatización y optimización SEO para maximizar el impacto de tu comunicación.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 border border-pink-100 dark:border-pink-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2 text-pink-700 dark:text-pink-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* BENEFICIOS CLAVE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-pink-700 dark:text-pink-300 animate-fade-in-up">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-pink-100 dark:border-pink-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-pink-700 dark:text-pink-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* TECNOLOGÍAS USADAS */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-pink-700 dark:text-pink-300 animate-fade-in-up">Tecnologías Usadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tecnologias.map((item, i) => (
            <div key={i} className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-pink-100 dark:border-pink-900 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-pink-700 dark:text-pink-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NUESTRO PROCESO */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-pink-700 dark:text-pink-300 animate-fade-in-up">Nuestro Proceso</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8">
          <ol className="flex-1 space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4 animate-fade-in-up">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 font-bold text-xl border-2 border-pink-300 dark:border-pink-700 mr-2">{i+1}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-pink-700 dark:text-pink-300">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="w-full flex flex-col items-center py-16 bg-gradient-to-r from-pink-100 via-red-50 to-white dark:from-pink-900 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-pink-700 dark:text-pink-300">¿Listo para crear contenido a escala?</h2>
        <Link href="/contacto" className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-xl transition-all duration-300 text-white animate-bounce">
          <FiMessageCircle className="h-6 w-6 mr-3" />
          Solicita una demo gratuita
        </Link>
      </section>
    </div>
  );
};

export default GeneracionContenidoIAPage; 