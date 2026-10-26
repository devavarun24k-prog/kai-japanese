// src/components/grammar/GrammarLab.tsx
// Structured N5/N4 Grammar curriculum with trilingual breakdowns and interactive particle quizzes
import React, { useState } from 'react';
import {
  Binary,
  Layers,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { GrammarPattern } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const GrammarLab: React.FC = () => {
  const { displayMode, awardXP, recordAttempt, rateFSRSCard } = useLearning();
  const [selectedPattern, setSelectedPattern] = useState<GrammarPattern>(GRAMMAR_DATA[0]);
  const [activeTab, setActiveTab] = useState<'explanation' | 'cloze'>('explanation');

  // Cloze Interactive Test state
  const [clozeAnswer, setClozeAnswer] = useState<string | null>(null);
  const [clozeSubmitted, setClozeSubmitted] = useState<boolean>(false);

  const clozeQuestions = [
    {
      sentence: 'これ ＿＿ 本です。',
      options: ['は (wa)', 'が (ga)', 'を (o)', 'に (ni)'],
      correctIndex: 0,
      explanationEn: 'は marks the topic "As for this..."',
      explanationTe: 'వాక్యం యొక్క టాపిక్ మార్కర్‌గా "は" వాడాలి.'
    },
    {
      sentence: '図書館 ＿＿ 勉強します。',
      options: ['に (ni)', 'で (de)', 'へ (e)', 'と (to)'],
      correctIndex: 1,
      explanationEn: 'で marks the location where active study takes place.',
      explanationTe: 'చదువుకునే పని జరుగుతున్న ప్రదేశాన్ని చెప్పడానికి "で" వాడాలి.'
    },
    {
      sentence: '水 ＿＿ 飲みます。',
      options: ['を (o)', 'は (wa)', 'で (de)', 'も (mo)'],
      correctIndex: 0,
      explanationEn: 'を marks the direct object of drinking.',
      explanationTe: 'తాగుతున్న వస్తువు (నీరు) కాబట్టి ఆబ్జెక్ట్ మార్కర్ "を" వాడాలి.'
    }
  ];
  const [currentClozeIndex, setCurrentClozeIndex] = useState<number>(0);
  const activeCloze = clozeQuestions[currentClozeIndex];

  const handleClozeSelect = (idx: number) => {
    if (clozeSubmitted) return;
    setClozeAnswer(activeCloze.options[idx]);
    setClozeSubmitted(true);

    const isCorrect = idx === activeCloze.correctIndex;
    if (isCorrect) {
      soundEffects.playCorrect();
      awardXP(20, 'Solved Grammar Cloze challenge');
      recordAttempt({
        item_id: selectedPattern.id,
        item_type: 'grammar',
        skill: 'grammar',
        question_type: 'cloze_particle',
        user_response: activeCloze.options[idx],
        expected_response: activeCloze.options[activeCloze.correctIndex],
        is_correct: true,
        response_time_ms: 1900,
        hint_used: false,
        retry_count: 0
      });
      rateFSRSCard(selectedPattern.id, 'grammar', 4);
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: selectedPattern.id,
        item_type: 'grammar',
        skill: 'grammar',
        question_type: 'cloze_particle',
        user_response: activeCloze.options[idx],
        expected_response: activeCloze.options[activeCloze.correctIndex],
        is_correct: false,
        error_category: 'particle_confusion',
        response_time_ms: 2400,
        hint_used: false,
        retry_count: 1
      });
      rateFSRSCard(selectedPattern.id, 'grammar', 1);
    }
  };

  const nextCloze = () => {
    setCurrentClozeIndex((prev) => (prev + 1) % clozeQuestions.length);
    setClozeAnswer(null);
    setClozeSubmitted(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border dark:border-kai-dark-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>文法研究所</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Grammar Lab</span>
          </h1>
          <p className="text-xs text-kai-muted dark:text-kai-dark-muted">
            Structured N5 grammar patterns, particle systems, and English + natural Telugu rules.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'explanation' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
            }`}
          >
            Pattern Rules & Breakdown
          </button>
          <button
            onClick={() => setActiveTab('cloze')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'cloze' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
            }`}
          >
            Cloze Particle Test
          </button>
        </div>
      </div>

      {activeTab === 'explanation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Grammar Syllabus */}
          <div className="space-y-3">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider text-kai-muted">
              N5 Core Syllabus
            </span>

            <div className="space-y-2">
              {GRAMMAR_DATA.map((g) => {
                const isSelected = selectedPattern.id === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      setSelectedPattern(g);
                      soundEffects.playClick();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-kai-vermilion-bg/60 dark:bg-kai-dark-card border-kai-vermilion shadow-sm'
                        : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border hover:border-kai-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-japanese font-bold text-sm text-kai-ink dark:text-kai-dark-ink">
                        {g.title_jp}
                      </span>
                      <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-kai-indigo-bg text-kai-indigo">
                        {g.category}
                      </span>
                    </div>

                    <p className="text-xs text-kai-muted mt-1 leading-snug truncate">{g.meaning_en}</p>

                    {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                      <p className="font-telugu text-2xs text-kai-vermilion font-medium mt-0.5 truncate">
                        {g.meaning_te}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Deep Grammar Breakdown */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-5">
              {/* Pattern Title & Structure Box */}
              <div className="space-y-2">
                <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-kai-indigo-bg text-kai-indigo font-bold">
                  {selectedPattern.jlpt_level} Pattern
                </span>
                <h2 className="text-xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  {selectedPattern.title}
                </h2>

                <div className="p-3.5 rounded-2xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border font-mono text-sm font-bold text-kai-indigo dark:text-indigo-300">
                  {selectedPattern.structure}
                </div>
              </div>

              {/* Explanations in English and Telugu */}
              <div className="space-y-3">
                <p className="text-xs text-kai-ink/90 dark:text-kai-dark-ink/90 leading-relaxed">
                  {selectedPattern.explanation_en}
                </p>

                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <div className="p-4 rounded-2xl bg-kai-vermilion-bg/40 dark:bg-kai-dark-card border border-kai-vermilion/20 space-y-1">
                    <span className="font-telugu text-xs font-bold text-kai-vermilion block">
                      తెలుగులో అర్థం & వివరణ:
                    </span>
                    <p className="font-telugu text-xs text-kai-ink/80 dark:text-kai-dark-ink/80 leading-relaxed">
                      {selectedPattern.explanation_te}
                    </p>
                  </div>
                )}
              </div>

              {/* Formation Rules */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Formation Rules (接続 - Setsuzoku):
                </span>
                <div className="space-y-1.5">
                  {selectedPattern.formation_rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="font-semibold text-kai-ink dark:text-kai-dark-ink">{rule.rule}</span>
                      <span className="font-japanese text-kai-muted font-medium">{rule.example}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentence Breakdown & Examples */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Word-by-Word Breakdown:
                </span>
                {selectedPattern.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-japanese font-bold text-base text-kai-ink dark:text-kai-dark-ink">
                        {ex.japanese}
                      </span>
                      <AudioButton text={ex.japanese} size="sm" />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 border-t border-kai-border/40">
                      {ex.breakdown.map((part, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border/60 text-center min-w-[80px]"
                        >
                          <span className="font-japanese font-bold text-xs text-kai-vermilion block">
                            {part.part}
                          </span>
                          <span className="text-3xs text-kai-muted block font-mono mt-0.5">
                            {part.role}
                          </span>
                          <span className="text-2xs text-kai-ink dark:text-kai-dark-ink block mt-0.5">
                            {part.meaning_en}
                          </span>
                          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                            <span className="font-telugu text-3xs text-kai-muted block">
                              {part.meaning_te}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-kai-muted space-y-0.5 pt-1">
                      <p>Meaning: {ex.english}</p>
                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <p className="font-telugu text-kai-vermilion">తెలుగు: {ex.telugu}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pitfalls & Common Mistakes */}
              {selectedPattern.common_mistakes.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-red-900 dark:text-red-300 text-xs">
                    <AlertTriangle size={15} />
                    <span>Common Learner Pitfalls:</span>
                  </div>

                  {selectedPattern.common_mistakes.map((mis, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-red-700 dark:text-red-400 font-japanese">
                          ❌ {mis.incorrect}
                        </span>
                        <span className="text-green-700 dark:text-green-400 font-japanese font-semibold">
                          ✓ {mis.correct}
                        </span>
                      </div>
                      <p className="text-2xs text-red-900/80 dark:text-red-200/80">{mis.explanation_en}</p>
                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <p className="font-telugu text-2xs text-red-900/80 dark:text-red-200/80">
                          {mis.explanation_te}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Cloze Particle Test */
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <span className="text-xs font-mono text-kai-muted">
              Question {currentClozeIndex + 1} of {clozeQuestions.length}
            </span>
            <AudioButton text={activeCloze.sentence.replace('＿＿', '...')} size="sm" />
          </div>

          <div className="text-center py-6 space-y-2">
            <span className="text-xs font-mono text-kai-muted">Choose the correct missing particle:</span>
            <div className="text-3xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
              {activeCloze.sentence}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activeCloze.options.map((opt, idx) => {
              const isSelected = clozeAnswer === opt;
              const isCorrect = idx === activeCloze.correctIndex;

              let btnStyle = 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink dark:text-kai-dark-ink hover:border-kai-vermilion';
              if (clozeSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleClozeSelect(idx)}
                  disabled={clozeSubmitted}
                  className={`p-4 rounded-2xl border text-center font-bold font-japanese text-base transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {clozeSubmitted && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-kai-bg dark:bg-kai-dark-bg border border-kai-border text-xs space-y-1">
                <p className="font-semibold text-kai-ink dark:text-kai-dark-ink">
                  {activeCloze.explanationEn}
                </p>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-kai-vermilion">{activeCloze.explanationTe}</p>
                )}
              </div>

              <button
                onClick={nextCloze}
                className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-sm shadow-vermilion flex items-center justify-center gap-2"
              >
                <span>Next Cloze Question</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
