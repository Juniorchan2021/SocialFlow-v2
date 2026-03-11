import type { Platform } from './rules';
import type { StructureAnalysis, ContentType } from './scoring';

export interface ViralPrediction {
  probability: 'low' | 'medium' | 'high';
  percentage: number;
  factors: { name: string; score: number; weight: number; detail: string }[];
  boostTips: string[];
}

const VIRAL_PATTERNS_ZH = [
  /\d+[天个月年]/, /亲测/, /震惊|救命|绝了|离谱/, /为什么|怎么|如何/,
  /攻略|秘诀|技巧|方法/, /\d+%/, /免费|省了|赚了/, /最新|最全|最强/,
  /对比|测评|横评/, /踩雷|避坑|翻车/,
];

const VIRAL_PATTERNS_EN = [
  /\d+\s*(ways|tips|things|steps|tools|reasons)/, /here'?s?\s+what/i, /nobody\s+tells/i,
  /i\s+(tested|tried|analyzed|spent)/i, /stop\s+doing/i, /thread/i,
  /hot\s+take/i, /unpopular\s+opinion/i, /\d+%/, /free|save|earn/i,
  /before.*after/i, /secret|truth|myth/i,
];

export function predictViral(
  platform: Platform,
  title: string,
  content: string,
  structure: StructureAnalysis,
  contentType: ContentType,
  lang: 'zh' | 'en',
): ViralPrediction {
  const isZh = lang === 'zh';
  const full = (title + ' ' + content).toLowerCase();
  const factors: ViralPrediction['factors'] = [];

  const patterns = isZh ? VIRAL_PATTERNS_ZH : VIRAL_PATTERNS_EN;
  const formulaMatches = patterns.filter(p => p.test(full)).length;
  const formulaScore = Math.min(100, formulaMatches * 20);
  factors.push({
    name: isZh ? '爆文公式匹配' : 'Viral formula match',
    score: formulaScore, weight: 0.3,
    detail: isZh ? `匹配了${formulaMatches}个爆文模式` : `Matched ${formulaMatches} viral patterns`,
  });

  let emotionScore = 0;
  if (isZh) {
    const emotionWords = (full.match(/震惊|救命|绝了|太好了|离谱|崩溃|感动|愤怒|爱了|泪目|无语|上头/g) || []).length;
    emotionScore = Math.min(100, emotionWords * 25);
  } else {
    const emotionWords = (full.match(/\b(amazing|incredible|shocking|unbelievable|insane|love|hate|wow|mind.?blown|game.?changer)\b/gi) || []).length;
    emotionScore = Math.min(100, emotionWords * 25);
  }
  factors.push({
    name: isZh ? '情绪张力' : 'Emotional tension',
    score: emotionScore, weight: 0.25,
    detail: isZh ? `情绪词密度${emotionScore >= 50 ? '充足' : '偏低'}` : `Emotional word density is ${emotionScore >= 50 ? 'strong' : 'weak'}`,
  });

  let hookScore = 0;
  if (structure.hasHook) hookScore += 40;
  if (structure.titleHasNumber) hookScore += 20;
  if (structure.hasQuestion) hookScore += 20;
  if (title.length > 0 && /[!！🔥💥⚡]/.test(title)) hookScore += 20;
  hookScore = Math.min(100, hookScore);
  factors.push({
    name: isZh ? '钩子强度' : 'Hook strength',
    score: hookScore, weight: 0.25,
    detail: isZh
      ? `${structure.hasHook ? '✓钩子' : '✗无钩子'} ${structure.titleHasNumber ? '✓数字' : '✗无数字'} ${structure.hasQuestion ? '✓提问' : '✗无提问'}`
      : `${structure.hasHook ? '✓hook' : '✗no hook'} ${structure.titleHasNumber ? '✓number' : '✗no number'} ${structure.hasQuestion ? '✓question' : '✗no question'}`,
  });

  const contentTypeMultiplier: Record<string, number> = {
    tutorial: 80, product_review: 75, opinion: 85, entertainment: 90,
    lifestyle: 60, promotion: 40, news: 65, general: 50,
  };
  const typeScore = contentTypeMultiplier[contentType] || 50;
  factors.push({
    name: isZh ? '内容类型适配' : 'Content type fit',
    score: typeScore, weight: 0.2,
    detail: isZh ? `${contentType}类型在${platform}上的传播力` : `${contentType} virality on ${platform}`,
  });

  const totalScore = Math.round(factors.reduce((sum, f) => sum + f.score * f.weight, 0));
  const probability: ViralPrediction['probability'] = totalScore >= 70 ? 'high' : totalScore >= 45 ? 'medium' : 'low';

  const boostTips: string[] = [];
  if (formulaScore < 60) {
    boostTips.push(isZh
      ? '套用爆文公式："[数字]+[动作]+[惊喜结果]"'
      : 'Apply viral formula: "[Number] + [Action] + [Surprising Result]"');
  }
  if (emotionScore < 50) {
    boostTips.push(isZh
      ? '增加情绪词（震惊/绝了/救命）制造情绪张力'
      : 'Add emotion words (amazing/shocking/unbelievable) for tension');
  }
  if (hookScore < 60) {
    boostTips.push(isZh
      ? '标题加数字+钩子词，点击率提升36-80%'
      : 'Add number + hook to title for 36-80% CTR boost');
  }
  if (!structure.hasQuestion) {
    boostTips.push(isZh
      ? '加提问句激发讨论，评论互动是传播关键'
      : 'Add a question to spark discussion — comments drive shares');
  }

  return { probability, percentage: totalScore, factors, boostTips };
}
