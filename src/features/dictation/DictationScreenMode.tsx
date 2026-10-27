// src/features/dictation/DictationScreenMode.tsx
// Interactive Screen Mode for Dictation Studio with Kana slots and live audio
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Snail, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { DictationVocabItem } from '../../data/vocab/types';
import { DictationAnswerRecord } from './types';
import { dictationAudio } from './audioEngine';
import { KanaKeyboard } from './KanaKeyboard';
import { splitKanaUnits } from './eligibility';

interface DictationScreenModeProps {
  words: DictationVocabItem[];
  onFinishSession: (records: DictationAnswerRecord[]) => void;
  onExit: () => void;
}

export const DictationScreenMode: React.FC<DictationScreenModeProps> = ({
  words,
  onFinishSession,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [replaysCount, setReplaysCount] = useState<number>(0);
  const [sessionRecords, setSessionRecords] = useState<DictationAnswerRecord[]>([]);
  const questionStartTimeRef = useRef<number>(Date.now());

  const currentWord = words[currentIndex];
  const expectedUnits = splitKanaUnits(currentWord.kana);

  // Auto-play audio on question mount
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setUserInput('');
    setIsAnswered(false);
    setReplaysCount(0);
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
    setReplaysCount((prev) => prev + 1);
    if (slow) {
      dictationAudio.playSlow(currentWord.kana);
    } else {
      dictationAudio.play(currentWord.kana);
    }
  };

  const handleInsertKana = (char: string) => {
    if (isAnswered) return;
    setUserInput((prev) => prev + char);
  };

  const handleBackspace = () => {
    if (isAnswered || userInput.length === 0) return;
    // Remove last mora (including digraphs if present)
    const units = splitKanaUnits(userInput);
    units.pop();
    setUserInput(units.join(''));
  };

  const handleClear = () => {
    if (isAnswered) return;
    setUserInput('');
  };

  const handleSubmit = () => {
    if (isAnswered || !userInput.trim()) return;
    const timeSpent = Date.now() - questionStartTimeRef.current;
    const cleanUser = userInput.trim();
    const cleanExpected = currentWord.kana.trim();
    const isCorrect = cleanUser === cleanExpected;

    const record: DictationAnswerRecord = {
      item: currentWord,
      userInputKana: cleanUser,
      isCorrect,
      timeSpentMs: timeSpent,
      replaysCount
    };

    setSessionRecords((prev) => [...prev, record]);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishSession(sessionRecords);
    }
  };

  const isCorrect = isAnswered && userInput.trim() === currentWord.kana.trim();

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top Header / Progress Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-500">
        <span>
          Word {currentIndex + 1} of {words.length}
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
          className="bg-kai-vermilion h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
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

        {/* Input Slots */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
            Target length: {expectedUnits.length} moras
          </span>
          <div className="flex justify-center gap-2 min-h-[56px] items-center">
            {expectedUnits.map((_, idx) => {
              const userUnits = splitKanaUnits(userInput);
              const charAtSlot = userUnits[idx] || '';
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

        {/* Evaluation Banner (Shown after submit) */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
              isCorrect
                ? 'bg-kai-green-bg/80 border-kai-green text-kai-green-dark'
                : 'bg-kai-vermilion-bg/80 border-kai-vermilion text-kai-vermilion-dark'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-kai-green" />
                  <span>Correct! 正解です</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-kai-vermilion" />
                  <span>Spelling: {currentWord.kana}</span>
                </>
              )}
            </div>
            <div className="text-xs text-stone-700 dark:text-stone-300 space-y-0.5">
              <p>
                <strong>Meaning:</strong> {currentWord.meaningEn}
                {currentWord.meaningTe && (
                  <span className="ml-2 font-telugu text-stone-500">
                    ({currentWord.meaningTe})
                    {!currentWord.teluguVerified && (
                      <span className="ml-1 text-[10px] text-amber-600 font-sans">[unverified]</span>
                    )}
                  </span>
                )}
              </p>
              {currentWord.kanji && (
                <p>
                  <strong>Kanji:</strong> <span className="font-serif_jp text-sm">{currentWord.kanji}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit or Next Button */}
        <div>
          {!isAnswered ? (
            <button
              type="button"
              disabled={userInput.length === 0}
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-kai-vermilion text-white font-bold font-serif_jp shadow-vermilion hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-40"
            >
              Submit Answer (回答する)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-kai-indigo text-white font-bold font-serif_jp shadow-md hover:bg-kai-indigo-light active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Next Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Keyboard */}
      <KanaKeyboard
        onInsertKana={handleInsertKana}
        onBackspace={handleBackspace}
        onClear={handleClear}
        disabled={isAnswered}
      />
    </div>
  );
};
