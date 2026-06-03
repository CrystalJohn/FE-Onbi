'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Check, ArrowRight, ClipboardCopy, Bot, User, Smartphone, Cpu, Gift, Percent, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fadeUp, viewport } from '@/lib/animations';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  quickSpecs: { icon: 'user' | 'smartphone' | 'cpu' | 'gift' | 'percent' | 'bot'; text: string }[];
  dividerLabel: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  colorTheme: 'cyan' | 'purple' | 'amber' | 'blue';
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
        quickSpecs: [
          { icon: 'user', text: '1 tài khoản học sinh' },
          { icon: 'smartphone', text: 'Cập nhật ứng dụng liên tục' }
        ],
        dividerLabel: 'QUYỀN TRUY CẬP THÁNG +',
        features: [
          'Tự động Pomodoro 25/5',
          'Theo dõi realtime trên app',
          'Cảnh báo tư thế & tập trung',
          'Báo cáo tiến độ chi tiết cho ba mẹ'
        ],
        cta: 'Đăng ký theo Tháng',
        highlighted: false,
        colorTheme: 'cyan',
      },
      {
        id: 'device',
        name: 'Trọn gói ONBI IoT',
        badge: 'Phổ biến nhất',
        description: 'Robot ONBI + 3 tháng Premium',
        price: '4.599.000đ',
        period: 'một lần',
        quickSpecs: [
          { icon: 'bot', text: 'Robot ONBI đặt tại bàn học' },
          { icon: 'gift', text: 'Tặng 3 tháng Premium' }
        ],
        dividerLabel: 'TRỌN GÓI ONBI IoT +',
        features: [
          'Robot ONBI đặt tại bàn học',
          'Tự động Pomodoro 25/5',
          'Theo dõi realtime trên app',
          'Tặng 3 tháng Premium'
        ],
        cta: 'Đặt trước ONBI',
        highlighted: true,
        colorTheme: 'blue',
      },
      {
        id: 'annual',
        name: 'Thành viên Năm',
        badge: 'Tiết kiệm 11%',
        description: 'Duy trì các tính năng theo dõi và nhắc nhở thông minh trọn năm.',
        price: '1.599.000đ',
        period: 'năm',
        quickSpecs: [
          { icon: 'user', text: '1 tài khoản học sinh' }
        ],
        dividerLabel: 'QUYỀN TRUY CẬP NĂM +',
        features: [
          'Tự động Pomodoro 25/5',
          'Theo dõi realtime trên app',
          'Cảnh báo tư thế & tập trung',
          'Báo cáo tiến độ chi tiết cho ba mẹ',
          'Tiết kiệm 11% so với trả tháng'
        ],
        cta: 'Đăng ký theo Năm',
        highlighted: false,
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
      quickSpecs: [
        { icon: 'user', text: '1 student account' },
        { icon: 'smartphone', text: 'Continuous app updates' }
      ],
      dividerLabel: 'MONTHLY ACCESS +',
      features: [
        'Automated 25/5 Pomodoro',
        'Real-time app tracking',
        'Posture & focus alerts',
        'Detailed parent dashboard reports'
      ],
      cta: 'Subscribe Monthly',
      highlighted: false,
      colorTheme: 'cyan',
    },
    {
      id: 'device',
      name: 'ONBI IoT Bundle',
      badge: 'Most Popular',
      description: 'ONBI Robot + 3 months Premium',
      price: '4,599,000đ',
      period: 'one-time',
      quickSpecs: [
        { icon: 'bot', text: 'ONBI Robot at study desk' },
        { icon: 'gift', text: 'Free 3 months Premium' }
      ],
      dividerLabel: 'ONBI IoT BUNDLE +',
      features: [
        'ONBI Robot at study desk',
        'Automated 25/5 Pomodoro',
        'Real-time app tracking',
        'Free 3 months Premium'
      ],
      cta: 'Pre-order ONBI',
      highlighted: true,
      colorTheme: 'blue',
    },
    {
      id: 'annual',
      name: 'Annual Pass',
      badge: 'Save 11%',
      description: 'Maintain smart tracking, reporting, and alerting features all year round.',
      price: '1,599,000đ',
      period: 'year',
      quickSpecs: [
        { icon: 'user', text: '1 student account' }
      ],
      dividerLabel: 'ANNUAL ACCESS +',
      features: [
        'Automated 25/5 Pomodoro',
        'Real-time app tracking',
        'Posture & focus alerts',
        'Detailed parent dashboard reports',
        'Save 11% compared to monthly pass'
      ],
      cta: 'Subscribe Annually',
      highlighted: false,
      colorTheme: 'amber',
    },
  ];
};

