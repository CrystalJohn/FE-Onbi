'use client'

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Mail, User, ShieldAlert, Award, ArrowRight, Sparkles, Check, ClipboardCopy } from 'lucide-react';

export default function EarlyAccessForm() {
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('7');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Custom reservation position for the early pass
  const [reservationNum, setReservationNum] = useState<number>(419);
  const [passCode, setPassCode] = useState('');

  // 3D pass tilt variables
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) {
      setErrorMsg('Please supply parent name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please supply a valid email address.');
      return;
    }

    setErrorMsg('');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedPasscode = `ONBI-2026-CH${childAge}-${randomSuffix}`;
    setPassCode(generatedPasscode);
    
    // Simulate batch counter increase randomly
    setReservationNum(Math.floor(400 + Math.random() * 1200));
    setIsSubmitted(true);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(passCode);
    alert('Reservation Passcode copied to your clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto font-sans" id="onbi_early_access_form_section">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/45 bg-white/80 border border-white/60 p-6 md:p-10 rounded-[32px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

        {/* LEFT COLUMN: Catchy headline marketing */}
        <div className="space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-indigo-950 uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
            Secure Early Placement
          </span>
          <h2 className="font-display text-3xl font-bold text-slate-950 tracking-tight leading-normal md:text-4xl">
            Make Daily Learning Feel <span className="text-indigo-800">Friendly</span>, Focused, and Fun.
          </h2>
          <p className="text-sm text-[#78756f] leading-relaxed font-medium">
            We are assembling physical units of ONBI for our primary batch launching late winter 2026. Join early access to claim special pricing and receive immediate beta access to the parent companion telemetry app.
          </p>
          
          <div className="space-y-2.5 pt-2 font-mono text-[11px] font-bold">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-5 h-5 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
              <span>No credit card required. Private parent registration.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-5 h-5 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
              <span>Priority reservation status for batch #1 shipping.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive State-Swapping Module - upgraded glass */}
        <div className="relative">
          {!isSubmitted ? (
            /* SignUp Form State */
            <form onSubmit={handleSubmit} className="space-y-4 bg-white/45 bg-white/70 border border-white/60 p-6 rounded-2xl relative shadow-2xs">
              <h3 className="text-xs font-bold font-mono tracking-wider text-indigo-950 uppercase border-b border-[#ccc9bf]/30 pb-2">
                RESERVE COMPANION PASS
              </h3>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200/60 text-xs font-medium flex items-center gap-2">
                  <span className="font-bold">⚠</span> {errorMsg}
                </div>
              )}

              <div className="space-y-3 pt-1">
                {/* Input 1: Parent Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Parent/Guardian Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-white/80 border border-[#ccc9bf]/50 focus:border-[#18181a] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-[#18181a] outline-none transition-colors"
                      required
                      id="ip_parent_name"
                    />
                  </div>
                </div>

                {/* Input 2: Kid's Age Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Child's Age (6-11 optimal)</label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full bg-white/80 border border-[#ccc9bf]/50 focus:border-[#18181a] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#18181a] outline-none font-medium transition-colors"
                    id="ip_child_age"
                  >
                    {[6, 7, 8, 9, 10, 11].map((age) => (
                      <option key={age} value={age}>Aged {age} years</option>
                    ))}
                  </select>
                </div>

                {/* Input 3: Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Parent Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="e.g. parent@study.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/80 border border-[#ccc9bf]/50 focus:border-[#18181a] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-[#18181a] outline-none transition-colors"
                      required
                      id="ip_parent_email"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="btn_submit_early_access"
                className="w-full bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs py-3.5 rounded-xl border border-indigo-950 text-center shadow-xs transition-all hover:translate-y-[-1px] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reserve Batch #1 Placement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[9px] text-center text-[#78756f] leading-normal pt-1.5 border-t border-[#ccc9bf]/30">
                *Your personal metrics are fully shielded. ONBI respects childhood safety and complies with international COPPA privacy guidelines.
              </p>
            </form>
          ) : (
            /* Interactive Early Access Member pass reveal (Dribbble micro-hologram pass card!) */
            <div className="flex flex-col items-center gap-4 animate-scaleUp">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono uppercase font-bold px-3 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3" /> Reservation active
                </div>
                <h3 className="text-base font-extrabold text-[#18181a] tracking-tight">
                  Your Digital Early Pass is Sealed!
                </h3>
              </div>

              {/* 3D Holo-card component */}
              <div 
                ref={cardRef}
                className="relative w-full max-w-[325px] h-[190px] cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900 p-5 rounded-2xl flex flex-col justify-between text-white shadow-lg overflow-hidden"
                  style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Subtle lighting overlay that follows mouse coordinates */}
                  <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />

                  <div className="flex justify-between items-start z-10" style={{ transform: 'translateZ(25px)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                        <span className="text-[9px] font-mono font-bold text-orange-400">O</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-mono tracking-tight leading-none">ONBI EARLY ROUND</span>
                        <span className="text-[7px] text-slate-400 tracking-widest uppercase">MEMBER PASS</span>
                      </div>
                    </div>
                    {/* Microchip */}
                    <div className="w-7 h-5 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-sm" />
                  </div>

                  {/* Pass code display */}
                  <div className="z-10 text-center py-2" style={{ transform: 'translateZ(30px)' }}>
                    <div className="text-lg font-mono font-bold tracking-widest text-orange-400">
                      {passCode}
                    </div>
                  </div>

                  <div className="flex justify-between items-end z-10" style={{ transform: 'translateZ(25px)' }}>
                    <div className="flex flex-col">
                      <span className="text-[7px] text-slate-400 uppercase font-mono tracking-wider">RESERVED MEMBER</span>
                      <span className="text-xs font-bold font-mono text-white truncate max-w-[150px]">
                        {parentName}
                      </span>
                    </div>

                    <div className="text-right flex flex-col">
                      <span className="text-[7px] text-slate-400 uppercase font-mono tracking-wider">BATCH PLACEMENT</span>
                      <span className="text-xs font-extrabold font-mono text-emerald-400">
                        #{reservationNum} of Round 1
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Utility buttons */}
              <div className="flex gap-2.5 w-full max-w-[325px]">
                <button
                  id="btn_copy_access_code"
                  onClick={handleCopyPass}
                  className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-mono font-semibold transition-colors"
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
                <button
                  id="btn_reset_signup_form"
                  onClick={() => setIsSubmitted(false)}
                  className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-slate-100 text-[#78756f] text-xs font-mono font-semibold transition-colors"
                >
                  New Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
