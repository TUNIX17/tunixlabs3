import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'ingreso' | 'gasto';
  status: 'completado' | 'pendiente' | 'cancelado';
}

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function TransactionTable({ transactions, onDelete, onEdit }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'ingreso' | 'gasto'>('todos');
  const itemsPerPage = 10;

  // Filtrar transacciones
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(filter.toLowerCase()) || 
                          transaction.category.toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter === 'todos' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Formatear monto
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Filtros */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Buscar por descripción o categoría..."
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-primary focus:border-primary"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Resetear página al filtrar
            }}
          />
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-2 rounded-md text-sm font-medium ${typeFilter === 'todos' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => {
              setTypeFilter('todos');
              setCurrentPage(1);
            }}
          >
            Todos
          </button>
          <button 
            className={`px-3 py-2 rounded-md text-sm font-medium ${typeFilter === 'ingreso' ? 'bg-green-200 text-green-800' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => {
              setTypeFilter('ingreso');
              setCurrentPage(1);
            }}
          >
            Ingresos
          </button>
          <button 
            className={`px-3 py-2 rounded-md text-sm font-medium ${typeFilter === 'gasto' ? 'bg-red-200 text-red-800' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => {
              setTypeFilter('gasto');
              setCurrentPage(1);
            }}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Tabla */}
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
              {(onDelete || onEdit) && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedTransactions.length > 0 ? (
              displayedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'ingreso' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${transaction.status === 'completado' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  {(onDelete || onEdit) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(transaction.id)}
                          className="text-primary hover:text-blue-700 mr-3"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
                              onDelete(transaction.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={(onDelete || onEdit) ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron transacciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md 
                ${currentPage === 1 ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md 
                ${currentPage === totalPages ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}
                </span>{" "}
                de <span className="font-medium">{filteredTransactions.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium 
                    ${currentPage === 1 ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Primera</span>
                  <span>««</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium 
                    ${currentPage === 1 ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Anterior</span>
                  <span>«</span>
                </button>
                
                {/* Números de página */}
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  // Lógica para mostrar páginas cercanas a la actual
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium 
                        ${currentPage === pageNum ? 'z-10 bg-primary text-white border-primary' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium 
                    ${currentPage === totalPages ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Siguiente</span>
                  <span>»</span>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium 
                    ${currentPage === totalPages ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Última</span>
                  <span>»»</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 