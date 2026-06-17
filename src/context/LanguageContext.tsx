'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  // Load language from localStorage or cookie on mount, sync state with cookie
  useEffect(() => {
    const cookieMatch = typeof document !== 'undefined'
      ? document.cookie.split('; ').find((c) => c.startsWith('onbi_lang='))
      : undefined;
    const fromCookie = cookieMatch ? cookieMatch.split('=')[1] : undefined;
    const savedLang = (fromCookie || localStorage.getItem('onbi_lang')) as Language;
    if (savedLang === 'en' || savedLang === 'vi') {
      setLanguageState(savedLang);
      if (!fromCookie) {
        document.cookie = `onbi_lang=${savedLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      }
    } else {
      setLanguageState('vi');
      localStorage.setItem('onbi_lang', 'vi');
      document.cookie = `onbi_lang=vi; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('onbi_lang', lang);
    // Mirror to non-httpOnly cookie so server-rendered landing pages read the same lang
    document.cookie = `onbi_lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'vi' : 'en';
    setLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
