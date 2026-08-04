'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import type { LandingContent } from '@/i18n/landing';

const MiniTimer = dynamic(() => import('@/components/landing/MiniTimer'));

interface TimerModalWrapperProps {
  t: LandingContent;
  /** Render a trigger element (e.g. button) that receives an `open` callback */
  trigger?: (open: () => void) => React.ReactNode;
}

/**
 * Client Island — owns the showTimerModal state and all modal UI.
 * The parent (Server Component or CCR root) can either:
 *  1. Render it standalone with no trigger (modal is controlled externally via ref — future)
 *  2. Pass a `trigger` render-prop so the open button lives inside this island
 */
export default function TimerModalWrapper({ t, trigger }: TimerModalWrapperProps) {
  const [open, setOpen] = useState(false);
  const { language: currentLang } = useLanguage();

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const pomodoroTimerImageSrc =
    currentLang === 'vi' ? '/pomodoro-timer-vi.webp' : '/pomodoro-timer.png';
  const pomodoroImageClass =
    currentLang === 'vi' ? 'object-contain object-left-top' : 'object-cover object-left';

  return (
    <>
      {trigger?.(openModal)}

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal card */}
            <motion.div
              className="relative w-full max-w-sm md:max-w-5xl bg-white dark:bg-zinc-900 md:bg-[#f3f8fe] md:dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden flex flex-col z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              {/* Desktop background image */}
              <div className="hidden md:block absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                  src={pomodoroTimerImageSrc}
                  alt="ONBI Focus Routine"
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className={pomodoroImageClass}
                  priority
                />
                <div
                  className={`absolute inset-y-0 right-0 bg-gradient-to-l from-[#f3f8fe] dark:from-zinc-950 via-[#f3f8fe]/95 dark:via-zinc-950/95 to-transparent ${
                    currentLang === 'vi' ? 'w-[38%]' : 'w-[45%]'
                  }`}
                />
              </div>

              {/* Close button */}
              <button
                onClick={closeModal}
                aria-label="Close timer modal"
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors cursor-pointer z-50 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 w-full h-full min-h-[400px] md:min-h-[480px]">
                <div className="hidden md:block md:col-span-7" />
                <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center p-6">
                  {/* Mobile header */}
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

                  {/* Desktop header */}
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

                {/* Mobile image preview */}
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
    </>
  );
}
