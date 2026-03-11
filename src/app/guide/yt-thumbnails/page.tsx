import type { Metadata } from 'next';
import GuidePage from '@/components/GuidePage';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Best Practices 2026 — Design Guide | SocialFlow',
  description: 'Complete YouTube thumbnail design guide. Learn face presence, text rules, color psychology, and high-CTR patterns that boost clicks by 30%+.',
  keywords: 'YouTube thumbnail best practices,YouTube thumbnail design,YouTube CTR optimization,YouTube thumbnail tips 2026,video thumbnail guide',
};

export default function YtThumbnailsPage() {
  return (
    <GuidePage
      icon="▶️"
      title="YouTube Thumbnail Best Practices 2026"
      description="Your thumbnail is the single most important factor for click-through rate. This guide covers everything from face presence to color psychology."
      sections={[
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
      ]}
      relatedLinks={[
        { label: '小红书违规词大全', href: '/guide/xhs-rules' },
        { label: 'Instagram Hashtag Strategy', href: '/guide/ig-hashtags' },
        { label: 'YouTube Templates', href: '/templates' },
      ]}
    />
  );
}
