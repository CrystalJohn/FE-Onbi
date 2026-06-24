'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, User } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const steps = [
  {
    title: 'Tạo không gian học tập cố định',
    body: 'Một góc học yên tĩnh, đủ sáng, tránh xa tivi và thiết bị điện tử giúp con hiểu đây là không gian dành riêng cho việc học.',
  },
  {
    title: 'Thiết lập giờ học cố định mỗi ngày',
    body: 'Khi giờ học lặp lại đều đặn, não bộ của trẻ dễ đi vào trạng thái “đến giờ học rồi” mà không cần ba mẹ nhắc liên tục.',
  },
  {
    title: 'Dạy con chia nhỏ thời gian bằng Pomodoro',
    body: 'Thay vì nhìn bài tập như một khối lớn, con học theo từng phiên ngắn, có nghỉ, có nhịp rõ ràng và dễ hoàn thành hơn.',
  },
  {
    title: 'Đồng hành thay vì kiểm soát',
    body: 'Ba mẹ đặt quy tắc, hỏi gợi mở và kiểm tra kết quả cuối buổi thay vì ngồi canh từng phút hay làm giúp khi con gặp khó.',
  },
  {
    title: 'Khen quá trình, không chỉ khen điểm số',
    body: 'Ghi nhận hành vi tự ngồi vào bàn, hoàn thành phiên học và cố gắng duy trì thói quen để con muốn lặp lại điều tốt đó.',
  },
];

const warningSigns = [
  'Phải nhắc nhiều lần mới chịu ngồi vào bàn học.',
  'Hay rời bàn giữa chừng để lấy nước, lấy đồ hoặc đi vệ sinh.',
  'Làm bài rất nhanh nhưng sai nhiều hoặc làm qua loa.',
  'Không biết bắt đầu từ đâu khi không có ba mẹ ngồi bên.',
  'Dễ bị phân tâm bởi tivi, điện thoại hoặc tiếng ồn xung quanh.',
];

const faqs = [
  {
    question: 'Bắt đầu rèn kỹ năng tự học từ mấy tuổi là phù hợp?',
    answer: 'Giai đoạn lớp 1 đến lớp 3 là thời điểm rất tốt vì não bộ trẻ đang hình thành thói quen và dễ tiếp nhận nề nếp mới.',
  },
  {
    question: 'Ba mẹ có cần ngồi cạnh con suốt không?',
    answer: 'Không. Mục tiêu là giúp con độc lập dần. Ba mẹ chỉ cần thiết lập môi trường, tạo nhịp học ban đầu và theo dõi tiến trình.',
  },
  {
    question: 'Bao lâu thì thấy kết quả rõ ràng?',
    answer: 'Với trẻ tiểu học, thói quen tự học thường rõ hơn sau 3–4 tuần duy trì đều đặn. Tuần đầu thường là giai đoạn khó nhất.',
  },
  {
    question: 'Con dùng OnBi có cảm thấy bị theo dõi không?',
    answer: 'OnBi không lưu video, chỉ ghi nhận sự kiện hành vi học tập. Với con, OnBi đóng vai trò như một người bạn học nhắc nhở nhẹ nhàng.',
  },
];

