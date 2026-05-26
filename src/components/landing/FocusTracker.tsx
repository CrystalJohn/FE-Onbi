'use client'

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Smartphone, 
  Bell, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Timer, 
  Activity, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusTrackerProps {
  onStateUpdate?: (status: string) => void;
  onAlertTriggered?: () => void;
}

export default function FocusTracker({ onStateUpdate, onAlertTriggered }: FocusTrackerProps) {
  // Mode state: 25 minutes Deep Focus vs 5 minutes Mindful Rest
  const [mode, setMode] = useState<'focus' | 'rest'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // standard seconds representation
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false); // demo accelerator
  
  // Custom mockups states
  const [postureState, setPostureState] = useState<'good' | 'leaning' | 'critical'>('good');
  const [showNotification, setShowNotification] = useState<boolean>(true); // slide-in toggle
  const [logs, setLogs] = useState<string[]>([
    "ONBI optical sensors calibrated.",
    "Desk zone secure. Waiting to initialize routine."
  ]);
  const [completedCycles, setCompletedCycles] = useState<number>(2);
  const [totalXp, setTotalXp] = useState<number>(550);

  const trackerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxTime = mode === 'focus' ? 25 * 60 : 5 * 60;

  // Custom log system
  const pushLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 3)]);
  };

  // Timer loop logic with demo simulation factor
  useEffect(() => {
    if (isRunning) {
      const speedFactor = isSimulating ? 15 : 1000; // Accelerated 15ms per click for testing loop
      trackerTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(trackerTimerRef.current!);
            setIsRunning(false);

            // Cycle switch triggers
            if (mode === 'focus') {
              setMode('rest');
              setTimeLeft(5 * 60);
              setCompletedCycles(c => c + 1);
              setTotalXp(x => x + 100);
              pushLog("🎉 Deep Focus Loop complete! +100 study score.");
              setShowNotification(true); // slide-in smartphone alert popup
              if (onStateUpdate) onStateUpdate('rest');
            } else {
              setMode('focus');
              setTimeLeft(25 * 60);
              pushLog("💪 Mindful Rest complete. Returning to deep focus loop.");
              if (onStateUpdate) onStateUpdate('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, speedFactor);
    } else {
      if (trackerTimerRef.current) clearInterval(trackerTimerRef.current);
    }

    return () => {
      if (trackerTimerRef.current) clearInterval(trackerTimerRef.current);
    };
  }, [isRunning, isSimulating, mode, onStateUpdate]);

  // Mode select triggers
  const selectMode = (newMode: 'focus' | 'rest') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    pushLog(`Switched manually to: ${newMode === 'focus' ? 'Focus Cycle' : 'Rest Break'}`);
    if (onStateUpdate) onStateUpdate(newMode);
  };

  const toggleRun = () => {
    setIsRunning(!isRunning);
    pushLog(isRunning ? "Session paused." : `Session active ${isSimulating ? '(Accelerated Demo)' : ''}`);
  };

  const resetSession = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    pushLog("Active cycle counter reset to default standard.");
  };

  // Trigger simulated children posture slouch event manually for parental showoff
  const simulatePostureDisturbance = () => {
    if (postureState === 'good') {
      setPostureState('leaning');
      pushLog("⚠️ ONBI alert: Slouched spine angle detected by lens camera.");
      if (onAlertTriggered) onAlertTriggered();
    } else {
      setPostureState('good');
      pushLog("💚 Posture corrected. Optimal safe focal distance achieved.");
    }
  };

  // SVG ring variables
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (timeLeft / maxTime) * circumference;

  const formatTimerDigital = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8" id="onbi_mvp_focus_redesign">
      
      {/* Intro pitch explaining the seamless automatic Desk Sensor activation */}
      <div className="bg-gradient-to-r from-indigo-950/65 via-slate-900/60 to-indigo-900/65 bg-white/80 text-white rounded-[32px] p-6 md:p-8 border border-white/10 shadow-[0_20px_50px_rgba(15,23,42,0.1)] relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> Auto-Start Technology
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
              A Seamless Flow Built for Pediatric Focus
            </h3>
            <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed font-normal">
              ONBI helps children start a focused study session automatically when they sit at the desk. After 25 minutes, ONBI gently guides them into a 5-minute rest.
            </p>
          </div>
          <button 
            onClick={() => {
              setIsSimulating(!isSimulating);
              pushLog(`Simulation changed to: ${!isSimulating ? 'Hyper Mode' : 'Realtime'}`);
            }}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-black border tracking-wide transition-all uppercase ${
              isSimulating 
                ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
            }`}
          >
            {isSimulating ? '⚡ Fast-Forwarding 150x' : '⏳ Test Speed Simulator'}
          </button>
        </div>
      </div>

      {/* Main bento interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPARTMENT: The Contrast Focus vs Rest Control Cards (6 Columns) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* LARGE 25-MIN FOCUS CARD - Glassmorphic upgrade */}
          <motion.div
            onClick={() => selectMode('focus')}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative rounded-3xl p-6 border transition-all cursor-pointer flex-1 flex flex-col justify-between overflow-hidden ${
              mode === 'focus'
                ? 'bg-white/65 bg-white/80 border-indigo-900/60 shadow-lg ring-1 ring-indigo-950/15'
                : 'bg-white/25 bg-white/70 border-white/50 opacity-70 grayscale-[15%] hover:opacity-100 hover:grayscale-0'
            }`}
          >
            {/* Visual focus element decoration */}
            {mode === 'focus' && (
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${mode === 'focus' ? 'bg-indigo-700' : 'bg-slate-400'}`} />
                  <span className="text-[10px] font-mono tracking-widest text-[#78756f] font-bold uppercase">
                    Stage 01 • Deep Concentration
                  </span>
                </div>
                <h4 className="font-display text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  25 Min Deep Study
                </h4>
              </div>
              <span className="text-xs font-mono font-bold bg-indigo-950 text-white px-2.5 py-1 rounded-full uppercase">
                ACTIVE FOCUS
              </span>
            </div>

            <p className="text-xs text-[#78756f] leading-relaxed mt-4 mb-4">
              ONBI turns off digital blue screen triggers. The physical lens maps distance to maintain child spinal health, while the head LED glows with high-contrast, non-intrusive slate indigo.
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
              <span className="text-[10px] font-mono font-bold bg-white/40 text-slate-800 px-2 py-1 rounded-lg border border-white/50 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-indigo-700" /> Phonics dialogues
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/40 text-slate-800 px-2 py-1 rounded-lg border border-white/50 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-indigo-700" /> Posture sentinel
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/40 text-slate-800 px-2 py-1 rounded-lg border border-white/50 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-indigo-700" /> +100 study XP
              </span>
            </div>
          </motion.div>

          {/* SMALLER 5-MIN REST CARD - Glassmorphic upgrade */}
          <motion.div
            onClick={() => selectMode('rest')}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
              mode === 'rest'
                ? 'bg-[#fffbeb]/55 bg-white/80 border-amber-500 shadow-lg ring-1 ring-amber-550/15'
                : 'bg-white/25 bg-white/70 border-white/50 opacity-70 grayscale-[15%] hover:opacity-100 hover:grayscale-0'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${mode === 'rest' ? 'bg-orange-500' : 'bg-slate-400'}`} />
                  <span className="text-[9px] font-mono tracking-widest text-[#78756f] font-bold uppercase">
                    Stage 02 • Healthy Breakout
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold text-slate-900 tracking-tight">
                  5 Min Rest Break
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">
                COOLDOWN
              </span>
            </div>

            <p className="text-xs text-[#78756f] leading-relaxed mt-2.5 mb-3">
              Gently alerts the child using soft audio stories. Physical LEDs shift to calming warm orange, prompting kids to relax their eyes, drink some water, and stretch.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-mono font-bold bg-white/40 text-slate-800 px-2 py-1 rounded-lg border border-white/50 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-orange-500" /> Spinal stretch
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/40 text-slate-800 px-2 py-1 rounded-lg border border-white/50 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-orange-500" /> Eye rest loop
              </span>
            </div>
          </motion.div>

        </div>

        {/* CENTER COMPARTMENT: The Premium Animated Circular Timer (6 Columns) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* THE TIMER DIAL - Glassmorphic upgrade */}
          <div className="bg-white/45 bg-white/80 border border-white/60 rounded-[40px] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.02)] flex flex-col items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-800 to-orange-500" />
            
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-[#78756f] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-indigo-700" /> Live Interactive Panel
              </span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < completedCycles ? 'bg-indigo-700' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            {/* Simulated interactive pointer layer trigger */}
            <motion.div 
              className="relative flex items-center justify-center w-[210px] h-[210px] cursor-pointer my-2 select-none"
              whileHover={{ scale: 1.04, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
            >
              {/* Animated Progress Circle with gradient glow */}
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="timerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={mode === 'focus' ? '#4f46e5' : '#f97316'} />
                    <stop offset="100%" stopColor={mode === 'focus' ? '#312e81' : '#ea580c'} />
                  </linearGradient>
                </defs>
                <circle
                  cx="105"
                  cy="105"
                  r={radius}
                  className="stroke-white/30 fill-none"
                  strokeWidth="11"
                />
                <motion.circle
                  cx="105"
                  cy="105"
                  r={radius}
                  fill="none"
                  stroke="url(#timerGlow)"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Inside Digital Counter Layout */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono tracking-widest text-[#78756f] uppercase font-black">
                  {mode === 'focus' ? 'FOCUS LOOP' : 'REST INTERVAL'}
                </span>
                <span className="text-4xl font-extrabold font-mono text-indigo-950 my-1 tracking-tight leading-none">
                  {formatTimerDigital(timeLeft)}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  mode === 'focus' ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-950' : 'bg-amber-50/70 border border-amber-100 text-orange-950'
                }`}>
                  {mode === 'focus' ? '25 Min Cycle' : '5 Min Break'}
                </span>
              </div>
            </motion.div>

            {/* Timer Core Micro-Interactions */}
            <div className="w-full flex items-center gap-3 mt-4 relative z-10">
              <button
                onClick={toggleRun}
                className={`flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-2xl font-bold font-mono text-xs text-white transition-all shadow-md cursor-pointer ${
                  isRunning 
                    ? 'bg-amber-500 hover:bg-orange-600 shadow-amber-500/20' 
                    : 'bg-indigo-950 hover:bg-indigo-900 shadow-indigo-950/20'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                {isRunning ? 'PAUSE TIMER' : 'START STUDY'}
              </button>

              <button
                onClick={resetSession}
                className="p-3.5 rounded-2xl bg-white/50 bg-white/60 hover:bg-white/80 border border-white/60 text-slate-800 transition-all hover:scale-105 cursor-pointer"
                title="Reset Routine"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* LOWER ROW: Parent phone mockup & status indicators */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        
        {/* LED INDICATOR PANEL MOCKUP - Glassmorphic upgrade */}
        <div className="md:col-span-5 bg-white/45 bg-white/80 border border-white/60 rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative shadow-[0_15px_35px_rgba(0,0,0,0.01)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78756f] font-bold block mb-4">
              ONBI Hardware Status Cues
            </span>

            {/* DYNAMIC SHIFTING LED GLOW ROW */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 flex flex-col justify-center items-center gap-3 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />
              
              {/* Glass shell reflector representation */}
              <div className="w-16 h-2 bg-slate-800 rounded-full border border-slate-700/60" />

              {/* Glowing Dynamic LED Dot changing core hue based on POMODORO Mode */}
              <motion.div 
                className="relative py-2"
                animate={{ scale: isRunning ? [1, 1.08, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {/* Simulated Halo Light emission ring */}
                <span className={`absolute inset-0 rounded-full filter blur-[10.5px] opacity-80 transition-all duration-700 ${
                  mode === 'focus' 
                    ? 'bg-indigo-500 drop-shadow-[0_0_20px_rgba(79,70,229,0.9)]' 
                    : 'bg-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.95)]'
                }`} style={{ width: 44, height: 16, top: 4, left: -14 }} />
                
                {/* Physical Core Tube */}
                <div className={`w-4 h-4 rounded-full border-2 border-white/90 relative z-15 transition-all duration-700 ${
                  mode === 'focus' ? 'bg-indigo-600' : 'bg-orange-500'
                }`} />
              </motion.div>

              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase transition-colors duration-500 ${
                mode === 'focus' ? 'text-indigo-400' : 'text-orange-400'
              }`}>
                {mode === 'focus' ? 'Indigo Matrix (Study focus)' : 'Amber Glow (Rest Cooldown)'}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {/* Real-time hardware corrector alerts */}
            <button
               onClick={simulatePostureDisturbance}
               className="w-full flex items-center justify-between p-3.5 rounded-2xl border bg-white/40  hover:bg-white/70 transition-all border-white/60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full transition-all ${
                  postureState === 'good' ? 'bg-emerald-500' :
                  postureState === 'leaning' ? 'bg-amber-400' : 'bg-red-500'
                }`} />
                <div className="text-left">
                  <div className="text-xs font-bold font-mono text-slate-800">Simulate Slouch Reminder</div>
                  <div className="text-[9px] text-zinc-500">Kind prompts speak: "Sit tall, buddy!"</div>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase bg-indigo-950 text-white px-2 py-0.5 rounded-lg">
                RUN TEST
              </span>
            </button>
          </div>
        </div>

        {/* SECURE PARENT APP PHONE NOTIFICATION MOCKUP - Glassmorphic upgrade */}
        <div className="md:col-span-7 bg-indigo-950/65 bg-white/80 rounded-3xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          
          <div className="absolute top-[-30px] right-[-30px] w-[140px] h-[140px] bg-indigo-800/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-[#93c5fd] font-bold uppercase">
                Smartphone Interoperability
              </span>
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className="text-[9px] font-mono font-black border border-white/10 hover:bg-white/5 text-[#cbd5e1] px-2.5 py-1 rounded-xl transition-all cursor-pointer"
              >
                {showNotification ? 'Hide Notification' : 'Show slide-in'}
              </button>
            </div>
            <p className="text-xs text-[#dbeafe]/80 leading-normal max-w-md">
              The companion Parent App works silently without distracting children. Get push alerts, configure routine durations, and monitor postural posture correction maps instantly.
            </p>
          </div>

          {/* iOS-Style slide-in Notification element */}
          <div className="mt-6 space-y-3 relative min-h-[92px]">
            <AnimatePresence>
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 35, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  className="bg-white/70 bg-white/70 rounded-2xl p-4 shadow-xl border border-white/50 text-[#18181a] flex gap-3 relative z-10"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center text-white shadow-md shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-indigo-950 tracking-wide uppercase">ONBI Companion Link</span>
                      <span className="text-[8px] font-mono text-[#78756f] font-bold">JUST NOW • DAILY GOAL</span>
                    </div>
                    <p className="text-xs text-slate-800 font-bold">
                      Leo is sitting beautifully tall! 🌟
                    </p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Completed standard Pomodoro loop (25m Focus / 5m Rest). +100 study score. Posture reminder maps optimal!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logs audit ledger footer */}
          <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-indigo-300">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Secure App encrypted mesh sync
            </span>
            <span>XP score: <b className="text-orange-400 font-bold font-mono">{totalXp} pts</b></span>
          </div>

        </div>

      </div>

    </div>
  );
}
