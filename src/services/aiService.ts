// src/services/aiService.ts
// AI Tutor service with secure Supabase Edge Function proxy and built-in pedagogical fallback
import { AIMessage, JLPTLevel, DisplayMode } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { storageService } from './storageService';

export interface AITutorConfig {
  provider: 'gemini' | 'builtin';
  level: JLPTLevel | 'Beginner';
  displayMode: DisplayMode;
}

export interface AITutorResponse {
  reply: string;
  teluguTranslation?: string;
  grammarBreakdown?: { token: string; furigana?: string; pos: string; meaning: string }[];
  suggestedReplies?: string[];
  isRealAI: boolean;
  providerUsed: string;
}

// Interactive Tutor Quiz bank for 1-on-1 pedagogical sessions
interface QuizQuestion {
  id: string;
  question: string;
  teluguQuestion: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationTe: string;
}

const TUTOR_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'tq_1',
    question: 'Which particle correctly fills the blank: 図書館 ＿＿ 勉強します (I study at the library)?',
    teluguQuestion: 'లైబ్రరీలో చదువుతున్నాను అనే వాక్యంలో ఖాళీని ఏ విభక్తితో నింపాలి?',
    options: ['で (de)', 'に (ni)', 'へ (e)', 'を (o)'],
    correctIndex: 0,
    explanationEn: 'で (de) marks the physical location where an active action (study) takes place.',
    explanationTe: 'చదువుకోవడం అనే పని జరుగుతున్న ప్రదేశాన్ని చెప్పడానికి "で" (de) వాడాలి.'
  },
  {
    id: 'tq_2',
    question: 'What is the negative form of the i-adjective 高い (takai - expensive)?',
    teluguQuestion: '高い (ఖరీదైన) అనే ఇ-విశేషణానికి వ్యతిరేక పదం ఏమిటి?',
    options: ['高くない (takakunai)', '高いじゃない (takai janai)', '高くないでした (takakunai deshita)', '高かった (takakatta)'],
    correctIndex: 0,
    explanationEn: 'For i-adjectives, drop the final い and add くない (takakunai = not expensive).',
    explanationTe: 'ఇ-విశేషణాల నెగెటివ్ చేయడానికి చివరి "い" తీసి "くない" చేర్చాలి (高くない).'
  },
  {
    id: 'tq_3',
    question: 'What is the te-form of 飲みます (nomimasu - to drink / dictionary: 飲む)?',
    teluguQuestion: 'త్రాగడం (飲む) యొక్క తే-ఫారం (Te-form) ఏమిటి?',
    options: ['飲んで (nonde)', '飲みて (nomite)', '飲って (notte)', '飲んだ (nonda)'],
    correctIndex: 0,
    explanationEn: 'Verbs ending in む (mu) change to んで (nde) in the te-form (のむ → のんで).',
    explanationTe: 'む తో ముగిసే క్రియలు తే-ఫారంలో "んで" గా మారుతాయి: 飲む → 飲んで.'
  },
  {
    id: 'tq_4',
    question: 'How do you say "There is a cat" (living animal) in Japanese?',
    teluguQuestion: 'పిల్లి ఉంది (జీవం ఉన్న జంతువు) అని చెప్పడానికి ఏది వాడాలి?',
    options: ['猫がいます (Neko ga imasu)', '猫があります (Neko ga arimasu)', '猫をいます (Neko o imasu)', '猫に行きます (Neko ni ikimasu)'],
    correctIndex: 0,
    explanationEn: 'Use います (imasu) for living animate beings (cats, people) with subject marker が.',
    explanationTe: 'జంతువులు లేదా మనుషులు వంటి ప్రాణం ఉన్న వాటికి "います" వాడాలి.'
  },
  {
    id: 'tq_5',
    question: 'Which particle indicates destination of movement: 東京 ＿＿ 行きます (I go to Tokyo)?',
    teluguQuestion: 'టోక్యోకు వెళ్తాను అనే వాక్యంలో గమ్యస్థానాన్ని సూచించే కారకం ఏది?',
    options: ['へ (e) or に (ni)', 'で (de)', 'を (o)', 'と (to)'],
    correctIndex: 0,
    explanationEn: 'へ (pronounced "e") or に marks destination of directional movement verbs like 行きます.',
    explanationTe: 'గమ్యస్థానాన్ని చెప్పడానికి "へ" (e) లేదా "に" (ni) వాడాలి.'
  }
];

