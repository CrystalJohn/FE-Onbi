'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from '@/components/landing/Header';
import IntroLoader from '@/components/landing/IntroLoader';
import ParentProblems from '@/components/landing/ParentProblems';
import { RobotMood } from '@/types/landing';
import { motion, AnimatePresence } from 'motion/react';
import { gsap, useGSAP } from '@/lib/gsap';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

// Lazy load heavy components (Three.js + below-fold sections)
const Robot3D = dynamic(() => import('@/components/landing/Robot3D'), { ssr: false });
const MiniTimer = dynamic(() => import('@/components/landing/MiniTimer'));
const Features = dynamic(() => import('@/components/landing/Features'));
const MeetOurTeam = dynamic(() => import('@/components/landing/MeetOurTeam'));
const Pricing = dynamic(() => import('@/components/landing/Pricing'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

function HomePageContent() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<RobotMood>('happy');
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const t = {
    en: {
      heroTitle: (
        <>
          Build{' '}
          <span className="bg-gradient-to-r from-[#0066cc] via-[#2f80ed] to-[#4f46e5] bg-clip-text text-transparent font-bold">
            English confidence
          </span>{' '}
          and{' '}
          <span className="bg-gradient-to-r from-[#8a2be2] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent font-bold">
            focus habits
          </span>{' '}
          in kids.
        </>
      ),
      heroDesc: 'A screen-free study companion for children aged 6–11. Gentle routines, zero screens, complete privacy.',
      heroCta: 'Order Your ONBI',
      heroSecondaryCta: 'Try Focus Timer ↗',
    },
    vi: {
      heroTitle: (
        <>
          Giúp con{' '}
          <span className="bg-gradient-to-r from-[#0066cc] via-[#2f80ed] to-[#4f46e5] bg-clip-text text-transparent font-bold">
            tự tin nói tiếng Anh
          </span>{' '}
          và{' '}
          <span className="bg-gradient-to-r from-[#8a2be2] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent font-bold">
            tập trung học tập
          </span>{' '}
          mỗi ngày.
        </>
      ),
      heroDesc: 'Bạn đồng hành học tập không màn hình cho trẻ 6–11 tuổi. Nhẹ nhàng, không gây nghiện, bảo mật tuyệt đối.',
      heroCta: 'Tìm hiểu ONBI',
      heroSecondaryCta: 'Trải nghiệm hẹn giờ ↗',
    }
  }[language];

  // GSAP scroll animations for footer
  useGSAP(() => {
    gsap.from('.landing-footer', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.landing-footer',
        start: 'top 90%',
        once: true,
      }
    });
  }, { scope: mainRef });

  // Preload the 3D model during intro loader
  useEffect(() => {
    const preload = async () => {
      try {
        const res = await fetch('/onbibear2-optimized.glb');
        // Read the full response to ensure it's cached by the browser
        await res.blob();
        setModelReady(true);
      } catch {
        // If preload fails, don't block the page forever
        setModelReady(true);
      }
    };
    preload();
  }, []);

  const handleLoaderComplete = useCallback(() => {
    // Only dismiss loader when model is also ready
    if (modelReady) {
      setIsLoading(false);
    }
  }, [modelReady]);

  // If loader animation finished but model wasn't ready yet,
  // dismiss as soon as model becomes ready
  useEffect(() => {
    if (modelReady && isLoading) {
      // Small delay to let the loader finish its animation gracefully
      const timeout = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [modelReady, isLoading]);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMoodFromTimer = (status: string) => {
    if (status === 'focus' || status === 'rest' || status === 'alert' || status === 'happy' || status === 'listening' || status === 'sleep') {
      setSelectedMood(status as RobotMood);
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-white text-[#18181a] font-sans antialiased selection:bg-indigo-950 selection:text-white pb-16 relative overflow-hidden">

      {/* Intro Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader-component"
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.65, ease: "easeInOut" } }}
          >
            <IntroLoader onComplete={handleLoaderComplete} modelReady={modelReady} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO ZONE: Navbar + Hero with solid Apple canvas background */}
      <div className="relative hero-height min-h-screen md:min-h-screen bg-white">
        {/* Apple style: Clean white pedestal background with smooth fade to page canvas at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-[#f7f6f2] to-white pointer-events-none" />

        {/* NAVBAR */}
        <Header
          onJoinClick={() => scrollToId('pricing_section')}
          onTimerClick={() => setShowTimerModal(true)}
        />

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-6 relative pt-6 md:pt-10 z-10">
          {/* SECTION 1: HERO — Product-centric layout */}
          <section id="hero_section" className="scroll-mt-24 relative min-h-[calc(100dvh-80px)] md:min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 md:py-0">

            {/* Main content container (stacks on mobile, 50/50 split grid on desktop) */}
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 md:gap-8 lg:gap-12 items-center justify-center flex-1 pt-4 md:pt-0 w-full">

              {/* Left Column: Text & CTA — Middle on mobile, Left 50% on desktop */}
              <motion.div
                className="relative w-full text-center md:text-left space-y-6 max-w-xl mx-auto md:mx-0 md:col-span-6 z-20 order-2 md:order-none flex flex-col justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] lg:text-[3.3rem] font-semibold text-[#1d1d1f] tracking-tight leading-[1.07] px-2 md:px-0">
                  {t.heroTitle}
                </h1>

                <p className="text-sm md:text-base lg:text-[17px] text-[#86868b] leading-relaxed font-normal tracking-tight px-4 md:px-0">
                  {t.heroDesc}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-2">
                  <button
                    id="hero_primary_cta"
                    onClick={() => scrollToId('pricing_section')}
                    className="bg-[#0066cc] hover:bg-[#0071e3] text-white font-normal px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-[17px] tracking-tight shrink-0 inline-flex items-center justify-center"
                  >
                    {t.heroCta}
                  </button>
                  <button
                    onClick={() => setShowTimerModal(true)}
                    className="text-[#0066cc] hover:text-[#0071e3] font-medium hover:underline transition-all duration-200 active:scale-95 cursor-pointer text-[17px] tracking-tight shrink-0 inline-flex items-center justify-center gap-1.5 px-6 py-3.5"
                  >
                    {t.heroSecondaryCta}
                  </button>
                </div>
              </motion.div>

              {/* Right Column: Robot 3D — Top on mobile, Right 50% on desktop */}
              <motion.div
                className="relative flex justify-center items-center w-full max-w-[360px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px] mx-auto md:col-span-6 z-10 order-1 md:order-none"
                initial={{ opacity: 0.5, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Robot3D currentMood={selectedMood} onMoodChange={setSelectedMood} />
              </motion.div>

            </div>

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
              className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl p-6 overflow-hidden flex flex-col items-center text-center z-10"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              {/* Blur accent lights inside modal */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#22d3ee]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close (X) Trigger */}
              <button
                onClick={() => setShowTimerModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title Header */}
              <div className="mb-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold bg-white/80 border border-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  🤖 INTERACTIVE SIMULATION
                </span>
                <h3 className="font-display text-lg font-extrabold text-slate-950 mt-2 tracking-tight">
                  ONBI Focus Timer
                </h3>
                <p className="text-[11px] text-[#78756f] max-w-xs mt-1.5 leading-relaxed font-medium">
                  Observe how ONBI's emotions change in real-time behind this popup as you start cycles or take breaks!
                </p>
              </div>

              {/* MiniTimer dial component */}
              <div className="w-full py-2 flex justify-center">
                <MiniTimer onStateUpdate={handleMoodFromTimer} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CORE BODY WRAPPER FOR IMMERSIVE PRESENTATION (Apple Pedestal Style) */}
      <div className="max-w-[1600px] mx-auto px-6 relative pt-20 md:pt-24 z-10">
        {/* SECTION 2: PARENT PROBLEMS */}
        <section id="parent_problems_section" className="scroll-mt-24">
          <ParentProblems />
        </section>
      </div>

      {/* CORE BODY WRAPPER FOR STANDARD LAYOUTS */}
      <div className="max-w-7xl mx-auto px-6 relative pt-20 md:pt-24 z-10">

        {/* MAIN SECTIONS */}
        <div className="space-y-24 md:space-y-36">

          {/* SECTION 6: FEATURES GRID */}
          <section id="features_grid_section" className="scroll-mt-24">
            <Features />
          </section>



          {/* SECTION 8: PRICING & EARLY ACCESS */}
          <section id="pricing_section" className="scroll-mt-24">
            <Pricing />
          </section>

          {/* SECTION 5: MEET OUR TEAM */}
          <section id="how_it_works_section" className="scroll-mt-24">
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
