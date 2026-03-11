'use client';

import { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ScoreRing from '@/components/ScoreRing';
import { cn, statusBadge, scoreColor } from '@/lib/utils';

const RadarChart = dynamic(() => import('@/components/RadarChart'), { ssr: false });

interface ReportData {
  id: string;
  platforms: string[];
  title: string;
  content: string;
  results: any[];
  createdAt: string;
  shareCount: number;
}

export default function ReportClient({ report }: { report: ReportData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const primary = report.results[0];
  const isZh = primary?.language === 'zh';

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = isZh
      ? `我的${primary.platformName}内容评分 ${primary.overallScore}/100，你的呢？`
      : `My ${primary.platformName} content scored ${primary.overallScore}/100. What's yours?`;

    fetch(`/api/report?id=${report.id}&action=share`).catch(() => {});

    if (navigator.share) {
      try { await navigator.share({ title: 'SocialFlow 检测报告', text, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    alert(isZh ? '分享链接已复制到剪贴板' : 'Share link copied to clipboard');
  }, [report.id, primary, isZh]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    const { toPng } = await import('html-to-image');
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#09090B' });
      const link = document.createElement('a');
      link.download = `socialflow-report-${report.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [report.id]);

  const badge = statusBadge(primary.status, isZh ? 'zh' : 'en');

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100">
      <header className="text-center pt-12 pb-6 px-4">
        <div className="text-xs font-bold tracking-[0.15em] uppercase text-indigo-400 mb-2">SocialFlow Report</div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">检测报告</h1>
        <p className="text-slate-500 text-xs mt-2">{new Date(report.createdAt).toLocaleString('zh-CN')}</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-20">
        {/* Report Card (downloadable) */}
        <div ref={cardRef} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{primary.platformIcon}</span>
              <span className="text-sm font-semibold text-slate-200">{primary.platformName}</span>
            </div>
            <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border', badge.cls)}>
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          </div>

          {report.title && <div className="text-sm font-medium text-slate-300 mb-3 truncate">{report.title}</div>}

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">{isZh ? '综合评分' : 'Overall Score'}</div>
              <div className="text-5xl font-bold" style={{ color: scoreColor(primary.overallScore) }}>
                {primary.overallScore}<span className="text-lg text-slate-500">/100</span>
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

          {/* Violations summary */}
          {primary.violations?.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-xs font-bold text-red-400 mb-2">
                ⚠️ {primary.violations.length} {isZh ? '个问题' : 'issue(s)'}
              </div>
              {primary.violations.slice(0, 5).map((v: any, i: number) => (
                <div key={i} className="text-xs text-red-300/80 mb-1">• {v.name}: {v.keyword}</div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-600">SocialFlow by MPChat</span>
            <span className="text-[10px] text-slate-600">socialflow-v2.onrender.com</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button onClick={handleShare}
            className="flex-1 py-3 rounded-xl font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition flex items-center justify-center gap-2">
            📤 {isZh ? '分享报告' : 'Share Report'}
          </button>
          <button onClick={handleDownload}
            className="flex-1 py-3 rounded-xl font-medium text-sm bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition flex items-center justify-center gap-2">
            📥 {isZh ? '保存图片' : 'Save Image'}
          </button>
        </div>

        {/* CTA */}
        <div className="text-center p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
          <p className="text-sm text-slate-300 mb-3">{isZh ? '检测你自己的社媒内容' : 'Check your own social media content'}</p>
          <a href="/"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/20">
            🔍 {isZh ? '免费检测' : 'Free Check'}
          </a>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-600">
        SocialFlow v2.0 · Powered by MPChat
      </footer>
    </div>
  );
}
