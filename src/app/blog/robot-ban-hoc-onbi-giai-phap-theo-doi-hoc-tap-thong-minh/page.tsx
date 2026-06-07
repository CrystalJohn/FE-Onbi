import type { Metadata } from 'next';
import BlogDetail from '@/components/blog/BlogDetail';

export const metadata: Metadata = {
  title: "OnBi – Robot Bạn Học | Thiết Bị IoT Theo Dõi Học Tập Thông Minh Cho Trẻ Tiểu Học 2026",
  description: "OnBi là robot học tập thông minh tự động theo dõi giờ học, nhận diện hành vi và tạo báo cáo minh bạch cho phụ huynh. Giải pháp IoT giáo dục hàng đầu Việt Nam 2026.",
  keywords: [
    "robot học tập",
    "quản lý thời gian học trẻ em",
    "IoT giáo dục",
    "Pomodoro tự động",
    "thiết bị học tập thông minh",
    "hệ thống hỗ trợ học tập",
    "EdTech Việt Nam",
    "theo dõi học tập tiểu học",
    "kỷ luật tự học",
    "công nghệ nuôi dạy con"
  ],
};

export default function Page() {
  return <BlogDetail />;
}
