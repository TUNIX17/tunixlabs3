import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">
            <Link href="/inicio">TunixLabs</Link>
          </h1>
        </div>
        <nav className="flex space-x-8">
          <Link href="/inicio" className="text-gray-900 hover:text-primary font-medium">
            Inicio
          </Link>
          <Link href="/curso7i" className="text-gray-900 hover:text-primary font-medium">
            Curso 7i
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 