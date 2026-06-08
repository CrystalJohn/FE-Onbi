'use client'

import React, { useState, useRef, Suspense, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Check, ArrowLeft, ArrowRight, ClipboardCopy, Gift, ShieldAlert, Languages } from 'lucide-react';
import { useLanguage, LanguageProvider } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  dividerLabel: string;
  features: string[];
  colorTheme: 'cyan' | 'purple' | 'amber' | 'blue';
}

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  delay: string;
  duration: string;
  zDepth: number;
}

const getTiers = (language: 'en' | 'vi'): PricingTier[] => {
  if (language === 'vi') {
    return [
      {
        id: 'monthly',
        name: 'Thành viên Tháng',
        badge: 'Gia hạn app',
        description: 'Duy trì các tính năng theo dõi và nhắc nhở thông minh mỗi tháng.',
        price: '149.000đ',
        period: 'tháng',
        dividerLabel: 'QUYỀN TRUY CẬP THÁNG +',
        features: [
          'Tự động Pomodoro 25/5',
          'Theo dõi realtime trên app',
          'Cảnh báo tư thế & tập trung',
          'Báo cáo tiến độ chi tiết cho ba mẹ'
        ],
        colorTheme: 'cyan',
      },
      {
        id: 'device',
        name: 'Trọn gói ONBI IoT',
        badge: 'Phổ biến nhất',
        description: 'Robot ONBI + 3 tháng Premium',
        price: '4.599.000đ',
        period: 'một lần',
        dividerLabel: 'TRỌN GÓI ONBI IoT +',
        features: [
          'Robot ONBI đặt tại bàn học',
          'Tự động Pomodoro 25/5',
          'Theo dõi realtime trên app',
          'Tặng 3 tháng Premium'
        ],
        colorTheme: 'blue',
      },
      {
        id: 'annual',
        name: 'Thành viên Năm',
        badge: 'Tiết kiệm 11%',
        description: 'Duy trì các tính năng theo dõi và nhắc nhở thông minh trọn năm.',
        price: '1.599.000đ',
        period: 'năm',
        dividerLabel: 'QUYỀN TRUY CẬP NĂM +',
        features: [
          'Tự động Pomodoro 25/5',
          'Theo dõi realtime trên app',
          'Cảnh báo tư thế & tập trung',
          'Báo cáo tiến độ chi tiết cho ba mẹ',
          'Tiết kiệm 11% so với trả tháng'
        ],
        colorTheme: 'amber',
      },
    ];
  }

  return [
    {
      id: 'monthly',
      name: 'Monthly Pass',
      badge: 'App Renewal',
      description: 'Maintain smart tracking, reporting, and alerting features every month.',
      price: '149,000đ',
      period: 'month',
      dividerLabel: 'MONTHLY ACCESS +',
      features: [
        'Automated 25/5 Pomodoro',
        'Real-time app tracking',
        'Posture & focus alerts',
        'Detailed parent dashboard reports'
      ],
      colorTheme: 'cyan',
    },
    {
      id: 'device',
      name: 'ONBI IoT Bundle',
      badge: 'Most Popular',
      description: 'ONBI Robot + 3 months Premium',
      price: '4,599,000đ',
      period: 'one-time',
      dividerLabel: 'ONBI IoT BUNDLE +',
      features: [
        'ONBI Robot at study desk',
        'Automated 25/5 Pomodoro',
        'Real-time app tracking',
        'Free 3 months Premium'
      ],
      colorTheme: 'blue',
    },
    {
      id: 'annual',
      name: 'Annual Pass',
      badge: 'Save 11%',
      description: 'Maintain smart tracking, reporting, and alerting features all year round.',
      price: '1,599,000đ',
      period: 'year',
      dividerLabel: 'ANNUAL ACCESS +',
      features: [
        'Automated 25/5 Pomodoro',
        'Real-time app tracking',
        'Posture & focus alerts',
        'Detailed parent dashboard reports',
        'Save 11% compared to monthly pass'
      ],
      colorTheme: 'amber',
    },
  ];
};

