'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: '检测工具' },
  { href: '/history', label: '检测历史' },
  { href: '/templates', label: '爆文模板' },
  { href: '/xhs-check', label: '小红书', hidden: true },
  { href: '/twitter-checker', label: 'Twitter', hidden: true },
  { href: '/instagram-analyzer', label: 'Instagram', hidden: true },
  { href: '/youtube-title', label: 'YouTube', hidden: true },
];

const GUIDES = [
  { href: '/guide/xhs-rules', label: '小红书规则' },
  { href: '/guide/ig-hashtags', label: 'IG Hashtag' },
  { href: '/guide/yt-thumbnails', label: 'YT 缩略图' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090B]/80 border-b border-slate-800/50">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
        <a href="/" className="text-sm font-bold text-indigo-400 tracking-wide">SocialFlow</a>
        <div className="flex items-center gap-1">
          {LINKS.filter(l => !l.hidden).map(link => (
            <a key={link.href} href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition',
                pathname === link.href
                  ? 'bg-indigo-600/20 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              )}>
              {link.label}
            </a>
          ))}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition">
              指南 ▾
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-800 rounded-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
              {GUIDES.map(g => (
                <a key={g.href} href={g.href}
                  className="block px-4 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition">
                  {g.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
