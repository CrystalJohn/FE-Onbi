'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * Nút quay lại dùng chung toàn app.
 * - Quay về đúng trang trước đó trong lịch sử trình duyệt (router.back).
 * - Nếu người dùng mở thẳng trang bằng link (không có lịch sử) thì rơi về
 *   đường dẫn `fallback` — tránh kiểu link cứng "nhảy qua lại 2 trang".
 * - Màu navy đậm nổi trên nền sáng, đồng bộ với nút chính của app.
 */
export default function BackButton({ fallback, label = 'Quay lại' }: { fallback: string; label?: string }) {
  const router = useRouter();
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(fallback);
  };
  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className="grid min-h-11 min-w-11 place-items-center rounded-xl bg-[#000080] text-white shadow-md transition hover:bg-[#000066] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
