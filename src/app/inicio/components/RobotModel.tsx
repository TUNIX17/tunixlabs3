'use client';

import React, { useRef, useState, Suspense, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import { useRobotInteraction, RobotInteractionState } from '../../../hooks/useRobotInteraction';
import FloatingMicButton from '../../../components/VoiceInterface/FloatingMicButton';
import AudioVisualizer from '../../../components/VoiceInterface/AudioVisualizer';

// Importar sistema de animaciones unificado
import { useRobotAnimations } from '../../../lib/animation/useRobotAnimations';
import { AnimationState, easeInOutQuad } from '../../../lib/animation';

// Interfaz para los metodos imperativos del robot
interface RobotMethods {
  startWaving: () => void;
  approachCamera: () => void;
  stepBackward: () => void;
  danceMove: () => void;
  nodYes: () => void;
  shakeLegsTwist: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  startExcited: () => void;
  startConfused: () => void;
  startGoodbye: () => void;
}

// Componente que carga el modelo GLB y aplica animaciones
const AnimatedRobotModel = forwardRef<RobotMethods, { onLoad?: () => void; isListening?: boolean }>(
  function AnimatedRobotModel({ onLoad, isListening }, ref) {
    const gltf = useGLTF('/ROBOT2.glb');
    const modelRef = useRef<THREE.Group>(null);
    const { scene } = gltf;

    // Referencias para posicion de escena (approach/stepBack)
    const originalPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const approachTimerRef = useRef<NodeJS.Timeout | null>(null);
    const approachStartTimeRef = useRef<number>(0);

    // Estados locales para animaciones de posicion (no manejadas por el hook)
    const [isApproaching, setIsApproaching] = useState(false);
    const [isSteppingBack, setIsSteppingBack] = useState(false);

    // Usamos el valor de la prop si esta definido, o false por defecto
    const isListeningState = isListening !== undefined ? isListening : false;

    // Coordenadas del mouse (normalizadas)
    const mouse = useThree((state) => state.mouse);
    const targetMouse = useRef(new THREE.Vector2());

    // Hook de animaciones unificado
    const {
      startWaving: hookStartWaving,
      approachCamera: hookApproachCamera,
      stepBackward: hookStepBackward,
      danceMove: hookDanceMove,
      nodYes: hookNodYes,
      shakeLegsTwist: hookShakeLegsTwist,
      startThinking: hookStartThinking,
      stopThinking: hookStopThinking,
      startExcited: hookStartExcited,
      startConfused: hookStartConfused,
      startGoodbye: hookStartGoodbye,
      registerScene,
      update: updateAnimations,
      getState,
      machine,
    } = useRobotAnimations({
      onStateChange: (newState, prevState) => {
        console.log('[Animation] State transition:', prevState, '->', newState);
      },
      onAnimationComplete: (state) => {
        console.log('[Animation] Completed:', state);
      },
    });

    // Inicializacion de la escena
    React.useEffect(() => {
      if (scene && onLoad) {
        // Posicion ajustada para centrar en el circulo neumorfico
        scene.position.set(0, -0.8, 0);
        scene.rotation.set(0, 0, 0);

        // Guardar la posicion original para los movimientos de acercamiento
        originalPositionRef.current = scene.position.clone();

        // Registrar huesos en el sistema de animaciones
        registerScene(scene);

        onLoad();
      }
    }, [scene, onLoad, registerScene]);

    // Loop de animacion principal
    useFrame((state) => {
      // Optimizacion: Actualizar mouse solo si ha cambiado significativamente
      const mouseDelta = Math.abs(mouse.x - targetMouse.current.x) + Math.abs(mouse.y - targetMouse.current.y);
      if (mouseDelta > 0.001) {
        targetMouse.current.lerp(mouse, 0.1);
      }

      const time = state.clock.getElapsedTime();

      // Clamping del mouse para evitar rotaciones extremas al hacer scroll
      const mouseX = THREE.MathUtils.clamp(targetMouse.current.x, -1, 1);
      const mouseY = THREE.MathUtils.clamp(targetMouse.current.y, -1, 1);

      // Delegar toda la logica de animacion al hook unificado
      updateAnimations(time, mouseX, mouseY, isListeningState);

      // Animaciones de posicion (approach/stepBack) - manejadas localmente
      // El hook no maneja posicion de escena, solo rotaciones de huesos
      if (isApproaching && scene) {
        const approachElapsedTime = time - approachStartTimeRef.current;
        const approachDuration = 2.0;

        if (approachElapsedTime < approachDuration) {
          const targetZ = originalPositionRef.current.z + 1.5;
          const targetY = originalPositionRef.current.y + 0.3;

          const progress = Math.min(approachElapsedTime / approachDuration, 1);
          const easeProgress = easeInOutQuad(progress);

          scene.position.z = THREE.MathUtils.lerp(
            originalPositionRef.current.z,
            targetZ,
            easeProgress
          );

          scene.position.y = THREE.MathUtils.lerp(
            originalPositionRef.current.y,
            targetY,
            easeProgress
          );
        }
      } else if (isSteppingBack && scene) {
        const stepBackElapsedTime = time - approachStartTimeRef.current;
        const stepBackDuration = 1.8;

        if (stepBackElapsedTime < stepBackDuration) {
          const progress = Math.min(stepBackElapsedTime / stepBackDuration, 1);
          const easeProgress = easeInOutQuad(progress);

          scene.position.z = THREE.MathUtils.lerp(
            scene.position.z,
            originalPositionRef.current.z,
            easeProgress
          );

          scene.position.y = THREE.MathUtils.lerp(
            scene.position.y,
            originalPositionRef.current.y,
            easeProgress
          );
        }
      }
    });

    // Metodo para acercarse a la camara (combina hook + posicion)
    const approachCamera = useCallback(() => {
      if (approachTimerRef.current) {
        clearTimeout(approachTimerRef.current);
        approachTimerRef.current = null;
      }

      // Iniciar animacion de huesos via hook
      hookApproachCamera();

      // Iniciar animacion de posicion
      setIsApproaching(true);
      setIsSteppingBack(false);
      approachStartTimeRef.current = performance.now() / 1000;

      // Despues de un tiempo, iniciar el retroceso automatico
      approachTimerRef.current = setTimeout(() => {
        setIsApproaching(false);
        setIsSteppingBack(true);
        approachStartTimeRef.current = performance.now() / 1000;

        // Despues de completar el retroceso, detener la animacion
        setTimeout(() => {
          setIsSteppingBack(false);
          approachTimerRef.current = null;
        }, 2000);
      }, 3000);
    }, [hookApproachCamera]);

    // Metodo para regresar a la posicion original
    const stepBackward = useCallback(() => {
      if (approachTimerRef.current) {
        clearTimeout(approachTimerRef.current);
        approachTimerRef.current = null;
      }

      // Iniciar via hook
      hookStepBackward();

      setIsApproaching(false);
      setIsSteppingBack(true);
      approachStartTimeRef.current = performance.now() / 1000;

      approachTimerRef.current = setTimeout(() => {
        setIsSteppingBack(false);
        approachTimerRef.current = null;
      }, 2000);
    }, [hookStepBackward]);

    // Exponemos metodos a traves de la ref
    useImperativeHandle(ref, () => ({
      startWaving: hookStartWaving,
      approachCamera,
      stepBackward,
      danceMove: hookDanceMove,
      nodYes: hookNodYes,
      shakeLegsTwist: hookShakeLegsTwist,
      startThinking: hookStartThinking,
      stopThinking: hookStopThinking,
      startExcited: hookStartExcited,
      startConfused: hookStartConfused,
      startGoodbye: hookStartGoodbye,
    }), [
      hookStartWaving,
      approachCamera,
      stepBackward,
      hookDanceMove,
      hookNodYes,
      hookShakeLegsTwist,
      hookStartThinking,
      hookStopThinking,
      hookStartExcited,
      hookStartConfused,
      hookStartGoodbye,
    ]);

    // Limpiar timers en desmontaje
    React.useEffect(() => {
      return () => {
        if (approachTimerRef.current) clearTimeout(approachTimerRef.current);
      };
    }, []);

    return <primitive object={scene} ref={modelRef} />;
  }
);

// Componente de carga para mostrar mientras se carga el modelo
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 z-10 pointer-events-none">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-3 text-blue-600 dark:text-blue-400">Cargando robot...</p>
    </div>
  );
}

