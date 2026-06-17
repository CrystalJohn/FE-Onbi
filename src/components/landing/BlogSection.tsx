'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Lock, 
  X, 
  Bell 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLanding } from '@/i18n/useLanding';
import type { LandingContent } from '@/i18n/landing';
import { BlurFade } from '@/components/ui/blur-fade';
import { fadeUp, viewport } from '@/lib/animations';

interface BlogSectionProps {
  t: LandingContent;
}

export default function BlogSection({ t: initialT }: BlogSectionProps) {
  const live = useLanding(initialT);
  const t = live.blog;
  const { language } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const triggerToast = (message: string) => {
    setToastText(message);
    setShowToast(true);
  };


  return (
    <div className="w-full space-y-6 md:space-y-8 py-4 md:py-6 relative overflow-hidden bg-gradient-to-b from-transparent via-indigo-50/10 to-transparent dark:via-zinc-950/15" id="onbi_insights_blog">
      
      {/* Decorative MacOS/iOS style ambient background glows - Z-index 0 to sit on top of background but behind content */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-indigo-400/25 dark:bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none z-0 select-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-sky-300/20 dark:bg-sky-950/15 rounded-full blur-[120px] pointer-events-none z-0 select-none" />

      {/* Header section */}
      <div className="max-w-[1400px] mx-auto text-left space-y-2.5 px-6 relative z-10">
        <BlurFade delay={0.15} inView>
          <span className="text-sm md:text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight block">
            {t.tag}
          </span>
        </BlurFade>
        
        <BlurFade delay={0.25} inView>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.12] flex flex-col">
            <span>{t.titleLine1}</span>
            <span>{t.titleLine2}</span>
          </h2>
        </BlurFade>
        
        <BlurFade delay={0.35} inView>
          <p className="text-base md:text-[17px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-1">
            {t.description}
          </p>
        </BlurFade>
      </div>

      {/* Main Blog grid wrapper - Bento 1+2 layout */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Featured card - Navigation Link (left, vertical compact) */}
        <Link href="/blog/robot-ban-hoc-onbi-giai-phap-theo-doi-hoc-tap-thong-minh" className="block w-full h-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="group relative w-full h-full bg-[#f8f9fa]/40 dark:bg-white/8 border border-[#e2e8f0]/80 dark:border-white/15 rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-500 flex flex-col"
          >
            {/* Top visual cover (vertical card: image on top) */}
            <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
              <Image
                src="/blog/blog-1/image-1.jpg"
                alt={t.blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                fetchPriority="high"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Top-left category badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-600/90 dark:bg-indigo-500/95 text-white backdrop-blur-xs shadow-md">
                  {t.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent md:hidden" />
            </div>

            {/* Bottom info block */}
            <div className="w-full p-5 md:p-6 flex flex-col flex-1 space-y-3">
              <div className="space-y-4">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-550 dark:text-zinc-400 tracking-wider">
                  <span className="flex items-center gap-1.5 bg-[#ffffff]/60 dark:bg-zinc-850 px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-zinc-800">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    {t.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/25 px-2 py-0.5 rounded-sm uppercase tracking-widest border border-emerald-100/50 dark:border-emerald-900/30">
                    ★ {t.featuredBadge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                  {t.blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-650 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">
                  {t.blog.excerpt}
                </p>

              </div>

              {/* Read action */}
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-3 transition-all">
                <span>{t.readMore}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>

            </div>
          </motion.div>
        </Link>

        {/* 2. Two placeholder cards stacked vertically (right side of bento) */}
        <div className="flex flex-col gap-6 h-full">
          {t.placeholders.map((card, idx) => (
            <motion.div
              key={card.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              custom={idx}
              onClick={() => triggerToast(language === 'en' ? t.toastMsgEn : t.toastMsg)}
              className="group relative bg-[#f8f9fa]/25 dark:bg-white/4 border border-dashed border-[#d1d5db] dark:border-white/10 rounded-3xl p-5 cursor-pointer hover:bg-white/45 dark:hover:bg-white/8 hover:border-solid hover:border-slate-300 dark:hover:border-white/15 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 flex flex-col flex-1"
            >
              <div className="space-y-4">
                
                {/* Meta details & Status badge */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-zinc-450 bg-[#ffffff]/60 dark:bg-zinc-850 px-2.5 py-1 rounded-md border border-slate-200/40 dark:border-zinc-800">
                    {card.category}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    {t.comingSoon}
                  </span>
                </div>

                {/* Post Title */}
                <h4 className="font-display text-lg sm:text-xl font-bold text-slate-750 dark:text-zinc-350 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-3 leading-snug">
                  {card.title}
                </h4>

                {/* Excerpt */}
                <p className="text-slate-550 dark:text-zinc-450 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {card.excerpt}
                </p>

              </div>

              {/* Action indicator */}
              <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                <Bell className="w-3.5 h-3.5" />
                <span>{t.comingSoon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        </div>{/* end bento 1+2 grid */}

      </div>

      {/* Sleek Custom Notification Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 bg-slate-900/95 dark:bg-zinc-900/95 text-white border border-slate-800 dark:border-zinc-800 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm font-medium pr-2 whitespace-nowrap">
              {toastText}
            </p>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
