import type { Metadata } from 'next';
import BlogTwoDetail from '@/components/blog/BlogTwoDetail';

export const metadata: Metadata = {
  title: 'Con Không Chịu Học Phải Làm Sao? 6 Nguyên Nhân Và Cách Giúp Con Tự Giác',
  description: 'Con không chịu học phải làm sao? Tìm hiểu 6 nguyên nhân thật sự khiến trẻ lười học và giải pháp giúp con tự giác học bài mà không cần ba mẹ nhắc mỗi ngày.',
  keywords: [
    'con không chịu học phải làm sao',
    'trẻ lười học phải làm sao',
    'cách giúp con tự giác học bài',
    'Pomodoro cho trẻ tiểu học',
    'OnBi Robot Bạn Học',
  ],
};

export default function Page() {
  return <BlogTwoDetail />;
}
