// src/features/electronics/japanese/termsPart1.ts
// Technical Japanese terms 1 to 40: Semiconductors, Physics, Wafer Fabrication & Cleanroom
import { TechnicalTermItem } from './types';

export const ELECTRONICS_TERMS_PART_1: TechnicalTermItem[] = [
  {
    id: 'elec_1',
    kanji: '半導体',
    kana: 'はんどうたい',
    romaji: 'handoutai',
    english: 'semiconductor',
    telugu: 'సెమికండక్టర్ (అర్ధవాహకం)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A material whose electrical conductivity lies between that of a conductor and an insulator.',
    kanjiBreakdown: [
      { kanji: '半', reading: 'はん (han)', meaningEn: 'half / semi' },
      { kanji: '導', reading: 'どう (dou)', meaningEn: 'lead / conduct' },
      { kanji: '体', reading: 'たい (tai)', meaningEn: 'body / substance' }
    ],
    workplaceExample: {
      ja: '日本の半導体産業は高品質な製造装置で有名です。',
      romaji: 'Nihon no handoutai sangyou wa kouhinshitsu na seizousouchi de yuumei desu.',
      en: 'The Japanese semiconductor industry is renowned for high-quality manufacturing equipment.'
    }
  },
  {
    id: 'elec_2',
    kanji: '集積回路',
    kana: 'しゅうせきかいろ',
    romaji: 'shuuseki kairo',
    english: 'integrated circuit (IC)',
    telugu: 'ఇంటిగ్రేటెడ్ సర్క్యూట్',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A miniature electronic circuit fabricated onto a semiconductor substrate.',
    kanjiBreakdown: [
      { kanji: '集', reading: 'しゅう (shuu)', meaningEn: 'gather / accumulate' },
      { kanji: '積', reading: 'せき (seki)', meaningEn: 'stack / pile' },
      { kanji: '回', reading: 'かい (kai)', meaningEn: 'turn / cycle' },
      { kanji: '路', reading: 'ろ (ro)', meaningEn: 'path / route' }
    ]
  },
  {
    id: 'elec_3',
    kanji: '基板',
    kana: 'きばん',
    romaji: 'kiban',
    english: 'substrate / printed circuit board',
    telugu: 'సర్క్యూట్ బోర్డ్ లేదా సబ్‌స్ట్రేట్',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A flat supporting material upon which electrical circuits are constructed.',
    kanjiBreakdown: [
      { kanji: '基', reading: 'き (ki)', meaningEn: 'base / foundation' },
      { kanji: '板', reading: 'ばん (ban)', meaningEn: 'board / plate' }
    ]
  },
  {
    id: 'elec_4',
    kanji: 'シリコンウェハー',
    kana: 'しりこんうぇはー',
    romaji: 'shirikon uehaa',
    english: 'silicon wafer',
    telugu: 'సిలికాన్ వేఫర్',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A thin disc of ultra-pure crystalline silicon used for fabricating microchips.'
  },
  {
    id: 'elec_5',
    kanji: '単結晶',
    kana: 'たんけっしょう',
    romaji: 'tankesshou',
    english: 'single crystal / monocrystal',
    telugu: 'ఏక స్ఫటికం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A solid material in which the crystal lattice is continuous and unbroken across the entire sample.',
    kanjiBreakdown: [
      { kanji: '単', reading: 'たん (tan)', meaningEn: 'single / sole' },
      { kanji: '結', reading: 'けつ (ketsu)', meaningEn: 'bind / tie' },
      { kanji: '晶', reading: 'しょう (shou)', meaningEn: 'crystal / sparkle' }
    ]
  },
  {
    id: 'elec_6',
    kanji: '多結晶',
    kana: 'たけっしょう',
    romaji: 'takesshou',
    english: 'polycrystalline',
    telugu: 'బహుళ స్ఫటికం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A material made up of many small crystals or grains with different orientations.',
    kanjiBreakdown: [
      { kanji: '多', reading: 'た (ta)', meaningEn: 'many / multi' },
      { kanji: '結', reading: 'けつ (ketsu)', meaningEn: 'bind / tie' },
      { kanji: '晶', reading: 'しょう (shou)', meaningEn: 'crystal / sparkle' }
    ]
  },
  {
    id: 'elec_7',
    kanji: '純度',
    kana: 'じゅんど',
    romaji: 'jundo',
    english: 'purity level',
    telugu: 'స్వచ్ఛత స్థాయి',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'The degree to which a substance is free from foreign impurities (e.g. 99.9999999% Nine-Nines silicon).',
    kanjiBreakdown: [
      { kanji: '純', reading: 'じゅん (jun)', meaningEn: 'pure / genuine' },
      { kanji: '度', reading: 'ど (do)', meaningEn: 'degree / measure' }
    ]
  },
  {
    id: 'elec_8',
    kanji: 'ドーピング',
    kana: 'どーぴんぐ',
    romaji: 'doopingu',
    english: 'doping',
    telugu: 'డోపింగ్ (మలినాలు కలపడం)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'The intentional addition of trace impurity atoms to modify semiconductor electrical conductivity.'
  },
  {
    id: 'elec_9',
    kanji: '不純物',
    kana: 'ふじゅんぶつ',
    romaji: 'fujunbutsu',
    english: 'impurity / contaminant',
    telugu: 'మలిన పదార్థం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Foreign chemical elements introduced or present in a material.',
    kanjiBreakdown: [
      { kanji: '不', reading: 'ふ (fu)', meaningEn: 'non / un-' },
      { kanji: '純', reading: 'じゅん (jun)', meaningEn: 'pure' },
      { kanji: '物', reading: 'ぶつ (butsu)', meaningEn: 'thing / matter' }
    ]
  },
  {
    id: 'elec_10',
    kanji: '電子',
    kana: 'でんし',
    romaji: 'denshi',
    english: 'electron',
    telugu: 'ఎలక్ట్రాన్',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A subatomic particle bearing a negative elementary electric charge.',
    kanjiBreakdown: [
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electricity' },
      { kanji: '子', reading: 'し (shi)', meaningEn: 'child / particle' }
    ]
  },
  {
    id: 'elec_11',
    kanji: '正孔',
    kana: 'せいこう',
    romaji: 'seikou',
    english: 'hole (carrier)',
    telugu: 'హోల్ (ధన ఆవేశ క్యారియర్)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'The absence of an electron in a valence band that acts as a positive charge carrier.',
    kanjiBreakdown: [
      { kanji: '正', reading: 'せい (sei)', meaningEn: 'positive / correct' },
      { kanji: '孔', reading: 'こう (kou)', meaningEn: 'hole / cavity' }
    ]
  },
  {
    id: 'elec_12',
    kanji: '酸化',
    kana: 'さんか',
    romaji: 'sanka',
    english: 'oxidation',
    telugu: 'ఆక్సీకరణం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Growing a protective silicon dioxide layer on a silicon wafer using high temperature and oxygen.',
    kanjiBreakdown: [
      { kanji: '酸', reading: 'さん (san)', meaningEn: 'acid / oxygen' },
      { kanji: '化', reading: 'か (ka)', meaningEn: 'change / transform' }
    ]
  },
  {
    id: 'elec_13',
    kanji: '酸化膜',
    kana: 'さんかまく',
    romaji: 'sankamaku',
    english: 'oxide film (SiO2)',
    telugu: 'ఆక్సైడ్ పొర',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A thin insulating film of silicon dioxide grown on the wafer surface.',
    kanjiBreakdown: [
      { kanji: '酸', reading: 'さん (san)', meaningEn: 'oxygen' },
      { kanji: '化', reading: 'か (ka)', meaningEn: 'transformation' },
      { kanji: '膜', reading: 'まく (maku)', meaningEn: 'membrane / film' }
    ]
  },
  {
    id: 'elec_14',
    kanji: '写真製版',
    kana: 'しゃしんせいはん',
    romaji: 'shashin seihan',
    english: 'photolithography',
    telugu: 'ఫోటోలిథోగ్రఫీ',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Process of transferring circuit patterns from a photomask to a light-sensitive chemical on the wafer.',
    kanjiBreakdown: [
      { kanji: '写', reading: 'しゃ (sha)', meaningEn: 'copy' },
      { kanji: '真', reading: 'しん (shin)', meaningEn: 'true / photo' },
      { kanji: '製', reading: 'せい (sei)', meaningEn: 'manufacture' },
      { kanji: '版', reading: 'はん (han)', meaningEn: 'printing plate' }
    ]
  },
  {
    id: 'elec_15',
    kanji: '露光',
    kana: 'ろこう',
    romaji: 'rokou',
    english: 'exposure (light exposure)',
    telugu: 'ఎక్స్‌పోజర్ (కాంతి బహిర్గతం)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Shining ultraviolet light through a photomask onto photoresist-coated wafers.',
    kanjiBreakdown: [
      { kanji: '露', reading: 'ろ (ro)', meaningEn: 'expose / reveal' },
      { kanji: '光', reading: 'こう (kou)', meaningEn: 'light' }
    ]
  },
  {
    id: 'elec_16',
    kanji: '感光材',
    kana: 'かんこうざい',
    romaji: 'kankouzai',
    english: 'photoresist',
    telugu: 'ఫోటోరెసిస్ట్ మెటీరియల్',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Light-sensitive chemical polymer that changes solubility when exposed to UV light.',
    kanjiBreakdown: [
      { kanji: '感', reading: 'かん (kan)', meaningEn: 'feeling / sense' },
      { kanji: '光', reading: 'こう (kou)', meaningEn: 'light' },
      { kanji: '材', reading: 'ざい (zai)', meaningEn: 'material' }
    ]
  },
  {
    id: 'elec_17',
    kanji: '現像',
    kana: 'げんぞう',
    romaji: 'genzou',
    english: 'development (chemical development)',
    telugu: 'డెవలప్‌మెంట్ (రసాయన ప్రక్రియ)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Applying chemical solution to dissolve exposed (or unexposed) photoresist areas.',
    kanjiBreakdown: [
      { kanji: '現', reading: 'げん (gen)', meaningEn: 'manifest / present' },
      { kanji: '像', reading: 'ぞう (zou)', meaningEn: 'image / statue' }
    ]
  },
  {
    id: 'elec_18',
    kanji: 'エッチング',
    kana: 'えっちんぐ',
    romaji: 'etchingu',
    english: 'etching',
    telugu: 'ఎచ్చింగ్ (తొలగింపు ప్రక్రియ)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Chemically or physically removing unprotected layers of material to carve circuit patterns.'
  },
  {
    id: 'elec_19',
    kanji: '異方性',
    kana: 'いほうせい',
    romaji: 'ihousei',
    english: 'anisotropy (directional etching)',
    telugu: 'దిశాత్మక లక్షణం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Property of having different values when measured in different directions (e.g. vertical etching without undercut).',
    kanjiBreakdown: [
      { kanji: '異', reading: 'い (i)', meaningEn: 'different' },
      { kanji: '方', reading: 'ほう (hou)', meaningEn: 'direction' },
      { kanji: '性', reading: 'せい (sei)', meaningEn: 'property' }
    ]
  },
  {
    id: 'elec_20',
    kanji: '成膜',
    kana: 'せいまく',
    romaji: 'seimaku',
    english: 'thin-film deposition',
    telugu: 'పలుచని పొర వేయడం (డిపాజిషన్)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Forming ultra-thin layers of insulators or conductors onto the wafer surface (CVD/PVD).',
    kanjiBreakdown: [
      { kanji: '成', reading: 'せい (sei)', meaningEn: 'make / form' },
      { kanji: '膜', reading: 'まく (maku)', meaningEn: 'film / layer' }
    ]
  },
  {
    id: 'elec_21',
    kanji: '蒸着',
    kana: 'じょうちゃく',
    romaji: 'jouchaku',
    english: 'vapor deposition',
    telugu: 'బాష్పీభవన డిపాజిషన్',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Evaporating material in a vacuum chamber to condense onto wafer surfaces.',
    kanjiBreakdown: [
      { kanji: '蒸', reading: 'じょう (jou)', meaningEn: 'steam / vapor' },
      { kanji: '着', reading: 'ちゃく (chaku)', meaningEn: 'adhere / attach' }
    ]
  },
  {
    id: 'elec_22',
    kanji: '研磨',
    kana: 'けんま',
    romaji: 'kenma',
    english: 'polishing / CMP',
    telugu: 'పాలిషింగ్ (రుద్దడం)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Smoothing and flattening the wafer surface using chemical and mechanical polishing slurry.',
    kanjiBreakdown: [
      { kanji: '研', reading: 'けん (ken)', meaningEn: 'grind / study' },
      { kanji: '磨', reading: 'ま (ma)', meaningEn: 'polish / burnish' }
    ]
  },
  {
    id: 'elec_23',
    kanji: '平坦化',
    kana: 'へいたんか',
    romaji: 'heitanka',
    english: 'planarization',
    telugu: 'సమతలం చేయడం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Process of making a surface completely flat across topographical steps.',
    kanjiBreakdown: [
      { kanji: '平', reading: 'へい (hei)', meaningEn: 'flat / level' },
      { kanji: '坦', reading: 'たん (tan)', meaningEn: 'level / smooth' },
      { kanji: '化', reading: 'か (ka)', meaningEn: 'transform' }
    ]
  },
  {
    id: 'elec_24',
    kanji: 'イオン注入',
    kana: 'いおんちゅうにゅう',
    romaji: 'ion chuunyuu',
    english: 'ion implantation',
    telugu: 'అయాన్ల చొప్పించడం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Shooting ionized dopant atoms at high kinetic energy directly into the semiconductor crystal.',
    kanjiBreakdown: [
      { kanji: '注', reading: 'ちゅう (chuu)', meaningEn: 'pour / inject' },
      { kanji: '入', reading: 'にゅう (nyuu)', meaningEn: 'enter / insert' }
    ]
  },
  {
    id: 'elec_25',
    kanji: '熱処理',
    kana: 'ねっしょり',
    romaji: 'nesshori',
    english: 'thermal annealing',
    telugu: 'థర్మల్ అనీలింగ్ (వేడి చేయడం)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Heating the wafer to repair crystal lattice damage from implantation and activate dopants.',
    kanjiBreakdown: [
      { kanji: '熱', reading: 'ねつ (netsu)', meaningEn: 'heat' },
      { kanji: '処', reading: 'しょ (sho)', meaningEn: 'manage / deal' },
      { kanji: '理', reading: 'り (ri)', meaningEn: 'logic / process' }
    ]
  },
  {
    id: 'elec_26',
    kanji: '配線',
    kana: 'はいせん',
    romaji: 'haisen',
    english: 'interconnect / wiring',
    telugu: 'వైరింగ్ లేదా కనెక్షన్లు',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'Conductive metal paths (copper or aluminum) routing signals between transistors.',
    kanjiBreakdown: [
      { kanji: '配', reading: 'はい (hai)', meaningEn: 'distribute' },
      { kanji: '線', reading: 'せん (sen)', meaningEn: 'line / wire' }
    ]
  },
  {
    id: 'elec_27',
    kanji: '絶縁体',
    kana: 'ぜつえんたい',
    romaji: 'zetsuentai',
    english: 'dielectric / insulator',
    telugu: 'విద్యుత్ నిరోధక పదార్థం',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'A substance that does not readily conduct electricity, separating conductive layers.',
    kanjiBreakdown: [
      { kanji: '絶', reading: 'ぜつ (zetsu)', meaningEn: 'sever / cutoff' },
      { kanji: '縁', reading: 'えん (en)', meaningEn: 'edge / connection' },
      { kanji: '体', reading: 'たい (tai)', meaningEn: 'body / substance' }
    ]
  },
  {
    id: 'elec_28',
    kanji: '導電体',
    kana: 'どうでんたい',
    romaji: 'doudentai',
    english: 'electrical conductor',
    telugu: 'విద్యుత్ వాహకం',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A material that allows electrical charges to flow easily with low resistance.',
    kanjiBreakdown: [
      { kanji: '導', reading: 'どう (dou)', meaningEn: 'guide / lead' },
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electricity' },
      { kanji: '体', reading: 'たい (tai)', meaningEn: 'body' }
    ]
  },
  {
    id: 'elec_29',
    kanji: 'クリーンルーム',
    kana: 'くりーんるーむ',
    romaji: 'kuriinruumu',
    english: 'cleanroom',
    telugu: 'క్లీన్‌రూమ్ (ధూళి రహిత గది)',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'An engineered space maintaining extremely low concentrations of airborne particulates.'
  },
  {
    id: 'elec_30',
    kanji: '防塵服',
    kana: 'ぼうじんふく',
    romaji: 'boujinfuku',
    english: 'bunny suit / cleanroom suit',
    telugu: 'క్లీన్‌రూమ్ రక్షణ దుస్తులు',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'Full-body garment worn inside cleanrooms to prevent human skin particles and fibers shedding.',
    kanjiBreakdown: [
      { kanji: '防', reading: 'ぼう (bou)', meaningEn: 'defend / prevent' },
      { kanji: '塵', reading: 'じん (jin)', meaningEn: 'dust / particulate' },
      { kanji: '服', reading: 'ふく (fuku)', meaningEn: 'clothing' }
    ]
  },
  {
    id: 'elec_31',
    kanji: '微粒子',
    kana: 'びりゅうし',
    romaji: 'biryuushi',
    english: 'airborne particle / dust spec',
    telugu: 'సూక్ష్మ రేణువు',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Microscopic solid particle capable of causing defects during photolithography.',
    kanjiBreakdown: [
      { kanji: '微', reading: 'び (bi)', meaningEn: 'micro / delicate' },
      { kanji: '粒', reading: 'りゅう (ryuu)', meaningEn: 'grain / droplet' },
      { kanji: '子', reading: 'し (shi)', meaningEn: 'particle' }
    ]
  },
  {
    id: 'elec_32',
    kanji: '真空',
    kana: 'しんくう',
    romaji: 'shinkuu',
    english: 'vacuum',
    telugu: 'శూన్యత (వాక్యూమ్)',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'A space devoid of matter, essential for plasma etching and ion beam processing.',
    kanjiBreakdown: [
      { kanji: '真', reading: 'しん (shin)', meaningEn: 'true' },
      { kanji: '空', reading: 'くう (kuu)', meaningEn: 'empty / void' }
    ]
  },
  {
    id: 'elec_33',
    kanji: 'プラズマ',
    kana: 'ぷらずま',
    romaji: 'purazuma',
    english: 'plasma',
    telugu: 'ప్లాస్మా',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Ionized gas containing free electrons and positive ions used for etching and deposition.'
  },
  {
    id: 'elec_34',
    kanji: 'ダイシング',
    kana: 'だいしんぐ',
    romaji: 'daishingu',
    english: 'wafer dicing / cutting',
    telugu: 'వేఫర్ ముక్కలు చేయడం (డైసింగ్)',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Slicing the finished wafer into individual functional silicon dies using diamond saws or lasers.'
  },
  {
    id: 'elec_35',
    kanji: '歩留まり',
    kana: 'ぶどまり',
    romaji: 'budomari',
    english: 'yield rate',
    telugu: 'దిగుబడి శాతం (ఈల్డ్)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'The percentage of non-defective functional chips produced compared to the theoretical maximum.',
    kanjiBreakdown: [
      { kanji: '歩', reading: 'ぶ (bu)', meaningEn: 'ratio / step' },
      { kanji: '留', reading: 'どまり (domari)', meaningEn: 'stop / remain' }
    ],
    workplaceExample: {
      ja: '新ラインの歩留まりが95％を超えました。',
      romaji: 'Shin rain no budomari ga kyuujuugopaasento o koemashita.',
      en: 'The yield rate of the new production line has exceeded 95%.'
    }
  },
  {
    id: 'elec_36',
    kanji: '欠陥',
    kana: 'けっかん',
    romaji: 'kekkan',
    english: 'defect / flaw',
    telugu: 'లోపం (డిఫెక్ట్)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'An imperfection or irregularity that impairs the normal functioning of a component.',
    kanjiBreakdown: [
      { kanji: '欠', reading: 'けつ (ketsu)', meaningEn: 'lack / miss' },
      { kanji: '陥', reading: 'かん (kan)', meaningEn: 'fall into / trap' }
    ]
  },
  {
    id: 'elec_37',
    kanji: '静電気破壊',
    kana: 'せいでんきはかい',
    romaji: 'seidenki hakai',
    english: 'electrostatic discharge damage (ESD)',
    telugu: 'స్థిర విద్యుత్ ఉత్సర్గ నష్టం',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Destruction of sensitive gate oxides caused by static electricity sparks.',
    kanjiBreakdown: [
      { kanji: '静', reading: 'せい (sei)', meaningEn: 'static / calm' },
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electric' },
      { kanji: '破', reading: 'は (ha)', meaningEn: 'break' },
      { kanji: '壊', reading: 'かい (kai)', meaningEn: 'destroy' }
    ]
  },
  {
    id: 'elec_38',
    kanji: 'パッケージング',
    kana: 'ぱっけーじんぐ',
    romaji: 'pakkeejingu',
    english: 'chip packaging',
    telugu: 'చిప్ ప్యాకేజింగ్',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Encapsulating the bare silicon die in ceramic or plastic resin with external contact pins.'
  },
  {
    id: 'elec_39',
    kanji: 'ボンディング',
    kana: 'ぼんでぃんぐ',
    romaji: 'bondingu',
    english: 'wire bonding',
    telugu: 'వైర్ బాండింగ్',
    teluguVerified: false,
    reviewed: false,
    category: 'semiconductor',
    plainDefinition: 'Connecting micro-thin gold or copper wires between die pads and leadframe pins.'
  },
  {
    id: 'elec_40',
    kanji: '試作品',
    kana: 'しさくひん',
    romaji: 'shisakuhin',
    english: 'prototype / test article',
    telugu: 'నమూనా పరికరం (ప్రోటోటైప్)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'An early sample or mock-up built to test a concept before mass production.',
    kanjiBreakdown: [
      { kanji: '試', reading: 'し (shi)', meaningEn: 'test / try' },
      { kanji: '作', reading: 'さく (saku)', meaningEn: 'make / create' },
      { kanji: '品', reading: 'ひん (hin)', meaningEn: 'goods / item' }
    ]
  }
];
