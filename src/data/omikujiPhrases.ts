// src/data/omikujiPhrases.ts
// 30 curated daily Japanese wisdom phrases with English, Telugu, and encouraging fortune tiers
// Used by the Omikuji (おみくじ) Daily Fortune feature.

export type FortuneTier = '大吉' | '中吉' | '小吉' | '末吉';

export interface FortuneTierInfo {
  tier: FortuneTier;
  titleEn: string;
  titleTe: string;
  descriptionEn: string;
  badgeColor: string;
}

export const FORTUNE_TIERS: Record<FortuneTier, FortuneTierInfo> = {
  大吉: {
    tier: '大吉',
    titleEn: 'Great Blessing (Daikichi)',
    titleTe: 'మహా శుభం (దైకిచి)',
    descriptionEn: 'The stars align for brilliant learning momentum today!',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200'
  },
  中吉: {
    tier: '中吉',
    titleEn: 'Middle Blessing (Chukichi)',
    titleTe: 'మధ్యమ శుభం (చుకిచి)',
    descriptionEn: 'Steady, joyful practice will unveil new insights today.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200'
  },
  小吉: {
    tier: '小吉',
    titleEn: 'Small Blessing (Shokichi)',
    titleTe: 'చిన్న శుభం (షోకిచి)',
    descriptionEn: 'Patience and small steps build an unshakeable foundation.',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/70 dark:text-sky-200'
  },
  末吉: {
    tier: '末吉',
    titleEn: 'Future Blessing (Suekichi)',
    titleTe: 'భవిష్యత్ శుభం (సుయెకిచి)',
    descriptionEn: 'Every seed planted today will blossom in great time.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/70 dark:text-purple-200'
  }
};

export interface OmikujiPhrase {
  id: number;
  japanese: string;
  reading: string;
  romaji: string;
  meaningEn: string;
  meaningTe: string;
  culturalNote: string;
  defaultTier: FortuneTier;
}

