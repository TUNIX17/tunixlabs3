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
        <header className="bg-white backdrop-filter backdrop-blur-md bg-opacity-80 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary neon-text">
                <Link href="/inicio">TunixLabs</Link>
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/inicio" className="text-gray-900 hover:text-primary font-medium transition-colors duration-300">
                Inicio
              </Link>
              <Link href="/curso7i" className="text-gray-900 hover:text-primary font-medium transition-colors duration-300">
                Curso 7i
              </Link>
              <Link href="/curso7i/admin" className="text-gray-900 hover:text-primary font-medium transition-colors duration-300">
                Admin
              </Link>
            </nav>
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