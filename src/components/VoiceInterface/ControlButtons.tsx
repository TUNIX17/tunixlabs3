import React from 'react';

interface ControlButtonsProps {
  isRecording: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onRecordClick: () => void;
  onStopSpeakingClick: () => void;
  disabled?: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRecording,
  isSpeaking,
  isProcessing,
  onRecordClick,
  onStopSpeakingClick,
  disabled = false
}) => {
  return (
    <div className="control-buttons flex space-x-4">
      {/* Botón principal: Grabar/Detener */}
      <button
        onClick={onRecordClick}
        disabled={disabled}
        className={`flex items-center justify-center h-14 w-14 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 
                    ${isRecording 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} 
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform active:scale-95 transition-transform'}`}
        aria-label={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
      >
        {isProcessing ? (
          // Indicador de carga
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isRecording ? (
          // Icono de Stop
          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        ) : (
          // Icono de micrófono
          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      
      {/* Botón secundario: Detener habla (solo visible cuando está hablando) */}
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
  );
};

export default ControlButtons; 