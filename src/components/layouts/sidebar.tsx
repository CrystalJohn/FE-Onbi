'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  Baby,
  ChevronLeft,
  ChevronRight,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  ShoppingCart,
  User,
  Users,
  Wifi,
  X,
} from 'lucide-react';

const parentNav = [
  {
    href: '/parent/dashboard',
    label: 'Tổng quan',
    icon: LayoutDashboard,
  },
  {
    href: '/parent/profile',
    label: 'Thông tin cá nhân',
    icon: User,
  },
  {
    href: '/parent/children',
    label: 'Hồ sơ trẻ',
    icon: Baby,
  },
  {
    href: '/parent/subscription',
    label: 'Gói dịch vụ',
    icon: Crown,
  },
  {
    href: '/parent/feedback',
    label: 'Phản hồi',
    icon: MessageSquareText,
  },
];

const adminNav = [
  {
    href: '/admin/dashboard',
    label: 'Tổng quan',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Người dùng',
    icon: Users,
  },
  {
    href: '/admin/devices',
    label: 'Thiết bị',
    icon: Wifi,
  },
  {
    href: '/admin/pre-orders',
    label: 'Đặt trước',
    icon: ShoppingCart,
  },
  {
    href: '/admin/subscription-orders',
    label: 'Gói dịch vụ',
    icon: Crown,
  },
  {
    href: '/admin/feedback',
    label: 'Phản hồi',
    icon: MessageSquareText,
  },
  {
    href: '/admin/activity',
    label: 'Hoạt động',
    icon: Activity,
  },
];

function LogoutConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Đóng hộp thoại đăng xuất"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-sm rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl duration-200">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        <div className="text-center">
          <h2 className="text-base font-bold text-slate-900">
            Bạn muốn đăng xuất?
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Hẹn gặp lại! Bạn có thể đăng nhập lại bất cứ lúc nào để tiếp tục
            quan sát bé.
          </p>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(239,68,68,0.30)] transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isAdmin = pathname.startsWith('/admin');
  const nav = isAdmin ? adminNav : parentNav;

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setShowLogoutModal(false);
    setIsMobileOpen(false);

    router.push('/login');
  };

  const NavLinks = ({
    onClickLink,
    collapsed = false,
  }: {
    onClickLink?: () => void;
    collapsed?: boolean;
  }) => (
    <nav
      aria-label="Điều hướng chính"
      className="mt-5 flex-1 space-y-1.5"
    >
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClickLink}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            title={collapsed ? item.label : undefined}
            className={`flex min-h-12 items-center overflow-hidden rounded-2xl text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
              collapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
            } ${
              isActive
                ? 'bg-[#0B008B] text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)]'
                : 'text-slate-600 hover:bg-cyan-50/90 hover:text-[#0B008B]'
            }`}
          >
            <Icon
              aria-hidden="true"
              className={`h-[19px] w-[19px] shrink-0 ${
                isActive ? 'text-white' : 'text-slate-400'
              }`}
            />

            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                collapsed
                  ? 'w-0 -translate-x-2 opacity-0'
                  : 'w-44 translate-x-0 opacity-100'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const LogoutButton = ({ collapsed = false }: { collapsed?: boolean }) => (
    <button
      type="button"
      onClick={() => setShowLogoutModal(true)}
      title={collapsed ? 'Đăng xuất' : undefined}
      aria-label="Đăng xuất"
      className={`flex min-h-11 w-full items-center rounded-2xl text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
        collapsed ? 'justify-center px-0' : 'gap-2.5 px-3.5'
      }`}
    >
      <LogOut
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
      />

      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          collapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'
        }`}
      >
        Đăng xuất
      </span>
    </button>
  );

  return (
    <>
      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 z-30 hidden h-dvh shrink-0 p-3 transition-all duration-300 ease-out lg:block ${
          isExpanded ? 'w-[280px]' : 'w-[88px]'
        }`}
      >
        <div className="relative flex h-[calc(100dvh-24px)] flex-col overflow-visible rounded-[32px] border border-white/80 bg-white/75 p-2.5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          {/* Collapse button */}
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            aria-label={
              isExpanded
                ? 'Thu gọn thanh điều hướng'
                : 'Mở rộng thanh điều hướng'
            }
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            className="absolute -right-3 top-6 z-10 grid h-8 w-8 place-items-center rounded-full border border-white bg-[#0B008B] text-white shadow-[0_8px_20px_rgba(15,23,42,0.20)] transition-all duration-300 ease-out hover:bg-[#000066] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {isExpanded ? (
              <ChevronLeft
                aria-hidden="true"
                className="h-4 w-4"
              />
            ) : (
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
          </button>

          {/* Logo */}
          <div
            className={`flex min-h-14 items-center px-2 ${
              isExpanded ? 'justify-between gap-2' : 'justify-center'
            }`}
          >
            <div
              className={`relative shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                isExpanded ? 'h-9 w-20' : 'h-9 w-10'
              }`}
            >
              <Image
                src="/logo_onbi.jpg"
                alt="ONBI"
                fill
                sizes={isExpanded ? '80px' : '40px'}
                className="object-contain"
                priority
              />
            </div>

            <span
              className={`overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all duration-300 ${
                isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
              }`}
            >
              {isAdmin ? 'Quản trị viên' : 'Phụ huynh'}
            </span>
          </div>

          <NavLinks collapsed={!isExpanded} />

          {/* Bottom section */}
          <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
            <LogoutButton collapsed={!isExpanded} />

            <div
              className={`flex min-h-10 items-center rounded-full text-slate-400 transition-all duration-300 ${
                isExpanded ? 'gap-2 px-3.5' : 'justify-center px-0'
              }`}
              title={!isExpanded ? 'Phiên bản v1.0.0' : undefined}
            >
              <Settings
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-cyan-700"
              />

              <span
                className={`overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                  isExpanded ? 'w-32 opacity-100' : 'w-0 opacity-0'
                }`}
              >
                Phiên bản v1.0.0
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Mở thanh điều hướng"
        className="fixed left-5 top-[22px] z-40 grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/85 text-[#0B008B] shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:hidden"
      >
        <Menu
          aria-hidden="true"
          className="h-5 w-5"
        />
      </button>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Đóng thanh điều hướng"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-3 left-3 flex w-[min(280px,calc(100vw-24px))] flex-col rounded-[32px] border border-white/80 bg-white/90 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/logo_onbi.jpg"
                  alt="ONBI"
                  fill
                  sizes="80px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {isAdmin ? 'Quản trị viên' : 'Phụ huynh'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Đóng thanh điều hướng"
                className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <X
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </button>
            </div>

            <NavLinks onClickLink={() => setIsMobileOpen(false)} />

            <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
              <LogoutButton />

              <div className="flex min-h-10 items-center gap-2 rounded-full px-3.5 text-slate-400">
                <Settings
                  aria-hidden="true"
                  className="h-4 w-4 text-cyan-700"
                />

                <span className="text-xs font-medium">
                  Phiên bản v1.0.0
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}