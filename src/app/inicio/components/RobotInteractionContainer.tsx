import React, { useRef } from 'react';
import { RobotMethods } from '../../../types/robot';
import dynamic from 'next/dynamic';
import VoiceController from '../../../components/VoiceInterface/VoiceController';
import { RobotInteractionState } from '../../../hooks/useRobotInteraction';

// Importar dinámicamente el modelo de robot para evitar errores de SSR
const RobotModel = dynamic(() => import('./RobotModel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando modelo 3D...</p>
      </div>
    </div>
  ),
});

interface RobotInteractionContainerProps {
  initialLanguage?: string;
}

const RobotInteractionContainer: React.FC<RobotInteractionContainerProps> = ({
  initialLanguage = 'es'
}) => {
  // Referencia al modelo del robot
  const robotRef = useRef<RobotMethods>(null);
  
  // Manejar cambios de idioma
  const handleLanguageChange = (language: string) => {
    console.log('Idioma cambiado a:', language);
    // Implementar lógica adicional para cambio de idioma si es necesario
  };
  
  // Manejar cambios de estado del robot
  const handleStateChange = (state: RobotInteractionState) => {
    console.log('Estado del robot cambiado a:', state);
    // Implementar lógica adicional para cambio de estado si es necesario
  };
  
  return (
    <div className="robot-interaction-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Modelo 3D del robot */}
        <div className="robot-model-container relative h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
          <RobotModel forwardRef={robotRef} />
        </div>
        
        {/* Controlador de voz */}
        <div className="voice-controller-container">
          <VoiceController 
            robotRef={robotRef}
            initialLanguage={initialLanguage}
            onLanguageChange={handleLanguageChange}
            onStateChange={handleStateChange}
          />
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Interacción por voz con IA
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Haz clic en el botón de micrófono para comenzar a hablar con Tunix.
          El sistema detectará automáticamente el idioma en que hablas y responderá en el mismo idioma.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">
            Funciones disponibles:
          </h3>
          <ul className="list-disc pl-5 text-blue-700 dark:text-blue-400 space-y-1">
            <li>Detección automática de idioma</li>
            <li>Reconocimiento de voz</li>
            <li>Respuestas por voz</li>
            <li>Entrada de texto alternativa</li>
            <li>Animaciones del robot</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RobotInteractionContainer; 