import type { Platform } from './rules';
import { PLATFORM_RULES } from './rules';

// --- Types ---

export interface Violation {
  level: 'critical' | 'high' | 'medium' | 'low';
  name: string;
  keyword: string;
  color: string;
}

export interface StructureAnalysis {
  hasHook: boolean;
  hashtagCount: number;
  hashtags: string[];
  hasCTA: boolean;
  emojiCount: number;
  paragraphs: number;
  hasQuestion: boolean;
  titleHasNumber: boolean;
  contentHasNumber: boolean;
  wordCount: number;
}

export type ContentType = 'product_review' | 'tutorial' | 'lifestyle' | 'promotion' | 'opinion' | 'news' | 'entertainment' | 'general';

export interface ScoreResult {
  platform: Platform;
  platformName: string;
  platformIcon: string;
  language: string;
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
  overallScore: number;
  status: 'safe' | 'warning' | 'danger';
  violations: Violation[];
  structure: StructureAnalysis;
  contentType: ContentType;
  optimizations: Optimization[];
  hashtagSuggestions: string[];
  viralFormulas: { formula: string; example: string; why: string }[];
}

export interface Optimization {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  direction: string;  // 方向
  example: string;    // 示例
  actions: string[];  // 优化行动清单
}

// --- Language Detection ---

export function detectLanguage(text: string): 'zh' | 'en' {
  const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
  return chineseChars.length / Math.max(text.length, 1) > 0.15 ? 'zh' : 'en';
}

// --- Content Type Detection ---

export function detectContentType(title: string, content: string): ContentType {
  const full = (title + ' ' + content).toLowerCase();
  const scores: Record<ContentType, number> = {
    product_review: 0, tutorial: 0, lifestyle: 0, promotion: 0,
    opinion: 0, news: 0, entertainment: 0, general: 0,
  };

  if (/测评|开箱|体验|好用|推荐|安利|种草|踩雷|亲测|review|unboxing|honest|first impression|worth it/.test(full)) scores.product_review += 3;
  if (/教程|攻略|方法|技巧|步骤|如何|怎么|手把手|干货|how to|tutorial|guide|step by step|tips|tricks/.test(full)) scores.tutorial += 3;
  if (/日记|记录|分享|日常|vlog|随记|my day|daily|routine|journey|life/.test(full)) scores.lifestyle += 3;
  if (/折扣|优惠|打折|促销|秒杀|特价|sale|discount|off|deal|promo|free/.test(full)) scores.promotion += 3;
  if (/为什么|觉得|认为|看法|观点|think|opinion|take|believe|unpopular|imo/.test(full)) scores.opinion += 3;
  if (/最新|消息|公告|报道|发布|breaking|news|update|announced|happening/.test(full)) scores.news += 3;
  if (/搞笑|哈哈|笑死|梗|lol|funny|hilarious|meme/.test(full)) scores.entertainment += 3;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? (best[0] as ContentType) : 'general';
}

// --- Violation Check ---

const VIOLATION_NAME_ZH: Record<string, string> = {
  'Community Guidelines Violation': '社区准则违规',
  'Community Standard Violation': '社区标准违规',
  'Demonetization Risk': '取消变现风险',
  'Shadowban Risk': '限流风险',
  'Reduced Distribution Risk': '降低分发风险',
  'Engagement Bait': '互动诱饵',
  'Spam Signal': '垃圾信号',
  'Policy Violation': '政策违规',
  'Clickbait Risk': '标题党风险',
};

