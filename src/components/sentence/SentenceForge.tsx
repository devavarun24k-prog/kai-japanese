// src/components/sentence/SentenceForge.tsx
// Interactive Sentence Forge with tile arranging, fill-in-the-blank, IME/Romaji auto-conversion, and particle evaluation
import React, { useState } from 'react';
import * as wanakana from 'wanakana';
import {
  Layers,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  Keyboard,
  HelpCircle
} from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';

export interface SentenceChallenge {
  id: string;
  promptEn: string;
  promptTe: string;
  expectedJapanese: string[]; // valid acceptable constructions
  wordTiles: string[];
  fillBlankSentence: string;
  fillBlankOptions: string[];
  fillBlankCorrect: number;
  hint: string;
  explanationEn: string;
  explanationTe: string;
}

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  {
    id: 's_1',
    promptEn: 'This is a book.',
    promptTe: 'ఇది ఒక పుస్తకం.',
    expectedJapanese: ['これは本です', 'これ は 本 です', 'これはほんです', 'これ は ほん です'],
    wordTiles: ['です', '本', 'は', 'これ'],
    fillBlankSentence: 'これ ＿＿ 本です。',
    fillBlankOptions: ['は (wa)', 'が (ga)', 'を (o)', 'に (ni)'],
    fillBlankCorrect: 0,
    hint: 'Start with the demonstrative これ, followed by topic particle は.',
    explanationEn: 'これ (this) + は (topic marker) + 本 (book) + です (polite is).',
    explanationTe: 'ఇది (これ) + గురించి (は) + పుస్తకం (本) + అవును (です).'
  },
  {
    id: 's_2',
    promptEn: 'That is a pencil.',
    promptTe: 'అది ఒక పెన్సిల్.',
    expectedJapanese: ['それはえんぴつです', 'それ は えんぴつ です', 'それは鉛筆です', 'それ は 鉛筆 です'],
    wordTiles: ['えんぴつ', 'それ', 'です', 'は', 'これ'],
    fillBlankSentence: 'それ ＿＿ えんぴつです。',
    fillBlankOptions: ['は (wa)', 'も (mo)', 'で (de)', 'へ (e)'],
    fillBlankCorrect: 0,
    hint: 'Use それ for objects near the listener.',
    explanationEn: 'それ (that near you) + は (topic) + えんぴつ (pencil) + です (is).',
    explanationTe: 'అది (それ) + గురించి (は) + పెన్సిల్ (えんぴつ) + అవును (です).'
  },
  {
    id: 's_3',
    promptEn: 'Is this water?',
    promptTe: 'ఇది మంచినీళ్ళా?',
    expectedJapanese: ['これは水ですか', 'これ は 水 です か', 'これはみずですか', 'これ は みず です か'],
    wordTiles: ['水', 'ですか', 'は', 'これ', '本'],
    fillBlankSentence: 'これは 水 です ＿＿。',
    fillBlankOptions: ['か (ka)', 'ね (ne)', 'よ (yo)', 'も (mo)'],
    fillBlankCorrect: 0,
    hint: 'Add the question particle か to the end of a です sentence.',
    explanationEn: 'これ (this) + は + 水 (water) + です (is) + か (question marker).',
    explanationTe: 'ఇది (これ) + నీరు (水) + అవునా? (ですか).'
  },
  {
    id: 's_4',
    promptEn: 'I drink water.',
    promptTe: 'నేను నీళ్లు త్రాగుతాను.',
    expectedJapanese: ['水を飲みます', '水 を 飲みます', 'みずをのみます', 'わたしは水を飲みます', 'わたし は 水 を 飲みます'],
    wordTiles: ['飲みます', '水', 'を', 'お茶', 'わたし'],
    fillBlankSentence: '水 ＿＿ 飲みます。',
    fillBlankOptions: ['を (o)', 'は (wa)', 'で (de)', 'も (mo)'],
    fillBlankCorrect: 0,
    hint: 'Remember SOV order: Object (water) + を + Verb (drink).',
    explanationEn: '水 (mizu - water) + を (o - object marker) + 飲みます (nomimasu - drink).',
    explanationTe: 'నీరు (水) + కర్మ కారకం (を) + త్రాగుతాను (飲みます).'
  },
  {
    id: 's_5',
    promptEn: 'I read books at the library.',
    promptTe: 'నేను గ్రంథాలయంలో పుస్తకాలు చదువుతాను.',
    expectedJapanese: ['図書館で本を読みます', '図書館 で 本 を 読みます', 'としょかんでほんをよみます', 'としょかん で ほん を よみます'],
    wordTiles: ['読みます', '図書館', 'で', '本', 'を', 'に'],
    fillBlankSentence: '図書館 ＿＿ 本を読みます。',
    fillBlankOptions: ['で (de)', 'に (ni)', 'へ (e)', 'と (to)'],
    fillBlankCorrect: 0,
    hint: 'Use で for active location of an action (reading), not に.',
    explanationEn: '図書館 (library) + で (at) + 本 (book) + を (object) + 読みます (read).',
    explanationTe: 'గ్రంథాలయం (図書館) + లో (で) + పుస్తకం (本) + చదువుతాను (読みます).'
  },
  {
    id: 's_6',
    promptEn: 'I go to Tokyo.',
    promptTe: 'నేను టోక్యోకు వెళ్తాను.',
    expectedJapanese: ['東京へ行きます', '東京 へ 行きます', 'とうきょうへいきます', '東京に行きます', '東京 に 行きます', 'とうきょうにいきます'],
    wordTiles: ['行きます', '東京', 'へ', 'で', '図書館', 'に'],
    fillBlankSentence: '東京 ＿＿ 行きます。',
    fillBlankOptions: ['へ (e)', 'で (de)', 'を (o)', 'は (wa)'],
    fillBlankCorrect: 0,
    hint: 'Use the direction particle へ (pronounced "e") or に for destination.',
    explanationEn: '東京 (Tokyo) + へ (direction: to) + 行きます (go).',
    explanationTe: 'టోక్యో (東京) + కు (へ) + వెళ్తాను (行きます).'
  },
  {
    id: 's_7',
    promptEn: 'What time is it now?',
    promptTe: 'ఇప్పుడు సమయం ఎంత అయ్యింది?',
    expectedJapanese: ['今何時ですか', '今 何時 ですか', 'いまなんじですか', 'いま 何時 ですか'],
    wordTiles: ['何時', '今', 'ですか', 'は', '時'],
    fillBlankSentence: '今 ＿＿ ですか。',
    fillBlankOptions: ['何時 (nanji)', '何 (nani)', '誰 (dare)', 'どこ (doko)'],
    fillBlankCorrect: 0,
    hint: '今 (now) + 何時 (what hour/time) + ですか (is it?).',
    explanationEn: '今 (now) + 何時 (what time) + ですか (is it?).',
    explanationTe: 'ఇప్పుడు (今) + ఎన్ని గంటలు (何時) + అయ్యింది? (ですか).'
  },
  {
    id: 's_8',
    promptEn: 'I also like green tea.',
    promptTe: 'నాకు కూడా గ్రీన్ టీ అంటే ఇష్టం.',
    expectedJapanese: ['お茶も好きです', 'お茶 も 好き です', 'おちゃもすきです', 'お茶もすきです'],
    wordTiles: ['好きです', 'お茶', 'も', 'は', '水'],
    fillBlankSentence: 'お茶 ＿＿ 好きです。',
    fillBlankOptions: ['も (mo)', 'は (wa)', 'に (ni)', 'で (de)'],
    fillBlankCorrect: 0,
    hint: 'Use particle も to mean "also / too", replacing が/は.',
    explanationEn: 'お茶 (green tea) + も (also / too) + 好きです (like).',
    explanationTe: 'టీ (お茶) + కూడా (も) + ఇష్టం (好きです).'
  },
  {
    id: 's_9',
    promptEn: 'I wake up at seven o\'clock.',
    promptTe: 'నేను ఏడు గంటలకు నిద్ర లేస్తాను.',
    expectedJapanese: ['七時に起きます', '七時 に 起きます', 'しちじにおきます', '7時におきます', '7時に起きます'],
    wordTiles: ['起きます', '七時', 'に', 'で', 'から'],
    fillBlankSentence: '七時 ＿＿ 起きます。',
    fillBlankOptions: ['に (ni)', 'で (de)', 'へ (e)', 'を (o)'],
    fillBlankCorrect: 0,
    hint: 'A specific point in time on the clock always takes に.',
    explanationEn: '七時 (7 o\'clock) + に (time particle at) + 起きます (wake up).',
    explanationTe: 'ఏడు గంటలకు (七時に) + నిద్రలేస్తాను (起きます).'
  },
  {
    id: 's_10',
    promptEn: 'I do not eat meat.',
    promptTe: 'నేను మాంసం తినను.',
    expectedJapanese: ['肉を食べません', '肉 を 食べません', 'にくをたべません', 'わたしは肉を食べません'],
    wordTiles: ['食べません', '肉', 'を', '食べます', '魚'],
    fillBlankSentence: '肉を ＿＿。',
    fillBlankOptions: ['食べません (tabemasen)', '食べます (tabemasu)', '飲みません (nomimasen)', '行きます (ikimasu)'],
    fillBlankCorrect: 0,
    hint: 'Form the polite negative by changing ます to ません.',
    explanationEn: '肉 (niku - meat) + を (object) + 食べません (do not eat).',
    explanationTe: 'మాంసం (肉) + కర్మ కారకం (を) + తినను (食べません).'
  },
  {
    id: 's_11',
    promptEn: 'This apple is delicious.',
    promptTe: 'ఈ ఆపిల్ చాలా రుచిగా ఉంది.',
    expectedJapanese: ['このりんごは美味しいです', 'この りんご は 美味しい です', 'このりんごはおいしいです', 'このリンゴはおいしいです'],
    wordTiles: ['美味しいです', 'りんご', 'この', 'は', 'その'],
    fillBlankSentence: 'この りんご は ＿＿。',
    fillBlankOptions: ['美味しいです (oishii desu)', '静かです (shizuka desu)', '高いじゃない (takai janai)', '飲みたい (nomitai)'],
    fillBlankCorrect: 0,
    hint: 'この modifies りんご directly: このりんごは...',
    explanationEn: 'この (this) + りんご (apple) + は (topic) + 美味しいです (delicious).',
    explanationTe: 'ఈ (この) + ఆపిల్ (りんご) + రుచికరంగా ఉంది (美味しいです).'
  },
  {
    id: 's_12',
    promptEn: 'This town is quiet.',
    promptTe: 'ఈ ఊరు చాలా ప్రశాంతంగా ఉంది.',
    expectedJapanese: ['この町は静かです', 'この 町 は 静か です', 'このまちはしずかです', 'この町はしずかです'],
    wordTiles: ['静かです', '町', 'この', 'は', '静か'],
    fillBlankSentence: 'この 町 は ＿＿。',
    fillBlankOptions: ['静かです (shizuka desu)', '静かいくない (shizukaikunai)', '静かくて (shizukakute)', '静か (shizuka)'],
    fillBlankCorrect: 0,
    hint: '静か (shizuka) is a na-adjective: 静か + です.',
    explanationEn: 'この町 (this town) + は + 静かです (is quiet/peaceful).',
    explanationTe: 'ఈ ఊరు (この町) + ప్రశాంతంగా ఉంది (静かです).'
  },
  {
    id: 's_13',
    promptEn: 'There is a book on the desk.',
    promptTe: 'బల్లపై పుస్తకం ఉంది.',
    expectedJapanese: ['机の上に本があります', '机 の 上 に 本 が あります', 'つくえのうえにほんがあります'],
    wordTiles: ['あります', '本', 'が', '机の上', 'に', 'います'],
    fillBlankSentence: '机の上に 本 ＿＿ あります。',
    fillBlankOptions: ['が (ga)', 'を (o)', 'で (de)', 'へ (e)'],
    fillBlankCorrect: 0,
    hint: 'Use が + あります for existing inanimate objects like books.',
    explanationEn: '机の上 (on top of desk) + に (location) + 本 (book) + が + あります (exists).',
    explanationTe: 'బల్ల పై (机の上に) + పుస్తకం (本が) + ఉంది (あります).'
  },
  {
    id: 's_14',
    promptEn: 'There is a cat in the room.',
    promptTe: 'గదిలో పిల్లి ఉంది.',
    expectedJapanese: ['部屋に猫がいます', '部屋 に 猫 が います', 'へやにねこがいます', 'へや に ねこ が います'],
    wordTiles: ['います', '猫', 'が', '部屋', 'に', 'あります'],
    fillBlankSentence: '部屋に 猫が ＿＿。',
    fillBlankOptions: ['います (imasu)', 'あります (arimasu)', '行きます (ikimasu)', '寝ます (nemasu)'],
    fillBlankCorrect: 0,
    hint: 'Use います for living, animate beings like cats and people.',
    explanationEn: '部屋 (room) + に (in) + 猫 (cat) + が + います (exists animate).',
    explanationTe: 'గదిలో (部屋に) + పిల్లి (猫が) + ఉంది/ఉన్నది (います).'
  },
  {
    id: 's_15',
    promptEn: 'Please wait a moment.',
    promptTe: 'దయచేసి కాసేపు ఆగండి.',
    expectedJapanese: ['ちょっと待ってください', 'ちょっと まって ください', 'ちょっとまってください', '少々お待ちください'],
    wordTiles: ['待ってください', 'ちょっと', 'ください', '待って', '少し'],
    fillBlankSentence: 'ちょっと ＿＿ ください。',
    fillBlankOptions: ['待って (matte)', '待ち (machi)', '待つ (matsu)', '待たない (matanai)'],
    fillBlankCorrect: 0,
    hint: 'Use the te-form of 待つ (matsu) → 待って (matte) + ください.',
    explanationEn: 'ちょっと (a moment) + 待って (te-form of wait) + ください (please).',
    explanationTe: 'కాసేపు (ちょっと) + ఆగి (待って) + దయచేసి (ください).'
  },
  {
    id: 's_16',
    promptEn: 'Yesterday I studied.',
    promptTe: 'నిన్న నేను చదువుకున్నాను.',
    expectedJapanese: ['昨日勉強しました', '昨日 勉強 しました', 'きのうべんきょうしました', 'きのう 勉強 しました', '昨日は勉強しました'],
    wordTiles: ['勉強しました', '昨日', 'は', '勉強します', '明日'],
    fillBlankSentence: '昨日 ＿＿。',
    fillBlankOptions: ['勉強しました (benkyou shimashita)', '勉強します (benkyou shimasu)', '勉強しません (benkyou shimasen)', '勉強 (benkyou)'],
    fillBlankCorrect: 0,
    hint: 'Use past polite suffix でした or ました: 勉強しました.',
    explanationEn: '昨日 (yesterday) + 勉強しました (studied - past tense).',
    explanationTe: 'నిన్న (昨日) + చదువుకున్నాను (勉強しました).'
  }
];

