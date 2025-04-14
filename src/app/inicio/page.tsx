'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiDatabase, FiActivity, FiUsers, FiBarChart2, FiCode, FiMessageCircle } from 'react-icons/fi';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuralNetworkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
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
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
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
    <div className="min-h-screen relative overflow-hidden bg-gray-50" style={{backgroundColor: '#f9fafb'}}>
      {/* Neural Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-70"
      />

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle-1"></div>
        <div className="particle-2"></div>
        <div className="particle-3"></div>
        <div className="absolute top-1/3 left-1/4">
          <div className="relative w-4 h-4">
            <div className="particle-orbit-1"></div>
            <div className="particle-orbit-2"></div>
            <div className="particle-orbit-3"></div>
          </div>
        </div>
        <div className="absolute top-2/3 right-1/4">
          <div className="relative w-4 h-4">
            <div className="particle-orbit-1"></div>
            <div className="particle-orbit-2"></div>
            <div className="particle-orbit-3"></div>
          </div>
        </div>
      </div>

      {/* Parallax Wrapper */}
      <div className="parallax-wrapper">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute -top-10 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply opacity-10 filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-40 -left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply opacity-10 filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <div className="mt-20">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    <span className="block">Soluciones de</span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 animate-text-shimmer">
                      Inteligencia Artificial
                    </span>
                    <span className="block">para tu negocio</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    En TunixLabs, transformamos tu empresa con tecnología de vanguardia. Nuestras soluciones de IA están diseñadas para impulsar tu crecimiento y optimizar tus procesos.
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <a href="#contacto" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 neon-border md:py-4 md:text-lg md:px-10 transition-all duration-300">
                          Contactar
                        </a>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <a href="#servicios" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 glass md:py-4 md:text-lg md:px-10 transition-all duration-300">
                          Servicios
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full card-3d">
                  <div className="card-3d-inner glass-card rounded-lg shadow-lg lg:max-w-md animate-float">
                    <div className="relative block w-full rounded-lg overflow-hidden">
                      <div className="w-full h-80 relative">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-44 h-44 relative animate-spin-slow">
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 border-opacity-30"></div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                          </div>
                          <div className="w-36 h-36 absolute animate-spin-reverse">
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400 border-opacity-30"></div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500"></div>
                          </div>
                          <div className="animate-morph bg-blue-600 bg-opacity-30 backdrop-filter backdrop-blur w-24 h-24 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white neon-text">AI</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios Section */}
        <section id="servicios" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Nuestros Servicios</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl animate-text-shimmer bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Soluciones de IA para cada necesidad
              </p>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Impulsando tu negocio con tecnología de vanguardia
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                    <FiDatabase className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Análisis de Datos</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Convertimos tus datos en información valiosa para la toma de decisiones. Nuestros algoritmos avanzados detectan patrones y tendencias ocultas.
                  </p>
                  <div className="mt-4">
                    <a href="#contacto" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Saber más &rarr;
                    </a>
                  </div>
                </div>

                <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center">
                    <FiActivity className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Machine Learning</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Implementamos modelos predictivos que aprenden de tus datos para automatizar procesos y mejorar la eficiencia operativa.
                  </p>
                  <div className="mt-4">
                    <a href="#contacto" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Saber más &rarr;
                    </a>
                  </div>
                </div>

                <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
                    <FiUsers className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Asistentes IA</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Creamos asistentes virtuales inteligentes que mejoran la experiencia de tus clientes y optimizan la atención al cliente.
                  </p>
                  <div className="mt-4">
                    <a href="#contacto" className="text-sm font-medium text-green-600 hover:text-green-500">
                      Saber más &rarr;
                    </a>
                  </div>
                </div>

                <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                    <FiBarChart2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Business Intelligence</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Desarrollamos dashboards interactivos y reportes automatizados para monitorear el rendimiento de tu negocio en tiempo real.
                  </p>
                  <div className="mt-4">
                    <a href="#contacto" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                      Saber más &rarr;
                    </a>
                  </div>
                </div>

                <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 bg-yellow-100 rounded-md flex items-center justify-center">
                    <FiCode className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Desarrollo Personalizado</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Creamos soluciones a medida que se integran perfectamente con tus sistemas existentes y resuelven problemas específicos.
                  </p>
                  <div className="mt-4">
                    <a href="#contacto" className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
                      Saber más &rarr;
                    </a>
                  </div>
                </div>

                <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="h-12 w-12 bg-red-100 rounded-md flex items-center justify-center">
                    <FiMessageCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Consultoría IA</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Te asesoramos en la implementación de estrategias de IA que maximizan el retorno de inversión y minimizan riesgos.
                  </p>
                  <div className="mt-4">
                    <a href="#contacto" className="text-sm font-medium text-red-600 hover:text-red-500">
                      Saber más &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="contacto" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
            <div className="particle-1"></div>
            <div className="particle-2"></div>
            <div className="particle-3"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-base text-blue-200 font-semibold tracking-wide uppercase neon-text">¿Listo para empezar?</h2>
              <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Transforma tu negocio con IA
              </p>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-200 sm:mt-4">
                Contáctanos hoy para una consulta gratuita
              </p>
            </div>
            <div className="mt-10 max-w-md mx-auto">
              <div className="glass-card p-6 bg-white backdrop-filter backdrop-blur-lg bg-opacity-90">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">Información de contacto</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Estamos disponibles para ayudarte en tu transformación digital
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-3 text-gray-700">info@tunixlabs.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="ml-3 text-gray-700">+34 123 456 789</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="ml-3 text-gray-700">Madrid, España</span>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 neon-border"
                  >
                    Solicitar información
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 