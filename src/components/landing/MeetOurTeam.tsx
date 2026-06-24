'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { fadeUp, viewport } from '@/lib/animations';
import { useLanding } from '@/i18n/useLanding';
import type { LandingContent, TeamMemberData } from '@/i18n/landing';
import { BlurFade } from '@/components/ui/blur-fade';


interface MeetOurTeamProps {
  t: LandingContent;
}

export default function MeetOurTeam({ t: initialT }: MeetOurTeamProps) {
  const live = useLanding(initialT);
  const t = live.team;
  // null = no card hovered + all cards equal capsules (balanced default)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const team: TeamMemberData[] = t.team;

  // Determine card flex values based on state
  const getCardFlex = (idx: number): string => {
    if (hoveredIndex === null) return '1 1 0%'; // All equal — balanced capsules
    return hoveredIndex === idx ? '4 1 0%' : '0.6 1 0%'; // Expanded vs compressed
  };

  const getCardRadius = (idx: number): string => {
    if (hoveredIndex === null) return '999px'; // All capsules
    return hoveredIndex === idx ? '28px' : '999px'; // Expanded = rounded rect, others = capsule
  };

  return (
    <div className="space-y-4 pt-1 pb-8 w-full relative" id="meet_our_team_section">

      {/* ── Apple-style Section Header ── */}

      <div className="max-w-[1400px] mx-auto text-left space-y-2.5 px-6 relative z-10">
        <BlurFade delay={0.15} inView>
          <span className="text-sm md:text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight block">
            {t.tag}
          </span>
        </BlurFade>

        <BlurFade delay={0.25} inView>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.12] flex flex-col">
            <span>{t.titleLine1}</span>
            <span>{t.titleLine2}</span>
          </h2>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <p className="text-base md:text-[17px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-1">
            {t.subTitle}
          </p>
        </BlurFade>
      </div>

      {/* ── Team Cards – Expanding Cards / Flexbox Expand Effect ── */}
      <motion.div
        className="max-w-[1400px] mx-auto px-4 md:px-6 mt-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        {/* Desktop: Expanding flex cards (hover effect) */}
        <div
          className="hidden md:flex items-stretch gap-3 md:gap-4"
          style={{ height: 'clamp(360px, 32vw, 440px)' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {team.map((member, idx) => {
            const isActive = hoveredIndex === idx;
            const hasHover = hoveredIndex !== null;

            return (
              <div
                key={idx}
                className="relative overflow-hidden select-none cursor-pointer"
                style={{
                  flex: getCardFlex(idx),
                  minWidth: '60px',
                  borderRadius: getCardRadius(idx),
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
              >
                {/* Pastel background */}
                <div
                  className="absolute inset-0 z-0"
                  style={{ backgroundColor: member.bgColor }}
                />

                {/* Person photo — fixed size, card's overflow:hidden does the cropping */}
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={450}
                    height={600}
                    unoptimized
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[92%] w-auto max-w-none z-10 object-contain object-bottom pointer-events-none transition-transform duration-500"
                    sizes="20vw"
                  />
                
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.color} flex items-center justify-center z-10`}>
                    <span className="text-white font-bold text-4xl drop-shadow">{member.initials}</span>
                  </div>
                )}

                {/* Subtle darken on non-hovered cards when one is active */}
                {hasHover && !isActive && (
                  <div
                    className="absolute inset-0 z-15 pointer-events-none"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      transition: 'opacity 0.5s ease',
                    }}
                  />
                )}

                {/* Name + role overlay — fade-in only on the active/expanded card */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-6 md:px-7 md:pb-8 text-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.35s ease 0.15s, transform 0.45s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Gradient scrim for text readability */}
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)',
                    }}
                  />
                  <h3 className="font-display text-lg md:text-2xl font-bold text-white tracking-tight drop-shadow-lg whitespace-nowrap">
                    {member.name}
                  </h3>
                  <p className="text-white/85 text-xs md:text-sm font-semibold mt-1 drop-shadow">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: 2-column grid fallback (no hover effect on touch) */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] select-none"
              style={{ backgroundColor: member.bgColor }}
            >
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={300}
                  height={400}
                  unoptimized
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[90%] w-auto max-w-none z-10 object-contain object-bottom pointer-events-none"
                  sizes="50vw"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} flex items-center justify-center z-10`}>
                  <span className="text-white font-bold text-3xl drop-shadow">{member.initials}</span>
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 text-center"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 70%, transparent 100%)' }}
              >
                <h3 className="font-display text-sm font-bold text-white tracking-tight drop-shadow-lg">
                  {member.name}
                </h3>
                <p className="text-white/80 text-[10px] font-semibold mt-0.5 drop-shadow">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
