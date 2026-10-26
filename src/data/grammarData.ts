// src/data/grammarData.ts
// Structured N5/N4 Grammar curriculum with trilingual breakdowns and practice questions
import { GrammarPattern } from '../types';

export const GRAMMAR_DATA: GrammarPattern[] = [
  {
    "id": "g_wa_desu",
    "title": "A は B です (A is B)",
    "title_jp": "A は B です",
    "structure": "[Noun A] は [Noun B] です",
    "jlpt_level": "N5",
    "category": "sentence_structure",
    "meaning_en": "A is B (polite statement of identity, state, or nationality)",
    "meaning_te": "A అనేది B అవుతుంది (మర్యాదపూర్వక వాక్యం)",
    "explanation_en": "The foundational Japanese sentence pattern. は (written as \"ha\", pronounced \"wa\") marks the topic (\"As for A...\"). です (desu) functions like \"is/am/are\" in polite Japanese, giving the sentence a respectful tone.",
    "explanation_te": "జపనీస్ భాషలో అత్యంత ముఖ్యమైన మొదటి వాక్య నిర్మాణం. は (రాతలో \"హా\", పలకడంలో \"వా\") సబ్జెక్ట్ లేదా టాపిక్‌ను సూచిస్తుంది. です (దెసు) వాక్యాన్ని గౌరవంగా ముగించే \"అవును/ఉన్నాను\" లాంటి పదం.",
    "formation_rules": [
      {
        "rule": "Affirmative: Noun A + は + Noun B + です",
        "example": "わたし は がくせい です (I am a student)"
      },
      {
        "rule": "Negative: Noun A + は + Noun B + ではありません",
        "example": "わたし は せんせい ではありません (I am not a teacher)"
      },
      {
        "rule": "Past: Noun A + は + Noun B + でした",
        "example": "きのう は あめ でした (Yesterday was rainy)"
      },
      {
        "rule": "Past Negative: Noun A + は + Noun B + ではありませんでした",
        "example": "きのう は やすみ ではありませんでした (Yesterday was not a holiday)"
      }
    ],
    "examples": [
      {
        "japanese": "これは本です。",
        "romaji": "Kore wa hon desu.",
        "telugu_phonetic": "కొరె వా హొన్ దెసు.",
        "english": "This is a book.",
        "telugu": "ఇది ఒక పుస్తకం.",
        "breakdown": [
          {
            "part": "これ",
            "role": "Pronoun",
            "meaning_en": "This",
            "meaning_te": "ఇది"
          },
          {
            "part": "は",
            "role": "Topic Particle (pronounced wa)",
            "meaning_en": "As for",
            "meaning_te": "గురించి"
          },
          {
            "part": "本",
            "role": "Noun",
            "meaning_en": "Book",
            "meaning_te": "పుస్తకం"
          },
          {
            "part": "です",
            "role": "Polite Copula",
            "meaning_en": "is",
            "meaning_te": "అవును"
          }
        ]
      },
      {
        "japanese": "私は学生です。",
        "romaji": "Watashi wa gakusei desu.",
        "telugu_phonetic": "వతాషి వా గాకుసేయ్ దెసు.",
        "english": "I am a student.",
        "telugu": "నేను ఒక విద్యార్థిని.",
        "breakdown": [
          {
            "part": "私",
            "role": "Pronoun",
            "meaning_en": "I",
            "meaning_te": "నేను"
          },
          {
            "part": "は",
            "role": "Topic Particle",
            "meaning_en": "As for",
            "meaning_te": "గురించి"
          },
          {
            "part": "学生",
            "role": "Noun",
            "meaning_en": "Student",
            "meaning_te": "విద్యార్థి"
          },
          {
            "part": "です",
            "role": "Copula",
            "meaning_en": "am",
            "meaning_te": "అవును"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "わたし わ がくせい です (Writing わ instead of は)",
        "correct": "わたし は がくせい です",
        "explanation_en": "Even though pronounced \"wa\", the grammatical topic particle must always be written with the hiragana character は (ha).",
        "explanation_te": "పలికేటప్పుడు \"వా\" అని పలికినప్పటికీ, అక్షరం రాసేటప్పుడు ఖచ్చితంగా は (హా) అనే రాయాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Choose the correct particle for topic marker: わたし ＿＿ 田中 です。",
        "options": [
          "は (wa)",
          "が (ga)",
          "を (o)",
          "に (ni)"
        ],
        "correct_index": 0,
        "explanation_en": "は (written as ha, pronounced wa) introduces the topic: \"As for me, I am Tanaka.\"",
        "explanation_te": "టాపిక్‌ను సూచించడానికి \"は\" (wa) వాడాలి."
      },
      {
        "prompt": "How do you say \"Yesterday was a holiday\" in polite Japanese?",
        "options": [
          "きのう は やすみ でした",
          "きのう は やすみ です",
          "きのう は やすみ だ",
          "きのう は やすみ ではありません"
        ],
        "correct_index": 0,
        "explanation_en": "でした is the polite past tense of です.",
        "explanation_te": "గత కాలాన్ని (Past Tense) గౌరవంగా చెప్పడానికి \"でした\" వాడాలి."
      }
    ]
  },
  {
    "id": "g_ka_question",
    "title": "Sentence + か (Question Particle)",
    "title_jp": "文 + か",
    "structure": "[Sentence] + か",
    "jlpt_level": "N5",
    "category": "questions",
    "meaning_en": "Turns any statement into a polite question (verbal question mark)",
    "meaning_te": "వాక్యం చివర చేర్చి ప్రశ్నగా మార్చే అక్షరం (ప్రశ్నార్థకం)",
    "explanation_en": "In Japanese, questions are formed simply by adding the particle か (ka) to the end of a sentence. No change in word order is required, and formal Japanese rarely needs a question mark (?) because か already signifies the question.",
    "explanation_te": "జపనీస్‌లో ప్రశ్న అడగడం చాలా సులభం! వాక్యం చివర \"か\" చేరిస్తే అది ప్రశ్నగా మారుతుంది. వాక్య క్రమాన్ని మార్చాల్సిన అవసరం లేదు.",
    "formation_rules": [
      {
        "rule": "[Polite Sentence] + か",
        "example": "これ は なん です か？ (What is this?)"
      },
      {
        "rule": "Answering Yes: はい、[Sentence] です",
        "example": "はい、そうです (Yes, that is right)"
      },
      {
        "rule": "Answering No: いいえ、[Negative]",
        "example": "いいえ、ちがいます (No, that is different)"
      }
    ],
    "examples": [
      {
        "japanese": "田中さんは先生ですか？",
        "romaji": "Tanaka-san wa sensei desu ka?",
        "telugu_phonetic": "తనకా-సాన్ వా సెన్సేయ్ దెసు కా?",
        "english": "Is Mr. Tanaka a teacher?",
        "telugu": "తనకా గారు ఉపాధ్యాయులా?",
        "breakdown": [
          {
            "part": "田中さん",
            "role": "Proper Noun + Honorific",
            "meaning_en": "Mr. Tanaka",
            "meaning_te": "తనకా గారు"
          },
          {
            "part": "は",
            "role": "Topic Marker",
            "meaning_en": "As for",
            "meaning_te": "గురించి"
          },
          {
            "part": "先生",
            "role": "Noun",
            "meaning_en": "Teacher",
            "meaning_te": "ఉపాధ్యాయుడు"
          },
          {
            "part": "ですか",
            "role": "Copula + Question Particle",
            "meaning_en": "is he?",
            "meaning_te": "అవునా?"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "Falling pitch on か in questions",
        "correct": "Rise pitch slightly on か",
        "explanation_en": "Maintain a gentle, slight upward intonation on か to sound natural and polite.",
        "explanation_te": "ప్రశ్న అడిగేటప్పుడు \"కా\" వద్ద స్వరం కొద్దిగా పైకి లేపాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Turn \"これは水です\" (This is water) into a polite question:",
        "options": [
          "これは水ですか",
          "これは水ですね",
          "これは水でよ",
          "これは水でした"
        ],
        "correct_index": 0,
        "explanation_en": "Adding か to the end forms a question: \"Is this water?\".",
        "explanation_te": "వాక్యం చివర \"か\" చేరిస్తే అది \"ఇది నీళ్లా?\" అనే ప్రశ్న అవుతుంది."
      }
    ]
  },
  {
    "id": "g_wo_object",
    "title": "Noun + を + Verb (Direct Object Particle)",
    "title_jp": "名詞 + を + 動詞",
    "structure": "[Noun] を [Transitive Verb]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Marks the direct object receiving the action of the verb",
    "meaning_te": "పని చేయబడుతున్న వస్తువును (కర్మ / Direct Object) సూచిస్తుంది",
    "explanation_en": "The particle を (written as \"wo\", pronounced \"o\") connects a transitive action verb with its target. In Japanese word order (SOV), the object comes before the verb.",
    "explanation_te": "మనం ఏ వస్తువుపై పని చేస్తున్నామో చెప్పడానికి を వాడతారు. తెలుగులో \"అన్నం తింటున్నాను\" అన్నప్పుడు అన్నం తర్వాత వచ్చే సంబంధం లాంటిది.",
    "formation_rules": [
      {
        "rule": "Noun + を + 食べます (tabemasu - eat)",
        "example": "ごはん を たべます (Eat a meal)"
      },
      {
        "rule": "Noun + を + 飲みます (nomimasu - drink)",
        "example": "おちゃ を のみます (Drink green tea)"
      },
      {
        "rule": "Noun + を + 見ます (mimasu - see/watch)",
        "example": "テレビ を みます (Watch TV)"
      }
    ],
    "examples": [
      {
        "japanese": "水を飲みます。",
        "romaji": "Mizu o nomimasu.",
        "telugu_phonetic": "మిజు ఒ నొమిమాసు.",
        "english": "I drink water.",
        "telugu": "నేను నీళ్లు త్రాగుతాను.",
        "breakdown": [
          {
            "part": "水",
            "role": "Direct Object Noun",
            "meaning_en": "Water",
            "meaning_te": "నీరు"
          },
          {
            "part": "を",
            "role": "Object Marker (pronounced o)",
            "meaning_en": "[object marker]",
            "meaning_te": "[కర్మ కారకం]"
          },
          {
            "part": "飲みます",
            "role": "Polite Verb",
            "meaning_en": "drink",
            "meaning_te": "త్రాగుతాను"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "水 お 飲みます (Writing お instead of を)",
        "correct": "水 を 飲みます",
        "explanation_en": "The direct object particle is always written with the hiragana character を (wo), never お (o).",
        "explanation_te": "ఆబ్జెక్ట్ మార్కర్‌గా ఎల్లప్పుడూ を మాత్రమే రాయాలి, お కాదు."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Fill in the blank: ご飯 ＿＿ 食べます (I eat rice).",
        "options": [
          "を (o)",
          "は (wa)",
          "に (ni)",
          "で (de)"
        ],
        "correct_index": 0,
        "explanation_en": "ご飯 is the direct object being eaten, so を is required.",
        "explanation_te": "తినే వస్తువు (అన్నం) కాబట్టి ఆబ్జెక్ట్ మార్కర్ \"を\" వాడాలి."
      }
    ]
  },
  {
    "id": "g_de_location",
    "title": "Place + で + Action Verb (Location of Action)",
    "title_jp": "場所 + で + 動詞",
    "structure": "[Place] で [Action Verb] / [Vehicle] で [Go]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Indicates the place where an action occurs (\"at\" / \"in\"), or the means/tool (\"by\" / \"with\")",
    "meaning_te": "పని జరిగే స్థలాన్ని (\"లో / వద్ద\") లేదా ప్రయాణ సాధనాన్ని (\"ద్వారా\") సూచిస్తుంది",
    "explanation_en": "で (de) marks the physical setting of an activity. Do not confuse with destination particle に (ni) which is used with verbs of movement (ikimasu) or existence (arimasu, imasu). で also marks vehicles and tools (e.g., densha de = by train; hashi de = with chopsticks).",
    "explanation_te": "లైబ్రరీలో చదువుతున్నాను, రెస్టారెంట్‌లో తింటున్నాను లాగా ఏదైనా పని జరిగే ప్రదేశాన్ని చెప్పడానికి \"で\" వాడతారు. అలాగే బస్సు ద్వారా, రైలు ద్వారా అన్నప్పుడు కూడా で వాడతారు.",
    "formation_rules": [
      {
        "rule": "[Location] + で + [Action]",
        "example": "としょかん で べんきょう します (Study at the library)"
      },
      {
        "rule": "[Means/Vehicle] + で + [Movement]",
        "example": "でんしゃ で いきます (Go by train)"
      },
      {
        "rule": "[Tool/Language] + で + [Action]",
        "example": "にほんご で はなします (Speak in Japanese)"
      }
    ],
    "examples": [
      {
        "japanese": "図書館で本を読みます。",
        "romaji": "Toshokan de hon o yomimasu.",
        "telugu_phonetic": "తొశొకాన్ దె హొన్ ఒ యొమిమాసు.",
        "english": "I read books at the library.",
        "telugu": "నేను గ్రంథాలయంలో పుస్తకాలు చదువుతాను.",
        "breakdown": [
          {
            "part": "図書館",
            "role": "Location Noun",
            "meaning_en": "Library",
            "meaning_te": "గ్రంథాలయం"
          },
          {
            "part": "で",
            "role": "Location Particle",
            "meaning_en": "at / in",
            "meaning_te": "లో"
          },
          {
            "part": "本",
            "role": "Object Noun",
            "meaning_en": "Book",
            "meaning_te": "పుస్తకం"
          },
          {
            "part": "を",
            "role": "Object Particle",
            "meaning_en": "[object]",
            "meaning_te": "ని"
          },
          {
            "part": "読みます",
            "role": "Action Verb",
            "meaning_en": "read",
            "meaning_te": "చదువుతాను"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "図書館 に 本を読みます",
        "correct": "図書館 で 本を読みます",
        "explanation_en": "Reading is an active action, so you must use で, not に.",
        "explanation_te": "చదవడం అనేది ఒక పని కాబట్టి に బదులుగా で వాడాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Fill in the blank: レストラン ＿＿ 昼ご飯を食べます (I eat lunch at a restaurant).",
        "options": [
          "で (de)",
          "に (ni)",
          "へ (e)",
          "を (o)"
        ],
        "correct_index": 0,
        "explanation_en": "Eating is an action occurring at the restaurant, so で is used.",
        "explanation_te": "రెస్టారెంట్‌లో భోజనం చేసే పని జరుగుతోంది కాబట్టి \"で\" వాడాలి."
      }
    ]
  },
  {
    "id": "g_ni_time_dest",
    "title": "Time + に & Destination + に (Time and Target)",
    "title_jp": "時間 / 場所 + に",
    "structure": "[Specific Time] に / [Destination] に [Movement Verb]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Marks a specific point in time (\"at\") or a destination / arrival point (\"to\")",
    "meaning_te": "ఖచ్చితమైన సమయాన్ని (\"గంటలకు\") లేదా గమ్యస్థానాన్ని (\"కు / వద్దకు\") సూచిస్తుంది",
    "explanation_en": "に (ni) pinpoints an exact numerical time on the clock or calendar (e.g. 7-ji ni = at 7:00). It also marks the target destination of movement verbs like 行きます (go), 来ます (come), and 帰ります (return).",
    "explanation_te": "సమయాన్ని ఖచ్చితంగా చెప్పేటప్పుడు (7 గంటలకు, సోమవారం నాడు) మరియు వెళ్లే గమ్యస్థానాన్ని (స్కూల్‌కు, జపాన్‌కు) తెలపడానికి \"に\" వాడతారు.",
    "formation_rules": [
      {
        "rule": "[Specific Number Time] + に",
        "example": "しちじ に おきます (Wake up at 7:00)"
      },
      {
        "rule": "[Destination] + に + いきます",
        "example": "がっこう に いきます (Go to school)"
      },
      {
        "rule": "Relative times do NOT take に: きょう (today), あした (tomorrow), いま (now)",
        "example": "あした いきます (Go tomorrow - no に)"
      }
    ],
    "examples": [
      {
        "japanese": "七時に起きます。",
        "romaji": "Shichiji ni okimasu.",
        "telugu_phonetic": "షిచిజి ని ఒకిమాసు.",
        "english": "I wake up at 7 o'clock.",
        "telugu": "నేను 7 గంటలకు నిద్రలేస్తాను.",
        "breakdown": [
          {
            "part": "七時",
            "role": "Time Noun",
            "meaning_en": "7 o'clock",
            "meaning_te": "7 గంటలు"
          },
          {
            "part": "に",
            "role": "Time Particle",
            "meaning_en": "at",
            "meaning_te": "కు"
          },
          {
            "part": "起きます",
            "role": "Verb",
            "meaning_en": "wake up",
            "meaning_te": "నిద్రలేస్తాను"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "きょう に 行きます",
        "correct": "きょう 行きます (No に with relative time words)",
        "explanation_en": "Words like 今日 (today), 明日 (tomorrow), and 今 (now) are relative and never take に.",
        "explanation_te": "ఈ రోజు, రేపు, ఇప్పుడు వంటి సాధారణ పదాల తర్వాత に చేర్చకూడదు."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Which sentence correctly uses に?",
        "options": [
          "八時に学校へ行きます",
          "今日に学校へ行きます",
          "あしたに学校へ行きます",
          "いまに学校へ行きます"
        ],
        "correct_index": 0,
        "explanation_en": "八時 (8 o'clock) is a specific numerical clock time, so it takes に.",
        "explanation_te": "ఖచ్చితమైన సంఖ్య గల సమయం (8 గంటలకు) కాబట్టి に వాడాలి."
      }
    ]
  },
  {
    "id": "g_he_direction",
    "title": "Place + へ (Directional Particle)",
    "title_jp": "場所 + へ",
    "structure": "[Destination] へ [Movement Verb]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Points toward a destination or direction of travel (\"towards\" / \"to\")",
    "meaning_te": "వెళ్తున్న దిశను లేదా గమ్యాన్ని సూచిస్తుంది (\"వైపు / కు\")",
    "explanation_en": "The particle へ is written with the hiragana character \"he\" (へ), but is pronounced \"e\". It emphasizes the direction of motion towards a destination. While に focuses on arrival, へ focuses on heading towards.",
    "explanation_te": "రాతలో へ (హె) అని రాసి పలికేటప్పుడు \"ఎ\" (e) అని పలుకుతారు. ఒక దిశ వైపు ప్రయాణిస్తున్నట్లు చెప్పడానికి ఇది వాడతారు.",
    "formation_rules": [
      {
        "rule": "[Place] + へ + 行きます (ikimasu - go)",
        "example": "にほん へ いきます (Go to Japan)"
      },
      {
        "rule": "[Place] + へ + 帰ります (kaerimasu - return)",
        "example": "うち へ かえります (Return home)"
      }
    ],
    "examples": [
      {
        "japanese": "東京へ行きます。",
        "romaji": "Toukyou e ikimasu.",
        "telugu_phonetic": "తోక్యో ఎ ఇకిమాసు.",
        "english": "I will go to Tokyo.",
        "telugu": "నేను టోక్యోకు వెళ్తాను.",
        "breakdown": [
          {
            "part": "東京",
            "role": "Place Noun",
            "meaning_en": "Tokyo",
            "meaning_te": "టోక్యో"
          },
          {
            "part": "へ",
            "role": "Direction Particle (pronounced e)",
            "meaning_en": "towards",
            "meaning_te": "కు"
          },
          {
            "part": "行きます",
            "role": "Movement Verb",
            "meaning_en": "go",
            "meaning_te": "వెళ్తాను"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "とうきょう え いきます (Writing え instead of へ)",
        "correct": "とうきょう へ いきます",
        "explanation_en": "The directional particle must always be written with the hiragana character へ (he).",
        "explanation_te": "దిశను తెలిపే పార్టికల్ రాసేటప్పుడు ఖచ్చితంగా へ రాయాలి, え కాదు."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Select the correct particle for direction: 日本 ＿＿ 行きます。",
        "options": [
          "へ (e)",
          "で (de)",
          "を (o)",
          "は (wa)"
        ],
        "correct_index": 0,
        "explanation_en": "へ points toward the destination Japan.",
        "explanation_te": "గమ్యస్థానాన్ని సూచించడానికి \"へ\" (e) సరైనది."
      }
    ]
  },
  {
    "id": "g_no_possession",
    "title": "Noun A + の + Noun B (Possession & Modification)",
    "title_jp": "名詞 + の + 名詞",
    "structure": "[Noun A] の [Noun B]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Links two nouns: shows possession (\"'s\", \"of\") or acts as a modifier",
    "meaning_te": "రెండు నామవాచకాలను కలుపుతుంది: స్వంతం (\"యొక్క\") లేదా వర్ణన",
    "explanation_en": "の (no) acts like an apostrophe-s ('s) or \"of\". The first noun modifies the second noun. E.g., わたしの本 = my book; 日本語の先生 = teacher of Japanese language.",
    "explanation_te": "తెలుగులో \"యొక్క\" లాగా ఒకరి వస్తువు అని చెప్పడానికి (నా పుస్తకం, రాము యొక్క ఇల్లు) లేదా వర్ణించడానికి \"の\" వాడతారు.",
    "formation_rules": [
      {
        "rule": "Person + の + Object (Possession)",
        "example": "わたし の くるま (My car)"
      },
      {
        "rule": "Category + の + Item (Classification)",
        "example": "にほんご の ほん (Japanese language book)"
      },
      {
        "rule": "Organization + の + Person (Affiliation)",
        "example": "だいがく の せんせい (University teacher)"
      }
    ],
    "examples": [
      {
        "japanese": "これは私の本です。",
        "romaji": "Kore wa watashi no hon desu.",
        "telugu_phonetic": "కొరె వా వతాషి నొ హొన్ దెసు.",
        "english": "This is my book.",
        "telugu": "ఇది నా పుస్తకం.",
        "breakdown": [
          {
            "part": "これ",
            "role": "Pronoun",
            "meaning_en": "This",
            "meaning_te": "ఇది"
          },
          {
            "part": "は",
            "role": "Topic Marker",
            "meaning_en": "As for",
            "meaning_te": "గురించి"
          },
          {
            "part": "私",
            "role": "Pronoun",
            "meaning_en": "I",
            "meaning_te": "నేను"
          },
          {
            "part": "の",
            "role": "Possessive Particle",
            "meaning_en": "'s / my",
            "meaning_te": "యొక్క"
          },
          {
            "part": "本",
            "role": "Noun",
            "meaning_en": "Book",
            "meaning_te": "పుస్తకం"
          },
          {
            "part": "です",
            "role": "Copula",
            "meaning_en": "is",
            "meaning_te": "అవును"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "わたし 本 です (Missing の)",
        "correct": "わたし の 本 です",
        "explanation_en": "In Japanese, nouns cannot directly touch without a connector particle like の.",
        "explanation_te": "రెండు నామవాచకాలను కలపడానికి ఖచ్చితంగా \"の\" వాడాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Translate \"Japanese language book\" into Japanese:",
        "options": [
          "日本語の本",
          "日本語は本",
          "日本語で本",
          "日本語を本"
        ],
        "correct_index": 0,
        "explanation_en": "の connects the subject language (日本語) to the item (本).",
        "explanation_te": "రెండు నామవాచకాలను కలపడానికి \"日本語の本\" సరైనది."
      }
    ]
  },
  {
    "id": "g_to_companion",
    "title": "Noun + と + Noun (Exhaustive \"And\" & Companion \"With\")",
    "title_jp": "名詞 + と + 名詞",
    "structure": "[Noun A] と [Noun B] / [Person] と [Verb]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Links items exhaustively (\"and\") or marks a human companion (\"together with\")",
    "meaning_te": "వస్తువులను కలపడానికి (\"మరియు\") లేదా తోడుగా ఉండే వ్యక్తిని (\"తో\") సూచిస్తుంది",
    "explanation_en": "と (to) connects two or more nouns like \"and\" (listing all items completely). When placed after a person with an action verb, it means \"together with\" (e.g. 友達と行きます = I go with a friend).",
    "explanation_te": "రెండు వస్తువులను కలిపి చెప్పడానికి (పుస్తకం మరియు పెన్ను) లేదా ఒకరితో కలిసి పని చేసినప్పుడు (స్నేహితుడితో) \"と\" వాడతారు.",
    "formation_rules": [
      {
        "rule": "Noun A + と + Noun B (And)",
        "example": "りんご と みかん (Apple and orange)"
      },
      {
        "rule": "Person + と + Action (With)",
        "example": "ともだち と あそびます (Play with a friend)"
      }
    ],
    "examples": [
      {
        "japanese": "友達と話します。",
        "romaji": "Tomodachi to hanashimasu.",
        "telugu_phonetic": "తొమొదాచి తొ హనాషిమాసు.",
        "english": "I talk with my friend.",
        "telugu": "నేను నా స్నేహితుడితో మాట్లాడతాను.",
        "breakdown": [
          {
            "part": "友達",
            "role": "Noun",
            "meaning_en": "Friend",
            "meaning_te": "స్నేహితుడు"
          },
          {
            "part": "と",
            "role": "Companion Particle",
            "meaning_en": "with",
            "meaning_te": "తో"
          },
          {
            "part": "話します",
            "role": "Verb",
            "meaning_en": "talk / speak",
            "meaning_te": "మాట్లాడతాను"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "Using と to connect two whole sentences",
        "correct": "Use それから or 〜て form to link sentences; と only links nouns",
        "explanation_en": "と cannot connect sentences, only nouns.",
        "explanation_te": "と కేవలం నామవాచకాలను మాత్రమే కలుపుతుంది, వాక్యాలను కలపడానికి వాడకూడదు."
      }
    ],
    "practice_questions": [
      {
        "prompt": "How do you say \"I study with Mr. Tanaka\"?",
        "options": [
          "田中さんと勉強します",
          "田中さんは勉強します",
          "田中さんを勉強します",
          "田中さんで勉強します"
        ],
        "correct_index": 0,
        "explanation_en": "と marks Tanaka-san as the companion: \"with Tanaka-san\".",
        "explanation_te": "తనకా గారితో కలిసి అన్నప్పుడు \"田中さんと\" వాడాలి."
      }
    ]
  },
  {
    "id": "g_mo_also",
    "title": "Noun + も (Inclusion Particle \"Also / Too\")",
    "title_jp": "名詞 + も",
    "structure": "[Noun] も [Predicate]",
    "jlpt_level": "N5",
    "category": "particles",
    "meaning_en": "Replaces は, が, or を to indicate \"also\", \"too\", or \"as well\"",
    "meaning_te": "\"కూడా\" (also / too) అనే భావాన్ని వ్యక్తం చేసే అక్షరం",
    "explanation_en": "も (mo) replaces the topic marker は or object marker を when introducing an additional item sharing the same quality or action: \"X is also...\".",
    "explanation_te": "ఎవరైనా \"నేను విద్యార్థిని\" అన్నప్పుడు, మీరు \"నేను కూడా విద్యార్థిని\" అని చెప్పడానికి は బదులుగా \"も\" వాడాలి.",
    "formation_rules": [
      {
        "rule": "Replace は with も: わたし も がくせい です",
        "example": "I am also a student"
      },
      {
        "rule": "Replace を with も: おちゃ も のみます",
        "example": "I also drink green tea"
      }
    ],
    "examples": [
      {
        "japanese": "私も学生です。",
        "romaji": "Watashi mo gakusei desu.",
        "telugu_phonetic": "వతాషి మొ గాకుసేయ్ దెసు.",
        "english": "I am also a student.",
        "telugu": "నేను కూడా విద్యార్థినే.",
        "breakdown": [
          {
            "part": "私",
            "role": "Pronoun",
            "meaning_en": "I",
            "meaning_te": "నేను"
          },
          {
            "part": "も",
            "role": "Inclusion Particle",
            "meaning_en": "also / too",
            "meaning_te": "కూడా"
          },
          {
            "part": "学生",
            "role": "Noun",
            "meaning_en": "Student",
            "meaning_te": "విద్యార్థి"
          },
          {
            "part": "です",
            "role": "Copula",
            "meaning_en": "am",
            "meaning_te": "అవును"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "わたし は も 学生です (Stacking は and も)",
        "correct": "わたし も 学生です (も replaces は completely)",
        "explanation_en": "Never stack は and も together; も completely replaces は.",
        "explanation_te": "は మరియు も రెండింటినీ కలిపి వాడకూడదు. は స్థానంలో も మాత్రమే పెట్టాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "How do you say \"I also drink tea\"?",
        "options": [
          "お茶も飲みます",
          "お茶をも飲みます",
          "お茶はも飲みます",
          "お茶でも飲みます"
        ],
        "correct_index": 0,
        "explanation_en": "も replaces を completely: お茶も飲みます.",
        "explanation_te": "ఆబ్జెక్ట్ మార్కర్ స్థానంలో も నేరుగా వస్తుంది: お茶も飲みます."
      }
    ]
  },
  {
    "id": "g_arimasu_imasu",
    "title": "Existence: あります (Inanimate) vs います (Living Animate)",
    "title_jp": "存在: あります / います",
    "structure": "[Place] に [Subject] が あります / います",
    "jlpt_level": "N5",
    "category": "sentence_structure",
    "meaning_en": "Expresses existence or possession (\"there is / are\" or \"have\")",
    "meaning_te": "వస్తువులు లేదా జీవుల ఉనికిని (\"ఉంది / ఉన్నారు\") తెలియజేస్తుంది",
    "explanation_en": "Crucial distinction in Japanese: あります (arimasu) is used exclusively for non-living objects, plants, and concepts. います (imasu) is used exclusively for living, animate beings (people, animals, birds). The location of existence is marked with に, and the subject existing is marked with が.",
    "explanation_te": "జపనీస్‌లో జీవం లేని వస్తువులకు (పుస్తకం, కారు) \"あります\" వాడతారు. జీవం ఉన్న వ్యక్తులు, జంతువులకు (మనిషి, కుక్క) \"います\" వాడతారు. ఉండే స్థలానికి \"に\" మరియు ఉండే వస్తువుకు \"が\" వస్తుంది.",
    "formation_rules": [
      {
        "rule": "[Place] に [Inanimate] が あります",
        "example": "つくえ の うえ に 本 が あります (There is a book on the desk)"
      },
      {
        "rule": "[Place] に [Animate] が います",
        "example": "こうえん に 犬 が います (There is a dog in the park)"
      },
      {
        "rule": "Negative: ありません (does not exist) / いません (is not there)",
        "example": "じかん が ありません (I don't have time)"
      }
    ],
    "examples": [
      {
        "japanese": "机の上に本があります。",
        "romaji": "Tsukue no ue ni hon ga arimasu.",
        "telugu_phonetic": "త్సుకుయె నొ ఉయె ని హొన్ గా అరిమాసు.",
        "english": "There is a book on the desk.",
        "telugu": "బల్ల మీద పుస్తకం ఉంది.",
        "breakdown": [
          {
            "part": "机の上",
            "role": "Location Noun",
            "meaning_en": "Top of desk",
            "meaning_te": "బల్ల పైభాగం"
          },
          {
            "part": "に",
            "role": "Location Particle",
            "meaning_en": "on / at",
            "meaning_te": "మీద"
          },
          {
            "part": "本",
            "role": "Subject Noun",
            "meaning_en": "Book",
            "meaning_te": "పుస్తకం"
          },
          {
            "part": "が",
            "role": "Subject Particle",
            "meaning_en": "[subject]",
            "meaning_te": "[సబ్జెక్ట్]"
          },
          {
            "part": "あります",
            "role": "Inanimate Exist Verb",
            "meaning_en": "exists / there is",
            "meaning_te": "ఉంది"
          }
        ]
      },
      {
        "japanese": "部屋に猫がいます。",
        "romaji": "Heya ni neko ga imasu.",
        "telugu_phonetic": "హెయా ని నెకొ గా ఇమాసు.",
        "english": "There is a cat in the room.",
        "telugu": "గదిలో పిల్లి ఉంది.",
        "breakdown": [
          {
            "part": "部屋",
            "role": "Location Noun",
            "meaning_en": "Room",
            "meaning_te": "గది"
          },
          {
            "part": "に",
            "role": "Location Particle",
            "meaning_en": "in",
            "meaning_te": "లో"
          },
          {
            "part": "猫",
            "role": "Living Subject",
            "meaning_en": "Cat",
            "meaning_te": "పిల్లి"
          },
          {
            "part": "が",
            "role": "Subject Particle",
            "meaning_en": "[subject]",
            "meaning_te": "[సబ్జెక్ట్]"
          },
          {
            "part": "います",
            "role": "Living Exist Verb",
            "meaning_en": "exists (living)",
            "meaning_te": "ఉంది"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "部屋に猫があります (Using あります for living beings)",
        "correct": "部屋に猫がいます",
        "explanation_en": "Cats are living animals, so います is strictly mandatory.",
        "explanation_te": "పిల్లి సజీవ జంతువు కాబట్టి あります బదులు います వాడాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "Complete the sentence: 公園に子供が ＿＿。 (There is a child in the park).",
        "options": [
          "います",
          "あります",
          "します",
          "行きます"
        ],
        "correct_index": 0,
        "explanation_en": "Children are living beings, so います must be used.",
        "explanation_te": "పిల్లలు ప్రాణం ఉన్న వ్యక్తులు కాబట్టి \"います\" సరైన సమాధానం."
      }
    ]
  },
  {
    "id": "g_i_na_adjectives",
    "title": "Adjectives: い-Adjectives vs な-Adjectives (Conjugation)",
    "title_jp": "形容詞: い形容詞 と な形容詞",
    "structure": "[i-Adj] + Noun / [na-Adj] + な + Noun",
    "jlpt_level": "N5",
    "category": "adjectives",
    "meaning_en": "Descriptive words modifying nouns or acting as predicates in present and past",
    "meaning_te": "వస్తువుల గుణాలను వర్ణించే విశేషణాలు (ఇ-విశేషణాలు & నా-విశేషణాలు)",
    "explanation_en": "Japanese adjectives fall into two distinct groups:\n1. **い-adjectives (i-adj)**: End in い (e.g. 大きい, おいしい). Drop い and add くない for negative (おいしくない), or かった for past (おいしかった).\n2. **な-adjectives (na-adj)**: Act like nouns (e.g. 静か, 元気). Add な before a noun (静かな部屋). Negative is ではありません, and past is でした.",
    "explanation_te": "జపనీస్‌లో విశేషణాలు రెండు రకాలు: 1. \"ఇ-అడ్జెక్టివ్స్\" (చివర い ఉండేవి, ఉదా: おいしい - రుచికరమైనది). 2. \"నా-అడ్జెక్టివ్స్\" (పేర్ల ముందు な చేర్చేవి, ఉదా: しずかな - ప్రశాంతమైన).",
    "formation_rules": [
      {
        "rule": "i-Adj Present: おいしい です (is delicious)",
        "example": "おいしい です"
      },
      {
        "rule": "i-Adj Negative: おいしくない です (is not delicious)",
        "example": "おいしくない です"
      },
      {
        "rule": "i-Adj Past: おいしかった です (was delicious)",
        "example": "おいしかった です"
      },
      {
        "rule": "na-Adj before noun: しずか な へや (Quiet room)",
        "example": "しずかなへや"
      }
    ],
    "examples": [
      {
        "japanese": "このラーメンは美味しいです。",
        "romaji": "Kono raamen wa oishii desu.",
        "telugu_phonetic": "కొనొ రామెన్ వా ఒయిషీ దెసు.",
        "english": "This ramen is delicious.",
        "telugu": "ఈ రామెన్ చాలా రుచిగా ఉంది.",
        "breakdown": [
          {
            "part": "このラーメン",
            "role": "Noun Phrase",
            "meaning_en": "This ramen",
            "meaning_te": "ఈ రామెన్"
          },
          {
            "part": "は",
            "role": "Topic Marker",
            "meaning_en": "As for",
            "meaning_te": "గురించి"
          },
          {
            "part": "美味しい",
            "role": "i-Adjective",
            "meaning_en": "delicious",
            "meaning_te": "రుచికరమైన"
          },
          {
            "part": "です",
            "role": "Polite Copula",
            "meaning_en": "is",
            "meaning_te": "అవును"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "おいしいじゃない です (Treating i-adj like na-adj)",
        "correct": "おいしくない です",
        "explanation_en": "i-adjectives conjugate by changing the final い into くない, never じゃない.",
        "explanation_te": "ఇ-విశేషణాల నెగెటివ్ రూపం \"くない\" తో ఏర్పడుతుంది, じゃない కాదు."
      }
    ],
    "practice_questions": [
      {
        "prompt": "What is the negative form of 高い (takai - expensive)?",
        "options": [
          "高くない (takakunai)",
          "高いじゃない (takai janai)",
          "高くないでした (takakunai deshita)",
          "高かった (takakatta)"
        ],
        "correct_index": 0,
        "explanation_en": "高い drops い and adds くない → 高くない (not expensive).",
        "explanation_te": "高い లోని 'い' తీసేసి 'くない' చేరిస్తే 'తక్కువ ధర' అవుతుంది."
      }
    ]
  },
  {
    "id": "g_te_kudasai",
    "title": "Verb-て + ください (Polite Request)",
    "title_jp": "動詞 て形 + ください",
    "structure": "[Verb in て-form] + ください",
    "jlpt_level": "N5",
    "category": "requests",
    "meaning_en": "Polite request asking someone to please do an action (\"Please do...\")",
    "meaning_te": "దయచేసి ఒక పని చేయమని గౌరవంగా అభ్యర్థించే వాక్య నిర్మాణం",
    "explanation_en": "Formed by conjugating the verb into its Te-form and adding ください (kudasai). This is the standard polite formula for everyday instructions, requests, and directions.",
    "explanation_te": "క్రియ యొక్క తే-రూపానికి (Te-form) \"ください\" (కుదాసాయ్) చేరిస్తే అది \"దయచేసి చేయండి\" అనే మర్యాదపూర్వక అభ్యర్థనగా మారుతుంది.",
    "formation_rules": [
      {
        "rule": "食べて + ください → 食べてください (Please eat)",
        "example": "たべて ください"
      },
      {
        "rule": "見て + ください → 見てください (Please look)",
        "example": "みて ください"
      },
      {
        "rule": "待って + ください → 待ってください (Please wait)",
        "example": "まって ください"
      },
      {
        "rule": "書いて + ください → 書いてください (Please write)",
        "example": "かいて ください"
      }
    ],
    "examples": [
      {
        "japanese": "ちょっと待ってください。",
        "romaji": "Chotto matte kudasai.",
        "telugu_phonetic": "చొత్తో మత్తె కుదాసాయ్.",
        "english": "Please wait a moment.",
        "telugu": "దయచేసి కాసేపు వేచి ఉండండి.",
        "breakdown": [
          {
            "part": "ちょっと",
            "role": "Adverb",
            "meaning_en": "a little / a moment",
            "meaning_te": "కాసేపు"
          },
          {
            "part": "待って",
            "role": "Verb in Te-form",
            "meaning_en": "wait",
            "meaning_te": "వేచి"
          },
          {
            "part": "ください",
            "role": "Polite Request Suffix",
            "meaning_en": "please",
            "meaning_te": "ఉండండి"
          }
        ]
      }
    ],
    "common_mistakes": [
      {
        "incorrect": "待ちます ください (Using ます form with ください)",
        "correct": "待って ください (Must be in Te-form)",
        "explanation_en": "ください must strictly follow the verb's Te-form (て), never the masu-form.",
        "explanation_te": "క్రియ యొక్క తే-రూపం (て形) తర్వాతే ください వాడాలి."
      }
    ],
    "practice_questions": [
      {
        "prompt": "How do you say \"Please write your name\" in polite Japanese?",
        "options": [
          "名前を書いてください",
          "名前を書きてください",
          "名前を書きますください",
          "名前を書いて"
        ],
        "correct_index": 0,
        "explanation_en": "書く conjugates into Te-form as 書いて (kaite) + ください.",
        "explanation_te": "రాయడం (書く) యొక్క తే-ఫారం \"書いて\" + ください → 名前を書いてください."
      }
    ]
  }
];
