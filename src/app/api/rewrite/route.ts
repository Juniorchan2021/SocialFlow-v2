import { NextRequest, NextResponse } from 'next/server';
import { aiRewrite } from '@/lib/ai-client';
import { validateRewriteRequest, formatValidationErrors } from '@/lib/validation';
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
    const validationResult = validateRewriteRequest(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: formatValidationErrors(validationResult.error) },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }
    
    const { 
      title, 
      content, 
      platform, 
      platformName, 
      lang, 
      mode, 
      uiLang 
    } = validationResult.data;

    // 4. 清理输入
    const sanitizedTitle = title ? sanitizeInput(title, 200) : '';
    const sanitizedContent = sanitizeInput(content, 10000);

    // 5. 执行 AI 改写
    const result = await aiRewrite(
      sanitizedTitle,
      sanitizedContent,
      platform,
      platformName || platform,
      lang || 'en',
      mode,
      uiLang || 'en',
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI 改写不可用（未设置 ANTHROPIC_API_KEY）',
        },
        { 
          status: 503,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // 6. 对返回数据进行 XSS 转义
    const safeResult = deepEscape(result);

    // 7. 返回安全响应
    return NextResponse.json(
      { success: true, data: safeResult },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error('Rewrite failed:', error);
    return NextResponse.json(
      { error: '改写失败' },
      { status: 500 }
    );
  }
}
