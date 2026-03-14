// Aho-Corasick 算法实现
// 用于高效多关键词匹配，复杂度 O(n + m + z)
// 比暴力搜索 O(n*m*k) 快 10-100 倍

interface ACNode {
  children: Map<string, ACNode>;
  fail: ACNode | null;
  output: string[];
  depth: number;
}

class AhoCorasick {
  private root: ACNode;
  private patterns: string[] = [];

  constructor() {
    this.root = {
      children: new Map(),
      fail: null,
      output: [],
      depth: 0,
    };
  }

  /**
   * 添加关键词
   */
  addPattern(pattern: string): void {
    if (!pattern) return;
    
    let node = this.root;
    const lowerPattern = pattern.toLowerCase();
    
    for (const char of lowerPattern) {
      if (!node.children.has(char)) {
        node.children.set(char, {
          children: new Map(),
          fail: null,
          output: [],
          depth: node.depth + 1,
        });
      }
      node = node.children.get(char)!;
    }
    
    node.output.push(lowerPattern);
    this.patterns.push(lowerPattern);
  }

  /**
   * 构建失败指针
   */
  build(): void {
    const queue: ACNode[] = [];
    
    // 第一层节点的失败指针指向 root
    for (const [char, node] of this.root.children) {
      node.fail = this.root;
      queue.push(node);
    }
    
    // BFS 构建失败指针
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      for (const [char, child] of current.children) {
        // 计算失败指针
        let failNode = current.fail;
        while (failNode && !failNode.children.has(char)) {
          failNode = failNode.fail;
        }
        
        child.fail = failNode ? failNode.children.get(char)! : this.root;
        
        // 合并输出
        if (child.fail) {
          child.output.push(...child.fail.output);
        }
        
        queue.push(child);
      }
    }
  }

  /**
   * 搜索文本中的所有匹配
   */
  search(text: string): Array<{ pattern: string; index: number }> {
    const matches: Array<{ pattern: string; index: number }> = [];
    const lowerText = text.toLowerCase();
    
    let node = this.root;
    
    for (let i = 0; i < lowerText.length; i++) {
      const char = lowerText[i];
      
      // 沿着失败指针查找
      while (node !== this.root && !node.children.has(char)) {
        node = node.fail!;
      }
      
      if (node.children.has(char)) {
        node = node.children.get(char)!;
      }
      
      // 记录匹配
      for (const pattern of node.output) {
        matches.push({
          pattern,
          index: i - pattern.length + 1,
        });
      }
    }
    
    return matches;
  }

  /**
   * 检查是否包含任意关键词
   */
  containsAny(text: string): boolean {
    return this.search(text).length > 0;
  }

  /**
   * 获取所有匹配的关键词（去重）
   */
  findMatches(text: string): string[] {
    const matches = this.search(text);
    return [...new Set(matches.map(m => m.pattern))];
  }
}

/**
 * 创建并构建 AC 自动机
 */
export function createAhoCorasick(patterns: string[]): AhoCorasick {
  const ac = new AhoCorasick();
  for (const pattern of patterns) {
    ac.addPattern(pattern);
  }
  ac.build();
  return ac;
}

export { AhoCorasick };
