import type { Platform } from './rules';
import type { StructureAnalysis } from './scoring';

export interface AlgoSignal {
  name: string;
  score: number;
  maxScore: number;
  tip: string;
}

export interface AlgoSimResult {
  platform: Platform;
  modelName: string;
  totalScore: number;
  maxTotal: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  signals: AlgoSignal[];
  prediction: string;
}

function grade(ratio: number): AlgoSimResult['grade'] {
  if (ratio >= 0.85) return 'S';
  if (ratio >= 0.7) return 'A';
  if (ratio >= 0.55) return 'B';
  if (ratio >= 0.4) return 'C';
  return 'D';
}

function xhsCES(title: string, content: string, s: StructureAnalysis, lang: 'zh' | 'en'): AlgoSimResult {
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  const titleLen = title.length;
  add('标题长度(10-20字)', titleLen >= 10 && titleLen <= 20 ? 10 : titleLen >= 5 ? 5 : 0, 10,
    titleLen < 10 ? '标题补充至10-20字，含核心关键词' : '标题长度合适');
  add('情绪钩子', s.hasHook ? 10 : 0, 10, s.hasHook ? '已包含钩子词' : '标题加"震惊/救命/绝了/亲测"等钩子');
  add('数字元素', s.titleHasNumber ? 8 : 0, 8, s.titleHasNumber ? '标题含数字' : '加入具体数字提升点击率36%');
  add('话题标签(5-8个)', s.hashtagCount >= 5 && s.hashtagCount <= 8 ? 12 : s.hashtagCount >= 3 ? 6 : 0, 12,
    s.hashtagCount < 5 ? '增至5-8个标签: 1大词+3精准+1地域' : '标签数量合适');

  const contentLen = content.replace(/\s/g, '').length;
  add('正文篇幅(150-500字)', contentLen >= 150 && contentLen <= 500 ? 10 : contentLen >= 80 ? 5 : 0, 10,
    contentLen < 150 ? '正文扩充至150-500字提升读完率' : '篇幅合适');
  add('段落结构(≥3段)', s.paragraphs >= 3 ? 8 : s.paragraphs >= 2 ? 4 : 0, 8,
    s.paragraphs < 3 ? '分至少3段，提升可读性' : '段落划分合理');
  add('互动引导(CTA)', s.hasCTA ? 10 : 0, 10, s.hasCTA ? '有互动引导' : '结尾加"你们觉得呢？"驱动评论(CES×4)');
  add('提问句式', s.hasQuestion ? 8 : 0, 8, s.hasQuestion ? '包含提问' : '加疑问句，评论权重最高(CES×4)');
  add('Emoji适量(2-10)', s.emojiCount >= 2 && s.emojiCount <= 10 ? 6 : s.emojiCount >= 1 ? 3 : 0, 6,
    s.emojiCount < 2 ? '加2-10个emoji提升视觉层次' : 'emoji使用合理');

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  const ratio = total / max;

  return {
    platform: 'xhs', modelName: '小红书 CES 模型模拟', totalScore: total, maxTotal: max, grade: grade(ratio),
    signals,
    prediction: ratio >= 0.7 ? '预计进入发现页推荐池' : ratio >= 0.5 ? '可获基础分发，优化后可进推荐池' : '分发受限，建议按清单优化',
  };
}

function twitterAlgo(title: string, content: string, s: StructureAnalysis, lang: 'zh' | 'en'): AlgoSimResult {
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });
  const isZh = lang === 'zh';

  const charLimit = content.length <= 280;
  add(isZh ? '字符限制(≤280)' : 'Char limit (≤280)', charLimit ? 10 : 0, 10,
    charLimit ? (isZh ? '符合字数限制' : 'Within limit') : (isZh ? '超出280字符，需压缩或拆Thread' : 'Over 280 chars — shorten or use Thread'));
  add(isZh ? '开头钩子' : 'Opening hook', s.hasHook ? 12 : 0, 12,
    s.hasHook ? (isZh ? '有钩子' : 'Hook present') : (isZh ? '首句加强力观点/数据/悬念' : 'Lead with hot take, data, or question'));
  add(isZh ? '标签(1-2个)' : 'Hashtags (1-2)', s.hashtagCount >= 1 && s.hashtagCount <= 2 ? 8 : s.hashtagCount >= 1 ? 4 : 0, 8,
    s.hashtagCount === 0 ? (isZh ? '加1-2个精准标签' : 'Add 1-2 targeted hashtags') : (isZh ? '标签合理' : 'Good hashtag count'));
  add(isZh ? '互动驱动(问句)' : 'Engagement driver', s.hasQuestion ? 10 : 0, 10,
    s.hasQuestion ? (isZh ? '包含问句' : 'Has question') : (isZh ? '结尾加"你怎么看？"驱动回复' : 'End with question for 3x replies'));
  add(isZh ? 'Thread结构' : 'Thread format', content.includes('\n') && content.length > 150 ? 8 : 0, 8,
    isZh ? '长内容拆成Thread结构(1/N)' : 'Use Thread (1/N) for long content');
  add(isZh ? '内容长度最佳区间' : 'Optimal length', content.length >= 80 && content.length <= 250 ? 8 : content.length >= 40 ? 4 : 0, 8,
    isZh ? '80-250字符为最佳互动区间' : '80-250 chars is the sweet spot for engagement');

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'twitter', modelName: 'Twitter/X Recommendation Sim', totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? (isZh ? '预计进入"为你推荐"信息流' : 'Likely to enter "For You" feed') : (isZh ? '优化后可提升推荐权重' : 'Optimize to boost recommendation weight'),
  };
}

