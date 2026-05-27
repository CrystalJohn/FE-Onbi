'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onJoinClick?: () => void;
}

export default function Header({ onJoinClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${scrolled ? 'bg-[#f7f6f2]/95 border-b border-[#ccc9bf]/30 shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          onClick={() => scrollToSection('hero_section')}
          className="flex items-center cursor-pointer"
          id="nav_logo"
        >
          <Image src="/ONBI_loading.png" alt="ONBI" width={60} height={60} className="object-contain" />
        </div>

        {/* CENTER NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('hero_section')}
            className="text-sm font-semibold text-slate-900 hover:text-[#22d3ee] transition-colors cursor-pointer border-b-2 border-slate-900 pb-0.5"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features_grid_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#22d3ee] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('product_specs_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#22d3ee] transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection('pricing_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#22d3ee] transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('how_it_works_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#22d3ee] transition-colors cursor-pointer"
          >
            Meet Our Team
          </button>
        </nav>

        {/* RIGHT CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-slate-700 px-5 py-2 rounded-full border border-slate-300 hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={onJoinClick}
            className="text-sm font-semibold text-white px-5 py-2 rounded-full bg-[#22d3ee] hover:bg-cyan-400 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            Order Now
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <nav className="md:hidden mt-3 border border-gray-200/60 bg-[#f7f6f2] mx-6 p-5 rounded-2xl flex flex-col gap-3 shadow-lg">
          <button onClick={() => scrollToSection('hero_section')} className="text-left py-2 text-sm font-semibold text-slate-900">Home</button>
          <button onClick={() => scrollToSection('mvp_tracker_section')} className="text-left py-2 text-sm font-medium text-slate-600">Features</button>
          <button onClick={() => scrollToSection('product_specs_section')} className="text-left py-2 text-sm font-medium text-slate-600">Product</button>
          <button onClick={() => scrollToSection('pricing_section')} className="text-left py-2 text-sm font-medium text-slate-600">Pricing</button>
          <button onClick={() => scrollToSection('how_it_works_section')} className="text-left py-2 text-sm font-medium text-slate-600">Meet Our Team</button>
          <div className="h-px bg-gray-200 my-2" />
          <button
            onClick={() => { setIsOpen(false); if (onJoinClick) onJoinClick(); }}
            className="w-full text-center text-sm font-semibold text-white py-3 rounded-full bg-[#22d3ee] hover:bg-cyan-400 transition-all"
          >
            Enroll Now
          </button>
        </nav>
      )}
    </header>
  );
}
