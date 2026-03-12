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
    ? { compliance: '合规', engagement: '互动', viral: 'Viral', readability: '可读性', algorithm: '算法', searchSEO: 'SEO', visualMatch: '视觉', timing: '时机' }
    : { compliance: 'Comply', engagement: 'Engage', viral: 'Viral', readability: 'Read', algorithm: 'Algo', searchSEO: 'SEO', visualMatch: 'Visual', timing: 'Timing' };

  const data = Object.entries(scores).map(([key, value]) => ({
    subject: labels[key as keyof typeof labels] || key,
    value,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsRadar data={data}>
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <PolarGrid stroke="rgba(255,255,255,0.04)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#71717A', fontSize: 10, fontWeight: 500 }}
          axisLine={false}
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#8B5CF6"
          fill="url(#radarFill)"
          strokeWidth={2}
          dot={{ r: 3, fill: '#8B5CF6', stroke: '#000', strokeWidth: 1 }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
