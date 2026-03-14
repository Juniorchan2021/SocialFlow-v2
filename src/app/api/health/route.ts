import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    services: {
      api: true,
      ai: !!process.env.ANTHROPIC_API_KEY,
      cache: true,
    },
    uptime: process.uptime(),
  };

  logger.info('Health check', health);
  return NextResponse.json(health);
}
