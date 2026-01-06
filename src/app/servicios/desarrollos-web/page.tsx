import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCode, FiZap, FiBarChart2, FiTrendingUp, FiCloud, FiDatabase, FiMessageCircle } from 'react-icons/fi';

const beneficios = [
  {
    icon: <FiTrendingUp className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Experiencias Personalizadas',
    desc: 'Diseno UX/UI centrado en el usuario, adaptado a cada cliente y sector.'
  },
  {
    icon: <FiZap className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Eficiencia y Automatizacion',
    desc: 'Automatizacion de flujos, integracion de IA y dashboards para optimizar procesos.'
  },
  {
    icon: <FiBarChart2 className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Escalabilidad y Analitica',
    desc: 'Soluciones escalables con analitica avanzada y monitoreo en tiempo real.'
  },
];

const tecnologias = [
  {
    icon: <FiCode className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Frameworks Modernos',
    desc: 'React, Next.js, Node.js, Tailwind, integrados con APIs y microservicios.'
  },
  {
    icon: <FiCloud className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'IA y Automatizacion',
    desc: 'Integracion de IA, chatbots, personalizacion dinamica y automatizacion.'
  },
  {
    icon: <FiDatabase className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Dashboards y Analitica',
    desc: 'Paneles de control intuitivos y analitica avanzada de metricas clave.'
  },
];

const queOfrecemos = [
  {
    icon: <FiCode className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Desarrollo Web a Medida',
    desc: 'Sitios y aplicaciones web personalizados, optimizados para SEO y conversion.'
  },
  {
    icon: <FiZap className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Integracion de IA',
    desc: 'Chatbots, personalizacion, flujos automaticos y conectividad empresarial.'
  },
  {
    icon: <FiCloud className="h-10 w-10" style={{ color: 'var(--neu-primary)' }} />,
    title: 'Dashboards y Analitica Web',
    desc: 'Paneles de control, reportes y analitica en tiempo real.'
  },
];

const pasos = [
  { title: 'Diagnostico y Objetivos', desc: 'Analizamos tu negocio y objetivos para definir la mejor estrategia.' },
  { title: 'Diseno y Prototipado', desc: 'Creamos wireframes y prototipos UX/UI alineados a la conversion.' },
  { title: 'Desarrollo e Integracion', desc: 'Construimos la solucion web con IA y automatizacion.' },
  { title: 'Despliegue y Optimizacion', desc: 'Lanzamos, capacitamos y optimizamos con analitica.' },
];

const DesarrollosWebPage: React.FC = () => {
  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      <Head>
        <title>Desarrollos Web - TunixLabs</title>
        <meta name="description" content="Impulsa tu negocio con desarrollos web personalizados: UX, automatizacion, IA, dashboards e integracion." />
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
            Desarrollos Web
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#718096', lineHeight: '1.7' }}>
            Impulsa tu negocio con desarrollos web personalizados: UX, automatizacion, IA, dashboards e integracion. Soluciones escalables orientadas a resultados.
          </p>

          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoria gratuita
          </Link>
        </div>
      </section>

      {/* Que ofrecemos - Neumorphic */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4" style={{ color: 'var(--neu-primary)' }}>
            Que ofrecemos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold neu-gradient-text">Soluciones Web a Medida</h2>
        </div>

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
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 neu-gradient-text">Listo para transformar tu presencia digital?</h2>
          <Link href="/contacto" className="neu-btn-primary inline-flex items-center">
            <FiMessageCircle className="h-5 w-5 mr-2" />
            Solicita una consultoria gratuita
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

export default DesarrollosWebPage; 