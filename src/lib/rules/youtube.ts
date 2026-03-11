export const YOUTUBE_RULES = {
  platform: 'youtube' as const,
  name: 'YouTube',
  icon: '▶️',
  language: 'en' as const,
  charLimits: { titleMin: 20, titleMax: 100, contentMin: 100, contentMax: 5000 },
  imageSpec: { ratio: '16:9', width: 1280, height: 720, maxImages: 1 },

  violations: {
    critical: { name: 'Community Guidelines Violation', color: '#FF3B30', keywords: ['hate speech','violence','harassment','dangerous acts','child safety','terrorism','graphic content','self-harm promotion','suicide instructions'] },
    high: { name: 'Demonetization Risk', color: '#FF9500', keywords: ['guaranteed profit','guaranteed returns','get rich quick','secret method to earn','make money fast','passive income guaranteed','financial freedom guaranteed','100% return'] },
    medium: { name: 'Misleading Content', color: '#FFCC00', keywords: ['clickbait','not what you think','you won\'t believe','shocking truth revealed','they don\'t want you to know','banned information','secret they hide'] },
    low: { name: 'Minor Concern', color: '#34C759', keywords: ['smash that like','hit subscribe','ring the bell','link in description','check description','don\'t forget to subscribe'] },
  },

  hooks: ['i tested','the truth about','nobody tells you','here\'s why','the real reason','what happened when','i was wrong about','stop doing this','the biggest mistake','finally revealed'],
  ctaPatterns: ['subscribe','like this video','comment below','share with','let me know','what do you think','leave a comment','hit the bell','check the link','watch next'],

  hashtagSuggestions: {
    product_review: ['#review','#honest','#comparison','#bestof','#tested'],
    tutorial: ['#howto','#tutorial','#guide','#explained','#stepbystep'],
    general: ['#crypto','#fintech','#payments','#creditcard','#finance'],
  },

  viralFormulas: [
    { formula: 'Title: "I Tested [X] for [N] Days"', example: 'I Tested 7 Crypto Cards for 90 Days — Only 1 Was Worth It', why: 'Personal experiment + specific number + curiosity gap' },
    { formula: 'Title: "The Truth About [X]"', example: 'The Truth About International Payment Fees (Banks Won\'t Tell You)', why: 'Insider knowledge + controversy' },
    { formula: 'Title: "[N] [Things] You\'re Doing Wrong"', example: '5 Money Transfer Mistakes That Cost You Hundreds', why: 'Fear of missing out + specific number' },
    { formula: 'Title: "How I [Achieved X] (Step by Step)"', example: 'How I Save $500/Month on International Transfers (Step by Step)', why: 'Specific benefit + promise of actionable guide' },
    { formula: 'Title: "[X] vs [Y] — Honest Comparison"', example: 'MP Card vs Crypto.com Card — Which One Actually Saves You Money?', why: 'Comparison format = high intent viewers' },
  ],

  thumbnailTips: {
    mustHave: [
      'Human face with expressive emotion (surprised, excited, shocked)',
      'Large bold text (max 5 words, ≥ 1/4 of image height)',
      'High contrast complementary colors (blue+orange, purple+yellow)',
      'Clean/blurred background to isolate subject',
    ],
    avoid: [
      'More than 5 words of text on thumbnail',
      'Small text unreadable on mobile',
      'Low contrast colors (gray on gray)',
      'Cluttered background with too many elements',
      'Generic stock photos with no emotion',
      'Misleading imagery not matching video content',
    ],
    colorPairs: [
      { primary: '#FF0000', secondary: '#FFFFFF', label: 'Red + White (high energy)' },
      { primary: '#0066FF', secondary: '#FFA500', label: 'Blue + Orange (trust + excitement)' },
      { primary: '#FFD700', secondary: '#000000', label: 'Yellow + Black (attention-grabbing)' },
      { primary: '#8B5CF6', secondary: '#FBBF24', label: 'Purple + Yellow (creative + bold)' },
    ],
  },
};
