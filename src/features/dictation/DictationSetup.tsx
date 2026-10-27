// src/features/dictation/DictationSetup.tsx
// Configuration and readiness screen for Japanese Dictation Studio
import React, { useState, useMemo } from 'react';
import { Play, Sparkles, AlertCircle, Laptop, PenLine, Volume2, Info } from 'lucide-react';
import { DictationConfig, DictationMode } from './types';
import { characterMasteryService } from '../learning/characterMastery';
import { N5_KANA_WORDS } from '../../data/vocab/n5KanaWords';
import { buildPool, explainShortage } from './eligibility';

interface DictationSetupProps {
  onStartSession: (config: DictationConfig) => void;
  onOpenDebugger?: () => void;
}

export const DictationSetup: React.FC<DictationSetupProps> = ({
  onStartSession,
  onOpenDebugger
}) => {
  const [mode, setMode] = useState<DictationMode>('screen');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [showLengthHint, setShowLengthHint] = useState<boolean>(false);
  const [strictMode, setStrictMode] = useState<boolean>(false);

  const learnedSet = useMemo(() => {
    return characterMasteryService.getLearnedGlyphs();
  }, []);

  const eligiblePool = useMemo(() => {
    return buildPool(N5_KANA_WORDS, learnedSet);
  }, [learnedSet]);

  const shortage = useMemo(() => {
    return explainShortage(questionCount, N5_KANA_WORDS, learnedSet);
  }, [questionCount, learnedSet]);

  const canStart = eligiblePool.length > 0;
  const actualCount = Math.min(questionCount, eligiblePool.length);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kai-vermilion/10 text-kai-vermilion text-xs font-mono font-bold tracking-wide">
          <Volume2 className="w-3.5 h-3.5" />
          KAI AUDIO DICTATION STUDIO
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
          聴解 & 綴り道場 (Dictation Studio)
        </h1>
        <p className="text-sm text-[#635F59] dark:text-[#A5A29B] max-w-lg mx-auto">
          Train your ear-to-mora connection. Hear natural Japanese words and write down the exact kana spellings.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 font-mono">
          1. Select Dictation Mode
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Screen Mode */}
          <button
            type="button"
            onClick={() => setMode('screen')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              mode === 'screen'
                ? 'bg-kai-indigo text-white border-kai-indigo shadow-md scale-[1.01]'
                : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-kai-indigo'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Laptop className="w-5 h-5 text-kai-gold" />
              <span className="font-bold font-serif_jp text-base">Screen Mode (画面入力)</span>
            </div>
            <p className={`text-xs ${mode === 'screen' ? 'text-white/80' : 'text-stone-500'}`}>
              Type moras using the on-screen Japanese Kana keyboard. Immediate automatic evaluation.
            </p>
          </button>

          {/* Paper Mode */}
          <button
            type="button"
            onClick={() => setMode('paper')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              mode === 'paper'
                ? 'bg-kai-indigo text-white border-kai-indigo shadow-md scale-[1.01]'
                : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-kai-indigo'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <PenLine className="w-5 h-5 text-kai-vermilion" />
              <span className="font-bold font-serif_jp text-base">Paper Mode (原稿用紙)</span>
            </div>
            <p className={`text-xs ${mode === 'paper' ? 'text-white/80' : 'text-stone-500'}`}>
              Write on real physical paper or Genkou Youshi grid. Reveal answer and self-rate via FSRS.
            </p>
          </button>
        </div>
      </div>

      {/* Session Length Selection */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 font-mono">
          2. Target Word Count
        </h3>
        <div className="flex gap-3">
          {[5, 10, 20].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setQuestionCount(count)}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${
                questionCount === count
                  ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-kai-vermilion'
              }`}
            >
              {count} Words
            </button>
          ))}
        </div>
      </div>

      {/* Session Settings */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 font-mono">
          3. Options & Hints
        </h3>
        <div className="space-y-3">
          {/* Strict Mode Toggle */}
          <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                Strict Mode (厳格モード)
              </span>
              <span className="text-[11px] text-stone-500 block">
                Forces length hints off. Authentic test conditions without mora-count clues.
              </span>
            </div>
            <input
              type="checkbox"
              checked={strictMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setStrictMode(checked);
                if (checked) setShowLengthHint(false);
              }}
              className="w-4 h-4 rounded text-kai-vermilion focus:ring-kai-vermilion cursor-pointer"
            />
          </label>

          {/* Answer Length Hint Toggle */}
          <label
            className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
              strictMode
                ? 'opacity-40 cursor-not-allowed bg-stone-100 dark:bg-stone-900/20 border-stone-200 dark:border-stone-800'
                : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 cursor-pointer'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                Show answer length hint
              </span>
              <span className="text-[11px] text-stone-500 block">
                Displays exact slot count for target word (Off by default; disabled in strict mode).
              </span>
            </div>
            <input
              type="checkbox"
              disabled={strictMode}
              checked={!strictMode && showLengthHint}
              onChange={(e) => setShowLengthHint(e.target.checked)}
              className="w-4 h-4 rounded text-kai-vermilion focus:ring-kai-vermilion cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Live Eligibility Status */}
      <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#0E1626] border border-[#E8E3D9] dark:border-[#233457] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-stone-600 dark:text-stone-400">
            Learned Characters: <strong className="text-kai-indigo dark:text-kai-gold">{learnedSet.size}</strong>
          </span>
          <span className="text-stone-600 dark:text-stone-400">
            Eligible Vocabulary Pool: <strong className="text-kai-vermilion">{eligiblePool.length}</strong> / {N5_KANA_WORDS.length}
          </span>
        </div>

        {/* Shortage notice if pool is insufficient */}
        {shortage.shortageCount > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <p>
                You requested <strong>{questionCount} words</strong>, but your currently mastered kana pool unlocks{' '}
                <strong>{eligiblePool.length} words</strong>.
              </p>
              {Object.keys(shortage.unlockedIfLearned).length > 0 && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Tip: Mastering{' '}
                  <span className="font-serif_jp font-bold">
                    「{Object.keys(shortage.unlockedIfLearned).slice(0, 3).join('・')}」
                  </span>{' '}
                  will immediately unlock more N5 words!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Start Button & Dev Trigger */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={!canStart}
          onClick={() =>
            onStartSession({
              mode,
              questionCount: actualCount,
              showLengthHint: strictMode ? false : showLengthHint,
              strictMode
            })
          }
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark text-white font-serif_jp font-bold text-lg shadow-vermilion hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Session ({actualCount} Words)
        </button>

        {import.meta.env.DEV && onOpenDebugger && (
          <div className="text-center">
            <button
              type="button"
              onClick={onOpenDebugger}
              className="text-xs text-stone-500 hover:text-kai-indigo dark:hover:text-kai-gold underline"
            >
              Inspect / Override Learned Characters (Dev Inspector)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
