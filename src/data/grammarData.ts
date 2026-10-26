// src/data/grammarData.ts
// Structured N5/N4 Grammar curriculum with trilingual breakdowns and common pitfalls
import { GrammarPattern } from '../types';

export const GRAMMAR_DATA: GrammarPattern[] = [
  // 1. Topic Particle は & Copula です (A は B です)
  {
    id: 'g_wa_desu',
    title: 'A は B です (A is B)',
    title_jp: 'A は B です',
    structure: '[Noun A] は [Noun B] です',
    jlpt_level: 'N5',
    category: 'sentence_structure',
    meaning_en: 'A is B (polite statement of identity, state, or nationality)',
    meaning_te: 'A అనేది B అవుతుంది (మర్యాదపూర్వక వాక్యం)',
    explanation_en:
      'The foundational Japanese sentence pattern. は (written as "ha", pronounced "wa") marks the topic ("As for A..."). です (desu) functions like "is/am/are" in polite Japanese, giving the sentence a respectful tone.',
    explanation_te:
      'జపనీస్ భాషలో అత్యంత ముఖ్యమైన మొదటి వాక్య నిర్మాణం. は (రాతలో "హా", పలకడంలో "వా") సబ్జెక్ట్ లేదా టాపిక్‌ను సూచిస్తుంది. です (దెసు) వాక్యాన్ని గౌరవంగా ముగించే "అవును/ఉన్నాను" లాంటి పదం.',
    formation_rules: [
      { rule: 'Noun + は + Noun + です', example: 'わたし は がくせい です (I am a student)' },
      { rule: 'Negative: Noun + は + Noun + ではありません / じゃありません', example: 'わたし は せんせい ではありません (I am not a teacher)' },
      { rule: 'Past: Noun + は + Noun + でした', example: 'きのう は あめ でした (Yesterday was rainy)' }
    ],
    examples: [
      {
        japanese: 'これは本です。',
        romaji: 'Kore wa hon desu.',
        telugu_phonetic: 'కొరె వా హొన్ దెసు.',
        english: 'This is a book.',
        telugu: 'ఇది ఒక పుస్తకం.',
        breakdown: [
          { part: 'これ', role: 'Pronoun', meaning_en: 'This', meaning_te: 'ఇది' },
          { part: 'は', role: 'Topic Particle (pronounced wa)', meaning_en: 'As for', meaning_te: 'గురించి' },
          { part: '本', role: 'Noun', meaning_en: 'Book', meaning_te: 'పుస్తకం' },
          { part: 'です', role: 'Polite Copula', meaning_en: 'is', meaning_te: 'అవును' }
        ]
      },
      {
        japanese: '私は学生です。',
        romaji: 'Watashi wa gakusei desu.',
        telugu_phonetic: 'వతాషి వా గాకుసేయ్ దెసు.',
        english: 'I am a student.',
        telugu: 'నేను ఒక విద్యార్థిని.',
        breakdown: [
          { part: '私', role: 'Pronoun', meaning_en: 'I', meaning_te: 'నేను' },
          { part: 'は', role: 'Topic Particle', meaning_en: 'As for', meaning_te: 'గురించి' },
          { part: '学生', role: 'Noun', meaning_en: 'Student', meaning_te: 'విద్యార్థి' },
          { part: 'です', role: 'Copula', meaning_en: 'am', meaning_te: 'అవును' }
        ]
      }
    ],
    common_mistakes: [
      {
        incorrect: 'わたし わ がくせい です (Writing わ instead of は)',
        correct: 'わたし は がくせい です',
        explanation_en: 'Even though pronounced "wa", the grammatical topic particle must always be written with the hiragana character は (ha).',
        explanation_te: 'పలికేటప్పుడు "వా" అని పలికినప్పటికీ, అక్షరం రాసేటప్పుడు ఖచ్చితంగా は (హా) అనే రాయాలి.'
      }
    ]
  },

  // 2. Question Particle か (Ka)
  {
    id: 'g_ka_question',
    title: 'Sentence + か (Question Particle)',
    title_jp: '文 + か',
    structure: '[Sentence] + か',
    jlpt_level: 'N5',
    category: 'questions',
    meaning_en: 'Turns any statement into a polite question (verbal question mark)',
    meaning_te: 'వాక్యం చివర చేర్చి ప్రశ్నగా మార్చే అక్షరం (ప్రశ్నార్థకం)',
    explanation_en:
      'In Japanese, questions are formed simply by adding the particle か (ka) to the end of a sentence. No change in word order is required, and formal Japanese rarely needs a question mark (?) because か already signifies the question.',
    explanation_te:
      'జపనీస్‌లో ప్రశ్న అడగడం చాలా సులభం! వాక్యం చివర "か" చేరిస్తే అది ప్రశ్నగా మారుతుంది. వాక్య క్రమాన్ని మార్చాల్సిన అవసరం లేదు.',
    formation_rules: [
      { rule: '[Polite Sentence] + か', example: 'これ は なん です か？ (What is this?)' },
      { rule: 'Answering Yes: はい、[Sentence] です', example: 'はい、そうです (Yes, that is right)' },
      { rule: 'Answering No: いいえ、[Negative]', example: 'いいえ、ちがいます (No, that is different)' }
    ],
    examples: [
      {
        japanese: '田中さんは先生ですか？',
        romaji: 'Tanaka-san wa sensei desu ka?',
        telugu_phonetic: 'తనకా-సాన్ వా సెన్సేయ్ దెసు కా?',
        english: 'Is Mr. Tanaka a teacher?',
        telugu: 'తనకా గారు ఉపాధ్యాయులా?',
        breakdown: [
          { part: '田中さん', role: 'Proper Noun + Honorific', meaning_en: 'Mr. Tanaka', meaning_te: 'తనకా గారు' },
          { part: 'は', role: 'Topic Marker', meaning_en: 'As for', meaning_te: 'గురించి' },
          { part: '先生', role: 'Noun', meaning_en: 'Teacher', meaning_te: 'ఉపాధ్యాయుడు' },
          { part: 'ですか', role: 'Copula + Question Particle', meaning_en: 'is he?', meaning_te: 'అవునా?' }
        ]
      }
    ],
    common_mistakes: [
      {
        incorrect: '田中さんは先生ですか？ (With angry falling intonation)',
        correct: 'Rise intonation slightly on か',
        explanation_en: 'Maintain a gentle, slight upward intonation on か to sound natural and polite.',
        explanation_te: 'ప్రశ్న అడిగేటప్పుడు "కా" వద్ద స్వరం కొద్దిగా పైకి లేపాలి.'
      }
    ]
  },

  // 3. Object Particle を (o)
  {
    id: 'g_wo_object',
    title: 'Noun + を + Verb (Direct Object Particle)',
    title_jp: '名詞 + を + 動詞',
    structure: '[Noun] を [Transitive Verb]',
    jlpt_level: 'N5',
    category: 'particles',
    meaning_en: 'Marks the direct object receiving the action of the verb',
    meaning_te: 'పని చేయబడుతున్న వస్తువును (కర్మ / Direct Object) సూచిస్తుంది',
    explanation_en:
      'The particle を (written as "wo", pronounced "o") connects a transitive action verb with its target. In Japanese word order (SOV), the object comes before the verb.',
    explanation_te:
      'మనం ఏ వస్తువుపై పని చేస్తున్నామో చెప్పడానికి を వాడతారు. తెలుగులో "అన్నం తింటున్నాను" అన్నప్పుడు అన్నం తర్వాత వచ్చే సంబంధం లాంటిది.',
    formation_rules: [
      { rule: 'Noun + を + 食べます (tabemasu - eat)', example: 'ごはん を たべます (Eat a meal)' },
      { rule: 'Noun + を + 飲みます (nomimasu - drink)', example: 'おちゃ を のみます (Drink green tea)' },
      { rule: 'Noun + を + 見ます (mimasu - see/watch)', example: 'テレビ を みます (Watch TV)' }
    ],
    examples: [
      {
        japanese: '水を飲みます。',
        romaji: 'Mizu o nomimasu.',
        telugu_phonetic: 'మిజు ఒ నొమిమాసు.',
        english: 'I drink water.',
        telugu: 'నేను నీళ్లు త్రాగుతాను.',
        breakdown: [
          { part: '水', role: 'Direct Object Noun', meaning_en: 'Water', meaning_te: 'నీరు' },
          { part: 'を', role: 'Object Marker (pronounced o)', meaning_en: '[object marker]', meaning_te: '[కర్మ కారకం]' },
          { part: '飲みます', role: 'Polite Verb', meaning_en: 'drink', meaning_te: 'త్రాగుతాను' }
        ]
      }
    ],
    common_mistakes: [
      {
        incorrect: '水 お 飲みます (Writing お instead of を)',
        correct: '水 を 飲みます',
        explanation_en: 'The direct object particle is always written with the hiragana character を (wo), never お (o).',
        explanation_te: 'ఆబ్జెక్ట్ మార్కర్‌గా ఎల్లప్పుడూ を మాత్రమే రాయాలి, お కాదు.'
      }
    ]
  },

  // 4. Location of Action で (de) vs Destination に (ni)
  {
    id: 'g_de_location',
    title: 'Place + で + Action Verb (Location of Action)',
    title_jp: '場所 + で + 動詞',
    structure: '[Place] で [Action Verb]',
    jlpt_level: 'N5',
    category: 'particles',
    meaning_en: 'Indicates the place where an event or activity occurs ("at" / "in")',
    meaning_te: 'ఒక పని జరిగే స్థలాన్ని సూచిస్తుంది ("వద్ద / లో")',
    explanation_en:
      'で (de) marks the physical setting of an activity. Do not confuse with destination particle に (ni) which is used with verbs of movement (ikimasu, kimasu) or static existence (arimasu, imasu).',
    explanation_te:
      'లైబ్రరీలో చదువుతున్నాను, రెస్టారెంట్‌లో తింటున్నాను లాగా ఏదైనా పని జరిగే ప్రదేశాన్ని చెప్పడానికి "で" వాడతారు.',
    formation_rules: [
      { rule: '[Location] + で + [Action]', example: 'としょかん で べんきょう します (Study at the library)' },
      { rule: '[Means/Vehicle] + で + [Movement]', example: 'バス で いきます (Go by bus)' }
    ],
    examples: [
      {
        japanese: '図書館で本を読みます。',
        romaji: 'Toshokan de hon o yomimasu.',
        telugu_phonetic: 'తొశొకాన్ దె హొన్ ఒ యొమిమాసు.',
        english: 'I read books at the library.',
        telugu: 'నేను గ్రంథాలయం (లైబ్రరీ) లో పుస్తకాలు చదువుతాను.',
        breakdown: [
          { part: '図書館', role: 'Location Noun', meaning_en: 'Library', meaning_te: 'గ్రంథాలయం' },
          { part: 'で', role: 'Location Particle', meaning_en: 'at / in', meaning_te: 'లో' },
          { part: '本', role: 'Object Noun', meaning_en: 'Book', meaning_te: 'పుస్తకం' },
          { part: 'を', role: 'Object Particle', meaning_en: '[object]', meaning_te: 'ని' },
          { part: '読みます', role: 'Action Verb', meaning_en: 'read', meaning_te: 'చదువుతాను' }
        ]
      }
    ],
    common_mistakes: [
      {
        incorrect: '図書館 に 本を読みます',
        correct: '図書館 で 本を読みます',
        explanation_en: 'Reading is an active event, so you must use で, not に.',
        explanation_te: 'చదవడం అనేది ఒక పని కాబట్టి に బదులుగా で వాడాలి.'
      }
    ]
  }
];
