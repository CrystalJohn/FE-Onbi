'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from '@/components/landing/Header';
import IntroLoader from '@/components/landing/IntroLoader';
import ParentProblems from '@/components/landing/ParentProblems';
import OnbiSolution from '@/components/landing/OnbiSolution';
import { RobotMood } from '@/types/landing';
import { motion, AnimatePresence } from 'motion/react';
import { gsap, useGSAP } from '@/lib/gsap';

// Lazy load heavy components (Three.js + below-fold sections)
const Robot3D = dynamic(() => import('@/components/landing/Robot3D'), { ssr: false });
const MiniTimer = dynamic(() => import('@/components/landing/MiniTimer'));
const Features = dynamic(() => import('@/components/landing/Features'));
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'));
const ProductCard = dynamic(() => import('@/components/landing/ProductCard'));
const EarlyAccessForm = dynamic(() => import('@/components/landing/EarlyAccessForm'));

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<RobotMood>('happy');
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animations for testimonials & footer
  useGSAP(() => {
    gsap.from('.testimonial-section', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.testimonial-section',
        start: 'top 85%',
        once: true,
      }
    });

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
    <div ref={mainRef} className="min-h-screen bg-[#f7f6f2] text-[#18181a] font-sans antialiased selection:bg-indigo-950 selection:text-white pb-16 relative overflow-hidden">
      
      {/* Full landing background (for everything below hero) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image src="/background_full_landing.png" alt="" fill sizes="100vw" className="object-cover" priority />
      </div>

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

      {/* HERO ZONE: Navbar + Hero with shared background */}
      <div className="relative hero-height min-h-screen md:min-h-screen">
        {/* Hero background covering navbar + hero section */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <Image 
            src="/background_hero_onbi.png" 
            alt="" 
            fill
            sizes="100vw"
            className="object-cover md:object-fill opacity-60 md:opacity-100 transition-opacity duration-300"
            priority
          />
          {/* Smooth gradient fade to blend the hero background into the #f7f6f2 page background */}
          <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-[#f7f6f2] via-[#f7f6f2]/80 to-transparent" />
        </div>

        {/* NAVBAR */}
        <Header 
          onJoinClick={() => scrollToId('pricing_section')} 
          onTimerClick={() => setShowTimerModal(true)} 
        />

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-6 relative pt-20 md:pt-10 z-10">
          {/* SECTION 1: HERO — Product-centric layout */}
          <section id="hero_section" className="scroll-mt-24 relative min-h-[calc(100dvh-80px)] md:min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 md:py-0">

            {/* Main content container (stacks on mobile, absolute on desktop) */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-start md:justify-center flex-1 gap-6 md:gap-0 pt-4 md:pt-0">
              
              {/* Robot Model — Top on mobile, Centered on desktop */}
              <motion.div 
                className="relative flex justify-center items-center w-full max-w-[280px] sm:max-w-[340px] md:max-w-[500px] lg:max-w-[580px] mx-auto md:absolute md:left-1/2 md:top-[48%] md:-translate-x-[40%] md:-translate-y-1/2 md:z-10 order-1 md:order-none"
                initial={{ opacity: 0.5, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Robot3D currentMood={selectedMood} onMoodChange={setSelectedMood} />
              </motion.div>

              {/* Bottom-left text: Middle on mobile, absolute bottom-left on desktop */}
              <motion.div 
                className="relative w-full text-center md:text-left space-y-4 max-w-md mx-auto md:mx-0 md:absolute md:bottom-20 lg:bottom-24 md:left-0 md:z-20 order-2 md:order-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                <h1 className="font-display text-2xl sm:text-3xl md:text-[2.2rem] lg:text-4xl font-bold text-slate-950 tracking-tight leading-[1.1] px-2 md:px-0">
                  Build English confidence and <span className="text-indigo-950 underline decoration-orange-500 decoration-wavy underline-offset-[8px] decoration-1">focus habits</span> in kids.
                </h1>

                <p className="text-sm text-[#78756f] leading-relaxed font-medium px-4 md:px-0">
                  A screen-free study companion for children aged 6–11. Gentle routines, zero screens, complete privacy.
                </p>

                <div className="pt-1 flex justify-center md:justify-start">
                  <button
                    id="hero_primary_cta"
                    onClick={() => scrollToId('pricing_section')}
                    className="flex items-center justify-between gap-4 bg-[#22d3ee] hover:bg-cyan-400 text-white font-semibold pl-7 pr-2 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm hover:-translate-y-0.5 cursor-pointer group"
                  >
                    <span>Order Your ONBI</span>
                    <span className="w-9 h-9 rounded-full bg-white/30 group-hover:bg-white/40 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
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

      {/* CORE BODY WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 relative pt-20 md:pt-24 z-10">

        {/* MAIN SECTIONS */}
        <div className="space-y-24 md:space-y-36">
          
          {/* SECTION 2: PARENT PROBLEMS */}
          <section id="parent_problems_section" className="scroll-mt-24">
            <ParentProblems />
          </section>

          {/* SECTION 6: FEATURES GRID */}
          <section id="features_grid_section" className="scroll-mt-24">
            <Features />
          </section>

          {/* SECTION 7: PRODUCT SPECS */}
          <section id="product_specs_section" className="scroll-mt-24">
            <ProductCard />
          </section>

          {/* SECTION 3: ONBI SOLUTION — temporarily hidden */}
          {/* <section id="onbi_solution_section" className="scroll-mt-24">
            <OnbiSolution />
          </section> */}

          {/* SECTION 8: PRICING & EARLY ACCESS */}
          <section id="pricing_section" className="scroll-mt-24">
            <EarlyAccessForm />
          </section>

          {/* SECTION 5: MEET OUR TEAM (HOW IT WORKS) */}
          <section id="how_it_works_section" className="scroll-mt-24">
            <HowItWorks />
          </section>

          {/* FOOTER */}
          <footer className="landing-footer border-t border-[#ccc9bf]/30 pt-12 text-center space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 bg-indigo-950 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xs">
                  O
                </div>
                <div>
                  <div className="text-xs font-bold text-[#18181a] font-mono leading-none">ONBI Tech Robotics</div>
                  <div className="text-[9px] text-[#78756f] font-mono">EST. 2026 • COPPA Compliant</div>
                </div>
              </div>
              
              <div className="flex gap-4.5 text-[10px] font-mono tracking-wide text-[#78756f]">
                <button onClick={() => scrollToId('hero_section')} className="hover:text-[#18181a] cursor-pointer">Introduction</button>
                <button onClick={() => setShowTimerModal(true)} className="hover:text-[#18181a] cursor-pointer">MVP Timer</button>
                <button onClick={() => scrollToId('product_specs_section')} className="hover:text-[#18181a] cursor-pointer">Engineering</button>
                <button onClick={() => scrollToId('pricing_section')} className="hover:text-[#18181a] cursor-pointer">Pricing</button>
              </div>
            </div>

            <p className="text-[10px] text-[#b0ada6] font-mono max-w-xl mx-auto leading-relaxed">
              Legal Notice: ONBI is a certified trademark of ONBI Tech. All rendered interactive prototypes, simulated hardware screens, and early membership passes are created for conceptual demonstration of the first physical MVP unit scheduled for production.
            </p>
          </footer>

        </div>

      </div>

    </div>
  );
}
