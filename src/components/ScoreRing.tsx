'use client';

import { scoreColor } from '@/lib/utils';

interface Props {
  score: number;
  label: string;
  size?: number;
}

export default function ScoreRing({ score, label, size = 72 }: Props) {
  const color = scoreColor(score);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.max(0, Math.min(score, 100)) / 100 * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E293B" strokeWidth={5} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={`${fill.toFixed(1)} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
          />
        </svg>
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-center">{label}</span>
    </div>
  );
}
