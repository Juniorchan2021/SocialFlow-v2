import type { Metadata } from 'next';
import SEOLanding from '@/components/SEOLanding';

export const metadata: Metadata = {
  title: 'YouTube Title Analyzer — Thumbnail Checker | SocialFlow',
  description: 'Free YouTube title analyzer and thumbnail checker. CTR prediction, SEO optimization, description analysis. A/B title testing with AI.',
  keywords: 'YouTube title analyzer,YouTube thumbnail checker,YouTube CTR optimizer,YouTube SEO tool,YouTube title generator,video title tester',
};

export default function YouTubeTitlePage() {
  return (
    <SEOLanding
      platformIcon="▶️"
      platformName="YouTube"
      headline="YouTube Title & Thumbnail Analyzer"
      subheadline="CTR prediction · A/B title testing · Description SEO · Thumbnail design analysis"
      ctaText="Analyze my YouTube title"
      features={[
        { icon: '🎯', title: 'CTR Formula Analysis', desc: 'Checks title against proven CTR formula: Number + Power word + Curiosity gap ≤ 60 chars. Titles with this pattern get 36% higher CTR.' },
        { icon: '🔄', title: 'A/B Title Testing', desc: 'Compare 2-3 title options side by side. Each scored on hook strength, curiosity gap, emotional pull. AI generates an optimized 4th option.' },
        { icon: '🖼', title: 'Thumbnail Analysis', desc: 'AI checks: face presence (+30% CTR), text readability, color contrast, background complexity, emotional expression, and high-click colors.' },
        { icon: '📝', title: 'Description SEO', desc: 'Analyzes first 2 lines (visible in search), keyword density, timestamp format, and link placement.' },
        { icon: '🏷', title: 'Tag Optimization', desc: 'Checks tag coverage (5-15 recommended), keyword placement priority, and relevance to title and description.' },
        { icon: '🔥', title: 'Viral Prediction', desc: 'Analyzes formula match, emotional tension, hook strength, and content type to predict viral probability.' },
      ]}
      faqs={[
        { q: 'What makes a good YouTube title?', a: 'The winning formula: Number + Power word + Curiosity gap in ≤60 characters. Example: "I Tested 7 Crypto Cards for 90 Days — Only 1 Was Worth It". Titles with numbers get 36% higher CTR. Odd numbers perform slightly better.' },
        { q: 'How does thumbnail analysis work?', a: 'Our AI checks for face presence (30% CTR boost), text size (≥1/4 of image height), color contrast (complementary colors), background simplicity, emotional expression intensity, and text word count (≤5 words).' },
        { q: 'What is A/B title testing?', a: 'Input 2-3 alternative titles. Each gets scored on hook strength, curiosity gap, and emotional pull. We rank them and generate an AI-optimized 4th title combining the best elements.' },
        { q: 'Does it check YouTube compliance?', a: 'Yes. Checks community guidelines, copyright risk signals, COPPA concerns, demonetization triggers (guaranteed profit claims), and misleading clickbait.' },
      ]}
    />
  );
}