class AIService {
  private config: AITutorConfig = {
    provider: 'builtin',
    level: 'Beginner',
    displayMode: 'bilingual'
  };

  private activeQuizIndex: number = -1;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('kai_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = {
          provider: parsed.provider === 'gemini' ? 'gemini' : 'builtin',
          level: parsed.level || 'Beginner',
          displayMode: parsed.displayMode || 'bilingual'
        };
      }
    } catch (e) {}
  }

  public saveConfig(config: Partial<AITutorConfig>) {
    this.config = { ...this.config, ...config };
    try {
      localStorage.setItem('kai_ai_config', JSON.stringify({
        provider: this.config.provider,
        level: this.config.level,
        displayMode: this.config.displayMode
      }));
    } catch (e) {}
  }

  public getConfig(): AITutorConfig {
    return this.config;
  }

  // Generate intelligent response
  public async generateTutorResponse(
    userMessage: string,
    history: AIMessage[],
    currentLevel: string = 'Beginner'
  ): Promise<AITutorResponse> {
    const query = userMessage.trim().toLowerCase();

    // If Gemini provider is chosen and Supabase Edge Function is available
    if (this.config.provider === 'gemini' && isSupabaseConfigured && supabase) {
      try {
        const liveResponse = await this.callSecureEdgeFunction(userMessage, currentLevel);
        if (liveResponse) {
          return {
            reply: liveResponse.reply,
            teluguTranslation: liveResponse.teluguTranslation,
            grammarBreakdown: liveResponse.grammarBreakdown,
            suggestedReplies: liveResponse.suggestedReplies,
            isRealAI: true,
            providerUsed: 'Google Gemini 1.5 Flash (via Supabase Edge Function)'
          };
        }
      } catch (err) {
        console.warn('Secure Edge Function unavailable or unconfigured, falling back to built-in pedagogical engine:', err);
      }
    }

    // Built-in intelligent pedagogical engine (100% offline, zero secret keys needed)
    return this.generatePedagogicalResponse(query, userMessage, currentLevel);
  }

  // Call Supabase Edge Function with authenticated user JWT
  private async callSecureEdgeFunction(prompt: string, level: string): Promise<{
    reply: string;
    teluguTranslation?: string;
    grammarBreakdown?: { token: string; furigana?: string; pos: string; meaning: string }[];
    suggestedReplies?: string[];
  } | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.functions.invoke('kai-tutor', {
      body: { prompt, level }
    });

    if (error || !data) {
      throw new Error(error?.message || 'Failed to invoke AI tutor edge function');
    }

    return {
      reply: data.reply,
      teluguTranslation: data.teluguTranslation,
      grammarBreakdown: data.grammarBreakdown,
      suggestedReplies: data.suggestedReplies
    };
  }

  // Built-in pedagogical intelligence engine (Deterministic, accurate, trilingual)
  private generatePedagogicalResponse(query: string, rawInput: string, level: string): AITutorResponse {
    const isTopicQuery =
      query.includes('explain') ||
      query.includes('what is') ||
      query.includes('how ') ||
      query.includes('te-form') ||
      query.includes('te form') ||
      query.includes('wa vs ga') ||
      query.includes('wa and ga') ||
      query.includes('ni vs de') ||
      query.includes('adjective') ||
      query.includes('hiragana');

    // Check if an ongoing quiz is awaiting learner's attempt
    if (this.activeQuizIndex >= 0 && !isTopicQuery) {
      const q = TUTOR_QUIZ_BANK[this.activeQuizIndex];
      const correctText = q.options[q.correctIndex].toLowerCase();
      const isCorrect = query.includes(correctText) || 
        query.includes(`${q.correctIndex + 1}`) ||
        (q.correctIndex === 0 && (query.startsWith('1') || query.includes('first') || query.includes('a)'))) ||
        (q.correctIndex === 1 && (query.startsWith('2') || query.includes('second') || query.includes('b)')));

      const evaluatedIndex = this.activeQuizIndex;
      this.activeQuizIndex = -1; // Reset until user asks for another question

      if (isCorrect) {
        return {
          reply: `🎉 **Correct! Excellent work.**\n\n• **Question:** ${q.question}\n• **Correct Answer:** ${q.options[q.correctIndex]}\n• **Explanation:** ${q.explanationEn}\n\nWould you like another practice question, or should we review your mistakes?`,
          teluguTranslation: `🎉 **చాలా చక్కగా చెప్పారు! మీ సమాధానం సరైనది.**\n${q.explanationTe}\n\nతదుపరి ప్రశ్న అడగమంటారా లేదా మీ పొరపాట్లను సమీక్షించాలా?`,
          suggestedReplies: [
            'Next quiz question',
            'Review my past mistakes',
            'Explain Te-form rules'
          ],
          isRealAI: false,
          providerUsed: 'KAI Built-in Interactive Quiz Engine'
        };
      } else {
        return {
          reply: `Not quite, but this is a very common learning step!\n\n• **Correct Answer:** ${q.options[q.correctIndex]}\n• **Why:** ${q.explanationEn}\n\nDon't worry — making mistakes is the best way to anchor your memory! Ready for the next question?`,
          teluguTranslation: `పర్వాలేదు, పొరపాటు సరిదిద్దుకుందాం!\n• **సరైన సమాధానం:** ${q.options[q.correctIndex]}\n• **వివరణ:** ${q.explanationTe}`,
          suggestedReplies: [
            'Try another quiz question',
            'Review my past mistakes',
            'Explain why de is used'
          ],
          isRealAI: false,
          providerUsed: 'KAI Built-in Interactive Quiz Engine'
        };
      }
    }

    // Trigger: Review past mistakes
    if (query.includes('mistake') || query.includes('error') || query.includes('review my mistake') || query.includes('wrong answer')) {
      const mistakes = storageService.getMistakes();
      if (mistakes.length === 0) {
        return {
          reply: `🌟 **Clean slate!** You currently have 0 recorded mistakes in your study log.\n\nGreat job maintaining high accuracy! Let's challenge you with an N5 practice question to keep your skills sharp.\n\n**Here is your question:**\n${TUTOR_QUIZ_BANK[0].question}\n\nOptions:\n1. ${TUTOR_QUIZ_BANK[0].options[0]}\n2. ${TUTOR_QUIZ_BANK[0].options[1]}\n3. ${TUTOR_QUIZ_BANK[0].options[2]}\n4. ${TUTOR_QUIZ_BANK[0].options[3]}`,
          teluguTranslation: `🌟 అద్భుతం! మీ స్టడీ లాగ్‌లో ప్రస్తుతం ఎలాంటి పొరపాట్లు లేవు. మంచి సాధన చేస్తున్నారు!\nప్రాక్టీస్ కోసం ఒక ప్రశ్న ఇచ్చాను, సరైన సమాధానం చెప్పండి.`,
          suggestedReplies: [
            TUTOR_QUIZ_BANK[0].options[0],
            TUTOR_QUIZ_BANK[0].options[1],
            TUTOR_QUIZ_BANK[0].options[2]
          ],
          isRealAI: false,
          providerUsed: 'KAI Built-in Mistake Analysis Engine'
        };
      } else {
        const lastMistake = mistakes[mistakes.length - 1];
        return {
          reply: `🔍 **Constructive Mistake Review:**\n\nI reviewed your recent study records. In a recent exercise, you faced this challenge:\n• **Prompt:** "${lastMistake.prompt}"\n• **Your Input:** "${lastMistake.mistaken_input}"\n• **Correct Form:** "${lastMistake.correct_answer}"\n• **Guidance:** ${lastMistake.notes_en || 'Remember to check particle function and verb tense.'}\n\nWould you like to try a focused practice question on this concept?`,
          teluguTranslation: `🔍 **పొరపాట్ల సమీక్ష:**\nమీరు గతంలో చేసిన పొరపాటును పరిశీలించాను:\n• ప్రశ్న: "${lastMistake.prompt}"\n• మీరు ఇచ్చిన సమాధానం: "${lastMistake.mistaken_input}"\n• సరైన సమాధానం: "${lastMistake.correct_answer}"\n• వివరణ: ${lastMistake.notes_te || 'వ్యాకరణ సూత్రాన్ని గమనించండి.'}`,
          suggestedReplies: [
            'Give me a quiz question to fix this',
            'Explain the grammar behind this',
            'Show another example'
          ],
          isRealAI: false,
          providerUsed: 'KAI Built-in Mistake Analysis Engine'
        };
      }
    }

    // Trigger: Interactive Quiz mode (Ask ONE question at a time)
    if (query.includes('quiz') || query.includes('test me') || query.includes('practice question') || query.includes('ask me a question')) {
      this.activeQuizIndex = Math.floor(Math.random() * TUTOR_QUIZ_BANK.length);
      const q = TUTOR_QUIZ_BANK[this.activeQuizIndex];

      return {
        reply: `🎯 **1-on-1 Practice Challenge!**\n\nI will ask you ONE question at a time and wait for your answer before explaining.\n\n**Question:**\n${q.question}\n\n**Choices:**\n1. ${q.options[0]}\n2. ${q.options[1]}\n3. ${q.options[2]}\n4. ${q.options[3]}\n\nReply with your chosen option or number!`,
        teluguTranslation: `🎯 **వ్యక్తిగత సాధనా ప్రశ్న:**\n${q.teluguQuestion}\n\nసరైన సమాధానాన్ని లేదా నంబర్‌ను టైప్ చేసి పంపండి!`,
        suggestedReplies: [q.options[0], q.options[1], q.options[2], q.options[3]],
        isRealAI: false,
        providerUsed: 'KAI Built-in Interactive Quiz Engine'
      };
    }

    // 1. Topic: Particles (は vs が, に vs で, を, と, も)
    if (query.includes('wa vs ga') || query.includes('wa and ga') || query.includes('は vs が') || query.includes('difference between wa and ga')) {
      return {
        reply: `**Understanding は (wa) vs が (ga):**\n\n• **は (wa)** is the **Topic Marker** ("As for X..."). It marks shared, established context.\n  Example: わたし**は**学生です (Watashi wa gakusei desu) — *As for me, I am a student.*\n\n• **が (ga)** is the **Subject Marker** ("X and no other"). It introduces new information or selects a specific subject.\n  Example: だれ**が**来ましたか？ (Dare ga kimashita ka?) → 田中さん**が**来ました (Tanaka-san ga kimashita) — *Who came? Tanaka-san is the one who came.*`,
        teluguTranslation: `**は (wa) మరియు が (ga) మధ్య తేడా:**\n• **は (wa)**: 'టాపిక్ మార్కర్' — సాధారణంగా "నా గురించి మాట్లాడితే..." లేదా "నేను..." అని ప్రస్తావించడానికి వాడతారు.\n  ఉదా: わたしは がくせいです (నేను విద్యార్థిని).\n• **が (ga)**: 'సబ్జెక్ట్ మార్కర్' — ఎవరు? లేదా ఏది? అనే ప్రశ్నకు ఖచ్చితమైన సమాధానం ఇస్తుంది (ఫోకస్ పాయింట్).\n  ఉదా: ఎవరు వచ్చారు? అంటే 田中さんが 来ました (తనకా గారు వచ్చారు).`,
        grammarBreakdown: [
          { token: 'わたし', furigana: 'わたし', pos: 'Pronoun', meaning: 'I / నేను' },
          { token: 'は', furigana: 'は (wa)', pos: 'Topic Particle', meaning: 'As for / గురించి' },
          { token: 'がくせい', furigana: 'がくせい', pos: 'Noun', meaning: 'Student / విద్యార్థి' },
          { token: 'です', furigana: 'です', pos: 'Copula', meaning: 'is/am (polite) / అవును' }
        ],
        suggestedReplies: [
          'Can you show me an example with に and で?',
          'How do I say "I like sushi" with が?',
          'Start a 1-on-1 quiz on particles'
        ],
        isRealAI: false,
        providerUsed: 'KAI Built-in Pedagogical Grammar Engine'
      };
    }

    // 2. Topic: Ni vs De (に vs で)
    if (query.includes('ni vs de') || query.includes('ni and de') || query.includes('に vs で')) {
      return {
        reply: `**Understanding に (ni) vs で (de):**\n\n• **に (ni)** marks a **specific point in time**, a **destination of movement**, or a **place of static existence (ある/いる)**.\n  Example: 7時**に**起きます (Shichiji ni okimasu) — *I wake up AT 7 o'clock.*\n  Example: 学校**に**行きます (Gakkou ni ikimasu) — *I go TO school.*\n\n• **で (de)** marks the **location where an active action takes place**, or the **means/instrument** used.\n  Example: 図書館**で**勉強します (Toshokan de benkyou shimasu) — *I study AT the library.*\n  Example: バス**で**行きます (Basu de ikimasu) — *I go BY bus.*`,
        teluguTranslation: `**に (ni) మరియు で (de) మధ్య తేడా:**\n• **に (ni)**: ఖచ్చితమైన సమయం (7 గంటలకు), గమ్యస్థానం (స్కూల్‌కు), లేదా ఉండే స్థలాన్ని (ఉంది/ఉన్నారు) సూచిస్తుంది.\n• **で (de)**: ఏదైనా పని జరిగే ప్రదేశాన్ని (లైబ్రరీలో చదువుతున్నాను), లేదా ప్రయాణ సాధనాన్ని (బస్సు ద్వారా) సూచిస్తుంది.`,
        grammarBreakdown: [
          { token: 'としょかん', furigana: 'としょかん', pos: 'Noun', meaning: 'Library / గ్రంథాలయం' },
          { token: 'で', furigana: 'で', pos: 'Location Particle', meaning: 'At (action) / లో' },
          { token: 'べんきょう', furigana: 'べんきょう', pos: 'Noun', meaning: 'Study / చదువు' },
          { token: 'します', furigana: 'します', pos: 'Verb', meaning: 'do / చేస్తాను' }
        ],
        suggestedReplies: ['What about destination particle へ (e)?', 'Start a 1-on-1 quiz', 'Explain を (o) particle'],
        isRealAI: false,
        providerUsed: 'KAI Built-in Pedagogical Grammar Engine'
      };
    }

    // 3. Topic: Hiragana basics & Pronunciation (Telugu connection)
    if (query.includes('hiragana') || query.includes('telugu') || query.includes('pronounce') || query.includes('phonetic') || query.includes('alphabet')) {
      return {
        reply: `**Japanese Hiragana & Telugu Phonetics:**\n\nTelugu and Japanese share remarkably similar vowel sounds! Both have pure, crisp vowels:\n\n• **あ (a)** = Telugu **అ** (as in అన్న)\n• **い (i)** = Telugu **ఇ** (as in ఇల్లు)\n• **う (u)** = Telugu **ఉ** (with unrounded lips, softer than ఊ)\n• **え (e)** = Telugu **ఎ** (as in ఎలుక)\n• **お (o)** = Telugu **ఒ** (as in ఒంటె)\n\nJapanese sentence order (SOV: Subject-Object-Verb) is also identical to Telugu grammar order!\n*Telugu:* నేను (S) అన్నం (O) తింటున్నాను (V).\n*Japanese:* わたしは (S) ごはんを (O) たべます (V).`,
        teluguTranslation: `**జపనీస్ మరియు తెలుగు భాషల మధ్య ఉన్న అద్భుతమైన పోలిక:**\nతెలుగు మరియు జపనీస్ భాషల అచ్చులు (Vowels) దాదాపు ఒకేలా ఉంటాయి (అ, ఇ, ఉ, ఎ, ఒ).\nఅంతేకాకుండా వాక్య నిర్మాణం (SOV - Subject, Object, Verb) కూడా తెలుగు మరియు జపనీస్‌లో సరిగ్గా ఒకేలా ఉంటుంది!\n• తెలుగు: నేను అన్నం తింటున్నాను.\n• జపనీస్: わたしは ごはんを たべます (వా తా షి వా / గో హన్ వొ / తా బె మా సు).`,
        suggestedReplies: ['Teach me Hiragana Ka-line', 'Show me Dakuten sounds (Ga, Za, Da, Ba)', 'Practice vowel listening'],
        isRealAI: false,
        providerUsed: 'KAI Built-in Pedagogical Engine'
      };
    }

    // 4. Topic: Te-form Verb Conjugation (て形)
    if (query.includes('te-form') || query.includes('te form') || query.includes('て形') || query.includes('conjugat')) {
      return {
        reply: `**Mastering the Japanese Te-form (て形):**\n\nThe Te-form is the master key of Japanese grammar. It connects actions, makes polite requests (~てください), and forms continuous tense (~ています).\n\n**Conjugation Song Rules (Group 1 / Godan Verbs):**\n• **う、つ、る** → **って** (かう → かって, まつ → まって, とる → とって)\n• **む、ぶ、ぬ** → **んで** (のむ → のんで, あそぶ → あそんで, しぬ → しんで)\n• **く** → **いて** (かく → かいて) *(Exception: いく → いって)*\n• **ぐ** → **いで** (およぐ → およいで)\n• **す** → **して** (はなす → はなして)\n\n**Group 2 (Ichidan Verbs):** Just drop る and add て (たべる → たべて, みる → みて)!\n**Irregular:** する → して, くる → きて.`,
        teluguTranslation: `**తే-ఫారం (Te-form) సూత్రాలు:**\nతే-ఫారం వాక్యాలను కలపడానికి (మరియు), అభ్యర్థనలు చేయడానికి (~てください - దయచేసి చేయండి), మరియు జరుగుతున్న పనులను (~ています - చేస్తూ ఉన్నాను) చెప్పడానికి వాడతారు.\nగ్రూప్ 2 క్రియలకు 'రు' తీసేసి 'తే' చేర్చాలి: たべる (తినడం) → たべて (తిని).`,
        suggestedReplies: ['How do I use ~te kudasai?', 'What is ~te imasu?', 'Give me a Te-form quiz'],
        isRealAI: false,
        providerUsed: 'KAI Built-in Pedagogical Engine'
      };
    }

    // 5. Topic: Adjectives (い-adj vs な-adj)
    if (query.includes('adjective') || query.includes('i-adj') || query.includes('na-adj') || query.includes('oishii') || query.includes('shizuka')) {
      return {
        reply: `**Japanese Adjectives: i-Adjectives vs na-Adjectives:**\n\n• **i-Adjectives (い形容詞):** End in ~い. They conjugate themselves like mini-verbs!\n  - Present: おいしい です (It is delicious)\n  - Negative: おいしくない です (It is not delicious - drop い, add くない)\n  - Past: おいしかった です (It was delicious - drop い, add かった)\n  - Past Negative: おいしくなかった です (It was not delicious)\n\n• **na-Adjectives (な形容詞):** Act like nouns and need です or な!\n  - Present: 静か です (It is quiet)\n  - Negative: 静か じゃない です (It is not quiet)\n  - Before noun: 静か**な**町 (A quiet town)`,
        teluguTranslation: `**జపనీస్ విశేషణాలు (Adjectives):**\n• **ఇ-విశేషణాలు:** "い" తో ముగుస్తాయి. వీటిని మార్చడం సులభం: おいしい (రుచి) → おいしくない (రుచి లేదు).\n• **నా-విశేషణాలు:** నామవాచకం ముందు వచ్చినప్పుడు "な" చేర్చాలి: 静かな 町 (ప్రశాంతమైన ఊరు). నెగెటివ్ చెప్పడానికి "じゃない" వాడాలి.`,
        suggestedReplies: ['How do I conjugate 高い (takai)?', 'Quiz me on adjectives', 'What is kirei na?'],
        isRealAI: false,
        providerUsed: 'KAI Built-in Pedagogical Grammar Engine'
      };
    }

    // 6. Topic: Roleplay / Practice Conversation
    if (query.includes('roleplay') || query.includes('conversation') || query.includes('order') || query.includes('conbini') || query.includes('restaurant')) {
      return {
        reply: `**Convenience Store (コンビニ) Roleplay!**\n\nClerk (店員): 「いらっしゃいませ！お弁当あたためますか？」\n*(Irasshaimase! Obentou atatamemasu ka?)*\n"Welcome! Would you like your bento heated up?"\n\n**Your Turn to Respond!** Choose your answer:\n1. 「はい、おねがいします。」 (*Hai, onegaishimasu.* — Yes, please.)\n2. 「いいえ、だいじょうぶです。」 (*Iie, daijoubu desu.* — No, that's fine.)`,
        teluguTranslation: `**కన్వీనియన్స్ స్టోర్ సంభాషణ:**\nషాపు గుమాస్తా: "స్వాగతం! మీ బాక్స్ వేడి చేయమంటారా?"\nమీరు ఎలా సమాధానం ఇస్తారు?\n1. అవును, దయచేసి చేయండి (はい、おねがいします - హై, ఒనెగాయిషిమాసు).\n2. వద్దు, పర్వాలేదు (いいえ、だいじょうぶです - ఈయె, దైజోబు దెసు).`,
        suggestedReplies: [
          'はい、おねがいします。',
          'いいえ、だいじょうぶです。',
          'Fukuro wa irimasen (I do not need a bag)'
        ],
        isRealAI: false,
        providerUsed: 'KAI Built-in Scenario Engine'
      };
    }

    // Default contextual guidance
    return {
      reply: `Kon'nichiwa! I am KAI, your personal Japanese mastery mentor. You asked: "${rawInput}".\n\nFor beginner Japanese learners, every question is an opportunity to strengthen fundamentals. Whether you want to master **Hiragana stroke orders**, understand **particle usage (は, が, に, で)**, explore **verb forms**, practice with **1-on-1 interactive quizzes**, or **review your recent mistakes**, I am here with trilingual explanations in English and Telugu.\n\nWhat would you like to explore next?`,
      teluguTranslation: `నమస్కారం! నేను మీ జపనీస్ గురువు KAI. మీరు అడిగిన ప్రశ్నకు సమాధానం ఇవ్వడానికి నేను సిద్ధంగా ఉన్నాను. హిరగాన అక్షరాలు, వ్యాకరణం, లేదా వ్యక్తిగత క్విజ్ సాధనలో మీకు సహాయపడగలను.`,
      suggestedReplies: [
        'Start a 1-on-1 interactive quiz',
        'Review my past mistakes',
        'Explain the difference between は (wa) and が (ga)',
        'How does Te-form verb conjugation work?'
      ],
      isRealAI: false,
      providerUsed: 'KAI Built-in Pedagogical Mentor Engine'
    };
  }
}

export const aiService = new AIService();
