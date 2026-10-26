// src/data/kanaLookalikes.ts
// Comprehensive Kana lookalike confusion pairs with visual distinctions and Telugu phonetic mnemonics

export interface KanaLookalikePair {
  id: string;
  script: 'hiragana' | 'katakana';
  title: string;
  characters: string[];
  keyDistinctionEn: string;
  keyDistinctionTe: string;
  details: {
    char: string;
    reading: string;
    telugu: string;
    visualClue: string;
    visualClueTe: string;
  }[];
}

export const KANA_LOOKALIKE_PAIRS: KanaLookalikePair[] = [
  // Hiragana lookalikes
  {
    id: 'sa_vs_ki',
    script: 'hiragana',
    title: 'さ (sa) vs き (ki)',
    characters: ['さ', 'き'],
    keyDistinctionEn: 'Count the horizontal crossbars: さ has ONE bar, き has TWO bars.',
    keyDistinctionTe: 'అడ్డగీతలను లెక్కించండి: さ కి ఒకే అడ్డగీత ఉంటుంది, き కి రెండు అడ్డగీతలు ఉంటాయి.',
    details: [
      {
        char: 'さ',
        reading: 'sa',
        telugu: 'స',
        visualClue: '1 horizontal bar. Remember: "Single stroke for Sa".',
        visualClueTe: 'ఒకే ఒక అడ్డగీత ఉంటుంది.'
      },
      {
        char: 'き',
        reading: 'ki',
        telugu: 'కి',
        visualClue: '2 horizontal bars. Looks like a Key (ki) with two teeth.',
        visualClueTe: 'రెండు అడ్డగీతలు (తాళంచెవి లాగా) ఉంటాయి.'
      }
    ]
  },
  {
    id: 'wa_re_ne',
    script: 'hiragana',
    title: 'わ (wa) vs れ (re) vs ね (ne)',
    characters: ['わ', 'れ', 'ね'],
    keyDistinctionEn: 'Observe the right tail ending: わ curves round, れ kicks outward, ね curls into a knot.',
    keyDistinctionTe: 'కుడివైపు చివరి భాగాన్ని గమనించండి: わ గుండ్రంగా ఉంటుంది, れ బయటకు వాలుతుంది, ね చివర్లో ముడి ఉంటుంది.',
    details: [
      {
        char: 'わ',
        reading: 'wa',
        telugu: 'వా',
        visualClue: 'Round smooth belly like a white swan or water wave.',
        visualClueTe: 'చివర్లో ఎటువంటి ముడి లేకుండా గుండ్రంగా ఉంటుంది.'
      },
      {
        char: 'れ',
        reading: 're',
        telugu: 'రె',
        visualClue: 'Sharp outward kick at bottom right, like a running leg.',
        visualClueTe: 'కింద కుడివైపు గీత బయటకు వాలుతుంది.'
      },
      {
        char: 'ね',
        reading: 'ne',
        telugu: 'నె',
        visualClue: 'Loops into a knot at the end, like a cat (neko) tail curled up.',
        visualClueTe: 'చివర్లో పిల్లి తోక లాగా చిన్న లూప్ (ముడి) ఉంటుంది.'
      }
    ]
  },
  {
    id: 'ha_vs_ho',
    script: 'hiragana',
    title: 'は (ha) vs ほ (ho)',
    characters: ['は', 'ほ'],
    keyDistinctionEn: 'Look at the top horizontal bar: ほ has a top roof hat; は does NOT have a top bar over the vertical line.',
    keyDistinctionTe: 'పైభాగాన్ని గమనించండి: ほ కి పైన టోపీ లాగా మూసి ఉండే అడ్డగీత ఉంటుంది; は కి పైభాగం తెరిచి ఉంటుంది.',
    details: [
      {
        char: 'は',
        reading: 'ha',
        telugu: 'హ',
        visualClue: 'The vertical stroke sticks up openly with no roof.',
        visualClueTe: 'నిలువు గీత పైకి చొచ్చుకుని ఉంటుంది (పైకప్పు ఉండదు).'
      },
      {
        char: 'ほ',
        reading: 'ho',
        telugu: 'హొ',
        visualClue: 'Has a top horizontal roof bar that caps the vertical line (Santa saying Ho-Ho with a hat).',
        visualClueTe: 'పైభాగంలో టోపీ లాంటి అడ్డగీత ఉంటుంది.'
      }
    ]
  },
  {
    id: 'me_vs_nu',
    script: 'hiragana',
    title: 'め (me) vs ぬ (nu)',
    characters: ['め', 'ぬ'],
    keyDistinctionEn: 'ぬ has a curl/loop knot at the bottom-right tail; め sweeps cleanly without a knot.',
    keyDistinctionTe: 'ぬ చివర్లో లూప్ (ముడి) ఉంటుంది; め చివర్లో ఎటువంటి ముడి ఉండదు.',
    details: [
      {
        char: 'め',
        reading: 'me',
        telugu: 'మె',
        visualClue: 'Smooth ending. Looks like an eye (me) with an eyebrow.',
        visualClueTe: 'కన్ను (మె) ఆకారంలో సాఫీగా ముగుస్తుంది.'
      },
      {
        char: 'ぬ',
        reading: 'nu',
        telugu: 'ను',
        visualClue: 'Knot at the tail. Looks like chopsticks grabbing noodles (nu) with a loop.',
        visualClueTe: 'నూడుల్స్ తింటున్నట్లు చివర్లో లూప్ ఉంటుంది.'
      }
    ]
  },
  {
    id: 'ru_vs_ro',
    script: 'hiragana',
    title: 'る (ru) vs ろ (ro)',
    characters: ['る', 'ろ'],
    keyDistinctionEn: 'る has a loop knot inside at the bottom; ろ leaves an open curve without a knot.',
    keyDistinctionTe: 'る కి చివర్లో లూప్ ఉంటుంది; ろ కి లూప్ లేకుండా ఓపెన్ గా ఉంటుంది.',
    details: [
      {
        char: 'る',
        reading: 'ru',
        telugu: 'రు',
        visualClue: 'Includes a loop (Ruby inside a pocket).',
        visualClueTe: 'చివర్లో లూప్ (రుబీ లాగా) ఉంటుంది.'
      },
      {
        char: 'ろ',
        reading: 'ro',
        telugu: 'రొ',
        visualClue: 'Open curve. The ruby was stolen/robbed (ro)!',
        visualClueTe: 'లూప్ లేకుండా తెరిచి ఉంటుంది.'
      }
    ]
  },
  {
    id: 'a_vs_o',
    script: 'hiragana',
    title: 'あ (a) vs お (o)',
    characters: ['あ', 'お'],
    keyDistinctionEn: 'あ has a centered loop around a vertical cross; お has a rightward swooping loop and a separate upper-right dot.',
    keyDistinctionTe: 'あ కి మధ్యలో లూప్ ఉంటుంది; お కి కుడివైపున విడిగా ఒక చిన్న చుక్క (గీత) ఉంటుంది.',
    details: [
      {
        char: 'あ',
        reading: 'a',
        telugu: 'అ',
        visualClue: 'Central loop around vertical crossbar. Looks like an apple.',
        visualClueTe: 'మధ్యలో గుండ్రని లూప్ ఉంటుంది.'
      },
      {
        char: 'お',
        reading: 'o',
        telugu: 'ఒ',
        visualClue: 'Extra dot floating on top right. A person on an elliptical with an extra ball.',
        visualClueTe: 'కుడివైపు పైభాగంలో విడిగా చిన్న చుక్క/గీత ఉంటుంది.'
      }
    ]
  },
  {
    id: 'i_vs_ri',
    script: 'hiragana',
    title: 'い (i) vs り (ri)',
    characters: ['い', 'り'],
    keyDistinctionEn: 'い has a longer left stroke with a hook; り has a shorter left stroke and a longer sweeping right stroke.',
    keyDistinctionTe: 'い లో ఎడమ గీత పొడవుగా ఉంటుంది; り లో కుడి గీత పొడవుగా కిందకు సాగుతుంది.',
    details: [
      {
        char: 'い',
        reading: 'i',
        telugu: 'ఇ',
        visualClue: 'Left stroke is taller and hooks upward at the bottom.',
        visualClueTe: 'ఎడమ గీత పొడవుగా ఉండి పైకి చిన్న హుక్ ఉంటుంది.'
      },
      {
        char: 'り',
        reading: 'ri',
        telugu: 'రి',
        visualClue: 'Right stroke is taller, sweeping gracefully downwards.',
        visualClueTe: 'కుడి గీత పొడవుగా కిందకు సాగుతుంది (నది ప్రవాహం లాగా).'
      }
    ]
  },

  // Katakana lookalikes
  {
    id: 'shi_vs_tsu',
    script: 'katakana',
    title: 'シ (shi) vs ツ (tsu)',
    characters: ['シ', 'ツ'],
    keyDistinctionEn: 'Stroke direction: シ strokes start more vertically and sweep upward from bottom-left; ツ strokes align horizontally at top and plunge downward.',
    keyDistinctionTe: 'గీతల దిశ: シ కింద నుండి పైకి సాగుతుంది; ツ పై నుండి కిందకు పడుతున్నట్లు ఉంటుంది.',
    details: [
      {
        char: 'シ',
        reading: 'shi',
        telugu: 'షి',
        visualClue: 'Aligned left edge. Imagine a girl named "She" looking UP at the stars (sweeping upwards).',
        visualClueTe: 'ఎడమవైపు వరుసగా ఉండి, కింది నుండి పైకి గీస్తారు.'
      },
      {
        char: 'ツ',
        reading: 'tsu',
        telugu: 'త్సు',
        visualClue: 'Aligned top edge. Tsunami wave dropping down from above.',
        visualClueTe: 'పైవైపు వరుసగా ఉండి, పై నుండి కిందికి గీస్తారు (సునామీ అలలాగా).'
      }
    ]
  },
  {
    id: 'so_vs_n',
    script: 'katakana',
    title: 'ソ (so) vs ン (n)',
    characters: ['ソ', 'ン'],
    keyDistinctionEn: 'ソ stroke drops from top-right to bottom-left; ン sweeps from bottom-left up to top-right.',
    keyDistinctionTe: 'దిశ: ソ పై నుండి కిందకు వాలుతుంది; ン కింద నుండి పైకి తేలుతుంది.',
    details: [
      {
        char: 'ソ',
        reading: 'so',
        telugu: 'సొ',
        visualClue: 'First stroke is vertical-angled, second stroke descends from above.',
        visualClueTe: 'మొదటి గీత నిలువుగా ఉండి, రెండవది పై నుండి కిందకు వస్తుంది.'
      },
      {
        char: 'ン',
        reading: 'n',
        telugu: 'న్',
        visualClue: 'First stroke is flat horizontal, second stroke swoops up from bottom.',
        visualClueTe: 'మొదటి గీత అడ్డంగా ఉండి, రెండవది కింద నుండి పైకి సాగుతుంది.'
      }
    ]
  },
  {
    id: 'ko_vs_yu',
    script: 'katakana',
    title: 'コ (ko) vs ユ (yu)',
    characters: ['コ', 'ユ'],
    keyDistinctionEn: 'コ has an open left side; ユ has a vertical left side with an extended bottom base.',
    keyDistinctionTe: 'コ ఎడమవైపు తెరిచి ఉంటుంది; ユ కి ఎడమవైపు మూసి ఉండి కింద గీత కుడివైపుకు సాగుతుంది.',
    details: [
      {
        char: 'コ',
        reading: 'ko',
        telugu: 'కొ',
        visualClue: 'Box with the entire left side missing (Corner - Ko).',
        visualClueTe: 'ఎడమవైపు తెరవబడిన చతురస్రం లాగా ఉంటుంది.'
      },
      {
        char: 'ユ',
        reading: 'yu',
        telugu: 'యు',
        visualClue: 'Has a left wall and bottom foot sticking out to the right (U-turn).',
        visualClueTe: 'ఎడమవైపు గోడ ఉండి, కింద గీత ముందుకు సాగుతుంది.'
      }
    ]
  },
  {
    id: 'ku_vs_wa',
    script: 'katakana',
    title: 'ク (ku) vs ワ (wa)',
    characters: ['ク', 'ワ'],
    keyDistinctionEn: 'ク top-left stroke slices diagonally through the center; ワ has a clean vertical left leg and rounded corner.',
    keyDistinctionTe: 'ク లో మొదటి గీత మధ్యలోకి కత్తిరిస్తుంది; ワ లో ఎడమ గీత నిలువుగా ఉండి శుభ్రమైన మూల ఉంటుంది.',
    details: [
      {
        char: 'ク',
        reading: 'ku',
        telugu: 'కు',
        visualClue: 'First stroke cuts across (cook cutting with knife).',
        visualClueTe: 'మొదటి గీత ఏటవాలుగా లోపలికి దిగుతుంది.'
      },
      {
        char: 'ワ',
        reading: 'wa',
        telugu: 'వా',
        visualClue: 'Clean vertical post on left with smooth roof (Wine glass).',
        visualClueTe: 'ఎడమవైపు నిలువు గీత ఉండి, పైన సరళమైన మూల ఉంటుంది.'
      }
    ]
  }
];
