'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { fadeUp, viewport } from '@/lib/animations';
import { useLanguage } from '@/context/LanguageContext';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  avatar?: string;
  description?: string;
}

export default function HowItWorks() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [cardWidth, setCardWidth] = useState<number>(340);
  const [gap, setGap] = useState<number>(32);

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
          avatar: "/nguyen_tan_dat_avatar.webp",
          description: "Founder & Product Visionary of ONBI Tech. Passionate about child-safe AI and screen-free learning solutions for children."
        },
        {
          name: "Nguyễn Phú Quí",
          role: "Co-founder",
          initials: "NQ",
          color: "from-emerald-400 to-green-500",
          avatar: "/Quy.webp",
          description: "Co-founder driving ONBI's growth strategy and connecting the brand with families across Vietnam and beyond."
        },
        {
          name: "Trần Phan Thanh Phúc",
          role: "Technical Team",
          initials: "TP",
          color: "from-blue-400 to-indigo-500",
          avatar: "/phuc.webp",
          description: "Full-stack engineer developing the parent companion app and real-time monitoring dashboards."
        },
        {
          name: "Lê Nguyễn Nguyên Khang",
          role: "Technical Team",
          initials: "NK",
          color: "from-pink-400 to-rose-500",
          avatar: "/Khang.webp",
          description: "Creative graphic designer crafting visual identities and child-friendly UI for the ONBI brand experience."
        },
        {
          name: "Nguyễn Tuấn Kha",
          role: "Technical Team",
          initials: "TK",
          color: "from-indigo-400 to-violet-500",
          avatar: "/kha.webp",
          description: "Software engineer building scalable backend systems and seamless integrations for the ONBI platform."
        },
        {
          name: "Cao Bá Thiên",
          role: "Technical Team",
          initials: "CT",
          color: "from-cyan-400 to-teal-500",
          avatar: "/thien.webp",
          description: "IT specialist managing infrastructure and ensuring secure, reliable systems behind every ONBI device."
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
          avatar: "/nguyen_tan_dat_avatar.webp",
          description: "Người sáng lập & Định hướng Sản phẩm của ONBI Tech. Đầy nhiệt huyết với AI an toàn cho trẻ em và các giải pháp học tập không màn hình."
        },
        {
          name: "Nguyễn Phú Quí",
          role: "Đồng sáng lập / Co-founder",
          initials: "NQ",
          color: "from-emerald-400 to-green-500",
          avatar: "/Quy.webp",
          description: "Đồng sáng lập thúc đẩy chiến lược phát triển của ONBI, kết nối thương hiệu với hàng triệu gia đình tại Việt Nam và quốc tế."
        },
        {
          name: "Trần Phan Thanh Phúc",
          role: "Đội ngũ Kỹ thuật",
          initials: "TP",
          color: "from-blue-400 to-indigo-500",
          avatar: "/phuc.webp",
          description: "Kỹ sư Full-stack phát triển ứng dụng đồng hành cho ba mẹ và bảng điều khiển theo dõi thời gian thực."
        },
        {
          name: "Lê Nguyễn Nguyên Khang",
          role: "Đội ngũ Kỹ thuật",
          initials: "NK",
          color: "from-pink-400 to-rose-500",
          avatar: "/Khang.webp",
          description: "Nhà thiết kế đồ họa sáng tạo, người xây dựng bộ nhận diện thương hiệu và giao diện thân thiện với trẻ em cho trải nghiệm ONBI."
        },
        {
          name: "Nguyễn Tuấn Kha",
          role: "Đội ngũ Kỹ thuật",
          initials: "TK",
          color: "from-indigo-400 to-violet-500",
          avatar: "/kha.webp",
          description: "Kỹ sư phần mềm phát triển hệ thống backend mở rộng và tích hợp mượt mà cho nền tảng ONBI."
        },
        {
          name: "Cao Bá Thiên",
          role: "Đội ngũ Kỹ thuật",
          initials: "CT",
          color: "from-cyan-400 to-teal-500",
          avatar: "/thien.webp",
          description: "Chuyên gia CNTT quản lý hạ tầng đám mây và đảm bảo hệ thống bảo mật, ổn định cho mỗi thiết bị ONBI."
        }
      ]
    }
  }[language];

  const team: TeamMember[] = t.team;

  // Responsive sizes listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardWidth(280);
        setGap(16);
      } else {
        setCardWidth(340);
        setGap(32);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay Timer Logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 1; // Increment by 1% every 50ms => 5000ms (5 seconds) per card
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle slide transition when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      setActiveIndex((idx) => (idx + 1) % team.length);
      setProgress(0);
    }
  }, [progress, team.length]);

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  const offset = -activeIndex * (cardWidth + gap);

  return (
    <div className="space-y-6 py-12 overflow-hidden w-full relative" id="meet_our_team_section">
      {/* Apple-style Premium Section Header */}
      <motion.div
        className="max-w-[1400px] mx-auto text-left space-y-4 px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        {/* Category Label */}
        <span className="text-[20px] md:text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight block">
          {t.tag}
        </span>

        {/* Giant Two-Line Apple-style Typography */}
        <h2 className="font-display text-4xl sm:text-5xl md:text-[76px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.08] flex flex-col">
          <span>{t.titleLine1}</span>
          <span>{t.titleLine2}</span>
        </h2>

        {/* Apple Signature Spacious Copy */}
        <p className="text-[19px] md:text-[21px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-2">
          {t.subTitle}
        </p>
      </motion.div>

      {/* Carousel Track Container */}
      <div className="relative w-full overflow-hidden py-10 mt-6 flex flex-col items-start">
        {/* The Track */}
        <div
          className="flex items-center shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `translateX(calc(50vw - ${cardWidth / 2}px + ${offset}px))`,
            gap: `${gap}px`,
            width: `${team.length * (cardWidth + gap) - gap}px`,
          }}
        >
          {team.map((member, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => goToSlide(idx)}
                className="shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none origin-center"
                style={{
                  opacity: isActive ? 1 : 0.35,
                  transform: `scale(${isActive ? 1.05 : 0.9})`,
                  filter: isActive ? 'grayscale(0) blur(0px)' : 'grayscale(0.6) blur(2px)',
                  zIndex: isActive ? 30 : 10,
                }}
              >
                {/* Main Card */}
                <div
                  className="relative rounded-3xl overflow-hidden cursor-pointer select-none transition-all duration-500 bg-[#f5f5f7] dark:bg-zinc-900 border border-transparent dark:border-zinc-850"
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardWidth * 1.15}px`,
                    boxShadow: isActive
                      ? '0 25px 50px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)'
                      : '0 5px 15px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Member Avatar Photo */}
                  <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center pointer-events-none z-10 overflow-hidden">
                    {member.avatar ? (
                      <motion.div
                        className="relative h-[82%] md:h-[88%] w-full"
                        animate={{
                          scale: isActive ? 1.05 : 0.95,
                          y: isActive ? 0 : 4
                        }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      >
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-contain object-bottom drop-shadow-md"
                          sizes="(max-width: 768px) 160px, 200px"
                        />
                      </motion.div>
                    ) : (
                      <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-4xl drop-shadow">{member.initials}</span>
                      </div>
                    )}
                  </div>

                  {/* Floating Nameplate at the bottom — premium glassmorphism rounded pill */}
                  <div
                    className="absolute bottom-4 inset-x-4 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md px-4 py-3 z-30 border border-white/50 dark:border-zinc-800/50 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] transition-all duration-300"
                    style={{
                      boxShadow: isActive 
                        ? '0 8px 32px 0 rgba(31,38,135,0.08), inset 0 0 0 1px rgba(255,255,255,0.6)' 
                        : '0 4px 16px 0 rgba(31,38,135,0.02), inset 0 0 0 1px rgba(255,255,255,0.4)'
                    }}
                  >
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {member.name}
                    </h3>
                    <p className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicator Controls Pill */}
      <div className="flex justify-center items-center mt-6 z-20 relative gap-3">
        {/* Left Container: Dots Pill */}
        <div className="bg-[#eef1f6] dark:bg-zinc-900 backdrop-blur-md rounded-full px-5 py-3.5 flex items-center shadow-xs border border-slate-200/30 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            {team.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className="relative cursor-pointer transition-all duration-300 focus:outline-none flex items-center justify-center"
                  style={{
                    width: isActive ? '44px' : '8px',
                    height: '8px',
                  }}
                >
                  {isActive ? (
                    <div className="w-full h-1.5 bg-slate-300 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-slate-600 dark:bg-zinc-400 rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    <div className="w-2 h-2 bg-slate-400 dark:bg-zinc-650 hover:bg-slate-500 dark:hover:bg-zinc-400 rounded-full transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Container: Separate Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-11 h-11 rounded-full bg-[#eef1f6] dark:bg-zinc-900 hover:bg-[#e2e8f0] dark:hover:bg-zinc-800 active:scale-95 text-slate-800 dark:text-zinc-200 flex items-center justify-center transition-all cursor-pointer border border-slate-200/30 dark:border-zinc-800 shadow-xs"
        >
          {isPlaying ? (
            <svg className="w-3.5 h-3.5 fill-slate-800 dark:fill-zinc-200" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 fill-slate-800 dark:fill-zinc-200 translate-x-[1px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
