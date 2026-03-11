import { NextRequest, NextResponse } from 'next/server';
import { getHistory, getHistoryCount } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.nextUrl.searchParams.get('limit') || '30') || 30));
    const offset = Math.max(0, parseInt(req.nextUrl.searchParams.get('offset') || '0') || 0);
    const items = getHistory(limit, offset);
    const total = getHistoryCount();
    return NextResponse.json({ success: true, data: items, total, limit, offset });
  } catch (error) {
    console.error('Get history failed:', error);
    return NextResponse.json({ error: '获取历史记录失败' }, { status: 500 });
  }
}
