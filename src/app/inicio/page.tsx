'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineGlobeAlt, HiOutlineChartBar, HiOutlineChatBubbleLeftRight, HiOutlinePresentationChartBar, HiOutlineCamera, HiOutlineLightBulb, HiOutlineCog8Tooth, HiOutlinePencilSquare, HiOutlineMegaphone } from 'react-icons/hi2';
import { BsWhatsapp } from 'react-icons/bs';
import React from 'react';
import dynamic from 'next/dynamic';

// Carga dinámica del componente RobotModel para evitar errores de SSR
const RobotModel = dynamic(() => import('./components/RobotModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-blue-600 text-lg">Cargando modelo 3D...</div>
    </div>
  )
});

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuralNetworkRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marcar como montado solo en el cliente
    setIsMounted(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Animación de red neuronal
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar el canvas al tamaño completo
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Configuración de la red neuronal
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const nodeCount = Math.min(Math.floor(window.innerWidth / 100), 20); // Ajustar según el ancho de la pantalla
    
    // Crear nodos
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    // Función para dibujar la red
    const drawNetwork = () => {
      if (!ctx) return;

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar conexiones
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Dibujar nodos
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, 0.4)';
        ctx.fill();
        
        // Actualizar posición
        node.x += node.vx;
        node.y += node.vy;
        
        // Rebote en los bordes
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }
      
      requestAnimationFrame(drawNetwork);
    };
    
    drawNetwork();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
      <div className="min-h-screen relative neu-bg" style={{backgroundColor: 'var(--neu-bg)'}}>
        {/* Aurora Blobs - Floating animated shapes */}
        <div className="aurora-blob aurora-blob-1"></div>
        <div className="aurora-blob aurora-blob-2"></div>
        <div className="aurora-blob aurora-blob-3"></div>
        <div className="aurora-blob aurora-blob-4"></div>
        {/* Neural Network Background - Sutil */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 opacity-30"
        />

        {/* Parallax Wrapper */}
        <div className="parallax-wrapper">
        {/* Hero Section - Neumorphic Style */}
          <section className="relative pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              {/* Content Column */}
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <div className="mt-16 lg:mt-20">
                  <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl" style={{color: '#2d3748'}}>
                    <span className="block">Soluciones de</span>
                    <span className="block neu-gradient-text">
                      Inteligencia Artificial
                    </span>
                    <span className="block">para tu negocio</span>
                  </h1>
                  <p className="mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{color: '#718096', lineHeight: '1.7'}}>
                    En TunixLabs, transformamos tu empresa con tecnologia de vanguardia. Nuestras soluciones de IA estan disenadas para impulsar tu crecimiento y optimizar tus procesos.
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                      <Link href="/contacto" className="neu-btn-primary text-center">
                        Contactar
                      </Link>
                      <a href="#servicios" className="neu-btn-secondary text-center">
                        Ver Servicios
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Robot Column - Neumorphic Circle */}
              <div className="mt-12 relative sm:mx-auto lg:mt-0 lg:col-span-6 lg:flex lg:items-center lg:justify-center">
                <div className="neu-robot-container">
                  <div className="neu-robot-avatar">
                    {/* Robot 3D Canvas Wrapper */}
                    <div className="robot-canvas-wrapper">
                      <RobotModel />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Servicios Section - Neumorphic Style */}
        <section id="servicios" className="py-16 neu-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--neu-primary)' }}>
                Nuestros Servicios
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl neu-gradient-text">
                Soluciones de IA para cada necesidad
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl" style={{ color: '#718096' }}>
                Impulsando tu negocio con tecnologia de vanguardia
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Tarjeta de Desarrollos Web */}
                <Link href="/servicios/desarrollos-web" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineGlobeAlt className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Desarrollos Web</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Creamos experiencias web interactivas y escalables, potenciadas con inteligencia artificial.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Machine Learning */}
                <Link href="/servicios/machine-learning" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineChartBar className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Machine Learning</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Implementamos modelos predictivos que aprenden de tus datos para automatizar procesos.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Asistentes IA */}
                <Link href="/servicios/asistentes-ia" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineChatBubbleLeftRight className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Asistentes IA</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Creamos asistentes virtuales inteligentes que mejoran la experiencia de tus clientes.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Business Intelligence */}
                <Link href="/servicios/business-intelligence" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlinePresentationChartBar className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Business Intelligence</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Dashboards interactivos y reportes automatizados para monitorear tu negocio.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Visión Artificial */}
                <Link href="/servicios/vision-artificial" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineCamera className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Vision Artificial</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Sistemas de vision por computadora para reconocimiento y analisis de imagenes.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Consultoría IA */}
                <Link href="/servicios/consultoria-ia" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineLightBulb className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Consultoria IA</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Te asesoramos en estrategias de IA que maximizan el retorno de inversion.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de RPA */}
                <Link href="/servicios/rpa" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineCog8Tooth className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>RPA con IA</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Automatiza tareas repetitivas con robots de software inteligentes.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Generación de Contenido con IA */}
                <Link href="/servicios/generacion-contenido-ia" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlinePencilSquare className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Generacion de Contenido IA</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Crea textos, imagenes y videos personalizados mediante IA.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Tarjeta de Automatización de Marketing y Ventas con IA */}
                <Link href="/servicios/automatizacion-marketing-ia" passHref>
                  <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    <div className="neu-service-icon">
                      <HiOutlineMegaphone className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                    </div>
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-dark)' }}>Automatizacion Marketing IA</h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Segmenta, personaliza y automatiza campanas de marketing.</p>
                    <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                      Saber mas
                      <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Neumorphic Style */}
        <section id="contacto" className="py-16 neu-bg relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--neu-primary)' }}>
                Contacto
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl neu-gradient-text">
                Transforma tu negocio con IA
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl" style={{ color: '#718096' }}>
                Contactanos hoy para una consulta gratuita
              </p>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
              {/* Formulario de contacto */}
              <div className="neu-raised p-6 sm:p-8 rounded-2xl mb-10 lg:mb-0">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2d3748' }}>Envianos un mensaje</h3>
                  <p className="mt-2 text-sm" style={{ color: '#718096' }}>
                    Completa el formulario y nos pondremos en contacto contigo.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Nombre</label>
                      <input
                        type="text"
                        id="name"
                        className="neu-input"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Email</label>
                      <input
                        type="email"
                        id="email"
                        className="neu-input"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Asunto</label>
                    <input
                      type="text"
                      id="subject"
                      className="neu-input"
                      placeholder="Como podemos ayudarte?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>Mensaje</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="neu-input resize-none"
                      placeholder="Cuentanos sobre tu proyecto"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="mailto:contacto@tunixlabs.com?subject=Contacto desde TunixLabs&body=Hola, me gustaría obtener más información sobre sus servicios de IA."
                    className="neu-btn-primary w-full inline-block text-center"
                  >
                    Enviar mensaje
                  </a>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="text-center lg:text-left">
                <div className="max-w-md mx-auto lg:mr-0 lg:ml-auto">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>Informacion de contacto</h3>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0 }}>
                        <svg className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium" style={{ color: 'var(--text-dark)' }}>Email</p>
                        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>contacto@tunixlabs.com</p>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/56930367979?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios%20de%20IA."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start group"
                    >
                      <div className="neu-service-icon flex-shrink-0 transition-all duration-300 group-hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0, background: 'linear-gradient(145deg, #25D366, #128C7E)' }}>
                        <BsWhatsapp className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium" style={{ color: 'var(--text-dark)' }}>WhatsApp</p>
                        <p className="mt-1 group-hover:text-green-600 transition-colors" style={{ color: 'var(--text-muted)' }}>Escribenos por WhatsApp</p>
                      </div>
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 neu-bg text-center" style={{ color: '#718096' }}>
          <p>&copy; 2026 TunixLabs. Todos los derechos reservados.</p>
        </footer>
        </div>
      </div>
  );
} 