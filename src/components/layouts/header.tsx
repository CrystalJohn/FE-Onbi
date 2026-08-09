"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    // Bỏ thanh nền + phần thương hiệu, chỉ còn nút đăng xuất ở đúng vị trí cũ (góc phải)
    <header className="mx-4 mt-3 flex min-h-[60px] items-center justify-end sm:mx-6 lg:mx-8 xl:mx-10">
      <button
        onClick={handleLogout}
        className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition-colors duration-200 hover:border-cyan-200 hover:bg-white hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        <LogOut aria-hidden="true" className="h-4 w-4" />
        Đăng xuất
      </button>
    </header>
  );
}
