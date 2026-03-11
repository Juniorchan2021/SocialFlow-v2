'use client';

import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  scores: {
    compliance: number;
    engagement: number;
    viral: number;
    readability: number;
    algorithm: number;
    searchSEO: number;
    visualMatch: number;
    timing: number;
  };
  lang?: 'zh' | 'en';
}

export default function RadarChart({ scores, lang = 'zh' }: Props) {
  const labels = lang === 'zh'
    ? { compliance: '合规安全', engagement: '互动潜力', viral: 'Viral', readability: '可读性', algorithm: '算法友好', searchSEO: '搜索SEO', visualMatch: '视觉匹配', timing: '发布时机' }
    : { compliance: 'Compliance', engagement: 'Engagement', viral: 'Viral', readability: 'Readability', algorithm: 'Algorithm', searchSEO: 'Search SEO', visualMatch: 'Visual', timing: 'Timing' };

  const data = Object.entries(scores).map(([key, value]) => ({
    subject: labels[key as keyof typeof labels] || key,
    value,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#6366F1"
          fill="#6366F1"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
