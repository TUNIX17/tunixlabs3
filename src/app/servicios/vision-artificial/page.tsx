import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiEye, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatizacion y Precision',
    desc: 'Automatiza inspecciones, controles de calidad y monitoreo visual con precision superior y reduccion de errores.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Analitica Visual Avanzada',
    desc: 'Extrae insights de imagenes y videos en tiempo real para optimizar procesos y tomar decisiones informadas.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Escalabilidad y Eficiencia',
    desc: 'Procesa grandes volumenes de datos visuales, escalando operaciones sin incrementar recursos.'
  },
];

const tecnologias = [
  {
    icon: <FiEye className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Redes Neuronales y Deep Learning',
    desc: 'TensorFlow, PyTorch, OpenCV, YOLO, Detectron2 y modelos de vision artificial de ultima generacion.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Procesamiento y Almacenamiento',
    desc: 'Big Data, Data Lakes, GPUs, APIs y pipelines para gestion eficiente de imagenes y video.'
  },
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integracion y Analitica',
    desc: 'APIs, ERPs, CRMs, sistemas industriales y dashboards para visualizacion y control.'
  },
];

const queOfrecemos = [
  {
    icon: <FiEye className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Reconocimiento de Imagenes y Video',
    desc: 'Identificacion, clasificacion y seguimiento automatico de objetos, personas y patrones.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatizacion de Inspeccion y Control',
    desc: 'Soluciones para control de calidad, seguridad, monitoreo y procesos industriales.'
  },
  {
    icon: <FiCloud className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Analitica Visual y Dashboards',
    desc: 'Visualizacion de resultados, alertas inteligentes y analitica avanzada para toma de decisiones.'
  },
];

const pasos = [
  { title: 'Diagnostico y Objetivos', desc: 'Analizamos procesos y necesidades para definir casos de uso de vision artificial de alto impacto.' },
  { title: 'Desarrollo y Entrenamiento', desc: 'Disenamos, entrenamos e integramos modelos de vision artificial en tus sistemas.' },
  { title: 'Implementacion y Pruebas', desc: 'Integramos, probamos y ajustamos la solucion en entornos reales para maxima precision.' },
  { title: 'Monitoreo y Optimizacion', desc: 'Monitorizamos el desempeno, optimizamos y escalamos la solucion segun resultados.' },
];

const VisionArtificialPage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>
      <Head>
        <title>Vision Artificial - TunixLabs</title>
        <meta name="description" content="Impulsa la eficiencia y precision de tu empresa con soluciones de vision artificial: reconocimiento de imagenes, automatizacion de inspeccion y analitica visual avanzada." />
        <meta name="keywords" content="vision artificial, computer vision, reconocimiento de imagenes, deep learning, automatizacion de inspeccion, analitica visual, TunixLabs" />
        <meta property="og:title" content="Vision Artificial - TunixLabs" />
        <meta property="og:description" content="Impulsa la eficiencia y precision de tu empresa con soluciones de vision artificial: reconocimiento de imagenes, automatizacion de inspeccion y analitica visual avanzada." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/vision-artificial" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/vision-artificial" />
      </Head>

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Vision Artificial
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa la eficiencia y precision de tu empresa con soluciones de vision artificial: reconocimiento de imagenes, automatizacion de inspeccion y analitica visual avanzada. Transforma tus procesos con inteligencia visual de ultima generacion.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoria en Vision Artificial
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones de Vision Artificial</h2>
        </div>

        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Soluciones de vision artificial para automatizar inspecciones, extraer insights visuales y optimizar procesos. Reconocimiento de imagenes, analitica avanzada y dashboards para transformar tu negocio.
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
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Tecnologias Usadas</h2>
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para transformar tu empresa con Vision Artificial?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoria en Vision Artificial
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

export default VisionArtificialPage;
