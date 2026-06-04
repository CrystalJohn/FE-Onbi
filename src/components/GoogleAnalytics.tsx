"use client";

/**
 * GoogleAnalytics — App Router Client Component
 *
 * Responsibilities:
 *  1. Inject the gtag.js <script> tag via next/script (afterInteractive strategy).
 *  2. Initialize the dataLayer + gtag function inline (required before the
 *     async script loads).
 *  3. Track SPA route changes using usePathname + useSearchParams so GA
 *     receives a pageview on every client-side navigation without a full reload.
 *
 * Rendering conditions:
 *  - Renders nothing (<></>) in development or when the Measurement ID is absent.
 *  - Wrapped in <Suspense> at the call-site (layout.tsx) to satisfy Next.js
 *    requirements for useSearchParams inside Server Component trees.
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { pageview } from "@/lib/analytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ---------------------------------------------------------------------------
// Inner component — separated so Suspense can wrap it at the layout level
// ---------------------------------------------------------------------------

function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!IS_PRODUCTION || !GA_MEASUREMENT_ID) return;

    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

// ---------------------------------------------------------------------------
// Default export — renders Scripts + route tracker
// ---------------------------------------------------------------------------

export default function GoogleAnalytics() {
  // Render nothing outside production or when ID is missing
  if (!IS_PRODUCTION || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Load gtag.js — afterInteractive: fires after page becomes interactive */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />

      {/* Initialise dataLayer and configure the property */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />

      {/* SPA route change tracker */}
      <AnalyticsRouteTracker />
    </>
  );
}