export default function BlogSelfStudyDetail() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 dark:bg-zinc-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/#blog_section" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400">
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-11 px-6 pb-20 pt-10">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 uppercase dark:border-indigo-900/30 dark:bg-indigo-950/30">
              Phương pháp học
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              Tháng 06, 2026
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <User className="h-3.5 w-3.5" />
              Đội ngũ OnBi
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
              Rèn Kỹ Năng Tự Học Cho Con: Ba Mẹ Cần Làm Gì Khi Không Thể Luôn Ở Bên?
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-zinc-400 sm:text-lg">
              Rèn kỹ năng tự học cho con tiểu học đúng cách — 5 bước khoa học giúp trẻ tự giác ngồi vào bàn, tập trung đúng giờ mà ba mẹ không cần nhắc mỗi ngày.
            </p>
          </div>

          <figure className="space-y-3">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.10)] dark:bg-zinc-900">
              <Image
                src="/blog/blog-2/image-1.jpg"
                alt="Góc học tập gọn gàng giúp trẻ tiểu học hình thành kỹ năng tự học hiệu quả tại nhà"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="text-center text-xs italic text-slate-500 dark:text-zinc-500">
              Góc học tập gọn gàng giúp trẻ tiểu học hình thành kỹ năng tự học hiệu quả tại nhà.
            </figcaption>
          </figure>
        </section>

        <article className="space-y-10 text-base leading-relaxed text-slate-700 dark:text-zinc-300 sm:text-[17px]">
          <section className="rounded-r-3xl border-l-4 border-indigo-500 bg-slate-50 p-6 font-medium text-slate-800 dark:border-indigo-400 dark:bg-zinc-900/40 dark:text-zinc-200">
            <p>
              “Ở nhà, con tôi không bao giờ ngồi vào bàn học nếu không có tôi nhắc nhở. Ngày nào tôi cũng phải theo sát con, vừa mệt mỏi vừa áp lực.”
            </p>
            <p className="mt-4">
              Đây không phải câu chuyện của riêng ai. Vấn đề không hẳn là con lười hay ba mẹ chưa đủ nghiêm. Kỹ năng tự học là một năng lực cần được xây dựng từng ngày, có hệ thống và đúng phương pháp.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              Kỹ năng tự học là gì và vì sao quan trọng hơn điểm số?
            </h2>
            <p>
              Rèn luyện kỹ năng tự học cho trẻ tiểu học là bước khởi đầu giúp con hình thành tư duy độc lập và thói quen học tập lâu dài. Khi được hướng dẫn đúng, con biết cách chủ động tiếp thu kiến thức thay vì phụ thuộc hoàn toàn vào thầy cô hay cha mẹ.
            </p>
            <p>
              Nói đơn giản: <strong>điểm số là kết quả ngắn hạn, kỹ năng tự học là tài sản cả đời.</strong>
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              5 dấu hiệu con đang thiếu kỹ năng tự học
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {warningSigns.map((sign, index) => (
                <div key={sign} className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900/40">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{sign}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              5 bước rèn kỹ năng tự học cho con tại nhà
            </h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-100 bg-white/75 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/50">
                  <div className="mb-3 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                      Bước {index + 1}: {step.title}
                    </h3>
                  </div>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              Thách thức lớn nhất: khi ba mẹ không có mặt
            </h2>
            <p>
              Lý thuyết rèn kỹ năng tự học không khó. Khó là ở chỗ ba mẹ không thể luôn ở bên cạnh con. Sau một ngày làm việc, nhiều phụ huynh chỉ biết hỏi “con học chưa?”, nhưng lại không có dữ liệu thực tế để biết con đã tập trung bao lâu, rời bàn lúc nào, hay gặp khó ở đâu.
            </p>
            <p>
              Khoảng trống lớn nhất trong hành trình rèn kỹ năng tự học là thiếu thông tin thực tế về chất lượng học của con mỗi ngày.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              OnBi giúp lấp đầy khoảng trống đó như thế nào?
            </h2>
            <p>
              OnBi Robot Bạn Học được thiết kế để hỗ trợ con hình thành kỷ luật tự học mà không cần ba mẹ can thiệp liên tục, không xâm phạm riêng tư và không tạo cảm giác bị kiểm soát.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Xây nhịp học tự động', 'OnBi nhận diện khi con ngồi vào bàn và tự động khởi động phiên Pomodoro.'],
                ['Nhắc nhở nhẹ nhàng', 'Khi con rời bàn hoặc sai tư thế, robot nhắc bằng trải nghiệm thân thiện hơn lời thúc ép căng thẳng.'],
                ['Dữ liệu cho ba mẹ', 'Cuối buổi học, phụ huynh có báo cáo về thời gian tập trung và tiến độ phiên học.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                  <h3 className="font-display font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-zinc-400">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-sky-50 p-6 dark:border-indigo-900/30 dark:from-indigo-950/30 dark:to-sky-950/20">
            <h2 className="mb-3 font-display text-2xl font-bold text-slate-950 dark:text-white">
              Mỗi ngày một bước nhỏ, tạo thói quen lớn cho cả đời
            </h2>
            <p>
              Rèn kỹ năng tự học cho con tiểu học không phải chuyện một sớm một chiều. Nhưng mỗi ngày con tự ngồi vào bàn mà không cần nhắc, mỗi phiên Pomodoro con tự hoàn thành, đó là những viên gạch nhỏ xây nên sự tự lập lớn hơn trong tương lai.
            </p>
            <p className="mt-5 font-display text-lg font-bold text-indigo-700 dark:text-indigo-300">
              “Theo dõi từng giờ học – Gắn kết từng khoảnh khắc”
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-slate-100 bg-white/70 p-5 dark:border-zinc-850 dark:bg-zinc-900/40">
                  <h3 className="font-display font-bold text-slate-950 dark:text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-zinc-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
