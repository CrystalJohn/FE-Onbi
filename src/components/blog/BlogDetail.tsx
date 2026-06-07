'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Lock, 
  Bell
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQAccordion({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 dark:border-zinc-800 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-display font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="overflow-hidden">
          <p className="text-slate-650 dark:text-zinc-400 text-sm leading-relaxed pb-4 pt-1">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function BlogDetail() {
  const { language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = {
    en: {
      backHome: "Back to Home",
      category: "EdTech / IoT Education",
      date: "May 30, 2026",
      author: "OnBi Team",
      publishedDate: "Published",
      writtenBy: "Written by",
      flag: '/Flag_of_the_United_States.png',
      langName: 'English (US)',
      toc: "Table of Contents",
      
      // Real Blog Post Data (EN translation of Web-SEO-ONBI.md)
      blog: {
        title: "OnBi – Your Study Buddy: Smart Study Tracking Solution for Primary Schoolers",
        intro: "Is your child really studying when they sit at their desk? This is a constant concern for millions of busy parents. Traditional solutions fail: apps require manual logging, CCTV cameras invade privacy, and screen devices cause distraction. OnBi addresses this challenge directly — introducing an automated, respectful, and friendly approach.",
        
        q1: "OnBi Study Robot — The Answer to \"Is My Child Really Studying?\"",
        p1: "ONBI is the first IoT educational solution in Vietnam that automatically monitors a child's study session without parental policing, intrusion, or stress. It turns self-study into a positive habit by combining physical companionship with helpful analytical tools.",
        
        q2: "What is OnBi? A Complete Educational IoT Ecosystem",
        p2: "OnBi is a hardware-software ecosystem consisting of a physical robot equipped with sensors and a companion application for parents. Using child-psychologist approved Pomodoro cycles (25 minutes focus, 5 minutes rest) and Edge-AI, it creates a distraction-free, screen-free learning environment.",
        
        featuresTitle: "Core Features of ONBI Smart Device",
        f1Title: "1. Automated Pomodoro — Fully Hands-Free",
        f1Desc: "When a child sits down, ONBI's sensors automatically trigger the focus session. No manual logging, no phone screens, and no parenting reminders required. It pauses automatically when the child stands up.",
        
        f2Title: "2. Posture & Activity Recognition — Quality Over Hours",
        f2Desc: "Our local Edge-AI detects three key behaviors: leaving the desk, bad slouching postures, and device distraction. The system flags these on a timeline without video recording, keeping data 100% private.",
        
        f3Title: "3. Dashboard & Weekly Insights — Actionable Reports",
        f3Desc: "Get concise daily summaries and weekly habit reports on your phone. See actual focus blocks, posture improvement rates, and tailored tips to support your child's growth constructively.",
        
        guideTitle: "Step-by-Step Guide",
        step1: "Step 1 — Connect: Log in and connect ONBI to Wi-Fi in under 2 minutes. One-time setup.",
        step2: "Step 2 — Study: Child sits down. Sensor triggers Pomodoro automatically. Screen-free.",
        step3: "Step 3 — Remind: Local AI checks posture and focus, giving gentle voice alerts if slouching.",
        step4: "Step 4 — Interact: After the session, the robot displays emotional cues to reward and suggest physical breaks.",
        step5: "Step 5 — Report: Parent receives a summary showing quality scores and weekly progress trends.",
        
        comparisonTitle: "How OnBi Compares to Other Solutions",
        criteria: "Criteria",
        app: "Pomodoro App",
        cctv: "CCTV Camera",
        robot: "Teaching Robot",
        onbi: "ONBI Buddy",
        
        c1: "Fully Automated",
        c1App: "✗ Manual entry",
        c1Cctv: "✗ Manual review",
        c1Robot: "✗ Set lessons",
        c1Onbi: "✓ Hands-Free",
        
        c2: "Behavior Analysis",
        c2App: "✗ None",
        c2Cctv: "✗ Raw video thô",
        c2Robot: "✗ None",
        c2Onbi: "✓ Timeline events",
        
        c3: "Privacy Respect",
        c3App: "✓ Yes",
        c3Cctv: "✗ 24/7 video recording",
        c3Robot: "✓ Yes",
        c3Onbi: "✓ Event-based only",
        
        c4: "Emotional Interaction",
        c4App: "✗ None",
        c4Cctv: "✗ None",
        c4Robot: "✓ Limited",
        c4Onbi: "✓ Multi-dimensional",
        
        c5: "Parental Report",
        c5App: "Basic",
        c5Cctv: "✗ None",
        c5Robot: "✗ None",
        c5Onbi: "✓ Dashboard + Insights",
        
        benefitsTitle: "Real-Life Benefits",
        benefitParent: "For Busy Parents: Replaces continuous physical policing. You get actionable daily updates while fully respecting your child's personal space and autonomy.",
        benefitChild: "For Young Learners: ONBI acts as an encouraging, physical companion rather than a cold monitor. It turns study routines into something they genuinely look forward to.",
        
        faqTitle: "Frequently Asked Questions",
        faq: [
          { q: "What age group is ONBI designed for?", a: "ONBI is optimized for children aged 6 to 12 years, the core period for developing fundamental self-study habits." },
          { q: "Does ONBI invade my child's privacy?", a: "No. ONBI uses local sensors and edge processing. It only tracks metadata and events (like study duration, posture warnings), never streaming or uploading raw video footage." },
          { q: "Is high technical skill required?", a: "Not at all. The ONBI mobile app is entirely in local language, takes 5 minutes to pair, and functions automatically from then on." },
          { q: "Does ONBI work without internet?", a: "Yes. Core Pomodoro routines and physical feedback run entirely offline. Internet is only required to push daily reports to parents' phones." },
          { q: "Does ONBI track all school subjects?", a: "Yes. ONBI monitors study behaviors generally. Whether doing Math, English, or writing, the session runs the same." }
        ]
      }
    },
    vi: {
      backHome: "Quay lại Trang chủ",
      category: "Giới thiệu sản phẩm / EdTech",
      date: "30/05/2026",
      author: "Đội ngũ OnBi",
      publishedDate: "Ngày đăng",
      writtenBy: "Tác giả",
      flag: '/Flag_of_Vietnam.png',
      langName: 'Tiếng Việt',
      toc: "Mục lục bài viết",
      
      // Real Blog Post Data (Vietnamese from Web-SEO-ONBI.md)
      blog: {
        title: "OnBi – Robot Bạn Học: Giải Pháp Theo Dõi Học Tập Thông Minh Cho Trẻ Tiểu Học",
        intro: "Bạn có bao giờ tự hỏi: 'Con ngồi vào bàn học rồi, nhưng thực sự con đang làm gì?' Đây là nỗi lo chung của hàng triệu phụ huynh. Các giải pháp như app điện thoại thì đòi hỏi tự giác bấm, camera giám sát thì xâm phạm riêng tư, thiết bị điện tử khác lại gây xao nhãng. OnBi ra đời giải quyết bài toán đó — tự động, an toàn và tôn trọng con trẻ.",
        
        q1: "Robot Học Tập OnBi — Câu Trả Lời Cho Bài Toán \"Con Có Thực Sự Ngồi Học Không?\"",
        p1: "Robot học tập OnBi là giải pháp IoT giáo dục đầu tiên tại Việt Nam tự động theo dõi quá trình học của trẻ tiểu học — không cần phụ huynh can thiệp liên tục, không xâm phạm riêng tư, không gây áp lực cho con.",
        
        q2: "OnBi Là Gì? Hệ Sinh Thái IoT Giáo Dục Hoàn Chỉnh",
        p2: "OnBi là hệ sinh thái kết hợp phần cứng (robot vật lý tích hợp cảm biến) và phần mềm (ứng dụng mobile), được thiết kế đặc biệt cho trẻ tiểu học. Sản phẩm ứng dụng phương pháp Pomodoro kết hợp với hệ thống nhận diện hành vi Edge-AI, tạo thành một thiết bị học tập thông minh tự động hoàn toàn.",
        
        featuresTitle: "Tính Năng Cốt Lõi Của Thiết Bị Học Tập Thông Minh OnBi",
        f1Title: "1. Tự Động Hóa Pomodoro — Hands-Free Hoàn Toàn",
        f1Desc: "Cảm biến vật lý của OnBi tự nhận diện khi trẻ ngồi vào bàn và tự động khởi động phiên học Pomodoro ngay lập tức. Khi trẻ rời bàn, hệ thống tự dừng và lưu dữ liệu. Không cần bé tự bấm, không cần ba mẹ nhắc.",
        
        f2Title: "2. Nhận Diện Hành Vi & Tư Thế — Biết Chất Lượng Học, Không Chỉ Số Giờ",
        f2Desc: "OnBi liên tục phân tích và phát hiện 3 trạng thái quan trạng: rời bàn, ngồi sai tư thế, và sử dụng thiết bị khác. Mỗi sự kiện được ghi nhận thành timeline thời gian thực, xử lý 100% cục bộ giúp bảo mật riêng tư.",
        
        f3Title: "3. Dashboard & Báo Cáo — Insight Thay Vì Raw Data",
        f3Desc: "Dashboard OnBi tổng hợp dữ liệu học tập theo ngày/tuần trực quan để phụ huynh nắm bắt hành trình học của con chỉ trong 30 giây, kèm theo các gợi ý cải thiện thói quen từ chuyên gia.",
        
        guideTitle: "Hướng Dẫn Sử Dụng OnBi Từng Bước",
        step1: "Bước 1 — Đăng nhập & kết nối: Tải app OnBi và kết nối robot với Wi-Fi trong 2 phút. Thiết lập một lần dùng mãi.",
        step2: "Bước 2 — Tự động bắt đầu: Con ngồi vào bàn học, cảm biến tự động nhận diện và kích hoạt đếm giờ Pomodoro.",
        step3: "Bước 3 — Nhắc nhở tư thế: Robot phát hiện bé ngồi cúi đầu quá thấp hoặc mất tập trung sẽ nhắc bé bằng giọng nói nhẹ nhàng.",
        step4: "Bước 4 — Tương tác cảm xúc: Kết thúc phiên, robot hỏi thăm, khích lệ và hiển thị emoji sinh động nhắc bé nghỉ ngơi.",
        step5: "Bước 5 — Nhận báo cáo: Phụ huynh nhận báo cáo tổng hợp thời gian học và xu hướng cải thiện thói quen cuối ngày.",
        
        comparisonTitle: "OnBi Khác Gì So Với Các Giải Pháp Hiện Có?",
        criteria: "Tiêu chí",
        app: "App Pomodoro",
        cctv: "Camera giám sát",
        robot: "Robot dạy học",
        onbi: "Robot OnBi",
        
        c1: "Tự động hoàn toàn",
        c1App: "✗ Bấm thủ công",
        c1Cctv: "✗ Xem thủ công",
        c1Robot: "✗ Cài bài học",
        c1Onbi: "✓ Tự động (Hands-free)",
        
        c2: "Phân tích hành vi",
        c2App: "✗ Không có",
        c2Cctv: "✗ Video thô",
        c2Robot: "✗ Không có",
        c2Onbi: "✓ Hệ thống timeline",
        
        c3: "Tôn trọng riêng tư",
        c3App: "✓ Có",
        c3Cctv: "✗ Ghi video 24/7",
        c3Robot: "✓ Có",
        c3Onbi: "✓ Lưu sự kiện cục bộ",
        
        c4: "Tương tác cảm xúc",
        c4App: "✗ Không",
        c4Cctv: "✗ Không",
        c4Robot: "✓ Giới hạn",
        c4Onbi: "✓ Đa chiều",
        
        c5: "Báo cáo phụ huynh",
        c5App: "Cơ bản",
        c5Cctv: "✗ Không",
        c5Robot: "✗ Không",
        c5Onbi: "✓ Dashboard + Insight",
        
        benefitsTitle: "Lợi Ích Thực Tế Cho Cả Gia Đình",
        benefitsParent: "Với phụ huynh bận rộn: Giải phóng bạn khỏi việc ngồi kề bên con suốt buổi học. Bạn vẫn nắm được mọi thứ qua báo cáo mà hoàn toàn tôn trọng không gian riêng của con.",
        benefitsChild: "Với trẻ tiểu học: OnBi không phải công cụ giám sát lạnh lùng. Đó là người bạn học biết cổ vũ, nhắc nghỉ ngơi đúng lúc giúp hình thành kỷ luật tự giác tự nhiên.",
        
        faqTitle: "Câu Hỏi Thường Gặp Về OnBi",
        faq: [
          { q: "OnBi phù hợp với trẻ bao nhiêu tuổi?", a: "OnBi được thiết kế tối ưu cho trẻ tiểu học từ 6–12 tuổi — giai đoạn hình thành thói quen học tập quan trọng nhất trong cuộc đời." },
          { q: "OnBi có xâm phạm riêng tư của trẻ không?", a: "Không. OnBi sử dụng cảm biến vật lý và hệ thống phân tích cục bộ, chỉ lưu trữ dữ liệu theo sự kiện (event-based) thay vì ghi video liên tục 24/7. Không có hình ảnh hay video của trẻ được lưu lên cloud mà không có sự đồng ý của phụ huynh." },
          { q: "Phụ huynh có cần kỹ năng công nghệ cao không?", a: "Hoàn toàn không. App OnBi hoạt động hoàn toàn bằng tiếng Việt, thiết lập kết nối dưới 5 phút và hoạt động tự động sau đó." },
          { q: "OnBi hoạt động khi không có internet không?", a: "Tính năng theo dõi Pomodoro cốt lõi hoạt động offline trong mạng nội bộ. Tính năng xem live view từ xa và nhận báo cáo cần kết nối internet." },
          { q: "OnBi có hỗ trợ theo dõi nhiều môn học không?", a: "OnBi theo dõi hành vi học tập tổng quát — không giới hạn môn học. Dù con đang học Toán, Tiếng Anh hay làm bài tập, OnBi vẫn hoạt động hiệu quả như nhau." }
        ]
      }
    }
  }[language];

  return (
    <div className="min-h-screen bg-[#fcfcf9] dark:bg-[#000000] text-slate-800 dark:text-zinc-350 transition-colors duration-500 pb-20">
      
      {/* Blog Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 py-3 bg-[#f7f6f2]/85 dark:bg-[#000000]/80 border-b border-[#ccc9bf]/30 dark:border-zinc-850/60 shadow-xs backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          {/* Back button */}
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backHome}</span>
          </Link>

          {/* Right features */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Simple Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-xs font-semibold text-slate-750 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-full hover:bg-[#ccc9bf]/20 dark:hover:bg-zinc-800/60 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <Image src={t.flag} alt="" width={18} height={12} className="w-4.5 h-3 object-cover rounded-xs border border-slate-200" />
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in duration-200">
                    <button
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors ${
                        language === 'en' ? 'text-[#0066cc] dark:text-[#0071e3]' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Image src="/Flag_of_the_United_States.png" alt="" width={16} height={10} className="w-4 h-2.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => { setLanguage('vi'); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors ${
                        language === 'vi' ? 'text-[#0066cc] dark:text-[#0071e3]' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Image src="/Flag_of_Vietnam.png" alt="" width={16} height={10} className="w-4 h-2.5 object-cover rounded-xs border border-slate-200 shrink-0" />
                      <span>Tiếng Việt</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 mt-8 sm:mt-12 space-y-10">
        
        {/* Title Block */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/30 uppercase">
              {t.category}
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="text-slate-550 dark:text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {t.publishedDate}: {t.date}
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="text-slate-550 dark:text-zinc-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {t.writtenBy}: {t.author}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {t.blog.title}
          </h1>

          {/* Cover Image */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-slate-200/50 dark:border-zinc-800">
            <Image
              src="/blog/blog-1/image-1.jpg"
              alt={t.blog.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Prose Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-zinc-300 text-base sm:text-[17px] leading-relaxed">
          
          <div className="bg-slate-50 dark:bg-zinc-900/40 border-l-4 border-indigo-500 dark:border-indigo-400 p-6 rounded-r-2xl text-slate-800 dark:text-zinc-200 font-medium">
            {t.blog.intro}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.q1}
            </h2>
            <p>{t.blog.p1}</p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.q2}
            </h2>
            <p>{t.blog.p2}</p>
          </div>

          {/* Image 2 Posture */}
          <div className="space-y-2 py-4">
            <div className="relative w-full aspect-[3/2] max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 dark:border-zinc-800">
              <Image
                src="/blog/blog-1/image-2.jpg"
                alt="Posture Tracking"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-zinc-550 italic max-w-md mx-auto">
              {language === 'vi' 
                ? "Hình 2: Trẻ tiểu học học tập tập trung với robot OnBi theo dõi hành vi tự động"
                : "Figure 2: Primary school child studying with ONBI tracking focus habits automatically"}
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.featuresTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-900">
                <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-wider mb-2">
                  {t.blog.f1Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-650 dark:text-zinc-400">
                  {t.blog.f1Desc}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-900">
                <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-wider mb-2">
                  {t.blog.f2Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-655 dark:text-zinc-400">
                  {t.blog.f2Desc}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-900">
                <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-wider mb-2">
                  {t.blog.f3Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-655 dark:text-zinc-400">
                  {t.blog.f3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Image 3 Dashboard */}
          <div className="space-y-2 py-4">
            <div className="relative w-full aspect-[16/9] max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 dark:border-zinc-800">
              <Image
                src="/blog/blog-1/image-3.jpg"
                alt="Dashboard Reporting"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-zinc-550 italic max-w-md mx-auto">
              {language === 'vi' 
                ? "Hình 3: Dashboard báo cáo học tập tuần của OnBi hiển thị timeline hành vi và thống kê giờ học"
                : "Figure 3: Weekly OnBi dashboard reporting focus timeline and activity statistics"}
            </p>
          </div>

          {/* Step list */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.guideTitle}
            </h2>
            <ul className="space-y-2 list-none pl-0">
              {[t.blog.step1, t.blog.step2, t.blog.step3, t.blog.step4, t.blog.step5].map((step, idx) => (
                <li key={idx} className="flex gap-3.5 items-start bg-slate-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-slate-200/40 dark:border-zinc-900/60">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 dark:text-zinc-350 text-sm sm:text-base">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image 4 Parent Phone */}
          <div className="space-y-2 py-4">
            <div className="relative w-full aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 dark:border-zinc-800">
              <Image
                src="/blog/blog-1/image-4.jpg"
                alt="Parent monitoring app"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-zinc-550 italic max-w-md mx-auto">
              {language === 'vi' 
                ? "Hình 4: Phụ huynh theo dõi học tập của con qua app OnBi trên điện thoại"
                : "Figure 4: Parent reviewing focus stats on ONBI companion application"}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.comparisonTitle}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-3xs bg-white dark:bg-zinc-900/10">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-850 text-sm">
                <thead className="bg-slate-50 dark:bg-zinc-900">
                  <tr className="text-slate-750 dark:text-zinc-200 font-bold">
                    <th className="px-4 py-3.5 text-left">{t.blog.criteria}</th>
                    <th className="px-4 py-3.5 text-center">{t.blog.app}</th>
                    <th className="px-4 py-3.5 text-center">{t.blog.cctv}</th>
                    <th className="px-4 py-3.5 text-center">{t.blog.robot}</th>
                    <th className="px-4 py-3.5 text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20">{t.blog.onbi}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-850">
                  {[
                    { c: t.blog.c1, app: t.blog.c1App, cctv: t.blog.c1Cctv, rob: t.blog.c1Robot, onbi: t.blog.c1Onbi },
                    { c: t.blog.c2, app: t.blog.c2App, cctv: t.blog.c2Cctv, rob: t.blog.c2Robot, onbi: t.blog.c2Onbi },
                    { c: t.blog.c3, app: t.blog.c3App, cctv: t.blog.c3Cctv, rob: t.blog.c3Robot, onbi: t.blog.c3Onbi },
                    { c: t.blog.c4, app: t.blog.c4App, cctv: t.blog.c4Cctv, rob: t.blog.c4Robot, onbi: t.blog.c4Onbi },
                    { c: t.blog.c5, app: t.blog.c5App, cctv: t.blog.c5Cctv, rob: t.blog.c5Robot, onbi: t.blog.c5Onbi }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/5">
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-300">{row.c}</td>
                      <td className="px-4 py-3 text-center text-slate-500 dark:text-zinc-500">{row.app}</td>
                      <td className="px-4 py-3 text-center text-slate-500 dark:text-zinc-500">{row.cctv}</td>
                      <td className="px-4 py-3 text-center text-slate-500 dark:text-zinc-500">{row.rob}</td>
                      <td className="px-4 py-3 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10 border-x border-indigo-100/30 dark:border-indigo-900/20">{row.onbi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.benefitsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 p-6 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/10">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 font-bold text-sm">
                  👨‍👩‍👧
                </div>
                <p className="text-slate-700 dark:text-zinc-350 text-sm leading-relaxed">
                  {t.blog.benefitsParent}
                </p>
              </div>
              <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-6 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/10">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 font-bold text-sm">
                  🎓
                </div>
                <p className="text-slate-700 dark:text-zinc-350 text-sm leading-relaxed">
                  {t.blog.benefitsChild}
                </p>
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
              {t.blog.faqTitle}
            </h2>
            <div className="space-y-1">
              {t.blog.faq.map((item, idx) => (
                <FAQAccordion key={idx} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-zinc-850 text-center space-y-4 mt-8 shadow-3xs">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              {language === 'vi' ? "Liên hệ với OnBi" : "Contact ONBI Team"}
            </h3>
            <p className="text-sm text-slate-550 dark:text-zinc-400 max-w-md mx-auto">
              {language === 'vi' 
                ? "Đội ngũ OnBi luôn sẵn sàng tư vấn miễn phí từ lựa chọn sản phẩm đến hỗ trợ kỹ thuật học tập cho con." 
                : "The ONBI team is always ready to consult and answer any technical or parental habit questions free of charge."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <a 
                href="https://www.facebook.com/people/OnBi/61590592400269/?mibextid=wwXIfr&rdid=oe6lLPDrN0q9nzuu&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1B89WwR7B8%2F%3Fmibextid%3DwwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
                <span>Facebook</span>
              </a>
              <span className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl">
                📞 0338 938 180
              </span>
            </div>
          </div>

        </article>

      </main>
    </div>
  );
}
