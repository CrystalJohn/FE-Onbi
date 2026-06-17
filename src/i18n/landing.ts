import type { ReactNode } from 'react';

export type Lang = 'en' | 'vi';
export const DEFAULT_LANG: Lang = 'vi';
export const LANG_COOKIE = 'onbi_lang';

export function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'vi';
}

export function readLangCookie(cookieValue: string | undefined): Lang {
  return cookieValue === 'en' ? 'en' : 'vi';
}

export type ProblemId = 'pomodoro' | 'tracking' | 'posture';
export type TeamRole = 'owner' | 'cofounder' | 'tech' | 'design';
export type PricingTierId = 'monthly' | 'device' | 'annual';

export interface ProblemTab {
  id: ProblemId;
  tabTitle: string;
  accent: string;
  title: string;
  description: string;
  solution: string;
}

export interface FeatureCardText { bold: string; rest: string; }

export interface PricingTier {
  id: PricingTierId;
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  dividerLabel: string;
  features: string[];
  cta: string;
  colorTheme: 'cyan' | 'blue' | 'amber';
}

export interface TeamMemberData {
  name: string;
  role: string;
  initials: string;
  color: string;
  avatar?: string;
  description: string;
  bgColor: string;
  domeBg: string;
}

export interface FooterLink {
  label: string;
  action: 'scroll' | 'timer';
  target?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface BlogArticle {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  href?: string;
  image?: string;
  imageAlt?: string;
}

export interface LandingContent {
  hero: { title: ReactNode; description: string; cta: string; ctaSecondary: string; };
  header: {
    home: string; problem: string; features: string; blog: string; pricing: string; team: string;
    focusTimer: string; testTimer: string; login: string; orderNow: string; enrollNow: string;
    languageLabel: string; langName: string; flag: string;
  };
  parentProblems: {
    tag: string; titleLine1: string; titleLine2: string; description: string; solutionLabel: string;
    problems: ProblemTab[];
  };
  features: {
    core: string; headingLine1: string; headingLine2: string; description: string;
    categories: { focus: string; health: string; parent: string; buddy: string; updates: string; };
    cards: { focus: FeatureCardText; health: FeatureCardText; buddy: FeatureCardText; parent: FeatureCardText; insights: FeatureCardText; updates: FeatureCardText; };
  };
  pricing: {
    tag: string; headingLine1: string; headingLine2: string; subheading: string;
    toggleNoDevice: string; toggleHasDevice: string; toggleHelperText: string; batchInfo: string;
    tiers: PricingTier[];
  };
  team: { tag: string; titleLine1: string; titleLine2: string; subTitle: string; team: TeamMemberData[]; };
  footer: {
    footnote1: string; footnote2: string; coppa: string; copyright: string;
    privacy: string; terms: string; sales: string; legal: string; cols: FooterColumn[];
  };
  blog: {
    tag: string; titleLine1: string; titleLine2: string; description: string;
    readMore: string; comingSoon: string; featuredBadge: string;
    toastMsg: string; toastMsgEn: string; author: string; date: string; category: string;
    blog: { title: string; excerpt: string; };
    placeholders: BlogArticle[];
  };
}
