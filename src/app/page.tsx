'use client'

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/landing/Header';
import IntroLoader from '@/components/landing/IntroLoader';
import ParentProblems from '@/components/landing/ParentProblems';
import OnbiSolution from '@/components/landing/OnbiSolution';
import { RobotMood } from '@/types/landing';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';

// Lazy load heavy components (Three.js + below-fold sections)
const Robot3D = dynamic(() => import('@/components/landing/Robot3D'), { ssr: false });
const MiniTimer = dynamic(() => import('@/components/landing/MiniTimer'));
const Features = dynamic(() => import('@/components/landing/Features'));
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'));
const ProductCard = dynamic(() => import('@/components/landing/ProductCard'));
const EarlyAccessForm = dynamic(() => import('@/components/landing/EarlyAccessForm'));
const StickyShowcase = dynamic(() => import('@/components/landing/StickyShowcase'), { ssr: false });
const MeetTeam = dynamic(() => import('@/components/landing/MeetTeam'));

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<RobotMood>('happy');

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
    <div className="min-h-screen bg-[#f7f6f2] text-[#18181a] font-sans antialiased selection:bg-indigo-950 selection:text-white pb-16 relative overflow-hidden">
      
      {/* Full landing background (for everything below hero) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src="/background_full_landing.png" alt="" className="w-full h-full object-cover" />
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
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-800 via-indigo-950 to-orange-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* HERO ZONE: Navbar + Hero with shared background */}
      <div className="relative min-h-screen">
        {/* Hero background covering navbar + hero section */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img 
            src="/background_hero_onbi.png" 
            alt="" 
            className="w-full h-full"
            style={{ objectFit: 'fill' }}
          />
        </div>

        {/* NAVBAR */}
        <Header onJoinClick={() => scrollToId('early_access_section')} />

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-6 relative pt-6 md:pt-10 z-10">
          {/* SECTION 1: HERO — Product-centric layout */}
          <section id="hero_section" className="scroll-mt-24 relative min-h-[calc(100vh-80px)] flex flex-col justify-center">

            {/* Main content: Robot center + Timer right */}
            <div className="relative z-10 flex items-center justify-center flex-1">
              
              {/* Robot Model — centered */}
              <motion.div 
                className="flex justify-center items-center w-full max-w-[600px] ml-45 mt-20"
                initial={{ opacity: 0.5, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Robot3D currentMood={selectedMood} onMoodChange={setSelectedMood} />
              </motion.div>

              {/* Timer — positioned to the right of robot */}
              <motion.div
                className="absolute right-0 lg:right-8 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              >
                <MiniTimer onStateUpdate={handleMoodFromTimer} />
              </motion.div>
            </div>

            {/* Bottom-left: Text + CTA */}
            <motion.div 
              className="absolute bottom-32 left-0.5 z-20 space-y-4 max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 tracking-tight leading-[1.1]">
                Build English confidence and <span className="text-indigo-950 underline decoration-orange-500 decoration-wavy underline-offset-[8px] decoration-1">focus habits</span> in kids.
              </h1>

              <p className="text-sm text-[#78756f] leading-relaxed font-medium">
                A screen-free study companion for children aged 6–11. Gentle routines, zero screens, complete privacy.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  id="hero_primary_cta"
                  onClick={() => scrollToId('early_access_section')}
                  className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-950 text-white font-bold px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(31,38,135,0.15)] hover:shadow-md transition-all text-xs uppercase tracking-wider hover:-translate-y-0.5 cursor-pointer"
                >
                  Explore ONBI Pass
                </button>
                
                <button
                  id="hero_secondary_cta"
                  onClick={() => scrollToId('mvp_tracker_section')}
                  className="bg-white/70 hover:bg-white/90 border border-gray-200 text-[#18181a] font-bold px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all text-xs uppercase tracking-wider hover:-translate-y-0.5 cursor-pointer"
                >
                  View MVP Features
                </button>
              </div>
            </motion.div>

          </section>
        </div>
      </div>

      {/* CORE BODY WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 relative pt-20 md:pt-24 z-10">

        {/* MAIN SECTIONS */}
        <div className="space-y-24 md:space-y-36">
          
          {/* SECTION 2: PARENT PROBLEMS */}
          <section id="parent_problems_section" className="scroll-mt-24">
            <ParentProblems />
          </section>

          {/* SECTION 3: ONBI SOLUTION */}
          <section id="onbi_solution_section" className="scroll-mt-24">
            <OnbiSolution />
          </section>

          {/* SECTION 5: HOW IT WORKS */}
          <section id="how_it_works_section" className="scroll-mt-24">
            <HowItWorks />
          </section>

          {/* SECTION 6: FEATURES GRID */}
          <section id="features_grid_section" className="scroll-mt-24">
            <Features />
          </section>

          {/* SECTION 7: PRODUCT SPECS & SHOWCASE */}
          <section id="product_specs_section" className="scroll-mt-24 space-y-16">
            <ProductCard />
            <StickyShowcase />
          </section>

          {/* SECTION: MEET OUR TEAM */}
          <section id="team_section" className="scroll-mt-24">
            <MeetTeam />
          </section>

          {/* SECTION 8: EARLY ACCESS */}
          <section id="early_access_section" className="scroll-mt-24">
            <EarlyAccessForm />
          </section>

          {/* TESTIMONIALS & FAQS */}
          <section className="border-t border-[#ccc9bf]/30 pt-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-orange-500 uppercase font-bold">
                  TESTIMONIAL STORIES
                </span>
                <h3 className="font-display text-xl font-bold text-slate-950 tracking-tight">
                  What Parents are Saying from Beta Rounds
                </h3>
                <div className="bg-white/45 bg-white/70 border border-white/60 p-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.01)] space-y-4">
                  <p className="text-xs text-[#78756f] italic leading-relaxed">
                    &quot;Setting up English study cycles used to be a battle with tablets. ONBI turned deep learning into a concrete physical habit. Ben sits down at 4 PM, ONBI blinks, starts her 25m loop, and his posture is monitored perfectly. Total game changer.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center font-bold text-xs">
                      MK
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#18181a]">Marilyn K., Parent of Leo (Age 7)</div>
                      <div className="text-[10px] text-slate-400">California USA</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#78756f] uppercase font-bold">
                  PRIVACY & HARMONY FAQS
                </span>
                <h3 className="font-display text-xl font-bold text-slate-950 tracking-tight">
                  Adhering to Absolute Childhood Security
                </h3>
                <div className="space-y-3.5 bg-white/45 bg-white/70 border border-white/60 p-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.01)]">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#18181a]">Is child safety compromised with the camera?</h4>
                    <p className="text-[11px] text-[#78756f] leading-relaxed">
                      Absolutely not. The posture sensor operates locally. Video is never uploaded, recorded, or saved to cloud servers, securing your child&apos;s complete physical boundaries.
                    </p>
                  </div>
                  <div className="space-y-1.5 border-t border-[#ccc9bf]/30 pt-3">
                    <h4 className="text-xs font-bold text-[#18181a]">Does ONBI connect to Wi-Fi?</h4>
                    <p className="text-[11px] text-[#78756f] leading-relaxed">
                      Yes, it syncs reports securely using fully encrypted local mesh Wi-Fi to the caregiver companion dashboard. You can toggle Wi-Fi off and use simple Bluetooth instead.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-[#ccc9bf]/30 pt-12 text-center space-y-6">
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
                <button onClick={() => scrollToId('mvp_tracker_section')} className="hover:text-[#18181a] cursor-pointer">MVP Timer</button>
                <button onClick={() => scrollToId('product_specs_section')} className="hover:text-[#18181a] cursor-pointer">Engineering</button>
                <button onClick={() => scrollToId('early_access_section')} className="hover:text-[#18181a] cursor-pointer">Reserve</button>
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
