import type { Metadata } from 'next';
import SEOLanding from '@/components/SEOLanding';

export const metadata: Metadata = {
  title: 'Twitter Content Checker — Tweet Analyzer | SocialFlow',
  description: 'Free Twitter/X content checker. Analyze tweets for compliance, engagement potential, viral probability. Supports Chinese and English accounts.',
  keywords: 'Twitter content checker,tweet analyzer,Twitter compliance,Twitter algorithm,tweet optimization,Twitter thread analyzer',
};

export default function TwitterCheckerPage() {
  return (
    <SEOLanding
      platformIcon="🐦"
      platformName="Twitter / X"
      headline="Twitter / X Content Checker"
      subheadline="Compliance check · Algorithm simulation · Viral prediction · A/B title testing — for both Chinese and English accounts"
      ctaText="Analyze my tweet for free"
      features={[
        { icon: '🌐', title: 'Dual Language Support', desc: 'Separate rule sets for Chinese and English Twitter accounts. Auto-detect language or manually switch between 中文号 and English account.' },
        { icon: '📏', title: 'Thread Optimizer', desc: 'Analyzes thread structure, hook strength, and optimal character usage. Suggests splitting long content into high-impact threads.' },
        { icon: '🎯', title: 'Algorithm Simulation', desc: 'Simulates Twitter recommendation signals: hook quality, engagement drivers, hashtag strategy, and "For You" feed eligibility.' },
        { icon: '🔥', title: 'Viral Formula Library', desc: 'Hot take, Thread, Data shock, PSA formulas — tested patterns that drive retweets and quotes.' },
        { icon: '✍️', title: 'AI Smart Rewrite', desc: 'Three modes: Compliance fix, Algorithm boost, Viral rewrite. One-click optimization.' },
        { icon: '📊', title: '8-Dimension Scoring', desc: 'Compliance, Engagement, Viral, Readability, Algorithm, SEO, Visual, Timing — comprehensive radar chart.' },
      ]}
      faqs={[
        { q: 'Does it support Chinese Twitter accounts?', a: 'Yes. SocialFlow has separate rule sets for Chinese (中文号) and English accounts. Chinese accounts get Chinese violation keywords, hooks, CTAs, and viral formulas. English accounts get English-specific rules.' },
        { q: 'How does the thread analyzer work?', a: 'It checks thread structure (1/N format), hook strength in the first tweet, CTA in the last tweet, optimal character count (80-250 chars), and hashtag placement.' },
        { q: 'Is it free?', a: 'Completely free. No registration required. Just paste your tweet and get instant analysis.' },
        { q: 'What compliance rules does it check?', a: 'Twitter global policies: hate speech, manipulation, fake engagement, ban evasion. Plus engagement bait detection (RT for RT, F4F) and minor issues (link in bio).' },
      ]}
    />
  );
}
