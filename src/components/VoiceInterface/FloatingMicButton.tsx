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
  currentVolume?: number;
  isSessionActive?: boolean;
  translations?: FloatingMicButtonTranslations;
}

/**
 * Orbe Respirante - Floating Mic Button
 * Diseño estilo Alexa/Siri con animaciones suaves y ondas
 */
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
  const isIdle = interactionState === RobotInteractionState.IDLE;
  const isDisabled = disabled || isProcessing;
  const isActive = isListening || isListeningActive || isSpeaking;

  // Default translations
  const t = translations || {
    talkToTunix: 'Hablar con Tunix',
    processing: 'Pensando...',
    stopRecording: 'Detener',
    listening: 'Te escucho...',
    talkToMe: 'Escuchando...',
    interrupt: 'Toca para detener',
    responding: 'Respondiendo...',
  };

  // Determinar texto de estado
  const getStatusText = () => {
    if (isProcessing) return t.processing;
    if (isListeningActive || isRecording) return t.listening;
    if (isListening) return t.talkToMe;
    if (isSpeaking) return t.responding;
    return '';
  };

  // Determinar título/aria-label
  const getTitle = () => {
    if (isProcessing) return t.processing;
    if (isListeningActive || isRecording) return t.stopRecording;
    if (isListening) return t.listening;
    if (isSpeaking) return t.interrupt;
    return t.talkToTunix;
  };

  // Icono del micrófono
  const MicIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );

  // Icono de ondas (cuando habla el robot)
  const SpeakingIcon = () => (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );

  // Icono de spinner (procesando)
  const SpinnerIcon = () => (
    <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  // Seleccionar icono según estado
  const renderIcon = () => {
    if (isProcessing) return <SpinnerIcon />;
    if (isSpeaking) return <SpeakingIcon />;
    return <MicIcon />;
  };

  // Número de ondas basado en volumen
  const waveCount = isListeningActive ? Math.ceil(currentVolume * 3) + 1 : (isListening ? 2 : 0);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Contenedor del orbe con ondas */}
      <div className="relative flex items-center justify-center">
        {/* Ondas concéntricas - aparecen cuando está activo */}
        {isActive && !isProcessing && (
          <>
            {/* Onda 1 - más cercana */}
            <span
              className={`
                absolute w-20 h-20 rounded-full border-2 border-violet-400/40
                ${isListeningActive ? 'animate-orbe-wave-fast' : 'animate-orbe-wave'}
              `}
              style={{ animationDelay: '0ms' }}
            />
            {/* Onda 2 */}
            <span
              className={`
                absolute w-24 h-24 rounded-full border-2 border-violet-400/30
                ${isListeningActive ? 'animate-orbe-wave-fast' : 'animate-orbe-wave'}
              `}
              style={{ animationDelay: '200ms' }}
            />
            {/* Onda 3 - más lejana (solo cuando hay volumen alto) */}
            {(waveCount >= 2 || isSpeaking) && (
              <span
                className={`
                  absolute w-28 h-28 rounded-full border-2 border-violet-400/20
                  ${isListeningActive ? 'animate-orbe-wave-fast' : 'animate-orbe-wave'}
                `}
                style={{ animationDelay: '400ms' }}
              />
            )}
          </>
        )}

        {/* Glow de fondo cuando está activo */}
        {isActive && !isProcessing && (
          <span
            className="absolute w-16 h-16 rounded-full blur-xl animate-orbe-glow"
            style={{
              background: isSpeaking
                ? 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)'
                : isListeningActive
                  ? 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Botón principal - Orbe */}
        <button
          type="button"
          onClick={onClick}
          disabled={isDisabled}
          title={getTitle()}
          aria-label={getTitle()}
          className={`
            relative z-10
            w-16 h-16
            rounded-full
            flex items-center justify-center
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${isActive && !isProcessing ? 'animate-orbe-breathe' : ''}
            ${isIdle ? 'hover:scale-105 active:scale-95' : ''}
          `}
          style={{
            background: isProcessing
              ? 'linear-gradient(145deg, #374151, #1f2937)'
              : isActive
                ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)'
                : 'linear-gradient(145deg, #4c1d95, #312e81)',
            boxShadow: isProcessing
              ? '0 4px 15px rgba(0, 0, 0, 0.3)'
              : isActive
                ? '0 0 30px rgba(139, 92, 246, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)'
                : '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
        >
          {/* Indicador de sesión activa */}
          {isSessionActive && !isProcessing && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900 z-20" />
          )}

          {/* Icono */}
          <span className={`relative ${isListeningActive ? 'animate-pulse' : ''}`}>
            {renderIcon()}
          </span>
        </button>
      </div>

      {/* Indicador de volumen visual - barras ondulantes */}
      {(isListeningActive || isListening) && (
        <div className="flex items-center justify-center gap-1 h-6">
          {[0.15, 0.3, 0.5, 0.3, 0.15].map((baseHeight, i) => {
            const isCenter = i === 2;
            const volumeBoost = isListeningActive ? currentVolume * 0.8 : 0.2;
            const height = Math.max(baseHeight, volumeBoost) * (isCenter ? 1.5 : 1);

            return (
              <div
                key={i}
                className={`
                  w-1 rounded-full bg-violet-400 transition-all
                  ${isListeningActive ? 'duration-75' : 'duration-300'}
                `}
                style={{
                  height: `${Math.max(4, height * 24)}px`,
                  opacity: isListeningActive ? 0.9 : 0.5,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Texto de estado */}
      {(() => {
        const statusText = getStatusText();
        return statusText ? (
          <span className="text-sm font-medium text-gray-400 animate-fade-in">
            {statusText}
          </span>
        ) : null;
      })()}
    </div>
  );
};

export default FloatingMicButton;
