'use client'

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { RobotMood } from '@/types/landing';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';
import { Shield, MessageSquare, MonitorOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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

  // Base beautiful starting angle (tilted ~26 degrees to show profile)
  const defaultRotY = 0.45;

  // Keep track of entrance animation state (relative multipliers/offsets)
  const entranceRef = useRef({
    scale: 0,
    posY: -0.5,
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Hover floating (bobbing) animation
    const bobSpeed = mood === 'focus' ? 0.8 : mood === 'rest' ? 0.4 : 1.2;
    const bobAmount = mood === 'sleep' ? 0.02 : 0.05;
    const currentBob = Math.sin(t * bobSpeed) * bobAmount;

    // 2. Smooth entrance animation (spring-lerp from 0 to 1)
    entranceRef.current.scale = THREE.MathUtils.lerp(entranceRef.current.scale, 1, 0.05);
    entranceRef.current.posY = THREE.MathUtils.lerp(entranceRef.current.posY, 0, 0.05);

    meshRef.current.scale.setScalar(entranceRef.current.scale);
    meshRef.current.position.y = entranceRef.current.posY + currentBob;

    // 3. Look-At Mouse Pointer Interaction (Relative to defaultRotY)
    if (!isMobile) {
      const targetYRot = defaultRotY + (state.pointer.x * Math.PI) / 8; // Max 22.5 deg rotation around base
      const targetXRot = -(state.pointer.y * Math.PI) / 12; // Max 15 deg tilt

      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetYRot, 0.08);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetXRot, 0.08);
    } else {
      // Eases back to default catalog angle on mobile
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, defaultRotY, 0.08);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.08);
    }
  });

  const scale = isMobile ? 1.7 : 1.8;
  const positionY = isMobile ? -0.65 : -0.8;

  return (
    <group
      ref={meshRef}
      scale={0}
      position={[0, -0.5, 0]}
      rotation={[0, defaultRotY - Math.PI / 4, 0]}
    >
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
  const [showBubble, setShowBubble] = useState(true);
  const [isThinking, setIsThinking] = useState(true);
  const { language } = useLanguage();

  // Thinking indicator timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsThinking(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    en: {
      badgePrivacy: '100% Privacy',
      badgePrivacySub: 'Local AI processing',
      badgeEng: 'English Companion',
      badgeEngSub: 'Two-way voice feedback',
      badgeScreen: 'Screen-Free',
      badgeScreenSub: 'Zero addictive elements',
      speechBubble: "Hi! Let's speak English and build focus habits together! 💖",
    },
    vi: {
      badgePrivacy: 'Bảo mật tuyệt đối',
      badgePrivacySub: 'Xử lý AI trực tiếp trên máy',
      badgeEng: 'Bạn học tiếng Anh',
      badgeEngSub: 'Hội thoại phản hồi 2 chiều',
      badgeScreen: 'Không màn hình',
      badgeScreenSub: 'Không gây nghiện, bảo vệ mắt',
      speechBubble: "Chào cậu! Cùng tớ luyện nói tiếng Anh và tập trung học nhé! 💖",
    }
  }[language];

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
  const fov = isMobile ? 42 : 40;
  const shadowY = isMobile ? -0.95 : -1.2;

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[360px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] mx-auto select-none">

      {/* Custom Keyframe Styles for Hardware Accelerated Floating */}
      <style>{`
        @keyframes float-badge {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-bubble {
          0% { transform: translateY(0px) scale(0.98); }
          50% { transform: translateY(-8px) scale(1.02); }
          100% { transform: translateY(0px) scale(0.98); }
        }
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fade-in-content {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float-1 { animation: float-badge 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-badge 8s ease-in-out infinite 1.2s; }
        .animate-float-3 { animation: float-badge 7s ease-in-out infinite 2.4s; }
        .animate-float-bubble { animation: float-bubble 5s ease-in-out infinite; }
        .animate-dot-1 { animation: dot-bounce 1.2s infinite 0s ease-in-out; }
        .animate-dot-2 { animation: dot-bounce 1.2s infinite 0.2s ease-in-out; }
        .animate-dot-3 { animation: dot-bounce 1.2s infinite 0.4s ease-in-out; }
        .animate-fade-in { animation: fade-in-content 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div
        className="absolute inset-0 rounded-full blur-[50px] md:blur-[80px] opacity-15 md:opacity-20 transition-colors duration-1000 animate-pulse pointer-events-none"
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

      {/* ── Premium Apple-Style Floating Glassmorphic Badges ── */}
      <div className="absolute top-[8%] left-[-16%] xl:left-[-22%] hidden md:flex items-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-3 rounded-2xl shadow-xs hover:-translate-y-1 hover:bg-white/60 hover:shadow-sm transition-all duration-300 pointer-events-auto cursor-default select-none animate-float-1 z-20">
        <div className="p-2 bg-indigo-950 text-white rounded-xl shadow-xs">
          <Shield className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="text-[12px] font-bold text-slate-900">{t.badgePrivacy}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{t.badgePrivacySub}</div>
        </div>
      </div>

      <div className="absolute top-[38%] right-[-16%] xl:right-[-22%] hidden md:flex items-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-3 rounded-2xl shadow-xs hover:-translate-y-1 hover:bg-white/60 hover:shadow-sm transition-all duration-300 pointer-events-auto cursor-default select-none animate-float-2 z-20">
        <div className="p-2 bg-indigo-950 text-white rounded-xl shadow-xs">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="text-[12px] font-bold text-slate-900">{t.badgeEng}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{t.badgeEngSub}</div>
        </div>
      </div>

      <div className="absolute bottom-[8%] left-[-10%] xl:left-[-16%] hidden md:flex items-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-3 rounded-2xl shadow-xs hover:-translate-y-1 hover:bg-white/60 hover:shadow-sm transition-all duration-300 pointer-events-auto cursor-default select-none animate-float-3 z-20">
        <div className="p-2 bg-indigo-950 text-white rounded-xl shadow-xs">
          <MonitorOff className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="text-[12px] font-bold text-slate-900">{t.badgeScreen}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{t.badgeScreenSub}</div>
        </div>
      </div>

      {/* ── Premium Apple-Style Floating Speech Bubble ── */}
      {showBubble && (
        <div className="absolute top-[6%] left-[50%] -translate-x-1/2 md:top-[5%] md:left-[55%] md:-translate-x-0 z-30 max-w-[200px] sm:max-w-[240px] px-4 py-3 bg-white/90 backdrop-blur-md border border-white/60 shadow-md rounded-[20px] animate-float-bubble pointer-events-auto cursor-default text-left select-none group/bubble">
          {/* Triangular Tail */}
          <div className="absolute -bottom-1.5 left-[50%] -translate-x-1/2 md:left-12 md:-translate-x-0 w-3 h-3 bg-white border-r border-b border-white/60 rotate-45" />

          {/* Close button (X) */}
          <button 
            onClick={() => setShowBubble(false)}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer opacity-0 group-hover/bubble:opacity-100 duration-300"
            title="Dismiss"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Bubble content */}
          {isThinking ? (
            <div className="flex items-center gap-1.5 py-1.5 px-2 select-none">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-dot-1" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-dot-2" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-dot-3" />
            </div>
          ) : (
            <p className="text-[11px] sm:text-xs font-semibold leading-relaxed text-[#1d1d1f] pr-3 animate-fade-in">
              {t.speechBubble}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
