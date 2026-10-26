// src/data/jlptMockData.ts
// Realistic JLPT N5 diagnostic mock examination with timed sections, sentence star assembly, reading, and trilingual explanations
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
          question_en: 'Choose the correct Kanji for [ほん] (book):',
          question_te: '[ほん] (పుస్తకం) కు సరైన కాంజీని ఎంచుకోండి:',
          options: ['木', '本', '日', '人'],
          correct_index: 1,
          explanation_en: '本 is read as "ほん" (hon) and means "book" or "origin". 木 is "ki" (tree), 日 is "hi/nichi" (sun), 人 is "hito" (person).',
          explanation_te: '本 అనేది "హొన్" (పుస్తకం). 木 అంటే చెట్టు, 日 అంటే సూర్యుడు, 人 అంటే మనిషి.'
        },
        {
          id: 'q_n5_v2',
          section: 'vocabulary',
          question_jp: 'きのう、＿＿へ 行きました。 [えき]',
          question_en: 'Choose the correct Kanji for [えき] (train station):',
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
          question_en: 'Choose the natural predicate verb: "I eat sushi"',
          question_te: '"నేను సుషి తింటాను" అనే అర్థాన్ని ఇచ్చే సరైన క్రియను ఎంచుకోండి:',
          options: ['のみます (Drink)', 'たべます (Eat)', 'よみます (Read)', 'いきます (Go)'],
          correct_index: 1,
          explanation_en: 'たべます (tabemasu) means to eat. のみます means drink, よみます means read, いきます means go.',
          explanation_te: 'たべます అంటే తినడం. సుషి అనేది ఆహారం కాబట్టి తబెమాసు సరైనది.'
        },
        {
          id: 'q_n5_v4',
          section: 'vocabulary',
          question_jp: '毎朝、つめたい ＿＿ を のみます。',
          question_en: 'Choose the best word for: "Every morning, I drink cold [water]"',
          question_te: '"ప్రతి ఉదయం చల్లని [నీరు] తాగుతాను":',
          options: ['みず (Water)', 'ごはん (Rice)', 'ほん (Book)', 'くるま (Car)'],
          correct_index: 0,
          explanation_en: 'みず (mizu) means water. "つめたい みず" = cold water.',
          explanation_te: 'みず (మిజు) అంటే నీరు.'
        }
      ]
    },
    {
      name: 'Grammar & Particles (文法: 助詞・活用)',
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
          question_en: 'Choose the particle marking the location where an active event occurs (at the library):',
          question_te: 'గ్రంథాలయంలో చదువుతున్నాను అనే పని జరిగే స్థలాన్ని సూచించే పార్టికల్‌ను ఎంచుకోండి:',
          options: ['で', 'に', 'へ', 'と'],
          correct_index: 0,
          explanation_en: 'で marks the location where an activity takes place: としょかんで (at the library). に is for destination or static existence.',
          explanation_te: 'ఒక పని జరిగే ప్రదేశాన్ని చెప్పడానికి で వాడతారు.'
        },
        {
          id: 'q_n5_g3',
          section: 'grammar',
          question_jp: 'きのう、映画を ＿＿。',
          question_en: 'Choose the correct polite past tense form: "Yesterday, I watched a movie"',
          question_te: '"నిన్న సినిమా చూశాను" అనే గతాన్ని తెలిపే సరైన మర్యాదపూర్వక క్రియను ఎంచుకోండి:',
          options: ['見ます (watch - non-past)', '見ました (watched - past)', '見ません (do not watch)', '見ませんでした (did not watch)'],
          correct_index: 1,
          explanation_en: 'きのう (yesterday) requires the polite past affirmative ending 〜ました: 見ました (watched).',
          explanation_te: 'きのう (నిన్న) అన్నప్పుడు భూతకాల రూపం 見ました (చూశాను) వాడాలి.'
        }
      ]
    },
    {
      name: 'Sentence Composition Assembly (文の組み立て ★)',
      questions: [
        {
          id: 'q_n5_star1',
          section: 'grammar',
          question_jp: 'わたしは ＿＿ ＿★＿ ＿＿ ＿＿ 行きます。',
          question_en: 'Official JLPT Star Question: Arrange parts [1. えき 2. へ 3. ともだち 4. と] to form a natural sentence. Which option goes into the ★ position?',
          question_te: 'అధికారిక JLPT స్టార్ ప్రశ్న: ఇచ్చిన 4 భాగాలను సరిగ్గా క్రమంలో పేర్చి, ★ స్థానంలో ఏది వస్తుందో ఎంచుకోండి: [1. えき 2. へ 3. ともだち 4. と]',
          options: ['1. えき', '2. へ', '3. ともだち', '4. と'],
          correct_index: 3,
          explanation_en: 'Correct arrangement: わたしは [3. ともだち] [4. と★] [1. えき] [2. へ] 行きます ("I go to the station with a friend"). The word at the ★ (second) spot is 4. と.',
          explanation_te: 'సరైన వాక్య క్రమం: わたしは ともだち(3) と(4★) えき(1) へ(2) 行きます. రెండవ స్థానం (★) లో "と" (4) వస్తుంది.'
        },
        {
          id: 'q_n5_star2',
          section: 'grammar',
          question_jp: 'あした ＿＿ ＿＿ ＿★＿ ＿＿ かいます。',
          question_en: 'Arrange [1. で 2. デパート 3. を 4. パン]. Which option goes into the ★ position?',
          question_te: 'భాగాలను పేర్చండి: [1. で 2. デパート 3. を 4. パン]. ★ స్థానంలో ఏది వస్తుంది?',
          options: ['1. で', '2. デパート', '3. を', '4. パン'],
          correct_index: 2,
          explanation_en: 'Correct arrangement: あした [2. デパート] [1. で] [4. パン] [3. を★] かいます ("Tomorrow I will buy bread at the department store"). The star is at position 4 (third blank), which is 3. を.',
          explanation_te: 'వాక్య క్రమం: デパート(2) で(1) パン(4) を(3★) かいます. కాబట్టి 3. を సరైనది.'
        }
      ]
    },
    {
      name: 'Reading Comprehension (読解)',
      questions: [
        {
          id: 'q_n5_r1',
          section: 'reading',
          context: '【短い文章】\n山田さんのへやには、つくえと ベッドが あります。つくえの 上に 本が 三さつ あります。とけいは ありません。',
          question_jp: '山田さんのつくえの 上に 何が ありますか。',
          question_en: 'According to the passage, what is on Mr. Yamada\'s desk?',
          question_te: 'పై సమాచారం ప్రకారం, యమద గారి బల్లపై ఏముంది?',
          options: ['ベッド (Bed)', 'とけい (Clock)', '本が 三さつ (Three books)', 'テレビ (TV)'],
          correct_index: 2,
          explanation_en: 'The text clearly states: "つくえの 上に 本が 三さつ あります" (On top of the desk there are three books). It explicitly adds "とけいは ありません" (There is no clock).',
          explanation_te: 'వచనంలో "つくえの 上に 本が 三さつ あります (బల్లపై 3 పుస్తకాలు ఉన్నాయి)" అని స్పష్టంగా ఉంది.'
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
          question_en: 'Listen to the audio: What time did the speaker state it is?',
          question_te: 'ఆడియో విని సమయం ఎంత అయ్యిందో చెప్పండి:',
          options: ['1:00 (一時)', '2:00 (二時)', '3:00 (三時)', '4:00 (四時)'],
          correct_index: 2,
          explanation_en: 'The speaker answers: "はい、三時です" (Yes, it is 3 o\'clock).',
          explanation_te: 'ఆడియోలో "三時です (3 గంటలు అయ్యింది)" అని స్పష్టంగా ఉంది.'
        },
        {
          id: 'q_n5_l2',
          section: 'listening',
          question_jp: '男の人と女の人が話しています。男の人は 何を のみますか。',
          audio_text: 'お茶を のみますか？……いいえ、水を ください。',
          question_en: 'Listen to the dialogue: What beverage will the man drink?',
          question_te: 'ఆడియో సంభాషణ విని ఆ వ్యక్తి ఏమి తాగుతాడో చెప్పండి:',
          options: ['お茶 (Green tea)', '水 (Water)', 'コーヒー (Coffee)', 'ジュース (Juice)'],
          correct_index: 1,
          explanation_en: 'When asked "お茶を のみますか？", the man replies: "いいえ、水を ください" (No, water please).',
          explanation_te: '"いいえ、水を ください" (లేదు, నీరు ఇవ్వండి) అని సమాధానం ఇచ్చాడు.'
        }
      ]
    }
  ]
};
