import type { Metadata } from 'next';
import GuidePage from '@/components/GuidePage';

export const metadata: Metadata = {
  title: '小红书违规词大全 2026 — 限流原因与规避方法 | SocialFlow',
  description: '最全小红书违规词列表，涵盖严重/高/中/低四级风险词。了解限流原因，掌握合规替代表述，crypto行业专用规避指南。',
  keywords: '小红书违规词大全,小红书限流原因,小红书敏感词2026,小红书违禁词,小红书合规,小红书crypto',
};

const RELATED = [
  { labelZh: 'IG Hashtag策略', labelEn: 'IG Hashtag Strategy', href: '/guide/ig-hashtags' },
  { labelZh: 'YT 缩略图指南', labelEn: 'YT Thumbnail Guide', href: '/guide/yt-thumbnails' },
  { labelZh: '爆文模板', labelEn: 'Templates', href: '/templates' },
];

export default function XhsRulesPage() {
  return (
    <GuidePage
      icon="📕"
      zh={{
        title: '小红书违规词大全 2026 — 限流原因与规避方法',
        description: '整理了小红书最新的违规词库和限流规则，帮助你在发布前规避风险。特别针对crypto/支付卡行业给出了专用的合规替代表述。',
        sections: [
          {
            title: '🔴 严重违规词（直接封号/删帖）',
            content: '以下词汇在小红书上属于严重违规，一旦使用可能导致直接封号或帖子被删除：',
            items: [
              '加密货币相关：crypto、比特币、BTC、以太坊、ETH、币圈、交易所、USDT、挖矿、炒币',
              '博彩相关：赌博、博彩、赌场、开奖、彩票中奖',
              '传销相关：传销、资金盘、庞氏骗局、拉人头',
              '政治敏感词：（根据时事变化，建议使用工具实时检测）',
            ],
          },
          {
            title: '🟠 高风险词（限流/减少推荐）',
            content: '以下词汇会触发小红书的风控系统，导致笔记不被推荐或限制分发：',
            items: [
              '导流词：微信、VX、V信、威❤、二维码、加群、进群、私域、telegram、tg',
              '变体识别：小红书算法会识别各种变体，如"薇芯"、"wx"、"v❤"等',
              '规避方法：将引导文案改为"主页有联系方式"或使用小红书官方的群聊功能',
            ],
          },
          {
            title: '🟡 中风险词（降权/减少曝光）',
            content: '这些词不会直接导致删帖，但会影响笔记的推荐权重：',
            items: [
              '诱导互动：求赞、互粉、一键三连、双击、关注有礼、评论区抽奖',
              '规避方法：用自然的互动引导替代，如"你们觉得呢？"、"有同款推荐吗？"',
            ],
          },
          {
            title: '🟢 低风险词（可能触发审核）',
            content: '以下词汇偶尔会触发审核机制，但通常不会造成严重后果：',
            items: [
              '夸大宣传：最便宜、绝对有效、百分百、全网最低、保证效果',
              '规避方法：用"性价比高"替代"最便宜"，用"亲测有效"替代"百分百有效"',
            ],
          },
          {
            title: '💳 Crypto/支付卡行业合规替代表述',
            content: '如果你在做crypto或支付卡相关的内容推广，以下替代表述可以帮助通过审核：',
            items: [
              '"加密货币" → "数字支付" / "跨境支付"',
              '"区块链" → "分布式技术" / "数字化技术"',
              '"币圈" → "数字资产领域"',
              '"交易所" → "数字服务平台"',
              '"USDT/BTC" → "数字资产" / "虚拟支付工具"',
              '"挖矿" → "数字计算"',
              '配图中避免出现BTC/ETH等符号和crypto交易界面截图',
            ],
          },
          {
            title: '📊 小红书限流的常见原因',
            content: '除了违规词，以下行为也会导致限流：',
            items: [
              '笔记含有其他平台水印（抖音/快手水印）',
              '图片中嵌入二维码或外部链接',
              '频繁编辑已发布的笔记（建议发布后24h内不要修改）',
              '短时间内大量发布（建议每天不超过2-3条）',
              '内容与账号标签不匹配（美食号发科技内容）',
              '笔记被大量举报',
            ],
          },
        ],
      }}
      en={{
        title: 'Xiaohongshu (RED) Banned Words Guide 2026',
        description: 'Complete list of banned and restricted words on Xiaohongshu, covering 4 risk levels. Compliance tips for crypto/fintech industries.',
        sections: [
          {
            title: '🔴 Critical Violations (Instant Ban/Deletion)',
            content: 'These keywords will result in immediate account suspension or post deletion:',
            items: [
              'Crypto: crypto, Bitcoin, BTC, Ethereum, ETH, coin circle, exchange, USDT, mining',
              'Gambling: betting, casino, lottery, gambling',
              'MLM/Pyramid: MLM, Ponzi scheme, pyramid selling',
              'Political sensitive words (varies by current events)',
            ],
          },
          {
            title: '🟠 High Risk (Throttled/Reduced Reach)',
            content: 'These will trigger XHS risk control, reducing recommendation or distribution:',
            items: [
              'Traffic diversion: WeChat, VX, QR code, Telegram, TG, "join group"',
              'Variant detection: Algorithm detects phonetic variants and emoji substitutions',
              'Workaround: Use "contact info on profile" or XHS native group chat',
            ],
          },
          {
            title: '🟡 Medium Risk (Downranked)',
            content: 'Won\'t cause deletion but reduces recommendation weight:',
            items: [
              'Engagement bait: "Like for like", "Follow for follow", "Double tap"',
              'Workaround: Use natural engagement prompts like "What do you think?"',
            ],
          },
          {
            title: '🟢 Low Risk (May Trigger Review)',
            content: 'Occasionally triggers review but usually no serious consequence:',
            items: [
              'Exaggeration: "Cheapest ever", "100% effective", "Guaranteed results"',
              'Workaround: Replace with "great value" or "works well in my experience"',
            ],
          },
          {
            title: '💳 Crypto/Fintech Compliant Alternatives',
            content: 'Safe rephrasing for crypto and payment card content:',
            items: [
              '"Cryptocurrency" → "Digital payment" / "Cross-border payment"',
              '"Blockchain" → "Distributed technology"',
              '"Crypto circle" → "Digital asset space"',
              '"Exchange" → "Digital service platform"',
              '"USDT/BTC" → "Digital asset" / "Virtual payment tool"',
              '"Mining" → "Digital computing"',
              'Avoid BTC/ETH symbols and exchange screenshots in images',
            ],
          },
          {
            title: '📊 Other Common Throttling Causes',
            content: 'Beyond banned words, these behaviors also cause throttling:',
            items: [
              'Posts contain other platform watermarks (Douyin/Kuaishou)',
              'QR codes or external links embedded in images',
              'Frequently editing published posts (avoid edits within 24h)',
              'Posting too frequently (max 2-3 per day recommended)',
              'Content mismatch with account category',
              'Posts reported by multiple users',
            ],
          },
        ],
      }}
      relatedLinks={RELATED}
    />
  );
}
