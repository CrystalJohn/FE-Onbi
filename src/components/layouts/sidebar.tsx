"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Baby,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Users,
  Wifi,
  X,
  ShoppingCart,
  Crown
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";
import type { User } from "@/types";

/** Trang hồ sơ bắn event này sau khi lưu để sidebar cập nhật tên/ảnh ngay, khỏi phải F5. */
export const PROFILE_UPDATED_EVENT = "onbi:profile-updated";

const parentNav = [
  {
    title: "Chung",
    items: [
      { href: "/parent/dashboard", label: "Tổng quan", icon: LayoutDashboard },
      { href: "/parent/children", label: "Hồ sơ trẻ", icon: Baby },
      { href: "/parent/devices", label: "Thiết bị", icon: Wifi },
    ],
  },
  {
    title: "Dịch vụ & Hỗ trợ",
    items: [
      { href: "/parent/subscription", label: "Gói dịch vụ", icon: Crown },
      { href: "/parent/feedback", label: "Phản hồi", icon: MessageSquareText },
    ],
  },
];

const adminNav = [
  {
    title: "Chung",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/devices", label: "Devices", icon: Wifi },
    ],
  },
  {
    title: "Dịch vụ & Hỗ trợ",
    items: [
      { href: "/admin/pre-orders", label: "Pre-orders", icon: ShoppingCart },
      { href: "/admin/subscription-orders", label: "Gói dịch vụ", icon: Crown },
      { href: "/admin/feedback", label: "Feedback", icon: MessageSquareText },
    ],
  },
  {
    title: "Hệ thống",
    items: [{ href: "/admin/activity", label: "Activity", icon: Activity }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  // Đóng/mở THỦ CÔNG bằng nút "<" — không tự động theo hover nữa
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Lấy thẳng từ API thay vì localStorage để tên/ảnh luôn khớp trang Thông tin cá nhân.
  const [account, setAccount] = useState<{ fullName: string; avatarUrl?: string } | null>(null);
  const isAdmin = pathname.startsWith("/admin");
  const nav = isAdmin ? adminNav : parentNav;

  useEffect(() => {
    if (isAdmin) return;
    const load = () => {
      api
        .get<User>("/parents/profile")
        .then(({ data }) => setAccount({ fullName: data.fullName, avatarUrl: data.avatarUrl }))
        .catch(() => setAccount(null));
    };
    load();
    window.addEventListener(PROFILE_UPDATED_EVENT, load);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, load);
  }, [isAdmin]);

  // BE trả avatarUrl dạng path tương đối (/uploads/...) nên phải ghép với host API.
  const avatarSrc = account?.avatarUrl
    ? account.avatarUrl.startsWith("http")
      ? account.avatarUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${account.avatarUrl}`
    : null;

  // Admin không có trang hồ sơ nên chỉ hiện thẻ này cho phụ huynh.
  const renderAccountCard = (expanded: boolean) =>
    account ? (
      <Link
        href="/parent/profile"
        onClick={() => setIsMobileOpen(false)}
        title={!expanded ? account.fullName : undefined}
        // Không viền/nền, chỉ có một đường kẻ ngang phía trên ngăn với menu
        className={`mt-3 flex min-h-12 items-center border-t border-slate-200/80 pt-3 transition-colors hover:text-[#0B008B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${expanded ? "gap-3 px-2.5" : "justify-center px-0"
          }`}
      >
        {avatarSrc ? (
          // object-cover: ảnh vuông/chữ nhật gì cũng lấp đầy vòng tròn, không bị méo
          <img
            src={avatarSrc}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full border border-white object-cover"
          />
        ) : (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-[#0B008B]">
            {account.fullName.trim().charAt(0).toUpperCase()}
          </span>
        )}
        {expanded && (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{account.fullName}</span>
            <ChevronsUpDown aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
          </>
        )}
      </Link>
    ) : null;

  return (
    <>
      <aside
        className={`sticky top-0 z-30 hidden h-dvh shrink-0 transition-all duration-300 ease-out lg:block ${isExpanded ? "w-[280px]" : "w-[88px]"
          }`}
      >
        {/* Liền một dải từ trên xuống: không bo góc, chỉ có viền phải ngăn với nội dung */}
        <div className="relative flex h-dvh flex-col overflow-visible border-r border-slate-200/80 bg-white/75 px-2.5 py-3 shadow-[8px_0_28px_rgba(15,23,42,0.05)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            aria-label={isExpanded ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
            title={isExpanded ? "Thu gọn" : "Mở rộng"}
            className="absolute -right-3 top-6 z-10 grid h-8 w-8 place-items-center rounded-full border border-white bg-[#0B008B] text-white shadow-[0_8px_20px_rgba(15,23,42,0.20)] transition-all duration-300 ease-out hover:bg-[#000066] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {isExpanded ? <ChevronLeft aria-hidden="true" className="h-4 w-4" /> : <ChevronRight aria-hidden="true" className="h-4 w-4" />}
          </button>

          {/* pr-5: chừa chỗ cho nút thu gọn nhô ra ở mép phải, tránh đè lên nút sáng/tối */}
          <div className={`flex min-h-14 items-center rounded-[22px] transition-all duration-300 ease-out ${isExpanded ? "gap-3 pl-2 pr-5" : "justify-center"}`}>
            <div className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${isExpanded ? "w-40 translate-x-0 opacity-100" : "w-0 -translate-x-2 opacity-0"}`}>
              <div className="text-lg font-extrabold tracking-tight text-[#0B008B]">ONBI</div>
              <div className="text-[11px] font-medium tracking-wide text-slate-500">{isAdmin ? "Admin Panel" : "Parent Dashboard"}</div>
            </div>
            {/* Thu gọn thì nút sáng/tối tự về giữa rail (logo co về w-0) */}
            <div className={isExpanded ? "ml-auto" : undefined}>
              <ThemeToggle />
            </div>
          </div>

          <nav aria-label="Điều hướng chính" className="mt-5 flex-1">
            {nav.map((group, groupIndex) => (
              <div key={group.title} className={groupIndex > 0 ? "mt-5" : undefined}>
                {/* Thu gọn thì thay tiêu đề nhóm bằng một gạch ngăn cho đỡ trống */}
                {isExpanded ? (
                  <p className="px-3.5 pb-2 text-[11px] font-semibold text-slate-400">{group.title}</p>
                ) : (
                  groupIndex > 0 && <div className="mx-auto mb-3 h-px w-8 bg-slate-200" />
                )}
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-label={item.label}
                        aria-current={isActive ? "page" : undefined}
                        title={!isExpanded ? item.label : undefined}
                        className={`flex min-h-12 items-center overflow-hidden rounded-2xl text-sm font-semibold transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${isExpanded ? "gap-3 px-3.5" : "justify-center px-0"
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
                </div>
              </div>
            ))}
          </nav>

          {renderAccountCard(isExpanded)}
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
              <div className="min-w-0 flex-1">
                <div className="text-lg font-extrabold text-[#0B008B]">ONBI</div>
                <div className="text-[11px] font-medium text-slate-500">{isAdmin ? "Admin Panel" : "Parent Dashboard"}</div>
              </div>
              <ThemeToggle />
              <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Đóng thanh điều hướng" className="grid h-11 w-11 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Điều hướng chính" className="mt-6 flex-1 overflow-y-auto">
              {nav.map((group, groupIndex) => (
                <div key={group.title} className={groupIndex > 0 ? "mt-5" : undefined}>
                  <p className="px-4 pb-2 text-[11px] font-semibold text-slate-400">{group.title}</p>
                  <div className="space-y-2">
                    {group.items.map((item) => {
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
                  </div>
                </div>
              ))}
            </nav>

            {renderAccountCard(true)}
          </aside>
        </div>
      )}
    </>
  );
}
