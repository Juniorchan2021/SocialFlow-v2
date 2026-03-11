import type { Metadata } from 'next';
import GuidePage from '@/components/GuidePage';

export const metadata: Metadata = {
  title: 'Instagram Hashtag Strategy 2026 — Complete Guide | SocialFlow',
  description: 'Master Instagram hashtags with the pyramid strategy. Learn which hashtags drive Explore page reach, how to avoid shadowbans, and optimize your hashtag mix.',
  keywords: 'Instagram hashtag strategy,Instagram hashtag guide 2026,Instagram Explore algorithm,Instagram shadowban hashtags,IG hashtag tips',
};

export default function IgHashtagsPage() {
  return (
    <GuidePage
      icon="📸"
      title="Instagram Hashtag Strategy 2026 — Complete Guide"
      description="The definitive guide to Instagram hashtags. Learn the pyramid strategy, avoid shadowban triggers, and maximize your Explore page reach."
      sections={[
        {
          title: '🏗 The Hashtag Pyramid Strategy',
          content: 'The most effective hashtag strategy uses a pyramid structure with 20-30 hashtags per post:',
          items: [
            'Top tier (5 tags): Big hashtags with 1M+ posts — #crypto #fintech #payments #investing #digitallife',
            'Mid tier (10 tags): Medium hashtags with 10K-1M posts — #cryptolife #digitalnomad #remotework #cryptopayments #fintechstartup',
            'Bottom tier (15 tags): Niche hashtags with <10K posts — #stablecoinpayment #cryptolifestyle #virtualcardpayment #crossborderpayment',
            'This pyramid ensures you compete for visibility at every level — niche tags for immediate reach, big tags for discovery potential',
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
          content: 'Using the same hashtags repeatedly signals spam to Instagram. Create 3-5 hashtag sets and rotate:',
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
          content: 'Track these metrics to optimize your hashtag strategy over time:',
          items: [
            'Reach from hashtags (Instagram Insights → Post insights → Impressions by source)',
            'Explore page appearances (Insights → Discovery → From Explore)',
            'Target: Hashtags should drive 30-50% of total impressions for growth accounts',
            'If hashtag reach drops suddenly, check for shadowban and rotate sets',
          ],
        },
      ]}
      relatedLinks={[
        { label: '小红书违规词大全', href: '/guide/xhs-rules' },
        { label: 'YouTube Thumbnail Guide', href: '/guide/yt-thumbnails' },
        { label: 'Instagram Templates', href: '/templates' },
      ]}
    />
  );
}
