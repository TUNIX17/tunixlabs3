/**
 * Hook React para Voice Activity Detection (VAD)
 * Proporciona deteccion de voz en tiempo real usando Web Audio API o Silero VAD
 * Supports both RMS-based and ML-based (Silero) VAD engines
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceActivityDetector, VADState, VADEvent } from '../lib/audio/vad';
import { VADConfig, VADPreset, getVADConfig, createVADConfig } from '../lib/audio/vadConfig';
import { createVAD, VADEngineType, UnifiedVAD, getAvailableEngines } from '../lib/audio/vadFactory';
import { SileroVADConfig, DEFAULT_SILERO_CONFIG } from '../lib/audio/sileroVAD';
import { getVADEngine } from '../lib/config/featureFlags';

/** Opciones para el hook useVAD */
export interface UseVADOptions {
  /** Preset de configuracion VAD */
  preset?: VADPreset;

  /** Configuracion personalizada (override del preset) */
  config?: Partial<VADConfig>;

  /** VAD engine type: 'rms' (default), 'silero' (ML-based), or 'auto' (try silero, fallback to rms) */
  vadType?: VADEngineType;

  /** Silero-specific configuration (only used when vadType is 'silero' or 'auto') */
  sileroConfig?: Partial<SileroVADConfig>;

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

  /** Callback cuando inicia calibración de ruido ambiente */
  onCalibrationStart?: () => void;

  /** Callback cuando termina calibración */
  onCalibrationEnd?: (data: { threshold: number; noiseFloor: number }) => void;

  /** Callback cuando el umbral adaptativo cambia */
  onThresholdUpdate?: (data: { threshold: number; noiseFloor: number }) => void;

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

  /** Si está en fase de calibración */
  isCalibrating: boolean;

  /** Umbral de volumen actual (adaptativo o fijo) */
  currentThreshold: number;

  /** Nivel de ruido de fondo estimado */
  noiseFloor: number;

  /** The actual VAD engine being used */
  engineType: 'rms' | 'silero' | null;

  /** Whether fallback was used (tried silero but fell back to rms) */
  usedFallback: boolean;

  /** Iniciar deteccion de voz */
  startVAD: () => Promise<void>;

  /** Detener deteccion de voz */
  stopVAD: () => void;

  /** Ajustar umbral de volumen */
  setThreshold: (threshold: number) => void;

  /** Actualizar configuracion */
  updateConfig: (config: Partial<VADConfig>) => void;

  /** Obtener configuracion actual */
  getConfig: () => VADConfig | SileroVADConfig | null;

  /** Cambiar preset */
  setPreset: (preset: VADPreset) => void;

