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
      <div className="max-w-[1024px] mx-auto space-y-6">
        
        {/* ── FOOTNOTES / LEGAL NOTES ── */}
        <div className="space-y-2 border-b border-[#d2d2d7] dark:border-zinc-800 pb-6 font-light text-[11px] leading-[1.6]">
          <p>{t.footnote1}</p>
          <p>{t.footnote2}</p>
        </div>

        {/* ── DIRECTORY COLS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
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

        <div className="border-t border-[#d2d2d7]/50 dark:border-zinc-800 pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#515154] dark:text-zinc-450 font-medium">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
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
