'use client'

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { RobotMood } from '@/types/landing';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';

// Suppress THREE.Clock deprecation warning from @react-three/fiber internals
if (typeof window !== 'undefined') {
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
    originalWarn(...args);
  };
}

interface Robot3DProps {
  currentMood?: RobotMood;
  onMoodChange?: (mood: RobotMood) => void;
  interactive?: boolean;
}

const MODEL_PATH = '/onbibear2-optimized.glb';

function OnbiModel({ mood }: { mood: RobotMood }) {
  const gltf = useLoader(GLTFLoader, MODEL_PATH, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);
  });

  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    const bobSpeed = mood === 'focus' ? 0.8 : mood === 'rest' ? 0.4 : 1.2;
    const bobAmount = mood === 'sleep' ? 0.02 : 0.05;
    meshRef.current.position.y = Math.sin(t * bobSpeed) * bobAmount;
  });

  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} scale={1.8} position={[0, -0.8, 0]} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#1e1b4b" wireframe />
    </mesh>
  );
}

export default function Robot3D({
  currentMood: externalMood,
  interactive = true,
}: Robot3DProps) {
  const mood = externalMood || 'happy';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only render Canvas when component is in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px' } // start rendering slightly before visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getMoodColor = (m: RobotMood): string => {
    switch (m) {
      case 'happy': return '#22d3ee';
      case 'focus': return '#6366f1';
      case 'rest': return '#f59e0b';
      case 'listening': return '#10b981';
      case 'sleep': return '#6b7280';
      case 'alert': return '#ef4444';
      default: return '#22d3ee';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[600px] mx-auto">
      <div
        className="absolute inset-0 rounded-full blur-[80px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: getMoodColor(mood) }}
      />

      {isVisible && (
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 40 }}
          style={{ width: '100%', height: '100%' }}
          frameloop="always"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color={getMoodColor(mood)} />

          <Suspense fallback={<LoadingFallback />}>
            <OnbiModel mood={mood} />
            <Environment preset="studio" />
            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.4}
              scale={5}
              blur={2.5}
            />
          </Suspense>

          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={false}
            />
          )}
        </Canvas>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/60 bg-white/70 border border-white/80 px-3 py-1.5 rounded-full shadow-sm">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-950">
          {mood === 'happy' && 'Happy Mode'}
          {mood === 'focus' && 'Deep Focus'}
          {mood === 'rest' && 'Rest Break'}
          {mood === 'listening' && 'Listening'}
          {mood === 'sleep' && 'Sleep Mode'}
          {mood === 'alert' && 'Alert!'}
        </span>
      </div>
    </div>
  );
}
