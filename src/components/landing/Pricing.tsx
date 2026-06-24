'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { useLanding } from '@/i18n/useLanding';
import type { LandingContent, PricingTier } from '@/i18n/landing';
import { BlurFade } from '@/components/ui/blur-fade';

interface PricingProps {
  t: LandingContent;
}

export default function Pricing({ t: initialT }: PricingProps) {
  const live = useLanding(initialT);
  const t = live.pricing;
  const router = useRouter();
  const activeTiers = t.tiers;
  const [hasDevice, setHasDevice] = useState<boolean>(false);

  // Helper component to render a single pricing card
  const renderCard = (tier: PricingTier) => {
    const isCyan = tier.colorTheme === 'cyan';
    const isBlue = tier.colorTheme === 'blue';
    const isAmber = tier.colorTheme === 'amber';
    const isSubscriptionLocked = tier.id === 'monthly' || tier.id === 'annual';

    // Custom styles per tier
    let cardStyle = "";
    let chevronGradient = "chevCyanGrad";
    let chevColor = "text-cyan-400/20";
    let badgeStyle = "bg-slate-100/80 dark:bg-zinc-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-zinc-800";
    let buttonStyle = "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white border-transparent";
    let iconBadgeSrc = "/icon_badge_Monthly Pass.webp";

    if (isCyan) {
      cardStyle = "border-slate-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-2xs hover:border-cyan-300 dark:hover:border-cyan-500/50 hover:shadow-[0_25px_60px_rgba(6,182,212,0.05)] hover:scale-[1.01]";
      chevronGradient = "chevCyanGrad";
      chevColor = "text-cyan-400/20";
      badgeStyle = "bg-cyan-500/10 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-500/30 dark:border-cyan-800/50";
      buttonStyle = "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white border-transparent hover:-translate-y-0.5";
      iconBadgeSrc = "/icon_badge_Monthly Pass.webp";
    } else if (isBlue) {
      cardStyle = "bg-gradient-to-br from-purple-50/90 via-white/95 to-indigo-50/90 dark:from-[#1c0a3a] dark:via-[#0c0422] dark:to-[#04010a] text-purple-950 dark:text-white border-purple-200/80 dark:border-purple-500/30 border-2 shadow-[0_25px_55px_rgba(168,85,247,0.12),_0_0_35px_rgba(99,102,241,0.06)] dark:shadow-[0_35px_75px_rgba(168,85,247,0.26),_0_0_65px_rgba(99,102,241,0.14)] scale-[1.015] md:scale-[1.025] hover:scale-[1.025] md:hover:scale-[1.035] hover:shadow-[0_30px_65px_rgba(168,85,247,0.18),_0_0_45px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_45px_85px_rgba(168,85,247,0.35),_0_0_75px_rgba(99,102,241,0.2)]";
      chevronGradient = "chevPurpleGrad";
      chevColor = "text-purple-300/20 dark:text-purple-400/30";
      badgeStyle = "bg-purple-100/80 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]";
      buttonStyle = "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 border-transparent";
      iconBadgeSrc = "/icon_badge_pricing_card.webp";
    } else if (isAmber) {
      cardStyle = "border-slate-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-2xs hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-[0_25px_60px_rgba(245,158,11,0.05)] hover:scale-[1.01]";
      chevronGradient = "chevAmberGrad";
      chevColor = "text-amber-400/25";
      badgeStyle = "bg-amber-500/10 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-800/50";
      buttonStyle = "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white border-transparent hover:-translate-y-0.5";
      iconBadgeSrc = "/icon_badge_Annual Pass.webp";
    }

    // Inner card JSX (shared for all tiers)
    const cardInner = (
      <div
        key={tier.id}
        className={`relative rounded-[30px] p-7 md:p-8 flex flex-col justify-between transition-all duration-500 ease-[0.16,1,0.3,1] backdrop-blur-xl select-none overflow-hidden isolate h-full w-full ${isBlue ? '' : 'border'} ${cardStyle}`}
      >
        {/* Glowing mesh background highlights */}
        {isBlue ? (
          <>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-bl from-purple-500/15 via-indigo-500/3 to-transparent rounded-[30px] pointer-events-none z-0" />
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl pointer-events-none z-0" />
          </>
        ) : (
          <div className={`absolute inset-0 w-full h-full bg-gradient-to-bl ${isCyan ? 'from-cyan-400/5 via-cyan-400/1' : 'from-amber-400/5 via-amber-400/1'} to-transparent pointer-events-none z-0`} />
        )}

        {/* Decorative Chevrons */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-90 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
          <svg viewBox="0 0 100 100" className={`w-full h-full ${chevColor} overflow-visible`} style={{ overflow: 'visible' }}>
            <defs>
              {isBlue && (
                <linearGradient id="chevPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                </linearGradient>
              )}
              {isCyan && (
                <linearGradient id="chevCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                </linearGradient>
              )}
              {isAmber && (
                <linearGradient id="chevAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                </linearGradient>
              )}
            </defs>
            <path d="M55 -10 L95 30 L60 65" fill="none" stroke={`url(#${chevronGradient})`} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M35 10 L75 50 L40 85" fill="none" stroke={`url(#${chevronGradient})`} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          </svg>
        </div>

        {/* Card Info Content */}
        <div className="relative z-10 flex flex-col flex-grow justify-between h-full">
          <div>
            {/* Badge */}
            {tier.badge && (
              <span className={`absolute top-0 right-0 text-[8.5px] font-black font-mono tracking-widest px-3 py-1.5 rounded-full uppercase border backdrop-blur-md z-10 flex items-center gap-1 ${badgeStyle}`}>
                {isBlue && (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-sky-300 dark:fill-sky-300 animate-spin" style={{ animationDuration: '6s' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                <span>{tier.badge}</span>
              </span>
            )}

            {/* Icon badge frame */}
            <div className={`w-14 h-14 rounded-full mb-6 relative z-10 overflow-hidden flex items-center justify-center bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border shadow-sm transition-all duration-300 hover:scale-105 ${isBlue ? 'border-purple-500/30' : 'border-slate-200/40 dark:border-zinc-800'}`}>
              <Image src={iconBadgeSrc} alt={tier.name} width={56} height={56} className="w-full h-full object-cover" draggable={false} />
            </div>

            <h3 className={`text-xl font-bold mb-1 ${isBlue ? 'text-purple-950 dark:text-white dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-purple-100 dark:to-indigo-100' : 'text-slate-900 dark:text-white'}`}>
              {tier.name}
            </h3>
            <p className={`text-sm font-medium leading-relaxed mb-5 min-h-[40px] ${isBlue ? 'text-purple-700 dark:text-purple-200/90' : 'text-slate-500 dark:text-slate-400'}`}>
              {tier.description}
            </p>

            <div className="flex items-baseline gap-1.5 mb-4">
              <span className={`text-3xl font-black tracking-tight ${isBlue ? 'text-purple-950 dark:text-white' : 'text-slate-900 dark:text-white'}`}>{tier.price}</span>
              <span className={`text-xs font-semibold ${isBlue ? 'text-purple-600 dark:text-purple-300/70' : 'text-slate-400 dark:text-slate-500'}`}>/{tier.period}</span>
            </div>

            {/* Divider */}
            <div className="relative flex items-center my-5 select-none">
              <div className={`flex-grow border-t ${isBlue ? 'border-purple-200 dark:border-purple-500/20' : 'border-slate-200/60 dark:border-zinc-800'}`} />
              <span className={`mx-3 flex-shrink text-[9px] font-mono font-bold tracking-[0.2em] uppercase ${isBlue ? 'text-purple-600 dark:text-purple-300/80' : 'text-slate-400 dark:text-slate-500'}`}>
                {tier.dividerLabel}
              </span>
              <div className={`flex-grow border-t ${isBlue ? 'border-purple-200 dark:border-purple-500/20' : 'border-slate-200/60 dark:border-zinc-800'}`} />
            </div>

            {/* Features */}
            <div className="space-y-3.5 mb-8">
              {tier.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-medium">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${isBlue ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300' : isAmber ? 'bg-amber-500/10 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'bg-cyan-500/10 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400'}`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={isBlue ? 'text-purple-900 dark:text-purple-200' : 'text-slate-700 dark:text-slate-300'}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            disabled={isSubscriptionLocked}
            aria-disabled={isSubscriptionLocked}
            onClick={() => {
              if (isSubscriptionLocked) return;
              router.push(`/pre-order?package=${tier.id}`);
            }}
            className={`w-full py-4.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group border ${
              isSubscriptionLocked
                ? 'cursor-not-allowed opacity-55 pointer-events-none bg-slate-100 text-slate-500 dark:bg-zinc-850 dark:text-zinc-500 border-transparent'
                : `cursor-pointer ${buttonStyle}`
            }`}
          >
            <span>{tier.cta}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isSubscriptionLocked ? '' : 'group-hover:translate-x-1'}`} />
          </button>
        </div>
      </div>
    );

    return cardInner;
  };

  return (
    <div className="space-y-10 md:space-y-12 relative animate-all duration-300" id="onbi_pricing_section_container">
      {/* Soft premium mesh background glows to elevate glassmorphism contrast */}
      <div className="absolute inset-0 -top-20 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-[10%] w-[350px] h-[350px] rounded-full bg-cyan-300/10 dark:bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/3 right-[15%] w-[450px] h-[450px] rounded-full bg-purple-400/10 dark:bg-purple-500/5 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] rounded-full bg-orange-300/5 dark:bg-orange-500/3 blur-[140px]" />
      </div>

      {/* Apple-style Premium Section Header */}
      <div className="max-w-[1400px] mx-auto text-left space-y-2.5 px-6 relative z-10">
        <BlurFade delay={0.15} inView>
          <span className="text-sm md:text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight block">
            {t.tag}
          </span>
        </BlurFade>

        <BlurFade delay={0.25} inView>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.12] flex flex-col">
            <span>{t.headingLine1}</span>
            <span>{t.headingLine2}</span>
          </h2>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <p className="text-base md:text-[17px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-1">
            {t.subheading}
          </p>
        </BlurFade>

        {/* Batch Release Info Badge */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50/80 dark:bg-orange-950/20 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-900/30 shadow-3xs">
            ✨ {t.batchInfo}
          </span>
        </div>
      </div>

      {/* D2C SEGMENTED TOGGLE (iOS Style) */}
      <div className="flex flex-col items-center justify-center relative z-20 px-6 gap-2">
        <div className="relative flex p-1 bg-slate-100/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full border border-slate-200/60 dark:border-zinc-800 max-w-xs w-full shadow-2xs select-none">
          {/* Sliding white background pill */}
          <motion.div
            className="absolute top-1 bottom-1 bg-white dark:bg-zinc-850 rounded-full shadow-sm z-0"
            layoutId="activeSegment"
            style={{ width: 'calc(50% - 4px)' }}
            animate={{ x: hasDevice ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          />
          <button
            onClick={() => setHasDevice(false)}
            className={`flex-1 relative z-10 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-tight text-center cursor-pointer transition-colors ${!hasDevice ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            {t.toggleNoDevice}
          </button>
          <button
            onClick={() => setHasDevice(true)}
            className={`flex-1 relative z-10 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-tight text-center cursor-pointer transition-colors ${hasDevice ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            {t.toggleHasDevice}
          </button>
        </div>

      </div>

      {/* Pricing Cards Grid (Switched based on hasDevice toggle) */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 mt-8 md:mt-12">
        <AnimatePresence mode="wait">
          {!hasDevice ? (
            // 1 centered hardware card for new purchase
            <motion.div
              key="hardware-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl mx-auto w-full"
            >
              {renderCard(activeTiers[1])}
            </motion.div>
          ) : (
            // 2 digital software renewal cards side-by-side
            <motion.div
              key="software-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full items-stretch"
            >
              {renderCard(activeTiers[0])}
              {renderCard(activeTiers[2])}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
