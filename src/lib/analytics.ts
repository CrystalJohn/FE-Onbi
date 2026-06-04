/**
 * Google Analytics 4 — Utility helpers
 *
 * All tracking calls are no-ops unless:
 *  - NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 *  - The app is running in the "production" NODE_ENV
 *
 * PRIVACY: Never pass PII (email, phone, full name, address, form content)
 * as event parameters.
 */

// ---------------------------------------------------------------------------
// Type declarations — keeps TypeScript happy with window.gtag / window.dataLayer
// ---------------------------------------------------------------------------

export type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    // Microsoft Clarity
    clarity: (command: string, ...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Internal guard — returns true only in production with a valid Measurement ID
// ---------------------------------------------------------------------------

const isProductionWithGA = (): boolean => {
  return (
    process.env.NODE_ENV === "production" &&
    typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === "string" &&
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID.length > 0
  );
};

// ---------------------------------------------------------------------------
// Public utility: pageview
// Call this whenever the user navigates to a new page (SPA route change).
// ---------------------------------------------------------------------------

export const pageview = (url: string): void => {
  if (!isProductionWithGA()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string, {
    page_path: url,
  });
};

// ---------------------------------------------------------------------------
// Public utility: trackEvent
// Use this to send custom events, e.g.:
//   trackEvent("cta_click", { button_name: "register_now", section: "hero" })
//
// Do NOT pass any PII in eventParameters.
// ---------------------------------------------------------------------------

export const trackEvent = (
  eventName: string,
  eventParameters?: Record<string, string | number | boolean>
): void => {
  if (!isProductionWithGA()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, eventParameters ?? {});
};
