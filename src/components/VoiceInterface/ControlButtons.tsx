import React from 'react';

interface ControlButtonsProps {
  isRecording: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isListening?: boolean; // VAD activo, esperando voz
  onRecordClick: () => void;
  onStopSpeakingClick: () => void;
  disabled?: boolean;
  currentVolume?: number; // Nivel de volumen actual
  isSessionActive?: boolean; // Si hay sesion activa
}

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
  // Determinar el estado visual del boton principal
  const getButtonStyle = () => {
    if (isProcessing) {
      return 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500';
    }
    if (isRecording) {
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }
    if (isListening) {
      return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    }
    if (isSpeaking) {
      return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500';
    }
    return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
  };

  // Determinar el icono
  const getIcon = () => {
    if (isProcessing) {
      return (
        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }

    if (isRecording) {
      return (
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      );
    }

    if (isListening) {
      return (
        <svg className="h-6 w-6 text-white animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    }

    if (isSpeaking) {
      return (
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414" />
        </svg>
      );
    }

    return (
      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  };

  // Determinar el aria-label
  const getAriaLabel = () => {
    if (isProcessing) return 'Procesando...';
    if (isRecording) return 'Detener grabacion';
    if (isListening) return 'Escuchando... clic para detener';
    if (isSpeaking) return 'Robot hablando... habla para interrumpir';
    return 'Iniciar conversacion';
  };

  return (
    <div className="control-buttons flex flex-col items-center space-y-2">
      <div className="flex space-x-4 items-center">
        {/* Boton principal */}
        <div className="relative">
          <button
            onClick={onRecordClick}
            disabled={disabled}
            className={`flex items-center justify-center h-14 w-14 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${getButtonStyle()}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform active:scale-95 transition-transform'}`}
            aria-label={getAriaLabel()}
          >
            {getIcon()}
          </button>

          {/* Indicador de sesion activa */}
          {isSessionActive && !isProcessing && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          )}

          {/* Anillo de pulso cuando listening */}
          {isListening && !isRecording && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-green-500" />
          )}

          {/* Anillo de pulso cuando recording */}
          {isRecording && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-red-500" />
          )}
        </div>

        {/* Boton de detener habla (solo visible cuando esta hablando) */}
        {isSpeaking && (
          <button
            onClick={onStopSpeakingClick}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300
                       dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-gray-500 transform active:scale-95 transition-transform"
            aria-label="Detener voz"
          >
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          </button>
        )}
      </div>

      {/* Indicador de volumen cuando listening */}
      {isListening && !isRecording && (
        <div className="flex gap-0.5 items-end h-3">
          {[0.1, 0.2, 0.3, 0.4, 0.5].map((threshold, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                currentVolume >= threshold ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{ height: `${4 + (i * 2)}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ControlButtons;
