// src/features/electronics/japanese/termsPart2.ts
// Technical Japanese terms 41 to 80: Circuits, Components, Testing, Measurement & Quality Control
import { TechnicalTermItem } from './types';

export const ELECTRONICS_TERMS_PART_2: TechnicalTermItem[] = [
  {
    id: 'elec_41',
    kanji: '抵抗',
    kana: 'ていこう',
    romaji: 'teikou',
    english: 'resistor / electrical resistance',
    telugu: 'నిరోధం లేదా రెసిస్టర్',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A component or property that opposes the flow of electric current, measured in Ohms (Ω).',
    kanjiBreakdown: [
      { kanji: '抵', reading: 'てい (tei)', meaningEn: 'resist / touch' },
      { kanji: '抗', reading: 'こう (kou)', meaningEn: 'oppose / defy' }
    ],
    workplaceExample: {
      ja: '電流を制限するために1キロオームの抵抗を直列に入れます。',
      romaji: 'Denryuu o seigen suru tame ni ichi kiro oomu no teikou o chokuretsu ni iremasu.',
      en: 'We insert a 1 kΩ resistor in series to limit current.'
    }
  },
  {
    id: 'elec_42',
    kanji: '回路',
    kana: 'かいろ',
    romaji: 'kairo',
    english: 'electric circuit',
    telugu: 'విద్యుత్ వలయం (సర్క్యూట్)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A closed continuous conductive loop providing a return path for electrical current.',
    kanjiBreakdown: [
      { kanji: '回', reading: 'かい (kai)', meaningEn: 'revolve / circle' },
      { kanji: '路', reading: 'ろ (ro)', meaningEn: 'path / route' }
    ]
  },
  {
    id: 'elec_43',
    kanji: '電圧',
    kana: 'でんあつ',
    romaji: 'denatsu',
    english: 'voltage / potential difference',
    telugu: 'వోల్టేజ్ (విద్యుత్ పీడనం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'The electrical potential difference driving electrons through a circuit, measured in Volts (V).',
    kanjiBreakdown: [
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electricity' },
      { kanji: '圧', reading: 'あつ (atsu)', meaningEn: 'pressure / push' }
    ],
    workplaceExample: {
      ja: '電源端子の電圧をマルチメータで測定してください。',
      romaji: 'Dengen tanshi no denatsu o maruchimeeta de sokutei shite kudasai.',
      en: 'Please measure the voltage at the power terminals with a multimeter.'
    }
  },
  {
    id: 'elec_44',
    kanji: '電流',
    kana: 'でんりゅう',
    romaji: 'denryuu',
    english: 'electric current',
    telugu: 'కరెంట్ (విద్యుత్ ప్రవాహం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'The rate of flow of electric charge across a cross section, measured in Amperes (A).',
    kanjiBreakdown: [
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electricity' },
      { kanji: '流', reading: 'りゅう (ryuu)', meaningEn: 'flow / current' }
    ]
  },
  {
    id: 'elec_45',
    kanji: 'オームの法則',
    kana: 'おーむのほうそく',
    romaji: 'oomu no housoku',
    english: "Ohm's law (V = I * R)",
    telugu: 'ఓమ్ నియమం',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'Fundamental physical law stating that current between two points is proportional to voltage and inversely proportional to resistance.',
    kanjiBreakdown: [
      { kanji: '法', reading: 'ほう (hou)', meaningEn: 'law / method' },
      { kanji: '則', reading: 'そく (soku)', meaningEn: 'rule / principle' }
    ]
  },
  {
    id: 'elec_46',
    kanji: '電力',
    kana: 'でんりょく',
    romaji: 'denryoku',
    english: 'electric power (Watts)',
    telugu: 'విద్యుత్ శక్తి (పవర్)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'The rate per unit time at which electrical energy is transferred or consumed (P = V * I).',
    kanjiBreakdown: [
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electricity' },
      { kanji: '力', reading: 'りょく (ryoku)', meaningEn: 'power / strength' }
    ]
  },
  {
    id: 'elec_47',
    kanji: '電源',
    kana: 'でんげん',
    romaji: 'dengen',
    english: 'power supply / power source',
    telugu: 'విద్యుత్ సరఫరా కేంద్రం',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A hardware component or terminal that supplies electric energy to circuits.',
    kanjiBreakdown: [
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electricity' },
      { kanji: '源', reading: 'げん (gen)', meaningEn: 'source / origin' }
    ]
  },
  {
    id: 'elec_48',
    kanji: '接地',
    kana: 'せっち',
    romaji: 'secchi',
    english: 'ground / earth connection',
    telugu: 'ఎర్తింగ్ (భూసంపర్కం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A common reference potential point (0V) or physical safety earth connection.',
    kanjiBreakdown: [
      { kanji: '接', reading: 'せつ (setsu)', meaningEn: 'touch / contact' },
      { kanji: '地', reading: 'ち (chi)', meaningEn: 'earth / ground' }
    ]
  },
  {
    id: 'elec_49',
    kanji: '短絡',
    kana: 'たんらく',
    romaji: 'tanraku',
    english: 'short circuit',
    telugu: 'షార్ట్ సర్క్యూట్',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'An abnormal, low-resistance connection between two conductors resulting in excessive current flow.',
    kanjiBreakdown: [
      { kanji: '短', reading: 'たん (tan)', meaningEn: 'short' },
      { kanji: '絡', reading: 'らく (raku)', meaningEn: 'entangle / tie' }
    ]
  },
  {
    id: 'elec_50',
    kanji: '断線',
    kana: 'だんせん',
    romaji: 'dansen',
    english: 'broken wire / open circuit',
    telugu: 'వైరు తెగిపోవడం',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A rupture or discontinuity in a conductor stopping the flow of electrical current.',
    kanjiBreakdown: [
      { kanji: '断', reading: 'だん (dan)', meaningEn: 'sever / disconnect' },
      { kanji: '線', reading: 'せん (sen)', meaningEn: 'line / wire' }
    ]
  },
  {
    id: 'elec_51',
    kanji: '直流',
    kana: 'ちょくりゅう',
    romaji: 'chokuryuu',
    english: 'direct current (DC)',
    telugu: 'డైరెక్ట్ కరెంట్ (ఏకదిశాత్మక ప్రవాహం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'Electric charge flowing unidirectionally and steadily over time.',
    kanjiBreakdown: [
      { kanji: '直', reading: 'ちょく (choku)', meaningEn: 'straight / direct' },
      { kanji: '流', reading: 'りゅう (ryuu)', meaningEn: 'flow' }
    ]
  },
  {
    id: 'elec_52',
    kanji: '交流',
    kana: 'こうりゅう',
    romaji: 'kouryuu',
    english: 'alternating current (AC)',
    telugu: 'ఆల్టర్నేటింగ్ కరెంట్ (ఏకాంతర ప్రవాహం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'Electric charge whose direction reverses cyclically in sinusoidal or pulsed waves.',
    kanjiBreakdown: [
      { kanji: '交', reading: 'こう (kou)', meaningEn: 'cross / interchange' },
      { kanji: '流', reading: 'りゅう (ryuu)', meaningEn: 'flow' }
    ]
  },
  {
    id: 'elec_53',
    kanji: 'コンデンサ',
    kana: 'こんでんさ',
    romaji: 'kondensa',
    english: 'capacitor',
    telugu: 'కెపాసిటర్ (విద్యుదావేశ నిల్వ పరికరం)',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'A passive two-terminal component that temporarily stores electrical energy in an electrostatic field.'
  },
  {
    id: 'elec_54',
    kanji: '容量',
    kana: 'ようりょう',
    romaji: 'youryou',
    english: 'capacitance / capacity',
    telugu: 'కెపాసిటెన్స్ పరిమాణం',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'The ability of a system to store electric charge per unit potential difference, measured in Farads (F).',
    kanjiBreakdown: [
      { kanji: '容', reading: 'よう (you)', meaningEn: 'contain / hold' },
      { kanji: '量', reading: 'りょう (ryou)', meaningEn: 'quantity / volume' }
    ]
  },
  {
    id: 'elec_55',
    kanji: 'インダクタ',
    kana: 'いんだくた',
    romaji: 'indakuta',
    english: 'inductor / choke coil',
    telugu: 'ఇండక్టర్ (కాయిల్)',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'A passive component storing electrical energy in a magnetic field when electric current flows through it.'
  },
  {
    id: 'elec_56',
    kanji: 'ダイオード',
    kana: 'だいおーど',
    romaji: 'daioodo',
    english: 'diode',
    telugu: 'డయోడ్',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'A two-terminal semiconductor device that conducts current primarily in one direction (anode to cathode).'
  },
  {
    id: 'elec_57',
    kanji: '整流',
    kana: 'せいりゅう',
    romaji: 'seiryuu',
    english: 'rectification (AC to DC conversion)',
    telugu: 'రెక్టిఫికేషన్ (AC ని DC గా మార్చడం)',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'The conversion of bidirectional alternating current into unidirectional direct current.',
    kanjiBreakdown: [
      { kanji: '整', reading: 'せい (sei)', meaningEn: 'organize / align' },
      { kanji: '流', reading: 'りゅう (ryuu)', meaningEn: 'flow' }
    ]
  },
  {
    id: 'elec_58',
    kanji: '発光ダイオード',
    kana: 'はっこうだいおーど',
    romaji: 'hakkou daioodo',
    english: 'light-emitting diode (LED)',
    telugu: 'లైట్ ఎమిటింగ్ డయోడ్ (LED)',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'A semiconductor diode that emits photons of visible or infrared light when forward-biased.',
    kanjiBreakdown: [
      { kanji: '発', reading: 'はつ (hatsu)', meaningEn: 'emit / emit' },
      { kanji: '光', reading: 'こう (kou)', meaningEn: 'light' }
    ]
  },
  {
    id: 'elec_59',
    kanji: 'トランジスタ',
    kana: 'とらんじすた',
    romaji: 'toranjisuta',
    english: 'transistor',
    telugu: 'ట్రాన్సిస్టర్',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'A semiconductor device used to amplify or switch electrical signals and power.'
  },
  {
    id: 'elec_60',
    kanji: '増幅',
    kana: 'ぞうふく',
    romaji: 'zoufuku',
    english: 'amplification',
    telugu: 'ఆంప్లిఫికేషన్ (సంకేతాన్ని పెంచడం)',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'Increasing the amplitude, voltage, or current power of a weak electrical signal.',
    kanjiBreakdown: [
      { kanji: '増', reading: 'ぞう (zou)', meaningEn: 'increase' },
      { kanji: '幅', reading: 'ふく (fuku)', meaningEn: 'width / range' }
    ]
  },
  {
    id: 'elec_61',
    kanji: '電界効果',
    kana: 'でんかいこうか',
    romaji: 'denkai kouka',
    english: 'field effect (as in FET / MOSFET)',
    telugu: 'క్షేత్ర ప్రభావం (ఫీల్డ్ ఎఫెక్ట్)',
    teluguVerified: false,
    reviewed: false,
    category: 'components',
    plainDefinition: 'Modulating conductivity between drain and source using an electric field from a gate terminal.',
    kanjiBreakdown: [
      { kanji: '電', reading: 'でん (den)', meaningEn: 'electric' },
      { kanji: '界', reading: 'かい (kai)', meaningEn: 'boundary / realm' },
      { kanji: '効', reading: 'こう (kou)', meaningEn: 'effect' },
      { kanji: '果', reading: 'か (ka)', meaningEn: 'fruit / outcome' }
    ]
  },
  {
    id: 'elec_62',
    kanji: '論理回路',
    kana: 'ろんりかいろ',
    romaji: 'ronri kairo',
    english: 'logic circuit / digital gate circuit',
    telugu: 'లాజిక్ సర్క్యూట్',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'An electric circuit implementing Boolean algebraic operations (AND, OR, NOT, NAND, NOR, XOR).',
    kanjiBreakdown: [
      { kanji: '論', reading: 'ろん (ron)', meaningEn: 'theory / argument' },
      { kanji: '理', reading: 'り (ri)', meaningEn: 'logic / principle' },
      { kanji: '回', reading: 'かい (kai)', meaningEn: 'cycle' },
      { kanji: '路', reading: 'ろ (ro)', meaningEn: 'route' }
    ]
  },
  {
    id: 'elec_63',
    kanji: '真理値表',
    kana: 'しんりちひょう',
    romaji: 'shinrichihyou',
    english: 'truth table',
    telugu: 'ట్రూత్ టేబుల్ (సత్య పట్టిక)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'A mathematical table setting out functional values of Boolean expressions for all combinations of inputs.',
    kanjiBreakdown: [
      { kanji: '真', reading: 'しん (shin)', meaningEn: 'true' },
      { kanji: '理', reading: 'り (ri)', meaningEn: 'reason' },
      { kanji: '値', reading: 'ち (chi)', meaningEn: 'value' },
      { kanji: '表', reading: 'ひょう (hyou)', meaningEn: 'table / chart' }
    ]
  },
  {
    id: 'elec_64',
    kanji: '信号',
    kana: 'しんごう',
    romaji: 'shingou',
    english: 'electrical signal',
    telugu: 'విద్యుత్ సిగ్నల్ (సంకేతం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'An electromagnetic or electric current variation conveying information from sender to receiver.',
    kanjiBreakdown: [
      { kanji: '信', reading: 'しん (shin)', meaningEn: 'trust / message' },
      { kanji: '号', reading: 'ごう (gou)', meaningEn: 'number / signal' }
    ]
  },
  {
    id: 'elec_65',
    kanji: '雑音',
    kana: 'ざつおん',
    romaji: 'zatsuon',
    english: 'electrical noise',
    telugu: 'నాయిస్ (అవాంఛిత విద్యుత్ అలజడి)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'Unwanted random fluctuations or disturbances superimposed on useful information signals.',
    kanjiBreakdown: [
      { kanji: '雑', reading: 'ざつ (zatsu)', meaningEn: 'miscellaneous / rough' },
      { kanji: '音', reading: 'おん (on)', meaningEn: 'sound / noise' }
    ]
  },
  {
    id: 'elec_66',
    kanji: '周波数',
    kana: 'しゅうはすう',
    romaji: 'shuuhasuu',
    english: 'frequency (Hertz)',
    telugu: 'ఫ్రీక్వెన్సీ (పౌనఃపున్యం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'The number of complete cycles of a periodic waveform occurring per second, measured in Hertz (Hz).',
    kanjiBreakdown: [
      { kanji: '周', reading: 'しゅう (shuu)', meaningEn: 'circuit / lap' },
      { kanji: '波', reading: 'は (ha)', meaningEn: 'wave' },
      { kanji: '数', reading: 'すう (suu)', meaningEn: 'number / count' }
    ]
  },
  {
    id: 'elec_67',
    kanji: '波形',
    kana: 'はけい',
    romaji: 'hakei',
    english: 'waveform',
    telugu: 'వేవ్‌ఫామ్ (తరంగ రూపం)',
    teluguVerified: false,
    reviewed: false,
    category: 'circuit_basics',
    plainDefinition: 'The graphical shape or representation of an electrical signal over time.',
    kanjiBreakdown: [
      { kanji: '波', reading: 'は (ha)', meaningEn: 'wave' },
      { kanji: '形', reading: 'けい (kei)', meaningEn: 'shape / form' }
    ]
  },
  {
    id: 'elec_68',
    kanji: 'オシロスコープ',
    kana: 'おしろすこーぷ',
    romaji: 'oshirosukoopu',
    english: 'oscilloscope',
    telugu: 'ఆసిలోస్కోప్',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'An electronic test instrument that graphically displays varying electrical voltage waveforms as a 2D plot against time.'
  },
  {
    id: 'elec_69',
    kanji: 'マルチメータ',
    kana: 'まるちめーた',
    romaji: 'maruchimeeta',
    english: 'multimeter / digital multimeter (DMM)',
    telugu: 'మల్టీమీటర్',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'A portable electronic measuring tool capable of testing voltage, current, and resistance.'
  },
  {
    id: 'elec_70',
    kanji: '導通試験',
    kana: 'どうつうしけん',
    romaji: 'doutsuu shiken',
    english: 'continuity test (buzzer check)',
    telugu: 'కంటిన్యూటీ టెస్ట్ (సర్క్యూట్ తెగిందో లేదో పరీక్ష)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Checking whether an electrical circuit or wire path forms a complete closed conductive circuit.',
    kanjiBreakdown: [
      { kanji: '導', reading: 'どう (dou)', meaningEn: 'guide' },
      { kanji: '通', reading: 'つう (tsuu)', meaningEn: 'pass / through' },
      { kanji: '試', reading: 'し (shi)', meaningEn: 'test' },
      { kanji: '験', reading: 'けん (ken)', meaningEn: 'examine' }
    ]
  },
  {
    id: 'elec_71',
    kanji: 'はんだ付け',
    kana: 'はんだづけ',
    romaji: 'handazuke',
    english: 'soldering',
    telugu: 'సాల్డరింగ్ (వెల్డింగ్ వంటి చిన్న ప్రక్రియ)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Joining metal parts by melting a filler alloy (solder) into the electrical joint.',
    kanjiBreakdown: [
      { kanji: '付', reading: 'づけ (zuke)', meaningEn: 'attach' }
    ]
  },
  {
    id: 'elec_72',
    kanji: '検査',
    kana: 'けんさ',
    romaji: 'kensa',
    english: 'inspection / quality check',
    telugu: 'తనిఖీ (ఇన్‌స్పెక్షన్)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Systematic examination and physical testing to verify whether a part conforms to specifications.',
    kanjiBreakdown: [
      { kanji: '検', reading: 'けん (ken)', meaningEn: 'examine / check' },
      { kanji: '査', reading: 'さ (sa)', meaningEn: 'investigate / look into' }
    ]
  },
  {
    id: 'elec_73',
    kanji: '品質管理',
    kana: 'ひんしつかんり',
    romaji: 'hinshitsu kanri',
    english: 'quality control (QC)',
    telugu: 'నాణ్యత నియంత్రణ',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Activities and statistical techniques used to fulfill and verify technical product requirements.',
    kanjiBreakdown: [
      { kanji: '品', reading: 'ひん (hin)', meaningEn: 'goods / quality' },
      { kanji: '質', reading: 'しつ (shitsu)', meaningEn: 'substance / nature' },
      { kanji: '管', reading: 'かん (kan)', meaningEn: 'pipe / manage' },
      { kanji: '理', reading: 'り (ri)', meaningEn: 'logic / organize' }
    ]
  },
  {
    id: 'elec_74',
    kanji: '許容差',
    kana: 'きょようさ',
    romaji: 'kyoyousa',
    english: 'tolerance / margin of error',
    telugu: 'సహన పరిమితి (టాలరెన్స్)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'The allowable deviation from a specified physical dimension or component value.',
    kanjiBreakdown: [
      { kanji: '許', reading: 'きょ (kyo)', meaningEn: 'permit / allow' },
      { kanji: '容', reading: 'よう (you)', meaningEn: 'admit / accept' },
      { kanji: '差', reading: 'さ (sa)', meaningEn: 'difference / distinction' }
    ]
  },
  {
    id: 'elec_75',
    kanji: '校正',
    kana: 'こうせい',
    romaji: 'kousei',
    english: 'instrument calibration',
    telugu: 'క్యాలిబ్రేషన్ (ఖచ్చితత్వ సరిచూడడం)',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'Comparing measuring instrument accuracy against a certified traceable reference standard.',
    kanjiBreakdown: [
      { kanji: '校', reading: 'こう (kou)', meaningEn: 'correct / compare' },
      { kanji: '正', reading: 'せい (sei)', meaningEn: 'correct / true' }
    ]
  },
  {
    id: 'elec_76',
    kanji: '定格',
    kana: 'ていかく',
    romaji: 'teikaku',
    english: 'rating / nominal specification',
    telugu: 'రేటింగ్ పరిమితి',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'The designated operating limits (e.g. max voltage, power, temperature) for safe, reliable operation.',
    kanjiBreakdown: [
      { kanji: '定', reading: 'てい (tei)', meaningEn: 'fix / decide' },
      { kanji: '格', reading: 'かく (kaku)', meaningEn: 'status / standard' }
    ]
  },
  {
    id: 'elec_77',
    kanji: '異常',
    kana: 'いじょう',
    romaji: 'ijou',
    english: 'anomaly / abnormality',
    telugu: 'అసాధారణత లేదా లోపం',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Any unexpected deviation from standard working parameters or acceptable tolerances.',
    kanjiBreakdown: [
      { kanji: '異', reading: 'い (i)', meaningEn: 'different / unusual' },
      { kanji: '常', reading: 'じょう (jou)', meaningEn: 'normal / usual' }
    ]
  },
  {
    id: 'elec_78',
    kanji: '予防保全',
    kana: 'よぼうほぜん',
    romaji: 'yobou hozen',
    english: 'preventive maintenance',
    telugu: 'ముందస్తు నిర్వహణ (ప్రివెంటివ్ మెయింటెనెన్స్)',
    teluguVerified: false,
    reviewed: false,
    category: 'equipment',
    plainDefinition: 'Regular scheduled inspections and maintenance performed to avoid unforeseen equipment breakdowns.',
    kanjiBreakdown: [
      { kanji: '予', reading: 'よ (yo)', meaningEn: 'beforehand / advance' },
      { kanji: '防', reading: 'ぼう (bou)', meaningEn: 'prevent / guard' },
      { kanji: '保', reading: 'ほ (ho)', meaningEn: 'protect / keep' },
      { kanji: '全', reading: 'ぜん (zen)', meaningEn: 'whole / complete' }
    ]
  },
  {
    id: 'elec_79',
    kanji: '安全基準',
    kana: 'あんぜんきじゅん',
    romaji: 'anzen kijun',
    english: 'safety standard',
    telugu: 'భద్రతా ప్రమాణాలు',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'Official guidelines and protocols established to protect personnel and hardware from hazards.',
    kanjiBreakdown: [
      { kanji: '安', reading: 'あん (an)', meaningEn: 'peace / safety' },
      { kanji: '全', reading: 'ぜん (zen)', meaningEn: 'complete' },
      { kanji: '基', reading: 'き (ki)', meaningEn: 'base' },
      { kanji: '準', reading: 'じゅん (jun)', meaningEn: 'standard' }
    ]
  },
  {
    id: 'elec_80',
    kanji: '作業手順書',
    kana: 'さぎょうてじゅんしょ',
    romaji: 'sagyou tejunsho',
    english: 'standard operating procedure (SOP)',
    telugu: 'పని విధాన పత్రం (SOP)',
    teluguVerified: false,
    reviewed: false,
    category: 'manufacturing_qc',
    plainDefinition: 'A step-by-step written guide detailing exact protocols for performing manufacturing and testing tasks.',
    kanjiBreakdown: [
      { kanji: '作', reading: 'さ (sa)', meaningEn: 'make' },
      { kanji: '業', reading: 'ぎょう (gyou)', meaningEn: 'work' },
      { kanji: '手', reading: 'て (te)', meaningEn: 'hand' },
      { kanji: '順', reading: 'じゅん (jun)', meaningEn: 'order' },
      { kanji: '書', reading: 'しょ (sho)', meaningEn: 'document' }
    ]
  }
];
