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

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="relative bg-white/60 backdrop-blur-sm border border-white/70 rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] max-w-sm w-full text-center space-y-4 hover:shadow-lg transition-shadow"
          >
            {/* Gradient background behind avatar */}
            <div className="relative mx-auto w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-b from-[#22d3ee]/20 to-[#22d3ee]/5 border border-[#22d3ee]/20">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name & Role */}
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                {member.name}
              </h3>
              <span className="text-xs font-mono font-bold text-[#22d3ee] uppercase tracking-wider">
                {member.role}
              </span>
            </div>

            {/* Bullet points */}
            <ul className="text-left space-y-2 pt-2 border-t border-gray-100">
              {member.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#555] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
