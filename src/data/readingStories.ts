// src/data/readingStories.ts
// Interactive N5 Graded Reader Stories with Furigana, Clickable Vocabulary, and Telugu translations
import { ReadingStory } from '../types';

export const READING_STORIES: ReadingStory[] = [
  {
    id: 'story_first_morning',
    title_jp: '東京の新しい朝',
    title_en: 'A New Morning in Tokyo',
    title_te: 'టోక్యోలో సరికొత్త ఉదయం',
    jlpt_level: 'N5',
    cover_emoji: '🗼',
    synopsis_en: 'Follow Ken as he wakes up in Tokyo, gets breakfast, and walks to the train station.',
    synopsis_te: 'కెన్ అనే యువకుడు టోక్యోలో నిద్రలేచి, అల్పాహారం తిని, రైల్వే స్టేషన్‌కు నడిచే కథ.',
    paragraphs: [
      {
        japanese: '朝、七時に起きます。窓を開けると、天気がいいです。',
        romaji: 'Asa, shichiji ni okimasu. Mado o akeru to, tenki ga ii desu.',
        telugu_phonetic: 'అసా, షిచిజి ని ఒకిమాసు. మాదొ ఒ అకెరు తొ, తెంకి గా ఈ దెసు.',
        english: 'In the morning, I wake up at 7 o\'clock. When I open the window, the weather is nice.',
        telugu: 'ఉదయం 7 గంటలకు నిద్ర లేస్తాను. కిటికీ తెరవగానే వాతావరణం ఎంతో ఆహ్లాదకరంగా ఉంది.',
        vocabulary: [
          { word: '朝', reading: 'あさ', romaji: 'asa', meaning_en: 'Morning', meaning_te: 'ఉదయం' },
          { word: '起きます', reading: 'おきます', romaji: 'okimasu', meaning_en: 'To wake up', meaning_te: 'నిద్రలేవడం' },
          { word: '窓', reading: 'まど', romaji: 'mado', meaning_en: 'Window', meaning_te: 'కిటికీ' },
          { word: '天気', reading: 'てんき', romaji: 'tenki', meaning_en: 'Weather', meaning_te: 'వాతావరణం' }
        ]
      },
      {
        japanese: '台所で温かいお茶を飲みます。そして、ご飯と魚を食べます。とても美味しいです。',
        romaji: 'Daidokoro de atatakai ocha o nomimasu. Soshite, gohan to sakana o tabemasu. Totemo oishii desu.',
        telugu_phonetic: 'దైదొకొరొ దె అతాతకాయ్ ఒచా ఒ నొమిమాసు. సొషితె, గొహన్ తొ సకానా ఒ తబెమాసు. తొతెమొ ఓయిషీ దెసు.',
        english: 'I drink warm green tea in the kitchen. Then, I eat rice and fish. It is very delicious.',
        telugu: 'వంటగదిలో వేడి గ్రీన్ టీ త్రాగుతాను. ఆ తర్వాత అన్నం మరియు చేప తింటాను. చాలా రుచిగా ఉంది.',
        vocabulary: [
          { word: '台所', reading: 'だいどころ', romaji: 'daidokoro', meaning_en: 'Kitchen', meaning_te: 'వంటగది' },
          { word: 'お茶', reading: 'おちゃ', romaji: 'ocha', meaning_en: 'Green tea', meaning_te: 'గ్రీన్ టీ' },
          { word: '魚', reading: 'さかな', romaji: 'sakana', meaning_en: 'Fish', meaning_te: 'చేప' },
          { word: '美味しい', reading: 'おいしい', romaji: 'oishii', meaning_en: 'Delicious', meaning_te: 'రుచికరమైన' }
        ]
      },
      {
        japanese: '八時に家を出ます。駅まで歩きます。駅で電車に乗ります。',
        romaji: 'Hachiji ni ie o demasu. Eki made arukimasu. Eki de densha ni norimasu.',
        telugu_phonetic: 'హచిజి ని ఇయె ఒ దెమాసు. ఎకి మాదె అరుకిమాసు. ఎకి దె దెన్షా ని నొరిమాసు.',
        english: 'At 8 o\'clock, I leave the house. I walk to the station. At the station, I board the train.',
        telugu: 'ఎనిమిది గంటలకు ఇంటి నుండి బయలుదేరతాను. స్టేషన్ వరకు నడుస్తాను. స్టేషన్‌లో రైలు ఎక్కుతాను.',
        vocabulary: [
          { word: '家', reading: 'いえ', romaji: 'ie', meaning_en: 'House / Home', meaning_te: 'ఇల్లు' },
          { word: '駅', reading: 'えき', romaji: 'eki', meaning_en: 'Station', meaning_te: 'రైల్వే స్టేషన్' },
          { word: '電車', reading: 'でんしゃ', romaji: 'densha', meaning_en: 'Electric train', meaning_te: 'రైలు' },
          { word: '乗ります', reading: 'のります', romaji: 'norimasu', meaning_en: 'To ride / board', meaning_te: 'ఎక్కడం' }
        ]
      }
    ],
    questions: [
      {
        question_en: 'What time does the person wake up in the morning?',
        question_te: 'ఈ వ్యక్తి ఉదయం ఎన్ని గంటలకు నిద్ర లేస్తాడు?',
        options: ['6:00 (六時)', '7:00 (七時)', '8:00 (八時)', '9:00 (九時)'],
        correct_index: 1,
        explanation_en: 'The story states "朝、七時に起きます" (I wake up at 7 o\'clock).',
        explanation_te: 'కథలో "七時 (7 గంటలకు)" అని స్పష్టంగా చెప్పబడింది.'
      },
      {
        question_en: 'What does the person drink in the kitchen?',
        question_te: 'వంటగదిలో అతను ఏమి త్రాగాడు?',
        options: ['Coffee (コーヒー)', 'Warm Green Tea (温かいお茶)', 'Water (水)', 'Juice (ジュース)'],
        correct_index: 1,
        explanation_en: '"温かいお茶を飲みます" means "I drink warm green tea".',
        explanation_te: '"温かいお茶" అంటే వేడి గ్రీన్ టీ.'
      }
    ]
  },
  {
    id: 'story_bookstore_friend',
    title_jp: '本屋と友達',
    title_en: 'The Bookstore and a Friend',
    title_te: 'పుస్తకాల దుకాణం మరియు స్నేహితుడు',
    jlpt_level: 'N5',
    cover_emoji: '📚',
    synopsis_en: 'Visiting a bookstore in Shibuya and meeting an old classmate.',
    synopsis_te: 'షిబుయాలోని పుస్తకాల దుకాణాన్ని సందర్శించి పాత స్నేహితుడిని కలవడం.',
    paragraphs: [
      {
        japanese: '土曜日に渋谷の本屋へ行きました。たくさんの本があります。',
        romaji: 'Doyoubi ni Shibuya no honya e ikimashita. Takusan no hon ga arimasu.',
        telugu_phonetic: 'దొయోబి ని షిబుయా నొ హొన్యా ఎ ఇకిమాషితా. తకుసాన్ నొ హొన్ గా అరిమాసు.',
        english: 'On Saturday, I went to a bookstore in Shibuya. There were many books.',
        telugu: 'శనివారం రోజున నేను షిబుయాలోని పుస్తకాల దుకాణానికి వెళ్లాను. అక్కడ చాలా పుస్తకాలు ఉన్నాయి.',
        vocabulary: [
          { word: '土曜日', reading: 'どようび', romaji: 'doyoubi', meaning_en: 'Saturday', meaning_te: 'శనివారం' },
          { word: '本屋', reading: 'ほんや', romaji: 'honya', meaning_en: 'Bookstore', meaning_te: 'పుస్తకాల దుకాణం' },
          { word: 'たくさん', reading: 'たくさん', romaji: 'takusan', meaning_en: 'Many / A lot', meaning_te: 'చాలా / ఎక్కువ' }
        ]
      },
      {
        japanese: 'そこで友達の田中さんに会いました。「こんにちは！」と挨拶しました。',
        romaji: 'Sokode tomodachi no Tanaka-san ni aimashita. "Konnichiwa!" to aisatsu shimashita.',
        telugu_phonetic: 'సొకొదె తొమొదాచి నొ తనకా-సాన్ ని ఐమాషితా. "కొన్నీచివా!" తొ ఐసత్సు షిమాషితా.',
        english: 'There, I met my friend Mr. Tanaka. I greeted him saying "Hello!"',
        telugu: 'అక్కడ నా స్నేహితుడు తనకా గారిని కలిశాను. "నమస్కారం!" అని పలకరించాను.',
        vocabulary: [
          { word: '友達', reading: 'ともだち', romaji: 'tomodachi', meaning_en: 'Friend', meaning_te: 'స్నేహితుడు' },
          { word: '会いました', reading: 'あいました', romaji: 'aimashita', meaning_en: 'Met (past)', meaning_te: 'కలిశాను' },
          { word: '挨拶', reading: 'あいさつ', romaji: 'aisatsu', meaning_en: 'Greeting', meaning_te: 'పలకరింపు' }
        ]
      }
    ],
    questions: [
      {
        question_en: 'On which day of the week did the narrator visit the bookstore?',
        question_te: 'ఏ రోజున కథకుడు పుస్తకాల దుకాణానికి వెళ్లాడు?',
        options: ['Sunday (日曜日)', 'Monday (月曜日)', 'Saturday (土曜日)', 'Friday (金曜日)'],
        correct_index: 2,
        explanation_en: '"土曜日に" means "on Saturday".',
        explanation_te: 'కథ మొదటి వాక్యంలో "土曜日 (శనివారం)" అని ఉంది.'
      }
    ]
  }
];
