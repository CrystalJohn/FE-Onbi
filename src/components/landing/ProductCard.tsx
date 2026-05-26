'use client'

import React, { useState } from 'react';
import { Package, HelpCircle, HardDrive, ShieldCheck, Zap, Smile, Volume } from 'lucide-react';

interface TechSpec {
  id: string;
  name: string;
  value: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function ProductCard() {
  const [activeSpec, setActiveSpec] = useState<string>('material');

  const specs: TechSpec[] = [
    {
      id: 'material',
      name: "Child-Safe Materials",
      value: "FDA Food-Grade Active Silicone & Shock Recycled ABS",
      details: "Engineered specifically for children. Shell contains hypoallergenic components, certified lead-free & BPA-free. Drop-resistant up to 1.5 meters on solid wood floors.",
      icon: ShieldCheck
    },
    {
      id: 'design',
      name: "Tactile Friendly Design",
      value: "Ergonomic Rounded Bumpers (Edge-free)",
      details: "Zero sharp corners or pinch-points. Smooth, soft-touch matte protective texture resists water spills, crayons, and dirty hands. Easy to clean with active baby wipes.",
      icon: Smile
    },
    {
      id: 'led',
      name: "Safe Blue-Filtered LED Screen",
      value: "Non-radiative OLED screen behind Smoked Glass",
      details: "Diffused panel prevents eye fatigue. Standard blue-light emissions filtered by 85%. Cozy high-contrast pixel density for visibility in bright classrooms.",
      icon: Zap
    },
    {
      id: 'speaker',
      name: "Safe Crystal Audio Speaker",
      value: "80dB Dual-Speaker Chamber",
      details: "Tuned specifically for kids' hearing. Imposes strict hardware decibel limits to shield sensitive eardrums. Projects clear accents for ESL phonics training.",
      icon: Volume
    },
    {
      id: 'mic',
      name: "Far-Field Noise-Filtering Mic",
      value: "Dual-Array Smart Microphone + Acoustic Isolation",
      details: "Filters room sounds, pencil scratches, and tablet interference to capture clean child speech. Optimal for precise vocal feedback and habit assessments.",
      icon: HardDrive
    }
  ];

  return (
    <div className="bg-white/45 bg-white/80 border border-white/60 rounded-[32px] p-6 lg:p-10 shadow-md relative overflow-hidden" id="onbi_hardware_product_specifications">
      {/* Decorative backing grids */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* LEFT COLUMN: Physical product diagram layout (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <span className="text-[10px] font-mono tracking-widest text-[#78756f] uppercase block mb-3 font-bold">
            Physical Product Anatomy
          </span>

          {/* Styled schematic display of the robot's physical shell - upgraded glass */}
          <div className="relative w-[280px] h-[320px] bg-white/65 bg-white/70 rounded-3xl border border-white/60 flex flex-col justify-between p-6 shadow-sm group">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-75 rounded-3xl" />
            
            {/* Blueprint guidelines */}
            <div className="absolute inset-x-4 top-4 border-b border-indigo-950/10 flex justify-between text-[8px] font-mono text-indigo-950/40">
              <span>W: 11.2cm</span>
              <span>H: 14.8cm</span>
            </div>

            {/* Simulated schematic vector of robot face */}
            <div className="my-auto relative flex justify-center items-center w-full h-[180px]">
              
              {/* Glowing active hotspots overlay */}
              <button
                onClick={() => setActiveSpec('led')}
                className={`absolute top-12 cursor-pointer z-10 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeSpec === 'led' 
                    ? 'bg-indigo-950 text-white border-indigo-950 scale-110 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]' 
                    : 'bg-white text-indigo-950 border-[#ccc9bf] hover:border-indigo-950 shadow-md'
                }`}
                title="LED Face Screen"
              >
                <span className="text-[8px] font-bold font-mono">01</span>
              </button>

              <button
                onClick={() => setActiveSpec('mic')}
                className={`absolute top-4 right-16 cursor-pointer z-10 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeSpec === 'mic' 
                    ? 'bg-indigo-950 text-white border-indigo-950 scale-110' 
                    : 'bg-white text-indigo-950 border-[#ccc9bf] hover:border-indigo-950 shadow-md'
                }`}
                title="Smart Microphone"
              >
                <span className="text-[8px] font-bold font-mono">02</span>
              </button>

              <button
                onClick={() => setActiveSpec('speaker')}
                className={`absolute bottom-4 left-10 cursor-pointer z-10 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeSpec === 'speaker' 
                    ? 'bg-indigo-950 text-white border-indigo-950 scale-110' 
                    : 'bg-white text-indigo-950 border-[#ccc9bf] hover:border-indigo-950 shadow-md'
                }`}
                title="Tactile Speaker Core"
              >
                <span className="text-[8px] font-bold font-mono">03</span>
              </button>

              <button
                onClick={() => setActiveSpec('material')}
                className={`absolute bottom-16 right-6 cursor-pointer z-10 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeSpec === 'material' 
                    ? 'bg-indigo-950 text-white border-indigo-950 scale-110' 
                    : 'bg-white text-indigo-950 border-[#ccc9bf] hover:border-indigo-950 shadow-md'
                }`}
                title="Child-Safe Shell Core"
              >
                <span className="text-[8px] font-bold font-mono">04</span>
              </button>

              {/* Minimal vector line layout represent robot chassis */}
              <div className="w-[140px] h-[160px] rounded-[36px] bg-slate-50 border border-slate-300/60 flex flex-col items-center justify-center p-4 relative group-hover:scale-102 transition-transform shadow-xs">
                <div className="w-full h-[80px] bg-slate-200/50 rounded-2xl border border-slate-300/40 flex items-center justify-around px-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <div className="w-10 h-1 bg-slate-400 rounded-full" />
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                </div>
                {/* Micro branding lines */}
                <div className="w-12 h-1 bg-slate-300 rounded mt-4" />
                <div className="w-8 h-1 bg-slate-300 rounded mt-1.5" />
              </div>

            </div>

            {/* Explanatory footer guideline links */}
            <div className="text-center">
              <span className="text-[9px] font-mono tracking-wide text-slate-700 uppercase bg-white/50 border border-white/65 px-2.5 py-0.5 rounded-full font-bold">
                Tap blueprint nodes to inspect
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Specs Listing (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-[#78756f] uppercase font-bold">
              Premium Hardware Engineering
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
              Crafted to Withstand Daily Childhood Adventures
            </h3>
            <p className="text-xs text-[#78756f] leading-relaxed font-medium">
              Every curve of ONBI is planned for safety, tactile feedback, and developmental harmony. Built with input from sensory therapists.
            </p>
          </div>

          {/* Interactive Specification Tabs List - upgraded glass */}
          <div className="space-y-2.5 font-sans">
            {specs.map((spec) => {
              const SpecIcon = spec.icon;
              const isActive = activeSpec === spec.id;

              return (
                <div
                  key={spec.id}
                  id={`spec_tab_${spec.id}`}
                  onClick={() => setActiveSpec(spec.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-white/60 bg-white/70 border-indigo-950 shadow-2xs ring-1 ring-indigo-950/20'
                      : 'bg-white/10 bg-white/70 border-white/40 hover:bg-white/40 hover:border-indigo-950/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-950 text-white' : 'bg-white/50 border border-white/60 text-[#18181a]'}`}>
                      <SpecIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#18181a]">{spec.name}</div>
                      <div className="text-[10px] text-[#78756f] mt-0.5 font-medium">{spec.value}</div>
                    </div>
                  </div>
                  
                  {/* Status labels */}
                  <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold self-end md:self-auto">
                    Cert: FCC/EN71 Safe
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Detail Container Box */}
          <div className="bg-indigo-950 text-white p-5 rounded-3xl border border-indigo-900 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-900 rounded-full blur-xl" />
            
            <div className="flex items-center gap-2 text-orange-400 font-mono text-[10px] uppercase font-bold mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Inspection Report: {specs.find(s => s.id === activeSpec)?.name}</span>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed font-sans mt-1">
              {specs.find(s => s.id === activeSpec)?.details}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
