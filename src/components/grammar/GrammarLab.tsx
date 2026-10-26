// src/components/grammar/GrammarLab.tsx
// Structured N5/N4 Grammar curriculum with trilingual breakdowns, pattern practice, and cloze particle quizzes
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
  BookOpen,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { GrammarPattern, GrammarPracticeQuestion } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { storageService } from '../../services/storageService';

export const GrammarLab: React.FC = () => {
  const { displayMode, awardXP, recordAttempt, rateFSRSCard } = useLearning();
  const [selectedPattern, setSelectedPattern] = useState<GrammarPattern>(GRAMMAR_DATA[0]);
  const [activeTab, setActiveTab] = useState<'explanation' | 'pattern_practice' | 'cloze'>('explanation');

  // Pattern Practice Question state
  const [patternQuestionIdx, setPatternQuestionIdx] = useState<number>(0);
  const [patternSelectedOpt, setPatternSelectedOpt] = useState<number | null>(null);
  const [patternSubmitted, setPatternSubmitted] = useState<boolean>(false);

  // Cloze Interactive Test state
  const [clozeAnswer, setClozeAnswer] = useState<string | null>(null);
  const [clozeSubmitted, setClozeSubmitted] = useState<boolean>(false);

  const clozeQuestions = [
    {
      sentence: 'これ ＿＿ 本です。 (This is a book.)',
      options: ['は (wa)', 'が (ga)', 'を (o)', 'に (ni)'],
      correctIndex: 0,
      explanationEn: 'は (pronounced "wa") marks the grammatical topic: "As for this, it is a book."',
      explanationTe: 'వాక్యం యొక్క ముఖ్య టాపిక్‌ను పరిచయం చేయడానికి "は" (wa) వాడాలి.'
    },
    {
      sentence: '図書館 ＿＿ 勉強します。 (I study at the library.)',
      options: ['に (ni)', 'で (de)', 'へ (e)', 'と (to)'],
      correctIndex: 1,
      explanationEn: 'で marks the active location where an action (study) occurs.',
      explanationTe: 'చదువుకునే పని జరుగుతున్న ప్రదేశాన్ని చెప్పడానికి "で" (de) వాడాలి.'
    },
    {
      sentence: '水 ＿＿ 飲みます。 (I drink water.)',
      options: ['を (o)', 'は (wa)', 'で (de)', 'も (mo)'],
      correctIndex: 0,
      explanationEn: 'を marks the direct grammatical object receiving the action of drinking.',
      explanationTe: 'త్రాగుతున్న వస్తువు (నీరు) కాబట్టి ప్రత్యక్ష కర్మ కారకంగా "を" (o) వాడాలి.'
    },
    {
      sentence: '東京 ＿＿ 行きます。 (I go to Tokyo.)',
      options: ['へ (e)', 'で (de)', 'を (o)', 'は (wa)'],
      correctIndex: 0,
      explanationEn: 'へ (pronounced "e") indicates the physical direction towards a destination.',
      explanationTe: 'చేరుకోవాల్సిన గమ్యస్థానాన్ని సూచించడానికి "へ" (e) వాడాలి.'
    },
    {
      sentence: '七時 ＿＿ 起きます。 (I wake up at 7 o\'clock.)',
      options: ['に (ni)', 'で (de)', 'を (o)', 'へ (e)'],
      correctIndex: 0,
      explanationEn: 'に marks a specific numeric point in time on the clock.',
      explanationTe: 'ఖచ్చితమైన సమయాన్ని సూచించడానికి టైమ్ మార్కర్ "に" (ni) వాడాలి.'
    },
    {
      sentence: 'わたし ＿＿ 学生です。 (I am also a student.)',
      options: ['も (mo)', 'は (wa)', 'に (ni)', 'を (o)'],
      correctIndex: 0,
      explanationEn: 'も replaces は to mean "also" or "too".',
      explanationTe: '"కూడా" (also/too) అనే భావాన్ని చెప్పడానికి "も" (mo) వాడాలి.'
    },
    {
      sentence: '友達 ＿＿ 話します。 (I talk with a friend.)',
      options: ['と (to)', 'に (ni)', 'で (de)', 'を (o)'],
      correctIndex: 0,
      explanationEn: 'と marks mutual companion: "together with".',
      explanationTe: 'కలిసి పనిచేసే వ్యక్తిని (స్నేహితుడితో) చెప్పడానికి "と" (to) వాడాలి.'
    },
    {
      sentence: 'これは わたし ＿＿ 本です。 (This is my book.)',
      options: ['の (no)', 'は (wa)', 'を (o)', 'に (ni)'],
      correctIndex: 0,
      explanationEn: 'の connects two nouns to show possession ("my book").',
      explanationTe: 'సంబంధాన్ని లేదా స్వంతాన్ని (నా యొక్క పుస్తకం) తెలపడానికి "の" (no) వాడాలి.'
    },
    {
      sentence: 'だれ ＿＿ 来ましたか？ (Who came?)',
      options: ['が (ga)', 'は (wa)', 'を (o)', 'に (ni)'],
      correctIndex: 0,
      explanationEn: 'When the question word (だれ - who) is the subject, が must be used instead of は.',
      explanationTe: 'ప్రశ్నార్థక పదం (ఎవరు) కర్తగా ఉన్నప్పుడు "が" (ga) మాత్రమే వాడాలి.'
    },
    {
      sentence: '部屋 ＿＿ 猫が います。 (There is a cat in the room.)',
      options: ['に (ni)', 'で (de)', 'へ (e)', 'を (o)'],
      correctIndex: 0,
      explanationEn: 'に marks the static location of existence when using います (animate) or あります (inanimate).',
      explanationTe: 'ఉండడం (ఇమాసు/అరిమాసు) చెప్పేటప్పుడు ఉన్న ప్రదేశానికి "に" (ni) వాడాలి.'
    },
    {
      sentence: 'バス ＿＿ 行きます。 (I go by bus.)',
      options: ['で (de)', 'に (ni)', 'を (o)', 'へ (e)'],
      correctIndex: 0,
      explanationEn: 'で marks the means or instrument of travel ("by bus").',
      explanationTe: 'ప్రయాణ సాధనాన్ని (బస్సు ద్వారా) సూచించడానికి "で" (de) వాడాలి.'
    },
    {
      sentence: '九時 ＿＿ 五時まで 働きます。 (I work from 9:00 to 5:00.)',
      options: ['から (kara)', 'まで (made)', 'に (ni)', 'で (de)'],
      correctIndex: 0,
      explanationEn: 'から marks the starting point ("from 9:00").',
      explanationTe: 'ప్రారంభ సమయాన్ని (9 గంటల నుండి) సూచించడానికి "から" (kara) వాడాలి.'
    }
  ];
  const [currentClozeIndex, setCurrentClozeIndex] = useState<number>(0);
  const activeCloze = clozeQuestions[currentClozeIndex];

  // Active pattern practice questions
  const currentPracticeQuestions: GrammarPracticeQuestion[] = selectedPattern.practice_questions || [];
  const activePatternQuestion = currentPracticeQuestions[patternQuestionIdx];

  const handleSelectPattern = (pattern: GrammarPattern) => {
    setSelectedPattern(pattern);
    setPatternQuestionIdx(0);
    setPatternSelectedOpt(null);
    setPatternSubmitted(false);
    soundEffects.playClick();
  };

  const handlePatternPracticeSelect = (idx: number) => {
    if (patternSubmitted || !activePatternQuestion) return;
    setPatternSelectedOpt(idx);
    setPatternSubmitted(true);

    const isCorrect = idx === activePatternQuestion.correct_index;
    if (isCorrect) {
      soundEffects.playCorrect();
      awardXP(20, `Mastered question for ${selectedPattern.title}`);
      recordAttempt({
        item_id: selectedPattern.id,
        item_type: 'grammar',
        skill: 'grammar',
        question_type: 'grammar_choice',
        user_response: activePatternQuestion.options[idx],
        expected_response: activePatternQuestion.options[activePatternQuestion.correct_index],
        is_correct: true,
        response_time_ms: 2200,
        hint_used: false,
        retry_count: 0
      });
      rateFSRSCard(selectedPattern.id, 'grammar', 4);
    } else {
      soundEffects.playWrong();
      storageService.logMistake(
        selectedPattern.id,
        'grammar',
        activePatternQuestion.prompt,
        activePatternQuestion.options[idx],
        activePatternQuestion.options[activePatternQuestion.correct_index],
        'grammar_rule_confusion',
        activePatternQuestion.explanation_en,
        activePatternQuestion.explanation_te
      );
      recordAttempt({
        item_id: selectedPattern.id,
        item_type: 'grammar',
        skill: 'grammar',
        question_type: 'grammar_choice',
        user_response: activePatternQuestion.options[idx],
        expected_response: activePatternQuestion.options[activePatternQuestion.correct_index],
        is_correct: false,
        error_category: 'grammar_rule_confusion',
        response_time_ms: 2600,
        hint_used: false,
        retry_count: 1
      });
      rateFSRSCard(selectedPattern.id, 'grammar', 1);
    }
  };

  const nextPatternQuestion = () => {
    if (patternQuestionIdx + 1 < currentPracticeQuestions.length) {
      setPatternQuestionIdx((prev) => prev + 1);
    } else {
      setPatternQuestionIdx(0);
    }
    setPatternSelectedOpt(null);
    setPatternSubmitted(false);
  };

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
      storageService.logMistake(
        selectedPattern.id,
        'grammar',
        activeCloze.sentence,
        activeCloze.options[idx],
        activeCloze.options[activeCloze.correctIndex],
        'particle_confusion',
        activeCloze.explanationEn,
        activeCloze.explanationTe
      );
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
            12 Structured N5/N4 patterns: sentence structure, particles, verbs, adjectives, and natural Telugu comparisons.
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
            Pattern Breakdown
          </button>
          <button
            onClick={() => setActiveTab('pattern_practice')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'pattern_practice' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
            }`}
          >
            Pattern Practice ({currentPracticeQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('cloze')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'cloze' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
            }`}
          >
            Particle Cloze Test ({clozeQuestions.length})
          </button>
        </div>
      </div>

      {activeTab === 'explanation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Grammar Syllabus */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold uppercase tracking-wider text-kai-muted">
                N5/N4 Syllabus ({GRAMMAR_DATA.length} Patterns)
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {GRAMMAR_DATA.map((g) => {
                const isSelected = selectedPattern.id === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => handleSelectPattern(g)}
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
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-kai-indigo-bg text-kai-indigo font-bold">
                    {selectedPattern.jlpt_level} Pattern
                  </span>
                  <button
                    onClick={() => setActiveTab('pattern_practice')}
                    className="text-xs text-kai-vermilion hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Practice this pattern</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

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
                      తెలుగులో అర్థం & వివరణ (Natural Telugu Comparison):
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
      ) : activeTab === 'pattern_practice' ? (
        /* Mode 2: Specific Pattern Practice */
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div>
              <span className="text-xs font-mono text-kai-indigo font-bold">{selectedPattern.title}</span>
              <p className="text-2xs text-kai-muted">
                Question {patternQuestionIdx + 1} of {currentPracticeQuestions.length || 1}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('explanation')}
              className="text-xs text-kai-muted hover:text-kai-ink flex items-center gap-1"
            >
              <span>Back to Pattern Rules</span>
            </button>
          </div>

          {activePatternQuestion ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-2xs font-mono text-kai-muted uppercase tracking-wider">Practice Challenge:</span>
                <h3 className="text-lg font-bold text-kai-ink dark:text-kai-dark-ink font-sans">
                  {activePatternQuestion.prompt}
                </h3>
              </div>

              {/* Hidden until user selects an option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePatternQuestion.options.map((opt, idx) => {
                  const isSelected = patternSelectedOpt === idx;
                  const isCorrect = idx === activePatternQuestion.correct_index;

                  let btnStyle = 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink dark:text-kai-dark-ink hover:border-kai-vermilion';
                  if (patternSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePatternPracticeSelect(idx)}
                      disabled={patternSubmitted}
                      className={`p-4 rounded-2xl border text-left font-japanese font-semibold text-sm transition-all ${btnStyle}`}
                    >
                      <span className="font-mono text-2xs mr-2 text-kai-muted">[{idx + 1}]</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanations shown only after answering */}
              {patternSubmitted && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-kai-bg dark:bg-kai-dark-bg border border-kai-border text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      {patternSelectedOpt === activePatternQuestion.correct_index ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 size={16} />
                          <span>Correct! Great understanding of this rule.</span>
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircle size={16} />
                          <span>Incorrect. Review why this rule applies:</span>
                        </span>
                      )}
                    </div>
                    <p className="text-kai-ink dark:text-kai-dark-ink">{activePatternQuestion.explanation_en}</p>
                    {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                      <p className="font-telugu text-kai-vermilion">{activePatternQuestion.explanation_te}</p>
                    )}
                  </div>

                  <button
                    onClick={nextPatternQuestion}
                    className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-sm shadow-vermilion flex items-center justify-center gap-2"
                  >
                    <span>{patternQuestionIdx + 1 < currentPracticeQuestions.length ? 'Next Practice Question' : 'Practice Completed (Repeat)'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-kai-muted text-sm">
              No questions found for this pattern.
            </div>
          )}
        </div>
      ) : (
        /* Mode 3: Cloze Particle Test */
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
