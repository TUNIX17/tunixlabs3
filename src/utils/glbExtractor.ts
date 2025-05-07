import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Tipos para la estructura de datos
export type BoneInfo = {
  name: string;
  position: [number, number, number]; // Posición en formato de array
  rotation: [number, number, number]; // Rotación en formato de array (radianes)
  quaternion: [number, number, number, number]; // Rotación como quaternion
  scale: [number, number, number]; // Escala
  parent: string | null;
  children: string[];
  matrix: number[]; // Matriz de transformación
  worldMatrix: number[]; // Matriz mundial
};

export type SkeletonData = {
  bones: Record<string, BoneInfo>;
  hierarchy: string[]; // Array de huesos en orden jerárquico
  defaultPose: Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    quaternion: [number, number, number, number];
    scale: [number, number, number];
  }>;
};

/**
 * Carga un modelo GLB y extrae información detallada de su estructura ósea
 * @param url Ruta al archivo GLB
 * @returns Promesa con los datos del esqueleto
 */
export async function extractGLBData(url: string): Promise<SkeletonData> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    loader.load(
      url,
      (gltf: GLTF) => {
        const skeletonData: SkeletonData = {
          bones: {},
          hierarchy: [],
          defaultPose: {}
        };
        
        // Mapa para almacenar referencias de padres
        const parentMap = new Map<string, string>();
        
        // Primera pasada para recopilar relaciones padre-hijo
        gltf.scene.traverse((object: THREE.Object3D) => {
          if (object.parent && object.parent.name) {
            parentMap.set(object.uuid, object.parent.name);
          }
        });
        
        // Extraer jerarquía
        const rootBones: string[] = [];
        const processedBones = new Set<string>();
        
        // Segunda pasada para extraer detalles de los huesos
        gltf.scene.traverse((object: THREE.Object3D) => {
          // Solo procesar objetos que pueden ser huesos
          if (object.type === 'Bone' || object.type === 'Object3D' || object.type === 'Group' || object.type === 'Mesh') {
            const children: string[] = object.children
              .filter((child: THREE.Object3D) => child.type === 'Bone' || child.type === 'Object3D' || child.type === 'Group' || child.type === 'Mesh')
              .map((child: THREE.Object3D) => child.name);
            
            // Convertir matrices a arrays
            const matrixArray = object.matrix.toArray();
            const worldMatrixArray = object.matrixWorld.toArray();
            
            // Almacenar información del hueso
            skeletonData.bones[object.name] = {
              name: object.name,
              position: [object.position.x, object.position.y, object.position.z],
              rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
              quaternion: [object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w],
              scale: [object.scale.x, object.scale.y, object.scale.z],
              parent: parentMap.get(object.uuid) || null,
              children,
              matrix: Array.from(matrixArray),
              worldMatrix: Array.from(worldMatrixArray)
            };
            
            // Almacenar pose por defecto
            skeletonData.defaultPose[object.name] = {
              position: [object.position.x, object.position.y, object.position.z],
              rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
              quaternion: [object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w],
              scale: [object.scale.x, object.scale.y, object.scale.z]
            };
            
            // Registrar el hueso como procesado
            processedBones.add(object.name);
            
            // Si no tiene padre, es un hueso raíz
            if (!parentMap.get(object.uuid)) {
              rootBones.push(object.name);
            }
          }
        });
        
        // Construir jerarquía comenzando por los huesos raíz
        function buildHierarchy(boneName: string, depth: number = 0) {
          // Añadir el hueso actual a la jerarquía
          skeletonData.hierarchy.push(boneName);
          
          // Procesar hijos recursivamente
          const bone = skeletonData.bones[boneName];
          if (bone) {
            bone.children.forEach(childName => {
              if (skeletonData.bones[childName]) {
                buildHierarchy(childName, depth + 1);
              }
            });
          }
        }
        
        // Comenzar a construir la jerarquía desde cada hueso raíz
        rootBones.forEach(rootBone => {
          buildHierarchy(rootBone);
        });
        
        resolve(skeletonData);
      },
      undefined,
      reject
    );
  });
}

/**
 * Guarda los datos del esqueleto como un archivo JSON
 * @param skeletonData Datos del esqueleto a guardar
 * @param fileName Nombre del archivo (opcional)
 */
export function saveSkeletonDataAsJson(skeletonData: SkeletonData, fileName: string = 'robot_skeleton_data'): void {
  const dataStr = JSON.stringify(skeletonData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportLink = document.createElement('a');
  exportLink.setAttribute('href', dataUri);
  exportLink.setAttribute('download', `${fileName}.json`);
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
}

/**
 * Extrae y guarda los datos del esqueleto del modelo ROBOT2.glb
 * Esta función se puede llamar desde cualquier componente para forzar la extracción
 */
export async function extractRobot2Data() {
  try {
    console.log('Iniciando extracción de datos del modelo ROBOT2.glb...');
    const data = await extractGLBData('/ROBOT2.glb');
    console.log('Extracción exitosa:', data);
    saveSkeletonDataAsJson(data, 'robot2_skeleton_data');
    return data;
  } catch (error) {
    console.error('Error al extraer datos del modelo ROBOT2:', error);
    return null;
  }
}

/**
 * Retorna un hueso a su posición original según la pose por defecto
 * @param object Objeto Three.js a resetear
 * @param defaultPose Pose por defecto del esqueleto
 */
export function resetBoneToPose(
  object: THREE.Object3D, 
  defaultPose: SkeletonData['defaultPose']
): void {
  if (defaultPose[object.name]) {
    const pose = defaultPose[object.name];
    
    // Restablecer posición
    object.position.set(pose.position[0], pose.position[1], pose.position[2]);
    
    // Restablecer rotación
    object.rotation.set(pose.rotation[0], pose.rotation[1], pose.rotation[2]);
    
    // Restablecer escala
    object.scale.set(pose.scale[0], pose.scale[1], pose.scale[2]);
    
    // Actualizar matrices
    object.updateMatrix();
    object.updateMatrixWorld();
  }
}

/**
 * Restablece todos los huesos de un modelo a su pose por defecto
 * @param scene Escena que contiene el modelo
 * @param defaultPose Pose por defecto del esqueleto
 */
export function resetSkeletonToPose(
  scene: THREE.Object3D, 
  defaultPose: SkeletonData['defaultPose']
): void {
  scene.traverse(object => {
    if (defaultPose[object.name]) {
      resetBoneToPose(object, defaultPose);
    }
  });
} 