'use client'

import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  highlights: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Nguyễn Tấn Đạt',
    role: 'Owner',
    avatar: '/nguyen_tan_dat_avatar.png',
    highlights: [
      'Founder & Product Visionary of ONBI Tech',
      'Passionate about child-safe AI and EdTech innovation',
      'Experienced in IoT hardware and embedded systems',
      'Advocate for screen-free learning solutions for children',
    ],
  },
];

export default function MeetTeam() {
  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
          The People Behind ONBI
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          Meet Our Team
        </h2>
        <p className="text-sm text-[#78756f] leading-relaxed font-medium max-w-lg mx-auto">
          A dedicated team building the future of screen-free childhood education.
        </p>
      </div>
    </div>
  );
}
