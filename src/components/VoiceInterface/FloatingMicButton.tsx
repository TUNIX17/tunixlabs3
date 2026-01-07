import React from 'react';
import { RobotInteractionState } from '../../hooks/useRobotInteraction';

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
  const isProcessing = interactionState === RobotInteractionState.PROCESSING;
  const isDisabled = disabled || isProcessing;

  // Determinar el icono según el estado
  let icon;
  let title = 'Hablar con Tunix';

  if (isProcessing) {
    icon = (
      <svg className="animate-spin h-6 w-6 sm:h-7 sm:w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
    title = 'Procesando...';
  } else if (isRecording) {
    icon = (
      <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 5h10v10H5V5z" clipRule="evenodd" />
      </svg>
    );
    title = 'Detener grabación';
  } else {
    icon = (
      <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
    title = 'Hablar con Tunix';
  }

  // Estilos base neumórficos
  const baseStyles: React.CSSProperties = {
    background: isRecording
      ? 'linear-gradient(145deg, #ef4444, #dc2626)' // Rojo para grabando
      : isProcessing
        ? 'var(--neu-bg)' // Gris neumórfico para procesando
        : 'linear-gradient(145deg, var(--neu-accent), var(--neu-primary-dark))', // Teal principal
    color: isProcessing ? 'var(--neu-primary)' : 'white',
    boxShadow: isDisabled
      ? 'inset 4px 4px 8px var(--neu-shadow-dark), inset -4px -4px 8px var(--neu-shadow-light)'
      : '6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light)',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      aria-label={title}
      className={`
        relative
        p-4 sm:p-5
        rounded-2xl
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 active:translate-y-0'}
        ${isRecording ? 'animate-pulse' : ''}
      `}
      style={baseStyles}
    >
      {/* Efecto de glow cuando está activo (grabando) */}
      {isRecording && (
        <span
          className="absolute inset-0 rounded-2xl animate-ping opacity-30"
          style={{ background: 'rgba(239, 68, 68, 0.5)' }}
        />
      )}

      {/* Icono */}
      <span className="relative z-10 flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
};

export default FloatingMicButton;
