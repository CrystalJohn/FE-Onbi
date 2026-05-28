'use client'

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Check, ArrowRight, ClipboardCopy, Phone, Smartphone, Cpu, Calendar, Gift, User, Percent, Mail, Bot } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/lib/animations';
import { useLanguage } from '@/context/LanguageContext';

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
}

const getTiers = (language: 'en' | 'vi'): PricingTier[] => {
  if (language === 'vi') {
    return [
      {
        id: 'monthly',
        name: 'Thành viên Tháng',
        badge: 'Quyền truy cập ứng dụng',
        description: 'Dành cho các bé đã sở hữu thiết bị ONBI và muốn tiếp tục sử dụng tất cả tính năng thông minh.',
        price: '149.000đ',
        period: 'tháng',
        quickSpecs: [
          { icon: 'user', text: '1 tài khoản học sinh' },
          { icon: 'smartphone', text: 'Cập nhật ứng dụng liên tục' }
        ],
        dividerLabel: 'QUYỀN TRUY CẬP THÁNG +',
        features: [
          'Ghi âm đám mây & xem lại lịch sử học',
          'Tự động theo dõi tiến trình học tập',
          'Phân tích hành vi học tập bằng AI (AI-based)',
          'Robot tương tác thông minh & nhắc nhở',
          'Gửi mốc thời gian học theo thời gian thực về điện thoại',
          'Báo cáo hành vi hàng ngày & hàng tuần',
          'Thông báo & cảnh báo tức thời',
          'Hủy gia hạn bất cứ lúc nào'
        ],
        cta: 'Đăng ký theo Tháng',
        highlighted: false,
      },
      {
        id: 'device',
        name: 'Trọn gói ONBI IoT',
        badge: 'Phổ biến nhất',
        description: 'Nhận thiết bị robot thông minh ONBI thế hệ mới cùng với 3 tháng sử dụng Premium đầy đủ tính năng.',
        price: '4.599.000đ',
        period: 'một lần',
        quickSpecs: [
          { icon: 'bot', text: '1 robot IoT vật lý (Đợt #1)' },
          { icon: 'gift', text: 'Tặng 3 tháng Premium' }
        ],
        dividerLabel: 'TRỌN GÓI ONBI IoT +',
        features: [
          'Robot thông minh ONBI đồng hành cùng con',
          'Tặng 3 tháng đăng ký Premium',
          'Xem trực tuyến theo thời gian thực (miễn phí)',
          'Chụp ảnh thủ công lưu niệm',
          'Theo dõi trạng thái học tập cơ bản miễn phí trọn đời',
          'Phân tích đầy đủ hành vi học tập bằng AI (AI-based)',
          'Gia hạn bảo hành phần cứng 2 năm',
          'Miễn phí vận chuyển toàn quốc'
        ],
        cta: 'Đặt mua Trọn gói IoT',
        highlighted: true,
      },
      {
        id: 'annual',
        name: 'Thành viên Năm',
        badge: 'Tiết kiệm 11%',
        description: 'Giá trị lâu dài tốt nhất để hỗ trợ thói quen học tập độc lập và sự tự tin nói tiếng Anh của con.',
        price: '1.599.000đ',
        period: 'năm',
        quickSpecs: [
          { icon: 'user', text: '1 tài khoản học sinh' },
          { icon: 'percent', text: 'Tiết kiệm 11% so với đóng theo tháng' }
        ],
        dividerLabel: 'QUYỀN TRUY CẬP NĂM +',
        features: [
          '12 tháng sử dụng đầy đủ dịch vụ Premium',
          'Ghi âm đám mây & xem lại lịch sử học',
          'Tự động theo dõi tiến trình học tập',
          'Phân tích hành vi học tập bằng AI (AI-based)',
          'Robot tương tác thông minh & nhắc nhở',
          'Báo cáo hành vi hàng ngày & hàng tuần về điện thoại',
          'Hỗ trợ kỹ thuật & khách hàng ưu tiên 24/7',
          'Cập nhật tính năng ứng dụng miễn phí trọn đời'
        ],
        cta: 'Đăng ký theo Năm',
        highlighted: false,
      },
    ];
  }

  return [
    {
      id: 'monthly',
      name: 'Monthly Pass',
      badge: 'App Access',
      description: 'For children who already own the ONBI device and want continued access to all smart features.',
      price: '149,000đ',
      period: 'month',
      quickSpecs: [
        { icon: 'user', text: '1 student account' },
        { icon: 'smartphone', text: 'Continuous app updates' }
      ],
      dividerLabel: 'MONTHLY ACCESS +',
      features: [
        'Cloud recording & video playback',
        'Automated learning progress tracking',
        'AI-powered study behavior analysis (AI-based)',
        'Smart interactive robot & reminders',
        'Real-time study timeline sent to phone',
        'Daily & weekly behavioral reports',
        'Instant real-time notifications & alerts',
        'Cancel subscription anytime'
      ],
      cta: 'Subscribe Monthly',
      highlighted: false,
    },
    {
      id: 'device',
      name: 'ONBI IoT Bundle',
      badge: 'Most Popular',
      description: 'Get the next-generation ONBI smart robot device plus 3 months of full-featured Premium access.',
      price: '4,599,000đ',
      period: 'one-time',
      quickSpecs: [
        { icon: 'bot', text: '1 physical IoT robot (Batch #1)' },
        { icon: 'gift', text: '3 months of free Premium' }
      ],
      dividerLabel: 'ONBI IoT BUNDLE +',
      features: [
        'ONBI physical smart robot companion',
        '3 months of free Premium subscription',
        'Free real-time Live View (no fees)',
        'Free manual photo snapshot capture',
        'Lifetime free basic study status tracking',
        'Full AI study behavior analysis (AI-based)',
        '2-year extended hardware warranty',
        'Free shipping nationwide'
      ],
      cta: 'Reserve IoT Bundle',
      highlighted: true,
    },
    {
      id: 'annual',
      name: 'Annual Pass',
      badge: 'Save 11%',
      description: 'The best long-term value to support your child\'s independent study habits and English fluency.',
      price: '1,599,000đ',
      period: 'year',
      quickSpecs: [
        { icon: 'user', text: '1 student account' },
        { icon: 'percent', text: 'Save 11% compared to monthly' }
      ],
      dividerLabel: 'ANNUAL ACCESS +',
      features: [
        '12 months of full Premium services',
        'Cloud recording & video playback',
        'Automated learning progress tracking',
        'AI-powered study behavior analysis (AI-based)',
        'Smart interactive robot & reminders',
        'Daily & weekly behavioral reports on phone',
        '24/7 priority customer & tech support',
        'Lifetime free app feature updates'
      ],
      cta: 'Subscribe Annually',
      highlighted: false,
    },
  ];
};

