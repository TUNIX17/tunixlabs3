import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'TunixLabs - Consultoría en IA',
  description: 'TunixLabs es una empresa especializada en consultoría de Inteligencia Artificial.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 