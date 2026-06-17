'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';

interface FAQItemProps {
  question: string;
  answer: string;
}

interface ImageBlockProps {
  src: string;
  alt: string;
  caption: string;
  ratio?: string;
  priority?: boolean;
}

interface ComparisonRow {
  label: string;
  controlling: string;
  tracking: string;
}

interface SolutionRow {
  criteria: string;
  manual: string;
  app: string;
  camera: string;
  onbi: string;
}

function FAQAccordion({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 dark:border-zinc-800 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-2 text-left font-display font-semibold text-slate-800 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <p className="pb-4 pt-1 text-sm leading-relaxed text-slate-650 dark:text-zinc-400">
          {answer}
        </p>
      )}
    </div>
  );
}

function ImageBlock({ src, alt, caption, ratio = 'aspect-[16/9]', priority = false }: ImageBlockProps) {
  return (
    <figure className="py-4">
      <div className={`relative w-full overflow-hidden ${ratio}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-contain"
          priority={priority}
        />
      </div>
      <figcaption className="mx-auto max-w-2xl text-center text-xs italic leading-relaxed text-slate-500 dark:text-zinc-500">
        {caption}
      </figcaption>
    </figure>
  );
}

const content = {
  vi: {
    backHome: 'Về trang chủ',
    category: 'Kinh nghiệm nuôi dạy con',
    date: 'Tháng 06, 2026',
    author: 'Đội ngũ OnBi',
    publishedDate: 'Ngày đăng',
    writtenBy: 'Tác giả',
    flag: '/Flag_of_Vietnam.png',
    langName: 'Tiếng Việt',
    title: 'Con Không Chịu Học Phải Làm Sao? Đây Là Câu Trả Lời Ba Mẹ Cần Ngay Hôm Nay',
    meta: 'Con không chịu học phải làm sao? Tìm hiểu 6 nguyên nhân thật sự khiến trẻ lười học và giải pháp giúp con tự giác học bài mà không cần ba mẹ nhắc mỗi ngày.',
    opening: [
      '8 giờ tối. Ba mẹ nhắc lần thứ tư: “Con vào học đi!”. Con dạ một tiếng rồi tiếp tục ngồi xem tivi.',
      'Đến lần thứ bảy, ba mẹ bắt đầu mất kiên nhẫn, giọng to hơn, không khí trong nhà căng hơn. Con khóc. Ba mẹ mệt. Và đêm đó, cả nhà đều không vui.',
      'Bài viết này không chỉ đưa ra vài mẹo chung chung. OnBi đi thẳng vào nguyên nhân con không chịu học và cách xây dựng một hệ thống giúp con tự giác hơn mỗi ngày.',
    ],
    coverCaption: 'Trẻ tiểu học không chịu ngồi vào bàn học là dấu hiệu phổ biến khiến phụ huynh lo lắng.',
    sectionOneTitle: 'Con Không Chịu Học Đừng Vội Nghĩ Con Lười',
    sectionOneParagraphs: [
      '“Lười học” thường không phải là bản chất của trẻ. Đó là biểu hiện bên ngoài của một vấn đề sâu hơn bên trong.',
      'Hơn 90% trẻ em có xu hướng thích chơi hơn là học. Đây là đặc điểm tâm lý bình thường ở lứa tuổi tiểu học, vì não bộ trẻ được thiết kế để khám phá, vui chơi và trải nghiệm, không phải để ngồi yên một chỗ trong nhiều giờ.',
      'Khi con không chịu học, có thể con đang nói rằng: con không biết bắt đầu từ đâu, bài quá khó, con sợ thất bại, con chưa thấy lý do để học, con mệt hoặc không gian học chưa thoải mái.',
    ],
    causesTitle: '6 Nguyên Nhân Thật Sự Khiến Trẻ Lười Học Ba Mẹ Cần Hiểu',
    causesCaption: 'Sáu nguyên nhân phổ biến khiến trẻ tiểu học không chịu học bài tại nhà.',
    causes: [
      {
        title: 'Không gian học chưa phù hợp',
        body: 'Tivi, điện thoại, tiếng ồn và bàn học bừa bộn khiến trẻ khó vào trạng thái tập trung. Hãy bắt đầu bằng một góc học yên tĩnh, đủ sáng, ít vật gây xao nhãng.',
      },
      {
        title: 'Con không biết bắt đầu từ đâu',
        body: 'Nhiều trẻ né tránh việc học vì nhìn bài tập như một khối lớn. Ba mẹ nên cùng con chia nhỏ thành danh sách việc cần làm, bắt đầu bằng môn dễ rồi xử lý môn khó ở giữa phiên học.',
      },
      {
        title: 'Học quá lâu mà không có nghỉ',
        body: 'Trẻ tiểu học thường chỉ tập trung hiệu quả trong khoảng 20 đến 25 phút. Nhịp Pomodoro 25 phút học, 5 phút nghỉ giúp con đỡ mệt và dễ duy trì hơn.',
      },
      {
        title: 'Áp lực từ ba mẹ quá lớn',
        body: 'Nhắc liên tục có thể khiến con thấy việc học là cuộc chiến với ba mẹ. Thay vì kiểm soát từng phút, hãy thống nhất luật rõ ràng và lùi lại để con tự thực hiện.',
      },
      {
        title: 'Con chưa thấy lý do để học',
        body: 'Khi bài học không liên quan đến sở thích của trẻ, con dễ xem việc học là nhiệm vụ ép buộc. Hãy kết nối kiến thức với điều con quan tâm trong đời sống hằng ngày.',
      },
      {
        title: 'Thiếu thói quen, không phải thiếu ý chí',
        body: 'Tự giác không xuất hiện chỉ sau một lời nhắc. Nó cần một lịch cố định, nghi thức trước giờ học và sự lặp lại đủ lâu để trở thành thói quen.',
      },
    ],
    stepsTitle: 'Cách Giúp Con Tự Giác Học Bài: 5 Bước Có Hệ Thống',
    planningCaption: 'Phụ huynh hướng dẫn con lập kế hoạch học bài tại nhà trước khi bắt đầu phiên học.',
    steps: [
      'Thiết lập giờ học cố định, ví dụ 7:00 đến 8:30 tối, và duy trì mỗi ngày. Nên cho con tham gia chọn khung giờ phù hợp để con có cảm giác được tôn trọng.',
      'Tạo nghi thức trước khi học: uống nước, sắp xếp sách vở, viết danh sách việc cần làm rồi bắt đầu.',
      'Áp dụng Pomodoro: 25 phút học, 5 phút nghỉ; sau 4 phiên thì nghỉ dài hơn để não bộ phục hồi.',
      'Khen hành vi thay vì chỉ khen điểm số. Ví dụ: “Hôm nay con tự ngồi vào bàn đúng giờ mà không cần nhắc, ba mẹ rất ghi nhận”.',
      'Theo dõi tiến bộ mà không kiểm soát từng phút. Ba mẹ cần biết con có thực sự học không, nhưng không nên biến việc học thành cảm giác bị giám sát liên tục.',
    ],
    comparisonTitle: 'Kiểm Soát Và Theo Dõi Khác Nhau Như Thế Nào?',
    comparisonRows: [
      { label: 'Cách đồng hành', controlling: 'Ngồi kèm sát bên con', tracking: 'Kiểm tra kết quả sau phiên học' },
      { label: 'Cách nhắc nhở', controlling: 'Nhắc liên tục từng vài phút', tracking: 'Thống nhất luật trước khi học' },
      { label: 'Khi con sai', controlling: 'Sửa ngay lập tức và dễ gây căng thẳng', tracking: 'Hỏi con cần hỗ trợ gì sau phiên học' },
      { label: 'Khi con tự giác', controlling: 'Dễ bỏ qua vì chỉ nhìn lỗi', tracking: 'Ghi nhận khoảnh khắc con tự làm đúng' },
    ] as ComparisonRow[],
    hardProblemTitle: 'Bài Toán Khó Nhất Khi Ba Mẹ Không Thể Ở Bên',
    lonelyCaption: 'Bàn học trống khi trẻ tự học một mình tại nhà trong lúc ba mẹ chưa về.',
    hardProblemParagraphs: [
      'Các bước trên sẽ dễ hơn nếu ba mẹ luôn có mặt. Nhưng thực tế năm 2026 rất khác: nhiều phụ huynh về nhà lúc 6 đến 7 giờ tối hoặc muộn hơn, trong khi con đã ở nhà một mình từ chiều.',
      'Câu hỏi khó không phải chỉ là “làm sao để con học”, mà là làm sao biết con có thực sự học hay không mà không phải ngồi canh cả buổi và cũng không biến camera thành công cụ giám sát 24/7.',
    ],
    onbiTitle: 'OnBi: Giải Pháp Cho Bài Toán Con Không Chịu Học Thời Hiện Đại',
    onbiCaption: 'Robot OnBi tự động khởi động Pomodoro khi trẻ ngồi vào bàn học.',
    appCaption: 'Ứng dụng OnBi hiển thị báo cáo học tập và timeline hành vi để phụ huynh theo dõi con từ xa.',
    onbiIntro: 'OnBi không chỉ là một ứng dụng Pomodoro khác. OnBi tự động hóa quy trình học tại nhà để con bớt phụ thuộc vào lời nhắc của ba mẹ.',
    onbiFeatures: [
      {
        title: 'Pomodoro tự động',
        body: 'Khi con ngồi vào bàn, cảm biến ghi nhận và bắt đầu phiên học 25 phút. Khi con rời bàn, phiên học được tạm dừng hoặc lưu lại đúng thực tế.',
      },
      {
        title: 'Nhận diện hành vi học tập',
        body: 'OnBi ghi nhận các sự kiện như rời bàn, tư thế chưa phù hợp hoặc dùng thiết bị khác, sau đó lưu vào timeline theo thời gian thực.',
      },
      {
        title: 'Báo cáo cuối ngày rõ ràng',
        body: 'Ba mẹ xem được tổng thời gian tập trung thật, số lần con rời bàn và nhịp Pomodoro trong ngày mà không cần xem lại video hay hỏi những câu mơ hồ.',
      },
    ],
    solutionTitle: 'So Sánh Các Cách Theo Dõi Việc Học Tại Nhà',
    solutionRows: [
      { criteria: 'Cần ba mẹ can thiệp', manual: 'Rất nhiều', app: 'Trung bình', camera: 'Cao', onbi: 'Thấp' },
      { criteria: 'Biết con học bao lâu', manual: 'Khó chính xác', app: 'Phụ thuộc con bấm', camera: 'Phải xem lại', onbi: 'Tự động ghi nhận' },
      { criteria: 'Biết chất lượng phiên học', manual: 'Cảm tính', app: 'Không rõ', camera: 'Tốn thời gian xem', onbi: 'Có timeline hành vi' },
      { criteria: 'Tôn trọng riêng tư', manual: 'Tốt', app: 'Tốt', camera: 'Thấp', onbi: 'Tốt, không lưu video 24/7' },
      { criteria: 'Con có cảm thấy bị áp lực', manual: 'Dễ có', app: 'Ít', camera: 'Dễ có', onbi: 'Thân thiện như bạn học' },
    ] as SolutionRow[],
    contactTitle: 'Ba Mẹ Muốn Con Tự Giác Hơn Từ Hôm Nay?',
    contactText: 'OnBi hỗ trợ ba mẹ theo dõi từng giờ học và gắn kết từng khoảnh khắc, với dữ liệu rõ ràng thay vì những cuộc nhắc nhở căng thẳng.',
    contactItems: ['Facebook: OnBi – Robot Bạn Học', 'Hotline: 0338 938 180', 'Website: app.onbi.online', 'Hỗ trợ: 8:00–21:00, kể cả cuối tuần'],
    quote: 'Theo dõi từng giờ học – Gắn kết từng khoảnh khắc',
    faqTitle: 'Câu Hỏi Thường Gặp',
    faqs: [
      { question: 'Con không chịu học có phải là con lười không?', answer: 'Không hẳn. Trẻ có thể thiếu định hướng, sợ bài khó, mệt, chưa có thói quen hoặc bị môi trường học làm xao nhãng.' },
      { question: 'Có nên phạt khi con không làm bài không?', answer: 'Phạt có thể tạo hiệu quả ngắn hạn nhưng dễ khiến con sợ học. Ba mẹ nên tìm nguyên nhân, đặt luật rõ ràng và ghi nhận hành vi tự giác.' },
      { question: 'Bao lâu thì con hình thành thói quen học?', answer: 'Thông thường cần ít nhất 3 đến 4 tuần lặp lại đều đặn để trẻ bắt đầu quen với giờ học và nghi thức học cố định.' },
      { question: 'OnBi có làm con cảm thấy bị giám sát không?', answer: 'OnBi tập trung vào sự kiện học tập và báo cáo hành vi, không lưu video 24/7. Robot được thiết kế như một bạn học thân thiện thay vì một camera kiểm soát.' },
      { question: 'OnBi phù hợp với độ tuổi nào?', answer: 'OnBi phù hợp nhất với trẻ 6 đến 12 tuổi, giai đoạn ba mẹ cần giúp con xây nền tự học và thói quen tập trung.' },
    ],
    finalAnswer: 'Câu trả lời ngắn gọn: hãy hiểu đúng nguyên nhân, xây môi trường học phù hợp, tạo thói quen có hệ thống và theo dõi tiến bộ thật sự thay vì chỉ nhắc con nhiều hơn.',
  },
  en: {
    backHome: 'Back to Home',
    category: 'Parenting Guide',
    date: 'June 2026',
    author: 'OnBi Team',
    publishedDate: 'Published',
    writtenBy: 'Written by',
    flag: '/Flag_of_the_United_States.png',
    langName: 'English (US)',
    title: 'What Should Parents Do When a Child Refuses to Study?',
    meta: 'Understand the real reasons children avoid studying and build a calm system that helps them learn without daily reminders.',
    opening: [
      'It is 8 PM. Parents remind their child for the fourth time to start studying. The child answers, then keeps watching TV.',
      'By the seventh reminder, everyone is tense. The child cries, the parents are exhausted, and the whole family ends the evening unhappy.',
      'This article focuses on the real causes behind study avoidance and a practical system parents can use at home.',
    ],
    coverCaption: 'A primary school child avoiding the study desk is a common concern for parents.',
    sectionOneTitle: 'Do Not Assume Your Child Is Lazy Too Quickly',
    sectionOneParagraphs: [
      'Study avoidance is usually a surface signal, not the child’s identity. Children may be overwhelmed, tired, unsure where to start, afraid of failure, or distracted by the study environment.',
      'Primary school children naturally prefer play and exploration. A better solution starts with understanding what makes the study routine difficult for them.',
    ],
    causesTitle: 'Six Real Reasons Children Avoid Homework',
    causesCaption: 'Six common reasons primary school children avoid studying at home.',
    causes: [
      { title: 'The study space is not supportive', body: 'Noise, TV, phones, and clutter make focus harder. Start with a quiet, bright, low-distraction corner.' },
      { title: 'The child does not know where to begin', body: 'Break homework into a small list. Start with an easy task and place the hardest subject in the middle of the session.' },
      { title: 'Sessions are too long without breaks', body: 'Most children focus best for about 20 to 25 minutes. A 25/5 Pomodoro rhythm keeps the routine lighter.' },
      { title: 'Parental pressure is too high', body: 'Constant reminders can make studying feel like a conflict. Set clear rules, then step back.' },
      { title: 'The child does not see a reason to learn', body: 'Connect lessons to their interests and everyday life so learning feels less abstract.' },
      { title: 'The issue is habit, not willpower', body: 'Self-directed learning needs a fixed schedule, a pre-study ritual, and enough repetition.' },
    ],
    stepsTitle: 'Five Steps to Help Children Study More Independently',
    planningCaption: 'A parent helps a child plan the study session before it begins.',
    steps: [
      'Set a fixed study time and keep it consistent every day.',
      'Create a short pre-study ritual: drink water, arrange books, list tasks, then begin.',
      'Use Pomodoro: 25 minutes of study, 5 minutes of break, then a longer break after four sessions.',
      'Praise behavior, not only scores. Recognize when the child starts on time without reminders.',
      'Track progress without controlling every minute.',
    ],
    comparisonTitle: 'Control Versus Healthy Tracking',
    comparisonRows: [
      { label: 'Support style', controlling: 'Sit beside the child all session', tracking: 'Check results after the session' },
      { label: 'Reminder style', controlling: 'Remind every few minutes', tracking: 'Agree on rules before studying' },
      { label: 'When mistakes happen', controlling: 'Correct immediately', tracking: 'Ask what support is needed afterward' },
      { label: 'When effort appears', controlling: 'Often missed', tracking: 'Recognize self-directed moments' },
    ] as ComparisonRow[],
    hardProblemTitle: 'The Hardest Problem: Parents Cannot Always Be There',
    lonelyCaption: 'An empty study desk when a child studies alone before parents get home.',
    hardProblemParagraphs: [
      'Many parents arrive home late while children are already expected to study independently. Asking “Did you study?” is often not enough.',
      'The real challenge is knowing whether the child actually focused without sitting beside them all evening or turning cameras into constant surveillance.',
    ],
    onbiTitle: 'OnBi: A Modern System for Home Study Habits',
    onbiCaption: 'OnBi starts a Pomodoro session automatically when the child sits at the desk.',
    appCaption: 'The OnBi app shows study reports and behavior timelines for parents.',
    onbiIntro: 'OnBi is not just another Pomodoro app. It automates the study routine so children depend less on repeated reminders.',
    onbiFeatures: [
      { title: 'Automatic Pomodoro', body: 'When the child sits at the desk, OnBi records the session and starts the focus rhythm automatically.' },
      { title: 'Learning behavior recognition', body: 'OnBi records events such as leaving the desk, posture issues, or other device use into a real-time timeline.' },
      { title: 'Clear daily report', body: 'Parents see real focus time, desk-leaving events, and the day’s Pomodoro rhythm in a concise report.' },
    ],
    solutionTitle: 'Comparing Home Study Tracking Options',
    solutionRows: [
      { criteria: 'Parent effort', manual: 'Very high', app: 'Medium', camera: 'High', onbi: 'Low' },
      { criteria: 'Study duration clarity', manual: 'Unclear', app: 'Needs manual taps', camera: 'Needs review', onbi: 'Automatic' },
      { criteria: 'Study quality clarity', manual: 'Subjective', app: 'Limited', camera: 'Time-consuming', onbi: 'Behavior timeline' },
      { criteria: 'Privacy respect', manual: 'Good', app: 'Good', camera: 'Low', onbi: 'Good, no 24/7 video storage' },
      { criteria: 'Child pressure', manual: 'Can be high', app: 'Low', camera: 'Can be high', onbi: 'Friendly companion feel' },
    ] as SolutionRow[],
    contactTitle: 'Want a Calmer Study Routine Starting Today?',
    contactText: 'OnBi helps parents understand each study session with clear data instead of stressful repeated reminders.',
    contactItems: ['Facebook: OnBi – Robot Bạn Học', 'Hotline: 0338 938 180', 'Website: app.onbi.online', 'Support: 8:00–21:00, including weekends'],
    quote: 'Track every study hour – Connect every moment',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { question: 'Does refusing to study mean my child is lazy?', answer: 'Not necessarily. It can come from overwhelm, fear of failure, fatigue, poor environment, or lack of routine.' },
      { question: 'Should parents punish unfinished homework?', answer: 'Punishment can work briefly but may make children fear studying. Clear rules and behavior recognition are healthier.' },
      { question: 'How long does a study habit take to form?', answer: 'Many children need at least three to four weeks of consistent repetition.' },
      { question: 'Does OnBi feel like surveillance?', answer: 'OnBi focuses on learning events and reports, not 24/7 video storage. It is designed as a friendly study companion.' },
      { question: 'What age is OnBi best for?', answer: 'OnBi is best suited for children ages 6 to 12.' },
    ],
    finalAnswer: 'The short answer: understand the cause, build the right environment, create a repeatable routine, and track real progress calmly.',
  },
};

export default function BlogTwoDetail() {
  const { language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = content[language];

  return (
    <div className="min-h-screen bg-[#fdfdfb] text-slate-900 selection:bg-indigo-200 dark:bg-[#09090b] dark:text-white dark:selection:bg-indigo-900">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-[#fdfdfb]/85 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-[#09090b]/85">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backHome}
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-slate-750 transition-all duration-200 hover:bg-[#ccc9bf]/20 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
              >
                <Image src={t.flag} alt="" width={18} height={12} className="h-3 w-4.5 rounded-xs border border-slate-200 object-cover" />
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg duration-200 animate-in fade-in dark:border-zinc-800 dark:bg-zinc-900">
                    <button
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                      className={`flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 ${
                        language === 'en' ? 'text-[#0066cc] dark:text-[#0071e3]' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Image src="/Flag_of_the_United_States.png" alt="" width={16} height={10} className="h-2.5 w-4 shrink-0 rounded-xs border border-slate-200 object-cover" />
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => { setLanguage('vi'); setIsLangOpen(false); }}
                      className={`flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 ${
                        language === 'vi' ? 'text-[#0066cc] dark:text-[#0071e3]' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Image src="/Flag_of_Vietnam.png" alt="" width={16} height={10} className="h-2.5 w-4 shrink-0 rounded-xs border border-slate-200 object-cover" />
                      <span>Tiếng Việt</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-4xl space-y-11 px-6 pb-20 sm:mt-12">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">
            <span className="rounded-full border border-indigo-100/50 bg-indigo-50 px-3 py-1 uppercase dark:border-indigo-900/30 dark:bg-indigo-950/30">
              {t.category}
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-550 dark:text-zinc-400">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {t.publishedDate}: {t.date}
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-550 dark:text-zinc-400">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {t.writtenBy}: {t.author}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
              {t.title}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-zinc-400 sm:text-lg">
              {t.meta}
            </p>
          </div>

          <ImageBlock
            src="/blog/blog-2/image-1.jpg"
            alt="Trẻ tiểu học không chịu ngồi vào bàn học"
            caption={t.coverCaption}
            priority
          />
        </section>

        <article className="space-y-10 text-base leading-relaxed text-slate-700 dark:text-zinc-300 sm:text-[17px]">
          <section className="rounded-r-3xl border-l-4 border-indigo-500 bg-slate-50 p-6 font-medium text-slate-800 dark:border-indigo-400 dark:bg-zinc-900/40 dark:text-zinc-200">
            <div className="space-y-4">
              {t.opening.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              {t.sectionOneTitle}
            </h2>
            {t.sectionOneParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="space-y-6">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              {t.causesTitle}
            </h2>
            <ImageBlock
              src="/blog/blog-2/image-2.jpg"
              alt="6 nguyên nhân khiến trẻ tiểu học không chịu học bài tại nhà"
              caption={t.causesCaption}
              ratio="aspect-[4/5] max-w-2xl"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {t.causes.map((cause, index) => (
                <div key={cause.title} className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/50">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{cause.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-650 dark:text-zinc-400">{cause.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              {t.stepsTitle}
            </h2>
            <ImageBlock
              src="/blog/blog-2/image-3.jpg"
              alt="Phụ huynh hướng dẫn con lập kế hoạch học bài tại nhà"
              caption={t.planningCaption}
            />
            <div className="space-y-3">
              {t.steps.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900/40">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-white">{index + 1}. </span>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">{t.comparisonTitle}</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800">
              <div className="grid grid-cols-3 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                <div className="p-3">{language === 'vi' ? 'Tình huống' : 'Situation'}</div>
                <div className="p-3">{language === 'vi' ? 'Kiểm soát' : 'Control'}</div>
                <div className="p-3">{language === 'vi' ? 'Theo dõi lành mạnh' : 'Healthy tracking'}</div>
              </div>
              {t.comparisonRows.map((row) => (
                <div key={row.label} className="grid grid-cols-3 border-t border-slate-200 text-sm dark:border-zinc-800">
                  <div className="p-3 font-semibold text-slate-900 dark:text-white">{row.label}</div>
                  <div className="p-3 text-slate-650 dark:text-zinc-400">{row.controlling}</div>
                  <div className="p-3 text-slate-650 dark:text-zinc-400">{row.tracking}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              {t.hardProblemTitle}
            </h2>
            <ImageBlock
              src="/blog/blog-2/image-4.jpg"
              alt="Bàn học trống khi trẻ tiểu học tự học một mình tại nhà"
              caption={t.lonelyCaption}
            />
            {t.hardProblemParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="space-y-6">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              {t.onbiTitle}
            </h2>
            <p>{t.onbiIntro}</p>
            <ImageBlock
              src="/blog/blog-2/image-5.jpg"
              alt="Robot OnBi tự động khởi động Pomodoro khi trẻ ngồi vào bàn học"
              caption={t.onbiCaption}
              priority
            />
            <div className="grid gap-4 md:grid-cols-3">
              {t.onbiFeatures.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                  <Clock className="mb-3 h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  <h3 className="mb-2 font-display text-base font-bold text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-650 dark:text-zinc-400">{feature.body}</p>
                </div>
              ))}
            </div>
            <ImageBlock
              src="/blog/blog-2/image-6.jpg"
              alt="App OnBi hiển thị báo cáo học tập và timeline hành vi của trẻ"
              caption={t.appCaption}
            />
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">{t.solutionTitle}</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="p-3">{language === 'vi' ? 'Tiêu chí' : 'Criteria'}</th>
                    <th className="p-3">{language === 'vi' ? 'Nhắc thủ công' : 'Manual reminders'}</th>
                    <th className="p-3">Pomodoro app</th>
                    <th className="p-3">Camera 24/7</th>
                    <th className="p-3">OnBi</th>
                  </tr>
                </thead>
                <tbody>
                  {t.solutionRows.map((row) => (
                    <tr key={row.criteria} className="border-t border-slate-200 dark:border-zinc-800">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{row.criteria}</td>
                      <td className="p-3 text-slate-650 dark:text-zinc-400">{row.manual}</td>
                      <td className="p-3 text-slate-650 dark:text-zinc-400">{row.app}</td>
                      <td className="p-3 text-slate-650 dark:text-zinc-400">{row.camera}</td>
                      <td className="p-3 font-medium text-indigo-700 dark:text-indigo-300">{row.onbi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-sky-50 p-6 dark:border-indigo-900/30 dark:from-indigo-950/30 dark:to-sky-950/20">
            <h2 className="mb-3 font-display text-2xl font-bold text-slate-950 dark:text-white">{t.contactTitle}</h2>
            <p className="mb-5 text-slate-650 dark:text-zinc-300">{t.contactText}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {t.contactItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-slate-750 dark:bg-zinc-950/40 dark:text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 font-display text-lg font-bold text-indigo-700 dark:text-indigo-300">“{t.quote}”</p>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-2 font-display text-2xl font-bold text-slate-950 dark:border-zinc-800 dark:text-white">
              {t.faqTitle}
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white/70 px-5 dark:border-zinc-850 dark:bg-zinc-900/40">
              {t.faqs.map((faq) => (
                <FAQAccordion key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
            <p className="font-display text-xl font-bold leading-relaxed">{t.finalAnswer}</p>
          </section>
        </article>
      </main>
    </div>
  );
}
