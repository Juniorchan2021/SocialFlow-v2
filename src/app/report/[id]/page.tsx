import type { Metadata } from 'next';
import { getReport } from '@/lib/db';
import ReportClient from './ReportClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const report = getReport(id);
  if (!report) return { title: 'Report Not Found — SocialFlow' };

  const results = report.results as { platformName: string; overallScore: number; status: string }[];
  const primary = results[0];
  const scoreText = primary ? `${primary.platformName} 评分 ${primary.overallScore}/100` : '';

  return {
    title: `检测报告 ${scoreText} — SocialFlow`,
    description: `SocialFlow 内容检测报告：${scoreText}。${report.title ? `标题：${report.title}` : ''}`,
    openGraph: {
      title: `我的社媒内容评分 ${primary?.overallScore || 0}/100 — 你的呢？`,
      description: `用 SocialFlow 检测你的社媒内容合规性、互动潜力和爆款概率`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `社媒内容评分 ${primary?.overallScore || 0}/100`,
      description: 'SocialFlow — 社媒内容与视觉智能检测',
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const report = getReport(id);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#09090B] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">报告不存在</h1>
          <p className="text-slate-400 mb-6">该检测报告可能已过期或链接无效</p>
          <a href="/" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition">
            去检测我的内容
          </a>
        </div>
      </div>
    );
  }

  return <ReportClient report={{ ...report, results: report.results as any[] }} />;
}
