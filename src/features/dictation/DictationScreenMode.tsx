// src/features/dictation/DictationScreenMode.tsx
// Interactive Screen Mode for Dictation Studio with navigation, deferred evaluation, and length hints
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Snail, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { DictationVocabItem } from '../../data/vocab/types';
import { DictationConfig, DictationAnswerRecord } from './types';
import { dictationAudio } from './audioEngine';
import { KanaKeyboard } from './KanaKeyboard';
import { splitKanaUnits } from './eligibility';

interface DictationScreenModeProps {
  words: DictationVocabItem[];
  config: DictationConfig;
  onFinishSession: (records: DictationAnswerRecord[]) => void;
  onExit: () => void;
}

export const DictationScreenMode: React.FC<DictationScreenModeProps> = ({
  words,
  config,
  onFinishSession,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(() => Array(words.length).fill(''));
  const [replaysMap, setReplaysMap] = useState<Record<number, number>>({});
  const startTimesRef = useRef<Record<number, number>>({});

  const currentWord = words[currentIndex];
  const expectedUnits = splitKanaUnits(currentWord.kana);
  const currentAnswer = userAnswers[currentIndex] || '';
  const currentUserUnits = splitKanaUnits(currentAnswer);

  // Initialize start time for active word and auto-play
  useEffect(() => {
    if (!startTimesRef.current[currentIndex]) {
      startTimesRef.current[currentIndex] = Date.now();
    }
    dictationAudio.play(currentWord.kana);

    return () => {
      dictationAudio.stop();
    };
  }, [currentIndex, currentWord]);

  // Space/R hotkey for audio replay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'r' || e.code === 'Space') {
        e.preventDefault();
        handleReplay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord]);

  const handleReplay = (slow: boolean = false) => {
    setReplaysMap((prev) => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || 0) + 1
    }));
    if (slow) {
      dictationAudio.playSlow(currentWord.kana);
    } else {
      dictationAudio.play(currentWord.kana);
    }
  };

  const handleInsertKana = (char: string) => {
    setUserAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = (copy[currentIndex] || '') + char;
      return copy;
    });
  };

  const handleBackspace = () => {
    if (!currentAnswer) return;
    const units = splitKanaUnits(currentAnswer);
    units.pop();
    setUserAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = units.join('');
      return copy;
    });
  };

  const handleClear = () => {
    setUserAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = '';
      return copy;
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = () => {
    const records: DictationAnswerRecord[] = words.map((item, idx) => {
      const userInput = (userAnswers[idx] || '').trim();
      const cleanExpected = item.kana.trim();
      const isCorrect = userInput === cleanExpected;
      const timeSpent = Math.max(1000, Date.now() - (startTimesRef.current[idx] || Date.now()));

      return {
        item,
        userInputKana: userInput,
        isCorrect,
        timeSpentMs: timeSpent,
        replaysCount: replaysMap[idx] || 0
      };
    });

    onFinishSession(records);
  };

  const answeredCount = userAnswers.filter((a) => a.trim().length > 0).length;
  const isLastQuestion = currentIndex === words.length - 1;
  const isLengthHintActive = config.showLengthHint && !config.strictMode;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top Header & Question Navigation Pills */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-500">
        <span>
          Answered {answeredCount} of {words.length}
        </span>
        <button
          type="button"
          onClick={onExit}
          className="hover:text-kai-vermilion transition-colors"
        >
          Exit Session
        </button>
      </div>

      {/* Question Selector Pills */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
        {words.map((_, idx) => {
          const isAnswered = Boolean(userAnswers[idx]?.trim());
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all relative flex items-center justify-center border ${
                isCurrent
                  ? 'bg-kai-indigo text-white border-kai-indigo shadow-sm scale-105'
                  : isAnswered
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                  : 'bg-white dark:bg-stone-900 text-stone-400 border-dashed border-stone-300 dark:border-stone-800'
              }`}
            >
              {idx + 1}
              {isAnswered && !isCurrent && (
                <span className="w-1.5 h-1.5 rounded-full bg-kai-green absolute -top-0.5 -right-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Dictation Card */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi text-center space-y-6">
        {/* Audio Replay Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleReplay(false)}
            title="Press Space or R to replay"
            className="px-6 py-3 rounded-2xl bg-kai-indigo hover:bg-kai-indigo-light text-white font-medium flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5 text-kai-gold" />
            <span>Listen Audio (音声)</span>
          </button>
          <button
            type="button"
            onClick={() => handleReplay(true)}
            title="Listen at 0.72x speed"
            className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 active:scale-95 transition-all"
          >
            <Snail className="w-5 h-5 text-kai-vermilion" />
          </button>
        </div>

        {/* Input Slots / Mora Display */}
        <div className="space-y-2">
          {isLengthHintActive ? (
            // Answer Length Hint ON: Fixed number of slots
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Word length hint: {expectedUnits.length} moras
              </span>
              <div className="flex justify-center gap-2 min-h-[56px] items-center">
                {expectedUnits.map((_, idx) => {
                  const charAtSlot = currentUserUnits[idx] || '';
                  return (
                    <div
                      key={idx}
                      className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center font-serif_jp text-xl font-bold transition-all ${
                        charAtSlot
                          ? 'border-kai-indigo bg-kai-indigo-bg/30 dark:bg-kai-indigo-dark text-kai-indigo dark:text-kai-gold'
                          : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 text-transparent'
                      }`}
                    >
                      {charAtSlot || '・'}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Answer Length Hint OFF (or Strict Mode): Dynamic input display without revealing mora count
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                {config.strictMode ? 'Strict Mode (No Length Clues)' : 'Enter what you hear'}
              </span>
              <div className="flex justify-center flex-wrap gap-2 min-h-[56px] items-center p-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                {currentUserUnits.length === 0 ? (
                  <span className="text-sm font-serif_jp text-stone-400 italic">
                    Type moras using keyboard below...
                  </span>
                ) : (
                  currentUserUnits.map((char, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-14 rounded-2xl border-2 border-kai-indigo bg-kai-indigo-bg/30 dark:bg-kai-indigo-dark text-kai-indigo dark:text-kai-gold flex items-center justify-center font-serif_jp text-xl font-bold animate-fadeIn"
                    >
                      {char}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons: Prev, Next, Submit */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevious}
            className="flex-1 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-kai-indigo text-white font-bold text-xs hover:bg-kai-indigo-light transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Next Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex-1 py-3 rounded-2xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit Session ({answeredCount}/{words.length})</span>
            </button>
          )}
        </div>

        {/* Jump-to-Submit shortcut if user wants to submit early */}
        {!isLastQuestion && answeredCount > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="text-xs text-stone-500 hover:text-kai-vermilion underline font-mono"
            >
              Submit All Answers Now ({answeredCount} answered)
            </button>
          </div>
        )}
      </div>

      {/* Interactive Keyboard */}
      <KanaKeyboard
        onInsertKana={handleInsertKana}
        onBackspace={handleBackspace}
        onClear={handleClear}
      />
    </div>
  );
};