export function checkViolations(title: string, content: string, platform: Platform, lang: 'zh' | 'en', uiLang: 'zh' | 'en' = 'en'): { violations: Violation[]; complianceScore: number } {
  const rules = PLATFORM_RULES[platform];
  const violations: Violation[] = [];
  const seen = new Set<string>();
  let score = 100;
  const fullText = (title + ' ' + content).toLowerCase();

  let violationRules: Record<string, { name: string; color: string; keywords: string[] }>;

  if (platform === 'twitter') {
    const tw = rules.violations as { zh: Record<string, { name: string; color: string; keywords: string[] }>; en: Record<string, { name: string; color: string; keywords: string[] }> };
    violationRules = lang === 'zh' ? tw.zh : tw.en;
  } else {
    violationRules = rules.violations as Record<string, { name: string; color: string; keywords: string[] }>;
  }

  for (const [level, rule] of Object.entries(violationRules)) {
    if (!rule.keywords) continue;
    for (const keyword of rule.keywords) {
      const kl = keyword.toLowerCase();
      if (fullText.includes(kl) && !seen.has(kl)) {
        seen.add(kl);
        const displayName = uiLang === 'zh' ? (VIOLATION_NAME_ZH[rule.name] || rule.name) : rule.name;
        violations.push({ level: level as Violation['level'], name: displayName, keyword, color: rule.color });
        score -= level === 'critical' ? 50 : level === 'high' ? 25 : level === 'medium' ? 15 : 8;
      }
    }
  }

  return { violations, complianceScore: Math.max(0, score) };
}

// --- Structure Analysis ---

export function analyzeStructure(title: string, content: string, platform: Platform, lang: 'zh' | 'en'): StructureAnalysis {
  const full = title + ' ' + content;
  const fullLower = full.toLowerCase();

  const rules = PLATFORM_RULES[platform];

  let hookList: string[];
  if (platform === 'twitter') {
    const h = rules.hooks as { zh: string[]; en: string[] };
    hookList = lang === 'zh' ? h.zh : h.en;
  } else {
    hookList = rules.hooks as string[];
  }
  const hasHook = hookList.some(h => fullLower.includes(h.toLowerCase()));

  const hashtags = content.match(/#[\w\u4e00-\u9fff]+/g) || [];
  const hashtagCount = hashtags.length;

  let ctaList: string[];
  if (platform === 'twitter') {
    const c = rules.ctaPatterns as { zh: string[]; en: string[] };
    ctaList = lang === 'zh' ? c.zh : c.en;
  } else {
    ctaList = rules.ctaPatterns as string[];
  }
  const hasCTA = ctaList.some(p => fullLower.includes(p.toLowerCase()));

  const emojiCount = (full.match(/[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{26FF}]/gu) || []).length;
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0).length;
  const hasQuestion = /[？?]/.test(content);
  const titleHasNumber = /\d+/.test(title);
  const contentHasNumber = /\d+/.test(content);

  const wordCount = lang === 'zh'
    ? content.replace(/\s/g, '').length
    : content.split(/\s+/).filter(Boolean).length;

  return { hasHook, hashtagCount, hashtags: hashtags.map(h => h), hasCTA, emojiCount, paragraphs, hasQuestion, titleHasNumber, contentHasNumber, wordCount };
}

// --- Score Calculators ---

function calcEngagement(platform: Platform, title: string, content: string, s: StructureAnalysis): number {
  let score = 50;
  if (s.hasHook) score += 12;
  if (s.hasCTA) score += 8;
  if (s.hasQuestion) score += 8;
  if (s.titleHasNumber) score += 5;

  if (platform === 'xhs') {
    if (title.length >= 10 && title.length <= 20) score += 10;
    if (s.hashtagCount >= 3 && s.hashtagCount <= 8) score += 8;
    if (content.length >= 150 && content.length <= 500) score += 7;
    if (s.emojiCount >= 2 && s.emojiCount <= 10) score += 5;
  } else if (platform === 'twitter') {
    if (content.length >= 100 && content.length <= 250) score += 10;
    if (s.hashtagCount >= 1 && s.hashtagCount <= 2) score += 6;
    if (content.includes('\n')) score += 4;
  } else if (platform === 'facebook') {
    if (content.length >= 40 && content.length <= 200) score += 10;
    if (s.paragraphs >= 2) score += 5;
  } else if (platform === 'instagram') {
    if (content.length >= 50 && content.length <= 300) score += 8;
    if (s.hashtagCount >= 10 && s.hashtagCount <= 25) score += 10;
    if (s.emojiCount >= 1) score += 3;
  } else if (platform === 'youtube') {
    if (title.length >= 30 && title.length <= 60) score += 12;
    if (content.length >= 200) score += 8;
  }

  return Math.min(100, Math.max(0, score));
}

