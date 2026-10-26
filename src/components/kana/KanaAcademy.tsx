// src/components/kana/KanaAcademy.tsx
// Comprehensive Kana Academy with Gojuon grid, animated stroke order, tracing, and Telugu phonetic guides
import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  PenTool,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { HIRAGANA_DATA } from '../../data/kanaData';
import { KanaItem } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { DrawingCanvas } from '../common/DrawingCanvas';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const KanaAcademy: React.FC = () => {
  const { displayMode, romajiEnabled, awardXP, recordAttempt, rateFSRSCard } = useLearning();
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);
  const [activeTab, setActiveTab] = useState<'grid' | 'practice' | 'quiz'>('grid');
  const [activeGroup, setActiveGroup] = useState<'all' | 'a' | 'ka' | 'sa' | 'ta' | 'na'>('all');
  const [practiceMode, setPracticeMode] = useState<'trace' | 'freehand'>('trace');
  const [isTracingComplete, setIsTracingComplete] = useState<boolean>(false);

  // Quiz state
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  const filteredKana = HIRAGANA_DATA.filter((item) => {
    if (activeGroup === 'all') return true;
    return item.row === activeGroup;
  });

  const handleSelectKana = (item: KanaItem) => {
    setSelectedKana(item);
    setIsTracingComplete(false);
    soundEffects.playClick();
  };

  const handleStrokeComplete = (strokeCount: number) => {
    if (strokeCount >= selectedKana.stroke_count) {
      setIsTracingComplete(true);
      soundEffects.playCorrect();
      awardXP(10, `Traced Hiragana ${selectedKana.character}`);
      recordAttempt({
        item_id: selectedKana.id,
        item_type: 'kana',
        skill: 'writing',
        question_type: 'stroke_tracing',
        user_response: `${strokeCount} strokes`,
        expected_response: `${selectedKana.stroke_count} strokes`,
        is_correct: true,
        response_time_ms: 2500,
        hint_used: practiceMode === 'trace',
        retry_count: 0
      });
      rateFSRSCard(selectedKana.id, 'kana', 3); // Good
    }
  };

  // Quiz questions generation
  const currentQuizItem = HIRAGANA_DATA[quizQuestionIndex % HIRAGANA_DATA.length];
  // Generate 4 options
  const quizOptions = React.useMemo(() => {
    const distractors = HIRAGANA_DATA.filter((k) => k.id !== currentQuizItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentQuizItem, ...distractors].sort(() => 0.5 - Math.random());
  }, [quizQuestionIndex, currentQuizItem]);

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIndex);
    setQuizAnswered(true);

    const isCorrect = quizOptions[optionIndex].id === currentQuizItem.id;
    if (isCorrect) {
      soundEffects.playCorrect();
      setQuizScore((prev) => prev + 1);
      awardXP(15, 'Correct Kana Recall');
      recordAttempt({
        item_id: currentQuizItem.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'multiple_choice',
        user_response: quizOptions[optionIndex].character,
        expected_response: currentQuizItem.character,
        is_correct: true,
        response_time_ms: 1800,
        hint_used: false,
        retry_count: 0
      });
      rateFSRSCard(currentQuizItem.id, 'kana', 4); // Easy
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: currentQuizItem.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'multiple_choice',
        user_response: quizOptions[optionIndex].character,
        expected_response: currentQuizItem.character,
        is_correct: false,
        error_category: 'kana_confusion',
        response_time_ms: 2200,
        hint_used: false,
        retry_count: 1
      });
      rateFSRSCard(currentQuizItem.id, 'kana', 1); // Again
    }
  };

  const nextQuizQuestion = () => {
    setQuizQuestionIndex((prev) => prev + 1);
    setQuizAnswered(false);
    setSelectedQuizOption(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header and Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border dark:border-kai-dark-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>かな道場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Kana Academy</span>
          </h1>
          <p className="text-xs text-kai-muted dark:text-kai-dark-muted">
            Master the foundational Hiragana script with Telugu phonetics and stroke demonstrations.
          </p>
        </div>

        {/* View Switcher: Grid, Handwriting Practice, Quiz */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'grid'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            Gojuon Grid
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'practice'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            Handwriting & Tracing
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            Timed Quiz
          </button>
        </div>
      </div>

      {/* Mode 1: Gojuon Grid View */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Kana Grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Row Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All (すべて)' },
                { id: 'a', label: 'あ-Row (Vowels)' },
                { id: 'ka', label: 'か-Row (K)' },
                { id: 'sa', label: 'さ-Row (S)' },
                { id: 'ta', label: 'た-Row (T)' },
                { id: 'na', label: 'な-Row (N)' }
              ].map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setActiveGroup(grp.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    activeGroup === grp.id
                      ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion'
                      : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border text-kai-muted hover:text-kai-ink'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Kana Tiles Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {filteredKana.map((item) => {
                const isSelected = selectedKana.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectKana(item)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col items-center justify-center relative select-none ${
                      isSelected
                        ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion scale-105 z-10'
                        : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border hover:border-kai-vermilion/50 hover:shadow-washi text-kai-ink dark:text-kai-dark-ink'
                    }`}
                  >
                    <span className="font-japanese text-3xl font-bold tracking-tight">
                      {item.character}
                    </span>

                    <div className="flex items-center gap-1.5 mt-1">
                      {romajiEnabled && (
                        <span className={`font-mono text-xs ${isSelected ? 'text-white/90' : 'text-kai-indigo dark:text-indigo-300'}`}>
                          {item.romaji}
                        </span>
                      )}

                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <span className={`font-telugu text-2xs font-semibold ${isSelected ? 'text-white/90' : 'text-kai-vermilion'}`}>
                          {item.telugu_phonetic}
                        </span>
                      )}
                    </div>

                    {/* Small stroke count badge */}
                    <span className={`absolute top-1.5 right-2 text-3xs font-mono opacity-60 ${isSelected ? 'text-white' : 'text-kai-muted'}`}>
                      {item.stroke_count}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Selected Kana Detail Inspector */}
          <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-5">
            <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
              <div>
                <span className="text-2xs font-mono text-kai-muted uppercase tracking-wider">
                  Character Detail
                </span>
                <h2 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  {selectedKana.character} ({selectedKana.katakana_counterpart})
                </h2>
              </div>
              <AudioButton text={selectedKana.character} size="md" showSpeedControl={true} />
            </div>

            {/* Character Big Display with Telugu explanation */}
            <div className="flex items-center gap-4 bg-kai-bg/70 dark:bg-kai-dark-bg/60 p-4 rounded-2xl border border-kai-border/50">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-kai-dark-card shadow-sm flex items-center justify-center border border-kai-border">
                <span className="font-japanese text-5xl font-bold text-kai-ink dark:text-kai-dark-ink">
                  {selectedKana.character}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-kai-indigo dark:text-indigo-300 font-bold">
                  Romaji: {selectedKana.romaji}
                </div>
                <div className="font-telugu text-sm font-semibold text-kai-vermilion">
                  తెలుగు శబ్దం: {selectedKana.telugu_phonetic}
                </div>
                <div className="text-2xs font-mono text-kai-muted">
                  Strokes: {selectedKana.stroke_count}
                </div>
              </div>
            </div>

            {/* Telugu Pronunciation Guide */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 text-xs space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 font-telugu block">
                ఉచ్చారణ మార్గదర్శి:
              </span>
              <p className="font-telugu text-amber-900/90 dark:text-amber-200/90 text-2xs leading-relaxed">
                {selectedKana.telugu_pronunciation_guide}
              </p>
            </div>

            {/* Mnemonic */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-kai-ink dark:text-kai-dark-ink">Memory Mnemonic:</span>
              <p className="text-kai-muted dark:text-kai-dark-muted text-2xs leading-relaxed">
                {selectedKana.mnemonic_en}
              </p>
            </div>

            {/* Example Words */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">Example Words:</span>
              <div className="space-y-1.5">
                {selectedKana.example_words.map((ex, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-japanese font-bold text-sm text-kai-ink dark:text-kai-dark-ink">
                          {ex.word}
                        </span>
                        <span className="font-mono text-xs text-kai-muted">{ex.romaji}</span>
                      </div>
                      <div className="text-2xs text-kai-muted mt-0.5">
                        {ex.english} • <span className="font-telugu">{ex.telugu}</span>
                      </div>
                    </div>
                    <AudioButton text={ex.word} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Button */}
            <button
              onClick={() => setActiveTab('practice')}
              className="w-full py-2.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-colors"
            >
              <PenTool size={15} />
              <span>Practice Writing {selectedKana.character}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Handwriting & Tracing Studio */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          {/* Interactive Genkō Yōshi Canvas */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-0.5">
                <span className="text-2xs font-mono text-kai-muted uppercase">Guided Writing</span>
                <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                  Trace & Write: {selectedKana.character}
                </h3>
              </div>

              {/* Mode switch: trace vs freehand */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs">
                <button
                  onClick={() => setPracticeMode('trace')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    practiceMode === 'trace' ? 'bg-white dark:bg-kai-dark-card shadow-sm text-kai-ink' : 'text-kai-muted'
                  }`}
                >
                  Trace Guide
                </button>
                <button
                  onClick={() => setPracticeMode('freehand')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    practiceMode === 'freehand' ? 'bg-white dark:bg-kai-dark-card shadow-sm text-kai-ink' : 'text-kai-muted'
                  }`}
                >
                  Freehand
                </button>
              </div>
            </div>

            <DrawingCanvas
              width={260}
              height={260}
              guideCharacter={selectedKana.character}
              showGuide={practiceMode === 'trace'}
              onStrokeComplete={handleStrokeComplete}
            />

            {isTracingComplete && (
              <div className="w-full p-3 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 flex items-center justify-between text-xs animate-in zoom-in-95">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span className="font-bold">Stroke target reached! (+10 XP)</span>
                </div>
                <button
                  onClick={() => setIsTracingComplete(false)}
                  className="font-semibold underline text-2xs"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Stroke Order Demonstration & Direction Instructions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-4">
            <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp flex items-center gap-2">
              <Layers size={17} className="text-kai-vermilion" />
              <span>Stroke Order Breakdown (筆順)</span>
            </h3>

            <p className="text-xs text-kai-muted leading-relaxed">
              Proper stroke order maintains character balance and prepares you for natural cursive writing and kanji.
            </p>

            <div className="space-y-3">
              {selectedKana.stroke_directions.map((dir, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/50 flex items-center gap-3 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-kai-vermilion text-white flex items-center justify-center font-mono font-bold text-2xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-kai-ink dark:text-kai-dark-ink font-medium">{dir}</span>
                </div>
              ))}
            </div>

            {/* Common Mistakes */}
            {selectedKana.common_mistakes.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 dark:text-amber-300">
                  ⚠️ Confusable Characters:
                </span>
                <p className="text-2xs text-amber-900/80 dark:text-amber-200/80">
                  Do not confuse <strong>{selectedKana.character}</strong> with{' '}
                  <strong>{selectedKana.common_mistakes.join(', ')}</strong>. Pay close attention to loop direction and stroke counts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Timed Quiz Mode */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div className="space-y-0.5">
              <span className="text-2xs font-mono text-kai-muted">Score: {quizScore}</span>
              <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink">
                Kana Recall Challenge
              </h3>
            </div>
            <AudioButton text={currentQuizItem.character} size="md" />
          </div>

          <div className="text-center py-6 space-y-2">
            <span className="text-xs font-mono text-kai-muted">Identify this character:</span>
            <div className="text-6xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink animate-in zoom-in-95">
              {currentQuizItem.character}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = opt.id === currentQuizItem.id;

              let btnStyle = 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink dark:text-kai-dark-ink hover:border-kai-vermilion';
              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={quizAnswered}
                  className={`p-4 rounded-2xl border text-center transition-all ${btnStyle}`}
                >
                  <div className="font-mono text-lg font-bold">{opt.romaji}</div>
                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <div className="font-telugu text-xs text-kai-vermilion mt-1">
                      {opt.telugu_phonetic}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {quizAnswered && (
            <button
              onClick={nextQuizQuestion}
              className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-sm shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95 animate-in fade-in"
            >
              <span>Next Kana Question</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
