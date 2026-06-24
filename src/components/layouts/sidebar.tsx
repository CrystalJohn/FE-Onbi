"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Baby,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Pin,
  PinOff,
  Settings,
  User,
  Users,
  Wifi,
  X,
  ShoppingCart,
  Crown
} from "lucide-react";

const parentNav = [
  { href: "/parent/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/parent/profile", label: "Thông tin cá nhân", icon: User },
  { href: "/parent/children", label: "Hồ sơ trẻ", icon: Baby },
  { href: "/parent/subscription", label: "Gói dịch vụ", icon: Crown },
  { href: "/parent/feedback", label: "Phản hồi", icon: MessageSquareText },
];

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/devices", label: "Devices", icon: Wifi },
  { href: "/admin/pre-orders", label: "Pre-orders", icon: ShoppingCart },
  { href: "/admin/subscription-orders", label: "Gói dịch vụ", icon: Crown },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const nav = isAdmin ? adminNav : parentNav;
  const isExpanded = isPinned || isHovered;

  return (
    <>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`sticky top-0 z-30 hidden h-dvh shrink-0 p-3 transition-all duration-300 ease-out lg:block ${isExpanded ? "w-[280px]" : "w-[88px]"
          }`}
      >
        <div className="relative flex h-[calc(100dvh-24px)] flex-col overflow-visible rounded-[32px] border border-white/80 bg-white/75 p-2.5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsPinned((value) => !value)}
            aria-label={isPinned ? "Bỏ ghim thanh điều hướng" : "Ghim thanh điều hướng"}
            title={isPinned ? "Bỏ ghim thanh điều hướng" : "Ghim thanh điều hướng"}
            className="absolute -right-3 top-6 z-10 grid h-8 w-8 place-items-center rounded-full border border-white bg-white text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.14)] transition-all duration-300 ease-out hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {isPinned ? <PinOff aria-hidden="true" className="h-3.5 w-3.5" /> : <Pin aria-hidden="true" className="h-3.5 w-3.5" />}
          </button>

          <div className={`flex min-h-14 items-center rounded-[22px] transition-all duration-300 ease-out ${isExpanded ? "gap-3 px-2" : "justify-center"}`}>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0B008B] to-cyan-500 text-xs font-extrabold tracking-tight text-white shadow-[0_8px_20px_rgba(11,0,139,0.20)]">ON</div>
            <div className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${isExpanded ? "w-40 translate-x-0 opacity-100" : "w-0 -translate-x-2 opacity-0"}`}>
              <div className="text-lg font-extrabold tracking-tight text-[#0B008B]">ONBI</div>
              <div className="text-[11px] font-medium tracking-wide text-slate-500">{isAdmin ? "Admin Panel" : "Parent Dashboard"}</div>
            </div>
          </div>

          <nav aria-label="Điều hướng chính" className="mt-5 flex-1 space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  title={!isExpanded ? item.label : undefined}
                  className={`flex min-h-12 items-center overflow-hidden rounded-2xl text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${isExpanded ? "gap-3 px-3.5" : "justify-center px-0"
                    } ${isActive
                      ? "bg-[#0B008B] text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)]"
                      : "text-slate-600 hover:bg-cyan-50/90 hover:text-[#0B008B]"
                    }`}
                >
                  <Icon aria-hidden="true" className={`h-[19px] w-[19px] shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${isExpanded ? "w-44 translate-x-0 opacity-100" : "w-0 -translate-x-2 opacity-0"}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={`flex min-h-11 items-center rounded-full bg-slate-50/80 text-slate-500 transition-all duration-300 ease-out ${isExpanded ? "gap-2 px-3" : "justify-center"}`} title={!isExpanded ? "Phiên bản v1.0.0" : undefined}>
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-700" />
            <span className={`overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 ease-out ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>Phiên bản v1.0.0</span>
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Mở thanh điều hướng"
        className="fixed left-5 top-[22px] z-40 grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/85 text-[#0B008B] shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Đóng thanh điều hướng" className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" />
          <aside className="absolute inset-y-3 left-3 flex w-[min(280px,calc(100vw-24px))] flex-col rounded-[32px] border border-white/80 bg-white/90 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0B008B] to-cyan-500 text-xs font-extrabold text-white">ON</div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-extrabold text-[#0B008B]">ONBI</div>
                <div className="text-[11px] font-medium text-slate-500">{isAdmin ? "Admin Panel" : "Parent Dashboard"}</div>
              </div>
              <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Đóng thanh điều hướng" className="grid h-11 w-11 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Điều hướng chính" className="mt-6 flex-1 space-y-2">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${isActive ? "bg-[#0B008B] text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)]" : "text-slate-600 hover:bg-cyan-50 hover:text-[#0B008B]"
                      }`}
                  >
                    <Icon aria-hidden="true" className="h-[19px] w-[19px] shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex min-h-11 items-center gap-2 rounded-full bg-slate-50 px-4 text-xs font-medium text-slate-500">
              <Settings aria-hidden="true" className="h-4 w-4 text-cyan-700" />
              Phiên bản v1.0.0
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
