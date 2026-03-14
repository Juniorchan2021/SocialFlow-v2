/**
 * 安全工具模块 - XSS 防护和 HTML 转义
 */

// HTML 特殊字符映射表
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

// HTML 转义正则表达式
const HTML_ESCAPE_REGEX = /[&<>"'`=/]/g;

/**
 * HTML 转义函数 - 防止 XSS 攻击
 * 将特殊字符转换为 HTML 实体
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') {
    return String(input);
  }
  return input.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * 深度转义对象中的所有字符串值
 * 递归遍历对象，对所有字符串值进行 HTML 转义
 */
export function deepEscape<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return escapeHtml(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepEscape(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const escaped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      escaped[key] = deepEscape(value);
    }
    return escaped as T;
  }

  return obj;
}

/**
 * 创建安全的 JSON 响应
 * 在返回前端之前对所有字符串进行转义
 */
export function createSafeResponse<T>(data: T): T {
  return deepEscape(data);
}

/**
 * 验证和清理 URL
 * 防止 javascript: 等危险协议
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;
  
  const trimmed = url.trim();
  const lowerUrl = trimmed.toLowerCase();
  
  // 阻止危险协议
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
    return null;
  }
  
  return trimmed;
}

/**
 * 清理输入字符串 - 移除潜在危险字符
 */
export function sanitizeInput(input: string, maxLength = 10000): string {
  if (typeof input !== 'string') return '';
  
  // 限制长度
  let sanitized = input.slice(0, maxLength);
  
  // 移除 null 字节
  sanitized = sanitized.replace(/\x00/g, '');
  
  // 移除控制字符（保留换行和制表符）
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  return sanitized.trim();
}

/**
 * 验证是否为有效的 Base64 字符串
 */
export function isValidBase64(str: string): boolean {
  try {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str) && str.length % 4 === 0;
  } catch {
    return false;
  }
}
