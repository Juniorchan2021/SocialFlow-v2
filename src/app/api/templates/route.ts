import { NextRequest, NextResponse } from 'next/server';
import { getTemplatesByPlatform, getTemplateById, getCategories } from '@/lib/templates-data';
import type { Platform } from '@/lib/rules';

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform') as Platform | null;
  const id = req.nextUrl.searchParams.get('id');

  if (id) {
    const template = getTemplateById(id);
    if (!template) return NextResponse.json({ error: '模板不存在' }, { status: 404 });
    return NextResponse.json({ success: true, data: template });
  }

  if (!platform) {
    return NextResponse.json({ error: '需要指定平台' }, { status: 400 });
  }

  const templates = getTemplatesByPlatform(platform);
  const categories = getCategories(platform);
  return NextResponse.json({ success: true, data: templates, categories });
}
