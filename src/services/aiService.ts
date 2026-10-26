// src/services/aiService.ts
// AI Tutor service with secure Supabase Edge Function proxy and built-in pedagogical fallback
import { AIMessage, JLPTLevel, DisplayMode } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

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

class AIService {
  private config: AITutorConfig = {
    provider: 'builtin',
    level: 'Beginner',
    displayMode: 'bilingual'
  };

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
      // Store provider and level preferences only — NEVER store raw API keys in client storage
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
          'Test my knowledge on particles'
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
        suggestedReplies: ['What about destination particle へ (e)?', 'Give me a quiz on に and で', 'Explain を (o) particle'],
        isRealAI: false,
        providerUsed: 'KAI Built-in Pedagogical Grammar Engine'
      };
    }

    // 3. Topic: Hiragana basics & Pronunciation (Telugu connection)
    if (query.includes('hiragana') || query.includes('telugu') || query.includes('pronounce') || query.includes('alphabet')) {
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

    // 5. Topic: Roleplay / Practice Conversation
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
      reply: `Kon'nichiwa! I am KAI, your personal Japanese mastery mentor. You asked: "${rawInput}".\n\nFor beginner Japanese learners, every question is an opportunity to strengthen fundamentals. Whether you want to master **Hiragana stroke orders**, understand **particle usage (は, が, に, で)**, explore **verb forms**, or practice **natural conversational Japanese**, I am here with trilingual explanations in English and Telugu.\n\nWhat would you like to explore next?`,
      teluguTranslation: `నమస్కారం! నేను మీ జపనీస్ గురువు KAI. మీరు అడిగిన ప్రశ్నకు సమాధానం ఇవ్వడానికి నేను సిద్ధంగా ఉన్నాను. హిరగాన అక్షరాలు, వ్యాకరణం లేదా ఉచ్చారణ సాధనలో మీకు సహాయపడగలను.`,
      suggestedReplies: [
        'How do I say "Nice to meet you" in Japanese?',
        'Explain particle は (wa) simply',
        'Show me common Japanese greetings with Telugu pronunciation',
        'Give me a quick beginner quiz'
      ],
      isRealAI: false,
      providerUsed: 'KAI Built-in Pedagogical Mentor Engine'
    };
  }
}

export const aiService = new AIService();
