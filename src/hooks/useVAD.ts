/**
 * Hook React para Voice Activity Detection (VAD)
 * Proporciona deteccion de voz en tiempo real usando Web Audio API
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceActivityDetector, VADState, VADEvent } from '../lib/audio/vad';
import { VADConfig, VADPreset, getVADConfig, createVADConfig } from '../lib/audio/vadConfig';

/** Opciones para el hook useVAD */
export interface UseVADOptions {
  /** Preset de configuracion VAD */
  preset?: VADPreset;

  /** Configuracion personalizada (override del preset) */
  config?: Partial<VADConfig>;

  /** Iniciar automaticamente al montar */
  autoStart?: boolean;

  /** Callback cuando se detecta inicio de voz */
  onSpeechStart?: () => void;

  /** Callback cuando se detecta fin de voz */
  onSpeechEnd?: (duration: number) => void;

  /** Callback cuando cambia el volumen */
  onVolumeChange?: (volume: number) => void;

  /** Callback cuando VAD empieza a escuchar */
  onListeningStart?: () => void;

  /** Callback cuando VAD deja de escuchar */
  onListeningStop?: () => void;

  /** Callback en caso de error */
  onError?: (error: Error) => void;
}

/** Retorno del hook useVAD */
export interface UseVADReturn {
  /** Estado actual del VAD */
  isListening: boolean;

  /** Si el usuario esta hablando actualmente */
  isSpeaking: boolean;

  /** Nivel de volumen actual (0-1) */
  currentVolume: number;

  /** Si el navegador soporta VAD */
  isSupported: boolean;

  /** Error actual si existe */
  error: Error | null;

  /** Iniciar deteccion de voz */
  startVAD: () => Promise<void>;

  /** Detener deteccion de voz */
  stopVAD: () => void;

  /** Ajustar umbral de volumen */
  setThreshold: (threshold: number) => void;

  /** Actualizar configuracion */
  updateConfig: (config: Partial<VADConfig>) => void;

  /** Obtener configuracion actual */
  getConfig: () => VADConfig | null;

  /** Cambiar preset */
  setPreset: (preset: VADPreset) => void;
}

/**
 * Hook para Voice Activity Detection
 * Detecta automaticamente cuando el usuario habla/deja de hablar
 *
 * @example
 * ```tsx
 * const { isListening, isSpeaking, startVAD, stopVAD } = useVAD({
 *   preset: 'default',
 *   onSpeechStart: () => console.log('Usuario empezo a hablar'),
 *   onSpeechEnd: (duration) => console.log('Usuario hablo por', duration, 'ms')
 * });
 *
 * // Iniciar deteccion
 * await startVAD();
 *
 * // El hook emitira callbacks automaticamente cuando detecte voz
 * ```
 */
export const useVAD = (options: UseVADOptions = {}): UseVADReturn => {
  const {
    preset = 'default',
    config: customConfig,
    autoStart = false,
    onSpeechStart,
    onSpeechEnd,
    onVolumeChange,
    onListeningStart,
    onListeningStop,
    onError
  } = options;

  // Estado
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Referencia al detector VAD
  const vadRef = useRef<VoiceActivityDetector | null>(null);

  // Referencia a callbacks para evitar re-renders
  const callbacksRef = useRef({
    onSpeechStart,
    onSpeechEnd,
    onVolumeChange,
    onListeningStart,
    onListeningStop,
    onError
  });

  // Actualizar callbacks ref
  useEffect(() => {
    callbacksRef.current = {
      onSpeechStart,
      onSpeechEnd,
      onVolumeChange,
      onListeningStart,
      onListeningStop,
      onError
    };
  }, [onSpeechStart, onSpeechEnd, onVolumeChange, onListeningStart, onListeningStop, onError]);

  // Verificar soporte
  const isSupported = VoiceActivityDetector.isSupported();

  // Inicializar VAD
  useEffect(() => {
    if (!isSupported) {
      console.warn('[useVAD] Web Audio API no soportada en este navegador');
      return;
    }

    // Crear configuracion
    const vadConfig = createVADConfig(preset, customConfig);

    // Crear instancia de VAD
    vadRef.current = new VoiceActivityDetector(vadConfig);

    // Registrar callbacks
    vadRef.current.on('speech_start', () => {
      setIsSpeaking(true);
      callbacksRef.current.onSpeechStart?.();
    });

    vadRef.current.on('speech_end', (data) => {
      setIsSpeaking(false);
      callbacksRef.current.onSpeechEnd?.(data?.duration ?? 0);
    });

    vadRef.current.on('volume_change', (data) => {
      if (data?.volume !== undefined) {
        setCurrentVolume(data.volume);
        callbacksRef.current.onVolumeChange?.(data.volume);
      }
    });

    vadRef.current.on('listening_start', () => {
      setIsListening(true);
      setError(null);
      callbacksRef.current.onListeningStart?.();
    });

    vadRef.current.on('listening_stop', () => {
      setIsListening(false);
      setIsSpeaking(false);
      setCurrentVolume(0);
      callbacksRef.current.onListeningStop?.();
    });

    // Auto-start si esta configurado
    if (autoStart) {
      vadRef.current.start().catch((err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        callbacksRef.current.onError?.(error);
      });
    }

    // Cleanup al desmontar
    return () => {
      if (vadRef.current) {
        vadRef.current.dispose();
        vadRef.current = null;
      }
    };
  }, [isSupported, preset]); // Solo re-crear cuando cambia el preset

  // Aplicar customConfig cuando cambia
  useEffect(() => {
    if (vadRef.current && customConfig) {
      vadRef.current.updateConfig(customConfig);
    }
  }, [customConfig]);

  // Iniciar VAD
  const startVAD = useCallback(async (): Promise<void> => {
    if (!vadRef.current) {
      const err = new Error('VAD no inicializado');
      setError(err);
      callbacksRef.current.onError?.(err);
      return;
    }

    if (!isSupported) {
      const err = new Error('VAD no soportado en este navegador');
      setError(err);
      callbacksRef.current.onError?.(err);
      return;
    }

    try {
      setError(null);
      await vadRef.current.start();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      callbacksRef.current.onError?.(error);
      throw error;
    }
  }, [isSupported]);

  // Detener VAD
  const stopVAD = useCallback((): void => {
    if (vadRef.current) {
      vadRef.current.stop();
    }
  }, []);

  // Ajustar umbral
  const setThreshold = useCallback((threshold: number): void => {
    if (vadRef.current) {
      vadRef.current.setThreshold(threshold);
    }
  }, []);

  // Actualizar configuracion
  const updateConfig = useCallback((config: Partial<VADConfig>): void => {
    if (vadRef.current) {
      vadRef.current.updateConfig(config);
    }
  }, []);

  // Obtener configuracion actual
  const getConfig = useCallback((): VADConfig | null => {
    return vadRef.current?.getConfig() ?? null;
  }, []);

  // Cambiar preset
  const setPreset = useCallback((newPreset: VADPreset): void => {
    if (vadRef.current) {
      const newConfig = getVADConfig(newPreset);
      vadRef.current.updateConfig(newConfig);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    currentVolume,
    isSupported,
    error,
    startVAD,
    stopVAD,
    setThreshold,
    updateConfig,
    getConfig,
    setPreset
  };
};

export default useVAD;
