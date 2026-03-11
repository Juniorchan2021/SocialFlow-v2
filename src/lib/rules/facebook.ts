export const FACEBOOK_RULES = {
  platform: 'facebook' as const,
  name: 'Facebook',
  icon: '📘',
  language: 'en' as const,
  charLimits: { titleMin: 0, titleMax: 0, contentMin: 40, contentMax: 63206 },
  imageSpec: { ratio: '1:1', width: 1200, height: 1200, maxImages: 10 },

  violations: {
    critical: { name: 'Community Standard Violation', color: '#FF3B30', keywords: ['hate speech','discrimination','violence','terrorism','fake news','misinformation','election interference','voter suppression','covid cure','vaccine causes','conspiracy theory','deepfake','identity theft'] },
    high: { name: 'Reduced Distribution Risk', color: '#FF9500', keywords: ['clickbait','you won\'t believe','shocking truth','they don\'t want you to know','secret they hide','banned video','share to win','comment to enter','like and share to win','tag your friends to win','guaranteed returns','get rich quick'] },
    medium: { name: 'Engagement Bait', color: '#FFCC00', keywords: ['like this post','share if you agree','tag someone who','type yes if','like for good luck','share for blessings','1 like =','ignore if you don\'t care'] },
    low: { name: 'Minor Concern', color: '#34C759', keywords: ['click the link','swipe up','limited time','act now','hurry','last chance','don\'t miss out','buy now','shop now'] },
  },

  hooks: ['this is important','true story','i never thought','something happened','just found out','worth sharing','my honest','this changed','i almost','unpopular opinion'],
  ctaPatterns: ['share','comment','what do you think','have you','tag a friend','let me know','your thoughts','drop a comment'],

  hashtagSuggestions: {
    product_review: ['#Review','#Recommendation','#HonestOpinion'],
    tutorial: ['#HowTo','#Tips','#Tutorial','#LifeHacks'],
    general: ['#Fintech','#Payments','#DigitalPayments'],
  },

  viralFormulas: [
    { formula: 'Personal story + Universal lesson', example: 'I almost quit my job last year. One conversation changed everything.', why: 'Personal = authentic, lesson = shareable' },
    { formula: 'Surprising question', example: 'Why do we spend 40 hours on our career but none figuring out what we want?', why: 'Questions generate 100%+ more comments' },
    { formula: 'Before vs After transformation', example: 'This time last year: Anxious, overworked. Today: Same job, different mindset.', why: 'Contrast triggers curiosity' },
    { formula: 'Myth-busting with data', example: 'Drinking 8 glasses daily? The actual research says something different.', why: 'Challenges common knowledge, drives shares' },
    { formula: '[Number] tools/tips + personal proof', example: '5 free tools that saved me 3 hours last week.', why: 'Specific + useful + proof = high save rate' },
  ],
};
