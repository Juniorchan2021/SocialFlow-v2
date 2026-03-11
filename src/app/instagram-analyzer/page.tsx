import type { Metadata } from 'next';
import SEOLanding from '@/components/SEOLanding';

export const metadata: Metadata = {
  title: 'Instagram Caption Analyzer — Hashtag Checker | SocialFlow',
  description: 'Free Instagram caption analyzer. Check hashtag strategy, Explore page optimization, shadowban risk, and engagement potential.',
  keywords: 'Instagram caption analyzer,Instagram hashtag checker,Instagram shadowban check,Instagram Explore algorithm,IG engagement analyzer',
};

export default function InstagramAnalyzerPage() {
  return (
    <SEOLanding
      platformIcon="📸"
      platformName="Instagram"
      headline="Instagram Caption & Hashtag Analyzer"
      subheadline="Hashtag pyramid strategy · Explore page optimization · Shadowban detection · Image design feedback"
      ctaText="Analyze my Instagram post"
      features={[
        { icon: '#️⃣', title: 'Hashtag Pyramid Strategy', desc: 'Analyzes your hashtag mix: 5 big (100M+) + 10 mid (10K+) + 15 niche (<10K). Detects banned hashtags that trigger shadowban.' },
        { icon: '🔍', title: 'Explore Page Simulation', desc: 'Simulates Instagram Explore ranking signals: caption hook, hashtag strategy, engagement drivers, saves, and comment potential.' },
        { icon: '🖼', title: 'Image Design Analysis', desc: 'AI-powered visual analysis: 4:5 composition, color harmony, text overlay readability, TikTok watermark detection, scroll-stop power.' },
        { icon: '📝', title: 'Caption Structure Check', desc: 'Checks first 125 chars (before "...more"), CTA placement, emoji distribution, and overall caption flow.' },
        { icon: '🔥', title: 'Viral Templates', desc: 'POV hooks, Save-worthy tips, Myth vs Reality carousels — proven Instagram content formulas.' },
        { icon: '✍️', title: 'AI Caption Rewrite', desc: 'Compliance fix, Algorithm boost, or Viral rewrite — one-click caption optimization.' },
      ]}
      faqs={[
        { q: 'How many hashtags should I use?', a: 'Research shows 20-30 hashtags get the highest reach. Use a pyramid: 5 big tags (#crypto, 100M+), 10 mid (#cryptolife, 10K-1M), 15 niche (#stablecoinpayment, <10K). Rotate sets to avoid shadowban.' },
        { q: 'Does it detect shadowban risks?', a: 'Yes. It checks for banned hashtags, excessive identical hashtags, engagement bait patterns, and TikTok watermarks — all common shadowban triggers.' },
        { q: 'What image formats are supported?', a: 'JPEG, PNG, WebP, and GIF. You can paste from clipboard (Ctrl+V) or drag and drop. Up to 9 images per analysis.' },
        { q: 'What is scroll-stop power?', a: 'It measures how likely your image is to make someone stop scrolling in their feed. Higher contrast, bold colors, clear subjects, and emotional faces score higher.' },
      ]}
    />
  );
}
