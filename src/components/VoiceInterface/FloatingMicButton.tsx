import React from 'react';
import { RobotInteractionState } from '../../hooks/useRobotInteraction'; // Ajusta la ruta si es necesario

interface FloatingMicButtonProps {
  onClick: () => void;
  interactionState: RobotInteractionState;
  isRecording: boolean;
  disabled?: boolean;
}

const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({
  onClick,
  interactionState,
  isRecording,
  disabled = false,
}) => {
  let icon;
  let bgColor = 'bg-blue-600 hover:bg-blue-700';
  let title = 'Iniciar interacción por voz';

  if (interactionState === RobotInteractionState.PROCESSING) {
    // Icono de Spinner (SVG simple)
    icon = (
      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
    bgColor = 'bg-gray-500';
    title = 'Procesando...';
  } else if (isRecording) {
    // Icono de Stop (SVG simple)
    icon = (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 5h10v10H5V5z" clipRule="evenodd" />
      </svg>
    );
    bgColor = 'bg-red-600 hover:bg-red-700';
    title = 'Detener grabación';
  } else {
    // Icono de Micrófono (SVG simple)
    icon = (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
    title = 'Hablar con Tunix';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || interactionState === RobotInteractionState.PROCESSING}
      title={title}
      className={`fixed bottom-8 right-8 p-4 rounded-full text-white shadow-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${bgColor} ${disabled || interactionState === RobotInteractionState.PROCESSING ? 'opacity-70 cursor-not-allowed' : ''}`}
      aria-label={title}
    >
      {icon}
    </button>
  );
};

export default FloatingMicButton; 