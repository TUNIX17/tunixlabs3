export interface AudioData {
  blob: Blob;
  duration: number;
  url: string;
  mimeType: string;
}

export interface AudioVisualizerData {
  dataArray: Uint8Array;
  bufferLength: number;
  isActive: boolean;
}

export enum AudioRecordingStatus {
  INACTIVE = 'inactive',
  RECORDING = 'recording',
  PAUSED = 'paused',
  PROCESSING = 'processing',
  ERROR = 'error'
}

export enum AudioPlaybackStatus {
  INACTIVE = 'inactive',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended',
  ERROR = 'error'
}

export interface AudioRecordingState {
  status: AudioRecordingStatus;
  startTime: number | null;
  duration: number;
  blob: Blob | null;
  url: string | null;
  error: string | null;
}

export interface AudioPlaybackState {
  status: AudioPlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  error: string | null;
}

export interface SpeechRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  language?: string;
}

export interface SpeechRecognitionState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  finalTranscript: string;
  interimTranscript: string;
  confidence: number;
  language: string | null;
  error: string | null;
}

export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

export interface TextToSpeechResult {
  audioBlob: Blob;
  duration: number;
  language: string;
}

export interface TextToSpeechState {
  isGenerating: boolean;
  isCanceled: boolean;
  audioBlob: Blob | null;
  error: string | null;
} 