  /** Forzar recalibración del VAD */
  recalibrate: () => void;
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
    vadType,
    sileroConfig,
    autoStart = false,
    onSpeechStart,
    onSpeechEnd,
    onVolumeChange,
    onListeningStart,
    onListeningStop,
    onCalibrationStart,
    onCalibrationEnd,
    onThresholdUpdate,
    onError
  } = options;

  // Estado
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  // Nuevos estados para modo adaptativo
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [currentThreshold, setCurrentThreshold] = useState(0.12);
  const [noiseFloor, setNoiseFloor] = useState(0.05);
  // Engine type tracking
  const [engineType, setEngineType] = useState<'rms' | 'silero' | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  // Pre-load state - true when model is loaded and ready for instant start
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Referencia al detector VAD (unified interface)
  const vadRef = useRef<UnifiedVAD | null>(null);
  // Track initialization
  const isInitializedRef = useRef(false);

  // Referencia a callbacks para evitar re-renders
  const callbacksRef = useRef({
    onSpeechStart,
    onSpeechEnd,
    onVolumeChange,
    onListeningStart,
    onListeningStop,
    onCalibrationStart,
    onCalibrationEnd,
    onThresholdUpdate,
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
      onCalibrationStart,
      onCalibrationEnd,
      onThresholdUpdate,
      onError
    };
  }, [onSpeechStart, onSpeechEnd, onVolumeChange, onListeningStart, onListeningStop, onCalibrationStart, onCalibrationEnd, onThresholdUpdate, onError]);

  // Verificar soporte (check both engines)
  const availableEngines = getAvailableEngines();
  const isSupported = availableEngines.rms || availableEngines.silero;

  // Get effective engine type from feature flag or option
  const effectiveVadType = vadType || getVADEngine();

  // Initialize VAD with factory
  useEffect(() => {
    if (!isSupported) {
      console.warn('[useVAD] No VAD engine supported in this browser');
      return;
    }

    // Prevent double initialization
    if (isInitializedRef.current) {
      return;
    }

    const initVAD = async () => {
      try {
        // Create VAD config
        const vadConfig = createVADConfig(preset, customConfig);

        // Use factory to create the appropriate VAD
        const result = await createVAD({
          engine: effectiveVadType,
          rmsConfig: vadConfig,
          sileroConfig: sileroConfig || DEFAULT_SILERO_CONFIG
        });

        vadRef.current = result.vad;
        setEngineType(result.engineType);
        setUsedFallback(result.usedFallback);
        isInitializedRef.current = true;

        console.log(`[useVAD] Initialized with engine: ${result.engineType}${result.usedFallback ? ' (fallback)' : ''}`);

        // PRE-LOAD: Start loading the model in background immediately
        // This ensures the model is ready when user clicks the mic button
        if (result.vad.preload && result.engineType === 'silero') {
          console.log('[useVAD] Starting background pre-load of Silero model...');
          result.vad.preload().catch((err) => {
            console.warn('[useVAD] Background pre-load failed (will load on first use):', err);
          });
        }

        // Register callbacks
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
          setIsCalibrating(false);
          callbacksRef.current.onListeningStop?.();
        });

        // Calibration events (adaptive mode / Silero model loading)
        vadRef.current.on('calibration_start', () => {
          setIsCalibrating(true);
          callbacksRef.current.onCalibrationStart?.();
        });

        vadRef.current.on('calibration_end', (data) => {
          setIsCalibrating(false);
          if (data?.threshold !== undefined) {
            setCurrentThreshold(data.threshold);
          }
          if (data?.noiseFloor !== undefined) {
            setNoiseFloor(data.noiseFloor);
          }
          callbacksRef.current.onCalibrationEnd?.({
            threshold: data?.threshold ?? 0.12,
            noiseFloor: data?.noiseFloor ?? 0.05
          });
        });

        vadRef.current.on('threshold_update', (data) => {
          if (data?.threshold !== undefined) {
            setCurrentThreshold(data.threshold);
          }
          if (data?.noiseFloor !== undefined) {
            setNoiseFloor(data.noiseFloor);
          }
          callbacksRef.current.onThresholdUpdate?.({
            threshold: data?.threshold ?? 0.12,
            noiseFloor: data?.noiseFloor ?? 0.05
          });
        });

        // Auto-start if configured
        if (autoStart) {
          await vadRef.current.start();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('[useVAD] Initialization error:', error);
        setError(error);
        callbacksRef.current.onError?.(error);
      }
    };

    initVAD();

    // Cleanup on unmount
    return () => {
      if (vadRef.current) {
        vadRef.current.dispose();
        vadRef.current = null;
      }
      isInitializedRef.current = false;
      setEngineType(null);
    };
  }, [isSupported, preset, effectiveVadType]); // Re-create when engine type changes

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
  const getConfig = useCallback((): VADConfig | SileroVADConfig | null => {
    return vadRef.current?.getConfig() ?? null;
  }, []);

  // Cambiar preset
  const setPreset = useCallback((newPreset: VADPreset): void => {
    if (vadRef.current) {
      const newConfig = getVADConfig(newPreset);
      vadRef.current.updateConfig(newConfig);
    }
  }, []);

  // Forzar recalibración
  const recalibrate = useCallback((): void => {
    if (vadRef.current) {
      vadRef.current.recalibrate();
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    currentVolume,
    isSupported,
    error,
    isCalibrating,
    currentThreshold,
    noiseFloor,
    engineType,
    usedFallback,
    startVAD,
    stopVAD,
    setThreshold,
    updateConfig,
    getConfig,
    setPreset,
    recalibrate
  };
};

export default useVAD;
