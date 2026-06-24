import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import BlogDetail from '@/components/blog/BlogDetail';
import BlogSelfStudyDetail from '@/components/blog/BlogSelfStudyDetail';
import BlogTwoDetail from '@/components/blog/BlogTwoDetail';

export type BlogPostConfig = {
  slug: string;
  metadata: Metadata;
  Component: ComponentType;
};

export const blogPosts = [
  {
    slug: 'robot-ban-hoc-onbi-giai-phap-theo-doi-hoc-tap-thong-minh',
    metadata: {
      title: 'OnBi – Robot Bạn Học | Thiết Bị IoT Theo Dõi Học Tập Thông Minh Cho Trẻ Tiểu Học 2026',
      description:
        'OnBi là robot học tập thông minh tự động theo dõi giờ học, nhận diện hành vi và tạo báo cáo minh bạch cho phụ huynh. Giải pháp IoT giáo dục hàng đầu Việt Nam 2026.',
      keywords: [
        'robot học tập',
        'quản lý thời gian học trẻ em',
        'IoT giáo dục',
        'Pomodoro tự động',
        'thiết bị học tập thông minh',
        'hệ thống hỗ trợ học tập',
        'EdTech Việt Nam',
        'theo dõi học tập tiểu học',
        'kỷ luật tự học',
        'công nghệ nuôi dạy con',
      ],
      alternates: {
        canonical: '/blog/robot-ban-hoc-onbi-giai-phap-theo-doi-hoc-tap-thong-minh',
      },
      openGraph: {
        title: 'OnBi – Robot Bạn Học Theo Dõi Học Tập Thông Minh',
        description:
          'Robot học tập thông minh tự động theo dõi giờ học, nhận diện hành vi và tạo báo cáo minh bạch cho phụ huynh.',
        type: 'article',
        url: '/blog/robot-ban-hoc-onbi-giai-phap-theo-doi-hoc-tap-thong-minh',
        images: ['/blog/blog-1/image-1.jpg'],
      },
    },
    Component: BlogDetail,
  },
  {
    slug: 'ren-ky-nang-tu-hoc-cho-tre-tieu-hoc',
    metadata: {
      title: 'Rèn Kỹ Năng Tự Học Cho Con: Ba Mẹ Cần Làm Gì Khi Không Thể Luôn Ở Bên?',
      description:
        'Rèn kỹ năng tự học cho con tiểu học đúng cách — 5 bước khoa học giúp trẻ tự giác ngồi vào bàn, tập trung đúng giờ mà ba mẹ không cần nhắc mỗi ngày.',
      keywords: [
        'rèn kỹ năng tự học cho trẻ tiểu học',
        'thói quen tự học cho trẻ',
        'trẻ tự giác học bài',
        'cách giúp con tự học tại nhà',
        'kỷ luật tự học tiểu học',
        'quản lý thời gian học cho trẻ',
      ],
      alternates: {
        canonical: '/blog/ren-ky-nang-tu-hoc-cho-tre-tieu-hoc',
      },
      openGraph: {
        title: 'Rèn Kỹ Năng Tự Học Cho Con',
        description:
          '5 bước khoa học giúp trẻ tự giác ngồi vào bàn, tập trung đúng giờ mà ba mẹ không cần nhắc mỗi ngày.',
        type: 'article',
        url: '/blog/ren-ky-nang-tu-hoc-cho-tre-tieu-hoc',
        images: ['/blog/blog-2/image-1.jpg'],
        authors: ['Đội ngũ OnBi'],
      },
    },
    Component: BlogSelfStudyDetail,
  },
  {
    slug: 'con-khong-chiu-hoc-phai-lam-sao',
    metadata: {
      title: 'Con Không Chịu Học Phải Làm Sao? 6 Nguyên Nhân Và Cách Giúp Con Tự Giác',
      description:
        'Con không chịu học phải làm sao? Tìm hiểu ngay 6 nguyên nhân thật sự khiến trẻ lười học và giải pháp giúp con tự giác học bài mà không cần ba mẹ nhắc mỗi ngày.',
      keywords: [
        'con không chịu học phải làm sao',
        'trẻ lười học phải làm sao',
        'cách giúp con tự giác học bài',
      ],
      alternates: {
        canonical: '/blog/con-khong-chiu-hoc-phai-lam-sao',
      },
      openGraph: {
        title: 'Con Không Chịu Học Phải Làm Sao? Đây Là Câu Trả Lời Ba Mẹ Cần Ngay Hôm Nay',
        description:
          'Tìm hiểu ngay 6 nguyên nhân thật sự khiến trẻ lười học và giải pháp giúp con tự giác học bài mà không cần ba mẹ nhắc mỗi ngày.',
        type: 'article',
        url: '/blog/con-khong-chiu-hoc-phai-lam-sao',
        images: ['/blog/blog-3/image-2.jpg'],
        publishedTime: '2026-06-24',
        authors: ['Đội ngũ OnBi'],
      },
    },
    Component: BlogTwoDetail,
  },
] satisfies BlogPostConfig[];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
