import React from 'react';
import Head from 'next/head';
import { FiMail, FiPhone, FiUser, FiMessageCircle, FiSend, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-0 pb-0">
      <Head>
        <title>Contacto | TunixLabs</title>
        <meta name="description" content="Contáctanos para asesoría, proyectos o colaboraciones en IA, automatización y tecnología. Respuesta rápida y atención personalizada." />
        <meta name="keywords" content="contacto, TunixLabs, asesoría, proyectos, inteligencia artificial, automatización, tecnología" />
        <meta property="og:title" content="Contacto | TunixLabs" />
        <meta property="og:description" content="Contáctanos para asesoría, proyectos o colaboraciones en IA, automatización y tecnología. Respuesta rápida y atención personalizada." />
        <meta property="og:url" content="https://www.tunixlabs.com/contacto" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/contacto" />
      </Head>
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-500 py-16 px-4 flex flex-col items-center text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-blue-200 animate-gradient-x drop-shadow-lg mb-4">
          ¿Hablemos de tu proyecto?
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6 animate-fade-in-up">
          Completa el formulario o escríbenos directamente. Nuestro equipo te responderá en menos de 24h para asesorarte en IA, automatización y tecnología.
        </p>
      </section>
      {/* FORMULARIO Y DATOS */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in-up">
        {/* Formulario */}
        <form className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 flex flex-col gap-6 border border-indigo-100 dark:border-indigo-900">
          <h2 className="text-2xl font-bold mb-2 text-indigo-700 dark:text-indigo-300 flex items-center gap-2"><FiMessageCircle className="h-6 w-6" /> Envíanos un mensaje</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label htmlFor="nombre" className="text-sm font-medium mb-1">Nombre</label>
                <div className="relative">
                  <input id="nombre" name="nombre" type="text" required placeholder="Tu nombre" className="w-full rounded-lg border border-indigo-200 dark:border-indigo-800 px-4 py-2 pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  <FiUser className="absolute left-3 top-3 text-indigo-400" />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <label htmlFor="email" className="text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <input id="email" name="email" type="email" required placeholder="tu@email.com" className="w-full rounded-lg border border-indigo-200 dark:border-indigo-800 px-4 py-2 pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  <FiMail className="absolute left-3 top-3 text-indigo-400" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="asunto" className="text-sm font-medium mb-1">Asunto</label>
              <div className="relative">
                <input id="asunto" name="asunto" type="text" required placeholder="¿Sobre qué quieres hablar?" className="w-full rounded-lg border border-indigo-200 dark:border-indigo-800 px-4 py-2 pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <FiMessageCircle className="absolute left-3 top-3 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="mensaje" className="text-sm font-medium mb-1">Mensaje</label>
              <textarea id="mensaje" name="mensaje" required rows={5} placeholder="Cuéntanos tu idea, reto o consulta..." className="w-full rounded-lg border border-indigo-200 dark:border-indigo-800 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold text-lg shadow-lg transition-all duration-300">
            <FiSend className="h-5 w-5" /> Enviar mensaje
          </button>
        </form>
        {/* Datos de contacto */}
        <div className="flex flex-col gap-8 justify-center bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-lg p-8 border border-indigo-100 dark:border-indigo-900">
          <h2 className="text-2xl font-bold mb-2 text-indigo-700 dark:text-indigo-300 flex items-center gap-2"><FiMail className="h-6 w-6" /> Contacto directo</h2>
          <div className="flex flex-col gap-4 text-base">
            <div className="flex items-center gap-3"><FiMail className="h-5 w-5 text-indigo-500" /> contacto@tunixlabs.com</div>
            <div className="flex items-center gap-3"><FiPhone className="h-5 w-5 text-indigo-500" /> +34 600 123 456</div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Redes sociales</h3>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-indigo-500 hover:text-indigo-700 text-2xl"><FiInstagram /></a>
              <a href="#" aria-label="LinkedIn" className="text-indigo-500 hover:text-indigo-700 text-2xl"><FiLinkedin /></a>
              <a href="#" aria-label="Twitter" className="text-indigo-500 hover:text-indigo-700 text-2xl"><FiTwitter /></a>
            </div>
          </div>
          <div className="mt-8 bg-gradient-to-r from-indigo-100 via-blue-50 to-white dark:from-indigo-900 dark:via-gray-900 dark:to-gray-950 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">¿Prefieres una reunión?</p>
            <a href="mailto:contacto@tunixlabs.com" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold shadow-lg transition-all duration-300">Agenda una videollamada</a>
          </div>
        </div>
      </section>
    </div>
  );
} 