/**
 * Silero VAD Wrapper
 * Provides high-accuracy voice activity detection using Silero VAD model
 * Implements the same interface as VoiceActivityDetector for easy swapping
 */

import type { MicVAD, RealTimeVADOptions } from '@ricky0123/vad-web';

/** Events emitted by SileroVAD - same as VoiceActivityDetector for compatibility */
export type SileroVADEvent =
  | 'speech_start'
  | 'speech_end'
  | 'volume_change'
  | 'listening_start'
  | 'listening_stop'
  | 'calibration_start'
  | 'calibration_end'
  | 'threshold_update';

/** State interface - same as VoiceActivityDetector */
export interface SileroVADState {
  isListening: boolean;
  isSpeaking: boolean;
  currentVolume: number;
  speechStartTime: number | null;
  lastSpeechTime: number | null;
  isCalibrating: boolean;
  adaptiveThreshold: number;
  noiseFloor: number;
}

/** Callback type for events */
export type SileroVADCallback = (data?: {
  volume?: number;
  duration?: number;
  threshold?: number;
  noiseFloor?: number;
}) => void;

/** Configuration specific to Silero VAD */
export interface SileroVADConfig {
  /** Positive speech threshold (0-1, default: 0.5) - values above this indicate speech */
  positiveSpeechThreshold: number;
  /** Negative speech threshold (0-1, default: 0.35) - values below this indicate no speech */
  negativeSpeechThreshold: number;
  /** Milliseconds to wait before ending speech after detecting silence */
  redemptionMs: number;
  /** Minimum speech duration in ms before confirming speech */
  minSpeechMs: number;
  /** Milliseconds of audio to prepend to the speech segment */
  preSpeechPadMs: number;
  /** If true, pausing VAD may trigger onSpeechEnd */
  submitUserSpeechOnPause: boolean;
}

/** Default Silero VAD configuration */
export const DEFAULT_SILERO_CONFIG: SileroVADConfig = {
  positiveSpeechThreshold: 0.5,
  negativeSpeechThreshold: 0.35,
  redemptionMs: 500,       // 500ms grace period before ending speech
  minSpeechMs: 250,        // Minimum 250ms of speech to be valid
  preSpeechPadMs: 100,     // 100ms of pre-speech padding
  submitUserSpeechOnPause: true
};

/**
 * Silero VAD Wrapper class
 * Uses @ricky0123/vad-web for high-accuracy voice activity detection
 */
export class SileroVADWrapper {
  private vad: MicVAD | null = null;
  private config: SileroVADConfig;
  private state: SileroVADState;
  private callbacks: Map<SileroVADEvent, Set<SileroVADCallback>>;
  private isInitialized: boolean = false;
  private speechStartTimestamp: number | null = null;

  // For volume estimation (Silero doesn't provide volume directly)
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private volumeInterval: ReturnType<typeof setInterval> | null = null;
  private dataArray: Uint8Array | null = null;

  // Pre-loading state - modelo cargado antes de start()
  private isPreloaded: boolean = false;
  private preloadPromise: Promise<void> | null = null;
  private vadModule: typeof import('@ricky0123/vad-web') | null = null;

  constructor(config: Partial<SileroVADConfig> = {}) {
    this.config = { ...DEFAULT_SILERO_CONFIG, ...config };
    this.state = {
      isListening: false,
      isSpeaking: false,
      currentVolume: 0,
      speechStartTime: null,
      lastSpeechTime: null,
      isCalibrating: false,
      adaptiveThreshold: 0.5,
      noiseFloor: 0.1
    };
    this.callbacks = new Map();
  }

  /**
   * Pre-load the Silero model without starting the microphone
   * Call this early (e.g., on page load) to avoid delay when user clicks the mic button
   */
  async preload(): Promise<void> {
    // If already preloaded or preloading, return existing promise
    if (this.isPreloaded) {
      console.log('[SileroVAD] Already preloaded');
      return;
    }

    if (this.preloadPromise) {
      console.log('[SileroVAD] Preload already in progress, waiting...');
      return this.preloadPromise;
    }

    this.preloadPromise = this._doPreload();
    return this.preloadPromise;
  }

