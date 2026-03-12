'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, ArrowRight, Share2, Download, Zap, Shield, TrendingUp, Flame } from 'lucide-react';
import ScoreRing from '@/components/ScoreRing';
import { cn, statusBadge, scoreColor } from '@/lib/utils';

const RadarChart = dynamic(() => import('@/components/RadarChart'), { ssr: false });

type Platform = 'xhs' | 'twitter' | 'facebook' | 'instagram' | 'youtube';

const PLATFORMS: { id: Platform; name: string; icon: string }[] = [
  { id: 'xhs', name: '小红书', icon: '📕' },
  { id: 'twitter', name: 'Twitter', icon: '𝕏' },
  { id: 'facebook', name: 'Facebook', icon: 'f' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'youtube', name: 'YouTube', icon: '▶' },
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
  const [abMode, setAbMode] = useState(false);
  const [altTitles, setAltTitles] = useState(['', '']);
  const [abResults, setAbResults] = useState<any>(null);
  const [abLoading, setAbLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.length > 1 ? prev.filter(x => x !== p) : prev : [...prev, p]
    );
  };

  const [isDragging, setIsDragging] = useState(false);
  const [pasteFlash, setPasteFlash] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const addImageFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    const newImages = imageFiles.slice(0, 9 - images.length).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages].slice(0, 9));
  }, [images.length]);

  useEffect(() => {
    return () => { images.forEach(img => URL.revokeObjectURL(img.preview)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) { const f = items[i].getAsFile(); if (f) files.push(f); }
      }
      if (files.length > 0) { e.preventDefault(); addImageFiles(files); setPasteFlash(true); setTimeout(() => setPasteFlash(false), 800); }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addImageFiles]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { addImageFiles(Array.from(e.target.files || [])); e.target.value = ''; };
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); addImageFiles(Array.from(e.dataTransfer.files)); }, [addImageFiles]);
  const removeImage = (idx: number) => { setImages(prev => { const c = [...prev]; URL.revokeObjectURL(c[idx].preview); c.splice(idx, 1); return c; }); };

  const analyze = useCallback(async () => {
    if (!content.trim() && !title.trim()) return;
    setAnalyzing(true); setResults(null); setRewriteResult(null);
    let freshResults: any[] | null = null;
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, platforms: selectedPlatforms, twitterLang }) });
      const json = await res.json();
      if (json.success) { freshResults = json.data; setResults(json.data); setActiveTab(json.data[0]?.platform || selectedPlatforms[0]); }
    } catch (err) { console.error('Analysis failed:', err); }
    if (images.length > 0 && freshResults) {
      const pp = selectedPlatforms[0]; const lang = pp === 'xhs' ? 'zh' : pp === 'twitter' ? twitterLang : 'en';
      await Promise.all(images.map(async (img, i) => {
        setImages(prev => { const c = [...prev]; if (c[i]) c[i] = { ...c[i], analyzing: true }; return c; });
        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => { reader.onload = () => resolve((reader.result as string).split(',')[1]); reader.onerror = () => reject(reader.error); reader.readAsDataURL(img.file); });
          const vr = await fetch('/api/vision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: base64, mediaType: img.file.type, platform: pp, platformName: PLATFORMS.find(p => p.id === pp)?.name, contentType: 'general', title, lang }) });
          const vj = await vr.json();
          if (vj.success) setImages(prev => { const c = [...prev]; if (c[i]) c[i] = { ...c[i], analysis: vj.data, analyzing: false }; return c; });
        } catch { setImages(prev => { const c = [...prev]; if (c[i]) c[i] = { ...c[i], analyzing: false }; return c; }); }
      }));
    }
    setAnalyzing(false);
  }, [title, content, selectedPlatforms, twitterLang, images]);

  const handleRewrite = async (mode: 'compliance' | 'algorithm' | 'viral') => {
    if (!results || !activeTab) return;
    const item = results.find((r: any) => r.platform === activeTab); if (!item) return;
    setRewriting(mode);
    try { const res = await fetch('/api/rewrite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, platform: item.platform, platformName: item.platformName, lang: item.language, mode }) }); const json = await res.json(); if (json.success) setRewriteResult({ mode, ...json.data }); } catch (err) { console.error('Rewrite failed:', err); }
    setRewriting(null);
  };

  const handleABTest = useCallback(async () => {
    const titles = [title, ...altTitles].filter(t => t.trim()); if (titles.length < 2 || !content.trim()) return;
    setAbLoading(true);
    try { const res = await fetch('/api/ab-title', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titles, content, platform: selectedPlatforms[0], twitterLang }) }); const json = await res.json(); if (json.success) setAbResults(json); } catch {}
    setAbLoading(false);
  }, [title, altTitles, content, selectedPlatforms, twitterLang]);

  const handleShareReport = useCallback(async () => {
    if (!results) return; setSharing(true);
    try { const res = await fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platforms: selectedPlatforms, title, content, twitterLang, results }) }); const json = await res.json(); if (json.success) { setShareUrl(json.reportUrl); try { await navigator.clipboard.writeText(json.reportUrl); } catch {} } } catch {}
    setSharing(false);
  }, [results, selectedPlatforms, title, content, twitterLang]);

  const activeResult = results?.find((r: any) => r.platform === activeTab);
  const isZh = activeResult?.language === 'zh';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="text-center pt-28 pb-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.04em] text-white leading-[1.1]">
            Create & Check
          </h1>
          <p className="text-zinc-500 mt-4 text-lg tracking-tight">
            撰写内容，AI 全维度实时检测 · 5 平台 · 8 维评分 · 配图分析
          </p>
        </motion.div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 pb-24">
        {/* ════ INPUT SECTION ══════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-elevated p-8 mb-8">

          {/* Platform Selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)}
                className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                  selectedPlatforms.includes(p.id)
                    ? 'bg-white/[0.08] border-white/[0.15] text-white'
                    : 'bg-transparent border-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.1]')}>
                <span className="text-sm">{p.icon}</span> {p.name}
              </button>
            ))}
            {selectedPlatforms.includes('twitter') && (
              <>
                <div className="h-8 w-px bg-white/[0.06] mx-1 self-center" />
                {(['zh', 'en'] as const).map(l => (
                  <button key={l} onClick={() => setTwitterLang(l)}
                    className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      twitterLang === l ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-zinc-500 hover:text-zinc-300')}>
                    {l === 'zh' ? '中文号' : 'EN'}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Title Input — Borderless "Editor" */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="section-label">Title</span>
              <span className={cn('text-[10px] font-mono tabular-nums', title.length > 60 ? 'text-red-400' : 'text-zinc-600')}>{title.length}</span>
            </div>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Enter a captivating title..."
              className="input-clean text-xl font-semibold border-b border-white/[0.04] pb-3 focus:border-violet-500/40 transition-colors" />
          </div>

          {/* A/B Title Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => { setAbMode(!abMode); setAbResults(null); }}
              className={cn('text-[10px] px-3 py-1 rounded-full font-semibold transition-all border',
                abMode ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'border-white/[0.06] text-zinc-600 hover:text-zinc-400')}>
              {abMode ? '✓ A/B Test' : '+ A/B Title Test'}
            </button>
          </div>
          <AnimatePresence>
            {abMode && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden mb-6">
                <div className="space-y-2">
                  {altTitles.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-600 w-5 text-right">#{i + 2}</span>
                      <input type="text" value={t} onChange={e => { const n = [...altTitles]; n[i] = e.target.value; setAltTitles(n); }}
                        placeholder={`Alternative title ${i + 2}`}
                        className="input-bordered flex-1 px-3 py-2 text-sm" />
                    </div>
                  ))}
                  <button onClick={handleABTest} disabled={abLoading || !content.trim() || altTitles.every(t => !t.trim())}
                    className="btn-ghost w-full py-2 text-xs font-semibold disabled:opacity-30">
                    {abLoading ? 'Analyzing...' : 'Compare Titles'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content — Clean textarea */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="section-label">Content</span>
              <span className={cn('text-[10px] font-mono tabular-nums', content.length > 280 && selectedPlatforms.includes('twitter') ? 'text-red-400' : 'text-zinc-600')}>{content.length}</span>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Start writing your story here..."
              rows={6}
              className="input-clean text-[15px] leading-relaxed resize-y min-h-[160px]" />
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="section-label">Images</span>
              <span className={cn('text-[9px] px-2 py-0.5 rounded-full font-medium transition-all',
                pasteFlash ? 'bg-green-500/15 text-green-400' : 'bg-white/[0.03] text-zinc-600')}>
                {pasteFlash ? '✓ Pasted' : '⌘V paste · drag · click'}
              </span>
            </div>
            <div ref={dropRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={cn('relative rounded-xl border border-dashed p-3 transition-all duration-200',
                isDragging ? 'border-violet-500/50 bg-violet-500/[0.03]' : 'border-white/[0.06]',
                pasteFlash && 'paste-flash')}>
              {isDragging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-violet-500/[0.05] backdrop-blur-sm">
                  <Upload size={20} className="text-violet-400 mr-2" />
                  <span className="text-sm font-medium text-violet-400">Drop to add</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2.5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-white/[0.06] group">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    {img.analyzing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" /></div>}
                    {img.analysis && <div className="absolute top-1 right-1"><span className={cn('text-[9px] font-bold px-1 py-0.5 rounded', img.analysis.design.designScore >= 70 ? 'bg-green-500/80 text-white' : img.analysis.design.designScore >= 50 ? 'bg-amber-500/80 text-white' : 'bg-red-500/80 text-white')}>{img.analysis.design.designScore}</span></div>}
                    <button onClick={() => removeImage(idx)} className="absolute top-1 left-1 w-4 h-4 bg-black/80 rounded-full text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}
                {images.length < 9 && (
                  <label className="w-[72px] h-[72px] rounded-lg border border-dashed border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/[0.02] transition text-zinc-600 hover:text-violet-400">
                    <Upload size={16} />
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
                {images.length === 0 && <div className="flex-1 flex items-center justify-center py-3 text-xs text-zinc-700 select-none">Paste screenshots · Drag images · Click +</div>}
              </div>
            </div>
          </div>

          {/* Analyze Button — Vercel Style (White on black) */}
          <button onClick={analyze} disabled={analyzing || (!content.trim() && !title.trim())}
            className={cn('btn-primary w-full py-4 text-sm flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed',
              analyzing && 'animate-scan')}>
            {analyzing ? (
              <><div className="w-4 h-4 border-2 border-zinc-800/40 border-t-zinc-800 rounded-full animate-spin" />Intelligence Scan...</>
            ) : (
              <><Sparkles size={16} />Run Intelligence Scan</>
            )}
          </button>
        </motion.div>

        {/* ════ RESULTS SECTION ══════════════════════════════════════ */}
        <AnimatePresence>
          {results && results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring', bounce: 0.15 }}>

              {/* Platform Tabs */}
              {results.length > 1 && (
                <div className="flex gap-1 p-1 glass rounded-full mb-6 w-fit mx-auto">
                  {results.map((item: any) => {
                    const dotColor = item.status === 'safe' ? '#22C55E' : item.status === 'warning' ? '#F59E0B' : '#EF4444';
                    return (
                      <button key={item.platform} onClick={() => setActiveTab(item.platform)}
                        className={cn('px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5',
                          activeTab === item.platform ? 'bg-white/[0.1] text-white' : 'text-zinc-500 hover:text-zinc-300')}>
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
                  {(() => { const b = statusBadge(activeResult.status, isZh ? 'zh' : 'en'); return (
                    <div className={cn('flex items-center gap-3 px-5 py-3.5 rounded-2xl border', b.cls)}>
                      <span className="text-lg">{b.icon}</span><span className="text-sm font-medium">{b.text}</span>
                    </div>
                  ); })()}

                  {/* Score Dashboard — 2-column grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Score + Rings */}
                    <div className="glass-elevated p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="section-label mb-2">{isZh ? '综合评分' : 'Overall Score'}</div>
                          <div className="text-5xl font-extrabold tracking-tight score-enter" style={{ color: scoreColor(activeResult.overallScore) }}>
                            {activeResult.overallScore}<span className="text-xl font-normal text-zinc-600">/100</span>
                          </div>
                        </div>
                        {/* Algo grade */}
                        {activeResult.algoSim && (
                          <div className={cn('px-3 py-1.5 rounded-lg text-sm font-bold tracking-tight',
                            `grade-${activeResult.algoSim.grade.toLowerCase()}`)}>
                            {activeResult.algoSim.grade}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <ScoreRing score={activeResult.scores.compliance} label={isZh ? '合规' : 'Comply'} size={56} />
                        <ScoreRing score={activeResult.scores.engagement} label={isZh ? '互动' : 'Engage'} size={56} />
                        <ScoreRing score={activeResult.scores.viral} label="Viral" size={56} />
                        <ScoreRing score={activeResult.scores.algorithm} label={isZh ? '算法' : 'Algo'} size={56} />
                      </div>
                    </div>

                    {/* Right: Radar Chart */}
                    <div className="glass-elevated p-6 flex items-center justify-center">
                      <RadarChart scores={activeResult.scores} lang={isZh ? 'zh' : 'en'} />
                    </div>
                  </div>

                  {/* Viral Prediction + Algo Sim — 2-column */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Viral */}
                    {activeResult.viralPrediction && (
                      <div className="glass-elevated p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Flame size={14} className="text-orange-400" />
                          <span className="section-label">{isZh ? '爆款预测' : 'Viral Prediction'}</span>
                        </div>
                        <div className="flex items-center gap-4 mb-5">
                          <div className={cn('text-4xl font-extrabold tracking-tight',
                            activeResult.viralPrediction.probability === 'high' ? 'text-green-400' : activeResult.viralPrediction.probability === 'medium' ? 'text-amber-400' : 'text-zinc-500')}>
                            {activeResult.viralPrediction.percentage}%
                          </div>
                          <span className={cn('text-xs font-bold px-3 py-1 rounded-full',
                            activeResult.viralPrediction.probability === 'high' ? 'grade-s' : activeResult.viralPrediction.probability === 'medium' ? 'grade-b' : 'grade-d')}>
                            {activeResult.viralPrediction.probability === 'high' ? (isZh ? '高概率' : 'High') : activeResult.viralPrediction.probability === 'medium' ? (isZh ? '有潜力' : 'Medium') : (isZh ? '需提升' : 'Low')}
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {activeResult.viralPrediction.factors.map((f: any, i: number) => (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1"><span className="text-[11px] text-zinc-400">{f.name}</span><span className="text-[10px] font-mono text-zinc-600">{f.score}</span></div>
                              <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden progress-bar">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${f.score}%`, background: f.score >= 70 ? 'linear-gradient(90deg, #22C55E, #4ADE80)' : f.score >= 45 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Algo Sim */}
                    {activeResult.algoSim && (
                      <div className="glass-elevated p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Zap size={14} className="text-violet-400" />
                          <span className="section-label">{activeResult.algoSim.modelName}</span>
                        </div>
                        <div className="text-xs text-violet-300/80 bg-violet-500/[0.06] rounded-lg px-3 py-2 mb-4 border border-violet-500/10">
                          {activeResult.algoSim.prediction}
                        </div>
                        <div className="space-y-2.5">
                          {activeResult.algoSim.signals.map((sig: any, i: number) => (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] text-zinc-400 truncate">{sig.name}</span>
                                <span className="text-[10px] font-mono text-zinc-600 shrink-0">{sig.score}/{sig.maxScore}</span>
                              </div>
                              <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden progress-bar">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(sig.score / sig.maxScore) * 100}%`, background: sig.score >= sig.maxScore * 0.7 ? 'linear-gradient(90deg, #8B5CF6, #A78BFA)' : sig.score >= sig.maxScore * 0.4 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Violations */}
                  {activeResult.violations.length > 0 && (
                    <div className="glass-elevated p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield size={14} className="text-red-400" />
                        <span className="section-label">{isZh ? `${activeResult.violations.length} 个违规` : `${activeResult.violations.length} Violation(s)`}</span>
                      </div>
                      <div className="space-y-2">
                        {activeResult.violations.map((v: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border-l-[3px]" style={{ borderLeftColor: v.color }}>
                            <div><div className="text-xs font-semibold" style={{ color: v.color }}>{v.name}</div><div className="text-[11px] text-zinc-500">{isZh ? '触发词' : 'Keyword'}：<span className="text-zinc-300 font-mono">{v.keyword}</span></div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optimizations — Stepped cards */}
                  {activeResult.optimizations.length > 0 && (
                    <div className="glass-elevated p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={14} className="text-indigo-400" />
                        <span className="section-label">{isZh ? '优化建议' : 'Optimizations'}</span>
                      </div>
                      <div className="space-y-3">
                        {activeResult.optimizations.map((opt: any, i: number) => {
                          const priCls: Record<string, string> = { critical: 'grade-c', high: 'grade-b', medium: 'grade-a', low: 'grade-d' };
                          const priLbl: Record<string, string> = isZh ? { critical: '紧急', high: '重要', medium: '建议', low: '可选' } : { critical: 'URGENT', high: 'HIGH', medium: 'TIP', low: 'OPT' };
                          return (
                            <div key={i} className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-md uppercase', priCls[opt.priority])}>{priLbl[opt.priority]}</span>
                                <span className="text-[11px] font-semibold text-zinc-300">{opt.category}</span>
                              </div>
                              <p className="text-sm text-zinc-200 mb-2 leading-relaxed">{opt.direction}</p>
                              {opt.example && (
                                <div className="text-xs text-violet-300/80 bg-violet-500/[0.06] rounded-lg px-3 py-2 mb-2 border border-violet-500/10 font-medium italic">
                                  {opt.example}
                                </div>
                              )}
                              {opt.actions?.length > 0 && (
                                <div className="space-y-1">{opt.actions.map((a: string, j: number) => (
                                  <div key={j} className="flex items-start gap-2 text-[11px] text-zinc-400"><span className="text-green-500 mt-0.5 shrink-0">✓</span><span>{a}</span></div>
                                ))}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* A/B Title Results */}
                  {abResults && (
                    <div className="glass-elevated p-6">
                      <span className="section-label mb-4 block">{isZh ? 'A/B 标题对比' : 'A/B Title Results'}</span>
                      <div className="space-y-2">
                        {abResults.rankings.map((r: any) => (
                          <div key={r.rank} className={cn('p-3 rounded-xl border transition-colors', r.rank === 1 ? 'bg-green-500/[0.03] border-green-500/15' : 'bg-white/[0.01] border-white/[0.04]')}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-md', r.rank === 1 ? 'grade-s' : 'grade-d')}>#{r.rank}</span>
                              <span className="text-sm text-zinc-200 flex-1 truncate">{r.title}</span>
                              <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(r.overallScore) }}>{r.overallScore}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px]">
                              <div className="text-center"><div className="text-zinc-600">Hook</div><div className="font-bold text-zinc-300 tabular-nums">{r.hookStrength}</div></div>
                              <div className="text-center"><div className="text-zinc-600">Curiosity</div><div className="font-bold text-zinc-300 tabular-nums">{r.curiosityGap}</div></div>
                              <div className="text-center"><div className="text-zinc-600">Emotion</div><div className="font-bold text-zinc-300 tabular-nums">{r.emotionalPull}</div></div>
                            </div>
                          </div>
                        ))}
                        {abResults.aiSuggestion && (
                          <div className="p-3 rounded-xl bg-violet-500/[0.03] border border-violet-500/15">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md grade-a">✦ AI</span>
                              <span className="text-sm text-violet-300 flex-1">{abResults.aiSuggestion.title}</span>
                              <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(abResults.aiSuggestion.overallScore) }}>{abResults.aiSuggestion.overallScore}</span>
                            </div>
                            <button onClick={() => setTitle(abResults.aiSuggestion.title)} className="btn-ghost text-[10px] px-3 py-1">{isZh ? '采用此标题' : 'Use this title'}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Analysis */}
                  {images.some(img => img.analysis) && (
                    <div className="glass-elevated p-6">
                      <span className="section-label mb-4 block">{isZh ? '配图分析' : 'Image Analysis'}</span>
                      <div className="space-y-3">
                        {images.map((img, idx) => { if (!img.analysis) return null; const a = img.analysis; return (
                          <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                            <img src={img.preview} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <ScoreRing score={a.design.designScore} label={isZh ? '设计' : 'Design'} size={44} />
                                <ScoreRing score={a.design.scrollStopPower} label="Stop" size={44} />
                                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', a.compliance.safeToPublish ? 'grade-s' : 'grade-c')}>
                                  {a.compliance.safeToPublish ? '✓ Safe' : '✕ Risk'}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 mb-1.5">{a.design.feedback}</p>
                              {a.design.topActions.slice(0, 2).map((action: string, j: number) => (
                                <div key={j} className="flex items-start gap-1.5 text-[10px] text-zinc-500"><ArrowRight size={10} className="text-violet-400 mt-0.5 shrink-0" /><span>{action}</span></div>
                              ))}
                            </div>
                          </div>
                        ); })}
                      </div>
                    </div>
                  )}

                  {/* AI Deep Analysis */}
                  {activeResult.aiAnalysis && (
                    <div className="glass-elevated overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/10 px-6 py-3 flex items-center justify-between border-b border-white/[0.04]">
                        <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5"><Sparkles size={12} /> AI Deep Analysis</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Claude Haiku 4.5</span>
                      </div>
                      <div className="p-6 space-y-4">
                        <p className="text-sm text-zinc-200 bg-violet-500/[0.05] rounded-lg p-3 border-l-[3px] border-violet-500 leading-relaxed">{activeResult.aiAnalysis.aiInsight}</p>
                        {activeResult.aiAnalysis.rewriteContent && (
                          <div>
                            <span className="section-label mb-2 block">AI Rewrite</span>
                            <div className="bg-white/[0.02] rounded-xl p-4 text-sm text-zinc-200 whitespace-pre-wrap border border-white/[0.04]">
                              {activeResult.aiAnalysis.rewriteTitle && <div className="font-semibold text-violet-300 mb-2">{activeResult.aiAnalysis.rewriteTitle}</div>}
                              {activeResult.aiAnalysis.rewriteContent}
                            </div>
                            <button onClick={() => navigator.clipboard.writeText((activeResult.aiAnalysis.rewriteTitle || '') + '\n\n' + activeResult.aiAnalysis.rewriteContent).catch(() => {})}
                              className="btn-ghost text-[10px] px-3 py-1 mt-2">📋 Copy</button>
                          </div>
                        )}
                        {activeResult.aiAnalysis.additionalTips?.length > 0 && (
                          <div>{activeResult.aiAnalysis.additionalTips.map((tip: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 py-1.5 border-b border-white/[0.03] last:border-0"><span className="text-violet-400">◆</span><span>{tip}</span></div>
                          ))}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags + Formulas — 2-col */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {activeResult.hashtagSuggestions.length > 0 && (
                      <div className="glass-elevated p-6">
                        <span className="section-label mb-3 block">{isZh ? '推荐标签' : 'Hashtags'}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeResult.hashtagSuggestions.map((h: string, i: number) => (
                            <button key={i} onClick={() => navigator.clipboard.writeText(h).catch(() => {})}
                              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-violet-500/[0.06] text-violet-300 border border-violet-500/10 hover:bg-violet-500/[0.12] transition">{h}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeResult.viralFormulas.length > 0 && (
                      <div className="glass-elevated p-6">
                        <span className="section-label mb-3 block">{isZh ? '爆文公式' : 'Viral Formulas'}</span>
                        <div className="space-y-2">
                          {activeResult.viralFormulas.map((f: any, i: number) => (
                            <div key={i} className="p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                              <div className="text-[11px] font-mono font-semibold text-zinc-200 mb-0.5">{f.formula}</div>
                              <div className="text-[10px] text-violet-300/70 italic">&quot;{f.example}&quot;</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rewrite Buttons */}
                  <div className="glass-elevated p-6">
                    <span className="section-label mb-4 block">{isZh ? '智能改写' : 'AI Rewrite'}</span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { mode: 'compliance' as const, icon: Shield, label: isZh ? '合规改写' : 'Compliance', desc: isZh ? '移除违规' : 'Fix violations' },
                        { mode: 'algorithm' as const, icon: Zap, label: isZh ? '算法优化' : 'Algorithm', desc: isZh ? '提升权重' : 'Boost ranking' },
                        { mode: 'viral' as const, icon: Flame, label: isZh ? '爆款改写' : 'Viral', desc: isZh ? '用爆文公式' : 'Apply formulas' },
                      ].map(({ mode, icon: Icon, label, desc }) => (
                        <button key={mode} onClick={() => handleRewrite(mode)} disabled={!!rewriting}
                          className="btn-ghost p-4 text-left disabled:opacity-30 group">
                          <Icon size={16} className="text-zinc-500 group-hover:text-violet-400 transition mb-2" />
                          <div className="text-sm font-medium text-zinc-200">{rewriting === mode ? '...' : label}</div>
                          <div className="text-[10px] text-zinc-600 mt-0.5">{desc}</div>
                        </button>
                      ))}
                    </div>
                    {rewriteResult && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-violet-500/10">
                        {rewriteResult.rewrittenTitle && <div className="font-semibold text-sm text-zinc-200 mb-2">{rewriteResult.rewrittenTitle}</div>}
                        <div className="text-sm text-zinc-300 whitespace-pre-wrap mb-3">{rewriteResult.rewrittenContent}</div>
                        {rewriteResult.changes?.map((c: string, i: number) => <div key={i} className="text-[10px] text-zinc-500 flex items-start gap-1.5 mb-0.5"><span className="text-green-500">•</span>{c}</div>)}
                        <button onClick={() => navigator.clipboard.writeText((rewriteResult.rewrittenTitle || '') + '\n\n' + rewriteResult.rewrittenContent).catch(() => {})}
                          className="btn-ghost text-[10px] px-3 py-1 mt-3">📋 {isZh ? '复制' : 'Copy'}</button>
                      </motion.div>
                    )}
                  </div>

                  {/* Share */}
                  <div className="glass-elevated p-8 text-center">
                    <p className="text-sm text-zinc-400 mb-4">{isZh ? '生成可分享的检测报告' : 'Generate a shareable report'}</p>
                    <button onClick={handleShareReport} disabled={sharing}
                      className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2 disabled:opacity-30">
                      {sharing ? 'Generating...' : <><Share2 size={14} /> Share Report</>}
                    </button>
                    {shareUrl && (
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-[11px] text-green-400">✓ Link copied</span>
                        <a href={shareUrl} target="_blank" rel="noopener" className="text-[11px] text-violet-400 underline underline-offset-2 hover:text-violet-300">Open</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viral boost tips — shown below results */}
        {activeResult?.viralPrediction?.boostTips?.length > 0 && (
          <div className="mt-4 glass-elevated p-6">
            <div className="flex items-center gap-2 mb-3"><Zap size={14} className="text-amber-400" /><span className="section-label">{isZh ? '提升建议' : 'Boost Tips'}</span></div>
            {activeResult.viralPrediction.boostTips.map((tip: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 py-1.5"><span className="text-amber-400">⚡</span><span>{tip}</span></div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-10 text-[11px] text-zinc-700 tracking-wide">
        SocialFlow v2.0 · Powered by MPChat
      </footer>
    </div>
  );
}
