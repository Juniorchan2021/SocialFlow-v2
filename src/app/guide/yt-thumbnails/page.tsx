import type { Metadata } from 'next';
import GuidePage from '@/components/GuidePage';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Best Practices 2026 — Design Guide | SocialFlow',
  description: 'Complete YouTube thumbnail design guide. Learn face presence, text rules, color psychology, and high-CTR patterns that boost clicks by 30%+.',
  keywords: 'YouTube thumbnail best practices,YouTube thumbnail design,YouTube CTR optimization,YouTube thumbnail tips 2026',
};

const RELATED = [
  { labelZh: '小红书违规词大全', labelEn: 'XHS Banned Words', href: '/guide/xhs-rules' },
  { labelZh: 'IG Hashtag策略', labelEn: 'IG Hashtag Strategy', href: '/guide/ig-hashtags' },
  { labelZh: 'YT 爆款模板', labelEn: 'YT Templates', href: '/templates' },
];

export default function YtThumbnailsPage() {
  return (
    <GuidePage
      icon="▶️"
      zh={{
        title: 'YouTube 缩略图设计指南 2026',
        description: '缩略图是影响点击率的最关键因素。本指南涵盖人脸展示、文字规则、色彩心理学和高CTR设计模式。',
        sections: [
          {
            title: '👤 人脸展示：CTR +30%',
            content: '带有人脸的缩略图获得显著更多的点击。优化方法：',
            items: [
              '带有强烈表情的特写面部效果最佳',
              '表情优先级：夸张惊讶 > 兴奋 > 好奇 > 微笑 > 面无表情',
              '直视镜头产生心理"停留"效果',
              '如无人脸，使用一个占画面40%以上的大胆主体',
            ],
          },
          {
            title: '✏️ 文字规则：≤5 个词',
            content: '缩略图文字应该补充标题，而非重复标题：',
            items: [
              '最多5个词 — 观众在手机上只用0.3秒决定',
              '字号：文字应占缩略图高度的 ≥ 1/4',
              '字体：加粗无衬线体（Impact, Bebas Neue, Montserrat Bold）',
              '添加3px白色/深色描边确保在任何背景上都可读',
              '文字应回答"我为什么要点" — 而不是重复标题',
            ],
          },
          {
            title: '🎨 色彩心理学',
            content: '特定颜色组合在YouTube信息流中更抓眼球：',
            items: [
              '高点击色：黄色、红色、蓝色（按效果排序）',
              '低点击色：灰色、棕色、暗绿色',
              '使用互补色对：蓝+橙、紫+黄、红+青',
              '背景必须与文字和主体形成强对比',
              'YouTube界面是白色/暗色 — 避免纯白或极暗的缩略图（会融入背景）',
            ],
          },
          {
            title: '🖼 构图原则',
            content: '专业缩略图构图技巧：',
            items: [
              '三分法：将关键元素放在交叉点',
              '简化背景：模糊、暗化或去除干扰元素',
              '层次感：前景主体 + 中景文字 + 背景',
              '留白：在元素之间留出视觉"呼吸"空间',
              '尺寸：最小 1280x720px，始终 16:9 比例',
            ],
          },
          {
            title: '📐 标题+缩略图协同',
            content: '标题和缩略图应作为团队配合，而非互相重复：',
            items: [
              '缩略图 = 情感钩子（视觉好奇、惊讶、冲突）',
              '标题 = 信息钩子（数字、具体细节、承诺）',
              '错误示范：标题"7个拍摄技巧" + 缩略图文字"7个拍摄技巧"（重复）',
              '正确示范：标题"7个专业摄影师不会告诉你的技巧" + 缩略图：震惊表情 + "秘密技巧"',
              '缩略图创造情绪，标题提供上下文',
            ],
          },
          {
            title: '❌ 常见错误',
            content: '避免这些杀死点击率的常见错误：',
            items: [
              '文字太多（>5个词）— 手机上显得混乱',
              '对比度低 — 文字消失在背景中',
              '背景杂乱 — 没有清晰焦点',
              '主体太小 — 缩略图在信息流中很小（手机上仅 120x90px）',
              '通用素材图 — 观众能瞬间识别不真实的内容',
              '误导性缩略图 — 可能获得点击但损害观看时长和算法排名',
            ],
          },
        ],
      }}
      en={{
        title: 'YouTube Thumbnail Best Practices 2026',
        description: 'Your thumbnail is the single most important factor for click-through rate. This guide covers everything from face presence to color psychology.',
        sections: [
          {
            title: '👤 Face Presence: +30% CTR',
            content: 'Thumbnails with faces get significantly more clicks. Here\'s how to optimize:',
            items: [
              'Close-up faces with strong emotions outperform everything else',
              'Expression hierarchy: Exaggerated surprise > excitement > curiosity > smile > neutral',
              'Eye contact with camera creates a psychological "stop" effect',
              'If no face available, use a bold subject that fills 40%+ of the frame',
            ],
          },
          {
            title: '✏️ Text Rules: ≤5 Words',
            content: 'Thumbnail text should complement (not repeat) your title:',
            items: [
              'Maximum 5 words — viewers decide in 0.3 seconds on mobile',
              'Font size: Text should be ≥ 1/4 of thumbnail height',
              'Font choice: Bold sans-serif (Impact, Bebas Neue, Montserrat Bold)',
              'Add 3px white/dark outline for readability against any background',
              'Text should answer "Why should I click?" — not repeat the title',
            ],
          },
          {
            title: '🎨 Color Psychology for Clicks',
            content: 'Certain color combinations grab attention in YouTube\'s feed:',
            items: [
              'High-click colors: Yellow, Red, Blue (in that order)',
              'Low-click colors: Gray, Brown, Olive Green',
              'Use complementary pairs: Blue+Orange, Purple+Yellow, Red+Cyan',
              'Background should contrast strongly with text and subject',
              'YouTube\'s UI is white/dark — avoid white or very dark thumbnails that blend in',
            ],
          },
          {
            title: '🖼 Composition Principles',
            content: 'Professional thumbnail composition techniques:',
            items: [
              'Rule of thirds: Place key elements at intersection points',
              'Simplify background: Blur, darken, or remove distracting elements',
              'Depth: Layer foreground subject + midground text + background',
              'Negative space: Leave room for the eye to "rest" between elements',
              'Size: 1280x720px minimum, 16:9 ratio always',
            ],
          },
          {
            title: '📐 Title + Thumbnail Synergy',
            content: 'Your title and thumbnail should work as a team, not repeat each other:',
            items: [
              'Thumbnail = Emotional hook (visual curiosity, surprise, conflict)',
              'Title = Informational hook (numbers, specifics, promise)',
              'Bad: Title "7 Camera Tips" + Thumbnail text "7 Camera Tips" (redundant)',
              'Good: Title "7 Camera Tips Pros Won\'t Tell You" + Thumbnail: Shocked face + "SECRET TIPS"',
              'The thumbnail creates emotion, the title provides context',
            ],
          },
          {
            title: '❌ Common Thumbnail Mistakes',
            content: 'Avoid these common mistakes that kill CTR:',
            items: [
              'Too much text (>5 words) — looks cluttered on mobile',
              'Low contrast — text disappears into background',
              'Busy background — no clear focal point',
              'Small subject — thumbnail is tiny in most feeds (120x90px on mobile)',
              'Generic stock photos — viewers can spot inauthentic content instantly',
              'Misleading thumbnails — may get clicks but kills watch time and hurts algorithm ranking',
            ],
          },
        ],
      }}
      relatedLinks={RELATED}
    />
  );
}
