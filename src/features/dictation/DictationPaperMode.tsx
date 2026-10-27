// src/features/dictation/DictationPaperMode.tsx
// Paper Mode for Dictation Studio: Write on real Genkou Youshi grid, reveal answer, self-rate via FSRS
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Snail, Eye, RotateCcw } from 'lucide-react';
import { DictationVocabItem } from '../../data/vocab/types';
import { DictationAnswerRecord } from './types';
import { dictationAudio } from './audioEngine';
import { FSRSRating } from '../../types';

interface DictationPaperModeProps {
  words: DictationVocabItem[];
  onFinishSession: (records: DictationAnswerRecord[]) => void;
  onExit: () => void;
}

export const DictationPaperMode: React.FC<DictationPaperModeProps> = ({
  words,
  onFinishSession,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [replaysCount, setReplaysCount] = useState<number>(0);
  const [sessionRecords, setSessionRecords] = useState<DictationAnswerRecord[]>([]);
  const questionStartTimeRef = useRef<number>(Date.now());

  const currentWord = words[currentIndex];

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setIsRevealed(false);
    setReplaysCount(0);
    dictationAudio.play(currentWord.kana);

    return () => {
      dictationAudio.stop();
    };
  }, [currentIndex, currentWord]);

  const handleReplay = (slow: boolean = false) => {
    setReplaysCount((prev) => prev + 1);
    if (slow) {
      dictationAudio.playSlow(currentWord.kana);
    } else {
      dictationAudio.play(currentWord.kana);
    }
  };

  const handleRate = (rating: FSRSRating) => {
    const timeSpent = Date.now() - questionStartTimeRef.current;
    const isCorrect = rating >= 3;

    const record: DictationAnswerRecord = {
      item: currentWord,
      userInputKana: currentWord.kana,
      isCorrect,
      timeSpentMs: timeSpent,
      replaysCount,
      selfRating: rating
    };

    const updated = [...sessionRecords, record];
    setSessionRecords(updated);

    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishSession(updated);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-500">
        <span>
          Word {currentIndex + 1} of {words.length} (Paper Mode)
        </span>
        <button
          type="button"
          onClick={onExit}
          className="hover:text-kai-vermilion transition-colors"
        >
          Exit Session
        </button>
      </div>
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-kai-indigo h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Main Card */}
      <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi text-center space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-kai-vermilion font-bold">
            Write on Your Notebook (ノートに書く)
          </span>
          <p className="text-xs text-stone-500">
            Listen to the pronunciation and handwrite the kana strokes on paper before revealing.
          </p>
        </div>

        {/* Audio Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleReplay(false)}
            className="px-6 py-3 rounded-2xl bg-kai-indigo hover:bg-kai-indigo-light text-white font-medium flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5 text-kai-gold" />
            <span>Play Audio (再生)</span>
          </button>
          <button
            type="button"
            onClick={() => handleReplay(true)}
            className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 active:scale-95 transition-all"
          >
            <Snail className="w-5 h-5 text-kai-vermilion" />
          </button>
        </div>

        {/* Grid Visual Placeholder */}
        <div className="py-6 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/30 flex items-center justify-center">
          {!isRevealed ? (
            <div className="space-y-3">
              <div className="flex justify-center gap-3">
                {Array.from({ length: Math.min(5, currentWord.kana.length) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-center justify-center text-stone-400 font-mono text-xs"
                  >
                    #{i + 1}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsRevealed(true)}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:border-kai-indigo flex items-center gap-2 mx-auto shadow-sm"
              >
                <Eye className="w-4 h-4 text-kai-indigo dark:text-kai-gold" />
                <span>Reveal Kana Spelling</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-fadeIn">
              <span className="text-xs font-mono text-stone-400 uppercase">Correct Answer</span>
              <div className="text-4xl font-bold font-serif_jp text-kai-vermilion tracking-widest">
                {currentWord.kana}
              </div>
              {currentWord.kanji && (
                <div className="text-lg font-serif_jp text-stone-600 dark:text-stone-400">
                  {currentWord.kanji}
                </div>
              )}
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                {currentWord.meaningEn}
                {currentWord.meaningTe && (
                  <span className="ml-2 font-telugu text-stone-500 font-normal">
                    ({currentWord.meaningTe})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* FSRS Self-Rating Buttons (Shown after reveal) */}
        {isRevealed && (
          <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            <span className="text-xs font-mono text-stone-500">Rate your handwriting recall accuracy:</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleRate(1)}
                className="py-3 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-medium text-xs hover:brightness-105 active:scale-95 transition-all flex flex-col items-center"
              >
                <span className="font-bold">Again</span>
                <span className="text-[10px] opacity-70">もう一度</span>
              </button>
              <button
                type="button"
                onClick={() => handleRate(2)}
                className="py-3 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 font-medium text-xs hover:brightness-105 active:scale-95 transition-all flex flex-col items-center"
              >
                <span className="font-bold">Hard</span>
                <span className="text-[10px] opacity-70">難しい</span>
              </button>
              <button
                type="button"
                onClick={() => handleRate(3)}
                className="py-3 px-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60 font-medium text-xs hover:brightness-105 active:scale-95 transition-all flex flex-col items-center"
              >
                <span className="font-bold">Good</span>
                <span className="text-[10px] opacity-70">良い</span>
              </button>
              <button
                type="button"
                onClick={() => handleRate(4)}
                className="py-3 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-medium text-xs hover:brightness-105 active:scale-95 transition-all flex flex-col items-center"
              >
                <span className="font-bold">Easy</span>
                <span className="text-[10px] opacity-70">簡単</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
