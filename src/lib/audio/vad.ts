/**
 * Voice Activity Detection (VAD) using Web Audio API
 * Detecta cuando el usuario esta hablando basado en umbral de volumen
 */

import { VADConfig, DEFAULT_VAD_CONFIG } from './vadConfig';

/** Eventos emitidos por VAD */
export type VADEvent =
  | 'speech_start'    // Usuario empezo a hablar
  | 'speech_end'      // Usuario dejo de hablar (silencio detectado)
  | 'volume_change'   // Cambio en nivel de volumen
  | 'listening_start' // VAD empezo a escuchar
  | 'listening_stop'; // VAD dejo de escuchar

/** Estado interno del VAD */
export interface VADState {
  isListening: boolean;        // VAD esta activo
  isSpeaking: boolean;         // Usuario esta hablando actualmente
  currentVolume: number;       // Nivel de volumen actual (0-1)
  speechStartTime: number | null;   // Timestamp cuando empezo a hablar
  lastSpeechTime: number | null;    // Ultimo timestamp con voz detectada
}

/** Callback para eventos VAD */
export type VADCallback = (data?: { volume?: number; duration?: number }) => void;

/**
 * Clase principal de Voice Activity Detection
 * Usa Web Audio API para analizar volumen en tiempo real
 */
export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private analysisInterval: ReturnType<typeof setInterval> | null = null;

  private config: VADConfig;
  private state: VADState;
  private callbacks: Map<VADEvent, Set<VADCallback>>;

  // Timers para debounce
  private speechStartTimer: ReturnType<typeof setTimeout> | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  // Flag para tracking de estado de speech
  private pendingSpeechStart: boolean = false;

  constructor(config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_VAD_CONFIG, ...config };
    this.state = {
      isListening: false,
      isSpeaking: false,
      currentVolume: 0,
      speechStartTime: null,
      lastSpeechTime: null
    };
    this.callbacks = new Map();
  }

  /**
   * Iniciar VAD - solicita acceso al microfono y comienza analisis
   */
  async start(): Promise<void> {
    if (this.state.isListening) {
      console.warn('[VAD] Ya esta escuchando');
      return;
    }

    try {
      // Solicitar acceso al microfono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Crear contexto de audio
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();

      // Configurar analyser para deteccion de volumen
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.3;

      // Conectar microfono al analyser
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      // Buffer para datos de frecuencia
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // Iniciar analisis periodico
      this.analysisInterval = setInterval(
        () => this.analyzeVolume(),
        this.config.analysisIntervalMs
      );

      this.state.isListening = true;
      this.emit('listening_start');

      console.log('[VAD] Iniciado con config:', this.config);

    } catch (error) {
      console.error('[VAD] Error al iniciar:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Detener VAD - libera recursos
   */
  stop(): void {
    if (!this.state.isListening) {
      return;
    }

    // Si estaba hablando, emitir speech_end
    if (this.state.isSpeaking) {
      this.handleSpeechEnd();
    }

    this.cleanup();
    this.state.isListening = false;
    this.emit('listening_stop');

    console.log('[VAD] Detenido');
  }

  /**
   * Limpiar recursos
   */
  private cleanup(): void {
    // Limpiar timers
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    if (this.speechStartTimer) {
      clearTimeout(this.speechStartTimer);
      this.speechStartTimer = null;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // Desconectar nodos de audio
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Cerrar contexto de audio
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Detener tracks del microfono
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.analyser = null;
    this.dataArray = null;
    this.pendingSpeechStart = false;
  }

  /**
   * Analizar volumen actual del audio
   */
  private analyzeVolume(): void {
    if (!this.analyser || !this.dataArray) {
      return;
    }

    // Obtener datos de frecuencia
    this.analyser.getByteFrequencyData(this.dataArray);

    // Calcular RMS (Root Mean Square) para obtener volumen
    const volume = this.calculateRMS(this.dataArray);

    // Actualizar estado
    const previousVolume = this.state.currentVolume;
    this.state.currentVolume = volume;

    // Emitir cambio de volumen si es significativo
    if (Math.abs(volume - previousVolume) > 0.005) {
      this.emit('volume_change', { volume });
    }

    // Verificar si hay voz
    const isVoiceDetected = volume > this.config.volumeThreshold;

    if (isVoiceDetected) {
      this.handleVoiceDetected();
    } else {
      this.handleSilenceDetected();
    }
  }

  /**
   * Calcular RMS del array de frecuencias
   * Retorna valor normalizado 0-1
   */
  private calculateRMS(dataArray: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = dataArray[i] / 255;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / dataArray.length);
  }

  /**
   * Manejar deteccion de voz
   */
  private handleVoiceDetected(): void {
    const now = Date.now();
    this.state.lastSpeechTime = now;

    // Cancelar timer de silencio si existe
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // Si ya esta hablando, no hacer nada mas
    if (this.state.isSpeaking) {
      return;
    }

    // Si ya hay un timer pendiente para iniciar speech, no crear otro
    if (this.pendingSpeechStart) {
      return;
    }

    // Iniciar timer de debounce para speech_start
    this.pendingSpeechStart = true;
    this.speechStartTimer = setTimeout(() => {
      // Verificar que aun hay voz despues del delay
      if (this.state.currentVolume > this.config.volumeThreshold) {
        this.handleSpeechStart();
      }
      this.pendingSpeechStart = false;
    }, this.config.speechStartDelay);
  }

  /**
   * Manejar deteccion de silencio
   */
  private handleSilenceDetected(): void {
    // Cancelar timer de speech start si existe
    if (this.speechStartTimer) {
      clearTimeout(this.speechStartTimer);
      this.speechStartTimer = null;
      this.pendingSpeechStart = false;
    }

    // Si no esta hablando, no hacer nada
    if (!this.state.isSpeaking) {
      return;
    }

    // Si ya hay un timer de silencio, no crear otro
    if (this.silenceTimer) {
      return;
    }

    // Iniciar timer de silencio
    this.silenceTimer = setTimeout(() => {
      // Verificar duracion minima de speech
      if (this.state.speechStartTime) {
        const speechDuration = Date.now() - this.state.speechStartTime;
        if (speechDuration >= this.config.minSpeechDuration) {
          this.handleSpeechEnd();
        } else {
          // Speech muy corto, ignorar
          console.log('[VAD] Speech ignorado - duracion muy corta:', speechDuration, 'ms');
          this.state.isSpeaking = false;
          this.state.speechStartTime = null;
        }
      }
      this.silenceTimer = null;
    }, this.config.silenceTimeout);
  }

  /**
   * Manejar inicio de speech
   */
  private handleSpeechStart(): void {
    if (this.state.isSpeaking) {
      return;
    }

    this.state.isSpeaking = true;
    this.state.speechStartTime = Date.now();

    console.log('[VAD] Speech detectado - inicio');
    this.emit('speech_start');
  }

  /**
   * Manejar fin de speech
   */
  private handleSpeechEnd(): void {
    if (!this.state.isSpeaking) {
      return;
    }

    const duration = this.state.speechStartTime
      ? Date.now() - this.state.speechStartTime
      : 0;

    this.state.isSpeaking = false;
    this.state.speechStartTime = null;

    console.log('[VAD] Speech terminado - duracion:', duration, 'ms');
    this.emit('speech_end', { duration });
  }

  /**
   * Ajustar umbral de volumen dinamicamente
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      console.warn('[VAD] Threshold debe estar entre 0 y 1');
      return;
    }
    this.config.volumeThreshold = threshold;
    console.log('[VAD] Threshold actualizado a:', threshold);
  }

  /**
   * Obtener configuracion actual
   */
  getConfig(): VADConfig {
    return { ...this.config };
  }

  /**
   * Actualizar configuracion
   */
  updateConfig(newConfig: Partial<VADConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[VAD] Config actualizada:', this.config);
  }

  /**
   * Obtener estado actual
   */
  getState(): VADState {
    return { ...this.state };
  }

  /**
   * Registrar callback para evento
   */
  on(event: VADEvent, callback: VADCallback): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event)!.add(callback);
  }

  /**
   * Remover callback para evento
   */
  off(event: VADEvent, callback?: VADCallback): void {
    if (!this.callbacks.has(event)) {
      return;
    }

    if (callback) {
      this.callbacks.get(event)!.delete(callback);
    } else {
      // Remover todos los callbacks para este evento
      this.callbacks.delete(event);
    }
  }

  /**
   * Emitir evento
   */
  private emit(event: VADEvent, data?: { volume?: number; duration?: number }): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`[VAD] Error en callback para ${event}:`, error);
        }
      });
    }
  }

  /**
   * Verificar si el navegador soporta las APIs necesarias
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const hasMediaDevices = typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';
    const hasAudioContext = typeof AudioContext !== 'undefined' ||
      typeof (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext !== 'undefined';
    return hasMediaDevices && hasAudioContext;
  }

  /**
   * Destruir instancia y liberar todos los recursos
   */
  dispose(): void {
    this.stop();
    this.callbacks.clear();
  }
}

export default VoiceActivityDetector;
