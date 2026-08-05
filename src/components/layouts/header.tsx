"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import DropdownMenu01 from "@/components/layouts/user-dropdown";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
};

export function Header({ className, fixed = true, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    
    const onScroll = (e: Event) => {
      setOffset((e.target as HTMLElement).scrollTop);
    };
    const onWindowScroll = () => {
      setOffset(window.scrollY);
    };

    if (mainContent) {
      mainContent.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.addEventListener("scroll", onWindowScroll, { passive: true });
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener("scroll", onScroll);
      } else {
        window.removeEventListener("scroll", onWindowScroll);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "z-30 flex h-14 shrink-0 items-center justify-between px-4 sm:px-6 transition-all duration-200",
        fixed && "sticky top-0 w-full",
        offset > 10 
          ? "shadow-sm border-b border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md" 
          : "bg-transparent border-b-transparent border-b",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger variant="outline" className="-ml-1" />
        {children}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <DropdownMenu01 />
      </div>
    </header>
  );
}
