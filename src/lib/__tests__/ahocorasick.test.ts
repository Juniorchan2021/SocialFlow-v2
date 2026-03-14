/** @jest-environment node */
import { AhoCorasick, createAhoCorasick } from '../ahocorasick';

describe('AhoCorasick', () => {
  test('should find all patterns in text', () => {
    const ac = createAhoCorasick(['比特币', '加密货币', 'btc']);
    const matches = ac.search('比特币和加密货币交易，btc价格');
    
    expect(matches).toHaveLength(3);
    expect(matches.map(m => m.pattern)).toContain('比特币');
    expect(matches.map(m => m.pattern)).toContain('加密货币');
    expect(matches.map(m => m.pattern)).toContain('btc');
  });

  test('should handle empty patterns', () => {
    const ac = createAhoCorasick([]);
    const matches = ac.search('任何内容');
    expect(matches).toHaveLength(0);
  });

  test('should be case insensitive', () => {
    const ac = createAhoCorasick(['Bitcoin', 'CRYPTO']);
    const matches = ac.search('bitcoin and crypto trading');
    
    expect(matches).toHaveLength(2);
  });

  test('should return unique matches with findMatches', () => {
    const ac = createAhoCorasick(['test']);
    const matches = ac.findMatches('test test test');
    
    expect(matches).toHaveLength(1);
    expect(matches[0]).toBe('test');
  });

  test('should check containsAny correctly', () => {
    const ac = createAhoCorasick(['bad', 'worse']);
    
    expect(ac.containsAny('this is bad content')).toBe(true);
    expect(ac.containsAny('this is good content')).toBe(false);
  });
});
