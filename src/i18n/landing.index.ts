import { DEFAULT_LANG, LANG_COOKIE, isLang, readLangCookie, type Lang } from './landing';
import en from './landing.en';
import vi from './landing.vi';
import type { LandingContent } from './landing';

export { DEFAULT_LANG, LANG_COOKIE, isLang, readLangCookie };
export type { Lang, LandingContent };

const DICT: Record<Lang, LandingContent> = { en, vi };

export function getLanding(lang: Lang): LandingContent {
  return DICT[lang] ?? DICT[DEFAULT_LANG];
}
