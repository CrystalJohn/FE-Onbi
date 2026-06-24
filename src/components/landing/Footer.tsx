'use client'

import React from 'react';
import { useLanding } from '@/i18n/useLanding';
import type { LandingContent } from '@/i18n/landing';

interface FooterProps {
  t: LandingContent;
  onTimerClick?: () => void;
}

export default function Footer({ t: initialT, onTimerClick }: FooterProps) {
  const live = useLanding(initialT);
  const t = live.footer;

  const socialLinks = [
    { label: 'TikTok', href: 'https://www.tiktok.com/@onbi20' },
    { label: 'Facebook', href: 'https://www.facebook.com/people/OnBi/61590592400269/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@MediaOnbi/shorts' },
  ];

  const handleLinkClick = (link: { action: string; target?: string }) => {
    if (link.action === 'scroll' && link.target) {
      const element = document.getElementById(link.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.action === 'timer' && onTimerClick) {
      onTimerClick();
    }
  };

  return (
    <footer className="landing-footer w-full bg-[#f5f5f7] dark:bg-black text-[#86868b] dark:text-zinc-500 text-[12px] font-normal leading-relaxed py-8 md:py-12 px-6 mt-16 border-t border-[#ccc9bf]/30 dark:border-zinc-900">
      <div className="max-w-[1024px] mx-auto space-y-5 sm:space-y-6">
        
        {/* ── FOOTNOTES / LEGAL NOTES ── */}
        <div className="space-y-2 border-b border-[#d2d2d7] dark:border-zinc-800 pb-6 font-light text-[11px] leading-[1.6]">
          <p>{t.footnote1}</p>
          <p>{t.footnote2}</p>
        </div>

        {/* ── DIRECTORY COLS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-x-4 gap-y-6 sm:gap-8 py-4">
          {t.cols.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-semibold text-[#1d1d1f] dark:text-white tracking-tight">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="hover:text-[#1d1d1f] dark:hover:text-white hover:underline cursor-pointer transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BREADCRUMBS TRAIL (Apple signature) ── */}
        <div className="border-t border-[#d2d2d7] dark:border-zinc-800 pt-5 flex items-center gap-1.5 text-[11px] font-light text-[#515154] dark:text-zinc-500">
          <span className="cursor-pointer hover:text-[#1d1d1f] dark:hover:text-white" onClick={() => scrollToId('hero_section')}>ONBI</span>
          <span>&gt;</span>
          <span className="text-[#86868b] dark:text-zinc-400">Smart IoT Study Companion</span>
        </div>

        {/* ── COPYRIGHT & POLICY LINKS ── */}
        <div className="pt-2 flex flex-col lg:flex-row lg:justify-between gap-4 text-[11px] text-[#86868b] dark:text-zinc-500 border-t border-[#d2d2d7]/50 dark:border-zinc-800 pt-4 font-light">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>{t.copyright}</span>
            <span className="hidden sm:inline text-[#d2d2d7] dark:text-zinc-800">|</span>
            <span className="text-[#515154] dark:text-zinc-400 font-medium">{t.coppa}</span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[#515154] dark:text-zinc-450 font-light">
            <a href="#" className="hover:underline hover:text-[#1d1d1f] dark:hover:text-white">{t.privacy}</a>
            <span className="text-[#d2d2d7] dark:text-zinc-800">|</span>
            <a href="#" className="hover:underline hover:text-[#1d1d1f] dark:hover:text-white">{t.terms}</a>
            <span className="text-[#d2d2d7] dark:text-zinc-800">|</span>
            <a href="#" className="hover:underline hover:text-[#1d1d1f] dark:hover:text-white">{t.sales}</a>
            <span className="text-[#d2d2d7] dark:text-zinc-800">|</span>
            <a href="#" className="hover:underline hover:text-[#1d1d1f] dark:hover:text-white">{t.legal}</a>
          </div>
        </div>

        <div className="border-t border-[#d2d2d7]/50 dark:border-zinc-800 pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#515154] dark:text-zinc-450 font-medium">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#1d1d1f] dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              {link.label === 'TikTok' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.23-2.61 1.05-5.23 3.23-6.44 1.8-.98 3.99-1.1 5.96-.34v4.13c-.93-.31-2.01-.26-2.85.25-.97.55-1.55 1.6-1.55 2.72-.01 1.25.75 2.45 1.89 2.87 1.15.42 2.5.17 3.42-.57.87-.71 1.34-1.81 1.34-2.92.01-4.71.01-9.42.01-14.13z" />
                </svg>
              )}
              {link.label === 'Facebook' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              )}
              {link.label === 'YouTube' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              )}
              {link.label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}

// Small inline helper to avoid standard scrollTo reference errors
function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
