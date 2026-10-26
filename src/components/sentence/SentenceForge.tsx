// src/components/sentence/SentenceForge.tsx
// Interactive Sentence Forge with tile arranging, IME/Romaji auto-conversion, and particle evaluation
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
  Keyboard
} from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

interface SentenceChallenge {
  id: string;
  promptEn: string;
  promptTe: string;
  expectedJapanese: string[]; // valid acceptable constructions
  wordTiles: string[];
  hint: string;
  explanationEn: string;
  explanationTe: string;
}

const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  {
    id: 's_1',
    promptEn: 'This is a book.',
    promptTe: 'ఇది ఒక పుస్తకం.',
    expectedJapanese: ['これは本です', 'これ は 本 です', 'これはほんです'],
    wordTiles: ['です', '本', 'は', 'これ'],
    hint: 'Start with the demonstrative これ, followed by topic particle は.',
    explanationEn: 'これ (this) + は (topic marker) + 本 (book) + です (polite is).',
    explanationTe: 'ఇది (これ) + గురించి (は) + పుస్తకం (本) + అవును (です).'
  },
  {
    id: 's_2',
    promptEn: 'I drink water.',
    promptTe: 'నేను నీళ్లు త్రాగుతాను.',
    expectedJapanese: ['水を飲みます', '水 を 飲みます', 'みずをのみます', 'わたしは水を飲みます'],
    wordTiles: ['飲みます', '水', 'を', 'お茶'],
    hint: 'Remember SOV order: Object (water) + を + Verb (drink).',
    explanationEn: '水 (mizu - water) + を (o - object marker) + 飲みます (nomimasu - drink).',
    explanationTe: 'నీరు (水) + కర్మ కారకం (を) + త్రాగుతాను (飲みます).'
  },
  {
    id: 's_3',
    promptEn: 'I read books at the library.',
    promptTe: 'నేను గ్రంథాలయంలో పుస్తకాలు చదువుతాను.',
    expectedJapanese: ['図書館で本を読みます', '図書館 で 本 を 読みます', 'としょかんでほんをよみます'],
    wordTiles: ['読みます', '図書館', 'で', '本', 'を', 'に'],
    hint: 'Use で for action location, not に.',
    explanationEn: '図書館 (library) + で (at) + 本 (book) + を (object) + 読みます (read).',
    explanationTe: 'గ్రంథాలయం (図書館) + లో (で) + పుస్తకం (本) + చదువుతాను (読みます).'
  }
];

export const SentenceForge: React.FC = () => {
  const { displayMode, awardXP, recordAttempt, rateFSRSCard } = useLearning();
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [inputMode, setInputMode] = useState<'tiles' | 'typing'>('tiles');
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<string[]>(() => [
    ...SENTENCE_CHALLENGES[0].wordTiles
  ].sort(() => 0.5 - Math.random()));
  const [typedInput, setTypedInput] = useState<string>('');
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
    // Auto convert romaji to hiragana in real time!
    const converted = wanakana.toHiragana(val);
    setTypedInput(converted);
  };

  // Evaluation
  const handleEvaluate = () => {
    const userString = inputMode === 'tiles' ? selectedTiles.join('') : typedInput.trim();
    const cleanUser = userString.replace(/[\s\u3000]/g, '');

    const isMatch = current.expectedJapanese.some((cand) => cand.replace(/[\s\u3000]/g, '') === cleanUser);

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
        question_type: 'sentence_construction',
        user_response: userString,
        expected_response: current.expectedJapanese[0],
        is_correct: true,
        response_time_ms: 3500,
        hint_used: showHint,
        retry_count: 0
      });
      rateFSRSCard(current.id, 'grammar', 4);
    } else {
      soundEffects.playWrong();
      setEvaluation({
        submitted: true,
        isCorrect: false,
        feedback: `Sentence did not match. Check particle placement (は, を, で) and word order (SOV).`
      });
      recordAttempt({
        item_id: current.id,
        item_type: 'sentence',
        skill: 'grammar',
        question_type: 'sentence_construction',
        user_response: userString,
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
    setShowHint(false);
    setEvaluation(null);
  };

  const handleReset = () => {
    setSelectedTiles([]);
    setAvailableTiles([...current.wordTiles].sort(() => 0.5 - Math.random()));
    setTypedInput('');
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
            Construct Japanese sentences from English and Telugu prompts using tiles or typing.
          </p>
        </div>

        {/* Input Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
          <button
            onClick={() => setInputMode('tiles')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'tiles' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink' : 'text-kai-muted'
            }`}
          >
            Word Tiles
          </button>
          <button
            onClick={() => setInputMode('typing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'typing' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink' : 'text-kai-muted'
            }`}
          >
            IME / Romaji Typing
          </button>
        </div>
      </div>

      {/* Target Prompt Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-3">
        <span className="text-2xs font-mono text-kai-muted uppercase tracking-wider">
          Translate Into Japanese:
        </span>

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
              <span>Need a hint?</span>
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
                Click tiles below to build the sentence in correct Japanese order...
              </span>
            ) : (
              selectedTiles.map((tile, i) => (
                <button
                  key={i}
                  onClick={() => handleRemoveTile(tile, i)}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-vermilion/50 shadow-sm text-kai-ink dark:text-kai-dark-ink font-japanese font-bold text-base hover:bg-red-50 dark:hover:bg-red-950/40 transition-all scale-100 active:scale-95 animate-in zoom-in-95"
                >
                  {tile}
                </button>
              ))
            )}
          </div>

          {/* Available Word Tiles */}
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
            Tip: Typing 'watashi' automatically converts to わたし. Use standard Japanese punctuation.
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
          disabled={inputMode === 'tiles' ? selectedTiles.length === 0 : !typedInput}
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
            <span>Next Sentence Challenge</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
