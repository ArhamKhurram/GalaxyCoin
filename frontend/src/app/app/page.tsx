'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useEffect, Suspense } from 'react';
import * as THREE from 'three';

// Error boundary for GLTF loading errors
class GLTFErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GLTF Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Fallback component in case the model doesn't load
function FallbackBlackHole() {
  return (
    <group>
      {/* Visible fallback sphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ab23ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Text to indicate fallback */}
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[4, 0.5, 0.1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}

function BlackHoleModel() {
  const gltf = useGLTF('/black_hole.glb', true); // Add draco support
  const model = gltf.scene;

  useEffect(() => {
    console.log('GLTF loaded:', gltf);
    console.log('Model scene:', model);
    console.log('Model children:', model.children);
    console.log('Model userData:', model.userData);
    
    // Check if model has any geometry
    let hasGeometry = false;
    model.traverse((child) => {
  if ((child as THREE.Mesh).isMesh) {
    const mesh = child as THREE.Mesh;
    const name = mesh.name;

    let material: THREE.Material;

    if (name.includes('center') || name.includes('blackoutside')) {
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#000000'),
        emissive: new THREE.Color('#000000'),
        roughness: 1.0,
      });
    }
    else if (name.includes('distortion')) {
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#222'),
        opacity: 0.15,
        transparent: true,
        emissive: new THREE.Color('#8800ff'),
        emissiveIntensity: 0.4,
        blending: THREE.AdditiveBlending,
      });
    }
    else if (name.includes('light1') || name.includes('light2') || name.includes('light3')) {
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#ffcc88'),
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
    }
    else if (name.includes('ring')) {
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffaa33'),
        emissive: new THREE.Color('#ffaa33'),
        emissiveIntensity: 2.5,
        opacity: 0.18,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      // Optionally, add a simple procedural alphaMap for softness
      // (for demo: use a built-in THREE texture)
      const mat = material as THREE.MeshStandardMaterial;
      mat.alphaMap = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/smoke.png');
      mat.alphaMap.wrapS = mat.alphaMap.wrapT = THREE.RepeatWrapping;
      mat.alphaMap.repeat.set(2, 2);
      mat.needsUpdate = true;
    }
    else {
      material = new THREE.MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0.4,
        transparent: true,
      });
    }
    mesh.material = material;
  }
});

    
    console.log('Has geometry:', hasGeometry);
    
    // Set a reasonable scale
    model.scale.set(0.1, 0.1, 0.1);
    model.position.set(0, 0, 0);
    
    // Add bounding box to visualize
    const boxHelper = new THREE.BoxHelper(model, 0x00ffff);
    model.add(boxHelper);
    
    // Get bounding box info
    const box = new THREE.Box3().setFromObject(model);
    console.log('Model bounding box:', box);
    console.log('Model size:', box.getSize(new THREE.Vector3()));
    
  }, [model, gltf]);

  return <primitive object={model} />;
}

export default function BlackHoleScene() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Pure black background */}
        <color attach="background" args={['#000000']} />

        {/* Strong directional light */}
        <directionalLight position={[5, 10, 7.5]} intensity={2} color="#ffffff" />
        {/* Subtle point lights */}
        <pointLight position={[0, 0, 10]} intensity={0.2} color="#aa66ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.1} color="#440088" />

        <Suspense fallback={<FallbackBlackHole />}>
          <GLTFErrorBoundary fallback={<FallbackBlackHole />}>
            <BlackHoleModel />
          </GLTFErrorBoundary>
          <EffectComposer>
            <Bloom intensity={2.5} luminanceThreshold={0} luminanceSmoothing={0.9} />
          </EffectComposer>
        </Suspense>

        {/* Remove autoRotate from OrbitControls to stop spinning */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
