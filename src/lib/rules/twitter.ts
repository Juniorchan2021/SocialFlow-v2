export const TWITTER_RULES = {
  platform: 'twitter' as const,
  name: 'Twitter / X',
  icon: '🐦',
  language: 'both' as const, // zh + en
  charLimits: { titleMin: 0, titleMax: 0, contentMin: 30, contentMax: 280 },
  imageSpec: { ratio: '16:9', width: 1200, height: 675, maxImages: 4 },

  violations: {
    zh: {
      critical: { name: '严重违规', color: '#FF3B30', keywords: ['仇恨言论','恐怖主义','自残','自杀方法','买粉','假互动','人肉搜索'] },
      high: { name: '高风险', color: '#FF9500', keywords: ['spam','批量DM','关注取关','操纵行为','小号逃避','虚假账号','水军'] },
      medium: { name: '互动诱饵', color: '#FFCC00', keywords: ['互关','互赞','转发抽奖','关注送','点赞送','转发有礼'] },
      low: { name: '低风险', color: '#34C759', keywords: ['看主页','私信我','戳链接'] },
    },
    en: {
      critical: { name: 'Policy Violation', color: '#FF3B30', keywords: ['hate speech','racial slur','terrorism','terrorist','child abuse','csam','self-harm','suicide method','buy followers','fake engagement','buy retweets','bot followers','doxxing','swatting'] },
      high: { name: 'High Risk', color: '#FF9500', keywords: ['spam','mass dm','follow/unfollow','aggressive following','manipulation','ban evasion','fake account','coordinated inauthentic','astroturfing','brigading'] },
      medium: { name: 'Engagement Bait', color: '#FFCC00', keywords: ['please retweet','rt for rt','follow back','follow for follow','f4f','like for like','l4l','retweet if you agree','like if you agree','rt to win','follow to enter','giveaway requires follow'] },
      low: { name: 'Minor Concern', color: '#34C759', keywords: ['check bio','link in bio','dm me','message me','check my profile','visit profile'] },
    },
  },

  hooks: {
    zh: ['震惊','揭秘','必看','绝了','亲测','真实','经验','干货','思考','反思'],
    en: ['thread','unpopular opinion','hot take','nobody talks about','this is wild','breaking','honest review','real talk','psa','plot twist','hear me out','i need to talk about'],
  },

  ctaPatterns: {
    zh: ['关注','转发','评论','你觉得','大家','怎么看','有同感'],
    en: ['follow','reply','quote','what do you think','thoughts','agree','disagree','tag','let me know','drop'],
  },

  hashtagSuggestions: {
    zh: {
      product_review: ['#测评','#真实体验','#推荐'],
      tutorial: ['#教程','#干货','#技巧'],
      general: ['#跨境支付','#数字游民','#全球支付卡'],
    },
    en: {
      product_review: ['#Review','#HonestReview','#Recommendation'],
      tutorial: ['#HowTo','#Tips','#Tutorial','#Guide'],
      general: ['#CryptoPayments','#DigitalNomad','#Fintech'],
    },
  },

  viralFormulas: {
    zh: [
      { formula: '观点对立式', example: '大家都说XX好，但我觉得YY才是正解', why: '引发讨论和Quote' },
      { formula: '经验总结式', example: '做了3年跨境电商，最大的教训是...', why: '经验信号建立信任' },
      { formula: '数据冲击式', example: '98%的人不知道，跨境转账可以免手续费', why: '反常识数据引发好奇' },
      { formula: '行业揭秘式', example: '圈内人不会告诉你的跨境支付真相', why: '信息差制造点击欲' },
    ],
    en: [
      { formula: 'Hot take: [Controversial statement]', example: 'Hot take: Most productivity advice is for people who were already productive.', why: 'Sparks debate, drives quote tweets' },
      { formula: '[Number] things nobody tells you about [topic]', example: '7 things nobody tells you about freelancing in year 1', why: 'List + insider knowledge = bookmarks' },
      { formula: 'Thread 🧵: [Compelling Hook]', example: 'Thread: How I went from $0 to $10k/mo. Not a guru. Just what worked. 🧵', why: 'Thread format gets 3-5x engagement' },
      { formula: 'PSA: [Widely believed thing] is wrong', example: 'PSA: "Follow your passion" is bad career advice. Here\'s what works:', why: 'Challenges assumptions, triggers emotion' },
    ],
  },
};
