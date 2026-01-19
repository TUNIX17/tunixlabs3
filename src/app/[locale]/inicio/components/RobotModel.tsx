'use client';

import React, { useRef, useState, Suspense, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  useGLTF,
  Sky,
  useTexture,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { useTranslations } from 'next-intl';
import { useRobotInteraction, RobotInteractionState } from '../../../../hooks/useRobotInteraction';
import FloatingMicButton from '../../../../components/VoiceInterface/FloatingMicButton';
import AudioVisualizer from '../../../../components/VoiceInterface/AudioVisualizer';
import ActionButtons from '../../../../components/VoiceInterface/ActionButtons';
import TerminalLoading from '../../../../components/ui/TerminalLoading';

// Importar sistema de animaciones
import {
  presetToEulers,
  ARM_RESTING_ROTATIONS,
  LEG_RESTING_ROTATIONS,
  WAVE_ROTATIONS,
  NOD_YES_ROTATIONS,
  THINKING_ROTATIONS,
  DANCE_ROTATIONS,
  SHAKE_LEGS_ROTATIONS,
  APPROACH_ROTATIONS,
  EXCITED_ROTATIONS,
  CONFUSED_ROTATIONS,
  GOODBYE_ROTATIONS,
  ANIMATION_CONFIGS,
  IDLE_PARAMS,
  CURSOR_TRACKING,
} from '../../../../lib/animation';
import { easeInOutQuad, easeOutBack } from '../../../../lib/animation/easingFunctions';

// Definir tipo para arrays de rotación
type RotationArray = [number, number, number];

// Tipo para los huesos referenciados
type BoneRef = THREE.Object3D | null;

// Interfaz para los métodos imperativos del robot
interface RobotMethods {
  startWaving: () => void;
  approachCamera: () => void;
  stepBackward: () => void;
  danceMove: () => void;
  nodYes: () => void;
  shakeLegsTwist: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  // Nuevas animaciones de emoción
  startExcited: () => void;
  startConfused: () => void;
  startGoodbye: () => void;
}

// Componente que carga el modelo GLB y aplica animaciones
const AnimatedRobotModel = forwardRef<RobotMethods, { onLoad?: () => void; isListening?: boolean; interactionActive?: boolean }>(
  function AnimatedRobotModel({ onLoad, isListening, interactionActive }, ref) {
    const gltf = useGLTF('/ROBOT2.glb');
    const modelRef = useRef<THREE.Group>(null);
    const { scene } = gltf;

    // Estado para simular un saludo con el brazo
    const [isWaving, setIsWaving] = useState(false);
    // Estados para nuevas animaciones
    const [isApproaching, setIsApproaching] = useState(false);
    const [isSteppingBack, setIsSteppingBack] = useState(false);
    const [isDancing, setIsDancing] = useState(false);
    const [isNoddingYes, setIsNoddingYes] = useState(false);
    const [isShakingLegs, setIsShakingLegs] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    // Nuevos estados de animación
    const [isExcited, setIsExcited] = useState(false);
    const [isConfused, setIsConfused] = useState(false);
    const [isGoodbye, setIsGoodbye] = useState(false);

    // Flag para optimización: indica si alguna animación está activa
    const hasActiveAnimation = isWaving || isApproaching || isSteppingBack ||
                               isDancing || isNoddingYes || isShakingLegs || isThinking ||
                               isExcited || isConfused || isGoodbye;
    
    // Referencias para tiempos de inicio de animaciones
    const waveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const waveStartTimeRef = useRef<number>(0);
    const approachTimerRef = useRef<NodeJS.Timeout | null>(null);
    const approachStartTimeRef = useRef<number>(0);
    const originalPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const danceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const danceStartTimeRef = useRef<number>(0);
    const nodTimerRef = useRef<NodeJS.Timeout | null>(null);
    const nodStartTimeRef = useRef<number>(0);
    const shakeLegsTimerRef = useRef<NodeJS.Timeout | null>(null);
    const shakeLegsStartTimeRef = useRef<number>(0);
    const thinkingStartTimeRef = useRef<number>(0);
    // Nuevos timer refs
    const excitedTimerRef = useRef<NodeJS.Timeout | null>(null);
    const excitedStartTimeRef = useRef<number>(0);
    const confusedTimerRef = useRef<NodeJS.Timeout | null>(null);
    const confusedStartTimeRef = useRef<number>(0);
    const goodbyeTimerRef = useRef<NodeJS.Timeout | null>(null);
    const goodbyeStartTimeRef = useRef<number>(0);

    // Usamos el valor de la prop si está definido, o false por defecto
    const isListeningState = isListening !== undefined ? isListening : false;
    // Flag para saber si hay una interacción activa (micrófono encendido)
    const isInteractionActive = interactionActive !== undefined ? interactionActive : false;

    // Refs para los huesos que vamos a animar
    const headRef = useRef<BoneRef>(null);
    const neckRef = useRef<BoneRef>(null);
    const bodyTop1Ref = useRef<BoneRef>(null);
    const bodyTop2Ref = useRef<BoneRef>(null);
    // Refs para los brazos
    const shoulderLeftRef = useRef<BoneRef>(null);
    const shoulderRightRef = useRef<BoneRef>(null);
    const armLeftTopRef = useRef<BoneRef>(null);
    const armRightTopRef = useRef<BoneRef>(null);
    const armLeftBotRef = useRef<BoneRef>(null);
    const armRightBotRef = useRef<BoneRef>(null);
    // Refs para las piernas
    const legLeftTopRef = useRef<BoneRef>(null);
    const legRightTopRef = useRef<BoneRef>(null);
    const legLeftBotRef = useRef<BoneRef>(null);
    const legRightBotRef = useRef<BoneRef>(null);
    const legLeftFootRef = useRef<BoneRef>(null);
    const legRightFootRef = useRef<BoneRef>(null);

    // Refs para almacenar las rotaciones iniciales
    const initialRotations = useRef<{ [key: string]: THREE.Euler }>({});

    // Coordenadas del mouse (normalizadas)
    const mouse = useThree((state) => state.mouse);
    const targetMouse = useRef(new THREE.Vector2());

    // Rotaciones desde presets (convertidas a Euler una sola vez)
    const targetArmRestingRotations = React.useMemo(
      () => presetToEulers(ARM_RESTING_ROTATIONS),
      []
    );

    const targetLegRestingRotations = React.useMemo(
      () => presetToEulers(LEG_RESTING_ROTATIONS),
      []
    );

    const targetWaveRotations = React.useMemo(
      () => presetToEulers(WAVE_ROTATIONS),
      []
    );

    const targetNodYesRotations = React.useMemo(
      () => presetToEulers(NOD_YES_ROTATIONS),
      []
    );

    const targetDanceRotations = React.useMemo(
      () => presetToEulers(DANCE_ROTATIONS),
      []
    );

    const targetShakeLegsRotations = React.useMemo(
      () => presetToEulers(SHAKE_LEGS_ROTATIONS),
      []
    );

    // Rotaciones para animación "Thinking"
    const targetThinkingRotations = React.useMemo(
      () => presetToEulers(THINKING_ROTATIONS),
      []
    );

    // Rotaciones para animación "Approach"
    const targetApproachRotations = React.useMemo(
      () => presetToEulers(APPROACH_ROTATIONS),
      []
    );

    // Rotaciones para nuevas animaciones
    const targetExcitedRotations = React.useMemo(
      () => presetToEulers(EXCITED_ROTATIONS),
      []
    );

    const targetConfusedRotations = React.useMemo(
      () => presetToEulers(CONFUSED_ROTATIONS),
      []
    );

    const targetGoodbyeRotations = React.useMemo(
      () => presetToEulers(GOODBYE_ROTATIONS),
      []
    );

    React.useEffect(() => {
      if (scene && onLoad) {
        // Posición ajustada para centrar en el círculo neumórfico
        scene.position.set(0, -0.8, 0);
        scene.rotation.set(0, 0, 0);
        
        // Guardar la posición original para los movimientos de acercamiento
        originalPositionRef.current = scene.position.clone();

        const boneNames = [
          'head', 'neck', 'body_top1', 'body_top2',
          'shoulder_left', 'shoulder_right',
          'arm_left_top', 'arm_right_top',
          'arm_left_bot', 'arm_right_bot',
          'leg_left_top', 'leg_right_top',
          'leg_left_bot', 'leg_right_bot',
          'leg_left_foot', 'leg_right_foot'
        ];
        scene.traverse((object) => {
          if (object instanceof THREE.Bone && boneNames.includes(object.name)) {
            switch (object.name) {
              case 'head': headRef.current = object; break;
              case 'neck': neckRef.current = object; break;
              case 'body_top1': bodyTop1Ref.current = object; break;
              case 'body_top2': bodyTop2Ref.current = object; break;
              case 'shoulder_left': shoulderLeftRef.current = object; break;
              case 'shoulder_right': shoulderRightRef.current = object; break;
              case 'arm_left_top': armLeftTopRef.current = object; break;
              case 'arm_right_top': armRightTopRef.current = object; break;
              case 'arm_left_bot': armLeftBotRef.current = object; break;
              case 'arm_right_bot': armRightBotRef.current = object; break;
              case 'leg_left_top': legLeftTopRef.current = object; break;
              case 'leg_right_top': legRightTopRef.current = object; break;
              case 'leg_left_bot': legLeftBotRef.current = object; break;
              case 'leg_right_bot': legRightBotRef.current = object; break;
              case 'leg_left_foot': legLeftFootRef.current = object; break;
              case 'leg_right_foot': legRightFootRef.current = object; break;
            }
            initialRotations.current[object.name] = object.rotation.clone();
          }
        });
        
        onLoad();
      }
    }, [scene, onLoad]);

    useFrame((state, delta) => {
      // Durante interacción activa: animaciones de "escucha atenta" naturales
      // El robot muestra que está prestando atención con movimientos sutiles y orgánicos
      if (isInteractionActive) {
        const mouseX = THREE.MathUtils.clamp(mouse.x, -1, 1);
        const mouseY = THREE.MathUtils.clamp(mouse.y, -1, 1);
        const time = state.clock.getElapsedTime();

        // === PARÁMETROS DE ESCUCHA ATENTA ===
        // Lerp factor muy bajo para movimientos lentos y suaves
        const attentiveLerp = 0.02; // Muy lento - movimiento fluido
        const microLerp = 0.015; // Aún más lento para micro-movimientos

        // Micro-movimientos autónomos que simulan atención activa
        // Frecuencias muy bajas para evitar aspecto mecánico
        const attentiveNodFreq = 0.3; // Micro-asentimiento muy lento
        const attentiveTiltFreq = 0.15; // Inclinación aún más lenta

        // Amplitudes muy sutiles - casi imperceptibles pero dan vida
        const microNodAmplitude = 0.015; // Sutil movimiento vertical
        const microTiltAmplitude = 0.008; // Leve inclinación lateral

        // === CABEZA - ESCUCHA ATENTA ===
        if (headRef.current && initialRotations.current.head) {
          // Posición base: ligeramente inclinada hacia adelante (atención)
          const attentiveForwardTilt = 0.05; // Inclinación sutil hacia adelante

          // Micro-asentimiento muy sutil (como cuando escuchas y asientes ligeramente)
          const microNod = Math.sin(time * attentiveNodFreq) * microNodAmplitude;

          // Micro-inclinación lateral (como cuando lades la cabeza para escuchar mejor)
          const microTilt = Math.sin(time * attentiveTiltFreq) * microTiltAmplitude;

          // Cursor tracking MUY reducido - solo miradas ocasionales, no seguimiento constante
          const { sensitivityX, sensitivityY } = CURSOR_TRACKING.head;
          const reducedSensitivity = 0.3; // Solo 30% de sensibilidad normal

          // Target: posición base atenta + micro-movimientos + leve cursor influence
          const targetX = initialRotations.current.head.x + attentiveForwardTilt + microNod - (mouseY * sensitivityY * reducedSensitivity);
          const targetY = initialRotations.current.head.y + (mouseX * sensitivityX * reducedSensitivity);
          const targetZ = initialRotations.current.head.z + microTilt;

          // Aplicar con lerp muy suave para movimiento fluido
          headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetX, attentiveLerp);
          headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, attentiveLerp);
          headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetZ, microLerp);
        }

        // === CUELLO - COMPLEMENTA EL MOVIMIENTO DE CABEZA ===
        if (neckRef.current && initialRotations.current.neck) {
          // El cuello sigue ligeramente el movimiento, con delay natural
          const neckMicroNod = Math.sin((time - 0.2) * attentiveNodFreq) * (microNodAmplitude * 0.5);

          const targetNeckX = initialRotations.current.neck.x + neckMicroNod;
          const targetNeckY = initialRotations.current.neck.y + (mouseX * 0.02); // Muy sutil

          neckRef.current.rotation.x = THREE.MathUtils.lerp(neckRef.current.rotation.x, targetNeckX, microLerp);
          neckRef.current.rotation.y = THREE.MathUtils.lerp(neckRef.current.rotation.y, targetNeckY, microLerp);
        }

        // === RESPIRACIÓN SUTIL - INDICA QUE ESTÁ VIVO ===
        if (bodyTop1Ref.current && initialRotations.current.body_top1) {
          const breathAmplitude = 0.004; // Muy sutil
          const breathFreq = 0.6; // Respiración calmada
          const breathCycle = Math.sin(time * breathFreq) * breathAmplitude;

          bodyTop1Ref.current.rotation.x = THREE.MathUtils.lerp(
            bodyTop1Ref.current.rotation.x,
            initialRotations.current.body_top1.x + breathCycle,
            microLerp
          );
        }

        return; // Skip otras animaciones más complejas
      }

      // Optimización: Actualizar mouse solo si ha cambiado significativamente
      const mouseDelta = Math.abs(mouse.x - targetMouse.current.x) + Math.abs(mouse.y - targetMouse.current.y);
      if (mouseDelta > 0.001) {
        targetMouse.current.lerp(mouse, 0.1);
      }

      const time = state.clock.getElapsedTime();

      // Skip animaciones específicas si estamos en thinking (tiene prioridad sobre idle)
      const skipIdleAnimations = isThinking;

      // 1. Animación de Respiración Sutil en body_top1 (usando parámetros configurables)
      if (!skipIdleAnimations && bodyTop1Ref.current && initialRotations.current.body_top1) {
        const { frequency, amplitudeX, amplitudeY } = IDLE_PARAMS.breath;
        const breathCycle = Math.sin(time * frequency) * amplitudeX;
        bodyTop1Ref.current.rotation.x = initialRotations.current.body_top1.x + breathCycle;
        bodyTop1Ref.current.rotation.y = initialRotations.current.body_top1.y + Math.cos(time * (frequency * 0.7)) * amplitudeY;
      }

      // 2. Animación Idle Sutil para el Torso Superior (usando parámetros configurables)
      if (!skipIdleAnimations && bodyTop2Ref.current && initialRotations.current.body_top2) {
        const { frequencyX, frequencyZ, amplitudeX, amplitudeZ } = IDLE_PARAMS.bodySway;
        const idleSway = Math.sin(time * frequencyX) * amplitudeX;
        const idleTwist = Math.cos(time * frequencyZ) * amplitudeZ;

        // Guardar la rotación Y actual (que incluye el seguimiento del cursor)
        const currentRotationY = bodyTop2Ref.current.rotation.y;

        // Aplicar oscilaciones sutiles en X y Z
        bodyTop2Ref.current.rotation.x = initialRotations.current.body_top2.x + idleSway;
        bodyTop2Ref.current.rotation.z = initialRotations.current.body_top2.z + idleTwist;

        // Restaurar la rotación Y (para no interferir con el seguimiento del cursor)
        bodyTop2Ref.current.rotation.y = currentRotationY;
      }

      // 3. Seguimiento del Cursor con Cabeza, Cuello y Torso Superior
      // Skip si thinking está activo (tiene su propia animación de cabeza)
      if (!isThinking) {
        // Clamping del mouse para evitar rotaciones extremas al hacer scroll
        const mouseX = THREE.MathUtils.clamp(targetMouse.current.x, -1, 1);
        const mouseY = THREE.MathUtils.clamp(targetMouse.current.y, -1, 1);

        // Cursor tracking para cabeza - SIN efectos especiales de listening
        // El robot mantiene el mismo comportamiento en idle y listening
        if (headRef.current && initialRotations.current.head) {
          const { sensitivityX, sensitivityY, lerpFactor: headLerp } = CURSOR_TRACKING.head;
          const targetRotationY = initialRotations.current.head.y + mouseX * sensitivityX;
          const targetRotationX = initialRotations.current.head.x - mouseY * sensitivityY;
          const targetRotationZ = initialRotations.current.head.z;
          headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, headLerp);
          headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, headLerp);
          headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotationZ, headLerp);
        }

        if (neckRef.current && initialRotations.current.neck) {
          const { sensitivityX, sensitivityY, lerpFactor: neckLerp } = CURSOR_TRACKING.neck;
          const targetRotationY = initialRotations.current.neck.y + mouseX * sensitivityX;
          const targetRotationX = initialRotations.current.neck.x - mouseY * sensitivityY;
          const targetRotationZ = initialRotations.current.neck.z;
          neckRef.current.rotation.y = THREE.MathUtils.lerp(neckRef.current.rotation.y, targetRotationY, neckLerp);
          neckRef.current.rotation.x = THREE.MathUtils.lerp(neckRef.current.rotation.x, targetRotationX, neckLerp);
          neckRef.current.rotation.z = THREE.MathUtils.lerp(neckRef.current.rotation.z, targetRotationZ, neckLerp);
        }

        if (bodyTop2Ref.current && initialRotations.current.body_top2) {
          const { sensitivityX, lerpFactor: bodyLerp } = CURSOR_TRACKING.bodyTop2;
          const targetRotationY = initialRotations.current.body_top2.y + targetMouse.current.x * sensitivityX;
          bodyTop2Ref.current.rotation.y = THREE.MathUtils.lerp(bodyTop2Ref.current.rotation.y, targetRotationY, bodyLerp);
        }
      }

      // 4. Animación de Brazos
      const lerpFactor = ANIMATION_CONFIGS.idle.lerpFactor;

      if (isWaving) {
        // Tiempo transcurrido desde que empezó el saludo
        const waveElapsedTime = time - waveStartTimeRef.current;
        
        // Movimiento ondulatorio de la mano durante el saludo
        const waveOscillation = Math.sin(waveElapsedTime * 5) * 0.3; // Frecuencia rápida para el saludo
        
        // Modificar objetivos de rotación de brazo derecho para saludar
        if (shoulderRightRef.current && targetWaveRotations.shoulder_right) {
          shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.x, 
            targetWaveRotations.shoulder_right.x, 
            lerpFactor * 2  // Transición más rápida para el saludo
          );
          shoulderRightRef.current.rotation.y = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.y, 
            targetWaveRotations.shoulder_right.y, 
            lerpFactor * 2
          );
          shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.z, 
            targetWaveRotations.shoulder_right.z, 
            lerpFactor * 2
          );
        }
        
        if (armRightBotRef.current && targetWaveRotations.arm_right_bot) {
          // Aplicar oscilación al eje Z para el movimiento de saludo
          const waveRotationX = targetWaveRotations.arm_right_bot.x;
          const waveRotationZ = waveOscillation; // Movimiento ondulatorio para el saludo
          
          armRightBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armRightBotRef.current.rotation.x, 
            waveRotationX, 
            lerpFactor * 2
          );
          
          // Aplicar directamente la oscilación para el movimiento de saludo
          armRightBotRef.current.rotation.z = waveRotationZ;
        }
        
        // Hacemos que el torso se mueva ligeramente con el saludo
        if (bodyTop2Ref.current) {
          const waveBodyRotation = Math.sin(waveElapsedTime * 5) * 0.01;
          bodyTop2Ref.current.rotation.y += waveBodyRotation;
        }
      } else {
        // Si no está saludando, aplicar las rotaciones de reposo normales para el brazo derecho
        // Hombro Derecho
        if (shoulderRightRef.current && targetArmRestingRotations.shoulder_right) {
          shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(shoulderRightRef.current.rotation.x, targetArmRestingRotations.shoulder_right.x, lerpFactor);
          shoulderRightRef.current.rotation.y = THREE.MathUtils.lerp(shoulderRightRef.current.rotation.y, targetArmRestingRotations.shoulder_right.y, lerpFactor);
          shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(shoulderRightRef.current.rotation.z, targetArmRestingRotations.shoulder_right.z, lerpFactor);
        }
        
        // Brazo Superior Derecho
        if (armRightTopRef.current && targetArmRestingRotations.arm_right_top) {
          armRightTopRef.current.rotation.x = THREE.MathUtils.lerp(armRightTopRef.current.rotation.x, targetArmRestingRotations.arm_right_top.x, lerpFactor);
          armRightTopRef.current.rotation.y = THREE.MathUtils.lerp(armRightTopRef.current.rotation.y, targetArmRestingRotations.arm_right_top.y, lerpFactor);
          armRightTopRef.current.rotation.z = THREE.MathUtils.lerp(armRightTopRef.current.rotation.z, targetArmRestingRotations.arm_right_top.z, lerpFactor);
        }
        
        // Antebrazo Derecho
        if (armRightBotRef.current && targetArmRestingRotations.arm_right_bot) {
          armRightBotRef.current.rotation.x = THREE.MathUtils.lerp(armRightBotRef.current.rotation.x, targetArmRestingRotations.arm_right_bot.x, lerpFactor);
          armRightBotRef.current.rotation.y = THREE.MathUtils.lerp(armRightBotRef.current.rotation.y, targetArmRestingRotations.arm_right_bot.y, lerpFactor);
          armRightBotRef.current.rotation.z = THREE.MathUtils.lerp(armRightBotRef.current.rotation.z, targetArmRestingRotations.arm_right_bot.z, lerpFactor);
        }
      }

      // Siempre aplicar las rotaciones de reposo para el brazo izquierdo
      // Hombro Izquierdo
      if (shoulderLeftRef.current && targetArmRestingRotations.shoulder_left) {
        shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(shoulderLeftRef.current.rotation.x, targetArmRestingRotations.shoulder_left.x, lerpFactor);
        shoulderLeftRef.current.rotation.y = THREE.MathUtils.lerp(shoulderLeftRef.current.rotation.y, targetArmRestingRotations.shoulder_left.y, lerpFactor);
        shoulderLeftRef.current.rotation.z = THREE.MathUtils.lerp(shoulderLeftRef.current.rotation.z, targetArmRestingRotations.shoulder_left.z, lerpFactor);
      }
      // Brazo Superior Izquierdo
      if (armLeftTopRef.current && targetArmRestingRotations.arm_left_top) {
        armLeftTopRef.current.rotation.x = THREE.MathUtils.lerp(armLeftTopRef.current.rotation.x, targetArmRestingRotations.arm_left_top.x, lerpFactor);
        armLeftTopRef.current.rotation.y = THREE.MathUtils.lerp(armLeftTopRef.current.rotation.y, targetArmRestingRotations.arm_left_top.y, lerpFactor);
        armLeftTopRef.current.rotation.z = THREE.MathUtils.lerp(armLeftTopRef.current.rotation.z, targetArmRestingRotations.arm_left_top.z, lerpFactor);
      }
      // Antebrazo Izquierdo
      if (armLeftBotRef.current && targetArmRestingRotations.arm_left_bot) {
        armLeftBotRef.current.rotation.x = THREE.MathUtils.lerp(armLeftBotRef.current.rotation.x, targetArmRestingRotations.arm_left_bot.x, lerpFactor);
        armLeftBotRef.current.rotation.y = THREE.MathUtils.lerp(armLeftBotRef.current.rotation.y, targetArmRestingRotations.arm_left_bot.y, lerpFactor);
        armLeftBotRef.current.rotation.z = THREE.MathUtils.lerp(armLeftBotRef.current.rotation.z, targetArmRestingRotations.arm_left_bot.z, lerpFactor);
      }

      // 5. Animación de Piernas a Pose de Reposo y movimiento sutil
      // Pierna Izquierda (Superior)
      if (legLeftTopRef.current && targetLegRestingRotations.leg_left_top) {
        // Añadir un sutil movimiento de balanceo a las piernas
        const legSwayX = Math.sin(time * 0.4) * 0.02; // Movimiento más pronunciado
        const legSwayY = Math.cos(time * 0.3) * 0.01;
        
        legLeftTopRef.current.rotation.x = THREE.MathUtils.lerp(
          legLeftTopRef.current.rotation.x, 
          targetLegRestingRotations.leg_left_top.x + legSwayX, 
          lerpFactor
        );
        legLeftTopRef.current.rotation.y = THREE.MathUtils.lerp(
          legLeftTopRef.current.rotation.y,
          targetLegRestingRotations.leg_left_top.y + legSwayY, 
          lerpFactor
        );
        legLeftTopRef.current.rotation.z = THREE.MathUtils.lerp(
          legLeftTopRef.current.rotation.z, 
          targetLegRestingRotations.leg_left_top.z, 
          lerpFactor
        );
        
        // Aplicar movimiento inverso para la pierna derecha (para una animación complementaria)
        if (legRightTopRef.current && targetLegRestingRotations.leg_right_top) {
          legRightTopRef.current.rotation.x = THREE.MathUtils.lerp(
            legRightTopRef.current.rotation.x, 
            targetLegRestingRotations.leg_right_top.x - legSwayX, 
            lerpFactor
          );
          legRightTopRef.current.rotation.y = THREE.MathUtils.lerp(
            legRightTopRef.current.rotation.y, 
            targetLegRestingRotations.leg_right_top.y - legSwayY, 
            lerpFactor
          );
          legRightTopRef.current.rotation.z = THREE.MathUtils.lerp(
            legRightTopRef.current.rotation.z, 
            targetLegRestingRotations.leg_right_top.z, 
            lerpFactor
          );
        }
      }
      
      // Rodillas y pies - aplicar movimiento más sutil
      // Pierna Izquierda (Inferior/Rodilla)
      if (legLeftBotRef.current && targetLegRestingRotations.leg_left_bot) {
        const kneeSwayX = Math.sin(time * 0.4 + 0.2) * 0.015; // Ligero desfase para movimiento natural
        
        legLeftBotRef.current.rotation.x = THREE.MathUtils.lerp(
          legLeftBotRef.current.rotation.x, 
          targetLegRestingRotations.leg_left_bot.x + kneeSwayX, 
          lerpFactor
        );
        legLeftBotRef.current.rotation.y = THREE.MathUtils.lerp(
          legLeftBotRef.current.rotation.y, 
          targetLegRestingRotations.leg_left_bot.y, 
          lerpFactor
        );
        legLeftBotRef.current.rotation.z = THREE.MathUtils.lerp(
          legLeftBotRef.current.rotation.z, 
          targetLegRestingRotations.leg_left_bot.z, 
          lerpFactor
        );
        
        // Pierna Derecha (Inferior/Rodilla) con oscilación opuesta
        if (legRightBotRef.current && targetLegRestingRotations.leg_right_bot) {
          legRightBotRef.current.rotation.x = THREE.MathUtils.lerp(
            legRightBotRef.current.rotation.x, 
            targetLegRestingRotations.leg_right_bot.x - kneeSwayX, 
            lerpFactor
          );
          legRightBotRef.current.rotation.y = THREE.MathUtils.lerp(
            legRightBotRef.current.rotation.y, 
            targetLegRestingRotations.leg_right_bot.y, 
            lerpFactor
          );
          legRightBotRef.current.rotation.z = THREE.MathUtils.lerp(
            legRightBotRef.current.rotation.z, 
            targetLegRestingRotations.leg_right_bot.z, 
            lerpFactor
          );
        }
      }
      
      // Pies
      if (legLeftFootRef.current && targetLegRestingRotations.leg_left_foot) {
        const footSwayX = Math.sin(time * 0.4 + 0.4) * 0.01;
        
        legLeftFootRef.current.rotation.x = THREE.MathUtils.lerp(
          legLeftFootRef.current.rotation.x, 
          targetLegRestingRotations.leg_left_foot.x + footSwayX, 
          lerpFactor
        );
        legLeftFootRef.current.rotation.y = THREE.MathUtils.lerp(
          legLeftFootRef.current.rotation.y, 
          targetLegRestingRotations.leg_left_foot.y, 
          lerpFactor
        );
        legLeftFootRef.current.rotation.z = THREE.MathUtils.lerp(
          legLeftFootRef.current.rotation.z, 
          targetLegRestingRotations.leg_left_foot.z, 
          lerpFactor
        );
        
        if (legRightFootRef.current && targetLegRestingRotations.leg_right_foot) {
          legRightFootRef.current.rotation.x = THREE.MathUtils.lerp(
            legRightFootRef.current.rotation.x, 
            targetLegRestingRotations.leg_right_foot.x - footSwayX, 
            lerpFactor
          );
          legRightFootRef.current.rotation.y = THREE.MathUtils.lerp(
            legRightFootRef.current.rotation.y, 
            targetLegRestingRotations.leg_right_foot.y, 
            lerpFactor
          );
          legRightFootRef.current.rotation.z = THREE.MathUtils.lerp(
            legRightFootRef.current.rotation.z, 
            targetLegRestingRotations.leg_right_foot.z, 
            lerpFactor
          );
        }
      }

      // Añadir animación idle más visible en los hombros
      if (!isWaving && shoulderLeftRef.current && targetArmRestingRotations.shoulder_left) {
        // Aumentamos la amplitud del movimiento para hacerlo más visible
        const shoulderIdleX = Math.sin(time * 0.6) * 0.025;  // Triplicado
        const shoulderIdleY = Math.sin(time * 0.4) * 0.015;  // Triplicado
        
        // Aplicar movimiento sutil adicional a los hombros
        shoulderLeftRef.current.rotation.x += shoulderIdleX;
        shoulderLeftRef.current.rotation.y += shoulderIdleY;
        
        if (shoulderRightRef.current) {
          shoulderRightRef.current.rotation.x += shoulderIdleX;
          shoulderRightRef.current.rotation.y -= shoulderIdleY; // Invertido para simetría
        }
        
        // Añadir movimiento sutil a los codos para complementar el movimiento del hombro
        if (armLeftBotRef.current && armRightBotRef.current) {
          const elbowIdleX = Math.sin(time * 0.7) * 0.02;
          
          armLeftBotRef.current.rotation.x += elbowIdleX;
          armRightBotRef.current.rotation.x += elbowIdleX;
        }
      }

      // Nueva animación: Acercarse a la cámara
      if (isApproaching && scene) {
        const approachElapsedTime = time - approachStartTimeRef.current;
        const approachDuration = 2.0; // duración total en segundos
        
        // Fase de acercamiento (primeros 2 segundos)
        if (approachElapsedTime < approachDuration) {
          // Mover el robot hacia la cámara
          const targetZ = originalPositionRef.current.z + 1.5; // Acercarse 1.5 unidades
          const targetY = originalPositionRef.current.y + 0.3; // Subir ligeramente
          
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
          
          // Ligeramente inclinar el robot hacia adelante mientras se acerca
          if (bodyTop1Ref.current) {
            bodyTop1Ref.current.rotation.x = THREE.MathUtils.lerp(
              initialRotations.current.body_top1?.x || 0,
              initialRotations.current.body_top1?.x + 0.15, // inclinación ligera hacia adelante
              easeProgress
            );
          }
          
          // Mover los brazos a una postura más acogedora
          if (shoulderLeftRef.current && shoulderRightRef.current) {
            // Brazos más hacia adelante
            shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
              targetArmRestingRotations.shoulder_left.x,
              targetArmRestingRotations.shoulder_left.x + 0.4, // más adelante
              easeProgress
            );
            
            shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
              targetArmRestingRotations.shoulder_right.x,
              targetArmRestingRotations.shoulder_right.x + 0.4, // más adelante
              easeProgress
            );
          }
        } 
        // Mantener la posición por un momento antes de regresar
      } else if (isSteppingBack && scene) {
        // Animación para regresar a la posición original
        const stepBackElapsedTime = time - approachStartTimeRef.current;
        const stepBackDuration = 1.8; // duración para regresar (ligeramente más rápido)
        
        if (stepBackElapsedTime < stepBackDuration) {
          const progress = Math.min(stepBackElapsedTime / stepBackDuration, 1);
          const easeProgress = easeInOutQuad(progress);
          
          // Regresar a la posición original
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
          
          // Regresar la inclinación a la normal
          if (bodyTop1Ref.current && initialRotations.current.body_top1) {
            bodyTop1Ref.current.rotation.x = THREE.MathUtils.lerp(
              bodyTop1Ref.current.rotation.x,
              initialRotations.current.body_top1.x,
              easeProgress
            );
          }
          
          // Regresar brazos a posición normal
          if (shoulderLeftRef.current && shoulderRightRef.current) {
            shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
              shoulderLeftRef.current.rotation.x,
              targetArmRestingRotations.shoulder_left.x,
              easeProgress
            );
            
            shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
              shoulderRightRef.current.rotation.x,
              targetArmRestingRotations.shoulder_right.x,
              easeProgress
            );
          }
        }
      }

      // Nueva animación: Movimiento de asentimiento (Nod)
      if (isNoddingYes) {
        const nodElapsedTime = time - nodStartTimeRef.current;
        const nodDuration = 1.5; // Duración total de asentimiento
        
        if (nodElapsedTime < nodDuration) {
          // Crear un movimiento de asentimiento con oscilación
          const nodCycle = Math.sin(nodElapsedTime * 6) * 0.5; // Frecuencia más alta para cabeceo rápido
          
          // Aplicar a cabeza y cuello
          if (headRef.current && initialRotations.current.head) {
            // Oscilación para cabeceo "sí"
            const targetX = targetNodYesRotations.head.x + nodCycle;
            headRef.current.rotation.x = THREE.MathUtils.lerp(
              headRef.current.rotation.x,
              targetX,
              0.3 // Factor más alto para movimiento más ágil
            );
          }
          
          if (neckRef.current && initialRotations.current.neck) {
            const targetX = targetNodYesRotations.neck.x + (nodCycle * 0.6); // Menor amplitud en cuello
            neckRef.current.rotation.x = THREE.MathUtils.lerp(
              neckRef.current.rotation.x,
              targetX,
              0.3
            );
          }
        }
      }

      // Nueva animación: Baile simple
      if (isDancing) {
        const danceElapsedTime = time - danceStartTimeRef.current;
        const danceDuration = 3.0; // Duración total del baile
        
        if (danceElapsedTime < danceDuration) {
          // Crear oscilaciones para los diferentes componentes del baile
          const mainBeatCycle = Math.sin(danceElapsedTime * 5) * 0.7; // Ciclo principal más rápido
          const secondaryBeatCycle = Math.cos(danceElapsedTime * 3) * 0.5; // Ciclo secundario más lento
          
          // Aplicar movimiento al torso
          if (bodyTop1Ref.current) {
            bodyTop1Ref.current.rotation.z = targetDanceRotations.body_top1.z + (mainBeatCycle * 0.15);
            bodyTop1Ref.current.rotation.y = secondaryBeatCycle * 0.1; // Giro sutil
          }
          
          // Mover brazos rítmicamente
          if (shoulderLeftRef.current) {
            const danceShoulderZLeft = targetDanceRotations.shoulder_left.z + (mainBeatCycle * 0.2);
            shoulderLeftRef.current.rotation.z = THREE.MathUtils.lerp(
              shoulderLeftRef.current.rotation.z,
              danceShoulderZLeft,
              0.2
            );
            
            shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
              shoulderLeftRef.current.rotation.x,
              targetDanceRotations.shoulder_left.x + (secondaryBeatCycle * 0.15),
              0.2
            );
          }
          
          if (shoulderRightRef.current) {
            const danceShoulderZRight = targetDanceRotations.shoulder_right.z - (mainBeatCycle * 0.2); // Invertir para simetría
            shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(
              shoulderRightRef.current.rotation.z,
              danceShoulderZRight,
              0.2
            );
            
            shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
              shoulderRightRef.current.rotation.x,
              targetDanceRotations.shoulder_right.x - (secondaryBeatCycle * 0.15), // Invertir para simetría
              0.2
            );
          }
          
          // Mover codos con el ritmo
          if (armLeftBotRef.current && armRightBotRef.current) {
            armLeftBotRef.current.rotation.x = targetDanceRotations.arm_left_bot.x + (mainBeatCycle * 0.3);
            armRightBotRef.current.rotation.x = targetDanceRotations.arm_right_bot.x - (mainBeatCycle * 0.3); // Invertido
          }
          
          // Mover piernas alternando
          if (legLeftTopRef.current && legRightTopRef.current) {
            const leftLegY = targetDanceRotations.leg_left_top.x + (mainBeatCycle * 0.2);
            const rightLegY = targetDanceRotations.leg_right_top.x - (mainBeatCycle * 0.2); // Alternando
            
            legLeftTopRef.current.rotation.x = THREE.MathUtils.lerp(
              legLeftTopRef.current.rotation.x,
              leftLegY,
              0.15
            );
            
            legRightTopRef.current.rotation.x = THREE.MathUtils.lerp(
              legRightTopRef.current.rotation.x,
              rightLegY,
              0.15
            );
          }
        }
      }
      
      // Nueva animación: Agitar piernas
      if (isShakingLegs) {
        const shakeElapsedTime = time - shakeLegsStartTimeRef.current;
        const shakeDuration = 2.5; // Duración total
        
        if (shakeElapsedTime < shakeDuration) {
          // Crear oscilaciones para los diferentes componentes 
          const mainShakeCycle = Math.sin(shakeElapsedTime * 8) * 0.6; // Ciclo rápido para shake
          const secondaryShakeCycle = Math.cos(shakeElapsedTime * 5) * 0.4; // Ciclo secundario
          
          // Aplicar a piernas
          if (legLeftTopRef.current && legRightTopRef.current) {
            // Oscilar las rotaciones para crear el efecto de agitación
            legLeftTopRef.current.rotation.z = targetShakeLegsRotations.leg_left_top.z + (mainShakeCycle * 0.2);
            legRightTopRef.current.rotation.z = targetShakeLegsRotations.leg_right_top.z - (mainShakeCycle * 0.2);
            
            // Ligero movimiento adelante-atrás
            legLeftTopRef.current.rotation.x = targetShakeLegsRotations.leg_left_top.x + (secondaryShakeCycle * 0.15);
            legRightTopRef.current.rotation.x = targetShakeLegsRotations.leg_right_top.x - (secondaryShakeCycle * 0.15);
          }
          
          // Mover las rodillas (flexionar)
          if (legLeftBotRef.current && legRightBotRef.current) {
            legLeftBotRef.current.rotation.x = targetShakeLegsRotations.leg_left_bot.x + (mainShakeCycle * 0.3);
            legRightBotRef.current.rotation.x = targetShakeLegsRotations.leg_right_bot.x - (mainShakeCycle * 0.3);
            
            // Añadir rotación para el efecto "twist"
            legLeftBotRef.current.rotation.z = targetShakeLegsRotations.leg_left_bot.z + (secondaryShakeCycle * 0.2);
            legRightBotRef.current.rotation.z = targetShakeLegsRotations.leg_right_bot.z - (secondaryShakeCycle * 0.2);
          }
          
          // Mover los pies
          if (legLeftFootRef.current && legRightFootRef.current) {
            legLeftFootRef.current.rotation.x = targetShakeLegsRotations.leg_left_foot.x + (mainShakeCycle * 0.25);
            legRightFootRef.current.rotation.x = targetShakeLegsRotations.leg_right_foot.x - (mainShakeCycle * 0.25);
            
            // Rotación lateral de pies
            legLeftFootRef.current.rotation.y = targetShakeLegsRotations.leg_left_foot.y + (secondaryShakeCycle * 0.15);
            legRightFootRef.current.rotation.y = targetShakeLegsRotations.leg_right_foot.y - (secondaryShakeCycle * 0.15);
          }
          
          // Añadir ligero movimiento de torso para complementar
          if (bodyTop1Ref.current) {
            bodyTop1Ref.current.rotation.z = secondaryShakeCycle * 0.05;
          }
        }
      }

      // Nueva animación: Thinking (Pensando)
      if (isThinking) {
        const thinkingElapsedTime = time - thinkingStartTimeRef.current;
        const thinkingConfig = ANIMATION_CONFIGS.thinking;
        const oscillation = thinkingConfig.oscillation!;

        // Oscilación sutil para el efecto "pensando"
        const thinkCycle = Math.sin(thinkingElapsedTime * oscillation.frequency) * oscillation.amplitude;
        const secondaryCycle = Math.cos(thinkingElapsedTime * 0.5) * 0.05;

        // Cabeza ladeada mirando hacia arriba
        if (headRef.current && targetThinkingRotations.head) {
          headRef.current.rotation.x = THREE.MathUtils.lerp(
            headRef.current.rotation.x,
            targetThinkingRotations.head.x + thinkCycle,
            thinkingConfig.lerpFactor
          );
          headRef.current.rotation.y = THREE.MathUtils.lerp(
            headRef.current.rotation.y,
            targetThinkingRotations.head.y + secondaryCycle,
            thinkingConfig.lerpFactor
          );
          headRef.current.rotation.z = THREE.MathUtils.lerp(
            headRef.current.rotation.z,
            targetThinkingRotations.head.z,
            thinkingConfig.lerpFactor
          );
        }

        // Cuello acompaña el movimiento
        if (neckRef.current && targetThinkingRotations.neck) {
          neckRef.current.rotation.x = THREE.MathUtils.lerp(
            neckRef.current.rotation.x,
            targetThinkingRotations.neck.x + (thinkCycle * 0.5),
            thinkingConfig.lerpFactor
          );
          neckRef.current.rotation.y = THREE.MathUtils.lerp(
            neckRef.current.rotation.y,
            targetThinkingRotations.neck.y + (secondaryCycle * 0.5),
            thinkingConfig.lerpFactor
          );
        }

        // Brazo derecho en posición "mano en barbilla"
        if (shoulderRightRef.current && targetThinkingRotations.shoulder_right) {
          shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.x,
            targetThinkingRotations.shoulder_right.x,
            thinkingConfig.lerpFactor
          );
          shoulderRightRef.current.rotation.y = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.y,
            targetThinkingRotations.shoulder_right.y,
            thinkingConfig.lerpFactor
          );
          shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.z,
            targetThinkingRotations.shoulder_right.z,
            thinkingConfig.lerpFactor
          );
        }

        if (armRightBotRef.current && targetThinkingRotations.arm_right_bot) {
          armRightBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armRightBotRef.current.rotation.x,
            targetThinkingRotations.arm_right_bot.x + (thinkCycle * 0.2),
            thinkingConfig.lerpFactor
          );
        }

        // Brazo izquierdo cruzado
        if (shoulderLeftRef.current && targetThinkingRotations.shoulder_left) {
          shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.x,
            targetThinkingRotations.shoulder_left.x,
            thinkingConfig.lerpFactor
          );
          shoulderLeftRef.current.rotation.y = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.y,
            targetThinkingRotations.shoulder_left.y,
            thinkingConfig.lerpFactor
          );
          shoulderLeftRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.z,
            targetThinkingRotations.shoulder_left.z,
            thinkingConfig.lerpFactor
          );
        }

        if (armLeftBotRef.current && targetThinkingRotations.arm_left_bot) {
          armLeftBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armLeftBotRef.current.rotation.x,
            targetThinkingRotations.arm_left_bot.x,
            thinkingConfig.lerpFactor
          );
        }

        // Cuerpo ligeramente inclinado
        if (bodyTop1Ref.current && targetThinkingRotations.body_top1) {
          bodyTop1Ref.current.rotation.x = THREE.MathUtils.lerp(
            bodyTop1Ref.current.rotation.x,
            targetThinkingRotations.body_top1.x,
            thinkingConfig.lerpFactor
          );
          bodyTop1Ref.current.rotation.z = THREE.MathUtils.lerp(
            bodyTop1Ref.current.rotation.z,
            targetThinkingRotations.body_top1.z + (secondaryCycle * 0.3),
            thinkingConfig.lerpFactor
          );
        }
      }

      // Nueva animación: Excited (Emocionado)
      if (isExcited) {
        const excitedElapsedTime = time - excitedStartTimeRef.current;
        const excitedConfig = ANIMATION_CONFIGS.excited;
        const oscillation = excitedConfig.oscillation!;

        // Rebote energético y movimiento de celebración
        const bounce = Math.abs(Math.sin(excitedElapsedTime * oscillation.frequency)) * oscillation.amplitude;
        const wiggle = Math.sin(excitedElapsedTime * 6) * 0.15;

        // Cabeza con movimiento alegre
        if (headRef.current && targetExcitedRotations.head) {
          headRef.current.rotation.x = THREE.MathUtils.lerp(
            headRef.current.rotation.x,
            targetExcitedRotations.head.x + (bounce * 0.3),
            excitedConfig.lerpFactor
          );
          headRef.current.rotation.z = wiggle * 0.3;
        }

        // Cuerpo con rebote
        if (bodyTop1Ref.current && targetExcitedRotations.body_top1) {
          bodyTop1Ref.current.rotation.x = THREE.MathUtils.lerp(
            bodyTop1Ref.current.rotation.x,
            targetExcitedRotations.body_top1.x - (bounce * 0.2),
            excitedConfig.lerpFactor
          );
          bodyTop1Ref.current.rotation.y = wiggle * 0.2;
        }

        // Brazos arriba en celebración
        if (shoulderLeftRef.current && targetExcitedRotations.shoulder_left) {
          shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.x,
            targetExcitedRotations.shoulder_left.x + (bounce * 0.2),
            excitedConfig.lerpFactor
          );
          shoulderLeftRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.z,
            targetExcitedRotations.shoulder_left.z - (bounce * 0.4),
            excitedConfig.lerpFactor
          );
        }

        if (shoulderRightRef.current && targetExcitedRotations.shoulder_right) {
          shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.x,
            targetExcitedRotations.shoulder_right.x + (bounce * 0.2),
            excitedConfig.lerpFactor
          );
          shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.z,
            targetExcitedRotations.shoulder_right.z + (bounce * 0.4),
            excitedConfig.lerpFactor
          );
        }

        // Codos flexionados
        if (armLeftBotRef.current && targetExcitedRotations.arm_left_bot) {
          armLeftBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armLeftBotRef.current.rotation.x,
            targetExcitedRotations.arm_left_bot.x + (bounce * 0.3),
            excitedConfig.lerpFactor
          );
        }

        if (armRightBotRef.current && targetExcitedRotations.arm_right_bot) {
          armRightBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armRightBotRef.current.rotation.x,
            targetExcitedRotations.arm_right_bot.x - (bounce * 0.3),
            excitedConfig.lerpFactor
          );
        }
      }

      // Nueva animación: Confused (Confundido)
      if (isConfused) {
        const confusedElapsedTime = time - confusedStartTimeRef.current;
        const confusedConfig = ANIMATION_CONFIGS.confused;
        const oscillation = confusedConfig.oscillation!;

        const tilt = Math.sin(confusedElapsedTime * oscillation.frequency) * oscillation.amplitude;
        const shrug = Math.sin(confusedElapsedTime * 1.5) * 0.08;

        // Cabeza ladeada con expresión de duda
        if (headRef.current && targetConfusedRotations.head) {
          headRef.current.rotation.x = THREE.MathUtils.lerp(
            headRef.current.rotation.x,
            targetConfusedRotations.head.x,
            confusedConfig.lerpFactor
          );
          headRef.current.rotation.y = THREE.MathUtils.lerp(
            headRef.current.rotation.y,
            targetConfusedRotations.head.y + shrug,
            confusedConfig.lerpFactor
          );
          headRef.current.rotation.z = THREE.MathUtils.lerp(
            headRef.current.rotation.z,
            targetConfusedRotations.head.z + tilt,
            confusedConfig.lerpFactor
          );
        }

        if (neckRef.current && targetConfusedRotations.neck) {
          neckRef.current.rotation.z = THREE.MathUtils.lerp(
            neckRef.current.rotation.z,
            targetConfusedRotations.neck.z + (tilt * 0.5),
            confusedConfig.lerpFactor
          );
        }

        // Hombros encogiéndose
        if (shoulderLeftRef.current && targetConfusedRotations.shoulder_left) {
          shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.x,
            targetConfusedRotations.shoulder_left.x + shrug,
            confusedConfig.lerpFactor
          );
          shoulderLeftRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.z,
            targetConfusedRotations.shoulder_left.z + (shrug * 2),
            confusedConfig.lerpFactor
          );
        }

        if (shoulderRightRef.current && targetConfusedRotations.shoulder_right) {
          shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.x,
            targetConfusedRotations.shoulder_right.x + shrug,
            confusedConfig.lerpFactor
          );
          shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.z,
            targetConfusedRotations.shoulder_right.z - (shrug * 2),
            confusedConfig.lerpFactor
          );
        }

        // Brazos en posición de "no sé"
        if (armLeftBotRef.current && targetConfusedRotations.arm_left_bot) {
          armLeftBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armLeftBotRef.current.rotation.x,
            targetConfusedRotations.arm_left_bot.x,
            confusedConfig.lerpFactor
          );
          armLeftBotRef.current.rotation.z = THREE.MathUtils.lerp(
            armLeftBotRef.current.rotation.z,
            targetConfusedRotations.arm_left_bot.z + (shrug * 1.5),
            confusedConfig.lerpFactor
          );
        }

        if (armRightBotRef.current && targetConfusedRotations.arm_right_bot) {
          armRightBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armRightBotRef.current.rotation.x,
            targetConfusedRotations.arm_right_bot.x,
            confusedConfig.lerpFactor
          );
          armRightBotRef.current.rotation.z = THREE.MathUtils.lerp(
            armRightBotRef.current.rotation.z,
            targetConfusedRotations.arm_right_bot.z - (shrug * 1.5),
            confusedConfig.lerpFactor
          );
        }
      }

      // Nueva animación: Goodbye (Despedida)
      if (isGoodbye) {
        const goodbyeElapsedTime = time - goodbyeStartTimeRef.current;
        const goodbyeConfig = ANIMATION_CONFIGS.goodbye;
        const oscillation = goodbyeConfig.oscillation!;

        const wave = Math.sin(goodbyeElapsedTime * oscillation.frequency) * oscillation.amplitude;
        const nod = Math.sin(goodbyeElapsedTime * 2) * 0.08;

        // Cabeza asintiendo suavemente
        if (headRef.current && targetGoodbyeRotations.head) {
          headRef.current.rotation.x = THREE.MathUtils.lerp(
            headRef.current.rotation.x,
            targetGoodbyeRotations.head.x + nod,
            goodbyeConfig.lerpFactor
          );
        }

        if (neckRef.current && targetGoodbyeRotations.neck) {
          neckRef.current.rotation.x = THREE.MathUtils.lerp(
            neckRef.current.rotation.x,
            targetGoodbyeRotations.neck.x + (nod * 0.5),
            goodbyeConfig.lerpFactor
          );
        }

        // Cuerpo con ligera reverencia
        if (bodyTop1Ref.current && targetGoodbyeRotations.body_top1) {
          bodyTop1Ref.current.rotation.x = THREE.MathUtils.lerp(
            bodyTop1Ref.current.rotation.x,
            targetGoodbyeRotations.body_top1.x + (nod * 0.5),
            goodbyeConfig.lerpFactor
          );
        }

        // Brazo derecho despidiéndose
        if (shoulderRightRef.current && targetGoodbyeRotations.shoulder_right) {
          shoulderRightRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.x,
            targetGoodbyeRotations.shoulder_right.x,
            goodbyeConfig.lerpFactor
          );
          shoulderRightRef.current.rotation.y = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.y,
            targetGoodbyeRotations.shoulder_right.y + (wave * 0.3),
            goodbyeConfig.lerpFactor
          );
          shoulderRightRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderRightRef.current.rotation.z,
            targetGoodbyeRotations.shoulder_right.z,
            goodbyeConfig.lerpFactor
          );
        }

        if (armRightBotRef.current && targetGoodbyeRotations.arm_right_bot) {
          armRightBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armRightBotRef.current.rotation.x,
            targetGoodbyeRotations.arm_right_bot.x,
            goodbyeConfig.lerpFactor
          );
          // Movimiento de despedida con la mano
          armRightBotRef.current.rotation.z = wave;
        }

        // Brazo izquierdo relajado
        if (shoulderLeftRef.current && targetGoodbyeRotations.shoulder_left) {
          shoulderLeftRef.current.rotation.x = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.x,
            targetGoodbyeRotations.shoulder_left.x,
            goodbyeConfig.lerpFactor
          );
          shoulderLeftRef.current.rotation.z = THREE.MathUtils.lerp(
            shoulderLeftRef.current.rotation.z,
            targetGoodbyeRotations.shoulder_left.z,
            goodbyeConfig.lerpFactor
          );
        }

        if (armLeftBotRef.current && targetGoodbyeRotations.arm_left_bot) {
          armLeftBotRef.current.rotation.x = THREE.MathUtils.lerp(
            armLeftBotRef.current.rotation.x,
            targetGoodbyeRotations.arm_left_bot.x,
            goodbyeConfig.lerpFactor
          );
        }
      }

    });

    // Función de alivio (easing) para movimientos más naturales
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    // Método para iniciar el saludo
    const startWaving = () => {
      if (waveTimerRef.current) {
        clearTimeout(waveTimerRef.current);
      }
      
      setIsWaving(true);
      waveStartTimeRef.current = performance.now() / 1000; // Convertir a segundos para consistencia
      
      // Añadir inclinación sutil de la cabeza durante el saludo
      if (headRef.current && neckRef.current) {
        headRef.current.rotation.z = THREE.MathUtils.degToRad(5); // Ligera inclinación lateral
        neckRef.current.rotation.z = THREE.MathUtils.degToRad(3); // Inclinación complementaria
      }
      
      // Añadir movimiento sutil del torso
      if (bodyTop1Ref.current) {
        bodyTop1Ref.current.rotation.z = THREE.MathUtils.degToRad(2); // Ligero giro
      }
      
      // Detener el saludo después de 2.5 segundos
      waveTimerRef.current = setTimeout(() => {
        setIsWaving(false);
        
        // Restaurar posiciones originales
        if (headRef.current && neckRef.current && bodyTop1Ref.current) {
          headRef.current.rotation.z = initialRotations.current.head?.z || 0;
          neckRef.current.rotation.z = initialRotations.current.neck?.z || 0;
          bodyTop1Ref.current.rotation.z = initialRotations.current.body_top1?.z || 0;
        }
        
        waveTimerRef.current = null;
      }, 2500);
    };

    // Método para acercarse a la cámara
    const approachCamera = () => {
      if (approachTimerRef.current) {
        clearTimeout(approachTimerRef.current);
      }
      
      // Guardar tiempo de inicio y activar animación de acercamiento
      setIsApproaching(true);
      setIsSteppingBack(false); // Asegurar que no estemos retrocediendo
      approachStartTimeRef.current = performance.now() / 1000;
      
      // Añadir inclinación del cuerpo para un acercamiento más natural
      if (bodyTop1Ref.current && bodyTop2Ref.current) {
        // Basado en rig.txt - usar los ejes según la documentación
        bodyTop1Ref.current.rotation.x = THREE.MathUtils.degToRad(15); // Inclinación hacia adelante
        bodyTop2Ref.current.rotation.x = THREE.MathUtils.degToRad(5); // Ligera inclinación complementaria
      }

      if (headRef.current && neckRef.current) {
        // Inclinación ligeramente hacia el usuario
        headRef.current.rotation.x = THREE.MathUtils.degToRad(-15);
        neckRef.current.rotation.x = THREE.MathUtils.degToRad(-10);
      }
      
      // Animar brazos según rig.txt - abrir ligeramente en posición de bienvenida
      if (shoulderLeftRef.current && shoulderRightRef.current) {
        // Brazos ligeramente adelante y abiertos
        shoulderLeftRef.current.rotation.x = THREE.MathUtils.degToRad(20); // Hacia adelante
        shoulderLeftRef.current.rotation.y = THREE.MathUtils.degToRad(15); // Ligeramente separado
        shoulderLeftRef.current.rotation.z = THREE.MathUtils.degToRad(-130); // Posición óptima según rig.txt
        
        shoulderRightRef.current.rotation.x = THREE.MathUtils.degToRad(20); // Hacia adelante
        shoulderRightRef.current.rotation.y = THREE.MathUtils.degToRad(-15); // Ligeramente separado (simétrico)
        shoulderRightRef.current.rotation.z = THREE.MathUtils.degToRad(130); // Posición óptima según rig.txt
      }
      
      // Flexión de codos según rig.txt
      if (armLeftBotRef.current && armRightBotRef.current) {
        armLeftBotRef.current.rotation.x = THREE.MathUtils.degToRad(30); // Flexión de codo
        armRightBotRef.current.rotation.x = THREE.MathUtils.degToRad(30); // Flexión de codo
      }
      
      // Después de un tiempo, iniciar el retroceso
      approachTimerRef.current = setTimeout(() => {
        setIsApproaching(false);
        setIsSteppingBack(true);
        approachStartTimeRef.current = performance.now() / 1000;
        
        // Después de completar el retroceso, detener la animación
        setTimeout(() => {
          setIsSteppingBack(false);
          approachTimerRef.current = null;
        }, 2000);
      }, 3000); // Quedarse adelante por 3 segundos
    };

    // Método para regresar a la posición original
    const stepBackward = () => {
      if (approachTimerRef.current) {
        clearTimeout(approachTimerRef.current);
      }
      
      setIsApproaching(false);
      setIsSteppingBack(true);
      approachStartTimeRef.current = performance.now() / 1000;
      
      // Restaurar todas las rotaciones modificadas a sus valores originales
      if (headRef.current && neckRef.current && initialRotations.current.head && initialRotations.current.neck) {
        headRef.current.rotation.x = initialRotations.current.head.x;
        neckRef.current.rotation.x = initialRotations.current.neck.x;
      }
      
      if (bodyTop1Ref.current && bodyTop2Ref.current && initialRotations.current.body_top1 && initialRotations.current.body_top2) {
        bodyTop1Ref.current.rotation.x = initialRotations.current.body_top1.x;
        bodyTop2Ref.current.rotation.x = initialRotations.current.body_top2.x;
      }
      
      // Restaurar brazos y codos
      if (shoulderLeftRef.current && shoulderRightRef.current && 
          initialRotations.current.shoulder_left && initialRotations.current.shoulder_right) {
        
        shoulderLeftRef.current.rotation.x = initialRotations.current.shoulder_left.x;
        shoulderLeftRef.current.rotation.y = initialRotations.current.shoulder_left.y;
        shoulderLeftRef.current.rotation.z = initialRotations.current.shoulder_left.z;
        
        shoulderRightRef.current.rotation.x = initialRotations.current.shoulder_right.x;
        shoulderRightRef.current.rotation.y = initialRotations.current.shoulder_right.y;
        shoulderRightRef.current.rotation.z = initialRotations.current.shoulder_right.z;
      }
      
      if (armLeftBotRef.current && armRightBotRef.current && 
          initialRotations.current.arm_left_bot && initialRotations.current.arm_right_bot) {
        
        armLeftBotRef.current.rotation.x = initialRotations.current.arm_left_bot.x;
        armRightBotRef.current.rotation.x = initialRotations.current.arm_right_bot.x;
      }
      
      approachTimerRef.current = setTimeout(() => {
        setIsSteppingBack(false);
        approachTimerRef.current = null;
      }, 2000);
    };

    // Método para hacer un movimiento de baile
    const danceMove = () => {
      if (danceTimerRef.current) {
        clearTimeout(danceTimerRef.current);
      }
      
      setIsDancing(true);
      danceStartTimeRef.current = performance.now() / 1000;
      
      danceTimerRef.current = setTimeout(() => {
        setIsDancing(false);
        danceTimerRef.current = null;
      }, 3000);
    };

    // Método para asentir con la cabeza (decir "sí")
    const nodYes = () => {
      if (nodTimerRef.current) {
        clearTimeout(nodTimerRef.current);
      }
      
      setIsNoddingYes(true);
      nodStartTimeRef.current = performance.now() / 1000;
      
      nodTimerRef.current = setTimeout(() => {
        setIsNoddingYes(false);
        nodTimerRef.current = null;
      }, 1500);
    };

    // Método para agitar las piernas
    const shakeLegsTwist = () => {
      if (shakeLegsTimerRef.current) {
        clearTimeout(shakeLegsTimerRef.current);
      }

      setIsShakingLegs(true);
      shakeLegsStartTimeRef.current = performance.now() / 1000;

      shakeLegsTimerRef.current = setTimeout(() => {
        setIsShakingLegs(false);
        shakeLegsTimerRef.current = null;
      }, 2500);
    };

    // Método para iniciar animación de "pensando"
    const startThinking = () => {
      // Cancelar otras animaciones que podrían interferir
      if (isWaving) setIsWaving(false);
      if (isDancing) setIsDancing(false);
      if (isNoddingYes) setIsNoddingYes(false);

      setIsThinking(true);
      thinkingStartTimeRef.current = performance.now() / 1000;
    };

    // Método para detener animación de "pensando"
    const stopThinking = () => {
      setIsThinking(false);
    };

    // Método para iniciar animación de "emocionado"
    const startExcited = () => {
      if (excitedTimerRef.current) {
        clearTimeout(excitedTimerRef.current);
      }

      // Cancelar otras animaciones que podrían interferir
      if (isThinking) setIsThinking(false);
      if (isConfused) setIsConfused(false);

      setIsExcited(true);
      excitedStartTimeRef.current = performance.now() / 1000;

      excitedTimerRef.current = setTimeout(() => {
        setIsExcited(false);
        excitedTimerRef.current = null;
      }, ANIMATION_CONFIGS.excited.duration);
    };

    // Método para iniciar animación de "confundido"
    const startConfused = () => {
      if (confusedTimerRef.current) {
        clearTimeout(confusedTimerRef.current);
      }

      // Cancelar otras animaciones que podrían interferir
      if (isExcited) setIsExcited(false);

      setIsConfused(true);
      confusedStartTimeRef.current = performance.now() / 1000;

      confusedTimerRef.current = setTimeout(() => {
        setIsConfused(false);
        confusedTimerRef.current = null;
      }, ANIMATION_CONFIGS.confused.duration);
    };

    // Método para iniciar animación de "despedida"
    const startGoodbye = () => {
      if (goodbyeTimerRef.current) {
        clearTimeout(goodbyeTimerRef.current);
      }

      // Cancelar otras animaciones que podrían interferir
      if (isWaving) setIsWaving(false);
      if (isExcited) setIsExcited(false);

      setIsGoodbye(true);
      goodbyeStartTimeRef.current = performance.now() / 1000;

      goodbyeTimerRef.current = setTimeout(() => {
        setIsGoodbye(false);
        goodbyeTimerRef.current = null;
      }, ANIMATION_CONFIGS.goodbye.duration);
    };

    // Exponemos métodos a través de la ref usando useImperativeHandle
    useImperativeHandle(ref, () => ({
      startWaving,
      approachCamera,
      stepBackward,
      danceMove,
      nodYes,
      shakeLegsTwist,
      startThinking,
      stopThinking,
      // Nuevas animaciones
      startExcited,
      startConfused,
      startGoodbye,
    }));

    // Limpiar timers en desmontaje
    React.useEffect(() => {
      return () => {
        // Limpiar todos los timers al desmontar
        if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
        if (approachTimerRef.current) clearTimeout(approachTimerRef.current);
        if (danceTimerRef.current) clearTimeout(danceTimerRef.current);
        if (nodTimerRef.current) clearTimeout(nodTimerRef.current);
        if (shakeLegsTimerRef.current) clearTimeout(shakeLegsTimerRef.current);
        if (excitedTimerRef.current) clearTimeout(excitedTimerRef.current);
        if (confusedTimerRef.current) clearTimeout(confusedTimerRef.current);
        if (goodbyeTimerRef.current) clearTimeout(goodbyeTimerRef.current);
      };
    }, []);

    return <primitive object={scene} ref={modelRef} />;
  }
);

