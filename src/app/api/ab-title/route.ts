import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, type ScoreResult } from '@/lib/scoring';
import type { Platform } from '@/lib/rules';
import Anthropic from '@anthropic-ai/sdk';

interface TitleScore {
  title: string;
  scores: ScoreResult['scores'];
  overallScore: number;
  hookStrength: number;
  curiosityGap: number;
  emotionalPull: number;
  rank: number;
}

function scoreTitleDimensions(title: string, content: string, platform: Platform, twitterLang?: 'zh' | 'en', uiLang?: 'zh' | 'en') {
  const result = analyzeContent(title, content, platform, twitterLang, uiLang);
  const lower = title.toLowerCase();

  let hookStrength = 0;
  if (result.structure.hasHook) hookStrength += 35;
  if (result.structure.titleHasNumber) hookStrength += 25;
  if (/[!！🔥💥⚡❤️]/.test(title)) hookStrength += 15;
  if (/\?|？/.test(title)) hookStrength += 15;
  if (title.length >= 8 && title.length <= 60) hookStrength += 10;
  hookStrength = Math.min(100, hookStrength);

  let curiosityGap = 0;
  const gapPatterns = /这个|真相|秘密|没想到|居然|原来|secret|truth|nobody|actually|surprising|turns out/i;
  if (gapPatterns.test(lower)) curiosityGap += 40;
  if (result.structure.titleHasNumber) curiosityGap += 20;
  if (/\.{3}|…/.test(title)) curiosityGap += 20;
  if (/\?|？/.test(title)) curiosityGap += 20;
  curiosityGap = Math.min(100, curiosityGap);

  let emotionalPull = 0;
  const emotionZh = /震惊|救命|绝了|离谱|太好了|宝藏|亲测|必看|求求|崩溃/;
  const emotionEn = /\b(amazing|incredible|shocking|insane|mind.?blow|game.?chang|life.?chang|must.?see|can't believe)\b/i;
  if (emotionZh.test(title) || emotionEn.test(title)) emotionalPull += 50;
  if (/[!！]{1,}/.test(title)) emotionalPull += 20;
  if (/🔥|💥|⚡|😱|🤯|💰/.test(title)) emotionalPull += 15;
  if (result.structure.hasHook) emotionalPull += 15;
  emotionalPull = Math.min(100, emotionalPull);

  return { scores: result.scores, overallScore: result.overallScore, hookStrength, curiosityGap, emotionalPull };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titles, content, platform, twitterLang, uiLang } = body as {
      titles: string[];
      content: string;
      platform: Platform;
      twitterLang?: 'zh' | 'en';
      uiLang?: 'zh' | 'en';
    };

    if (!titles || titles.length < 2 || !content || !platform) {
      return NextResponse.json({ error: '需要至少2个标题进行对比' }, { status: 400 });
    }

    const titleScores: TitleScore[] = titles.map(title => {
      const dims = scoreTitleDimensions(title, content, platform, twitterLang, uiLang);
      return { title, ...dims, rank: 0 };
    });

    const composite = (t: TitleScore) => t.overallScore * 0.4 + t.hookStrength * 0.25 + t.curiosityGap * 0.2 + t.emotionalPull * 0.15;
    titleScores.sort((a, b) => composite(b) - composite(a));
    titleScores.forEach((t, i) => { t.rank = i + 1; });

    let aiTitle: string | null = null;
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const lang = platform === 'xhs' ? 'zh' : platform === 'twitter' ? (twitterLang || 'en') : 'en';
        const prompt = lang === 'zh'
          ? `你是${platform === 'xhs' ? '小红书' : 'Twitter'}标题优化专家。分析这些标题：\n${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n基于最佳标题的优点，生成一个更好的标题。仅返回标题文字，不要加任何解释。`
          : `You're a ${platform} title optimization expert. Analyze these titles:\n${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nGenerate one superior title combining the best elements. Return ONLY the title text, no explanation.`;
        const msg = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }],
        });
        aiTitle = (msg.content[0] as { text: string }).text.trim().replace(/^["'""]|["'""]$/g, '');
      } catch { /* AI title generation is optional */ }
    }

    let aiTitleScore: TitleScore | null = null;
    if (aiTitle) {
      const dims = scoreTitleDimensions(aiTitle, content, platform, twitterLang, uiLang);
      aiTitleScore = { title: aiTitle, ...dims, rank: 0 };
    }

    return NextResponse.json({
      success: true,
      rankings: titleScores,
      aiSuggestion: aiTitleScore,
    });
  } catch (error) {
    console.error('A/B title test failed:', error);
    return NextResponse.json({ error: 'A/B测试失败' }, { status: 500 });
  }
}
