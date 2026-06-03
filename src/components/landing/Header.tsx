'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, ArrowUpRight, Timer, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onJoinClick?: () => void;
  onTimerClick?: () => void;
}

// Map each nav key to the section ID it targets in page.tsx
const NAV_SECTIONS = [
  { key: 'home',     id: 'hero_section' },
  { key: 'problem',  id: 'parent_problems_section' },
  { key: 'features', id: 'features_grid_section' },
  { key: 'pricing',  id: 'pricing_section' },
  { key: 'team',     id: 'how_it_works_section' },
] as const;

type NavKey = (typeof NAV_SECTIONS)[number]['key'];

export default function Header({ onJoinClick, onTimerClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavKey>('home');
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

  // ─── Navbar background on scroll ────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Scroll-spy via IntersectionObserver ────────────────────────────────────
  useEffect(() => {
    // rootMargin: shrink the observable viewport so a section is only
    // considered "active" when it occupies the top portion of the screen,
    // compensating for the sticky 80px navbar.
    const observer = new IntersectionObserver(
      (entries) => {
        // Among all entries that are currently intersecting, pick the one
        // whose top edge is closest to (but still below) the navbar.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          const match = NAV_SECTIONS.find((s) => s.id === id);
          if (match) setActiveSection(match.key);
        }
      },
      {
        // Top: exclude the 80px navbar. Bottom: only consider the top 35% of
        // the remaining viewport so the active item updates early enough.
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0,
      },
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ─── Click handler — scrolls and immediately marks section as active ────────
  const scrollToSection = (key: NavKey) => {
    setIsOpen(false);
    setActiveSection(key);                          // immediate feedback on click
    const section = NAV_SECTIONS.find((s) => s.key === key);
    if (!section) return;
    const el = document.getElementById(section.id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── Per-item class helper ───────────────────────────────────────────────────
  const navClass = (key: NavKey) =>
    activeSection === key
      ? 'text-sm font-semibold text-[#006FE6] transition-colors cursor-pointer border-b-2 border-[#006FE6] pb-0.5'
      : 'text-sm font-medium text-[#475569] hover:text-[#006FE6] transition-colors cursor-pointer';

  const mobileNavClass = (key: NavKey) =>
    activeSection === key
      ? 'text-left py-2 text-sm font-semibold text-[#006FE6]'
      : 'text-left py-2 text-sm font-medium text-slate-600';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 safe-padding-top ${
      scrolled
        ? 'bg-[#f7f6f2]/85 border-b border-[#ccc9bf]/30 shadow-sm backdrop-blur-md [backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-[max(1.5rem,env(safe-area-inset-left,24px))] pr-[max(1.5rem,env(safe-area-inset-right,24px))] flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => scrollToSection('home')}
          className="flex items-center cursor-pointer"
          id="nav_logo"
        >
          <Image src="/ONBI_loading.webp" alt="ONBI" width={60} height={60} className="object-contain" priority />
        </div>

        {/* CENTER NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('home')}     className={navClass('home')}>{t.home}</button>
          <button onClick={() => scrollToSection('problem')}  className={navClass('problem')}>{t.problem}</button>
          <button onClick={() => scrollToSection('features')} className={navClass('features')}>{t.features}</button>
          <button onClick={() => scrollToSection('pricing')}  className={navClass('pricing')}>{t.pricing}</button>
          <button onClick={() => scrollToSection('team')}     className={navClass('team')}>{t.team}</button>
        </nav>

        {/* RIGHT CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-3">

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-[#ccc9bf]/20 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <Image src={t.flag} alt="" width={20} height={14} className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shadow-3xs" />
              <span className="font-semibold text-slate-700">{t.langName}</span>
              <ChevronDown
                className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                style={{ transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer ${
                      language === 'en' ? 'text-[#0066cc] bg-blue-50/40' : 'text-slate-700'
                    }`}
                  >
                    <Image src="/Flag_of_the_United_States.png" alt="US" width={20} height={14} className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                    <span>English (US)</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('vi'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer ${
                      language === 'vi' ? 'text-[#0066cc] bg-blue-50/40' : 'text-slate-700'
                    }`}
                  >
                    <Image src="/Flag_of_Vietnam.png" alt="VN" width={20} height={14} className="w-5 h-3.5 object-cover rounded-xs border border-slate-200 shrink-0" />
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

          <button disabled className="hidden">{t.login}</button>

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

          {/* Mobile Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-all cursor-pointer flex items-center gap-1"
            >
              <Image src={t.flag} alt="" width={16} height={10} className="w-4 h-2.5 object-cover rounded-xs border border-slate-200" />
              <span className="uppercase text-[10px] tracking-wider text-slate-700 font-bold">
                {language === 'en' ? 'EN' : 'VI'}
              </span>
              <ChevronDown
                className="w-3 h-3 text-slate-400 transition-transform duration-200"
                style={{ transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-45" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-2 w-32 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      language === 'en' ? 'text-[#0066cc]' : 'text-slate-700'
                    }`}
                  >
                    <Image src="/Flag_of_the_United_States.png" alt="US" width={16} height={10} className="w-4 h-2.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('vi'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      language === 'vi' ? 'text-[#0066cc]' : 'text-slate-700'
                    }`}
                  >
                    <Image src="/Flag_of_Vietnam.png" alt="VN" width={16} height={10} className="w-4 h-2.5 object-cover rounded-xs border border-slate-200 shrink-0" />
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
          <button onClick={() => scrollToSection('home')}     className={mobileNavClass('home')}>{t.home}</button>
          <button onClick={() => scrollToSection('problem')}  className={mobileNavClass('problem')}>{t.problem}</button>
          <button onClick={() => scrollToSection('features')} className={mobileNavClass('features')}>{t.features}</button>
          <button onClick={() => scrollToSection('pricing')}  className={mobileNavClass('pricing')}>{t.pricing}</button>
          <button onClick={() => scrollToSection('team')}     className={mobileNavClass('team')}>{t.team}</button>

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
