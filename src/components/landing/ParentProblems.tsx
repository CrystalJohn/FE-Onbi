'use client'

import React, { useState } from 'react';
import { MessageSquareX, Timer, Compass, Sparkles, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUp, viewport } from '@/lib/animations';
import { useLanguage } from '@/context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE: Pure Premium Click Accordion
//
// Following the user's explicit request, we have completely removed scroll-driven
// tab expansion (scrollytelling) to eliminate "pin traps" and layout jumps.
//
// The active tab is managed purely by React onClick state, supporting an
// Apple-style vertical inline accordion on the left, and a seamless video cross-fade
// showcase on the right.
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'pomodoro' | 'tracking' | 'posture';

const TAB_IDS: TabId[] = ['pomodoro', 'tracking', 'posture'];

export default function ParentProblems() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>('pomodoro');

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  // ── Translations ──
  const t = {
    en: {
      tag: "The parental hurdle.",
      titleLine1: "Solitary home study.",
      titleLine2: "Why it is exhausting.",
      description: "Modern learning relies heavily on addictive screens, leaving parents caught in the daily struggle between busy work schedules and endless coaching battles.",
      solutionLabel: "ONBI SOLUTION",
      problems: [
        {
          id: 'pomodoro' as const,
          tabTitle: "Auto Pomodoro",
          accent: "25/5 STUDY RHYTHM",
          title: "Children struggle to start and maintain consistent study sessions",
          description: "Many children sit at their desk but don't know where to begin — prone to procrastination or fragmented study. Without a clear rhythm, building long focus and a daily habit becomes very difficult.",
          solution: "ONBI automatically activates a 25-minute focus + 5-minute break cycle when your child sits down to study. The robot helps them start at the right time, study at a stable pace, and gradually build a lasting self-study habit.",
          icon: Timer,
        },
        {
          id: 'tracking' as const,
          tabTitle: "Real-time Tracking",
          accent: "LIVE UPDATES",
          title: "Parents can't always be there to know if their child is really studying",
          description: "Busy parents can't monitor every session. It's hard to know whether the child has started, left the desk mid-way, or how many focus minutes were actually completed today.",
          solution: "ONBI records study status in real time and sends clear updates to parents' phones. You can track study time, session progress, and key activity milestones — without needing to sit beside your child.",
          icon: Compass,
        },
        {
          id: 'posture' as const,
          tabTitle: "Posture & Focus Reminders",
          accent: "FOCUS & POSTURE",
          title: "Children easily slouch or lose focus when studying alone",
          description: "When self-studying, children may hunch too close to the desk, sit with poor posture, leave their seat repeatedly, or quickly become distracted. Without timely reminders, good study habits are very hard to maintain.",
          solution: "ONBI monitors key signals throughout the session and delivers gentle reminders whenever the child slouches or loses focus. This helps them maintain a better study rhythm — giving parents peace of mind throughout the process.",
          icon: MessageSquareX,
        },
      ]
    },
    vi: {
      tag: "Nỗi lo của ba mẹ.",
      titleLine1: "Tự học tại nhà.",
      titleLine2: "Vì sao lại khó khăn?",
      description: "Việc học hiện đại phụ thuộc quá nhiều vào màn hình gây nghiện, khiến ba mẹ mệt mỏi và kiệt sức giữa công việc bận rộn cả ngày và kèm con học mỗi tối.",
      solutionLabel: "GIẢI PHÁP ONBI",
      problems: [
        {
          id: 'pomodoro' as const,
          tabTitle: "Tự động Pomodoro",
          accent: "NHỊP HỌC 25/5",
          title: "Con khó bắt đầu và duy trì phiên học đều đặn",
          description: "Nhiều trẻ ngồi vào bàn nhưng không biết bắt đầu từ đâu, dễ trì hoãn hoặc học ngắt quãng. Khi không có một nhịp học rõ ràng, việc tập trung lâu và xây dựng thói quen mỗi ngày trở nên rất khó.",
          solution: "ONBI tự động kích hoạt chu trình 25 phút tập trung + 5 phút nghỉ khi con vào bàn học. Robot giúp con bắt đầu đúng lúc, học theo nhịp ổn định và từng bước hình thành thói quen tự học bền vững.",
          icon: Timer,
        },
        {
          id: 'tracking' as const,
          tabTitle: "Theo dõi học tập realtime",
          accent: "CẬP NHẬT THEO THỜI GIAN THỰC",
          title: "Ba mẹ không thể luôn ở cạnh để biết con có thực sự học",
          description: "Phụ huynh bận rộn không thể theo sát từng buổi học. Vì vậy, rất khó biết con đã bắt đầu học chưa, có rời bàn giữa chừng không, hay hôm nay đã hoàn thành được bao nhiêu thời gian tập trung.",
          solution: "ONBI ghi nhận trạng thái học tập theo thời gian thực và gửi cập nhật rõ ràng về điện thoại phụ huynh. Ba mẹ có thể theo dõi thời gian học, tiến độ phiên tập trung và các mốc hoạt động quan trọng mà không cần ngồi kèm trực tiếp.",
          icon: Compass,
        },
        {
          id: 'posture' as const,
          tabTitle: "Nhắc tư thế & mất tập trung",
          accent: "TẬP TRUNG & TƯ THẾ",
          title: "Con dễ ngồi sai tư thế hoặc mất tập trung khi học một mình",
          description: "Khi tự học, trẻ có thể cúi quá gần bàn, ngồi lệch tư thế, rời chỗ liên tục hoặc nhanh chóng bị xao nhãng. Nếu không được nhắc đúng lúc, thói quen học tốt rất khó được duy trì lâu dài.",
          solution: "ONBI theo dõi các dấu hiệu cần lưu ý trong suốt phiên học và đưa ra nhắc nhở nhẹ nhàng khi con ngồi sai tư thế hoặc mất tập trung. Nhờ đó, con giữ được nhịp học tốt hơn và ba mẹ cũng yên tâm hơn trong quá trình đồng hành.",
          icon: MessageSquareX,
        },
      ]
    }
  }[language];

  return (
    <div
      id="parent_problems_section"
      className="space-y-10 md:space-y-14 w-full py-16 md:py-24"
      style={{ overflowAnchor: 'none' }}
    >
      {/* ── Section Header ── */}
      <motion.div
        className="max-w-[1400px] mx-auto w-full text-left space-y-4 px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        <span className="text-[20px] md:text-[22px] font-semibold text-[#1d1d1f] tracking-tight block">
          {t.tag}
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-[76px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.08] flex flex-col">
          <span>{t.titleLine1}</span>
          <span>{t.titleLine2}</span>
        </h2>
        <p className="text-[19px] md:text-[21px] text-[#86868b] max-w-[620px] leading-relaxed font-normal tracking-tight pt-2">
          {t.description}
        </p>
      </motion.div>

      {/* ── Main Pedestal Container ── */}
      <div className="bg-white border border-[#e8e8ed]/80 rounded-[32px] md:rounded-[36px] p-5 sm:p-7 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.015)] relative overflow-hidden z-10 max-w-[1400px] mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/30 via-white to-slate-50/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col-reverse lg:flex-row gap-8 lg:gap-16">

          {/* ── LEFT COLUMN: Apple-style Vertical Inline Accordion ──
              Clicking a title expands its content directly below it.
              The styling transforms seamlessly between inactive pills and gorgeous active cards. */}
          <div className="w-full lg:w-[45%] flex flex-col justify-start space-y-4 lg:space-y-5">
            {t.problems.map((prob) => {
              const TabIcon = prob.icon;
              const isSelected = activeTab === prob.id;

              return (
                <div
                  key={prob.id}
                  className={`w-full rounded-[24px] md:rounded-[28px] border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isSelected
                      ? 'bg-[#f5f5f7] border-[#e8e8ed]/80 p-5 md:p-6 shadow-2xs'
                      : 'bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] border-transparent p-4 hover:shadow-3xs'
                  }`}
                >
                  {/* Accordion Item Header Trigger */}
                  <div
                    onClick={() => handleTabClick(prob.id)}
                    className="flex items-center gap-4 cursor-pointer select-none w-full group"
                  >
                    {/* Transforming Circle Indicator */}
                    <div className={`p-2 rounded-full transition-all duration-500 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#1d1d1f] text-white shadow-sm scale-105'
                        : 'bg-white text-slate-500 group-hover:text-slate-800 shadow-3xs'
                    }`}>
                      {isSelected ? (
                        <TabIcon className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                      )}
                    </div>

                    {/* Tab Title */}
                    <span className={`font-semibold text-[15px] md:text-[16px] transition-colors duration-300 flex-1 ${
                      isSelected ? 'text-[#1d1d1f] font-bold' : 'text-slate-600 group-hover:text-slate-950'
                    }`}>
                      {prob.tabTitle}
                    </span>

                    {/* Expand text label for collapsed items */}
                    {!isSelected && (
                      <span className="text-[10px] font-bold text-slate-400 opacity-60 tracking-wider pr-1 hidden sm:block">
                        EXPAND
                      </span>
                    )}
                  </div>

                  {/* Accordion Content Drawer */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSelected ? 'max-h-[600px] opacity-100 mt-5' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-4 pt-1">
                      {/* Accent & Subtitle */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full block w-fit leading-none text-slate-800 bg-white border border-slate-200/60 shadow-3xs">
                          {prob.accent}
                        </span>
                        <h3 className="font-semibold text-lg md:text-xl tracking-tight leading-tight text-[#1d1d1f]">
                          {prob.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-[14px] md:text-[15px] text-[#1d1d1f]/80 leading-relaxed font-normal">
                        {prob.description}
                      </p>

                      {/* ONBI Solution Box */}
                      <div className="p-4 md:p-5 rounded-2xl shadow-3xs bg-white border border-[#e8e8ed]/60">
                        <div className="flex items-center gap-1.5 mb-2 text-indigo-650">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/10" />
                          <span className="text-[10px] font-bold tracking-widest uppercase leading-none text-indigo-600">
                            {t.solutionLabel}
                          </span>
                        </div>
                        <p className="text-[13px] md:text-[14px] font-medium leading-relaxed opacity-90 text-slate-800">
                          {prob.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── RIGHT COLUMN: Video Showcase ── */}
          <div className="w-full lg:w-[55%] flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            {/* All 3 videos rendered simultaneously, only active is visible.
                Stacked pattern ensures instant transitions without flickering or delay. */}
            <div className="w-full h-full min-h-[320px] md:min-h-[500px] rounded-[32px] md:rounded-[40px] bg-[#f5f5f7] border border-slate-100 shadow-inner relative overflow-hidden">
              {TAB_IDS.map((id) => (
                <video
                  key={id}
                  src={
                    id === 'pomodoro'
                      ? '/Pomodoro_video.mp4'
                      : id === 'tracking'
                      ? '/Tracking_video.mp4'
                      : '/Posture_video.mp4'
                  }
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover absolute inset-0 rounded-[32px] md:rounded-[40px] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeTab === id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