// Props del componente contenedor
interface RobotInteractionManagerProps {
  locale?: string;
}

// Componente contenedor
function RobotInteractionManager({ locale = 'es' }: RobotInteractionManagerProps) {
  const t = useTranslations('VoiceInterface');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [robotReady, setRobotReady] = useState(false);
  const robotAnimatedRef = useRef<RobotMethods>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    interactionState,
    userMessage,
    robotResponse,
    currentLanguage,
    isRecording,
    assignRobotRef,
    startListening,
    stopListening,
    sendTextMessage,
    stopSpeaking,
    setCurrentLanguage,
  } = useRobotInteraction({
    initialLanguage: locale, // Usar el locale de la página
    robotSystemPrompt: undefined,
    onStateChange: (newState) => {
      console.log('RobotInteractionState changed:', newState);
    },
    onError: (error) => {
      console.error('Error en useRobotInteraction desde el contenedor:', error);
    }
  });

  useEffect(() => {
    if (robotAnimatedRef.current) {
      assignRobotRef(robotAnimatedRef.current);
    }
  }, [robotAnimatedRef, assignRobotRef, isModelLoaded]);

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
  };

  // Called when terminal animation completes and fades out
  const handleTerminalComplete = () => {
    setShowTerminal(false);
    setRobotReady(true);

    // Saludo automatico cuando el robot aparece
    setTimeout(() => {
      if (robotAnimatedRef.current) {
        robotAnimatedRef.current.startWaving();
      }
    }, 300);
  };

  const handleMicButtonClick = () => {
    if (!robotReady) return;
    if (interactionState === RobotInteractionState.PROCESSING) return;

    if (interactionState === RobotInteractionState.LISTENING) {
      stopListening();
    } else {
      if (interactionState === RobotInteractionState.SPEAKING) {
        stopSpeaking();
      }
      startListening();
    }
  };

  if (!isMounted) {
    return (
      <div
        className="h-full w-full flex items-center justify-center relative"
        style={{ minHeight: '420px' }}
        aria-hidden="true"
      >
        <TerminalLoading isModelLoaded={false} />
      </div>
    );
  }

  return (
    <div className="h-full w-full touch-none relative overflow-hidden bg-transparent pointer-events-auto" style={{ minHeight: 'min(420px, 85vw)' }}>
      {/* Terminal Loading - shows while model loads, fades out when ready */}
      {showTerminal && (
        <TerminalLoading
          isModelLoaded={isModelLoaded}
          onComplete={handleTerminalComplete}
        />
      )}

      {/* Robot Canvas with fade-in transition */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ${
          robotReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
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
              isListening={interactionState === RobotInteractionState.LISTENING}
              interactionActive={interactionState !== RobotInteractionState.IDLE}
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

        {/* Bottom Section - Message + Mic Button in row (hidden during terminal) */}
        <div
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-all duration-500 ${
            robotReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          style={{ pointerEvents: robotReady ? 'auto' : 'none' }}
        >
          {/* Audio Visualizer - Above the row when listening */}
          {(interactionState === RobotInteractionState.LISTENING || isRecording) && (
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
                {interactionState === RobotInteractionState.IDLE && t('talkToMe')}
                {interactionState === RobotInteractionState.LISTENING && t('listening')}
                {interactionState === RobotInteractionState.PROCESSING && t('thinking')}
                {interactionState === RobotInteractionState.SPEAKING && t('responding')}
                {interactionState === RobotInteractionState.ERROR && t('tryAgain')}
              </p>
            </div>

            {/* Mic Button */}
            <FloatingMicButton
              onClick={handleMicButtonClick}
              interactionState={interactionState}
              isRecording={isRecording}
              disabled={!robotReady || interactionState === RobotInteractionState.PROCESSING}
            />
          </div>

          {/* Action Buttons - appear when robot mentions Calendly or WhatsApp */}
          {robotResponse && (
            <ActionButtons
              robotResponse={robotResponse}
              className="mt-3"
            />
          )}
        </div>

      </div>
    </div>
  );
}

// Precargar el modelo
useGLTF.preload('/ROBOT2.glb');

export default RobotInteractionManager;