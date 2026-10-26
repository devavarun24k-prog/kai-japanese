// src/data/kanjiData.ts
// Essential N5 Kanji with stroke paths, radicals, Telugu meanings, and mnemonics
import { KanjiItem } from '../types';

export const KANJI_DATA: KanjiItem[] = [
  {
    "id": "k_nichi",
    "character": "日",
    "on_readings": [
      "ニチ",
      "ジツ"
    ],
    "kun_readings": [
      "ひ",
      "-び",
      "-か"
    ],
    "on_telugu": [
      "నిచి",
      "జిత్సు"
    ],
    "kun_telugu": [
      "హి",
      "బి",
      "క"
    ],
    "meaning_en": [
      "Day",
      "Sun",
      "Japan"
    ],
    "meaning_te": [
      "రోజు",
      "సూర్యుడు",
      "దినము"
    ],
    "stroke_count": 4,
    "stroke_paths": [
      "M 35 25 L 35 75",
      "M 35 25 L 65 25 L 65 75",
      "M 35 50 L 65 50",
      "M 35 75 L 65 75"
    ],
    "radicals": [
      {
        "symbol": "日",
        "meaning_en": "Sun / Day",
        "meaning_te": "సూర్యుడు / రోజు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A window frame opening up to the bright morning Sun.",
    "mnemonic_te": "సూర్యుడి కాంతి వచ్చే కిటికీ తలుపు లాంటి చతురస్రాకారపు గది.",
    "compounds": [
      {
        "word": "日本",
        "reading": "にほん",
        "romaji": "nihon",
        "english": "Japan (Land of the Rising Sun)",
        "telugu": "జపాన్"
      },
      {
        "word": "今日",
        "reading": "きょう",
        "romaji": "kyou",
        "english": "Today",
        "telugu": "ఈ రోజు"
      },
      {
        "word": "毎日",
        "reading": "まいにち",
        "romaji": "mainichi",
        "english": "Every day",
        "telugu": "ప్రతి రోజూ"
      }
    ],
    "confusable_with": [
      {
        "character": "目",
        "difference": "目 (eye) has two horizontal lines inside; 日 has only one."
      },
      {
        "character": "白",
        "difference": "白 (white) has an extra top tick stroke."
      }
    ]
  },
  {
    "id": "k_hon",
    "character": "本",
    "on_readings": [
      "ホン"
    ],
    "kun_readings": [
      "もと"
    ],
    "on_telugu": [
      "హొన్"
    ],
    "kun_telugu": [
      "మొతొ"
    ],
    "meaning_en": [
      "Book",
      "Origin",
      "Main",
      "Root"
    ],
    "meaning_te": [
      "పుస్తకం",
      "మూలం",
      "ఆధారం"
    ],
    "stroke_count": 5,
    "stroke_paths": [
      "M 25 38 L 75 38",
      "M 50 18 L 50 78",
      "M 50 38 L 28 68",
      "M 50 38 L 72 68",
      "M 38 72 L 62 72"
    ],
    "radicals": [
      {
        "symbol": "木",
        "meaning_en": "Tree",
        "meaning_te": "చెట్టు"
      },
      {
        "symbol": "一",
        "meaning_en": "Base / Root line",
        "meaning_te": "వేరు సూచిక"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A tree (木) with a line marking its roots—the origin of paper, hence a Book!",
    "mnemonic_te": "చెట్టు వేరు వద్ద ఒక గీత గీశారు. చెట్టు నుంచి వచ్చే కాగితంతో చేసేది \"పుస్తకం\".",
    "compounds": [
      {
        "word": "本屋",
        "reading": "ほんや",
        "romaji": "honya",
        "english": "Bookstore",
        "telugu": "పుస్తకాల దుకాణం"
      },
      {
        "word": "日本語",
        "reading": "にほんご",
        "romaji": "nihongo",
        "english": "Japanese language",
        "telugu": "జపనీస్ భాష"
      }
    ],
    "confusable_with": [
      {
        "character": "木",
        "difference": "木 (tree) has no bottom horizontal line; 本 has the root line."
      }
    ]
  },
  {
    "id": "k_hito",
    "character": "人",
    "on_readings": [
      "ジン",
      "ニン"
    ],
    "kun_readings": [
      "ひと"
    ],
    "on_telugu": [
      "జిన్",
      "నిన్"
    ],
    "kun_telugu": [
      "హితొ"
    ],
    "meaning_en": [
      "Person",
      "Human"
    ],
    "meaning_te": [
      "వ్యక్తి",
      "మనిషి",
      "మానవుడు"
    ],
    "stroke_count": 2,
    "stroke_paths": [
      "M 50 22 C 45 45 35 68 22 78",
      "M 42 45 C 52 58 65 72 78 78"
    ],
    "radicals": [
      {
        "symbol": "人",
        "meaning_en": "Person radical",
        "meaning_te": "మనిషి"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Two legs walking forward: a human being standing tall.",
    "mnemonic_te": "రెండు కాళ్లతో నిలబడి నడుస్తున్న మనిషి ఆకారం.",
    "compounds": [
      {
        "word": "日本人",
        "reading": "にほんじん",
        "romaji": "nihonjin",
        "english": "Japanese person",
        "telugu": "జపనీయుడు"
      },
      {
        "word": "一人",
        "reading": "ひとり",
        "romaji": "hitori",
        "english": "One person / Alone",
        "telugu": "ఒక్కరే"
      },
      {
        "word": "大人",
        "reading": "おとな",
        "romaji": "otona",
        "english": "Adult",
        "telugu": "పెద్ద మనిషి / వయోజనుడు"
      }
    ],
    "confusable_with": [
      {
        "character": "入",
        "difference": "入 (enter) has the left stroke tucked under the right stroke."
      }
    ]
  },
  {
    "id": "k_mizu",
    "character": "水",
    "on_readings": [
      "スイ"
    ],
    "kun_readings": [
      "みず"
    ],
    "on_telugu": [
      "సుయి"
    ],
    "kun_telugu": [
      "మిజు"
    ],
    "meaning_en": [
      "Water"
    ],
    "meaning_te": [
      "నీరు",
      "నీళ్లు"
    ],
    "stroke_count": 4,
    "stroke_paths": [
      "M 50 20 L 50 78 C 50 82 45 80 42 76",
      "M 38 40 L 25 50",
      "M 25 52 L 40 74",
      "M 60 38 L 78 68"
    ],
    "radicals": [
      {
        "symbol": "水",
        "meaning_en": "Water",
        "meaning_te": "నీరు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A fountain splashing droplets of fresh water on both sides.",
    "mnemonic_te": "మధ్యలో వాటర్ ఫౌంటెన్ నుండి ఇరువైపులా చిందుతున్న నీటి బిందువులు.",
    "compounds": [
      {
        "word": "水曜日",
        "reading": "すいようび",
        "romaji": "suiyoubi",
        "english": "Wednesday (Water Day)",
        "telugu": "బుధవారం"
      },
      {
        "word": "水着",
        "reading": "みずぎ",
        "romaji": "mizugi",
        "english": "Swimsuit",
        "telugu": "స్విమ్‌సూట్"
      }
    ]
  },
  {
    "id": "k_yama",
    "character": "山",
    "on_readings": [
      "サン",
      "ザン"
    ],
    "kun_readings": [
      "やま"
    ],
    "on_telugu": [
      "సాన్",
      "జాన్"
    ],
    "kun_telugu": [
      "యామా"
    ],
    "meaning_en": [
      "Mountain"
    ],
    "meaning_te": [
      "కొండ",
      "పర్వతం"
    ],
    "stroke_count": 3,
    "stroke_paths": [
      "M 50 20 L 50 78",
      "M 25 45 L 25 78 L 75 78",
      "M 75 45 L 75 78"
    ],
    "radicals": [
      {
        "symbol": "山",
        "meaning_en": "Mountain",
        "meaning_te": "పర్వతం"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Three majestic mountain peaks side by side, like Mount Fuji.",
    "mnemonic_te": "మూడు శిఖరాలు గల పర్వతం ఆకారం (ఉదా: ఫూజీ పర్వతం).",
    "compounds": [
      {
        "word": "富士山",
        "reading": "ふじさん",
        "romaji": "fujisan",
        "english": "Mount Fuji",
        "telugu": "ఫూజీ పర్వతం"
      },
      {
        "word": "火山",
        "reading": "かざん",
        "romaji": "kazan",
        "english": "Volcano",
        "telugu": "అగ్నిపర్వతం"
      }
    ]
  },
  {
    "id": "k_kawa",
    "character": "川",
    "on_readings": [
      "セン"
    ],
    "kun_readings": [
      "かわ"
    ],
    "on_telugu": [
      "సెన్"
    ],
    "kun_telugu": [
      "కావా"
    ],
    "meaning_en": [
      "River",
      "Stream"
    ],
    "meaning_te": [
      "నది",
      "ఏరు / ప్రవాహం"
    ],
    "stroke_count": 3,
    "stroke_paths": [
      "M 30 25 C 28 45 25 65 20 75",
      "M 50 32 L 50 70",
      "M 70 20 L 70 80"
    ],
    "radicals": [
      {
        "symbol": "川",
        "meaning_en": "River",
        "meaning_te": "నది"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Three vertical streams of water flowing down a river bed.",
    "mnemonic_te": "నదిలో ప్రవహించే మూడు నీటి పాయల ఆకారం.",
    "compounds": [
      {
        "word": "川岸",
        "reading": "かわぎし",
        "romaji": "kawagishi",
        "english": "Riverbank",
        "telugu": "నది ఒడ్డు"
      },
      {
        "word": "小川",
        "reading": "おがわ",
        "romaji": "ogawa",
        "english": "Stream / Brook",
        "telugu": "చిన్న కాలువ"
      }
    ]
  },
  {
    "id": "k_ki",
    "character": "木",
    "on_readings": [
      "モク",
      "ボク"
    ],
    "kun_readings": [
      "き",
      "こ-"
    ],
    "on_telugu": [
      "మొకు",
      "బొకు"
    ],
    "kun_telugu": [
      "కి",
      "కొ"
    ],
    "meaning_en": [
      "Tree",
      "Wood"
    ],
    "meaning_te": [
      "చెట్టు",
      "కలప"
    ],
    "stroke_count": 4,
    "stroke_paths": [
      "M 25 40 L 75 40",
      "M 50 18 L 50 82",
      "M 50 40 L 25 72",
      "M 50 40 L 75 72"
    ],
    "radicals": [
      {
        "symbol": "木",
        "meaning_en": "Tree",
        "meaning_te": "చెట్టు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A tree trunk with branches reaching out and roots digging in.",
    "mnemonic_te": "కొమ్మలు, వేర్లు విస్తరించిన చెట్టు ఆకారం.",
    "compounds": [
      {
        "word": "木曜日",
        "reading": "もくようび",
        "romaji": "mokuyoubi",
        "english": "Thursday (Wood Day)",
        "telugu": "గురువారం"
      },
      {
        "word": "大木",
        "reading": "たいぼく",
        "romaji": "taiboku",
        "english": "Large tree",
        "telugu": "మహావృక్షం"
      }
    ],
    "confusable_with": [
      {
        "character": "本",
        "difference": "本 has a root marker line at the bottom."
      },
      {
        "character": "休",
        "difference": "休 has a person (亻) resting beside a tree."
      }
    ]
  },
  {
    "id": "k_hi",
    "character": "火",
    "on_readings": [
      "カ"
    ],
    "kun_readings": [
      "ひ",
      "-び",
      "ほ-"
    ],
    "on_telugu": [
      "కా"
    ],
    "kun_telugu": [
      "హి",
      "బి",
      "హొ"
    ],
    "meaning_en": [
      "Fire",
      "Flame"
    ],
    "meaning_te": [
      "నిప్పు",
      "అగ్ని",
      "మంట"
    ],
    "stroke_count": 4,
    "stroke_paths": [
      "M 35 45 C 32 52 28 58 25 65",
      "M 65 42 C 68 50 72 58 75 65",
      "M 50 20 C 48 45 42 68 32 82",
      "M 48 55 C 55 65 68 76 80 82"
    ],
    "radicals": [
      {
        "symbol": "火",
        "meaning_en": "Fire",
        "meaning_te": "అగ్ని"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Sparks flying upward around a leaping campfire flame.",
    "mnemonic_te": "పైకి లేచే మంటలు మరియు నిప్పు రవ్వల ఆకారం.",
    "compounds": [
      {
        "word": "火曜日",
        "reading": "かようび",
        "romaji": "kayoubi",
        "english": "Tuesday (Fire Day)",
        "telugu": "మంగళవారం"
      },
      {
        "word": "花火",
        "reading": "はなび",
        "romaji": "hanabi",
        "english": "Fireworks (Flower Fire)",
        "telugu": "బాణసంచా"
      },
      {
        "word": "火事",
        "reading": "かじ",
        "romaji": "kaji",
        "english": "Fire accident / Conflagration",
        "telugu": "అగ్ని ప్రమాదం"
      }
    ]
  },
  {
    "id": "k_kin",
    "character": "金",
    "on_readings": [
      "キン",
      "コン"
    ],
    "kun_readings": [
      "かね",
      "かな-"
    ],
    "on_telugu": [
      "కిన్",
      "కొన్"
    ],
    "kun_telugu": [
      "కానె",
      "కానా"
    ],
    "meaning_en": [
      "Gold",
      "Money",
      "Metal"
    ],
    "meaning_te": [
      "బంగారం",
      "డబ్బు",
      "లోహం"
    ],
    "stroke_count": 8,
    "stroke_paths": [
      "M 50 18 L 26 38",
      "M 50 18 L 74 38",
      "M 36 42 L 64 42",
      "M 50 42 L 50 78",
      "M 40 54 L 32 62",
      "M 60 54 L 68 62",
      "M 30 68 L 70 68",
      "M 20 82 L 80 82"
    ],
    "radicals": [
      {
        "symbol": "金",
        "meaning_en": "Gold / Metal",
        "meaning_te": "బంగారం / లోహం"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Gold nuggets buried under a roof inside the earth.",
    "mnemonic_te": "భూమిలో గని లోపల భద్రపరిచిన బంగారు నిధులు.",
    "compounds": [
      {
        "word": "金曜日",
        "reading": "きんようび",
        "romaji": "kinyoubi",
        "english": "Friday (Gold Day)",
        "telugu": "శుక్రవారం"
      },
      {
        "word": "お金",
        "reading": "おかね",
        "romaji": "okane",
        "english": "Money",
        "telugu": "డబ్బు"
      },
      {
        "word": "料金",
        "reading": "りょうきん",
        "romaji": "ryoukin",
        "english": "Fee / Charge",
        "telugu": "రుసుము"
      }
    ]
  },
  {
    "id": "k_tsuchi",
    "character": "土",
    "on_readings": [
      "ド",
      "ト"
    ],
    "kun_readings": [
      "つち"
    ],
    "on_telugu": [
      "దొ",
      "తొ"
    ],
    "kun_telugu": [
      "త్సుచి"
    ],
    "meaning_en": [
      "Earth",
      "Soil",
      "Ground"
    ],
    "meaning_te": [
      "మట్టి",
      "భూమి",
      "నేల"
    ],
    "stroke_count": 3,
    "stroke_paths": [
      "M 30 42 L 70 42",
      "M 50 20 L 50 78",
      "M 20 78 L 80 78"
    ],
    "radicals": [
      {
        "symbol": "土",
        "meaning_en": "Earth / Soil",
        "meaning_te": "మట్టి / నేల"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A green sprout emerging upwards from fertile ground soil.",
    "mnemonic_te": "మట్టి నేల నుండి మొలకెత్తుతున్న మొక్క ఆకారం.",
    "compounds": [
      {
        "word": "土曜日",
        "reading": "どようび",
        "romaji": "doyoubi",
        "english": "Saturday (Earth Day)",
        "telugu": "శనివారం"
      },
      {
        "word": "土地",
        "reading": "とち",
        "romaji": "tochi",
        "english": "Plot of land / Estate",
        "telugu": "భూమి / స్థలం"
      }
    ],
    "confusable_with": [
      {
        "character": "士",
        "difference": "士 (samurai) has a longer top line; 土 (earth) has a longer bottom line."
      }
    ]
  },
  {
    "id": "k_ichi",
    "character": "一",
    "on_readings": [
      "イチ",
      "イツ"
    ],
    "kun_readings": [
      "ひと-",
      "ひとつ"
    ],
    "on_telugu": [
      "ఇచి",
      "ఇత్సు"
    ],
    "kun_telugu": [
      "హితొ",
      "హితోత్సు"
    ],
    "meaning_en": [
      "One",
      "1"
    ],
    "meaning_te": [
      "ఒకటి",
      "1"
    ],
    "stroke_count": 1,
    "stroke_paths": [
      "M 20 50 L 80 50"
    ],
    "radicals": [
      {
        "symbol": "一",
        "meaning_en": "One radical",
        "meaning_te": "ఒకటి"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A single index finger held horizontally: number 1.",
    "mnemonic_te": "ఒకే ఒక అడ్డగీత: సంఖ్య 1.",
    "compounds": [
      {
        "word": "一日",
        "reading": "ついたち",
        "romaji": "tsuitachi",
        "english": "1st day of the month",
        "telugu": "నెలలో మొదటి రోజు"
      },
      {
        "word": "一つ",
        "reading": "ひとつ",
        "romaji": "hitotsu",
        "english": "One item",
        "telugu": "ఒక వస్తువు"
      },
      {
        "word": "一番",
        "reading": "いちばん",
        "romaji": "ichiban",
        "english": "Number one / Best",
        "telugu": "మొదటి స్థానం / అత్యుత్తమం"
      }
    ]
  },
  {
    "id": "k_ni",
    "character": "二",
    "on_readings": [
      "ニ",
      "ジ"
    ],
    "kun_readings": [
      "ふた-",
      "ふたつ"
    ],
    "on_telugu": [
      "ని",
      "జి"
    ],
    "kun_telugu": [
      "ఫుతా",
      "ఫుతాతూసు"
    ],
    "meaning_en": [
      "Two",
      "2"
    ],
    "meaning_te": [
      "రెండు",
      "2"
    ],
    "stroke_count": 2,
    "stroke_paths": [
      "M 30 38 L 70 38",
      "M 20 62 L 80 62"
    ],
    "radicals": [
      {
        "symbol": "二",
        "meaning_en": "Two radical",
        "meaning_te": "రెండు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Two horizontal lines: shorter on top, longer below: number 2.",
    "mnemonic_te": "రెండు సమాంతర గీతలు: సంఖ్య 2.",
    "compounds": [
      {
        "word": "二月",
        "reading": "にがつ",
        "romaji": "nigatsu",
        "english": "February",
        "telugu": "ఫిబ్రవరి నెల"
      },
      {
        "word": "二つ",
        "reading": "ふたつ",
        "romaji": "futatsu",
        "english": "Two items",
        "telugu": "రెండు వస్తువులు"
      },
      {
        "word": "二人",
        "reading": "ふたり",
        "romaji": "futari",
        "english": "Two people",
        "telugu": "ఇద్దరు వ్యక్తులు"
      }
    ]
  },
  {
    "id": "k_san",
    "character": "三",
    "on_readings": [
      "サン"
    ],
    "kun_readings": [
      "み-",
      "みっつ"
    ],
    "on_telugu": [
      "సాన్"
    ],
    "kun_telugu": [
      "మి",
      "మిత్సు"
    ],
    "meaning_en": [
      "Three",
      "3"
    ],
    "meaning_te": [
      "మూడు",
      "3"
    ],
    "stroke_count": 3,
    "stroke_paths": [
      "M 28 32 L 72 32",
      "M 35 50 L 65 50",
      "M 20 68 L 80 68"
    ],
    "radicals": [
      {
        "symbol": "一",
        "meaning_en": "One",
        "meaning_te": "ఒకటి"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Three horizontal strokes stacked together: number 3.",
    "mnemonic_te": "మూడు సమాంతర అడ్డగీతలు: సంఖ్య 3.",
    "compounds": [
      {
        "word": "三月",
        "reading": "さんがつ",
        "romaji": "sangatsu",
        "english": "March",
        "telugu": "మార్చి నెల"
      },
      {
        "word": "三つ",
        "reading": "みっつ",
        "romaji": "mittsu",
        "english": "Three items",
        "telugu": "మూడు వస్తువులు"
      },
      {
        "word": "三人",
        "reading": "さんにん",
        "romaji": "sannin",
        "english": "Three people",
        "telugu": "ముగ్గురు"
      }
    ]
  },
  {
    "id": "k_shi",
    "character": "四",
    "on_readings": [
      "シ"
    ],
    "kun_readings": [
      "よ-",
      "よん",
      "よっつ"
    ],
    "on_telugu": [
      "షి"
    ],
    "kun_telugu": [
      "యో",
      "యోన్",
      "యోత్సు"
    ],
    "meaning_en": [
      "Four",
      "4"
    ],
    "meaning_te": [
      "నాలుగు",
      "4"
    ],
    "stroke_count": 5,
    "stroke_paths": [
      "M 28 25 L 28 75",
      "M 28 25 L 72 25 L 72 75",
      "M 42 38 C 40 50 36 60 32 68",
      "M 56 38 L 62 55 L 68 55",
      "M 28 75 L 72 75"
    ],
    "radicals": [
      {
        "symbol": "囗",
        "meaning_en": "Enclosure radical",
        "meaning_te": "ఆవరణ"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A window with two curtains framing the four corners.",
    "mnemonic_te": "నాలుగు వైపులా సరిహద్దులు కలిగిన చతురస్రం.",
    "compounds": [
      {
        "word": "四月",
        "reading": "しがつ",
        "romaji": "shigatsu",
        "english": "April",
        "telugu": "ఏప్రిల్ నెల"
      },
      {
        "word": "四季",
        "reading": "しき",
        "romaji": "shiki",
        "english": "Four seasons",
        "telugu": "నాలుగు ఋతువులు"
      },
      {
        "word": "四つ",
        "reading": "よっつ",
        "romaji": "yottsu",
        "english": "Four items",
        "telugu": "నాలుగు వస్తువులు"
      }
    ]
  },
  {
    "id": "k_go",
    "character": "五",
    "on_readings": [
      "ゴ"
    ],
    "kun_readings": [
      "いつ-",
      "いつつ"
    ],
    "on_telugu": [
      "గొ"
    ],
    "kun_telugu": [
      "ఇత్సు",
      "ఇత్సుత్సు"
    ],
    "meaning_en": [
      "Five",
      "5"
    ],
    "meaning_te": [
      "ఐదు",
      "5"
    ],
    "stroke_count": 4,
    "stroke_paths": [
      "M 26 26 L 74 26",
      "M 46 26 L 40 74",
      "M 40 48 L 66 48 L 66 74",
      "M 20 74 L 80 74"
    ],
    "radicals": [
      {
        "symbol": "二",
        "meaning_en": "Two",
        "meaning_te": "రెండు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Five fingers counting across the abacus frame: number 5.",
    "mnemonic_te": "ఐదు గీతల కలయికతో ఏర్పడిన సంఖ్య 5.",
    "compounds": [
      {
        "word": "五月",
        "reading": "ごがつ",
        "romaji": "gogatsu",
        "english": "May",
        "telugu": "మే నెల"
      },
      {
        "word": "五つ",
        "reading": "いつつ",
        "romaji": "itsutsu",
        "english": "Five items",
        "telugu": "ఐదు వస్తువులు"
      },
      {
        "word": "五輪",
        "reading": "ごりん",
        "romaji": "gorin",
        "english": "Five Olympic Rings / Olympics",
        "telugu": "ఒలింపిక్స్"
      }
    ]
  },
  {
    "id": "k_roku",
    "character": "六",
    "on_readings": [
      "ロク"
    ],
    "kun_readings": [
      "む-",
      "むっつ",
      "むい-"
    ],
    "on_telugu": [
      "రొకు"
    ],
    "kun_telugu": [
      "ము",
      "ముత్సు",
      "ముయి"
    ],
    "meaning_en": [
      "Six",
      "6"
    ],
    "meaning_te": [
      "ఆరు",
      "6"
    ],
    "stroke_count": 4,
    "stroke_paths": [
      "M 50 18 L 50 28",
      "M 22 36 L 78 36",
      "M 40 50 C 35 62 28 72 20 80",
      "M 60 50 C 66 62 72 72 80 80"
    ],
    "radicals": [
      {
        "symbol": "八",
        "meaning_en": "Eight / Dividing legs",
        "meaning_te": "రెండు కాళ్లు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A little running figure with outstretched legs: number 6.",
    "mnemonic_te": "రెండు కాళ్లతో పరిగెడుతున్న బొమ్మ: సంఖ్య 6.",
    "compounds": [
      {
        "word": "六月",
        "reading": "ろくがつ",
        "romaji": "rokugatsu",
        "english": "June",
        "telugu": "జూన్ నెల"
      },
      {
        "word": "六つ",
        "reading": "むっつ",
        "romaji": "muttsu",
        "english": "Six items",
        "telugu": "ఆరు వస్తువులు"
      },
      {
        "word": "六日",
        "reading": "むいか",
        "romaji": "muika",
        "english": "6th day of the month",
        "telugu": "నెలలో 6వ రోజు"
      }
    ]
  },
  {
    "id": "k_shichi",
    "character": "七",
    "on_readings": [
      "シチ"
    ],
    "kun_readings": [
      "なな",
      "ななつ",
      "なの-"
    ],
    "on_telugu": [
      "షిచి"
    ],
    "kun_telugu": [
      "నానా",
      "నానాతూసు",
      "నానొ"
    ],
    "meaning_en": [
      "Seven",
      "7"
    ],
    "meaning_te": [
      "ఏడు",
      "7"
    ],
    "stroke_count": 2,
    "stroke_paths": [
      "M 24 50 L 76 42",
      "M 48 24 L 48 68 C 48 78 62 78 72 72"
    ],
    "radicals": [
      {
        "symbol": "一",
        "meaning_en": "One",
        "meaning_te": "ఒకటి"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "An upside-down number 7 with a cut through it.",
    "mnemonic_te": "తలక్రిందులుగా ఉన్న ఏడు (7) సంఖ్య.",
    "compounds": [
      {
        "word": "七月",
        "reading": "しちがつ",
        "romaji": "shichigatsu",
        "english": "July",
        "telugu": "జూలై నెల"
      },
      {
        "word": "七つ",
        "reading": "ななつ",
        "romaji": "nanatsu",
        "english": "Seven items",
        "telugu": "ఏడు వస్తువులు"
      },
      {
        "word": "七夕",
        "reading": "たなばた",
        "romaji": "tanabata",
        "english": "Star Festival",
        "telugu": "తనాబాతా నక్షత్ర పండుగ"
      }
    ]
  },
  {
    "id": "k_hachi",
    "character": "八",
    "on_readings": [
      "ハチ"
    ],
    "kun_readings": [
      "や-",
      "やっつ",
      "よう-"
    ],
    "on_telugu": [
      "హాచి"
    ],
    "kun_telugu": [
      "యా",
      "యాత్సు",
      "యో"
    ],
    "meaning_en": [
      "Eight",
      "8"
    ],
    "meaning_te": [
      "ఎనిమిది",
      "8"
    ],
    "stroke_count": 2,
    "stroke_paths": [
      "M 42 28 C 38 48 30 68 20 80",
      "M 54 22 C 60 45 70 66 82 82"
    ],
    "radicals": [
      {
        "symbol": "八",
        "meaning_en": "Eight",
        "meaning_te": "ఎనిమిది"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "Mount Fuji spreading wide at the base: auspicious number 8.",
    "mnemonic_te": "పర్వతంలా విస్తరించిన రెండు రేఖలు: శుభప్రదమైన సంఖ్య 8.",
    "compounds": [
      {
        "word": "八月",
        "reading": "はちがつ",
        "romaji": "hachigatsu",
        "english": "August",
        "telugu": "ఆగస్టు నెల"
      },
      {
        "word": "八つ",
        "reading": "やっつ",
        "romaji": "yattsu",
        "english": "Eight items",
        "telugu": "ఎనిమిది వస్తువులు"
      },
      {
        "word": "八百屋",
        "reading": "やおや",
        "romaji": "yaoya",
        "english": "Greengrocer",
        "telugu": "కూరగాయల దుకాణం"
      }
    ],
    "confusable_with": [
      {
        "character": "人",
        "difference": "人 (person) strokes cross/touch at top; 八 strokes stay separated."
      },
      {
        "character": "入",
        "difference": "入 (enter) has right stroke overlapping the left."
      }
    ]
  },
  {
    "id": "k_kyuu",
    "character": "九",
    "on_readings": [
      "キュウ",
      "ク"
    ],
    "kun_readings": [
      "ここの-",
      "ここのつ"
    ],
    "on_telugu": [
      "క్యూ",
      "కు"
    ],
    "kun_telugu": [
      "కొకొనొ",
      "కొకొనోత్సు"
    ],
    "meaning_en": [
      "Nine",
      "9"
    ],
    "meaning_te": [
      "తొమ్మిది",
      "9"
    ],
    "stroke_count": 2,
    "stroke_paths": [
      "M 48 24 C 44 48 36 68 24 82",
      "M 32 40 L 72 34 C 76 34 78 38 76 44 L 68 68 C 66 78 72 82 80 78"
    ],
    "radicals": [
      {
        "symbol": "乙",
        "meaning_en": "Second / Winding hook",
        "meaning_te": "వంపు గుర్తు"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A gymnast flexing muscular arm before the 10th count: number 9.",
    "mnemonic_te": "బలాన్ని ప్రదర్శిస్తున్న చేయి ఆకారం: సంఖ్య 9.",
    "compounds": [
      {
        "word": "九月",
        "reading": "くがつ",
        "romaji": "kugatsu",
        "english": "September",
        "telugu": "సెప్టెంబర్ నెల"
      },
      {
        "word": "九つ",
        "reading": "ここのつ",
        "romaji": "kokonotsu",
        "english": "Nine items",
        "telugu": "తొమ్మిది వస్తువులు"
      },
      {
        "word": "九州",
        "reading": "きゅうしゅう",
        "romaji": "kyuushuu",
        "english": "Kyushu (9 provinces island)",
        "telugu": "క్యూషూ ద్వీపం"
      }
    ],
    "confusable_with": [
      {
        "character": "丸",
        "difference": "丸 (circle) has an interior dot stroke; 九 does not."
      },
      {
        "character": "力",
        "difference": "力 (power) has the vertical stroke break through the top horizontal."
      }
    ]
  },
  {
    "id": "k_juu",
    "character": "十",
    "on_readings": [
      "ジュウ",
      "ジッ-"
    ],
    "kun_readings": [
      "とお",
      "と"
    ],
    "on_telugu": [
      "జ్యూ",
      "జిత్"
    ],
    "kun_telugu": [
      "తో",
      "తొ"
    ],
    "meaning_en": [
      "Ten",
      "10"
    ],
    "meaning_te": [
      "పది",
      "10"
    ],
    "stroke_count": 2,
    "stroke_paths": [
      "M 24 50 L 76 50",
      "M 50 20 L 50 80"
    ],
    "radicals": [
      {
        "symbol": "十",
        "meaning_en": "Ten",
        "meaning_te": "పది"
      }
    ],
    "jlpt_level": "N5",
    "mnemonic_en": "A complete cross reaching in all directions: complete number 10.",
    "mnemonic_te": "కూడిక గుర్తు లాంటి సంపూర్ణ సంఖ్య 10.",
    "compounds": [
      {
        "word": "十月",
        "reading": "じゅうがつ",
        "romaji": "juugatsu",
        "english": "October",
        "telugu": "అక్టోబర్ నెల"
      },
      {
        "word": "十日",
        "reading": "とおか",
        "romaji": "tooka",
        "english": "10th day of the month",
        "telugu": "నెలలో 10వ రోజు"
      },
      {
        "word": "十分",
        "reading": "じゅうぶん",
        "romaji": "juubun",
        "english": "Enough / Sufficient",
        "telugu": "సరిపడా / చాలినంత"
      }
    ],
    "confusable_with": [
      {
        "character": "千",
        "difference": "千 (thousand) has a slanted top tick stroke."
      }
    ]
  }
];