function PreOrderFormContent() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get package from query params, fallback to 'device'
  const packageParam = searchParams.get('package') || 'device';
  const tiers = getTiers(language);
  const selectedTier = tiers.find(t => t.id === packageParam) || tiers[1];

  // Form inputs
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Submission & UX states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedText, setCopiedText] = useState<'copylink' | null>(null);
  const [reservationNum] = useState<number>(() => Math.floor(400 + Math.random() * 200));
  const [passCode, setPassCode] = useState('');

  // Dynamic stars state & effect to avoid SSR hydration mismatch
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 16 }).map((_, i) => {
      const size = Math.random() > 0.65 ? (Math.random() * 1.6 + 1.2) : (Math.random() * 0.8 + 0.6);
      return {
        id: i,
        top: `${Math.random() * 84 + 8}%`,
        left: `${Math.random() * 84 + 8}%`,
        size: parseFloat(size.toFixed(1)),
        opacity: parseFloat((Math.random() * 0.55 + 0.4).toFixed(2)),
        delay: `${(Math.random() * 4.5).toFixed(1)}s`,
        duration: `${(Math.random() * 3 + 2.5).toFixed(1)}s`,
        zDepth: Math.floor(Math.random() * 16 + 10) // translateZ between 10px and 26px for 3D parallax floating
      };
    });
    setStars(generatedStars);
  }, []);

  // 3D Card mouse tracking for early access pass
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 120, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const handleCopy = (text: string, type: 'copylink') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePreOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) { setErrorMsg(t.errName); return; }
    const phoneTrim = phone.trim();
    if (!phoneTrim) { setErrorMsg(t.errPhone); return; }
    // Clean Vietnamese phone format check
    if (phoneTrim.length < 9 || phoneTrim.length > 11 || isNaN(Number(phoneTrim))) {
      setErrorMsg(language === 'vi' ? 'Số điện thoại không hợp lệ.' : 'Invalid phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) { setErrorMsg(t.errEmail); return; }
    if (selectedTier.id === 'device' && !shippingAddress.trim()) { setErrorMsg(t.errAddress); return; }

    setErrorMsg('');
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setPassCode(`ONBI-2026-PRE-${selectedTier.id === 'device' ? 'DEV' : 'SUB'}-${suffix}`);
    setIsSubmitted(true);
  };

  const t = {
    en: {
      tag: "Standalone Registration",
      heading: "Complete Your Early Access",
      subheading: "Submit your details below. The ONBI team will reach out for confirmation when your package is ready.",
      parentNameLabel: "Parent / Guardian Name",
      parentNamePlaceholder: "e.g. Eleanor Vance",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g. 0912345678",
      emailLabel: "Email Address",
      emailPlaceholder: "e.g. parent@study.com",
      addressLabel: "Shipping Address",
      addressPlaceholder: "e.g. 123 Apple St, District 1, HCMC",
      btnSubmit: "Register early access",
      btnBack: "Back to Home",
      errName: "Please enter your name.",
      errPhone: "Please enter your phone number.",
      errEmail: "Please enter a valid email.",
      errAddress: "Please enter your shipping address.",
      successTitle: "Registered Successfully!",
      successSub: "Your ONBI Pre-order Pass is Ready",
      cardTitle: "ONBI PRE-ORDER PASS",
      member: "Parent",
      placement: "Pre-order No.",
      btnDone: "Back to home page",
      benefitsLabel: "Registration Summary",
      shippingFee: "Shipping Fee",
      shippingFree: "Free Delivery",
      batchInfo: "Estimated shipping Q3/2026",
      summaryRobot: "Robot ONBI IoT",
      summaryPremium: "3 months Premium",
      summaryGift: "Free of charge",
      summaryDelivery: "Delivery",
      summaryFree: "Free",
      summaryTotal: "Estimated Total",
      copied: "Copied!",
      ticketHint: "Hover to tilt. Your name updates here in real-time."
    },
    vi: {
      tag: "Đăng ký đặt trước",
      heading: "Hoàn tất đăng ký sớm",
      subheading: "Để lại thông tin bên dưới, đội ngũ ONBI sẽ liên hệ xác nhận ngay khi gói sản phẩm của ba mẹ sẵn sàng.",
      parentNameLabel: "Tên Ba mẹ / Người giám hộ",
      parentNamePlaceholder: "Ví dụ: Nguyễn Văn A",
      phoneLabel: "Số điện thoại liên hệ",
      phonePlaceholder: "Ví dụ: 0912345678",
      emailLabel: "Địa chỉ Email",
      emailPlaceholder: "Ví dụ: bame@gmail.com",
      addressLabel: "Địa chỉ nhận hàng (Dự kiến)",
      addressPlaceholder: "Ví dụ: Số 123 Đường Táo, Quận 1, TP. HCM",
      btnSubmit: "Đăng ký thông tin",
      btnBack: "Quay lại Trang chủ",
      errName: "Vui lòng nhập tên của ba mẹ.",
      errPhone: "Vui lòng nhập số điện thoại liên hệ.",
      errEmail: "Vui lòng nhập email hợp lệ.",
      errAddress: "Vui lòng nhập địa chỉ giao hàng.",
      successTitle: "Đăng ký thành công!",
      successSub: "Cảm ơn ba mẹ đã quan tâm đến ONBI",
      cardTitle: "MÃ ĐĂNG KÝ SỚM",
      member: "Phụ huynh",
      placement: "Số thứ tự",
      btnDone: "Quay về Trang chủ",
      benefitsLabel: "Tóm tắt gói đăng ký",
      shippingFee: "Phí vận chuyển",
      shippingFree: "Miễn phí",
      batchInfo: "Dự kiến ra mắt Q3/2026",
      summaryRobot: "Robot ONBI IoT",
      summaryPremium: "3 tháng Premium",
      summaryGift: "Tặng kèm",
      summaryDelivery: "Vận chuyển",
      summaryFree: "Miễn phí",
      summaryTotal: "Giá dự kiến",
      copied: "Đã chép!",
      ticketHint: "Di chuột để xoay. Tên của bạn sẽ tự động hiển thị trên thẻ."
    }
  }[language];

  const getSelectedTierDetails = () => {
    if (selectedTier.id === 'monthly') {
      return {
        gradient: 'from-cyan-950 via-zinc-900/98 to-zinc-950 border-cyan-800/60 shadow-[0_20px_50px_rgba(6,182,212,0.15)]',
        textColor: 'text-cyan-400',
        badgeColor: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-900/30'
      };
    } else if (selectedTier.id === 'device') {
      return {
        gradient: 'from-purple-950 via-zinc-900/98 to-black border-purple-500/50 shadow-[0_20px_50px_rgba(168,85,247,0.2)]',
        textColor: 'text-purple-600 dark:text-purple-400',
        badgeColor: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-900/30'
      };
    } else {
      return {
        gradient: 'from-amber-950 via-zinc-900/98 to-zinc-950 border-amber-800/60 shadow-[0_20px_50px_rgba(245,158,11,0.15)]',
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30'
      };
    }
  };

  const activeDetails = getSelectedTierDetails();

  return (
    <div className="min-h-screen bg-[#f7f6f2] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans antialiased relative overflow-hidden transition-colors duration-500 pb-20">
      
      {/* Mesh glow backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/10 dark:bg-blue-500/5 blur-[140px]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-300/10 dark:bg-cyan-500/5 blur-[140px]" />
      </div>

      {/* TOP HEADER */}
      <header className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 cursor-pointer outline-none">
          <Image
            src="/icon_badge_pricing_card.webp"
            alt="ONBI Logo"
            width={36}
            height={36}
            className="rounded-full shadow-2xs dark:invert"
          />
          <span className="font-display font-black tracking-tight text-xl">ONBI</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="h-10 px-3.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 text-xs font-bold shadow-3xs cursor-pointer select-none text-slate-700 dark:text-slate-300"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'EN' : 'VI'}</span>
          </button>
          
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1400px] mx-auto px-6 mt-8 md:mt-12 relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer group outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t.btnBack}</span>
        </button>

        {/* Dynamic Form and Success Layout */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="preorder-split-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
            >
              {/* LEFT COLUMN: 3D Early Access Pass Preview */}
              <div className="lg:col-span-5 flex flex-col items-center gap-6">
                <div className="w-full text-left space-y-3">
                  <span className="text-[12px] font-black font-mono tracking-widest text-orange-600 dark:text-orange-400 uppercase bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 px-3.5 py-1 rounded-full w-fit">
                    ✨ {selectedTier.badge || t.tag}
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    {t.heading}
                  </h1>
                  <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                    {t.subheading}
                  </p>
                </div>

                {/* 3D Interactive early access pass */}
                <div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="w-full max-w-[350px] aspect-[1.58/1] mt-4 select-none relative cursor-grab active:cursor-grabbing preserve-3d"
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    className={`w-full h-full rounded-3xl p-6 relative flex flex-col justify-between border backdrop-blur-xl bg-gradient-to-br shadow-[0_35px_65px_rgba(0,0,0,0.12)] isolate overflow-hidden ${activeDetails.gradient}`}
                  >
                    {/* Metallic reflective line overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-0" />

                    {/* Cosmic stars / sparkles overlay (Deep Space feel - 3D Holographic Parallax) */}
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-95 preserve-3d">
                      {stars.map((star) => (
                        <div
                          key={star.id}
                          className="absolute bg-white rounded-full animate-pulse"
                          style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                            transform: `translateZ(${star.zDepth}px)`,
                            boxShadow: star.size > 1.2 ? `0 0 6px rgba(255, 255, 255, 0.75)` : 'none',
                          }}
                        />
                      ))}

                      {/* Cosmic nebula dust glows */}
                      <div className="absolute top-[-20%] left-[-20%] w-[150px] h-[150px] rounded-full bg-cyan-500/10 blur-[40px]" style={{ transform: 'translateZ(6px)' }} />
                      <div className="absolute bottom-[-10%] right-[-10%] w-[180px] h-[180px] rounded-full bg-purple-500/15 blur-[50px]" style={{ transform: 'translateZ(9px)' }} />
                    </div>
                    
                    {/* Corner Chip/Logo */}
                    <div className="flex justify-between items-start z-10" style={{ transform: 'translateZ(30px)' }}>
                      <div className="flex items-center gap-1.5">
                        <Image src="/icon_badge_pricing_card.webp" alt="ONBI" width={28} height={28} className="rounded-full shadow-3xs dark:invert" />
                        <span className="text-xs font-black tracking-tight text-white/90">ONBI PASS</span>
                      </div>
                      <span className={`text-[8px] font-black font-mono tracking-widest px-2.5 py-1 rounded-full uppercase border ${activeDetails.badgeColor}`}>
                        {selectedTier.name}
                      </span>
                    </div>

                    {/* Middle bar */}
                    <div className="z-10 flex flex-col pt-3" style={{ transform: 'translateZ(45px)' }}>
                      <span className="text-[7.5px] font-black font-mono tracking-widest text-white/40 uppercase">Early Access Tier</span>
                      <span className="text-2xl font-black text-white tracking-wide">{selectedTier.price}</span>
                    </div>

                    {/* Footer bar */}
                    <div className="z-10 flex justify-between items-end border-t border-white/10 pt-3.5" style={{ transform: 'translateZ(30px)' }}>
                      <div className="text-left">
                        <span className="text-[6.5px] font-bold text-white/35 uppercase tracking-wider block">Parent Holder</span>
                        <span className="text-[11px] font-black text-white/80 max-w-[150px] truncate block">
                          {parentName.trim() ? parentName.toUpperCase() : 'MEMBERSHIP HOLDER'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[6.5px] font-bold text-white/35 uppercase tracking-wider block">Estimated Launch</span>
                        <span className="text-[10px] font-black text-white/80 block">Q3 / 2026</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold italic text-center max-w-xs leading-normal">
                  💡 {t.ticketHint}
                </p>
              </div>

              {/* RIGHT COLUMN: Early Access Form */}
              <div className="lg:col-span-7">
                <div className="relative w-full bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800 shadow-[0_30px_70px_rgba(0,0,0,0.06)] rounded-[32px] p-6 md:p-10 overflow-hidden animate-all duration-500">
                  
                  {/* Accent glow corner */}
                  <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${selectedTier.colorTheme === 'cyan' ? 'bg-cyan-500/10' : selectedTier.colorTheme === 'blue' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`} />

                  {errorMsg && (
                    <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl text-xs border border-red-100 dark:border-red-900/30 flex items-center gap-2 mb-6 relative z-10">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handlePreOrderSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-4">
                      
                      {/* Parent Name input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {t.parentNameLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs animate-all duration-300"
                          placeholder={t.parentNamePlaceholder}
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {t.phoneLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs animate-all duration-300"
                          placeholder={t.phonePlaceholder}
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {t.emailLabel}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs animate-all duration-300"
                          placeholder={t.emailPlaceholder}
                        />
                      </div>

                      {/* Shipping Address input — shown only for device package */}
                      {selectedTier.id === 'device' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-2 space-y-2"
                        >
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {t.addressLabel}
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs animate-all duration-300"
                            placeholder={t.addressPlaceholder}
                          />
                        </motion.div>
                      )}

                    </div>

                    {/* Registration Summary panel */}
                    <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30 rounded-2xl p-5 font-sans mt-4">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block tracking-wider uppercase mb-3.5 font-mono">
                        {t.benefitsLabel}
                      </span>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs text-slate-650 dark:text-slate-350 font-medium">
                          <span>{selectedTier.id === 'device' ? t.summaryRobot : `${language === 'vi' ? 'Gia hạn:' : 'Renewal:'} ${selectedTier.name}`}</span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">{selectedTier.price}</span>
                        </div>
                        {selectedTier.id === 'device' && (
                          <div className="flex justify-between items-center text-xs text-slate-655 dark:text-slate-350 font-medium">
                            <span>{t.summaryPremium}</span>
                            <span className="font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/30 px-2 py-0.5 rounded-md text-[10px]">
                              {t.summaryGift}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs text-slate-655 dark:text-slate-355 font-medium">
                          <span>{t.summaryDelivery}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-455">{selectedTier.id === 'device' ? t.summaryFree : '--'}</span>
                        </div>
                      </div>

                      <div className="border-t border-blue-100/80 dark:border-zinc-800 pt-3 mt-3 w-full animate-all">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.summaryTotal}:</span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedTier.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center justify-center gap-2 group outline-none"
                    >
                      <span>{t.btnSubmit}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            // PRE-ORDER COUPON SUCCESS CARD
            <motion.div
              key="preorder-success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="flex flex-col items-center justify-center gap-7 text-center py-12 relative z-10 w-full max-w-xl mx-auto"
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border shadow-2xs ${activeDetails.badgeColor} border-current/25 bg-white dark:bg-zinc-900`}>
                  <Check className="w-4 h-4 stroke-[3]" /> {t.successTitle}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.successSub}</h3>
              </div>

              {/* Success ticket card */}
              <div className="w-full max-w-[340px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-3xl p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden my-4 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
                
                <div className="w-14 h-14 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400 mb-5 shadow-2xs">
                  <Gift className="w-6 h-6" />
                </div>
                
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                  {t.cardTitle}
                </div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-wider mb-5 font-mono">
                  {passCode}
                </div>
                
                <div className="flex flex-row justify-between w-full border-t border-slate-100 dark:border-zinc-800 pt-5">
                  <div className="text-left">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{t.member}</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-350 truncate max-w-[140px]">{parentName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{t.placement}</div>
                    <div className="text-sm font-bold text-emerald-500">#{reservationNum}</div>
                  </div>
                </div>
              </div>

              {/* Copy pass code & Done control tray */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2">
                <button
                  onClick={() => handleCopy(passCode, 'copylink')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer outline-none ${copiedText === 'copylink'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400'
                    : 'bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  <ClipboardCopy className="w-4 h-4" />
                  <span>{copiedText === 'copylink' ? t.copied : language === 'vi' ? 'Chép mã đăng ký' : 'Copy registration code'}</span>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-zinc-850 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all cursor-pointer outline-none"
                >
                  {t.btnDone}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

export default function PreOrderPage() {
  return (
    <LanguageProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f7f6f2] dark:bg-black text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold tracking-tight">Loading pre-order...</span>
          </div>
        </div>
      }>
        <PreOrderFormContent />
      </Suspense>
    </LanguageProvider>
  );
}