const renderSpecIcon = (iconName: string) => {
  switch (iconName) {
    case 'user':
      return <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    case 'smartphone':
      return <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    case 'cpu':
      return <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    case 'bot':
      return <Bot className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    case 'gift':
      return <Gift className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    case 'percent':
      return <Percent className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    default:
      return <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  }
};

export default function EarlyAccessForm() {
  const { language } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('7');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [reservationNum] = useState<number>(() => Math.floor(400 + Math.random() * 200));
  const [passCode, setPassCode] = useState('');

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

  const t = {
    en: {
      tag: "Membership pricing.",
      headingLine1: "Choose the perfect plan",
      headingLine2: "for your child.",
      subheading: "Select a plan that fits your family's needs and help your child build natural study habits and English speaking confidence.",
      customSchool: "Looking for custom school or institutional volume setups? Contact our team",
      reserveSpot: "Reserve Your MVP Unit",
      batchInfo: "First physical production batch starting Q3 2026.",
      selected: "Selected:",
      parentNameLabel: "Parent / Guardian Name",
      parentNamePlaceholder: "e.g. Eleanor Vance",
      childAgeLabel: "Child's Age",
      childAgeValue: "Aged {age} years",
      emailLabel: "Email Address",
      emailPlaceholder: "e.g. parent@study.com",
      btnReserve: "Reserve Batch Placement",
      safetyNote: "No credit card required. COPPA compliant & secure.",
      confirmTitle: "Reservation Confirmed",
      confirmSub: "Your Pass is Sealed!",
      passTitle: "ONBI MEMBER PASS",
      member: "Member",
      placement: "Placement",
      btnCopy: "Copy Code",
      btnDone: "Done",
      errName: "Please enter your name.",
      errEmail: "Please enter a valid email."
    },
    vi: {
      tag: "Bảng giá thành viên.",
      headingLine1: "Chọn gói thành viên",
      headingLine2: "phù hợp nhất cho con.",
      subheading: "Lựa chọn kế hoạch phù hợp với nhu cầu gia đình để giúp con xây dựng thói quen học tự nhiên và tự tin nói tiếng Anh.",
      customSchool: "Bạn muốn tìm kiếm giải pháp tùy chỉnh cho trường học hoặc tổ chức? Liên hệ với chúng tôi",
      reserveSpot: "Đặt trước sản phẩm",
      batchInfo: "Lô sản phẩm đầu tiên dự kiến sản xuất vào Q3 2026.",
      selected: "Đã chọn:",
      parentNameLabel: "Tên Ba mẹ / Người giám hộ",
      parentNamePlaceholder: "Ví dụ: Nguyễn Văn A",
      childAgeLabel: "Tuổi của con",
      childAgeValue: "Bé {age} tuổi",
      emailLabel: "Địa chỉ Email",
      emailPlaceholder: "Ví dụ: bame@gmail.com",
      btnReserve: "Đặt trước ưu đãi",
      safetyNote: "Không cần thẻ tín dụng. Bảo mật và tuân thủ COPPA.",
      confirmTitle: "Đặt hàng thành công!",
      confirmSub: "Thẻ thành viên của bạn đã sẵn sàng!",
      passTitle: "THẺ THÀNH VIÊN ONBI",
      member: "Thành viên",
      placement: "Số thứ tự",
      btnCopy: "Sao chép mã",
      btnDone: "Hoàn thành",
      errName: "Vui lòng nhập tên của bạn.",
      errEmail: "Vui lòng nhập email hợp lệ."
    }
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) { setErrorMsg(t.errName); return; }
    if (!email.trim() || !email.includes('@')) { setErrorMsg(t.errEmail); return; }
    setErrorMsg('');
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setPassCode(`ONBI-2026-CH${childAge}-${suffix}`);
    setIsSubmitted(true);
  };

  // Get active selected tier styling for modal and holograph card
  const getSelectedTierDetails = () => {
    const tier = activeTiers.find(t => t.id === selectedTier);
    if (!tier) return { name: '', price: '', period: '', gradient: 'from-indigo-950 to-slate-900 border-indigo-900', textColor: 'text-orange-400', badgeColor: 'bg-emerald-50 text-emerald-700' };
    
    if (tier.id === 'monthly') {
      return {
        name: tier.name,
        price: tier.price,
        period: tier.period,
        gradient: 'from-cyan-950 to-slate-900 border-cyan-800',
        textColor: 'text-cyan-400',
        badgeColor: 'bg-cyan-50 text-cyan-700'
      };
    } else if (tier.id === 'device') {
      return {
        name: tier.name,
        price: tier.price,
        period: tier.period,
        gradient: 'from-purple-950 to-slate-900 border-purple-900',
        textColor: 'text-purple-400',
        badgeColor: 'bg-purple-50 text-purple-700'
      };
    } else {
      return {
        name: tier.name,
        price: tier.price,
        period: tier.period,
        gradient: 'from-amber-950 to-slate-900 border-amber-800',
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-50 text-amber-700'
      };
    }
  };

  const activeDetails = getSelectedTierDetails();

  return (
    <div className="space-y-14 relative" id="onbi_pricing_section_container">
      
      {/* Soft premium mesh background glows to elevate glassmorphism contrast */}
      <div className="absolute inset-0 -top-20 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-[10%] w-[350px] h-[350px] rounded-full bg-cyan-300/15 blur-[100px]" />
        <div className="absolute top-1/3 right-[15%] w-[450px] h-[450px] rounded-full bg-purple-400/15 blur-[110px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] rounded-full bg-orange-300/10 blur-[120px]" />
      </div>

      {/* Apple-style Premium Section Header */}
      <motion.div
        className="max-w-[1400px] mx-auto text-left space-y-4 px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        {/* Category Label */}
        <span className="text-[20px] md:text-[22px] font-semibold text-[#1d1d1f] tracking-tight block">
          {t.tag}
        </span>
        
        {/* Giant Two-Line Apple-style Typography */}
        <h2 className="font-display text-4xl sm:text-5xl md:text-[76px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.08] flex flex-col">
          <span>{t.headingLine1}</span>
          <span>{t.headingLine2}</span>
        </h2>
        
        {/* Apple Signature Spacious Copy */}
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

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto px-2"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        {activeTiers.map((tier) => (
          <motion.div
            key={tier.id}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            className={`relative rounded-[32px] p-7.5 flex flex-col transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-2.5 bg-white/70 backdrop-blur-xl border-2 ${
              tier.highlighted
                ? 'border-purple-400/45 shadow-[0_30px_70px_rgba(147,51,234,0.11),_0_0_40px_rgba(147,51,234,0.06)] scale-[1.03] z-10'
                : tier.id === 'monthly'
                ? 'border-cyan-300/40 shadow-[0_25px_60px_rgba(6,182,212,0.05)]'
                : 'border-amber-300/35 shadow-[0_25px_60px_rgba(245,158,11,0.05)]'
            }`}
          >
            {/* Glowing top-down overlays bleeding from the top-right corner */}
            {tier.id === 'monthly' && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-400/20 via-cyan-400/5 to-transparent rounded-tr-[30px] pointer-events-none z-0" />
            )}
            {tier.id === 'device' && (
              <>
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-500/25 via-purple-500/5 to-transparent rounded-tr-[30px] pointer-events-none z-0" />
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-orange-400/25 blur-3xl pointer-events-none z-0" />
              </>
            )}
            {tier.id === 'annual' && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/20 via-amber-400/5 to-transparent rounded-tr-[30px] pointer-events-none z-0" />
            )}

            {/* Thick isometric chevrons and starry sky from the concept mockup */}
            {tier.id === 'monthly' && (
              <div className="absolute top-0 right-0 w-44 h-44 opacity-80 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/25">
                  <defs>
                    <linearGradient id="chevCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevCyanGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevCyanGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <circle cx="82" cy="18" r="1.2" fill="white" />
                  <circle cx="70" cy="52" r="0.8" fill="white" />
                  <circle cx="45" cy="12" r="1" fill="white" />
                  <path d="M55 20 L56 22 L58 23 L56 24 L55 26 L54 24 L52 23 L54 22 Z" fill="white" opacity="0.9" />
                </svg>
              </div>
            )}
            {tier.id === 'device' && (
              <div className="absolute top-0 right-0 w-48 h-48 opacity-95 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400/35">
                  <defs>
                    <linearGradient id="chevPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {/* Thick rounded chevron tracks overlapping perfectly like the concept */}
                  <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevPurpleGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevPurpleGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  
                  {/* Glowing star particles */}
                  <circle cx="82" cy="18" r="1.5" fill="white" className="animate-ping" />
                  <circle cx="74" cy="52" r="0.9" fill="white" />
                  <circle cx="45" cy="12" r="0.8" fill="white" />
                  <path d="M55 20 L56 22 L58 23 L56 24 L55 26 L54 24 L52 23 L54 22 Z" fill="white" opacity="0.95" />
                  <path d="M75 45 L76 47 L78 48 L76 49 L75 51 L74 49 L72 48 L74 47 Z" fill="white" opacity="0.8" />
                </svg>
              </div>
            )}
            {tier.id === 'annual' && (
              <div className="absolute top-0 right-0 w-44 h-44 opacity-80 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/25">
                  <defs>
                    <linearGradient id="chevAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevAmberGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevAmberGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <circle cx="82" cy="18" r="1.2" fill="white" />
                  <circle cx="70" cy="52" r="0.8" fill="white" />
                  <circle cx="45" cy="12" r="1" fill="white" />
                  <path d="M55 20 L56 22 L58 23 L56 24 L55 26 L54 24 L52 23 L54 22 Z" fill="white" opacity="0.8" />
                </svg>
              </div>
            )}

            {/* Badge styled as a premium translucent glass pill */}
            {tier.badge && (
              <span className={`absolute top-5 right-5 text-[9px] font-bold font-mono tracking-widest px-3 py-1.5 rounded-full uppercase border backdrop-blur-md shadow-sm z-10 ${
                tier.highlighted 
                  ? 'bg-purple-600/10 text-purple-700 border-purple-500/20 shadow-purple-500/5'
                  : tier.id === 'monthly'
                  ? 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
              }`}>
                {tier.badge}
              </span>
            )}

            {/* Premium 3D Swirl Spherical Brand Logo matching the concept exactly */}
            {tier.id === 'monthly' && (
              <div className="w-14 h-14 rounded-full mb-6.5 relative z-10 select-none shadow-[0_8px_24px_rgba(6,182,212,0.22)] border border-cyan-300/40 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105">
                <img 
                  src="/icon_badge_Monthly Pass.png" 
                  alt="Monthly Pass" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
            {tier.id === 'device' && (
              <div className="w-14 h-14 rounded-full mb-6.5 relative z-10 select-none shadow-[0_8px_24px_rgba(139,92,246,0.25)] border border-purple-300/40 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105">
                <img 
                  src="/icon_badge_pricing_card.webp" 
                  alt="ONBI Focus Core" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
            {tier.id === 'annual' && (
              <div className="w-14 h-14 rounded-full mb-6.5 relative z-10 select-none shadow-[0_8px_24px_rgba(245,158,11,0.22)] border border-amber-300/40 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105">
                <img 
                  src="/icon_badge_Annual Pass.png" 
                  alt="Annual Pass" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}

            {/* Name & description */}
            <h3 className="text-xl font-bold text-slate-900 mb-1 z-10">{tier.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5 min-h-[36px]">{tier.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-4 z-10 relative">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{tier.price}</span>
              <span className="text-xs font-semibold text-slate-400">/{tier.period}</span>
            </div>

            {/* Action CTA Button placed immediately below the price */}
            <div className="mb-6 z-10 relative">
              {tier.highlighted ? (
                <button
                  onClick={() => setSelectedTier(tier.id)}
                  className="w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center justify-center gap-2 group"
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  onClick={() => setSelectedTier(tier.id)}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-[#18181a] hover:bg-black text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 group border border-slate-900"
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>

            {/* Quick Specs List */}
            <div className="space-y-2 mb-6 z-10 relative">
              {tier.quickSpecs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2.5 text-[11px] text-slate-600 font-medium">
                  {renderSpecIcon(spec.icon)}
                  <span>{spec.text}</span>
                </div>
              ))}
            </div>

            {/* Divider styled after the concept design */}
            <div className="relative flex items-center my-5 select-none z-10">
              <div className="flex-grow border-t border-slate-200/60" />
              <span className="mx-3 flex-shrink text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                {tier.dividerLabel}
              </span>
              <div className="flex-grow border-t border-slate-200/60" />
            </div>

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-2 z-10 relative">
              {tier.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-slate-600 leading-normal">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  {feat.includes('AI-based') ? (
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span>{feat.replace('(AI-based)', '')}</span>
                      <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-sm">
                        ✨ AI-based
                      </span>
                    </div>
                  ) : (
                    <span>{feat}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Contact For Custom */}
      <div className="text-center pt-2">
        <button 
          onClick={() => setSelectedTier('device')} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#22d3ee] transition-colors group cursor-pointer"
        >
          <Mail className="w-4 h-4 text-slate-455 group-hover:rotate-6 transition-transform" />
          <span>{t.customSchool}</span>
        </button>
      </div>

      {/* Reservation Form Modal */}
      {selectedTier && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setSelectedTier(null)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl z-10 border border-slate-100 overflow-hidden">
            
            {/* Soft decorative background glow inside modal */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 blur-2xl pointer-events-none" />

            <button
              onClick={() => setSelectedTier(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all cursor-pointer z-20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{t.reserveSpot}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                    <span>{t.selected}</span>
                    <span className="font-bold text-slate-800">{activeDetails.name}</span>
                    <span className="text-[#22d3ee] font-black">—</span>
                    <span className="font-bold text-indigo-600">{activeDetails.price}/{activeDetails.period}</span>
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-755 rounded-xl text-xs border border-red-100">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{t.parentNameLabel}</label>
                    <input
                      type="text"
                      placeholder={t.parentNamePlaceholder}
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#22d3ee] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{t.childAgeLabel}</label>
                    <select
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#22d3ee] rounded-xl px-4 py-3 text-sm outline-none bg-white transition-colors"
                    >
                      {[6,7,8,9,10,11].map(age => (
                        <option key={age} value={age}>
                          {t.childAgeValue.replace('{age}', age.toString())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{t.emailLabel}</label>
                    <input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#22d3ee] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#22d3ee] hover:bg-cyan-400 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  {t.btnReserve}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  {t.safetyNote}
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-5 text-center relative z-10">
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${activeDetails.badgeColor} border-current/20`}>
                  <Check className="w-3.5 h-3.5" /> {t.confirmTitle}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{t.confirmSub}</h3>

                {/* 3D Holo-card styled dynamically based on chosen tier */}
                <div
                  ref={cardRef}
                  className="w-full max-w-[300px] h-[170px] cursor-pointer"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${activeDetails.gradient} border p-5 rounded-2xl flex flex-col justify-between text-white shadow-xl overflow-hidden`}
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono font-black tracking-wider text-white/80">{t.passTitle}</span>
                      <div className="w-7 h-5 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-sm" />
                    </div>
                    <div className="text-center">
                      <div className={`text-base font-mono font-bold tracking-widest ${activeDetails.textColor}`}>{passCode}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <div className="text-[7px] text-slate-400 uppercase font-mono tracking-wider">{t.member}</div>
                        <div className="text-xs font-bold text-white truncate max-w-[130px]">{parentName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[7px] text-slate-400 uppercase font-mono tracking-wider">{t.placement}</div>
                        <div className="text-xs font-bold text-emerald-400 font-mono">#{reservationNum}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="flex gap-2.5 w-full mt-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(passCode)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <ClipboardCopy className="w-4 h-4" /> {t.btnCopy}
                  </button>
                  <button
                    onClick={() => { setIsSubmitted(false); setSelectedTier(null); }}
                    className="px-5 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {t.btnDone}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
