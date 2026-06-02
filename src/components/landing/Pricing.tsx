'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Check, ArrowRight, ClipboardCopy, Phone, Mail, Bot, User, Smartphone, Cpu, Gift, Percent, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fadeUp, staggerContainer, viewport } from '@/lib/animations';

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
  colorTheme: 'cyan' | 'purple' | 'amber';
}

const getTiers = (language: 'en' | 'vi'): PricingTier[] => {
  if (language === 'vi') {
    return [
      {
        id: 'monthly',
        name: 'Thành viên Tháng',
        badge: 'Quyền truy cập ứng dụng',
        description: 'Dành cho phụ huynh đã sở hữu thiết bị ONBI và muốn duy trì các tính năng theo dõi, báo cáo và cảnh báo thông minh mỗi tháng.',
        price: '149.000đ',
        period: 'tháng',
        quickSpecs: [
          { icon: 'user', text: '1 tài khoản học sinh' },
          { icon: 'smartphone', text: 'Cập nhật ứng dụng liên tục' }
        ],
        dividerLabel: 'QUYỀN TRUY CẬP THÁNG +',
        features: [
          'Xem lại lịch sử phiên học',
          'Theo dõi tiến trình tự động',
          'Cảnh báo mất tập trung & sai tư thế',
          'Robot nhắc học thông minh',
          'Thông báo realtime cho phụ huynh',
          'Báo cáo ngày / tuần'
        ],
        cta: 'Đăng ký theo Tháng',
        highlighted: false,
        colorTheme: 'cyan',
      },
      {
        id: 'device',
        name: 'Trọn gói ONBI IoT',
        badge: 'Phổ biến nhất',
        description: 'Sở hữu robot học tập thông minh ONBI kèm 3 tháng Premium để theo dõi, nhắc nhở và báo cáo quá trình học của con theo thời gian thực.',
        price: '4.599.000đ',
        period: 'một lần',
        quickSpecs: [
          { icon: 'bot', text: '1 robot IoT vật lý (Đợt #1)' },
          { icon: 'gift', text: 'Tặng 3 tháng Premium' }
        ],
        dividerLabel: 'TRỌN GÓI ONBI IoT +',
        features: [
          'Thiết bị ONBI đồng hành học tập cùng con',
          '3 tháng Premium miễn phí',
          'Theo dõi phiên học Pomodoro 25/5',
          'Live View & Snapshot khi cần',
          'Cảnh báo rời bàn, sai tư thế, mất tập trung',
          'Dashboard báo cáo tiến độ cho ba mẹ'
        ],
        cta: 'Đặt mua Trọn gói IoT',
        highlighted: true,
        colorTheme: 'purple',
      },
      {
        id: 'annual',
        name: 'Thành viên Năm',
        badge: 'Tiết kiệm 11%',
        description: 'Giải pháp dài hạn giúp duy trì thói quen học tập đều đặn, theo dõi tiến độ và nhận báo cáo thông minh cho phụ huynh.',
        price: '1.599.000đ',
        period: 'năm',
        quickSpecs: [
          { icon: 'user', text: '1 tài khoản học sinh' }
        ],
        dividerLabel: 'QUYỀN TRUY CẬP NĂM +',
        features: [
          '12 tháng Premium đầy đủ',
          'Tiết kiệm 11% so với trả tháng',
          'Xem lại lịch sử phiên học',
          'Theo dõi tiến trình tự động',
          'Cảnh báo mất tập trung & sai tư thế',
          'Báo cáo ngày / tuần cho phụ huynh'
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
      badge: 'App Access',
      description: 'For parents who already own the ONBI device and want to maintain smart tracking, reporting, and alerting features every month.',
      price: '149,000đ',
      period: 'month',
      quickSpecs: [
        { icon: 'user', text: '1 student account' },
        { icon: 'smartphone', text: 'Continuous app updates' }
      ],
      dividerLabel: 'MONTHLY ACCESS +',
      features: [
        'Review study session history',
        'Automated progress tracking',
        'Alerts for distraction & poor posture',
        'Smart robot study reminders',
        'Real-time notifications for parents',
        'Daily & weekly reports'
      ],
      cta: 'Subscribe Monthly',
      highlighted: false,
      colorTheme: 'cyan',
    },
    {
      id: 'device',
      name: 'ONBI IoT Bundle',
      badge: 'Most Popular',
      description: 'Own the ONBI smart learning robot plus 3 months of Premium to track, remind, and report your child\'s study progress in real-time.',
      price: '4,599,000đ',
      period: 'one-time',
      quickSpecs: [
        { icon: 'bot', text: '1 physical IoT robot (Batch #1)' },
        { icon: 'gift', text: '3 months of free Premium' }
      ],
      dividerLabel: 'ONBI IoT BUNDLE +',
      features: [
        'ONBI smart robot companion for active learning',
        '3 months of free Premium access',
        'Track 25/5 Pomodoro study sessions',
        'Real-time Live View & manual Snapshots',
        'Smart alerts for table leaving, poor posture & distraction',
        'Parent dashboard with comprehensive progress reports'
      ],
      cta: 'Reserve IoT Bundle',
      highlighted: true,
      colorTheme: 'purple',
    },
    {
      id: 'annual',
      name: 'Annual Pass',
      badge: 'Save 11%',
      description: 'A long-term solution to maintain regular study habits, track progress, and receive smart reports for parents.',
      price: '1,599,000đ',
      period: 'year',
      quickSpecs: [
        { icon: 'user', text: '1 student account' }
      ],
      dividerLabel: 'ANNUAL ACCESS +',
      features: [
        '12 months of full Premium access',
        'Save 11% compared to monthly pass',
        'Review study session history',
        'Automated progress tracking',
        'Alerts for distraction & poor posture',
        'Daily & weekly reports for parents'
      ],
      cta: 'Subscribe Annually',
      highlighted: false,
      colorTheme: 'amber',
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

  // Segmented control: false -> Chưa có thiết bị (Mua mới), true -> Đã có thiết bị (Gia hạn app)
  const [hasDevice, setHasDevice] = useState<boolean>(false);
  const [activeSubTier, setActiveSubTier] = useState<'monthly' | 'annual'>('annual');

  // Checkout inputs
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Submission & UX states
  const [showQRStep, setShowQRStep] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedText, setCopiedText] = useState<'copylink' | 'copycode' | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
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
      headingLine2: "for your child.",
      subheading: "Select a plan that fits your family's needs and help your child build natural study habits and English speaking confidence.",
      toggleNoDevice: "🤖 New Order (Need Robot)",
      toggleHasDevice: "💳 Renewal (Own Robot)",
      checkoutTitle: "Interactive Checkout Hub",
      parentNameLabel: "Parent / Guardian Name",
      parentNamePlaceholder: "Eleanor Vance",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g. 0912345678",
      emailLabel: "Email Address",
      emailPlaceholder: "parent@study.com",
      addressLabel: "Shipping Address (For physical robot delivery)",
      addressPlaceholder: "123 Apple St, District 1, HCMC",
      billedNow: "Billed now:",
      transferNote: "Scan QR code via banking app or transfer manually to complete your placement.",
      copyBtn: "Copy",
      copied: "Copied!",
      btnSubmitDevice: "Reserve IoT Bundle & Place Order ↗",
      btnSubmitSubscription: "Activate Membership Pass ↗",
      errName: "Please enter your name.",
      errPhone: "Please enter your phone number.",
      errEmail: "Please enter a valid email.",
      errAddress: "Please enter your shipping address.",
      successTitle: "Order Confirmed!",
      successSub: "Your ONBI Member Pass is Sealed",
      cardTitle: "ONBI MEMBER PASS",
      member: "Member",
      placement: "Placement",
      btnDone: "Place Another Order",
      benefitsLabel: "Package benefits:",
      invoiceSummary: "Open bank app to scan QR",
      shippingFee: "Shipping Fee",
      shippingFree: "Free Delivery",
      deviceBundle: "ONBI Smart Robot Hardware",
      subActive: "Premium App access",
      included: "Included",
      paymentCardTitle: "ONBI DEBIT HUB",
      customSchool: "Looking for custom school or institutional volume setups? Contact our team",
      batchInfo: "First physical production batch starting Q3 2026.",
      passDetails: "Pass Details",
      selected: "Selected:",
      detailsTitle: "Customer Details",
      bankName: "Bank: VPBank (Napas247)",
      bankOwner: "Account Owner: NGUYEN TUAN KHA",
      bankNumber: "Account Number: 0835173787",
      btnProceedPayment: "Confirm Info & Get Payment QR ↗",
      btnConfirmTransferred: "I have transferred successfully ✓",
      orderSummaryTitle: "Order Information Summary",
      qrInstruction: "Open bank app to scan QR code",
    },
    vi: {
      tag: "Bảng giá thành viên.",
      headingLine1: "Chọn gói thành viên",
      headingLine2: "phù hợp nhất cho con.",
      subheading: "Lựa chọn kế hoạch phù hợp với nhu cầu gia đình để giúp con xây dựng thói quen học tự nhiên và tự tin nói tiếng Anh.",
      toggleNoDevice: "Đặt mua mới (Chưa có Robot)",
      toggleHasDevice: "Gia hạn / Nâng cấp (Đã có Robot)",
      checkoutTitle: "Trung tâm Đăng ký & Thanh toán",
      parentNameLabel: "Tên Ba mẹ / Người giám hộ",
      parentNamePlaceholder: "Nguyễn Văn A",
      phoneLabel: "Số điện thoại liên hệ",
      phonePlaceholder: "Ví dụ: 0912345678",
      emailLabel: "Địa chỉ Email",
      emailPlaceholder: "bame@gmail.com",
      addressLabel: "Địa chỉ nhận hàng (Để vận chuyển Robot)",
      addressPlaceholder: "Ví dụ: Số 123 Đường Táo, Quận 1, TP. HCM",
      billedNow: "Tổng số tiền:",
      transferNote: "Quét mã QR qua ứng dụng Ngân hàng để thanh toán và giữ số thứ tự ưu tiên.",
      copyBtn: "Chép",
      copied: "Đã chép!",
      btnSubmitDevice: "Đặt mua Trọn gói IoT ↗",
      btnSubmitSubscription: "Kích hoạt gói Thành viên ↗",
      errName: "Vui lòng nhập tên của bạn.",
      errPhone: "Vui lòng nhập số điện thoại liên hệ.",
      errEmail: "Vui lòng nhập email hợp lệ.",
      errAddress: "Vui lòng nhập địa chỉ giao hàng.",
      successTitle: "Đặt đơn thành công!",
      successSub: "Thẻ thành viên của bạn đã sẵn sàng!",
      cardTitle: "THẺ THÀNH VIÊN ONBI",
      member: "Thành viên",
      placement: "Số thứ tự",
      btnDone: "Thực hiện đơn khác",
      benefitsLabel: "Quyền lợi bao gồm:",
      invoiceSummary: "Mở app ngân hàng để quét mã QR",
      shippingFee: "Phí vận chuyển",
      shippingFree: "Miễn phí giao hàng",
      deviceBundle: "Robot thông minh ONBI IoT",
      subActive: "Quyền Premium của tài khoản",
      included: "Đã bao gồm",
      paymentCardTitle: "THẺ THANH TOÁN ONBI",
      customSchool: "Bạn muốn tìm kiếm giải pháp tùy chỉnh cho trường học hoặc tổ chức? Liên hệ với chúng tôi",
      batchInfo: "Lô sản phẩm đầu tiên dự kiến sản xuất vào Q3 2026.",
      passDetails: "Chi tiết thẻ",
      selected: "Đã chọn:",
      detailsTitle: "Thông tin Khách hàng",
      bankName: "Ngân hàng: VPBank (Napas247)",
      bankOwner: "Chủ tài khoản: NGUYEN TUAN KHA",
      bankNumber: "Số tài khoản: 0835173787",
      btnProceedPayment: "Xác nhận thông tin & Nhận mã QR thanh toán ↗",
      btnConfirmTransferred: "Tôi đã chuyển khoản thành công ✓",
      orderSummaryTitle: "Tóm tắt thông tin đơn hàng",
      qrInstruction: "Mở app ngân hàng để quét mã QR",
    }
  }[language];

  const handleCopy = (text: string, type: 'copylink' | 'copycode') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCopyField = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getSubmitButtonText = () => {
    if (language === 'vi') {
      return !hasDevice
        ? "Đặt mua Trọn gói ONBI IoT ↗"
        : `Đăng ký gói ${activeSelectedTier.name} ↗`;
    } else {
      return !hasDevice
        ? "Order ONBI IoT Bundle ↗"
        : `Subscribe to ${activeSelectedTier.name} ↗`;
    }
  };

  const handleProceedToQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) { setErrorMsg(t.errName); return; }
    if (!phone.trim()) { setErrorMsg(t.errPhone); return; }
    if (!email.trim() || !email.includes('@')) { setErrorMsg(t.errEmail); return; }
    if (!hasDevice && !shippingAddress.trim()) { setErrorMsg(t.errAddress); return; }

    setErrorMsg('');
    setShowQRStep(true);
  };

  const handleConfirmPayment = () => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setPassCode(`ONBI-2026-CH${hasDevice ? 'SUB' : 'DEV'}-${suffix}`);
    setIsSubmitted(true);
  };

  const getSelectedTierDetails = () => {
    const tier = activeSelectedTier;
    if (tier.id === 'monthly') {
      return {
        gradient: 'from-cyan-950 to-slate-900 border-cyan-800',
        textColor: 'text-cyan-400',
        badgeColor: 'bg-cyan-50 text-cyan-700'
      };
    } else if (tier.id === 'device') {
      return {
        gradient: 'from-purple-950 to-slate-900 border-purple-900',
        textColor: 'text-purple-400',
        badgeColor: 'bg-purple-50 text-purple-700'
      };
    } else {
      return {
        gradient: 'from-amber-950 to-slate-900 border-amber-800',
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-50 text-amber-700'
      };
    }
  };

  const activeDetails = getSelectedTierDetails();

  // Render VPBank VietQR Code crop image provided by user
  const renderVirtualQR = () => {
    return (
      <div className="flex flex-col items-center justify-center p-4.5 bg-white rounded-2xl shadow-inner border border-slate-100 select-none">
        <img
          src="/QR-for-pricing.jpg"
          alt="VPBank VietQR Payment"
          className="w-36 h-36 md:w-44 md:h-44 bg-white rounded-lg object-contain"
          draggable={false}
        />
      </div>
    );
  };

  return (
    <div className="space-y-14 relative" id="onbi_pricing_section_container">

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
      <div className="flex justify-center relative z-20 px-6">
        <div className="relative flex p-1 bg-slate-100/80 backdrop-blur-md rounded-full border border-slate-200/60 max-w-lg w-full shadow-2xs select-none">

          {/* Sliding white background pill */}
          <motion.div
            className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm z-0"
            layoutId="activeSegment"
            style={{ width: 'calc(50% - 4px)' }}
            animate={{ x: hasDevice ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          />
          <button
            onClick={() => { setHasDevice(false); setIsSubmitted(false); setShowQRStep(false); }}
            className={`flex-1 relative z-10 py-3 rounded-full text-xs md:text-sm font-bold tracking-tight text-center cursor-pointer transition-colors ${!hasDevice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {t.toggleNoDevice}
          </button>
          <button
            onClick={() => { setHasDevice(true); setIsSubmitted(false); setShowQRStep(false); }}
            className={`flex-1 relative z-10 py-3 rounded-full text-xs md:text-sm font-bold tracking-tight text-center cursor-pointer transition-colors ${hasDevice ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {t.toggleHasDevice}
          </button>
        </div>
      </div>

      {/* CORE SPLIT SCREEN GRID */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: GÓI CHỌN (Increased size to 5/12 ~ 42% width) */}
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
                  className="relative rounded-[32px] p-7 md:p-8 flex flex-col transition-all duration-500 ease-[0.16,1,0.3,1] bg-white/70 backdrop-blur-xl border-2 border-purple-400/45 shadow-[0_30px_70px_rgba(147,51,234,0.11),_0_0_40px_rgba(147,51,234,0.06)] scale-[1.01] z-10 w-full select-none overflow-hidden isolate"
                >
                  {/* Glowing background highlights covering the ENTIRE card to prevent sharp straight lines */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-bl from-purple-500/18 via-purple-500/3 to-transparent rounded-[30px] pointer-events-none z-0" />
                  <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-orange-400/20 blur-3xl pointer-events-none z-0" />

                  {/* Thick isometric chevrons and starry sky from original design */}
                  <div className="absolute top-0 right-0 w-48 h-48 opacity-95 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400/35 overflow-visible" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chevPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M55 -10 L95 30 L60 65" fill="none" stroke="url(#chevPurpleGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M35 10 L75 50 L40 85" fill="none" stroke="url(#chevPurpleGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                      <circle cx="82" cy="18" r="1.5" fill="white" className="animate-ping" />
                      <circle cx="74" cy="52" r="0.9" fill="white" />
                      <circle cx="45" cy="12" r="0.8" fill="white" />
                      <path d="M55 20 L56 22 L58 23 L56 24 L55 26 L54 24 L52 23 L54 22 Z" fill="white" opacity="0.95" />
                      <path d="M75 45 L76 47 L78 48 L76 49 L75 51 L74 49 L72 48 L74 47 Z" fill="white" opacity="0.8" />
                    </svg>
                  </div>

                  {/* Premium Glowing Glassmorphic Badge with slow rotating star */}
                  {activeTiers[1].badge && (
                    <span className="absolute top-5 right-5 text-[9px] font-black font-mono tracking-widest px-3 py-1.5 rounded-full uppercase border bg-purple-600/10 text-purple-700 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md z-10 flex items-center gap-1.5 animate-pulse">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-purple-650 animate-spin" style={{ animationDuration: '6s' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>{activeTiers[1].badge}</span>
                    </span>
                  )}

                  {/* Physical Badge Icon */}
                  <div className="w-14 h-14 rounded-full mb-6 relative z-10 shadow-[0_8px_24px_rgba(139,92,246,0.25)] border border-purple-300/40 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105">
                    <Image src="/icon_badge_pricing_card.webp" alt="ONBI IoT" width={56} height={56} className="w-full h-full object-cover" draggable={false} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 z-10">{activeTiers[1].name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5 min-h-[36px]">{activeTiers[1].description}</p>

                  <div className="flex items-baseline gap-1.5 mb-4 z-10">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{activeTiers[1].price}</span>
                    <span className="text-xs font-semibold text-slate-400">/{activeTiers[1].period}</span>
                  </div>

                  {/* Premium Divider styled after the concept design */}
                  <div className="relative flex items-center my-5 select-none z-10">
                    <div className="flex-grow border-t border-slate-200/60" />
                    <span className="mx-3 flex-shrink text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                      {activeTiers[1].dividerLabel}
                    </span>
                    <div className="flex-grow border-t border-slate-200/60" />
                  </div>

                  {/* Specs with Highly Prominent Glowing Gift Pill for 'Tặng 3 tháng Premium' */}
                  <div className="space-y-3.5 z-10">
                    {activeTiers[1].quickSpecs.map((spec, sIdx) => {
                      const isGiftPromo = spec.text.toLowerCase().includes('premium') || spec.text.toLowerCase().includes('tặng 3 tháng');

                      return (
                        <div
                          key={sIdx}
                          className={`flex items-center gap-2.5 transition-all duration-300 ${isGiftPromo
                            ? 'text-[12.5px] font-extrabold text-purple-900 bg-gradient-to-r from-purple-100/95 via-indigo-50/95 to-purple-100/95 border-2 border-purple-400/70 px-4 py-2.5 rounded-2xl shadow-[0_6px_20px_rgba(168,85,247,0.25),_0_0_10px_rgba(168,85,247,0.15)] max-w-fit scale-[1.04] transform -translate-x-0.5'
                            : 'text-[11px] text-slate-600 font-medium'
                            }`}
                        >
                          {isGiftPromo ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Gift className="w-4.5 h-4.5 text-purple-750 shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
                              <span className="text-[9px] font-black font-mono tracking-widest px-2 py-0.5 rounded-md bg-purple-600 text-white uppercase shadow-3xs leading-none">
                                GIFT
                              </span>
                            </div>
                          ) : (
                            renderSpecIcon(spec.icon)
                          )}
                          <span>{spec.text}</span>
                        </div>
                      );
                    })}
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
                        onClick={() => { setActiveSubTier(tier.id as 'monthly' | 'annual'); setIsSubmitted(false); setShowQRStep(false); }}
                        className={`w-full text-left relative rounded-[32px] p-7 md:p-8 bg-white/70 backdrop-blur-xl border-2 transition-all duration-500 ease-[0.16,1,0.3,1] outline-none select-none cursor-pointer flex flex-col overflow-hidden isolate ${isSelected
                          ? isCyan
                            ? 'border-cyan-300 shadow-[0_25px_60px_rgba(6,182,212,0.08)] scale-[1.01]'
                            : 'border-amber-300 shadow-[0_25px_60px_rgba(245,158,11,0.08)] scale-[1.01]'
                          : 'border-slate-200/60 opacity-60 hover:opacity-90 hover:scale-[1.005]'
                          }`}
                      >
                        {/* Radial Glow Overlay covering the ENTIRE card to prevent sharp lines */}
                        {isSelected && (
                          <div className={`absolute inset-0 w-full h-full bg-gradient-to-bl ${isCyan ? 'from-cyan-400/18 via-cyan-400/3' : 'from-amber-400/18 via-amber-400/3'
                            } to-transparent pointer-events-none z-0`} />
                        )}

                        {/* Thick rounded chevron tracks overlapping perfectly like the concept */}
                        {isCyan ? (
                          <div className="absolute top-0 right-0 w-44 h-44 opacity-80 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/25 overflow-visible" style={{ overflow: 'visible' }}>
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
                        ) : (
                          <div className="absolute top-0 right-0 w-44 h-44 opacity-80 pointer-events-none z-0 select-none overflow-hidden rounded-tr-[30px]">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/25 overflow-visible" style={{ overflow: 'visible' }}>
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

                        {/* Top corner badge with glassmorphism */}
                        {tier.badge && (
                          <span className={`absolute top-5 right-5 text-[8.5px] font-black font-mono tracking-widest px-3 py-1.5 rounded-full uppercase border backdrop-blur-md shadow-3xs z-10 ${isSelected
                            ? isCyan
                              ? 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.12)] animate-pulse'
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                            : 'bg-slate-100/80 text-slate-500 border-slate-200/50'
                            }`}>
                            {tier.badge}
                          </span>
                        )}

                        {/* Icon badge frame */}
                        <div className={`w-14 h-14 rounded-full mb-5.5 relative z-10 overflow-hidden flex items-center justify-center bg-white/40 backdrop-blur-md border transition-all duration-300 hover:scale-105 ${isSelected
                          ? isCyan
                            ? 'border-cyan-300/40 shadow-[0_8px_24px_rgba(6,182,212,0.22)]'
                            : 'border-amber-300/40 shadow-[0_8px_24px_rgba(245,158,11,0.22)]'
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
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 pr-10 min-h-[36px]">{tier.description}</p>

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
                          {/* Premium Divider styled after the concept design */}
                          <div className="relative flex items-center my-4.5 select-none z-10">
                            <div className="flex-grow border-t border-slate-200/50" />
                            <span className="mx-3 flex-shrink text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                              {tier.dividerLabel}
                            </span>
                            <div className="flex-grow border-t border-slate-200/50" />
                          </div>

                          {/* Highlights 'Save / Tiết kiệm' spec with glowing glassmorphic pill */}
                          <div className="space-y-2.5 pb-5 pt-1">
                            {tier.quickSpecs.map((spec, sIdx) => {
                              const isPromoSpec = spec.text.toLowerCase().includes('tiết kiệm') || spec.text.toLowerCase().includes('save') || spec.text.toLowerCase().includes('%');

                              return (
                                <div
                                  key={sIdx}
                                  className={`flex items-center gap-2.5 transition-all duration-300 ${isPromoSpec
                                    ? isCyan
                                      ? 'text-[12.5px] font-extrabold text-cyan-900 bg-gradient-to-r from-cyan-100/95 via-teal-50/95 to-cyan-100/95 border-2 border-cyan-400 px-4 py-2.5 rounded-2xl shadow-[0_6px_20px_rgba(6,182,212,0.25)] max-w-fit scale-[1.04] transform -translate-x-0.5'
                                      : 'text-[12.5px] font-extrabold text-amber-900 bg-gradient-to-r from-amber-100/95 via-orange-50/95 to-amber-100/95 border-2 border-amber-400 px-4 py-2.5 rounded-2xl shadow-[0_6px_20px_rgba(245,158,11,0.25)] max-w-fit scale-[1.04] transform -translate-x-0.5'
                                    : 'text-[11px] text-slate-600 font-medium'
                                    }`}
                                >
                                  {isPromoSpec ? (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Percent className={`w-4.5 h-4.5 shrink-0 ${isCyan ? 'text-cyan-700' : 'text-amber-700'}`} />
                                      <span className={`text-[9px] font-black font-mono tracking-widest px-2 py-0.5 rounded-md text-white uppercase shadow-3xs leading-none ${isCyan ? 'bg-cyan-600' : 'bg-amber-600'
                                        }`}>
                                        PROMO
                                      </span>
                                    </div>
                                  ) : (
                                    renderSpecIcon(spec.icon)
                                  )}
                                  <span>{spec.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: CHECKOUT HUB (Adjusted to col-span-7 ~ 58% width) */}
          <div className="w-full lg:col-span-7">
            <div className="relative w-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[32px] p-6 md:p-9.5 overflow-hidden">

              {/* Blur neon light accents inside right panel */}
              <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${activeSelectedTier.colorTheme === 'cyan'
                ? 'bg-cyan-500/10'
                : activeSelectedTier.colorTheme === 'purple'
                  ? 'bg-purple-500/10'
                  : 'bg-amber-500/10'
                }`} />

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key={showQRStep ? "checkout-qr" : "checkout-form"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8 relative z-10"
                  >
                    {/* Header */}
                    <div className="border-b border-slate-200/50 pb-5">
                      <h3 className="font-display text-xl font-extrabold text-slate-900 tracking-tight">
                        {t.checkoutTitle}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        {t.selected} <span className="font-bold text-slate-700">{activeSelectedTier.name}</span>
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span className="font-semibold">{errorMsg}</span>
                      </div>
                    )}

                    {!showQRStep ? (
                      // BƯỚC 1: NHẬP THÔNG TIN VÀ XEM HÓA ĐƠN SƠ BỘ (ẨN QR)
                      <form onSubmit={handleProceedToQR} className="space-y-8">
                        {/* Grid 2 Column on Desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* 1. Benefits details (Left Grid subcolumn) */}
                          <div className="space-y-5">
                            <h4 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase">
                              {t.benefitsLabel}
                            </h4>
                            <ul className="space-y-3.5">
                              {activeSelectedTier.features.slice(0, 6).map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-[12px] text-slate-650 font-medium">
                                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${activeSelectedTier.colorTheme === 'cyan'
                                    ? 'bg-cyan-500/10 text-cyan-600'
                                    : activeSelectedTier.colorTheme === 'purple'
                                      ? 'bg-purple-500/10 text-purple-600'
                                      : 'bg-amber-500/10 text-amber-600'
                                    }`}>
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                  <span>{feat.replace('(AI-based)', '')}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 2. Form User Info (Right Grid subcolumn) */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase mb-1">
                              {t.detailsTitle}
                            </h4>

                            {/* Parent Name */}
                            <div className="relative group">
                              <input
                                type="text"
                                required
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200/80 focus:border-slate-900 rounded-xl px-4 py-3.5 pt-6 text-sm outline-none transition-colors peer font-sans text-slate-800"
                                placeholder=" "
                              />
                              <label className="absolute left-4 top-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-slate-600 pointer-events-none">
                                {t.parentNameLabel}
                              </label>
                            </div>

                            {/* Contact Phone */}
                            <div className="relative group">
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200/80 focus:border-slate-900 rounded-xl px-4 py-3.5 pt-6 text-sm outline-none transition-colors peer font-sans text-slate-800"
                                placeholder=" "
                              />
                              <label className="absolute left-4 top-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-slate-600 pointer-events-none">
                                {t.phoneLabel}
                              </label>
                            </div>

                            {/* Email Address */}
                            <div className="relative group">
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200/80 focus:border-slate-900 rounded-xl px-4 py-3.5 pt-6 text-sm outline-none transition-colors peer font-sans text-slate-800"
                                placeholder=" "
                              />
                              <label className="absolute left-4 top-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-slate-600 pointer-events-none">
                                {t.emailLabel}
                              </label>
                            </div>

                            {/* Shipping Address */}
                            <div className="overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1]" style={{ height: !hasDevice ? 'auto' : 0, opacity: !hasDevice ? 1 : 0 }}>
                              <div className="pt-1.5 relative group">
                                <input
                                  type="text"
                                  required={!hasDevice}
                                  value={shippingAddress}
                                  onChange={(e) => setShippingAddress(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-slate-900 rounded-xl px-4 py-3.5 pt-6 text-sm outline-none transition-colors peer font-sans text-slate-800"
                                  placeholder=" "
                                />
                                <label className="absolute left-4 top-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:font-medium peer-focus:top-3.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-slate-600 pointer-events-none">
                                  {t.addressLabel}
                                </label>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Interactive Bank Card & Billing Summary in 50/50 Split */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                          {/* Interactive Bank Card */}
                          <div className="flex flex-col">
                            <div className="w-full relative rounded-3xl p-6.5 text-white overflow-hidden shadow-2xl border border-[#1e294b] select-none bg-gradient-to-br from-[#0c1330] to-[#04071a] flex flex-col justify-between aspect-[1.586/1] md:min-h-[225px] transition-all duration-500">
                              <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-35 pointer-events-none transition-colors duration-500 ${activeSelectedTier.colorTheme === 'cyan'
                                ? 'bg-cyan-500'
                                : activeSelectedTier.colorTheme === 'purple'
                                  ? 'bg-purple-500'
                                  : 'bg-amber-500'
                                }`} />

                              <div className="flex justify-between items-start z-10 pt-1">
                                <span className="text-3xl font-display font-black tracking-[0.2em] text-white leading-none">
                                  ONBI
                                </span>
                              </div>

                              <div className="flex justify-between items-center z-10 my-3">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-7.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-md border border-amber-300/40 shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-600/30" />
                                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-600/30" />
                                    <div className="absolute inset-2 border border-amber-600/20 rounded-xs" />
                                  </div>
                                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300/80 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10" strokeLinecap="round" />
                                    <path d="M8 5a10.6 10.6 0 0 1 3 7a10.6 10.6 0 0 1-3 7" strokeLinecap="round" />
                                    <path d="M4 8a6 6 0 0 1 2 4a6 6 0 0 1-2 4" strokeLinecap="round" />
                                  </svg>
                                </div>

                                <div className="text-right">
                                  <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest block leading-none">{t.billedNow}</span>
                                  <span className="text-2xl font-black font-mono tracking-tight text-white mt-1.5 block leading-none">
                                    {activeSelectedTier.price}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between items-end z-10 border-t border-white/5 pt-3">
                                <div className="text-left font-mono">
                                  <div className="text-[7px] text-slate-400 uppercase tracking-widest mb-0.5 leading-none">{t.member}</div>
                                  <div className="text-xs font-bold text-slate-100 truncate max-w-[155px] uppercase tracking-wider leading-none">
                                    {parentName || 'GUEST MEMBER'}
                                  </div>
                                </div>

                                <div className="text-right flex flex-col items-end select-none leading-none">
                                  <span className="text-xl font-display font-black italic tracking-wide text-white leading-none">
                                    ONBI
                                  </span>
                                  <span className="text-[7px] font-mono tracking-widest text-slate-400 uppercase mt-1 leading-none">
                                    Pay VIP
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Invoice Summary */}
                          <div className="flex flex-col justify-between bg-slate-50/70 border border-slate-200/50 rounded-3xl p-6.5 relative min-h-[225px]">
                            <div className="font-mono w-full">
                              <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mb-3">
                                {language === 'vi' ? "TỔNG HÓA ĐƠN TẠM TÍNH" : "ESTIMATED SUMMARY"}
                              </span>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-[12px] text-slate-500">
                                  <span>{!hasDevice ? t.deviceBundle : t.subActive}</span>
                                  <span className="font-semibold text-slate-700">{activeSelectedTier.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px] text-slate-500">
                                  <span>{t.shippingFee}</span>
                                  <span className="font-semibold text-emerald-600">{t.shippingFree}</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-200/40 pt-4.5 mt-3 w-full">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="font-bold text-slate-600">{language === 'vi' ? "TỔNG THANH TOÁN:" : "TOTAL DUE:"}</span>
                                <span className="text-sm font-black text-slate-900">{activeSelectedTier.price}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Primary Order CTA */}
                        <button
                          type="submit"
                          className="w-full py-4.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-[#0066cc] hover:bg-[#0071e3] text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center justify-center gap-2 group"
                        >
                          <span>{getSubmitButtonText()}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </form>
                    ) : (
                      // BƯỚC 2: MÀN HÌNH HIỂN THỊ VIETQR PHÓNG TO VÀ XÁC NHẬN CHUYỂN KHOẢN
                      <div className="space-y-8">
                        {/* Read-Only Client Summary Badge */}
                        <div className="bg-slate-50/90 border border-slate-200/50 rounded-2xl p-5 space-y-3.5 relative">
                          <div className="flex justify-between items-center border-b border-slate-200/40 pb-2.5">
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> {t.orderSummaryTitle}
                            </h4>
                            <button
                              type="button"
                              onClick={() => setShowQRStep(false)}
                              className="text-[10px] font-extrabold text-indigo-650 hover:text-indigo-800 cursor-pointer transition-colors"
                            >
                              [Chỉnh sửa thông tin]
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-xs text-slate-655">
                            <div><span className="font-bold text-slate-400 uppercase text-[8.5px] block tracking-wider">Tên phụ huynh</span> <span className="font-bold text-slate-800 text-[13px]">{parentName}</span></div>
                            <div><span className="font-bold text-slate-400 uppercase text-[8.5px] block tracking-wider">Số điện thoại</span> <span className="font-bold text-slate-800 text-[13px]">{phone}</span></div>
                            <div><span className="font-bold text-slate-400 uppercase text-[8.5px] block tracking-wider">Địa chỉ Email</span> <span className="font-bold text-slate-800 text-[13px]">{email}</span></div>
                            {!hasDevice && (
                              <div className="sm:col-span-3 border-t border-slate-200/30 pt-2.5"><span className="font-bold text-slate-400 uppercase text-[8.5px] block tracking-wider">Địa chỉ giao hàng</span> <span className="font-bold text-slate-800 text-[12px]">{shippingAddress}</span></div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Bank Card & Real QR Code Box in 50/50 Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">

                          {/* Left Column: ATM Card & Receipt */}
                          <div className="space-y-6 flex flex-col">
                            {/* ATM Card */}
                            <div className="w-full max-w-sm mx-auto lg:mx-0">
                              <div className="w-full relative rounded-3xl p-6.5 text-white overflow-hidden shadow-2xl border border-[#1e294b] select-none bg-gradient-to-br from-[#0c1330] to-[#04071a] flex flex-col justify-between aspect-[1.586/1] md:min-h-[225px] transition-all duration-500">
                                <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-35 pointer-events-none transition-colors duration-500 ${activeSelectedTier.colorTheme === 'cyan'
                                  ? 'bg-cyan-500'
                                  : activeSelectedTier.colorTheme === 'purple'
                                    ? 'bg-purple-500'
                                    : 'bg-amber-500'
                                  }`} />

                                <div className="flex justify-between items-start z-10 pt-1">
                                  <span className="text-3xl font-display font-black tracking-[0.2em] text-white leading-none">
                                    ONBI
                                  </span>
                                </div>

                                <div className="flex justify-between items-center z-10 my-3">
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-7.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-md border border-amber-300/40 shadow-sm relative overflow-hidden">
                                      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-600/30" />
                                      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-600/30" />
                                      <div className="absolute inset-2 border border-amber-600/20 rounded-xs" />
                                    </div>
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300/80 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
                                      <path d="M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10" strokeLinecap="round" />
                                      <path d="M8 5a10.6 10.6 0 0 1 3 7a10.6 10.6 0 0 1-3 7" strokeLinecap="round" />
                                      <path d="M4 8a6 6 0 0 1 2 4a6 6 0 0 1-2 4" strokeLinecap="round" />
                                    </svg>
                                  </div>

                                  <div className="text-right">
                                    <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest block leading-none">{t.billedNow}</span>
                                    <span className="text-2xl font-black font-mono tracking-tight text-white mt-1.5 block leading-none">
                                      {activeSelectedTier.price}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex justify-between items-end z-10 border-t border-white/5 pt-3">
                                  <div className="text-left font-mono">
                                    <div className="text-[7px] text-slate-400 uppercase tracking-widest mb-0.5 leading-none">{t.member}</div>
                                    <div className="text-xs font-bold text-slate-100 truncate max-w-[155px] uppercase tracking-wider leading-none">
                                      {parentName || 'GUEST MEMBER'}
                                    </div>
                                  </div>

                                  <div className="text-right flex flex-col items-end select-none leading-none">
                                    <span className="text-xl font-display font-black italic tracking-wide text-white leading-none">
                                      ONBI
                                    </span>
                                    <span className="text-[7px] font-mono tracking-widest text-slate-400 uppercase mt-1 leading-none">
                                      Pay VIP
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Receipt / Invoice Details */}
                            <div className="bg-slate-50/70 border border-slate-200/50 rounded-3xl p-6 relative">
                              <div className="font-mono w-full">
                                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mb-3">
                                  {language === 'vi' ? "CHI TIẾT HÓA ĐƠN" : "INVOICE DETAILS"}
                                </span>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center text-[12px] text-slate-600">
                                    <span className="font-medium text-slate-500">{language === 'vi' ? "Dịch vụ đăng ký" : "Subscribed Item"}</span>
                                    <span className="font-bold text-slate-700">{!hasDevice ? t.deviceBundle : t.subActive}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-[12px] text-slate-600">
                                    <span className="font-medium text-slate-500">{language === 'vi' ? "Phương thức" : "Payment Method"}</span>
                                    <span className="font-bold text-slate-700">{language === 'vi' ? "Chuyển khoản VietQR" : "VietQR Instant Transfer"}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-[12px] text-slate-600">
                                    <span className="font-medium text-slate-500">{language === 'vi' ? "Phí vận chuyển" : "Delivery Fee"}</span>
                                    <span className="font-bold text-emerald-600">{t.shippingFree}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-slate-200/50 pt-4.5 mt-4 w-full">
                                <div className="flex justify-between items-center text-xs font-mono">
                                  <span className="font-bold text-slate-600">{language === 'vi' ? "TỔNG THỰC NHẬN:" : "TOTAL DUE:"}</span>
                                  <span className="text-base font-black text-emerald-600">{activeSelectedTier.price}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: QR Code & Transfer Details */}
                          <div className="space-y-6">

                            {/* VietQR Box */}
                            <div className="flex flex-col justify-center items-center gap-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-2xs relative">
                              <div className="relative group select-none">
                                <div className="absolute inset-0 bg-indigo-500/5 blur-xl rounded-2xl group-hover:scale-105 transition-transform" />
                                {renderVirtualQR()}
                              </div>

                              <div className="text-center font-mono w-full">
                                <span className="text-[12px] font-black text-indigo-750 block tracking-wider uppercase font-sans">
                                  {t.qrInstruction}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-1">
                                  {language === 'vi' ? "Quét mã bằng ứng dụng ngân hàng để tự động điền thông tin" : "Scan via banking app to autofill details"}
                                </span>
                              </div>
                            </div>

                            {/* Copyable Details Box */}
                            <div className="bg-slate-50/70 border border-slate-200/50 rounded-3xl p-6.5 space-y-4">
                              <h5 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
                                {language === 'vi' ? "THÔNG TIN CHUYỂN KHOẢN THỦ CÔNG" : "MANUAL TRANSFER DETAILS"}
                              </h5>
                              <div className="space-y-3.5 text-xs text-slate-600">

                                {/* Bank Name */}
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-400 font-medium">{language === 'vi' ? "Ngân hàng" : "Bank"}</span>
                                  <span className="font-extrabold text-slate-800">VPBank (Napas247)</span>
                                </div>

                                {/* Account Number */}
                                <div className="flex justify-between items-center border-t border-slate-200/30 pt-3">
                                  <span className="text-slate-400 font-medium">{language === 'vi' ? "Số tài khoản" : "Account Number"}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-extrabold text-slate-800 text-sm">0835173787</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyField('0835173787', 'account')}
                                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${copiedField === 'account'
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                                        }`}
                                      title="Copy"
                                    >
                                      {copiedField === 'account' ? (
                                        <span className="text-[9px] font-bold px-0.5 text-emerald-650">Đã chép!</span>
                                      ) : (
                                        <ClipboardCopy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Account Owner */}
                                <div className="flex justify-between items-center border-t border-slate-200/30 pt-3">
                                  <span className="text-slate-400 font-medium">{language === 'vi' ? "Chủ tài khoản" : "Account Owner"}</span>
                                  <span className="font-extrabold text-slate-800 uppercase">NGUYEN TUAN KHA</span>
                                </div>

                                {/* Amount */}
                                <div className="flex justify-between items-center border-t border-slate-200/30 pt-3">
                                  <span className="text-slate-400 font-medium">{language === 'vi' ? "Số tiền" : "Amount"}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-extrabold text-slate-850 text-sm">{activeSelectedTier.price}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyField(activeSelectedTier.price.replace(/\D/g, ''), 'amount')}
                                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${copiedField === 'amount'
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                                        }`}
                                      title="Copy"
                                    >
                                      {copiedField === 'amount' ? (
                                        <span className="text-[9px] font-bold px-0.5 text-emerald-650">Đã chép!</span>
                                      ) : (
                                        <ClipboardCopy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Transfer Content */}
                                <div className="flex justify-between items-center border-t border-slate-200/30 pt-3">
                                  <span className="text-slate-400 font-medium">{language === 'vi' ? "Cú pháp chuyển khoản" : "Transfer Syntax"}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-extrabold text-indigo-700 uppercase">{`ONBI ${phone}`}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyField(`ONBI ${phone}`, 'content')}
                                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${copiedField === 'content'
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                                        }`}
                                      title="Copy"
                                    >
                                      {copiedField === 'content' ? (
                                        <span className="text-[9px] font-bold px-0.5 text-emerald-650">Đã chép!</span>
                                      ) : (
                                        <ClipboardCopy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </div>

                          </div>

                        </div>

                        {/* Confirmation CTA button */}
                        <button
                          type="button"
                          onClick={handleConfirmPayment}
                          className="w-full py-4.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group animate-bounce"
                          style={{ animationDuration: '3s' }}
                        >
                          <span>{t.btnConfirmTransferred}</span>
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  // HOLOGRAPHIC DIGITAL PASS SUCCESS SCREEN (Replaces checkout form inside right panel)
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

                    {/* 3D Holo-card styled dynamically based on chosen tier */}
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
                        <span>{copiedText === 'copylink' ? t.copied : t.copyBtn + ' ' + t.passDetails}</span>
                      </button>
                      <button
                        onClick={() => { setIsSubmitted(false); setShowQRStep(false); setParentName(''); setPhone(''); setEmail(''); setShippingAddress(''); }}
                        className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
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

      {/* Footer Contact For Custom */}
      <div className="text-center pt-6 relative z-10">
        <button
          onClick={() => { setHasDevice(false); setIsSubmitted(false); setShowQRStep(false); }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#22d3ee] transition-colors group cursor-pointer"
        >
          <Mail className="w-4 h-4 text-slate-400 group-hover:rotate-6 transition-transform" />
          <span>{t.customSchool}</span>
        </button>
      </div>

    </div>
  );
}
