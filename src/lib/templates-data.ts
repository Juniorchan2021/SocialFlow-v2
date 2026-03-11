import type { Platform } from './rules';

export interface Template {
  id: string;
  platform: Platform;
  category: string;
  name: string;
  titleTemplate: string;
  contentTemplate: string;
  tags: string[];
  formula: string;
  lang: 'zh' | 'en';
}

export const TEMPLATES: Template[] = [
  // --- 小红书 ---
  { id: 'xhs-1', platform: 'xhs', category: '测评种草', lang: 'zh', name: '产品测评模板', formula: '[情绪词]+[产品]+[效果]',
    titleTemplate: '亲测！{产品名}用了{天数}天，效果真的绝了',
    contentTemplate: '姐妹们！！！今天必须来跟你们分享这个{产品名}！\n\n用了{天数}天，说说真实感受👇\n\n✅ 优点1：{优点1}\n✅ 优点2：{优点2}\n✅ 优点3：{优点3}\n\n⚠️ 小缺点：{缺点}\n\n总结：{一句话总结}\n\n💰 价格：{价格}\n📍 购买渠道：{渠道}\n\n你们用过吗？评论区聊聊～\n\n{标签}',
    tags: ['测评', '种草', '真实分享'] },
  { id: 'xhs-2', platform: 'xhs', category: '干货教程', lang: 'zh', name: '保姆级攻略模板', formula: '[身份]+[场景]+[数字攻略]',
    titleTemplate: '{身份}必看！{场景}全攻略，{数字}个步骤搞定',
    contentTemplate: '作为{身份}，{场景}真的太重要了！\n\n今天整理了一份保姆级攻略，照着做就行👇\n\n📌 Step 1：{步骤1}\n📌 Step 2：{步骤2}\n📌 Step 3：{步骤3}\n📌 Step 4：{步骤4}\n\n💡 Tips：\n• {技巧1}\n• {技巧2}\n\n⚠️ 避坑提醒：{避坑}\n\n记得收藏📌 以后用得上！有问题评论区问我～\n\n{标签}',
    tags: ['攻略', '教程', '干货'] },
  { id: 'xhs-3', platform: 'xhs', category: '对比省钱', lang: 'zh', name: '平替对比模板', formula: '[平替]+[省钱]+[对比]',
    titleTemplate: '花{低价}替代{高价}效果！省下的钱买奶茶',
    contentTemplate: '💰 省钱姐妹看过来！\n\n原来{高价产品}({高价}元)可以被{平替产品}({低价}元)完美替代？？\n\n📊 对比维度：\n1️⃣ {维度1}：{高价} vs {平替} → {结论1}\n2️⃣ {维度2}：{高价} vs {平替} → {结论2}\n3️⃣ {维度3}：{高价} vs {平替} → {结论3}\n\n🏆 最终结论：{总结}\n\n你们还有什么平替推荐？👇\n\n{标签}',
    tags: ['平替', '省钱', '对比'] },
  { id: 'xhs-4', platform: 'xhs', category: '经验分享', lang: 'zh', name: '避坑警告模板', formula: '[警告]+[经历]+[教训]',
    titleTemplate: '⚠️ 千万别踩这{数字}个坑！{场景}血泪教训',
    contentTemplate: '救命！{场景}差点翻车了😭\n\n分享我的血泪教训，姐妹们避坑👇\n\n❌ 坑1：{坑1}\n→ 正确做法：{正确1}\n\n❌ 坑2：{坑2}\n→ 正确做法：{正确2}\n\n❌ 坑3：{坑3}\n→ 正确做法：{正确3}\n\n总结：{一句话总结}\n\n你们还遇到过什么坑？评论区分享一下～\n\n{标签}',
    tags: ['避坑', '经验', '警告'] },
  { id: 'xhs-5', platform: 'xhs', category: '数据盘点', lang: 'zh', name: '数据冲击模板', formula: '[数字]+[发现]+[颠覆认知]',
    titleTemplate: '震惊！{数字}%的人不知道{领域}这个真相',
    contentTemplate: '今天看到一组数据，直接颠覆认知🤯\n\n📊 数据1：{数据1}\n→ 这意味着：{解读1}\n\n📊 数据2：{数据2}\n→ 这意味着：{解读2}\n\n📊 数据3：{数据3}\n→ 这意味着：{解读3}\n\n💡 所以我们应该：\n1. {行动1}\n2. {行动2}\n3. {行动3}\n\n你知道几个？评论区说说👇\n\n{标签}',
    tags: ['数据', '科普', '颠覆认知'] },

  // --- Twitter ---
  { id: 'tw-1', platform: 'twitter', category: 'Thread', lang: 'en', name: 'Listicle Thread', formula: 'Number + Topic + Promise',
    titleTemplate: '{N} {topic} that will change how you {outcome}:',
    contentTemplate: '{N} {topic} that will change how you {outcome}:\n\n🧵 Thread\n\n1/ {point1}\n\n2/ {point2}\n\n3/ {point3}\n\n4/ {point4}\n\n5/ {point5}\n\nWhich one resonated most? Reply below 👇\n\nIf you found this valuable, repost ♻️ to help others.',
    tags: ['thread', 'listicle'] },
  { id: 'tw-2', platform: 'twitter', category: 'Hot Take', lang: 'en', name: 'Contrarian Opinion', formula: 'Contrarian + Evidence + CTA',
    titleTemplate: 'Unpopular opinion: {controversial_statement}',
    contentTemplate: 'Unpopular opinion: {controversial_statement}\n\nHere\'s why:\n\n• {reason1}\n• {reason2}\n• {reason3}\n\nMost people won\'t agree, but the data is clear.\n\nAgree or disagree? 👇',
    tags: ['hot-take', 'opinion'] },
  { id: 'tw-3', platform: 'twitter', category: 'Story', lang: 'en', name: 'Personal Journey', formula: 'Transformation + Timeframe + Lesson',
    titleTemplate: '{time_ago}, I {starting_point}. Today, I {achievement}.',
    contentTemplate: '{time_ago}, I {starting_point}.\n\nToday, I {achievement}.\n\nWhat changed?\n\n→ {lesson1}\n→ {lesson2}\n→ {lesson3}\n\nThe biggest lesson: {biggest_lesson}\n\nWhat\'s your story? Share below 👇',
    tags: ['story', 'journey'] },
  { id: 'tw-4', platform: 'twitter', category: '中文推文', lang: 'zh', name: '经验总结贴', formula: '时间+经历+教训',
    titleTemplate: '做了{年数}年{领域}，最大的{数字}个教训：',
    contentTemplate: '做了{年数}年{领域}，最大的{数字}个教训：\n\n1. {教训1}\n2. {教训2}\n3. {教训3}\n4. {教训4}\n5. {教训5}\n\n最后一条最重要。\n\n你有什么补充？👇',
    tags: ['经验', '总结'] },

  // --- Instagram ---
  { id: 'ig-1', platform: 'instagram', category: 'Value Post', lang: 'en', name: 'Save-Worthy Tips', formula: 'Hook + Value + Save CTA',
    titleTemplate: 'Save this for later — you\'ll thank me 🔖',
    contentTemplate: 'Save this for later — you\'ll thank me 🔖\n\n{N} {topic} tips that actually work:\n\n1️⃣ {tip1}\n2️⃣ {tip2}\n3️⃣ {tip3}\n4️⃣ {tip4}\n5️⃣ {tip5}\n\nWhich one are you trying first? Comment below 👇\n\n.\n.\n.\n{hashtags}',
    tags: ['tips', 'save-worthy'] },
  { id: 'ig-2', platform: 'instagram', category: 'Carousel', lang: 'en', name: 'Myth vs Reality', formula: 'Myth-busting + Education',
    titleTemplate: 'Stop believing these {topic} myths ❌',
    contentTemplate: 'Stop believing these {topic} myths ❌\n\n[Slide 1] MYTH vs REALITY\n[Slide 2] Myth: {myth1} → Reality: {reality1}\n[Slide 3] Myth: {myth2} → Reality: {reality2}\n[Slide 4] Myth: {myth3} → Reality: {reality3}\n[Slide 5] What you should do instead:\n[Slide 6] Follow @{handle} for more 🔥\n\nDrop a 🤯 if any of these surprised you!\n\n.\n.\n.\n{hashtags}',
    tags: ['carousel', 'education'] },
  { id: 'ig-3', platform: 'instagram', category: 'Reel Caption', lang: 'en', name: 'POV Relatable', formula: 'POV + Relatable moment + Engagement',
    titleTemplate: 'POV: You just discovered {thing} 😱',
    contentTemplate: 'POV: You just discovered {thing} 😱\n\nLiterally changed my life. No exaggeration.\n\nIf you\'re still {pain_point}, try this instead:\n\n→ {solution}\n\nTrust me, you won\'t go back.\n\nTag someone who needs this 👇\n\n.\n.\n.\n{hashtags}',
    tags: ['reel', 'relatable'] },

  // --- Facebook ---
  { id: 'fb-1', platform: 'facebook', category: 'Story Post', lang: 'en', name: 'Personal Story', formula: 'Vulnerability + Lesson + Question',
    titleTemplate: 'I almost gave up on {thing}. One {event} changed everything.',
    contentTemplate: 'I almost gave up on {thing}.\n\nHere\'s what happened:\n\n{story_paragraph}\n\nThe turning point? {turning_point}\n\nWhat I learned:\n\n1. {lesson1}\n2. {lesson2}\n3. {lesson3}\n\nHave you ever experienced something similar? I\'d love to hear your story 👇',
    tags: ['story', 'personal'] },
  { id: 'fb-2', platform: 'facebook', category: 'Question Post', lang: 'en', name: 'Engagement Driver', formula: 'Surprising question + Context',
    titleTemplate: 'Why do we spend {time} on {activity} but zero time on {important_thing}?',
    contentTemplate: 'Why do we spend {time} on {activity} but zero time on {important_thing}?\n\nThink about it:\n\n• {stat1}\n• {stat2}\n• {stat3}\n\nThis year, I decided to change that.\n\nHere\'s what I did differently: {action}\n\nResult: {result}\n\nWhat\'s one thing you\'d change? Drop it below 👇',
    tags: ['question', 'engagement'] },

  // --- YouTube ---
  { id: 'yt-1', platform: 'youtube', category: 'Review', lang: 'en', name: 'Comparison Test', formula: 'I Tested X — Only Y Won',
    titleTemplate: 'I Tested {N} {products} for {time} — Only {num} Was Worth It',
    contentTemplate: 'I tested {N} {products} head-to-head for {time}.\n\nHere\'s my honest ranking:\n\n🏆 Winner: {winner} — {why_winner}\n🥈 Runner-up: {second} — {why_second}\n❌ Avoid: {loser} — {why_loser}\n\n⏱️ Timestamps:\n0:00 Intro\n{timestamp1}\n{timestamp2}\n{timestamp3}\n\n👉 Get {winner}: {link}\n\n🔔 Subscribe for weekly reviews\n\n#tags',
    tags: ['review', 'comparison'] },
  { id: 'yt-2', platform: 'youtube', category: 'Tutorial', lang: 'en', name: 'Step-by-Step Guide', formula: 'Problem + Number + Easy Promise',
    titleTemplate: 'How to {goal} in {time} ({N} Easy Steps)',
    contentTemplate: 'In this video, I\'ll show you exactly how to {goal} step by step.\n\nNo fluff. No theory. Just actionable steps.\n\n⏱️ Timestamps:\n0:00 Why this matters\n{timestamp1} Step 1: {step1}\n{timestamp2} Step 2: {step2}\n{timestamp3} Step 3: {step3}\n{timestamp4} Results & Proof\n\n📌 Resources mentioned:\n• {resource1}\n• {resource2}\n\n💬 Questions? Drop them in the comments!\n\n🔔 Subscribe for more tutorials\n\n#tags',
    tags: ['tutorial', 'how-to'] },
];

export function getTemplatesByPlatform(platform: Platform): Template[] {
  return TEMPLATES.filter(t => t.platform === platform);
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function getCategories(platform: Platform): string[] {
  return [...new Set(TEMPLATES.filter(t => t.platform === platform).map(t => t.category))];
}
