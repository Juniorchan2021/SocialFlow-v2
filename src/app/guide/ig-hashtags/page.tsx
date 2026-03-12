import type { Metadata } from 'next';
import GuidePage from '@/components/GuidePage';

export const metadata: Metadata = {
  title: 'Instagram Hashtag Strategy 2026 — Complete Guide | SocialFlow',
  description: 'Master Instagram hashtags with the pyramid strategy. Learn which hashtags drive Explore page reach, how to avoid shadowbans, and optimize your hashtag mix.',
  keywords: 'Instagram hashtag strategy,Instagram hashtag guide 2026,Instagram Explore algorithm,Instagram shadowban hashtags,IG hashtag tips',
};

const RELATED = [
  { labelZh: '小红书违规词大全', labelEn: 'XHS Banned Words', href: '/guide/xhs-rules' },
  { labelZh: 'YT 缩略图指南', labelEn: 'YT Thumbnail Guide', href: '/guide/yt-thumbnails' },
  { labelZh: 'IG 爆文模板', labelEn: 'IG Templates', href: '/templates' },
];

export default function IgHashtagsPage() {
  return (
    <GuidePage
      icon="📸"
      zh={{
        title: 'Instagram Hashtag 策略全指南 2026',
        description: '最全面的 Instagram 标签使用指南。掌握金字塔策略、规避影子封禁、最大化 Explore 页面曝光。',
        sections: [
          {
            title: '🏗 Hashtag 金字塔策略',
            content: '最有效的标签策略是使用金字塔结构，每条帖子 20-30 个标签：',
            items: [
              '顶层（5个）：百万级大标签 — #crypto #fintech #payments #investing #digitallife',
              '中层（10个）：万级中标签 — #cryptolife #digitalnomad #remotework #cryptopayments',
              '底层（15个）：千级利基标签 — #stablecoinpayment #cryptolifestyle #virtualcardpayment',
              '金字塔策略确保你在每个层级都有竞争力 — 利基标签带来即时曝光，大标签带来发现潜力',
            ],
          },
          {
            title: '⚠️ 影子封禁风险：被禁标签',
            content: '使用被禁或受限标签会严重限制帖子触达。Instagram 定期更新此列表。',
            items: [
              '使用前检查：一些看似正常的标签实际已被禁（如 #adulting 曾被禁）',
              '影子封禁迹象：帖子不出现在标签流中，非关注者触达突然下降',
              '恢复方法：删除被禁标签，等待24-48小时，暂停发帖一天',
              '预防措施：轮换标签组 — 不要每篇帖子都用完全相同的标签',
            ],
          },
          {
            title: '📍 标签放置策略',
            content: '标签的放置位置影响美观和算法效果：',
            items: [
              '方案A：放在正文中，用换行(.)隔开 — 所有内容集中在一处',
              '方案B：放在第一条评论 — 正文更简洁，算法效果相同',
              '关键：发布后30秒内添加标签，获得最大效果',
              '发布后不要编辑标签 — 可能重置算法排名',
            ],
          },
          {
            title: '🔄 标签轮换系统',
            content: '重复使用相同标签会被 Instagram 判定为垃圾行为。创建 3-5 个标签组并轮换：',
            items: [
              '组A：通用品牌标签（每周用2次）',
              '组B：产品专属标签（每周用2次）',
              '组C：热门/季节性标签（每周用1次）',
              '保持5个"核心"标签不变，轮换其余15-20个',
              '追踪哪组表现最好，加倍投入优胜组',
            ],
          },
          {
            title: '📊 标签调研方法',
            content: '如何为你的领域找到合适的标签：',
            items: [
              'Instagram 搜索：输入关键词，查看"相关"推荐',
              '竞品分析：查看你所在领域的头部账号使用哪些标签',
              'Explore 页面：留意你类目下热门帖子的标签',
              'SocialFlow 分析器：粘贴文案自动获取标签推荐',
            ],
          },
          {
            title: '📈 标签效果衡量',
            content: '追踪以下指标来持续优化标签策略：',
            items: [
              '标签带来的触达量（Instagram Insights → 帖子洞察 → 曝光来源）',
              'Explore 页面出现次数（Insights → 发现 → From Explore）',
              '目标：标签应贡献总曝光的30-50%（对增长期账号）',
              '如果标签触达突然下降，检查是否被影子封禁并轮换标签组',
            ],
          },
        ],
      }}
      en={{
        title: 'Instagram Hashtag Strategy 2026 — Complete Guide',
        description: 'The definitive guide to Instagram hashtags. Learn the pyramid strategy, avoid shadowban triggers, and maximize your Explore page reach.',
        sections: [
          {
            title: '🏗 The Hashtag Pyramid Strategy',
            content: 'The most effective hashtag strategy uses a pyramid structure with 20-30 hashtags per post:',
            items: [
              'Top tier (5 tags): Big hashtags with 1M+ posts — #crypto #fintech #payments #investing #digitallife',
              'Mid tier (10 tags): Medium hashtags with 10K-1M posts — #cryptolife #digitalnomad #remotework #cryptopayments',
              'Bottom tier (15 tags): Niche hashtags with <10K posts — #stablecoinpayment #cryptolifestyle #virtualcardpayment',
              'This pyramid ensures you compete for visibility at every level',
            ],
          },
          {
            title: '⚠️ Shadowban Risk: Banned Hashtags',
            content: 'Using banned or restricted hashtags can severely limit your post reach. Instagram regularly updates this list.',
            items: [
              'Check before using: Some common-looking tags are actually banned (#adulting was banned at one point)',
              'Signs of shadowban: Posts not showing in hashtag feeds, sudden drop in reach from non-followers',
              'Recovery: Remove banned hashtags, wait 24-48 hours, avoid posting for a day',
              'Prevention: Rotate your hashtag sets — don\'t use identical hashtags on every post',
            ],
          },
          {
            title: '📍 Hashtag Placement Strategy',
            content: 'Where you place your hashtags matters for both aesthetics and algorithm:',
            items: [
              'Option A: In caption after a line break (.) — keeps everything in one place',
              'Option B: First comment — cleaner caption, same algorithmic effect',
              'Key: Post hashtags within 30 seconds of publishing for maximum impact',
              'Don\'t edit hashtags after posting — it can reset the algorithm ranking',
            ],
          },
          {
            title: '🔄 Hashtag Rotation System',
            content: 'Using the same hashtags repeatedly signals spam. Create 3-5 sets and rotate:',
            items: [
              'Set A: General brand hashtags (use 2x/week)',
              'Set B: Product-specific hashtags (use 2x/week)',
              'Set C: Trending/seasonal hashtags (use 1x/week)',
              'Keep 5 "core" hashtags consistent, rotate the other 15-20',
              'Track which sets perform best and double down on winners',
            ],
          },
          {
            title: '📊 Hashtag Research Tools & Methods',
            content: 'How to find the right hashtags for your niche:',
            items: [
              'Instagram search: Type your keyword, see "Related" suggestions',
              'Competitor analysis: Check what top accounts in your niche use',
              'Explore page: Note hashtags on trending posts in your category',
              'SocialFlow analyzer: Paste your caption and get hashtag recommendations automatically',
            ],
          },
          {
            title: '📈 Measuring Hashtag Performance',
            content: 'Track these metrics to optimize your hashtag strategy:',
            items: [
              'Reach from hashtags (Instagram Insights → Post insights → Impressions by source)',
              'Explore page appearances (Insights → Discovery → From Explore)',
              'Target: Hashtags should drive 30-50% of total impressions for growth accounts',
              'If hashtag reach drops suddenly, check for shadowban and rotate sets',
            ],
          },
        ],
      }}
      relatedLinks={RELATED}
    />
  );
}
