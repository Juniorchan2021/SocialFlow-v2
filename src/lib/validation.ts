import { z } from 'zod';

// 平台类型定义
export type Platform = 'xiaohongshu' | 'weibo' | 'twitter' | 'douyin' | 'bilibili' | 'instagram';

// 支持的平台列表
export const VALID_PLATFORMS: Platform[] = [
  'xiaohongshu',
  'weibo',
  'twitter',
  'douyin',
  'bilibili',
  'instagram',
];

// 语言类型
export type UILang = 'zh' | 'en';
export type ContentLang = 'zh' | 'en';

// 改写模式
export type RewriteMode = 'compliance' | 'algorithm' | 'viral';

// 分析请求验证 Schema
export const analyzeRequestSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题不能超过200字符')
    .optional()
    .or(z.literal('')),
  content: z.string()
    .min(1, '内容不能为空')
    .max(10000, '内容不能超过10000字符'),
  platforms: z.array(z.string())
    .min(1, '至少选择一个平台')
    .max(10, '最多选择10个平台')
    .refine(
      (platforms) => platforms.every(p => VALID_PLATFORMS.includes(p as Platform)),
      {
        message: `包含无效平台，有效平台: ${VALID_PLATFORMS.join(', ')}`,
      }
    ),
  twitterLang: z.enum(['zh', 'en']).optional(),
  uiLang: z.enum(['zh', 'en']).default('en'),
});

// 改写请求验证 Schema
export const rewriteRequestSchema = z.object({
  title: z.string()
    .max(200, '标题不能超过200字符')
    .optional()
    .or(z.literal('')),
  content: z.string()
    .min(1, '内容不能为空')
    .max(10000, '内容不能超过10000字符'),
  platform: z.string()
    .min(1, '平台不能为空')
    .refine(
      (p) => VALID_PLATFORMS.includes(p as Platform),
      {
        message: `无效平台，有效平台: ${VALID_PLATFORMS.join(', ')}`,
      }
    ),
  platformName: z.string().optional(),
  lang: z.enum(['zh', 'en']).optional().default('en'),
  mode: z.enum(['compliance', 'algorithm', 'viral']),
  uiLang: z.enum(['zh', 'en']).optional().default('en'),
});

// 图片分析请求验证 Schema
export const imageAnalyzeRequestSchema = z.object({
  imageBase64: z.string()
    .min(100, '图片数据无效')
    .max(10000000, '图片数据过大'),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  platform: z.enum(VALID_PLATFORMS as [string, ...string[]]),
  platformName: z.string().optional(),
  contentType: z.string().min(1),
  title: z.string().max(200).optional().or(z.literal('')),
  lang: z.enum(['zh', 'en']).optional().default('en'),
  uiLang: z.enum(['zh', 'en']).optional().default('en'),
});

// 验证函数
export function validateAnalyzeRequest(data: unknown) {
  return analyzeRequestSchema.safeParse(data);
}

export function validateRewriteRequest(data: unknown) {
  return rewriteRequestSchema.safeParse(data);
}

export function validateImageAnalyzeRequest(data: unknown) {
  return imageAnalyzeRequestSchema.safeParse(data);
}

// 格式化验证错误
export function formatValidationErrors(error: z.ZodError): string {
  return error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
}
