import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveReport, getReport, incrementShareCount } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platforms, title, content, twitterLang, results } = body;

    if (!results || !platforms) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const id = nanoid(10);
    saveReport({ id, platforms, title: title || '', content: content || '', twitterLang, results });

    const host = req.headers.get('host') || 'socialflow-v2.onrender.com';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${host}`;
    return NextResponse.json({
      success: true,
      reportId: id,
      reportUrl: `${baseUrl}/report/${id}`,
    });
  } catch (error) {
    console.error('Save report failed:', error);
    return NextResponse.json({ error: '保存报告失败' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: '缺少报告ID' }, { status: 400 });

    const report = getReport(id);
    if (!report) return NextResponse.json({ error: '报告不存在' }, { status: 404 });

    const action = req.nextUrl.searchParams.get('action');
    if (action === 'share') incrementShareCount(id);

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Get report failed:', error);
    return NextResponse.json({ error: '获取报告失败' }, { status: 500 });
  }
}