export const OMIKUJI_PHRASES: OmikujiPhrase[] = [
  {
    id: 1,
    japanese: '千里の道も一歩から',
    reading: 'せんりのみちもいっぽから',
    romaji: 'Senri no michi mo ippo kara',
    meaningEn: 'A journey of a thousand miles begins with a single step.',
    meaningTe: 'వేయి మైళ్ల ప్రయాణం కూడా ఒక్క అడుగుతోనే ప్రారంభమవుతుంది.',
    culturalNote: 'One of Japan’s most cherished proverbs, reminding us that mastery is born from small daily habits.',
    defaultTier: '大吉'
  },
  {
    id: 2,
    japanese: '七転び八起き',
    reading: 'ななころびやおき',
    romaji: 'Nanakorobi yaoki',
    meaningEn: 'Fall seven times, stand up eight.',
    meaningTe: 'ఏడు సార్లు పడిపోయినా, ఎనిమిదో సారి పైకి లేవండి (పట్టుదల).',
    culturalNote: 'Inspired by the Bodhidharma (Daruma) doll, celebrating resilience against any study obstacle.',
    defaultTier: '大吉'
  },
  {
    id: 3,
    japanese: '一期一会',
    reading: 'いちごいちえ',
    romaji: 'Ichigo ichie',
    meaningEn: 'Treasure every encounter, for it may never happen again.',
    meaningTe: 'ప్రతి క్షణాన్ని, ప్రతి సమావేశాన్ని అమూల్యమైనదిగా భావించండి.',
    culturalNote: 'A tea ceremony philosophy reminding us to bring full focus and presence to every word studied.',
    defaultTier: '中吉'
  },
  {
    id: 4,
    japanese: '継続は力なり',
    reading: 'けいぞくはちからなり',
    romaji: 'Keizoku wa chikara nari',
    meaningEn: 'Continuity is power (Consistency yields strength).',
    meaningTe: 'నిరంతర సాధనే నిజమైన శక్తి.',
    culturalNote: 'The heart of Japanese craftsmanship (monozukuri) and learning.',
    defaultTier: '大吉'
  },
  {
    id: 5,
    japanese: '初心忘るべからず',
    reading: 'しょしんわするべからず',
    romaji: 'Shoshin wasuru bekarazu',
    meaningEn: 'Never forget your beginner’s humble, eager spirit.',
    meaningTe: 'ప్రారంభంలో ఉన్న ఉత్సాహాన్ని, వినయాన్ని ఎప్పుడూ మరువవద్దు.',
    culturalNote: 'Originates from Zeami, the master of Noh drama, advocating lifelong curiosity.',
    defaultTier: '中吉'
  },
  {
    id: 6,
    japanese: '花鳥風月',
    reading: 'かちょうふうげつ',
    romaji: 'Kachou fuugetsu',
    meaningEn: 'Find beauty in the harmony of nature: flowers, birds, wind, and moon.',
    meaningTe: 'ప్రకృతి అందాలలో (పువ్వులు, పక్షులు, గాలి, చంద్రుడు) శాంతిని పొందండి.',
    culturalNote: 'A poetic four-character idiom (yojijukugo) honoring mindful observation.',
    defaultTier: '小吉'
  },
  {
    id: 7,
    japanese: '日進月歩',
    reading: 'にっしんげっぽ',
    romaji: 'Nisshin geppo',
    meaningEn: 'Steady, rapid progress day by day and month by month.',
    meaningTe: 'రోజురోజుకూ మరియు నెలానెలా వేగవంతమైన పురోగతి సాధించడం.',
    culturalNote: 'Celebrates constant, visible incremental progress in studies.',
    defaultTier: '中吉'
  },
  {
    id: 8,
    japanese: '雨降って地固まる',
    reading: 'あめふってじかたまる',
    romaji: 'Ame futte ji katamaru',
    meaningEn: 'After the rain, the earth hardens (Adversity builds strength).',
    meaningTe: 'వర్షం పడిన తర్వాత నేల గట్టిపడుతుంది (కష్టాలు మనల్ని దృఢపరుస్తాయి).',
    culturalNote: 'Reminds us that reviewing tricky grammar mistakes creates lasting memory traces.',
    defaultTier: '末吉'
  },
  {
    id: 9,
    japanese: '温故知新',
    reading: 'おんこちしん',
    romaji: 'Onko chishin',
    meaningEn: 'Learn from the past to understand and innovate in the present.',
    meaningTe: 'గత అనుభవాల నుండి నేర్చుకుని నూతన జ్ఞానాన్ని పొందండి.',
    culturalNote: 'FSRS spaced repetition is rooted in this: revisiting older cards fuels new fluency.',
    defaultTier: '中吉'
  },
  {
    id: 10,
    japanese: '一意専心',
    reading: 'いちいせんしん',
    romaji: 'Ichii senshin',
    meaningEn: 'Single-minded devotion with wholehearted focus.',
    meaningTe: 'ఏకాగ్రతతో, పరిపూర్ణమైన మనస్సుతో లక్ష్యం వైపు సాగండి.',
    culturalNote: 'Focusing on one character or audio phrase at a time yields deep calm.',
    defaultTier: '大吉'
  },
  {
    id: 11,
    japanese: '十人十色',
    reading: 'じゅうにんといろ',
    romaji: 'Juunin toiro',
    meaningEn: 'Ten people, ten colors (Everyone has their own unique pace and style).',
    meaningTe: 'పది మందికి పది రకాల రంగులు (ప్రతి ఒక్కరికీ ప్రత్యేకమైన శైలి ఉంటుంది).',
    culturalNote: 'Never compare your learning timeline to others; your journey is uniquely yours.',
    defaultTier: '小吉'
  },
  {
    id: 12,
    japanese: '明日は明日の風が吹く',
    reading: 'あしたはあしたのかぜがふく',
    romaji: 'Ashita wa ashita no kaze ga fuku',
    meaningEn: 'Tomorrow, tomorrow’s winds will blow (Do not dwell on today’s worries).',
    meaningTe: 'రేపటి రోజున రేపటి గాలులు వీస్తాయి (ఈరోజు చింతలను వదిలేయండి).',
    culturalNote: 'A gentle reminder that if a study session felt tough today, tomorrow brings a fresh breeze.',
    defaultTier: '末吉'
  },
  {
    id: 13,
    japanese: '積善の家に余慶あり',
    reading: 'せきぜんのいえによけいあり',
    romaji: 'Sekizen no ie ni yokei ari',
    meaningEn: 'Those who accumulate small good deeds enjoy long-lasting fortune.',
    meaningTe: 'నిత్యం మంచి పనులు చేసే వారికి శాశ్వతమైన శుభాలు కలుగుతాయి.',
    culturalNote: 'Daily reviews are small acts of devotion to your future bilingual self.',
    defaultTier: '大吉'
  },
  {
    id: 14,
    japanese: '知恵は万代の宝',
    reading: 'ちえはばんだいのたから',
    romaji: 'Chie wa bandai no takara',
    meaningEn: 'Wisdom is a treasure that lasts across generations.',
    meaningTe: 'జ్ఞానం తరతరాల పాటు నిలిచే అమూల్యమైన సంపద.',
    culturalNote: 'Language learning opens entire libraries of wisdom and human connection.',
    defaultTier: '中吉'
  },
  {
    id: 15,
    japanese: '雲外蒼天',
    reading: 'うんがいそうてん',
    romaji: 'Ungai souten',
    meaningEn: 'Beyond the storm clouds lies the clear blue sky.',
    meaningTe: 'మబ్బుల వెనుక నిర్మలమైన నీలి ఆకాశం దాగి ఉంటుంది.',
    culturalNote: 'Push past tricky particle grammar to find effortless comprehension waiting.',
    defaultTier: '大吉'
  },
  {
    id: 16,
    japanese: '笑う門には福来る',
    reading: 'わらうかどにはふくきたる',
    romaji: 'Warau kado ni wa fuku kitaru',
    meaningEn: 'Good fortune comes to a gate filled with laughter.',
    meaningTe: 'నవ్వులు విరిసే ఇంట్లో సుఖసంతోషాలు వెల్లివిరుస్తాయి.',
    culturalNote: 'Keep your Japanese study playful! Enjoying the journey accelerates memory.',
    defaultTier: '大吉'
  },
  {
    id: 17,
    japanese: '石の上にも三年',
    reading: 'いしのうえにもさんねん',
    romaji: 'Ishi no ue ni mo sannen',
    meaningEn: 'Sit on a cold stone for three years, and it will become warm (Perseverance triumphs).',
    meaningTe: 'చల్లని రాతిపై మూడు సంవత్సరాలు కూర్చున్నా అది వెచ్చబడుతుంది (సహనం ఫలిస్తుంది).',
    culturalNote: 'Patience transforms unfamiliar characters into second-nature intuition.',
    defaultTier: '中吉'
  },
  {
    id: 18,
    japanese: '百聞は一見に如かず',
    reading: 'ひゃくぶんはいっけんにしかず',
    romaji: 'Hyakubun wa ikken ni shikazu',
    meaningEn: 'Hearing a hundred times is not as good as seeing once.',
    meaningTe: 'వంద సార్లు వినడం కంటే ఒక్కసారి చూడటం ఉత్తమం.',
    culturalNote: 'Visual mnemonics and native stroke animations seal kanji memory instantly.',
    defaultTier: '小吉'
  },
  {
    id: 19,
    japanese: '習うより慣れよ',
    reading: 'ならうよりなれよ',
    romaji: 'Narau yori nareyo',
    meaningEn: 'Practice brings familiarity better than rote studying.',
    meaningTe: 'కేవలం నేర్చుకోవడం కంటే నిరంతరం సాధన చేయడం ఎంతో మేలు.',
    culturalNote: 'Speak aloud and listen to native audio rather than memorizing rules in silence.',
    defaultTier: '中吉'
  },
  {
    id: 20,
    japanese: '有言実行',
    reading: 'ゆうげんじっこう',
    romaji: 'Yuugen jikkou',
    meaningEn: 'Speak it into existence and carry it out into action.',
    meaningTe: 'చెప్పిన మాటను ఆచరణలో చూపించడం.',
    culturalNote: 'Setting daily planner goals and checking them off builds quiet confidence.',
    defaultTier: '大吉'
  },
  {
    id: 21,
    japanese: '臥薪嘗胆',
    reading: 'がしんしょうたん',
    romaji: 'Gashin shoutan',
    meaningEn: 'Enduring hardships to achieve an extraordinary dream.',
    meaningTe: 'లక్ష్య సాధన కోసం కష్టాలను ఓర్పుతో భరించడం.',
    culturalNote: 'Every kanji mastered is a triumph forged through patient grit.',
    defaultTier: '末吉'
  },
  {
    id: 22,
    japanese: '切磋琢磨',
    reading: 'せっさたくま',
    romaji: 'Sessa takuma',
    meaningEn: 'Polishing stones and jewels together (Refining oneself through friendly effort).',
    meaningTe: 'ఒకరినొకరు ప్రోత్సహించుకుంటూ సంపూర్ణతను సాధించడం.',
    culturalNote: 'Originates from jade polishing, symbolizing continuous refinement of speech.',
    defaultTier: '中吉'
  },
  {
    id: 23,
    japanese: '和敬清寂',
    reading: 'わけいせいじゃく',
    romaji: 'Wakei seijaku',
    meaningEn: 'Harmony, respect, purity, and tranquil silence.',
    meaningTe: 'సామరస్యం, గౌరవం, పవిత్రత మరియు ప్రశాంతత.',
    culturalNote: 'The four core pillars of the Japanese tea ceremony, bringing peace to study sessions.',
    defaultTier: '小吉'
  },
  {
    id: 24,
    japanese: '一刀両断',
    reading: 'いっとうりょうだん',
    romaji: 'Ittou ryoudan',
    meaningEn: 'Cutting through confusion with swift, decisive clarity.',
    meaningTe: 'సందేహాలను ఒక్క దెబ్బతో స్పష్టంగా పరిష్కరించడం.',
    culturalNote: 'Mastering particle rules (は vs が, に vs で) cuts through sentence fog.',
    defaultTier: '中吉'
  },
  {
    id: 25,
    japanese: '一陽来復',
    reading: 'いちようらいふく',
    romaji: 'Ichiyou raifuku',
    meaningEn: 'The return of spring sunshine after the deepest winter.',
    meaningTe: 'శీతాకాలం ముగిసి వసంత కాలపు వెలుగులు తిరిగి రావడం.',
    culturalNote: 'A breakthrough moment in language understanding arrives just when you feel challenged.',
    defaultTier: '大吉'
  },
  {
    id: 26,
    japanese: '風林火山',
    reading: 'ふうりんかざん',
    romaji: 'Fuurin kazan',
    meaningEn: 'Swift as the wind, silent as the forest, fierce as fire, unshakeable as a mountain.',
    meaningTe: 'గాలిలా వేగంగా, అడవిలా నిశ్శబ్దంగా, అగ్నిలా తీవ్రంగా, పర్వతంలా అచలంగా ఉండటం.',
    culturalNote: 'Takeda Shingen’s famous samurai banner, reminding us to remain grounded in foundational study.',
    defaultTier: '大吉'
  },
  {
    id: 27,
    japanese: '水滴石を穿つ',
    reading: 'すいてきいしをうがつ',
    romaji: 'Suiteki ishi wo ugatsu',
    meaningEn: 'Constant drops of water wear away the hardest stone.',
    meaningTe: 'నిరంతరం పడే నీటి బిందువులు కఠినమైన రాతిని కూడా తొలుస్తాయి.',
    culturalNote: 'Ten minutes of daily Japanese outclasses three hours once a month every time.',
    defaultTier: '中吉'
  },
  {
    id: 28,
    japanese: '心機一転',
    reading: 'しんきいってん',
    romaji: 'Shinki itten',
    meaningEn: 'A complete mental renewal and spirited fresh start.',
    meaningTe: 'మనస్సును మార్చుకుని సరికొత్త ఉత్సాహంతో ప్రారంభించడం.',
    culturalNote: 'Every morning brings a clean sheet to practice kana and spoken rhythm.',
    defaultTier: '大吉'
  },
  {
    id: 29,
    japanese: '愚公山を移す',
    reading: 'ぐこうやまをうつす',
    romaji: 'Gukou yama wo utsusu',
    meaningEn: 'Faithful perseverance can literally move mountains.',
    meaningTe: 'నిరంతర కృషితో పర్వతాలను కూడా కదిలించవచ్చు.',
    culturalNote: 'With each day’s XP, the mountain of Japanese fluency draws closer.',
    defaultTier: '末吉'
  },
  {
    id: 30,
    japanese: '日々是好日',
    reading: 'ひびこれこうじつ',
    romaji: 'Hibi kore koujitsu',
    meaningEn: 'Every single day is a good day.',
    meaningTe: 'ప్రతి రోజూ ఒక మంచి రోజే (ప్రతి క్షణంలో సంతోషాన్ని కనుగొనండి).',
    culturalNote: 'Zen proverb: regardless of test scores or speed, each day of learning Japanese is a blessing.',
    defaultTier: '大吉'
  }
];

export const getDailyOmikujiPhrase = (dateKey: string): OmikujiPhrase => {
  // Deterministic hash based on date string (YYYY-MM-DD)
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % OMIKUJI_PHRASES.length;
  return OMIKUJI_PHRASES[index];
};
