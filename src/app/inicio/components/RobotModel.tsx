'use client';

import React, { useRef, useState, Suspense, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';

// Definir tipo para arrays de rotación
type RotationArray = [number, number, number];

// Tipo para los huesos referenciados
type BoneRef = THREE.Object3D | null;

// Interfaz para los métodos imperativos del robot
interface RobotMethods {
  startWaving: () => void;
}

// Componente que carga el modelo GLB y aplica animaciones
const AnimatedRobotModel = forwardRef<RobotMethods, { onLoad?: () => void; isListening?: boolean }>(
  function AnimatedRobotModel({ onLoad, isListening }, ref) {
    const gltf = useGLTF('/ROBOT2.glb');
    const modelRef = useRef<THREE.Group>(null);
    const { scene } = gltf;

    // Estado para simular un saludo con el brazo
    const [isWaving, setIsWaving] = useState(false);
    const waveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const waveStartTimeRef = useRef<number>(0);

    // Usamos el valor de la prop si está definido, o false por defecto
    const isListeningState = isListening !== undefined ? isListening : false;

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

    // Rotaciones objetivo para la pose de reposo de los brazos (en radianes)
    // Ronda 10 de prueba: Pose de reposo completa con X,Y en hombros y flexión de codo.
    const targetArmRestingRotations = {
      shoulder_left: new THREE.Euler(
        THREE.MathUtils.degToRad(10),    // Ligeramente adelante
        THREE.MathUtils.degToRad(10),    // Ligeramente separado
        THREE.MathUtils.degToRad(-160)   // Brazos abajo
      ),
      shoulder_right: new THREE.Euler(
        THREE.MathUtils.degToRad(10),    // Ligeramente adelante
        THREE.MathUtils.degToRad(-10),   // Ligeramente separado (simétrico)
        THREE.MathUtils.degToRad(160)    // Brazos abajo (simétrico)
      ),
      arm_left_top: new THREE.Euler(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      arm_right_top: new THREE.Euler(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      arm_left_bot: new THREE.Euler(
        THREE.MathUtils.degToRad(25),    // Flexión de codo aumentada ligeramente
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      arm_right_bot: new THREE.Euler(
        THREE.MathUtils.degToRad(25),    // Flexión de codo aumentada ligeramente
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
    };

    // Rotaciones objetivo para la pose de reposo de las piernas
    const targetLegRestingRotations = {
      leg_left_top: new THREE.Euler(
        THREE.MathUtils.degToRad(5),     // Ligera rotación hacia adelante
        THREE.MathUtils.degToRad(2),     // Ligera separación
        THREE.MathUtils.degToRad(-180)   // Piernas abajo (basado en rig.txt)
      ),
      leg_right_top: new THREE.Euler(
        THREE.MathUtils.degToRad(5),     // Ligera rotación hacia adelante (simétrico)
        THREE.MathUtils.degToRad(-2),    // Ligera separación (simétrico)
        THREE.MathUtils.degToRad(-180)   // Piernas abajo (basado en rig.txt)
      ),
      leg_left_bot: new THREE.Euler(
        THREE.MathUtils.degToRad(10),    // Flexión en la rodilla
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      leg_right_bot: new THREE.Euler(
        THREE.MathUtils.degToRad(10),    // Flexión en la rodilla (simétrico)
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      leg_left_foot: new THREE.Euler(
        THREE.MathUtils.degToRad(-5),    // Ligera flexión del pie hacia abajo
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      leg_right_foot: new THREE.Euler(
        THREE.MathUtils.degToRad(-5),    // Ligera flexión del pie hacia abajo (simétrico)
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
    };

    // Definir rotaciones objetivo para el saludo con la mano
    const targetWaveRotations = {
      shoulder_right: new THREE.Euler(
        THREE.MathUtils.degToRad(-30),    // Brazo elevado al frente
        THREE.MathUtils.degToRad(-20),    // Ligeramente separado
        THREE.MathUtils.degToRad(40)      // Parcialmente elevado (desde abajo)
      ),
      arm_right_top: new THREE.Euler(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
      arm_right_bot: new THREE.Euler(
        THREE.MathUtils.degToRad(70),     // Codo muy flexionado para saludar
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(0)
      ),
    };

    React.useEffect(() => {
      if (scene && onLoad) {
        scene.position.set(0, -1.5, 0);
        scene.rotation.set(0, 0, 0);

        console.log("--- Lista de Huesos del Modelo ROBOT2.glb ---");
        scene.traverse((object) => {
          if (object instanceof THREE.Bone) {
            console.log(`Hueso: ${object.name}, Padre: ${object.parent ? object.parent.name : 'N/A'}`);
          }
        });
        console.log("---------------------------------------------");

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
      targetMouse.current.lerp(mouse, 0.1);
      const time = state.clock.getElapsedTime();

      // 1. Animación de Respiración Sutil en body_top1
      if (bodyTop1Ref.current && initialRotations.current.body_top1) {
        const breathCycle = Math.sin(time * 0.7) * 0.01;
        bodyTop1Ref.current.rotation.x = initialRotations.current.body_top1.x + breathCycle;
        bodyTop1Ref.current.rotation.y = initialRotations.current.body_top1.y + Math.cos(time * 0.5) * 0.005;
      }

      // 2. Animación Idle Sutil para el Torso Superior
      if (bodyTop2Ref.current && initialRotations.current.body_top2) {
        const idleSway = Math.sin(time * 0.3) * 0.005; // Oscilación sutil en eje X
        const idleTwist = Math.cos(time * 0.2) * 0.003; // Oscilación sutil en eje Z
        
        // Guardar la rotación Y actual (que incluye el seguimiento del cursor)
        const currentRotationY = bodyTop2Ref.current.rotation.y;
        
        // Aplicar oscilaciones sutiles en X y Z
        bodyTop2Ref.current.rotation.x = initialRotations.current.body_top2.x + idleSway;
        bodyTop2Ref.current.rotation.z = initialRotations.current.body_top2.z + idleTwist;
        
        // Restaurar la rotación Y (para no interferir con el seguimiento del cursor)
        bodyTop2Ref.current.rotation.y = currentRotationY;
      }

      // 3. Seguimiento del Cursor con Cabeza, Cuello y Torso Superior
      const mouseX = targetMouse.current.x;
      const mouseY = targetMouse.current.y;

      // Factores adicionales para la animación de "escuchar"
      const listeningHeadTilt = isListeningState ? Math.sin(time * 1.5) * 0.05 : 0; // Inclinación lateral (eje Z)
      const listeningNeckTilt = isListeningState ? Math.sin(time * 1.5) * 0.03 : 0; // Inclinación lateral (eje Z)

      if (headRef.current && initialRotations.current.head) {
        const targetRotationY = initialRotations.current.head.y + mouseX * 0.5;
        const targetRotationX = initialRotations.current.head.x - mouseY * 0.3;
        const targetRotationZ = initialRotations.current.head.z + listeningHeadTilt;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.05);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, 0.05);
        headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotationZ, 0.05);
      }

      if (neckRef.current && initialRotations.current.neck) {
        const targetRotationY = initialRotations.current.neck.y + mouseX * 0.3;
        const targetRotationX = initialRotations.current.neck.x - mouseY * 0.15;
        const targetRotationZ = initialRotations.current.neck.z + listeningNeckTilt;
        neckRef.current.rotation.y = THREE.MathUtils.lerp(neckRef.current.rotation.y, targetRotationY, 0.07);
        neckRef.current.rotation.x = THREE.MathUtils.lerp(neckRef.current.rotation.x, targetRotationX, 0.07);
        neckRef.current.rotation.z = THREE.MathUtils.lerp(neckRef.current.rotation.z, targetRotationZ, 0.07);
      }

      if (bodyTop2Ref.current && initialRotations.current.body_top2) {
        const targetRotationY = initialRotations.current.body_top2.y + mouseX * 0.1;
        bodyTop2Ref.current.rotation.y = THREE.MathUtils.lerp(bodyTop2Ref.current.rotation.y, targetRotationY, 0.09);
      }

      // 4. Animación de Brazos 
      const lerpFactor = 0.05; // Suavidad de la transición a la pose de reposo

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

    });

    // Método para iniciar el saludo
    const startWaving = () => {
      if (waveTimerRef.current) {
        clearTimeout(waveTimerRef.current);
      }
      
      setIsWaving(true);
      waveStartTimeRef.current = performance.now() / 1000; // Convertir a segundos para consistencia
      
      // Detener el saludo después de 2.5 segundos
      waveTimerRef.current = setTimeout(() => {
        setIsWaving(false);
        waveTimerRef.current = null;
      }, 2500);
    };

    // Exponemos métodos a través de la ref usando useImperativeHandle
    useImperativeHandle(ref, () => ({
      startWaving
    }));

    // Limpiar timers en desmontaje
    React.useEffect(() => {
      return () => {
        if (waveTimerRef.current) {
          clearTimeout(waveTimerRef.current);
        }
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

// Componente contenedor
function RobotModel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRobotListening, setIsRobotListening] = useState(false);
  const robotRef = useRef<RobotMethods>(null);
  const currentMouseRef = useRef({ x: 0, y: 0 });

  const handleModelLoaded = () => {
    setIsLoading(false);
  };

  // Método para hacer que el robot salude
  const handleWave = () => {
    if (robotRef.current) {
      robotRef.current.startWaving();
    }
  };

  // Método para activar/desactivar el modo escucha
  const toggleListening = () => {
    setIsRobotListening(!isRobotListening);
  };

  const handlePointerMove = (event: any) => {
    // No necesitamos actualizar currentMouseRef aquí ya que useThree().mouse lo hace automáticamente
    // Pero lo mantenemos por si se necesita para lógica fuera de useFrame en el futuro.
    // Las coordenadas ya están normalizadas por useThree().mouse
  };

  return (
    <div className="h-[450px] w-full touch-none relative overflow-visible">
      {isLoading && <LoadingSpinner />}

      <Canvas 
        shadows 
        className="overflow-visible" 
        camera={{ position: [0, 0.5, 270], fov: 35 }}
        onPointerMove={handlePointerMove}
      >
        <color attach="background" args={['transparent']} />
        {/* Iluminación mejorada */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={1.5}
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
        <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={0.8} />
        
        <Suspense fallback={null}>
          <AnimatedRobotModel 
            onLoad={handleModelLoaded} 
            isListening={isRobotListening}
            ref={robotRef}
          />
          <Environment files="/potsdamer_platz_1k.hdr" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.45}
            scale={20}
            blur={1.5}
            far={9}
            resolution={512}
          />
        </Suspense>
      </Canvas>

      {/* Controles de demostración - Solo para propósitos de prueba, eliminar en producción */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          onClick={handleWave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Saludar
        </button>
        <button 
          onClick={toggleListening}
          className={`font-bold py-2 px-4 rounded ${isRobotListening ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
        >
          {isRobotListening ? 'Escuchando' : 'Escuchar'}
        </button>
      </div>
    </div>
  );
}

// Precargar el modelo
useGLTF.preload('/ROBOT2.glb');

export default RobotModel; 