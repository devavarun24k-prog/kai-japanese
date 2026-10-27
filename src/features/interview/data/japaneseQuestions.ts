// src/features/interview/data/japaneseQuestions.ts
// Japanese workplace interview cards with template blanks filled strictly from user profile
import { JapaneseInterviewCard } from '../types';

export const JAPANESE_INTERVIEW_CARDS: JapaneseInterviewCard[] = [
  // 1. Self-Introduction (自己紹介 - Jikoshoukai)
  {
    id: 'jp_card_1',
    topic: 'self_intro',
    titleJp: '自己紹介 (Jikoshoukai)',
    titleEn: '1-Minute Self-Introduction',
    questionJp: '簡単に自己紹介をお願いいたします。',
    questionKana: 'かんたんに じこしょうかいを おねがいいたします。',
    questionRomaji: 'Kantan ni jikoshoukai o onegai itashimasu.',
    questionEn: 'Could you please give a brief self-introduction?',
    questionTe: 'దయచేసి క్లుప్తంగా మిమ్మల్ని మీరు పరిచయం చేసుకోండి.',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: 'はじめまして。{name}と申します。{university}にて{major}を専攻し、主に組み込みハードウェアと半導体工学を学んでまいりました。本日は貴重なお時間をいただき、誠にありがとうございます。よろしくお願い申し上げます。',
    sampleAnswerRomaji: 'Hajimemashite. {name} to moushimasu. {university} nite {major} o senkou shi, omo ni kumikomi haadowea to handoutai kougaku o manande mairimashita. Honjitsu wa kichou na ojikan o itadaki, makoto ni arigatou gozaimasu. Yoroshiku onegai moushiagemasu.',
    sampleAnswerEn: 'Nice to meet you. My name is {name}. I majored in {major} at {university}, focusing on embedded hardware and semiconductor engineering. Thank you very much for your valuable time today. I look forward to speaking with you.',
    sampleAnswerTe: 'నమస్కారం. నా పేరు {name}. నేను {university} లో {major} చదివాను. ఈ రోజు సమయం ఇచ్చినందుకు ధన్యవాదాలు.',
    scriptForSpeaking: 'はじめまして。{name}と申します。よろしくお願い申し上げます。',
    expectedKeywords: ['はじめまして', '申します', '専攻', 'よろしくお願い申し上げます']
  },

  // 2. Education (学歴・研究分野)
  {
    id: 'jp_card_2',
    topic: 'education',
    titleJp: '学歴・研究内容 (Education & Research)',
    titleEn: 'Academic Background & Specialization',
    questionJp: '大学でどのような技術や理論を専攻されましたか？',
    questionKana: 'だいがくで どのような ぎじゅつや りろんを せんこうされましたか？',
    questionRomaji: 'Daigaku de dono you na gijutsu ya riron o senkou saremashita ka?',
    questionEn: 'What technologies or theories did you specialize in at university?',
    questionTe: 'విశ్వవిద్యాలయంలో మీరు ఏ సాంకేతిక అంశాలలో పరిశోధన చేశారు?',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: '{university}の{major}では、電気回路理論、半導体物理、デジタル論理回路の設計演習に注力いたしました。卒業研究では{project}をテーマに回路検証と基板実装を担当いたしました。',
    sampleAnswerRomaji: '{university} no {major} dewa, denkikairo riron, handoutai butsuri, dejitaru ronrikairo no sekkei enshuu ni chuuryoku itashimashita. Sotsugyou kenkyuu dewa {project} o teema ni kairo kenshou to kiban jissou o tantou itashimashita.',
    sampleAnswerEn: 'At {university} in the {major} department, I focused on electric circuit theory, semiconductor physics, and digital logic design. For my capstone project, I led circuit verification and PCB implementation on "{project}".',
    sampleAnswerTe: '{university} లో {major} చదువుతున్నప్పుడు సర్క్యూట్ డిజైన్ మరియు {project} పై పనిచేశాను.',
    scriptForSpeaking: '大学では電気回路と半導体物理を専攻いたしました。',
    expectedKeywords: ['大学', '専攻', '研究', '回路', '設計']
  },

  // 3. Projects (プロジェクト・技術経験)
  {
    id: 'jp_card_3',
    topic: 'projects',
    titleJp: '技術プロジェクト (Engineering Projects)',
    titleEn: 'Hands-on Hardware Project Experience',
    questionJp: 'これまで最も注力されたプロジェクトについて教えてください。',
    questionKana: 'これまで もっとも ちゅうりょくされた ぷろじぇくとに ついて おしえてください。',
    questionRomaji: 'Koremade mottomo chuuryoku sareta purojekuto ni tsuite oshiete kudasai.',
    questionEn: 'Please tell us about the engineering project you focused on the most.',
    questionTe: 'మీరు పనిచేసిన ముఖ్యమైన ప్రాజెక్ట్ గురించి వివరించండి.',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: '私が主導いたしましたプロジェクトは「{project}」です。開発期間中に部品の熱問題が発生いたしましたが、熱設計を見直し、放熱レイアウトを最適化することで動作温度を15度低減させ、期日通りに納品を達成いたしました。',
    sampleAnswerRomaji: 'Watashi ga shudou itashimashita purojekuto wa "{project}" desu. Kaihatsu kikan-chuu ni buhin no netsu mondai ga hassei itashimashita ga, netsu sekkei o minaoshi, hounetsu reiauto o saitekika suru koto de dousa ondo o juugodo teigen sase, kijitsu-doori ni nouhin o tassei itashimashita.',
    sampleAnswerEn: 'The project I led was "{project}". During development, we encountered thermal issues, but by re-evaluating thermal design and optimizing the dissipation layout, we reduced operating temperature by 15°C and delivered on schedule.',
    sampleAnswerTe: 'నేను చేపట్టిన ప్రాజెక్ట్ "{project}". ఇందులో థర్మల్ సమస్యను సరిదిద్ది విజయవంతంగా పూర్తి చేశాను.',
    scriptForSpeaking: 'プロジェクトでは熱設計を最適化し期日通りに納品いたしました。',
    expectedKeywords: ['プロジェクト', '開発', '問題', '最適化', '達成']
  },

  // 4. Strengths & Weaknesses (長所・短所)
  {
    id: 'jp_card_4',
    topic: 'strengths_weaknesses',
    titleJp: '長所と短所 (Strengths & Growth Areas)',
    titleEn: 'Strengths, Weaknesses & Self-Correction',
    questionJp: 'ご自身の長所と、課題と感じている短所について教えてください。',
    questionKana: 'ごじしんの ちょうしょと、かだいと かんじている たんしょに ついて おしえてください。',
    questionRomaji: 'Gojishin no chousho to, kadai to kanjite iru tansho ni tsuite oshiete kudasai.',
    questionEn: 'What do you consider your greatest strength and an area for improvement?',
    questionTe: 'మీ బలాలు మరియు బలహీనతలు ఏమిటి?',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: '私の長所は、{targetRole}としてデータに基づき粘り強く原因を追究する問題解決力です。一方で短所は、細部にこだわりすぎて時間をかける傾向がある点です。そのため、現在は優先順位とタイムリミットを定め、報連相を徹底して進めるよう努めております。',
    sampleAnswerRomaji: 'Watashi no chousho wa, {targetRole} to shite deeta ni motozuki nebarizuyoku gen\'in o tsuikyuu suru mondai kaiketsuryoku desu. Ippou de tansho wa, saibu ni kodawarisugite jikan o kakeru keikou ga aru ten desu. Sono tame, genzai wa yuusen-juni to taimurimitto o sadame, hou-ren-so o tettei shite susumeru you tsutomete orimasu.',
    sampleAnswerEn: 'My strength is analytical problem-solving as a {targetRole} based on empirical data. My weakness is sometimes spending too much time perfecting minor details; to address this, I establish clear priorities and time limits, and practice prompt Hou-Ren-So reporting.',
    sampleAnswerTe: 'నా బలం పరిశీలనాత్మక సమస్య పరిష్కారం. బలహీనత ఎక్కువ సమయం తీసుకోవడం, దీనిని సరిదిద్దుకుంటున్నాను.',
    scriptForSpeaking: '長所は粘り強い問題解決力です。短所は報連相を徹底して改善しております。',
    expectedKeywords: ['長所', '短所', 'データ', '報連相', '改善']
  },

  // 5. Why Japan? (日本で働きたい理由)
  {
    id: 'jp_card_5',
    topic: 'why_japan',
    titleJp: '志望動機・日本 (Why Japan & Monozukuri)',
    titleEn: 'Motivation for Working in Japan',
    questionJp: 'なぜ日本の半導体・エレクトロニクス業界で働きたいとお考えですか？',
    questionKana: 'なぜ にほんの はんどうたい・えれくとろにくすぎょうかいで はたらきたいと おかんがえですか？',
    questionRomaji: 'Naze Nihon no handoutai, erekutoronikusu gyoukai de hatarakitai to okangae desu ka?',
    questionEn: 'Why do you wish to work in Japan’s semiconductor and electronics industry?',
    questionTe: 'జపాన్ ఎలక్ట్రానిక్స్ పరిశ్రమలో ఎందుకు పనిచేయాలనుకుంటున్నారు?',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: '日本が誇る「ものづくり」の精神と、世界をリードする半導体製造装置・精密電子技術に深く感銘を受けました。{targetRole}として貴社の高品質な製品開発に貢献し、長期的に日本社会でエンジニアとして成長したいと考えております。',
    sampleAnswerRomaji: 'Nihon ga hokoru "monozukuri" no seishin to, sekai o riido suru handoutai seizousouchi, seimitsu denshi gijutsu ni fukaku kanmei o ukemashita. {targetRole} to shite kisha no kouhinshitsu na seihin kaihatsu ni kouken shi, choukiteki ni Nihon shakai de enjinia to shite seichou shitai to kangaete orimasu.',
    sampleAnswerEn: 'I am deeply inspired by Japan’s "Monozukuri" craftsmanship and leadership in precision semiconductor equipment. As a {targetRole}, I want to contribute to your company’s quality standards and build a long-term engineering career in Japan.',
    sampleAnswerTe: 'జపాన్ మోనోజుకురి సంస్కృతి మరియు నాణ్యత నన్ను ఆకర్షించాయి. ఇక్కడ దీర్ఘకాలికంగా స్థిరపడాలనుకుంటున్నాను.',
    scriptForSpeaking: '日本のものづくりの精神に感銘を受け貢献したいと考えております。',
    expectedKeywords: ['ものづくり', '半導体', '貢献', '成長', 'エンジニア']
  },

  // 6. Questions to ask the interviewer (逆質問 - Gyakushitsumon)
  {
    id: 'jp_card_6',
    topic: 'reverse_questions',
    titleJp: '逆質問 (Reverse Questions for Interviewer)',
    titleEn: 'Thoughtful Questions to Ask the Hiring Team',
    questionJp: '面接の最後に「何か質問はありますか？」と聞かれた時。',
    questionKana: 'めんせつの さいごに 「なにか しつもんは ありますか？」と きかれたとき。',
    questionRomaji: 'Mensetsu no saigo ni "Nanika shitsumon wa arimasu ka?" to kikareta toki.',
    questionEn: 'When the interviewer asks: "Do you have any questions for us?" at the end.',
    questionTe: 'ఇంటర్వ్యూ ముగింపులో "మీకు ఏమైనా ప్రశ్నలు ఉన్నాయా?" అని అడిగినప్పుడు.',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: 'はい、2点質問がございます。1点目に、入社後配属されるチームにおいて、現在最も注力されている技術課題は何でしょうか。2点目に、{targetRole}として入社までに学習・準備しておくべき専門知識がございましたらご教示いただけますでしょうか。',
    sampleAnswerRomaji: 'Hai, niten shitsumon ga gozaimasu. Itten-me ni, nyuusha go haizoku sareru chiimu ni oite, genzai mottomo chuuryoku sarete iru gijutsu kadai wa nan deshou ka. Niten-me ni, {targetRole} to shite nyuusha made ni gakushuu, junbi shite oku beki senmon chishiki ga gozaimashitara gokyouji itadakemasu deshou ka.',
    sampleAnswerEn: 'Yes, I have two questions. First, what is the primary technical challenge your team is currently focusing on? Second, what technical areas should I prepare to hit the ground running as a {targetRole}?',
    sampleAnswerTe: 'అవును, నాకు రెండు ప్రశ్నలు ఉన్నాయి. మీ ప్రస్తుత సాంకేతిక సవాళ్లు ఏమిటి మరియు నేను ఏయే విషయాలు ముందుగా నేర్చుకోవాలి?',
    scriptForSpeaking: 'はい、質問が二点ございます。配属チームの技術課題について教えていただけますでしょうか。',
    expectedKeywords: ['質問', 'チーム', '技術課題', '準備', 'ご教示']
  },

  // 7. Polite phrases (面接の定型敬語)
  {
    id: 'jp_card_7',
    topic: 'polite_phrases',
    titleJp: '面接の必須敬語・挨拶 (Polite Keigo Phrases)',
    titleEn: 'Essential Interview Keigo & Etiquette Phrases',
    questionJp: '入室時、退室時、および質疑応答で使える定型敬語表現。',
    questionKana: 'にゅうしつじ、たいしつじ、および しつぎおうとうで つかえる ていけい けいご ひょうげん。',
    questionRomaji: 'Nyuushitsu-ji, taishitsu-ji, oyobi shitsugi-outou de tsukaeru teikei keigo hyougen.',
    questionEn: 'Essential keigo phrases used when entering, answering, and exiting the interview room.',
    questionTe: 'గదిలోకి ప్రవేశించినప్పుడు, సమాధానం చెప్పేటప్పుడు మరియు బయటకు వెళ్లేటప్పుడు మాట్లాడే మర్యాదపూర్వక పదాలు.',
    teluguVerified: false,
    reviewed: false,
    sampleAnswerTemplate: '【入室時】失礼いたします。{name}と申します。【面接中】はい、かしこまりました。承知いたしました。【退室時】本日はお忙しい中、貴重なお時間をいただき誠にありがとうございました。失礼いたします。',
    sampleAnswerRomaji: '[Nyuushitsu-ji] Shitsurei itashimasu. {name} to moushimasu. [Mensetsu-chuu] Hai, kashikomarimashita. Shouchi itashimashita. [Taishitsu-ji] Honjitsu wa oisogashii naka, kichou na ojikan o itadaki makoto ni arigatou gozaimashita. Shitsurei itashimasu.',
    sampleAnswerEn: '[Entering] Excuse me. My name is {name}. [During interview] Yes, I understand / Understood. [Leaving] Thank you very much for your valuable time today despite your busy schedule. Excuse me (bow).',
    sampleAnswerTe: '[లోపలికి వెళ్లినప్పుడు] నమస్కారం. [ఇంటర్వ్యూలో] అర్థమైంది. [బయటకు వచ్చినప్పుడు] సమయం ఇచ్చినందుకు చాలా ధన్యవాదాలు.',
    scriptForSpeaking: '失礼いたします。本日は貴重なお時間をいただき誠にありがとうございました。',
    expectedKeywords: ['失礼いたします', 'かしこまりました', '承知いたしました', 'ありがとうございました']
  }
];

export function getJapaneseCardById(id: string): JapaneseInterviewCard | undefined {
  return JAPANESE_INTERVIEW_CARDS.find((c) => c.id === id);
}
