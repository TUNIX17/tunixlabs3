'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiDatabase, FiActivity, FiUsers, FiBarChart2, FiCode, FiMessageCircle } from 'react-icons/fi';
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
                        {/* Fondo con gradiente mejorado */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 opacity-20"></div>
                        
                        {/* Robot 3D interactivo */}
                        <RobotModel />
                        
                        {/* Partículas flotantes */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(20)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute rounded-full"
                              style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 4 + 2}px`,
                                height: `${Math.random() * 4 + 2}px`,
                                backgroundColor: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, 246, ${Math.random() * 0.5 + 0.2})`,
                                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`
                              }}
                            />
                          ))}
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
                {/* Tarjeta de Análisis de Datos */}
                <div className="glass-card p-6 overflow-hidden rounded-xl relative group">
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md z-10 relative">
                    <FiDatabase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Análisis de Datos</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Convertimos tus datos en información valiosa para la toma de decisiones. Nuestros algoritmos avanzados detectan patrones y tendencias ocultas.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a href="#contacto" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center group">
                      <span>Saber más</span>
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tarjeta de Machine Learning */}
                <div className="glass-card p-6 overflow-hidden rounded-xl relative group">
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors duration-300"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md z-10 relative">
                    <FiActivity className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">Machine Learning</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Implementamos modelos predictivos que aprenden de tus datos para automatizar procesos y mejorar la eficiencia operativa.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a href="#contacto" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center group">
                      <span>Saber más</span>
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
                  </div>
                </div>

                {/* Tarjeta de Asistentes IA */}
                <div className="glass-card p-6 overflow-hidden rounded-xl relative group">
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md z-10 relative">
                    <FiUsers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">Asistentes IA</h3>
              <p className="mt-2 text-base text-gray-500">
                    Creamos asistentes virtuales inteligentes que mejoran la experiencia de tus clientes y optimizan la atención al cliente.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a href="#contacto" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center group">
                      <span>Saber más</span>
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
            </div>

                {/* Tarjeta de Business Intelligence */}
                <div className="glass-card p-6 overflow-hidden rounded-xl relative group">
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md z-10 relative">
                    <FiBarChart2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Business Intelligence</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Desarrollamos dashboards interactivos y reportes automatizados para monitorear el rendimiento de tu negocio en tiempo real.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a href="#contacto" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center group">
                      <span>Saber más</span>
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
                  </div>
                </div>

                {/* Tarjeta de Desarrollo Personalizado */}
                <div className="glass-card p-6 overflow-hidden rounded-xl relative group">
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-colors duration-300"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md z-10 relative">
                    <FiCode className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">Desarrollo Personalizado</h3>
              <p className="mt-2 text-base text-gray-500">
                    Creamos soluciones a medida que se integran perfectamente con tus sistemas existentes y resuelven problemas específicos.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a href="#contacto" className="text-sm font-medium text-yellow-600 hover:text-yellow-700 flex items-center group">
                      <span>Saber más</span>
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
            </div>
          </div>
        </div>

                {/* Tarjeta de Consultoría IA */}
                <div className="glass-card p-6 overflow-hidden rounded-xl relative group">
                  <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-red-100 group-hover:bg-red-200 transition-colors duration-300"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md z-10 relative">
                    <FiMessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">Consultoría IA</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Te asesoramos en la implementación de estrategias de IA que maximizan el retorno de inversión y minimizan riesgos.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a href="#contacto" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center group">
                      <span>Saber más</span>
                      <svg className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* Call to Action Section */}
        <section id="contacto" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
            <div className="particle-1"></div>
            <div className="particle-2"></div>
            <div className="particle-3"></div>
          </div>
          
          {/* Formas decorativas */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute -left-20 top-20 w-72 h-72 rounded-full bg-blue-500 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-base text-blue-200 font-semibold tracking-wide uppercase neon-text">¿Listo para empezar?</h2>
              <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Transforma tu negocio con IA
              </p>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-200 sm:mt-4">
                Contáctanos hoy para una consulta gratuita
              </p>
            </div>
            
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              {/* Formulario de contacto */}
              <div className="glass-card p-6 backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl shadow-xl mb-10 lg:mb-0">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white">Envíanos un mensaje</h3>
                  <p className="mt-2 text-blue-100">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                      <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">Nombre</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 placeholder-opacity-70 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
            </div>
            <div>
                      <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 placeholder-opacity-70 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-blue-100 mb-1">Asunto</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 placeholder-opacity-70 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="¿Cómo podemos ayudarte?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-blue-100 mb-1">Mensaje</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 placeholder-opacity-70 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Cuéntanos sobre tu proyecto o consulta"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 border border-transparent rounded-lg py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition-all duration-300 hover:scale-105 neon-border"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>
              
              {/* Información de contacto */}
              <div className="text-center lg:text-left">
                <div className="max-w-md mx-auto lg:mr-0 lg:ml-auto">
                  <h3 className="text-xl font-semibold text-white mb-6">Información de contacto</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium text-white">Email</p>
                        <p className="mt-1 text-blue-200">info@tunixlabs.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium text-white">Teléfono</p>
                        <p className="mt-1 text-blue-200">+34 123 456 789</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium text-white">Ubicación</p>
                        <p className="mt-1 text-blue-200">Madrid, España</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Redes sociales */}
                  <div className="mt-10">
                    <p className="text-lg font-medium text-white mb-4">Síguenos</p>
                    <div className="flex justify-center lg:justify-start space-x-4">
                      <a href="#" className="h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center text-blue-300 hover:bg-opacity-20 transition-all duration-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center text-blue-300 hover:bg-opacity-20 transition-all duration-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.948-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center text-blue-300 hover:bg-opacity-20 transition-all duration-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center text-blue-300 hover:bg-opacity-20 transition-all duration-300">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
    </div>
  );
} 