export default function EarlyAccessForm() {
  const { language } = useLanguage();

  // Segmented control: false -> Chưa có thiết bị (Mua mới), true -> Đã có thiết bị (Gia hạn app)
  const [hasDevice, setHasDevice] = useState<boolean>(false);
  const [activeSubTier, setActiveSubTier] = useState<'monthly' | 'annual'>('annual');

  // Checkout inputs
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

  // 3D Card mouse tracking
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

  const activeTiers = getTiers(language);

  // Active items determined by hasDevice toggle
  const activeSelectedTier = hasDevice
    ? activeTiers.find(t => t.id === activeSubTier)!
    : activeTiers.find(t => t.id === 'device')!;

  const t = {
    en: {
      tag: "Membership pricing.",
      headingLine1: "Choose the perfect plan",
      headingLine2: "for your family.",
      subheading: "Purchase the ONBI robot or renew the app to continue tracking study habits, Pomodoro cycles, and progress reports.",
      toggleNoDevice: "New Purchase",
      toggleHasDevice: "Already have ONBI",
      toggleHelperText: "New purchase includes robot + app. Already have ONBI to renew Premium.",
      checkoutTitle: "Pre-order ONBI",
      checkoutSub: "Leave your details below. The ONBI team will reach out for confirmation when the product is ready.",
      parentNameLabel: "Parent / Guardian Name",
      parentNamePlaceholder: "e.g. Eleanor Vance",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g. 0912345678",
      emailLabel: "Email Address",
      emailPlaceholder: "e.g. parent@study.com",
      addressLabel: "Shipping Address",
      addressPlaceholder: "e.g. 123 Apple St, District 1, HCMC",
      btnSubmitDevice: "Pre-order ONBI",
      errName: "Please enter your name.",
      errPhone: "Please enter your phone number.",
      errEmail: "Please enter a valid email.",
      errAddress: "Please enter your shipping address.",
      successTitle: "Pre-ordered Successfully!",
      successSub: "Your ONBI Pre-order Pass is Ready",
      cardTitle: "ONBI PRE-ORDER PASS",
      member: "Parent",
      placement: "Pre-order No.",
      btnDone: "Place Another Pre-order",
      benefitsLabel: "Registration Summary",
      shippingFee: "Shipping Fee",
      shippingFree: "Free Delivery",
      batchInfo: "Estimated shipping Q3/2026",
      detailsTitle: "Pre-order Contact Details",
      summaryRobot: "Robot ONBI IoT",
      summaryPremium: "3 months Premium",
      summaryGift: "Free of charge",
      summaryDelivery: "Delivery",
      summaryFree: "Free",
      summaryTotal: "Estimated Total",
      copied: "Copied!",
    },
    vi: {
      tag: "Bảng giá thành viên.",
      headingLine1: "Chọn gói phù hợp",
      headingLine2: "cho gia đình.",
      subheading: "Mua robot ONBI hoặc gia hạn app để tiếp tục theo dõi thói quen học tập, Pomodoro và báo cáo tiến độ của con.",
      toggleNoDevice: "Mua mới",
      toggleHasDevice: "Đã có ONBI",
      toggleHelperText: "Mua mới gồm robot + app. Đã có ONBI dùng để gia hạn Premium.",
      checkoutTitle: "Đặt trước ONBI",
      checkoutSub: "Để lại thông tin, đội ngũ ONBI sẽ liên hệ xác nhận khi sản phẩm sẵn sàng.",
      parentNameLabel: "Tên Ba mẹ / Người giám hộ",
      parentNamePlaceholder: "Ví dụ: Nguyễn Văn A",
      phoneLabel: "Số điện thoại liên hệ",
      phonePlaceholder: "Ví dụ: 0912345678",
      emailLabel: "Địa chỉ Email",
      emailPlaceholder: "Ví dụ: bame@gmail.com",
      addressLabel: "Địa chỉ nhận hàng",
      addressPlaceholder: "Ví dụ: Số 123 Đường Táo, Quận 1, TP. HCM",
      btnSubmitDevice: "Đặt trước ONBI",
      errName: "Vui lòng nhập tên của ba mẹ.",
      errPhone: "Vui lòng nhập số điện thoại liên hệ.",
      errEmail: "Vui lòng nhập email hợp lệ.",
      errAddress: "Vui lòng nhập địa chỉ giao hàng.",
      successTitle: "Đặt trước thành công!",
      successSub: "Thẻ đặt trước của bạn đã sẵn sàng!",
      cardTitle: "THẺ ĐẶT TRƯỚC ONBI",
      member: "Phụ huynh",
      placement: "Số thứ tự đặt",
      btnDone: "Đặt trước thêm đơn khác",
      benefitsLabel: "Tóm tắt đăng ký",
      shippingFee: "Phí vận chuyển",
      shippingFree: "Miễn phí giao hàng",
      batchInfo: "Dự kiến giao hàng Q3/2026",
      detailsTitle: "Thông tin Đặt trước",
      summaryRobot: "Robot ONBI IoT",
      summaryPremium: "3 tháng Premium",
      summaryGift: "Tặng kèm",
      summaryDelivery: "Vận chuyển",
      summaryFree: "Miễn phí",
      summaryTotal: "Tổng tạm tính",
      copied: "Đã chép!",
    }
  }[language];

  const handleCopy = (text: string, type: 'copylink') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePreOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) { setErrorMsg(t.errName); return; }
    if (!phone.trim()) { setErrorMsg(t.errPhone); return; }
    if (!email.trim() || !email.includes('@')) { setErrorMsg(t.errEmail); return; }
    if (!hasDevice && !shippingAddress.trim()) { setErrorMsg(t.errAddress); return; }

    setErrorMsg('');
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setPassCode(`ONBI-2026-PRE-${hasDevice ? 'SUB' : 'DEV'}-${suffix}`);
    setIsSubmitted(true);
  };

  const getSelectedTierDetails = () => {
    const tier = activeSelectedTier;
    if (tier.id === 'monthly') {
      return {
        gradient: 'from-cyan-900 to-slate-900 border-cyan-800',
        textColor: 'text-cyan-400',
        badgeColor: 'bg-cyan-50 text-cyan-700'
      };
    } else if (tier.id === 'device') {
      return {
        gradient: 'from-blue-900 to-slate-900 border-blue-800',
        textColor: 'text-blue-400',
        badgeColor: 'bg-blue-50 text-blue-700'
      };
    } else {
      return {
        gradient: 'from-amber-900 to-slate-900 border-amber-800',
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-50 text-amber-700'
      };
    }
  };

  const activeDetails = getSelectedTierDetails();

  return (
    <div className="space-y-20 relative" id="onbi_pricing_section_container">

      {/* Soft premium mesh background glows to elevate glassmorphism contrast */}
      <div className="absolute inset-0 -top-20 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-[10%] w-[350px] h-[350px] rounded-full bg-cyan-300/10 blur-[120px]" />
        <div className="absolute top-1/3 right-[15%] w-[450px] h-[450px] rounded-full bg-purple-400/10 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] rounded-full bg-orange-300/5 blur-[140px]" />
      </div>

      {/* Apple-style Premium Section Header */}
      <motion.div
        className="max-w-[1400px] mx-auto text-left space-y-4 px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        <span className="text-[20px] md:text-[22px] font-semibold text-[#1d1d1f] tracking-tight block">
          {t.tag}
        </span>

        <h2 className="font-display text-4xl sm:text-5xl md:text-[76px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.08] flex flex-col">
          <span>{t.headingLine1}</span>
          <span>{t.headingLine2}</span>
        </h2>

        <p className="text-[19px] md:text-[21px] text-[#86868b] max-w-[620px] leading-relaxed font-normal tracking-tight pt-2">
          {t.subheading}
        </p>

        {/* Batch Release Info Badge */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-orange-600 bg-orange-50/80 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-orange-200/50 shadow-3xs">
            ✨ {t.batchInfo}
          </span>
        </div>
      </motion.div>

      {/* D2C SEGMENTED TOGGLE (iOS Style) */}
      <div className="flex flex-col items-center justify-center relative z-20 px-6 gap-2">
        <div className="relative flex p-1 bg-slate-100/80 backdrop-blur-md rounded-full border border-slate-200/60 max-w-xs w-full shadow-2xs select-none">
          {/* Sliding white background pill */}
          <motion.div
            className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm z-0"
            layoutId="activeSegment"
            style={{ width: 'calc(50% - 4px)' }}
            animate={{ x: hasDevice ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          />
          <button
            onClick={() => { setHasDevice(false); setIsSubmitted(false); }}
            className={`flex-1 relative z-10 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-tight text-center cursor-pointer transition-colors ${!hasDevice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t.toggleNoDevice}
          </button>
          <button
            onClick={() => { setHasDevice(true); setIsSubmitted(false); }}
            className={`flex-1 relative z-10 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-tight text-center cursor-pointer transition-colors ${hasDevice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t.toggleHasDevice}
          </button>
        </div>
        <p className="text-center text-[11px] md:text-xs text-slate-500 font-medium max-w-md mt-1 px-4 leading-normal">
          {t.toggleHelperText}
        </p>
      </div>

      {/* CORE SPLIT SCREEN GRID */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 mt-8 md:mt-12">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: GÓI CHỌN */}
          <div className="w-full lg:col-span-5 flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!hasDevice ? (
                // SHOWS 1 HARDWARE BUNDLE CARD (Always expanded)
                <motion.div
                  key="hardware-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  className="relative rounded-[32px] p-7 md:p-8 flex flex-col transition-all duration-500 ease-[0.16,1,0.3,1] bg-white/80 backdrop-blur-xl border border-sky-100 shadow-[0_30px_70px_rgba(14,165,233,0.06),_0_0_40px_rgba(168,85,247,0.02)] z-10 w-full select-none overflow-hidden isolate"
                >
                  {/* Glowing background highlights */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-bl from-sky-400/12 via-cyan-400/3 to-transparent rounded-[30px] pointer-events-none z-0" />
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl pointer-events-none z-0" />

                  {/* Blue/Cyan Chevrons */}
                  <div className="absolute top-0 right-0 w-48 h-48 opacity-90 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/20 overflow-visible" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chevBlueCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevBlueCyanGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevBlueCyanGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    </svg>
                  </div>

                  {/* Badge */}
                  {activeTiers[1].badge && (
                    <span className="absolute top-5 right-5 text-[8.5px] font-black font-mono tracking-widest px-3 py-1.5 rounded-full uppercase border bg-sky-50 text-sky-700 border-sky-200/50 shadow-[0_0_15px_rgba(14,165,233,0.1)] backdrop-blur-md z-10 flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-sky-600 animate-spin" style={{ animationDuration: '6s' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>{activeTiers[1].badge}</span>
                    </span>
                  )}

                  {/* Icon badge frame */}
                  <div className="w-14 h-14 rounded-full mb-6 relative z-10 shadow-[0_8px_24px_rgba(14,165,233,0.15)] border border-sky-200/40 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105">
                    <Image src="/icon_badge_pricing_card.webp" alt="ONBI IoT" width={56} height={56} className="w-full h-full object-cover" draggable={false} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 z-10">{activeTiers[1].name}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5 min-h-[24px] z-10">{activeTiers[1].description}</p>

                  <div className="flex items-baseline gap-1.5 mb-4 z-10">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{activeTiers[1].price}</span>
                    <span className="text-xs font-semibold text-slate-400">/{activeTiers[1].period}</span>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center my-5 select-none z-10">
                    <div className="flex-grow border-t border-slate-200/60" />
                    <span className="mx-3 flex-shrink text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                      {activeTiers[1].dividerLabel}
                    </span>
                    <div className="flex-grow border-t border-slate-200/60" />
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3.5 z-10">
                    {activeTiers[1].features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-cyan-500/10 text-cyan-600 shrink-0 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                // SHOWS 2 DIGITAL SUBSCRIPTION PASSES (Expand/Collapse accordion style)
                <motion.div
                  key="subscription-cards"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  className="w-full flex flex-col gap-4"
                >
                  {activeTiers.filter(t => t.id !== 'device').map((tier) => {
                    const isSelected = activeSubTier === tier.id;
                    const isCyan = tier.colorTheme === 'cyan';

                    return (
                      <button
                        key={tier.id}
                        onClick={() => { setActiveSubTier(tier.id as 'monthly' | 'annual'); setIsSubmitted(false); }}
                        className={`w-full text-left relative rounded-[32px] p-7 md:p-8 bg-white/80 backdrop-blur-xl border transition-all duration-500 ease-[0.16,1,0.3,1] outline-none select-none cursor-pointer flex flex-col overflow-hidden isolate ${isSelected
                          ? isCyan
                            ? 'border-cyan-300 shadow-[0_25px_60px_rgba(6,182,212,0.06)] scale-[1.01]'
                            : 'border-amber-300 shadow-[0_25px_60px_rgba(245,158,11,0.06)] scale-[1.01]'
                          : 'border-slate-200/60 opacity-60 hover:opacity-90 hover:scale-[1.005]'
                          }`}
                      >
                        {/* Radial Glow Overlay */}
                        {isSelected && (
                          <div className={`absolute inset-0 w-full h-full bg-gradient-to-bl ${isCyan ? 'from-cyan-400/10 via-cyan-400/3' : 'from-amber-400/10 via-amber-400/3'
                            } to-transparent pointer-events-none z-0`} />
                        )}

                        {/* Chevrons */}
                        {isCyan ? (
                          <div className="absolute top-0 right-0 w-44 h-44 opacity-80 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/20 overflow-visible" style={{ overflow: 'visible' }}>
                              <defs>
                                <linearGradient id="chevCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                                </linearGradient>
                              </defs>
                              <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevCyanGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevCyanGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                            </svg>
                          </div>
                        ) : (
                          <div className="absolute top-0 right-0 w-44 h-44 opacity-80 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/25 overflow-visible" style={{ overflow: 'visible' }}>
                              <defs>
                                <linearGradient id="chevAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
                                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                                </linearGradient>
                              </defs>
                              <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevAmberGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevAmberGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                            </svg>
                          </div>
                        )}

                        {/* Top corner badge */}
                        {tier.badge && (
                          <span className={`absolute top-5 right-5 text-[8.5px] font-black font-mono tracking-widest px-3 py-1.5 rounded-full uppercase border backdrop-blur-md shadow-3xs z-10 ${isSelected
                            ? isCyan
                              ? 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30'
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                            : 'bg-slate-100/80 text-slate-500 border-slate-200/50'
                            }`}>
                            {tier.badge}
                          </span>
                        )}

                        {/* Icon badge frame */}
                        <div className={`w-14 h-14 rounded-full mb-5.5 relative z-10 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md border transition-all duration-300 hover:scale-105 ${isSelected
                          ? isCyan
                            ? 'border-cyan-300/40 shadow-[0_8px_24px_rgba(6,182,212,0.15)]'
                            : 'border-amber-300/40 shadow-[0_8px_24px_rgba(245,158,11,0.15)]'
                          : 'border-slate-200'
                          }`}>
                          <img
                            src={isCyan ? "/icon_badge_Monthly Pass.webp" : "/icon_badge_Annual Pass.webp"}
                            alt={tier.name}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        </div>

                        <div className="flex items-center gap-2 mb-1 z-10">
                          <h3 className="text-xl font-bold text-slate-900 leading-none">{tier.name}</h3>
                          {isSelected && (
                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${isCyan ? 'text-cyan-500' : 'text-amber-500'}`} />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4 pr-10 min-h-[24px] z-10">{tier.description}</p>

                        <div className="flex items-baseline gap-1.5 z-10">
                          <span className="text-3xl font-black text-slate-900 tracking-tight">{tier.price}</span>
                          <span className="text-xs font-semibold text-slate-400">/{tier.period}</span>
                        </div>

                        {/* Expandable features summary on selection */}
                        <motion.div
                          initial={false}
                          animate={{ height: isSelected ? 'auto' : 0, opacity: isSelected ? 1 : 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden w-full"
                        >
                          <div className="relative flex items-center my-4.5 select-none z-10">
                            <div className="flex-grow border-t border-slate-200/50" />
                            <span className="mx-3 flex-shrink text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                              {tier.dividerLabel}
                            </span>
                            <div className="flex-grow border-t border-slate-200/50" />
                          </div>

                          <div className="space-y-2.5 pb-5 pt-1">
                            {tier.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-650 font-medium">
                                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 shadow-2xs bg-slate-100 text-slate-650`}>
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: CHECKOUT/PRE-ORDER HUB */}
          <div className="w-full lg:col-span-7">
            <div className="relative w-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[32px] p-6 md:p-9.5 overflow-hidden">

              {/* Blur neon light accents inside right panel */}
              <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${activeSelectedTier.colorTheme === 'cyan'
                ? 'bg-cyan-500/10'
                : activeSelectedTier.colorTheme === 'blue'
                  ? 'bg-blue-500/10'
                  : 'bg-amber-500/10'
                }`} />

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="preorder-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8 relative z-10"
                  >
                    {/* Header */}
                    <div className="border-b border-slate-200/50 pb-5">
                      <h3 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
                        {t.checkoutTitle}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                        {t.checkoutSub}
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span className="font-semibold">{errorMsg}</span>
                      </div>
                    )}

                    {/* Form fields */}
                    <form onSubmit={handlePreOrderSubmit} className="space-y-6">
                      <div className="space-y-4">
                        
                        {/* Parent Name */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t.parentNameLabel}
                          </label>
                          <input
                            type="text"
                            required
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 placeholder:text-slate-400 shadow-3xs"
                            placeholder={t.parentNamePlaceholder}
                          />
                        </div>

                        {/* Contact Phone */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t.phoneLabel}
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 placeholder:text-slate-400 shadow-3xs"
                            placeholder={t.phonePlaceholder}
                          />
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t.emailLabel}
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 placeholder:text-slate-400 shadow-3xs"
                            placeholder={t.emailPlaceholder}
                          />
                        </div>

                        {/* Shipping Address */}
                        <div className="overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1]" style={{ height: !hasDevice ? 'auto' : 0, opacity: !hasDevice ? 1 : 0 }}>
                          <div className="pt-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {t.addressLabel}
                            </label>
                            <input
                              type="text"
                              required={!hasDevice}
                              value={shippingAddress}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-base outline-none transition-all font-sans text-slate-800 placeholder:text-slate-400 shadow-3xs"
                              placeholder={t.addressPlaceholder}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Order Summary */}
                      <div className="bg-slate-50/70 border border-slate-200/60 rounded-3xl p-6 shadow-sm font-sans mt-4">
                        <div className="w-full">
                          <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mb-3.5 font-mono">
                            {t.benefitsLabel}
                          </span>
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-center text-xs text-slate-650 font-medium">
                              <span>{!hasDevice ? t.summaryRobot : `${language === 'vi' ? 'Gia hạn:' : 'Renewal:'} ${activeSelectedTier.name}`}</span>
                              <span className="font-bold text-slate-800">{activeSelectedTier.price}</span>
                            </div>
                            {!hasDevice && (
                              <div className="flex justify-between items-center text-xs text-slate-655 font-medium">
                                <span>{t.summaryPremium}</span>
                                <span className="font-bold text-indigo-650 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md text-[10px]">
                                  {t.summaryGift}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-xs text-slate-655 font-medium">
                              <span>{t.summaryDelivery}</span>
                              <span className="font-bold text-emerald-600">{!hasDevice ? t.summaryFree : '--'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-200/80 pt-4 mt-4 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.summaryTotal}:</span>
                            <span className="text-xl font-black text-slate-900 tracking-tight">{activeSelectedTier.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Primary Order CTA */}
                      <button
                        type="submit"
                        className="w-full py-4.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center justify-center gap-2 group"
                      >
                        <span>{t.btnSubmitDevice}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  // PRE-ORDER COUPON SUCCESS SCREEN (Replaces preorder form inside right panel)
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className="flex flex-col items-center justify-center gap-7 text-center relative z-10 py-6"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border shadow-2xs ${activeDetails.badgeColor} border-current/25 bg-white/90`}>
                        <Check className="w-4 h-4 stroke-[3]" /> {t.successTitle}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t.successSub}</h3>
                    </div>

                    {/* 3D Holo-card */}
                    <div
                      ref={cardRef}
                      className="w-full max-w-[320px] h-[190px] cursor-pointer relative"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{ perspective: 1000 }}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${activeDetails.gradient} border p-5.5 rounded-3xl flex flex-col justify-between text-white shadow-2xl overflow-hidden`}
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        whileHover={{ scale: 1.03 }}
                      >
                        {/* Metallic glowing pass backplate overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />

                        <div className="flex justify-between items-start z-10">
                          <span className="text-[9px] font-mono font-black tracking-widest text-slate-300 uppercase">{t.cardTitle}</span>
                          <div className="w-8 h-5.5 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-sm shadow-inner" />
                        </div>
                        <div className="text-center my-3 z-10">
                          <div className={`text-lg md:text-xl font-mono font-black tracking-widest ${activeDetails.textColor}`}>
                            {passCode}
                          </div>
                        </div>
                        <div className="flex justify-between items-end z-10 border-t border-white/10 pt-2.5">
                          <div className="text-left font-mono">
                            <div className="text-[7px] text-slate-400 uppercase tracking-wider">{t.member}</div>
                            <div className="text-xs font-extrabold text-white truncate max-w-[140px]">{parentName}</div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="text-[7px] text-slate-400 uppercase tracking-wider">{t.placement}</div>
                            <div className="text-xs font-extrabold text-emerald-400">#{reservationNum}</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Copy pass code & Done control tray */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2">
                      <button
                        onClick={() => handleCopy(passCode, 'copylink')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${copiedText === 'copylink'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          }`}
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        <span>{copiedText === 'copylink' ? t.copied : language === 'vi' ? 'Chép mã đặt trước' : 'Copy pre-order code'}</span>
                      </button>
                      <button
                        onClick={() => { setIsSubmitted(false); setParentName(''); setPhone(''); setEmail(''); setShippingAddress(''); }}
                        className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                      >
                        {t.btnDone}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
