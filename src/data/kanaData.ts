// src/data/kanaData.ts
// Comprehensive Hiragana dataset with stroke orders, Telugu phonetics, and mnemonics
import { KanaItem } from '../types';

export const HIRAGANA_DATA: KanaItem[] = [
  // --- Vowels (A-row) ---
  {
    id: 'h_a',
    character: 'あ',
    katakana_counterpart: 'ア',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'a',
    telugu_phonetic: 'అ',
    telugu_pronunciation_guide: 'తెలుగులో "అ" (ఉదా: అన్న) శబ్దం లాగా స్పష్టంగా, పొట్టిగా పలకాలి.',
    row: 'a',
    column: 0,
    stroke_count: 3,
    stroke_paths: [
      'M 25 35 L 75 35', // Stroke 1: horizontal
      'M 50 18 L 50 82', // Stroke 2: vertical curve down
      'M 65 45 C 50 65 30 75 32 58 C 34 40 68 38 74 65 C 77 78 68 85 58 85' // Stroke 3: loop
    ],
    stroke_directions: ['Horizontal line from left to right', 'Vertical stroke through the center', 'Curved loop around to the right'],
    mnemonic_en: 'Looks like an Apple with an "a" stem wrapped around it.',
    mnemonic_te: '"అ" ఆకారంలో గుండ్రటి ఆపిల్ లాంటి లూప్ ఉంటుంది.',
    example_words: [
      { word: 'あさ', reading: 'あさ', romaji: 'asa', english: 'Morning', telugu: 'ఉదయం', telugu_phonetic: 'అసా' },
      { word: 'あめ', reading: 'あめ', romaji: 'ame', english: 'Rain / Candy', telugu: 'వర్షం / చాక్లెట్', telugu_phonetic: 'అమె' }
    ],
    common_mistakes: ['お', 'め']
  },
  {
    id: 'h_i',
    character: 'い',
    katakana_counterpart: 'イ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'i',
    telugu_phonetic: 'ఇ',
    telugu_pronunciation_guide: 'తెలుగులో "ఇ" (ఉదా: ఇల్లు) లాగా పలకాలి. పెదవులను కొద్దిగా వెడల్పు చేయండి.',
    row: 'a',
    column: 1,
    stroke_count: 2,
    stroke_paths: [
      'M 35 30 C 32 55 35 75 42 78', // Stroke 1: left vertical with hook
      'M 68 38 C 68 55 64 68 62 70'  // Stroke 2: shorter right stroke
    ],
    stroke_directions: ['Left curved stroke with an upward hook at the bottom', 'Shorter right stroke angling down'],
    mnemonic_en: 'Two eels swimming side-by-side: "ee" (i).',
    mnemonic_te: 'రెండు చేపలు పక్కపక్కనే ఈదుతున్నట్లు ఉండే రెండు గీతలు "ఇ".',
    example_words: [
      { word: 'いぬ', reading: 'いぬ', romaji: 'inu', english: 'Dog', telugu: 'కుక్క', telugu_phonetic: 'ఇను' },
      { word: 'いえ', reading: 'いえ', romaji: 'ie', english: 'House', telugu: 'ఇల్లు', telugu_phonetic: 'ఇయె' }
    ],
    common_mistakes: ['り', 'こ']
  },
  {
    id: 'h_u',
    character: 'う',
    katakana_counterpart: 'ウ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'u',
    telugu_phonetic: 'ఉ',
    telugu_pronunciation_guide: 'తెలుగులో "ఉ" లాగే, కానీ పెదవులను ముందుకు గుండ్రంగా చుట్టకుండా (unrounded lips) పలకాలి.',
    row: 'a',
    column: 2,
    stroke_count: 2,
    stroke_paths: [
      'M 45 22 C 52 26 55 30 50 34', // Stroke 1: top dot/dash
      'M 38 42 C 65 38 72 58 65 72 C 58 84 42 80 40 76' // Stroke 2: bottom curve
    ],
    stroke_directions: ['Short angled dot at top', 'Large curve resembling a side profile ear'],
    mnemonic_en: 'Oof! A person kicked in the stomach, bending forward into an arc.',
    mnemonic_te: 'ఒక మనిషి వంగి ఉన్నట్లు ఉండే వంపు ఆకారం "ఉ".',
    example_words: [
      { word: 'うみ', reading: 'うみ', romaji: 'umi', english: 'Sea / Ocean', telugu: 'సముద్రం', telugu_phonetic: 'ఉమి' },
      { word: 'うし', reading: 'うし', romaji: 'ushi', english: 'Cow', telugu: 'ఆవు', telugu_phonetic: 'ఉషి' }
    ],
    common_mistakes: ['つ', 'ら']
  },
  {
    id: 'h_e',
    character: 'え',
    katakana_counterpart: 'エ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'e',
    telugu_phonetic: 'ఎ',
    telugu_pronunciation_guide: 'తెలుగులో "ఎ" (ఉదా: ఎలుక) లాగా పలకాలి.',
    row: 'a',
    column: 3,
    stroke_count: 2,
    stroke_paths: [
      'M 46 22 L 54 30', // Stroke 1: top dot
      'M 35 44 L 62 44 L 38 72 C 45 70 65 65 72 75' // Stroke 2: zigzag into wave
    ],
    stroke_directions: ['Short top stroke', 'Zigzag across, down diagonally, and swoop right like a wave'],
    mnemonic_en: 'An energetic ninja running down an incline.',
    mnemonic_te: 'తరంగం లాగా సాగే గీత "ఎ".',
    example_words: [
      { word: 'えき', reading: 'えき', romaji: 'eki', english: 'Train station', telugu: 'రైల్వే స్టేషన్', telugu_phonetic: 'ఎకి' },
      { word: 'えん', reading: 'えん', romaji: 'en', english: 'Yen (currency)', telugu: 'యెన్ (జపనీస్ కరెన్సీ)', telugu_phonetic: 'ఎన్' }
    ],
    common_mistakes: ['ん', 'そ']
  },
  {
    id: 'h_o',
    character: 'お',
    katakana_counterpart: 'オ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'o',
    telugu_phonetic: 'ఒ',
    telugu_pronunciation_guide: 'తెలుగులో "ఒ" (ఉదా: ఒంటె) లాగా పొట్టిగా, స్పష్టంగా పలకాలి.',
    row: 'a',
    column: 4,
    stroke_count: 3,
    stroke_paths: [
      'M 28 36 L 68 36', // Stroke 1: horizontal
      'M 48 20 L 48 65 C 48 76 35 78 35 68 C 35 55 60 52 68 68 C 72 76 66 82 58 84', // Stroke 2: loop
      'M 72 32 C 78 38 78 44 72 48' // Stroke 3: upper right accent dot
    ],
    stroke_directions: ['Horizontal line', 'Vertical line down into a loop to the right', 'Accent dot on top right'],
    mnemonic_en: 'A golfer shouting "Oh!" after hitting a ball (the right dot).',
    mnemonic_te: '"అ" (あ) లాగే ఉంటుంది కానీ పైన ఒక చుక్క/గీత (dot) అదనంగా ఉంటుంది.',
    example_words: [
      { word: 'お茶 (おちゃ)', reading: 'おちゃ', romaji: 'ocha', english: 'Green tea', telugu: 'గ్రీన్ టీ', telugu_phonetic: 'ఒచా' },
      { word: 'お金 (おかね)', reading: 'おかね', romaji: 'okane', english: 'Money', telugu: 'డబ్బులు', telugu_phonetic: 'ఒకనె' }
    ],
    common_mistakes: ['あ', 'む']
  },

  // --- Ka-row ---
  {
    id: 'h_ka',
    character: 'か',
    katakana_counterpart: 'カ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ka',
    telugu_phonetic: 'క / కా',
    telugu_pronunciation_guide: 'తెలుగులో "క" (ఉదా: కలం) లాగా పలకాలి.',
    row: 'ka',
    column: 0,
    stroke_count: 3,
    stroke_paths: [
      'M 34 32 L 34 68 C 34 76 42 76 48 72',
      'M 52 26 C 46 50 36 70 24 82',
      'M 68 34 C 74 40 72 46 68 48'
    ],
    stroke_directions: ['Left vertical hooked line', 'Intersecting curve sweeping left', 'Right upper drop stroke'],
    mnemonic_en: 'A person dancing: "Ka-ra-te" kick!',
    mnemonic_te: 'కుడివైపు ఒక చిన్న చుక్కతో ఉండే కరాటే కిక్ ఆకారం "క".',
    example_words: [
      { word: 'かさ', reading: 'かさ', romaji: 'kasa', english: 'Umbrella', telugu: 'గొడుగు', telugu_phonetic: 'కసా' },
      { word: 'かわ', reading: 'かわ', romaji: 'kawa', english: 'River', telugu: 'నది', telugu_phonetic: 'కవా' }
    ],
    common_mistakes: ['が', 'わ']
  },
  {
    id: 'h_ki',
    character: 'き',
    katakana_counterpart: 'キ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ki',
    telugu_phonetic: 'కి',
    telugu_pronunciation_guide: 'తెలుగులో "కి" (ఉదా: కిటికీ) లాగా పలకాలి.',
    row: 'ka',
    column: 1,
    stroke_count: 4,
    stroke_paths: [
      'M 30 34 L 70 34',
      'M 28 48 L 72 48',
      'M 56 22 L 44 72',
      'M 34 75 C 46 86 62 82 66 74'
    ],
    stroke_directions: ['Upper horizontal line', 'Lower horizontal line', 'Slanted downward stroke', 'Bottom curve'],
    mnemonic_en: 'Looks like a traditional brass Key: "kee" (ki).',
    mnemonic_te: 'తాళం చెవి (Key) ఆకారంలో రెండు అడ్డగీతలతో ఉంటుంది "కి". さ తో కన్‌ఫ్యూజ్ కావద్దు (さ కి ఒకే అడ్డగీత ఉంటుంది).',
    example_words: [
      { word: 'き', reading: 'き', romaji: 'ki', english: 'Tree / Wood', telugu: 'చెట్టు', telugu_phonetic: 'కి' },
      { word: 'きょう', reading: 'きょう', romaji: 'kyou', english: 'Today', telugu: 'ఈ రోజు', telugu_phonetic: 'క్యో' }
    ],
    common_mistakes: ['さ', 'ち']
  },
  {
    id: 'h_ku',
    character: 'く',
    katakana_counterpart: 'ク',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ku',
    telugu_phonetic: 'కు',
    telugu_pronunciation_guide: 'తెలుగులో "కు" లాగా పలకాలి. పెదవులను ఎక్కువగా ముందుకు సాచవద్దు.',
    row: 'ka',
    column: 2,
    stroke_count: 1,
    stroke_paths: [
      'M 65 30 L 35 50 L 65 72'
    ],
    stroke_directions: ['Single stroke: down-left angle, then sharp return down-right (< shape)'],
    mnemonic_en: 'A cuckoo bird\'s open beak crying: "ku-ku!"',
    mnemonic_te: 'పక్షి ముక్కు లాంటి "<" ఆకారం "కు".',
    example_words: [
      { word: 'くるま', reading: 'くるま', romaji: 'kuruma', english: 'Car', telugu: 'కారు / వాహనం', telugu_phonetic: 'కురుమా' },
      { word: 'くち', reading: 'くち', romaji: 'kuchi', english: 'Mouth', telugu: 'నోరు', telugu_phonetic: 'కుచి' }
    ],
    common_mistakes: ['へ', 'し']
  },
  {
    id: 'h_ke',
    character: 'け',
    katakana_counterpart: 'ケ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ke',
    telugu_phonetic: 'కె',
    telugu_pronunciation_guide: 'తెలుగులో "కె" (ఉదా: కెరటం) లాగా పలకాలి.',
    row: 'ka',
    column: 3,
    stroke_count: 3,
    stroke_paths: [
      'M 35 24 L 35 76 C 35 80 30 82 28 82',
      'M 52 36 L 76 36',
      'M 68 28 L 68 76'
    ],
    stroke_directions: ['Left vertical stroke with bottom hook', 'Right top horizontal', 'Right vertical crossing downward'],
    mnemonic_en: 'Looks like a Keg of beer or someone dancing K-pop.',
    mnemonic_te: 'ఎడమవైపు ఒక నిలువు గీత, కుడివైపు టీ (T) ఆకారపు గీత "కె".',
    example_words: [
      { word: 'けさ', reading: 'けさ', romaji: 'kesa', english: 'This morning', telugu: 'ఈ ఉదయం', telugu_phonetic: 'కెసా' },
      { word: 'けいさつ', reading: 'けいさつ', romaji: 'keisatsu', english: 'Police', telugu: 'పోలీసులు', telugu_phonetic: 'కేసాత్సు' }
    ],
    common_mistakes: ['は', 'に']
  },
  {
    id: 'h_ko',
    character: 'こ',
    katakana_counterpart: 'コ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ko',
    telugu_phonetic: 'కొ / కో',
    telugu_pronunciation_guide: 'తెలుగులో "కొ" లాగా పలకాలి.',
    row: 'ka',
    column: 4,
    stroke_count: 2,
    stroke_paths: [
      'M 34 36 C 50 34 66 34 68 38',
      'M 32 68 C 50 72 68 70 70 66'
    ],
    stroke_directions: ['Top horizontal stroke with slight hook', 'Bottom curved horizontal stroke'],
    mnemonic_en: 'Two worms facing each other: Co-operating!',
    mnemonic_te: 'పైకి ఒకటి, కిందకి ఒకటి ఉండే రెండు సమాంతర గీతలు "కొ".',
    example_words: [
      { word: 'これ', reading: 'これ', romaji: 'kore', english: 'This (near speaker)', telugu: 'ఇది (నా దగ్గర ఉన్నది)', telugu_phonetic: 'కొరె' },
      { word: 'こども', reading: 'こども', romaji: 'kodomo', english: 'Child', telugu: 'పిల్లవాడు', telugu_phonetic: 'కొదొమొ' }
    ],
    common_mistakes: ['い', 'に']
  },

  // --- Sa-row ---
  {
    id: 'h_sa',
    character: 'さ',
    katakana_counterpart: 'サ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'sa',
    telugu_phonetic: 'స / సా',
    telugu_pronunciation_guide: 'తెలుగులో "స" లాగా పలకాలి. "కి" (き) లా కాకుండా దీనికి ఒకే అడ్డగీత ఉంటుంది.',
    row: 'sa',
    column: 0,
    stroke_count: 3,
    stroke_paths: [
      'M 30 40 L 70 40',
      'M 54 26 L 44 68',
      'M 34 72 C 48 84 66 80 66 70'
    ],
    stroke_directions: ['Single horizontal line', 'Diagonal crossing stroke', 'Bottom loop opening left'],
    mnemonic_en: 'A samurai sword slicing diagonally.',
    mnemonic_te: 'ఒకే ఒక అడ్డగీతతో ఉండే కత్తి ఆకారం "స".',
    example_words: [
      { word: 'さかな', reading: 'さかな', romaji: 'sakana', english: 'Fish', telugu: 'చేప', telugu_phonetic: 'సకానా' },
      { word: 'さくら', reading: 'さくら', romaji: 'sakura', english: 'Cherry blossom', telugu: 'సకురా పువ్వు', telugu_phonetic: 'సకురా' }
    ],
    common_mistakes: ['き', 'ち']
  },
  {
    id: 'h_shi',
    character: 'し',
    katakana_counterpart: 'シ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'shi',
    telugu_phonetic: 'షి',
    telugu_pronunciation_guide: 'తెలుగులో "షి" (English "she") లాగా పలకాలి, "సి" కాదు.',
    row: 'sa',
    column: 1,
    stroke_count: 1,
    stroke_paths: [
      'M 45 22 L 45 65 C 45 82 68 82 72 65'
    ],
    stroke_directions: ['Single stroke: vertical down, curving smoothly up and right like a fishing hook'],
    mnemonic_en: 'A fishing hook to catch "she-fish" (shi).',
    mnemonic_te: 'చేపలు పట్టే గాలం (Fishing hook) లాంటి ఒక్కటే గీత "షి".',
    example_words: [
      { word: 'しろ', reading: 'しろ', romaji: 'shiro', english: 'White', telugu: 'తెలుపు', telugu_phonetic: 'షిరొ' },
      { word: 'しんぶん', reading: 'しんぶん', romaji: 'shinbun', english: 'Newspaper', telugu: 'వార్తాపత్రిక', telugu_phonetic: 'షిన్‌బున్' }
    ],
    common_mistakes: ['つ', 'く']
  },
  {
    id: 'h_su',
    character: 'す',
    katakana_counterpart: 'ス',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'su',
    telugu_phonetic: 'సు',
    telugu_pronunciation_guide: 'తెలుగులో "సు" లాగా పలకాలి.',
    row: 'sa',
    column: 2,
    stroke_count: 2,
    stroke_paths: [
      'M 25 36 L 75 36',
      'M 52 20 L 52 50 C 42 50 38 60 48 64 C 54 66 58 60 54 50 L 52 82'
    ],
    stroke_directions: ['Horizontal bar', 'Vertical stroke through, looping in a circle and dropping straight down'],
    mnemonic_en: 'A spiral sushi roll hanging on a chopstick.',
    mnemonic_te: 'అడ్డగీత మధ్యలో గుండ్రటి లూప్ వేసి కిందకు దిగే ఆకారం "సు".',
    example_words: [
      { word: 'すし', reading: 'すし', romaji: 'sushi', english: 'Sushi', telugu: 'సుషి (జపనీస్ వంటకం)', telugu_phonetic: 'సుషి' },
      { word: 'すき', reading: 'すき', romaji: 'suki', english: 'Like / Favorite', telugu: 'ఇష్టం', telugu_phonetic: 'సుకి' }
    ],
    common_mistakes: ['む', 'よ']
  },
  {
    id: 'h_se',
    character: 'せ',
    katakana_counterpart: 'セ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'se',
    telugu_phonetic: 'సె',
    telugu_pronunciation_guide: 'తెలుగులో "సె" (ఉదా: సెప్టెంబర్) లాగా పలకాలి.',
    row: 'sa',
    column: 3,
    stroke_count: 3,
    stroke_paths: [
      'M 25 44 L 75 44',
      'M 65 28 L 65 65 C 65 72 58 72 50 72',
      'M 40 24 L 40 76'
    ],
    stroke_directions: ['Horizontal crossbar', 'Right vertical hooked inward', 'Left vertical curving down'],
    mnemonic_en: 'Two people saying "Set" on a tennis court.',
    mnemonic_te: 'కుడివైపు హుక్ ఉన్న ఆకారం "సె".',
    example_words: [
      { word: 'せんせい', reading: 'せんせい', romaji: 'sensei', english: 'Teacher / Master', telugu: 'గురువు గారు / ఉపాధ్యాయుడు', telugu_phonetic: 'సెన్సేయ్' },
      { word: 'せかい', reading: 'せかい', romaji: 'sekai', english: 'World', telugu: 'ప్రపంచం', telugu_phonetic: 'సెకాయ్' }
    ],
    common_mistakes: ['や', 'け']
  },
  {
    id: 'h_so',
    character: 'そ',
    katakana_counterpart: 'ソ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'so',
    telugu_phonetic: 'సొ / సో',
    telugu_pronunciation_guide: 'తెలుగులో "సొ" లాగా పలకాలి.',
    row: 'sa',
    column: 4,
    stroke_count: 1,
    stroke_paths: [
      'M 36 30 L 64 30 L 36 54 L 64 54 C 64 74 42 78 36 70'
    ],
    stroke_directions: ['Single continuous zigzag: right, diagonal left, right, sweeping into bottom open curve'],
    mnemonic_en: 'A sewing needle zigzagging thread: "Sew" (so).',
    mnemonic_te: 'జిగ్‌జాగ్ (Z) లాగా మొదలై కింద అర్ధచంద్రాకారంగా మారే ఒకే గీత "సొ".',
    example_words: [
      { word: 'そこ', reading: 'そこ', romaji: 'soko', english: 'There (near listener)', telugu: 'అక్కడ (మీ దగ్గర ఉన్నది)', telugu_phonetic: 'సొకొ' },
      { word: 'そら', reading: 'そら', romaji: 'sora', english: 'Sky', telugu: 'ఆకాశం', telugu_phonetic: 'సొరా' }
    ],
    common_mistakes: ['て', 'ろ']
  },

  // --- Ta-row ---
  {
    id: 'h_ta',
    character: 'た',
    katakana_counterpart: 'タ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ta',
    telugu_phonetic: 'త / తా',
    telugu_pronunciation_guide: 'తెలుగులో "త" (ఉదా: తల) లాగా పలకాలి (English "T" కంటే మృదువైనది).',
    row: 'ta',
    column: 0,
    stroke_count: 4,
    stroke_paths: [
      'M 26 42 L 54 42',
      'M 42 26 L 36 74',
      'M 54 46 C 64 44 72 44 74 48',
      'M 52 64 C 62 66 72 64 72 62'
    ],
    stroke_directions: ['Left horizontal stroke', 'Crossing down stroke', 'Top right "ko" stroke', 'Bottom right "ko" stroke'],
    mnemonic_en: 'Spells out letters "t" and "a" combined!',
    mnemonic_te: 'ఎడమవైపు "t", కుడివైపు "こ" కలిసి ఉన్నట్లు ఉండే అక్షరం "త".',
    example_words: [
      { word: 'たべる', reading: 'たべる', romaji: 'taberu', english: 'To eat', telugu: 'తినడం', telugu_phonetic: 'తబెరు' },
      { word: 'たまご', reading: 'たまご', romaji: 'tamago', english: 'Egg', telugu: 'గుడ్డు', telugu_phonetic: 'తమాగొ' }
    ],
    common_mistakes: ['な', 'に']
  },
  {
    id: 'h_chi',
    character: 'ち',
    katakana_counterpart: 'チ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'chi',
    telugu_phonetic: 'చి',
    telugu_pronunciation_guide: 'తెలుగులో "చి" (English "chee") లాగా పలకాలి ("తి" కాదు). "సా" (さ) కి అద్దం లాంటి రివర్స్ ఆకారం!',
    row: 'ta',
    column: 1,
    stroke_count: 2,
    stroke_paths: [
      'M 28 36 L 68 36',
      'M 46 22 L 46 54 C 46 68 68 68 64 54'
    ],
    stroke_directions: ['Horizontal line', 'Vertical line looping into a "5"-like curve to the right'],
    mnemonic_en: 'A cheerleader waving her pompom: "Cheer!" (chi). Looks like number 5.',
    mnemonic_te: 'నెంబర్ "5" ఆకారంలో కుడివైపు తిరిగిన లూప్ "చి".',
    example_words: [
      { word: 'ちず', reading: 'ちず', romaji: 'chizu', english: 'Map', telugu: 'మ్యాప్ / పటం', telugu_phonetic: 'చిజు' },
      { word: 'ちかい', reading: 'ちかい', romaji: 'chikai', english: 'Near / Close', telugu: 'దగ్గర', telugu_phonetic: 'చికాయ్' }
    ],
    common_mistakes: ['さ', 'ら']
  },
  {
    id: 'h_tsu',
    character: 'つ',
    katakana_counterpart: 'ツ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'tsu',
    telugu_phonetic: 'త్సు',
    telugu_pronunciation_guide: 'తెలుగులో "త్సు" (English "tsunami" లేదా "cats" లోని "ts"). నాలుకను పై దంతాల వెనుక ఉంచి పలకాలి.',
    row: 'ta',
    column: 2,
    stroke_count: 1,
    stroke_paths: [
      'M 30 38 C 72 26 80 58 55 78'
    ],
    stroke_directions: ['Single smooth wave sweeping right and curving down like a massive tidal wave'],
    mnemonic_en: 'A gigantic TSU-nami ocean wave cresting!',
    mnemonic_te: 'సునామీ కెరటం లాంటి పెద్ద వంపు గల ఒక్కటే గీత "త్సు".',
    example_words: [
      { word: 'つき', reading: 'つき', romaji: 'tsuki', english: 'Moon / Month', telugu: 'చంద్రుడు / నెల', telugu_phonetic: 'త్సుకి' },
      { word: 'つくえ', reading: 'つくえ', romaji: 'tsukue', english: 'Desk', telugu: 'బల్ల / డెస్క్', telugu_phonetic: 'త్సుకుయె' }
    ],
    common_mistakes: ['し', 'う']
  },
  {
    id: 'h_te',
    character: 'て',
    katakana_counterpart: 'テ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'te',
    telugu_phonetic: 'తె',
    telugu_pronunciation_guide: 'తెలుగులో "తె" (ఉదా: తెలుగు) లాగా పలకాలి.',
    row: 'ta',
    column: 3,
    stroke_count: 1,
    stroke_paths: [
      'M 30 36 L 68 36 C 46 60 48 76 66 74'
    ],
    stroke_directions: ['Horizontal line across, sweeping back down left into an open cradle'],
    mnemonic_en: 'A dog\'s tail wagging or a table with one leg: "Te".',
    mnemonic_te: 'పై గీత గీసి కిందకు అర్ధ చంద్రాకారంగా వంచే ఒక్కటే గీత "తె".',
    example_words: [
      { word: 'て', reading: 'て', romaji: 'te', english: 'Hand', telugu: 'చేయి', telugu_phonetic: 'తె' },
      { word: 'てがみ', reading: 'てがみ', romaji: 'tegami', english: 'Letter', telugu: 'ఉత్తరం', telugu_phonetic: 'తెగామి' }
    ],
    common_mistakes: ['そ', 'と']
  },
  {
    id: 'h_to',
    character: 'と',
    katakana_counterpart: 'ト',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'to',
    telugu_phonetic: 'తొ / తో',
    telugu_pronunciation_guide: 'తెలుగులో "తొ" లాగా పలకాలి.',
    row: 'ta',
    column: 4,
    stroke_count: 2,
    stroke_paths: [
      'M 42 26 L 42 48',
      'M 38 48 C 68 44 72 74 48 78'
    ],
    stroke_directions: ['Short downward vertical stroke', 'Wide curved loop opening left, like a belly'],
    mnemonic_en: 'A big Toe with a little thorn stuck in it!',
    mnemonic_te: 'కాలి బొటనవేలు (Toe) లో ముల్లు గుచ్చుకున్నట్లు ఉండే ఆకారం "తొ".',
    example_words: [
      { word: 'ともだち', reading: 'ともだち', romaji: 'tomodachi', english: 'Friend', telugu: 'స్నేహితుడు', telugu_phonetic: 'తొమొదాచి' },
      { word: 'とり', reading: 'とり', romaji: 'tori', english: 'Bird', telugu: 'పక్షి', telugu_phonetic: 'తొరి' }
    ],
    common_mistakes: ['て', 'ど']
  },

  // --- Na-row ---
  {
    id: 'h_na',
    character: 'な',
    katakana_counterpart: 'ナ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'na',
    telugu_phonetic: 'న / నా',
    telugu_pronunciation_guide: 'తెలుగులో "న" లాగా పలకాలి.',
    row: 'na',
    column: 0,
    stroke_count: 4,
    stroke_paths: ['M 28 42 L 52 42', 'M 42 26 L 36 70', 'M 64 34 C 68 38 68 44 64 48', 'M 58 54 L 58 74 C 54 82 46 80 46 72'],
    stroke_directions: ['Left horizontal', 'Left diagonal crossing', 'Upper right dot', 'Bottom loop stroke'],
    mnemonic_en: 'A nun praying before a cross: "Nun" (na).',
    mnemonic_te: 'ఎడమవైపు సిలువ ఆకారం, కుడివైపు లూప్ ఉన్న అక్షరం "న".',
    example_words: [
      { word: 'なつ', reading: 'なつ', romaji: 'natsu', english: 'Summer', telugu: 'వేసవి కాలం', telugu_phonetic: 'నాత్సు' },
      { word: 'なまえ', reading: 'なまえ', romaji: 'namae', english: 'Name', telugu: 'పేరు', telugu_phonetic: 'నామాయె' }
    ],
    common_mistakes: ['た', 'に']
  },
  {
    id: 'h_ni',
    character: 'に',
    katakana_counterpart: 'ニ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ni',
    telugu_phonetic: 'ని',
    telugu_pronunciation_guide: 'తెలుగులో "ని" లాగా పలకాలి. కుడివైపు "కొ" (こ) ఉంటుంది.',
    row: 'na',
    column: 1,
    stroke_count: 3,
    stroke_paths: ['M 32 26 L 32 78', 'M 50 40 L 72 40', 'M 48 66 L 74 66'],
    stroke_directions: ['Left vertical stroke', 'Upper right horizontal', 'Lower right horizontal'],
    mnemonic_en: 'A needle and two stitches: "Knee" (ni).',
    mnemonic_te: 'ఎడమవైపు నిలువు గీత, కుడివైపు రెండు సమాంతర గీతలు "ని".',
    example_words: [
      { word: 'にほん', reading: 'にほん', romaji: 'nihon', english: 'Japan', telugu: 'జపాన్ దేశం', telugu_phonetic: 'నిహొన్' },
      { word: 'にく', reading: 'にく', romaji: 'niku', english: 'Meat', telugu: 'మాంసం', telugu_phonetic: 'నికు' }
    ],
    common_mistakes: ['こ', 'い']
  },
  {
    id: 'h_nu',
    character: 'ぬ',
    katakana_counterpart: 'ヌ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'nu',
    telugu_phonetic: 'ను',
    telugu_pronunciation_guide: 'తెలుగులో "ను" లాగా పలకాలి. "మె" (め) లాగే ఉంటుంది కానీ చివర ఒక చిన్న తోక లూప్ ఉంటుంది!',
    row: 'na',
    column: 2,
    stroke_count: 2,
    stroke_paths: ['M 38 30 L 46 76', 'M 30 50 C 50 36 74 44 68 70 C 64 80 50 78 50 72 C 50 66 64 68 68 76'],
    stroke_directions: ['Slanted downward stroke', 'Looping stroke swirling around with an extra knot at the tail'],
    mnemonic_en: 'Noodles wrapped around chopsticks with an extra loop at the end!',
    mnemonic_te: '"మె" (め) కి చివరిలో ముడి (loop) వేస్తే "ను" అవుతుంది.',
    example_words: [
      { word: 'いぬ', reading: 'いぬ', romaji: 'inu', english: 'Dog', telugu: 'కుక్క', telugu_phonetic: 'ఇను' },
      { word: 'ぬる', reading: 'ぬる', romaji: 'nuru', english: 'To paint', telugu: 'రంగు వేయడం', telugu_phonetic: 'నురు' }
    ],
    common_mistakes: ['め', 'ね']
  },
  {
    id: 'h_ne',
    character: 'ね',
    katakana_counterpart: 'ネ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ne',
    telugu_phonetic: 'నె',
    telugu_pronunciation_guide: 'తెలుగులో "నె" లాగా పలకాలి. "వా" (わ) మరియు "రె" (れ) లతో పోల్చి జాగ్రత్తగా గమనించండి.',
    row: 'na',
    column: 3,
    stroke_count: 2,
    stroke_paths: ['M 35 24 L 35 78', 'M 25 44 L 62 44 L 38 72 C 45 70 65 65 68 74 C 70 80 62 82 62 76'],
    stroke_directions: ['Left straight vertical', 'Zigzag into a loop that ends with a curl (snail tail)'],
    mnemonic_en: 'A cat with a curled tail: "Neko" means cat in Japanese!',
    mnemonic_te: 'తోకను ముడుచుకున్న పిల్లి (Neko) ఆకారం "నె".',
    example_words: [
      { word: 'ねこ', reading: 'ねこ', romaji: 'neko', english: 'Cat', telugu: 'పిల్లి', telugu_phonetic: 'నెకొ' },
      { word: 'ねる', reading: 'ねる', romaji: 'neru', english: 'To sleep', telugu: 'నిద్రపోవడం', telugu_phonetic: 'నెరు' }
    ],
    common_mistakes: ['わ', 'れ']
  },
  {
    id: 'h_no',
    character: 'の',
    katakana_counterpart: 'ノ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'no',
    telugu_phonetic: 'నొ / నో',
    telugu_pronunciation_guide: 'తెలుగులో "నొ" లాగా పలకాలి.',
    row: 'na',
    column: 4,
    stroke_count: 1,
    stroke_paths: ['M 52 32 L 40 68 C 36 78 46 82 56 76 C 72 64 68 38 48 42'],
    stroke_directions: ['Single stroke starting from center-right, dropping down-left, swooping up in a complete circle'],
    mnemonic_en: 'A circular "NO ENTRY" road sign: "No".',
    mnemonic_te: 'ఒకే ఒక రౌండ్ సున్నాలా తిరిగే గీత "నొ".',
    example_words: [
      { word: 'のむ', reading: 'のむ', romaji: 'nomu', english: 'To drink', telugu: 'త్రాగడం', telugu_phonetic: 'నొము' },
      { word: 'ノート', reading: 'のーと', romaji: 'nooto', english: 'Notebook', telugu: 'నోట్‌బుక్', telugu_phonetic: 'నోతో' }
    ],
    common_mistakes: ['め', 'ぬ']
  },

  // --- Nasal N ---
  {
    id: 'h_n',
    character: 'ん',
    katakana_counterpart: 'ン',
    system: 'hiragana',
    group: 'special',
    romaji: 'n',
    telugu_phonetic: 'న్ (అనుస్వార)',
    telugu_pronunciation_guide: 'తెలుగులో సున్న (అనుస్వార/న్) లాగా ముక్కుతో పలకాలి (Nasal consonant). ఇది ఏ వాక్యంలోనైనా మొదటి అక్షరంగా రాదు.',
    row: 'n',
    column: 0,
    stroke_count: 1,
    stroke_paths: ['M 38 28 L 32 74 C 36 50 62 48 64 68 C 66 78 72 80 76 76'],
    stroke_directions: ['Single stroke: down diagonally, curving up into a bridge and ending in a graceful upward flick'],
    mnemonic_en: 'Looks just like the cursive English lowercase "n"!',
    mnemonic_te: 'ఇంగ్లీష్ కర్సివ్ "n" లాగే ఉండే ఒక్కటే గీత "న్".',
    example_words: [
      { word: 'ほん', reading: 'ほん', romaji: 'hon', english: 'Book', telugu: 'పుస్తకం', telugu_phonetic: 'హొన్' },
      { word: 'みかん', reading: 'みかん', romaji: 'mikan', english: 'Mandarin orange', telugu: 'కమలా పండు', telugu_phonetic: 'మికాన్' }
    ],
    common_mistakes: ['え', 'そ']
  }
];
