import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#22C55E';
  if (score >= 55) return '#F59E0B';
  return '#EF4444';
}

export function scoreLabel(score: number, lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'zh') {
    if (score >= 80) return '优秀';
    if (score >= 55) return '需优化';
    return '风险高';
  }
  if (score >= 80) return 'Great';
  if (score >= 55) return 'Needs Work';
  return 'High Risk';
}

export function statusBadge(status: 'safe' | 'warning' | 'danger', lang: 'zh' | 'en' = 'zh') {
  const map = {
    safe: { icon: '✓', text: lang === 'zh' ? '内容合规，建议发布' : 'Content is compliant — safe to publish', cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
    warning: { icon: '⚠', text: lang === 'zh' ? '存在风险，建议优化后发布' : 'Risks detected — optimize before publishing', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    danger: { icon: '✕', text: lang === 'zh' ? '违规风险较高，请修改后再发布' : 'High risk — must fix before publishing', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };
  return map[status];
}
