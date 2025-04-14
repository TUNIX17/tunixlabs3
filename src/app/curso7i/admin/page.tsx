'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/curso7i/LoginForm';
import TransactionForm from '@/components/curso7i/TransactionForm';
import TransactionTable from '@/components/curso7i/TransactionTable';
import { v4 as uuidv4 } from 'uuid';

// Datos de ejemplo
const sampleTransactions = [
  {
    id: '1',
    date: '2023-04-12',
    description: 'Compra de libros de texto',
    category: 'Material Didáctico',
    amount: 75000,
    type: 'gasto' as const,
    status: 'completado' as const
  },
  {
    id: '2',
    date: '2023-04-10',
    description: 'Pago de mensualidad - Juan Pérez',
    category: 'Mensualidad',
    amount: 50000,
    type: 'ingreso' as const,
    status: 'completado' as const
  },
  {
    id: '3',
    date: '2023-04-09',
    description: 'Pago de mensualidad - María González',
    category: 'Mensualidad',
    amount: 50000,
    type: 'ingreso' as const,
    status: 'completado' as const
  },
  {
    id: '4',
    date: '2023-04-08',
    description: 'Pago de mensualidad - Carlos Rodríguez',
    category: 'Mensualidad',
    amount: 50000,
    type: 'ingreso' as const,
    status: 'completado' as const
  },
  {
    id: '5',
    date: '2023-04-05',
    description: 'Transporte para visita educativa',
    category: 'Transporte',
    amount: 45000,
    type: 'gasto' as const,
    status: 'completado' as const
  },
  {
    id: '6',
    date: '2023-04-01',
    description: 'Refrigerios para sesión semanal',
    category: 'Refrigerio',
    amount: 130000,
    type: 'gasto' as const,
    status: 'completado' as const
  }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<Array<typeof sampleTransactions[0]>>(sampleTransactions);
  const [activeTab, setActiveTab] = useState<'form' | 'transactions'>('form');

  // Función para autenticación
  const handleLogin = async (credentials: { email: string; password: string }) => {
    // Simulando una demora de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Credenciales de ejemplo para desarrollo
    if (credentials.email === 'admin@tunixlabs.com' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  // Función para manejar nuevas transacciones
  const handleTransaction = (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      status: 'completado' as const
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    alert(`Transacción registrada exitosamente: ${transaction.description} - $${transaction.amount}`);
  };

  // Funciones para editar y eliminar transacciones
  const handleEditTransaction = (id: string) => {
    alert(`Editar transacción con ID: ${id}`);
    // Aquí iría la lógica para editar una transacción
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración - Curso 7i</h1>
            <p className="mt-2 text-gray-600">
              Administra las finanzas y transacciones del curso.
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="mt-8">
              <LoginForm onLogin={handleLogin} />
            </div>
          ) : (
            <>
              {/* Pestañas */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'form'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('form')}
                  >
                    Registrar Transacción
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'transactions'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    Ver Transacciones
                  </button>
                </nav>
              </div>

              {activeTab === 'form' ? (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="col-span-1 lg:col-span-2">
                    <TransactionForm onSubmit={handleTransaction} />
                  </div>
                  
                  <div className="col-span-1">
                    <div className="bg-white shadow-md rounded-lg p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
                      
                      <ul className="space-y-2">
                        <li>
                          <button 
                            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                            onClick={() => setActiveTab('transactions')}
                          >
                            Ver Todas las Transacciones
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                            Exportar Reporte Mensual
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                            Configuración de Usuarios
                          </button>
                        </li>
                        <li>
                          <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                            Escanear Comprobante
                          </button>
                        </li>
                        <li>
                          <button 
                            className="w-full text-left px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                            onClick={() => setIsAuthenticated(false)}
                          >
                            Cerrar Sesión
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transacciones</h2>
                  <TransactionTable 
                    transactions={transactions} 
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
} 