function facebookAlgo(title: string, content: string, s: StructureAnalysis): AlgoSimResult {
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  add('Meaningful interaction', s.hasQuestion ? 12 : 0, 12, s.hasQuestion ? 'Has question for comments' : 'Add open-ended question — comments are weighted highest');
  add('"See More" hook', s.hasHook ? 10 : 0, 10, s.hasHook ? 'Strong opening hook' : 'First 80 chars must hook — this is before the "See More" cut');
  add('Comment driver (CTA)', s.hasCTA ? 10 : 0, 10, s.hasCTA ? 'Has CTA' : 'Add "What do you think?" or "Tag someone who..."');
  add('Paragraph structure', s.paragraphs >= 2 ? 8 : 0, 8, s.paragraphs < 2 ? 'Break into 2+ paragraphs for readability' : 'Good structure');
  add('Original content signal', content.length >= 60 ? 8 : 3, 8, 'Original text posts get higher weight than shared links');
  add('Emotional resonance', /\b(wow|amazing|love|hate|agree|disagree|shocked|grateful)\b/i.test(content) ? 6 : 0, 6, 'Use emotion words for reaction engagement');

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'facebook', modelName: 'Facebook News Feed Sim', totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? 'Likely to get extended reach in News Feed' : 'Optimize interaction signals for better distribution',
  };
}

function instagramAlgo(title: string, content: string, s: StructureAnalysis): AlgoSimResult {
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  add('Caption hook (first 125 chars)', s.hasHook ? 12 : 0, 12, s.hasHook ? 'Strong hook present' : 'First 125 chars show before "...more" — pack your hook here');
  add('Hashtag pyramid (20-30)', s.hashtagCount >= 15 && s.hashtagCount <= 30 ? 12 : s.hashtagCount >= 5 ? 6 : 0, 12,
    s.hashtagCount < 15 ? 'Use 20-30 hashtags: 5 big + 10 mid + 15 niche' : 'Good hashtag volume');
  add('CTA for saves/shares', s.hasCTA ? 10 : 0, 10, s.hasCTA ? 'Has CTA' : 'Add "Save this for later" — saves are weighted heavily');
  add('Emoji engagement', s.emojiCount >= 2 ? 6 : s.emojiCount >= 1 ? 3 : 0, 6, s.emojiCount < 2 ? 'Add 2-5 emojis to boost visual appeal' : 'Good emoji use');
  add('Caption length (125-300)', content.length >= 125 && content.length <= 300 ? 8 : content.length >= 50 ? 4 : 0, 8,
    'Optimal caption length is 125-300 chars for Explore page');
  add('Question for comments', s.hasQuestion ? 8 : 0, 8, s.hasQuestion ? 'Has question' : 'Add a question — comments boost Explore ranking');

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'instagram', modelName: 'Instagram Explore Sim', totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? 'High chance of reaching Explore page' : 'Optimize hashtags and engagement signals for Explore reach',
  };
}

function youtubeAlgo(title: string, content: string, s: StructureAnalysis): AlgoSimResult {
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  const tLen = title.length;
  add('Title CTR formula', s.hasHook && s.titleHasNumber && tLen <= 60 ? 15 : (s.hasHook || s.titleHasNumber) ? 8 : 0, 15,
    'Winning formula: Number + Power word + Curiosity gap ≤60 chars');
  add('Title length (≤60)', tLen > 0 && tLen <= 60 ? 10 : tLen > 60 ? 3 : 0, 10,
    tLen > 60 ? `Title is ${tLen} chars — truncated on mobile. Shorten to ≤60` : 'Good title length');
  add('Description SEO (first 2 lines)', content.length >= 100 ? 8 : content.length >= 40 ? 4 : 0, 8,
    'First 2 lines of description show in search. Pack with keywords');
  add('Tags coverage (5-15)', s.hashtagCount >= 5 && s.hashtagCount <= 15 ? 10 : s.hashtagCount >= 2 ? 5 : 0, 10,
    s.hashtagCount < 5 ? 'Add 5-15 keyword tags, most important first' : 'Good tag coverage');
  add('Hook in title', s.hasHook ? 8 : 0, 8, s.hasHook ? 'Title has hook' : 'Add curiosity gap: "I Tested X — Here\'s What Happened"');
  add('Number in title', s.titleHasNumber ? 8 : 0, 8, s.titleHasNumber ? 'Has number' : 'Titles with numbers get 36% higher CTR');

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'youtube', modelName: 'YouTube Recommendation Sim', totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? 'Strong CTR signals — likely to be recommended' : 'Improve title CTR formula for better click-through',
  };
}

export function simulateAlgorithm(
  platform: Platform,
  title: string,
  content: string,
  structure: StructureAnalysis,
  lang: 'zh' | 'en',
): AlgoSimResult {
  switch (platform) {
    case 'xhs': return xhsCES(title, content, structure, lang);
    case 'twitter': return twitterAlgo(title, content, structure, lang);
    case 'facebook': return facebookAlgo(title, content, structure);
    case 'instagram': return instagramAlgo(title, content, structure);
    case 'youtube': return youtubeAlgo(title, content, structure);
    default: throw new Error(`Unsupported platform: ${platform}`);
  }
}
