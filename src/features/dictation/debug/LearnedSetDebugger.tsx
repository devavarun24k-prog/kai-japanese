// src/features/dictation/debug/LearnedSetDebugger.tsx
// Dev-only visual inspector for character mastery and dictation pool calculations
import React, { useState, useMemo } from 'react';
import { characterMasteryService } from '../../learning/characterMastery';
import { N5_KANA_WORDS } from '../../../data/vocab/n5KanaWords';
import { buildPool, explainShortage } from '../eligibility';
import { HIRAGANA_DATA } from '../../../data/kanaData';

export const LearnedSetDebugger: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all');

  const records = useMemo(() => {
    return characterMasteryService.getGlyphRecords();
  }, [refreshTrigger]);

  const learnedSet = useMemo(() => {
    return characterMasteryService.getLearnedGlyphs();
  }, [refreshTrigger]);

  const pool = useMemo(() => {
    return buildPool(N5_KANA_WORDS, learnedSet);
  }, [learnedSet]);

  const shortage = useMemo(() => {
    return explainShortage(20, N5_KANA_WORDS, learnedSet);
  }, [learnedSet]);

  const toggleGlyph = (glyph: string) => {
    const isCurrentlyLearned = learnedSet.has(glyph);
    characterMasteryService.setGlyphOverride(glyph, !isCurrentlyLearned);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLearnAllGojuon = () => {
    HIRAGANA_DATA.forEach((item) => {
      characterMasteryService.setGlyphOverride(item.character, true);
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleResetAll = () => {
    Object.keys(records).forEach((glyph) => {
      characterMasteryService.setGlyphOverride(glyph, false);
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  const displayedGlyphs = Object.values(records).filter((r) => {
    const isLearned = learnedSet.has(r.glyph);
    if (filter === 'learned') return isLearned;
    if (filter === 'unlearned') return !isLearned;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 bg-white/90 dark:bg-[#141D33] rounded-3xl border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DDD2B8] dark:border-[#2E4370] pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-kai-vermilion font-bold">
            [Dev Inspector]
          </span>
          <h2 className="text-xl font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
            Character Mastery & Dictation Pool Debugger
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLearnAllGojuon}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-kai-indigo text-white hover:bg-kai-indigo-light transition-colors"
          >
            + Learn All 46 Gojuon
          </button>
          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0E1626] border border-[#E8E3D9] dark:border-[#233457]">
          <span className="text-xs text-[#635F59] dark:text-[#A5A29B]">Learned Glyphs</span>
          <p className="text-2xl font-bold text-kai-indigo dark:text-[#FAF5ED]">{learnedSet.size}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0E1626] border border-[#E8E3D9] dark:border-[#233457]">
          <span className="text-xs text-[#635F59] dark:text-[#A5A29B]">Eligible Pool</span>
          <p className="text-2xl font-bold text-kai-vermilion">
            {pool.length} <span className="text-xs text-stone-500 font-normal">/ {N5_KANA_WORDS.length}</span>
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0E1626] border border-[#E8E3D9] dark:border-[#233457]">
          <span className="text-xs text-[#635F59] dark:text-[#A5A29B]">Target (20) Shortage</span>
          <p className="text-2xl font-bold text-kai-gold">
            {shortage.shortageCount === 0 ? 'Ready' : `-${shortage.shortageCount}`}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0E1626] border border-[#E8E3D9] dark:border-[#233457]">
          <span className="text-xs text-[#635F59] dark:text-[#A5A29B]">High-Yield Next Glyph</span>
          <p className="text-lg font-bold font-serif_jp text-kai-green">
            {Object.keys(shortage.unlockedIfLearned)[0]
              ? `${Object.keys(shortage.unlockedIfLearned)[0]} (+${Object.values(shortage.unlockedIfLearned)[0]} words)`
              : 'None'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        {(['all', 'learned', 'unlearned'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
              filter === tab
                ? 'bg-kai-vermilion text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Glyphs Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-56 overflow-y-auto p-2 border border-stone-200 dark:border-stone-800 rounded-2xl">
        {displayedGlyphs.map((r) => {
          const isLearned = learnedSet.has(r.glyph);
          return (
            <button
              key={r.glyph}
              onClick={() => toggleGlyph(r.glyph)}
              title={`${r.glyph} (${r.group}) - Seen: ${r.seenCount}, State: ${r.state}`}
              className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all text-sm font-serif_jp ${
                isLearned
                  ? 'bg-kai-green-bg border-kai-green text-kai-green font-bold shadow-sm'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 hover:border-stone-400'
              }`}
            >
              <span className="text-base">{r.glyph}</span>
              <span className="text-[10px] font-sans font-normal opacity-70">
                {r.manualOverride ? 'manual' : r.state}
              </span>
            </button>
          );
        })}
      </div>

      {/* Eligible Words Sample */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#14110F] dark:text-[#FAF5ED]">
          Eligible Pool Preview ({pool.length} words):
        </h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50 dark:bg-stone-900/40">
          {pool.length === 0 ? (
            <span className="text-xs text-stone-500 italic p-2">
              No words eligible yet. Toggle some glyphs above or click '+ Learn All 46 Gojuon'.
            </span>
          ) : (
            pool.map((w) => (
              <span
                key={w.id}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 text-xs border border-stone-200 dark:border-stone-700 font-serif_jp text-stone-800 dark:text-stone-200"
              >
                {w.kana} <span className="font-sans text-[10px] text-stone-500 font-normal">({w.meaningEn})</span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
