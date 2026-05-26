"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Wifi, Activity, User, Baby, Monitor, Settings } from "lucide-react";

const parentNav = [
  { href: "/parent/profile", label: "Thông tin cá nhân", icon: User },
  { href: "/parent/children", label: "Hồ sơ trẻ", icon: Baby },
  { href: "/parent/devices", label: "Thiết bị", icon: Wifi },
  { href: "/parent/monitoring", label: "Giám sát", icon: Monitor },
];

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/devices", label: "Devices", icon: Wifi },
  { href: "/admin/monitoring-sessions", label: "Sessions", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const nav = isAdmin ? adminNav : parentNav;

  return (
    <aside className="w-64 p-4 flex flex-col gap-4">
      {/* Logo */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm">
        <div className="text-lg font-bold text-[#000080] tracking-tight">ONBI</div>
        <div className="text-[10px] text-slate-500 font-mono">
          {isAdmin ? "Admin Panel" : "Parent Dashboard"}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 rounded-2xl border border-slate-200/60 bg-white/70 p-3 shadow-sm space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-[#000080] text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#000080]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-slate-300" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Version */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