// Detectar idioma del navegador (soporta es, en)
const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'es';

  const browserLang = navigator.language || (navigator as any).userLanguage || 'es';
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Solo soportamos espanol e ingles
  return ['es', 'en'].includes(langCode) ? langCode : 'es';
};

function RobotInteractionManager() {
  const [isLoading, setIsLoading] = useState(true);
  const robotAnimatedRef = useRef<RobotMethods>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Detectar idioma del navegador una sola vez al montar
  const [browserLanguage] = useState<string>(() => getBrowserLanguage());

  useEffect(() => {
    setIsMounted(true);
    console.log('[RobotInteraction] Idioma del navegador detectado:', browserLanguage);
  }, [browserLanguage]);

  // Memoizar callbacks para evitar re-renders constantes
  const handleStateChange = useCallback((newState: RobotInteractionState) => {
    console.log('RobotInteractionState changed:', newState);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Error en useRobotInteraction desde el contenedor:', error);
  }, []);

  const handleLeadCaptured = useCallback(async (leadData: any) => {
    console.log('[Lead] Datos recibidos para guardar:', leadData);

    // Verificar si hay datos significativos (nombre, email, telefono o intereses)
    const hasInterests = leadData.interests?.length > 0 || leadData.interest?.length > 0;
    const hasSignificantData = leadData.name || leadData.email || leadData.phone || hasInterests;

    if (!hasSignificantData) {
      console.log('[Lead] Sin datos significativos, no se guarda');
      return;
    }

    try {
      // Normalizar el campo interest -> interests para la API
      const normalizedData = {
        ...leadData,
        interests: leadData.interests || leadData.interest || [],
        source: 'voice-agent'
      };
      // Eliminar el campo interest si existe (la API usa interests)
      delete normalizedData.interest;

      console.log('[Lead] Enviando a API:', normalizedData);

      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Lead] Guardado exitosamente:', data.leadId, data.isNew ? '(nuevo)' : '(actualizado)');
      } else {
        const errorText = await response.text();
        console.error('[Lead] Error al guardar:', response.status, errorText);
      }
    } catch (error) {
      console.error('[Lead] Error de red:', error);
    }
  }, []);

  const handleSessionEnd = useCallback(() => {
    console.log('[Session] Sesion de voz finalizada');
  }, []);

  const {
    interactionState,
    isRecording,
    assignRobotRef,
    startListening,
    stopListening,
    stopSpeaking,
  } = useRobotInteraction({
    initialLanguage: browserLanguage,
    robotSystemPrompt: undefined,
    onStateChange: handleStateChange,
    onError: handleError,
    onLeadCaptured: handleLeadCaptured,
    onSessionEnd: handleSessionEnd
  });

  useEffect(() => {
    if (robotAnimatedRef.current) {
      assignRobotRef(robotAnimatedRef.current);
    }
  }, [robotAnimatedRef, assignRobotRef, isLoading]);

  const handleModelLoaded = () => {
    setIsLoading(false);

    // Saludo automatico cuando termina de cargar
    // Usamos un pequeno delay para asegurar que todo este listo
    setTimeout(() => {
      if (robotAnimatedRef.current) {
        robotAnimatedRef.current.startWaving();
      }
    }, 500);
  };

  const handleMicButtonClick = () => {
    if (isLoading) return;
    if (interactionState === RobotInteractionState.PROCESSING) return;

    // Manejar LISTENING y LISTENING_ACTIVE - ambos deben detener la escucha
    if (interactionState === RobotInteractionState.LISTENING ||
        interactionState === RobotInteractionState.LISTENING_ACTIVE) {
      stopListening();
    } else if (interactionState === RobotInteractionState.SPEAKING) {
      // Si esta hablando, interrumpir y empezar a escuchar
      stopSpeaking();
      startListening();
    } else {
      // IDLE o ERROR - iniciar escucha
      startListening();
    }
  };

  if (!isMounted) {
    return <div className="h-full w-full flex items-center justify-center" style={{ minHeight: '420px' }} aria-hidden="true"><LoadingSpinner/></div>;
  }

  return (
    <div className="h-full w-full touch-none relative overflow-hidden bg-transparent pointer-events-auto" style={{ minHeight: 'min(420px, 85vw)' }}>
      {isLoading && <LoadingSpinner />}

      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <Canvas
          shadows
          className="overflow-visible"
          camera={{ position: [0, 0.5, 200], fov: 30 }}
          gl={{ alpha: true, antialias: true }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 5
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 10, 7]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0005}
          />
          <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={0.6} />
          <pointLight position={[0, 5, 5]} intensity={0.3} color="#61dbfb" />

          <Suspense fallback={null}>
            <AnimatedRobotModel
              onLoad={handleModelLoaded}
              isListening={interactionState === RobotInteractionState.LISTENING || interactionState === RobotInteractionState.LISTENING_ACTIVE}
              ref={robotAnimatedRef}
            />
            <Environment files="/potsdamer_platz_1k.hdr" />
            <ContactShadows
              position={[0, -1.51, 0]}
              opacity={0.6}
              scale={16}
              blur={1.0}
              far={6}
              resolution={1024}
              color="#000000"
            />
          </Suspense>
        </Canvas>

        {/* Bottom Section - Message + Mic Button in row */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Audio Visualizer - Above the row when listening */}
          {(interactionState === RobotInteractionState.LISTENING ||
            interactionState === RobotInteractionState.LISTENING_ACTIVE ||
            isRecording) && (
            <div className="mb-1">
              <AudioVisualizer width={140} height={25} barColor="var(--neu-primary)" />
            </div>
          )}

          {/* Row: Message + Mic Button */}
          <div className="flex items-center gap-3">
            {/* Message Badge - Left of mic */}
            <div
              className="neu-pressed rounded-xl px-4 py-2 text-center"
              style={{ pointerEvents: 'none' }}
            >
              <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                {interactionState === RobotInteractionState.IDLE && "Habla conmigo"}
                {interactionState === RobotInteractionState.LISTENING && "Te escucho..."}
                {interactionState === RobotInteractionState.LISTENING_ACTIVE && "Grabando..."}
                {interactionState === RobotInteractionState.PROCESSING && "Pensando..."}
                {interactionState === RobotInteractionState.SPEAKING && "Respondiendo..."}
                {interactionState === RobotInteractionState.ERROR && "Intenta de nuevo"}
              </p>
            </div>

            {/* Mic Button */}
            <FloatingMicButton
              onClick={handleMicButtonClick}
              interactionState={interactionState}
              isRecording={isRecording}
              disabled={isLoading || interactionState === RobotInteractionState.PROCESSING}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// Precargar el modelo
useGLTF.preload('/ROBOT2.glb');

export default RobotInteractionManager;
