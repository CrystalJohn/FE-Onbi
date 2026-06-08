'use client'

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from '@/components/landing/Header';
import IntroLoader from '@/components/landing/IntroLoader';
import ParentProblems from '@/components/landing/ParentProblems';
import HeroVideo from '@/components/landing/HeroVideo';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Lazy load below-fold sections
const MiniTimer = dynamic(() => import('@/components/landing/MiniTimer'));
const Features = dynamic(() => import('@/components/landing/Features'));
const BlogSection = dynamic(() => import('@/components/landing/BlogSection'));
const MeetOurTeam = dynamic(() => import('@/components/landing/MeetOurTeam'));
const Pricing = dynamic(() => import('@/components/landing/Pricing'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

function HomePageContent() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem('hasLoadedIntro') === 'true') {
      setIsLoading(false);
    }
  }, []);
  
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const t = {
    en: {
      heroTitle: (
        <>
          Help your child focus better,
          <br className="hidden sm:inline" />{' '}
          without daily reminders.
        </>
      ),
      heroDesc: 'ONBI starts Pomodoro sessions automatically, sends gentle reminders, and keeps parents updated in real time.',
      heroCta: 'Learn about ONBI',
      heroSecondaryCta: 'Try Focus Timer',
    },
    vi: {
      heroTitle: (
        <>
          Giúp con{' '}
          <span className="text-white">
            tập trung học tốt hơn
          </span>
          ,<br className="hidden sm:inline" />{' '}
          ba mẹ{' '}
          <span className="text-white">
            bớt phải nhắc mỗi ngày
          </span>
          .
        </>
      ),
      heroDesc: 'Robot bạn học ONBI tự động theo dõi phiên học Pomodoro, nhắc nhở nhẹ nhàng và cập nhật tiến độ học tập về điện thoại phụ huynh.',
      heroCta: 'Tìm hiểu ONBI',
      heroSecondaryCta: 'Trải nghiệm hẹn giờ',
    }
  }[language];

  const pomodoroTimerImageSrc = language === 'vi' ? '/pomodoro-timer-vi.webp' : '/pomodoro-timer.png';
  // VI image is wider (longer title) so contain it to avoid cropping the right-side steps
  const pomodoroImageClass = language === 'vi'
    ? 'object-contain object-left-top'
    : 'object-cover object-left';

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasLoadedIntro', 'true');
    }
  }, []);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-white dark:bg-black text-[#18181a] dark:text-[#f5f5f7] font-sans antialiased selection:bg-indigo-950 dark:selection:bg-blue-950 selection:text-white pb-16 relative overflow-hidden">

      {/* Intro Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader-component"
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.15,
              filter: "blur(15px)",
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            <IntroLoader onComplete={handleLoaderComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO ZONE: Navbar + Hero with solid Apple canvas background */}
      <div className="relative hero-height min-h-screen md:min-h-screen bg-white dark:bg-black">
        {/* Apple style: Clean white pedestal background with smooth fade to page canvas at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-[#f7f6f2] dark:from-black to-white dark:to-black pointer-events-none" />

        {/* NAVBAR */}
        <Header
          onJoinClick={() => scrollToId('pricing_section')}
          onTimerClick={() => setShowTimerModal(true)}
        />

        {/* HERO CONTENT */}
        <div className="w-full relative pt-16 md:pt-20 z-10">
          {/* SECTION 1: HERO — Product-centric layout */}
          <section id="hero_section" className="scroll-mt-24 relative min-h-[calc(100dvh-80px)] md:min-h-[calc(100vh-80px)] flex flex-col justify-start py-0">

            <motion.div
              className="relative z-10 flex flex-1 items-start justify-center w-full pt-0"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div className="relative w-full min-h-[calc(100dvh-80px)] overflow-hidden bg-black md:min-h-0 md:aspect-video transform -translate-y-12 md:-translate-y-16 lg:-translate-y-20">
                {/* Light Mode Video — seamless crossfade loop */}
                <HeroVideo
                  playbackId="hBUxfG3M6oXAFc9r01HT02IiDj5UB3IXRvO1C3q02wCk0000"
                  className="pointer-events-none transition-opacity duration-1000 ease-in-out opacity-100 dark:opacity-0"
                />
                {/* Dark Mode Video — seamless crossfade loop */}
                <HeroVideo
                  playbackId="jsO5K1n4rUbiIWF1jL302sxUDH00SKe26Am00svJX6w7RM"
                  className="pointer-events-none transition-opacity duration-1000 ease-in-out opacity-0 dark:opacity-100"
                />

                {/* Left-side navy gradient overlay — improves text contrast without darkening the full hero */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to right, rgba(6,27,58,0.52) 0%, rgba(10,42,94,0.28) 40%, rgba(10,42,94,0.05) 70%, transparent 75%)',
                  }}
                  aria-hidden="true"
                />

                <div className="absolute inset-0 flex items-start pt-24 md:pt-32 lg:pt-40 px-6 sm:px-10 md:px-16 lg:px-24 pointer-events-none z-20">
                  <div className="max-w-3xl space-y-5 sm:space-y-6 text-white">
                    <h1
                      className="font-display text-3xl sm:text-4xl md:text-[3.4rem] lg:text-[4.5rem] font-semibold tracking-tight leading-[1.03]"
                      style={{ textShadow: '0 3px 18px rgba(0,0,0,0.22)' }}
                    >
                      {t.heroTitle}
                    </h1>
                    <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed font-medium tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      {t.heroDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start gap-3 pt-1 pointer-events-auto">
                      {/* Primary CTA — solid, high contrast */}
                      <button
                        id="hero_primary_cta"
                        onClick={() => scrollToId('pricing_section')}
                        className="bg-white text-[#111113] hover:bg-white/90 font-semibold px-7 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-sm sm:text-base tracking-tight shrink-0 inline-flex items-center justify-center"
                      >
                        {t.heroCta}
                      </button>
                      {/* Secondary CTA — enhanced glass button */}
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
                        {t.heroSecondaryCta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </section>
        </div>
      </div>

      {/* INTERACTIVE FOCUS TIMER MODAL */}
      <AnimatePresence>
        {showTimerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTimerModal(false)}
            />

            {/* Modal Box */}
            <motion.div
              className="relative w-full max-w-sm md:max-w-5xl bg-white dark:bg-zinc-900 md:bg-[#f3f8fe] md:dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden flex flex-col z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              {/* Desktop view: Beautiful visual background of ONBI Focus Routine */}
              <div className="hidden md:block absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                  src={pomodoroTimerImageSrc}
                  alt="ONBI Focus Routine"
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className={pomodoroImageClass}
                  priority
                />
                {/* Premium gradient overlay to blend into the interactive timer side smoothly */}
                <div className={`absolute inset-y-0 right-0 bg-gradient-to-l from-[#f3f8fe] dark:from-zinc-950 via-[#f3f8fe]/95 dark:via-zinc-950/95 to-transparent ${language === 'vi' ? 'w-[38%]' : 'w-[45%]'}`} />
              </div>

              {/* Close (X) Trigger */}
              <button
                onClick={() => setShowTimerModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors cursor-pointer z-50 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Container Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 w-full h-full min-h-[400px] md:min-h-[480px]">
                {/* Left Side spacer on Desktop to let the image steps show through */}
                <div className="hidden md:block md:col-span-7" />

                {/* Right Side: Interactive Timer Panel */}
                <div className="col-span-1 md:col-span-5 flex flex-col items-center md:items-end justify-start pt-6 md:pt-10 p-6 md:p-8 bg-white dark:bg-zinc-900 md:bg-transparent md:dark:bg-transparent rounded-3xl md:rounded-none z-10 text-center">
                  
                  {/* Container to push timer content to the right edge but keep elements centered within it */}
                  <div className="w-full flex flex-col items-center md:max-w-[280px] md:mr-4">
                    {/* Mobile Header: Visible only on mobile */}
                    <div className="block md:hidden text-center mt-2 mb-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-bold bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800 px-2.5 py-0.5 rounded-full shadow-3xs">
                        🤖 INTERACTIVE SIMULATION
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white mt-1 tracking-tight">
                        ONBI Focus Timer
                      </h3>
                      <p className="text-[11px] text-[#78756f] dark:text-[#a1a1a6] max-w-xs mx-auto mt-1 leading-relaxed font-medium">
                        Start cycles, take breaks, and test the ONBI focus routine in real time.
                      </p>
                    </div>
 
                    {/* Desktop Header: Visible only on desktop */}
                    <div className="hidden md:block text-center mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-extrabold bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/30 px-3 py-1 rounded-full shadow-3xs animate-pulse">
                        ⚡ LIVE FOCUS TIMER
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-450 max-w-[240px] mx-auto mt-1.5 leading-relaxed font-medium">
                        Start a cycle and preview the ONBI focus routine from this modal.
                      </p>
                    </div>

                    {/* MiniTimer dial component */}
                    <div className="w-full flex justify-center py-1 scale-95 md:scale-100">
                      <MiniTimer />
                    </div>
                  </div>

                  {/* Mobile Routine Image Card: Visible only on mobile */}
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CORE BODY WRAPPER FOR IMMERSIVE PRESENTATION (Apple Pedestal Style) */}
      <div className="max-w-[1600px] mx-auto px-6 relative pt-6 md:pt-8 z-10">
        {/* SECTION 2: PARENT PROBLEMS */}
        <section id="parent_problems_section" className="scroll-mt-24">
          <ParentProblems />
        </section>
      </div>

      {/* CORE BODY WRAPPER FOR STANDARD LAYOUTS */}
      <div className="max-w-7xl mx-auto px-6 relative pt-8 md:pt-12 z-10">

        {/* MAIN SECTIONS */}
        <div className="space-y-12 md:space-y-16">

          {/* SECTION 6: FEATURES GRID */}
          <section id="features_grid_section" className="scroll-mt-24">
            <Features />
          </section>

          {/* SECTION 7: BLOG / INSIGHTS */}
          <section id="blog_section" className="scroll-mt-24">
            <BlogSection />
          </section>

          {/* SECTION 8: PRICING & EARLY ACCESS */}
          <section id="pricing_section" className="scroll-mt-24">
            <Pricing />
          </section>

          {/* SECTION 5: MEET OUR TEAM */}
          <section id="how_it_works_section" className="scroll-mt-16">
            <MeetOurTeam />
          </section>

        </div>

      </div>

      {/* FOOTER */}
      <Footer onTimerClick={() => setShowTimerModal(true)} />

    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}
