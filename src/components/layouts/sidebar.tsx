"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const parentNav = [
  { href: "/parent/profile", label: "Thông tin cá nhân" },
  { href: "/parent/children", label: "Hồ sơ trẻ" },
  { href: "/parent/devices", label: "Thiết bị" },
];

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/devices", label: "Devices" },
  { href: "/admin/monitoring-sessions", label: "Sessions" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const nav = isAdmin ? adminNav : parentNav;

  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="mb-6 text-xl font-bold">Onbi Camera</div>
      <nav className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded px-3 py-2 text-sm ${
              pathname.startsWith(item.href)
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
