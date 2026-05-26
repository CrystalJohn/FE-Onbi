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
    <header className="mx-4 mt-4 flex h-14 items-center justify-between rounded-2xl border border-slate-200/60 bg-white/70 px-6 shadow-sm">
      <div className="text-sm font-medium text-slate-700">Onbi Camera</div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-slate-500 hover:bg-[#000080] hover:text-white transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Đăng xuất
      </button>
    </header>
  );
}
