import React, { useState } from 'react';

type TransactionType = 'ingreso' | 'gasto';

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: TransactionType;
    description: string;
    amount: number;
    category: string;
    date: string;
    receipt?: File;
  }) => void;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('ingreso');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;

    setIsSubmitting(true);
    
    onSubmit({
      type,
      description,
      amount: parseFloat(amount),
      category,
      date,
      receipt: receipt || undefined,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setReceipt(null);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registrar Nueva Transacción</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary"
                name="type"
                value="ingreso"
                checked={type === 'ingreso'}
                onChange={() => setType('ingreso')}
              />
              <span className="ml-2 text-gray-700">Ingreso</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-red-500"
                name="type"
                value="gasto"
                checked={type === 'gasto'}
                onChange={() => setType('gasto')}
              />
              <span className="ml-2 text-gray-700">Gasto</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto (COP)
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="1000"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            {type === 'ingreso' ? (
              <>
                <option value="Mensualidad">Mensualidad</option>
                <option value="Donación">Donación</option>
                <option value="Evento">Evento</option>
                <option value="Otro">Otro</option>
              </>
            ) : (
              <>
                <option value="Material Didáctico">Material Didáctico</option>
                <option value="Refrigerio">Refrigerio</option>
                <option value="Transporte">Transporte</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Equipos">Equipos</option>
                <option value="Otro">Otro</option>
              </>
            )}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-1">
            Comprobante (opcional)
          </label>
          <input
            type="file"
            id="receipt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files && setReceipt(e.target.files[0])}
          />
          <p className="text-xs text-gray-500 mt-1">
            Sube una imagen o PDF del comprobante de pago o factura.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn ${type === 'ingreso' ? 'btn-primary' : 'bg-red-500 hover:bg-red-600 text-white'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Transacción'}
          </button>
        </div>
      </form>
    </div>
  );
} 