'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getLanding, type LandingContent } from './landing.index';

/**
 * Resolves the live landing content for the current client language.
 * - On first render (server / hydration) returns the server-provided `initialT`
 *   so SSR HTML matches the cookie language and there is no hydration mismatch.
 * - After hydration, subscribes to the LanguageContext and returns the
 *   dictionary for the user's current language so client-side language
 *   switching keeps working.
 */
export function useLanding(initialT: LandingContent): LandingContent {
  const { language } = useLanguage();
  const [t, setT] = useState<LandingContent>(initialT);

  useEffect(() => {
    setT(getLanding(language));
  }, [language]);

  return t;
}
