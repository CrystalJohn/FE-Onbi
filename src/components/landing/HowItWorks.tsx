'use client'

import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  color: string;
}

export default function HowItWorks() {
  const team: TeamMember[] = [
    { name: "Nguyễn Tấn Đạt", role: "Graphic Design", initials: "NĐ", color: "from-orange-400 to-amber-500" },
    { name: "Lê Nguyễn Nguyên Khang", role: "Graphic Design", initials: "NK", color: "from-pink-400 to-rose-500" },
    { name: "Nguyễn Tuấn Kha", role: "Kỹ thuật phần mềm", initials: "TK", color: "from-indigo-400 to-violet-500" },
    { name: "Cao Bá Thiên", role: "Công nghệ thông tin", initials: "CT", color: "from-cyan-400 to-teal-500" },
    { name: "Trần Phan Thanh Phúc", role: "Kỹ thuật phần mềm", initials: "TP", color: "from-blue-400 to-indigo-500" },
    { name: "Nguyễn Phú Quí", role: "Digital Marketing", initials: "NQ", color: "from-emerald-400 to-green-500" },
  ];

  return (
    <div className="space-y-10" id="meet_our_team_section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
          The People Behind ONBI
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          Meet Our Team
        </h2>
        <p className="text-sm text-[#78756f] leading-relaxed font-medium">
          A passionate team of designers, engineers, and marketers building the future of childhood learning.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {team.map((member, idx) => (
          <div
            key={idx}
            className={`group relative rounded-3xl border border-white/60 bg-white/40 p-6 flex flex-col items-center text-center transition-all hover:bg-white/60 hover:shadow-md ${
              idx === 0 || idx === 5 ? 'md:col-span-1 md:row-span-1' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
              <span className="text-white font-bold text-lg md:text-xl">{member.initials}</span>
            </div>

            {/* Info */}
            <h3 className="font-bold text-sm md:text-base text-slate-950 leading-tight mb-1">
              {member.name}
            </h3>
            <p className="text-[11px] md:text-xs font-mono text-[#78756f] font-medium">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
