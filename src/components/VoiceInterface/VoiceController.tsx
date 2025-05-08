import React, { useEffect, useRef } from 'react';
import { useRobotInteraction, RobotInteractionState } from '../../hooks/useRobotInteraction';
import { RobotMethods } from '../../types/robot';
import AudioVisualizer from './AudioVisualizer';
import LanguageIndicator from './LanguageIndicator';
import ControlButtons from './ControlButtons';

interface VoiceControllerProps {
  robotRef: React.RefObject<RobotMethods>;
  initialLanguage?: string;
  onLanguageChange?: (language: string) => void;
  onStateChange?: (state: RobotInteractionState) => void;
}

const VoiceController: React.FC<VoiceControllerProps> = ({
  robotRef,
  initialLanguage = 'es',
  onLanguageChange,
  onStateChange
}) => {
  // Audio element ref para reproducir respuestas
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hook principal de interacción
  const {
    interactionState,
    isRecording,
    currentLanguage,
    userMessage,
    robotResponse,
    startListening,
    stopListening,
    sendTextMessage,
    stopSpeaking,
    changeLanguage,
    registerRobot,
    translate
  } = useRobotInteraction({
    initialLanguage,
    onStateChange,
    onError: (error) => {
      console.error('Error en la interacción con el robot:', error);
    }
  });

  // Registrar el robot cuando el componente se monta
  useEffect(() => {
    if (robotRef.current) {
      registerRobot(robotRef.current);
    }
  }, [robotRef, registerRobot]);

  // Notificar cambios de idioma
  useEffect(() => {
    if (onLanguageChange && currentLanguage) {
      onLanguageChange(currentLanguage);
    }
  }, [currentLanguage, onLanguageChange]);

  // Manejar clic en botón de grabación
  const handleRecordClick = async () => {
    if (isRecording) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  // Manejar clic en botón de detener habla
  const handleStopSpeakingClick = () => {
    if (interactionState === RobotInteractionState.SPEAKING) {
      stopSpeaking();
    }
  };

  // Manejar envío de texto manual
  const handleTextSubmit = (text: string) => {
    if (text.trim() && interactionState !== RobotInteractionState.PROCESSING) {
      sendTextMessage(text);
    }
  };

  // Determinar si los botones deben estar deshabilitados
  const isButtonDisabled = 
    interactionState === RobotInteractionState.PROCESSING;

  return (
    <div className="voice-controller relative bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
      {/* Audio oculto para reproducción */}
      <audio ref={audioRef} hidden />
      
      {/* Indicador de estado */}
      <div className="status-indicator mb-4 text-center">
        <p className="text-sm font-medium">
          {interactionState === RobotInteractionState.IDLE && translate('robot.greeting')}
          {interactionState === RobotInteractionState.LISTENING && translate('voice.stop_recording')}
          {interactionState === RobotInteractionState.PROCESSING && translate('robot.thinking')}
          {interactionState === RobotInteractionState.ERROR && translate('robot.error')}
        </p>
      </div>
      
      {/* Visualizador de audio (solo cuando está grabando) */}
      {isRecording && (
        <div className="audio-visualizer-container my-4">
          <AudioVisualizer />
        </div>
      )}
      
      {/* Indicador de idioma */}
      <div className="language-indicator absolute top-2 right-2">
        <LanguageIndicator 
          language={currentLanguage} 
          onLanguageChange={changeLanguage}
        />
      </div>
      
      {/* Botones de control */}
      <div className="control-buttons mt-4 flex justify-center">
        <ControlButtons 
          isRecording={isRecording}
          isSpeaking={interactionState === RobotInteractionState.SPEAKING}
          isProcessing={interactionState === RobotInteractionState.PROCESSING}
          onRecordClick={handleRecordClick}
          onStopSpeakingClick={handleStopSpeakingClick}
          disabled={isButtonDisabled}
        />
      </div>
      
      {/* Área de conversación */}
      {(userMessage || robotResponse) && (
        <div className="conversation-area mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
          {userMessage && (
            <div className="user-message mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tú:</p>
              <p className="text-sm bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">{userMessage}</p>
            </div>
          )}
          
          {robotResponse && (
            <div className="robot-message">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tunix:</p>
              <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">{robotResponse}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Entrada de texto alternativa */}
      <div className="text-input mt-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('messageInput') as HTMLInputElement;
            if (input.value) {
              handleTextSubmit(input.value);
              input.value = '';
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            name="messageInput"
            placeholder={translate('voice.input_placeholder')}
            disabled={isButtonDisabled}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                       text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {translate('voice.send')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoiceController; 