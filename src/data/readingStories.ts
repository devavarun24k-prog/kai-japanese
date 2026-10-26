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
        english: 'There I met my friend Tanaka-san. "Hello!" I greeted him.',
        telugu: 'అక్కడ నా స్నేహితుడు తనకా-సాన్‌ను కలిశాను. "నమస్కారం!" అని పలకరించాను.',
        vocabulary: [
          { word: '友達', reading: 'ともだち', romaji: 'tomodachi', meaning_en: 'Friend', meaning_te: 'స్నేహితుడు' },
          { word: '会いました', reading: 'あいました', romaji: 'aimashita', meaning_en: 'Met (past tense of au)', meaning_te: 'కలిశాను' },
          { word: '挨拶', reading: 'あいさつ', romaji: 'aisatsu', meaning_en: 'Greeting', meaning_te: 'పలకరింపు' }
        ]
      },
      {
        japanese: '私たちは一緒に喫茶店でお茶を飲みました。とても楽しかったです。',
        romaji: 'Watashitachi wa issho ni kissaten de ocha o nomimashita. Totemo tanoshikatta desu.',
        telugu_phonetic: 'వాతాషితాచి వా ఇస్షొ ని కిస్సాతెన్ దె ఒచా ఒ నొమిమాషితా. తొతెమొ తనొషికత్తా దెసు.',
        english: 'We drank tea together at a cafe. It was very enjoyable.',
        telugu: 'మేమిద్దరం కలిసి ఒక కేఫ్‌లో టీ త్రాగాము. చాలా సంతోషంగా అనిపించింది.',
        vocabulary: [
          { word: '一緒', reading: 'いっしょ', romaji: 'issho', meaning_en: 'Together', meaning_te: 'కలిసి' },
          { word: '喫茶店', reading: 'きっさてん', romaji: 'kissaten', meaning_en: 'Coffee shop / Cafe', meaning_te: 'కేఫ్' },
          { word: '楽しかった', reading: 'たのしかった', romaji: 'tanoshikatta', meaning_en: 'Was enjoyable / fun', meaning_te: 'ఆనందంగా గడిచింది' }
        ]
      }
    ],
    questions: [
      {
        question_en: 'Where did the speaker meet Tanaka-san?',
        question_te: 'తనకా-సాన్‌ను ఎక్కడ కలిశారు?',
        options: ['At a train station (駅)', 'At a bookstore in Shibuya (渋谷の本屋)', 'At the library (図書館)', 'At a park (公園)'],
        correct_index: 1,
        explanation_en: 'The text states: "渋谷の本屋へ行きました... そこで友達の田中さんに会いました".',
        explanation_te: 'షిబుయాలోని పుస్తకాల దుకాణంలో కలిసినట్లు స్పష్టంగా ఉంది.'
      },
      {
        question_en: 'Where did they drink tea together?',
        question_te: 'వాళ్ళు కలిసి ఎక్కడ టీ త్రాగారు?',
        options: ['At home (家)', 'At school (学校)', 'At a cafe (喫茶店)', 'In the train (電車)'],
        correct_index: 2,
        explanation_en: '"喫茶店でお茶を飲みました" means "We drank tea at a cafe".',
        explanation_te: 'కేఫ్ (喫茶店) లో టీ త్రాగారు.'
      }
    ]
  },
  {
    id: 'story_cat_cafe',
    title_jp: '猫カフェの午後',
    title_en: 'Afternoon at the Cat Cafe',
    title_te: 'క్యాట్ కేఫ్‌లో ఒక మధ్యాహ్నం',
    jlpt_level: 'N5',
    cover_emoji: '🐱',
    synopsis_en: 'Spending a peaceful Sunday afternoon watching playful cats in Asakusa.',
    synopsis_te: 'అసకుసాలోని క్యాట్ కేఫ్‌లో పిల్లులతో ఆడుకుంటూ గడిపిన ఆహ్లాదకరమైన ఆదివారం కథ.',
    paragraphs: [
      {
        japanese: '日曜日の午後に、浅草の猫カフェへ行きました。',
        romaji: 'Nichiyoubi no gogo ni, Asakusa no neko kafe e ikimashita.',
        telugu_phonetic: 'నిచియోబి నొ గొగొ ని, అసకుసా నొ నెకొ కాఫె ఎ ఇకిమాషితా.',
        english: 'On Sunday afternoon, I went to a cat cafe in Asakusa.',
        telugu: 'ఆదివారం మధ్యాహ్నం నేను అసకుసాలోని క్యాట్ కేఫ్‌కు వెళ్లాను.',
        vocabulary: [
          { word: '日曜日', reading: 'にちようび', romaji: 'nichiyoubi', meaning_en: 'Sunday', meaning_te: 'ఆదివారం' },
          { word: '午後', reading: 'ごご', romaji: 'gogo', meaning_en: 'Afternoon (PM)', meaning_te: 'మధ్యాహ్నం' },
          { word: '猫', reading: 'ねこ', romaji: 'neko', meaning_en: 'Cat', meaning_te: 'పిల్లి' }
        ]
      },
      {
        japanese: '部屋の中に白い猫と黒い猫がいます。白い猫はとても静かです。',
        romaji: 'Heya no naka ni shiroi neko to kuroi neko ga imasu. Shiroi neko wa totemo shizuka desu.',
        telugu_phonetic: 'హెయా నొ నక ని శిరోయ్ నెకొ తొ కురోయ్ నెకొ గా ఇమాసు. శిరోయ్ నెకొ వా తొతెమొ షిజుకా దెసు.',
        english: 'Inside the room, there are white cats and black cats. The white cat is very quiet.',
        telugu: 'గదిలో తెల్లటి పిల్లులు మరియు నల్లటి పిల్లులు ఉన్నాయి. తెల్ల పిల్లి చాలా ప్రశాంతంగా ఉంది.',
        vocabulary: [
          { word: '部屋', reading: 'へや', romaji: 'heya', meaning_en: 'Room', meaning_te: 'గది' },
          { word: '中', reading: 'なか', romaji: 'naka', meaning_en: 'Inside', meaning_te: 'లోపల' },
          { word: '白い', reading: 'しろい', romaji: 'shiroi', meaning_en: 'White', meaning_te: 'తెలుపు' },
          { word: '黒い', reading: 'くろい', romaji: 'kuroi', meaning_en: 'Black', meaning_te: 'నలుపు' }
        ]
      },
      {
        japanese: '私は温かいミルクを飲みました。猫と遊んで、幸せでした。',
        romaji: 'Watashi wa atatakai miruku o nomimashita. Neko to asonde, shiawase deshita.',
        telugu_phonetic: 'వాతాషి వా అతాతకాయ్ మిరుకు ఒ నొమిమాషితా. నెకొ తొ అసొందె, షియావాసె దెషితా.',
        english: 'I drank warm milk. Playing with the cats, I was very happy.',
        telugu: 'నేను వేడి పాలు త్రాగాను. పిల్లులతో ఆడుకుని ఎంతో సంతోషపడ్డాను.',
        vocabulary: [
          { word: 'ミルク', reading: 'みるく', romaji: 'miruku', meaning_en: 'Milk', meaning_te: 'పాలు' },
          { word: '遊んで', reading: 'あそんで', romaji: 'asonde', meaning_en: 'Playing (te-form of asobu)', meaning_te: 'ఆడుకుని' },
          { word: '幸せ', reading: 'しあわせ', romaji: 'shiawase', meaning_en: 'Happy', meaning_te: 'సంతోషం' }
        ]
      }
    ],
    questions: [
      {
        question_en: 'What kind of cats were in the room?',
        question_te: 'గదిలో ఎలాంటి పిల్లులు ఉన్నాయి?',
        options: ['White and black cats (白い猫と黒い猫)', 'Only brown cats', 'Dogs and cats', 'Big and small cats'],
        correct_index: 0,
        explanation_en: 'The text mentions: "白い猫と黒い猫がいます" (there are white cats and black cats).',
        explanation_te: 'తెలుపు మరియు నలుపు పిల్లులు ఉన్నాయని కథలో ఉంది.'
      },
      {
        question_en: 'What did the person drink at the cat cafe?',
        question_te: 'ఆ వ్యక్తి క్యాట్ కేఫ్‌లో ఏమి త్రాగాడు?',
        options: ['Cold water (冷たい水)', 'Warm milk (温かいミルク)', 'Black coffee (ブラックコーヒー)', 'Orange juice (オレンジジュース)'],
        correct_index: 1,
        explanation_en: '"温かいミルクを飲みました" translates to "I drank warm milk".',
        explanation_te: 'వేడి పాలు (温かいミルク) త్రాగారు.'
      }
    ]
  },
  {
    id: 'story_conbini_night',
    title_jp: '夜のコンビニ',
    title_en: 'Late Night at the Convenience Store',
    title_te: 'రాత్రి వేళ కన్వీనియన్స్ స్టోర్',
    jlpt_level: 'N5',
    cover_emoji: '🏪',
    synopsis_en: 'Stopping by a bright Tokyo convenience store at night to pick up dinner.',
    synopsis_te: 'రాత్రిపూట టోక్యోలోని కన్వీనియన్స్ స్టోర్‌కు వెళ్లి ఆహారం కొనుగోలు చేసిన అనుభవం.',
    paragraphs: [
      {
        japanese: '夜の十時に、駅の前のコンビニへ行きました。店の中はとても明るいです。',
        romaji: 'Yoru no juuji ni, eki no mae no konbini e ikimashita. Mise no naka wa totemo akarui desu.',
        telugu_phonetic: 'యొరు నొ జూజి ని, ఎకి నొ మాయె నొ కొంబిని ఎ ఇకిమాషితా. మిసె నొ నక వా తొతెమొ అకరుయ్ దెసు.',
        english: 'At 10:00 at night, I went to the convenience store in front of the station. Inside the shop was very bright.',
        telugu: 'రాత్రి 10 గంటలకు స్టేషన్ ముందున్న కన్వీనియన్స్ స్టోర్‌కు వెళ్లాను. దుకాణం లోపల వెలుతురుతో చాలా ప్రకాశవంతంగా ఉంది.',
        vocabulary: [
          { word: '夜', reading: 'よる', romaji: 'yoru', meaning_en: 'Night', meaning_te: 'రాత్రి' },
          { word: '前', reading: 'まえ', romaji: 'mae', meaning_en: 'In front of', meaning_te: 'ముందు' },
          { word: '店', reading: 'みせ', romaji: 'mise', meaning_en: 'Shop / Store', meaning_te: 'దుకాణం' },
          { word: '明るい', reading: 'あかるい', romaji: 'akarui', meaning_en: 'Bright', meaning_te: 'వెలుతురుగల / ప్రకాశవంతమైన' }
        ]
      },
      {
        japanese: '鮭のおにぎりと温かいお茶を買いました。「袋はいりません」と言いました。',
        romaji: 'Shake no onigiri to atatakai ocha o kaimashita. "Fukuro wa irimasen" to iimashita.',
        telugu_phonetic: 'షకె నొ ఒనిగిరి తొ అతాతకాయ్ ఒచా ఒ కైమాషితా. "ఫుకురొ వా ఇరిమసెన్" తొ ఈమాషితా.',
        english: 'I bought a salmon onigiri and warm green tea. I said, "I do not need a plastic bag."',
        telugu: 'నేను సాల్మన్ రైస్ బాల్ (ఒనిగిరి) మరియు వేడి గ్రీన్ టీ కొన్నాను. "నాకు ప్లాస్టిక్ సంచి అవసరం లేదు" అని చెప్పాను.',
        vocabulary: [
          { word: '買いました', reading: 'かいまし', romaji: 'kaimashita', meaning_en: 'Bought (past tense of kau)', meaning_te: 'కొన్నాను' },
          { word: '袋', reading: 'ふくろ', romaji: 'fukuro', meaning_en: 'Bag', meaning_te: 'సంచి' },
          { word: '言いました', reading: 'いいました', romaji: 'iimashita', meaning_en: 'Said (past tense of iu)', meaning_te: 'చెప్పాను' }
        ]
      },
      {
        japanese: '店員さんは笑顔で「ありがとうございました」と言いました。家に帰って食べました。',
        romaji: 'Ten\'in-san wa egao de "Arigatou gozaimashita" to iimashita. Ie ni kaette tabemashita.',
        telugu_phonetic: 'తెన్ ఇన్-సాన్ వా ఎగావొ దె "అరిగాతౌ గొజాయ్మాషితా" తొ ఈమాషితా. ఇయె ని కాయెత్తె తబెమాషితా.',
        english: 'The clerk smiled and said, "Thank you very much." I returned home and ate.',
        telugu: 'షాపు గుమాస్తా చిరునవ్వుతో "ధన్యవాదాలు" అని చెప్పారు. ఇంటికి తిరిగి వచ్చి తిన్నాను.',
        vocabulary: [
          { word: '店員', reading: 'てんいん', romaji: 'ten\'in', meaning_en: 'Store clerk', meaning_te: 'షాపు గుమాస్తా' },
          { word: '笑顔', reading: 'えがお', romaji: 'egao', meaning_en: 'Smiling face', meaning_te: 'చిరునవ్వు' },
          { word: '帰って', reading: 'かえって', romaji: 'kaette', meaning_en: 'Returning (te-form of kaeru)', meaning_te: 'తిరిగి వెళ్లి' }
        ]
      }
    ],
    questions: [
      {
        question_en: 'What food item did the person purchase at the convenience store?',
        question_te: 'కన్వీనియన్స్ స్టోర్‌లో ఏ ఆహార పదార్థాన్ని కొన్నారు?',
        options: ['Salmon Onigiri (鮭のおにぎり)', 'Ramen (ラーメン)', 'Sandwich (サンドイッチ)', 'Apple (りんご)'],
        correct_index: 0,
        explanation_en: 'The text states: "鮭のおにぎりと温かいお茶を買いました" (I bought a salmon onigiri and warm tea).',
        explanation_te: 'సాల్మన్ ఒనిగిరి (鮭のおにぎり) కొన్నట్లు ఉంది.'
      },
      {
        question_en: 'What did the customer say regarding the plastic bag?',
        question_te: 'ప్లాస్టిక్ సంచి గురించి కస్టమర్ ఏమి చెప్పారు?',
        options: ['"Please give me two bags"', '"I do not need a bag" (袋はいりません)', '"How much is the bag?"', '"Give me a big bag"'],
        correct_index: 1,
        explanation_en: '"袋はいりません" means "I do not need a bag".',
        explanation_te: '"袋はいりません" అంటే నాకు సంచి అవసరం లేదు అని అర్థం.'
      }
    ]
  }
];
