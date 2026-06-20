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
    <header className="mx-4 mt-3 flex min-h-[60px] items-center justify-between rounded-[22px] border border-white/80 bg-white/75 py-2 pl-14 pr-3 shadow-[0_14px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:mx-6 sm:pl-14 sm:pr-5 lg:mx-8 lg:px-5 xl:mx-10">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">Education IoT Solution</p>
        <div className="mt-0.5 text-sm font-bold text-slate-900">Onbi Camera</div>
      </div>
      <button
        onClick={handleLogout}
        className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 text-sm font-semibold text-slate-600 shadow-sm transition-colors duration-200 hover:border-cyan-200 hover:bg-white hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        <LogOut aria-hidden="true" className="h-4 w-4" />
        Đăng xuất
      </button>
    </header>
  );
}
