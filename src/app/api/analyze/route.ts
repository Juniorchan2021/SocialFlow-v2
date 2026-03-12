import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, type ScoreResult } from '@/lib/scoring';
import { aiAnalyzeContent } from '@/lib/ai-client';
import { simulateAlgorithm, type AlgoSimResult } from '@/lib/algorithm-sim';
import { predictViral, type ViralPrediction } from '@/lib/viral-predictor';
import { addHistory, saveReport } from '@/lib/db';
import { nanoid } from 'nanoid';
import type { Platform } from '@/lib/rules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', content, platforms, twitterLang, uiLang = 'en' } = body as {
      title?: string;
      content: string;
      platforms: Platform[];
      twitterLang?: 'zh' | 'en';
      uiLang?: 'zh' | 'en';
    };

    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    if ((title?.length || 0) > 5000 || content.length > 5000) {
      return NextResponse.json({ error: '内容超过长度限制（最多5000字符）' }, { status: 400 });
    }

    const results: (ScoreResult & {
      aiAnalysis?: unknown;
      algoSim?: AlgoSimResult;
      viralPrediction?: ViralPrediction;
    })[] = platforms.map(p => {
      const result = analyzeContent(title, content, p, twitterLang, uiLang);
      const algoSim = simulateAlgorithm(p, title, content, result.structure, result.language as 'zh' | 'en', uiLang);
      const viralPrediction = predictViral(p, title, content, result.structure, result.contentType, result.language as 'zh' | 'en', uiLang);
      return { ...result, algoSim, viralPrediction };
    });

    await Promise.all(results.map(async (item) => {
      try {
        const violationSummary = item.violations.length > 0
          ? item.violations.map(v => `"${v.keyword}"(${v.level})`).join(', ')
          : 'none';
        item.aiAnalysis = await aiAnalyzeContent(
          title, content, item.platform, item.platformName,
          item.language as 'zh' | 'en', violationSummary, item.contentType, uiLang,
        );
      } catch { item.aiAnalysis = null; }
    }));

    // Auto-save report + history so every analysis is retrievable
    let reportId: string | undefined;
    try {
      const primary = results[0];
      reportId = nanoid(10);
      saveReport({ id: reportId, platforms, title: title || '', content, twitterLang, results });
      addHistory({
        reportId,
        platforms,
        title: title || '',
        contentPreview: content.slice(0, 100),
        overallScore: primary.overallScore,
        status: primary.status,
      });
    } catch { /* storage is non-critical */ }

    return NextResponse.json({
      success: true,
      data: results,
      reportId: reportId || null,
      aiEnabled: !!process.env.ANTHROPIC_API_KEY,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json({ error: '分析失败' }, { status: 500 });
  }
}
