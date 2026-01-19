import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCpu, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Predicción y Toma de Decisiones',
    desc: 'Anticipa tendencias, demanda y comportamientos con modelos predictivos avanzados.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización Inteligente',
    desc: 'Optimiza procesos, reduce errores y personaliza experiencias con IA adaptativa.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Escalabilidad y Analítica Avanzada',
    desc: 'Procesa grandes volúmenes de datos y escala soluciones de machine learning según tus necesidades.'
  },
];

const tecnologias = [
  {
    icon: <FiCpu className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Frameworks y Plataformas ML',
    desc: 'TensorFlow, PyTorch, Scikit-learn, Keras, Azure ML, Google AI Platform, AWS SageMaker.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Gestión y Procesamiento de Datos',
    desc: 'Big Data, Data Lakes, ETL, APIs, pipelines y almacenamiento eficiente para entrenamiento y despliegue.'
  },
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración y Despliegue',
    desc: 'APIs, microservicios, ERPs, CRMs y dashboards para soluciones ML integradas y accesibles.'
  },
];

const queOfrecemos = [
  {
    icon: <FiCpu className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Desarrollo de Modelos Predictivos',
    desc: 'Creamos modelos de machine learning para predicción, clasificación, segmentación y recomendación.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización y Personalización',
    desc: 'Soluciones de IA para automatizar procesos, personalizar experiencias y optimizar resultados.'
  },
  {
    icon: <FiCloud className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
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
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
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

      {/* HERO - Neumorphic Style */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-400 mix-blend-multiply opacity-20 filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-500 mix-blend-multiply opacity-20 filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/inicio" className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8" style={{ color: '#718096' }}>
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Volver a Servicios
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            Machine Learning
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa tu negocio con soluciones de machine learning: modelos predictivos, automatización inteligente, analítica avanzada e integración con tus sistemas. Transforma tus datos en resultados tangibles y escalables.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría en Machine Learning
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Qué ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones de Machine Learning</h2>
        </div>
        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Soluciones de machine learning para anticipar tendencias, automatizar procesos y personalizar experiencias. Modelos predictivos, integración y analítica avanzada para transformar tu negocio.
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
            Tecnologías
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">¿Listo para transformar tu negocio con Machine Learning?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría en Machine Learning
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

export default MachineLearningPage;
