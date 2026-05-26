'use client'

import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
  avatar?: string;
  description?: string;
  highlights?: string[];
}

export default function HowItWorks() {
  const team: TeamMember[] = [
    {
      name: "Nguyễn Tấn Đạt",
      role: "Owner",
      initials: "NĐ",
      color: "from-orange-400 to-amber-500",
      avatar: "/nguyen_tan_dat_avatar.png",
      description: "Founder & Product Visionary of ONBI Tech. Passionate about child-safe AI and screen-free learning solutions for children.",
      highlights: [
        "Founder & Product Visionary of ONBI Tech",
        "Passionate about child-safe AI and EdTech innovation",
        "Experienced in IoT hardware and embedded systems",
      ]
    },
    {
      name: "Lê Nguyễn Nguyên Khang",
      role: "Technical Team",
      initials: "NK",
      color: "from-pink-400 to-rose-500",
      avatar: "/Khang.png",
      description: "Creative graphic designer crafting visual identities and child-friendly UI for the ONBI brand experience.",
      highlights: [
        "UI/UX design for ONBI companion app",
        "Brand identity and visual storytelling",
        "Child-friendly interface design specialist",
      ]
    },
    {
      name: "Nguyễn Tuấn Kha",
      role: "Technical Team",
      initials: "TK",
      color: "from-indigo-400 to-violet-500",
      avatar: "/kha.png",
      description: "Software engineer building scalable backend systems and seamless integrations for the ONBI platform.",
      highlights: [
        "Backend architecture & API development",
        "IoT device communication protocols",
        "Real-time data processing systems",
      ]
    },
    {
      name: "Cao Bá Thiên",
      role: "Technical Team",
      initials: "CT",
      color: "from-cyan-400 to-teal-500",
      avatar: "/Thiên1.png",
      description: "IT specialist managing infrastructure and ensuring secure, reliable systems behind every ONBI device.",
      highlights: [
        "Cloud infrastructure & DevOps",
        "Network security and data privacy",
        "System reliability and performance optimization",
      ]
    },
    {
      name: "Trần Phan Thanh Phúc",
      role: "Technical Team",
      initials: "TP",
      color: "from-blue-400 to-indigo-500",
      avatar: "/PHÚC.png",
      description: "Full-stack engineer developing the parent companion app and real-time monitoring dashboards.",
      highlights: [
        "Full-stack web & mobile development",
        "Parent dashboard & telemetry features",
        "WebRTC and real-time communication",
      ]
    },
    {
      name: "Nguyễn Phú Quí",
      role: "Co-founder",
      initials: "NQ",
      color: "from-emerald-400 to-green-500",
      avatar: "/Quy.png",
      description: "Co-founder driving ONBI's growth strategy and connecting the brand with families across Vietnam and beyond.",
      highlights: [
        "Co-founder & growth strategy lead",
        "Digital marketing and community building",
        "Brand partnerships and market expansion",
      ]
    },
  ];

  return (
    <div className="space-y-10" id="meet_our_team_section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
          The People Behind ONBI
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          Meet <span className="line-through text-slate-400 decoration-2">Our</span> <span className="text-[#22d3ee]">Your</span> Educators
        </h2>
        <p className="text-sm text-[#78756f] leading-relaxed font-medium">
          Learn from passionate creators and engineers who bring child-safe innovation into your child&apos;s educational journey.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-26 pt-20">
        {team.map((member, idx) => (
          <div key={idx} className="relative">
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

                <p className="text-xs text-slate-500 leading-relaxed">
                  {member.description}
                </p>

                {/* Bullet points */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <button className="bg-[#22d3ee] hover:bg-cyan-400 text-white font-semibold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all text-sm">
          Know More About Us
        </button>
      </div>
    </div>
  );
}
