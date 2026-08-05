"use client";

import React, { useEffect, useState, type ReactElement } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LucideIcon,
  CircleUserRound,
  CreditCard,
  ReceiptText,
  Settings,
  LogOut,
} from "lucide-react";
import { api } from "@/lib/api";
import type { User } from "@/types";
import { useRouter } from "next/navigation";

import Link from "next/link";

type Props = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  user: User | null;
  onLogout: () => void;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  destructive?: boolean;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "Hồ sơ của tôi", icon: CircleUserRound, href: "/parent/profile" },
  { label: "Gói dịch vụ", icon: CreditCard, href: "/parent/subscription" },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Đăng xuất",
  icon: LogOut,
  destructive: true,
};

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

const Dropdown = ({ trigger, defaultOpen, align = "end", user, onLogout }: Props) => {
  return (
    <div className="flex items-start justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger className="cursor-pointer focus-visible:outline-none border-none bg-transparent p-0 m-0 outline-none">
          {trigger}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="w-64 rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <DropdownMenuGroup>
            {/* User Info */}
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user?.avatarUrl || ""}
                    alt={user?.fullName || "Phụ huynh"}
                  />
                  <AvatarFallback>{user?.fullName?.charAt(0) || "PH"}</AvatarFallback>
                </Avatar>
                <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-emerald-500 ring-2" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-popover-foreground text-sm font-semibold truncate">
                  {user?.fullName || "Đang tải..."}
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {user?.email || "..."}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Main Links */}
            {user?.role === "parent" &&
              PROFILE_ITEMS.map(({ label, icon: Icon, href }) => (
                <DropdownMenuItem key={label} className={itemClass}>
                  <Link href={href || "#"} className="flex w-full items-center gap-2">
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}

            {user?.role === "parent" && <DropdownMenuSeparator />}

            {/* Logout */}
            <DropdownMenuItem variant="destructive" className={itemClass} onClick={onLogout}>
              <LOGOUT_ITEM.icon size={16} />
              <span>{LOGOUT_ITEM.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DropdownMenu01 = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
      api.get<User>("/parents/profile")
        .then(res => setUser(res.data))
        .catch(console.error);
    };

    fetchProfile();

    window.addEventListener('user-profile-updated', fetchProfile);
    return () => window.removeEventListener('user-profile-updated', fetchProfile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Dropdown
      align="end"
      user={user}
      onLogout={handleLogout}
      trigger={
        <div className="rounded-full transition-transform hover:scale-105 active:scale-95">
          <Avatar className="size-8 cursor-pointer border-2 border-transparent hover:border-cyan-500/50 transition-colors">
            <AvatarImage
              src={user?.avatarUrl || ""}
              alt={user?.fullName || "Phụ huynh"}
            />
            <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold text-xs">{user?.fullName?.charAt(0) || "PH"}</AvatarFallback>
          </Avatar>
        </div>
      }
    />
  );
};

export default DropdownMenu01;
