'use client'

import React, { useState } from 'react';
import { Clock, ShieldAlert, Wifi, Sparkles, Languages, Cpu, Info, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGlow: string;
  details: string[];
}

export default function Features() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const featuresList: FeatureCard[] = [
    {
      id: 'pomodoro',
      title: "Pomodoro Focus Cycle",
      description: "Scientifically structured 25-minute study + 5-minute rest intervals. Cultivates natural deep focus patterns without fatigue.",
      category: "Focus HABIT",
      badge: "MVP FEATURE",
      icon: Clock,
      color: "text-indigo-600 border-indigo-200 bg-indigo-50",
      bgGlow: "group-hover:shadow-[0_20px_40px_rgba(79,70,229,0.08)]",
      details: [
        "Fully automated LED transitions with ambient audio guides",
        "Encourages kids to work in highly productive, short blocks",
        "Reduces stress and mental fatigue by enforcing structured breaks"
      ]
    },
    {
      id: 'posture',
      title: "Smart Posture Reminder",
      description: "ONBI's built-in wide camera tracks your child's posture. Speaks an affectionate, friendly reminder if they slouch or bend too low.",
      category: "HEALTH & SAFETY",
      badge: "AI VISION",
      icon: ShieldAlert,
      color: "text-amber-600 border-amber-200 bg-amber-50",
      bgGlow: "group-hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)]",
      details: [
        "Real-time localized AI vision camera (no cloud storage, fully private)",
        "Friendly audio prompts matching childhood storytelling voices",
        "Custom sensitivity levels via parent companion application"
      ]
    },
    {
      id: 'parent_progress',
      title: "Parent Sync & Reports",
      description: "Automatic background reports are synchronized to parent dashboards. Review real-time habits, focuses, and English conversation logs.",
      category: "METRIC SYSTEM",
      badge: "IOT INTEGRATION",
      icon: Wifi,
      color: "text-sky-600 border-sky-200 bg-sky-50",
      bgGlow: "group-hover:shadow-[0_20px_40px_rgba(14,165,233,0.08)]",
      details: [
        "Periodic background statistics sync, keeping parents up to date",
        "Generates weekly English vocabulary charts and speaking streaks",
        "Smart gamification checks to reward positive study habit achievements"
      ]
    },
    {
      id: 'companion',
      title: "Friendly AI Learning Buddy",
      description: "ONBI is more than a tool: she is an active comrade. Smiling, listening, and encouraging kids with responsive, whimsical reactions.",
      category: "COMPANIONSHIP",
      badge: "EMPATHY CORE",
      icon: Sparkles,
      color: "text-purple-600 border-purple-200 bg-purple-50",
      bgGlow: "group-hover:shadow-[0_20px_40px_rgba(147,51,234,0.08)]",
      details: [
        "Rich database of interactive eye gestures, expressions, and LEDs",
        "Responds to touch, head movement, and ambient environmental adjustments",
        "Nurtures emotional security and creates a positive association with daily study"
      ]
    },
    {
      id: 'english_speaking',
      title: "Confidence English Habits",
      description: "Daily 5-minute English dialogue exercises guided by ONBI. Child builds secure pronunciation through interactive storytelling games.",
      category: "ENGLISH COGNITIVE",
      badge: "DAILY HABIT",
      icon: Languages,
      color: "text-emerald-600 border-emerald-200 bg-emerald-50",
      bgGlow: "group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)]",
      details: [
        "Curated specifically for ESL kids (aged 6 to 11)",
        "Adaptive conversational pacing depending on vocabulary mastery",
        "Interactive situational roleplay (ordering a pizza, chatting with space explorers!)"
      ]
    },
    {
      id: 'ai_voice',
      title: "Future AI Voice Upgrade",
      description: "Next-gen localized LLM integration. ONBI will unlock context-aware conversations, customized child Q&As, and custom story narration.",
      category: "ROBOTICS CORE",
      badge: "V2 UPGRADE",
      icon: Cpu,
      color: "text-rose-600 border-rose-200 bg-rose-50",
      bgGlow: "group-hover:shadow-[0_20px_40px_rgba(225,29,72,0.08)]",
      details: [
        "Continuous over-the-air firmware upgrades with no extra fees",
        "Advanced child safety guards and content shielding filters",
        "Smart integration with local smart home sensors"
      ]
    }
  ];

  // Framer Motion staggered variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <div className="space-y-12" id="onbi_mvp_features_grid">
      {/* Editorial eyebrow header with scroll trigger */}
      <motion.div 
        className="text-center max-w-2xl mx-auto space-y-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-[11px] font-mono tracking-widest text-indigo-950 uppercase font-bold bg-white/40 px-3 py-1 rounded-full border border-white/50 shadow-2xs">
          Core Capabilities
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          How ONBI Empowers Daily Study Habits
        </h2>
        <p className="text-sm text-[#78756f] leading-relaxed font-medium">
          Structured by child psychologists and language tutors to maximize positive behaviors and safe, enjoyable study habits.
        </p>
      </motion.div>

      {/* Grid container (3 column layout) with staggered animation */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {featuresList.map((feat) => {
          const IconComponent = feat.icon;
          const isSelected = selectedId === feat.id;

          return (
            <motion.div
              key={feat.id}
              onClick={() => setSelectedId(isSelected ? null : feat.id)}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative bg-white/45 bg-white/70 border rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-950 bg-white/60 shadow-md ring-1 ring-indigo-950/20'
                  : 'border-white/60 shadow-2xs hover:border-[#18181a] bg-gradient-to-br from-white/50 to-white/20'
              } ${feat.bgGlow}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Styled Icon */}
                  <div className={`p-3 rounded-2xl border ${feat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Category Mono badge & badge text */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono tracking-wide text-[#b0ada6] uppercase font-bold">
                      {feat.category}
                    </span>
                    <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-white/50 border border-white/65 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-950 tracking-tight group-hover:text-indigo-950 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#78756f] mt-2.5 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>

              {/* Bottom Interactive Trigger Area */}
              <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[#78756f]">
                  {isSelected ? 'Collapse Specs' : 'Detailed Specifications'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-950 font-mono">
                    {isSelected ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Collapsible detail box */}
              {isSelected && (
                <div className="mt-4 p-4 rounded-2xl bg-indigo-950 text-indigo-100 border border-indigo-900 shadow-inner text-[11px] space-y-2 animate-fadeIn relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-900 rounded-full blur-xl" />
                  <div className="relative z-10 font-mono text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-orange-400" /> Specs Summary:
                  </div>
                  <ul className="relative z-10 space-y-1.5 list-disc list-inside text-indigo-100/95 font-sans">
                    {feat.details.map((detail, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
