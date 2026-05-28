'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface MiniTimerProps {
  onStateUpdate?: (status: string) => void;
}

export default function MiniTimer({ onStateUpdate }: MiniTimerProps) {
  const [mode, setMode] = useState<'focus' | 'rest'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxTime = mode === 'focus' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            if (mode === 'focus') {
              setMode('rest');
              setTimeLeft(5 * 60);
              if (onStateUpdate) onStateUpdate('rest');
            } else {
              setMode('focus');
              setTimeLeft(25 * 60);
              if (onStateUpdate) onStateUpdate('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, mode, onStateUpdate]);

  const toggleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning && onStateUpdate) onStateUpdate(mode);
  };

  const resetSession = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (timeLeft / maxTime) * circumference;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 select-none">
      {/* Circular Timer */}
      <motion.div 
        className="relative flex items-center justify-center w-[130px] h-[130px] md:w-[180px] md:h-[180px]"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 260, damping: 15 }}
      >
        <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="miniTimerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mode === 'focus' ? '#22d3ee' : '#f97316'} />
              <stop offset="100%" stopColor={mode === 'focus' ? '#0891b2' : '#ea580c'} />
            </linearGradient>
          </defs>
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="fill-none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#miniTimerGlow)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease', filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[8px] md:text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">
            {mode === 'focus' ? 'FOCUS' : 'REST'}
          </span>
          <span className="text-xl md:text-3xl font-extrabold font-mono text-slate-900 tracking-tight leading-none">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[8px] md:text-[9px] font-mono text-slate-400 mt-0.5">
            {mode === 'focus' ? '25 MIN CYCLE' : '5 MIN BREAK'}
          </span>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRun}
          className={`flex items-center gap-1.5 md:gap-2 px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full font-bold text-[10px] md:text-xs text-white transition-all shadow-md cursor-pointer ${
            isRunning 
              ? 'bg-amber-500 hover:bg-orange-600' 
              : 'bg-indigo-950 hover:bg-indigo-900'
          }`}
        >
          {isRunning ? <Pause className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-white" />}
          {isRunning ? 'PAUSE' : 'START'}
        </button>

        <button
          onClick={resetSession}
          className="p-1.5 md:p-2.5 rounded-full bg-white/50 hover:bg-white/80 border border-white/60 text-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 md:w-3.5 md:h-3.5" />
        </button>
      </div>
    </div>
  );
}
