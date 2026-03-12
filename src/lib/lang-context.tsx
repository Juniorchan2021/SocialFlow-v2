'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Lang = 'zh' | 'en';

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (zh: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({ lang: 'zh', toggle: () => {}, t: (zh) => zh });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');
  const toggle = useCallback(() => setLang(prev => prev === 'zh' ? 'en' : 'zh'), []);
  const t = useCallback((zh: string, en: string) => lang === 'zh' ? zh : en, [lang]);

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
