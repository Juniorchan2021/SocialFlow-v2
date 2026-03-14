/**
 * 速率限制模块 - API 调用限制
 * 每 IP 每 15 分钟最多 20 次请求
 */

// 存储 IP 请求记录 (在内存中，生产环境建议使用 Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// 配置
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 分钟
const RATE_LIMIT_MAX_REQUESTS = 20; // 最大请求数

/**
 * 获取客户端 IP 地址
 */
export function getClientIp(req: Request): string {
  // 尝试从各种 header 获取 IP
  const headers = req.headers;
  
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for 可能包含多个 IP，取第一个
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // 如果没有代理 header，返回一个标识符
  return 'unknown';
}

/**
 * 检查速率限制
 * @returns 对象包含是否允许请求、剩余次数和重置时间
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  // 如果没有记录或已过期，创建新记录
  if (!entry || now > entry.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, {
      count: 1,
      resetTime,
    });
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime,
      limit: RATE_LIMIT_MAX_REQUESTS,
    };
  }
  
  // 增加计数
  entry.count++;
  
  // 检查是否超过限制
  const allowed = entry.count <= RATE_LIMIT_MAX_REQUESTS;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    limit: RATE_LIMIT_MAX_REQUESTS,
  };
}

/**
 * 清理过期的速率限制记录
 * 建议定期调用以释放内存
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * 获取速率限制响应头
 */
export function getRateLimitHeaders(result: {
  remaining: number;
  resetTime: number;
  limit: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  };
}
