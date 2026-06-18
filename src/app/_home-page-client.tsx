'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { BlurFade } from '@/components/ui/blur-fade';
import Header from '@/components/landing/Header';
import ParentProblems from '@/components/landing/ParentProblems';
import HeroVideo from '@/components/landing/HeroVideo';
import type { Lang, LandingContent } from '@/i18n/landing';
import { useLanding } from '@/i18n/useLanding';
import { useLanguage } from '@/context/LanguageContext';

const MiniTimer = dynamic(() => import('@/components/landing/MiniTimer'));
const Features = dynamic(() => import('@/components/landing/Features'));
const BlogSection = dynamic(() => import('@/components/landing/BlogSection'));
const MeetOurTeam = dynamic(() => import('@/components/landing/MeetOurTeam'));
const Pricing = dynamic(() => import('@/components/landing/Pricing'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

const HERO_PLAYBACK_IDS = {
  light: 'hBUxfG3M6oXAFc9r01HT02IiDj5UB3IXRvO1C3q02wCk0000',
  dark: 'jsO5K1n4rUbiIWF1jL302sxUDH00SKe26Am00svJX6w7RM',
} as const;

function HeroThemeVideo() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  return (
    <HeroVideo
      key={theme}
      playbackId={HERO_PLAYBACK_IDS[theme]}
      className="pointer-events-none"
    />
  );
}

interface Props {
  lang: Lang;
  t: LandingContent;
}

export default function HomePageClient({ lang, t }: Props) {
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const live = useLanding(t);
  const { language: currentLang } = useLanguage();

  const pomodoroTimerImageSrc = currentLang === 'vi' ? '/pomodoro-timer-vi.webp' : '/pomodoro-timer.png';
  const pomodoroImageClass = currentLang === 'vi'
    ? 'object-contain object-left-top'
    : 'object-cover object-left';

  const scrollToId = (id: string) => {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#18181a] dark:text-[#f5f5f7] font-sans antialiased selection:bg-indigo-950 dark:selection:bg-blue-950 selection:text-white pb-16 relative overflow-hidden">

      {/* HERO ZONE */}
      <div className="relative hero-height min-h-screen md:min-h-screen bg-white dark:bg-black">
        <Header
          onJoinClick={() => scrollToId('pricing_section')}
          onTimerClick={() => setShowTimerModal(true)}
          t={t}
        />

        <div className="w-full relative pt-16 md:pt-20 z-10">
          <section id="hero_section" className="scroll-mt-24 relative flex flex-col justify-start py-0 max-w-[1920px] mx-auto">
            <motion.div
              className="relative z-10 flex flex-1 items-start justify-center w-full pt-0"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div className="relative w-full aspect-video overflow-hidden bg-black transform -translate-y-12 md:-translate-y-16 lg:-translate-y-20">
                <HeroThemeVideo />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to right, rgba(6,27,58,0.52) 0%, rgba(10,42,94,0.28) 40%, rgba(10,42,94,0.05) 70%, transparent 75%)',
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex items-start pt-[12%] px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pointer-events-none z-20">
                  <div className="max-w-3xl space-y-5 sm:space-y-6 text-white w-full">
                    <BlurFade delay={0.2}>
                      <h1
                        className="font-display text-3xl sm:text-4xl md:text-[3rem] lg:text-[4vw] xl:text-[4.5rem] font-semibold tracking-tight leading-[1.03]"
                        style={{ textShadow: '0 3px 18px rgba(0,0,0,0.22)' }}
                      >
                        {live.hero.title}
                      </h1>
                    </BlurFade>
                    <BlurFade delay={0.35}>
                      <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed font-medium tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                        {live.hero.description}
                      </p>
                    </BlurFade>
                    <div className="flex flex-col sm:flex-row items-start gap-3 md:pt-4 pointer-events-auto">
                      <button
                        id="hero_primary_cta"
                        onClick={() => scrollToId('pricing_section')}
                        className="bg-white text-[#111113] hover:bg-white/90 font-semibold px-7 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-sm sm:text-base tracking-tight shrink-0 inline-flex items-center justify-center"
                      >
                        {live.hero.cta}
                      </button>
                      <button
                        onClick={() => setShowTimerModal(true)}
                        className="text-white font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-sm sm:text-base tracking-tight shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.16)',
                          border: '1px solid rgba(255,255,255,0.35)',
                          backdropFilter: 'blur(14px)',
                          WebkitBackdropFilter: 'blur(14px)',
                        }}
                      >
                        {live.hero.ctaSecondary}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>

      {/* TIMER MODAL */}
      <AnimatePresence>
        {showTimerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTimerModal(false)}
            />
            <motion.div
              className="relative w-full max-w-sm md:max-w-5xl bg-white dark:bg-zinc-900 md:bg-[#f3f8fe] md:dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden flex flex-col z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <div className="hidden md:block absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                  src={pomodoroTimerImageSrc}
                  alt="ONBI Focus Routine"
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className={pomodoroImageClass}
                  priority
                />
                <div className={`absolute inset-y-0 right-0 bg-gradient-to-l from-[#f3f8fe] dark:from-zinc-950 via-[#f3f8fe]/95 dark:via-zinc-950/95 to-transparent ${currentLang === 'vi' ? 'w-[38%]' : 'w-[45%]'}`} />
              </div>

              <button
                onClick={() => setShowTimerModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors cursor-pointer z-50 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 w-full h-full min-h-[400px] md:min-h-[480px]">
                <div className="hidden md:block md:col-span-7" />
                <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center p-6">
                  <div className="block md:hidden text-center mb-2">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-bold bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800 px-2.5 py-0.5 rounded-full shadow-3xs">
                      INTERACTIVE SIMULATION
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white mt-1 tracking-tight">
                      ONBI Focus Timer
                    </h3>
                    <p className="text-[11px] text-[#78756f] dark:text-[#a1a1a6] max-w-xs mx-auto mt-1 leading-relaxed font-medium">
                      Start cycles, take breaks, and test the ONBI focus routine in real time.
                    </p>
                  </div>

                  <div className="hidden md:block text-center mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-extrabold bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/30 px-3 py-1 rounded-full shadow-3xs animate-pulse">
                      LIVE FOCUS TIMER
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 max-w-[240px] mx-auto mt-1.5 leading-relaxed font-medium">
                      Start a cycle and preview the ONBI focus routine from this modal.
                    </p>
                  </div>

                  <div className="w-full flex justify-center py-1 scale-95 md:scale-100">
                    <MiniTimer />
                  </div>
                </div>

                <div className="block md:hidden mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 w-full">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider text-center">
                    ONBI Focus Routine
                  </p>
                  <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl border border-slate-100 dark:border-zinc-850">
                    <Image
                      src={pomodoroTimerImageSrc}
                      alt="ONBI Focus Routine"
                      fill
                      sizes="(max-width: 768px) 100vw, 384px"
                      className={pomodoroImageClass}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTIONS */}
      <div className="max-w-[1600px] mx-auto px-6 relative pt-0 z-10">
        <section id="parent_problems_section" className="scroll-mt-24">
          <ParentProblems t={t} />
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative pt-8 md:pt-12 z-10">
        <div className="space-y-12 md:space-y-16">
          <section id="features_grid_section" className="scroll-mt-24">
            <Features t={t} />
          </section>
          <section id="blog_section" className="scroll-mt-24">
            <BlogSection t={t} />
          </section>
          <section id="pricing_section" className="scroll-mt-24">
            <Pricing t={t} />
          </section>
          <section id="how_it_works_section" className="scroll-mt-16">
            <MeetOurTeam t={t} />
          </section>
        </div>
      </div>

      <Footer t={t} onTimerClick={() => setShowTimerModal(true)} />
    </div>
  );
}
