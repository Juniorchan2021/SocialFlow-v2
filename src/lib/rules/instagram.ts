export const INSTAGRAM_RULES = {
  platform: 'instagram' as const,
  name: 'Instagram',
  icon: '📸',
  language: 'en' as const,
  charLimits: { titleMin: 0, titleMax: 0, contentMin: 20, contentMax: 2200 },
  imageSpec: { ratio: '4:5', width: 1080, height: 1350, maxImages: 10 },

  violations: {
    critical: { name: 'Community Guidelines Violation', color: '#FF3B30', keywords: ['hate speech','violence','nudity','misinformation','self-harm','child exploitation','terrorism','illegal drugs'] },
    high: { name: 'Shadowban Risk', color: '#FF9500', keywords: ['follow for follow','f4f','like for like','l4l','follow back','followback','likeforlike','instalike','instagood spam','mass following','automation','bot'] },
    medium: { name: 'Reduced Reach', color: '#FFCC00', keywords: ['link in bio','click link','swipe up','dm to buy','dm for price','comment to buy','drop emoji to join'] },
    low: { name: 'Minor Concern', color: '#34C759', keywords: ['limited time','act now','last chance','don\'t miss','hurry up','sale ends'] },
  },

  bannedHashtags: [
    '#adulting','#alone','#attractive','#beautyblogger','#besties','#bikinibody',
    '#brain','#costumes','#curvygirls','#date','#dating','#desk','#direct',
    '#dm','#edgy','#elevator','#fitnessgirls','#followers','#girlsonly',
    '#gloves','#goddess','#graffiti','#hardworkpaysoff','#hawks','#hotweather',
    '#hustler','#ice','#instasport','#iphonegraphy','#italiano','#kansas',
    '#kickoff','#killer','#kissing','#lean','#like','#lulu','#master',
    '#models','#mustfollow','#nasty','#newyearsday','#nudity','#overnight',
    '#parties','#petite','#pornfood','#pushups','#rate','#ravens',
    '#saltwater','#selfharm','#single','#singlelife','#skateboarding',
    '#snap','#snapchat','#snowstorm','#sopretty','#stranger','#streetphoto',
    '#sunbathing','#swole','#tag4like','#tagsforlikes','#teens','#thought',
    '#todayimwearing','#twerk','#underage','#valentinesday','#workflow',
  ],

  hooks: ['stop scrolling','save this','you need to know','game changer','this changed everything','nobody talks about','secret to','real talk','honest take','unpopular opinion'],
  ctaPatterns: ['save for later','share with a friend','follow for more','double tap','comment below','tag someone','what do you think','drop a comment','bookmark this'],

  hashtagSuggestions: {
    product_review: ['#review','#honest','#productreview','#recommendation','#worth'],
    tutorial: ['#howto','#tips','#tutorial','#learnontiktok','#guide','#hack'],
    general: ['#fintech','#crypto','#payments','#digitalnomad','#remotework','#travel'],
  },

  viralFormulas: [
    { formula: 'Listicle: "[N] tools that changed..."', example: '5 tools that changed how I manage money abroad (last one is free)', why: 'Lists are highly saveable' },
    { formula: 'Contrarian: "Stop doing [X]"', example: 'Stop paying international transfer fees. Here\'s what actually works.', why: 'Challenges norm = engagement' },
    { formula: 'Story hook: "I tried [X] for [N] days"', example: 'I tried 3 different crypto cards for 30 days. Here\'s what happened.', why: 'Personal experiment = curiosity' },
    { formula: 'Value bomb: "Save this for later"', example: 'Save this: The complete guide to paying abroad without fees.', why: 'Triggers bookmark behavior' },
    { formula: 'Relatable: "POV: You just..."', example: 'POV: You just discovered you can pay Netflix with crypto', why: 'Relatable + humor = shares' },
  ],
};
