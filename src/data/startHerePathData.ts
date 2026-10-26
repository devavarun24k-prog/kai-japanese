// src/data/startHerePathData.ts
// Progressive Disclosure "Start Here" Path curriculum spanning Stages 0 through 7
// Stages follow: Watch > Hear > Trace > Write from memory > Quiz > auto-add to FSRS reviews
// Supports first-launch placement ("I know nothing", "Some kana", "N5 level") and Test-Out options

export type PlacementChoice = 'know_nothing' | 'some_kana' | 'n5_level';

export interface StageStepQuizQuestion {
  id: string;
  question: string;
  questionTe?: string;
  audioText?: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationTe: string;
}

export interface StageCardItem {
  id: string;
  itemType: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'sentence';
  front: string;
  back: string;
  reading: string;
  meaningEn: string;
  meaningTe: string;
}

export interface PathStageDef {
  stageNumber: number;
  id: string;
  titleEn: string;
  titleJp: string;
  titleTe: string;
  descriptionEn: string;
  descriptionTe: string;
  badge: string;
  estimatedMinutes: number;
  unlockRequirement: string;
  watchContent: {
    heading: string;
    bodyEn: string;
    bodyTe: string;
    keyPoints: string[];
    diagramLabel?: string;
  };
  hearContent: {
    audioItems: {
      text: string;
      romaji: string;
      meaningEn: string;
      meaningTe: string;
      notes: string;
    }[];
  };
  traceContent: {
    character: string;
    romaji: string;
    strokes: string[];
    guidanceEn: string;
    guidanceTe: string;
  };
  writeContent: {
    prompt: string;
    expectedCharacter: string;
    hintEn: string;
    hintTe: string;
  };
  quizQuestions: StageStepQuizQuestion[];
  testOutQuestions: StageStepQuizQuestion[];
  fsrsItems: StageCardItem[];
}

