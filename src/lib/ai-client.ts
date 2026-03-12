import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function aiAnalyzeContent(
  title: string,
  content: string,
  platform: string,
  platformName: string,
  lang: 'zh' | 'en',
  violationSummary: string,
  contentType: string,
  uiLang: 'zh' | 'en' = 'en',
): Promise<{
  contextualRisk: string;
  aiInsight: string;
  rewriteTitle: string;
  rewriteContent: string;
  additionalTips: string[];
} | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const respondZh = uiLang === 'zh';

  const prompt = respondZh
    ? `你是一位专业的${platformName}内容运营专家，精通平台算法和合规规则。

待检测内容（${lang === 'en' ? '英文内容' : '中文内容'}）：
标题：${title || '（无标题）'}
正文：${content}
内容类型：${contentType}
规则引擎已检出的违规词：${violationSummary}

请用中文进行AI深度分析。改写后的标题和正文保持原内容语言（${lang === 'en' ? '英文' : '中文'}），但评价和建议用中文。仅返回JSON：
{
  "contextualRisk": "low/medium/high",
  "aiInsight": "对内容合规风险和增长潜力的1-2句中文专业评价",
  "rewriteTitle": "优化后的标题（保持${lang === 'en' ? '英文' : '中文'}，适合${platformName}搜索）",
  "rewriteContent": "优化后的正文（保持${lang === 'en' ? '英文' : '中文'}，修复违规、提升互动性、保留原意）",
  "additionalTips": ["中文建议1", "中文建议2", "中文建议3"]
}`
    : `You are an expert ${platformName} content strategist specializing in compliance and engagement optimization.

Content to analyze:
Title: ${title || '(none)'}
Content: ${content}
Content type: ${contentType}
Rule-based violations detected: ${violationSummary}

Return ONLY valid JSON:
{
  "contextualRisk": "low/medium/high",
  "aiInsight": "1-2 sentence professional assessment of compliance risk and growth potential",
  "rewriteTitle": "Optimized title for ${platformName}",
  "rewriteContent": "Improved content (fix violations, boost engagement, preserve intent)",
  "additionalTips": ["Specific tip 1", "tip 2", "tip 3"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = (message.content[0] as { type: string; text: string }).text
      .replace(/```json\n?|\n?```/g, '')
      .trim();
    return JSON.parse(text);
  } catch (err) {
    console.error(`AI analysis failed [${platform}]:`, err);
    return null;
  }
}

export async function aiAnalyzeImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
  platform: string,
  platformName: string,
  contentType: string,
  title: string,
  lang: 'zh' | 'en',
  uiLang: 'zh' | 'en' = 'en',
): Promise<{
  compliance: { overallRisk: string; issues: { type: string; severity: string; location: string; description: string; action: string }[]; safeToPublish: boolean };
  design: { designScore: number; scrollStopPower: number; feedback: string; topActions: string[]; styleReferences: { name: string; description: string }[] };
} | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const respondZh = uiLang === 'zh';

  const prompt = respondZh
    ? `你同时是：1) 社媒合规审核专家 2) 顶级平面设计总监（曾服务Apple/Nike级品牌）

请用中文分析这张${platformName}配图，返回两部分分析。

目标平台：${platformName}
文案标题：${title || '无'}
内容类型：${contentType}

仅返回JSON（所有文本字段用中文）：
{
  "compliance": {
    "overallRisk": "low/medium/high",
    "issues": [{"type": "watermark/qrcode/brand/sensitive/misleading/text_violation", "severity": "critical/high/medium/low", "location": "位置描述", "description": "具体问题", "action": "修复建议"}],
    "safeToPublish": true/false
  },
  "design": {
    "designScore": 0-100,
    "scrollStopPower": 0-100,
    "feedback": "2-3句中文专业设计评价",
    "topActions": ["中文可执行设计建议1", "建议2", "建议3", "建议4"],
    "styleReferences": [{"name": "参考风格名", "description": "为什么适合这个内容"}]
  }
}`
    : `You are simultaneously: 1) A social media compliance expert 2) An elite design director (Apple/Nike-tier brands)

Analyze this ${platformName} image. Return two-part analysis.

Target platform: ${platformName}
Post title: ${title || 'none'}
Content type: ${contentType}

Return ONLY valid JSON:
{
  "compliance": {
    "overallRisk": "low/medium/high",
    "issues": [{"type": "watermark/qrcode/brand/sensitive/misleading/text_violation", "severity": "critical/high/medium/low", "location": "location description", "description": "specific issue", "action": "fix suggestion"}],
    "safeToPublish": true/false
  },
  "design": {
    "designScore": 0-100,
    "scrollStopPower": 0-100,
    "feedback": "2-3 sentence professional design assessment",
    "topActions": ["Most important actionable design suggestion 1", "2", "3", "4"],
    "styleReferences": [{"name": "Style name", "description": "Why it fits this content"}]
  }
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: prompt },
        ],
      }],
    });
    const text = (message.content[0] as { type: string; text: string }).text
      .replace(/```json\n?|\n?```/g, '')
      .trim();
    return JSON.parse(text);
  } catch (err) {
    console.error(`Image analysis failed [${platform}]:`, err);
    return null;
  }
}

export async function aiRewrite(
  title: string,
  content: string,
  platform: string,
  platformName: string,
  lang: 'zh' | 'en',
  mode: 'compliance' | 'algorithm' | 'viral',
  uiLang: 'zh' | 'en' = 'en',
): Promise<{ rewrittenTitle: string; rewrittenContent: string; changes: string[] } | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const respondZh = uiLang === 'zh';

  const modeInstructions = {
    compliance: respondZh
      ? '修复所有违规内容，替换为合规表述，保留原意和风格'
      : 'Fix all compliance violations, replace with compliant alternatives, preserve meaning and style',
    algorithm: respondZh
      ? `针对${platformName}算法优化：加钩子词、优化标签、增加互动引导、调整结构`
      : `Optimize for ${platformName} algorithm: add hooks, optimize hashtags, add CTAs, improve structure`,
    viral: respondZh
      ? `用爆文公式重写标题和开头，制造情绪张力和好奇心缺口，保留核心信息`
      : `Rewrite title and opening using viral formulas. Create emotional tension and curiosity gaps. Preserve core message.`,
  };

  const contentLangNote = lang === 'en' ? (respondZh ? '英文' : 'English') : (respondZh ? '中文' : 'Chinese');

  const prompt = respondZh
    ? `你是${platformName}顶级内容运营专家。
任务：${modeInstructions[mode]}

原标题：${title || '（无）'}
原正文：${content}

重要：改写后的标题和正文保持原内容语言（${contentLangNote}），但changes修改说明用中文。
仅返回JSON：
{"rewrittenTitle": "改写后标题（${contentLangNote}）", "rewrittenContent": "改写后正文（${contentLangNote}）", "changes": ["中文修改说明1", "中文修改说明2", "中文修改说明3"]}`
    : `You are a top-tier ${platformName} content strategist.
Task: ${modeInstructions[mode]}

Original title: ${title || '(none)'}
Original content: ${content}

Return ONLY valid JSON:
{"rewrittenTitle": "Rewritten title", "rewrittenContent": "Rewritten content", "changes": ["Specific change 1", "change 2", "change 3"]}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = (message.content[0] as { type: string; text: string }).text
      .replace(/```json\n?|\n?```/g, '')
      .trim();
    return JSON.parse(text);
  } catch (err) {
    console.error(`Rewrite failed [${platform}]:`, err);
    return null;
  }
}
