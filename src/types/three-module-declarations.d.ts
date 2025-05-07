// Declaraciones de módulos para Three.js y sus cargadores
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, Group, Mesh, BufferGeometry, Material, Scene, LoadingManager } from 'three';

  export interface GLTF {
    scene: Scene;
    scenes: Scene[];
    cameras: any[];
    animations: any[];
    asset: any;
    parser: any;
    userData: any;
  }

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
} 