'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, ArrowUpRight, Timer, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onJoinClick?: () => void;
  onTimerClick?: () => void;
}

export default function Header({ onJoinClick, onTimerClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const t = {
    en: {
      home: 'Home',
      problem: 'Problem',
      features: 'Features',
      pricing: 'Pricing',
      team: 'Meet Our Team',
      focusTimer: 'Focus Timer',
      testTimer: 'Test Focus Timer',
      login: 'Login',
      orderNow: 'Order Now',
      enrollNow: 'Enroll Now',
      languageLabel: 'Language',
      langName: 'English (US)',
      flag: '/Flag_of_the_United_States.png',
    },
    vi: {
      home: 'Trang chủ',
      problem: 'Vấn đề',
      features: 'Tính năng',
      pricing: 'Bảng giá',
      team: 'Đội ngũ',
      focusTimer: 'Hẹn giờ tập trung',
      testTimer: 'Thử hẹn giờ tập trung',
      login: 'Đăng nhập',
      orderNow: 'Đặt mua ngay',
      enrollNow: 'Đăng ký ngay',
      languageLabel: 'Ngôn ngữ',
      langName: 'Tiếng Việt',
      flag: '/Flag_of_Vietnam.png',
    }
  }[language];

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
    <header className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 safe-padding-top ${
      scrolled 
        ? 'bg-[#f7f6f2]/85 border-b border-[#ccc9bf]/30 shadow-sm backdrop-blur-md [backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 px-[max(1.5rem,env(safe-area-inset-left,24px))] pr-[max(1.5rem,env(safe-area-inset-right,24px))] flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          onClick={() => scrollToSection('hero_section')}
          className="flex items-center cursor-pointer"
          id="nav_logo"
        >
          <Image src="/ONBI_loading.png" alt="ONBI" width={60} height={60} className="object-contain" priority />
        </div>

        {/* CENTER NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('hero_section')}
            className="text-sm font-semibold text-slate-900 hover:text-[#0066cc] transition-colors cursor-pointer border-b-2 border-[#0066cc] pb-0.5"
          >
            {t.home}
          </button>
          <button
            onClick={() => scrollToSection('parent_problems_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#0066cc] transition-colors cursor-pointer"
          >
            {t.problem}
          </button>
          <button
            onClick={() => scrollToSection('features_grid_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#0066cc] transition-colors cursor-pointer"
          >
            {t.features}
          </button>
          <button
            onClick={() => scrollToSection('pricing_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#0066cc] transition-colors cursor-pointer"
          >
            {t.pricing}
          </button>
          <button
            onClick={() => scrollToSection('how_it_works_section')}
            className="text-sm font-medium text-slate-600 hover:text-[#0066cc] transition-colors cursor-pointer"
          >
            {t.team}
          </button>
        </nav>

        {/* RIGHT CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-[#ccc9bf]/20 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <img src={t.flag} alt="" className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shadow-3xs" />
              <span className="font-semibold text-slate-700">{t.langName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" style={{ transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {isLangOpen && (
              <>
                {/* Overlay to catch clicks outside the dropdown */}
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                
                {/* Dropdown Box */}
                <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer ${
                      language === 'en' ? 'text-[#0066cc] bg-blue-50/40' : 'text-slate-700'
                    }`}
                  >
                    <img src="/Flag_of_the_United_States.png" alt="US" className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                    <span>English (US)</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('vi');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer ${
                      language === 'vi' ? 'text-[#0066cc] bg-blue-50/40' : 'text-slate-700'
                    }`}
                  >
                    <img src="/Flag_of_Vietnam.png" alt="VN" className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                    <span>Tiếng Việt</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onTimerClick}
            className="text-sm font-semibold text-slate-700 px-4 py-2 rounded-full border border-slate-300 hover:border-[#0066cc] hover:text-[#0066cc] transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Timer className="w-4 h-4 text-[#0066cc]" />
            <span>{t.focusTimer}</span>
          </button>
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-slate-700 px-5 py-2 rounded-full border border-slate-300 hover:border-[#0066cc] hover:text-[#0066cc] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            {t.login}
          </button>
          <button
            onClick={onJoinClick}
            className="text-sm font-semibold text-white px-5 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            {t.orderNow}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-all cursor-pointer flex items-center gap-1"
            >
              <img src={t.flag} alt="" className="w-4 h-2.5 object-cover rounded-xs border border-slate-200" />
              <span className="uppercase text-[10px] tracking-wider text-slate-700 font-bold">
                {language === 'en' ? 'EN' : 'VI'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" style={{ transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-45" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-2 w-32 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      language === 'en' ? 'text-[#0066cc]' : 'text-slate-700'
                    }`}
                  >
                    <img src="/Flag_of_the_United_States.png" alt="US" className="w-4 h-2.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('vi');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      language === 'vi' ? 'text-[#0066cc]' : 'text-slate-700'
                    }`}
                  >
                    <img src="/Flag_of_Vietnam.png" alt="VN" className="w-4 h-2.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                    <span>Tiếng Việt</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <nav className="md:hidden mt-3 border border-gray-200/60 bg-[#f7f6f2] mx-6 p-5 rounded-2xl flex flex-col gap-3 shadow-lg">
          <button onClick={() => scrollToSection('hero_section')} className="text-left py-2 text-sm font-semibold text-slate-900">{t.home}</button>
          <button onClick={() => scrollToSection('parent_problems_section')} className="text-left py-2 text-sm font-medium text-slate-600">{t.problem}</button>
          <button onClick={() => scrollToSection('features_grid_section')} className="text-left py-2 text-sm font-medium text-slate-600">{t.features}</button>
          <button onClick={() => scrollToSection('pricing_section')} className="text-left py-2 text-sm font-medium text-slate-600">{t.pricing}</button>
          <button onClick={() => scrollToSection('how_it_works_section')} className="text-left py-2 text-sm font-medium text-slate-600">{t.team}</button>
          
          <div className="h-px bg-gray-200 my-2" />
          <button
            onClick={() => { setIsOpen(false); if (onTimerClick) onTimerClick(); }}
            className="w-full text-center text-sm font-semibold text-slate-700 py-3 rounded-full border border-slate-300 hover:border-[#0066cc] hover:text-[#0066cc] transition-all flex items-center justify-center gap-1.5"
          >
            <Timer className="w-4 h-4 text-[#0066cc]" />
            {t.testTimer}
          </button>
          <button
            onClick={() => { setIsOpen(false); if (onJoinClick) onJoinClick(); }}
            className="w-full text-center text-sm font-semibold text-white py-3 rounded-full bg-[#0066cc] hover:bg-[#0071e3] transition-all"
          >
            {t.enrollNow}
          </button>
        </nav>
      )}
    </header>
  );
}
