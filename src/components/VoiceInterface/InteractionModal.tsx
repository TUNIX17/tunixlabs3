import React from 'react';
import VoiceController from './VoiceController'; // Asumiendo que VoiceController está en la misma carpeta
import { RobotMethods } from '../../types/robot'; // Ajusta la ruta si es necesario
import { RobotInteractionState } from '../../hooks/useRobotInteraction'; // Ajusta la ruta

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  robotRef: React.RefObject<RobotMethods>; // VoiceController necesita esto
  initialLanguage?: string; // Para VoiceController
  // Se podrían pasar más props de VoiceController si es necesario
  // o incluso pasar directamente las props del hook useRobotInteraction
}

const InteractionModal: React.FC<InteractionModalProps> = ({
  isOpen,
  onClose,
  robotRef,
  initialLanguage = 'es',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Cerrar al hacer clic fuera del contenido del modal
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col relative" 
        onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del modal lo cierre
      >
        {/* Botón de cerrar modal */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 z-10"
          aria-label="Cerrar interacción"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        {/* Contenido del VoiceController */}
        <div className="p-1 sm:p-2 md:p-0">
          <VoiceController 
            robotRef={robotRef} 
            initialLanguage={initialLanguage}
            // Aquí podrías necesitar pasar onLanguageChange y onStateChange si el componente padre los usa
          />
        </div>
      </div>
    </div>
  );
};

export default InteractionModal; 