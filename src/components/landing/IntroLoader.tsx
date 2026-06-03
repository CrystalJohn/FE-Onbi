'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [percent, setPercent] = useState<number>(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const { language } = useLanguage();
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Animate progress bar: fill to 100% in 300ms
  useEffect(() => {
    const duration = 300;
    const step = duration / 100;

    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, step);

    return () => clearInterval(interval);
  }, []);

  // Minimum display time 300ms
  useEffect(() => {
    const timeout = setTimeout(() => setMinTimeReached(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  // Dispatch onComplete when progress done and minimum time elapsed (no model wait)
  useEffect(() => {
    if (percent >= 100 && minTimeReached) {
      const timeout = setTimeout(() => onCompleteRef.current(), 50);
      return () => clearTimeout(timeout);
    }
  }, [percent, minTimeReached]);

  // Dual-ring sizing
  const size = 260; // Increased size for premium feeling
  const strokeWidth = 3;
  const radius = (size - 16) / 2; // Offset to give some breathing room
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Status telemetry messages in sync with loading percentages
  const statusMessages = {
    vi: [
      { max: 25, text: "Khởi chạy hệ thống ONBI..." },
      { max: 55, text: "Chuẩn bị trải nghiệm học tập..." },
      { max: 80, text: "Thiết lập vùng học tập an toàn..." },
      { max: 95, text: "Đồng bộ hóa không gian học tập..." },
      { max: 100, text: "Hệ thống đã sẵn sàng." }
    ],
    en: [
      { max: 25, text: "Initializing ONBI core..." },
      { max: 55, text: "Preparing the study experience..." },
      { max: 80, text: "Configuring safe study zone..." },
      { max: 95, text: "Calibrating study workspace..." },
      { max: 100, text: "System is ready." }
    ]
  }[language];

  // Get active status message based on current percentage
  const currentStatusText = statusMessages.find((msg) => percent <= msg.max)?.text || statusMessages[statusMessages.length - 1].text;

  return (
    <div className="fixed inset-0 z-[100] bg-[#000000] text-white flex flex-col items-center justify-center overflow-hidden select-none">
      
      {/* 🌌 Cinematic Nebula Atmospheric Lights */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* 💜 Ultra-Vibrant Purple/Violet Nebula */}
        <motion.div 
          className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-purple-600/22 blur-[140px]"
          animate={{ 
            x: [0, 60, -40, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.2, 0.85, 1]
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        {/* 🩵 High-Energy Cyan Nebula */}
        <motion.div 
          className="absolute w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full bg-cyan-400/20 blur-[110px]"
          animate={{ 
            x: [0, -60, 50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.9, 1.15, 1]
          }}
          transition={{ 
            duration: 11, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        {/* 💙 Deep Electric Blue Nebula */}
        <motion.div 
          className="absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full bg-blue-500/22 blur-[125px]"
          animate={{ 
            x: [-30, 40, -20, -30],
            y: [30, -30, 40, 30],
            scale: [0.9, 1.1, 0.95, 0.9]
          }}
          transition={{ 
            duration: 13, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        {/* 💖 Premium Magenta/Pink Nebula Flare */}
        <motion.div 
          className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-pink-500/15 blur-[120px]"
          animate={{ 
            x: [40, -40, 20, 40],
            y: [-20, 30, -30, -20],
            scale: [1.1, 0.95, 1.05, 1.1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      {/* ⚙️ Central Instrumentation Assembly */}
      <div className="relative flex flex-col items-center justify-center z-10">
        
        {/* Concentric Dual-Rings + Cheer Robot */}
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          
          {/* SVG Canvas for Dual Rings */}
          <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066cc" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            {/* 🛠️ Outer Calibration Ring (Dashed, slow rotating) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 8}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              strokeDasharray="6 8"
              className="origin-center animate-[spin_40s_linear_infinite]"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 8}
              fill="none"
              stroke="rgba(34,211,238,0.15)"
              strokeWidth={1}
              strokeDasharray="2 20"
              className="origin-center animate-[spin_20s_linear_infinite_reverse]"
            />

            {/* 🛠️ Inner Progress Arc (Gradient, custom spring motion) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ 
                transition: 'stroke-dashoffset 0.08s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 0 12px rgba(34,211,238,0.6))'
              }}
            />
          </svg>

          {/* 🤖 Silent Loop Cheer Robot Video (Optimized 1.1MB in 3D Glowing Container) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-white/25 bg-white flex items-center justify-center pointer-events-none select-none"
              style={{
                boxShadow: '0 0 35px rgba(34, 211, 238, 0.35), inset 0 0 15px rgba(0, 102, 204, 0.15)',
              }}
            >
              <video
                src="/onbi-cheer.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* 📟 Premium Monospace Progress Percentage */}
        <span className="mt-8 text-sm font-mono tracking-[0.25em] text-[#22d3ee] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          {percent}%
        </span>

        {/* 💬 Bilingual Narrative Telemetry */}
        <div className="h-6 mt-3 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStatusText}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 0.65 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-[13px] font-sans font-medium text-white tracking-wider text-center"
            >
              {currentStatusText}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>

      {/* 🏷️ Micro Apple-Style Bottom Signature */}
      <motion.div 
        className="absolute bottom-10 flex flex-col items-center justify-center opacity-30 text-[9px] font-mono tracking-[0.3em] uppercase text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.8 }}
      >
        <span>Designed by ONBI Team</span>
      </motion.div>
      
    </div>
  );
}
