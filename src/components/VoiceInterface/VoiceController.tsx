import React, { useEffect, useRef } from 'react';
import { useRobotInteraction, RobotInteractionState } from '../../hooks/useRobotInteraction';
import { ConversationPhase } from '../../lib/agent';
import { RobotMethods } from '../../types/robot';
import AudioVisualizer from './AudioVisualizer';
import LanguageIndicator from './LanguageIndicator';
import ControlButtons from './ControlButtons';

interface VoiceControllerProps {
  robotRef: React.RefObject<RobotMethods>;
  initialLanguage?: string;
  onLanguageChange?: (language: string) => void;
  onStateChange?: (state: RobotInteractionState) => void;
  onLeadCaptured?: (leadData: any) => void;
  onSessionEnd?: () => void;
}

// Mapeo de fases a texto descriptivo
const PHASE_LABELS: Record<ConversationPhase, string> = {
  [ConversationPhase.GREETING]: 'Saludo',
  [ConversationPhase.DISCOVERY]: 'Descubriendo necesidades',
  [ConversationPhase.QUALIFICATION]: 'Calificando',
  [ConversationPhase.PRESENTATION]: 'Presentando soluciones',
  [ConversationPhase.OBJECTION_HANDLING]: 'Resolviendo dudas',
  [ConversationPhase.BOOKING]: 'Agendando reunion',
  [ConversationPhase.FAREWELL]: 'Despedida'
};

const VoiceController: React.FC<VoiceControllerProps> = ({
  robotRef,
  initialLanguage = 'es',
  onLanguageChange,
  onStateChange,
  onLeadCaptured,
  onSessionEnd
}) => {
  // Audio element ref para reproducir respuestas
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hook principal de interaccion con soporte para conversacion continua
  const {
    interactionState,
    isRecording,
    currentLanguage,
    userMessage,
    robotResponse,
    // Nuevos estados de sesion continua
    isSessionActive,
    currentPhase,
    currentVolume,
    vadIsListening,
    vadIsSpeaking,
    // Metodos principales
    startListening,
    stopListening,
    endSession,
    sendTextMessage,
    stopSpeaking,
    setCurrentLanguage,
    assignRobotRef,
    // Datos del agente
    getLeadData,
    getConversationPhase
  } = useRobotInteraction({
    initialLanguage,
    onStateChange,
    onLeadCaptured,
    onSessionEnd,
    onError: (error) => {
      console.error('Error en la interaccion con el robot:', error);
    },
    // Configuracion de conversacion continua
    continuousConfig: {
      enabled: true,
      autoRestartListening: true,
      bargeInEnabled: true,
      idleTimeoutMs: 60000,
      listenTimeoutMs: 30000
    }
  });

  // Alias para compatibilidad
  const changeLanguage = setCurrentLanguage;
  const registerRobot = assignRobotRef;

  // Traducciones
  const translations: Record<string, string> = {
    'robot.greeting': 'Hola, soy Tunix. Haz clic en el microfono para iniciar una conversacion.',
    'voice.listening': 'Habla conmigo... te escucho.',
    'voice.listening_active': 'Te escucho...',
    'voice.stop_recording': 'Grabando... haz clic para enviar.',
    'robot.thinking': 'Procesando tu mensaje...',
    'robot.speaking': 'Respondiendo... (puedes interrumpirme)',
    'robot.error': 'Ocurrio un error. Intenta de nuevo.',
    'voice.input_placeholder': 'Escribe tu mensaje...',
    'voice.send': 'Enviar',
    'session.end': 'Terminar conversacion'
  };
  const translate = (key: string) => translations[key] || key;

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

  // Manejar clic en boton de grabacion
  const handleRecordClick = async () => {
    // Si hay sesion activa y estamos en listening, detener sesion
    if (isSessionActive && (interactionState === RobotInteractionState.LISTENING || interactionState === RobotInteractionState.LISTENING_ACTIVE)) {
      await stopListening();
    } else if (!isSessionActive || interactionState === RobotInteractionState.IDLE) {
      // Iniciar nueva sesion o reanudar listening
      await startListening();
    } else if (isRecording) {
      await stopListening();
    }
  };

  // Manejar clic en boton de detener habla
  const handleStopSpeakingClick = () => {
    if (interactionState === RobotInteractionState.SPEAKING) {
      stopSpeaking();
    }
  };

  // Manejar fin de sesion
  const handleEndSession = () => {
    endSession();
  };

  // Manejar envio de texto manual
  const handleTextSubmit = (text: string) => {
    if (text.trim() && interactionState !== RobotInteractionState.PROCESSING) {
      sendTextMessage(text);
    }
  };

  // Determinar mensaje de estado
  const getStatusMessage = () => {
    switch (interactionState) {
      case RobotInteractionState.IDLE:
        return translate('robot.greeting');
      case RobotInteractionState.LISTENING:
        return translate('voice.listening');
      case RobotInteractionState.LISTENING_ACTIVE:
        return translate('voice.listening_active');
      case RobotInteractionState.PROCESSING:
        return translate('robot.thinking');
      case RobotInteractionState.SPEAKING:
        return translate('robot.speaking');
      case RobotInteractionState.ERROR:
        return translate('robot.error');
      default:
        return '';
    }
  };

  // Determinar si los botones deben estar deshabilitados
  const isButtonDisabled = interactionState === RobotInteractionState.PROCESSING;

  return (
    <div className="voice-controller relative bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
      {/* Audio oculto para reproduccion */}
      <audio ref={audioRef} hidden />

      {/* Indicador de fase de conversacion (solo si sesion activa) */}
      {isSessionActive && (
        <div className="phase-indicator mb-2 flex items-center justify-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
            {PHASE_LABELS[currentPhase] || 'Conversando'}
          </span>
          <button
            onClick={handleEndSession}
            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            title={translate('session.end')}
          >
            Terminar
          </button>
        </div>
      )}

      {/* Indicador de estado */}
      <div className="status-indicator mb-4 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getStatusMessage()}
        </p>
      </div>

      {/* Visualizador de audio (cuando escuchando activamente) */}
      {(interactionState === RobotInteractionState.LISTENING_ACTIVE || isRecording) && (
        <div className="audio-visualizer-container my-4">
          <AudioVisualizer />
        </div>
      )}

      {/* Indicador de volumen (cuando escuchando pero no hablando) */}
      {interactionState === RobotInteractionState.LISTENING && (
        <div className="volume-indicator my-4 flex justify-center">
          <div className="flex gap-1 items-end h-8">
            {[0.1, 0.2, 0.3, 0.4, 0.5].map((threshold, i) => (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-100 ${
                  currentVolume >= threshold ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                style={{ height: `${8 + (i * 6)}px` }}
              />
            ))}
          </div>
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
          isRecording={isRecording || interactionState === RobotInteractionState.LISTENING_ACTIVE}
          isSpeaking={interactionState === RobotInteractionState.SPEAKING}
          isProcessing={interactionState === RobotInteractionState.PROCESSING}
          isListening={interactionState === RobotInteractionState.LISTENING}
          onRecordClick={handleRecordClick}
          onStopSpeakingClick={handleStopSpeakingClick}
          disabled={isButtonDisabled}
          currentVolume={currentVolume}
          isSessionActive={isSessionActive}
        />
      </div>

      {/* Area de conversacion */}
      {(userMessage || robotResponse) && (
        <div className="conversation-area mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
          {userMessage && (
            <div className="user-message mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tu:</p>
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
