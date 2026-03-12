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

type T = (zh: string, en: string) => string;

function xhsCES(title: string, content: string, s: StructureAnalysis, _lang: 'zh' | 'en', uiLang: 'zh' | 'en'): AlgoSimResult {
  const t: T = (zh, en) => uiLang === 'zh' ? zh : en;
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  const titleLen = title.length;
  add(t('标题长度(10-20字)', 'Title length (10-20)'), titleLen >= 10 && titleLen <= 20 ? 10 : titleLen >= 5 ? 5 : 0, 10,
    titleLen < 10 ? t('标题补充至10-20字，含核心关键词', 'Extend title to 10-20 chars with core keywords') : t('标题长度合适', 'Good title length'));
  add(t('情绪钩子', 'Emotion hook'), s.hasHook ? 10 : 0, 10, s.hasHook ? t('已包含钩子词', 'Hook present') : t('标题加"震惊/救命/绝了/亲测"等钩子', 'Add hooks like 震惊/救命/绝了/亲测'));
  add(t('数字元素', 'Number element'), s.titleHasNumber ? 8 : 0, 8, s.titleHasNumber ? t('标题含数字', 'Has number') : t('加入具体数字提升点击率36%', 'Add numbers for 36% CTR boost'));
  add(t('话题标签(5-8个)', 'Hashtags (5-8)'), s.hashtagCount >= 5 && s.hashtagCount <= 8 ? 12 : s.hashtagCount >= 3 ? 6 : 0, 12,
    s.hashtagCount < 5 ? t('增至5-8个标签: 1大词+3精准+1地域', 'Increase to 5-8 tags: 1 big + 3 precise + 1 geo') : t('标签数量合适', 'Good hashtag count'));

  const contentLen = content.replace(/\s/g, '').length;
  add(t('正文篇幅(150-500字)', 'Content length (150-500)'), contentLen >= 150 && contentLen <= 500 ? 10 : contentLen >= 80 ? 5 : 0, 10,
    contentLen < 150 ? t('正文扩充至150-500字提升读完率', 'Extend to 150-500 chars for completion rate') : t('篇幅合适', 'Good length'));
  add(t('段落结构(≥3段)', 'Paragraphs (≥3)'), s.paragraphs >= 3 ? 8 : s.paragraphs >= 2 ? 4 : 0, 8,
    s.paragraphs < 3 ? t('分至少3段，提升可读性', 'Use 3+ paragraphs for readability') : t('段落划分合理', 'Good structure'));
  add(t('互动引导(CTA)', 'CTA'), s.hasCTA ? 10 : 0, 10, s.hasCTA ? t('有互动引导', 'Has CTA') : t('结尾加"你们觉得呢？"驱动评论(CES×4)', 'Add "你们觉得呢?" for comments (CES×4)'));
  add(t('提问句式', 'Question'), s.hasQuestion ? 8 : 0, 8, s.hasQuestion ? t('包含提问', 'Has question') : t('加疑问句，评论权重最高(CES×4)', 'Add question — comments have top CES weight'));
  add(t('Emoji适量(2-10)', 'Emoji (2-10)'), s.emojiCount >= 2 && s.emojiCount <= 10 ? 6 : s.emojiCount >= 1 ? 3 : 0, 6,
    s.emojiCount < 2 ? t('加2-10个emoji提升视觉层次', 'Add 2-10 emojis for visual appeal') : t('emoji使用合理', 'Good emoji use'));

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  const ratio = total / max;

  return {
    platform: 'xhs', modelName: t('小红书 CES 模型模拟', 'Xiaohongshu CES Model Sim'), totalScore: total, maxTotal: max, grade: grade(ratio),
    signals,
    prediction: ratio >= 0.7 ? t('预计进入发现页推荐池', 'Likely to enter Explore recommendation pool') : ratio >= 0.5 ? t('可获基础分发，优化后可进推荐池', 'Basic distribution OK; optimize to reach Explore') : t('分发受限，建议按清单优化', 'Limited distribution — follow checklist to optimize'),
  };
}

