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
        <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 pt-4 z-30 bg-transparent">
          <Link href="/inicio" className="flex items-center">
            <img src="/logo_tunixlabs_negro.png" alt="Logo TunixLabs" className="h-24 w-auto" />
          </Link>
          <nav>
            <Link href="/inicio" className="text-lg font-semibold text-white hover:text-blue-300 transition-all duration-300">Inicio</Link>
          </nav>
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