// src/data/jlptMockData.ts
// Realistic JLPT N5 diagnostic mock examination with timed sections and trilingual explanations
import { JLPTExam } from '../types';

export const JLPT_N5_MOCK_EXAM: JLPTExam = {
  id: 'jlpt_n5_full_mock_1',
  title: 'JLPT N5 Official Format Diagnostic Exam (日本語能力試験 N5)',
  level: 'N5',
  time_limit_minutes: 25,
  passing_score_pct: 60,
  sections: [
    {
      name: 'Vocabulary & Kanji (言語知識: 文字・語彙)',
      questions: [
        {
          id: 'q_n5_v1',
          section: 'vocabulary',
          question_jp: 'これは＿＿です。 [ほん]',
          question_en: 'Choose the correct Kanji for [ほん]:',
          question_te: '[ほん] కు సరైన కాంజీని ఎంచుకోండి:',
          options: ['木', '本', '日', '人'],
          correct_index: 1,
          explanation_en: '本 is read as "ほん" (hon) and means "book" or "origin". 木 is "ki" (tree), 日 is "hi/nichi" (sun), 人 is "hito" (person).',
          explanation_te: '本 అనేది "హొన్" (పుస్తకం). 木 అంటే చెట్టు, 日 అంటే సూర్యుడు, 人 అంటే మనిషి.'
        },
        {
          id: 'q_n5_v2',
          section: 'vocabulary',
          question_jp: 'きのう、＿＿へ 行きました。 [えき]',
          question_en: 'Choose the correct Kanji for [えき] (station):',
          question_te: '[えき] (స్టేషన్) కు సరైన కాంజీని ఎంచుకోండి:',
          options: ['電', '校', '駅', '車'],
          correct_index: 2,
          explanation_en: '駅 (eki) means train station. 電 means electricity, 校 means school, 車 means vehicle/car.',
          explanation_te: '駅 (ఎకి) అంటే రైల్వే స్టేషన్.'
        },
        {
          id: 'q_n5_v3',
          section: 'vocabulary',
          question_jp: 'すしを ＿＿。',
          question_en: 'Complete the sentence: "I eat sushi"',
          question_te: '"నేను సుషి తింటాను" అనే అర్థాన్ని ఇచ్చే సరైన క్రియను ఎంచుకోండి:',
          options: ['のみます (Drink)', 'たべます (Eat)', 'よみます (Read)', 'いきます (Go)'],
          correct_index: 1,
          explanation_en: 'たべます (tabemasu) means to eat. のみます means drink, よみます means read, いきます means go.',
          explanation_te: 'たべます అంటే తినడం. సుషి అనేది ఆహారం కాబట్టి తబెమాసు సరైనది.'
        }
      ]
    },
    {
      name: 'Grammar & Sentence Patterns (文法)',
      questions: [
        {
          id: 'q_n5_g1',
          section: 'grammar',
          question_jp: 'わたし＿＿田中です。',
          question_en: 'Choose the correct topic particle:',
          question_te: 'సరైన టాపిక్ పార్టికల్‌ను ఎంచుకోండి:',
          options: ['に', 'は', 'で', 'を'],
          correct_index: 1,
          explanation_en: 'は (pronounced wa) marks the topic of the sentence: わたしは田中です (I am Tanaka).',
          explanation_te: 'わたし は (నేను) అన్నప్పుడు సబ్జెక్ట్/టాపిక్ మార్కర్ గా は (వా) వాడతారు.'
        },
        {
          id: 'q_n5_g2',
          section: 'grammar',
          question_jp: 'としょかん＿＿本を 読みます。',
          question_en: 'Choose the particle marking the location of an action (at the library):',
          question_te: 'గ్రంథాలయంలో చదువుతున్నాను అనే పని జరిగే స్థలాన్ని సూచించే పార్టికల్‌ను ఎంచుకోండి:',
          options: ['で', 'に', 'へ', 'と'],
          correct_index: 0,
          explanation_en: 'で marks the location where an activity takes place: としょかんで (at the library). に is for destination or static existence.',
          explanation_te: 'ఒక పని జరిగే ప్రదేశాన్ని చెప్పడానికి で వాడతారు.'
        },
        {
          id: 'q_n5_g3',
          section: 'grammar',
          question_jp: 'ペン＿＿ノートを かいました。',
          question_en: 'Choose the particle meaning "and" between two nouns:',
          question_te: 'రెండు నామవాచకాలను కలిపే "మరియు (and)" పార్టికల్‌ను ఎంచుకోండి:',
          options: ['も', 'と', 'が', 'を'],
          correct_index: 1,
          explanation_en: 'と (to) connects nouns exhaustively like "and": ペンとノート (Pen and notebook).',
          explanation_te: 'రెండు వస్తువులను కలిపి "మరియు" అని చెప్పడానికి と వాడతారు.'
        }
      ]
    },
    {
      name: 'Listening Comprehension (聴解)',
      questions: [
        {
          id: 'q_n5_l1',
          section: 'listening',
          question_jp: '音声を聞いて、正しい答えを選んでください。',
          audio_text: 'すみません、いま、なんじですか？……はい、三時です。',
          question_en: 'Listen to the audio: What time did the speaker say it is?',
          question_te: 'ఆడియో విని సమయం ఎంత అయ్యిందో చెప్పండి:',
          options: ['1:00 (一時)', '2:00 (二時)', '3:00 (三時)', '4:00 (四時)'],
          correct_index: 2,
          explanation_en: 'The speaker answers: "はい、三時です" (Yes, it is 3 o\'clock).',
          explanation_te: 'ఆడియోలో "三時です (3 గంటలు అయ్యింది)" అని స్పష్టంగా ఉంది.'
        }
      ]
    }
  ]
};
