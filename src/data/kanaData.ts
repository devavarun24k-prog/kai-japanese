import { KanaItem, KanaLesson } from '../types';

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
  },

  // --- H-Row ---
  {
    id: 'h_ha',
    character: 'は',
    katakana_counterpart: 'ハ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ha',
    telugu_phonetic: 'హ (పార్టికల్ గా వాడినప్పుడు "వా")',
    telugu_pronunciation_guide: 'పదాలలో "హ" లాగా, కానీ వాక్యంలో టాపిక్ పార్టికల్ గా వచ్చినప్పుడు "వా" (wa) లాగా పలకాలి.',
    row: 'ha',
    column: 0,
    stroke_count: 3,
    stroke_paths: ['M 32 25 L 32 78', 'M 48 38 L 78 38', 'M 64 22 L 64 65 C 64 78 50 78 50 68 C 50 58 64 58 64 68'],
    stroke_directions: ['Vertical stroke on the left', 'Horizontal top crossbar', 'Vertical stroke looping into a closed circle on the bottom right'],
    mnemonic_en: 'Looks like the letter "H" paired with a loop: "Ha"!',
    mnemonic_te: '"H" ఆకారంతో లూప్ కలిసినట్లు ఉండే అక్షరం "హ".',
    example_words: [
      { word: 'はな', reading: 'はな', romaji: 'hana', english: 'Flower / Nose', telugu: 'పువ్వు / ముక్కు', telugu_phonetic: 'హన' },
      { word: 'はい', reading: 'はい', romaji: 'hai', english: 'Yes', telugu: 'అవును', telugu_phonetic: 'హాయ్' }
    ],
    common_mistakes: ['ほ', 'け']
  },
  {
    id: 'h_hi',
    character: 'ひ',
    katakana_counterpart: 'ヒ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'hi',
    telugu_phonetic: 'హి',
    telugu_pronunciation_guide: 'తెలుగులో "హి" (ఉదా: హిమవంతుడు) లాగా పలకాలి.',
    row: 'ha',
    column: 1,
    stroke_count: 1,
    stroke_paths: ['M 28 42 L 45 32 C 55 25 72 45 68 68 C 65 80 50 82 42 75 C 38 68 45 42 75 42'],
    stroke_directions: ['Single stroke: starts horizontal, curves down in a deep U-smile, curves back up and out'],
    mnemonic_en: 'He has a big smile: "Hee-hee" (hi)!',
    mnemonic_te: 'పెద్దగా నవ్వుతున్న పెదవుల ఆకారం "హి".',
    example_words: [
      { word: 'ひと', reading: 'ひと', romaji: 'hito', english: 'Person', telugu: 'వ్యక్తి / మనిషి', telugu_phonetic: 'హితొ' },
      { word: 'ひ', reading: 'ひ', romaji: 'hi', english: 'Sun / Fire / Day', telugu: 'సూర్యుడు / నిప్పు', telugu_phonetic: 'హి' }
    ],
    common_mistakes: ['と', 'て']
  },
  {
    id: 'h_fu',
    character: 'ふ',
    katakana_counterpart: 'フ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'fu',
    telugu_phonetic: 'ఫు / హు',
    telugu_pronunciation_guide: 'పెదవులను దంతాలతో తాకించకుండా, కొవ్వొత్తిని ఆర్పేటప్పుడు ఊదినట్లు "ఫు" అని పలకాలి (Bilabial F).',
    row: 'ha',
    column: 2,
    stroke_count: 4,
    stroke_paths: ['M 50 20 L 52 30', 'M 48 40 C 44 65 30 75 28 78', 'M 32 55 L 25 65', 'M 68 55 L 75 65'],
    stroke_directions: ['Top dot', 'Center sweeping vertical stroke', 'Left side stroke', 'Right side stroke'],
    mnemonic_en: 'Mt. Fuji with snow falling on both sides: "Fu"!',
    mnemonic_te: 'ఫుజి పర్వతం పైన మంచు కురుస్తున్న చిత్రం "ఫు".',
    example_words: [
      { word: 'ふね', reading: 'ふね', romaji: 'fune', english: 'Boat / Ship', telugu: 'పడవ', telugu_phonetic: 'ఫునె' },
      { word: 'ふゆ', reading: 'ふゆ', romaji: 'fuyu', english: 'Winter', telugu: 'శీతాకాలం', telugu_phonetic: 'ఫుయు' }
    ],
    common_mistakes: ['う', 'え']
  },
  {
    id: 'h_he',
    character: 'へ',
    katakana_counterpart: 'ヘ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'he',
    telugu_phonetic: 'హె (పార్టికల్ గా "ఎ")',
    telugu_pronunciation_guide: 'సాధారణంగా "హె" అని, దిశను తెలిపే పార్టికల్ (Direction particle) గా వాడినప్పుడు "ఎ" (e) అని పలకాలి.',
    row: 'ha',
    column: 3,
    stroke_count: 1,
    stroke_paths: ['M 25 65 L 50 35 L 78 68'],
    stroke_directions: ['Single stroke: ascends up to a sharp peak then slopes down to the right'],
    mnemonic_en: 'A mountain peak to Hike up: "He"!',
    mnemonic_te: 'పర్వత శిఖరం లాంటి ఒకే గీత "హె".',
    example_words: [
      { word: 'へや', reading: 'へや', romaji: 'heya', english: 'Room', telugu: 'గది', telugu_phonetic: 'హెయ' },
      { word: 'へた', reading: 'へた', romaji: 'heta', english: 'Unskillful', telugu: 'నైపుణ్యం లేని', telugu_phonetic: 'హెత' }
    ],
    common_mistakes: ['く']
  },
  {
    id: 'h_ho',
    character: 'ほ',
    katakana_counterpart: 'ホ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ho',
    telugu_phonetic: 'హొ / హో',
    telugu_pronunciation_guide: 'తెలుగులో "హొ" లాగా పలకాలి. は (ha) లాగే ఉంటుంది కానీ పైన అదనంగా ఒక అడ్డగీత ఉంటుంది.',
    row: 'ha',
    column: 4,
    stroke_count: 4,
    stroke_paths: ['M 30 25 L 30 78', 'M 48 30 L 78 30', 'M 48 45 L 78 45', 'M 64 30 L 64 68 C 64 78 52 78 52 68 C 52 58 64 58 64 68'],
    stroke_directions: ['Left vertical stroke', 'Upper horizontal bar', 'Lower horizontal bar', 'Vertical stroke through bars looping at the bottom'],
    mnemonic_en: 'A Santa wearing a Hat: "Ho ho ho"!',
    mnemonic_te: 'హ్యాట్ ధరించిన ముఖం "హో" (Ho).',
    example_words: [
      { word: 'ほん', reading: 'ほん', romaji: 'hon', english: 'Book', telugu: 'పుస్తకం', telugu_phonetic: 'హొన్' },
      { word: 'ほし', reading: 'ほし', romaji: 'hoshi', english: 'Star', telugu: 'నక్షత్రం', telugu_phonetic: 'హొషి' }
    ],
    common_mistakes: ['は', 'ま']
  },

  // --- M-Row ---
  {
    id: 'h_ma',
    character: 'ま',
    katakana_counterpart: 'マ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ma',
    telugu_phonetic: 'మ',
    telugu_pronunciation_guide: 'తెలుగులో "మ" (ఉదా: మనసు) లాగా స్పష్టంగా పలకాలి. ほ (ho) లాంటి లూప్ ఉంటుంది కానీ ఎడమ గీత ఉండదు.',
    row: 'ma',
    column: 0,
    stroke_count: 3,
    stroke_paths: ['M 30 35 L 70 35', 'M 30 50 L 70 50', 'M 50 22 L 50 68 C 50 78 38 78 38 68 C 38 58 50 58 50 68'],
    stroke_directions: ['Top horizontal line', 'Second parallel horizontal line', 'Center vertical coming down and looping on the bottom left'],
    mnemonic_en: 'A Mast on a ship: "Ma"!',
    mnemonic_te: 'రెండు అడ్డగీతలు ఒక నిలువు లూప్ కలిగిన అక్షరం "మ".',
    example_words: [
      { word: 'まち', reading: 'まち', romaji: 'machi', english: 'Town / City', telugu: 'పట్టణం', telugu_phonetic: 'మచి' },
      { word: 'まえ', reading: 'まえ', romaji: 'mae', english: 'Front / Before', telugu: 'ముందు', telugu_phonetic: 'మయె' }
    ],
    common_mistakes: ['ほ', 'も']
  },
  {
    id: 'h_mi',
    character: 'み',
    katakana_counterpart: 'ミ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'mi',
    telugu_phonetic: 'మి',
    telugu_pronunciation_guide: 'తెలుగులో "మి" (ఉదా: మిత్రుడు) లాగా పలకాలి.',
    row: 'ma',
    column: 1,
    stroke_count: 2,
    stroke_paths: ['M 28 35 L 68 35 L 35 68 C 30 75 42 78 52 70', 'M 62 48 L 52 82'],
    stroke_directions: ['Horizontal line looping down diagonally', 'Slanted downward right stroke'],
    mnemonic_en: 'Looks like the number 21: "Who is 21? Me (mi)!"',
    mnemonic_te: '21 అంకె ఆకారాన్ని పోలి ఉండే అక్షరం "మి".',
    example_words: [
      { word: 'みず', reading: 'みず', romaji: 'mizu', english: 'Water', telugu: 'నీరు', telugu_phonetic: 'మిజు' },
      { word: 'みみ', reading: 'みみ', romaji: 'mimi', english: 'Ear', telugu: 'చెవి', telugu_phonetic: 'మిమి' }
    ],
    common_mistakes: ['よ', 'ぬ']
  },
  {
    id: 'h_mu',
    character: 'む',
    katakana_counterpart: 'ム',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'mu',
    telugu_phonetic: 'ము',
    telugu_pronunciation_guide: 'తెలుగులో "ము" లాగా పలకాలి.',
    row: 'ma',
    column: 2,
    stroke_count: 3,
    stroke_paths: ['M 28 35 L 65 35', 'M 45 22 L 45 62 C 45 72 35 72 35 62 C 35 52 65 52 68 68 C 70 78 62 82 55 82', 'M 72 25 L 78 35'],
    stroke_directions: ['Top horizontal line', 'Vertical stroke into a bottom loop and swoop up', 'Right detached accent stroke'],
    mnemonic_en: 'A cow face with a nose ring: "Mooo (mu)!"',
    mnemonic_te: 'ఆవు ముఖం లాంటి ఆకారం "ము" (Moo).',
    example_words: [
      { word: 'むし', reading: 'むし', romaji: 'mushi', english: 'Insect / Bug', telugu: 'కీటకం', telugu_phonetic: 'ముషి' },
      { word: 'むずかしい', reading: 'むずかしい', romaji: 'muzukashii', english: 'Difficult', telugu: 'కష్టమైన', telugu_phonetic: 'ముజుకషీ' }
    ],
    common_mistakes: ['す']
  },
  {
    id: 'h_me',
    character: 'め',
    katakana_counterpart: 'メ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'me',
    telugu_phonetic: 'మె',
    telugu_pronunciation_guide: 'తెలుగులో "మె" లాగా పలకాలి. ぬ (nu) లాగే ఉంటుంది కానీ చివర లూప్ ఉండదు.',
    row: 'ma',
    column: 3,
    stroke_count: 2,
    stroke_paths: ['M 38 30 L 62 75', 'M 55 25 C 35 48 25 68 35 78 C 45 88 75 75 72 50 C 70 38 52 35 42 42'],
    stroke_directions: ['Slanted stroke down right', 'Looping stroke curving around without tail knot'],
    mnemonic_en: 'An eye (Me in Japanese means Eye) with a noodle: "Me"!',
    mnemonic_te: 'కన్ను (జపనీస్‌లో "మె" అంటే కన్ను) లాంటి గుండ్రని ఆకారం.',
    example_words: [
      { word: 'め', reading: 'め', romaji: 'me', english: 'Eye', telugu: 'కన్ను', telugu_phonetic: 'మె' },
      { word: 'めがね', reading: 'めがね', romaji: 'megane', english: 'Glasses', telugu: 'కళ్ళజోడు', telugu_phonetic: 'మెగనె' }
    ],
    common_mistakes: ['ぬ', 'あ']
  },
  {
    id: 'h_mo',
    character: 'も',
    katakana_counterpart: 'モ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'mo',
    telugu_phonetic: 'మొ / మో',
    telugu_pronunciation_guide: 'తెలుగులో "మొ" లాగా పలకాలి. し (shi) ఆకారం గుండా రెండు అడ్డగీతలు ఉంటాయి.',
    row: 'ma',
    column: 4,
    stroke_count: 3,
    stroke_paths: ['M 48 20 L 48 68 C 48 82 62 82 68 75', 'M 35 38 L 65 38', 'M 35 52 L 65 52'],
    stroke_directions: ['Center hook curving right at bottom', 'Upper horizontal crossbar', 'Lower horizontal crossbar'],
    mnemonic_en: 'A fish hook to catch More fish: "Mo"!',
    mnemonic_te: 'చేపల గాలంపై రెండు గీతలు ఉండే అక్షరం "మొ".',
    example_words: [
      { word: 'もの', reading: 'もの', romaji: 'mono', english: 'Thing / Object', telugu: 'వస్తువు', telugu_phonetic: 'మొనొ' },
      { word: 'もも', reading: 'もも', romaji: 'momo', english: 'Peach', telugu: 'పీచ్ పండు', telugu_phonetic: 'మొమొ' }
    ],
    common_mistakes: ['ま', 'し']
  },

  // --- Y-Row ---
  {
    id: 'h_ya',
    character: 'や',
    katakana_counterpart: 'ヤ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ya',
    telugu_phonetic: 'య',
    telugu_pronunciation_guide: 'తెలుగులో "య" (ఉదా: యమున) లాగా పలకాలి.',
    row: 'ya',
    column: 0,
    stroke_count: 3,
    stroke_paths: ['M 30 42 C 45 35 70 38 68 55 C 66 65 55 68 45 65', 'M 62 25 L 68 32', 'M 42 22 L 42 78'],
    stroke_directions: ['Left-to-right curve with rounded drop', 'Small top tick mark', 'Vertical stroke cutting down'],
    mnemonic_en: 'A Yak with long horns: "Ya"!',
    mnemonic_te: 'యాక్ (Yak) కొమ్ముల ఆకారం "య".',
    example_words: [
      { word: 'やま', reading: 'やま', romaji: 'yama', english: 'Mountain', telugu: 'పర్వతం', telugu_phonetic: 'యమ' },
      { word: 'やすみ', reading: 'やすみ', romaji: 'yasumi', english: 'Rest / Holiday', telugu: 'సెలవు', telugu_phonetic: 'యసుమి' }
    ],
    common_mistakes: ['か', 'せ']
  },
  {
    id: 'h_yu',
    character: 'ゆ',
    katakana_counterpart: 'ユ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'yu',
    telugu_phonetic: 'యు',
    telugu_pronunciation_guide: 'తెలుగులో "యు" (ఉదా: యుద్ధం) లాగా పలకాలి.',
    row: 'ya',
    column: 2,
    stroke_count: 2,
    stroke_paths: ['M 35 28 L 35 65 C 35 78 52 78 65 65 C 75 52 75 35 62 35 C 50 35 48 50 48 50', 'M 60 22 L 60 78'],
    stroke_directions: ['Looping stroke swooping up and around', 'Vertical stroke piercing down through the loop'],
    mnemonic_en: 'A graceful fish swimming up to You: "Yu"!',
    mnemonic_te: 'చేప తోకలా ఉండే అక్షరం "యు".',
    example_words: [
      { word: 'ゆき', reading: 'ゆき', romaji: 'yuki', english: 'Snow', telugu: 'మంచు', telugu_phonetic: 'యుకి' },
      { word: 'ゆめ', reading: 'ゆめ', romaji: 'yume', english: 'Dream', telugu: 'కల', telugu_phonetic: 'యుమె' }
    ],
    common_mistakes: ['ぬ', 'わ']
  },
  {
    id: 'h_yo',
    character: 'よ',
    katakana_counterpart: 'ヨ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'yo',
    telugu_phonetic: 'యొ / యో',
    telugu_pronunciation_guide: 'తెలుగులో "యొ" లాగా పలకాలి.',
    row: 'ya',
    column: 4,
    stroke_count: 2,
    stroke_paths: ['M 32 40 L 52 40', 'M 52 22 L 52 68 C 52 78 40 78 40 68 C 40 58 52 58 52 68'],
    stroke_directions: ['Short horizontal crossbar on the left', 'Vertical stroke looping closed at bottom and curving right'],
    mnemonic_en: 'A toy Yo-Yo hanging from a string: "Yo"!',
    mnemonic_te: 'యో-యో (Yo-Yo) బొమ్మ ఆకారం "యొ".',
    example_words: [
      { word: 'よる', reading: 'よる', romaji: 'yoru', english: 'Night', telugu: 'రాత్రి', telugu_phonetic: 'యొరు' },
      { word: 'よい', reading: 'よい', romaji: 'yoi', english: 'Good', telugu: 'మంచిది', telugu_phonetic: 'యొయ్' }
    ],
    common_mistakes: ['ま', 'は']
  },

  // --- R-Row ---
  {
    id: 'h_ra',
    character: 'ら',
    katakana_counterpart: 'ラ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ra',
    telugu_phonetic: 'ర / లా',
    telugu_pronunciation_guide: 'నాలుక కొనను దంతాల పైభాగానికి సున్నితంగా తాకించి "ర" మరియు "ల" ల మధ్యస్త శబ్దంగా పలకాలి (Japanese Flap R).',
    row: 'ra',
    column: 0,
    stroke_count: 2,
    stroke_paths: ['M 42 22 L 55 28', 'M 42 40 L 42 55 C 42 75 68 75 68 62 C 68 50 55 48 50 52'],
    stroke_directions: ['Top dot stroke', 'Vertical down into a rounded backwards-5 loop'],
    mnemonic_en: 'A Rabbit hopping: "Ra"!',
    mnemonic_te: 'కుందేలు చెవులు, వీపు ఆకారం "ర".',
    example_words: [
      { word: 'らいしゅう', reading: 'らいしゅう', romaji: 'raishuu', english: 'Next week', telugu: 'వచ్చే వారం', telugu_phonetic: 'రాయిషూ' },
      { word: 'らーめん', reading: 'らーめん', romaji: 'raamen', english: 'Ramen noodles', telugu: 'రామెన్ నూడుల్స్', telugu_phonetic: 'రామెన్' }
    ],
    common_mistakes: ['ち', 'う']
  },
  {
    id: 'h_ri',
    character: 'り',
    katakana_counterpart: 'リ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ri',
    telugu_phonetic: 'రి',
    telugu_pronunciation_guide: 'తెలుగులో "రి" లాగా పలకాలి. い (i) లాగే ఉంటుంది కానీ కుడి గీత ఎడమదానికంటే పొడవుగా ఉంటుంది.',
    row: 'ra',
    column: 1,
    stroke_count: 2,
    stroke_paths: ['M 35 30 L 35 60 C 35 68 40 68 42 64', 'M 62 20 L 62 65 C 62 78 52 82 48 80'],
    stroke_directions: ['Shorter left vertical stroke with slight hook', 'Longer elegant right downward curve'],
    mnemonic_en: 'A flowing River: "Ri"!',
    mnemonic_te: 'ప్రవహించే నది లాంటి రెండు గీతలు "రి".',
    example_words: [
      { word: 'りんご', reading: 'りんご', romaji: 'ringo', english: 'Apple', telugu: 'ఆపిల్ పండు', telugu_phonetic: 'రింగొ' },
      { word: 'りょうり', reading: 'りょうり', romaji: 'ryouri', english: 'Cooking / Cuisine', telugu: 'వంటకం', telugu_phonetic: 'ర్యౌరి' }
    ],
    common_mistakes: ['い', 'し']
  },
  {
    id: 'h_ru',
    character: 'る',
    katakana_counterpart: 'ル',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ru',
    telugu_phonetic: 'రు',
    telugu_pronunciation_guide: 'తెలుగులో "రు" లాగా పలకాలి. ろ (ro) లాగే మొదలవుతుంది కానీ చివర చిన్న గుండ్రని లూప్ ఉంటుంది.',
    row: 'ra',
    column: 2,
    stroke_count: 1,
    stroke_paths: ['M 35 32 L 65 32 L 40 58 C 35 78 72 78 70 58 C 68 48 55 48 52 55 C 50 62 58 65 62 62'],
    stroke_directions: ['Single stroke: horizontal right, down diagonal, sweeping wide loop ending in an inner loop'],
    mnemonic_en: 'Three roads with a Ruby curled at the end: "Ru"!',
    mnemonic_te: 'చివర రత్నం లాంటి చిన్న సున్నా ఉండే 3 ఆకారం "రు".',
    example_words: [
      { word: 'くるま', reading: 'くるま', romaji: 'kuruma', english: 'Car', telugu: 'కారు', telugu_phonetic: 'కురుమ' },
      { word: 'はる', reading: 'はる', romaji: 'haru', english: 'Spring season', telugu: 'వసంత ఋతువు', telugu_phonetic: 'హరు' }
    ],
    common_mistakes: ['ろ', 'ね']
  },
  {
    id: 'h_re',
    character: 'れ',
    katakana_counterpart: 'レ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 're',
    telugu_phonetic: 'రె',
    telugu_pronunciation_guide: 'తెలుగులో "రె" లాగా పలకాలి. わ (wa) మరియు ね (ne) లాగే మొదలవుతుంది కానీ చివర బయటకు ఎగురుతుంది.',
    row: 'ra',
    column: 3,
    stroke_count: 2,
    stroke_paths: ['M 35 25 L 35 78', 'M 35 48 L 55 35 L 42 75 C 50 62 65 60 72 72'],
    stroke_directions: ['Left straight vertical stem', 'Z-like zigzag flicking out elegantly to the right'],
    mnemonic_en: 'A person Resting with legs kicked out: "Re"!',
    mnemonic_te: 'విశ్రాంతి తీసుకుంటూ కాళ్లు ముందుకు చాచిన ఆకారం "రె".',
    example_words: [
      { word: 'れい', reading: 'れい', romaji: 'rei', english: 'Zero / Example', telugu: 'సున్నా / ఉదాహరణ', telugu_phonetic: 'రెయి' },
      { word: 'れんしゅう', reading: 'れんしゅう', romaji: 'renshuu', english: 'Practice / Drill', telugu: 'సాధన', telugu_phonetic: 'రెన్షూ' }
    ],
    common_mistakes: ['わ', 'ね']
  },
  {
    id: 'h_ro',
    character: 'ろ',
    katakana_counterpart: 'ロ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'ro',
    telugu_phonetic: 'రొ / రో',
    telugu_pronunciation_guide: 'తెలుగులో "రొ" లాగా పలకాలి. る (ru) లాగే ఉంటుంది కానీ చివర లూప్ ఉండదు.',
    row: 'ra',
    column: 4,
    stroke_count: 1,
    stroke_paths: ['M 35 32 L 65 32 L 40 58 C 35 78 72 78 68 55'],
    stroke_directions: ['Single stroke like number 3 without a bottom curl'],
    mnemonic_en: 'A Road winding along: "Ro"!',
    mnemonic_te: 'రహదారి మలుపు లాంటి ఒకే గీత "రొ".',
    example_words: [
      { word: 'ろく', reading: 'ろく', romaji: 'roku', english: 'Six (6)', telugu: 'ఆరు (6)', telugu_phonetic: 'రొకు' },
      { word: 'しろ', reading: 'しろ', romaji: 'shiro', english: 'White / Castle', telugu: 'తెలుపు', telugu_phonetic: 'శిరొ' }
    ],
    common_mistakes: ['る', 'ろ']
  },

  // --- W-Row ---
  {
    id: 'h_wa',
    character: 'わ',
    katakana_counterpart: 'ワ',
    system: 'hiragana',
    group: 'gojuon',
    romaji: 'wa',
    telugu_phonetic: 'వ',
    telugu_pronunciation_guide: 'తెలుగులో "వ" (ఉదా: వనము) లాగా పలకాలి.',
    row: 'wa',
    column: 0,
    stroke_count: 2,
    stroke_paths: ['M 35 25 L 35 78', 'M 35 48 L 55 35 L 42 75 C 50 62 75 62 70 75'],
    stroke_directions: ['Left straight vertical stem', 'Curving arc sweeping smoothly down and right without closing'],
    mnemonic_en: 'A graceful White Swan: "Wa"!',
    mnemonic_te: 'హంస మెడలా ఉండే అందమైన అక్షరం "వ".',
    example_words: [
      { word: 'わたし', reading: 'わたし', romaji: 'watashi', english: 'I / Me', telugu: 'నేను', telugu_phonetic: 'వతాషి' },
      { word: 'わかる', reading: 'わかる', romaji: 'wakaru', english: 'To understand', telugu: 'అర్థం కావడం', telugu_phonetic: 'వకారు' }
    ],
    common_mistakes: ['れ', 'ね']
  },
  {
    id: 'h_wo',
    character: 'を',
    katakana_counterpart: 'ヲ',
    system: 'hiragana',
    group: 'special',
    romaji: 'wo',
    telugu_phonetic: 'ఒ (ఆబ్జెక్ట్ మార్కర్)',
    telugu_pronunciation_guide: 'ఆధునిక జపనీస్‌లో దీనిని సాధారణంగా "ఒ" (o) లాగే పలుకుతారు. ఇది కేవలం వాక్యంలో కర్మ కారకంగా (Object Particle: を) మాత్రమే వాడబడుతుంది, పదాల లోపల రాదు.',
    row: 'wa',
    column: 1,
    stroke_count: 3,
    stroke_paths: ['M 30 35 L 68 35', 'M 48 22 L 40 55 L 70 55', 'M 45 55 C 35 68 45 80 62 75 C 72 70 70 58 60 58'],
    stroke_directions: ['Top horizontal bar', 'Diagonal down with hook to the right', 'Bottom curving C-shape hook'],
    mnemonic_en: 'An Olympic athlete with an Object: "O / Wo"!',
    mnemonic_te: 'ఆబ్జెక్ట్ మార్కర్‌గా వాడే ప్రత్యేక అక్షరం "ఒ" (wo).',
    example_words: [
      { word: 'みずをのむ', reading: 'みずをのむ', romaji: 'mizu o nomu', english: 'Drink water (water [o] drink)', telugu: 'నీటిని త్రాగడం', telugu_phonetic: 'మిజు ఒ నొము' }
    ],
    common_mistakes: ['あ', 'お']
  }
];

