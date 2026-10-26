// src/components/kanji/KanjiDojo.tsx
// Kanji Dojo with ON/KUN readings in Telugu & English, radicals, stroke orders, and compounds
import React, { useState } from 'react';
import {
  Shapes,
  Layers,
  Sparkles,
  Volume2,
  PenTool,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { KANJI_DATA } from '../../data/kanjiData';
import { KanjiItem } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { DrawingCanvas } from '../common/DrawingCanvas';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const KanjiDojo: React.FC = () => {
  const { displayMode, awardXP, recordAttempt, rateFSRSCard } = useLearning();
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(KANJI_DATA[0]);
  const [activeTab, setActiveTab] = useState<'study' | 'trace'>('study');
  const [tracedStrokes, setTracedStrokes] = useState<number>(0);

  const handleSelectKanji = (kanji: KanjiItem) => {
    setSelectedKanji(kanji);
    setTracedStrokes(0);
    soundEffects.playClick();
  };

  const handleStrokeComplete = (strokeCount: number) => {
    setTracedStrokes(strokeCount);
    if (strokeCount >= selectedKanji.stroke_count) {
      soundEffects.playCorrect();
      awardXP(20, `Completed Kanji writing for ${selectedKanji.character}`);
      recordAttempt({
        item_id: selectedKanji.id,
        item_type: 'kanji',
        skill: 'writing',
        question_type: 'kanji_trace',
        user_response: `${strokeCount} strokes`,
        expected_response: `${selectedKanji.stroke_count} strokes`,
        is_correct: true,
        response_time_ms: 3200,
        hint_used: true,
        retry_count: 0
      });
      rateFSRSCard(selectedKanji.id, 'kanji', 3);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border dark:border-kai-dark-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>漢字道場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Kanji Dojo</span>
          </h1>
          <p className="text-xs text-kai-muted dark:text-kai-dark-muted">
            Decompose radicals, study ON/KUN readings with Telugu guides, and master writing balance.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'study' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
            }`}
          >
            Radicals & Meaning
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'trace' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
            }`}
          >
            Handwriting Practice
          </button>
        </div>
      </div>

      {/* Main Grid: Kanji Selector & Deep Dive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Grid of N5 Kanji */}
        <div className="space-y-3">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-kai-muted">
            Core N5 Kanji List
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {KANJI_DATA.map((k) => {
              const isSelected = selectedKanji.id === k.id;
              return (
                <div
                  key={k.id}
                  onClick={() => handleSelectKanji(k)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center relative select-none ${
                    isSelected
                      ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion scale-105'
                      : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border hover:border-kai-vermilion/50 hover:shadow-washi text-kai-ink dark:text-kai-dark-ink'
                  }`}
                >
                  <span className="text-4xl font-bold font-serif_jp">{k.character}</span>
                  <span className="text-xs font-medium mt-1 truncate max-w-[90%]">
                    {k.meaning_en[0]}
                  </span>
                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <span className={`font-telugu text-2xs ${isSelected ? 'text-white/90' : 'text-kai-vermilion'}`}>
                      {k.meaning_te[0]}
                    </span>
                  )}
                  <span className={`text-3xs font-mono absolute top-2 right-2 opacity-60 ${isSelected ? 'text-white' : 'text-kai-muted'}`}>
                    {k.stroke_count}画
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Study or Tracing View */}
        <div className="lg:col-span-2">
          {activeTab === 'study' ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-kai-border/60 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-kai-bg dark:bg-kai-dark-bg border border-kai-border flex items-center justify-center shadow-sm">
                    <span className="text-5xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                      {selectedKanji.character}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-kai-ink dark:text-kai-dark-ink">
                        {selectedKanji.meaning_en.join(', ')}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-kai-indigo-bg text-kai-indigo font-bold">
                        {selectedKanji.stroke_count} Strokes
                      </span>
                    </div>

                    {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                      <p className="font-telugu text-sm font-semibold text-kai-vermilion mt-0.5">
                        తెలుగు అర్థం: {selectedKanji.meaning_te.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <AudioButton text={selectedKanji.character} size="md" />
              </div>

              {/* On and Kun Readings with Telugu Guides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* On-yomi (Chinese reading) */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-kai-muted uppercase tracking-wider font-mono">
                      音読み (On'yomi - Chinese)
                    </span>
                    <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                      Compounds
                    </span>
                  </div>
                  <div className="text-base font-japanese font-bold text-kai-indigo dark:text-indigo-300">
                    {selectedKanji.on_readings.join('、 ')}
                  </div>
                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <div className="font-telugu text-2xs text-kai-muted">
                      తెలుగు ఉచ్చారణ: {selectedKanji.on_telugu.join(', ')}
                    </div>
                  )}
                </div>

                {/* Kun-yomi (Native Japanese reading) */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-kai-muted uppercase tracking-wider font-mono">
                      訓読み (Kun'yomi - Native)
                    </span>
                    <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                      Standalone
                    </span>
                  </div>
                  <div className="text-base font-japanese font-bold text-kai-vermilion">
                    {selectedKanji.kun_readings.join('、 ')}
                  </div>
                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <div className="font-telugu text-2xs text-kai-muted">
                      తెలుగు ఉచ్చారణ: {selectedKanji.kun_telugu.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Radicals Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Radical Component (部首 - Bushu):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedKanji.radicals.map((rad, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-2 rounded-xl bg-kai-bg dark:bg-kai-dark-bg border border-kai-border/60 flex items-center gap-2 text-xs"
                    >
                      <span className="font-serif_jp font-bold text-base text-kai-vermilion">
                        {rad.symbol}
                      </span>
                      <span className="text-kai-muted">{rad.meaning_en}</span>
                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <span className="font-telugu text-kai-muted">({rad.meaning_te})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mnemonic Story */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 font-serif_jp block">
                  💡 Visual Association & Mnemonic:
                </span>
                <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed text-2xs">
                  {selectedKanji.mnemonic_en}
                </p>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-amber-900/80 dark:text-amber-200/80 text-2xs mt-1">
                    {selectedKanji.mnemonic_te}
                  </p>
                )}
              </div>

              {/* Compounds / Jukugo */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Essential Compounds (熟語 - Jukugo):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedKanji.compounds.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/50 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif_jp font-bold text-sm text-kai-ink dark:text-kai-dark-ink">
                            {comp.word}
                          </span>
                          <span className="font-mono text-2xs text-kai-indigo dark:text-indigo-300">
                            {comp.reading}
                          </span>
                        </div>
                        <div className="text-2xs text-kai-muted mt-0.5">
                          {comp.english} • <span className="font-telugu">{comp.telugu}</span>
                        </div>
                      </div>
                      <AudioButton text={comp.word} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Confusable Kanji Warning if any */}
              {selectedKanji.confusable_with && selectedKanji.confusable_with.length > 0 && (
                <div className="p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-900 dark:text-red-300">
                    <AlertTriangle size={14} />
                    <span>Watch Out for Confusable Kanji:</span>
                  </div>
                  {selectedKanji.confusable_with.map((conf, idx) => (
                    <p key={idx} className="text-2xs text-red-900/80 dark:text-red-200/80">
                      <strong>{conf.character}</strong>: {conf.difference}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Tracing Studio Tab */
            <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi flex flex-col items-center gap-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                  Handwrite Kanji: {selectedKanji.character}
                </h3>
                <p className="text-xs text-kai-muted">
                  Requires {selectedKanji.stroke_count} strokes. Follow the grid quadrants carefully.
                </p>
              </div>

              <DrawingCanvas
                width={280}
                height={280}
                guideCharacter={selectedKanji.character}
                showGuide={true}
                onStrokeComplete={handleStrokeComplete}
              />

              {tracedStrokes >= selectedKanji.stroke_count && (
                <div className="p-3 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 size={16} />
                  <span>Kanji completed! (+20 XP)</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