  private async _doPreload(): Promise<void> {
    try {
      console.log('[SileroVAD] Pre-loading Silero model...');
      const startTime = performance.now();

      // Dynamic import the module
      this.vadModule = await import('@ricky0123/vad-web');

      // Pre-load the ONNX model by creating a temporary MicVAD
      // We'll use startOnLoad: false and not actually start it
      // This downloads and initializes the ONNX model
      const tempVad = await this.vadModule.MicVAD.new({
        positiveSpeechThreshold: this.config.positiveSpeechThreshold,
        negativeSpeechThreshold: this.config.negativeSpeechThreshold,
        model: 'legacy',
        baseAssetPath: '/onnx/',
        onnxWASMBasePath: '/onnx/',
        startOnLoad: false,
        // Dummy callbacks - these won't be called since we're not starting
        onSpeechStart: () => {},
        onSpeechEnd: () => {},
        onVADMisfire: () => {}
      });

      // Immediately pause/cleanup the temp instance
      tempVad.pause();

      this.isPreloaded = true;
      const elapsed = Math.round(performance.now() - startTime);
      console.log(`[SileroVAD] Model pre-loaded successfully in ${elapsed}ms`);
    } catch (error) {
      console.error('[SileroVAD] Pre-load failed:', error);
      this.preloadPromise = null;
      throw error;
    }
  }

  /**
   * Check if the model is pre-loaded
   */
  isModelPreloaded(): boolean {
    return this.isPreloaded;
  }

