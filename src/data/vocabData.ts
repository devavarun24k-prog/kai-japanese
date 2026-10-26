// src/data/vocabData.ts
// Comprehensive categorized N5/N4 vocabulary with English and natural Telugu translations
import { VocabItem } from '../types';

export const VOCAB_DATA: VocabItem[] = [
  // --- Greetings & Essentials ---
  {
    id: 'v_konnichiwa',
    word: 'こんにちは',
    reading: 'こんにちは',
    furigana: 'こんにちは',
    romaji: 'konnichiwa',
    part_of_speech: 'Greeting',
    english: 'Hello / Good afternoon',
    telugu: 'నమస్కారం / శుభ మధ్యాహ్నం',
    telugu_phonetic: 'కొన్నీచివా',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentences: [
      {
        japanese: '田中さん、こんにちは。',
        romaji: 'Tanaka-san, konnichiwa.',
        telugu_phonetic: 'తనకా-సాన్, కొన్నీచివా.',
        english: 'Hello, Mr. Tanaka.',
        telugu: 'నమస్కారం, తనకా గారు.',
        grammar_notes: 'さん (san) is a respectful title suffix; は in こんにちは is pronounced "wa".'
      }
    ],
    mnemonic_en: 'Imagine meeting someone at noon and saying "Cone-knee-chee-wah" with a respectful bow.',
    mnemonic_te: 'మధ్యాహ్న సమయాలలో అందరికీ ఇచ్చే గౌరవప్రదమైన జపనీస్ నమస్కారం.'
  },
  {
    id: 'v_arigatou',
    word: 'ありがとう',
    reading: 'ありがとう',
    kanji: '有難う',
    furigana: 'ありがとう',
    romaji: 'arigatou',
    part_of_speech: 'Expression',
    english: 'Thank you (casual)',
    telugu: 'ధన్యవాదాలు',
    telugu_phonetic: 'అరిగాతొ',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentences: [
      {
        japanese: '手伝ってくれて、ありがとう。',
        romaji: 'Tetsudatte kurete, arigatou.',
        telugu_phonetic: 'తెత్సుదత్తె కురెతె, అరిగాతొ.',
        english: 'Thank you for helping me.',
        telugu: 'నాకు సహాయం చేసినందుకు ధన్యవాదాలు.',
        grammar_notes: 'Add ございます (gozaimasu) for polite form: ありがとうございます (Arigatou gozaimasu).'
      }
    ],
    mnemonic_en: 'Alligator says thank you: "Arigato-r"!',
    mnemonic_te: 'గౌరవంగా ధన్యవాదాలు చెప్పడానికి ありがとうございます అంటారు.'
  },
  {
    id: 'v_ohayou',
    word: 'おはよう',
    reading: 'おはよう',
    kanji: 'お早う',
    furigana: 'おはよう',
    romaji: 'ohayou',
    part_of_speech: 'Greeting',
    english: 'Good morning',
    telugu: 'శుభోదయం',
    telugu_phonetic: 'ఒహాయొ',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentences: [
      {
        japanese: '先生、おはようございます。',
        romaji: 'Sensei, ohayou gozaimasu.',
        telugu_phonetic: 'సెన్సేయ్, ఒహాయొ గొజాయిమాసు.',
        english: 'Good morning, teacher.',
        telugu: 'శుభోదయం, గురువు గారు.',
        grammar_notes: 'Polite form is おはようございます (Ohayou gozaimasu).'
      }
    ],
    mnemonic_en: 'Greeting a friend in Ohio in the morning: "O-hayo!"',
    mnemonic_te: 'ఉదయాన్నే నిద్రలేవగానే చెప్పే శుభోదయం.'
  },
  {
    id: 'v_sayounara',
    word: 'さようなら',
    reading: 'さようなら',
    furigana: 'さようなら',
    romaji: 'sayounara',
    part_of_speech: 'Expression',
    english: 'Goodbye / Farewell',
    telugu: 'వీడ్కోలు / వెళ్లివస్తాను',
    telugu_phonetic: 'సయోనారా',
    jlpt_level: 'N5',
    category: 'greetings',
    example_sentences: [
      {
        japanese: 'みなさん、さようなら。',
        romaji: 'Minasan, sayounara.',
        telugu_phonetic: 'మినాసాన్, సయోనారా.',
        english: 'Goodbye, everyone.',
        telugu: 'అందరికీ సెలవు / వీడ్కోలు.',
        grammar_notes: 'Used when parting for a long time; friends often use じゃあね (Jaa ne).'
      }
    ],
    mnemonic_en: 'Sayonara: saying bye until another year.',
    mnemonic_te: 'చాలా కాలం తర్వాత కలుస్తాము అనుకున్నప్పుడు చెప్పే వీడ్కోలు.'
  },

  // --- Demonstratives & Essentials ---
  {
    id: 'v_kore',
    word: 'これ',
    reading: 'これ',
    furigana: 'これ',
    romaji: 'kore',
    part_of_speech: 'Pronoun',
    english: 'This (near the speaker)',
    telugu: 'ఇది (మాట్లాడే వ్యక్తికి దగ్గరగా ఉన్నది)',
    telugu_phonetic: 'కొరె',
    jlpt_level: 'N5',
    category: 'daily_life',
    example_sentences: [
      {
        japanese: 'これは本です。',
        romaji: 'Kore wa hon desu.',
        telugu_phonetic: 'కొరె వా హొన్ దెసు.',
        english: 'This is a book.',
        telugu: 'ఇది ఒక పుస్తకం.',
        grammar_notes: 'これ (kore) = this; は (wa) = topic particle; 本 (hon) = book; です (desu) = copula (is).'
      }
    ],
    mnemonic_en: 'KO-re is CLOSE to me (ko = near me).',
    mnemonic_te: 'నా చేతిలో లేదా నా దగ్గర ఉన్న వస్తువును "ఇది" అని చెప్పడానికి これ అంటారు.'
  },
  {
    id: 'v_sore',
    word: 'それ',
    reading: 'それ',
    furigana: 'それ',
    romaji: 'sore',
    part_of_speech: 'Pronoun',
    english: 'That (near the listener)',
    telugu: 'అది (వినే వ్యక్తికి దగ్గరగా ఉన్నది)',
    telugu_phonetic: 'సొరె',
    jlpt_level: 'N5',
    category: 'daily_life',
    example_sentences: [
      {
        japanese: 'それは何ですか？',
        romaji: 'Sore wa nan desu ka?',
        telugu_phonetic: 'సొరె వా నాన్ దెసు కా?',
        english: 'What is that (by you)?',
        telugu: 'అది ఏమిటి?',
        grammar_notes: '何 (nan) = what; か (ka) = question particle.'
      }
    ],
    mnemonic_en: 'SO-re is SOMEWHERE near you (so = near listener).',
    mnemonic_te: 'ఎదుటి వ్యక్తి దగ్గర ఉన్న వస్తువును "అది" అని అడగడానికి それ అంటారు.'
  },
  {
    id: 'v_are',
    word: 'あれ',
    reading: 'あれ',
    furigana: 'あれ',
    romaji: 'are',
    part_of_speech: 'Pronoun',
    english: 'That over there (far from both)',
    telugu: 'అదిగో అక్కడ ఉన్నది (ఇద్దరికీ దూరంగా ఉన్నది)',
    telugu_phonetic: 'అరె',
    jlpt_level: 'N5',
    category: 'daily_life',
    example_sentences: [
      {
        japanese: 'あれは私の車です。',
        romaji: 'Are wa watashi no kuruma desu.',
        telugu_phonetic: 'అరె వా వతాషి నొ కురుమా దెసు.',
        english: 'That over there is my car.',
        telugu: 'అదిగో అక్కడ ఉన్నది నా కారు.',
        grammar_notes: 'の (no) indicates possession (watashi no = my).'
      }
    ],
    mnemonic_en: 'A-re is AWAYS off, in the distance.',
    mnemonic_te: 'ఇద్దరికీ దూరంగా కనిపిస్తున్న వస్తువును あれ అంటారు.'
  },

  // --- Food & Dining ---
  {
    id: 'v_mizu',
    word: '水',
    reading: 'みず',
    kanji: '水',
    furigana: 'みず',
    romaji: 'mizu',
    part_of_speech: 'Noun',
    english: 'Water (cold / fresh)',
    telugu: 'నీరు / నీళ్లు',
    telugu_phonetic: 'మిజు',
    jlpt_level: 'N5',
    category: 'food',
    example_sentences: [
      {
        japanese: 'お水をください。',
        romaji: 'Omizu o kudasai.',
        telugu_phonetic: 'ఒమిజు ఒ కుదాసాయ్.',
        english: 'Water, please.',
        telugu: 'దయచేసి కొంచెం నీళ్లు ఇవ్వండి.',
        grammar_notes: 'お (o) is a polite prefix; を (o) is the direct object particle; ください (kudasai) means please give.'
      }
    ],
    mnemonic_en: 'Miss you (mizu) when I am thirsty in the desert!',
    mnemonic_te: 'దాహం వేసినప్పుడు తాగే మంచినీళ్లు.'
  },
  {
    id: 'v_gohan',
    word: 'ご飯',
    reading: 'ごはん',
    kanji: 'ご飯',
    furigana: 'ごはん',
    romaji: 'gohan',
    part_of_speech: 'Noun',
    english: 'Cooked rice / Meal',
    telugu: 'అన్నం / భోజనం',
    telugu_phonetic: 'గొహన్',
    jlpt_level: 'N5',
    category: 'food',
    example_sentences: [
      {
        japanese: '朝ご飯を食べます。',
        romaji: 'Asagohan o tabemasu.',
        telugu_phonetic: 'అసాగొహన్ ఒ తబెమాసు.',
        english: 'I eat breakfast.',
        telugu: 'నేను ఉదయం అల్పాహారం (టిఫిన్/అన్నం) తింటాను.',
        grammar_notes: '朝 (asa = morning) + ご飯 (gohan = meal) = breakfast.'
      }
    ],
    mnemonic_en: 'Go get the pan to cook delicious rice: Go-han!',
    mnemonic_te: 'జపాన్‌లో ఉడికించిన అన్నాన్ని లేదా మొత్తం భోజనాన్ని ごはん అంటారు.'
  },
  {
    id: 'v_ocha',
    word: 'お茶',
    reading: 'おちゃ',
    kanji: 'お茶',
    furigana: 'おちゃ',
    romaji: 'ocha',
    part_of_speech: 'Noun',
    english: 'Japanese green tea / Tea',
    telugu: 'గ్రీన్ టీ / టీ',
    telugu_phonetic: 'ఒచా',
    jlpt_level: 'N5',
    category: 'food',
    example_sentences: [
      {
        japanese: '温かいお茶を飲みます。',
        romaji: 'Atatakai ocha o nomimasu.',
        telugu_phonetic: 'అతాతకాయ్ ఒచా ఒ నొమిమాసు.',
        english: 'I drink warm green tea.',
        telugu: 'నేను వేడి టీ త్రాగుతాను.',
        grammar_notes: '飲みます (nomimasu) = drink (polite non-past).'
      }
    ],
    mnemonic_en: 'A cup of "cha" (tea) with polite prefix "O".',
    mnemonic_te: 'జపనీయులు ఎంతో ఇష్టంగా త్రాగే గ్రీన్ టీ.'
  },

  // --- Transport & Places ---
  {
    id: 'v_eki',
    word: '駅',
    reading: 'えき',
    kanji: '駅',
    furigana: 'えき',
    romaji: 'eki',
    part_of_speech: 'Noun',
    english: 'Train station',
    telugu: 'రైల్వే స్టేషన్',
    telugu_phonetic: 'ఎకి',
    jlpt_level: 'N5',
    category: 'transport',
    example_sentences: [
      {
        japanese: '東京駅はどこですか？',
        romaji: 'Toukyou eki wa doko desu ka?',
        telugu_phonetic: 'తోక్యో ఎకి వా దొకొ దెసు కా?',
        english: 'Where is Tokyo Station?',
        telugu: 'టోక్యో స్టేషన్ ఎక్కడ ఉంది?',
        grammar_notes: 'どこ (doko) = where; か (ka) = question particle.'
      }
    ],
    mnemonic_en: 'Exit the train at the Eki station.',
    mnemonic_te: 'రైళ్లు ఆగే స్టేషన్.'
  },
  {
    id: 'v_densha',
    word: '電車',
    reading: 'でんしゃ',
    kanji: '電車',
    furigana: 'でんしゃ',
    romaji: 'densha',
    part_of_speech: 'Noun',
    english: 'Electric train',
    telugu: 'రైలు / ఎలక్ట్రిక్ రైలు',
    telugu_phonetic: 'దెన్షా',
    jlpt_level: 'N5',
    category: 'transport',
    example_sentences: [
      {
        japanese: '電車で行きます。',
        romaji: 'Densha de ikimasu.',
        telugu_phonetic: 'దెన్షా దె ఇకిమాసు.',
        english: 'I go by train.',
        telugu: 'నేను రైలులో వెళ్తాను.',
        grammar_notes: 'で (de) particle indicates the means of transportation (by train).'
      }
    ],
    mnemonic_en: 'Electric (den) car on tracks (sha) = train.',
    mnemonic_te: 'విద్యుత్ రైలు.'
  },

  // --- Numbers & Time ---
  {
    id: 'v_ichi',
    word: '一',
    reading: 'いち',
    kanji: '一',
    furigana: 'いち',
    romaji: 'ichi',
    part_of_speech: 'Number',
    english: 'One (1)',
    telugu: 'ఒకటి (1)',
    telugu_phonetic: 'ఇచి',
    jlpt_level: 'N5',
    category: 'numbers',
    example_sentences: [
      {
        japanese: 'りんごを一つください。',
        romaji: 'Ringo o hitotsu kudasai.',
        telugu_phonetic: 'రింగొ ఒ హితోత్సు కుదాసాయ్.',
        english: 'Please give me one apple.',
        telugu: 'దయచేసి నాకు ఒక ఆపిల్ ఇవ్వండి.',
        grammar_notes: '一つ (hitotsu) is the native Japanese counter for one general object.'
      }
    ],
    mnemonic_en: 'Single horizontal stroke = number 1.',
    mnemonic_te: 'ఒకే ఒక అడ్డగీత సంఖ్య 1 ని సూచిస్తుంది.'
  },
  {
    id: 'v_ima',
    word: '今',
    reading: 'いま',
    kanji: '今',
    furigana: 'いま',
    romaji: 'ima',
    part_of_speech: 'Noun / Adverb',
    english: 'Now',
    telugu: 'ఇప్పుడు',
    telugu_phonetic: 'ఇమా',
    jlpt_level: 'N5',
    category: 'time_dates',
    example_sentences: [
      {
        japanese: '今、何時ですか？',
        romaji: 'Ima, nanji desu ka?',
        telugu_phonetic: 'ఇమా, నాంజి దెసు కా?',
        english: 'What time is it now?',
        telugu: 'ఇప్పుడు సమయం ఎంత అయ్యింది?',
        grammar_notes: '何時 (nanji) = what hour/time.'
      }
    ],
    mnemonic_en: 'I am here right now: "Ima" (now).',
    mnemonic_te: 'ప్రస్తుత సమయాన్ని "ఇప్పుడు" అనడానికి 今 (ఇమా) వాడతారు.'
  }
];