export const START_HERE_STAGES: PathStageDef[] = [
  // =========================================================================
  // STAGE 0: How Japanese Works
  // =========================================================================
  {
    stageNumber: 0,
    id: 'stage_0_how_japanese_works',
    titleEn: 'How Japanese Works',
    titleJp: '日本語の仕組み',
    titleTe: 'జపనీస్ భాష ఎలా పనిచేస్తుంది',
    descriptionEn: 'The three writing scripts (Hiragana, Katakana, Kanji), SOV sentence order, and the role of particles.',
    descriptionTe: 'మూడు లిపులు (హిరగానా, కటకానా, కాంజీ) మరియు వాక్య నిర్మాణం.',
    badge: 'Foundation',
    estimatedMinutes: 8,
    unlockRequirement: 'Available to all learners immediately',
    watchContent: {
      heading: 'The Three Scripts & Natural SOV Flow',
      bodyEn: 'Japanese does not use an alphabet like English. Instead, it uses Hiragana (for native grammar & endings), Katakana (for foreign loanwords like コーヒー/coffee), and Kanji (Chinese characters representing core concepts and roots). In Japanese, the verb ALWAYS comes at the very end of the sentence (Subject - Object - Verb).',
      bodyTe: 'జపనీస్ భాషలో మూడు లిపులు ఉంటాయి: హిరగానా, కటకానా, మరియు కాంజీ. వాక్యంలో క్రియ ఎల్లప్పుడూ చివరనే వస్తుంది.',
      keyPoints: [
        'Hiragana (ひらがな): 46 phonetic characters for grammar, particles, and native words.',
        'Katakana (カタカナ): 46 angular phonetic characters for imported loanwords and names.',
        'Kanji (漢字): Ideograms where each symbol represents a root concept (e.g. 木 = tree, 本 = book).',
        'Word Order: Subject + Object + Verb (SOV). E.g. "I water drink" (わたし は みず を のみます).'
      ],
      diagramLabel: 'Scripts Diagram: 私は [Kanji] + コーヒーを [Katakana] + 飲みます [Kanji + Hiragana]'
    },
    hearContent: {
      audioItems: [
        { text: 'こんにちは', romaji: 'Konnichiwa', meaningEn: 'Hello / Good afternoon', meaningTe: 'నమస్కారం', notes: 'Flat, balanced pitch across each mora.' },
        { text: 'ありがとう', romaji: 'Arigatou', meaningEn: 'Thank you', meaningTe: 'ధన్యవాదాలు', notes: 'The final "u" elongates the "to" sound (to-o).' },
        { text: 'さようなら', romaji: 'Sayounara', meaningEn: 'Goodbye', meaningTe: 'వీడ్కోలు', notes: 'Long "yo" sound followed by clear na-ra.' }
      ]
    },
    traceContent: {
      character: 'の',
      romaji: 'no',
      strokes: ['M 50 25 C 40 35, 25 55, 30 70 C 35 85, 75 85, 75 55 C 75 35, 45 35, 35 55'],
      guidanceEn: 'Start near top-center, loop downward to the left, then sweep up in a grand continuous spiral.',
      guidanceTe: 'పైనుండి ప్రారంభించి ఎడమవైపు వలయంలా తిప్పుతూ ఒకే స్ట్రోక్‌తో పూర్తి చేయండి.'
    },
    writeContent: {
      prompt: 'From memory, recall the smooth spiral particle that connects two nouns (A no B = B of A):',
      expectedCharacter: 'の',
      hintEn: 'It looks like a swirl or a magnifying glass spiral.',
      hintTe: 'గుండ్రని సుడిగుండం ఆకారంలో ఉండే అక్షరం.'
    },
    quizQuestions: [
      {
        id: 'q0_1',
        question: 'Which Japanese script is primarily used for foreign loanwords and names?',
        options: ['Hiragana', 'Katakana', 'Kanji', 'Romaji'],
        correctIndex: 1,
        explanationEn: 'Katakana (カタカナ) is used for imported foreign words (like コーヒー / coffee) and foreign names.',
        explanationTe: 'విదేశీ పదాలు మరియు పేర్ల కోసం కటకానా ఉపయోగిస్తారు.'
      },
      {
        id: 'q0_2',
        question: 'Where does the verb typically appear in a standard Japanese sentence?',
        options: ['At the beginning', 'In the middle', 'At the very end', 'Anywhere randomly'],
        correctIndex: 2,
        explanationEn: 'Japanese is strictly an SOV language: the verb always concludes the sentence.',
        explanationTe: 'జపనీస్ వాక్యంలో క్రియ ఎల్లప్పుడూ వాక్యం చివరన ఉంటుంది.'
      },
      {
        id: 'q0_3',
        question: 'How many basic characters are in the standard Hiragana syllabary?',
        options: ['26', '46', '100', '214'],
        correctIndex: 1,
        explanationEn: 'There are 46 core phonetic characters in the basic Gojuon table.',
        explanationTe: 'ప్రాథమిక హిరగానాలో మొత్తం 46 అక్షరాలు ఉంటాయి.'
      }
    ],
    testOutQuestions: [
      {
        id: 'to0_1',
        question: 'Identify the Katakana script among these choices:',
        options: ['さくら', 'サクラ', '桜', 'sakura'],
        correctIndex: 1,
        explanationEn: 'サクラ is written in angular Katakana.',
        explanationTe: 'サクラ కటకానా లిపిలో వ్రాయబడింది.'
      },
      {
        id: 'to0_2',
        question: 'Translate the syntax pattern "Toshokan ni ikimasu" (図書館に行きます):',
        options: ['Go to the library', 'Library goes to you', 'Book read at library', 'Return home'],
        correctIndex: 0,
        explanationEn: 'Toshokan (library) + ni (destination particle) + ikimasu (go) = Go to the library.',
        explanationTe: 'గ్రంథాలయానికి వెళ్లడం.'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s0_1', itemType: 'grammar', front: 'Japanese Word Order (SOV)', back: 'Subject + Object + Verb (Verb at end)', reading: 'SOV', meaningEn: 'Verb at the end of the sentence', meaningTe: 'వాక్యం చివర క్రియ' },
      { id: 'fsrs_s0_2', itemType: 'kana', front: 'Three Scripts', back: 'Hiragana (grammar), Katakana (loanwords), Kanji (meanings)', reading: 'Scripts', meaningEn: '3 Writing systems', meaningTe: 'మూడు లిపులు' }
    ]
  },

  // =========================================================================
  // STAGE 1: Vowels (あ いうえお)
  // =========================================================================
  {
    stageNumber: 1,
    id: 'stage_1_vowels',
    titleEn: 'Vowels: The 5 Foundations',
    titleJp: '母音 (あいうえお)',
    titleTe: 'అచ్చులు (ఆ, ఇ, ఉ, ఎ, ఓ)',
    descriptionEn: 'Master the 5 pure vowel sounds: A (あ), I (い), U (う), E (え), O (お).',
    descriptionTe: 'జపనీస్ భాషలోని 5 ప్రధాన అచ్చులు.',
    badge: 'Vowels',
    estimatedMinutes: 10,
    unlockRequirement: 'Complete Stage 0 or pass Test-Out',
    watchContent: {
      heading: 'The Five Eternal Sounds of Japanese',
      bodyEn: 'Every syllable in Japanese (with the single exception of ん/n) ends in one of five pure, crisp vowels: A, I, U, E, O. Unlike English vowels which slide and glide, Japanese vowels are pure, short, and never change their sound.',
      bodyTe: 'జపనీస్ భాషలోని ప్రతి అక్షరం ఈ 5 అచ్చులలో ఏదో ఒక దానితో ముగుస్తుంది.',
      keyPoints: [
        'あ (a): Open throat like "ah" in father (ఆ).',
        'い (i): Pure "ee" like in feet (ఇ).',
        'う (u): Unrounded "oo" with relaxed lips (ఉ).',
        'え (e): Clean "eh" like in red (ఎ).',
        'お (o): Rounded "oh" like in go (ఓ).'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'あ', romaji: 'a', meaningEn: 'Vowel A', meaningTe: 'ఆ', notes: 'Open mouth naturally.' },
        { text: 'い', romaji: 'i', meaningEn: 'Vowel I', meaningTe: 'ఇ', notes: 'Smile slightly as you voice.' },
        { text: 'う', romaji: 'u', meaningEn: 'Vowel U', meaningTe: 'ఉ', notes: 'Do not purse lips forward.' },
        { text: 'え', romaji: 'e', meaningEn: 'Vowel E', meaningTe: 'ఎ', notes: 'Clear, crisp short sound.' },
        { text: 'お', romaji: 'o', meaningEn: 'Vowel O', meaningTe: 'ఓ', notes: 'Rounded resonance.' }
      ]
    },
    traceContent: {
      character: 'あ',
      romaji: 'a',
      strokes: [
        'M 25 35 L 75 35',
        'M 50 18 L 50 82',
        'M 35 45 C 20 65, 30 85, 55 82 C 78 80, 80 55, 60 48 C 45 42, 35 55, 45 65'
      ],
      guidanceEn: 'Stroke 1: Horizontal line left-to-right. Stroke 2: Vertical crossing line down. Stroke 3: Smooth loop starting from left, sweeping around to the bottom right.',
      guidanceTe: '1వ స్ట్రోక్: అడ్డగీత. 2వ స్ట్రోక్: నిలువుగీత. 3వ స్ట్రోక్: చుట్టుతిరిగే లూప్.'
    },
    writeContent: {
      prompt: 'Recall the first Hiragana vowel "A" (sounds like "ah"):',
      expectedCharacter: 'あ',
      hintEn: 'Remember: Horizontal line, vertical drop, then a belly loop.',
      hintTe: 'అడ్డగీత, నిలువుగీత మరియు లూప్ ఉన్న అక్షరం.'
    },
    quizQuestions: [
      {
        id: 'q1_1',
        question: 'Which character represents the vowel sound "i"?',
        options: ['あ', 'い', 'う', 'え'],
        correctIndex: 1,
        explanationEn: 'い represents the sound "i" (pronounced like "ee" in feet).',
        explanationTe: 'い అక్షరం "ఇ" శబ్దాన్ని సూచిస్తుంది.'
      },
      {
        id: 'q1_2',
        question: 'What is the correct romaji pronunciation for "え"?',
        options: ['a', 'u', 'e', 'o'],
        correctIndex: 2,
        explanationEn: 'え is pronounced "e" (like the "e" in pen).',
        explanationTe: 'え శబ్దం "ఎ".'
      },
      {
        id: 'q1_3',
        question: 'What word do "あ" + "お" (あお / ao) make together?',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctIndex: 1,
        explanationEn: 'あお (ao) means "blue" in Japanese.',
        explanationTe: 'ఆవో అంటే నీలం రంగు.'
      }
    ],
    testOutQuestions: [
      {
        id: 'to1_1',
        question: 'Which pair correctly matches "house" (ie) in Hiragana?',
        options: ['あい', 'いえ', 'うえ', 'おい'],
        correctIndex: 1,
        explanationEn: 'いえ (i + e) means "house / home".',
        explanationTe: 'ఇయే అంటే ఇల్లు.'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s1_a', itemType: 'kana', front: 'あ', back: 'a (ah)', reading: 'a', meaningEn: 'Vowel A', meaningTe: 'ఆ' },
      { id: 'fsrs_s1_i', itemType: 'kana', front: 'い', back: 'i (ee)', reading: 'i', meaningEn: 'Vowel I', meaningTe: 'ఇ' },
      { id: 'fsrs_s1_u', itemType: 'kana', front: 'う', back: 'u (oo)', reading: 'u', meaningEn: 'Vowel U', meaningTe: 'ఉ' },
      { id: 'fsrs_s1_e', itemType: 'kana', front: 'え', back: 'e (eh)', reading: 'e', meaningEn: 'Vowel E', meaningTe: 'ఎ' },
      { id: 'fsrs_s1_o', itemType: 'kana', front: 'お', back: 'o (oh)', reading: 'o', meaningEn: 'Vowel O', meaningTe: 'ఓ' }
    ]
  },

  // =========================================================================
  // STAGE 2: Hiragana by Row
  // =========================================================================
  {
    stageNumber: 2,
    id: 'stage_2_hiragana_rows',
    titleEn: 'Hiragana: Systematic Rows',
    titleJp: '五十音順 (か行〜わ行)',
    titleTe: 'హిరగానా వరుసలు (క, స, త, న...)',
    descriptionEn: 'The full consonant matrix: K, S, T, N, H, M, Y, R, W rows + final ん.',
    descriptionTe: 'హల్లులతో కూడిన పూర్తి హిరగానా చార్ట్.',
    badge: 'Hiragana 46',
    estimatedMinutes: 15,
    unlockRequirement: 'Complete Stage 1 or pass Test-Out',
    watchContent: {
      heading: 'The Grid Architecture of Japanese',
      bodyEn: 'Japanese consonants pair symmetrically with the 5 vowels. Once you learn the row sequence (Akasatana Hamayarawa), you unlock all 46 basic characters effortlessly. Notice exceptions: Shi (not Si), Chi & Tsu (not Ti/Tu), and Fu (not Hu).',
      bodyTe: 'క, స, త, న, హ, మ, య, ర, వ వరుసలు క్రమపద్ధతిలో సాగుతాయి.',
      keyPoints: [
        'K-row: か (ka), き (ki), く (ku), け (ke), こ (ko)',
        'S-row: さ (sa), し (shi), す (su), せ (se), そ (so)',
        'T-row: た (ta), ち (chi), つ (tsu), て (te), と (to)',
        'Voiced variations: Dakuten (゛) turns K->G, S->Z, T->D, H->B; Handakuten (゜) turns H->P.'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'かさ', romaji: 'kasa', meaningEn: 'Umbrella', meaningTe: 'గొడుగు', notes: 'Ka + Sa' },
        { text: 'すし', romaji: 'sushi', meaningEn: 'Sushi', meaningTe: 'సుశి వంటకం', notes: 'Su + Shi' },
        { text: 'ねこ', romaji: 'neko', meaningEn: 'Cat', meaningTe: 'పిల్లి', notes: 'Ne + Ko' }
      ]
    },
    traceContent: {
      character: 'か',
      romaji: 'ka',
      strokes: [
        'M 30 35 C 50 35, 55 55, 45 75',
        'M 38 25 L 35 80',
        'M 65 30 L 72 45'
      ],
      guidanceEn: 'Stroke 1: Curve across and hook. Stroke 2: Downward sword slash. Stroke 3: Drop accent mark.',
      guidanceTe: '1: వంపు మరియు హుక్. 2: నిలువుగీత. 3: చిన్న చుక్క/యాసెంట్.'
    },
    writeContent: {
      prompt: 'Write the character for "KA" (as in "kawaii"):',
      expectedCharacter: 'か',
      hintEn: 'Looks like someone cutting through the air with a splash drop on the right.',
      hintTe: 'కుడివైపు చుక్క ఉన్న "కా" అక్షరం.'
    },
    quizQuestions: [
      {
        id: 'q2_1',
        question: 'Which row contains the irregular sound "tsu" (つ)?',
        options: ['S-row', 'T-row', 'K-row', 'H-row'],
        correctIndex: 1,
        explanationEn: 'The T-row consists of: ta, chi, tsu, te, to.',
        explanationTe: 'తా వరుసలో "త్సు" ఉంటుంది.'
      },
      {
        id: 'q2_2',
        question: 'What does adding dakuten (゛) to "か" (ka) create?',
        options: ['が (ga)', 'ざ (za)', 'だ (da)', 'ば (ba)'],
        correctIndex: 0,
        explanationEn: 'Adding dakuten to the K-row turns it into the G-row: か (ka) -> が (ga).',
        explanationTe: 'దకుతెన్ జోడిస్తే "గా" గా మారుతుంది.'
      }
    ],
    testOutQuestions: [
      {
        id: 'to2_1',
        question: 'Read this word: さくら (sa - ku - ra):',
        options: ['Cherry blossom', 'Mountain', 'River', 'Summer'],
        correctIndex: 0,
        explanationEn: 'さくら (sakura) means Cherry blossom.',
        explanationTe: 'సాకురా అంటే చెర్రీ పువ్వు.'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s2_ka', itemType: 'kana', front: 'か', back: 'ka', reading: 'ka', meaningEn: 'Kana KA', meaningTe: 'కా' },
      { id: 'fsrs_s2_shi', itemType: 'kana', front: 'し', back: 'shi', reading: 'shi', meaningEn: 'Kana SHI', meaningTe: 'షి' },
      { id: 'fsrs_s2_tsu', itemType: 'kana', front: 'つ', back: 'tsu', reading: 'tsu', meaningEn: 'Kana TSU', meaningTe: 'త్సు' }
    ]
  },

  // =========================================================================
  // STAGE 3: Katakana & Loanwords
  // =========================================================================
  {
    stageNumber: 3,
    id: 'stage_3_katakana',
    titleEn: 'Katakana & Loanwords',
    titleJp: 'カタカナと外来語',
    titleTe: 'కటకానా మరియు విదేశీ పదాలు',
    descriptionEn: 'The sharp angular alphabet for modern tech, menus, international loanwords, and emphasis.',
    descriptionTe: 'విదేశీ పదాలు, ఆహార పదార్థాలు మరియు టెక్నాలజీ పదాలు.',
    badge: 'Katakana 46',
    estimatedMinutes: 12,
    unlockRequirement: 'Complete Stage 2 or pass Test-Out',
    watchContent: {
      heading: 'The Modern Power of Katakana',
      bodyEn: 'Whenever a word comes from English, Portuguese, Dutch, or German, it is written in Katakana. The prolonged sound mark (ー) stretches vowel duration (e.g. コーヒー = kōhī / coffee). Master Katakana, and you can instantly read 80% of Japanese menus and signs!',
      bodyTe: 'విదేశీ పదాలకు కటకానా వాడతారు. "ー" గుర్తు శబ్దాన్ని పొడిగిస్తుంది.',
      keyPoints: [
        'Katakana has a 1-to-1 sound correspondence with Hiragana.',
        'Strokes are sharp, straight, and angular compared to curvy Hiragana.',
        'Chouonpu (ー): Vowel elongation bar. E.g. ケーキ (kēki / cake).'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'コーヒー', romaji: 'koohii', meaningEn: 'Coffee', meaningTe: 'కాఫీ', notes: 'Ko + long bar + hi + long bar.' },
        { text: 'ホテル', romaji: 'hoteru', meaningEn: 'Hotel', meaningTe: 'హోటల్', notes: 'Ho + te + ru.' },
        { text: 'バス', romaji: 'basu', meaningEn: 'Bus', meaningTe: 'బస్సు', notes: 'Ba + su.' }
      ]
    },
    traceContent: {
      character: 'ア',
      romaji: 'a (katakana)',
      strokes: ['M 25 35 L 75 35 L 60 55', 'M 50 45 L 35 80'],
      guidanceEn: 'Stroke 1: Across and sharp hook left. Stroke 2: Sweeping downward curve.',
      guidanceTe: '1: అడ్డగీత మరియు కోణీయ మలుపు. 2: కిందికి వంపు గీత.'
    },
    writeContent: {
      prompt: 'Write the Katakana character for "A":',
      expectedCharacter: 'ア',
      hintEn: 'Angular top bar with a left kick, then a leg.',
      hintTe: 'కోణీయ ఆకారంలో ఉండే కటకానా "ఆ".'
    },
    quizQuestions: [
      {
        id: 'q3_1',
        question: 'What does the horizontal bar "ー" signify in Katakana?',
        options: ['A silent letter', 'An elongated vowel sound', 'A punctuation comma', 'A capital letter'],
        correctIndex: 1,
        explanationEn: 'The chouonpu (ー) elongates the preceding vowel sound.',
        explanationTe: 'ఇది అచ్చు శబ్దాన్ని దీర్ఘం చేయడానికి ఉపయోగపడుతుంది.'
      },
      {
        id: 'q3_2',
        question: 'What does the word "タクシー" (takushii) mean?',
        options: ['Train', 'Taxi', 'Bicycle', 'Airplane'],
        correctIndex: 1,
        explanationEn: 'タクシー is the loanword for Taxi.',
        explanationTe: 'టాక్సీ వాహనం.'
      }
    ],
    testOutQuestions: [
      {
        id: 'to3_1',
        question: 'Identify the Katakana for "America":',
        options: ['アメリカ', 'イギリス', 'フランス', 'ドイツ'],
        correctIndex: 0,
        explanationEn: 'アメリカ is America in Katakana.',
        explanationTe: 'అమెరికా దేశం.'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s3_a_kata', itemType: 'kana', front: 'ア', back: 'a (katakana)', reading: 'a', meaningEn: 'Katakana A', meaningTe: 'కటకానా ఆ' },
      { id: 'fsrs_s3_coffee', itemType: 'vocab', front: 'コーヒー', back: 'Coffee', reading: 'kōhī', meaningEn: 'Coffee', meaningTe: 'కాఫీ' }
    ]
  },

  // =========================================================================
  // STAGE 4: First 50 Words
  // =========================================================================
  {
    stageNumber: 4,
    id: 'stage_4_first_50_words',
    titleEn: 'First 50 Essential Words',
    titleJp: '基本の50単語',
    titleTe: 'మొదటి 50 ముఖ్యమైన పదాలు',
    descriptionEn: 'Build immediate spoken vocabulary: greetings, numbers 1-10, food, days, and everyday essentials.',
    descriptionTe: 'రోజువారీ సంభాషణకు అవసరమైన మొదటి 50 పదాలు.',
    badge: 'Vocab 50',
    estimatedMinutes: 15,
    unlockRequirement: 'Complete Stage 3 or pass Test-Out',
    watchContent: {
      heading: 'The Building Blocks of Spoken Fluency',
      bodyEn: 'Now that you can read both Kana scripts, you will learn the high-frequency vocabulary that makes up over 40% of everyday spoken Japanese: Numbers (ichi, ni, san), Greetings (ohayou, arigatou), and high-frequency nouns (mizu, hon, tomodachi).',
      bodyTe: 'అంకెలు, రోజువారీ శుభాకాంక్షలు మరియు నిత్య జీవితంలో వాడే ముఖ్యమైన పదాలు.',
      keyPoints: [
        'Numbers 1-5: 一 (ichi), 二 (ni), 三 (san), 四 (yon/shi), 五 (go)',
        'Greetings: おはよう (Good morning), すみません (Excuse me / Sorry)',
        'Core nouns: 水 (mizu = water), 本 (hon = book), 人 (hito = person)'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'みず', romaji: 'mizu', meaningEn: 'Water', meaningTe: 'నీరు', notes: 'Essential travel noun.' },
        { text: 'すみません', romaji: 'sumimasen', meaningEn: 'Excuse me / Sorry', meaningTe: 'క్షమించండి', notes: 'The most versatile polite phrase in Japan.' },
        { text: 'はい', romaji: 'hai', meaningEn: 'Yes / Understood', meaningTe: 'అవును', notes: 'Crisp affirmation.' }
      ]
    },
    traceContent: {
      character: 'みず',
      romaji: 'mizu (water)',
      strokes: ['M 30 40 L 40 70', 'M 60 30 L 70 80'],
      guidanceEn: 'Trace the two characters forming mizu (water).',
      guidanceTe: 'మిజు (నీరు) పదాన్ని ప్రాక్టీస్ చేయండి.'
    },
    writeContent: {
      prompt: 'Write the Japanese word for "Yes" in Hiragana:',
      expectedCharacter: 'はい',
      hintEn: 'Ha + I',
      hintTe: 'హా + ఇ = హాయ్ (అవును).'
    },
    quizQuestions: [
      {
        id: 'q4_1',
        question: 'What is the Japanese word for "Water"?',
        options: ['おちゃ (ocha)', 'みず (mizu)', 'ごはん (gohan)', 'にく (niku)'],
        correctIndex: 1,
        explanationEn: 'みず (mizu) means water.',
        explanationTe: 'మిజు అంటే నీరు.'
      },
      {
        id: 'q4_2',
        question: 'Count "1, 2, 3" in Japanese:',
        options: ['ichi, ni, san', 'yon, go, roku', 'nana, hachi, kyuu', 'juu, hyaku, sen'],
        correctIndex: 0,
        explanationEn: 'ichi (1), ni (2), san (3).',
        explanationTe: 'ఇచి (1), ని (2), సన్ (3).'
      }
    ],
    testOutQuestions: [
      {
        id: 'to4_1',
        question: 'Which word means "friend"?',
        options: ['せんせい (sensei)', 'ともだち (tomodachi)', 'がくせい (gakusei)', 'かぞく (kazoku)'],
        correctIndex: 1,
        explanationEn: 'ともだち (tomodachi) means friend.',
        explanationTe: 'తొమోదాచి అంటే స్నేహితుడు.'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s4_mizu', itemType: 'vocab', front: '水 (みず)', back: 'Water', reading: 'mizu', meaningEn: 'Water', meaningTe: 'నీరు' },
      { id: 'fsrs_s4_sumimasen', itemType: 'vocab', front: 'すみません', back: 'Excuse me / Sorry', reading: 'sumimasen', meaningEn: 'Excuse me', meaningTe: 'క్షమించండి' }
    ]
  },

  // =========================================================================
  // STAGE 5: First Sentences (SOV & Particles)
  // =========================================================================
  {
    stageNumber: 5,
    id: 'stage_5_first_sentences',
    titleEn: 'First Sentences: SOV & Particles',
    titleJp: '基本の文法構造',
    titleTe: 'వాక్య నిర్మాణం మరియు విభక్తులు',
    descriptionEn: 'Connect words into fluid thoughts using the 4 cornerstone particles: は (topic), を (object), に (target), and です (to be).',
    descriptionTe: 'విభక్తులను ఉపయోగించి పూర్తి వాక్యాలను నిర్మించడం.',
    badge: 'Sentences',
    estimatedMinutes: 15,
    unlockRequirement: 'Complete Stage 4 or pass Test-Out',
    watchContent: {
      heading: 'The Magic of Japanese Particles (Joshi)',
      bodyEn: 'In Japanese, little grammatical markers called particles tell you what each word is doing in the sentence: "WA" (written は) marks the topic of discussion. "WO" (written を) marks the direct object receiving action. "DESU" (です) acts as the polite copula "is / am / are".',
      bodyTe: 'వాక్యంలో ప్రతి పదం పాత్రను విభక్తులు (పార్టికల్స్) నిర్ణయిస్తాయి.',
      keyPoints: [
        'A は B です: A is B (e.g. わたし は がくせい です = I am a student).',
        'Object を Verb: [Object] を [Action] (e.g. みず を のみます = Drink water).',
        'Question particle か: Place at sentence end to turn it into a question!'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'これは本です', romaji: 'Kore wa hon desu', meaningEn: 'This is a book', meaningTe: 'ఇది ఒక పుస్తకం', notes: 'Kore (this) + wa (topic) + hon (book) + desu (is).' },
        { text: '水を飲みます', romaji: 'Mizu wo nomimasu', meaningEn: 'I drink water', meaningTe: 'నేను నీరు త్రాగుతాను', notes: 'Mizu + wo (object marker) + nomimasu (drink).' }
      ]
    },
    traceContent: {
      character: 'は',
      romaji: 'wa (topic particle)',
      strokes: ['M 30 20 L 30 80', 'M 45 40 L 75 40', 'M 60 25 L 60 70 C 60 85, 45 80, 50 65'],
      guidanceEn: 'Written as "ha", but pronounced as "wa" when functioning as the grammatical topic marker!',
      guidanceTe: 'పార్టికల్‌గా ఉన్నప్పుడు దీనిని "వా" అని పలుకుతారు.'
    },
    writeContent: {
      prompt: 'Complete: "Kore __ hon desu" (This is a book):',
      expectedCharacter: 'は',
      hintEn: 'The topic particle (written as ha, pronounced wa).',
      hintTe: 'టాపిక్ పార్టికల్ "వా" (は).'
    },
    quizQuestions: [
      {
        id: 'q5_1',
        question: 'Which particle marks the direct object that is being acted upon?',
        options: ['は (wa)', 'を (wo)', 'に (ni)', 'で (de)'],
        correctIndex: 1,
        explanationEn: 'を (wo) marks the direct object (e.g. りんご を たべます = eat an apple).',
        explanationTe: 'కర్మను సూచించే విభక్తి "వో" (を).'
      },
      {
        id: 'q5_2',
        question: 'How do you turn "Kore wa hon desu" (This is a book) into a question?',
        options: ['Add "ka" at the end', 'Put "desu" at the start', 'Change "wa" to "no"', 'Add exclamation mark'],
        correctIndex: 0,
        explanationEn: 'Adding か (ka) at the end turns any statement into a polite question.',
        explanationTe: 'వాక్యం చివర "కా" జోడిస్తే అది ప్రశ్నగా మారుతుంది.'
      }
    ],
    testOutQuestions: [
      {
        id: 'to5_1',
        question: 'Translate: "Watashi wa nihongo ga suki desu":',
        options: ['I like Japanese', 'I speak Japanese', 'Japanese is hard', 'I teach Japanese'],
        correctIndex: 0,
        explanationEn: 'Suki desu means "to like". "I like Japanese".',
        explanationTe: 'నాకు జపనీస్ భాష అంటే ఇష్టం.'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s5_wa', itemType: 'grammar', front: 'Particle は (wa)', back: 'Topic marker: "As for [X]..."', reading: 'wa', meaningEn: 'Topic marker', meaningTe: 'టాపిక్ విభక్తి' },
      { id: 'fsrs_s5_wo', itemType: 'grammar', front: 'Particle を (wo)', back: 'Direct object marker', reading: 'o / wo', meaningEn: 'Direct object marker', meaningTe: 'కర్మ విభక్తి' }
    ]
  },

  // =========================================================================
  // STAGE 6: First 20 Kanji
  // =========================================================================
  {
    stageNumber: 6,
    id: 'stage_6_first_20_kanji',
    titleEn: 'First 20 Core Kanji',
    titleJp: '基本漢字20文字',
    titleTe: 'మొదటి 20 ముఖ్యమైన కాంజీలు',
    descriptionEn: 'The visual pictographs: Numbers (一, 二, 三), Nature (日, 月, 木, 山, 川), and People (人, 子).',
    descriptionTe: 'సంఖ్యలు, ప్రకృతి మరియు మనుషులను సూచించే చిత్రలిపి.',
    badge: 'Kanji 20',
    estimatedMinutes: 18,
    unlockRequirement: 'Complete Stage 5 or pass Test-Out',
    watchContent: {
      heading: 'From Ancient Drawings to Modern Meaning',
      bodyEn: 'Kanji are not random lines. Almost all kanji started as visual sketches of real-world objects: 日 was the sun, 月 was the crescent moon, 木 was a branching tree, and 川 was flowing water currents. Understanding this origin makes memorization instant and delightful.',
      bodyTe: 'కాంజీలు చిత్రాల నుండి ఉద్భవించాయి. సూర్యుడు, చంద్రుడు, చెట్టు వంటివి.',
      keyPoints: [
        '日: Sun / Day (hi, nichi, bi)',
        '月: Moon / Month (tsuki, getsu)',
        '木: Tree / Wood (ki, moku)',
        '山: Mountain (yama, san)',
        '川: River (kawa, gawa)',
        '人: Person / Human (hito, jin)'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'にほん', romaji: 'Nihon', meaningEn: 'Japan (Sun Origin / 日 + 本)', meaningTe: 'జపాన్ దేశం', notes: 'Origin of the sun.' },
        { text: 'ふじさん', romaji: 'Fujisan', meaningEn: 'Mt. Fuji (山 = Mountain)', meaningTe: 'ఫుజి పర్వతం', notes: 'San is the on’yomi reading for mountain.' },
        { text: 'ひと', romaji: 'Hito', meaningEn: 'Person (人)', meaningTe: 'వ్యక్తి', notes: 'A human leaning forward with two legs.' }
      ]
    },
    traceContent: {
      character: '日',
      romaji: 'nichi / hi (sun, day)',
      strokes: [
        'M 30 25 L 30 75',
        'M 30 25 L 70 25 L 70 75',
        'M 30 50 L 70 50',
        'M 30 75 L 70 75'
      ],
      guidanceEn: 'Stroke 1: Left vertical. Stroke 2: Top and right frame. Stroke 3: Middle divider. Stroke 4: Bottom seal.',
      guidanceTe: 'ఎడమ గీత, పై మరియు కుడి ఫ్రేమ్, మధ్య గీత, మరియు కింద మూసివేసే గీత.'
    },
    writeContent: {
      prompt: 'Write the Kanji for "Mountain" (3 vertical peaks):',
      expectedCharacter: '山',
      hintEn: 'Three peaks: center tallest, base connecting the sides.',
      hintTe: 'మూడు శిఖరాల పర్వతం ఆకారం (యమ).'
    },
    quizQuestions: [
      {
        id: 'q6_1',
        question: 'What does the kanji "木" represent?',
        options: ['River', 'Tree', 'Fire', 'Moon'],
        correctIndex: 1,
        explanationEn: '木 represents a tree with branches and roots.',
        explanationTe: 'చెట్టును సూచిస్తుంది.'
      },
      {
        id: 'q6_2',
        question: 'Combine "日" (sun) + "本" (origin). What country is "日本"?',
        options: ['China', 'Japan', 'Korea', 'India'],
        correctIndex: 1,
        explanationEn: '日本 (Nihon / Nippon) literally means "Origin of the Sun" — Japan.',
        explanationTe: 'జపాన్ దేశం.'
      }
    ],
    testOutQuestions: [
      {
        id: 'to6_1',
        question: 'Identify the kanji for "person":',
        options: ['大', '人', '入', '八'],
        correctIndex: 1,
        explanationEn: '人 (hito / jin) is person.',
        explanationTe: 'వ్యక్తిని సూచించే కాంజీ (人).'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s6_hi', itemType: 'kanji', front: '日', back: 'Sun / Day', reading: 'nichi, hi', meaningEn: 'Sun, Day', meaningTe: 'సూర్యుడు, రోజు' },
      { id: 'fsrs_s6_yama', itemType: 'kanji', front: '山', back: 'Mountain', reading: 'yama, san', meaningEn: 'Mountain', meaningTe: 'పర్వతం' },
      { id: 'fsrs_s6_hito', itemType: 'kanji', front: '人', back: 'Person', reading: 'hito, jin', meaningEn: 'Person', meaningTe: 'వ్యక్తి' }
    ]
  },

  // =========================================================================
  // STAGE 7: N5 Foundation Mastery
  // =========================================================================
  {
    stageNumber: 7,
    id: 'stage_7_n5_foundation',
    titleEn: 'JLPT N5 Foundation Mastery',
    titleJp: 'N5総合基礎',
    titleTe: 'JLPT N5 ప్రాథమిక సంపూర్ణత',
    descriptionEn: 'Synthesize all 7 stages: full Kana reading speed, 100 essential vocabulary, question mastery, and beginner autonomy.',
    descriptionTe: 'మొత్తం నైపుణ్యాలను సమీకృతం చేసి N5 పరీక్ష స్థాయికి చేరడం.',
    badge: 'N5 Ready',
    estimatedMinutes: 20,
    unlockRequirement: 'Complete Stage 6 or pass Test-Out',
    watchContent: {
      heading: 'The Milestone of Elementary Independence',
      bodyEn: 'Reaching this stage means you are no longer a complete beginner. You can decode all Japanese text, introduce yourself, ask directions, order food in restaurants, and comprehend basic manga and signs. You now have the momentum to conquer the official JLPT N5 examination!',
      bodyTe: 'ఈ దశతో మీరు ప్రాథమిక స్థాయిని పూర్తి చేసి స్వతంత్రంగా జపనీస్ చదవగలరు.',
      keyPoints: [
        'Reading Speed: Decode Hiragana & Katakana without hesitation.',
        'Core Expressions: Self-introduction, location questions (doko desu ka), prices (ikura desu ka).',
        'Next Horizon: JLPT N5 Arena mocks and real native media immersion.'
      ]
    },
    hearContent: {
      audioItems: [
        { text: 'はじめまして。よろしくお願いします。', romaji: 'Hajimemashite. Yoroshiku onegaishimasu.', meaningEn: 'Nice to meet you. Please treat me well.', meaningTe: 'పరిచయం కావడం సంతోషం.', notes: 'The essential Japanese self-introduction phrase.' },
        { text: '駅はどこですか？', romaji: 'Eki wa doko desu ka?', meaningEn: 'Where is the train station?', meaningTe: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది?', notes: 'High-frequency survival travel phrase.' }
      ]
    },
    traceContent: {
      character: '本',
      romaji: 'hon (book, origin)',
      strokes: [
        'M 25 40 L 75 40',
        'M 50 20 L 50 80',
        'M 50 40 L 25 70',
        'M 50 40 L 75 70',
        'M 35 65 L 65 65'
      ],
      guidanceEn: 'The kanji for book and foundation (Tree 木 with a root line at the base).',
      guidanceTe: 'పుస్తకం మరియు మూలం అని అర్థం వచ్చే కాంజీ.'
    },
    writeContent: {
      prompt: 'Write the question marker character placed at the end of questions:',
      expectedCharacter: 'か',
      hintEn: 'The polite question particle "ka".',
      hintTe: 'ప్రశ్నార్థక విభక్తి "కా".'
    },
    quizQuestions: [
      {
        id: 'q7_1',
        question: 'What is the natural reply to "Arigatou gozaimasu"?',
        options: ['Dou itashimashite', 'Hajimemashite', 'Sayounara', 'Kore wa nan desu ka'],
        correctIndex: 0,
        explanationEn: 'どういたしまして (Dou itashimashite) means "You are welcome".',
        explanationTe: 'ధన్యవాదాలకు బదులుగా "స్వాగతం" అని చెప్పడం.'
      },
      {
        id: 'q7_2',
        question: 'Which question asks "How much is this?"',
        options: ['Kore wa doko desu ka?', 'Kore wa ikura desu ka?', 'Kore wa dare desu ka?', 'Kore wa nan desu ka?'],
        correctIndex: 1,
        explanationEn: 'いくら (ikura) means "how much (price)".',
        explanationTe: 'దీని ధర ఎంత? (ఇకురా దెస్ కా).'
      }
    ],
    testOutQuestions: [
      {
        id: 'to7_1',
        question: 'Complete the sentence: "Sumimasen, toire wa _____ desu ka?" (Where is the restroom?):',
        options: ['doko', 'dare', 'nani', 'itsu'],
        correctIndex: 0,
        explanationEn: 'どこ (doko) means "where".',
        explanationTe: 'ఎక్కడ (దొకొ).'
      }
    ],
    fsrsItems: [
      { id: 'fsrs_s7_doko', itemType: 'grammar', front: 'どこ (doko)', back: 'Where?', reading: 'doko', meaningEn: 'Where', meaningTe: 'ఎక్కడ' },
      { id: 'fsrs_s7_ikura', itemType: 'vocab', front: 'いくら (ikura)', back: 'How much (price)?', reading: 'ikura', meaningEn: 'How much?', meaningTe: 'ధర ఎంత?' }
    ]
  }
];

export const getStageById = (id: string): PathStageDef | undefined => {
  return START_HERE_STAGES.find((s) => s.id === id);
};

export const getStageByNumber = (num: number): PathStageDef | undefined => {
  return START_HERE_STAGES.find((s) => s.stageNumber === num);
};
