'use client'

import React from 'react';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import { BlurFade } from '@/components/ui/blur-fade';
import { useLanding } from '@/i18n/useLanding';
import type { LandingContent } from '@/i18n/landing';

interface FeaturesProps {
  t: LandingContent;
}

export default function Features({ t: initialT }: FeaturesProps) {
  const live = useLanding(initialT);
  const t = live.features;

  const data = [
    {
      category: t.categories.focus,
      title: "Pomodoro Focus Cycle",
      src: "/Pomodoro Focus Cycle.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.focus.bold}</span>{" "}
            {t.cards.focus.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.health,
      title: "Smart Posture Guardian",
      src: "/Smart Posture Guardian.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.health.bold}</span>{" "}
            {t.cards.health.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.buddy,
      title: "Encouraging Study Buddy",
      src: "/Friendly Study Buddy.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.buddy.bold}</span>{" "}
            {t.cards.buddy.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.parent,
      title: "Real-time Progress Reports",
      src: "/Real-time Progress Reports.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.parent.bold}</span>{" "}
            {t.cards.parent.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.parent,
      title: "Study Timeline & Weekly Insights",
      src: "/Study%20Timeline%20%26%20Weekly%20Insights.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.insights.bold}</span>{" "}
            {t.cards.insights.rest}
          </p>
        </div>
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full space-y-6 md:space-y-8" id="onbi_mvp_features_grid">
      <div className="max-w-[1400px] mx-auto text-left space-y-2.5 px-6">
        {/* Category Label */}
        <BlurFade delay={0.15} inView>
          <span className="text-sm md:text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight block">
            {t.core}
          </span>
        </BlurFade>
        
        {/* Giant Two-Line Apple-style Typography */}
        <BlurFade delay={0.25} inView>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.12] flex flex-col">
            <span>{t.headingLine1}</span>
            <span>{t.headingLine2}</span>
          </h2>
        </BlurFade>
        
        {/* Apple Signature Spacious Copy */}
        <BlurFade delay={0.35} inView>
          <p className="text-base md:text-[17px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-1">
            {t.description}
          </p>
        </BlurFade>
      </div>
      <Carousel items={cards} />
    </div>
  );
}
