// src/features/dictation/DictationResults.tsx
// Session summary with XP reward, character mastery updates, and FSRS card sync
import React, { useEffect, useMemo } from 'react';
import { Award, CheckCircle, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { DictationAnswerRecord } from './types';
import { characterMasteryService } from '../learning/characterMastery';
import { splitKanaUnits } from './eligibility';
import { useLearning } from '../../context/LearningContext';
import { dictationAudio } from './audioEngine';
import { HankoStamp } from '../../components/fx/HankoStamp';

interface DictationResultsProps {
  records: DictationAnswerRecord[];
  onRestart: () => void;
  onExit: () => void;
}

export const DictationResults: React.FC<DictationResultsProps> = ({
  records,
  onRestart,
  onExit
}) => {
  const { awardXP, rateFSRSCard } = useLearning();

  const totalQuestions = records.length;
  const correctCount = records.filter((r) => r.isCorrect).length;
  const accuracyPct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const xpEarned = correctCount * 15 + (accuracyPct >= 80 ? 30 : 10);

  // Sync to Character Mastery & FSRS once on mount
  useEffect(() => {
    awardXP(xpEarned, `Completed Dictation Session (${accuracyPct}% Accuracy)`);

    records.forEach((rec) => {
      // 1. Character-level mastery updates per kana unit
      const units = splitKanaUnits(rec.item.kana);
      units.forEach((glyph) => {
        characterMasteryService.recordGlyphAttempt(glyph, rec.isCorrect);
      });

      // 2. Vocab-level FSRS rating
      const rating = rec.selfRating ?? (rec.isCorrect ? 3 : 1);
      rateFSRSCard(rec.item.id, 'vocab', rating);
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Victory Card */}
      <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi text-center space-y-5 relative overflow-hidden">
        {accuracyPct >= 80 && (
          <div className="absolute top-4 right-4">
            <HankoStamp text="秀" size={54} shape="square" />
          </div>
        )}

        <div className="w-16 h-16 rounded-2xl bg-kai-gold/15 text-kai-gold mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
            Dictation Complete!
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            {correctCount} of {totalQuestions} words spelled accurately
          </p>
        </div>

        {/* Big Metrics */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] font-mono uppercase text-stone-500">Accuracy</span>
            <p className="text-2xl font-bold text-kai-vermilion">{accuracyPct}%</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] font-mono uppercase text-stone-500">XP Gained</span>
            <p className="text-2xl font-bold text-kai-gold">+{xpEarned}</p>
          </div>
        </div>

        {/* Word Breakdown List */}
        <div className="space-y-2 text-left pt-3 border-t border-stone-200 dark:border-stone-800">
          <span className="text-xs font-mono font-bold uppercase text-stone-500">Words Practiced:</span>
          <div className="space-y-1.5 max-h-56 overflow-y-auto p-1">
            {records.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dictationAudio.play(r.item.kana)}
                    className="p-1 rounded-lg text-kai-indigo dark:text-kai-gold hover:bg-stone-200 dark:hover:bg-stone-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif_jp font-bold text-sm text-[#14110F] dark:text-[#FAF5ED]">
                    {r.item.kana}
                  </span>
                  <span className="text-stone-500">({r.item.meaningEn})</span>
                </div>
                <div>
                  {r.isCorrect ? (
                    <span className="text-kai-green font-bold text-xs">✓ Correct</span>
                  ) : (
                    <span className="text-kai-vermilion font-bold text-xs">✗ Review</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onRestart}
            className="py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
          <button
            type="button"
            onClick={onExit}
            className="py-3 px-4 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Finish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
