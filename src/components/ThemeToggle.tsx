"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-[#ccc9bf]/30 dark:border-zinc-800 bg-transparent shrink-0" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";
    const doc = document as any;

    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      return;
    }

    // Get the center of the button as the coordinate origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.classList.add("theme-transitioning");

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
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

  return (
    <button
      onClick={handleThemeToggle}
      className="relative w-9 h-9 rounded-full border border-[#ccc9bf]/30 dark:border-zinc-850 bg-slate-100/50 hover:bg-slate-200/50 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 transition-all duration-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer shadow-3xs hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
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
    </button>
  );
}
