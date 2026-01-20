import React from 'react';

interface ControlButtonsProps {
  isRecording: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isListening?: boolean;
  onRecordClick: () => void;
  onStopSpeakingClick: () => void;
  disabled?: boolean;
  currentVolume?: number;
  isSessionActive?: boolean;
}

/**
 * ControlButtons - Estilo Orbe Respirante
 * Diseño consistente con FloatingMicButton
 */
const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRecording,
  isSpeaking,
  isProcessing,
  isListening = false,
  onRecordClick,
  onStopSpeakingClick,
  disabled = false,
  currentVolume = 0,
  isSessionActive = false
}) => {
  const isActive = isListening || isRecording || isSpeaking;
  const isIdle = !isActive && !isProcessing;

  // Icono según estado
  const getIcon = () => {
    if (isProcessing) {
      return (
        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }

    if (isSpeaking) {
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }

    // Micrófono para todos los demás estados
    return (
      <svg className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  };

  // Aria label según estado
  const getAriaLabel = () => {
    if (isProcessing) return 'Pensando...';
    if (isRecording) return 'Escuchando... toca para detener';
    if (isListening) return 'Listo para escuchar';
    if (isSpeaking) return 'Respondiendo... habla para interrumpir';
    return 'Hablar con Tunix';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Contenedor del orbe con ondas */}
      <div className="relative flex items-center justify-center">
        {/* Ondas concéntricas */}
        {isActive && !isProcessing && (
          <>
            <span
              className={`absolute w-16 h-16 rounded-full border-2 border-violet-400/40 ${
                isRecording ? 'animate-orbe-wave-fast' : 'animate-orbe-wave'
              }`}
              style={{ animationDelay: '0ms' }}
            />
            <span
              className={`absolute w-20 h-20 rounded-full border-2 border-violet-400/30 ${
                isRecording ? 'animate-orbe-wave-fast' : 'animate-orbe-wave'
              }`}
              style={{ animationDelay: '200ms' }}
            />
            {(currentVolume > 0.3 || isSpeaking) && (
              <span
                className={`absolute w-24 h-24 rounded-full border-2 border-violet-400/20 ${
                  isRecording ? 'animate-orbe-wave-fast' : 'animate-orbe-wave'
                }`}
                style={{ animationDelay: '400ms' }}
              />
            )}
          </>
        )}

        {/* Glow de fondo */}
        {isActive && !isProcessing && (
          <span
            className="absolute w-14 h-14 rounded-full blur-xl animate-orbe-glow"
            style={{
              background: `radial-gradient(circle, rgba(139, 92, 246, ${
                isRecording ? 0.8 : isSpeaking ? 0.6 : 0.4
              }) 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Botón principal - Orbe */}
        <button
          type="button"
          onClick={onRecordClick}
          disabled={disabled}
          aria-label={getAriaLabel()}
          className={`
            relative z-10
            w-14 h-14
            rounded-full
            flex items-center justify-center
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-100
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isActive && !isProcessing ? 'animate-orbe-breathe' : ''}
            ${isIdle ? 'hover:scale-105 active:scale-95' : ''}
          `}
          style={{
            background: isProcessing
              ? 'linear-gradient(145deg, #6b7280, #4b5563)'
              : isActive
                ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)'
                : 'linear-gradient(145deg, #7c3aed, #5b21b6)',
            boxShadow: isProcessing
              ? '0 4px 15px rgba(0, 0, 0, 0.2)'
              : isActive
                ? '0 0 25px rgba(139, 92, 246, 0.5), 0 4px 15px rgba(0, 0, 0, 0.2)'
                : '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
        >
          {/* Indicador de sesión activa */}
          {isSessionActive && !isProcessing && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-gray-100 z-20" />
          )}

          {/* Icono */}
          {getIcon()}
        </button>

        {/* Botón de detener habla */}
        {isSpeaking && (
          <button
            type="button"
            onClick={onStopSpeakingClick}
            className="absolute -right-12 w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300
                       dark:bg-gray-700 dark:hover:bg-gray-600
                       flex items-center justify-center
                       transition-all duration-200 ease-out
                       focus:outline-none focus:ring-2 focus:ring-gray-400
                       hover:scale-105 active:scale-95"
            aria-label="Detener voz"
          >
            <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          </button>
        )}
      </div>

      {/* Barras de volumen */}
      {(isListening || isRecording) && (
        <div className="flex items-center justify-center gap-1 h-5">
          {[0.15, 0.3, 0.5, 0.3, 0.15].map((baseHeight, i) => {
            const isCenter = i === 2;
            const volumeBoost = isRecording ? currentVolume * 0.8 : 0.2;
            const height = Math.max(baseHeight, volumeBoost) * (isCenter ? 1.5 : 1);

            return (
              <div
                key={i}
                className={`w-1 rounded-full bg-violet-400 transition-all ${
                  isRecording ? 'duration-75' : 'duration-300'
                }`}
                style={{
                  height: `${Math.max(4, height * 20)}px`,
                  opacity: isRecording ? 0.9 : 0.5,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ControlButtons;
