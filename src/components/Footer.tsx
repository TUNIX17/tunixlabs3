import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TunixLabs</h3>
            <p className="text-gray-300">
              Consultoría especializada en soluciones de Inteligencia Artificial para empresas.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-gray-300">Email: contacto@tunixlabs.com</p>
            <p className="text-gray-300">Teléfono: +123 456 7890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/inicio" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/inicio#servicios" className="text-gray-300 hover:text-white">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/inicio#contacto" className="text-gray-300 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TunixLabs. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 