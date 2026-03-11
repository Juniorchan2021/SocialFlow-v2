'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Platform = 'xhs' | 'twitter' | 'facebook' | 'instagram' | 'youtube';

const PLATFORMS: { id: Platform; name: string; icon: string }[] = [
  { id: 'xhs', name: '小红书', icon: '📕' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
];

interface Template {
  id: string;
  platform: Platform;
  category: string;
  name: string;
  titleTemplate: string;
  contentTemplate: string;
  tags: string[];
  formula: string;
  lang: 'zh' | 'en';
}

export default function TemplatesPage() {
  const [platform, setPlatform] = useState<Platform>('xhs');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/templates?platform=${platform}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTemplates(json.data);
          setCategories(json.categories);
          setActiveCategory('all');
          setExpanded(null);
        }
      });
  }, [platform]);

  const filtered = activeCategory === 'all' ? templates : templates.filter(t => t.category === activeCategory);

  const handleCopy = (tpl: Template) => {
    const text = `${tpl.titleTemplate}\n\n${tpl.contentTemplate}`;
    navigator.clipboard.writeText(text);
    setCopied(tpl.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100">
      <header className="text-center pt-12 pb-8 px-4">
        <div className="text-xs font-bold tracking-[0.15em] uppercase text-indigo-400 mb-2">SocialFlow</div>
        <h1 className="text-3xl font-bold">爆文模板库</h1>
        <p className="text-slate-400 text-sm mt-2">精选各平台高互动内容模板 · 一键套用</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mb-6 transition">
          ← 返回检测工具
        </a>

        {/* Platform selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition border',
                platform === p.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
              )}>
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveCategory('all')}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition',
              activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200')}>
            全部
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition',
                activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200')}>
              {cat}
            </button>
          ))}
        </div>

        {/* Template cards */}
        <div className="space-y-3">
          {filtered.map(tpl => (
            <div key={tpl.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition">
              <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === tpl.id ? null : tpl.id)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">{tpl.category}</span>
                    <span className="text-sm font-semibold text-slate-200">{tpl.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{expanded === tpl.id ? '收起' : '展开'}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono">公式：{tpl.formula}</div>
                <div className="text-sm text-slate-300 mt-2 truncate">{tpl.titleTemplate}</div>
              </div>

              {expanded === tpl.id && (
                <div className="px-4 pb-4 border-t border-slate-800 pt-3 animate-in">
                  <div className="mb-3">
                    <div className="text-xs font-bold text-slate-400 mb-1">标题模板</div>
                    <div className="bg-slate-800/60 rounded-lg p-3 text-sm text-indigo-300 font-medium">{tpl.titleTemplate}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs font-bold text-slate-400 mb-1">正文模板</div>
                    <div className="bg-slate-800/60 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {tpl.contentTemplate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {tpl.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(tpl)}
                      className={cn('px-4 py-2 rounded-lg text-xs font-medium transition',
                        copied === tpl.id ? 'bg-green-500/20 text-green-400' : 'bg-indigo-600 text-white hover:bg-indigo-500')}>
                      {copied === tpl.id ? '✓ 已复制' : '📋 复制模板'}
                    </button>
                    <a href={`/?template=${tpl.id}`}
                      className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition">
                      🔍 去检测
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
