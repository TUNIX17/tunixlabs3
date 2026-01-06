import React from 'react';
import dynamic from 'next/dynamic';

// Importar dinámicamente el modelo de robot para evitar errores de SSR
// RobotModel ahora incluye toda la lógica de interacción integrada
const RobotModel = dynamic(() => import('./RobotModel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[450px] bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando modelo 3D...</p>
      </div>
    </div>
  ),
});

const RobotInteractionContainer: React.FC = () => {
  return (
    <div className="robot-interaction-container">
      {/* Modelo 3D del robot con interacción integrada */}
      <div className="robot-model-container relative bg-transparent rounded-lg overflow-visible">
        <RobotModel />
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Interaccion por voz con IA
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Haz clic en el boton de microfono para comenzar a hablar con Tunix.
          El sistema detectara automaticamente el idioma en que hablas y respondera en el mismo idioma.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">
            Funciones disponibles:
          </h3>
          <ul className="list-disc pl-5 text-blue-700 dark:text-blue-400 space-y-1">
            <li>Deteccion automatica de idioma</li>
            <li>Reconocimiento de voz</li>
            <li>Respuestas por voz</li>
            <li>Animaciones del robot</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RobotInteractionContainer; 