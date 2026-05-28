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

type TabId = 'practice' | 'time' | 'focus';

const TAB_IDS: TabId[] = ['practice', 'time', 'focus'];

export default function ParentProblems() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>('practice');

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
          id: 'practice' as const,
          tabTitle: "English Speaking",
          title: "Lack English Speaking Practice",
          accent: "Dialogue Barrier",
          description: "Children learn vocabulary on apps but have no one to converse with. Without daily speaking practice, they know English but hesitate to open their mouths when meeting foreigners.",
          solution: "ONBI creates a two-way conversational environment right at the desk. Children can speak, hear feedback, and get pronunciation corrections.",
          icon: MessageSquareX,
        },
        {
          id: 'time' as const,
          tabTitle: "Coaching Time",
          title: "No Parental Time to Coach",
          accent: "Constant Supervision",
          description: "Correcting pronunciation, reminding children to sit properly, monitoring focus — all are necessary, but parents work all day.",
          solution: "ONBI automatically starts the lesson when the child sits at the desk, guides step-by-step, and sends progress reports to parents' phones.",
          icon: Timer,
        },
        {
          id: 'focus' as const,
          tabTitle: "Screen Distraction",
          title: "Struggle to Focus Alone",
          accent: "Screen Distractions",
          description: "Tablets are full of games and videos. Left to study alone, children switch to YouTube in less than 5 minutes.",
          solution: "ONBI keeps the study rhythm with 25m focus + 5m break cycles. The camera tracks posture and reminds them immediately. No screens.",
          icon: Compass,
        }
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
          id: 'practice' as const,
          tabTitle: "Luyện nói tiếng Anh",
          title: "Con thiếu môi trường luyện nói tiếng Anh",
          accent: "Rào cản giao tiếp",
          description: "Con học từ vựng trên app nhưng không có ai để trò chuyện. Không được luyện nói mỗi ngày, con biết tiếng Anh nhưng ngại mở miệng khi gặp người nước ngoài.",
          solution: "ONBI tạo ra môi trường hội thoại hai chiều ngay tại bàn học. Con được nói, được nghe phản hồi, được sửa phát âm tự nhiên mỗi ngày.",
          icon: MessageSquareX,
        },
        {
          id: 'time' as const,
          tabTitle: "Thời gian kèm học",
          title: "Ba mẹ không có thời gian kèm con học",
          accent: "Giám sát liên tục",
          description: "Sửa phát âm, nhắc con ngồi đúng tư thế, theo dõi con có tập trung không — việc nào cũng cần nhưng ba mẹ đi làm cả ngày, không thể ngồi cạnh con từng phút.",
          solution: "ONBI tự động bắt đầu buổi học khi con ngồi vào bàn, hướng dẫn từng bước bằng giọng nói nhẹ nhàng, và gửi báo cáo tiến độ về điện thoại ba mẹ.",
          icon: Timer,
        },
        {
          id: 'focus' as const,
          tabTitle: "Phân tâm màn hình",
          title: "Con không thể tập trung khi học một mình",
          accent: "Bị màn hình phân tâm",
          description: "Máy tính bảng đầy game và video. Để con tự học, chưa đầy 5 phút đã chuyển sang xem YouTube. Không ai nhắc, thói quen tập trung không bao giờ được hình thành.",
          solution: "ONBI giữ nhịp học bằng chu kỳ 25 phút tập trung + 5 phút nghỉ. Camera theo dõi tư thế — con rời bàn hoặc ngồi sai, ONBI nhắc ngay. Không màn hình.",
          icon: Compass,
        }
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
                    id === 'practice'
                      ? '/English Speaking_video.mp4'
                      : id === 'time'
                      ? '/Coaching Time_video.mp4'
                      : '/Screen Distraction_video.mp4'
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
