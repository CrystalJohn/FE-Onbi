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
import type { BlogArticle, LandingContent } from '@/i18n/landing';
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

  const renderSecondaryCard = (card: BlogArticle, idx: number) => {
    const cardContent = (
      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        custom={idx}
        onClick={card.href ? undefined : () => triggerToast(language === 'en' ? t.toastMsgEn : t.toastMsg)}
        className={`group flex h-full min-h-[260px] flex-col overflow-hidden rounded-[18px] border bg-white/60 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white/75 hover:shadow-[0_24px_56px_rgba(15,23,42,0.12)] dark:bg-white/5 dark:shadow-none dark:hover:bg-white/8 ${
          card.href ? 'cursor-pointer border-white/15' : 'cursor-pointer border-dashed border-white/10 p-5'
        }`}
      >
        {card.image && (
          <div className="relative aspect-[16/8.3] w-full shrink-0 overflow-hidden">
            <Image
              src={card.image}
              alt={card.imageAlt || card.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className={card.href ? 'flex flex-1 flex-col gap-3 p-4 sm:p-5' : 'flex flex-1 flex-col gap-3'}>
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex max-w-[70%] items-center rounded-md bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-white/12 dark:text-zinc-200">
              {card.category}
            </span>
            {card.href ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {t.readMore}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <Lock className="h-2.5 w-2.5" />
                {t.comingSoon}
              </span>
            )}
          </div>

          {(card.author || card.date) && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
              {card.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  {card.author}
                </span>
              )}
              {card.date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  {card.date}
                </span>
              )}
            </div>
          )}

          <h4 className="font-display text-lg font-bold leading-tight text-slate-950 transition-colors line-clamp-2 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {card.title}
          </h4>

          <p className="text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-zinc-400">
            {card.excerpt}
          </p>

          <div className={`mt-auto inline-flex items-center gap-1.5 text-xs font-bold transition-all ${card.href ? 'text-indigo-600 group-hover:gap-2 dark:text-indigo-300' : 'text-slate-400 group-hover:text-indigo-500'}`}>
            {card.href ? <ArrowRight className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            <span>{card.href ? t.readMore : t.comingSoon}</span>
          </div>
        </div>
      </motion.article>
    );

    return card.href ? (
      <Link key={card.id} href={card.href} className="block h-full">
        {cardContent}
      </Link>
    ) : (
      <React.Fragment key={card.id}>{cardContent}</React.Fragment>
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden py-10 md:py-14"
      id="onbi_insights_blog"
    >
      <div className="mx-auto max-w-[1400px] space-y-8 px-4 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <BlurFade delay={0.15} inView>
              <span className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {t.tag}
              </span>
            </BlurFade>
            <BlurFade delay={0.25} inView>
              <h2 className="mt-2 font-display text-4xl font-bold leading-none text-slate-950 dark:text-white sm:text-5xl">
                {t.titleLine1} {t.titleLine2}
              </h2>
            </BlurFade>
            <BlurFade delay={0.35} inView>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-zinc-300">
                {t.description}
              </p>
            </BlurFade>
          </div>
          <Link
            href="/#blog_section"
            className="inline-flex min-h-11 w-max items-center justify-center rounded-full bg-white/80 px-5 text-sm font-bold text-slate-800 shadow-sm ring-1 ring-white/70 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-white/90 dark:text-slate-900"
          >
            {language === 'vi' ? 'Xem tất cả blog' : 'View all blogs'}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.65fr]">
          <Link href="/blog/robot-ban-hoc-onbi-giai-phap-theo-doi-hoc-tap-thong-minh" className="block h-full">
            <motion.article
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="group flex h-full min-h-[560px] flex-col overflow-hidden rounded-[20px] border border-white/20 bg-white/60 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_30px_70px_rgba(15,23,42,0.16)] dark:bg-white/5 dark:shadow-none dark:hover:bg-white/8"
            >
              <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden">
              <Image
                src="/blog/blog-1/image-1.jpg"
                alt={t.blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                fetchPriority="high"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                  {t.category}
                </span>
              </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 ring-1 ring-slate-200/60 dark:bg-white/8 dark:ring-white/10">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    {t.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                    {t.date}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {t.featuredBadge}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold leading-tight text-slate-950 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                  {t.blog.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-zinc-400">
                  {t.blog.excerpt}
                </p>

                <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition-all group-hover:gap-3 dark:text-indigo-300">
                  <span>{t.readMore}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.article>
          </Link>

          <div className="grid gap-6 md:grid-cols-2">
            {t.placeholders.map((card, idx) => renderSecondaryCard(card, idx))}
          </div>
        </div>
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

    </section>
  );
}
