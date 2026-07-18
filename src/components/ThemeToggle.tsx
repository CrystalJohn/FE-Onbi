"use client";

import { Sun, Moon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useThemeMode } from "@/context/ThemeProvider";

export default function ThemeToggle() {
  const { themeMode, setThemeMode } = useThemeMode();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-[#ccc9bf]/30 dark:border-zinc-800 bg-transparent shrink-0" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleSelectMode = (e: React.MouseEvent, mode: "light" | "dark" | "auto") => {
    setIsOpen(false);
    if (themeMode === mode) return;

    const doc = document as any;

    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setThemeMode(mode);
      return;
    }

    // Get the center of the menu item as the coordinate origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.classList.add("theme-transitioning");

    const transition = doc.startViewTransition(() => {
      setThemeMode(mode);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 650,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove("theme-transitioning");
    });
  };

  const getTooltipText = () => {
    if (themeMode === "light") return "Theme: Light";
    if (themeMode === "dark") return "Theme: Dark";
    return `Theme: Auto (${isDark ? "Night" : "Day"})`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={getTooltipText()}
        className="relative w-9 h-9 rounded-full border border-[#ccc9bf]/30 dark:border-zinc-850 bg-slate-100/50 hover:bg-slate-200/50 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 transition-all duration-300 flex items-center justify-center shrink-0 overflow-visible cursor-pointer shadow-3xs hover:scale-105 active:scale-95"
        aria-label={getTooltipText()}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Sun Icon */}
          <Sun
            className={`absolute w-4.5 h-4.5 text-amber-500 transition-all duration-500 transform ${
              isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          {/* Moon Icon */}
          <Moon
            className={`absolute w-4.5 h-4.5 text-indigo-400 dark:text-blue-400 transition-all duration-500 transform ${
              isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>

        {/* Auto mode badge */}
        {themeMode === "auto" && (
          <span className="absolute bottom-[-2px] right-[-2px] text-[8px] font-extrabold bg-[#006FE6] text-white w-3 h-3 rounded-full flex items-center justify-center scale-90 border border-white dark:border-zinc-900 leading-none select-none shadow-3xs animate-in zoom-in-50 duration-200">
            A
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={(e) => handleSelectMode(e, "light")}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                themeMode === "light" ? "text-amber-500 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              onClick={(e) => handleSelectMode(e, "dark")}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                themeMode === "dark" ? "text-indigo-500 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              onClick={(e) => handleSelectMode(e, "auto")}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                themeMode === "auto" ? "text-[#006FE6] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <SunMoon className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
