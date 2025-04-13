import Link from 'next/link';

export default function Curso7iPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Curso 7i</span>
                <span className="block text-blue-200">Panel de Tesorería</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl">
                Gestión transparente de finanzas para el curso.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Balance Card */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Balance General</h2>
                <div className="text-3xl font-bold text-primary">$1,250,000</div>
                <p className="text-sm text-gray-500 mt-2">Actualizado: 13/04/2023</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Ingresos</span>
                    <span className="text-green-600 font-medium">$1,500,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gastos</span>
                    <span className="text-red-600 font-medium">$250,000</span>
                  </div>
                </div>
              </div>

              {/* Recent Deposits Card */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Depósitos Recientes</h2>
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
                        <p className="text-xs text-gray-500">10/04/2023</p>
                      </div>
                      <span className="text-green-600 font-medium">$50,000</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">María González</p>
                        <p className="text-xs text-gray-500">09/04/2023</p>
                      </div>
                      <span className="text-green-600 font-medium">$50,000</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Carlos Rodríguez</p>
                        <p className="text-xs text-gray-500">08/04/2023</p>
                      </div>
                      <span className="text-green-600 font-medium">$50,000</span>
                    </div>
                  </li>
                </ul>
                <a href="#" className="mt-4 inline-block text-sm font-medium text-primary hover:text-blue-700">
                  Ver todos los depósitos →
                </a>
              </div>

              {/* Recent Expenses Card */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Gastos Recientes</h2>
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Material Didáctico</p>
                        <p className="text-xs text-gray-500">12/04/2023</p>
                      </div>
                      <span className="text-red-600 font-medium">$75,000</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Transporte</p>
                        <p className="text-xs text-gray-500">05/04/2023</p>
                      </div>
                      <span className="text-red-600 font-medium">$45,000</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Refrigerio</p>
                        <p className="text-xs text-gray-500">01/04/2023</p>
                      </div>
                      <span className="text-red-600 font-medium">$130,000</span>
                    </div>
                  </li>
                </ul>
                <a href="#" className="mt-4 inline-block text-sm font-medium text-primary hover:text-blue-700">
                  Ver todos los gastos →
                </a>
              </div>
            </div>

            {/* Detailed Transactions */}
            <div className="mt-8">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Transacciones Detalladas</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12/04/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Compra de libros de texto</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Material Didáctico</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-$75,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/04/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pago de mensualidad - Juan Pérez</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mensualidad</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+$50,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">09/04/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pago de mensualidad - María González</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mensualidad</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+$50,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08/04/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pago de mensualidad - Carlos Rodríguez</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mensualidad</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+$50,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">05/04/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Transporte para salida pedagógica</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transporte</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-$45,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Refrigerio para alumnos</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Refrigerio</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-$130,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button className="btn btn-secondary">Exportar a Excel</button>
                    <div className="flex">
                      <button className="px-3 py-1 border border-gray-300 bg-white rounded-l-md text-sm text-gray-700">Anterior</button>
                      <button className="px-3 py-1 border-t border-b border-r border-gray-300 bg-white text-sm text-gray-700">1</button>
                      <button className="px-3 py-1 border-t border-b border-r border-gray-300 bg-white rounded-r-md text-sm text-gray-700">Siguiente</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="mt-8 card p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subir Comprobante de Gasto</h2>
              <p className="text-sm text-gray-500 mb-4">
                Suba una foto del comprobante de gasto para registrarlo automáticamente en el sistema.
              </p>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none">
                      <span>Subir un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <div className="mt-1">
                  <input type="text" name="description" id="description" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Ej. Compra de materiales" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select id="category" name="category" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                  <option>Material Didáctico</option>
                  <option>Transporte</option>
                  <option>Refrigerio</option>
                  <option>Actividades</option>
                  <option>Otros</option>
                </select>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-primary">
                  Registrar Gasto
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold">TunixLabs - Curso 7i</h3>
              <p className="text-gray-300 text-sm mt-2">
                Sistema de gestión de tesorería transparente para el curso.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} TunixLabs. Todos los derechos reservados.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 