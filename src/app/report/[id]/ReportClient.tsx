'use client';

import { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Share2, Download, Sparkles } from 'lucide-react';
import ScoreRing from '@/components/ScoreRing';
import { cn, statusBadge, scoreColor } from '@/lib/utils';

const RadarChart = dynamic(() => import('@/components/RadarChart'), { ssr: false });

interface ReportData { id: string; platforms: string[]; title: string; content: string; results: any[]; createdAt: string; shareCount: number; }

export default function ReportClient({ report }: { report: ReportData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const primary = report.results[0];
  const isZh = primary?.language === 'zh';

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = isZh ? `我的${primary.platformName}内容评分 ${primary.overallScore}/100` : `My ${primary.platformName} content scored ${primary.overallScore}/100`;
    fetch(`/api/report?id=${report.id}&action=share`).catch(() => {});
    if (navigator.share) { try { await navigator.share({ title: 'SocialFlow Report', text, url }); return; } catch {} }
    await navigator.clipboard.writeText(`${text}\n${url}`).catch(() => {});
    alert(isZh ? '链接已复制' : 'Link copied');
  }, [report.id, primary, isZh]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    const { toPng } = await import('html-to-image');
    try { const d = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#000' }); const a = document.createElement('a'); a.download = `socialflow-${report.id}.png`; a.href = d; a.click(); } catch {}
  }, [report.id]);

  const badge = statusBadge(primary.status, isZh ? 'zh' : 'en');

  return (
    <div className="min-h-screen">
      <header className="text-center pt-28 pb-8 px-4">
        <div className="section-label mb-2">SocialFlow Report</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">检测报告</h1>
        <p className="text-zinc-600 text-xs mt-2 font-mono">{new Date(report.createdAt).toLocaleString('zh-CN')}</p>
      </header>

      <main className="max-w-xl mx-auto px-4 pb-20">
        <div ref={cardRef} className="glass-elevated p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><span className="text-lg">{primary.platformIcon}</span><span className="text-sm font-semibold text-zinc-200">{primary.platformName}</span></div>
            <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border', badge.cls)}><span>{badge.icon}</span><span>{badge.text}</span></div>
          </div>
          {report.title && <div className="text-sm font-medium text-zinc-300 mb-4 truncate">{report.title}</div>}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="section-label mb-1">{isZh ? '综合评分' : 'Overall'}</div>
              <div className="text-5xl font-extrabold tracking-tight" style={{ color: scoreColor(primary.overallScore) }}>
                {primary.overallScore}<span className="text-lg text-zinc-600">/100</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <ScoreRing score={primary.scores.compliance} label={isZh ? '合规' : 'Comply'} size={48} />
              <ScoreRing score={primary.scores.engagement} label={isZh ? '互动' : 'Engage'} size={48} />
              <ScoreRing score={primary.scores.viral} label="Viral" size={48} />
              <ScoreRing score={primary.scores.algorithm} label={isZh ? '算法' : 'Algo'} size={48} />
            </div>
          </div>
          <RadarChart scores={primary.scores} lang={isZh ? 'zh' : 'en'} />
          {primary.violations?.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/[0.04] border border-red-500/10">
              <div className="text-xs font-bold text-red-400 mb-1.5">⚠️ {primary.violations.length} {isZh ? '个问题' : 'issue(s)'}</div>
              {primary.violations.slice(0, 5).map((v: any, i: number) => <div key={i} className="text-[10px] text-red-300/70 mb-0.5">• {v.name}: {v.keyword}</div>)}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[9px] text-zinc-700 font-mono">SocialFlow by MPChat</span>
            <span className="text-[9px] text-zinc-700 font-mono">socialflow-v2.onrender.com</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={handleShare} className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"><Share2 size={14} /> {isZh ? '分享' : 'Share'}</button>
          <button onClick={handleDownload} className="btn-ghost flex-1 py-3 text-sm flex items-center justify-center gap-2"><Download size={14} /> {isZh ? '保存图片' : 'Save Image'}</button>
        </div>

        <div className="glass-elevated p-8 text-center">
          <p className="text-sm text-zinc-400 mb-4">{isZh ? '检测你的社媒内容' : 'Check your content'}</p>
          <a href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"><Sparkles size={14} /> {isZh ? '免费检测' : 'Free Check'}</a>
        </div>
      </main>

      <footer className="text-center py-10 text-[11px] text-zinc-700">SocialFlow v2.0 · Powered by MPChat</footer>
    </div>
  );
}
