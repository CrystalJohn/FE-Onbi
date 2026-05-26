'use client'

import React from 'react';
import { Smile, CheckSquare, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function OnbiSolution() {
  const solutions = [
    {
      id: 'companion',
      title: "Friendly Study Companion",
      metric: "Affectionate Bond",
      description: "ONBI is more than a passive speaker; she interacts with responsive facial expressions, glowing physical ears, and joyful voice feedback. She listens intently, laughs, and rewards completed loops with custom whimsical physical responses, turning study sessions into an anticipated game.",
      icon: Smile,
      bullets: [
        "Interactive storytelling games building speech confidence",
        "Encouraging, responsive head-tilt & expressions",
        "Fully offline spoken interactions (no internet dependency)"
      ]
    },
    {
      id: 'habit',
      title: "Daily Focus Habit",
      metric: "Automated Routine",
      description: "By automatically recognizing table proximity, ONBI prompts children to begin deep focus study habits immediately when they sit. No complex parents setup or screen prompts required. The structured 25m Pomodoro loop transforms chaotic homework hours into solid, stress-free micro-rituals.",
      icon: CheckSquare,
      bullets: [
        "Starts focus tracking upon deskside sitting",
        "Limits digital distractions by setting table structure",
        "Nurtures attention muscle development in developmental minds"
      ]
    },
    {
      id: 'guidance',
      title: "Gentle Guidance",
      metric: "Soft Audio & LEDs",
      description: "To avoid harsh ringers or clock-ticking anxiety, ONBI uses binarized warm voices, playful chime triggers, and soft ambient multi-color physical LED lighting. Her safe diffused screen updates kids about the active state calmly, signaling the rest interval as a happy physical celebration.",
      icon: Sparkles,
      bullets: [
        "Soft amber cues and guided breathing cycles",
        "Protects physical sensory thresholds without startlers",
        "Diffusion panel block harmful screen glare and strain"
      ]
    },
    {
      id: 'visibility',
      title: "Parent Visibility",
      metric: "Localized Safe Sync",
      description: "Stay completely in touch without hovering over your child's shoulder. A fully offline-first app receives background reports of study minutes completed, postural safety alerts, and short text snippets of speech progress, giving parents perfect metrics and complete confidence.",
      icon: Eye,
      bullets: [
        "Vocal pronunciation replay & vocabulary progress trackers",
        "Spinal strain tracking metrics kept 100% secure and private",
        "Generous weekly habits reports straight to your phone"
      ]
    }
  ];

  return (
    <div id="onbi_solution_section" className="space-y-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 px-6 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
          The ONBI Response
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          How ONBI Safely Shields and Guides Tutors
        </h2>
        <p className="text-sm md:text-base text-[#78756f] max-w-xl mx-auto leading-relaxed font-medium">
          Our physical companion robot acts as a cozy deskside filter, letting high-quality active English study happen entirely screen-free.
        </p>
      </div>

      {/* Solutions Grid - 2x2 Bento style layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {solutions.map((sol, idx) => {
          const IconComponent = sol.icon;
          return (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/45 bg-white/80 border border-white/60 rounded-[32px] p-6 md:p-8 hover:border-indigo-950/40 hover:bg-white/60 transition-all flex flex-col justify-between shadow-2xs group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/20 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#e8e9f5]/55 border border-white text-indigo-950 rounded-2xl shadow-2xs group-hover:bg-indigo-950 group-hover:text-white transition-all">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg font-bold text-[#18181a] tracking-tight leading-none">
                        {sol.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 block mt-1">
                        {sol.metric}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#b0ada6] font-bold">
                    [0{idx + 1}]
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#78756f] leading-relaxed font-medium pt-2">
                  {sol.description}
                </p>

                {/* Specific features checklist */}
                <div className="pt-4 border-t border-[#ccc9bf]/30 space-y-2">
                  {sol.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✓</div>
                      <span className="text-xs font-mono font-bold text-slate-800 leading-normal">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ccc9bf]/20 flex items-center justify-between text-[9px] font-mono font-bold text-[#b0ada6]">
                <span>CORE SHIELD SOLUTION</span>
                <span className="text-indigo-950 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
