'use client'

import React, { useState, useEffect, useRef } from 'react';
import Robot3D from './Robot3D';
import { RobotMood } from '@/types/landing';
import { Eye, Languages, ShieldCheck, Sparkle } from 'lucide-react';

interface ShowcaseSlide {
  id: number;
  mood: RobotMood;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  specs: string[];
}

export default function StickyShowcase() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: ShowcaseSlide[] = [
    {
      id: 0,
      mood: 'focus',
      title: "Smart Posture Safeguard",
      tagline: "Protects critical childhood vision & spinal health",
      description: "As your child leans in, ONBI's localized AI lens continuously scans their distance. If they slouch below 35cm, she acts as a friendly guardian, alerting them with kind prompts to sit tall.",
      badge: "ERGONOMICS CORE",
      icon: Eye,
      specs: [
        "Local 100fps Depth Sensor Mapping",
        "Gentle, story-voice postural alerts",
        "Recommended by pediatric chiropractors"
      ]
    },
    {
      id: 1,
      mood: 'listening',
      title: "Confidence English Dialogues",
      tagline: "Natural speech training without the screen fatigue",
      description: "ONBI is an active conversational comrade. She speaks clean English phonics, waits for your child to speak, reacts with dynamic LED talking waves, and builds emotional talking confidence.",
      badge: "ESL COGNITION",
      icon: Languages,
      specs: [
        "Optimized dialogue speed for ESL learners",
        "Emotional microexpression feedback cycles",
        "No toxic screen triggers or gaming loops"
      ]
    },
    {
      id: 2,
      mood: 'happy',
      title: "The Zero-Cloud Privacy Shield",
      tagline: "100% localized safety, certified COPPA compliant",
      description: "Because children deserve absolute physical and digital boundaries, ONBI processes everything locally. No video streams or audio records are ever uploaded to cloud servers.",
      badge: "CHILDHOOD SECURE",
      icon: ShieldCheck,
      specs: [
        "Fully fully-isolated local processor chips",
        "Mesh encryption to parent app dashboards",
        "FCC, CE & EN71 child-certified hardware"
      ]
    }
  ];

  // Scroll-driven: container is tall, we detect which "page" user is on
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        const viewportTop = -rect.top;

        if (viewportTop < 0 || rect.bottom < 0) return;

        const progress = viewportTop / (containerHeight - window.innerHeight);
        const index = Math.min(
          Math.max(Math.floor(progress * slides.length), 0),
          slides.length - 1
        );
        setActiveSlide(index);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [slides.length]);

  const currentSlide = slides[activeSlide];
  const SlideIcon = currentSlide.icon;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '80vh' }}
      id="onbi_sticky_product_showcase"
    >
      {/* Sticky viewport - stays in place while user scrolls through */}
      <div className="sticky top-20 h-[calc(100vh-6rem)] flex flex-col">

        {/* Title */}
        <div className="text-center space-y-3 mb-8 px-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
            <Sparkle className="w-3 h-3 text-orange-500 fill-orange-500" />
            Cinematic Product Tour
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-indigo-950 tracking-tight leading-tight">
            How ONBI Adapts to Your Child&apos;s Flow
          </h2>
        </div>

        {/* Content area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 items-center">

          {/* LEFT: Card content - CSS transition */}
          <div className="relative min-h-[360px]">
            <div
              key={currentSlide.id}
              className="p-6 md:p-8 rounded-3xl border border-white/60 bg-white/60 transition-opacity duration-400"
            >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950 text-white flex items-center justify-center shadow-lg">
                    <SlideIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-indigo-800 uppercase font-black">
                    {currentSlide.badge}
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight mb-2">
                  {currentSlide.title}
                </h3>
                <p className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider mb-4">
                  {currentSlide.tagline}
                </p>

                <p className="text-sm text-[#78756f] leading-relaxed mb-6 font-medium">
                  {currentSlide.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-[#ccc9bf]/30">
                  {currentSlide.specs.map((spec, specIdx) => (
                    <div key={specIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/60 border border-white/60 flex items-center justify-center shadow-2xs">
                        <span className="text-[9px] font-mono font-bold text-indigo-950">{specIdx + 1}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#18181a]">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-6 justify-center">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-8 bg-indigo-950' : 'w-2 bg-[#ccc9bf]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: 3D Robot */}
          <div className="hidden lg:flex items-center justify-center">
            <Robot3D currentMood={currentSlide.mood} interactive={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
