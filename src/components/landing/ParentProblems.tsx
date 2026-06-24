'use client'

import React, { useState } from 'react';
import { MessageSquareX, Timer, Compass, Sparkles, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUp, viewport } from '@/lib/animations';
import { useLanding } from '@/i18n/useLanding';
import type { LandingContent, ProblemId } from '@/i18n/landing';

const ICON_MAP: Record<ProblemId, React.ComponentType<{ className?: string }>> = {
  pomodoro: Timer,
  tracking: Compass,
  posture: MessageSquareX,
};

const TAB_IDS: ProblemId[] = ['pomodoro', 'tracking', 'posture'];

interface ParentProblemsProps {
  t: LandingContent;
}

export default function ParentProblems({ t: initialT }: ParentProblemsProps) {
  const [activeTab, setActiveTab] = useState<ProblemId>('pomodoro');
  const live = useLanding(initialT);
  const t = live.parentProblems;

  const handleTabClick = (tabId: ProblemId) => {
    setActiveTab(tabId);
  };

  const problemsWithIcon = t.problems.map((p) => ({ ...p, icon: ICON_MAP[p.id] }));

  return (
    <div
      id="parent_problems_section"
      className="space-y-6 md:space-y-8 w-full py-10 md:py-16"
      style={{ overflowAnchor: 'none' }}
    >
      {/* ── Section Header ── */}
      <motion.div
        className="max-w-[1400px] mx-auto w-full text-left space-y-2.5 px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        <span className="text-sm md:text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight block">
          {t.tag}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.12] flex flex-col">
          <span>{t.titleLine1}</span>
          <span>{t.titleLine2}</span>
        </h2>
        <p className="text-base md:text-[17px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-1">
          {t.description}
        </p>
      </motion.div>

      {/* ── Main Pedestal Container ── */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e8e8ed]/80 dark:border-zinc-800/80 rounded-[32px] md:rounded-[36px] p-5 sm:p-7 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.015)] relative overflow-hidden z-10 max-w-[1400px] mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/30 dark:from-zinc-950/20 via-white dark:via-zinc-900 to-slate-50/10 dark:to-zinc-950/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col-reverse lg:flex-row gap-8 lg:gap-16">

          {/* ── LEFT COLUMN: Apple-style Vertical Inline Accordion ── */}
          <div className="w-full lg:w-[45%] flex flex-col justify-start space-y-4 lg:space-y-5">
            {problemsWithIcon.map((prob) => {
              const TabIcon = prob.icon;
              const isSelected = activeTab === prob.id;

              return (
                <div
                  key={prob.id}
                  className={`w-full rounded-[24px] md:rounded-[28px] border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isSelected
                      ? 'bg-[#f5f5f7] dark:bg-zinc-950 border-[#e8e8ed]/80 dark:border-zinc-850 p-5 md:p-6 shadow-2xs'
                      : 'bg-[#f5f5f7]/60 dark:bg-zinc-950/40 hover:bg-[#f5f5f7] dark:hover:bg-zinc-950/80 border-transparent p-4 hover:shadow-3xs'
                  }`}
                >
                  {/* Accordion Item Header Trigger */}
                  <div
                    onClick={() => handleTabClick(prob.id)}
                    className="flex items-center gap-4 cursor-pointer select-none w-full group"
                  >
                    {/* Transforming Circle Indicator */}
                    <div className={`p-2 rounded-full transition-all duration-500 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-zinc-900 shadow-sm scale-105'
                        : 'bg-white dark:bg-zinc-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-zinc-250 shadow-3xs'
                    }`}>
                      {isSelected ? (
                        <TabIcon className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                      )}
                    </div>

                    {/* Tab Title */}
                    <span className={`font-semibold text-[15px] md:text-[16px] transition-colors duration-300 flex-1 ${
                      isSelected ? 'text-[#1d1d1f] dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white'
                    }`}>
                      {prob.tabTitle}
                    </span>

                    {/* Expand text label for collapsed items */}
                    {!isSelected && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 opacity-60 tracking-wider pr-1 hidden sm:block">
                        EXPAND
                      </span>
                    )}
                  </div>

                  {/* Accordion Content Drawer */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSelected ? 'max-h-[600px] opacity-100 mt-5' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-4 pt-1">
                      {/* Accent & Subtitle */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full block w-fit leading-none text-slate-800 dark:text-slate-355 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 shadow-3xs">
                          {prob.accent}
                        </span>
                        <h3 className="font-semibold text-lg md:text-xl tracking-tight leading-tight text-[#1d1d1f] dark:text-white">
                          {prob.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-[14px] md:text-[15px] text-[#1d1d1f]/80 dark:text-slate-300 leading-relaxed font-normal">
                        {prob.description}
                      </p>

                      {/* ONBI Solution Box */}
                      <div className="p-4 md:p-5 rounded-2xl shadow-3xs bg-white dark:bg-zinc-900 border border-[#e8e8ed]/60 dark:border-zinc-850">
                        <div className="flex items-center gap-1.5 mb-2 text-indigo-650">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/10" />
                          <span className="text-[10px] font-bold tracking-widest uppercase leading-none text-indigo-600">
                            {t.solutionLabel}
                          </span>
                        </div>
                        <p className="text-[13px] md:text-[14px] font-medium leading-relaxed opacity-90 text-slate-800 dark:text-slate-200">
                          {prob.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── RIGHT COLUMN: Video Showcase ── */}
          <div className="w-full lg:w-[55%] flex items-center justify-center">
            {/* All 3 videos rendered simultaneously, only active is visible.
                Stacked pattern ensures instant transitions without flickering or delay. */}
            <div className="w-full h-full aspect-[4/3] sm:aspect-video lg:aspect-auto lg:min-h-[500px] rounded-[32px] md:rounded-[40px] bg-[#f5f5f7] dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 shadow-inner relative overflow-hidden">
              {TAB_IDS.map((id) => (
                <video
                  key={id}
                  src={
                    id === 'pomodoro'
                      ? '/Coaching Time_video.mp4'
                      : id === 'tracking'
                      ? '/ONBI_robot_real-time.mp4'
                      : '/Screen Distraction_video.mp4'
                  }
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover absolute inset-0 rounded-[32px] md:rounded-[40px] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeTab === id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
