import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiMessageCircle, FiEdit, FiImage, FiSearch, FiZap, FiTrendingUp, FiBarChart2, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Ahorro de Tiempo y Recursos',
    desc: 'Automatiza la creación de textos, imágenes y videos, reduciendo el esfuerzo manual y acelerando la producción de campañas.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Consistencia y Escalabilidad',
    desc: 'Genera contenido coherente y adaptado a múltiples canales y audiencias, manteniendo la calidad a gran escala.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Optimización SEO y Engagement',
    desc: 'Crea textos e imágenes optimizados para buscadores y maximiza la interacción con tu audiencia.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Plataformas Generativas',
    desc: 'OpenAI GPT, DALL·E, Midjourney, Jasper, Copy.ai para generación de texto e imágenes personalizadas.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integraciones de CMS y Automatización',
    desc: 'WordPress, Contentful, HubSpot, Shopify y APIs para publicación y gestión automatizada de contenido.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Herramientas de Optimización',
    desc: 'SurferSEO, Grammarly, Google Analytics y sistemas de analítica para mejorar calidad y resultados.'
  },
];

const queOfrecemos = [
  {
    icon: <FiEdit className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Copywriting y Creatividad Automática',
    desc: 'Textos para blogs, productos, emails y campañas, adaptados a tu tono, objetivos y SEO.'
  },
  {
    icon: <FiImage className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Imágenes y Videos Personalizados',
    desc: 'Recursos visuales únicos y creativos para campañas, redes sociales y branding.'
  },
  {
    icon: <FiSearch className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
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
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
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

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-300 mix-blend-multiply opacity-20 filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-300 mix-blend-multiply opacity-20 filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Generación de Contenido con IA
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa tu marketing y comunicación con generación de contenido inteligente. Automatiza la creación de textos, imágenes y videos personalizados, optimizados para SEO, engagement y resultados de negocio. Escala tu estrategia de contenidos con IA generativa y creatividad a gran escala.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Automatiza tu contenido con IA
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Contenido Inteligente a Medida</h2>
        </div>
        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Generación de contenido automatizado y personalizado con IA: textos, imágenes y videos adaptados a tu marca, objetivos y canales. Integramos creatividad, automatización y optimización SEO para maximizar el impacto de tu comunicación.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {queOfrecemos.map((item, i) => (
            <div key={i} className="neu-raised p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
              <div className="neu-service-icon mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: '#2d3748' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Beneficios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Beneficios Clave</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((item, i) => (
            <div key={i} className="neu-raised p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
              <div className="neu-service-icon mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: '#2d3748' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tecnologias - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Tecnologías Usadas</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tecnologias.map((item, i) => (
            <div key={i} className="neu-raised p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1">
              <div className="neu-service-icon mx-auto">{item.icon}</div>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: '#2d3748' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proceso - Neumorphic */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Proceso
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Nuestro Proceso</h2>
        </div>

        <div className="neu-raised p-6 sm:p-8 rounded-2xl">
          <ol className="space-y-6">
            {pasos.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--neu-primary)' }}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#2d3748' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: '#718096' }}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA Final - Neumorphic */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para crear contenido a escala?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una demo gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 neu-bg text-center" style={{ color: '#718096' }}>
        <p>&copy; 2026 TunixLabs. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default GeneracionContenidoIAPage;
