import React from 'react';
import { RobotInteractionState } from '../../hooks/useRobotInteraction';

interface FloatingMicButtonTranslations {
  talkToTunix: string;
  processing: string;
  stopRecording: string;
  listening: string;
  talkToMe: string;
  interrupt: string;
  responding: string;
}

interface FloatingMicButtonProps {
  onClick: () => void;
  interactionState: RobotInteractionState;
  isRecording: boolean;
  disabled?: boolean;
  currentVolume?: number; // Nivel de volumen actual (0-1) para feedback visual
  isSessionActive?: boolean; // Si hay una sesion continua activa
  translations?: FloatingMicButtonTranslations; // Traducciones opcionales
}

const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({
  onClick,
  interactionState,
  isRecording,
  disabled = false,
  currentVolume = 0,
  isSessionActive = false,
  translations,
}) => {
  const isProcessing = interactionState === RobotInteractionState.PROCESSING;
  const isListening = interactionState === RobotInteractionState.LISTENING;
  const isListeningActive = interactionState === RobotInteractionState.LISTENING_ACTIVE;
  const isSpeaking = interactionState === RobotInteractionState.SPEAKING;
  const isDisabled = disabled || isProcessing;

  // Default translations (Spanish fallback)
  const t = translations || {
    talkToTunix: 'Hablar con Tunix',
    processing: 'Procesando...',
    stopRecording: 'Detener grabación',
    listening: 'Te escucho...',
    talkToMe: 'Habla conmigo',
    interrupt: 'Interrumpir (habla para detener)',
    responding: 'Respondiendo...',
  };

  // Determinar el icono y estado visual
  let icon;
  let title = t.talkToTunix;
  let statusText = '';

  if (isProcessing) {
    icon = (
      <svg className="animate-spin h-6 w-6 sm:h-7 sm:w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
    title = t.processing;
    statusText = t.processing;
  } else if (isListeningActive || isRecording) {
    // Usuario hablando activamente
    icon = (
      <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 5h10v10H5V5z" clipRule="evenodd" />
      </svg>
    );
    title = t.stopRecording;
    statusText = t.listening;
  } else if (isListening) {
    // VAD activo, esperando voz
    icon = (
      <svg className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
    title = t.listening;
    statusText = t.talkToMe;
  } else if (isSpeaking) {
    // Robot hablando
    icon = (
      <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0" />
      </svg>
    );
    title = t.interrupt;
    statusText = t.responding;
  } else {
    // Idle
    icon = (
      <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
    title = t.talkToTunix;
    statusText = '';
  }

  // Calcular escala basada en volumen (para feedback visual)
  const volumeScale = isListeningActive ? 1 + (currentVolume * 0.3) : 1;

  // Estilos base neumorfico
  const getBackgroundStyle = () => {
    if (isListeningActive || isRecording) {
      return 'linear-gradient(145deg, #ef4444, #dc2626)'; // Rojo
    }
    if (isListening) {
      return 'linear-gradient(145deg, #22c55e, #16a34a)'; // Verde - esperando voz
    }
    if (isSpeaking) {
      return 'linear-gradient(145deg, #8b5cf6, #7c3aed)'; // Violeta - hablando
    }
    if (isProcessing) {
      return 'var(--neu-bg)'; // Gris
    }
    return 'linear-gradient(145deg, var(--neu-accent), var(--neu-primary-dark))'; // Teal default
  };

  const baseStyles: React.CSSProperties = {
    background: getBackgroundStyle(),
    color: isProcessing ? 'var(--neu-primary)' : 'white',
    boxShadow: isDisabled
      ? 'inset 4px 4px 8px var(--neu-shadow-dark), inset -4px -4px 8px var(--neu-shadow-light)'
      : '6px 6px 12px var(--neu-shadow-dark), -6px -6px 12px var(--neu-shadow-light)',
    transform: `scale(${volumeScale})`,
    transition: 'transform 0.1s ease-out, background 0.3s ease',
  };

  return (
    <div className="flex flex-col items-center gap-2">
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
          ${(isListeningActive || isRecording) ? 'animate-pulse' : ''}
        `}
        style={baseStyles}
      >
        {/* Efecto de glow cuando esta activo */}
        {(isListeningActive || isRecording) && (
          <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-30"
            style={{ background: 'rgba(239, 68, 68, 0.5)' }}
          />
        )}

        {/* Efecto de glow para listening (esperando voz) */}
        {isListening && !isListeningActive && (
          <span
            className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
            style={{ background: 'rgba(34, 197, 94, 0.5)' }}
          />
        )}

        {/* Indicador de sesion activa */}
        {isSessionActive && !isProcessing && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            title="Conversacion activa"
          />
        )}

        {/* Icono */}
        <span className="relative z-10 flex items-center justify-center">
          {icon}
        </span>
      </button>

      {/* Texto de estado */}
      {statusText && (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 animate-fade-in">
          {statusText}
        </span>
      )}

      {/* Indicador de volumen durante listening_active */}
      {isListeningActive && (
        <div className="flex gap-1 items-end h-4">
          {[0.2, 0.4, 0.6, 0.8, 1].map((threshold, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                currentVolume >= threshold ? 'bg-red-500' : 'bg-gray-300'
              }`}
              style={{ height: `${(i + 1) * 4}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingMicButton;
