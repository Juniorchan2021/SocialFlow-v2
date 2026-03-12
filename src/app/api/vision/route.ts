import { NextRequest, NextResponse } from 'next/server';
import { aiAnalyzeImage } from '@/lib/ai-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mediaType, platform, platformName, contentType, title, lang, uiLang } = body;

    if (!imageBase64 || !platform) {
      return NextResponse.json({ error: '缺少图片数据或平台参数' }, { status: 400 });
    }

    const result = await aiAnalyzeImage(
      imageBase64,
      mediaType || 'image/jpeg',
      platform,
      platformName || platform,
      contentType || 'general',
      title || '',
      lang || 'en',
      uiLang || 'en',
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'AI 图片分析不可用（未设置 ANTHROPIC_API_KEY）',
      }, { status: 503 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Vision analysis failed:', error);
    return NextResponse.json({ error: '图片分析失败' }, { status: 500 });
  }
}
