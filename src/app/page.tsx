import { cookies } from 'next/headers';
import { isLang, getLanding, LANG_COOKIE } from '@/i18n/landing.index';
import HomePageClient from './_home-page-client';
import type { Lang } from '@/i18n/landing';

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(cookieValue) ? cookieValue : 'vi';
  const t = getLanding(lang);
  return <HomePageClient lang={lang} t={t} />;
}
