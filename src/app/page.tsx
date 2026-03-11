'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ScoreRing from '@/components/ScoreRing';
import { cn, statusBadge, scoreColor } from '@/lib/utils';

const RadarChart = dynamic(() => import('@/components/RadarChart'), { ssr: false });

type Platform = 'xhs' | 'twitter' | 'facebook' | 'instagram' | 'youtube';

const PLATFORMS: { id: Platform; name: string; icon: string }[] = [
  { id: 'xhs', name: '小红书', icon: '📕' },
  { id: 'twitter', name: 'Twitter / X', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
];

interface ImageFile {
  file: File;
  preview: string;
  analysis?: {
    compliance: { overallRisk: string; issues: { type: string; severity: string; description: string; action: string }[]; safeToPublish: boolean };
    design: { designScore: number; scrollStopPower: number; feedback: string; topActions: string[]; styleReferences: { name: string; description: string }[] };
  };
  analyzing?: boolean;
}

export default function Home() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['xhs']);
  const [twitterLang, setTwitterLang] = useState<'zh' | 'en'>('en');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<Platform>('xhs');
  const [rewriting, setRewriting] = useState<string | null>(null);
  const [rewriteResult, setRewriteResult] = useState<any>(null);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p)
        ? prev.length > 1 ? prev.filter(x => x !== p) : prev
        : [...prev, p]
    );
  };

  const [isDragging, setIsDragging] = useState(false);
  const [pasteFlash, setPasteFlash] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const addImageFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    const newImages = imageFiles.slice(0, 9 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 9));
  }, [images.length]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        addImageFiles(files);
        setPasteFlash(true);
        setTimeout(() => setPasteFlash(false), 800);
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addImageFiles]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImageFiles(Array.from(e.target.files || []));
    e.target.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImageFiles(files);
  }, [addImageFiles]);

  const removeImage = (idx: number) => {
    setImages(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].preview);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const analyze = useCallback(async () => {
    if (!content.trim() && !title.trim()) return;
    setAnalyzing(true);
    setResults(null);
    setRewriteResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, platforms: selectedPlatforms, twitterLang }),
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        setActiveTab(json.data[0]?.platform || selectedPlatforms[0]);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    }

    // Analyze images in parallel
    if (images.length > 0 && results) {
      const primaryPlatform = selectedPlatforms[0];
      const lang = primaryPlatform === 'xhs' ? 'zh' : primaryPlatform === 'twitter' ? twitterLang : 'en';

      for (let i = 0; i < images.length; i++) {
        setImages(prev => {
          const copy = [...prev];
          if (copy[i]) copy[i] = { ...copy[i], analyzing: true };
          return copy;
        });

        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(images[i].file);
          });

          const mediaType = images[i].file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
          const visionRes = await fetch('/api/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              mediaType,
              platform: primaryPlatform,
              platformName: PLATFORMS.find(p => p.id === primaryPlatform)?.name,
              contentType: 'general',
              title,
              lang,
            }),
          });
          const visionJson = await visionRes.json();
          if (visionJson.success) {
            setImages(prev => {
              const copy = [...prev];
              if (copy[i]) copy[i] = { ...copy[i], analysis: visionJson.data, analyzing: false };
              return copy;
            });
          }
        } catch (err) {
          console.error(`Image ${i} analysis failed:`, err);
          setImages(prev => {
            const copy = [...prev];
            if (copy[i]) copy[i] = { ...copy[i], analyzing: false };
            return copy;
          });
        }
      }
    }

    setAnalyzing(false);
  }, [title, content, selectedPlatforms, twitterLang, images]);

  const handleRewrite = async (mode: 'compliance' | 'algorithm' | 'viral') => {
    if (!results || !activeTab) return;
    const item = results.find((r: any) => r.platform === activeTab);
    if (!item) return;

    setRewriting(mode);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, content,
          platform: item.platform,
          platformName: item.platformName,
          lang: item.language,
          mode,
        }),
      });
      const json = await res.json();
      if (json.success) setRewriteResult({ mode, ...json.data });
    } catch (err) {
      console.error('Rewrite failed:', err);
    }
    setRewriting(null);
  };

  const activeResult = results?.find((r: any) => r.platform === activeTab);
  const isZh = activeResult?.language === 'zh';

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100">
      {/* Header */}
      <header className="text-center pt-16 pb-10 px-4">
        <div className="text-xs font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">SocialFlow v2.0</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          社媒内容 & 视觉智能检测
        </h1>
        <p className="text-slate-400 mt-3 text-base">文案合规 · 配图设计 · 算法适配 · 爆款预测 · 一键改写</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        {/* Platform Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                selectedPlatforms.includes(p.id)
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
              )}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        {/* Twitter Language Toggle */}
        {selectedPlatforms.includes('twitter') && (
          <div className="flex justify-center gap-2 mb-6">
            <span className="text-xs text-slate-500">Twitter 语言：</span>
            {(['zh', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => setTwitterLang(l)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  twitterLang === l ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                )}
              >
                {l === 'zh' ? '中文号' : '英文号'}
              </button>
            ))}
          </div>
        )}

        {/* Input Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-4">
          {/* Title */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                标题 / Title
              </label>
              <span className={cn('text-xs', title.length > 60 ? 'text-red-400' : 'text-slate-500')}>
                {title.length}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入标题（小红书10-20字 / YouTube ≤60字符）"
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                正文 / Content
              </label>
              <span className={cn('text-xs', content.length > 280 && selectedPlatforms.includes('twitter') ? 'text-red-400' : 'text-slate-500')}>
                {content.length}
              </span>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="粘贴要检测的社媒文案..."
              rows={5}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition resize-y"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                配图 / Images（可选，最多9张）
              </label>
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full transition-all duration-300',
                pasteFlash
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-800 text-slate-500'
              )}>
                {pasteFlash ? '✓ 已粘贴' : '⌘V 可直接粘贴'}
              </span>
            </div>
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative rounded-xl border-2 border-dashed p-3 transition-all duration-200',
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-700/50 bg-transparent'
              )}
            >
              {isDragging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-indigo-500/10 backdrop-blur-sm">
                  <div className="text-sm font-medium text-indigo-400">松开即可添加图片</div>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 group">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    {img.analyzing && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {img.analysis && (
                      <div className="absolute top-1 right-1">
                        <span className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                          img.analysis.design.designScore >= 70 ? 'bg-green-500/80 text-white' :
                          img.analysis.design.designScore >= 50 ? 'bg-amber-500/80 text-white' : 'bg-red-500/80 text-white'
                        )}>
                          {img.analysis.design.designScore}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {images.length < 9 && (
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition text-slate-500 hover:text-indigo-400 gap-0.5">
                    <span className="text-2xl leading-none">+</span>
                    <span className="text-[9px]">选取</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
                {images.length === 0 && (
                  <div className="flex-1 flex items-center justify-center py-2 text-xs text-slate-600 select-none">
                    直接粘贴截图 · 拖拽图片到此处 · 或点击 + 选取文件
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyze}
            disabled={analyzing || (!content.trim() && !title.trim())}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                检测中...
              </>
            ) : '🔍 开始全面检测'}
          </button>
        </div>

        {/* Results */}
        {results && results.length > 0 && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Platform Tabs */}
            {results.length > 1 && (
              <div className="flex gap-1 p-1 bg-slate-900/80 rounded-xl mb-4 border border-slate-800">
                {results.map((item: any) => {
                  const dotColor = item.status === 'safe' ? '#22C55E' : item.status === 'warning' ? '#F59E0B' : '#EF4444';
                  return (
                    <button
                      key={item.platform}
                      onClick={() => setActiveTab(item.platform)}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5',
                        activeTab === item.platform
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      )}
                    >
                      {item.platformIcon} {item.platformName}
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                    </button>
                  );
                })}
              </div>
            )}

            {activeResult && (
              <div className="space-y-4">
                {/* Status Banner */}
                {(() => {
                  const badge = statusBadge(activeResult.status, isZh ? 'zh' : 'en');
                  return (
                    <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border', badge.cls)}>
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-sm font-medium">{badge.text}</span>
                    </div>
                  );
                })()}

                {/* Overall Score + Radar */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                        {isZh ? '综合评分' : 'Overall Score'}
                      </div>
                      <div className="text-4xl font-bold" style={{ color: scoreColor(activeResult.overallScore) }}>
                        {activeResult.overallScore}<span className="text-lg text-slate-500">/100</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <ScoreRing score={activeResult.scores.compliance} label={isZh ? '合规' : 'Comply'} size={56} />
                      <ScoreRing score={activeResult.scores.engagement} label={isZh ? '互动' : 'Engage'} size={56} />
                      <ScoreRing score={activeResult.scores.viral} label="Viral" size={56} />
                      <ScoreRing score={activeResult.scores.algorithm} label={isZh ? '算法' : 'Algo'} size={56} />
                    </div>
                  </div>
                  <RadarChart scores={activeResult.scores} lang={isZh ? 'zh' : 'en'} />
                </div>

                {/* Violations */}
                {activeResult.violations.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                      ⚠️ {isZh ? `检测到 ${activeResult.violations.length} 个问题` : `${activeResult.violations.length} Issue(s) Detected`}
                    </h3>
                    <div className="space-y-2">
                      {activeResult.violations.map((v: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border-l-3" style={{ borderLeftColor: v.color, borderLeftWidth: 3 }}>
                          <div>
                            <div className="text-xs font-semibold" style={{ color: v.color }}>{v.name}</div>
                            <div className="text-xs text-slate-400">{isZh ? '触发词' : 'Keyword'}：<span className="text-slate-200 font-mono">{v.keyword}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimizations (Direction → Example → Actions) */}
                {activeResult.optimizations.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                      💡 {isZh ? '优化建议' : 'Optimization Tips'}
                    </h3>
                    <div className="space-y-3">
                      {activeResult.optimizations.map((opt: any, i: number) => {
                        const priBadge: Record<string, string> = {
                          critical: 'bg-red-500/15 text-red-400',
                          high: 'bg-amber-500/15 text-amber-400',
                          medium: 'bg-indigo-500/15 text-indigo-400',
                          low: 'bg-slate-500/15 text-slate-400',
                        };
                        const priLabel: Record<string, string> = isZh
                          ? { critical: '紧急', high: '重要', medium: '建议', low: '可选' }
                          : { critical: 'URGENT', high: 'HIGH', medium: 'TIP', low: 'OPTIONAL' };

                        return (
                          <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase', priBadge[opt.priority])}>{priLabel[opt.priority]}</span>
                              <span className="text-xs font-semibold text-slate-300">{opt.category}</span>
                            </div>
                            {/* 方向 */}
                            <p className="text-sm text-slate-200 mb-2">{opt.direction}</p>
                            {/* 示例 */}
                            {opt.example && (
                              <div className="text-xs text-indigo-300 bg-indigo-500/10 rounded-lg px-3 py-2 mb-2 italic">
                                {opt.example}
                              </div>
                            )}
                            {/* 优化行动清单 */}
                            {opt.actions && opt.actions.length > 0 && (
                              <div className="space-y-1">
                                {opt.actions.map((a: string, j: number) => (
                                  <div key={j} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span className="text-green-400 mt-0.5">✅</span>
                                    <span>{a}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Image Analysis */}
                {images.length > 0 && images.some(img => img.analysis) && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                      🖼️ {isZh ? '配图分析' : 'Image Analysis'}
                    </h3>
                    <div className="space-y-4">
                      {images.map((img, idx) => {
                        if (!img.analysis) return null;
                        const a = img.analysis;
                        return (
                          <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <img src={img.preview} alt="" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <ScoreRing score={a.design.designScore} label={isZh ? '设计分' : 'Design'} size={48} />
                                <ScoreRing score={a.design.scrollStopPower} label={isZh ? '停留力' : 'Stop Power'} size={48} />
                                <span className={cn(
                                  'text-xs font-bold px-2 py-1 rounded-full',
                                  a.compliance.safeToPublish ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                                )}>
                                  {a.compliance.safeToPublish ? (isZh ? '✓ 合规' : '✓ Safe') : (isZh ? '✕ 有风险' : '✕ Risk')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mb-2">{a.design.feedback}</p>
                              {a.compliance.issues.length > 0 && (
                                <div className="mb-2">
                                  {a.compliance.issues.map((issue: any, j: number) => (
                                    <div key={j} className="text-xs text-red-300 mb-1">⚠️ {issue.description} → {issue.action}</div>
                                  ))}
                                </div>
                              )}
                              <div className="space-y-1">
                                {a.design.topActions.map((action: string, j: number) => (
                                  <div key={j} className="flex items-start gap-1.5 text-xs text-slate-400">
                                    <span className="text-indigo-400">→</span>
                                    <span>{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* AI Deep Analysis */}
                {activeResult.aiAnalysis && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">✦ AI {isZh ? '深度分析' : 'Deep Analysis'}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">Claude Haiku 4.5</span>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="text-sm text-slate-200 bg-indigo-500/10 rounded-lg p-3 border-l-3 border-indigo-500" style={{borderLeftWidth:3}}>
                        {activeResult.aiAnalysis.aiInsight}
                      </div>
                      {activeResult.aiAnalysis.rewriteContent && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">✦ AI {isZh ? '改写建议' : 'Rewrite Suggestion'}</div>
                          <div className="bg-slate-800/60 rounded-lg p-4 text-sm text-slate-200 whitespace-pre-wrap">
                            {activeResult.aiAnalysis.rewriteTitle && <div className="font-semibold text-indigo-300 mb-2">{activeResult.aiAnalysis.rewriteTitle}</div>}
                            {activeResult.aiAnalysis.rewriteContent}
                          </div>
                          <button
                            onClick={() => {
                              const text = (activeResult.aiAnalysis.rewriteTitle ? activeResult.aiAnalysis.rewriteTitle + '\n\n' : '') + activeResult.aiAnalysis.rewriteContent;
                              navigator.clipboard.writeText(text);
                            }}
                            className="mt-2 text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition"
                          >
                            📋 {isZh ? '复制改写内容' : 'Copy Rewrite'}
                          </button>
                        </div>
                      )}
                      {activeResult.aiAnalysis.additionalTips?.length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">✦ {isZh ? '额外洞察' : 'Additional Insights'}</div>
                          {activeResult.aiAnalysis.additionalTips.map((tip: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300 py-1.5 border-b border-slate-800 last:border-0">
                              <span className="text-purple-400">◆</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hashtag Suggestions */}
                {activeResult.hashtagSuggestions.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                      🏷️ {isZh ? '推荐标签' : 'Suggested Hashtags'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeResult.hashtagSuggestions.map((h: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => navigator.clipboard.writeText(h)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Viral Formulas */}
                {activeResult.viralFormulas.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                      🚀 {isZh ? '爆文公式参考' : 'Viral Content Formulas'}
                    </h3>
                    <div className="space-y-3">
                      {activeResult.viralFormulas.map((f: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                          <div className="text-xs font-mono font-semibold text-slate-200 mb-1">{f.formula}</div>
                          <div className="text-xs text-indigo-300 italic mb-1">&quot;{f.example}&quot;</div>
                          <div className="text-xs text-slate-500">{f.why}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewrite Buttons */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                    ✍️ {isZh ? '一键智能改写' : 'AI Rewrite'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { mode: 'compliance' as const, label: isZh ? '🛡 合规改写' : '🛡 Compliance Fix', desc: isZh ? '移除违规内容' : 'Remove violations' },
                      { mode: 'algorithm' as const, label: isZh ? '📈 算法优化' : '📈 Algorithm Boost', desc: isZh ? '适配平台算法' : 'Optimize for algorithm' },
                      { mode: 'viral' as const, label: isZh ? '🔥 爆款改写' : '🔥 Viral Rewrite', desc: isZh ? '用爆文公式重写' : 'Apply viral formulas' },
                    ].map(({ mode, label, desc }) => (
                      <button
                        key={mode}
                        onClick={() => handleRewrite(mode)}
                        disabled={!!rewriting}
                        className="flex-1 min-w-[140px] p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-indigo-500 transition text-left disabled:opacity-40"
                      >
                        <div className="text-sm font-medium text-slate-200">
                          {rewriting === mode ? <span className="animate-pulse">...</span> : label}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
                      </button>
                    ))}
                  </div>

                  {rewriteResult && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-indigo-500/20">
                      <div className="text-xs font-bold text-indigo-400 mb-2">
                        {rewriteResult.mode === 'compliance' ? (isZh ? '合规改写结果' : 'Compliance Fix') :
                         rewriteResult.mode === 'algorithm' ? (isZh ? '算法优化结果' : 'Algorithm Optimized') :
                         (isZh ? '爆款改写结果' : 'Viral Rewrite')}
                      </div>
                      {rewriteResult.rewrittenTitle && (
                        <div className="font-semibold text-sm text-slate-200 mb-2">{rewriteResult.rewrittenTitle}</div>
                      )}
                      <div className="text-sm text-slate-300 whitespace-pre-wrap mb-3">{rewriteResult.rewrittenContent}</div>
                      <div className="space-y-1 mb-3">
                        {rewriteResult.changes?.map((c: string, i: number) => (
                          <div key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                            <span className="text-green-400">•</span>{c}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const text = (rewriteResult.rewrittenTitle ? rewriteResult.rewrittenTitle + '\n\n' : '') + rewriteResult.rewrittenContent;
                          navigator.clipboard.writeText(text);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition"
                      >
                        📋 {isZh ? '复制改写结果' : 'Copy Result'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-600">
        SocialFlow v2.0 · Powered by MPChat · 基于平台公开算法研究与 AI 深度分析构建
      </footer>
    </div>
  );
}
