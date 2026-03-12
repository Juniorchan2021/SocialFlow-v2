'use client';

import { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Share2, Download, Sparkles, Shield, TrendingUp, Zap, Flame, ImageIcon, Eye } from 'lucide-react';
import ScoreRing from '@/components/ScoreRing';
import { cn, statusBadge, scoreColor } from '@/lib/utils';
import { useLang } from '@/lib/lang-context';

const RadarChart = dynamic(() => import('@/components/RadarChart'), { ssr: false });

interface ReportImage {
  src: string;
  analysis?: {
    compliance: { overallRisk: string; issues: { type: string; severity: string; description: string; action: string }[]; safeToPublish: boolean };
    design: { designScore: number; scrollStopPower: number; feedback: string; topActions: string[]; styleReferences: { name: string; description: string }[] };
  };
}

interface ReportData {
  id: string;
  platforms: string[];
  title: string;
  content: string;
  results: any[];
  images: ReportImage[];
  createdAt: string;
  shareCount: number;
}

function formatUTC8(utcStr: string): string {
  const d = new Date(utcStr + (utcStr.endsWith('Z') ? '' : 'Z'));
  const offset = d.getTime() + 8 * 3600 * 1000;
  const utc8 = new Date(offset);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${utc8.getUTCFullYear()}/${pad(utc8.getUTCMonth() + 1)}/${pad(utc8.getUTCDate())} ${pad(utc8.getUTCHours())}:${pad(utc8.getUTCMinutes())}:${pad(utc8.getUTCSeconds())}`;
}

export default function ReportClient({ report }: { report: ReportData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { lang: uiLang, t } = useLang();
  const primary = report.results[0];

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = uiLang === 'zh'
      ? `我的${primary.platformName}内容评分 ${primary.overallScore}/100`
      : `My ${primary.platformName} content scored ${primary.overallScore}/100`;
    fetch(`/api/report?id=${report.id}&action=share`).catch(() => {});
    if (navigator.share) { try { await navigator.share({ title: 'SocialFlow Report', text, url }); return; } catch {} }
    await navigator.clipboard.writeText(`${text}\n${url}`).catch(() => {});
    alert(t('链接已复制', 'Link copied'));
  }, [report.id, primary, uiLang, t]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    const { toPng } = await import('html-to-image');
    try {
      const d = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#000' });
      const a = document.createElement('a'); a.download = `socialflow-${report.id}.png`; a.href = d; a.click();
    } catch {}
  }, [report.id]);

  const badge = statusBadge(primary.status, uiLang);

  return (
    <div className="min-h-screen">
      <header className="text-center pt-28 pb-8 px-4">
        <div className="section-label mb-2">SocialFlow Report</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{t('检测报告', 'Analysis Report')}</h1>
        <p className="text-zinc-600 text-xs mt-2 font-mono">{formatUTC8(report.createdAt)}</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-20">
        <div ref={cardRef} className="space-y-4">

          {/* ══════ SECTION A: Original Content ══════ */}
          <div className="glass-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{primary.platformIcon}</span>
                <span className="text-sm font-semibold text-zinc-200">{primary.platformName}</span>
              </div>
              <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border', badge.cls)}>
                <span>{badge.icon}</span><span>{badge.text}</span>
              </div>
            </div>

            {report.title && (
              <h2 className="text-lg font-bold text-white mb-3 leading-snug">{report.title}</h2>
            )}

            {report.content && (
              <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded-xl p-4 border border-white/[0.04] mb-4 max-h-64 overflow-y-auto">
                {report.content}
              </div>
            )}

            {report.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.images.map((img, i) => (
                  <img key={i} src={img.src} alt={`Image ${i + 1}`} className="h-20 rounded-lg object-cover border border-white/[0.06]" />
                ))}
              </div>
            )}
          </div>

          {/* ══════ SECTION A2: Image Analysis ══════ */}
          {report.images.some(img => img.analysis) && (
            <div className="glass-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={14} className="text-cyan-400" />
                <span className="section-label">{t('配图点评', 'Image Review')}</span>
              </div>
              <div className="space-y-4">
                {report.images.map((img, idx) => {
                  if (!img.analysis) return null;
                  const a = img.analysis;
                  return (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                      <img src={img.src} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 border border-white/[0.06]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          <ScoreRing score={a.design.designScore} label={t('设计', 'Design')} size={44} />
                          <ScoreRing score={a.design.scrollStopPower} label={t('停留', 'Stop')} size={44} />
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', a.compliance.safeToPublish ? 'grade-s' : 'grade-c')}>
                            {a.compliance.safeToPublish ? t('✓ 安全', '✓ Safe') : t('✕ 风险', '✕ Risk')}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{a.design.feedback}</p>
                        {a.design.topActions.length > 0 && (
                          <div className="space-y-1 mb-2">
                            {a.design.topActions.map((action, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-[10px] text-zinc-500">
                                <span className="text-violet-400 mt-0.5 shrink-0">→</span><span>{action}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {a.compliance.issues.length > 0 && (
                          <div className="space-y-1">
                            {a.compliance.issues.map((issue, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-[10px]">
                                <span className={cn('shrink-0 mt-0.5', issue.severity === 'high' ? 'text-red-400' : issue.severity === 'medium' ? 'text-amber-400' : 'text-zinc-500')}>⚠</span>
                                <div>
                                  <span className="text-zinc-300">{issue.description}</span>
                                  {issue.action && <span className="text-zinc-600 ml-1">· {issue.action}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {a.design.styleReferences?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/[0.04]">
                            <div className="flex items-center gap-1 mb-1">
                              <Eye size={10} className="text-zinc-600" />
                              <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold">{t('参考风格', 'Style Ref')}</span>
                            </div>
                            {a.design.styleReferences.map((ref, j) => (
                              <div key={j} className="text-[10px] text-zinc-500">
                                <span className="text-zinc-400 font-medium">{ref.name}</span> — {ref.description}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════ SECTION B: Score Dashboard ══════ */}
          <div className="glass-elevated p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="section-label mb-1">{t('综合评分', 'Overall Score')}</div>
                <div className="text-5xl font-extrabold tracking-tight" style={{ color: scoreColor(primary.overallScore) }}>
                  {primary.overallScore}<span className="text-lg text-zinc-600">/100</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <ScoreRing score={primary.scores.compliance} label={t('合规', 'Comply')} size={48} />
                <ScoreRing score={primary.scores.engagement} label={t('互动', 'Engage')} size={48} />
                <ScoreRing score={primary.scores.viral} label="Viral" size={48} />
                <ScoreRing score={primary.scores.algorithm} label={t('算法', 'Algo')} size={48} />
              </div>
            </div>
            <RadarChart scores={primary.scores} lang={uiLang} />
          </div>

          {/* ══════ SECTION C: Detailed Review ══════ */}

          {/* Violations */}
          {primary.violations?.length > 0 && (
            <div className="glass-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={14} className="text-red-400" />
                <span className="section-label">{t(`${primary.violations.length} 个违规`, `${primary.violations.length} Violation(s)`)}</span>
              </div>
              <div className="space-y-2">
                {primary.violations.map((v: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border-l-[3px]" style={{ borderLeftColor: v.color }}>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: v.color }}>{v.name}</div>
                      <div className="text-[11px] text-zinc-500">{t('触发词', 'Keyword')}：<span className="text-zinc-300 font-mono">{v.keyword}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimizations */}
          {primary.optimizations?.length > 0 && (
            <div className="glass-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-indigo-400" />
                <span className="section-label">{t('优化建议', 'Optimizations')}</span>
              </div>
              <div className="space-y-3">
                {primary.optimizations.map((opt: any, i: number) => {
                  const priCls: Record<string, string> = { critical: 'grade-c', high: 'grade-b', medium: 'grade-a', low: 'grade-d' };
                  const priLbl: Record<string, string> = uiLang === 'zh'
                    ? { critical: '紧急', high: '重要', medium: '建议', low: '可选' }
                    : { critical: 'URGENT', high: 'HIGH', medium: 'TIP', low: 'OPT' };
                  return (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-md uppercase', priCls[opt.priority])}>{priLbl[opt.priority]}</span>
                        <span className="text-[11px] font-semibold text-zinc-300">{opt.category}</span>
                      </div>
                      <p className="text-sm text-zinc-200 mb-2 leading-relaxed">{opt.direction}</p>
                      {opt.example && (
                        <div className="text-xs text-violet-300/80 bg-violet-500/[0.06] rounded-lg px-3 py-2 mb-2 border border-violet-500/10 italic">{opt.example}</div>
                      )}
                      {opt.actions?.length > 0 && (
                        <div className="space-y-1">{opt.actions.map((a: string, j: number) => (
                          <div key={j} className="flex items-start gap-2 text-[11px] text-zinc-400"><span className="text-green-500 shrink-0">✓</span><span>{a}</span></div>
                        ))}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Algorithm Simulation */}
          {primary.algoSim && (
            <div className="glass-elevated p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-violet-400" />
                  <span className="section-label">{primary.algoSim.modelName}</span>
                </div>
                <span className={cn('px-3 py-1 rounded-lg text-sm font-bold', `grade-${primary.algoSim.grade.toLowerCase()}`)}>
                  {primary.algoSim.grade}
                </span>
              </div>
              <div className="text-xs text-violet-300/80 bg-violet-500/[0.06] rounded-lg px-3 py-2 mb-4 border border-violet-500/10">
                {primary.algoSim.prediction}
              </div>
              <div className="space-y-2">
                {primary.algoSim.signals.map((sig: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-zinc-400 truncate">{sig.name}</span>
                      <span className="text-[10px] font-mono text-zinc-600 shrink-0">{sig.score}/{sig.maxScore}</span>
                    </div>
                    <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${(sig.score / sig.maxScore) * 100}%`,
                        background: sig.score >= sig.maxScore * 0.7 ? 'linear-gradient(90deg,#8B5CF6,#A78BFA)' : sig.score >= sig.maxScore * 0.4 ? 'linear-gradient(90deg,#F59E0B,#FBBF24)' : 'linear-gradient(90deg,#EF4444,#F87171)'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Viral Prediction */}
          {primary.viralPrediction && (
            <div className="glass-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={14} className="text-orange-400" />
                <span className="section-label">{t('爆款预测', 'Viral Prediction')}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn('text-3xl font-extrabold tracking-tight',
                  primary.viralPrediction.probability === 'high' ? 'text-green-400' : primary.viralPrediction.probability === 'medium' ? 'text-amber-400' : 'text-zinc-500')}>
                  {primary.viralPrediction.percentage}%
                </div>
                <span className={cn('text-xs font-bold px-3 py-1 rounded-full',
                  primary.viralPrediction.probability === 'high' ? 'grade-s' : primary.viralPrediction.probability === 'medium' ? 'grade-b' : 'grade-d')}>
                  {primary.viralPrediction.probability === 'high' ? t('高概率', 'High') : primary.viralPrediction.probability === 'medium' ? t('有潜力', 'Medium') : t('需提升', 'Low')}
                </span>
              </div>
              {primary.viralPrediction.boostTips?.length > 0 && (
                <div className="space-y-1.5">
                  {primary.viralPrediction.boostTips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400"><span className="text-amber-400">⚡</span><span>{tip}</span></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Deep Analysis */}
          {primary.aiAnalysis && (
            <div className="glass-elevated overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/10 px-6 py-3 flex items-center justify-between border-b border-white/[0.04]">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5"><Sparkles size={12} /> AI {t('深度分析', 'Deep Analysis')}</span>
                <span className="text-[9px] text-zinc-500 font-mono">Claude Haiku 4.5</span>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm text-zinc-200 bg-violet-500/[0.05] rounded-lg p-3 border-l-[3px] border-violet-500 leading-relaxed">
                  {primary.aiAnalysis.aiInsight}
                </p>
                {primary.aiAnalysis.rewriteContent && (
                  <div>
                    <span className="section-label mb-2 block">AI {t('改写建议', 'Rewrite')}</span>
                    <div className="bg-white/[0.02] rounded-xl p-4 text-sm text-zinc-200 whitespace-pre-wrap border border-white/[0.04]">
                      {primary.aiAnalysis.rewriteTitle && <div className="font-semibold text-violet-300 mb-2">{primary.aiAnalysis.rewriteTitle}</div>}
                      {primary.aiAnalysis.rewriteContent}
                    </div>
                  </div>
                )}
                {primary.aiAnalysis.additionalTips?.length > 0 && (
                  <div>{primary.aiAnalysis.additionalTips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 py-1.5 border-b border-white/[0.03] last:border-0"><span className="text-violet-400">◆</span><span>{tip}</span></div>
                  ))}</div>
                )}
              </div>
            </div>
          )}

          {/* Hashtags */}
          {primary.hashtagSuggestions?.length > 0 && (
            <div className="glass-elevated p-6">
              <span className="section-label mb-3 block">{t('推荐标签', 'Hashtags')}</span>
              <div className="flex flex-wrap gap-1.5">
                {primary.hashtagSuggestions.map((h: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-violet-500/[0.06] text-violet-300 border border-violet-500/10">{h}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer watermark */}
          <div className="flex items-center justify-between px-2 py-3">
            <span className="text-[9px] text-zinc-700 font-mono">SocialFlow by MPChat</span>
            <span className="text-[9px] text-zinc-700 font-mono">socialflow-v2.onrender.com</span>
          </div>
        </div>

        {/* Action buttons (outside cardRef so they don't appear in screenshot) */}
        <div className="flex gap-3 mb-6 mt-4">
          <button onClick={handleShare} className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
            <Share2 size={14} /> {t('分享', 'Share')}
          </button>
          <button onClick={handleDownload} className="btn-ghost flex-1 py-3 text-sm flex items-center justify-center gap-2">
            <Download size={14} /> {t('保存图片', 'Save Image')}
          </button>
        </div>

        <div className="glass-elevated p-8 text-center">
          <p className="text-sm text-zinc-400 mb-4">{t('检测你的社媒内容', 'Check your content')}</p>
          <a href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm">
            <Sparkles size={14} /> {t('免费检测', 'Free Check')}
          </a>
        </div>
      </main>

      <footer className="text-center py-10 text-[11px] text-zinc-700">SocialFlow v2.0 · Powered by MPChat</footer>
    </div>
  );
}