export const SentenceForge: React.FC = () => {
  const { displayMode, awardXP, recordAttempt, rateFSRSCard } = useLearning();
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [inputMode, setInputMode] = useState<'tiles' | 'fill_blank' | 'typing'>('tiles');
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<string[]>(() => [
    ...SENTENCE_CHALLENGES[0].wordTiles
  ].sort(() => 0.5 - Math.random()));
  const [typedInput, setTypedInput] = useState<string>('');
  const [selectedBlankOpt, setSelectedBlankOpt] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    feedback: string;
  } | null>(null);

  const current = SENTENCE_CHALLENGES[challengeIndex];

  // Tile Selection
  const handleSelectTile = (tile: string, idx: number) => {
    soundEffects.playClick();
    audioService.speak(tile, { rate: 0.9 });
    setSelectedTiles((prev) => [...prev, tile]);
    setAvailableTiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveTile = (tile: string, idx: number) => {
    soundEffects.playClick();
    setSelectedTiles((prev) => prev.filter((_, i) => i !== idx));
    setAvailableTiles((prev) => [...prev, tile]);
  };

  // Typing auto-conversion to Kana
  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const converted = wanakana.toHiragana(val);
    setTypedInput(converted);
  };

  // Evaluation
  const handleEvaluate = () => {
    let isMatch = false;
    let userResponse = '';

    if (inputMode === 'tiles') {
      userResponse = selectedTiles.join('');
      const cleanUser = userResponse.replace(/[\s\u3000]/g, '');
      isMatch = current.expectedJapanese.some((cand) => cand.replace(/[\s\u3000]/g, '') === cleanUser);
    } else if (inputMode === 'fill_blank') {
      isMatch = selectedBlankOpt === current.fillBlankCorrect;
      userResponse = selectedBlankOpt !== null ? current.fillBlankOptions[selectedBlankOpt] : '';
    } else {
      userResponse = typedInput.trim();
      const cleanUser = userResponse.replace(/[\s\u3000]/g, '');
      isMatch = current.expectedJapanese.some((cand) => cand.replace(/[\s\u3000]/g, '') === cleanUser);
    }

    if (isMatch) {
      soundEffects.playCorrect();
      awardXP(25, 'Constructed natural Japanese sentence');
      setEvaluation({
        submitted: true,
        isCorrect: true,
        feedback: 'Outstanding! Correct particle placement, word order, and politeness.'
      });
      recordAttempt({
        item_id: current.id,
        item_type: 'sentence',
        skill: 'grammar',
        question_type: inputMode === 'fill_blank' ? 'fill_in_the_blank' : 'sentence_construction',
        user_response: userResponse,
        expected_response: current.expectedJapanese[0],
        is_correct: true,
        response_time_ms: 3500,
        hint_used: showHint,
        retry_count: 0
      });
      rateFSRSCard(current.id, 'grammar', 4);
    } else {
      soundEffects.playWrong();
      storageService.logMistake(
        current.id,
        'grammar',
        current.promptEn,
        userResponse,
        current.expectedJapanese[0],
        'word_order_or_particles',
        current.explanationEn,
        current.explanationTe
      );
      setEvaluation({
        submitted: true,
        isCorrect: false,
        feedback: `Sentence did not match. Check particle placement (は, を, で, に) and word order (SOV).`
      });
      recordAttempt({
        item_id: current.id,
        item_type: 'sentence',
        skill: 'grammar',
        question_type: inputMode === 'fill_blank' ? 'fill_in_the_blank' : 'sentence_construction',
        user_response: userResponse,
        expected_response: current.expectedJapanese[0],
        is_correct: false,
        error_category: 'word_order_or_particles',
        response_time_ms: 4000,
        hint_used: showHint,
        retry_count: 1
      });
      rateFSRSCard(current.id, 'grammar', 1);
    }
  };

  const handleNextChallenge = () => {
    const nextIdx = (challengeIndex + 1) % SENTENCE_CHALLENGES.length;
    setChallengeIndex(nextIdx);
    setSelectedTiles([]);
    setAvailableTiles([...SENTENCE_CHALLENGES[nextIdx].wordTiles].sort(() => 0.5 - Math.random()));
    setTypedInput('');
    setSelectedBlankOpt(null);
    setShowHint(false);
    setEvaluation(null);
  };

  const handleReset = () => {
    setSelectedTiles([]);
    setAvailableTiles([...current.wordTiles].sort(() => 0.5 - Math.random()));
    setTypedInput('');
    setSelectedBlankOpt(null);
    setEvaluation(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>文鍛冶</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Sentence Forge</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Construct natural Japanese sentences with tile arranging, fill-in-the-blank, and IME auto-typing ({challengeIndex + 1}/{SENTENCE_CHALLENGES.length}).
          </p>
        </div>

        {/* Input Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
          <button
            onClick={() => {
              setInputMode('tiles');
              setEvaluation(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'tiles' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold' : 'text-kai-muted'
            }`}
          >
            Word Tiles
          </button>
          <button
            onClick={() => {
              setInputMode('fill_blank');
              setEvaluation(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'fill_blank' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold' : 'text-kai-muted'
            }`}
          >
            Fill in Blank
          </button>
          <button
            onClick={() => {
              setInputMode('typing');
              setEvaluation(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'typing' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold' : 'text-kai-muted'
            }`}
          >
            IME Typing
          </button>
        </div>
      </div>

      {/* Target Prompt Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-mono text-kai-muted uppercase tracking-wider">
            Sentence Challenge #{challengeIndex + 1}:
          </span>
          <AudioButton text={current.expectedJapanese[0]} size="sm" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-kai-ink dark:text-kai-dark-ink font-sans">
            "{current.promptEn}"
          </h2>

          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
            <p className="font-telugu text-base font-semibold text-kai-vermilion">
              "{current.promptTe}"
            </p>
          )}
        </div>

        {/* Hint button */}
        <div className="pt-2">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5 hover:underline"
            >
              <Lightbulb size={14} />
              <span>Need a grammar hint?</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 text-xs text-amber-900 dark:text-amber-300">
              💡 <strong>Hint:</strong> {current.hint}
            </div>
          )}
        </div>
      </div>

      {/* Construction Zone */}
      {inputMode === 'tiles' ? (
        <div className="space-y-4">
          {/* Sentence Assembly Slot */}
          <div className="p-5 rounded-3xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border-2 border-dashed border-kai-border min-h-[90px] flex flex-wrap items-center gap-2">
            {selectedTiles.length === 0 ? (
              <span className="text-xs text-kai-faint font-sans select-none">
                Click tiles below to build the sentence in correct Japanese order (SOV)...
              </span>
            ) : (
              selectedTiles.map((tile, i) => (
                <button
                  key={i}
                  onClick={() => handleRemoveTile(tile, i)}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-vermilion/50 shadow-sm text-kai-ink dark:text-kai-dark-ink font-japanese font-bold text-base hover:bg-red-50 dark:hover:bg-red-950/40 transition-all scale-100 active:scale-95 animate-in zoom-in-95"
                  title="Click to remove from sentence"
                >
                  {tile}
                </button>
              ))
            )}
          </div>

          {/* Available Word Tiles */}
          <div className="space-y-1.5">
            <span className="text-3xs font-mono uppercase text-kai-muted block">Available Word Tiles (Click to add):</span>
            <div className="flex flex-wrap items-center justify-center gap-2.5 p-4 bg-white dark:bg-kai-dark-card rounded-2xl border border-kai-border">
              {availableTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTile(tile, idx)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-kai-dark-bg text-kai-ink dark:text-kai-dark-ink font-japanese font-bold text-base border border-kai-border hover:border-kai-indigo hover:shadow-sm transition-all"
                >
                  {tile}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : inputMode === 'fill_blank' ? (
        /* Fill-in-the-blank mode */
        <div className="p-6 rounded-3xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border space-y-5">
          <div className="text-center py-4 space-y-2">
            <span className="text-xs font-mono text-kai-muted">Complete the missing particle or word:</span>
            <div className="text-2xl sm:text-3xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
              {current.fillBlankSentence}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {current.fillBlankOptions.map((opt, idx) => {
              const isSelected = selectedBlankOpt === idx;
              let btnStyle = 'bg-white dark:bg-kai-dark-card border-kai-border text-kai-ink dark:text-white hover:border-kai-vermilion';
              if (isSelected) {
                btnStyle = 'bg-kai-vermilion-bg dark:bg-kai-vermilion-bg/20 border-kai-vermilion font-bold text-kai-vermilion';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedBlankOpt(idx);
                    soundEffects.playClick();
                  }}
                  className={`p-4 rounded-2xl border text-center font-bold font-japanese text-sm transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Typing Mode with real-time Romaji to Hiragana IME conversion */
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={typedInput}
              onChange={handleTypingChange}
              placeholder="Type in Romaji or Japanese (e.g. 'kore wa hon desu' auto-converts to これはほんです)..."
              className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-kai-dark-card border-2 border-kai-border text-lg font-japanese text-kai-ink dark:text-kai-dark-ink placeholder:text-kai-faint focus:outline-none focus:border-kai-vermilion shadow-sm"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-2xs font-mono text-kai-muted flex items-center gap-1">
              <Keyboard size={14} />
              <span>Auto-IME</span>
            </div>
          </div>
          <p className="text-2xs text-kai-muted font-mono">
            Tip: Typing 'watashi wa' automatically converts to わたしは. Both Kanji and Hiragana spellings are accepted!
          </p>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-kai-dark-card text-kai-muted text-xs font-medium hover:text-kai-ink flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        <button
          onClick={handleEvaluate}
          disabled={
            inputMode === 'tiles'
              ? selectedTiles.length === 0
              : inputMode === 'fill_blank'
              ? selectedBlankOpt === null
              : !typedInput
          }
          className="px-6 py-2.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion disabled:opacity-40 transition-transform active:scale-95"
        >
          Check Sentence
        </button>
      </div>

      {/* Evaluation Results Banner */}
      {evaluation && (
        <div
          className={`p-5 rounded-3xl border space-y-3 animate-in fade-in ${
            evaluation.isCorrect
              ? 'bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {evaluation.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span className="font-bold text-sm">
                {evaluation.isCorrect ? 'Sentence Perfect!' : 'Incorrect Construction'}
              </span>
            </div>

            <AudioButton text={current.expectedJapanese[0]} size="sm" />
          </div>

          <p className="text-xs leading-relaxed">{evaluation.feedback}</p>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-black/30 text-xs space-y-1">
            <p className="font-bold font-japanese text-sm text-kai-ink dark:text-white">
              Target: {current.expectedJapanese[0]}
            </p>
            <p className="text-2xs text-kai-muted">{current.explanationEn}</p>
            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <p className="font-telugu text-2xs text-kai-vermilion">{current.explanationTe}</p>
            )}
          </div>

          <button
            onClick={handleNextChallenge}
            className="w-full py-2.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Next Sentence Challenge ({challengeIndex + 1 < SENTENCE_CHALLENGES.length ? `${challengeIndex + 2}/${SENTENCE_CHALLENGES.length}` : 'Loop'})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
