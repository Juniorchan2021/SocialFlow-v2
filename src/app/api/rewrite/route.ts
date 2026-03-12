import { NextRequest, NextResponse } from 'next/server';
import { aiRewrite } from '@/lib/ai-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, platform, platformName, lang, mode, uiLang } = body;

    if (!content || !platform || !mode) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const result = await aiRewrite(
      title || '',
      content,
      platform,
      platformName || platform,
      lang || 'en',
      mode,
      uiLang || 'en',
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'AI 改写不可用（未设置 ANTHROPIC_API_KEY）',
      }, { status: 503 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Rewrite failed:', error);
    return NextResponse.json({ error: '改写失败' }, { status: 500 });
  }
}
