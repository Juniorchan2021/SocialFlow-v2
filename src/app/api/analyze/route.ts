import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, type ScoreResult } from '@/lib/scoring';
import { aiAnalyzeContent } from '@/lib/ai-client';
import type { Platform } from '@/lib/rules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', content, platforms, twitterLang } = body as {
      title?: string;
      content: string;
      platforms: Platform[];
      twitterLang?: 'zh' | 'en';
    };

    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    if ((title?.length || 0) > 5000 || content.length > 5000) {
      return NextResponse.json({ error: '内容超过长度限制（最多5000字符）' }, { status: 400 });
    }

    const results: (ScoreResult & { aiAnalysis?: unknown })[] = platforms.map(p =>
      analyzeContent(title, content, p, twitterLang)
    );

    // AI deep analysis in parallel
    await Promise.all(results.map(async (item) => {
      const violationSummary = item.violations.length > 0
        ? item.violations.map(v => `"${v.keyword}"(${v.level})`).join(', ')
        : 'none';
      item.aiAnalysis = await aiAnalyzeContent(
        title, content, item.platform, item.platformName,
        item.language as 'zh' | 'en', violationSummary, item.contentType,
      );
    }));

    return NextResponse.json({
      success: true,
      data: results,
      aiEnabled: !!process.env.ANTHROPIC_API_KEY,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json({ error: '分析失败' }, { status: 500 });
  }
}
