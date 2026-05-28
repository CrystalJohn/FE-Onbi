'use client'

import React from 'react';
import { MessageSquareX, Timer, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, problemCard, viewport } from '@/lib/animations';
import { useLanguage } from '@/context/LanguageContext';

export default function ParentProblems() {
  const { language } = useLanguage();

  const t = {
    en: {
      tag: "The Parental Hurdle",
      title: "Why Solitary Home Study is Exhausting",
      description: "Modern learning relies heavily on addictive screens, leaving parents caught between work schedules and coaching battles.",
      painPoints: {
        0: "Pain Point 01",
        1: "Pain Point 02",
        2: "Pain Point 03"
      },
      problems: [
        {
          id: 'practice',
          title: "Lack English Speaking Practice",
          accent: "Dialogue Barrier",
          description: "Traditional study apps focus on passive reading and tapping on glass. Without active conversational feedback, children build silent English skills but struggle to produce words confidently in real life.",
          icon: MessageSquareX,
          glow: "hover:bg-[#f6f2eb]",
        },
        {
          id: 'time',
          title: "No Parental Time to Guide Learning",
          accent: "Constant Supervision",
          description: "Managing daily lessons, correcting pronunciation, and enforcing deskside focus is vital but exhausting. Professional working parents cannot always sit alongside their children to coach them step-by-step.",
          icon: Timer,
          glow: "hover:bg-[#f3f6fa]",
        },
        {
          id: 'focus',
          title: "Struggle to Stay Focused",
          accent: "Screen Distractions",
          description: "Tablets and smartphones are packed with heavy dopamine triggers. Left alone, children easily wander from lessons into video games, struggles with attention spans, and develop poor study habits.",
          icon: Compass,
          glow: "hover:bg-[#f3faf6]",
        }
      ]
    },
    vi: {
      tag: "Nỗi lo của ba mẹ",
      title: "Vì sao việc học ở nhà lại khó khăn?",
      description: "Việc học hiện đại phụ thuộc quá nhiều vào màn hình gây nghiện, khiến ba mẹ mệt mỏi giữa công việc và kèm con học.",
      painPoints: {
        0: "Khó khăn 01",
        1: "Khó khăn 02",
        2: "Khó khăn 03"
      },
      problems: [
        {
          id: 'practice',
          title: "Thiếu môi trường luyện nói",
          accent: "Rào cản giao tiếp",
          description: "Các app học truyền thống chỉ tập trung đọc và chạm màn hình. Không có phản hồi hội thoại thực tế, con xây dựng kỹ năng tiếng Anh thụ động nhưng ngại nói trong đời thực.",
          icon: MessageSquareX,
          glow: "hover:bg-[#f6f2eb]",
        },
        {
          id: 'time',
          title: "Ba mẹ không có thời gian kèm con",
          accent: "Giám sát liên tục",
          description: "Quản lý bài học, sửa phát âm, giữ con tập trung — rất quan trọng nhưng kiệt sức. Ba mẹ đi làm không thể lúc nào cũng ngồi cạnh hướng dẫn từng bước.",
          icon: Timer,
          glow: "hover:bg-[#f3f6fa]",
        },
        {
          id: 'focus',
          title: "Con khó tập trung",
          accent: "Bị màn hình phân tâm",
          description: "Máy tính bảng và điện thoại đầy rẫy kích thích dopamine. Để một mình, con dễ dàng chuyển từ bài học sang game, mất khả năng tập trung và hình thành thói quen học kém.",
          icon: Compass,
          glow: "hover:bg-[#f3faf6]",
        }
      ]
    }
  }[language];

  return (
    <div id="parent_problems_section" className="space-y-12">
      {/* Header */}
      <motion.div
        className="max-w-3xl mx-auto text-center space-y-3 px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#78756f] uppercase font-bold bg-white/60 px-3 py-1 rounded-full border border-white/65 shadow-2xs">
          {t.tag}
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-950 tracking-tight">
          {t.title}
        </h2>
        <p className="text-sm md:text-base text-[#78756f] max-w-xl mx-auto leading-relaxed font-medium">
          {t.description}
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
      >
        {t.problems.map((prob, idx) => {
          const IconComponent = prob.icon;
          return (
            <motion.div
              key={prob.id}
              variants={problemCard}
              className={`p-6 md:p-8 bg-white/70 rounded-3xl border border-white/60 shadow-2xs hover:shadow-xs flex flex-col justify-between transition-all group overflow-hidden relative hover:-translate-y-1 ${prob.glow}`}
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#78756f]/3 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/80 border border-[#ccc9bf]/30 text-[#18181a] rounded-2xl group-hover:border-indigo-950 transition-colors shadow-2xs">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono tracking-wider font-bold text-[#78756f] uppercase">
                    {idx === 0 && t.painPoints[0]}
                    {idx === 1 && t.painPoints[1]}
                    {idx === 2 && t.painPoints[2]}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-wider font-extrabold text-orange-600 bg-orange-50/60 border border-orange-100/70 px-2 py-0.5 rounded uppercase">
                    {prob.accent}
                  </span>
                  <h3 className="font-display text-lg md:text-xl font-bold text-slate-950 tracking-tight leading-tight">
                    {prob.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#78756f] leading-relaxed font-medium">
                    {prob.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
