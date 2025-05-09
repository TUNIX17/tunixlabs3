import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecorder, AudioRecorderOptions } from '../lib/audio/recorder';

interface UseAudioRecordingProps {
  maxDurationMs?: number;
  onDataAvailable?: (blob: Blob) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useAudioRecording = ({
  maxDurationMs = 60000, // 1 minuto por defecto
  onDataAvailable,
  onEnded,
  onError
}: UseAudioRecordingProps = {}) => {
  // Estados para la grabación
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Referencia al grabador
  const recorderRef = useRef<AudioRecorder | null>(null);
  
  // Inicializar grabador
  useEffect(() => {
    const options: AudioRecorderOptions = {
      maxDurationMs,
      onDataAvailable: (blob) => {
        if (onDataAvailable && blob.size > 0) {
          onDataAvailable(blob);
        }
      },
      onEnded: () => {
        if (onEnded) {
          onEnded();
        }
      }
    };
    
    recorderRef.current = new AudioRecorder(options);
    
    // Limpiar al desmontar
    return () => {
      if (recorderRef.current) {
        try {
          const recorder = recorderRef.current;
          if (recorder.getState().isRecording) {
            recorder.cancel();
          }
          recorderRef.current = null;
        } catch (error) {
          console.error('Error al limpiar grabador:', error);
        }
      }
    };
  }, [maxDurationMs, onDataAvailable, onEnded]);
  
  // Actualizar estado desde el grabador
  const updateStateFromRecorder = useCallback(() => {
    if (recorderRef.current) {
      const state = recorderRef.current.getState();
      setIsRecording(state.isRecording);
      setIsPaused(state.isPaused);
      if (state.audioBlob) {
        setAudioBlob(state.audioBlob);
      }
      setDuration(state.duration);
      setErrorMessage(state.errorMessage);
      
      // Reportar errores
      if (state.errorMessage && onError) {
        onError(new Error(state.errorMessage));
      }
    }
  }, [onError]);
  
  // Iniciar grabación
  const startRecording = useCallback(async () => {
    try {
      if (!recorderRef.current) {
        throw new Error('Grabador no inicializado');
      }
      
      // Asegurar que el navegador soporte grabación
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('La grabación de audio no está soportada en este navegador');
      }
      
      // Iniciar grabación
      await recorderRef.current.start();
      updateStateFromRecorder();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido al iniciar grabación');
      setIsRecording(false);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Error desconocido al iniciar grabación'));
      }
    }
  }, [updateStateFromRecorder, onError]);
  
  // Pausar grabación
  const pauseRecording = useCallback(() => {
    try {
      if (!recorderRef.current || !isRecording || isPaused) {
        return;
      }
      
      recorderRef.current.pause();
      updateStateFromRecorder();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al pausar grabación');
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Error al pausar grabación'));
      }
    }
  }, [isRecording, isPaused, updateStateFromRecorder, onError]);
  
  // Reanudar grabación
  const resumeRecording = useCallback(() => {
    try {
      if (!recorderRef.current || !isRecording || !isPaused) {
        return;
      }
      
      recorderRef.current.resume();
      updateStateFromRecorder();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al reanudar grabación');
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Error al reanudar grabación'));
      }
    }
  }, [isRecording, isPaused, updateStateFromRecorder, onError]);
  
  // Detener grabación
  const stopRecording = useCallback(async () => {
    try {
      if (!recorderRef.current || !isRecording) {
        return null;
      }
      
      const blob = await recorderRef.current.stop();
      setAudioBlob(blob);
      updateStateFromRecorder();
      return blob;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al detener grabación');
      setIsRecording(false);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Error al detener grabación'));
      }
      
      return null;
    }
  }, [isRecording, updateStateFromRecorder, onError]);
  
  // Cancelar grabación
  const cancelRecording = useCallback(() => {
    try {
      if (!recorderRef.current || !isRecording) {
        return;
      }
      
      recorderRef.current.cancel();
      setIsRecording(false);
      setIsPaused(false);
      setAudioBlob(null);
      setDuration(0);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al cancelar grabación');
      setIsRecording(false);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Error al cancelar grabación'));
      }
    }
  }, [isRecording, onError]);
  
  // Limpiar estado
  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setDuration(0);
    setErrorMessage(null);
  }, []);

  return {
    // Estados
    isRecording,
    isPaused,
    audioBlob,
    duration,
    errorMessage,
    
    // Métodos
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    resetRecording
  };
}; 