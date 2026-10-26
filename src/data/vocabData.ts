// src/data/vocabData.ts
// Comprehensive categorized N5 vocabulary with English and natural Telugu translations
import { VocabItem } from '../types';

export const VOCAB_DATA: VocabItem[] = [
  {
    "id": "v_konnichiwa",
    "word": "こんにちは",
    "reading": "こんにちは",
    "furigana": "こんにちは",
    "romaji": "konnichiwa",
    "part_of_speech": "Greeting",
    "english": "Hello / Good afternoon",
    "telugu": "నమస్కారం / శుభ మధ్యాహ్నం",
    "telugu_phonetic": "కొన్నీచివా",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "田中さん、こんにちは。",
        "romaji": "Tanaka-san, konnichiwa.",
        "telugu_phonetic": "తనకా-సాన్, కొన్నీచివా.",
        "english": "Hello, Mr. Tanaka.",
        "telugu": "నమస్కారం, తనకా గారు.",
        "grammar_notes": "さん (san) is a respectful title suffix; は in こんにちは is pronounced \"wa\"."
      }
    ],
    "mnemonic_en": "Imagine meeting someone at noon and saying \"Cone-knee-chee-wah\" with a respectful bow.",
    "mnemonic_te": "మధ్యాహ్న సమయాలలో అందరికీ ఇచ్చే గౌరవప్రదమైన జపనీస్ నమస్కారం."
  },
  {
    "id": "v_arigatou",
    "word": "ありがとう",
    "reading": "ありがとう",
    "kanji": "有難う",
    "furigana": "ありがとう",
    "romaji": "arigatou",
    "part_of_speech": "Expression",
    "english": "Thank you (casual)",
    "telugu": "ధన్యవాదాలు",
    "telugu_phonetic": "అరిగాతొ",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "手伝ってくれて、ありがとう。",
        "romaji": "Tetsudatte kurete, arigatou.",
        "telugu_phonetic": "తెత్సుదత్తె కురెతె, అరిగాతొ.",
        "english": "Thank you for helping me.",
        "telugu": "నాకు సహాయం చేసినందుకు ధన్యవాదాలు.",
        "grammar_notes": "Add ございます (gozaimasu) for polite form: ありがとうございます (Arigatou gozaimasu)."
      }
    ],
    "mnemonic_en": "Alligator says thank you: \"Arigato-r\"!",
    "mnemonic_te": "గౌరవంగా ధన్యవాదాలు చెప్పడానికి ありがとうございます అంటారు."
  },
  {
    "id": "v_ohayou",
    "word": "おはよう",
    "reading": "おはよう",
    "kanji": "お早う",
    "furigana": "おはよう",
    "romaji": "ohayou",
    "part_of_speech": "Greeting",
    "english": "Good morning",
    "telugu": "శుభోదయం",
    "telugu_phonetic": "ఒహాయొ",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "先生、おはようございます。",
        "romaji": "Sensei, ohayou gozaimasu.",
        "telugu_phonetic": "సెన్సేయ్, ఒహాయొ గొజాయిమాసు.",
        "english": "Good morning, teacher.",
        "telugu": "శుభోదయం, గురువు గారు.",
        "grammar_notes": "Polite form is おはようございます (Ohayou gozaimasu)."
      }
    ],
    "mnemonic_en": "Greeting a friend in Ohio in the morning: \"O-hayo!\"",
    "mnemonic_te": "ఉదయాన్నే నిద్రలేవగానే చెప్పే శుభోదయం."
  },
  {
    "id": "v_sayounara",
    "word": "さようなら",
    "reading": "さようなら",
    "furigana": "さようなら",
    "romaji": "sayounara",
    "part_of_speech": "Expression",
    "english": "Goodbye / Farewell",
    "telugu": "వీడ్కోలు / వెళ్లివస్తాను",
    "telugu_phonetic": "సయోనారా",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "みなさん、さようなら。",
        "romaji": "Minasan, sayounara.",
        "telugu_phonetic": "మినాసాన్, సయోనారా.",
        "english": "Goodbye everyone.",
        "telugu": "అందరికీ వీడ్కోలు.",
        "grammar_notes": "Often used for long-term farewells; for colleagues use お疲れ様でした (Otsukaresama deshita)."
      }
    ],
    "mnemonic_en": "Sayonara: Sighing as you say goodbye for a long time.",
    "mnemonic_te": "ఎక్కువ కాలం సెలవు తీసుకునేటప్పుడు చెప్పే వీడ్కోలు పదం."
  },
  {
    "id": "v_sumimasen",
    "word": "すみません",
    "reading": "すみません",
    "furigana": "すみません",
    "romaji": "sumimasen",
    "part_of_speech": "Expression",
    "english": "Excuse me / I am sorry",
    "telugu": "నన్ను క్షమించండి / వినండి",
    "telugu_phonetic": "సుమిమాసెన్",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "すみません、メニューをください。",
        "romaji": "Sumimasen, menyuu o kudasai.",
        "telugu_phonetic": "సుమిమాసెన్, మెన్యూ ఒ కుదాసాయ్.",
        "english": "Excuse me, please give me the menu.",
        "telugu": "క్షమించండి, దయచేసి మెనూ ఇవ్వండి.",
        "grammar_notes": "Crucial word: works for apology, calling a waiter, and light thank you."
      }
    ],
    "mnemonic_en": "Sue me? No, please, \"Sumimasen\"!",
    "mnemonic_te": "ఎవరినైనా పిలవడానికి లేదా క్షమాపణ అడగడానికి ఉపయోగించే అత్యంత ముఖ్యమైన పదం."
  },
  {
    "id": "v_hai",
    "word": "はい",
    "reading": "はい",
    "furigana": "はい",
    "romaji": "hai",
    "part_of_speech": "Expression",
    "english": "Yes / I understand",
    "telugu": "అవును / సరే",
    "telugu_phonetic": "హై",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "はい、分かりました。",
        "romaji": "Hai, wakarimashita.",
        "telugu_phonetic": "హై, వకారిమాషిత.",
        "english": "Yes, I understood.",
        "telugu": "అవును, నాకు అర్థమైంది.",
        "grammar_notes": "Also used as an attentive response (aizuchi) when listening to others."
      }
    ],
    "mnemonic_en": "High five for \"Hai\" (Yes)!",
    "mnemonic_te": "ఒప్పుకోవడానికి లేదా వింటున్నాను అని చెప్పడానికి \"హై\" అంటారు."
  },
  {
    "id": "v_iie",
    "word": "いいえ",
    "reading": "いいえ",
    "furigana": "いいえ",
    "romaji": "iie",
    "part_of_speech": "Expression",
    "english": "No / Not at all",
    "telugu": "కాదు / లేదు",
    "telugu_phonetic": "ఈయె",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "いいえ、違います。",
        "romaji": "Iie, chigaimasu.",
        "telugu_phonetic": "ఈయె, చిగాయిమాసు.",
        "english": "No, that is incorrect / different.",
        "telugu": "లేదు, అది తప్పు / వేరు.",
        "grammar_notes": "違います (chigaimasu) means \"it differs / it is wrong\"."
      }
    ],
    "mnemonic_en": "Saying \"Eee-eh\" when shaking your head no.",
    "mnemonic_te": "కాదు లేదా తప్పు అని చెప్పడానికి \"ఈయె\" వాడతారు."
  },
  {
    "id": "v_onegai",
    "word": "お願いします",
    "reading": "おねがいします",
    "kanji": "お願いします",
    "furigana": "おねがいします",
    "romaji": "onegaishimasu",
    "part_of_speech": "Expression",
    "english": "Please / Favor please",
    "telugu": "దయచేసి / సహాయం చేయండి",
    "telugu_phonetic": "ఒనెగాయిషిమాసు",
    "jlpt_level": "N5",
    "category": "greetings",
    "example_sentences": [
      {
        "japanese": "これをお願いします。",
        "romaji": "Kore o onegaishimasu.",
        "telugu_phonetic": "కొరె ఒ ఒనెగాయిషిమాసు.",
        "english": "This one please.",
        "telugu": "దయచేసి ఇది ఇవ్వండి.",
        "grammar_notes": "Essential for ordering at restaurants or requesting services."
      }
    ],
    "mnemonic_en": "Oh-nega-i-shimasu: Politeness request formula.",
    "mnemonic_te": "గౌరవంగా ఏదైనా అభ్యర్థించేటప్పుడు లేదా కోరేటప్పుడు వాడే పదం."
  },
  {
    "id": "v_ichi",
    "word": "一",
    "reading": "いち",
    "kanji": "一",
    "furigana": "いち",
    "romaji": "ichi",
    "part_of_speech": "Number",
    "english": "One (1)",
    "telugu": "ఒకటి (1)",
    "telugu_phonetic": "ఇచి",
    "jlpt_level": "N5",
    "category": "numbers",
    "example_sentences": [
      {
        "japanese": "りんごを一つください。",
        "romaji": "Ringo o hitotsu kudasai.",
        "telugu_phonetic": "రింగొ ఒ హితోత్సు కుదాసాయ్.",
        "english": "Please give me one apple.",
        "telugu": "దయచేసి నాకు ఒక ఆపిల్ ఇవ్వండి.",
        "grammar_notes": "一つ (hitotsu) is the native Japanese counter for one general object."
      }
    ],
    "mnemonic_en": "Single horizontal stroke = number 1.",
    "mnemonic_te": "ఒకే ఒక అడ్డగీత సంఖ్య 1 ని సూచిస్తుంది."
  },
  {
    "id": "v_ni",
    "word": "二",
    "reading": "に",
    "kanji": "二",
    "furigana": "に",
    "romaji": "ni",
    "part_of_speech": "Number",
    "english": "Two (2)",
    "telugu": "రెండు (2)",
    "telugu_phonetic": "ని",
    "jlpt_level": "N5",
    "category": "numbers",
    "example_sentences": [
      {
        "japanese": "コーヒーを二つお願いします。",
        "romaji": "Koohii o futatsu onegaishimasu.",
        "telugu_phonetic": "కోహీ ఒ ఫుతాతూసు ఒనెగాయిషిమాసు.",
        "english": "Two coffees please.",
        "telugu": "దయచేసి రెండు కాఫీలు ఇవ్వండి.",
        "grammar_notes": "二つ (futatsu) is the counter for two items."
      }
    ],
    "mnemonic_en": "Two parallel strokes = number 2.",
    "mnemonic_te": "రెండు సమాంతర అడ్డగీతలు సంఖ్య 2 ని సూచిస్తాయి."
  },
  {
    "id": "v_san_num",
    "word": "三",
    "reading": "さん",
    "kanji": "三",
    "furigana": "さん",
    "romaji": "san",
    "part_of_speech": "Number",
    "english": "Three (3)",
    "telugu": "మూడు (3)",
    "telugu_phonetic": "సాన్",
    "jlpt_level": "N5",
    "category": "numbers",
    "example_sentences": [
      {
        "japanese": "三時にお茶を飲みます。",
        "romaji": "San-ji ni ocha o nomimasu.",
        "telugu_phonetic": "సాన్-జి ని ఒచా ఒ నొమిమాసు.",
        "english": "I drink tea at 3 o'clock.",
        "telugu": "నేను 3 గంటలకు టీ త్రాగుతాను.",
        "grammar_notes": "時 (ji) attached to a number indicates the hour of the day."
      }
    ],
    "mnemonic_en": "Three horizontal strokes = number 3.",
    "mnemonic_te": "మూడు అడ్డగీతలు సంఖ్య 3 ని సూచిస్తాయి."
  },
  {
    "id": "v_yon",
    "word": "四",
    "reading": "よん / し",
    "kanji": "四",
    "furigana": "よん",
    "romaji": "yon / shi",
    "part_of_speech": "Number",
    "english": "Four (4)",
    "telugu": "నాలుగు (4)",
    "telugu_phonetic": "యోన్ / షి",
    "jlpt_level": "N5",
    "category": "numbers",
    "example_sentences": [
      {
        "japanese": "四月に日本へ行きます。",
        "romaji": "Shi-gatsu ni Nihon e ikimasu.",
        "telugu_phonetic": "షి-గాత్సు ని నిహొన్ ఎ ఇకిమాసు.",
        "english": "I will go to Japan in April.",
        "telugu": "నేను ఏప్రిల్ నెలలో జపాన్ వెళ్తాను.",
        "grammar_notes": "For months, 四月 is always read \"Shi-gatsu\" (never Yon-gatsu)."
      }
    ],
    "mnemonic_en": "A window with curtains tied inside four corners.",
    "mnemonic_te": "నాలుగు వైపుల మూసి ఉన్న కిటికీ."
  },
  {
    "id": "v_go_num",
    "word": "五",
    "reading": "ご",
    "kanji": "五",
    "furigana": "ご",
    "romaji": "go",
    "part_of_speech": "Number",
    "english": "Five (5)",
    "telugu": "ఐదు (5)",
    "telugu_phonetic": "గొ",
    "jlpt_level": "N5",
    "category": "numbers",
    "example_sentences": [
      {
        "japanese": "五分待ってください。",
        "romaji": "Gofun matte kudasai.",
        "telugu_phonetic": "గొఫున్ మత్తె కుదాసాయ్.",
        "english": "Please wait five minutes.",
        "telugu": "దయచేసి ఐదు నిమిషాలు వేచి ఉండండి.",
        "grammar_notes": "分 (fun/pun) is the counter for minutes."
      }
    ],
    "mnemonic_en": "Count high five and \"Go\"!",
    "mnemonic_te": "ఐదు సంఖ్యను జపనీస్‌లో \"గొ\" అంటారు."
  },
  {
    "id": "v_juu",
    "word": "十",
    "reading": "じゅう",
    "kanji": "十",
    "furigana": "じゅう",
    "romaji": "juu",
    "part_of_speech": "Number",
    "english": "Ten (10)",
    "telugu": "పది (10)",
    "telugu_phonetic": "జ్యూ",
    "jlpt_level": "N5",
    "category": "numbers",
    "example_sentences": [
      {
        "japanese": "十月は秋です。",
        "romaji": "Juu-gatsu wa aki desu.",
        "telugu_phonetic": "జ్యూ-గాత్సు వా అకి దెసు.",
        "english": "October is autumn.",
        "telugu": "అక్టోబర్ శరదృతువు.",
        "grammar_notes": "十月 (Juu-gatsu) = 10th month (October)."
      }
    ],
    "mnemonic_en": "A cross representing 10 counting tallies.",
    "mnemonic_te": "కూడిక గుర్తు లాంటి ఆకారం పది (10) ని సూచిస్తుంది."
  },
  {
    "id": "v_ima",
    "word": "今",
    "reading": "いま",
    "kanji": "今",
    "furigana": "いま",
    "romaji": "ima",
    "part_of_speech": "Noun / Adverb",
    "english": "Now",
    "telugu": "ఇప్పుడు",
    "telugu_phonetic": "ఇమా",
    "jlpt_level": "N5",
    "category": "time_dates",
    "example_sentences": [
      {
        "japanese": "今、何時ですか？",
        "romaji": "Ima, nanji desu ka?",
        "telugu_phonetic": "ఇమా, నాంజి దెసు కా?",
        "english": "What time is it now?",
        "telugu": "ఇప్పుడు సమయం ఎంత అయ్యింది?",
        "grammar_notes": "何時 (nanji) = what hour/time."
      }
    ],
    "mnemonic_en": "I am here right now: \"Ima\" (now).",
    "mnemonic_te": "ప్రస్తుత సమయాన్ని \"ఇప్పుడు\" అనడానికి 今 (ఇమా) వాడతారు."
  },
  {
    "id": "v_kyou",
    "word": "今日",
    "reading": "きょう",
    "kanji": "今日",
    "furigana": "きょう",
    "romaji": "kyou",
    "part_of_speech": "Noun",
    "english": "Today",
    "telugu": "ఈ రోజు / నేడు",
    "telugu_phonetic": "క్యో",
    "jlpt_level": "N5",
    "category": "time_dates",
    "example_sentences": [
      {
        "japanese": "今日はいい天気ですね。",
        "romaji": "Kyou wa ii tenki desu ne.",
        "telugu_phonetic": "క్యో వా ఈ తెంకి దెసు నె.",
        "english": "Today is nice weather, isn't it?",
        "telugu": "ఈ రోజు వాతావరణం చాలా బాగుంది కదా.",
        "grammar_notes": "ね (ne) particle seeks agreement, like \"isn't it?\"."
      }
    ],
    "mnemonic_en": "Kyoto today has lovely sunshine.",
    "mnemonic_te": "ఈ రోజటి దినాన్ని \"క్యో\" అంటారు."
  },
  {
    "id": "v_ashita",
    "word": "明日",
    "reading": "あした",
    "kanji": "明日",
    "furigana": "あした",
    "romaji": "ashita",
    "part_of_speech": "Noun",
    "english": "Tomorrow",
    "telugu": "రేపు",
    "telugu_phonetic": "అషిత",
    "jlpt_level": "N5",
    "category": "time_dates",
    "example_sentences": [
      {
        "japanese": "明日、学校へ行きます。",
        "romaji": "Ashita, gakkou e ikimasu.",
        "telugu_phonetic": "అషిత, గాక్కో ఎ ఇకిమాసు.",
        "english": "Tomorrow I will go to school.",
        "telugu": "రేపు నేను బడికి వెళ్తాను.",
        "grammar_notes": "へ (e) particle indicates destination of movement."
      }
    ],
    "mnemonic_en": "A bright sheet of dawn brings tomorrow: Ashita.",
    "mnemonic_te": "రాబోయే మరుసటి రోజును \"అషిత\" అంటారు."
  },
  {
    "id": "v_kinou",
    "word": "昨日",
    "reading": "きのう",
    "kanji": "昨日",
    "furigana": "きのう",
    "romaji": "kinou",
    "part_of_speech": "Noun",
    "english": "Yesterday",
    "telugu": "నిన్న",
    "telugu_phonetic": "కినో",
    "jlpt_level": "N5",
    "category": "time_dates",
    "example_sentences": [
      {
        "japanese": "昨日は雨でした。",
        "romaji": "Kinou wa ame deshita.",
        "telugu_phonetic": "కినో వా అమె దెషిత.",
        "english": "Yesterday it was rainy.",
        "telugu": "నిన్న వర్షం పడింది.",
        "grammar_notes": "でした (deshita) is the past tense of です (desu)."
      }
    ],
    "mnemonic_en": "The key from yesterday: Kinou.",
    "mnemonic_te": "గడచిపోయిన నిన్నటి రోజును \"కినో\" అంటారు."
  },
  {
    "id": "v_jikan",
    "word": "時間",
    "reading": "じかん",
    "kanji": "時間",
    "furigana": "じかん",
    "romaji": "jikan",
    "part_of_speech": "Noun",
    "english": "Time / Hours duration",
    "telugu": "సమయం / గంటల వ్యవధి",
    "telugu_phonetic": "జికాన్",
    "jlpt_level": "N5",
    "category": "time_dates",
    "example_sentences": [
      {
        "japanese": "時間がありません。",
        "romaji": "Jikan ga arimasen.",
        "telugu_phonetic": "జికాన్ గ అరిమాసెన్.",
        "english": "I do not have time.",
        "telugu": "నాకు సమయం లేదు.",
        "grammar_notes": "ありません (arimasen) is negative for inanimate existence (have/exist)."
      }
    ],
    "mnemonic_en": "Sun between gates tracks the passage of time: Jikan.",
    "mnemonic_te": "గడియారం చూపే సమయం లేదా వ్యవధి."
  },
  {
    "id": "v_gohan",
    "word": "ご飯",
    "reading": "ごはん",
    "kanji": "ご飯",
    "furigana": "ごはん",
    "romaji": "gohan",
    "part_of_speech": "Noun",
    "english": "Cooked rice / Meal",
    "telugu": "అన్నం / భోజనం",
    "telugu_phonetic": "గొహాన్",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "朝ご飯を食べました。",
        "romaji": "Asagohan o tabemashita.",
        "telugu_phonetic": "అసాగొహాన్ ఒ తబెమాషిత.",
        "english": "I ate breakfast.",
        "telugu": "నేను అల్పాహారం తిన్నాను.",
        "grammar_notes": "朝 (asa = morning) + ご飯 (gohan = meal) = 朝ご飯 (breakfast)."
      }
    ],
    "mnemonic_en": "Go get hands ready for rice meal: Gohan!",
    "mnemonic_te": "రుచికరమైన అన్నం లేదా రోజువారీ భోజనం."
  },
  {
    "id": "v_mizu_v",
    "word": "水",
    "reading": "みず",
    "kanji": "水",
    "furigana": "みず",
    "romaji": "mizu",
    "part_of_speech": "Noun",
    "english": "Water (cold/fresh)",
    "telugu": "మంచినీళ్లు / నీరు",
    "telugu_phonetic": "మిజు",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "お水を一杯ください。",
        "romaji": "Omizu o ippai kudasai.",
        "telugu_phonetic": "ఒమిజు ఒ ఇప్పాయ్ కుదాసాయ్.",
        "english": "Please give me a glass of water.",
        "telugu": "దయచేసి ఒక గ్లాసు నీళ్లు ఇవ్వండి.",
        "grammar_notes": "お (o) is an honorific beautifier; 一杯 (ippai) = one glass/cup."
      }
    ],
    "mnemonic_en": "Splashing fresh \"Mizu\" to wake up.",
    "mnemonic_te": "త్రాగడానికి ఉపయోగించే స్వచ్ఛమైన చల్లని నీరు."
  },
  {
    "id": "v_ocha",
    "word": "お茶",
    "reading": "おちゃ",
    "kanji": "お茶",
    "furigana": "おちゃ",
    "romaji": "ocha",
    "part_of_speech": "Noun",
    "english": "Green tea / Tea",
    "telugu": "గ్రీన్ టీ / తేనీరు",
    "telugu_phonetic": "ఒచా",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "温かいお茶を飲みます。",
        "romaji": "Atatakai ocha o nomimasu.",
        "telugu_phonetic": "అతాతకాయ్ ఒచా ఒ నొమిమాసు.",
        "english": "I drink warm green tea.",
        "telugu": "నేను వేడి టీ త్రాగుతాను.",
        "grammar_notes": "飲みます (nomimasu) = drink (polite non-past)."
      }
    ],
    "mnemonic_en": "A cup of \"cha\" (tea) with polite prefix \"O\".",
    "mnemonic_te": "జపనీయులు ఎంతో ఇష్టంగా త్రాగే గ్రీన్ టీ."
  },
  {
    "id": "v_pan",
    "word": "パン",
    "reading": "パン",
    "furigana": "パン",
    "romaji": "pan",
    "part_of_speech": "Noun",
    "english": "Bread",
    "telugu": "రొట్టె / బ్రెడ్",
    "telugu_phonetic": "పాన్",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "朝食にパンを食べます。",
        "romaji": "Choushoku ni pan o tabemasu.",
        "telugu_phonetic": "చోషోకు ని పాన్ ఒ తబెమాసు.",
        "english": "I eat bread for breakfast.",
        "telugu": "నేను ఉదయం అల్పాహారంలో బ్రెడ్ తింటాను.",
        "grammar_notes": "Borrowed from Portuguese pão; written in Katakana."
      }
    ],
    "mnemonic_en": "Baked fresh in a baking pan: Pan (bread).",
    "mnemonic_te": "పోర్చుగీస్ భాష నుండి వచ్చిన బ్రెడ్ / రొట్టె."
  },
  {
    "id": "v_sakana",
    "word": "魚",
    "reading": "さかな",
    "kanji": "魚",
    "furigana": "さかな",
    "romaji": "sakana",
    "part_of_speech": "Noun",
    "english": "Fish",
    "telugu": "చేప",
    "telugu_phonetic": "సకానా",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "魚が好きです。",
        "romaji": "Sakana ga suki desu.",
        "telugu_phonetic": "సకానా గ సుకి దెసు.",
        "english": "I like fish.",
        "telugu": "నాకు చేపలంటే ఇష్టం.",
        "grammar_notes": "好き (suki) takes the が (ga) particle for the object liked."
      }
    ],
    "mnemonic_en": "A fish swimming in the water: Sakana.",
    "mnemonic_te": "నీటిలో ఈదే చేప."
  },
  {
    "id": "v_niku",
    "word": "肉",
    "reading": "にく",
    "kanji": "肉",
    "furigana": "にく",
    "romaji": "niku",
    "part_of_speech": "Noun",
    "english": "Meat",
    "telugu": "మాంసం",
    "telugu_phonetic": "నికు",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "牛肉を食べます。",
        "romaji": "Gyuuniku o tabemasu.",
        "telugu_phonetic": "గ్యూనికు ఒ తబెమాసు.",
        "english": "I eat beef.",
        "telugu": "నేను గొడ్డు మాంసం తింటాను.",
        "grammar_notes": "牛 (cow) + 肉 (meat) = 牛肉 (beef)."
      }
    ],
    "mnemonic_en": "Nick loves grilled meat: Niku.",
    "mnemonic_te": "ఆహారంగా తీసుకునే మాంసం."
  },
  {
    "id": "v_kudamono",
    "word": "果物",
    "reading": "くだもの",
    "kanji": "果物",
    "furigana": "くだもの",
    "romaji": "kudamono",
    "part_of_speech": "Noun",
    "english": "Fruit",
    "telugu": "పండు / పండ్లు",
    "telugu_phonetic": "కుదామొనొ",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "甘い果物を買いました。",
        "romaji": "Amai kudamono o kaimashita.",
        "telugu_phonetic": "అమాయ్ కుదామొనొ ఒ కాయిమాషిత.",
        "english": "I bought sweet fruit.",
        "telugu": "నేను తీపి పండ్లను కొన్నాను.",
        "grammar_notes": "甘い (amai = sweet) modifies the noun 果物 directly."
      }
    ],
    "mnemonic_en": "Could I have more fruits: Kudamono.",
    "mnemonic_te": "చెట్ల నుంచి లభించే తీపి పండ్లు."
  },
  {
    "id": "v_oishii",
    "word": "美味しい",
    "reading": "おいしい",
    "kanji": "美味しい",
    "furigana": "おいしい",
    "romaji": "oishii",
    "part_of_speech": "i-Adjective",
    "english": "Delicious / Tasty",
    "telugu": "చాలా రుచికరమైనది",
    "telugu_phonetic": "ఒయిషీ",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "このラーメンはとても美味しいです。",
        "romaji": "Kono raamen wa totemo oishii desu.",
        "telugu_phonetic": "కొనొ రామెన్ వా తొతెమొ ఒయిషీ దెసు.",
        "english": "This ramen is very delicious.",
        "telugu": "ఈ రామెన్ చాలా రుచిగా ఉంది.",
        "grammar_notes": "とても (totemo) = very."
      }
    ],
    "mnemonic_en": "Say \"Oi! She tasted it and it is delicious!\"",
    "mnemonic_te": "నోరూరించే కమ్మనైన రుచిని తెలపడానికి వాడతారు."
  },
  {
    "id": "v_eki",
    "word": "駅",
    "reading": "えき",
    "kanji": "駅",
    "furigana": "えき",
    "romaji": "eki",
    "part_of_speech": "Noun",
    "english": "Train station",
    "telugu": "రైల్వే స్టేషన్",
    "telugu_phonetic": "ఎకి",
    "jlpt_level": "N5",
    "category": "transport",
    "example_sentences": [
      {
        "japanese": "東京駅はどこですか？",
        "romaji": "Toukyou eki wa doko desu ka?",
        "telugu_phonetic": "తోక్యో ఎకి వా దొకొ దెసు కా?",
        "english": "Where is Tokyo Station?",
        "telugu": "టోక్యో స్టేషన్ ఎక్కడ ఉంది?",
        "grammar_notes": "どこ (doko) = where; か (ka) = question particle."
      }
    ],
    "mnemonic_en": "Exit the train at the Eki station.",
    "mnemonic_te": "రైళ్లు ఆగే స్టేషన్."
  },
  {
    "id": "v_densha",
    "word": "電車",
    "reading": "でんしゃ",
    "kanji": "電車",
    "furigana": "でんしゃ",
    "romaji": "densha",
    "part_of_speech": "Noun",
    "english": "Electric train",
    "telugu": "రైలు / ఎలక్ట్రిక్ రైలు",
    "telugu_phonetic": "దెన్షా",
    "jlpt_level": "N5",
    "category": "transport",
    "example_sentences": [
      {
        "japanese": "電車で行きます。",
        "romaji": "Densha de ikimasu.",
        "telugu_phonetic": "దెన్షా దె ఇకిమాసు.",
        "english": "I go by train.",
        "telugu": "నేను రైలులో వెళ్తాను.",
        "grammar_notes": "で (de) particle indicates the means of transportation (by train)."
      }
    ],
    "mnemonic_en": "Electric (den) car on tracks (sha) = train.",
    "mnemonic_te": "విద్యుత్ రైలు."
  },
  {
    "id": "v_kuruma",
    "word": "車",
    "reading": "くるま",
    "kanji": "車",
    "furigana": "くるま",
    "romaji": "kuruma",
    "part_of_speech": "Noun",
    "english": "Car / Vehicle",
    "telugu": "కారు / వాహనం",
    "telugu_phonetic": "కురుమా",
    "jlpt_level": "N5",
    "category": "transport",
    "example_sentences": [
      {
        "japanese": "新しい車を買いました。",
        "romaji": "Atarashii kuruma o kaimashita.",
        "telugu_phonetic": "అతారాషీ కురుమా ఒ కాయిమాషిత.",
        "english": "I bought a new car.",
        "telugu": "నేను ఒక కొత్త కారు కొన్నాను.",
        "grammar_notes": "新しい (atarashii = new) is an i-adjective modifying 車."
      }
    ],
    "mnemonic_en": "Wheels rolling in a car: Kuruma.",
    "mnemonic_te": "రహదారిపై ప్రయాణించే కారు."
  },
  {
    "id": "v_ie",
    "word": "家",
    "reading": "いえ",
    "kanji": "家",
    "furigana": "いえ",
    "romaji": "ie",
    "part_of_speech": "Noun",
    "english": "House / Home",
    "telugu": "ఇల్లు / నివాసం",
    "telugu_phonetic": "ఇయె",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "家に帰ります。",
        "romaji": "Ie ni kaerimasu.",
        "telugu_phonetic": "ఇయె ని కాయెరిమాసు.",
        "english": "I will return home.",
        "telugu": "నేను ఇంటికి తిరిగి వెళ్తాను.",
        "grammar_notes": "に (ni) indicates destination with directional verbs like 帰る."
      }
    ],
    "mnemonic_en": "EA Sports it's in the house: I-e.",
    "mnemonic_te": "మనం నివసించే సొంత ఇల్లు."
  },
  {
    "id": "v_gakkou",
    "word": "学校",
    "reading": "がっこう",
    "kanji": "学校",
    "furigana": "がっこう",
    "romaji": "gakkou",
    "part_of_speech": "Noun",
    "english": "School",
    "telugu": "పాఠశాల / బడి",
    "telugu_phonetic": "గాక్కో",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "学校で勉強します。",
        "romaji": "Gakkou de benkyou shimasu.",
        "telugu_phonetic": "గాక్కో దె బెంక్యో షిమాసు.",
        "english": "I study at school.",
        "telugu": "నేను బడిలో చదువుకుంటాను.",
        "grammar_notes": "で (de) marks the location where an action takes place."
      }
    ],
    "mnemonic_en": "Kids gather to learn: Gakkou.",
    "mnemonic_te": "పిల్లలు విద్యనభ్యసించే బడి."
  },
  {
    "id": "v_tomodachi",
    "word": "友達",
    "reading": "ともだち",
    "kanji": "友達",
    "furigana": "ともだち",
    "romaji": "tomodachi",
    "part_of_speech": "Noun",
    "english": "Friend",
    "telugu": "స్నేహితుడు / మిత్రుడు",
    "telugu_phonetic": "తొమొదాచి",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "友達と遊びます。",
        "romaji": "Tomodachi to asobimasu.",
        "telugu_phonetic": "తొమొదాచి తొ అసొబిమాసు.",
        "english": "I play with my friend.",
        "telugu": "నేను నా స్నేహితుడితో ఆడుకుంటాను.",
        "grammar_notes": "と (to) particle means \"with\" when pairing people."
      }
    ],
    "mnemonic_en": "Together with your best buddy: Tomodachi.",
    "mnemonic_te": "కష్టసుఖాల్లో తోడుండే మంచి స్నేహితుడు."
  },
  {
    "id": "v_sensei",
    "word": "先生",
    "reading": "せんせい",
    "kanji": "先生",
    "furigana": "せんせい",
    "romaji": "sensei",
    "part_of_speech": "Noun",
    "english": "Teacher / Master / Doctor",
    "telugu": "ఉపాధ్యాయుడు / గురువు",
    "telugu_phonetic": "సెన్సేయ్",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "山田先生は優しいです。",
        "romaji": "Yamada sensei wa yasashii desu.",
        "telugu_phonetic": "యామాదా సెన్సేయ్ వా యాసాషీ దెసు.",
        "english": "Teacher Yamada is kind.",
        "telugu": "యామాదా గురువు గారు చాలా దయామయులు.",
        "grammar_notes": "先生 is used as an honorific title attached after names."
      }
    ],
    "mnemonic_en": "One who lived before (先 = before, 生 = life) guides you: Sensei.",
    "mnemonic_te": "విజ్ఞానాన్ని బోధించే గౌరవనీయులైన గురువు."
  },
  {
    "id": "v_gakusei",
    "word": "学生",
    "reading": "がくせい",
    "kanji": "学生",
    "furigana": "がくせい",
    "romaji": "gakusei",
    "part_of_speech": "Noun",
    "english": "Student",
    "telugu": "విద్యార్థి",
    "telugu_phonetic": "గాకుసేయ్",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "私は学生です。",
        "romaji": "Watashi wa gakusei desu.",
        "telugu_phonetic": "వాతాషి వా గాకుసేయ్ దెసు.",
        "english": "I am a student.",
        "telugu": "నేను ఒక విద్యార్థిని.",
        "grammar_notes": "A is B sentence structure: 私は (I am) + 学生 (student) + です."
      }
    ],
    "mnemonic_en": "Learning life: Gaku (study) + Sei (student).",
    "mnemonic_te": "చదువుకునే విద్యార్థి."
  },
  {
    "id": "v_hon",
    "word": "本",
    "reading": "ほん",
    "kanji": "本",
    "furigana": "ほん",
    "romaji": "hon",
    "part_of_speech": "Noun",
    "english": "Book",
    "telugu": "పుస్తకం",
    "telugu_phonetic": "హొన్",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "日本語の本を読みます。",
        "romaji": "Nihongo no hon o yomimasu.",
        "telugu_phonetic": "నిహొంగొ నొ హొన్ ఒ యొమిమాసు.",
        "english": "I read Japanese books.",
        "telugu": "నేను జపనీస్ పుస్తకాలు చదువుతాను.",
        "grammar_notes": "の (no) connects two nouns: Japanese language + book."
      }
    ],
    "mnemonic_en": "Honest readers treasure a good Hon (book).",
    "mnemonic_te": "జ్ఞానాన్ని అందించే పుస్తకం."
  },
  {
    "id": "v_inu",
    "word": "犬",
    "reading": "いぬ",
    "kanji": "犬",
    "furigana": "いぬ",
    "romaji": "inu",
    "part_of_speech": "Noun",
    "english": "Dog",
    "telugu": "కుక్క",
    "telugu_phonetic": "ఇను",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "公園に犬がいます。",
        "romaji": "Kouen ni inu ga imasu.",
        "telugu_phonetic": "కోయెన్ ని ఇను గ ఇమాసు.",
        "english": "There is a dog in the park.",
        "telugu": "ఉద్యానవనంలో ఒక కుక్క ఉంది.",
        "grammar_notes": "います (imasu) is used for the existence of animate living beings."
      }
    ],
    "mnemonic_en": "Inuit sled dogs: Inu.",
    "mnemonic_te": "విశ్వాసంగల పెంపుడు జంతువు కుక్క."
  },
  {
    "id": "v_neko",
    "word": "猫",
    "reading": "ねこ",
    "kanji": "猫",
    "furigana": "ねこ",
    "romaji": "neko",
    "part_of_speech": "Noun",
    "english": "Cat",
    "telugu": "పిల్లి",
    "telugu_phonetic": "నెకొ",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "猫が寝ています。",
        "romaji": "Neko ga nete imasu.",
        "telugu_phonetic": "నెకొ గ నెతె ఇమాసు.",
        "english": "The cat is sleeping.",
        "telugu": "పిల్లి నిద్రపోతోంది.",
        "grammar_notes": "〜ています (-te imasu) expresses ongoing continuous state."
      }
    ],
    "mnemonic_en": "Napping cute kitty: Neko.",
    "mnemonic_te": "ఇళ్లలో తిరిగే పిల్లి."
  },
  {
    "id": "v_nihon",
    "word": "日本",
    "reading": "にほん",
    "kanji": "日本",
    "furigana": "にほん",
    "romaji": "nihon",
    "part_of_speech": "Noun",
    "english": "Japan",
    "telugu": "జపాన్ దేశం",
    "telugu_phonetic": "నిహొన్",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "日本は美しい国です。",
        "romaji": "Nihon wa utsukushii kuni desu.",
        "telugu_phonetic": "నిహొన్ వా ఉత్సుకుషీ కుని దెసు.",
        "english": "Japan is a beautiful country.",
        "telugu": "జపాన్ చాలా అందమైన దేశం.",
        "grammar_notes": "国 (kuni) = country."
      }
    ],
    "mnemonic_en": "Sun (日) Origin (本) = Land of the Rising Sun.",
    "mnemonic_te": "ఉదయించే సూర్యుడి దేశం (జపాన్)."
  },
  {
    "id": "v_taberu",
    "word": "食べる",
    "reading": "たべる",
    "kanji": "食べる",
    "furigana": "たべる",
    "romaji": "taberu",
    "part_of_speech": "Ichidan Verb",
    "english": "To eat",
    "telugu": "తినడం",
    "telugu_phonetic": "తబెరు",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "林檎を食べます。",
        "romaji": "Ringo o tabemasu.",
        "telugu_phonetic": "రింగొ ఒ తబెమాసు.",
        "english": "I eat an apple.",
        "telugu": "నేను ఆపిల్ తింటాను.",
        "grammar_notes": "Polite non-past form: 食べます (tabemasu)."
      }
    ],
    "mnemonic_en": "At the dinner table, you \"Taberu\" (eat).",
    "mnemonic_te": "ఆహారాన్ని తినే ప్రక్రియ."
  },
  {
    "id": "v_nomu",
    "word": "飲む",
    "reading": "のむ",
    "kanji": "飲む",
    "furigana": "のむ",
    "romaji": "nomu",
    "part_of_speech": "Godan Verb",
    "english": "To drink",
    "telugu": "త్రాగడం",
    "telugu_phonetic": "నొము",
    "jlpt_level": "N5",
    "category": "food",
    "example_sentences": [
      {
        "japanese": "牛乳を飲みます。",
        "romaji": "Gyuunyuu o nomimasu.",
        "telugu_phonetic": "గ్యూన్యూ ఒ నొమిమాసు.",
        "english": "I drink milk.",
        "telugu": "నేను పాలు త్రాగుతాను.",
        "grammar_notes": "Polite non-past form: 飲みます (nomimasu)."
      }
    ],
    "mnemonic_en": "No more thirsty throat after you Nomu: drink.",
    "mnemonic_te": "నీరు లేదా పానీయాలు త్రాగడం."
  },
  {
    "id": "v_ikimasu",
    "word": "行く",
    "reading": "いく",
    "kanji": "行く",
    "furigana": "いく",
    "romaji": "iku",
    "part_of_speech": "Godan Verb",
    "english": "To go",
    "telugu": "వెళ్లడం",
    "telugu_phonetic": "ఇకు",
    "jlpt_level": "N5",
    "category": "transport",
    "example_sentences": [
      {
        "japanese": "デパートへ行きます。",
        "romaji": "Depaato e ikimasu.",
        "telugu_phonetic": "దెపాాతొ ఎ ఇకిమాసు.",
        "english": "I go to the department store.",
        "telugu": "నేను డిపార్ట్మెంట్ స్టోర్‌కు వెళ్తాను.",
        "grammar_notes": "Polite form: 行きます (ikimasu)."
      }
    ],
    "mnemonic_en": "I can go there: Iku!",
    "mnemonic_te": "ఒక చోటికి బయలుదేరి వెళ్లడం."
  },
  {
    "id": "v_miru",
    "word": "見る",
    "reading": "みる",
    "kanji": "見る",
    "furigana": "みる",
    "romaji": "miru",
    "part_of_speech": "Ichidan Verb",
    "english": "To see / To watch",
    "telugu": "చూడడం",
    "telugu_phonetic": "మిరు",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "テレビを見ます。",
        "romaji": "Terebi o mimasu.",
        "telugu_phonetic": "తెరెబి ఒ మిమాసు.",
        "english": "I watch television.",
        "telugu": "నేను టీవీ చూస్తాను.",
        "grammar_notes": "Polite form: 見ます (mimasu)."
      }
    ],
    "mnemonic_en": "Look in the mirror to see: Miru.",
    "mnemonic_te": "కళ్లతో దృశ్యాలను చూడడం."
  },
  {
    "id": "v_kiku",
    "word": "聞く",
    "reading": "きく",
    "kanji": "聞く",
    "furigana": "きく",
    "romaji": "kiku",
    "part_of_speech": "Godan Verb",
    "english": "To hear / To listen / To ask",
    "telugu": "వినడం / అడగడం",
    "telugu_phonetic": "కికు",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "音楽を聞きます。",
        "romaji": "Ongaku o kikimasu.",
        "telugu_phonetic": "ఒంగాకు ఒ కికిమాసు.",
        "english": "I listen to music.",
        "telugu": "నేను సంగీతం వింటాను.",
        "grammar_notes": "Ear (耳) inside the gate (門) listening carefully."
      }
    ],
    "mnemonic_en": "Keep your ears open to hear: Kiku.",
    "mnemonic_te": "చెవులతో సంగీతాన్ని లేదా మాటలను వినడం."
  },
  {
    "id": "v_hanasu",
    "word": "話す",
    "reading": "はなす",
    "kanji": "話す",
    "furigana": "はなす",
    "romaji": "hanasu",
    "part_of_speech": "Godan Verb",
    "english": "To speak / To talk",
    "telugu": "మాట్లాడడం",
    "telugu_phonetic": "హనాసు",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "日本語を話します。",
        "romaji": "Nihongo o hanashimasu.",
        "telugu_phonetic": "నిహొంగొ ఒ హనాషిమాసు.",
        "english": "I speak Japanese.",
        "telugu": "నేను జపనీస్ మాట్లాడుతాను.",
        "grammar_notes": "Polite form: 話します (hanashimasu)."
      }
    ],
    "mnemonic_en": "Have nice conversations: Hanasu.",
    "mnemonic_te": "ఇతరులతో సంభాషించడం / మాట్లాడడం."
  },
  {
    "id": "v_kaku",
    "word": "書く",
    "reading": "かく",
    "kanji": "書く",
    "furigana": "かく",
    "romaji": "kaku",
    "part_of_speech": "Godan Verb",
    "english": "To write",
    "telugu": "రాయడం",
    "telugu_phonetic": "కాకు",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "手紙を書きます。",
        "romaji": "Tegami o kakimasu.",
        "telugu_phonetic": "తెగామి ఒ కాకిమాసు.",
        "english": "I write a letter.",
        "telugu": "నేను ఉత్తరం రాస్తాను.",
        "grammar_notes": "Polite form: 書きます (kakimasu)."
      }
    ],
    "mnemonic_en": "Keep a pen and write: Kaku.",
    "mnemonic_te": "కాగితంపై అక్షరాలను రాయడం."
  },
  {
    "id": "v_kau",
    "word": "買う",
    "reading": "かう",
    "kanji": "買う",
    "furigana": "かう",
    "romaji": "kau",
    "part_of_speech": "Godan Verb",
    "english": "To buy / To purchase",
    "telugu": "కొనడం / కొనుగోలు చేయడం",
    "telugu_phonetic": "కావు",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "切符を買います。",
        "romaji": "Kippu o kaimasu.",
        "telugu_phonetic": "కిప్పు ఒ కాయిమాసు.",
        "english": "I buy a ticket.",
        "telugu": "నేను టికెట్ కొంటాను.",
        "grammar_notes": "Polite form: 買います (kaimasu)."
      }
    ],
    "mnemonic_en": "Cow purchases are costly: Kau (to buy).",
    "mnemonic_te": "దుకాణంలో వస్తువులు కొనడం."
  },
  {
    "id": "v_ookii",
    "word": "大きい",
    "reading": "おおきい",
    "kanji": "大きい",
    "furigana": "おおきい",
    "romaji": "ookii",
    "part_of_speech": "i-Adjective",
    "english": "Big / Large",
    "telugu": "పెద్దది / విశాలమైనది",
    "telugu_phonetic": "ఓకీ",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "これは大きい犬です。",
        "romaji": "Kore wa ookii inu desu.",
        "telugu_phonetic": "కొరె వా ఓకీ ఇను దెసు.",
        "english": "This is a big dog.",
        "telugu": "ఇది ఒక పెద్ద కుక్క.",
        "grammar_notes": "i-adjectives directly modify nouns without particles."
      }
    ],
    "mnemonic_en": "Spread arms wide: \"Oh, key is so big!\"",
    "mnemonic_te": "పరిమాణంలో పెద్దగా ఉన్న వస్తువు లేదా జంతువు."
  },
  {
    "id": "v_chiisai",
    "word": "小さい",
    "reading": "ちいさい",
    "kanji": "小さい",
    "furigana": "ちいさい",
    "romaji": "chiisai",
    "part_of_speech": "i-Adjective",
    "english": "Small / Little",
    "telugu": "చిన్నది",
    "telugu_phonetic": "చీసాయ్",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "小さい鳥がいます。",
        "romaji": "Chiisai tori ga imasu.",
        "telugu_phonetic": "చీసాయ్ తొరి గ ఇమాసు.",
        "english": "There is a small bird.",
        "telugu": "అక్కడ ఒక చిన్న పక్షి ఉంది.",
        "grammar_notes": "Opposite of 大きい (ookii)."
      }
    ],
    "mnemonic_en": "A tiny mouse says \"cheep\": Chiisai.",
    "mnemonic_te": "పరిమాణంలో చిన్నగా ఉన్నది."
  },
  {
    "id": "v_takai",
    "word": "高い",
    "reading": "たかい",
    "kanji": "高い",
    "furigana": "たかい",
    "romaji": "takai",
    "part_of_speech": "i-Adjective",
    "english": "High / Tall / Expensive",
    "telugu": "ఎత్తైనది / ఖరీదైనది",
    "telugu_phonetic": "తకాయ్",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "富士山は高い山です。",
        "romaji": "Fujisan wa takai yama desu.",
        "telugu_phonetic": "ఫుజిసాన్ వా తకాయ్ యామా దెసు.",
        "english": "Mount Fuji is a tall mountain.",
        "telugu": "ఫూజీ పర్వతం చాలా ఎత్తైన పర్వతం.",
        "grammar_notes": "Means both tall/high and expensive depending on context."
      }
    ],
    "mnemonic_en": "Tower reaches so high: Takai.",
    "mnemonic_te": "ఎత్తుగా లేదా ఎక్కువ వెల గలది."
  },
  {
    "id": "v_yasui",
    "word": "安い",
    "reading": "やすい",
    "kanji": "安い",
    "furigana": "やすい",
    "romaji": "yasui",
    "part_of_speech": "i-Adjective",
    "english": "Cheap / Inexpensive / Peaceful",
    "telugu": "చవకైనది / తక్కువ ధర",
    "telugu_phonetic": "యాసుయి",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "このりんごは安いです。",
        "romaji": "Kono ringo wa yasui desu.",
        "telugu_phonetic": "కొనొ రింగొ వా యాసుయి దెసు.",
        "english": "This apple is inexpensive.",
        "telugu": "ఈ ఆపిల్ చాలా చవకైనది.",
        "grammar_notes": "Opposite of 高い (takai) in price."
      }
    ],
    "mnemonic_en": "Yeah, so easy on the wallet: Yasui.",
    "mnemonic_te": "ధర తక్కువగా లభించే చవకైన వస్తువు."
  },
  {
    "id": "v_ii",
    "word": "いい",
    "reading": "いい",
    "kanji": "良い",
    "furigana": "いい",
    "romaji": "ii",
    "part_of_speech": "i-Adjective",
    "english": "Good / Fine / Nice",
    "telugu": "మంచిది / బాగుంది",
    "telugu_phonetic": "ఈ",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "天気がいいです。",
        "romaji": "Tenki ga ii desu.",
        "telugu_phonetic": "తెంకి గ ఈ దెసు.",
        "english": "The weather is good.",
        "telugu": "వాతావరణం బాగుంది.",
        "grammar_notes": "Conjugates from よい (yoi): negative is よくない (yokunai)."
      }
    ],
    "mnemonic_en": "Two thumbs up: \"Eee\" is great!",
    "mnemonic_te": "అనుకూలమైనది లేదా మంచిది."
  },
  {
    "id": "v_kore",
    "word": "これ",
    "reading": "これ",
    "furigana": "これ",
    "romaji": "kore",
    "part_of_speech": "Demonstrative",
    "english": "This (near the speaker)",
    "telugu": "ఇది (మాట్లాడేవారి దగ్గర ఉన్నది)",
    "telugu_phonetic": "కొరె",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "これはペンです。",
        "romaji": "Kore wa pen desu.",
        "telugu_phonetic": "కొరె వా పెన్ దెసు.",
        "english": "This is a pen.",
        "telugu": "ఇది ఒక కలం.",
        "grammar_notes": "これ refers to an item physically close to the speaker."
      }
    ],
    "mnemonic_en": "Core item close to me: Kore.",
    "mnemonic_te": "మాట్లాడే వ్యక్తికి దగ్గరగా ఉన్న వస్తువును \"ఇది\" అని సూచించడానికి వాడతారు."
  },
  {
    "id": "v_sore",
    "word": "それ",
    "reading": "それ",
    "furigana": "それ",
    "romaji": "sore",
    "part_of_speech": "Demonstrative",
    "english": "That (near the listener)",
    "telugu": "అది (వినేవారి దగ్గర ఉన్నది)",
    "telugu_phonetic": "సొరె",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "それは何ですか？",
        "romaji": "Sore wa nan desu ka?",
        "telugu_phonetic": "సొరె వా నాన్ దెసు కా?",
        "english": "What is that?",
        "telugu": "అది ఏమిటి?",
        "grammar_notes": "それ refers to an object near the listener."
      }
    ],
    "mnemonic_en": "So red is that item over there near you: Sore.",
    "mnemonic_te": "వినే వ్యక్తికి దగ్గరగా ఉన్న వస్తువును \"అది\" అని చెప్పడానికి వాడతారు."
  },
  {
    "id": "v_are",
    "word": "あれ",
    "reading": "あれ",
    "furigana": "あれ",
    "romaji": "are",
    "part_of_speech": "Demonstrative",
    "english": "That over there (far from both)",
    "telugu": "అక్కడ ఉన్నది (ఇద్దరికీ దూరంగా ఉన్నది)",
    "telugu_phonetic": "అరె",
    "jlpt_level": "N5",
    "category": "daily_life",
    "example_sentences": [
      {
        "japanese": "あれは富士山です。",
        "romaji": "Are wa Fujisan desu.",
        "telugu_phonetic": "అరె వా ఫుజిసాన్ దెసు.",
        "english": "That over there is Mount Fuji.",
        "telugu": "అక్కడ ఉన్నది ఫూజీ పర్వతం.",
        "grammar_notes": "あれ refers to something distant from both speaker and listener."
      }
    ],
    "mnemonic_en": "Look away far over there: Are.",
    "mnemonic_te": "ఇద్దరికీ దూరంగా ఎక్కడో ఉన్న వస్తువును సూచించే పదం."
  }
];