function twitterAlgo(title: string, content: string, s: StructureAnalysis, _lang: 'zh' | 'en', uiLang: 'zh' | 'en'): AlgoSimResult {
  const t: T = (zh, en) => uiLang === 'zh' ? zh : en;
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  const charLimit = content.length <= 280;
  add(t('字符限制(≤280)', 'Char limit (≤280)'), charLimit ? 10 : 0, 10,
    charLimit ? t('符合字数限制', 'Within limit') : t('超出280字符，需压缩或拆Thread', 'Over 280 chars — shorten or use Thread'));
  add(t('开头钩子', 'Opening hook'), s.hasHook ? 12 : 0, 12,
    s.hasHook ? t('有钩子', 'Hook present') : t('首句加强力观点/数据/悬念', 'Lead with hot take, data, or question'));
  add(t('标签(1-2个)', 'Hashtags (1-2)'), s.hashtagCount >= 1 && s.hashtagCount <= 2 ? 8 : s.hashtagCount >= 1 ? 4 : 0, 8,
    s.hashtagCount === 0 ? t('加1-2个精准标签', 'Add 1-2 targeted hashtags') : t('标签合理', 'Good hashtag count'));
  add(t('互动驱动(问句)', 'Engagement driver'), s.hasQuestion ? 10 : 0, 10,
    s.hasQuestion ? t('包含问句', 'Has question') : t('结尾加"你怎么看？"驱动回复', 'End with question for 3x replies'));
  add(t('Thread结构', 'Thread format'), content.includes('\n') && content.length > 150 ? 8 : 0, 8,
    t('长内容拆成Thread结构(1/N)', 'Use Thread (1/N) for long content'));
  add(t('内容长度最佳区间', 'Optimal length'), content.length >= 80 && content.length <= 250 ? 8 : content.length >= 40 ? 4 : 0, 8,
    t('80-250字符为最佳互动区间', '80-250 chars is the sweet spot for engagement'));

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'twitter', modelName: t('Twitter/X 推荐算法模拟', 'Twitter/X Recommendation Sim'), totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? t('预计进入"为你推荐"信息流', 'Likely to enter "For You" feed') : t('优化后可提升推荐权重', 'Optimize to boost recommendation weight'),
  };
}

function facebookAlgo(title: string, content: string, s: StructureAnalysis, uiLang: 'zh' | 'en'): AlgoSimResult {
  const t: T = (zh, en) => uiLang === 'zh' ? zh : en;
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  add(t('有效互动(问句)', 'Meaningful interaction'), s.hasQuestion ? 12 : 0, 12, s.hasQuestion ? t('包含提问，利于评论', 'Has question for comments') : t('加开放式问题——评论权重最高', 'Add open-ended question — comments are weighted highest'));
  add(t('"查看更多"钩子', '"See More" hook'), s.hasHook ? 10 : 0, 10, s.hasHook ? t('开头有钩子', 'Strong opening hook') : t('前80字符必须抓眼球，这是"查看更多"截断点', 'First 80 chars must hook — before "See More" cut'));
  add(t('评论引导(CTA)', 'Comment driver (CTA)'), s.hasCTA ? 10 : 0, 10, s.hasCTA ? t('有CTA', 'Has CTA') : t('加"你怎么看？"或"@一个朋友"', 'Add "What do you think?" or "Tag someone who..."'));
  add(t('段落结构', 'Paragraph structure'), s.paragraphs >= 2 ? 8 : 0, 8, s.paragraphs < 2 ? t('分成2段以上提升可读性', 'Break into 2+ paragraphs for readability') : t('结构良好', 'Good structure'));
  add(t('原创内容信号', 'Original content signal'), content.length >= 60 ? 8 : 3, 8, t('原创文字帖权重高于分享链接', 'Original text posts get higher weight than shared links'));
  add(t('情感共鸣', 'Emotional resonance'), /\b(wow|amazing|love|hate|agree|disagree|shocked|grateful)\b/i.test(content) ? 6 : 0, 6, t('使用情感词提升互动反应', 'Use emotion words for reaction engagement'));

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'facebook', modelName: t('Facebook 动态消息算法模拟', 'Facebook News Feed Sim'), totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? t('预计获得动态消息更高触达', 'Likely to get extended reach in News Feed') : t('优化互动信号以获得更好分发', 'Optimize interaction signals for better distribution'),
  };
}

function instagramAlgo(title: string, content: string, s: StructureAnalysis, uiLang: 'zh' | 'en'): AlgoSimResult {
  const t: T = (zh, en) => uiLang === 'zh' ? zh : en;
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  add(t('文案钩子(前125字符)', 'Caption hook (first 125 chars)'), s.hasHook ? 12 : 0, 12, s.hasHook ? t('有钩子', 'Strong hook present') : t('前125字符显示在"...更多"之前——把钩子放这里', 'First 125 chars show before "...more" — pack your hook here'));
  add(t('标签金字塔(20-30)', 'Hashtag pyramid (20-30)'), s.hashtagCount >= 15 && s.hashtagCount <= 30 ? 12 : s.hashtagCount >= 5 ? 6 : 0, 12,
    s.hashtagCount < 15 ? t('使用20-30个标签：5大词 + 10中词 + 15长尾', 'Use 20-30 hashtags: 5 big + 10 mid + 15 niche') : t('标签量合适', 'Good hashtag volume'));
  add(t('CTA引导收藏/分享', 'CTA for saves/shares'), s.hasCTA ? 10 : 0, 10, s.hasCTA ? t('有CTA', 'Has CTA') : t('加"收藏备用"——收藏权重很高', 'Add "Save this for later" — saves are weighted heavily'));
  add(t('Emoji互动', 'Emoji engagement'), s.emojiCount >= 2 ? 6 : s.emojiCount >= 1 ? 3 : 0, 6, s.emojiCount < 2 ? t('加2-5个emoji提升视觉吸引力', 'Add 2-5 emojis to boost visual appeal') : t('emoji使用良好', 'Good emoji use'));
  add(t('文案长度(125-300)', 'Caption length (125-300)'), content.length >= 125 && content.length <= 300 ? 8 : content.length >= 50 ? 4 : 0, 8,
    t('最佳文案长度125-300字符，利于进入探索页', 'Optimal caption length is 125-300 chars for Explore page'));
  add(t('提问引导评论', 'Question for comments'), s.hasQuestion ? 8 : 0, 8, s.hasQuestion ? t('包含问句', 'Has question') : t('加提问——评论数提升探索页排名', 'Add a question — comments boost Explore ranking'));

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'instagram', modelName: t('Instagram 探索页算法模拟', 'Instagram Explore Sim'), totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? t('很可能进入探索页', 'High chance of reaching Explore page') : t('优化标签和互动信号以提升探索页触达', 'Optimize hashtags and engagement signals for Explore reach'),
  };
}

