'use client';

import { useEffect, useRef, useState } from 'react';
import { scoreColor } from '@/lib/utils';

interface Props {
  score: number;
  label: string;
  size?: number;
}

export default function ScoreRing({ score, label, size = 72 }: Props) {
  const color = scoreColor(score);
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 800;
    const from = 0;
    const to = score;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(from + (to - from) * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  const strokeW = size <= 56 ? 3.5 : 4.5;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.max(0, Math.min(score, 100)) / 100 * circ;
  const glowId = `glow-${label.replace(/\s/g, '')}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
            <filter id={`${glowId}-blur`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeW} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={`url(#${glowId})`} strokeWidth={strokeW} strokeLinecap="round"
            strokeDasharray={`${fill.toFixed(1)} ${circ}`}
            filter={`url(#${glowId}-blur)`} opacity="0.5"
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={`url(#${glowId})`} strokeWidth={strokeW} strokeLinecap="round"
            strokeDasharray={`${fill.toFixed(1)} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </svg>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold tabular-nums"
          style={{ color, fontSize: size <= 56 ? '0.85rem' : '1.15rem' }}>
          {displayScore}
        </span>
      </div>
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-center leading-tight">{label}</span>
    </div>
  );
}
