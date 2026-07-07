"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

// Suppress the React 19 warning about script tags in components during development.
// This is a known issue with next-themes where the injected FOUC-prevention script
// triggers a warning in React 19/Next.js 15+ hydration, which is safe to ignore.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}

const VALID_MODES: ThemeMode[] = ["light", "dark", "auto"];

function ThemeModeResolver({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  // null = not yet loaded from localStorage (prevents race condition flash)
  const [themeMode, setThemeModeState] = useState<ThemeMode | null>(null);

  // Bug fix: Load themeMode from localStorage BEFORE applying any theme
  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode");
    // Bug fix: validate the stored value before trusting it
    if (savedMode && VALID_MODES.includes(savedMode as ThemeMode)) {
      setThemeModeState(savedMode as ThemeMode);
    } else {
      // Default to auto
      localStorage.setItem("theme-mode", "auto");
      setThemeModeState("auto");
    }
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("theme-mode", mode);
  };

  useEffect(() => {
    // Bug fix: do nothing until localStorage has been read (prevents race condition)
    if (themeMode === null) return;

    if (themeMode === "auto") {
      const updateAutoTheme = () => {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour >= 18;
        setTheme(isNight ? "dark" : "light");
      };

      updateAutoTheme();
      const interval = setInterval(updateAutoTheme, 60000); // Check every minute
      return () => clearInterval(interval);
    } else {
      setTheme(themeMode);
    }
  }, [themeMode]);

  return (
    <ThemeModeContext.Provider value={{ themeMode: themeMode ?? "auto", setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeModeResolver>{children}</ThemeModeResolver>
    </NextThemesProvider>
  );
}
