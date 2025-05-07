'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';

// Definir tipo para arrays de rotación
type RotationArray = [number, number, number];

// Componente que carga el modelo GLB sin animaciones
function StaticRobotModel({ onLoad }: { onLoad?: () => void }) {
  // Cargar el modelo GLB
  const gltf = useGLTF('/ROBOT2.glb');
  const modelRef = useRef<THREE.Group>(null);

  // Cuando el modelo se carga completamente
  React.useEffect(() => {
    if (gltf.scene && onLoad) {
      // Centrar y posicionar el modelo
      gltf.scene.position.set(0, -1.5, 0);
      gltf.scene.rotation.set(0, 0, 0);
      
      onLoad();
    }
  }, [gltf.scene, onLoad]);

  // Renderizar el modelo usando <primitive>
  return <primitive object={gltf.scene} ref={modelRef} />;
}

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

  const handleModelLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-[450px] w-full touch-none relative overflow-visible">
      {isLoading && <LoadingSpinner />}

      <Canvas shadows className="overflow-visible" camera={{ position: [0, 0.5, 300] as RotationArray, fov: 45 }}>
        <color attach="background" args={['transparent']} />
        {/* Iluminación básica */}
        <ambientLight intensity={0.7} />
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
        <spotLight position={[-5, 5, -5] as RotationArray} angle={0.2} penumbra={1} intensity={0.6} />

        <Suspense fallback={null}>
          <StaticRobotModel onLoad={handleModelLoaded} />
        </Suspense>

        <ContactShadows
          position={[0, -1.5, 0] as RotationArray}
          opacity={0.5}
          scale={8}
          blur={2.0}
          far={3}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// Precargar el modelo
useGLTF.preload('/ROBOT2.glb');

export default RobotModel; 