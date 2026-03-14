/** @jest-environment node */
import { escapeHtml, deepEscape } from '../security';

describe('Security', () => {
  describe('escapeHtml', () => {
    test('should escape HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const output = escapeHtml(input);
      
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;script&gt;');
    });

    test('should escape special characters', () => {
      const input = 'Test & "quotes" \'single\'';
      const output = escapeHtml(input);
      
      expect(output).toContain('&amp;');
      expect(output).toContain('&quot;');
    });

    test('should handle empty string', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('deepEscape', () => {
    test('should escape nested objects', () => {
      const input = {
        title: '<script>alert(1)</script>',
        content: 'Safe content',
        nested: {
          html: '<img src=x onerror=alert(1)>',
        },
      };
      
      const output = deepEscape(input);
      
      expect(output.title).toContain('&lt;script&gt;');
      expect(output.nested.html).toContain('&lt;img');
    });

    test('should handle arrays', () => {
      const input = ['<b>bold</b>', '<i>italic</i>'];
      const output = deepEscape(input);
      
      expect(output[0]).toContain('&lt;b&gt;');
      expect(output[1]).toContain('&lt;i&gt;');
    });
  });
});
