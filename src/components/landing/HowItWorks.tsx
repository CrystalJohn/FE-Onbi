'use client'

import React from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainerSlow, teamCard, viewport } from '@/lib/animations';
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

  const t = {
    en: {
      tag: "The People Behind ONBI",
      title: "Meet Our Team",
      subTitle: "The passionate founders and engineers behind ONBI — building the future of screen-free childhood education.",
      cta: "Know More About Us",
      team: [
        {
          name: "Nguyễn Tấn Đạt",
          role: "Owner",
          initials: "NĐ",
          color: "from-orange-400 to-amber-500",
          avatar: "/nguyen_tan_dat_avatar.png",
          description: "Founder & Product Visionary of ONBI Tech. Passionate about child-safe AI and screen-free learning solutions for children."
        },
        {
          name: "Lê Nguyễn Nguyên Khang",
          role: "Technical Team",
          initials: "NK",
          color: "from-pink-400 to-rose-500",
          avatar: "/Khang.png",
          description: "Creative graphic designer crafting visual identities and child-friendly UI for the ONBI brand experience."
        },
        {
          name: "Nguyễn Tuấn Kha",
          role: "Technical Team",
          initials: "TK",
          color: "from-indigo-400 to-violet-500",
          avatar: "/kha.png",
          description: "Software engineer building scalable backend systems and seamless integrations for the ONBI platform."
        },
        {
          name: "Cao Bá Thiên",
          role: "Technical Team",
          initials: "CT",
          color: "from-cyan-400 to-teal-500",
          avatar: "/thien.png",
          description: "IT specialist managing infrastructure and ensuring secure, reliable systems behind every ONBI device."
        },
        {
          name: "Trần Phan Thanh Phúc",
          role: "Technical Team",
          initials: "TP",
          color: "from-blue-400 to-indigo-500",
          avatar: "/phuc.png",
          description: "Full-stack engineer developing the parent companion app and real-time monitoring dashboards."
        },
        {
          name: "Nguyễn Phú Quí",
          role: "Co-founder",
          initials: "NQ",
          color: "from-emerald-400 to-green-500",
          avatar: "/Quy.png",
          description: "Co-founder driving ONBI's growth strategy and connecting the brand with families across Vietnam and beyond."
        }
      ]
    },
    vi: {
      tag: "Đội ngũ đằng sau ONBI",
      title: "Gặp gỡ những người đồng hành",
      subTitle: "Những nhà sáng tạo và kỹ sư đam mê mang đổi mới an toàn vào hành trình học tập không màn hình của con.",
      cta: "Tìm hiểu thêm về chúng tôi",
      team: [
        {
          name: "Nguyễn Tấn Đạt",
          role: "Nhà sáng lập / Owner",
          initials: "NĐ",
          color: "from-orange-400 to-amber-500",
          avatar: "/nguyen_tan_dat_avatar.png",
          description: "Người sáng lập & Định hướng Sản phẩm của ONBI Tech. Đầy nhiệt huyết với AI an toàn cho trẻ em và các giải pháp học tập không màn hình."
        },
        {
          name: "Lê Nguyễn Nguyên Khang",
          role: "Đội ngũ Kỹ thuật",
          initials: "NK",
          color: "from-pink-400 to-rose-500",
          avatar: "/Khang.png",
          description: "Nhà thiết kế đồ họa sáng tạo, người xây dựng bộ nhận diện thương hiệu và giao diện thân thiện với trẻ em cho trải nghiệm ONBI."
        },
        {
          name: "Nguyễn Tuấn Kha",
          role: "Đội ngũ Kỹ thuật",
          initials: "TK",
          color: "from-indigo-400 to-violet-500",
          avatar: "/kha.png",
          description: "Kỹ sư phần mềm phát triển hệ thống backend mở rộng và tích hợp mượt mà cho nền tảng ONBI."
        },
        {
          name: "Cao Bá Thiên",
          role: "Đội ngũ Kỹ thuật",
          initials: "CT",
          color: "from-cyan-400 to-teal-500",
          avatar: "/thien.png",
          description: "Chuyên gia CNTT quản lý hạ tầng đám mây và đảm bảo hệ thống bảo mật, ổn định cho mỗi thiết bị ONBI."
        },
        {
          name: "Trần Phan Thanh Phúc",
          role: "Đội ngũ Kỹ thuật",
          initials: "TP",
          color: "from-blue-400 to-indigo-500",
          avatar: "/phuc.png",
          description: "Kỹ sư Full-stack phát triển ứng dụng đồng hành cho ba mẹ và bảng điều khiển theo dõi thời gian thực."
        },
        {
          name: "Nguyễn Phú Quí",
          role: "Đồng sáng lập / Co-founder",
          initials: "NQ",
          color: "from-emerald-400 to-green-500",
          avatar: "/Quy.png",
          description: "Đồng sáng lập thúc đẩy chiến lược phát triển của ONBI, kết nối thương hiệu với hàng triệu gia đình tại Việt Nam và quốc tế."
        }
      ]
    }
  }[language];

  const team: TeamMember[] = t.team;

  return (
    <div className="space-y-10" id="meet_our_team_section">
      {/* Header */}
      <motion.div
        className="text-center max-w-2xl mx-auto space-y-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        <span className="text-[11px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
          {t.tag}
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          {t.title}
        </h2>
        <p className="text-sm text-[#78756f] leading-relaxed font-medium">
          {t.subTitle}
        </p>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-26 pt-20"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainerSlow}
      >
        {team.map((member, idx) => (
          <motion.div key={idx} variants={teamCard} className="relative">
            {/* Avatar — overflowing top of card */}
            <div className="absolute -top-22 left-0 right-0 h-54 flex items-end justify-center pointer-events-none z-20">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-auto object-contain object-bottom drop-shadow-lg"
                />
              ) : (
                <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-4xl drop-shadow">{member.initials}</span>
                </div>
              )}
            </div>

            {/* Card */}
            <div className="relative bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              
              {/* Top decorative band — gradient pattern */}
              <div className={`relative h-32 bg-gradient-to-br ${member.color} overflow-hidden`}>
                {/* Decorative shapes */}
                <div className="absolute top-3 right-4 w-6 h-6 rotate-45 bg-white/20 rounded-sm" />
                <div className="absolute bottom-2 left-6 w-12 h-12 rotate-12 bg-white/15 rounded-tl-3xl" />
                <div className="absolute top-8 left-2 w-3 h-3 rounded-full bg-white/30" />
              </div>

              {/* Bottom info area */}
              <div className="px-5 pt-5 pb-6 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                  {member.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <button className="bg-[#22d3ee] hover:bg-cyan-400 text-white font-semibold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all text-sm">
          {t.cta}
        </button>
      </div>
    </div>
  );
}
