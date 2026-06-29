"use client";

/**
 * MicrosoftClarity — App Router Client Component
 *
 * Injects the Microsoft Clarity tracking script via next/script.
 * The original snippet uses document.createElement to inject itself —
 * we keep that exact logic inside a single dangerouslySetInnerHTML block
 * so next/script can manage lifecycle safely (no duplicate injection).
 *
 * Rendering conditions:
 *  - Returns null in development or when NEXT_PUBLIC_CLARITY_PROJECT_ID is absent.
 *  - Does NOT use useSearchParams, so no Suspense boundary is required.
 */

import Script from "next/script";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "x1l9ug9xax";

export default function MicrosoftClarity() {
  if (!CLARITY_ID) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `,
      }}
    />
  );
}