// ==========================================
// KATAKANA DATASET
// ==========================================
export const KATAKANA_DATA: KanaItem[] = [
  {
    id: 'k_a',
    character: 'ア',
    katakana_counterpart: 'あ',
    system: 'katakana',
    group: 'gojuon',
    romaji: 'a',
    telugu_phonetic: 'అ',
    telugu_pronunciation_guide: 'కటకాన "అ". విదేశీ పదాలు, పేర్లు రాయడానికి వాడతారు.',
    row: 'a',
    column: 0,
    stroke_count: 2,
    stroke_paths: ['M 30 30 L 68 30 L 52 50', 'M 50 45 C 45 65 35 78 28 82'],
    stroke_directions: ['Horizontal right with hook down-left', 'Sweeping left curve stroke'],
    mnemonic_en: 'Looks like an Axe chopping down: "A"!',
    mnemonic_te: 'గొడ్డలి ఆకారం "అ".',
    example_words: [
      { word: 'アイス', reading: 'あいす', romaji: 'aisu', english: 'Ice cream', telugu: 'ఐస్ క్రీమ్', telugu_phonetic: 'ఐసు' }
    ],
    common_mistakes: ['マ', 'フ']
  },
  {
    id: 'k_i',
    character: 'イ',
    katakana_counterpart: 'い',
    system: 'katakana',
    group: 'gojuon',
    romaji: 'i',
    telugu_phonetic: 'ఇ',
    telugu_pronunciation_guide: 'కటకాన "ఇ".',
    row: 'a',
    column: 1,
    stroke_count: 2,
    stroke_paths: ['M 52 25 L 35 55', 'M 48 45 L 48 82'],
    stroke_directions: ['Slanted down-left stroke', 'Vertical straight stem'],
    mnemonic_en: 'An Easel standing tall: "I"!',
    mnemonic_te: 'స్టాండ్ పై ఉన్న ఈజెల్ ఆకారం "ఇ".',
    example_words: [
      { word: 'インド', reading: 'いんど', romaji: 'indo', english: 'India', telugu: 'భారతదేశం (ఇండియా)', telugu_phonetic: 'ఇందొ' }
    ],
    common_mistakes: ['ト', 'ソ']
  },
  {
    id: 'k_u',
    character: 'ウ',
    katakana_counterpart: 'う',
    system: 'katakana',
    group: 'gojuon',
    romaji: 'u',
    telugu_phonetic: 'ఉ',
    telugu_pronunciation_guide: 'కటకాన "ఉ".',
    row: 'a',
    column: 2,
    stroke_count: 3,
    stroke_paths: ['M 50 20 L 50 30', 'M 32 38 L 32 52', 'M 32 40 L 68 40 L 58 75'],
    stroke_directions: ['Top vertical dot', 'Left short vertical', 'Top horizontal bar hooking down-left'],
    mnemonic_en: 'An Umbrella top: "U"!',
    mnemonic_te: 'గొడుగు పైభాగం ఆకారం "ఉ".',
    example_words: [
      { word: 'ウェブ', reading: 'うぇぶ', romaji: 'webu', english: 'Web', telugu: 'వెబ్‌సైట్', telugu_phonetic: 'వెబు' }
    ],
    common_mistakes: ['ワ', 'フ']
  },
  {
    id: 'k_e',
    character: 'エ',
    katakana_counterpart: 'え',
    system: 'katakana',
    group: 'gojuon',
    romaji: 'e',
    telugu_phonetic: 'ఎ',
    telugu_pronunciation_guide: 'కటకాన "ఎ".',
    row: 'a',
    column: 3,
    stroke_count: 3,
    stroke_paths: ['M 32 30 L 68 30', 'M 50 30 L 50 68', 'M 25 70 L 75 70'],
    stroke_directions: ['Top horizontal line', 'Center vertical post', 'Bottom longer horizontal foundation'],
    mnemonic_en: 'An Elevator girder beam: "E"!',
    mnemonic_te: 'ఐరన్ పిల్లర్ లాంటి ఆకారం "ఎ".',
    example_words: [
      { word: 'エレベーター', reading: 'えれべーたー', romaji: 'erebeetaa', english: 'Elevator', telugu: 'లిఫ్ట్ (ఎలివేటర్)', telugu_phonetic: 'ఎరెబేతా' }
    ],
    common_mistakes: ['工']
  },
  {
    id: 'k_o',
    character: 'オ',
    katakana_counterpart: 'お',
    system: 'katakana',
    group: 'gojuon',
    romaji: 'o',
    telugu_phonetic: 'ఒ / ఓ',
    telugu_pronunciation_guide: 'కటకాన "ఒ".',
    row: 'a',
    column: 4,
    stroke_count: 3,
    stroke_paths: ['M 30 35 L 70 35', 'M 50 35 L 50 78 C 50 82 45 80 40 76', 'M 50 50 L 32 75'],
    stroke_directions: ['Horizontal top line', 'Vertical hooked stem', 'Slanted left kick-out'],
    mnemonic_en: 'An Opera singer with arm outstretched: "O"!',
    mnemonic_te: 'గాయకుడి ఆకారం "ఒ".',
    example_words: [
      { word: 'オレンジ', reading: 'おれんじ', romaji: 'orenji', english: 'Orange', telugu: 'నారింజ పండు', telugu_phonetic: 'ఒరెంజి' }
    ],
    common_mistakes: ['木', 'ホ']
  },
  {
    id: 'k_ka',
    character: 'カ',
    katakana_counterpart: 'か',
    system: 'katakana',
    group: 'gojuon',
    romaji: 'ka',
    telugu_phonetic: 'క',
    telugu_pronunciation_guide: 'కటకాన "క". హిరగాన か లాగే ఉంటుంది కానీ డ్రాప్ చుక్క ఉండదు.',
    row: 'ka',
    column: 0,
    stroke_count: 2,
    stroke_paths: ['M 32 35 L 68 35 L 60 75', 'M 52 22 C 48 55 35 72 25 82'],
    stroke_directions: ['Top horizontal hooking down-left', 'Long sweeping curved stroke cutting down'],
    mnemonic_en: 'A Card edge or Kite: "Ka"!',
    mnemonic_te: 'పదునైన కత్తి గీత లాంటి "క".',
    example_words: [
      { word: 'カメラ', reading: 'かめら', romaji: 'kamera', english: 'Camera', telugu: 'కెమెరా', telugu_phonetic: 'కమెర' }
    ],
    common_mistakes: ['力']
  },
  {
  "id": "k_ki",
  "character": "キ",
  "katakana_counterpart": "き",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ki",
  "telugu_phonetic": "కి",
  "telugu_pronunciation_guide": "కటకాన \"కి\". రెండు అడ్డగీతలు మరియు ఒక ఏటవాలు గీత.",
  "row": "ka",
  "column": 1,
  "stroke_count": 3,
  "stroke_paths": [
    "M 30 35 L 70 35",
    "M 28 50 L 72 50",
    "M 54 22 C 50 60 40 75 25 85"
  ],
  "stroke_directions": [
    "Top horizontal line",
    "Second horizontal line",
    "Slanted vertical curve down-left"
  ],
  "mnemonic_en": "A Key: \"Ki\"!",
  "mnemonic_te": "తాళంచెవి లాంటి రెండు అడ్డగీతల ఆకారం \"కి\".",
  "example_words": [
    {
      "word": "キロ",
      "reading": "きろ",
      "romaji": "kiro",
      "english": "Kilo",
      "telugu": "కిలో",
      "telugu_phonetic": "కిరొ"
    }
  ],
  "common_mistakes": [
    "き",
    "チ"
  ]
},
  {
  "id": "k_ku",
  "character": "ク",
  "katakana_counterpart": "く",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ku",
  "telugu_phonetic": "కు",
  "telugu_pronunciation_guide": "కటకాన \"కు\".",
  "row": "ka",
  "column": 2,
  "stroke_count": 2,
  "stroke_paths": [
    "M 45 25 L 30 50",
    "M 32 45 L 68 45 C 55 68 45 78 25 85"
  ],
  "stroke_directions": [
    "Left short slant",
    "Horizontal turning into sweeping down-left curve"
  ],
  "mnemonic_en": "A Cook hat: \"Ku\"!",
  "mnemonic_te": "కుక్ టోపీ ఆకారం \"కు\".",
  "example_words": [
    {
      "word": "クラス",
      "reading": "くらす",
      "romaji": "kurasu",
      "english": "Class",
      "telugu": "తరగతి (క్లాస్)",
      "telugu_phonetic": "కురసు"
    }
  ],
  "common_mistakes": [
    "ワ",
    "ケ"
  ]
},
  {
  "id": "k_ke",
  "character": "ケ",
  "katakana_counterpart": "け",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ke",
  "telugu_phonetic": "కె",
  "telugu_pronunciation_guide": "కటకాన \"కె\".",
  "row": "ka",
  "column": 3,
  "stroke_count": 3,
  "stroke_paths": [
    "M 45 22 L 30 45",
    "M 32 45 L 72 45",
    "M 55 45 C 50 65 42 78 25 85"
  ],
  "stroke_directions": [
    "Top left slant",
    "Horizontal crossbar",
    "Sweeping down-left curve"
  ],
  "mnemonic_en": "Looks like the letter K: \"Ke\"!",
  "mnemonic_te": "K అక్షరం లాంటి గీతలు \"కె\".",
  "example_words": [
    {
      "word": "ケーキ",
      "reading": "けーき",
      "romaji": "keeki",
      "english": "Cake",
      "telugu": "కేక్",
      "telugu_phonetic": "కేకి"
    }
  ],
  "common_mistakes": [
    "ク",
    "テ"
  ]
},
  {
  "id": "k_ko",
  "character": "コ",
  "katakana_counterpart": "こ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ko",
  "telugu_phonetic": "కొ",
  "telugu_pronunciation_guide": "కటకాన \"కొ\". మూల తిరిగిన పెట్టె ఆకారం.",
  "row": "ka",
  "column": 4,
  "stroke_count": 2,
  "stroke_paths": [
    "M 32 30 L 68 30 L 68 70",
    "M 32 70 L 68 70"
  ],
  "stroke_directions": [
    "Top horizontal line turning down",
    "Bottom horizontal base line"
  ],
  "mnemonic_en": "A square Corner: \"Ko\"!",
  "mnemonic_te": "మూల (కార్నర్) ఆకారం \"కొ\".",
  "example_words": [
    {
      "word": "コーヒー",
      "reading": "こーひー",
      "romaji": "koohii",
      "english": "Coffee",
      "telugu": "కాఫీ",
      "telugu_phonetic": "కోహీ"
    }
  ],
  "common_mistakes": [
    "ユ",
    "ロ"
  ]
},
  {
  "id": "k_sa",
  "character": "サ",
  "katakana_counterpart": "さ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "sa",
  "telugu_phonetic": "స",
  "telugu_pronunciation_guide": "కటకాన \"స\".",
  "row": "sa",
  "column": 0,
  "stroke_count": 3,
  "stroke_paths": [
    "M 28 40 L 72 40",
    "M 40 28 L 40 55",
    "M 60 28 C 60 55 52 70 38 82"
  ],
  "stroke_directions": [
    "Horizontal bar",
    "Left vertical stroke",
    "Right longer curved stroke"
  ],
  "mnemonic_en": "Three Sardines on a stick: \"Sa\"!",
  "mnemonic_te": "సార్డిన్ చేపల కర్ర \"స\".",
  "example_words": [
    {
      "word": "サラダ",
      "reading": "さらだ",
      "romaji": "sarada",
      "english": "Salad",
      "telugu": "సలాడ్",
      "telugu_phonetic": "సరాద"
    }
  ],
  "common_mistakes": [
    "セ",
    "キ"
  ]
},
  {
  "id": "k_shi",
  "character": "シ",
  "katakana_counterpart": "し",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "shi",
  "telugu_phonetic": "షి",
  "telugu_pronunciation_guide": "కటకాన \"షి\". కింద నుండి పైకి స్వీప్ అయ్యే స్ట్రోక్.",
  "row": "sa",
  "column": 1,
  "stroke_count": 3,
  "stroke_paths": [
    "M 35 30 L 45 35",
    "M 32 50 L 42 55",
    "M 28 75 C 45 65 60 50 72 32"
  ],
  "stroke_directions": [
    "Top left dot",
    "Middle left dot",
    "Long stroke sweeping from bottom-left to top-right"
  ],
  "mnemonic_en": "She has smiling eyes looking up: \"Shi\"!",
  "mnemonic_te": "పైకి చూస్తున్న నవ్వు ముఖం \"షి\".",
  "example_words": [
    {
      "word": "シャツ",
      "reading": "しゃつ",
      "romaji": "shatsu",
      "english": "Shirt",
      "telugu": "చొక్కా (షర్ట్)",
      "telugu_phonetic": "షత్సు"
    }
  ],
  "common_mistakes": [
    "ツ",
    "ン",
    "ソ"
  ]
},
  {
  "id": "k_su",
  "character": "ス",
  "katakana_counterpart": "す",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "su",
  "telugu_phonetic": "సు",
  "telugu_pronunciation_guide": "కటకాన \"సు\".",
  "row": "sa",
  "column": 2,
  "stroke_count": 2,
  "stroke_paths": [
    "M 32 32 L 68 32 C 55 55 45 70 28 85",
    "M 50 52 L 68 80"
  ],
  "stroke_directions": [
    "Horizontal turning into left sweeping curve",
    "Right leg downward stroke"
  ],
  "mnemonic_en": "A Suit hanger: \"Su\"!",
  "mnemonic_te": "హ్యాంగర్ ఆకారం \"సు\".",
  "example_words": [
    {
      "word": "スープ",
      "reading": "すーぷ",
      "romaji": "suupu",
      "english": "Soup",
      "telugu": "సూప్",
      "telugu_phonetic": "సూపు"
    }
  ],
  "common_mistakes": [
    "ヌ",
    "フ"
  ]
},
  {
  "id": "k_se",
  "character": "セ",
  "katakana_counterpart": "せ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "se",
  "telugu_phonetic": "సె",
  "telugu_pronunciation_guide": "కటకాన \"సె\".",
  "row": "sa",
  "column": 3,
  "stroke_count": 2,
  "stroke_paths": [
    "M 32 38 L 68 38 L 68 62 C 68 70 60 70 52 70",
    "M 50 24 L 50 82"
  ],
  "stroke_directions": [
    "Horizontal hooking down and in",
    "Vertical stroke cutting down"
  ],
  "mnemonic_en": "Setting the table: \"Se\"!",
  "mnemonic_te": "సెట్ చేసిన టేబుల్ ఆకారం \"సె\".",
  "example_words": [
    {
      "word": "セーター",
      "reading": "せーたー",
      "romaji": "seetaa",
      "english": "Sweater",
      "telugu": "స్వెటర్",
      "telugu_phonetic": "సేతా"
    }
  ],
  "common_mistakes": [
    "サ",
    "ヒ"
  ]
},
  {
  "id": "k_so",
  "character": "ソ",
  "katakana_counterpart": "そ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "so",
  "telugu_phonetic": "సొ",
  "telugu_pronunciation_guide": "కటకాన \"సొ\". పై నుండి కిందికి దిగే స్ట్రోక్.",
  "row": "sa",
  "column": 4,
  "stroke_count": 2,
  "stroke_paths": [
    "M 38 32 L 48 42",
    "M 65 28 C 55 50 42 70 28 85"
  ],
  "stroke_directions": [
    "Top dot stroke",
    "Top-right downward sweeping stroke"
  ],
  "mnemonic_en": "A Sewing needle pointing down: \"So\"!",
  "mnemonic_te": "సూది ముల్లు ఆకారం \"సొ\".",
  "example_words": [
    {
      "word": "ソファ",
      "reading": "そふぁ",
      "romaji": "sofa",
      "english": "Sofa",
      "telugu": "సోఫా",
      "telugu_phonetic": "సొఫా"
    }
  ],
  "common_mistakes": [
    "ン",
    "リ",
    "シ"
  ]
},
  {
  "id": "k_ta",
  "character": "タ",
  "katakana_counterpart": "た",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ta",
  "telugu_phonetic": "త",
  "telugu_pronunciation_guide": "కటకాన \"త\".",
  "row": "ta",
  "column": 0,
  "stroke_count": 3,
  "stroke_paths": [
    "M 45 22 L 30 48",
    "M 32 45 L 68 45 C 55 68 45 78 28 85",
    "M 42 55 L 62 75"
  ],
  "stroke_directions": [
    "Top slant",
    "Horizontal curving down-left",
    "Inner crossing tick"
  ],
  "mnemonic_en": "Taco shell: \"Ta\"!",
  "mnemonic_te": "టాకో ఆకారం \"త\".",
  "example_words": [
    {
      "word": "タクシー",
      "reading": "たくしー",
      "romaji": "takushii",
      "english": "Taxi",
      "telugu": "టాక్సీ",
      "telugu_phonetic": "తకుషీ"
    }
  ],
  "common_mistakes": [
    "ク",
    "ケ"
  ]
},
  {
  "id": "k_chi",
  "character": "チ",
  "katakana_counterpart": "ち",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "chi",
  "telugu_phonetic": "చి",
  "telugu_pronunciation_guide": "కటకాన \"చి\".",
  "row": "ta",
  "column": 1,
  "stroke_count": 3,
  "stroke_paths": [
    "M 62 25 L 35 38",
    "M 25 50 L 75 50",
    "M 50 35 C 50 65 42 78 30 85"
  ],
  "stroke_directions": [
    "Top slant to left",
    "Horizontal crossbar",
    "Vertical down-left curve"
  ],
  "mnemonic_en": "A Cheerleader: \"Chi\"!",
  "mnemonic_te": "చీర్‌లీడర్ ఆకారం \"చి\".",
  "example_words": [
    {
      "word": "チーズ",
      "reading": "ちーず",
      "romaji": "chiizu",
      "english": "Cheese",
      "telugu": "చీజ్",
      "telugu_phonetic": "చీజు"
    }
  ],
  "common_mistakes": [
    "テ",
    "キ"
  ]
},
  {
  "id": "k_tsu",
  "character": "ツ",
  "katakana_counterpart": "つ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "tsu",
  "telugu_phonetic": "త్సు",
  "telugu_pronunciation_guide": "కటకాన \"త్సు\". పై నుండి కిందికి దిగే స్ట్రోక్.",
  "row": "ta",
  "column": 2,
  "stroke_count": 3,
  "stroke_paths": [
    "M 35 28 L 42 38",
    "M 50 32 L 58 42",
    "M 68 25 C 55 55 42 72 25 85"
  ],
  "stroke_directions": [
    "First left dot",
    "Second middle dot",
    "Sweeping stroke from top-right to bottom-left"
  ],
  "mnemonic_en": "Tsunami wave splashing down: \"Tsu\"!",
  "mnemonic_te": "సునామీ అల ఆకారం \"త్సు\".",
  "example_words": [
    {
      "word": "ツアー",
      "reading": "つあー",
      "romaji": "tsuaa",
      "english": "Tour",
      "telugu": "టూర్ / యాత్ర",
      "telugu_phonetic": "త్సుఆ"
    }
  ],
  "common_mistakes": [
    "シ",
    "ソ",
    "ン"
  ]
},
  {
  "id": "k_te",
  "character": "テ",
  "katakana_counterpart": "て",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "te",
  "telugu_phonetic": "తె",
  "telugu_pronunciation_guide": "కటకాన \"తె\".",
  "row": "ta",
  "column": 3,
  "stroke_count": 3,
  "stroke_paths": [
    "M 35 30 L 65 30",
    "M 25 48 L 75 48",
    "M 50 48 C 50 68 40 78 28 85"
  ],
  "stroke_directions": [
    "Top horizontal line",
    "Longer middle horizontal line",
    "Curved stem sweeping down-left"
  ],
  "mnemonic_en": "A Telephone pole: \"Te\"!",
  "mnemonic_te": "టెలిఫోన్ స్తంభం ఆకారం \"తె\".",
  "example_words": [
    {
      "word": "テスト",
      "reading": "てすと",
      "romaji": "tesuto",
      "english": "Test",
      "telugu": "పరీక్ష (టెస్ట్)",
      "telugu_phonetic": "తెసుతొ"
    }
  ],
  "common_mistakes": [
    "チ",
    "ケ"
  ]
},
  {
  "id": "k_to",
  "character": "ト",
  "katakana_counterpart": "と",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "to",
  "telugu_phonetic": "తొ",
  "telugu_pronunciation_guide": "కటకాన \"తొ\".",
  "row": "ta",
  "column": 4,
  "stroke_count": 2,
  "stroke_paths": [
    "M 42 20 L 42 85",
    "M 42 45 L 70 65"
  ],
  "stroke_directions": [
    "Vertical straight spine",
    "Diagonal branch extending right-down"
  ],
  "mnemonic_en": "A Totem pole branch: \"To\"!",
  "mnemonic_te": "చెట్టు కొమ్మ ఆకారం \"తొ\".",
  "example_words": [
    {
      "word": "トマト",
      "reading": "とまと",
      "romaji": "tomato",
      "english": "Tomato",
      "telugu": "టొమాటో",
      "telugu_phonetic": "తొమతొ"
    }
  ],
  "common_mistakes": [
    "イ",
    "ソ"
  ]
},
  {
  "id": "k_na",
  "character": "ナ",
  "katakana_counterpart": "な",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "na",
  "telugu_phonetic": "న",
  "telugu_pronunciation_guide": "కటకాన \"న\".",
  "row": "na",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 28 42 L 72 42",
    "M 50 25 C 48 55 38 72 25 85"
  ],
  "stroke_directions": [
    "Horizontal bar",
    "Vertical stroke curving down-left"
  ],
  "mnemonic_en": "A sword or cross: \"Na\"!",
  "mnemonic_te": "కత్తి లేదా శిలువ ఆకారం \"న\".",
  "example_words": [
    {
      "word": "ナイフ",
      "reading": "ないふ",
      "romaji": "naifu",
      "english": "Knife",
      "telugu": "కత్తి (నైఫ్)",
      "telugu_phonetic": "నైఫు"
    }
  ],
  "common_mistakes": [
    "メ",
    "オ"
  ]
},
  {
  "id": "k_ni",
  "character": "ニ",
  "katakana_counterpart": "に",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ni",
  "telugu_phonetic": "ని",
  "telugu_pronunciation_guide": "కటకాన \"ని\". రెండు సమాంతర గీతలు.",
  "row": "na",
  "column": 1,
  "stroke_count": 2,
  "stroke_paths": [
    "M 35 38 L 65 38",
    "M 28 65 L 72 65"
  ],
  "stroke_directions": [
    "Upper horizontal line",
    "Lower longer horizontal line"
  ],
  "mnemonic_en": "Two needles: \"Ni\" (also kanji for 2)!",
  "mnemonic_te": "రెండు గీతలు \"ని\" (రెండు అంకె).",
  "example_words": [
    {
      "word": "ニュース",
      "reading": "にゅーす",
      "romaji": "nyuusu",
      "english": "News",
      "telugu": "వార్తలు (న్యూస్)",
      "telugu_phonetic": "న్యూసు"
    }
  ],
  "common_mistakes": [
    "二",
    "ミ"
  ]
},
  {
  "id": "k_nu",
  "character": "ヌ",
  "katakana_counterpart": "ぬ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "nu",
  "telugu_phonetic": "ను",
  "telugu_pronunciation_guide": "కటకాన \"ను\".",
  "row": "na",
  "column": 2,
  "stroke_count": 2,
  "stroke_paths": [
    "M 32 35 L 68 35 C 55 58 45 72 30 85",
    "M 48 50 L 68 75"
  ],
  "stroke_directions": [
    "Horizontal bending down-left",
    "Diagonal cross stroke"
  ],
  "mnemonic_en": "Chopsticks eating Noodles: \"Nu\"!",
  "mnemonic_te": "నూడుల్స్ తినే చాప్‌స్టిక్స్ \"ను\".",
  "example_words": [
    {
      "word": "ヌードル",
      "reading": "ぬーどる",
      "romaji": "nuudoru",
      "english": "Noodles",
      "telugu": "నూడుల్స్",
      "telugu_phonetic": "నూదొరు"
    }
  ],
  "common_mistakes": [
    "ス",
    "又"
  ]
},
  {
  "id": "k_ne",
  "character": "ネ",
  "katakana_counterpart": "ね",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ne",
  "telugu_phonetic": "నె",
  "telugu_pronunciation_guide": "కటకాన \"నె\".",
  "row": "na",
  "column": 3,
  "stroke_count": 4,
  "stroke_paths": [
    "M 45 20 L 45 30",
    "M 32 40 L 48 55 L 32 82",
    "M 48 40 L 48 85",
    "M 55 55 L 70 78"
  ],
  "stroke_directions": [
    "Top dot",
    "Left zig-zag",
    "Vertical line",
    "Right stroke"
  ],
  "mnemonic_en": "A Necktie on a shirt: \"Ne\"!",
  "mnemonic_te": "నెక్ టై ఆకారం \"నె\".",
  "example_words": [
    {
      "word": "ネクタイ",
      "reading": "ねくたい",
      "romaji": "nekutai",
      "english": "Necktie",
      "telugu": "నెక్ టై",
      "telugu_phonetic": "నెకుతై"
    }
  ],
  "common_mistakes": [
    "ホ",
    "木"
  ]
},
  {
  "id": "k_no",
  "character": "ノ",
  "katakana_counterpart": "の",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "no",
  "telugu_phonetic": "నొ",
  "telugu_pronunciation_guide": "కటకాన \"నొ\". ఒకే ఒక ఏటవాలు గీత.",
  "row": "na",
  "column": 4,
  "stroke_count": 1,
  "stroke_paths": [
    "M 65 25 C 55 55 42 72 25 85"
  ],
  "stroke_directions": [
    "Single elegant sweeping curve from top-right to bottom-left"
  ],
  "mnemonic_en": "A long Nose: \"No\"!",
  "mnemonic_te": "ఒకే ఒక వాలుగీత (ముక్కు ఆకారం) \"నొ\".",
  "example_words": [
    {
      "word": "ノート",
      "reading": "のーと",
      "romaji": "nooto",
      "english": "Notebook",
      "telugu": "నోట్‌బుక్",
      "telugu_phonetic": "నోతొ"
    }
  ],
  "common_mistakes": [
    "ソ",
    "ン"
  ]
},
  {
  "id": "k_ha",
  "character": "ハ",
  "katakana_counterpart": "は",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ha",
  "telugu_phonetic": "హ",
  "telugu_pronunciation_guide": "కటకాన \"హ\".",
  "row": "ha",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 40 35 L 28 75",
    "M 60 35 L 72 75"
  ],
  "stroke_directions": [
    "Left diagonal stroke outward",
    "Right diagonal stroke outward"
  ],
  "mnemonic_en": "A Haystack hut: \"Ha\"!",
  "mnemonic_te": "గుడిసె చూరు లాంటి రెండు గీతలు \"హ\".",
  "example_words": [
    {
      "word": "パン",
      "reading": "ぱん",
      "romaji": "pan",
      "english": "Bread",
      "telugu": "రొట్టె (బ్రెడ్)",
      "telugu_phonetic": "పన్"
    }
  ],
  "common_mistakes": [
    "八",
    "ル"
  ]
},
  {
  "id": "k_hi",
  "character": "ヒ",
  "katakana_counterpart": "ひ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "hi",
  "telugu_phonetic": "హి",
  "telugu_pronunciation_guide": "కటకాన \"హి\".",
  "row": "ha",
  "column": 1,
  "stroke_count": 2,
  "stroke_paths": [
    "M 35 32 L 35 68 L 70 68",
    "M 52 22 L 52 82"
  ],
  "stroke_directions": [
    "Left vertical turning into horizontal base",
    "Vertical stroke cutting down"
  ],
  "mnemonic_en": "He is sitting down: \"Hi\"!",
  "mnemonic_te": "కుర్చీలో కూర్చున్న వ్యక్తి \"హి\".",
  "example_words": [
    {
      "word": "ヒーロー",
      "reading": "ひーろー",
      "romaji": "hiiroo",
      "english": "Hero",
      "telugu": "హీరో / కథానాయకుడు",
      "telugu_phonetic": "హీరో"
    }
  ],
  "common_mistakes": [
    "セ",
    "七"
  ]
},
  {
  "id": "k_fu",
  "character": "フ",
  "katakana_counterpart": "ふ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "fu",
  "telugu_phonetic": "ఫు",
  "telugu_pronunciation_guide": "కటకాన \"ఫు\".",
  "row": "ha",
  "column": 2,
  "stroke_count": 1,
  "stroke_paths": [
    "M 32 35 L 68 35 C 55 58 45 72 30 85"
  ],
  "stroke_directions": [
    "Horizontal line turning into sweeping down-left curve"
  ],
  "mnemonic_en": "A sharp Flag: \"Fu\"!",
  "mnemonic_te": "జెండా అంచు \"ఫు\".",
  "example_words": [
    {
      "word": "フォーク",
      "reading": "ふぉーく",
      "romaji": "fooku",
      "english": "Fork",
      "telugu": "ఫోర్క్ (ముళ్ళ చెంచా)",
      "telugu_phonetic": "ఫోకు"
    }
  ],
  "common_mistakes": [
    "ワ",
    "ラ"
  ]
},
  {
  "id": "k_he",
  "character": "ヘ",
  "katakana_counterpart": "へ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "he",
  "telugu_phonetic": "హె",
  "telugu_pronunciation_guide": "కటకాన \"హె\". హిరగాన へ లాగే పర్వతం ఆకారం.",
  "row": "ha",
  "column": 3,
  "stroke_count": 1,
  "stroke_paths": [
    "M 28 55 L 50 30 L 75 60"
  ],
  "stroke_directions": [
    "Upward slant to peak, then long slope down-right"
  ],
  "mnemonic_en": "Mount Everest: \"He\" climbs the peak!",
  "mnemonic_te": "కొండ శిఖరం \"హె\".",
  "example_words": [
    {
      "word": "ヘリコプター",
      "reading": "へりこぷたー",
      "romaji": "herikoputaa",
      "english": "Helicopter",
      "telugu": "హెలికాప్టర్",
      "telugu_phonetic": "హెరికొపుతా"
    }
  ],
  "common_mistakes": [
    "へ"
  ]
},
  {
  "id": "k_ho",
  "character": "ホ",
  "katakana_counterpart": "ほ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ho",
  "telugu_phonetic": "హొ",
  "telugu_pronunciation_guide": "కటకాన \"హొ\".",
  "row": "ha",
  "column": 4,
  "stroke_count": 4,
  "stroke_paths": [
    "M 28 35 L 72 35",
    "M 50 20 L 50 82",
    "M 40 50 L 30 72",
    "M 60 50 L 70 72"
  ],
  "stroke_directions": [
    "Top horizontal line",
    "Center vertical trunk",
    "Left drop branch",
    "Right drop branch"
  ],
  "mnemonic_en": "A Holy cross or tree: \"Ho\"!",
  "mnemonic_te": "హోలీ చెట్టు ఆకారం \"హొ\".",
  "example_words": [
    {
      "word": "ホテル",
      "reading": "ほてる",
      "romaji": "hoteru",
      "english": "Hotel",
      "telugu": "హోటల్",
      "telugu_phonetic": "హొతెరు"
    }
  ],
  "common_mistakes": [
    "木",
    "オ"
  ]
},
  {
  "id": "k_ma",
  "character": "マ",
  "katakana_counterpart": "ま",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ma",
  "telugu_phonetic": "మ",
  "telugu_pronunciation_guide": "కటకాన \"మ\".",
  "row": "ma",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 32 35 L 68 35 L 42 62",
    "M 55 60 L 68 75"
  ],
  "stroke_directions": [
    "Top horizontal bending back down-left",
    "Lower right tick"
  ],
  "mnemonic_en": "A drinking Mug: \"Ma\"!",
  "mnemonic_te": "మగ్ ఆకారం \"మ\".",
  "example_words": [
    {
      "word": "マスク",
      "reading": "ますく",
      "romaji": "masuku",
      "english": "Mask",
      "telugu": "మాస్క్",
      "telugu_phonetic": "మసుకు"
    }
  ],
  "common_mistakes": [
    "ア",
    "ム"
  ]
},
  {
  "id": "k_mi",
  "character": "ミ",
  "katakana_counterpart": "み",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "mi",
  "telugu_phonetic": "మి",
  "telugu_pronunciation_guide": "కటకాన \"మి\". మూడు సమాంతర వాలుగీతలు.",
  "row": "ma",
  "column": 1,
  "stroke_count": 3,
  "stroke_paths": [
    "M 35 32 L 65 38",
    "M 32 50 L 68 56",
    "M 28 68 L 72 74"
  ],
  "stroke_directions": [
    "Top slanted dash",
    "Middle slanted dash",
    "Bottom longer slanted dash"
  ],
  "mnemonic_en": "Three Missiles: \"Mi\" (also 3 = mitsu)!",
  "mnemonic_te": "మూడు మిస్సైల్స్ ఆకారం \"మి\".",
  "example_words": [
    {
      "word": "ミルク",
      "reading": "みるく",
      "romaji": "miruku",
      "english": "Milk",
      "telugu": "పాలు (మిల్క్)",
      "telugu_phonetic": "మిరుకు"
    }
  ],
  "common_mistakes": [
    "シ",
    "三"
  ]
},
  {
  "id": "k_mu",
  "character": "ム",
  "katakana_counterpart": "む",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "mu",
  "telugu_phonetic": "ము",
  "telugu_pronunciation_guide": "కటకాన \"ము\". త్రికోణపు ఆకారం.",
  "row": "ma",
  "column": 2,
  "stroke_count": 2,
  "stroke_paths": [
    "M 48 25 L 30 65 L 70 65",
    "M 55 50 L 65 72"
  ],
  "stroke_directions": [
    "Diagonal down turning into horizontal right",
    "Diagonal slash across right"
  ],
  "mnemonic_en": "A cow says \"Mooo\" while climbing a triangle mountain: \"Mu\"!",
  "mnemonic_te": "త్రికోణపు ఆకారం \"ము\".",
  "example_words": [
    {
      "word": "ムービー",
      "reading": "むーびー",
      "romaji": "muubii",
      "english": "Movie",
      "telugu": "సినిమా (మూవీ)",
      "telugu_phonetic": "మూబీ"
    }
  ],
  "common_mistakes": [
    "マ",
    "ス"
  ]
},
  {
  "id": "k_me",
  "character": "メ",
  "katakana_counterpart": "め",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "me",
  "telugu_phonetic": "మె",
  "telugu_pronunciation_guide": "కటకాన \"మె\". క్రాస్ మార్క్.",
  "row": "ma",
  "column": 3,
  "stroke_count": 2,
  "stroke_paths": [
    "M 62 28 C 50 50 38 70 25 85",
    "M 35 42 L 68 75"
  ],
  "stroke_directions": [
    "Sweeping down-left curve",
    "Crossing stroke down-right"
  ],
  "mnemonic_en": "A Medical cross or noodles: \"Me\"!",
  "mnemonic_te": "క్రాస్ గుర్తు \"మె\".",
  "example_words": [
    {
      "word": "メニュー",
      "reading": "めにゅー",
      "romaji": "menyuu",
      "english": "Menu",
      "telugu": "మెనూ",
      "telugu_phonetic": "మెన్యూ"
    }
  ],
  "common_mistakes": [
    "ナ",
    "ヌ"
  ]
},
  {
  "id": "k_mo",
  "character": "モ",
  "katakana_counterpart": "も",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "mo",
  "telugu_phonetic": "మొ",
  "telugu_pronunciation_guide": "కటకాన \"మొ\".",
  "row": "ma",
  "column": 4,
  "stroke_count": 3,
  "stroke_paths": [
    "M 35 35 L 68 35",
    "M 28 52 L 75 52",
    "M 48 22 L 48 75 C 48 82 55 82 68 78"
  ],
  "stroke_directions": [
    "Top horizontal line",
    "Middle longer horizontal line",
    "Vertical spine hooking right"
  ],
  "mnemonic_en": "More fish hooks: \"Mo\"!",
  "mnemonic_te": "హిరగాన も లాంటి మూడు గీతలు \"మొ\".",
  "example_words": [
    {
      "word": "モデル",
      "reading": "もでる",
      "romaji": "moderu",
      "english": "Model",
      "telugu": "మోడల్",
      "telugu_phonetic": "మొదెరు"
    }
  ],
  "common_mistakes": [
    "も",
    "毛"
  ]
},
  {
  "id": "k_ya",
  "character": "ヤ",
  "katakana_counterpart": "や",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ya",
  "telugu_phonetic": "య",
  "telugu_pronunciation_guide": "కటకాన \"య\".",
  "row": "ya",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 30 38 L 70 38 L 55 58",
    "M 48 25 C 48 55 42 72 32 85"
  ],
  "stroke_directions": [
    "Top horizontal hooking down-left",
    "Sweeping vertical curve down-left"
  ],
  "mnemonic_en": "A Yak with horns: \"Ya\"!",
  "mnemonic_te": "యాక్ జంతువు కొమ్ములు \"య\".",
  "example_words": [
    {
      "word": "シャツ",
      "reading": "しゃつ",
      "romaji": "shatsu",
      "english": "Shirt",
      "telugu": "చొక్కా",
      "telugu_phonetic": "షత్సు"
    }
  ],
  "common_mistakes": [
    "や",
    "セ"
  ]
},
  {
  "id": "k_yu",
  "character": "ユ",
  "katakana_counterpart": "ゆ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "yu",
  "telugu_phonetic": "యు",
  "telugu_pronunciation_guide": "కటకాన \"యు\".",
  "row": "ya",
  "column": 1,
  "stroke_count": 2,
  "stroke_paths": [
    "M 32 35 L 68 35 L 68 68",
    "M 32 68 L 75 68"
  ],
  "stroke_directions": [
    "Horizontal turning straight down",
    "Long horizontal bottom line"
  ],
  "mnemonic_en": "You are number one: \"Yu\"!",
  "mnemonic_te": "యూ-టర్న్ బాక్స్ ఆకారం \"యు\".",
  "example_words": [
    {
      "word": "ユニフォーム",
      "reading": "ゆにふぉーむ",
      "romaji": "yunifoomu",
      "english": "Uniform",
      "telugu": "యూనిఫాం",
      "telugu_phonetic": "యునిఫోము"
    }
  ],
  "common_mistakes": [
    "コ",
    "ヨ"
  ]
},
  {
  "id": "k_yo",
  "character": "ヨ",
  "katakana_counterpart": "よ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "yo",
  "telugu_phonetic": "యొ",
  "telugu_pronunciation_guide": "కటకాన \"యొ\". వెనక్కి తిరిగిన E ఆకారం.",
  "row": "ya",
  "column": 2,
  "stroke_count": 3,
  "stroke_paths": [
    "M 32 30 L 68 30 L 68 70",
    "M 35 50 L 68 50",
    "M 32 70 L 68 70"
  ],
  "stroke_directions": [
    "Top horizontal turning down",
    "Middle horizontal bar",
    "Bottom horizontal base"
  ],
  "mnemonic_en": "A Yo-yo rack: \"Yo\"!",
  "mnemonic_te": "వెనక్కి తిరిగిన E అక్షరం \"యొ\".",
  "example_words": [
    {
      "word": "ヨーロッパ",
      "reading": "よーろっぱ",
      "romaji": "yooroppa",
      "english": "Europe",
      "telugu": "యూరప్",
      "telugu_phonetic": "యోరొప్ప"
    }
  ],
  "common_mistakes": [
    "コ",
    "ユ"
  ]
},
  {
  "id": "k_ra",
  "character": "ラ",
  "katakana_counterpart": "ら",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ra",
  "telugu_phonetic": "ర",
  "telugu_pronunciation_guide": "కటకాన \"ర\".",
  "row": "ra",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 35 30 L 65 30",
    "M 35 48 L 68 48 C 55 68 45 78 28 85"
  ],
  "stroke_directions": [
    "Top horizontal line",
    "Horizontal line turning into sweeping down-left curve"
  ],
  "mnemonic_en": "A Raptor talon: \"Ra\"!",
  "mnemonic_te": "రైలు వంతెన ఆకారం \"ర\".",
  "example_words": [
    {
      "word": "ラジオ",
      "reading": "らじお",
      "romaji": "rajio",
      "english": "Radio",
      "telugu": "రేడియో",
      "telugu_phonetic": "రజిఒ"
    }
  ],
  "common_mistakes": [
    "フ",
    "ヲ"
  ]
},
  {
  "id": "k_ri",
  "character": "リ",
  "katakana_counterpart": "り",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ri",
  "telugu_phonetic": "రి",
  "telugu_pronunciation_guide": "కటకాన \"రి\". రెండు నిలువు గీతలు.",
  "row": "ra",
  "column": 1,
  "stroke_count": 2,
  "stroke_paths": [
    "M 38 32 L 38 60",
    "M 62 25 C 62 60 55 78 40 85"
  ],
  "stroke_directions": [
    "Left short vertical",
    "Right long sweeping vertical down-left"
  ],
  "mnemonic_en": "River reeds: \"Ri\"!",
  "mnemonic_te": "రెండు నిలువు గీతలు \"రి\".",
  "example_words": [
    {
      "word": "リンゴ",
      "reading": "りんご",
      "romaji": "ringo",
      "english": "Apple",
      "telugu": "యాపిల్",
      "telugu_phonetic": "రింగొ"
    }
  ],
  "common_mistakes": [
    "り",
    "ソ"
  ]
},
  {
  "id": "k_ru",
  "character": "ル",
  "katakana_counterpart": "る",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ru",
  "telugu_phonetic": "రు",
  "telugu_pronunciation_guide": "కటకాన \"రు\".",
  "row": "ra",
  "column": 2,
  "stroke_count": 2,
  "stroke_paths": [
    "M 40 30 C 38 55 32 72 24 82",
    "M 58 30 L 58 75 C 58 82 65 82 72 78"
  ],
  "stroke_directions": [
    "Left stroke curving down-left",
    "Right vertical hooking up-right"
  ],
  "mnemonic_en": "A Pair of Roots: \"Ru\"!",
  "mnemonic_te": "రెండు వేర్లు \"రు\".",
  "example_words": [
    {
      "word": "ルール",
      "reading": "るーる",
      "romaji": "ruuru",
      "english": "Rule",
      "telugu": "నియమం (రూల్)",
      "telugu_phonetic": "రూరు"
    }
  ],
  "common_mistakes": [
    "レ",
    "ハ"
  ]
},
  {
  "id": "k_re",
  "character": "レ",
  "katakana_counterpart": "れ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "re",
  "telugu_phonetic": "రె",
  "telugu_pronunciation_guide": "కటకాన \"రె\". ఒకే ఒక చెక్ మార్క్.",
  "row": "ra",
  "column": 3,
  "stroke_count": 1,
  "stroke_paths": [
    "M 42 25 L 42 75 C 42 82 50 82 68 76"
  ],
  "stroke_directions": [
    "Vertical stroke down hooking sharply up-right"
  ],
  "mnemonic_en": "A Red check mark: \"Re\"!",
  "mnemonic_te": "టిక్ మార్క్ ఆకారం \"రె\".",
  "example_words": [
    {
      "word": "レストラン",
      "reading": "れすとらん",
      "romaji": "resutoran",
      "english": "Restaurant",
      "telugu": "రెస్టారెంట్",
      "telugu_phonetic": "రెసుతొరన్"
    }
  ],
  "common_mistakes": [
    "ル"
  ]
},
  {
  "id": "k_ro",
  "character": "ロ",
  "katakana_counterpart": "ろ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "ro",
  "telugu_phonetic": "రొ",
  "telugu_pronunciation_guide": "కటకాన \"రొ\". చతురస్రాకార పెట్టె.",
  "row": "ra",
  "column": 4,
  "stroke_count": 3,
  "stroke_paths": [
    "M 32 30 L 32 75",
    "M 32 30 L 68 30 L 68 75",
    "M 32 75 L 68 75"
  ],
  "stroke_directions": [
    "Left vertical",
    "Top horizontal turning down right",
    "Bottom horizontal closing line"
  ],
  "mnemonic_en": "A Robot mouth: \"Ro\"!",
  "mnemonic_te": "చతురస్రాకార పెట్టె \"రొ\".",
  "example_words": [
    {
      "word": "ロボット",
      "reading": "ろぼっと",
      "romaji": "robotto",
      "english": "Robot",
      "telugu": "రోబోట్",
      "telugu_phonetic": "రొబొత్తొ"
    }
  ],
  "common_mistakes": [
    "口",
    "コ"
  ]
},
  {
  "id": "k_wa",
  "character": "ワ",
  "katakana_counterpart": "わ",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "wa",
  "telugu_phonetic": "వ",
  "telugu_pronunciation_guide": "కటకాన \"వ\".",
  "row": "wa",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 35 32 L 35 55",
    "M 35 38 L 68 38 C 55 62 45 75 28 85"
  ],
  "stroke_directions": [
    "Left short vertical",
    "Top horizontal bending into sweeping down-left curve"
  ],
  "mnemonic_en": "A Wine glass bowl: \"Wa\"!",
  "mnemonic_te": "వైన్ గ్లాస్ పైభాగం \"వ\".",
  "example_words": [
    {
      "word": "ワイン",
      "reading": "わいん",
      "romaji": "wain",
      "english": "Wine",
      "telugu": "వైన్",
      "telugu_phonetic": "వైన్"
    }
  ],
  "common_mistakes": [
    "ウ",
    "フ"
  ]
},
  {
  "id": "k_wo",
  "character": "ヲ",
  "katakana_counterpart": "を",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "wo",
  "telugu_phonetic": "వొ",
  "telugu_pronunciation_guide": "కటకాన \"వొ\" (పార్టికల్).",
  "row": "wa",
  "column": 1,
  "stroke_count": 3,
  "stroke_paths": [
    "M 32 35 L 68 35",
    "M 32 52 L 62 52",
    "M 50 35 C 50 65 42 78 28 85"
  ],
  "stroke_directions": [
    "Top horizontal line",
    "Middle shorter horizontal line",
    "Sweeping down-left spine"
  ],
  "mnemonic_en": "An Olympic torch: \"Wo\"!",
  "mnemonic_te": "ఒలింపిక్ జ్యోతి ఆకారం \"వొ\".",
  "example_words": [
    {
      "word": "ヲタク",
      "reading": "おたく",
      "romaji": "otaku",
      "english": "Otaku / Geek",
      "telugu": "ఒటాకు (అభిమాని)",
      "telugu_phonetic": "ఒతకు"
    }
  ],
  "common_mistakes": [
    "ラ",
    "フ"
  ]
},
  {
  "id": "k_n",
  "character": "ン",
  "katakana_counterpart": "ん",
  "system": "katakana",
  "group": "gojuon",
  "romaji": "n",
  "telugu_phonetic": "న్",
  "telugu_pronunciation_guide": "కటకాన \"న్\". కింద నుండి పైకి స్వీప్ అయ్యే స్ట్రోక్.",
  "row": "n",
  "column": 0,
  "stroke_count": 2,
  "stroke_paths": [
    "M 35 40 L 45 50",
    "M 30 75 C 45 65 60 52 70 35"
  ],
  "stroke_directions": [
    "Left dot stroke",
    "Sweeping stroke from bottom-left to top-right"
  ],
  "mnemonic_en": "A wink with One eye: \"N\"!",
  "mnemonic_te": "కింద నుండి పైకి వెళ్ళే స్ట్రోక్ \"న్\".",
  "example_words": [
    {
      "word": "パン",
      "reading": "ぱん",
      "romaji": "pan",
      "english": "Bread",
      "telugu": "బ్రెడ్",
      "telugu_phonetic": "పన్"
    }
  ],
  "common_mistakes": [
    "ソ",
    "シ",
    "ツ"
  ]
}
];

