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

function OnbiModel({ mood, isMobile }: { mood: RobotMood; isMobile: boolean }) {
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

  const scale = isMobile ? 1.4 : 1.8;
  const positionY = isMobile ? -0.65 : -0.8;

  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} scale={scale} position={[0, positionY, 0]} />
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
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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

  // Adjust camera FOV and shadow position based on screen size
  const fov = isMobile ? 45 : 40;
  const shadowY = isMobile ? -0.95 : -1.2;

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[280px] sm:max-w-[360px] md:max-w-[500px] lg:max-w-[600px] mx-auto select-none">
      <div
        className="absolute inset-0 rounded-full blur-[50px] md:blur-[80px] opacity-15 md:opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: getMoodColor(mood) }}
      />

      {isVisible && (
        <Canvas
          camera={{ position: [0, 0.5, 4], fov }}
          style={{ width: '100%', height: '100%', pointerEvents: isMobile ? 'none' : 'auto' }}
          frameloop="always"
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color={getMoodColor(mood)} />

          <Suspense fallback={<LoadingFallback />}>
            <OnbiModel mood={mood} isMobile={isMobile} />
            <Environment preset="studio" />
            <ContactShadows
              position={[0, shadowY, 0]}
              opacity={0.4}
              scale={5}
              blur={2.5}
            />
          </Suspense>

          {interactive && !isMobile && (
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

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-white/80 border border-white/80 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm backdrop-blur-md">
        <span className="text-[8px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-950">
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