  /**
   * Start Silero VAD - requests microphone and begins listening
   */
  async start(): Promise<void> {
    if (this.state.isListening) {
      console.warn('[SileroVAD] Already listening');
      return;
    }

    try {
      // Emit calibration start
      this.state.isCalibrating = true;
      this.emit('calibration_start');

      // Use pre-loaded module if available, otherwise load now
      let vadModule: typeof import('@ricky0123/vad-web');
      if (this.vadModule && this.isPreloaded) {
        console.log('[SileroVAD] Using pre-loaded module (fast start)');
        vadModule = this.vadModule;
      } else {
        console.log('[SileroVAD] Loading Silero model (not pre-loaded)...');
        vadModule = await import('@ricky0123/vad-web');
      }
      const { MicVAD } = vadModule;

      // Create MicVAD instance with custom paths for ONNX model
      // baseAssetPath is used for: worklet file + model file
      // onnxWASMBasePath is used for: ONNX runtime WASM files
      this.vad = await MicVAD.new({
        positiveSpeechThreshold: this.config.positiveSpeechThreshold,
        negativeSpeechThreshold: this.config.negativeSpeechThreshold,
        redemptionMs: this.config.redemptionMs,
        minSpeechMs: this.config.minSpeechMs,
        preSpeechPadMs: this.config.preSpeechPadMs,
        submitUserSpeechOnPause: this.config.submitUserSpeechOnPause,

        // Use legacy model (smaller, faster)
        model: 'legacy',

        // Asset paths - all assets served from /onnx/
        baseAssetPath: '/onnx/',      // For worklet + model files
        onnxWASMBasePath: '/onnx/',   // For ONNX WASM runtime files

        // Don't auto-start, we'll start manually after setup
        startOnLoad: false,

        onSpeechStart: () => {
          this.handleSpeechStart();
        },

        onSpeechEnd: (audio: Float32Array) => {
          this.handleSpeechEnd(audio);
        },

        onVADMisfire: () => {
          // Speech was too short, ignore
          console.log('[SileroVAD] VAD misfire - speech too short');
          if (this.state.isSpeaking) {
            this.state.isSpeaking = false;
            this.speechStartTimestamp = null;
          }
        }
      });

      // Start the VAD manually
      await this.vad.start();

      // Set up volume monitoring using the same audio stream
      await this.setupVolumeMonitoring();

      // Calibration complete
      this.state.isCalibrating = false;
      this.state.isListening = true;
      this.isInitialized = true;

      this.emit('calibration_end', {
        threshold: this.config.positiveSpeechThreshold,
        noiseFloor: 0.1
      });
      this.emit('listening_start');

      console.log('[SileroVAD] Started successfully with config:', {
        positiveSpeechThreshold: this.config.positiveSpeechThreshold,
        negativeSpeechThreshold: this.config.negativeSpeechThreshold
      });

    } catch (error) {
      console.error('[SileroVAD] Error starting:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Set up volume monitoring for visual feedback
   */
  private async setupVolumeMonitoring(): Promise<void> {
    try {
      // Request microphone access for volume monitoring
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.3;

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // Monitor volume at 50ms intervals
      this.volumeInterval = setInterval(() => {
        this.updateVolume();
      }, 50);

    } catch (error) {
      console.warn('[SileroVAD] Volume monitoring setup failed:', error);
      // Continue without volume monitoring - Silero VAD still works
    }
  }

  /**
   * Update current volume level
   */
  private updateVolume(): void {
    if (!this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray);

    // Calculate RMS for volume
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = this.dataArray[i] / 255;
      sum += normalized * normalized;
    }
    const volume = Math.sqrt(sum / this.dataArray.length);

    const previousVolume = this.state.currentVolume;
    this.state.currentVolume = volume;

    // Emit volume change if significant
    if (Math.abs(volume - previousVolume) > 0.005) {
      this.emit('volume_change', { volume });
    }
  }

  /**
   * Handle speech start from Silero
   */
  private handleSpeechStart(): void {
    if (this.state.isSpeaking) return;

    this.state.isSpeaking = true;
    this.state.speechStartTime = Date.now();
    this.state.lastSpeechTime = Date.now();
    this.speechStartTimestamp = Date.now();

    console.log('[SileroVAD] Speech detected - start');
    this.emit('speech_start');
  }

  /**
   * Handle speech end from Silero
   */
  private handleSpeechEnd(audio: Float32Array): void {
    if (!this.state.isSpeaking) return;

    const duration = this.speechStartTimestamp
      ? Date.now() - this.speechStartTimestamp
      : 0;

    this.state.isSpeaking = false;
    this.state.speechStartTime = null;
    this.speechStartTimestamp = null;

    console.log('[SileroVAD] Speech ended - duration:', duration, 'ms, audio samples:', audio.length);
    this.emit('speech_end', { duration });
  }

  /**
   * Stop VAD and release resources
   */
  stop(): void {
    if (!this.state.isListening && !this.isInitialized) {
      return;
    }

    // Emit speech_end if still speaking
    if (this.state.isSpeaking) {
      const duration = this.speechStartTimestamp
        ? Date.now() - this.speechStartTimestamp
        : 0;
      this.state.isSpeaking = false;
      this.emit('speech_end', { duration });
    }

    this.cleanup();
    this.state.isListening = false;
    this.isInitialized = false;
    this.emit('listening_stop');

    console.log('[SileroVAD] Stopped');
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    // Stop volume monitoring
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Destroy Silero VAD
    if (this.vad) {
      try {
        this.vad.pause();
        // Note: vad-web doesn't have a destroy method, pause is sufficient
      } catch (e) {
        console.warn('[SileroVAD] Error during cleanup:', e);
      }
      this.vad = null;
    }

    this.analyser = null;
    this.dataArray = null;
    this.state.isCalibrating = false;
  }

  /**
   * Set threshold (maps to positiveSpeechThreshold for Silero)
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      console.warn('[SileroVAD] Threshold must be between 0 and 1');
      return;
    }
    this.config.positiveSpeechThreshold = threshold;
    this.config.negativeSpeechThreshold = threshold * 0.7; // Keep proportional
    this.state.adaptiveThreshold = threshold;
    console.log('[SileroVAD] Threshold updated to:', threshold);
  }

  /**
   * Get current configuration
   */
  getConfig(): SileroVADConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SileroVADConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[SileroVAD] Config updated:', this.config);
  }

  /**
   * Check if calibrating (loading model)
   */
  isCalibrating(): boolean {
    return this.state.isCalibrating;
  }

  /**
   * Get current threshold
   */
  getCurrentThreshold(): number {
    return this.state.adaptiveThreshold;
  }

  /**
   * Get noise floor estimate
   */
  getNoiseFloor(): number {
    return this.state.noiseFloor;
  }

  /**
   * Recalibrate (restart for Silero)
   */
  recalibrate(): void {
    if (this.state.isListening) {
      console.log('[SileroVAD] Recalibrating...');
      this.stop();
      this.start().catch(err => {
        console.error('[SileroVAD] Recalibration failed:', err);
      });
    }
  }

  /**
   * Get current state
   */
  getState(): SileroVADState {
    return { ...this.state };
  }

  /**
   * Register callback for event
   */
  on(event: SileroVADEvent, callback: SileroVADCallback): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event)!.add(callback);
  }

  /**
   * Remove callback for event
   */
  off(event: SileroVADEvent, callback?: SileroVADCallback): void {
    if (!this.callbacks.has(event)) return;

    if (callback) {
      this.callbacks.get(event)!.delete(callback);
    } else {
      this.callbacks.delete(event);
    }
  }

  /**
   * Emit event to all registered callbacks
   */
  private emit(event: SileroVADEvent, data?: {
    volume?: number;
    duration?: number;
    threshold?: number;
    noiseFloor?: number;
  }): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`[SileroVAD] Error in callback for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if browser supports Silero VAD
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for required APIs
    const hasMediaDevices = typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';

    const hasAudioContext = typeof AudioContext !== 'undefined' ||
      typeof (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext !== 'undefined';

    // Check for WebAssembly support (required for ONNX runtime)
    const hasWebAssembly = typeof WebAssembly !== 'undefined';

    return hasMediaDevices && hasAudioContext && hasWebAssembly;
  }

  /**
   * Dispose and release all resources
   */
  dispose(): void {
    this.stop();
    this.callbacks.clear();
  }
}

export default SileroVADWrapper;