// ==========================================
// BEGINNER PROGRESSIVE HIRAGANA LESSONS
// ==========================================
export const HIRAGANA_LESSONS: KanaLesson[] = [
  {
    id: 'lesson_1_vowels',
    lessonNumber: 1,
    title: 'Lesson 1: The 5 Fundamental Vowels (母音)',
    titleTe: 'పాఠం 1: 5 ప్రాథమిక అచ్చులు (అ, ఇ, ఉ, ఎ, ఒ)',
    row: 'a',
    characterIds: ['h_a', 'h_i', 'h_u', 'h_e', 'h_o'],
    summaryEn: 'Master the five vowel building blocks: あ (a), い (i), う (u), え (e), お (o). Every syllable in Japanese is formed by pairing consonants with these five vowels.',
    summaryTe: 'జపనీస్ భాషలోని 5 ప్రాథమిక అచ్చులు: あ (అ), い (ఇ), う (ఉ), え (ఎ), お (ఒ). జపనీస్ వర్ణమాల మొత్తానికి ఇవే ఆధారం.',
    practiceQuestions: [
      {
        id: 'l1_q1',
        type: 'identify_reading',
        prompt: 'What is the correct Romaji and Telugu pronunciation of this character?',
        promptTe: 'ఈ అక్షరం యొక్క సరైన ఉచ్చారణ ఏమిటి?',
        characterToTest: 'あ',
        options: [
          { text: 'a (అ)', isCorrect: true },
          { text: 'o (ఒ)', isCorrect: false },
          { text: 'i (ఇ)', isCorrect: false },
          { text: 'u (ఉ)', isCorrect: false }
        ],
        explanationEn: 'あ is the primary vowel "a" (pronounced like "a" in father, or Telugu "అ"). Notice the curved loop at the bottom.',
        explanationTe: 'あ అనేది ప్రాథమిక అచ్చు "అ". కింద గుండ్రని లూప్ ఉంటుంది.'
      },
      {
        id: 'l1_q2',
        type: 'match_character',
        prompt: 'Select the Hiragana character for the sound "i" (ఇ):',
        promptTe: '"ఇ" (i) శబ్దానికి సరిపోయే హిరగాన అక్షరాన్ని ఎంచుకోండి:',
        characterToTest: 'い',
        options: [
          { text: 'い', reading: 'i (ఇ)', isCorrect: true },
          { text: 'う', reading: 'u (ఉ)', isCorrect: false },
          { text: 'え', reading: 'e (ఎ)', isCorrect: false },
          { text: 'あ', reading: 'a (అ)', isCorrect: false }
        ],
        explanationEn: 'い is "i" (like "ee" in feet, or Telugu "ఇ"). It consists of two parallel curved vertical strokes.',
        explanationTe: 'い అనేది "ఇ". పక్కపక్కనే ఉండే రెండు నిలువు గీతలు.'
      },
      {
        id: 'l1_q3',
        type: 'identify_reading',
        prompt: 'Identify this vowel character:',
        promptTe: 'ఈ అక్షరాన్ని గుర్తించండి:',
        characterToTest: 'う',
        options: [
          { text: 'u (ఉ)', isCorrect: true },
          { text: 'e (ఎ)', isCorrect: false },
          { text: 'a (అ)', isCorrect: false },
          { text: 'o (ఒ)', isCorrect: false }
        ],
        explanationEn: 'う is "u" (like "oo" in book, Telugu "ఉ"). Lips are relaxed without pouting.',
        explanationTe: 'う అనేది "ఉ". పైభాగంలో చిన్న గీత, కింద అర్ధచంద్రాకార లూప్ ఉంటాయి.'
      },
      {
        id: 'l1_q4',
        type: 'identify_reading',
        prompt: 'Which vowel is represented by this character?',
        promptTe: 'ఈ అక్షరం ఏ అచ్చును సూచిస్తుంది?',
        characterToTest: 'え',
        options: [
          { text: 'e (ఎ)', isCorrect: true },
          { text: 'a (అ)', isCorrect: false },
          { text: 'i (ఇ)', isCorrect: false },
          { text: 'u (ఉ)', isCorrect: false }
        ],
        explanationEn: 'え is "e" (like "e" in pet, Telugu "ఎ"). It looks like an exotic bird or an energetic runner.',
        explanationTe: 'え అనేది "ఎ". పైభాగంలో డాష్, కింద Z-లాంటి మలుపు ఉంటుంది.'
      },
      {
        id: 'l1_q5',
        type: 'match_character',
        prompt: 'Select the character for "o" (ఒ / ఓ):',
        promptTe: '"ఒ" శబ్దానికి సరిపోయే అక్షరం ఏది?',
        characterToTest: 'お',
        options: [
          { text: 'お', reading: 'o (ఒ)', isCorrect: true },
          { text: 'あ', reading: 'a (అ)', isCorrect: false },
          { text: 'う', reading: 'u (ఉ)', isCorrect: false },
          { text: 'い', reading: 'i (ఇ)', isCorrect: false }
        ],
        explanationEn: 'お is "o" (Telugu "ఒ"). Notice the detached accent mark at the top right, which あ (a) does not have!',
        explanationTe: 'お అనేది "ఒ". あ తో పోలిస్తే దీనికి కుడివైపు పైన ఒక చిన్న చుక్క గీత ఉంటుంది.'
      }
    ]
  },
  {
    id: 'lesson_2_k_row',
    lessonNumber: 2,
    title: 'Lesson 2: The K-Row Consonants (か行)',
    titleTe: 'పాఠం 2: క-శ్రేణి హల్లులు (క, కి, కు, కె, కొ)',
    row: 'ka',
    characterIds: ['h_ka', 'h_ki', 'h_ku', 'h_ke', 'h_ko'],
    summaryEn: 'Learn the crisp K-consonants paired with the 5 vowels: か (ka), き (ki), く (ku), け (ke), こ (ko).',
    summaryTe: '5 అచ్చులతో "క" హల్లు కలిసే శబ్దాలు: か (క), き (కి), く (కు), け (కె), こ (కొ).',
    practiceQuestions: [
      {
        id: 'l2_q1',
        type: 'identify_reading',
        prompt: 'What sound does this character make?',
        promptTe: 'ఈ అక్షరం యొక్క శబ్దం ఏమిటి?',
        characterToTest: 'か',
        options: [
          { text: 'ka (క)', isCorrect: true },
          { text: 'ki (కి)', isCorrect: false },
          { text: 'ko (కొ)', isCorrect: false },
          { text: 'ke (కె)', isCorrect: false }
        ],
        explanationEn: 'か is "ka". Notice the curved sword stroke with a drop on the right.',
        explanationTe: 'か అనేది "క".'
      },
      {
        id: 'l2_q2',
        type: 'match_character',
        prompt: 'Which character represents "ki" (కి - two crossbars like a key)?',
        promptTe: '"కి" (ki) అక్షరాన్ని ఎంచుకోండి:',
        characterToTest: 'き',
        options: [
          { text: 'き', reading: 'ki (కి)', isCorrect: true },
          { text: 'お', reading: 'o (ఒ)', isCorrect: false },
          { text: 'か', reading: 'ka (క)', isCorrect: false },
          { text: 'く', reading: 'ku (కు)', isCorrect: false }
        ],
        explanationEn: 'き is "ki". It has TWO horizontal bars (like a key). Notice the two distinct bars compared to other characters!',
        explanationTe: 'き అనేది "కి". ఇందులో రెండు అడ్డగీతలు ఉంటాయి.'
      },
      {
        id: 'l2_q3',
        type: 'identify_reading',
        prompt: 'Identify this simple chevron stroke:',
        promptTe: 'ఒకే ఒక ముక్కు ఆకారంలో ఉండే ఈ అక్షరాన్ని గుర్తించండి:',
        characterToTest: 'く',
        options: [
          { text: 'ku (కు)', isCorrect: true },
          { text: 'ke (కె)', isCorrect: false },
          { text: 'ko (కొ)', isCorrect: false },
          { text: 'ki (కి)', isCorrect: false }
        ],
        explanationEn: 'く is "ku" (like a cuckoo bird beak open: "ku"!). Consists of a single stroke.',
        explanationTe: 'く అనేది "కు". పిట్ట ముక్కు లాంటి ఒకే గీత.'
      },
      {
        id: 'l2_q4',
        type: 'identify_reading',
        prompt: 'What is the reading of け?',
        promptTe: 'け అక్షరం యొక్క శబ్దం ఏమిటి?',
        characterToTest: 'け',
        options: [
          { text: 'ke (కె)', isCorrect: true },
          { text: 'ka (క)', isCorrect: false },
          { text: 'ki (కి)', isCorrect: false },
          { text: 'ko (కొ)', isCorrect: false }
        ],
        explanationEn: 'け is "ke" (like a Keg of drink).',
        explanationTe: 'け అనేది "కె".'
      },
      {
        id: 'l2_q5',
        type: 'match_character',
        prompt: 'Select the character for "ko" (కొ - two parallel horizontal curves):',
        promptTe: '"కొ" (ko) అక్షరాన్ని ఎంచుకోండి:',
        characterToTest: 'こ',
        options: [
          { text: 'こ', reading: 'ko (కొ)', isCorrect: true },
          { text: 'い', reading: 'i (ఇ)', isCorrect: false },
          { text: 'え', reading: 'e (ఎ)', isCorrect: false },
          { text: 'く', reading: 'ku (కు)', isCorrect: false }
        ],
        explanationEn: 'こ is "ko" (two parallel horizontal arcs, like two koi fish swimming).',
        explanationTe: 'こ అనేది "కొ". రెండు అడ్డ సమాంతర గీతలు.'
      }
    ]
  },
  {
    id: 'lesson_3_s_row',
    lessonNumber: 3,
    title: 'Lesson 3: The S-Row Consonants (さ行)',
    titleTe: 'పాఠం 3: స-శ్రేణి హల్లులు (స, షి, సు, సె, సొ)',
    row: 'sa',
    characterIds: ['h_sa', 'h_shi', 'h_su', 'h_se', 'h_so'],
    summaryEn: 'Master the S-row: さ (sa), し (shi - special pronunciation!), す (su), せ (se), そ (so). Note that "si" is pronounced "shi" in Japanese.',
    summaryTe: 'స-శ్రేణి: さ (స), し (షి - ప్రత్యేక ఉచ్చారణ!), す (సు), せ (సె), そ (సొ). "సి" కి బదులుగా "షి" అని పలుకుతారు.',
    practiceQuestions: [
      {
        id: 'l3_q1',
        type: 'identify_reading',
        prompt: 'Identify this character (notice it has only ONE crossbar):',
        promptTe: 'ఒకే ఒక అడ్డగీత కలిగిన ఈ అక్షరాన్ని గుర్తించండి:',
        characterToTest: 'さ',
        options: [
          { text: 'sa (స)', isCorrect: true },
          { text: 'ki (కి)', isCorrect: false },
          { text: 'ka (క)', isCorrect: false },
          { text: 'shi (షి)', isCorrect: false }
        ],
        explanationEn: 'さ is "sa". It has ONE crossbar. き (ki) has TWO crossbars.',
        explanationTe: 'さ అనేది "స". దీనికి ఒకే ఒక అడ్డగీత ఉంటుంది. రెండు గీతలు ఉండే き (కి) తో తేడా గమనించండి.'
      },
      {
        id: 'l3_q2',
        type: 'identify_reading',
        prompt: 'What is the reading of this fishhook stroke し?',
        promptTe: 'చేపల గాలం లాంటి し అక్షరం యొక్క శబ్దం ఏమిటి?',
        characterToTest: 'し',
        options: [
          { text: 'shi (షి)', isCorrect: true },
          { text: 'se (సె)', isCorrect: false },
          { text: 'su (సు)', isCorrect: false },
          { text: 'so (సొ)', isCorrect: false }
        ],
        explanationEn: 'し is pronounced "shi" (Telugu "షి"), NOT "si"!',
        explanationTe: 'జపనీస్‌లో し ని "సి" అని కాకుండా "షి" (shi) అని పలకాలి.'
      },
      {
        id: 'l3_q3',
        type: 'match_character',
        prompt: 'Select the character for "su" (సు - with a drop loop):',
        promptTe: '"సు" (su) అక్షరాన్ని ఎంచుకోండి:',
        characterToTest: 'す',
        options: [
          { text: 'す', reading: 'su (సు)', isCorrect: true },
          { text: 'き', reading: 'ki (కి)', isCorrect: false },
          { text: 'さ', reading: 'sa (స)', isCorrect: false },
          { text: 'せ', reading: 'se (సె)', isCorrect: false }
        ],
        explanationEn: 'す is "su". Like a drip of soup dripping from a straw.',
        explanationTe: 'す అనేది "సు".'
      }
    ]
  },
  {
  id: "lesson_4_t_row",
  lessonNumber: 4,
  title: "Lesson 4: The T-Row Consonants (た行)",
  titleTe: "పాఠం 4: త-శ్రేణి హల్లులు (త, చి, త్సు, తె, తొ)",
  row: "ta",
  characterIds: [
    "h_ta",
    "h_chi",
    "h_tsu",
    "h_te",
    "h_to"
  ],
  summaryEn: "Master the T-row: た (ta), ち (chi - special!), つ (tsu - special!), て (te), と (to). Notice that \"ti\" becomes \"chi\" and \"tu\" becomes \"tsu\" in Japanese.",
  summaryTe: "త-శ్రేణి: た (త), ち (చి - ప్రత్యేక శబ్దం!), つ (త్సు - ప్రత్యేక శబ్దం!), て (తె), と (తొ). జపనీస్‌లో \"తి\" ఉండదు, \"చి\" అంటారు; \"తు\" ఉండదు, \"త్సు\" అంటారు.",
  practiceQuestions: [
    {
      id: "l4_q1",
      type: "identify_reading",
      prompt: "Identify this character (resembles the English word \"ta\"):",
      promptTe: "ఇంగ్లీష్ \"ta\" లాగా కనిపించే ఈ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "た",
      options: [
        {
          text: "ta (త)",
          isCorrect: true
        },
        {
          text: "sa (స)",
          isCorrect: false
        },
        {
          text: "ka (క)",
          isCorrect: false
        },
        {
          text: "ko (కొ)",
          isCorrect: false
        }
      ],
      explanationEn: "た is \"ta\". It literally looks like the letters \"t\" and \"a\" drawn together.",
      explanationTe: "た అనేది \"త\". \"t\" మరియు \"a\" అక్షరాల కలయికలా ఉంటుంది."
    },
    {
      id: "l4_q2",
      type: "identify_reading",
      prompt: "What special sound does this character make? (Looks like the number 5):",
      promptTe: "5 అంకె లాగా ఉండే ఈ అక్షరం యొక్క ప్రత్యేక శబ్దం ఏమిటి?",
      characterToTest: "ち",
      options: [
        {
          text: "chi (చి)",
          isCorrect: true
        },
        {
          text: "ti (తి)",
          isCorrect: false
        },
        {
          text: "shi (షి)",
          isCorrect: false
        },
        {
          text: "ki (కి)",
          isCorrect: false
        }
      ],
      explanationEn: "ち is \"chi\" (Telugu \"చి\"). Remember: Japanese has NO \"ti\" sound in basic kana; it always softens to \"chi\"!",
      explanationTe: "జపనీస్‌లో \"తి\" శబ్దం ఉండదు; దీనిని \"చి\" (chi) అని పలకాలి. 5 అంకెలా ఉంటుంది."
    },
    {
      id: "l4_q3",
      type: "identify_reading",
      prompt: "How is this single curved stroke つ pronounced?",
      promptTe: "ఒకే ఒక వంపు గీత కలిగిన つ అక్షరాన్ని ఎలా పలకాలి?",
      characterToTest: "つ",
      options: [
        {
          text: "tsu (త్సు)",
          isCorrect: true
        },
        {
          text: "su (సు)",
          isCorrect: false
        },
        {
          text: "ku (కు)",
          isCorrect: false
        },
        {
          text: "shi (షి)",
          isCorrect: false
        }
      ],
      explanationEn: "つ is \"tsu\" (Telugu \"త్సు\", like a tsunami wave). Place tongue tip behind upper teeth and release air.",
      explanationTe: "つ అనేది \"త్సు\" (tsu). సునామీ (tsunami) అల లాంటి ఆకారం. నాలుక కొన పైపళ్ళ వెనుక తగిలి గాలి వదలాలి."
    },
    {
      id: "l4_q4",
      type: "match_character",
      prompt: "Select the character for \"te\" (తె):",
      promptTe: "\"తె\" (te) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "て",
      options: [
        {
          text: "て",
          reading: "te (తె)",
          isCorrect: true
        },
        {
          text: "く",
          reading: "ku (కు)",
          isCorrect: false
        },
        {
          text: "こ",
          reading: "ko (కొ)",
          isCorrect: false
        },
        {
          text: "そ",
          reading: "so (సొ)",
          isCorrect: false
        }
      ],
      explanationEn: "て is \"te\" (like a table leg or a broken hand: \"te\" means hand in Japanese).",
      explanationTe: "て అనేది \"తె\"."
    },
    {
      id: "l4_q5",
      type: "match_character",
      prompt: "Select the character for \"to\" (తొ):",
      promptTe: "\"తొ\" (to) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "と",
      options: [
        {
          text: "と",
          reading: "to (తొ)",
          isCorrect: true
        },
        {
          text: "て",
          reading: "te (తె)",
          isCorrect: false
        },
        {
          text: "い",
          reading: "i (ఇ)",
          isCorrect: false
        },
        {
          text: "か",
          reading: "ka (క)",
          isCorrect: false
        }
      ],
      explanationEn: "と is \"to\" (like a thorn in a big toe).",
      explanationTe: "と అనేది \"తొ\"."
    }
  ]
},
  {
  id: "lesson_5_n_row",
  lessonNumber: 5,
  title: "Lesson 5: The N-Row Consonants (な行)",
  titleTe: "పాఠం 5: న-శ్రేణి హల్లులు (న, ని, ను, నె, నొ)",
  row: "na",
  characterIds: [
    "h_na",
    "h_ni",
    "h_nu",
    "h_ne",
    "h_no"
  ],
  summaryEn: "Master the nasal N-row: な (na), に (ni), ぬ (nu), ね (ne), の (no). Notice the delicate loops in ぬ and ね.",
  summaryTe: "న-శ్రేణి: な (న), に (ని), ぬ (ను), నె (నె), の (నొ). ぬ మరియు ね లోని చిన్న సున్నాలను గమనించండి.",
  practiceQuestions: [
    {
      id: "l5_q1",
      type: "identify_reading",
      prompt: "Identify this character (has two parallel lines on the right, like two needles):",
      promptTe: "రెండు సూదుల లాంటి కుడివైపు గీతలున్న ఈ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "に",
      options: [
        {
          text: "ni (ని)",
          isCorrect: true
        },
        {
          text: "ko (కొ)",
          isCorrect: false
        },
        {
          text: "ta (త)",
          isCorrect: false
        },
        {
          text: "i (ఇ)",
          isCorrect: false
        }
      ],
      explanationEn: "に is \"ni\" (two parallel needles on the right, also Japanese for 2).",
      explanationTe: "に అనేది \"ని\". కుడివైపు రెండు అడ్డగీతలు ఉంటాయి."
    },
    {
      id: "l5_q2",
      type: "identify_reading",
      prompt: "Identify this looping noodle character ぬ:",
      promptTe: "నూడుల్స్ లాంటి చిక్కుముడి ఉన్న ぬ అక్షరం ఏమిటి?",
      characterToTest: "ぬ",
      options: [
        {
          text: "nu (ను)",
          isCorrect: true
        },
        {
          text: "su (సు)",
          isCorrect: false
        },
        {
          text: "tsu (త్సు)",
          isCorrect: false
        },
        {
          text: "te (తె)",
          isCorrect: false
        }
      ],
      explanationEn: "ぬ is \"nu\" (like chopsticks grabbing Noodles with a loop at the tip).",
      explanationTe: "ぬ అనేది \"ను\". చివర్లో చిన్న లూప్ ఉంటుంది."
    },
    {
      id: "l5_q3",
      type: "match_character",
      prompt: "Which single smooth spiral character represents \"no\" (నొ)?",
      promptTe: "\"నొ\" (no) శబ్దాన్ని సూచించే ఒకే ఒక మలుపు గీత ఏది?",
      characterToTest: "の",
      options: [
        {
          text: "の",
          reading: "no (నొ)",
          isCorrect: true
        },
        {
          text: "つ",
          reading: "tsu (త్సు)",
          isCorrect: false
        },
        {
          text: "く",
          reading: "ku (కు)",
          isCorrect: false
        },
        {
          text: "て",
          reading: "te (తె)",
          isCorrect: false
        }
      ],
      explanationEn: "の is \"no\" (a \"NO smoking\" round prohibition sign).",
      explanationTe: "の అనేది \"నొ\". గుండ్రని ముగింపు ఉండే ఒకే స్ట్రోక్."
    },
    {
      id: "l5_q4",
      type: "match_character",
      prompt: "Select the character for \"na\" (న):",
      promptTe: "\"న\" (na) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "な",
      options: [
        {
          text: "な",
          reading: "na (న)",
          isCorrect: true
        },
        {
          text: "た",
          reading: "ta (త)",
          isCorrect: false
        },
        {
          text: "さ",
          reading: "sa (స)",
          isCorrect: false
        },
        {
          text: "き",
          reading: "ki (కి)",
          isCorrect: false
        }
      ],
      explanationEn: "な is \"na\" (looks like a Nun praying before a cross).",
      explanationTe: "な అనేది \"న\". た (త) తో పోలిస్తే కుడివైపు చిన్న లూప్ ఉంటుంది."
    }
  ]
},
  {
  id: "lesson_6_h_row",
  lessonNumber: 6,
  title: "Lesson 6: The H-Row Consonants (は行)",
  titleTe: "పాఠం 6: హ-శ్రేణి హల్లులు (హ, హి, ఫు, హె, హొ)",
  row: "ha",
  characterIds: [
    "h_ha",
    "h_hi",
    "h_fu",
    "h_he",
    "h_ho"
  ],
  summaryEn: "Learn は (ha), ひ (hi), ふ (fu - special!), へ (he), ほ (ho). Pay special attention to ふ (fu), pronounced with both lips blowing air gently without teeth touching.",
  summaryTe: "హ-శ్రేణి: は (హ), ひ (హి), ふ (ఫు - ప్రత్యేక శబ్దం!), へ (హె), ほ (హొ). ふ ని పలికేటప్పుడు పైపళ్ళు కింద పెదవిని తాకకూడదు.",
  practiceQuestions: [
    {
      id: "l6_q1",
      type: "identify_reading",
      prompt: "Identify this smiling mouth character ひ:",
      promptTe: "నవ్వుతున్న పెదవుల లాంటి ひ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ひ",
      options: [
        {
          text: "hi (హి)",
          isCorrect: true
        },
        {
          text: "he (హె)",
          isCorrect: false
        },
        {
          text: "te (తె)",
          isCorrect: false
        },
        {
          text: "to (తొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ひ is \"hi\" (He has a big smile: \"hi-hi-hi\").",
      explanationTe: "ひ అనేది \"హి\"."
    },
    {
      id: "l6_q2",
      type: "identify_reading",
      prompt: "What unique sound does ふ make?",
      promptTe: "ふ అక్షరం చేసే ప్రత్యేకమైన శబ్దం ఏమిటి?",
      characterToTest: "ふ",
      options: [
        {
          text: "fu (ఫు / హు - bilabial)",
          isCorrect: true
        },
        {
          text: "hu (హు - English pure H)",
          isCorrect: false
        },
        {
          text: "su (సు)",
          isCorrect: false
        },
        {
          text: "nu (ను)",
          isCorrect: false
        }
      ],
      explanationEn: "ふ is \"fu\" (blown gently between both lips, like blowing out a candle on Mount Fuji).",
      explanationTe: "ふ అనేది \"ఫు\" (fu). పైపళ్ళు కింద పెదవిని తాకకుండా రెండు పెదవుల మధ్య గాలి ఊదుతూ పలకాలి."
    },
    {
      id: "l6_q3",
      type: "match_character",
      prompt: "Which character has an open top vertical stroke: は (ha) or ほ (ho)?",
      promptTe: "పై గీత పైకి చొచ్చుకువచ్చే అక్షరం ఏది?",
      characterToTest: "は",
      options: [
        {
          text: "は (ha)",
          isCorrect: true
        },
        {
          text: "ほ (ho)",
          isCorrect: false
        },
        {
          text: "な (na)",
          isCorrect: false
        },
        {
          text: "た (ta)",
          isCorrect: false
        }
      ],
      explanationEn: "は (ha) has the top of the vertical stroke exposed. ほ (ho) has a horizontal \"hat\" covering the top.",
      explanationTe: "は (హ) పైభాగం ఖాళీగా ఉంటుంది; ほ (హొ) కి పైన అడ్డగీత టోపీలా ఉంటుంది."
    },
    {
      id: "l6_q4",
      type: "match_character",
      prompt: "Select the mountain peak character for \"he\" (హె):",
      promptTe: "\"హె\" (he) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "へ",
      options: [
        {
          text: "へ",
          reading: "he (హె)",
          isCorrect: true
        },
        {
          text: "く",
          reading: "ku (కు)",
          isCorrect: false
        },
        {
          text: "つ",
          reading: "tsu (త్సు)",
          isCorrect: false
        },
        {
          text: "て",
          reading: "te (తె)",
          isCorrect: false
        }
      ],
      explanationEn: "へ is \"he\" (looks like Mount Everest, pointing to heaven).",
      explanationTe: "へ అనేది \"హె\". కొండ శిఖరం లాంటి ఒకే స్ట్రోక్."
    }
  ]
},
  {
  id: "lesson_7_m_row",
  lessonNumber: 7,
  title: "Lesson 7: The M-Row Consonants (ま行)",
  titleTe: "పాఠం 7: మ-శ్రేణి హల్లులు (మ, మి, ము, మె, మొ)",
  row: "ma",
  characterIds: [
    "h_ma",
    "h_mi",
    "h_mu",
    "h_me",
    "h_mo"
  ],
  summaryEn: "Master the mellow M-row: ま (ma), み (mi), む (mu), め (me), も (mo). Note the difference between ぬ (loop) and め (no loop).",
  summaryTe: "మ-శ్రేణి: ま (మ), み (మి), む (ము), め (మె), も (మొ). ぬ కి లూప్ ఉంటుంది, め కి ఉండదు.",
  practiceQuestions: [
    {
      id: "l7_q1",
      type: "identify_reading",
      prompt: "Identify this character (has two crossbars and a loop at the bottom):",
      promptTe: "రెండు అడ్డగీతలు, కింద ఒక లూప్ ఉన్న ఈ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ま",
      options: [
        {
          text: "ma (మ)",
          isCorrect: true
        },
        {
          text: "ho (హొ)",
          isCorrect: false
        },
        {
          text: "ha (హ)",
          isCorrect: false
        },
        {
          text: "na (న)",
          isCorrect: false
        }
      ],
      explanationEn: "ま is \"ma\". It has TWO crossbars, unlike ほ which has a side hook or は which has one crossbar.",
      explanationTe: "ま అనేది \"మ\". రెండు అడ్డగీతలు ఉంటాయి."
    },
    {
      id: "l7_q2",
      type: "identify_reading",
      prompt: "What character is this (looks like noodles with NO loop at the tail):",
      promptTe: "తోక దగ్గర లూప్ లేని ఈ అక్షరం ఏది?",
      characterToTest: "め",
      options: [
        {
          text: "me (మె)",
          isCorrect: true
        },
        {
          text: "nu (ను)",
          isCorrect: false
        },
        {
          text: "no (నొ)",
          isCorrect: false
        },
        {
          text: "ne (నె)",
          isCorrect: false
        }
      ],
      explanationEn: "め is \"me\" (like an eye - \"me\" means eye in Japanese). Unlike ぬ, it has NO loop at the tail.",
      explanationTe: "め అనేది \"మె\" (కన్ను). ぬ (ను) లాగే ఉంటుంది కానీ చివర్లో లూప్ ఉండదు."
    },
    {
      id: "l7_q3",
      type: "match_character",
      prompt: "Select the character for \"mo\" (మొ):",
      promptTe: "\"మొ\" (mo) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "も",
      options: [
        {
          text: "も",
          reading: "mo (మొ)",
          isCorrect: true
        },
        {
          text: "ま",
          reading: "ma (మ)",
          isCorrect: false
        },
        {
          text: "し",
          reading: "shi (షి)",
          isCorrect: false
        },
        {
          text: "と",
          reading: "to (తొ)",
          isCorrect: false
        }
      ],
      explanationEn: "も is \"mo\" (looks like a fishhook piercing MORE worms).",
      explanationTe: "も అనేది \"మొ\"."
    }
  ]
},
  {
  id: "lesson_8_y_row",
  lessonNumber: 8,
  title: "Lesson 8: The Y-Row Consonants (や行)",
  titleTe: "పాఠం 8: య-శ్రేణి హల్లులు (య, యు, యొ)",
  row: "ya",
  characterIds: [
    "h_ya",
    "h_yu",
    "h_yo"
  ],
  summaryEn: "Learn the three Y-sounds: や (ya), ゆ (yu), よ (yo). Notice that Japanese has no \"yi\" or \"ye\" in modern kana.",
  summaryTe: "య-శ్రేణిలో 3 అక్షరాలు మాత్రమే ఉంటాయి: や (య), ゆ (యు), よ (యొ). జపనీస్‌లో \"యి\", \"యె\" లు ఉండవు.",
  practiceQuestions: [
    {
      id: "l8_q1",
      type: "identify_reading",
      prompt: "Identify this character (resembles a yak with horns):",
      promptTe: "కొమ్ములున్న యాక్ జంతువు లాంటి ఈ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "や",
      options: [
        {
          text: "ya (య)",
          isCorrect: true
        },
        {
          text: "ka (క)",
          isCorrect: false
        },
        {
          text: "se (సె)",
          isCorrect: false
        },
        {
          text: "ma (మ)",
          isCorrect: false
        }
      ],
      explanationEn: "や is \"ya\" (like a Yak with horns).",
      explanationTe: "や అనేది \"య\"."
    },
    {
      id: "l8_q2",
      type: "identify_reading",
      prompt: "What sound does this fish-like stroke make?",
      promptTe: "చేప లాంటి ఈ అక్షరం యొక్క శబ్దం ఏమిటి?",
      characterToTest: "ゆ",
      options: [
        {
          text: "yu (యు)",
          isCorrect: true
        },
        {
          text: "ya (య)",
          isCorrect: false
        },
        {
          text: "nu (ను)",
          isCorrect: false
        },
        {
          text: "mu (ము)",
          isCorrect: false
        }
      ],
      explanationEn: "ゆ is \"yu\" (like a fish swimming: \"You\" look at the fish).",
      explanationTe: "ゆ అనేది \"యు\"."
    },
    {
      id: "l8_q3",
      type: "match_character",
      prompt: "Select the character for \"yo\" (యొ):",
      promptTe: "\"యొ\" (yo) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "よ",
      options: [
        {
          text: "よ",
          reading: "yo (యొ)",
          isCorrect: true
        },
        {
          text: "ま",
          reading: "ma (మ)",
          isCorrect: false
        },
        {
          text: "は",
          reading: "ha (హ)",
          isCorrect: false
        },
        {
          text: "ほ",
          reading: "ho (హొ)",
          isCorrect: false
        }
      ],
      explanationEn: "よ is \"yo\" (a person doing Yo-yo tricks).",
      explanationTe: "よ అనేది \"యొ\". ఒకే అడ్డగీత మరియు లూప్ ఉంటాయి."
    }
  ]
},
  {
  id: "lesson_9_r_row",
  lessonNumber: 9,
  title: "Lesson 9: The R-Row Consonants (ら行)",
  titleTe: "పాఠం 9: ర-శ్రేణి హల్లులు (ర, రి, రు, రె, రొ)",
  row: "ra",
  characterIds: [
    "h_ra",
    "h_ri",
    "h_ru",
    "h_re",
    "h_ro"
  ],
  summaryEn: "Master the Japanese flap R: ら (ra), り (ri), る (ru), れ (re), ろ (ro). The sound is an alveolar tap between English R and L (like a quick \"d\").",
  summaryTe: "ర-శ్రేణి: ら (ర), り (రి), る (రు), రె (రె), ろ (రొ). నాలుక కొనను పైదవడపై ఒక్కసారి తట్టే తేలికపాటి ట్యాప్ శబ్దం (ర మరియు ల మధ్య).",
  practiceQuestions: [
    {
      id: "l9_q1",
      type: "identify_reading",
      prompt: "How to distinguish る (ru) from ろ (ro)?",
      promptTe: "る (రు) మరియు ろ (రొ) మధ్య తేడా ఏమిటి?",
      characterToTest: "る",
      options: [
        {
          text: "る has a loop at the bottom; ろ has NO loop",
          isCorrect: true
        },
        {
          text: "ろ has a loop; る has none",
          isCorrect: false
        },
        {
          text: "る is pronounced \"ro\"; ろ is \"ru\"",
          isCorrect: false
        },
        {
          text: "They are identical",
          isCorrect: false
        }
      ],
      explanationEn: "る (ru) has a loop at the bottom (like a ruby caught in the tail). ろ (ro) has NO loop.",
      explanationTe: "る (రు) కి కింద చిన్న లూప్ ఉంటుంది; ろ (రొ) కి లూప్ ఉండదు."
    },
    {
      id: "l9_q2",
      type: "identify_reading",
      prompt: "Identify this two-stroke character resembling river reeds り:",
      promptTe: "రెండు నిలువు గీతల లాంటి り అక్షరాన్ని గుర్తించండి:",
      characterToTest: "り",
      options: [
        {
          text: "ri (రి)",
          isCorrect: true
        },
        {
          text: "i (ఇ)",
          isCorrect: false
        },
        {
          text: "ni (ని)",
          isCorrect: false
        },
        {
          text: "re (రె)",
          isCorrect: false
        }
      ],
      explanationEn: "り is \"ri\" (like river reeds swaying). The right stroke is longer than the left.",
      explanationTe: "り అనేది \"రి\". い (ఇ) తో పోలిస్తే కుడి గీత పొడవుగా ఉంటుంది."
    },
    {
      id: "l9_q3",
      type: "match_character",
      prompt: "Select the character for \"ra\" (ర):",
      promptTe: "\"ర\" (ra) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ら",
      options: [
        {
          text: "ら",
          reading: "ra (ర)",
          isCorrect: true
        },
        {
          text: "ち",
          reading: "chi (చి)",
          isCorrect: false
        },
        {
          text: "う",
          reading: "u (ఉ)",
          isCorrect: false
        },
        {
          text: "ろ",
          reading: "ro (రొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ら is \"ra\" (looks like a rabbit sitting on its haunches).",
      explanationTe: "ら అనేది \"ర\"."
    }
  ]
},
  {
  id: "lesson_10_w_n_row",
  lessonNumber: 10,
  title: "Lesson 10: The W-Row and Standalone N (わ・を・ん)",
  titleTe: "పాఠం 10: వ-శ్రేణి మరియు ఒంటరి హల్లు \"న్\" (వ, వొ/ఒ, న్)",
  row: "wa",
  characterIds: [
    "h_wa",
    "h_wo",
    "h_n"
  ],
  summaryEn: "Complete all 46 basic Hiragana! Learn わ (wa), を (wo - object particle, pronounced \"o\"), and ん (n - the only standalone consonant in Japanese).",
  summaryTe: "46 ప్రాథమిక హిరగాన అక్షరాలు పూర్తవుతాయి! わ (వ), を (వొ/ఒ - ఆబ్జెక్ట్ పార్టికల్), ん (న్ - జపనీస్‌లోని ఏకైక ఒంటరి హల్లు).",
  practiceQuestions: [
    {
      id: "l10_q1",
      type: "identify_reading",
      prompt: "Identify this single stroke consonant ん:",
      promptTe: "ఒకే ఒక స్ట్రోక్ కలిగిన ఒంటరి హల్లు ん ఏమిటి?",
      characterToTest: "ん",
      options: [
        {
          text: "n (న్ - standalone nasal)",
          isCorrect: true
        },
        {
          text: "so (సొ)",
          isCorrect: false
        },
        {
          text: "te (తె)",
          isCorrect: false
        },
        {
          text: "ku (కు)",
          isCorrect: false
        }
      ],
      explanationEn: "ん is \"n\". It is the only consonant in Japanese that does not require a vowel following it.",
      explanationTe: "ん అనేది \"న్\" (n). జపనీస్‌లో అచ్చు లేకుండా పలికే ఏకైక హల్లు."
    },
    {
      id: "l10_q2",
      type: "identify_reading",
      prompt: "What is the grammatical role and modern pronunciation of を?",
      promptTe: "を అక్షరం యొక్క వ్యాకరణ ప్రయోజనం మరియు ఆధునిక ఉచ్చారణ ఏమిటి?",
      characterToTest: "を",
      options: [
        {
          text: "Pronounced \"o\" (ఒ), marks the direct object of an action",
          isCorrect: true
        },
        {
          text: "Pronounced \"wo\", marks the subject",
          isCorrect: false
        },
        {
          text: "Pronounced \"wa\", marks the topic",
          isCorrect: false
        },
        {
          text: "Pronounced \"to\", means and",
          isCorrect: false
        }
      ],
      explanationEn: "を is written as \"wo\" in romaji but pronounced purely as \"o\" (ఒ). It marks the direct object (e.g. 本を読む - hon o yomu).",
      explanationTe: "దీనిని ఆధునిక జపనీస్‌లో \"ఒ\" (o) అని పలుకుతారు. ఇది ఆబ్జెక్ట్ మార్కర్ (కర్మను సూచిస్తుంది)."
    },
    {
      id: "l10_q3",
      type: "match_character",
      prompt: "Distinguish わ (wa) from ね (ne):",
      promptTe: "లూప్ లేని \"వ\" (wa) అక్షరాన్ని గుర్తించండి:",
      characterToTest: "わ",
      options: [
        {
          text: "わ (wa)",
          isCorrect: true
        },
        {
          text: "ね (ne)",
          isCorrect: false
        },
        {
          text: "れ (re)",
          isCorrect: false
        },
        {
          text: "め (me)",
          isCorrect: false
        }
      ],
      explanationEn: "わ (wa) has an open round back with NO loop. ね has a curl loop. れ bends outward.",
      explanationTe: "わ (వ) కి చివర్లో లూప్ ఉండదు. ね (నె) కి లూప్ ఉంటుంది."
    }
  ]
},
  {
  id: "lesson_11_dakuon",
  lessonNumber: 11,
  title: "Lesson 11: Dakuon Voiced Sounds (濁音: が・ざ・だ・ば)",
  titleTe: "పాఠం 11: దకుఓన్ - గుణింతపు శబ్దాలు (గ, జ, ద, బ)",
  row: "dakuon",
  characterIds: [
    "h_ka",
    "h_sa",
    "h_ta",
    "h_ha"
  ],
  summaryEn: "Learn how adding Dakuten (゛- ten-ten) transforms voiceless consonants into voiced ones: K→G (が), S→Z/J (ざ, じ), T→D (だ, で, ど), H→B (ば). Note: じ vs ぢ and ず vs づ!",
  summaryTe: "అక్షరం పైన రెండు చిన్న గీతలు (゛- తెన్-తెన్) చేరిస్తే వచ్చే నాద శబ్దాలు: క→గ (が), స→జ (ざ, じ), త→ద (だ, で, ど), హ→బ (ば). じ vs ぢ మరియు ず vs づ ల ప్రత్యేకతలు నేర్చుకోండి.",
  practiceQuestions: [
    {
      id: "l11_q1",
      type: "identify_reading",
      prompt: "What sound does か (ka) make when dakuten (゛) is added: が?",
      promptTe: "か (క) కి తెన్-తెన్ చేరిస్తే వచ్చే が శబ్దం ఏమిటి?",
      characterToTest: "が",
      options: [
        {
          text: "ga (గ)",
          isCorrect: true
        },
        {
          text: "za (జ)",
          isCorrect: false
        },
        {
          text: "da (ద)",
          isCorrect: false
        },
        {
          text: "ba (బ)",
          isCorrect: false
        }
      ],
      explanationEn: "Dakuten voices K into G: か (ka) → が (ga).",
      explanationTe: "క-శ్రేణికి తెన్-తెన్ చేరిస్తే గ-శ్రేణి అవుతుంది (గ, గి, గు, గె, గొ)."
    },
    {
      id: "l11_q2",
      type: "identify_reading",
      prompt: "How are じ (ji) and ぢ (ji/dji) differentiated in real Japanese?",
      promptTe: "జపనీస్‌లో じ మరియు ぢ మధ్య తేడా ఏమిటి?",
      characterToTest: "じ",
      options: [
        {
          text: "じ is standard \"ji\"; ぢ is rare and used in compound words like はなぢ (nosebleed)",
          isCorrect: true
        },
        {
          text: "ぢ is standard; じ is never used",
          isCorrect: false
        },
        {
          text: "They are pronounced completely differently",
          isCorrect: false
        },
        {
          text: "じ is \"zi\"; ぢ is \"di\"",
          isCorrect: false
        }
      ],
      explanationEn: "Both sound like \"ji\" in standard Tokyo Japanese. じ is the everyday character (e.g. じかん - time). ぢ only appears in compounds formed from ち (e.g. 鼻血 はなぢ).",
      explanationTe: "రెంటి ఉచ్చారణ దాదాపు \"జి\" లాగే ఉంటుంది. సాధారణంగా じ వాడతారు; ぢ కాంపౌండ్ పదాలలో మాత్రమే వస్తుంది."
    },
    {
      id: "l11_q3",
      type: "identify_reading",
      prompt: "What sound does は (ha) make when dakuten is added: ば?",
      promptTe: "は (హ) కి తెన్-తెన్ చేరిస్తే వచ్చే ば శబ్దం ఏమిటి?",
      characterToTest: "ば",
      options: [
        {
          text: "ba (బ)",
          isCorrect: true
        },
        {
          text: "pa (ప)",
          isCorrect: false
        },
        {
          text: "da (ద)",
          isCorrect: false
        },
        {
          text: "ma (మ)",
          isCorrect: false
        }
      ],
      explanationEn: "は (ha) + ゛ = ば (ba). The H consonant voices into B!",
      explanationTe: "హ-శ్రేణికి తెన్-తెన్ చేరిస్తే బ-శ్రేణి అవుతుంది (బ, బి, బు, బె, బొ)."
    }
  ]
},
  {
  id: "lesson_12_handakuon",
  lessonNumber: 12,
  title: "Lesson 12: Handakuon Semi-Voiced Sounds (半濁音: ぱ・ぴ・ぷ・ぺ・ぽ)",
  titleTe: "పాఠం 12: హందకుఓన్ - ప-శ్రేణి శబ్దాలు (ప, పి, పు, పె, పొ)",
  row: "handakuon",
  characterIds: [
    "h_ha",
    "h_hi",
    "h_fu",
    "h_he",
    "h_ho"
  ],
  summaryEn: "Learn how adding Handakuten (゜- maru/small circle) to the H-row turns it into the crisp P-row: ぱ (pa), ぴ (pi), ぷ (pu), ぺ (pe), ぽ (po).",
  summaryTe: "హ-శ్రేణి అక్షరాలపై చిన్న సున్న (゜- మారు) చేరిస్తే ప-శ్రేణి ఏర్పడుతుంది: ぱ (ప), ぴ (పి), ぷ (పు), ぺ (పె), ぽ (పొ).",
  practiceQuestions: [
    {
      id: "l12_q1",
      type: "identify_reading",
      prompt: "What sound does は make with a small circle (゜): ぱ?",
      promptTe: "は పైన చిన్న సున్న (゜) చేరిస్తే వచ్చే ぱ శబ్దం ఏమిటి?",
      characterToTest: "ぱ",
      options: [
        {
          text: "pa (ప)",
          isCorrect: true
        },
        {
          text: "ba (బ)",
          isCorrect: false
        },
        {
          text: "fa (ఫ)",
          isCorrect: false
        },
        {
          text: "ha (హ)",
          isCorrect: false
        }
      ],
      explanationEn: "The small circle (maru) creates the P sound: ぱ is \"pa\" (Telugu \"ప\").",
      explanationTe: "చిన్న సున్న (మారు) చేరిస్తే \"ప\" శబ్దం వస్తుంది."
    },
    {
      id: "l12_q2",
      type: "match_character",
      prompt: "Select the character for \"pi\" (పి):",
      promptTe: "\"పి\" (pi) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ぴ",
      options: [
        {
          text: "ぴ (pi)",
          isCorrect: true
        },
        {
          text: "び (bi)",
          isCorrect: false
        },
        {
          text: "ひ (hi)",
          isCorrect: false
        },
        {
          text: "に (ni)",
          isCorrect: false
        }
      ],
      explanationEn: "ひ + ゜ = ぴ (pi). Notice the circle (not two slashes!).",
      explanationTe: "ひ కి సున్న చేరిస్తే ぴ (పి) అవుతుంది."
    }
  ]
},
  {
  id: "lesson_13_sokuon",
  lessonNumber: 13,
  title: "Lesson 13: Sokuon Double Consonants (促音: 小さい「っ」)",
  titleTe: "పాఠం 13: సొకుఓన్ - చిన్న \"త్సు\" ద్విత్వాక్షర శబ్దం (っ)",
  row: "special",
  characterIds: [
    "h_tsu"
  ],
  summaryEn: "Master the small っ (tsu). It creates a 1-beat glottal pause, doubling the following consonant (e.g. きって kitte = stamp; がっこう gakkou = school).",
  summaryTe: "చిన్న っ (tsu) వాడకం: ఇది ఒక బీట్ ఆగి పలికే ద్విత్వాక్షర శబ్దం (ఉదా: きって - కిత్తె, がっこう - గక్కో).",
  practiceQuestions: [
    {
      id: "l13_q1",
      type: "identify_reading",
      prompt: "How is the small っ pronounced in the word きって?",
      promptTe: "きって పదం లో చిన్న っ ఎలా పలకబడుతుంది?",
      characterToTest: "っ",
      options: [
        {
          text: "A brief 1-beat pause that doubles the T consonant: \"kitte\" (కిత్తె)",
          isCorrect: true
        },
        {
          text: "Pronounced as a full syllable \tsu\: \"kitsute\"",
          isCorrect: false
        },
        {
          text: "It is silent with no rhythm effect",
          isCorrect: false
        },
        {
          text: "It elongates the \"i\" vowel",
          isCorrect: false
        }
      ],
      explanationEn: "Small っ creates a stoppage of airflow, holding the consonant for 1 mora beat (kitte).",
      explanationTe: "తెలుగులో ద్విత్వాక్షరం (త్త) లాగా ఒక క్షణం ఆగి తదుపరి హల్లును నొక్కి పలకాలి."
    },
    {
      id: "l13_q2",
      type: "identify_reading",
      prompt: "In がっこう (school), what does the small っ do?",
      promptTe: "がっこう (పాఠశాల) లో చిన్న っ యొక్క పని ఏమిటి?",
      characterToTest: "っ",
      options: [
        {
          text: "Doubles the \"k\" sound: \"gakkou\"",
          isCorrect: true
        },
        {
          text: "Makes it \"gatsukou\"",
          isCorrect: false
        },
        {
          text: "Changes the pitch only",
          isCorrect: false
        },
        {
          text: "Doubles the \"g\" sound",
          isCorrect: false
        }
      ],
      explanationEn: "Small っ doubles the following K sound, producing \"gak-kou\".",
      explanationTe: "తర్వాతి \"క\" శబ్దాన్ని నొక్కి \"గక్కో\" గా మారుస్తుంది."
    }
  ]
},
  {
  id: "lesson_14_yoon",
  lessonNumber: 14,
  title: "Lesson 14: Yōon Contracted Glides (拗音: きゃ・しゃ・ちゃ)",
  titleTe: "పాఠం 14: యోఓన్ - సంయుక్తాక్షర శబ్దాలు (క్యా, షా, చా మొదలైనవి)",
  row: "special",
  characterIds: [
    "h_ki",
    "h_shi",
    "h_chi",
    "h_ya",
    "h_yu",
    "h_yo"
  ],
  summaryEn: "Learn how pairing i-column kana with small ゃ, ゅ, ょ creates single-beat glide sounds: きゃ (kya), しゃ (sha), ちゃ (cha), きゅ (kyu), しゅ (shu), ちょ (cho), etc.",
  summaryTe: "ఇ-కాలమ్ అక్షరాలకు చిన్న ゃ, ゅ, ょ లు చేరి ఒకే బీట్‌లో పలికే సంయుక్తాక్షరాలు ఏర్పడతాయి (క్యా, షా, చా మొదలైనవి).",
  practiceQuestions: [
    {
      id: "l14_q1",
      type: "identify_reading",
      prompt: "How is し (shi) + small ゃ pronounced together: しゃ?",
      promptTe: "し కి చిన్న ゃ చేరిస్తే వచ్చే しゃ శబ్దం ఏమిటి?",
      characterToTest: "しゃ",
      options: [
        {
          text: "sha (షా - single beat)",
          isCorrect: true
        },
        {
          text: "shi-ya (షి-య - two separate beats)",
          isCorrect: false
        },
        {
          text: "sa (స)",
          isCorrect: false
        },
        {
          text: "cha (చా)",
          isCorrect: false
        }
      ],
      explanationEn: "し + small ゃ merges into the single mora \"sha\" (Telugu \"షా\", like in shashimi).",
      explanationTe: "రెండు వేర్వేరు శబ్దాలు కాకుండా ఒకే బీట్‌లో \"షా\" (sha) అని పలకాలి."
    },
    {
      id: "l14_q2",
      type: "identify_reading",
      prompt: "What sound does ち (chi) + small ょ make: ちょ?",
      promptTe: "ち కి చిన్న ょ చేరిస్తే వచ్చే ちょ శబ్దం ఏమిటి?",
      characterToTest: "ちょ",
      options: [
        {
          text: "cho (చొ / చో - single beat)",
          isCorrect: true
        },
        {
          text: "chi-yo (చి-యొ - two separate beats)",
          isCorrect: false
        },
        {
          text: "to (తొ)",
          isCorrect: false
        },
        {
          text: "sho (షొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ち + small ょ merges into \"cho\" (e.g. ちょっと chotto = a little).",
      explanationTe: "ఒకే బీట్‌లో \"చొ/చో\" (cho) గా పలకాలి (ఉదా: ちょっと - చొత్తొ)."
    }
  ]
}
];

// ==========================================
// PROGRESSIVE KATAKANA COURSE
// ==========================================
export const KATAKANA_LESSONS: KanaLesson[] = [
  {
  id: "k_lesson_1_vowels",
  lessonNumber: 1,
  title: "Lesson 1: The 5 Katakana Vowels (母音: ア・イ・ウ・エ・オ)",
  titleTe: "పాఠం 1: 5 కటకాన అచ్చులు (అ, ఇ, ఉ, ఎ, ఒ)",
  row: "a",
  characterIds: [
    "k_a",
    "k_i",
    "k_u",
    "k_e",
    "k_o"
  ],
  summaryEn: "Master the sharp Katakana vowel building blocks: ア (a), イ (i), ウ (u), エ (e), オ (o). Katakana is characterized by sharp, straight strokes.",
  summaryTe: "కటకాన అచ్చులు: ア (అ), イ (ఇ), ウ (ఉ), エ (ఎ), オ (ఒ). కటకాన అక్షరాలు పదునైన తిన్నని గీతలతో ఉంటాయి.",
  practiceQuestions: [
    {
      id: "kl1_q1",
      type: "identify_reading",
      prompt: "Identify this Katakana vowel (looks like an axe chopping down):",
      promptTe: "గొడ్డలి లాంటి ఆకారం ఉన్న ఈ కటకాన అచ్చు ఏమిటి?",
      characterToTest: "ア",
      options: [
        {
          text: "a (అ)",
          isCorrect: true
        },
        {
          text: "o (ఒ)",
          isCorrect: false
        },
        {
          text: "e (ఎ)",
          isCorrect: false
        },
        {
          text: "u (ఉ)",
          isCorrect: false
        }
      ],
      explanationEn: "ア is \"a\" (looks like an Axe chopping down).",
      explanationTe: "ア అనేది \"అ\"."
    },
    {
      id: "kl1_q2",
      type: "identify_reading",
      prompt: "Identify this two-stroke Katakana character standing like an easel:",
      promptTe: "స్టాండ్ లాగా నిలబడిన ఈ కటకాన అక్షరం ఏమిటి?",
      characterToTest: "イ",
      options: [
        {
          text: "i (ఇ)",
          isCorrect: true
        },
        {
          text: "a (అ)",
          isCorrect: false
        },
        {
          text: "e (ఎ)",
          isCorrect: false
        },
        {
          text: "o (ఒ)",
          isCorrect: false
        }
      ],
      explanationEn: "イ is \"i\" (looks like an Easel: \"I\").",
      explanationTe: "イ అనేది \"ఇ\"."
    },
    {
      id: "kl1_q3",
      type: "match_character",
      prompt: "Select the character for \"u\" (ఉ):",
      promptTe: "\"ఉ\" (u) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ウ",
      options: [
        {
          text: "ウ",
          reading: "u (ఉ)",
          isCorrect: true
        },
        {
          text: "ア",
          reading: "a (అ)",
          isCorrect: false
        },
        {
          text: "イ",
          reading: "i (ఇ)",
          isCorrect: false
        },
        {
          text: "エ",
          reading: "e (ఎ)",
          isCorrect: false
        }
      ],
      explanationEn: "ウ is \"u\" (like the top of an Umbrella).",
      explanationTe: "ウ అనేది \"ఉ\". గొడుగు పైభాగం లాంటి ఆకారం."
    },
    {
      id: "kl1_q4",
      type: "match_character",
      prompt: "Select the character for \"e\" (ఎ - looks like an I-beam girder):",
      promptTe: "\"ఎ\" (e) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "エ",
      options: [
        {
          text: "エ",
          reading: "e (ఎ)",
          isCorrect: true
        },
        {
          text: "オ",
          reading: "o (ఒ)",
          isCorrect: false
        },
        {
          text: "ア",
          reading: "a (అ)",
          isCorrect: false
        },
        {
          text: "イ",
          reading: "i (ఇ)",
          isCorrect: false
        }
      ],
      explanationEn: "エ is \"e\" (looks like an Elevator beam or capital letter I).",
      explanationTe: "エ అనేది \"ఎ\". ఐరన్ పిల్లర్ లాంటి ఆకారం."
    },
    {
      id: "kl1_q5",
      type: "match_character",
      prompt: "Select the character for \"o\" (ఒ):",
      promptTe: "\"ఒ\" (o) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "オ",
      options: [
        {
          text: "オ",
          reading: "o (ఒ)",
          isCorrect: true
        },
        {
          text: "ア",
          reading: "a (అ)",
          isCorrect: false
        },
        {
          text: "ウ",
          reading: "u (ఉ)",
          isCorrect: false
        },
        {
          text: "エ",
          reading: "e (ఎ)",
          isCorrect: false
        }
      ],
      explanationEn: "オ is \"o\" (an Opera singer holding their arms out).",
      explanationTe: "オ అనేది \"ఒ\"."
    }
  ]
},
  {
  id: "k_lesson_2_k_row",
  lessonNumber: 2,
  title: "Lesson 2: The Katakana K-Row (カ行: カ・キ・ク・ケ・コ)",
  titleTe: "పాఠం 2: కటకాన క-శ్రేణి (క, కి, కు, కె, కొ)",
  row: "ka",
  characterIds: [
    "k_ka",
    "k_ki",
    "k_ku",
    "k_ke",
    "k_ko"
  ],
  summaryEn: "Master the Katakana K-consonants: カ (ka), キ (ki), ク (ku), ケ (ke), コ (ko).",
  summaryTe: "కటకాన క-శ్రేణి: カ (క), キ (కి), ク (కు), ケ (కె), コ (కొ).",
  practiceQuestions: [
    {
      id: "kl2_q1",
      type: "identify_reading",
      prompt: "Identify this character (looks like Hiragana か without the drop dot):",
      promptTe: "హిరగాన か లాగే ఉండి చుక్క లేని ఈ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "カ",
      options: [
        {
          text: "ka (క)",
          isCorrect: true
        },
        {
          text: "ki (కి)",
          isCorrect: false
        },
        {
          text: "ku (కు)",
          isCorrect: false
        },
        {
          text: "ko (కొ)",
          isCorrect: false
        }
      ],
      explanationEn: "カ is \"ka\". Identical to Hiragana か without the outer accent drop.",
      explanationTe: "カ అనేది \"క\"."
    },
    {
      id: "kl2_q2",
      type: "identify_reading",
      prompt: "Identify this two-horizontal-bar character キ:",
      promptTe: "రెండు సమాంతర అడ్డగీతలున్న キ అక్షరం ఏమిటి?",
      characterToTest: "キ",
      options: [
        {
          text: "ki (కి)",
          isCorrect: true
        },
        {
          text: "ka (క)",
          isCorrect: false
        },
        {
          text: "ke (కె)",
          isCorrect: false
        },
        {
          text: "a (అ)",
          isCorrect: false
        }
      ],
      explanationEn: "キ is \"ki\" (looks like a Key).",
      explanationTe: "キ అనేది \"కి\". తాళంచెవి లాంటి రెండు అడ్డగీతలు."
    },
    {
      id: "kl2_q3",
      type: "match_character",
      prompt: "Select the character for \"ko\" (కొ - a clean corner box):",
      promptTe: "\"కొ\" (ko) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "コ",
      options: [
        {
          text: "コ",
          reading: "ko (కొ)",
          isCorrect: true
        },
        {
          text: "エ",
          reading: "e (ఎ)",
          isCorrect: false
        },
        {
          text: "ク",
          reading: "ku (కు)",
          isCorrect: false
        },
        {
          text: "イ",
          reading: "i (ఇ)",
          isCorrect: false
        }
      ],
      explanationEn: "コ is \"ko\" (looks like a square Corner: \"ko\").",
      explanationTe: "コ అనేది \"కొ\". చతురస్ర మూల ఆకారం."
    }
  ]
},
  {
  id: "k_lesson_3_s_row",
  lessonNumber: 3,
  title: "Lesson 3: The Katakana S-Row (サ行: サ・シ・ス・セ・ソ)",
  titleTe: "పాఠం 3: కటకాన స-శ్రేణి (స, షి, సు, సె, సొ)",
  row: "sa",
  characterIds: [
    "k_sa",
    "k_shi",
    "k_su",
    "k_se",
    "k_so"
  ],
  summaryEn: "Master the S-row: サ (sa), シ (shi - special!), ス (su), セ (se), ソ (so). Critical: シ (shi) strokes sweep upward from bottom-left!",
  summaryTe: "స-శ్రేణి: サ (స), シ (షి - ప్రత్యేక శబ్దం!), ス (సు), セ (సె), ソ (సొ). గమనిక: シ లో స్ట్రోక్ కింద నుండి పైకి స్వీప్ అవుతుంది.",
  practiceQuestions: [
    {
      id: "kl3_q1",
      type: "identify_reading",
      prompt: "In シ (shi), what direction does the long third stroke flow?",
      promptTe: "シ (షి) లో మూడో పెద్ద స్ట్రోక్ ఏ దిశలో వెళుతుంది?",
      characterToTest: "シ",
      options: [
        {
          text: "Sweeps UPWARD from bottom-left to top-right (smiling face)",
          isCorrect: true
        },
        {
          text: "Sweeps DOWNWARD from top-right to bottom-left",
          isCorrect: false
        },
        {
          text: "Horizontal right",
          isCorrect: false
        },
        {
          text: "Vertical straight down",
          isCorrect: false
        }
      ],
      explanationEn: "シ (shi) strokes sweep from bottom-left UP toward top-right (smiling upward: \"Shi has a smile\").",
      explanationTe: "సి (shi) స్ట్రోక్ కింద నుండి పైకి వెళుతుంది (పైకి చూసే నవ్వు ముఖం)."
    },
    {
      id: "kl3_q2",
      type: "match_character",
      prompt: "Select the character for \"su\" (సు):",
      promptTe: "\"సు\" (su) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ス",
      options: [
        {
          text: "ス",
          reading: "su (సు)",
          isCorrect: true
        },
        {
          text: "サ",
          reading: "sa (స)",
          isCorrect: false
        },
        {
          text: "セ",
          reading: "se (సె)",
          isCorrect: false
        },
        {
          text: "カ",
          reading: "ka (క)",
          isCorrect: false
        }
      ],
      explanationEn: "ス is \"su\" (looks like a Suit hanger).",
      explanationTe: "ス అనేది \"సు\"."
    }
  ]
},
  {
  id: "k_lesson_4_t_row",
  lessonNumber: 4,
  title: "Lesson 4: The Katakana T-Row (タ行: タ・チ・ツ・テ・ト)",
  titleTe: "పాఠం 4: కటకాన త-శ్రేణి (త, చి, త్సు, తె, తొ)",
  row: "ta",
  characterIds: [
    "k_ta",
    "k_chi",
    "k_tsu",
    "k_te",
    "k_to"
  ],
  summaryEn: "Master the T-row: タ (ta), チ (chi), ツ (tsu), テ (te), ト (to). Crucial comparison: ツ (tsu) sweeps DOWNWARD from top-right, unlike シ (shi)!",
  summaryTe: "త-శ్రేణి: タ (త), チ (చి), ツ (త్సు), テ (తె), ト (తొ). ముఖ్యమైన తేడా: ツ (త్సు) స్ట్రోక్ పై నుండి కిందికి దిగుతుంది.",
  practiceQuestions: [
    {
      id: "kl4_q1",
      type: "identify_reading",
      prompt: "How do you distinguish ツ (tsu) from シ (shi)?",
      promptTe: "ツ (త్సు) మరియు シ (షి) ల మధ్య తేడాను ఎలా గుర్తించాలి?",
      characterToTest: "ツ",
      options: [
        {
          text: "ツ sweeps DOWNWARD like a splashing tsunami; シ sweeps UPWARD like a smile",
          isCorrect: true
        },
        {
          text: "They are identical",
          isCorrect: false
        },
        {
          text: "ツ has only one dot",
          isCorrect: false
        },
        {
          text: "シ is pronounced tsu",
          isCorrect: false
        }
      ],
      explanationEn: "ツ (tsu) has dots arranged horizontally at the top, and the long stroke sweeps DOWNWARD from top-right to bottom-left (tsunami crashing down).",
      explanationTe: "ツ (త్సు) పైనుండి కిందికి దిగుతుంది; シ (షి) కింద నుండి పైకి స్వీప్ అవుతుంది."
    },
    {
      id: "kl4_q2",
      type: "match_character",
      prompt: "Select the character for \"to\" (తొ - looks like a totem branch):",
      promptTe: "\"తొ\" (to) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ト",
      options: [
        {
          text: "ト",
          reading: "to (తొ)",
          isCorrect: true
        },
        {
          text: "イ",
          reading: "i (ఇ)",
          isCorrect: false
        },
        {
          text: "テ",
          reading: "te (తె)",
          isCorrect: false
        },
        {
          text: "タ",
          reading: "ta (త)",
          isCorrect: false
        }
      ],
      explanationEn: "ト is \"to\" (looks like a Totem pole branch).",
      explanationTe: "ト అనేది \"తొ\"."
    }
  ]
},
  {
  id: "k_lesson_5_n_row",
  lessonNumber: 5,
  title: "Lesson 5: The Katakana N-Row (ナ行: ナ・ニ・ヌ・ネ・ノ)",
  titleTe: "పాఠం 5: కటకాన న-శ్రేణి (న, ని, ను, నె, నొ)",
  row: "na",
  characterIds: [
    "k_na",
    "k_ni",
    "k_nu",
    "k_ne",
    "k_no"
  ],
  summaryEn: "Master the N-row: ナ (na), ニ (ni), ヌ (nu), ネ (ne), ノ (no). Compare single-slash ノ (no) with slash-like characters.",
  summaryTe: "న-శ్రేణి: ナ (న), ニ (ని), ヌ (ను), ネ (నె), ノ (నొ). ఒకే ఏటవాలు గీతతో ఉండే ノ (నొ) ని గమనించండి.",
  practiceQuestions: [
    {
      id: "kl5_q1",
      type: "identify_reading",
      prompt: "Identify this single elegant diagonal slash ノ:",
      promptTe: "ఒకే ఒక వాలుగీత కలిగిన ノ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ノ",
      options: [
        {
          text: "no (నొ)",
          isCorrect: true
        },
        {
          text: "ni (ని)",
          isCorrect: false
        },
        {
          text: "na (న)",
          isCorrect: false
        },
        {
          text: "to (తొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ノ is \"no\" (like a long Nose). A single smooth stroke.",
      explanationTe: "ノ అనేది \"నొ\". ముక్కు ఆకారంలో ఉండే ఒకే వాలుగీత."
    },
    {
      id: "kl5_q2",
      type: "match_character",
      prompt: "Select the character for \"ni\" (ని - two parallel horizontal bars):",
      promptTe: "\"ని\" (ni) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ニ",
      options: [
        {
          text: "ニ",
          reading: "ni (ని)",
          isCorrect: true
        },
        {
          text: "エ",
          reading: "e (ఎ)",
          isCorrect: false
        },
        {
          text: "コ",
          reading: "ko (కొ)",
          isCorrect: false
        },
        {
          text: "ト",
          reading: "to (తొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ニ is \"ni\" (two needles, also the kanji for the number 2).",
      explanationTe: "ニ అనేది \"ని\" (రెండు అడ్డగీతలు)."
    }
  ]
},
  {
  id: "k_lesson_6_h_row",
  lessonNumber: 6,
  title: "Lesson 6: The Katakana H-Row (ハ行: ハ・ヒ・フ・ヘ・ホ)",
  titleTe: "పాఠం 6: కటకాన హ-శ్రేణి (హ, హి, ఫు, హె, హొ)",
  row: "ha",
  characterIds: [
    "k_ha",
    "k_hi",
    "k_fu",
    "k_he",
    "k_ho"
  ],
  summaryEn: "Master the H-row: ハ (ha), ヒ (hi), フ (fu), ヘ (he), ホ (ho). Notice that ヘ (he) is virtually identical in both Hiragana and Katakana!",
  summaryTe: "హ-శ్రేణి: ハ (హ), ヒ (హి), フ (ఫు), ヘ (హె), ホ (హొ). హిరగాన మరియు కటకాన రెండింటిలోనూ ヘ (హె) ఒకేలా ఉంటుంది!",
  practiceQuestions: [
    {
      id: "kl6_q1",
      type: "identify_reading",
      prompt: "Identify this two-stroke character resembling a hut or mustache ハ:",
      promptTe: "గుడిసె చూరు లాంటి ハ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ハ",
      options: [
        {
          text: "ha (హ)",
          isCorrect: true
        },
        {
          text: "hi (హి)",
          isCorrect: false
        },
        {
          text: "fu (ఫు)",
          isCorrect: false
        },
        {
          text: "ho (హొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ハ is \"ha\" (like a Haystack hut).",
      explanationTe: "ハ అనేది \"హ\"."
    },
    {
      id: "kl6_q2",
      type: "match_character",
      prompt: "Select the character for \"fu\" (ఫు - single sharp angle):",
      promptTe: "\"ఫు\" (fu) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "フ",
      options: [
        {
          text: "フ",
          reading: "fu (ఫు)",
          isCorrect: true
        },
        {
          text: "ヘ",
          reading: "he (హె)",
          isCorrect: false
        },
        {
          text: "ウ",
          reading: "u (ఉ)",
          isCorrect: false
        },
        {
          text: "ク",
          reading: "ku (కు)",
          isCorrect: false
        }
      ],
      explanationEn: "フ is \"fu\" (like a fluttering Flag).",
      explanationTe: "フ అనేది \"ఫు\"."
    }
  ]
},
  {
  id: "k_lesson_7_m_row",
  lessonNumber: 7,
  title: "Lesson 7: The Katakana M-Row (マ行: マ・ミ・ム・メ・モ)",
  titleTe: "పాఠం 7: కటకాన మ-శ్రేణి (మ, మి, ము, మె, మొ)",
  row: "ma",
  characterIds: [
    "k_ma",
    "k_mi",
    "k_mu",
    "k_me",
    "k_mo"
  ],
  summaryEn: "Master the M-row: マ (ma), ミ (mi), ム (mu), メ (me), モ (mo). ミ has three parallel slanted slashes (3 missiles).",
  summaryTe: "మ-శ్రేణి: マ (మ), ミ (మి), ム (ము), メ (మె), モ (మొ). ミ కి మూడు సమాంతర వాలుగీతలు ఉంటాయి.",
  practiceQuestions: [
    {
      id: "kl7_q1",
      type: "identify_reading",
      prompt: "Identify this three-slash character ミ:",
      promptTe: "మూడు వాలుగీతలు కలిగిన ミ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ミ",
      options: [
        {
          text: "mi (మి)",
          isCorrect: true
        },
        {
          text: "ni (ని)",
          isCorrect: false
        },
        {
          text: "shi (షి)",
          isCorrect: false
        },
        {
          text: "so (సొ)",
          isCorrect: false
        }
      ],
      explanationEn: "ミ is \"mi\" (three Missiles: \"mi\", also the native reading for 3: mittsu).",
      explanationTe: "ミ అనేది \"మి\". మూడు సమాంతర గీతలు."
    },
    {
      id: "kl7_q2",
      type: "match_character",
      prompt: "Select the character for \"me\" (మె - a clean crossing slash):",
      promptTe: "\"మె\" (me) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "メ",
      options: [
        {
          text: "メ",
          reading: "me (మె)",
          isCorrect: true
        },
        {
          text: "ナ",
          reading: "na (న)",
          isCorrect: false
        },
        {
          text: "マ",
          reading: "ma (మ)",
          isCorrect: false
        },
        {
          text: "ム",
          reading: "mu (ము)",
          isCorrect: false
        }
      ],
      explanationEn: "メ is \"me\" (looks like a Medical cross or an \"X\").",
      explanationTe: "メ అనేది \"మె\". క్రాస్ మార్క్."
    }
  ]
},
  {
  id: "k_lesson_8_y_row",
  lessonNumber: 8,
  title: "Lesson 8: The Katakana Y-Row (ヤ行: ヤ・ユ・ヨ)",
  titleTe: "పాఠం 8: కటకాన య-శ్రేణి (య, యు, యొ)",
  row: "ya",
  characterIds: [
    "k_ya",
    "k_yu",
    "k_yo"
  ],
  summaryEn: "Master the three Katakana Y-characters: ヤ (ya), ユ (yu), ヨ (yo).",
  summaryTe: "య-శ్రేణి: ヤ (య), ユ (యు), ヨ (యొ).",
  practiceQuestions: [
    {
      id: "kl8_q1",
      type: "identify_reading",
      prompt: "Identify this backwards E character ヨ:",
      promptTe: "వెనక్కి తిరిగిన E లాగా ఉండే ヨ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ヨ",
      options: [
        {
          text: "yo (యొ)",
          isCorrect: true
        },
        {
          text: "ko (కొ)",
          isCorrect: false
        },
        {
          text: "yu (యు)",
          isCorrect: false
        },
        {
          text: "e (ఎ)",
          isCorrect: false
        }
      ],
      explanationEn: "ヨ is \"yo\" (like a Yo-yo rack).",
      explanationTe: "ヨ అనేది \"యొ\"."
    },
    {
      id: "kl8_q2",
      type: "match_character",
      prompt: "Select the character for \"yu\" (యు):",
      promptTe: "\"యు\" (yu) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ユ",
      options: [
        {
          text: "ユ",
          reading: "yu (యు)",
          isCorrect: true
        },
        {
          text: "コ",
          reading: "ko (కొ)",
          isCorrect: false
        },
        {
          text: "ヨ",
          reading: "yo (యొ)",
          isCorrect: false
        },
        {
          text: "エ",
          reading: "e (ఎ)",
          isCorrect: false
        }
      ],
      explanationEn: "ユ is \"yu\" (You are number 1: looks like a 1 with a base).",
      explanationTe: "ユ అనేది \"యు\"."
    }
  ]
},
  {
  id: "k_lesson_9_r_row",
  lessonNumber: 9,
  title: "Lesson 9: The Katakana R-Row (ラ行: ラ・リ・ル・レ・ロ)",
  titleTe: "పాఠం 9: కటకాన ర-శ్రేణి (ర, రి, రు, రె, రొ)",
  row: "ra",
  characterIds: [
    "k_ra",
    "k_ri",
    "k_ru",
    "k_re",
    "k_ro"
  ],
  summaryEn: "Master the Katakana R-row: ラ (ra), リ (ri), ル (ru), レ (re), ロ (ro). Notice ロ is a complete square box.",
  summaryTe: "ర-శ్రేణి: ラ (ర), リ (రి), ル (రు), レ (రె), ロ (రొ). ロ అనేది ఒక చతురస్ర పెట్టె.",
  practiceQuestions: [
    {
      id: "kl9_q1",
      type: "identify_reading",
      prompt: "Identify this square box character ロ:",
      promptTe: "చతురస్ర పెట్టె లాంటి ロ అక్షరాన్ని గుర్తించండి:",
      characterToTest: "ロ",
      options: [
        {
          text: "ro (రొ)",
          isCorrect: true
        },
        {
          text: "ko (కొ)",
          isCorrect: false
        },
        {
          text: "yo (యొ)",
          isCorrect: false
        },
        {
          text: "re (రె)",
          isCorrect: false
        }
      ],
      explanationEn: "ロ is \"ro\" (like a Robot mouth).",
      explanationTe: "ロ అనేది \"రొ\"."
    },
    {
      id: "kl9_q2",
      type: "match_character",
      prompt: "Select the checkmark stroke for \"re\" (రె):",
      promptTe: "\"రె\" (re) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "レ",
      options: [
        {
          text: "レ",
          reading: "re (రె)",
          isCorrect: true
        },
        {
          text: "ル",
          reading: "ru (రు)",
          isCorrect: false
        },
        {
          text: "フ",
          reading: "fu (ఫు)",
          isCorrect: false
        },
        {
          text: "ト",
          reading: "to (తొ)",
          isCorrect: false
        }
      ],
      explanationEn: "レ is \"re\" (looks like a Red checkmark).",
      explanationTe: "レ అనేది \"రె\". ఒకే ఒక టిక్ మార్క్."
    }
  ]
},
  {
  id: "k_lesson_10_w_n_row",
  lessonNumber: 10,
  title: "Lesson 10: The Katakana W-Row and Standalone N (ワ・ヲ・ン)",
  titleTe: "పాఠం 10: కటకాన వ-శ్రేణి మరియు ఒంటరి హల్లు \"న్\" (వ, వొ, న్)",
  row: "wa",
  characterIds: [
    "k_wa",
    "k_wo",
    "k_n"
  ],
  summaryEn: "Complete all 46 basic Katakana! Learn ワ (wa), ヲ (wo), and the crucial character ン (n). Compare ン (n) with ソ (so) and シ (shi)!",
  summaryTe: "46 ప్రాథమిక కటకాన అక్షరాలు పూర్తవుతాయి! ワ (వ), ヲ (వొ), మరియు అతి ముఖ్యమైన ン (న్). ン (న్) మరియు ソ (సొ) ల స్ట్రోక్ దిశలను గమనించండి!",
  practiceQuestions: [
    {
      id: "kl10_q1",
      type: "identify_reading",
      prompt: "In Katakana ン (n), how does the stroke flow compared to ソ (so)?",
      promptTe: "కటకాన ン (న్) లో స్ట్రోక్ ఏ దిశలో వెళుతుంది?",
      characterToTest: "ン",
      options: [
        {
          text: "Sweeps UPWARD from bottom-left to top-right (like the n in Shi)",
          isCorrect: true
        },
        {
          text: "Sweeps DOWNWARD from top-right to bottom-left",
          isCorrect: false
        },
        {
          text: "Horizontal right",
          isCorrect: false
        },
        {
          text: "Vertical straight down",
          isCorrect: false
        }
      ],
      explanationEn: "ン (n) sweeps UPWARD from bottom-left toward top-right. In contrast, ソ (so) sweeps DOWNWARD from top to bottom!",
      explanationTe: "ン (న్) కింద నుండి పైకి స్వీప్ అవుతుంది; ソ (సొ) పైనుండి కిందికి దిగుతుంది."
    },
    {
      id: "kl10_q2",
      type: "match_character",
      prompt: "Select the character for \"wa\" (వ):",
      promptTe: "\"వ\" (wa) అక్షరాన్ని ఎంచుకోండి:",
      characterToTest: "ワ",
      options: [
        {
          text: "ワ",
          reading: "wa (వ)",
          isCorrect: true
        },
        {
          text: "ウ",
          reading: "u (ఉ)",
          isCorrect: false
        },
        {
          text: "フ",
          reading: "fu (ఫు)",
          isCorrect: false
        },
        {
          text: "ラ",
          reading: "ra (ర)",
          isCorrect: false
        }
      ],
      explanationEn: "ワ is \"wa\" (a Wine glass rim). Notice it has no top tick like ウ does.",
      explanationTe: "ワ అనేది \"వ\". ウ (ఉ) లాగా పైన చుక్క ఉండదు."
    }
  ]
},
  {
  id: "k_lesson_11_dakuon",
  lessonNumber: 11,
  title: "Lesson 11: Katakana Dakuon & Handakuon (ガ・ザ・ダ・バ・パ)",
  titleTe: "పాఠం 11: కటకాన దకుఓన్ మరియు హందకుఓన్ (గ, జ, ద, బ, ప)",
  row: "dakuon",
  characterIds: [
    "k_ka",
    "k_sa",
    "k_ta",
    "k_ha"
  ],
  summaryEn: "Master voiced and semi-voiced Katakana used heavily in international loanwords: ガ (ga), ザ (za), ダ (da), バ (ba), パ (pa) like パン (pan = bread), ビール (biiru = beer).",
  summaryTe: "అంతర్జాతీయ పదాలలో విస్తృతంగా వాడే గుణింతపు కటకాన: ガ (గ), ザ (జ), ダ (ద), バ (బ), パ (ప) (ఉదా: パン - బ్రెడ్, ビール - బీర్).",
  practiceQuestions: [
    {
      id: "kl11_q1",
      type: "identify_reading",
      prompt: "What sound does ハ with a circle (maru) make: パ?",
      promptTe: "ハ పైన చిన్న సున్న చేరిస్తే వచ్చే パ శబ్దం ఏమిటి?",
      characterToTest: "パ",
      options: [
        {
          text: "pa (ప)",
          isCorrect: true
        },
        {
          text: "ba (బ)",
          isCorrect: false
        },
        {
          text: "ha (హ)",
          isCorrect: false
        },
        {
          text: "fa (ఫ)",
          isCorrect: false
        }
      ],
      explanationEn: "ハ + ゜ = パ (pa). Used in words like パン (pan = bread).",
      explanationTe: "సున్న చేరిస్తే \"ప\" శబ్దం వస్తుంది (ఉదా: パン - బ్రెడ్)."
    },
    {
      id: "kl11_q2",
      type: "identify_reading",
      prompt: "What sound does カ with ten-ten make: ガ?",
      promptTe: "カ కి తెన్-తెన్ చేరిస్తే వచ్చే ガ శబ్దం ఏమిటి?",
      characterToTest: "ガ",
      options: [
        {
          text: "ga (గ)",
          isCorrect: true
        },
        {
          text: "ka (క)",
          isCorrect: false
        },
        {
          text: "za (జ)",
          isCorrect: false
        },
        {
          text: "da (ద)",
          isCorrect: false
        }
      ],
      explanationEn: "カ + ゛ = ガ (ga).",
      explanationTe: "తెన్-తెన్ చేరిస్తే \"గ\" శబ్దం వస్తుంది."
    }
  ]
},
  {
  id: "k_lesson_12_special",
  lessonNumber: 12,
  title: "Lesson 12: Special Katakana Features (Chōonpu ー & Sokuon ッ)",
  titleTe: "పాఠం 12: కటకాన ప్రత్యేక గుర్తులు - దీర్ఘపు గీత (ー) మరియు చిన్న ッ",
  row: "special",
  characterIds: [
    "k_tsu"
  ],
  summaryEn: "Learn the two essential Katakana mechanisms for loanwords: the Chōonpu (ー) long vowel bar (e.g. ケーキ keeki, コーヒー koohii) and small ッ double consonant pause (e.g. ベッド beddo).",
  summaryTe: "విదేశీ పదాలలో అత్యంత ముఖ్యమైన రెండు గుర్తులు: దీర్ఘపు గీత ー (ఉదా: ケーキ - కేక్, コーヒー - కాఫీ) మరియు చిన్న ッ ద్విత్వాక్షర స్టాప్ (ఉదా: ベッド - బెడ్).",
  practiceQuestions: [
    {
      id: "kl12_q1",
      type: "identify_reading",
      prompt: "In Katakana words like コーヒー (coffee), what does the horizontal bar ー indicate?",
      promptTe: "కటకాన పదాలలో కనిపించే అడ్డగీత (ー) దేనిని సూచిస్తుంది?",
      characterToTest: "ー",
      options: [
        {
          text: "Chōonpu: Elongates the preceding vowel by 1 mora beat (\"ko-o-hi-i\")",
          isCorrect: true
        },
        {
          text: "A hyphen between syllables",
          isCorrect: false
        },
        {
          text: "The kanji for one (ichi)",
          isCorrect: false
        },
        {
          text: "A silent separation",
          isCorrect: false
        }
      ],
      explanationEn: "The Chōonpu (ー) extends the preceding vowel sound by one extra beat (mora). In horizontal text it is written horizontally (ー).",
      explanationTe: "దీర్ఘపు గీత (Chōonpu): ముందున్న అచ్చును ఒక బీట్ పాటు దీర్ఘం తీసి పలకాలి (కో-హీ)."
    },
    {
      id: "kl12_q2",
      type: "identify_reading",
      prompt: "In ベッド (beddo = bed), what is the function of the small ッ?",
      promptTe: "ベッド (బెడ్) లో చిన్న ッ యొక్క పని ఏమిటి?",
      characterToTest: "ッ",
      options: [
        {
          text: "Doubles the following \"d\" consonant with a pause: \"bed-do\"",
          isCorrect: true
        },
        {
          text: "Pronounced as full \"tsu\"",
          isCorrect: false
        },
        {
          text: "Makes the sound softer",
          isCorrect: false
        },
        {
          text: "Indicates past tense",
          isCorrect: false
        }
      ],
      explanationEn: "Small ッ acts as the Katakana sokuon, creating a 1-beat glottal pause that doubles the D consonant: \"beddo\".",
      explanationTe: "చిన్న ッ ఒక క్షణం ఆగి తదుపరి హల్లును నొక్కి పలికేలా చేస్తుంది (బెడ్డొ)."
    }
  ]
}
];
