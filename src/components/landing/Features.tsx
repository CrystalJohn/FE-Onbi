'use client'

import React from 'react';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import { useLanguage } from '@/context/LanguageContext';

export default function Features() {
  const { language } = useLanguage();

  const t = {
    en: {
      core: "Core features.",
      headingLine1: "How ONBI empowers",
      headingLine2: "daily study habits.",
      description: "Designed by child psychologists and powered by safe edge-AI, ONBI creates screen-free concentration routines that children look forward to every day.",
      categories: {
        focus: "Focus Habit",
        health: "Health & Safety",
        parent: "Parent Sync",
        buddy: "Companion",
        updates: "Updates"
      },
      cards: {
        focus: {
          bold: "25-minute focus + 5-minute rest",
          rest: "intervals designed by child psychologists. Builds natural concentration without fatigue or screen dependency. ONBI uses gentle LED transitions and ambient audio to guide each cycle seamlessly."
        },
        health: {
          bold: "Built-in AI camera tracks posture locally.",
          rest: "Gentle voice reminders when your child slouches. No data leaves the device — 100% local processing ensures complete privacy while protecting spinal health."
        },
        buddy: {
          bold: "ONBI responds with expressions, LED animations, and encouraging voice.",
          rest: "Turns study time into an anticipated daily ritual. Zero screen time — all interaction happens through physical cues, voice, and ambient light."
        },
        parent: {
          bold: "Automatic daily study reports sent to your phone.",
          rest: "Track focus time, posture alerts, and key activity metrics without hovering over your child. Weekly habit charts and statistics included."
        },
        insights: {
          bold: "Deep learning insights and habit analytics.",
          rest: "View a chronological history of completed study sessions, focus quality scores, and posture improvement trends over time. Helps you praise effort and support growth constructively."
        },
        updates: {
          bold: "Over-the-air firmware updates bring new features.",
          rest: "AI voice refinements, expanded curriculums, and smart home integration — all included free for life. Your ONBI gets smarter over time."
        }
      }
    },
    vi: {
      core: "Tính năng cốt lõi.",
      headingLine1: "ONBI giúp con",
      headingLine2: "xây dựng thói quen học tập.",
      description: "ONBI tự động bắt đầu phiên Pomodoro khi con ngồi vào bàn, theo dõi thời gian học thật và gửi cập nhật rõ ràng cho phụ huynh. Con được nhắc nhẹ nhàng để duy trì tập trung, còn ba mẹ không cần liên tục ngồi kèm hay kiểm tra thủ công.",
      categories: {
        focus: "Thói quen học",
        health: "Sức khỏe & An toàn",
        parent: "Kết nối ba mẹ",
        buddy: "Bạn đồng hành",
        updates: "Cập nhật"
      },
      cards: {
        focus: {
          bold: "Chu kỳ 25 phút tập trung + 5 phút nghỉ,",
          rest: "được thiết kế bởi chuyên gia tâm lý trẻ em. Giúp con tập trung tự nhiên mà không mệt mỏi hay phụ thuộc màn hình. ONBI sử dụng chuyển đổi LED nhẹ nhàng và âm thanh dịu để dẫn dắt từng chu kỳ một cách mượt mà."
        },
        health: {
          bold: "Camera AI tích hợp theo dõi tư thế ngay trên thiết bị.",
          rest: "Nhắc nhở nhẹ nhàng khi con ngồi sai. Không dữ liệu nào rời khỏi thiết bị — xử lý 100% cục bộ, bảo vệ riêng tư hoàn toàn."
        },
        buddy: {
          bold: "ONBI phản hồi bằng biểu cảm, đèn LED sinh động và giọng nói khích lệ.",
          rest: "Biến giờ học thành thói quen con mong chờ mỗi ngày. Không màn hình — chỉ tương tác qua giọng nói và ánh sáng."
        },
        parent: {
          bold: "Báo cáo học tập tự động gửi về điện thoại ba mẹ mỗi ngày.",
          rest: "Theo dõi thời gian tập trung, cảnh báo tư thế, tiến độ phiên học mà không cần ngồi cạnh con. Biểu đồ thói quen hàng tuần và các chỉ số hoạt động được bao gồm."
        },
        insights: {
          bold: "Phân tích chuyên sâu và báo cáo xu hướng thói quen.",
          rest: "Xem lại lịch sử chi tiết các phiên học, điểm chất lượng tập trung và xu hướng cải thiện tư thế theo thời gian. Giúp ba mẹ dễ dàng khích lệ nỗ lực tự học và đồng hành cùng sự tiến bộ của con."
        },
        updates: {
          bold: "Cập nhật phần mềm tự động mang đến tính năng mới.",
          rest: "Cải thiện giọng nói AI, chương trình tương tác mở rộng, tích hợp nhà thông minh — tất cả miễn phí trọn đời. ONBI của con sẽ thông minh hơn theo thời gian."
        }
      }
    }
  }[language];

  const data = [
    {
      category: t.categories.focus,
      title: "Pomodoro Focus Cycle",
      src: "/Pomodoro Focus Cycle.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.focus.bold}</span>{" "}
            {t.cards.focus.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.health,
      title: "Smart Posture Guardian",
      src: "/Smart Posture Guardian.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.health.bold}</span>{" "}
            {t.cards.health.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.buddy,
      title: "Encouraging Study Buddy",
      src: "/Friendly Study Buddy.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.buddy.bold}</span>{" "}
            {t.cards.buddy.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.parent,
      title: "Real-time Progress Reports",
      src: "/Real-time Progress Reports.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.parent.bold}</span>{" "}
            {t.cards.parent.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.parent,
      title: "Study Timeline & Weekly Insights",
      src: "/Study Timeline & Weekly Insights.webp",
      content: (
        <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 dark:text-zinc-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700 dark:text-zinc-200">{t.cards.insights.bold}</span>{" "}
            {t.cards.insights.rest}
          </p>
        </div>
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full space-y-6 md:space-y-8" id="onbi_mvp_features_grid">
      <div className="max-w-[1400px] mx-auto text-left space-y-2.5 px-6">
        {/* Category Label */}
        <span className="text-sm md:text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight block">
          {t.core}
        </span>
        
        {/* Giant Two-Line Apple-style Typography */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.12] flex flex-col">
          <span>{t.headingLine1}</span>
          <span>{t.headingLine2}</span>
        </h2>
        
        {/* Apple Signature Spacious Copy */}
        <p className="text-base md:text-[17px] text-[#86868b] dark:text-[#a1a1a6] max-w-[620px] leading-relaxed font-normal tracking-tight pt-1">
          {t.description}
        </p>
      </div>
      <Carousel items={cards} />
    </div>
  );
}
