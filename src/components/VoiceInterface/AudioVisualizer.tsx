import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  width?: number;
  height?: number;
  barColor?: string;
  barCount?: number;
  barSpacing?: number;
  barMinHeight?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  width = 300,
  height = 60,
  barColor = '#4F46E5',
  barCount = 50,
  barSpacing = 2,
  barMinHeight = 3
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Inicializar el visualizador
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    
    const initializeVisualizer = async () => {
      try {
        // Solicitar acceso al micrófono
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        // Crear contexto de audio
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // Crear analizador
        analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        
        // Configurar analizador para visualización de tiempo
        analyser.fftSize = 256;
        
        // Conectar la fuente de audio
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        // Marcar como inicializado
        setIsInitialized(true);
        
        // Iniciar animación
        drawVisualizer();
      } catch (error) {
        console.error('Error al inicializar el visualizador de audio:', error);
      }
    };
    
    // Dibujar el visualizador en cada frame
    const drawVisualizer = () => {
      if (!canvasRef.current || !analyserRef.current) {
        return;
      }
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return;
      }
      
      // Obtener datos de audio
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calcular ancho de barras
      const barWidth = (width - barSpacing * barCount) / barCount;
      
      // Dibujar barras
      let x = 0;
      for (let i = 0; i < barCount; i++) {
        // Tomar muestras del espectro de frecuencias espaciadas uniformemente
        const index = Math.floor(i * (bufferLength / barCount));
        
        // Calcular altura de barra normalizada
        const value = dataArray[index] / 255.0;
        const barHeight = Math.max(value * height, barMinHeight);
        
        // Dibujar barra
        ctx.fillStyle = barColor;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        // Avanzar posición x
        x += barWidth + barSpacing;
      }
      
      // Solicitar siguiente frame
      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };
    
    initializeVisualizer();
    
    // Limpiar recursos
    return () => {
      // Detener animación
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Detener micrófono
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Cerrar contexto de audio
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [barColor, barCount, barMinHeight, barSpacing, height, width]);
  
  return (
    <div className="audio-visualizer">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto bg-transparent rounded-lg"
      />
      
      {!isInitialized && (
        <div className="loading-indicator text-center text-sm text-gray-500 mt-2">
          Inicializando...
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer; 