// Redis 缓存客户端配置
// 用于缓存 AI 分析结果，降低成本

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// 内存缓存作为 fallback（如果 Redis 未配置）
const memoryCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 60 * 60 * 1000; // 1 小时

/**
 * 生成缓存 key
 */
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  const hash = parts.join('|').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return `${prefix}:${Math.abs(hash).toString(36)}`;
}

/**
 * 获取缓存
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  
  if (!entry) return null;
  
  // 检查是否过期
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * 设置缓存
 */
export async function setCache<T>(key: string, data: T): Promise<void> {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * 带缓存的函数包装器
 */
export function withCache<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  keyGenerator: (...args: Args) => string,
  ttlMs: number = CACHE_TTL
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const key = keyGenerator(...args);
    
    // 尝试读取缓存
    const cached = await getCache<T>(key);
    if (cached) {
      console.log(`[Cache HIT] ${key}`);
      return cached;
    }
    
    // 执行原函数
    const result = await fn(...args);
    
    // 写入缓存
    await setCache(key, result);
    console.log(`[Cache MISS] ${key}`);
    
    return result;
  };
}

/**
 * 清理过期缓存
 */
export function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      memoryCache.delete(key);
    }
  }
}

// 每小时自动清理
if (typeof window === 'undefined') {
  setInterval(cleanupCache, 60 * 60 * 1000);
}