function youtubeAlgo(title: string, content: string, s: StructureAnalysis, uiLang: 'zh' | 'en'): AlgoSimResult {
  const t: T = (zh, en) => uiLang === 'zh' ? zh : en;
  const signals: AlgoSignal[] = [];
  const add = (name: string, score: number, max: number, tip: string) => signals.push({ name, score: Math.min(score, max), maxScore: max, tip });

  const tLen = title.length;
  add(t('标题CTR公式', 'Title CTR formula'), s.hasHook && s.titleHasNumber && tLen <= 60 ? 15 : (s.hasHook || s.titleHasNumber) ? 8 : 0, 15,
    t('爆款公式：数字 + 强力词 + 好奇心缺口 ≤60字符', 'Winning formula: Number + Power word + Curiosity gap ≤60 chars'));
  add(t('标题长度(≤60)', 'Title length (≤60)'), tLen > 0 && tLen <= 60 ? 10 : tLen > 60 ? 3 : 0, 10,
    tLen > 60 ? t(`标题${tLen}字符——手机端会截断，缩短至≤60`, `Title is ${tLen} chars — truncated on mobile. Shorten to ≤60`) : t('标题长度合适', 'Good title length'));
  add(t('描述SEO(前2行)', 'Description SEO (first 2 lines)'), content.length >= 100 ? 8 : content.length >= 40 ? 4 : 0, 8,
    t('描述前2行会显示在搜索结果中，填满关键词', 'First 2 lines of description show in search. Pack with keywords'));
  add(t('标签覆盖(5-15)', 'Tags coverage (5-15)'), s.hashtagCount >= 5 && s.hashtagCount <= 15 ? 10 : s.hashtagCount >= 2 ? 5 : 0, 10,
    s.hashtagCount < 5 ? t('加5-15个关键词标签，最重要的放前面', 'Add 5-15 keyword tags, most important first') : t('标签覆盖合适', 'Good tag coverage'));
  add(t('标题钩子', 'Hook in title'), s.hasHook ? 8 : 0, 8, s.hasHook ? t('有钩子', 'Title has hook') : t('加好奇心缺口："我测试了X——结果出人意料"', 'Add curiosity gap: "I Tested X — Here\'s What Happened"'));
  add(t('标题数字', 'Number in title'), s.titleHasNumber ? 8 : 0, 8, s.titleHasNumber ? t('有数字', 'Has number') : t('含数字的标题点击率高36%', 'Titles with numbers get 36% higher CTR'));

  const total = signals.reduce((a, b) => a + b.score, 0);
  const max = signals.reduce((a, b) => a + b.maxScore, 0);
  return {
    platform: 'youtube', modelName: t('YouTube 推荐算法模拟', 'YouTube Recommendation Sim'), totalScore: total, maxTotal: max, grade: grade(total / max),
    signals, prediction: total / max >= 0.7 ? t('CTR信号强——很可能被推荐', 'Strong CTR signals — likely to be recommended') : t('优化标题CTR公式以提升点击率', 'Improve title CTR formula for better click-through'),
  };
}

export function simulateAlgorithm(
  platform: Platform,
  title: string,
  content: string,
  structure: StructureAnalysis,
  lang: 'zh' | 'en',
  uiLang: 'zh' | 'en' = 'en',
): AlgoSimResult {
  switch (platform) {
    case 'xhs': return xhsCES(title, content, structure, lang, uiLang);
    case 'twitter': return twitterAlgo(title, content, structure, lang, uiLang);
    case 'facebook': return facebookAlgo(title, content, structure, uiLang);
    case 'instagram': return instagramAlgo(title, content, structure, uiLang);
    case 'youtube': return youtubeAlgo(title, content, structure, uiLang);
    default: throw new Error(`Unsupported platform: ${platform}`);
  }
}
