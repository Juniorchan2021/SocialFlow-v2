'use client';

import { cn } from '@/lib/utils';
import { useLang } from '@/lib/lang-context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, History, LayoutGrid, BookOpen, Globe } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/', labelZh: '检测', labelEn: 'Analyze', icon: Sparkles },
  { href: '/history', labelZh: '历史', labelEn: 'History', icon: History },
  { href: '/templates', labelZh: '模板', labelEn: 'Templates', icon: LayoutGrid },
];

const GUIDES = [
  { href: '/guide/xhs-rules', labelZh: '小红书规则', labelEn: 'XHS Rules' },
  { href: '/guide/ig-hashtags', labelZh: 'IG Hashtag策略', labelEn: 'IG Hashtags' },
  { href: '/guide/yt-thumbnails', labelZh: 'YT 缩略图', labelEn: 'YT Thumbnails' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { lang, toggle, t } = useLang();
  const [guideOpen, setGuideOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openGuide = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setGuideOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setGuideOpen(false), 150);
  }, []);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <Link href="/" className="px-3 py-1.5 flex items-center gap-2 mr-1">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-[9px] font-black text-white">SF</span>
          </div>
        </Link>

        <div className="h-4 w-px bg-white/[0.06] mx-0.5" />

        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                active ? 'bg-white/[0.1] text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              )}>
              <Icon size={13} strokeWidth={active ? 2.5 : 2} />
              <span className="hidden sm:inline">{lang === 'zh' ? item.labelZh : item.labelEn}</span>
            </Link>
          );
        })}

        <div className="h-4 w-px bg-white/[0.06] mx-0.5" />

        {/* Guide dropdown — with delayed close to bridge the gap */}
        <div className="relative" onMouseEnter={openGuide} onMouseLeave={scheduleClose}>
          <button className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            guideOpen ? 'bg-white/[0.06] text-zinc-300' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
          )}>
            <BookOpen size={13} />
            <span className="hidden sm:inline">{t('指南', 'Guide')}</span>
          </button>
          {guideOpen && (
            <div className="absolute right-0 top-full pt-1.5" onMouseEnter={openGuide} onMouseLeave={scheduleClose}>
              <div className="w-48 py-1.5 bg-zinc-950/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
                {GUIDES.map(g => (
                  <Link key={g.href} href={g.href}
                    onClick={() => setGuideOpen(false)}
                    className="block px-4 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors">
                    {lang === 'zh' ? g.labelZh : g.labelEn}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-white/[0.06] mx-0.5" />

        {/* Language Toggle */}
        <button onClick={toggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all duration-200"
          title={lang === 'zh' ? 'Switch to English' : '切换中文'}>
          <Globe size={13} />
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">{lang === 'zh' ? 'EN' : '中'}</span>
        </button>
      </div>
    </nav>
  );
}
