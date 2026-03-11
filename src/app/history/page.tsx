'use client';

import { useState, useEffect } from 'react';
import { cn, scoreColor } from '@/lib/utils';

interface HistoryItem {
  id: number;
  reportId: string | null;
  platforms: string[];
  title: string;
  contentPreview: string;
  overallScore: number;
  status: string;
  createdAt: string;
}

const PLATFORM_ICONS: Record<string, string> = { xhs: '📕', twitter: '🐦', facebook: '📘', instagram: '📸', youtube: '▶️' };
const STATUS_STYLE: Record<string, string> = {
  safe: 'bg-green-500/10 text-green-400',
  warning: 'bg-amber-500/10 text-amber-400',
  danger: 'bg-red-500/10 text-red-400',
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/history?limit=50')
      .then(res => res.json())
      .then(json => {
        if (json.success) { setItems(json.data); setTotal(json.total); }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100">
      <header className="text-center pt-12 pb-8 px-4">
        <div className="text-xs font-bold tracking-[0.15em] uppercase text-indigo-400 mb-2">SocialFlow</div>
        <h1 className="text-3xl font-bold">检测历史</h1>
        <p className="text-slate-500 text-sm mt-2">共 {total} 条检测记录</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mb-6 transition">
          ← 返回检测工具
        </a>

        {loading ? (
          <div className="text-center py-20 text-slate-500">加载中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">暂无检测记录</p>
            <a href="/" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition">
              开始第一次检测
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex items-center gap-4">
                <div className="text-3xl font-bold w-14 text-center" style={{ color: scoreColor(item.overallScore) }}>
                  {item.overallScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">{item.platforms.map(p => <span key={p} className="text-sm">{PLATFORM_ICONS[p] || p}</span>)}</div>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_STYLE[item.status] || '')}>
                      {item.status === 'safe' ? '合规' : item.status === 'warning' ? '需优化' : '风险'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-200 truncate">{item.title || item.contentPreview}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleString('zh-CN')}</div>
                </div>
                {item.reportId && (
                  <a href={`/report/${item.reportId}`} className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0">
                    查看报告 →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
