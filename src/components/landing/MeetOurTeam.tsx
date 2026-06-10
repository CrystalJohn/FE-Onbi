'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { fadeUp, viewport } from '@/lib/animations';
import { useLanguage } from '@/context/LanguageContext';
import { BlurFade } from '@/components/ui/blur-fade';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  avatar?: string;
  description?: string;
  bgColor: string;
  domeBg: string;
}

export default function HowItWorks() {
  const { language } = useLanguage();
  // null = no card hovered → all cards equal capsules (balanced default)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const t = {
    en: {
      tag: "The people behind ONBI.",
      titleLine1: "Meet the people",
      titleLine2: "behind ONBI.",
      subTitle: "A passionate team of designers, engineers, and educational visionaries building the future of screen-free childhood learning.",
      team: [
        {
          name: "Nguyễn Tấn Đạt",
          role: "Owner",
          initials: "NĐ",
          color: "from-orange-400 to-amber-500",
          avatar: "/avatar/Dat.webp",
          description: "Founder & Product Visionary of ONBI Tech. Passionate about child-safe AI and screen-free learning solutions for children.",
          bgColor: "#FDF0CD",
          domeBg: "#252542"
        },
        {
          name: "Nguyễn Phú Quí",
          role: "Co-founder",
          initials: "NQ",
          color: "from-emerald-400 to-green-500",
          avatar: "/avatar/Quy.webp",
          description: "Co-founder driving ONBI's growth strategy and connecting the brand with families across Vietnam and beyond.",
          bgColor: "#FAF1F0",
          domeBg: "#3D3A39"
        },
        {
          name: "Trần Phan Thanh Phúc",
          role: "Technical Team",
          initials: "TP",
          color: "from-blue-400 to-indigo-500",
          avatar: "/avatar/Phuc.webp",
          description: "Full-stack engineer developing the parent companion app and real-time monitoring dashboards.",
          bgColor: "#E6ECF8",
          domeBg: "#2E3138"
        },
        {
          name: "Lê Nguyễn Nguyên Khang",
          role: "Technical Team",
          initials: "NK",
          color: "from-pink-400 to-rose-500",
          avatar: "/avatar/Khang.webp",
          description: "Creative graphic designer crafting visual identities and child-friendly UI for the ONBI brand experience.",
          bgColor: "#FCE2CD",
          domeBg: "#EBD6C5"
        },
        {
          name: "Nguyễn Tuấn Kha",
          role: "Technical Team",
          initials: "TK",
          color: "from-indigo-400 to-violet-500",
          avatar: "/avatar/Kha.webp",
          description: "Software engineer building scalable backend systems and seamless integrations for the ONBI platform.",
          bgColor: "#FDF0CD",
          domeBg: "#1E2530"
        },
        {
          name: "Cao Bá Thiên",
          role: "Technical Team",
          initials: "CT",
          color: "from-cyan-400 to-teal-500",
          avatar: "/avatar/Thien.webp",
          description: "IT specialist managing infrastructure and ensuring secure, reliable systems behind every ONBI device.",
          bgColor: "#E6ECF8",
          domeBg: "#2A2B35"
        }
      ]
    },
    vi: {
      tag: "Đội ngũ đằng sau ONBI.",
      titleLine1: "Cùng xây dựng một người bạn học tập",
      titleLine2: "đáng tin cậy cho trẻ.",
      subTitle: "Chúng tôi phát triển ONBI với mục tiêu giúp trẻ hình thành thói quen học đều đặn hơn, đồng thời giúp phụ huynh theo dõi quá trình học của con một cách nhẹ nhàng, rõ ràng và an toàn.",
      team: [
        {
          name: "Nguyễn Tấn Đạt",
          role: "Nhà sáng lập / Owner",
          initials: "NĐ",
          color: "from-orange-400 to-amber-500",
          avatar: "/avatar/Dat.webp",
          description: "Người sáng lập & Định hướng Sản phẩm của ONBI Tech. Đầy nhiệt huyết với AI an toàn cho trẻ em và các giải pháp học tập không màn hình.",
          bgColor: "#FDF0CD",
          domeBg: "#252542"
        },
        {
          name: "Nguyễn Phú Quí",
          role: "Đồng sáng lập / Co-founder",
          initials: "NQ",
          color: "from-emerald-400 to-green-500",
          avatar: "/avatar/Quy.webp",
          description: "Đồng sáng lập thúc đẩy chiến lược phát triển của ONBI, kết nối thương hiệu với hàng triệu gia đình tại Việt Nam và quốc tế.",
          bgColor: "#FAF1F0",
          domeBg: "#3D3A39"
        },
        {
          name: "Trần Phan Thanh Phúc",
          role: "Đội ngũ Kỹ thuật",
          initials: "TP",
          color: "from-blue-400 to-indigo-500",
          avatar: "/avatar/Phuc.webp",
          description: "Kỹ sư Full-stack phát triển ứng dụng đồng hành cho ba mẹ và bảng điều khiển theo dõi thời gian thực.",
          bgColor: "#E6ECF8",
          domeBg: "#2E3138"
        },
        {
          name: "Lê Nguyễn Nguyên Khang",
          role: "Đội ngũ Kỹ thuật",
          initials: "NK",
          color: "from-pink-400 to-rose-500",
          avatar: "/avatar/Khang.webp",
          description: "Nhà thiết kế đồ họa sáng tạo, người xây dựng bộ nhận diện thương hiệu và giao diện thân thiện với trẻ em cho trải nghiệm ONBI.",
          bgColor: "#FCE2CD",
          domeBg: "#EBD6C5"
        },
        {
          name: "Nguyễn Tuấn Kha",
          role: "Đội ngũ Kỹ thuật",
          initials: "TK",
          color: "from-indigo-400 to-violet-500",
          avatar: "/avatar/Kha.webp",
          description: "Kỹ sư phần mềm phát triển hệ thống backend mở rộng và tích hợp mượt mà cho nền tảng ONBI.",
          bgColor: "#FDF0CD",
          domeBg: "#1E2530"
        },
        {
          name: "Cao Bá Thiên",
          role: "Đội ngũ Kỹ thuật",
          initials: "CT",
          color: "from-cyan-400 to-teal-500",
          avatar: "/avatar/Thien.webp",
          description: "Chuyên gia CNTT quản lý hạ tầng đám mây và đảm bảo hệ thống bảo mật, ổn định cho mỗi thiết bị ONBI.",
          bgColor: "#E6ECF8",
          domeBg: "#2A2B35"
        }
      ]
    }
  }[language];

  const team: TeamMember[] = t.team;

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
        <div
          className="flex items-stretch gap-3 md:gap-4"
          style={{ height: 'clamp(300px, 32vw, 440px)' }}
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
                    sizes="(max-width: 768px) 50vw, 20vw"
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
      </motion.div>
    </div>
  );
}
