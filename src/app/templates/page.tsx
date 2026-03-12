'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/lang-context';
import { ArrowLeft, Copy, Check } from 'lucide-react';

type Platform = 'xhs' | 'twitter' | 'facebook' | 'instagram' | 'youtube';
const PLATFORMS: { id: Platform; name: string; icon: string }[] = [
  { id: 'xhs', name: '小红书', icon: '📕' }, { id: 'twitter', name: 'Twitter', icon: '𝕏' },
  { id: 'facebook', name: 'Facebook', icon: 'f' }, { id: 'instagram', name: 'Instagram', icon: '📸' }, { id: 'youtube', name: 'YouTube', icon: '▶' },
];

interface Template { id: string; platform: Platform; category: string; name: string; titleTemplate: string; contentTemplate: string; tags: string[]; formula: string; lang: 'zh' | 'en'; }

export default function TemplatesPage() {
  const { t } = useLang();
  const [platform, setPlatform] = useState<Platform>('xhs');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/templates?platform=${platform}`).then(r => r.json()).then(j => {
      if (j.success) { setTemplates(j.data); setCategories(j.categories); setActiveCategory('all'); setExpanded(null); }
    });
  }, [platform]);

  const filtered = activeCategory === 'all' ? templates : templates.filter(t => t.category === activeCategory);
  const handleCopy = (tpl: Template) => { navigator.clipboard.writeText(`${tpl.titleTemplate}\n\n${tpl.contentTemplate}`).catch(() => {}); setCopied(tpl.id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="min-h-screen">
      <header className="text-center pt-28 pb-8 px-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{t('爆文模板库', 'Templates')}</h1>
        <p className="text-zinc-500 text-sm mt-2">{t('爆款内容模板 · 一键复制使用', 'Viral content templates · One-click copy')}</p>
      </header>
      <main className="max-w-3xl mx-auto px-4 pb-20">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-6 transition"><ArrowLeft size={12} /> {t('返回', 'Back')}</a>

        <div className="flex flex-wrap gap-2 mb-6">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={cn('flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all border',
                platform === p.id ? 'bg-white/[0.08] border-white/[0.15] text-white' : 'border-white/[0.04] text-zinc-500 hover:text-zinc-300')}>
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveCategory('all')}
            className={cn('px-3 py-1.5 rounded-full text-[10px] font-semibold shrink-0 transition',
              activeCategory === 'all' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20' : 'text-zinc-600 hover:text-zinc-400')}>{t('全部', 'All')}</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn('px-3 py-1.5 rounded-full text-[10px] font-semibold shrink-0 transition',
                activeCategory === cat ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20' : 'text-zinc-600 hover:text-zinc-400')}>{cat}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">{t('加载中...', 'Loading...')}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(tpl => (
              <div key={tpl.id} className="glass-elevated overflow-hidden">
                <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === tpl.id ? null : tpl.id)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md grade-a">{tpl.category}</span>
                      <span className="text-sm font-semibold text-zinc-200">{tpl.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600">{expanded === tpl.id ? '−' : '+'}</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono">{tpl.formula}</div>
                </div>
                {expanded === tpl.id && (
                  <div className="px-5 pb-5 border-t border-white/[0.03] pt-4 animate-in">
                    <div className="mb-3">
                      <span className="section-label mb-1.5 block">{t('标题模板', 'Title')}</span>
                      <div className="bg-violet-500/[0.04] rounded-lg p-3 text-sm text-violet-300 font-medium border border-violet-500/10">{tpl.titleTemplate}</div>
                    </div>
                    <div className="mb-3">
                      <span className="section-label mb-1.5 block">{t('正文模板', 'Content')}</span>
                      <div className="bg-white/[0.02] rounded-lg p-3 text-[11px] text-zinc-400 whitespace-pre-wrap max-h-48 overflow-y-auto border border-white/[0.04]">{tpl.contentTemplate}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {tpl.tags.map(tag => <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-500 border border-white/[0.04]">#{tag}</span>)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleCopy(tpl)} className={cn('btn-ghost px-4 py-2 text-xs flex items-center gap-1.5', copied === tpl.id && '!text-green-400 !border-green-500/20')}>
                        {copied === tpl.id ? <><Check size={12} /> {t('已复制', 'Copied')}</> : <><Copy size={12} /> {t('复制', 'Copy')}</>}
                      </button>
                      <a href={`/?template=${tpl.id}`} className="btn-ghost px-4 py-2 text-xs">{t('去检测 →', 'Check →')}</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
