/** @jest-environment node */
import { getCache, setCache, generateCacheKey } from '../cache';

describe('Cache', () => {
  beforeEach(() => {
    // 清理缓存
    jest.clearAllMocks();
  });

  test('should store and retrieve data', async () => {
    const key = 'test-key';
    const data = { test: 'data', number: 123 };
    
    await setCache(key, data);
    const retrieved = await getCache<typeof data>(key);
    
    expect(retrieved).toEqual(data);
  });

  test('should return null for non-existent key', async () => {
    const result = await getCache('non-existent');
    expect(result).toBeNull();
  });

  test('should generate consistent cache keys', () => {
    const key1 = generateCacheKey('prefix', 'part1', 'part2');
    const key2 = generateCacheKey('prefix', 'part1', 'part2');
    
    expect(key1).toBe(key2);
  });

  test('should generate different keys for different inputs', () => {
    const key1 = generateCacheKey('prefix', 'a', 'b');
    const key2 = generateCacheKey('prefix', 'a', 'c');
    
    expect(key1).not.toBe(key2);
  });
});
