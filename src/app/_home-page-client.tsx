'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { BlurFade } from '@/components/ui/blur-fade';
import Header from '@/components/landing/Header';
import ParentProblems from '@/components/landing/ParentProblems';
import TimerModalWrapper from '@/components/landing/TimerModalWrapper';
import type { Lang, LandingContent } from '@/i18n/landing';
import { useLanding } from '@/i18n/useLanding';
import HeroVideo from '@/components/landing/HeroVideo';

const Features = dynamic(() => import('@/components/landing/Features'));
const BlogSection = dynamic(() => import('@/components/landing/BlogSection'));
const MeetOurTeam = dynamic(() => import('@/components/landing/MeetOurTeam'));
const Pricing = dynamic(() => import('@/components/landing/Pricing'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

const HERO_PLAYBACK_IDS = {
  light: '02P3tbW4l7BAXM6KgUwPm00Hi8x2tbGEcO45w6R1Aw8jE',
  dark: 'zgPnGoDAvmp2NZcuXNPEnRpuyJNTelgeY5ED000073ev4',
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
  const live = useLanding(t);

  const scrollToId = useCallback((id: string) => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (!el) return;
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 72;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <TimerModalWrapper
      t={t}
      trigger={(openModal) => (
        <div className="min-h-screen bg-white dark:bg-black text-[#18181a] dark:text-[#f5f5f7] font-sans antialiased selection:bg-indigo-950 dark:selection:bg-blue-950 selection:text-white relative overflow-hidden">

          {/* HERO ZONE */}
          <div className="relative bg-white dark:bg-black">
            <Header
              onJoinClick={() => scrollToId('pricing_section')}
              onTimerClick={openModal}
              t={t}
            />

            <div className="w-full relative pt-0 md:pt-20 z-10">
              <section id="hero_section" className="scroll-mt-24 relative flex flex-col justify-start py-0 max-w-[1920px] mx-auto">
                <motion.div
                  className="relative z-10 flex flex-1 items-start justify-center w-full pt-0"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                >
                  <div className="relative w-full flex flex-col md:block md:aspect-video md:overflow-hidden md:bg-black md:transform md:-translate-y-16 lg:-translate-y-20 md:-mb-16 lg:-mb-20">
                    {/* VIDEO BOX — mobile: 16:9 block below text; md+: fills hero box */}
                    <div className="order-2 md:order-none relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-black md:absolute md:inset-0 md:aspect-auto [--hero-object-position:80%_50%] sm:[--hero-object-position:100%_50%] md:[--hero-object-position:50%_50%]">
                      <HeroThemeVideo />
                      <div
                        className="absolute inset-0 pointer-events-none z-10 hidden md:block"
                        style={{
                          background: 'linear-gradient(to right, rgba(6,27,58,0.52) 0%, rgba(10,42,94,0.28) 40%, rgba(10,42,94,0.05) 70%, transparent 75%)',
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* TEXT — mobile: solid blue panel above video; md+: left overlay on video */}
                    <div className="order-1 md:order-none z-20 px-5 pt-[var(--header-clear)] pb-8 md:p-0 bg-[linear-gradient(135deg,#0a2a5e,#0f3d8c)] md:bg-none md:absolute md:inset-0 md:flex md:items-center md:pt-12 md:px-16 lg:px-24 xl:px-32 md:pointer-events-none">
                      <div className="w-full md:w-[48%] lg:w-[42%] max-w-[520px] flex flex-col gap-3 md:gap-6 text-slate-900 dark:text-white">
                        <BlurFade delay={0.2}>
                          <h1
                            className="font-display font-semibold tracking-tight leading-[1.25] md:leading-[1.18]"
                            style={{ fontSize: 'clamp(1.65rem, 4.5vw, 4rem)', textShadow: '0 3px 18px rgba(0,0,0,0.1)' }}
                          >
                            {live.hero.title}
                          </h1>
                        </BlurFade>
                        <BlurFade delay={0.35}>
                          <p className="max-w-2xl text-sm md:text-lg leading-relaxed font-medium tracking-tight text-slate-700 dark:text-zinc-200/90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            {live.hero.description}
                          </p>
                        </BlurFade>
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-start gap-2.5 md:gap-3 pt-1 md:pt-4 md:pointer-events-auto">
                          <button
                            id="hero_primary_cta"
                            onClick={() => scrollToId('parent_problems_section')}
                            className="bg-white text-[#111113] hover:bg-white/90 font-semibold px-7 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-sm sm:text-base tracking-tight shrink-0 inline-flex items-center justify-center"
                          >
                            {live.hero.cta}
                          </button>
                          <button
                            onClick={openModal}
                            className="text-slate-800 dark:text-white bg-white/50 dark:bg-white/[0.16] border border-slate-800/15 dark:border-white/[0.35] font-semibold transition-all duration-200 active:scale-95 cursor-pointer text-sm sm:text-base tracking-tight shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-full backdrop-blur-md"
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

          {/* SECTIONS */}
          <div className="max-w-[1600px] mx-auto px-6 relative pt-0 z-10">
            <section id="parent_problems_section" className="scroll-mt-20">
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

          <Footer t={t} onTimerClick={openModal} />
        </div>
      )}
    />
  );
}
