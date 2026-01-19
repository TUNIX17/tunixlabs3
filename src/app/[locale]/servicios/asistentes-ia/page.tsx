import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiMessageCircle, FiZap, FiSettings, FiHeadphones, FiTrendingUp, FiBarChart2, FiCloud, FiDatabase } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Disponibilidad 24/7 y Respuesta Inmediata',
    desc: 'Atiende consultas y solicitudes en cualquier momento, sin tiempos de espera, mejorando la satisfacción y fidelización.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización y Eficiencia Operativa',
    desc: 'Reduce carga operativa, errores y costos, liberando tiempo para tareas de mayor valor.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Personalización y Conversión',
    desc: 'Ofrece experiencias hiperpersonalizadas, recomendaciones y ventas automatizadas que incrementan la conversión.'
  },
];

const tecnologias = [
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Plataformas Conversacionales y NLP',
    desc: 'Dialogflow, Microsoft Bot Framework, Rasa, OpenAI GPT, BERT y servicios cloud para comprensión y generación de lenguaje natural.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Machine Learning y Analítica',
    desc: 'Modelos predictivos, análisis de sentimiento y aprendizaje continuo para mejorar la experiencia y resultados.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración Multicanal y Seguridad',
    desc: 'APIs, CRMs, ERPs, WhatsApp, web, apps y protocolos de seguridad para una experiencia omnicanal y protección de datos.'
  },
];

const queOfrecemos = [
  {
    icon: <FiUsers className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Chatbots y Voicebots Personalizados',
    desc: 'Desarrollo de asistentes conversacionales adaptados a cada sector, canal y objetivo de negocio.'
  },
  {
    icon: <FiCloud className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integración Multicanal',
    desc: 'Conexión con WhatsApp, web, apps, redes sociales y sistemas empresariales para atención y automatización total.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Automatización de Soporte y Ventas',
    desc: 'Automatiza respuestas, ventas y procesos, mejorando la experiencia del usuario y la conversión.'
  },
];

const pasos = [
  {
    title: 'Diagnóstico y Objetivos',
    desc: 'Analizamos necesidades, procesos y definimos casos de uso conversacionales de alto impacto.'
  },
  {
    title: 'Desarrollo y Entrenamiento',
    desc: 'Diseñamos, entrenamos e integramos el asistente virtual en tus canales y sistemas.'
  },
  {
    title: 'Implementación y Pruebas',
    desc: 'Integramos, probamos y ajustamos el bot en tus sistemas reales para máxima precisión y seguridad.'
  },
  {
    title: 'Capacitación y Optimización',
    desc: 'Entrenamos a tu equipo y optimizamos el asistente según resultados, feedback y analítica.'
  },
];

const AsistentesIAPage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      <Head>
        <title>Asistentes Virtuales IA - TunixLabs</title>
        <meta name="description" content="Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Disponibilidad 24/7, personalización, integración multicanal y resultados de negocio." />
        <meta name="keywords" content="asistentes IA, chatbots, inteligencia artificial conversacional, atención al cliente, automatización, experiencia del cliente, NLP, machine learning, TunixLabs" />
        <meta property="og:title" content="Asistentes Virtuales IA - TunixLabs" />
        <meta property="og:description" content="Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Disponibilidad 24/7, personalización, integración multicanal y resultados de negocio." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/asistentes-ia" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/asistentes-ia" />
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
            Asistentes Virtuales IA
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Transforma la atención y automatización de tu empresa con asistentes virtuales inteligentes. Disponibilidad 24/7, personalización, integración multicanal y resultados de negocio. Creamos asistentes IA personalizados para cada sector, integrados en todos tus canales y sistemas, con seguridad y analítica avanzada.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Transforma tu atención al cliente con Asistentes IA
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Asistentes Inteligentes a Medida</h2>
        </div>

        <p className="text-lg text-center mb-12" style={{ color: '#718096' }}>
          Asistentes virtuales inteligentes que automatizan la atención, resuelven dudas y optimizan procesos de interacción con clientes y empleados. Integración multicanal, personalización y analítica avanzada para maximizar resultados.
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para transformar tu atención y automatización?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoría gratuita
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

export default AsistentesIAPage;