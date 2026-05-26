'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface IntroLoaderProps {
  onComplete: () => void;
  modelReady?: boolean;
}

export default function IntroLoader({ onComplete, modelReady = false }: IntroLoaderProps) {
  const [percent, setPercent] = useState<number>(0);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Animate progress bar: goes to 90% quickly, then waits for model
  useEffect(() => {
    const duration = 1000; // 1s to reach ~90%
    const targetWithoutModel = 90;
    const step = duration / targetWithoutModel;

    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= targetWithoutModel && !modelReady) {
          // Hold at 90% until model is ready
          return prev;
        }
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, step);

    return () => clearInterval(interval);
  }, [modelReady]);

  // When model is ready, quickly fill to 100%
  useEffect(() => {
    if (modelReady && percent >= 90 && percent < 100) {
      let current = percent;
      const interval = setInterval(() => {
        current += 2;
        if (current >= 100) {
          setPercent(100);
          clearInterval(interval);
        } else {
          setPercent(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [modelReady, percent]);

  // Minimum display time (1.2s) so loader doesn't flash
  useEffect(() => {
    const timeout = setTimeout(() => setMinTimeReached(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Call onComplete when both conditions are met
  useEffect(() => {
    if (percent >= 100 && minTimeReached && modelReady) {
      const timeout = setTimeout(() => onCompleteRef.current(), 200);
      return () => clearTimeout(timeout);
    }
  }, [percent, minTimeReached, modelReady]);

  // Circle progress SVG params
  const size = 220;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center overflow-hidden select-none">
      
      {/* Glow behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[400px] h-[400px] rounded-full bg-[#22d3ee]/15 blur-[100px]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-col items-center justify-center z-10">
        
        {/* Circular progress + logo in center */}
        <div className="relative" style={{ width: size, height: size }}>
          
          {/* Background circle track */}
          <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ 
                transition: 'stroke-dashoffset 0.05s linear',
                filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.7))'
              }}
            />
          </svg>

          {/* Logo centered inside circle */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/ONBI_loading.png"
              alt="ONBI"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]"
            />
          </motion.div>
        </div>

        {/* Percent text */}
        <span className="mt-6 text-sm font-mono tracking-widest text-[#22d3ee]/80 font-bold">
          {percent}%
        </span>

      </div>

    </div>
  );
}
