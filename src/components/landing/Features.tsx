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
        english: "English",
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
        parent: {
          bold: "Automatic daily study reports sent to your phone.",
          rest: "Track focus time, posture alerts, and English progress without hovering over your child. Weekly habit charts and vocabulary growth metrics included."
        },
        buddy: {
          bold: "ONBI responds with expressions, LED animations, and encouraging voice.",
          rest: "Turns study time into an anticipated daily ritual. Zero screen time — all interaction happens through physical cues, voice, and ambient light."
        },
        english: {
          bold: "Interactive 5-minute English conversations for ages 6-11.",
          rest: "Builds pronunciation confidence through storytelling and roleplay games. No screen fatigue — just natural spoken dialogue with your child's AI companion."
        },
        updates: {
          bold: "Over-the-air firmware updates bring new features.",
          rest: "AI voice conversations, expanded curriculum, and smart home integration — all included free for life. Your ONBI gets smarter over time."
        }
      }
    },
    vi: {
      core: "Tính năng cốt lõi.",
      headingLine1: "ONBI giúp con",
      headingLine2: "xây dựng thói quen học tập.",
      description: "Được thiết kế bởi các chuyên gia tâm lý và vận hành bởi công nghệ AI an toàn, ONBI kiến tạo nhịp học tập không màn hình mà trẻ vô cùng hào hứng tham gia mỗi ngày.",
      categories: {
        focus: "Thói quen học",
        health: "Sức khỏe & An toàn",
        parent: "Kết nối ba mẹ",
        buddy: "Bạn đồng hành",
        english: "Học tiếng Anh",
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
        parent: {
          bold: "Báo cáo học tập tự động gửi về điện thoại ba mẹ mỗi ngày.",
          rest: "Theo dõi thời gian tập trung, cảnh báo tư thế, tiến độ tiếng Anh mà không cần ngồi cạnh con. Biểu đồ thói quen hàng tuần và chỉ số phát triển từ vựng được bao gồm."
        },
        buddy: {
          bold: "ONBI phản hồi bằng biểu cảm, đèn LED sinh động và giọng nói khích lệ.",
          rest: "Biến giờ học thành thói quen con mong chờ mỗi ngày. Không màn hình — chỉ tương tác qua giọng nói và ánh sáng."
        },
        english: {
          bold: "Hội thoại tiếng Anh tương tác 5 phút mỗi ngày cho trẻ 6-11 tuổi.",
          rest: "Xây dựng sự tự tin phát âm qua kể chuyện và trò chơi nhập vai. Không gây mỏi mắt hay phân tâm — chỉ là cuộc đối thoại nói tự nhiên với người bạn đồng hành AI của con."
        },
        updates: {
          bold: "Cập nhật phần mềm tự động mang đến tính năng mới.",
          rest: "Hội thoại AI, chương trình học mở rộng, tích hợp nhà thông minh — tất cả miễn phí trọn đời. ONBI của con sẽ thông minh hơn theo thời gian."
        }
      }
    }
  }[language];

  const data = [
    {
      category: t.categories.focus,
      title: "Pomodoro Focus Cycle",
      src: "/Pomodoro Focus Cycle.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700">{t.cards.focus.bold}</span>{" "}
            {t.cards.focus.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.health,
      title: "Smart Posture Guardian",
      src: "/Smart Posture Guardian.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700">{t.cards.health.bold}</span>{" "}
            {t.cards.health.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.parent,
      title: "Real-time Progress Reports",
      src: "/Real-time Progress Reports.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700">{t.cards.parent.bold}</span>{" "}
            {t.cards.parent.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.buddy,
      title: "Friendly Study Buddy",
      src: "/Friendly Study Buddy.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700">{t.cards.buddy.bold}</span>{" "}
            {t.cards.buddy.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.english,
      title: "Daily Speaking Practice",
      src: "/Daily Speaking Practice.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700">{t.cards.english.bold}</span>{" "}
            {t.cards.english.rest}
          </p>
        </div>
      ),
    },
    {
      category: t.categories.updates,
      title: "Lifetime Free Updates",
      src: "/Lifetime Free Updates.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-neutral-700">{t.cards.updates.bold}</span>{" "}
            {t.cards.updates.rest}
          </p>
        </div>
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full space-y-10 md:space-y-14" id="onbi_mvp_features_grid">
      <div className="max-w-[1400px] mx-auto text-left space-y-4 px-6">
        {/* Category Label */}
        <span className="text-[20px] md:text-[22px] font-semibold text-[#1d1d1f] tracking-tight block">
          {t.core}
        </span>
        
        {/* Giant Two-Line Apple-style Typography */}
        <h2 className="font-display text-4xl sm:text-5xl md:text-[76px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.08] flex flex-col">
          <span>{t.headingLine1}</span>
          <span>{t.headingLine2}</span>
        </h2>
        
        {/* Apple Signature Spacious Copy */}
        <p className="text-[19px] md:text-[21px] text-[#86868b] max-w-[620px] leading-relaxed font-normal tracking-tight pt-2">
          {t.description}
        </p>
      </div>
      <Carousel items={cards} />
    </div>
  );
}
