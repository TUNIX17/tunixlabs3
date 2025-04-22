import '../styles/globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'TunixLabs - Soluciones Avanzadas de IA',
  description: 'TunixLabs es una empresa especializada en consultoría y desarrollo de soluciones de Inteligencia Artificial de vanguardia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="bg-white backdrop-filter backdrop-blur-md bg-opacity-80 sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/inicio" className="group flex items-center">
                  <div className="relative mr-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300">
                    TunixLabs
                  </h1>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-1">
                <Link href="/inicio" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300">
                  Inicio
                </Link>
                <Link href="/curso7i" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300">
                  Curso 7i
                </Link>
                <Link href="/curso7i/admin" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300">
                  Admin
                </Link>
              </nav>
              
              {/* Botón de menú móvil */}
              <div className="md:hidden flex items-center">
                <button className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>© {new Date().getFullYear()} TunixLabs</p>
              <p className="mt-2 text-sm text-gray-400">
                Consultoría especializada en soluciones avanzadas de Inteligencia Artificial
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 