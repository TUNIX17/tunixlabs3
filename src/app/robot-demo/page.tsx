'use client';

import React, { useState } from 'react';
import RobotModel from '../inicio/components/RobotModel';
import RobotInspector from '../inicio/components/RobotInspector';
import { extractRobot2Data } from '@/utils/glbExtractor';

export default function RobotDemoPage() {
  const [showInspector, setShowInspector] = useState(false);
  const [extractingData, setExtractingData] = useState(false);
  
  const handleExtractData = async () => {
    setExtractingData(true);
    try {
      await extractRobot2Data();
      alert('Datos del modelo ROBOT2 extraídos y guardados correctamente. Revisa la consola para más detalles.');
    } catch (error) {
      console.error('Error al extraer datos:', error);
      alert('Ocurrió un error al extraer los datos. Revisa la consola para más detalles.');
    } finally {
      setExtractingData(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demostración del Robot Interactivo</h1>
      
      <div className="mb-6">
        <p className="mb-2">
          Este robot puede seguir el cursor con la cabeza. Estamos extrayendo información
          del modelo 3D para implementar animaciones avanzadas más adelante.
        </p>
        <p className="mb-4">
          Usa las herramientas a continuación para inspeccionar el modelo y extraer datos.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => setShowInspector(!showInspector)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showInspector ? 'Ocultar Inspector' : 'Mostrar Inspector'}
          </button>
          
          <button 
            onClick={handleExtractData}
            disabled={extractingData}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${extractingData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {extractingData ? 'Extrayendo...' : 'Extraer Datos Completos'}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <RobotModel />
      </div>
      
      {showInspector && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Inspector del Modelo</h2>
          <p className="mb-4">
            Esta herramienta te permite explorar la estructura del modelo 3D y exportar 
            información detallada del esqueleto para crear animaciones más avanzadas.
          </p>
          <RobotInspector />
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Instrucciones</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mueve el cursor por la pantalla para que el robot te siga con la mirada</li>
          <li>Usa el botón "Mostrar Inspector" para ver la estructura del esqueleto</li>
          <li>Usa el botón "Extraer Datos Completos" para forzar la extracción de toda la información</li>
          <li>Activa el modo debug para tener más control sobre la cámara y la visualización</li>
        </ul>
      </div>
    </div>
  );
} 