'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  useGLTF,
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';

// Definir tipo para arrays de rotación
type RotationArray = [number, number, number];

// Componente que carga y anima el modelo GLB
function GLBRobotModel({ onLoad }: { onLoad?: () => void }) {
  // Cargar el modelo GLB
  const gltf = useGLTF('/ROBOT1.glb');
  const modelRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const leftArmRef = useRef<THREE.Object3D | null>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const leftEyeRef = useRef<THREE.Object3D | null>(null);
  const rightEyeRef = useRef<THREE.Object3D | null>(null);
  const bodyRef = useRef<THREE.Object3D | null>(null);

  // Estado para guardar la posición del cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Estado para controlar el efecto de salir del recuadro
  const [isOutside, setIsOutside] = useState(false);
  
  // Estado para controlar la animación actual
  const [animation, setAnimation] = useState<'idle' | 'wave' | 'follow'>('idle');
  const animationTimeRef = useRef(0);
  
  // Referencia para el brillo de los ojos
  const eyeGlowMaterial = useRef<THREE.MeshStandardMaterial | null>(null);
  
  // Obtener el viewport para cálculos de posición
  const { viewport } = useThree();

  // Identificar y referenciar las partes del modelo cuando se carga
  useEffect(() => {
    if (!modelRef.current || !gltf.scene) return;
    
    // Clone el modelo para no modificar el original
    const model = gltf.scene.clone();
    
    // Limpiar el grupo actual
    while (modelRef.current.children.length > 0) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    
    // Añadir el modelo clonado
    modelRef.current.add(model);
    
    // Recorrer la jerarquía para encontrar las partes por nombres o posiciones
    model.traverse((object) => {
      // Buscar partes por nombre o propiedades específicas
      const objName = object.name.toLowerCase();
      
      // Buscar la cabeza (probablemente la parte más alta o con forma específica)
      if (objName.includes('head') || objName.includes('cabeza')) {
        headRef.current = object;
      }
      // Buscar el brazo izquierdo
      else if (objName.includes('left') && objName.includes('arm')) {
        leftArmRef.current = object;
      }
      // Buscar el brazo derecho
      else if (objName.includes('right') && objName.includes('arm')) {
        rightArmRef.current = object;
      }
      // Buscar los ojos
      else if (objName.includes('eye') || objName.includes('ojo')) {
        if (objName.includes('left')) {
          leftEyeRef.current = object;
        } else if (objName.includes('right')) {
          rightEyeRef.current = object;
        }
      }
      // Buscar el cuerpo
      else if (objName.includes('body') || objName.includes('cuerpo')) {
        bodyRef.current = object;
      }
      
      // Si el objeto tiene un material emisivo, podría ser parte de los ojos
      if (object.type === 'Mesh') {
        const mesh = object as THREE.Mesh;
        if (mesh.material) {
          const material = Array.isArray(mesh.material) 
            ? mesh.material[0] as THREE.MeshStandardMaterial 
            : mesh.material as THREE.MeshStandardMaterial;
          
          // Si tiene un material azul brillante, probablemente sea el ojo
          if (material.emissive && 
             (material.emissive.b > 0.5 || 
              (material.color && material.color.b > 0.7 && material.color.r < 0.3))) {
            eyeGlowMaterial.current = material;
            
            // Verificar si este objeto está en una posición que podría ser un ojo
            const position = new THREE.Vector3();
            mesh.getWorldPosition(position);
            
            // Si está a la izquierda y es un ojo
            if (position.x < 0 && !leftEyeRef.current) {
              leftEyeRef.current = mesh;
            }
            // Si está a la derecha y es un ojo
            else if (position.x > 0 && !rightEyeRef.current) {
              rightEyeRef.current = mesh;
            }
          }
        }
      }
    });
    
    // Si no se encontró la cabeza por nombre, buscarla por posición (generalmente es la parte más alta)
    if (!headRef.current) {
      let highestY = -Infinity;
      let highestObject: THREE.Object3D | null = null;
      
      model.traverse((object) => {
        if (object.type === 'Mesh') {
          const position = new THREE.Vector3();
          object.getWorldPosition(position);
          
          if (position.y > highestY) {
            highestY = position.y;
            highestObject = object;
          }
        }
      });
      
      if (highestObject) {
        headRef.current = highestObject;
      }
    }
    
    // Si no se encontraron los brazos por nombre, buscarlos por posición
    if (!leftArmRef.current || !rightArmRef.current) {
      const meshes: THREE.Mesh[] = [];
      
      model.traverse((object) => {
        if (object.type === 'Mesh') {
          meshes.push(object as THREE.Mesh);
        }
      });
      
      // Ordenar por posición x (de izquierda a derecha)
      meshes.sort((a, b) => {
        const posA = new THREE.Vector3();
        const posB = new THREE.Vector3();
        a.getWorldPosition(posA);
        b.getWorldPosition(posB);
        return posA.x - posB.x;
      });
      
      // Asignar el objeto más a la izquierda como brazo izquierdo si no se encontró
      if (!leftArmRef.current && meshes.length > 0) {
        // Evitar usar la cabeza como brazo
        const leftMeshes = meshes.filter(mesh => mesh !== headRef.current);
        if (leftMeshes.length > 0) {
          leftArmRef.current = leftMeshes[0];
        }
      }
      
      // Asignar el objeto más a la derecha como brazo derecho si no se encontró
      if (!rightArmRef.current && meshes.length > 0) {
        // Evitar usar la cabeza como brazo
        const rightMeshes = meshes.filter(mesh => mesh !== headRef.current);
        if (rightMeshes.length > 0) {
          rightArmRef.current = rightMeshes[rightMeshes.length - 1];
        }
      }
    }
    
    // Si no se encontró el cuerpo, usar el objeto más grande o central
    if (!bodyRef.current) {
      let largestVolume = 0;
      let largestObject: THREE.Object3D | null = null;
      
      model.traverse((object) => {
        if (object.type === 'Mesh' && object !== headRef.current) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.computeBoundingBox();
            const box = mesh.geometry.boundingBox;
            if (box) {
              const size = new THREE.Vector3();
              box.getSize(size);
              const volume = size.x * size.y * size.z;
              
              if (volume > largestVolume) {
                largestVolume = volume;
                largestObject = object;
              }
            }
          }
        }
      });
      
      if (largestObject) {
        bodyRef.current = largestObject;
      }
    }
    
    // Escalar y posicionar correctamente el modelo
    model.scale.set(1.2, 1.2, 1.2);
    model.position.set(0, 0.5, 0);
    
    if (onLoad) onLoad();
  }, [gltf.scene, onLoad]);

  // Capturar la posición del ratón
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convertir la posición del ratón a coordenadas normalizadas (-1 a 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
      
      // Detectar si el cursor está cerca del centro para activar efecto
      const distance = Math.sqrt(x * x + y * y);
      const threshold = 0.3; // Ajustar según necesidad
      
      setIsOutside(distance < threshold);
      
      // Cambiar a animación de seguimiento cuando el cursor se mueve
      if (animation !== 'wave') {
        setAnimation('follow');
        
        // Volver a idle después de un tiempo sin movimiento
        setTimeout(() => {
          if (animation === 'follow') {
            setAnimation('idle');
          }
        }, 2000);
      }
    };
    
    // Iniciar animación de saludo ocasionalmente
    const waveInterval = setInterval(() => {
      if (Math.random() > 0.7 && animation !== 'wave') {
        setAnimation('wave');
        animationTimeRef.current = 0;
        
        // Volver a idle después de la animación de saludo
        setTimeout(() => {
          setAnimation('idle');
        }, 2000);
      }
    }, 8000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(waveInterval);
    };
  }, [animation]);

  // Animación del robot
  useFrame((state, delta) => {
    if (!modelRef.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // Actualizar el tiempo de la animación actual
    animationTimeRef.current += delta;
    
    // Movimiento de respiración suave para el modelo completo
    modelRef.current.position.y = 0.5 + Math.sin(t * 1.5) * 0.05;
    
    // Animación según el estado actual
    switch (animation) {
      case 'idle':
        // Ligero movimiento de cabeza
        if (headRef.current) {
          headRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
          headRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
        }
        
        // Pequeños movimientos de brazos
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.sin(t * 0.7) * 0.05;
        }
        
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(t * 0.7 + Math.PI) * 0.05;
        }
        break;
        
      case 'wave':
        // Saludo con el brazo derecho
        if (rightArmRef.current) {
          // Subir el brazo
          rightArmRef.current.rotation.z = Math.sin(animationTimeRef.current * 5) * 0.5 + 0.5;
          rightArmRef.current.rotation.x = 0.2;
        }
        
        // Mover un poco la cabeza durante el saludo
        if (headRef.current) {
          headRef.current.rotation.z = Math.sin(animationTimeRef.current * 2) * 0.1;
          headRef.current.rotation.y = 0.2;
        }
        break;
        
      case 'follow':
        // Seguir el cursor con la cabeza
        if (headRef.current) {
          headRef.current.rotation.y = THREE.MathUtils.lerp(
            headRef.current.rotation.y || 0,
            mousePosition.x * 0.5,
            0.1
          );
          
          headRef.current.rotation.x = THREE.MathUtils.lerp(
            headRef.current.rotation.x || 0,
            -mousePosition.y * 0.2,
            0.1
          );
        }
        break;
    }
    
    // Animación de parpadeo (cambiar brillo de los ojos)
    if (eyeGlowMaterial.current) {
      // Parpadeo periódico
      const blink = Math.sin(t * 0.5) > 0.95;
      
      if (blink) {
        eyeGlowMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(
          eyeGlowMaterial.current.emissiveIntensity || 1.0,
          0.2,
          0.3
        );
      } else {
        eyeGlowMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(
          eyeGlowMaterial.current.emissiveIntensity || 0.2,
          1.0,
          0.1
        );
      }
    }
    
    // Animación individual de los ojos si se encontraron
    if (leftEyeRef.current && rightEyeRef.current) {
      // Los ojos siguen ligeramente al cursor
      const eyeRotationX = -mousePosition.y * 0.1;
      const eyeRotationY = mousePosition.x * 0.1;
      
      leftEyeRef.current.rotation.x = THREE.MathUtils.lerp(
        leftEyeRef.current.rotation.x || 0,
        eyeRotationX,
        0.1
      );
      
      leftEyeRef.current.rotation.y = THREE.MathUtils.lerp(
        leftEyeRef.current.rotation.y || 0,
        eyeRotationY,
        0.1
      );
      
      rightEyeRef.current.rotation.x = THREE.MathUtils.lerp(
        rightEyeRef.current.rotation.x || 0,
        eyeRotationX,
        0.1
      );
      
      rightEyeRef.current.rotation.y = THREE.MathUtils.lerp(
        rightEyeRef.current.rotation.y || 0,
        eyeRotationY,
        0.1
      );
    }
    
    // Efecto de "salirse del recuadro" cuando el cursor está cerca
    if (isOutside) {
      modelRef.current.position.z = THREE.MathUtils.lerp(
        modelRef.current.position.z,
        1.2, // Se mueve hacia adelante
        0.05
      );
      
      // En caso de tener brazos, extenderlos cuando se sale
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z || 0,
          -0.3,
          0.1
        );
        
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z || 0,
          0.3,
          0.1
        );
        
        // Realizar un saludo cuando se acerca el cursor
        if (animation !== 'wave' && Math.random() > 0.99) {
          setAnimation('wave');
          animationTimeRef.current = 0;
          
          setTimeout(() => {
            setAnimation('follow');
          }, 2000);
        }
      }
    } else {
      modelRef.current.position.z = THREE.MathUtils.lerp(
        modelRef.current.position.z,
        0, // Posición normal
        0.05
      );
    }
  });

  return (
    <group ref={modelRef}>
      {/* El modelo GLB se añadirá automáticamente aquí en el useEffect */}
      
      {/* Luz para iluminar los ojos */}
      <pointLight position={[0, 0.5, 1] as RotationArray} intensity={2} distance={3} color="#00aaff" />
    </group>
  );
}

// Componente de carga para mostrar mientras se carga el modelo
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-3 text-blue-600">Cargando robot...</p>
    </div>
  );
}

// Componente contenedor de la escena 3D
function RobotModel() {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleModelLoaded = () => {
    setIsLoading(false);
  };
  
  return (
    <div className="h-[400px] w-full touch-none relative overflow-visible">
      {isLoading && <LoadingSpinner />}
      
      {/* Mensaje instructivo */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 opacity-70">
        Mueve el cursor cerca del robot para interactuar
      </div>
      
      <Canvas shadows className="overflow-visible" camera={{ position: [0, 0, 4] as RotationArray, fov: 50 }}>
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 5, 5] as RotationArray} angle={0.3} penumbra={1} intensity={1.5} castShadow shadow-bias={-0.001} />
        <spotLight position={[-5, 5, 5] as RotationArray} angle={0.3} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <GLBRobotModel onLoad={handleModelLoaded} />
        </Suspense>
        
        <ContactShadows 
          position={[0, -1.5, 0] as RotationArray} 
          opacity={0.6} 
          scale={10} 
          blur={2.5} 
          far={5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// Precargar el modelo para evitar errores
useGLTF.preload('/ROBOT1.glb');

export default RobotModel; 