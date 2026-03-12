'use client';

import { useState, useEffect } from 'react';
import { cn, scoreColor } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface HistoryItem { id: number; reportId: string | null; platforms: string[]; title: string; contentPreview: string; overallScore: number; status: string; createdAt: string; }

const ICONS: Record<string, string> = { xhs: '📕', twitter: '𝕏', facebook: 'f', instagram: '📸', youtube: '▶' };
const STATUS: Record<string, string> = { safe: 'grade-s', warning: 'grade-b', danger: 'grade-c' };

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/history?limit=50').then(r => r.json()).then(j => { if (j.success) { setItems(j.data); setTotal(j.total); } }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="text-center pt-28 pb-8 px-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">History</h1>
        <p className="text-zinc-600 text-sm mt-2">{total} records</p>
      </header>
      <main className="max-w-3xl mx-auto px-4 pb-20">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-6 transition"><ArrowLeft size={12} /> Back</a>
        {loading ? <div className="text-center py-20 text-zinc-600">Loading...</div> : items.length === 0 ? (
          <div className="text-center py-20"><p className="text-zinc-600 mb-4">No records yet</p><a href="/" className="btn-primary inline-block px-6 py-2 text-sm">Start first check</a></div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="glass-elevated flex items-center gap-4 p-4">
                <div className="text-2xl font-extrabold w-12 text-center tabular-nums tracking-tight" style={{ color: scoreColor(item.overallScore) }}>{item.overallScore}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">{item.platforms.map(p => <span key={p} className="text-xs">{ICONS[p] || p}</span>)}</div>
                    <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-md', STATUS[item.status] || '')}>
                      {item.status === 'safe' ? 'OK' : item.status === 'warning' ? 'WARN' : 'RISK'}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-300 truncate">{item.title || item.contentPreview}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">{new Date(item.createdAt).toLocaleString('zh-CN')}</div>
                </div>
                {item.reportId && <a href={`/report/${item.reportId}`} className="text-[10px] text-violet-400 hover:text-violet-300 shrink-0">View →</a>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