function calcViral(platform: Platform, s: StructureAnalysis, contentType: ContentType): number {
  let score = 35;
  if (s.hasHook) score += 14;
  if (s.titleHasNumber) score += 8;
  if (s.hasQuestion) score += 6;
  if (s.emojiCount >= 1) score += 3;

  const multipliers: Record<string, number> = {
    product_review: 1.1, tutorial: 1.15, opinion: 1.2,
    entertainment: 1.2, lifestyle: 1.0, promotion: 0.9, news: 1.05, general: 1.0,
  };
  score *= multipliers[contentType] || 1.0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function calcReadability(content: string, lang: 'zh' | 'en'): number {
  let score = 50;
  const paras = content.split('\n').filter(p => p.trim());
  if (paras.length >= 4) score += 15;
  else if (paras.length >= 2) score += 8;

  const avgLen = content.length / Math.max(paras.length, 1);
  if (avgLen <= 100) score += 12;
  else if (avgLen <= 200) score += 6;
  else if (avgLen > 400) score -= 10;

  const sentences = content.split(/[。！？.!?]/).filter(s => s.trim());
  if (sentences.length >= 4) score += 8;

  if (/[\u{1F300}-\u{1FFFF}]/gu.test(content)) score += 5;

  return Math.min(100, Math.max(0, score));
}

function calcAlgorithm(platform: Platform, title: string, content: string, s: StructureAnalysis, lang: 'zh' | 'en'): number {
  let score = 50;

  if (platform === 'xhs') {
    if (title.length >= 10 && title.length <= 20) score += 10;
    if (s.hasHook) score += 8;
    if (s.hashtagCount >= 5 && s.hashtagCount <= 8) score += 10;
    if (s.hasCTA) score += 8;
    if (s.paragraphs >= 3) score += 5;
    if (content.length >= 150 && content.length <= 500) score += 9;
  } else if (platform === 'twitter') {
    if (content.length >= 80 && content.length <= 250) score += 10;
    if (s.hasHook) score += 10;
    if (s.hashtagCount >= 1 && s.hashtagCount <= 2) score += 8;
    if (s.hasQuestion) score += 8;
  } else if (platform === 'facebook') {
    if (s.hasQuestion) score += 12;
    if (s.hasCTA) score += 8;
    if (s.paragraphs >= 2) score += 5;
    if (s.hasHook) score += 8;
  } else if (platform === 'instagram') {
    if (s.hashtagCount >= 10 && s.hashtagCount <= 30) score += 12;
    if (content.length >= 50) score += 5;
    if (s.hasCTA) score += 8;
    if (s.hasHook) score += 8;
  } else if (platform === 'youtube') {
    if (title.length >= 30 && title.length <= 60) score += 12;
    if (s.titleHasNumber) score += 8;
    if (s.hasHook) score += 8;
    if (content.length >= 200) score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

function calcSearchSEO(platform: Platform, title: string, content: string, s: StructureAnalysis): number {
  let score = 40;
  if (s.hashtagCount >= 1) score += 10;
  if (title.length >= 5) score += 8;
  if (s.contentHasNumber) score += 5;
  if (s.hasQuestion) score += 5;
  if (content.length >= 100) score += 8;

  if (platform === 'xhs' && s.hashtagCount >= 5) score += 10;
  if (platform === 'youtube' && title.length >= 30 && title.length <= 60) score += 12;
  if (platform === 'instagram' && s.hashtagCount >= 15) score += 10;

  return Math.min(100, Math.max(0, score));
}

// --- Optimization Generator ---

function generateOptimizations(platform: Platform, title: string, content: string, s: StructureAnalysis, violations: Violation[], lang: 'zh' | 'en', uiLang: 'zh' | 'en' = 'en'): Optimization[] {
  const opts: Optimization[] = [];
  const isZh = uiLang === 'zh';
  const t = (zh: string, en: string) => isZh ? zh : en;

  const criticals = violations.filter(v => v.level === 'critical');
  if (criticals.length > 0) {
    const kw = criticals.map(v => `"${v.keyword}"`);
    opts.push({
      priority: 'critical',
      category: t('合规', 'Compliance'),
      direction: t(`检测到 ${criticals.length} 个严重违规词，发布将被屏蔽或封号`, `${criticals.length} critical violation(s) detected — post will be removed`),
      example: t(`违规词：${kw.join('、')}`, `Violation terms: ${kw.join(', ')}`),
      actions: t('立即删除或替换所有违规词;使用合规替代表述（如"加密货币"→"数字支付"）;检查配图中是否也包含这些违规词', 'Remove or replace all violation terms immediately;Use compliant alternatives;Check images for same violations').split(';'),
    });
  }

  if (platform === 'xhs') {
    if (!title) {
      opts.push({ priority: 'high', category: t('标题', 'Title'), direction: t('未填写标题，小红书标题是搜索流量入口', 'No title — Xiaohongshu titles are the main search traffic entry point'), example: '"亲测！这个方法真的让我改变了..."', actions: [t('填写10-20字标题', 'Write a 10-20 char title'), t('包含核心关键词+情绪词', 'Include core keywords + emotion words'), t('加入具体数字', 'Add specific numbers')] });
    } else if (title.length < 10) {
      opts.push({ priority: 'high', category: t('标题', 'Title'), direction: t(`标题过短（${title.length}字），不利于搜索曝光`, `Title too short (${title.length} chars), hurts search visibility`), example: `"【亲测】${title}，效果超出预期！"`, actions: [t('拉长至10-20字', 'Extend to 10-20 chars'), t('加入情绪词（震惊/救命/绝了）', 'Add emotion hooks (震惊/救命/绝了)'), t('加入具体数字', 'Add specific numbers')] });
    }
    if (!s.hasHook) {
      opts.push({ priority: 'high', category: t('钩子词', 'Hook Words'), direction: t('缺少情绪钩子，点击率将降低60%', 'No emotion hook — click-through rate drops ~60%'), example: t('在标题开头加："救命！" / "震惊🔥" / "姐妹必看"', 'Add at title start: "救命!" / "震惊🔥" / "姐妹必看"'), actions: [t('标题或首句加入钩子词', 'Add hook to title or first sentence'), t('钩子词建议：震惊/救命/绝了/宝藏/亲测', 'Suggested hooks: 震惊/救命/绝了/宝藏/亲测'), t('带有情绪的标题平均点击率高30-80%', 'Emotional titles get 30-80% higher CTR')] });
    }
    if (s.hashtagCount < 3) {
      opts.push({ priority: 'high', category: t('话题标签', 'Hashtags'), direction: t(`标签不足（${s.hashtagCount}个），搜索流量损失严重`, `Only ${s.hashtagCount} hashtag(s) — major search traffic loss`), example: '#跨境支付 #数字支付 #全球支付卡 #海外生活 #数字游民', actions: [t('增加至5-8个标签', 'Increase to 5-8 hashtags'), t('策略：1个大流量词 + 3个精准词 + 1个地域词', 'Strategy: 1 high-volume + 3 precise + 1 geo tag'), t('标签放在正文末尾', 'Place tags at end of body')] });
    }
    if (!s.hasCTA) {
      opts.push({ priority: 'medium', category: t('互动引导', 'CTA'), direction: t('缺少互动引导，评论量将受影响', 'No CTA — comment volume will suffer'), example: '"姐妹们有没有同款推荐？👇" / "你们平时怎么做的，评论聊聊～"', actions: [t('在结尾加一句互动引导', 'Add a CTA question at end'), t('提问式引导效果最好', 'Question-style CTAs work best'), t('评论数是小红书CES模型的核心权重(4分)', 'Comments are the top CES weight (4 points)')] });
    }
  }

  if (platform === 'twitter') {
    if (content.length > 280) {
      opts.push({ priority: 'critical', category: t('字数超限', 'Character Limit'), direction: t(`超出280字符限制（当前${content.length}）`, `Exceeds 280 chars (${content.length})`), example: t('拆分为Thread（1/N），首推留最强钩子', 'Split into a Thread (1/N). Keep strongest hook in first tweet.'), actions: [t('压缩至280字符内', 'Shorten to 280 chars'), t('或拆分为Thread格式', 'Or split into Thread format'), t('首推用钩子+核心观点', 'First tweet = hook + core point')] });
    }
    if (!s.hasHook) {
      opts.push({ priority: 'high', category: t('开头钩子', 'Opening Hook'), direction: t('开头平淡，用户在前10个词就决定是否继续阅读', 'Weak opening. Users decide in 10 words whether to read on.'), example: t('"圈内人不会告诉你..." / "做了3年XX，最大教训是..."', '"Hot take: / Thread: / Nobody talks about..."'), actions: [t('首句用观点/数据/悬念开场', 'Lead with strongest point in first 10 words'), t('避免平淡开头，用 Hot take / Thread / 数据 开头', 'Use pattern interrupts: Hot take / Thread / PSA')] });
    }
  }

  if (platform === 'instagram') {
    if (s.hashtagCount < 10) {
      opts.push({ priority: 'high', category: t('标签策略', 'Hashtags'), direction: t(`仅${s.hashtagCount}个标签，Instagram发帖使用20-30个标签可获最高触达`, `Only ${s.hashtagCount} hashtags. Instagram posts with 20-30 hashtags get highest reach.`), example: t('混合搭配：5个大词(100M+) + 10个中词(10K+) + 15个长尾词(<10K)', 'Mix: 5 big (#crypto 100M+) + 10 mid (#cryptolife 10K+) + 15 niche (<10K)'), actions: [t('增加至20-30个标签', 'Increase to 20-30 hashtags'), t('金字塔策略：大词 + 中词 + 长尾词', 'Pyramid strategy: big + medium + niche'), t('标签放在正文末尾，用换行隔开', 'Place after a line break at end of caption'), t('定期轮换标签组避免限流', 'Rotate hashtag sets to avoid shadowban')] });
    }
    if (!s.hasHook) {
      opts.push({ priority: 'high', category: t('文案钩子', 'Caption Hook'), direction: t('前125个字符会显示在"...更多"之前，钩子必须在这里', 'First 125 chars appear before "...more". Your hook must land here.'), example: '"Stop paying international fees. Here\'s what I use instead 👇"', actions: [t('把钩子放在前125字符内', 'Front-load the hook in first 125 chars'), t('使用强力词：Stop / Secret / Finally / Truth', 'Use power words: Stop / Secret / Finally / Truth'), t('加入emoji打破视觉单调感', 'Add emoji to break visual monotony')] });
    }
  }

  if (platform === 'youtube') {
    if (title.length > 60) {
      opts.push({ priority: 'high', category: t('标题长度', 'Title Length'), direction: t(`标题过长（${title.length}字符），YouTube在手机端约60字符处截断`, `Title too long (${title.length} chars). YouTube truncates at ~60 chars on mobile.`), example: 'I Tested 7 Crypto Cards for 90 Days — Only 1 Won', actions: [t('缩短至60字符以内', 'Shorten to under 60 characters'), t('把最吸引人的词放在前面', 'Front-load the most compelling words'), t('公式：数字 + 强力词 + 好奇心缺口', 'Formula: numbers + power words + curiosity gap')] });
    }
    if (!s.titleHasNumber && title) {
      opts.push({ priority: 'medium', category: t('标题数字', 'Title Numbers'), direction: t('标题没有数字，含数字的标题点击率高36%', 'No numbers in title. Titles with numbers get 36% higher CTR.'), example: '"7 Tools..." / "I Saved $500/Month..." / "90-Day Test..."', actions: [t('在标题中加入具体数字', 'Add a specific number to the title'), t('奇数表现略优于偶数', 'Odd numbers slightly outperform even'), t('金额和时间段最有吸引力', 'Dollar amounts and time periods are most compelling')] });
    }
  }

  if (platform === 'facebook') {
    if (!s.hasQuestion) {
      opts.push({ priority: 'high', category: t('评论驱动', 'Comments Driver'), direction: t('帖子没有提问，提问是Facebook评论数的第一驱动力', 'No question in post. Questions are the #1 driver of Facebook comments.'), example: '"Have you ever felt this way?" / "What would you do?" / "Am I the only one?"', actions: [t('在结尾加一个开放式问题', 'End with an open-ended question'), t('Facebook算法重度依赖评论权重', 'Facebook algorithm heavily weights comment count'), t('避免是/否问题，开放性问题回复量多3倍', 'Open questions get 3x more replies than yes/no')] });
    }
  }

  return opts;
}

// --- Main Analyze Function ---

export function analyzeContent(title: string, content: string, platform: Platform, twitterLang?: 'zh' | 'en', uiLang: 'zh' | 'en' = 'en'): ScoreResult {
  const rules = PLATFORM_RULES[platform];
  const lang = platform === 'twitter'
    ? (twitterLang || detectLanguage(title + content))
    : (platform === 'xhs' ? 'zh' : 'en');

  const contentType = detectContentType(title, content);
  const { violations, complianceScore } = checkViolations(title, content, platform, lang, uiLang);
  const structure = analyzeStructure(title, content, platform, lang);

  const engagement = calcEngagement(platform, title, content, structure);
  const viral = calcViral(platform, structure, contentType);
  const readability = calcReadability(content, lang);
  const algorithm = calcAlgorithm(platform, title, content, structure, lang);
  const searchSEO = calcSearchSEO(platform, title, content, structure);
  const visualMatch = 60; // placeholder — needs image analysis
  const timing = 65; // placeholder — needs time-based logic

  const scores = { compliance: complianceScore, engagement, viral, readability, algorithm, searchSEO, visualMatch, timing };
  const overallScore = Math.round(
    complianceScore * 0.25 + engagement * 0.15 + viral * 0.1 +
    readability * 0.1 + algorithm * 0.2 + searchSEO * 0.1 +
    visualMatch * 0.05 + timing * 0.05
  );

  const status: ScoreResult['status'] = overallScore >= 75 ? 'safe' : overallScore >= 50 ? 'warning' : 'danger';
  const optimizations = generateOptimizations(platform, title, content, structure, violations, lang, uiLang);

  let hashSuggestions: string[] = [];
  if (platform === 'xhs') {
    const hs = rules.hashtagSuggestions as Record<string, string[]>;
    hashSuggestions = hs[contentType] || hs['general'] || [];
  } else if (platform === 'twitter') {
    const hs = rules.hashtagSuggestions as { zh: Record<string, string[]>; en: Record<string, string[]> };
    const langHs = lang === 'zh' ? hs.zh : hs.en;
    hashSuggestions = langHs[contentType] || langHs['general'] || [];
  } else {
    const hs = rules.hashtagSuggestions as Record<string, string[]>;
    hashSuggestions = hs[contentType] || hs['general'] || [];
  }

  let formulas: { formula: string; example: string; why: string }[];
  if (platform === 'twitter') {
    const vf = rules.viralFormulas as { zh: { formula: string; example: string; why: string }[]; en: { formula: string; example: string; why: string }[] };
    formulas = lang === 'zh' ? vf.zh : vf.en;
  } else {
    formulas = rules.viralFormulas as { formula: string; example: string; why: string }[];
  }

  return {
    platform,
    platformName: rules.name,
    platformIcon: rules.icon,
    language: lang,
    scores,
    overallScore,
    status,
    violations,
    structure,
    contentType,
    optimizations,
    hashtagSuggestions: hashSuggestions,
    viralFormulas: formulas,
  };
}
