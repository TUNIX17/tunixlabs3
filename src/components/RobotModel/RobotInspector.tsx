'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { extractGLBData, saveSkeletonDataAsJson, type SkeletonData } from '@/utils/glbExtractor';

type BoneInfo = {
  name: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  children: string[];
  parent: string | null;
};

function RobotInspector() {
  const [boneStructure, setBoneStructure] = useState<Record<string, BoneInfo>>({});
  const [skeletonData, setSkeletonData] = useState<SkeletonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  
  // Cargar el modelo GLB
  const { scene } = useGLTF('/ROBOT2.glb');
  
  useEffect(() => {
    if (!scene) return;
    
    // Extraer datos básicos para visualización rápida
    const boneData: Record<string, BoneInfo> = {};
    const parentMap: Record<string, string> = {};
    
    // Recopilar la estructura de parentesco
    scene.traverse((object) => {
      if (object.parent) {
        parentMap[object.uuid] = object.parent.name;
      }
    });
    
    // Recopilar información de cada hueso
    scene.traverse((object) => {
      // Solo nos interesan los objetos que probablemente sean huesos
      if (object.type === 'Bone' || object.type === 'Object3D' || object.type === 'Group' || object.type === 'Mesh') {
        const childrenNames = object.children
          .filter(child => child.type === 'Bone' || child.type === 'Object3D' || child.type === 'Group' || child.type === 'Mesh')
          .map(child => child.name);
          
        boneData[object.name] = {
          name: object.name,
          position: new THREE.Vector3().copy(object.position),
          rotation: new THREE.Euler().copy(object.rotation),
          children: childrenNames,
          parent: parentMap[object.uuid] || null
        };
      }
    });
    
    setBoneStructure(boneData);
    
    // Extraer datos avanzados usando la utilidad
    const loadDetailedData = async () => {
      try {
        const detailed = await extractGLBData('/ROBOT2.glb');
        setSkeletonData(detailed);
        console.log('Datos detallados del esqueleto:', detailed);
      } catch (error) {
        console.error('Error extrayendo datos detallados:', error);
      }
    };
    
    loadDetailedData();
    setIsLoading(false);
    console.log('Estructura de huesos básica recopilada:', boneData);
  }, [scene]);
  
  // Función para guardar el resultado como archivo JSON
  const exportBasicToJson = () => {
    const dataStr = JSON.stringify(boneStructure, (key, value) => {
      // Convertir Vector3 y Euler a arrays para mejor visualización
      if (value instanceof THREE.Vector3) {
        return [value.x, value.y, value.z];
      }
      if (value instanceof THREE.Euler) {
        return [value.x, value.y, value.z];
      }
      return value;
    }, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'robot_skeleton_basic.json');
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
  };
  
  // Exportar datos detallados usando la utilidad
  const exportDetailedToJson = () => {
    if (skeletonData) {
      saveSkeletonDataAsJson(skeletonData, 'robot_skeleton_detailed');
    } else {
      alert('Los datos detallados aún no están disponibles. Por favor espera a que se carguen.');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Inspector del Robot</h2>
      
      {isLoading ? (
        <p>Cargando estructura del modelo...</p>
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            <button 
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded ${activeTab === 'basic' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              Información Básica
            </button>
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 rounded ${activeTab === 'advanced' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              Información Avanzada
            </button>
          </div>
          
          <div className="flex gap-4 mb-4">
            {activeTab === 'basic' ? (
              <button 
                onClick={exportBasicToJson}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Exportar estructura básica
              </button>
            ) : (
              <button 
                onClick={exportDetailedToJson}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={!skeletonData}
              >
                Exportar datos detallados
              </button>
            )}
            
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {showInfo ? 'Ocultar información' : 'Mostrar información'}
            </button>
          </div>
          
          {showInfo && (
            <div className="mt-4 max-h-96 overflow-auto bg-white p-4 rounded">
              {activeTab === 'basic' ? (
                <>
                  <h3 className="font-bold mb-2">Huesos detectados: {Object.keys(boneStructure).length}</h3>
                  <ul className="list-disc pl-5">
                    {Object.entries(boneStructure).map(([name, info]) => (
                      <li key={name} className="mb-2">
                        <strong>{name}</strong>
                        <div className="text-sm text-gray-600">
                          Padre: {info.parent || 'Ninguno'}<br />
                          Hijos: {info.children.length > 0 ? info.children.join(', ') : 'Ninguno'}<br />
                          Posición: [{info.position.x.toFixed(2)}, {info.position.y.toFixed(2)}, {info.position.z.toFixed(2)}]<br />
                          Rotación: [{(info.rotation.x * 180/Math.PI).toFixed(2)}°, {(info.rotation.y * 180/Math.PI).toFixed(2)}°, {(info.rotation.z * 180/Math.PI).toFixed(2)}°]
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="font-bold mb-2">Datos detallados del esqueleto</h3>
                  {skeletonData ? (
                    <div>
                      <p className="mb-2">Huesos: {Object.keys(skeletonData.bones).length}</p>
                      <p className="mb-2">Jerarquía: {skeletonData.hierarchy.length} huesos en total</p>
                      
                      <div className="mt-4 mb-2 font-semibold">Jerarquía de huesos:</div>
                      <ul className="list-disc pl-5 mb-4">
                        {skeletonData.hierarchy.slice(0, 20).map((boneName, index) => (
                          <li key={index} className="text-sm">
                            {boneName}
                          </li>
                        ))}
                        {skeletonData.hierarchy.length > 20 && <li>... y {skeletonData.hierarchy.length - 20} más</li>}
                      </ul>
                      
                      <div className="text-xs text-gray-500 italic">
                        Nota: Exporta los datos detallados para ver la estructura completa en un archivo JSON.
                      </div>
                    </div>
                  ) : (
                    <p>Cargando datos detallados...</p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RobotInspector; 