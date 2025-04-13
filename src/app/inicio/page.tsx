import Link from 'next/link';

export default function InicioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">TunixLabs</h1>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Consultoría en</span>
              <span className="block text-blue-200">Inteligencia Artificial</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Soluciones innovadoras basadas en IA para transformar y optimizar su negocio.
            </p>
            <div className="mt-10">
              <a
                href="#contacto"
                className="btn btn-secondary"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Nuestros Servicios
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Utilizamos la inteligencia artificial para crear soluciones a medida.
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="card p-6">
              <div className="h-12 w-12 bg-primary rounded-md flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L9.5 14.5M15 3.104c.251.023.501.05.75.082M15 3.104c-.252-.027-.506-.056-.75-.082m0 0c-1.456-.198-2.94-.198-4.5 0M9.5 14.5v-2.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v2.25M9.5 14.5h5.5" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Análisis de Datos</h3>
              <p className="mt-2 text-base text-gray-500">
                Transformamos sus datos en información valiosa para la toma de decisiones.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6">
              <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Machine Learning</h3>
              <p className="mt-2 text-base text-gray-500">
                Desarrollamos modelos predictivos para anticipar tendencias y comportamientos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6">
              <div className="h-12 w-12 bg-indigo-600 rounded-md flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Asistentes IA</h3>
              <p className="mt-2 text-base text-gray-500">
                Creamos chatbots y asistentes virtuales inteligentes que mejoran la experiencia del cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              ¿Listo para transformar su negocio?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Contáctenos hoy para descubrir cómo la IA puede ayudar a su empresa.
            </p>
            <div className="mt-8">
              <a
                href="mailto:contacto@tunixlabs.com"
                className="btn btn-primary"
              >
                Solicitar información
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                  <Link href="/curso7i" className="text-gray-300 hover:text-white">
                    Curso 7i
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
    </div>
  );
} 