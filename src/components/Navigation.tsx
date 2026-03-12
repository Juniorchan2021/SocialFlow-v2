'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Sparkles, History, LayoutGrid, BookOpen } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Analyze', icon: Sparkles },
  { href: '/history', label: 'History', icon: History },
  { href: '/templates', label: 'Templates', icon: LayoutGrid },
];

const GUIDES = [
  { href: '/guide/xhs-rules', label: '小红书规则' },
  { href: '/guide/ig-hashtags', label: 'IG Hashtags' },
  { href: '/guide/yt-thumbnails', label: 'YT Thumbnails' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <a href="/" className="px-3 py-1.5 flex items-center gap-2 mr-1">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-[9px] font-black text-white">SF</span>
          </div>
        </a>

        <div className="h-4 w-px bg-white/[0.06] mx-0.5" />

        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <a key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                active
                  ? 'bg-white/[0.1] text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              )}>
              <Icon size={13} strokeWidth={active ? 2.5 : 2} />
              <span className="hidden sm:inline">{item.label}</span>
            </a>
          );
        })}

        <div className="h-4 w-px bg-white/[0.06] mx-0.5" />

        {/* Guide dropdown */}
        <div className="relative" onMouseEnter={() => setGuideOpen(true)} onMouseLeave={() => setGuideOpen(false)}>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all duration-200">
            <BookOpen size={13} />
            <span className="hidden sm:inline">Guide</span>
          </button>
          {guideOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 py-1.5 bg-zinc-950/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
              {GUIDES.map(g => (
                <a key={g.href} href={g.href}
                  className="block px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors">
                  {g.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
