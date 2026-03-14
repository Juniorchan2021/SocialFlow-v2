// 全局常量定义
// 所有配置集中管理，避免魔法数字

// 评分权重配置
export const SCORE_WEIGHTS = {
  compliance: 0.25,    // 合规性 25%
  algorithm: 0.20,     // 算法适配 20%
  engagement: 0.15,    // 互动性 15%
  viral: 0.10,         // 病毒潜力 10%
  readability: 0.10,   // 可读性 10%
  searchSEO: 0.10,     // 搜索SEO 10%
  visualMatch: 0.05,   // 视觉匹配 5%
  timing: 0.05,        // 发布时机 5%
} as const;

// 违规等级扣分
export const VIOLATION_PENALTIES = {
  critical: 50,
  high: 25,
  medium: 15,
  low: 8,
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  ttl: 60 * 60 * 1000,        // 1小时 (毫秒)
  cleanupInterval: 60 * 60 * 1000, // 每小时清理
  maxSize: 1000,              // 最大缓存条目
} as const;

// 速率限制配置
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,   // 15分钟
  maxRequests: 20,            // 每窗口最大请求数
} as const;

// 输入限制
export const INPUT_LIMITS = {
  titleMin: 1,
  titleMax: 200,
  contentMin: 1,
  contentMax: 10000,
  platformsMin: 1,
  platformsMax: 5,
} as const;

// AI 模型配置
export const AI_MODELS = {
  contentAnalysis: 'claude-haiku-4-5-20251001',
  imageAnalysis: 'claude-sonnet-4-20250514',
  rewrite: 'claude-haiku-4-5-20251001',
  maxTokens: {
    content: 2000,
    image: 2000,
    rewrite: 3000,
  },
} as const;

// 平台配置
export const PLATFORM_CONFIG = {
  xhs: {
    name: '小红书',
    icon: '📕',
    titleMin: 10,
    titleMax: 20,
    contentMin: 150,
    contentMax: 500,
    hashtagsMin: 3,
    hashtagsMax: 8,
    emojiMin: 2,
    emojiMax: 10,
  },
  twitter: {
    name: 'Twitter/X',
    icon: '🐦',
    charLimit: 280,
    hashtagsMin: 1,
    hashtagsMax: 2,
  },
  instagram: {
    name: 'Instagram',
    icon: '📷',
    contentMin: 50,
    contentMax: 300,
    hashtagsMin: 10,
    hashtagsMax: 30,
  },
  facebook: {
    name: 'Facebook',
    icon: '👍',
    contentMin: 40,
    contentMax: 200,
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    titleMin: 30,
    titleMax: 60,
    contentMin: 200,
  },
} as const;

// 日志级别
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = typeof LOG_LEVELS[number];

// 内容类型
export const CONTENT_TYPES = [
  'product_review',
  'tutorial', 
  'lifestyle',
  'promotion',
  'opinion',
  'news',
  'entertainment',
  'general',
] as const;
export type ContentType = typeof CONTENT_TYPES[number];

// 平台列表
export const PLATFORMS = ['xhs', 'twitter', 'instagram', 'facebook', 'youtube'] as const;
export type Platform = typeof PLATFORMS[number];
