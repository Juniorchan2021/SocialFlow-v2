import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, type ScoreResult } from '@/lib/scoring';
import { aiAnalyzeContent } from '@/lib/ai-client';
import { simulateAlgorithm, type AlgoSimResult } from '@/lib/algorithm-sim';
import { predictViral, type ViralPrediction } from '@/lib/viral-predictor';
import { addHistory, saveReport } from '@/lib/db';
import { nanoid } from 'nanoid';
import type { Platform } from '@/lib/rules';
import { validateAnalyzeRequest, formatValidationErrors } from '@/lib/validation';
import { deepEscape, sanitizeInput } from '@/lib/security';
import { getClientIp, checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. 速率限制检查
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: '请求过于频繁，请15分钟后再试' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // 2. 解析请求体
    const body = await req.json();
    
    // 3. Zod 输入验证
    const validationResult = validateAnalyzeRequest(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: formatValidationErrors(validationResult.error) },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }
    
    const { title = '', content, platforms, twitterLang, uiLang = 'en' } = validationResult.data;

    // 4. 清理输入（额外的安全措施）
    const sanitizedTitle = sanitizeInput(title || '', 200);
    const sanitizedContent = sanitizeInput(content, 10000);

    // 5. 执行分析
    const results: (ScoreResult & {
      aiAnalysis?: unknown;
      algoSim?: AlgoSimResult;
      viralPrediction?: ViralPrediction;
    })[] = platforms.map(p => {
      const result = analyzeContent(sanitizedTitle, sanitizedContent, p as Platform, twitterLang, uiLang);
      const algoSim = simulateAlgorithm(p as Platform, sanitizedTitle, sanitizedContent, result.structure, result.language as 'zh' | 'en', uiLang);
      const viralPrediction = predictViral(p as Platform, sanitizedTitle, sanitizedContent, result.structure, result.contentType, result.language as 'zh' | 'en', uiLang);
      return { ...result, algoSim, viralPrediction };
    });

    await Promise.all(results.map(async (item) => {
      try {
        const violationSummary = item.violations.length > 0
          ? item.violations.map(v => `"${v.keyword}"(${v.level})`).join(', ')
          : 'none';
        item.aiAnalysis = await aiAnalyzeContent(
          sanitizedTitle, sanitizedContent, item.platform, item.platformName,
          item.language as 'zh' | 'en', violationSummary, item.contentType, uiLang,
        );
      } catch { item.aiAnalysis = null; }
    }));

    // 6. 自动保存报告和历史记录
    let reportId: string | undefined;
    try {
      const primary = results[0];
      reportId = nanoid(10);
      saveReport({ 
        id: reportId, 
        platforms, 
        title: sanitizedTitle, 
        content: sanitizedContent, 
        twitterLang, 
        results 
      });
      addHistory({
        reportId,
        platforms,
        title: sanitizedTitle,
        contentPreview: sanitizedContent.slice(0, 100),
        overallScore: primary.overallScore,
        status: primary.status,
      });
    } catch { /* storage is non-critical */ }

    // 7. 对返回数据进行 XSS 转义
    const safeResults = deepEscape(results);

    // 8. 返回安全响应
    return NextResponse.json(
      {
        success: true,
        data: safeResults,
        reportId: reportId || null,
        aiEnabled: !!process.env.ANTHROPIC_API_KEY,
        timestamp: new Date().toISOString(),
      },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json(
      { error: '分析失败' },
      { status: 500 }
    );
  }
}
