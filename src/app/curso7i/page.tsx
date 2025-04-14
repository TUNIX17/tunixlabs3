import Link from 'next/link';

export default function Curso7iPage() {
  return (
    <div className="min-h-screen flex flex-col">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Transporte para visita educativa</td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Refrigerios para sesión semanal</td>
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
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Link href="/curso7i/admin" className="text-primary hover:text-blue-700 font-medium">
                  Ir al Panel de Administración →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 