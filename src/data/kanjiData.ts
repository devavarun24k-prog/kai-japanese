// src/data/kanjiData.ts
// Essential N5/N4 Kanji with stroke paths, radicals, Telugu meanings, and mnemonics
import { KanjiItem } from '../types';

export const KANJI_DATA: KanjiItem[] = [
  {
    id: 'k_nichi',
    character: '日',
    on_readings: ['ニチ', 'ジツ'],
    kun_readings: ['ひ', '-び', '-か'],
    on_telugu: ['నిచి', 'జిత్సు'],
    kun_telugu: ['హి', 'బి', 'క'],
    meaning_en: ['Day', 'Sun', 'Japan'],
    meaning_te: ['రోజు', 'సూర్యుడు', 'దినము'],
    stroke_count: 4,
    stroke_paths: [
      'M 35 25 L 35 75', // Stroke 1: Left vertical
      'M 35 25 L 65 25 L 65 75', // Stroke 2: Top and right box
      'M 35 50 L 65 50', // Stroke 3: Middle divider
      'M 35 75 L 65 75'  // Stroke 4: Bottom closure
    ],
    radicals: [
      { symbol: '日', meaning_en: 'Sun / Day', meaning_te: 'సూర్యుడు / రోజు' }
    ],
    jlpt_level: 'N5',
    mnemonic_en: 'A window frame opening up to the bright morning Sun.',
    mnemonic_te: 'సూర్యుడి కాంతి వచ్చే కిటికీ తలుపు లాంటి చతురస్రాకారపు గది.',
    compounds: [
      { word: '日本', reading: 'にほん', romaji: 'nihon', english: 'Japan (Land of the Rising Sun)', telugu: 'జపాన్' },
      { word: '今日', reading: 'きょう', romaji: 'kyou', english: 'Today', telugu: 'ఈ రోజు' },
      { word: '毎日', reading: 'まいにち', romaji: 'mainichi', english: 'Every day', telugu: 'ప్రతి రోజూ' }
    ],
    confusable_with: [
      { character: '目', difference: '目 (eye) has two horizontal lines inside; 日 has only one.' },
      { character: '白', difference: '白 (white) has an extra top tick stroke.' }
    ]
  },
  {
    id: 'k_hon',
    character: '本',
    on_readings: ['ホン'],
    kun_readings: ['もと'],
    on_telugu: ['హొన్'],
    kun_telugu: ['మొతొ'],
    meaning_en: ['Book', 'Origin', 'Main', 'Root'],
    meaning_te: ['పుస్తకం', 'మూలం', 'ఆధారం'],
    stroke_count: 5,
    stroke_paths: [
      'M 25 38 L 75 38', // Horizontal
      'M 50 18 L 50 78', // Vertical
      'M 50 38 L 28 68', // Left slant
      'M 50 38 L 72 68', // Right slant
      'M 38 72 L 62 72'  // Bottom base line (origin marker)
    ],
    radicals: [
      { symbol: '木', meaning_en: 'Tree', meaning_te: 'చెట్టు' },
      { symbol: '一', meaning_en: 'Base / Root line', meaning_te: 'వేరు సూచిక' }
    ],
    jlpt_level: 'N5',
    mnemonic_en: 'A tree (木) with a line marking its roots—the origin of paper, hence a Book!',
    mnemonic_te: 'చెట్టు వేరు వద్ద ఒక గీత గీశారు. చెట్టు నుంచి వచ్చే కాగితంతో చేసేది "పుస్తకం".',
    compounds: [
      { word: '本屋', reading: 'ほんや', romaji: 'honya', english: 'Bookstore', telugu: 'పుస్తకాల దుకాణం' },
      { word: '日本語', reading: 'にほんご', romaji: 'nihongo', english: 'Japanese language', telugu: 'జపనీస్ భాష' }
    ],
    confusable_with: [
      { character: '木', difference: '木 (tree) has no bottom horizontal line; 本 has the root line.' }
    ]
  },
  {
    id: 'k_hito',
    character: '人',
    on_readings: ['ジン', 'ニン'],
    kun_readings: ['ひと'],
    on_telugu: ['జిన్', 'నిన్'],
    kun_telugu: ['హితొ'],
    meaning_en: ['Person', 'Human'],
    meaning_te: ['వ్యక్తి', 'మనిషి', 'మానవుడు'],
    stroke_count: 2,
    stroke_paths: [
      'M 50 22 C 45 45 35 68 22 78', // Left walking leg
      'M 42 45 C 52 58 65 72 78 78'  // Right supporting leg
    ],
    radicals: [
      { symbol: '人', meaning_en: 'Person radical', meaning_te: 'మనిషి' }
    ],
    jlpt_level: 'N5',
    mnemonic_en: 'Two legs walking forward: a human being standing tall.',
    mnemonic_te: 'రెండు కాళ్లతో నిలబడి నడుస్తున్న మనిషి ఆకారం.',
    compounds: [
      { word: '日本人', reading: 'にほんじん', romaji: 'nihonjin', english: 'Japanese person', telugu: 'జపనీయుడు' },
      { word: '一人', reading: 'ひとり', romaji: 'hitori', english: 'One person / Alone', telugu: 'ఒక్కరే' },
      { word: '大人', reading: 'おとな', romaji: 'otona', english: 'Adult', telugu: 'పెద్ద మనిషి / వయోజనుడు' }
    ],
    confusable_with: [
      { character: '入', difference: '入 (enter) has the left stroke tucked under the right stroke.' }
    ]
  },
  {
    id: 'k_mizu',
    character: '水',
    on_readings: ['スイ'],
    kun_readings: ['みず'],
    on_telugu: ['సుయి'],
    kun_telugu: ['మిజు'],
    meaning_en: ['Water'],
    meaning_te: ['నీరు', 'నీళ్లు'],
    stroke_count: 4,
    stroke_paths: [
      'M 50 20 L 50 78 C 50 82 45 80 42 76', // Center vertical hook
      'M 38 40 L 25 50',                     // Left stroke
      'M 25 52 L 40 74',                     // Left lower
      'M 60 38 L 78 68'                      // Right splash
    ],
    radicals: [
      { symbol: '水', meaning_en: 'Water', meaning_te: 'నీరు' }
    ],
    jlpt_level: 'N5',
    mnemonic_en: 'A fountain splashing droplets of fresh water on both sides.',
    mnemonic_te: 'మధ్యలో వాటర్ ఫౌంటెన్ నుండి ఇరువైపులా చిందుతున్న నీటి బిందువులు.',
    compounds: [
      { word: '水曜日', reading: 'すいようび', romaji: 'suiyoubi', english: 'Wednesday (Water Day)', telugu: 'బుధవారం' },
      { word: '水着', reading: 'みずぎ', romaji: 'mizugi', english: 'Swimsuit', telugu: 'స్విమ్‌సూట్' }
    ]
  },
  {
    id: 'k_yama',
    character: '山',
    on_readings: ['サン', 'ザン'],
    kun_readings: ['やま'],
    on_telugu: ['సాన్', 'జాన్'],
    kun_telugu: ['యామా'],
    meaning_en: ['Mountain'],
    meaning_te: ['కొండ', 'పర్వతం'],
    stroke_count: 3,
    stroke_paths: [
      'M 50 20 L 50 78', // Center highest peak
      'M 25 45 L 25 78 L 75 78', // Left peak and valley base
      'M 75 45 L 75 78'  // Right peak
    ],
    radicals: [
      { symbol: '山', meaning_en: 'Mountain', meaning_te: 'పర్వతం' }
    ],
    jlpt_level: 'N5',
    mnemonic_en: 'Three majestic mountain peaks side by side, like Mount Fuji.',
    mnemonic_te: 'మూడు శిఖరాలు గల పర్వతం ఆకారం (ఉదా: ఫూజీ పర్వతం).',
    compounds: [
      { word: '富士山', reading: 'ふじさん', romaji: 'fujisan', english: 'Mount Fuji', telugu: 'ఫూజీ పర్వతం' },
      { word: '火山', reading: 'かざん', romaji: 'kazan', english: 'Volcano', telugu: 'అగ్నిపర్వతం' }
    ]
  }
];
