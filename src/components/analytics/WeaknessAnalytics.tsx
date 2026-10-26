// src/components/analytics/WeaknessAnalytics.tsx
// Personal Learning Intelligence engine analyzing attempt logs, weakness clusters, and interactive mistake notebook with on-the-spot re-attempt
import React, { useState, useMemo } from 'react';
import * as wanakana from 'wanakana';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
  Filter,
  RotateCcw,
  Volume2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { MistakeRecord, LearningAttempt, SkillType } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { AudioButton } from '../common/AudioButton';

type SkillFilter = 'all' | 'kana' | 'vocab' | 'kanji' | 'grammar';

interface ClusterInfo {
  category: string;
  labelEn: string;
  labelTe: string;
  severity: 'high' | 'medium' | 'low';
  failCount: number;
  totalCount: number;
  failRate: number;
  descriptionEn: string;
  descriptionTe: string;
  targetSection: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'listening' | 'sentence';
  affectedItems: string[];
}

export const WeaknessAnalytics: React.FC = () => {
  const { displayMode, setActiveSection, awardXP } = useLearning();
  const [attempts, setAttempts] = useState<LearningAttempt[]>(() => storageService.getAttempts());
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => storageService.getMistakes());
  const [activeTab, setActiveTab] = useState<'overview' | 'notebook'>('overview');
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  // In-line re-attempt state
  const [reattemptMistakeId, setReattemptMistakeId] = useState<string | null>(null);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [attemptFeedback, setAttemptFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Dynamic Weakness Clustering from real attempts
  const { clusters, totalInteractions, overallAccuracy, hasEnoughData } = useMemo(() => {
    const total = attempts.length;
    const enough = total >= 5;

    if (!enough) {
      return {
        clusters: [],
        totalInteractions: total,
        overallAccuracy: 100,
        hasEnoughData: false
      };
    }

    const correctCount = attempts.filter((a) => a.is_correct).length;
    const accuracy = Math.round((correctCount / total) * 100);

    // Group failed attempts by error_category or skill
    const failed = attempts.filter((a) => !a.is_correct);
    const categoryMap: Record<
      string,
      { failCount: number; totalCount: number; items: Set<string>; targetSection: any }
    > = {};

    attempts.forEach((att) => {
      const cat = att.error_category || `${att.skill}_general`;
      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          failCount: 0,
          totalCount: 0,
          items: new Set(),
          targetSection:
            att.item_type === 'kana'
              ? 'kana'
              : att.item_type === 'vocab'
              ? 'vocab'
              : att.item_type === 'kanji'
              ? 'kanji'
              : att.item_type === 'listening'
              ? 'listening'
              : att.item_type === 'sentence'
              ? 'sentence'
              : 'grammar'
        };
      }
      categoryMap[cat].totalCount += 1;
      if (!att.is_correct) {
        categoryMap[cat].failCount += 1;
        categoryMap[cat].items.add(att.item_id || att.expected_response);
      }
    });

    const clusterList: ClusterInfo[] = [];

    // Category descriptive definitions
    const definitions: Record<
      string,
      { labelEn: string; labelTe: string; descEn: string; descTe: string; defaultTarget: any }
    > = {
      particle_confusion: {
        labelEn: 'Particle Nuance Overlap (は vs が / に vs で)',
        labelTe: 'విభక్తుల (పార్టికల్స్) వినియోగంలో సందిగ్ధత',
        descEn: 'Confusing topic marker は with subject marker が, or location marker で with destination に.',
        descTe: 'విషయ సూచిక "は" మరియు కర్త సూచిక "が" లేదా స్థల సూచిక "で" ల మధ్య వ్యత్యాసాన్ని సరిగ్గా గుర్తించాలి.',
        defaultTarget: 'grammar'
      },
      kana_confusion: {
        labelEn: 'Similar Kana Distinctions (さ vs き / わ vs れ)',
        labelTe: 'సారూప్య కానా అక్షరాల మధ్య గందరగోళం',
        descEn: 'Visual confusion between similar stroke trajectories and mirror shapes.',
        descTe: 'ఒకేలా కనిపించే అక్షరాల స్ట్రోక్ ఆర్డర్ మరియు తేడాలను నిశితంగా గమనించాలి.',
        defaultTarget: 'kana'
      },
      listening_confusion: {
        labelEn: 'Mora Timing & Pitch Discrimination',
        labelTe: 'ధ్వని సమయపాలన మరియు వినికిడి వ్యత్యాసాలు',
        descEn: 'Difficulty distinguishing double consonants (促音 っ) or long vowels from short vowels.',
        descTe: 'దీర్ఘ స్వరాలు మరియు ఒత్తుల (っ) ఉచ్చారణ వ్యవధిని జాగ్రత్తగా వినడం అవసరం.',
        defaultTarget: 'listening'
      },
      word_order_or_particles: {
        labelEn: 'Sentence Composition & Particle Ordering',
        labelTe: 'వాక్య నిర్మాణంలో పదాల క్రమం',
        descEn: 'Predicate-final Japanese SOV word order requires placing verbs at the very end.',
        descTe: 'జపనీస్ వాక్యాలలో క్రియ ఎల్లప్పుడూ చివరనే ఉంటుంది (SOV).',
        defaultTarget: 'sentence'
      },
      grammar_rule_confusion: {
        labelEn: 'Grammatical Structure Formation',
        labelTe: 'వ్యాకరణ సూత్రాల ప్రయోగం',
        descEn: 'Conjugation rules and polite vs plain form endings.',
        descTe: 'మర్యాదపూర్వక మరియు సాధారణ క్రియల రూపాల నియమాలు.',
        defaultTarget: 'grammar'
      }
    };

    Object.entries(categoryMap).forEach(([catKey, data]) => {
      if (data.failCount > 0) {
        const def = definitions[catKey] || {
          labelEn: `${catKey.replace(/_/g, ' ').toUpperCase()}`,
          labelTe: 'సాధన చేయవలసిన అంశం',
          descEn: `Recorded ${data.failCount} errors across ${data.totalCount} evaluations.`,
          descTe: `${data.failCount} సార్లు పొరపాట్లు నమోదయ్యాయి.`,
          defaultTarget: data.targetSection
        };

        const rate = Math.round((data.failCount / data.totalCount) * 100);
        const severity: 'high' | 'medium' | 'low' =
          rate >= 40 || data.failCount >= 3 ? 'high' : rate >= 20 || data.failCount >= 2 ? 'medium' : 'low';

        clusterList.push({
          category: catKey,
          labelEn: def.labelEn,
          labelTe: def.labelTe,
          severity,
          failCount: data.failCount,
          totalCount: data.totalCount,
          failRate: rate,
          descriptionEn: def.descEn,
          descriptionTe: def.descTe,
          targetSection: def.defaultTarget,
          affectedItems: Array.from(data.items)
        });
      }
    });

    // Sort by severity (high first), then failCount
    clusterList.sort((a, b) => {
      const order = { high: 3, medium: 2, low: 1 };
      if (order[b.severity] !== order[a.severity]) {
        return order[b.severity] - order[a.severity];
      }
      return b.failCount - a.failCount;
    });

    return {
      clusters: clusterList,
      totalInteractions: total,
      overallAccuracy: accuracy,
      hasEnoughData: true
    };
  }, [attempts]);

  // Filtered mistakes
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      const matchesSkill = skillFilter === 'all' || m.item_type === skillFilter;
      const matchesResolved = showResolved ? true : !m.resolved;
      return matchesSkill && matchesResolved;
    });
  }, [mistakes, skillFilter, showResolved]);

  const handleResolveMistake = (id: string) => {
    storageService.resolveMistake(id);
    setMistakes(storageService.getMistakes());
    soundEffects.playCorrect();
  };

  const handleStartReattempt = (m: MistakeRecord) => {
    setReattemptMistakeId(m.id);
    setUserAnswerInput('');
    setAttemptFeedback(null);
  };

  const handleCheckReattempt = (m: MistakeRecord) => {
    const trimmed = userAnswerInput.trim();
    if (!trimmed) return;

    const kanaConverted = wanakana.toHiragana(trimmed);
    const expected = m.correct_answer.trim();
    const expectedRomaji = wanakana.toRomaji(expected).toLowerCase();

    const isMatch =
      trimmed === expected ||
      kanaConverted === expected ||
      trimmed.toLowerCase() === expectedRomaji ||
      wanakana.toHiragana(trimmed) === wanakana.toHiragana(expected);

    if (isMatch) {
      soundEffects.playCorrect();
      awardXP(15, 'Mastered Mistake Re-attempt');
      storageService.resolveMistake(m.id);
      setMistakes(storageService.getMistakes());
      setAttemptFeedback({
        isCorrect: true,
        message: 'Correct! Mastered and marked resolved.'
      });
      setTimeout(() => {
        setReattemptMistakeId(null);
        setAttemptFeedback(null);
        setUserAnswerInput('');
      }, 1500);
    } else {
      soundEffects.playWrong();
      setAttemptFeedback({
        isCorrect: false,
        message: `Incorrect. Expected "${m.correct_answer}". Check notes below.`
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>学習分析</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Weakness Analytics & Intelligence</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Evidence-based diagnostic tracking identifying recurring confusion points and recovery strategies.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold'
                : 'text-kai-muted'
            }`}
          >
            Diagnostic Report
          </button>
          <button
            onClick={() => setActiveTab('notebook')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'notebook'
                ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold'
                : 'text-kai-muted'
            }`}
          >
            Mistake Notebook ({mistakes.filter((m) => !m.resolved).length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {!hasEnoughData ? (
            /* Honest Empty State when < 5 attempts */
            <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border text-center space-y-4 shadow-washi">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 text-kai-indigo dark:text-blue-300 flex items-center justify-center mx-auto">
                <Brain size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-kai-ink dark:text-white font-serif_jp">
                  Calibrating Your Learning Intelligence
                </h3>
                <p className="text-xs text-kai-muted max-w-md mx-auto leading-relaxed">
                  Need at least 5 practice attempts to generate diagnostic weakness clusters.
                  Currently: <strong className="text-kai-vermilion">{totalInteractions} / 5</strong> completed.
                </p>
              </div>

              {/* Progress bar to 5 attempts */}
              <div className="max-w-xs mx-auto space-y-1">
                <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-kai-vermilion rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalInteractions / 5) * 100)}%` }}
                  />
                </div>
                <span className="text-3xs font-mono text-kai-muted">
                  {5 - totalInteractions} more attempts needed for automated cluster diagnostics
                </span>
              </div>

              {/* Quick Launch Practice Shortcuts */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setActiveSection('kana')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-xs font-semibold text-kai-ink transition-all"
                >
                  Practice Kana
                </button>
                <button
                  onClick={() => setActiveSection('vocab')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-xs font-semibold text-kai-ink transition-all"
                >
                  Practice Vocab
                </button>
                <button
                  onClick={() => setActiveSection('grammar')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-xs font-semibold text-kai-ink transition-all"
                >
                  Practice Grammar
                </button>
                <button
                  onClick={() => setActiveSection('sentence')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-xs font-semibold text-kai-ink transition-all"
                >
                  Practice Sentences
                </button>
              </div>
            </div>
          ) : (
            /* Diagnostic Analysis with Real Clusters */
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-kai-vermilion font-bold text-sm">
                    <Brain size={18} />
                    <span>Algorithmic Diagnostic Summary</span>
                  </div>
                  <div className="flex items-center gap-3 text-2xs font-mono text-kai-muted">
                    <span>Logs Analyzed: {totalInteractions}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Accuracy: {overallAccuracy}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-kai-ink/90 dark:text-kai-dark-ink/90 leading-relaxed">
                  Based on your {totalInteractions} stored interaction logs across quizzes, drills, and typing recall, KAI has identified {clusters.length} active error clusters. Targeted remediation drills have been generated below to solidify recall.
                </p>

                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs font-telugu text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold block">తెలుగు అభ్యాసకుల విశ్లేషణ:</span>
                    <p className="leading-relaxed">
                      మీ నిజమైన అభ్యాస వివరాల ఆధారంగా, వ్యాకరణంలో విభక్తుల వినియోగం మరియు సమానంగా కనిపించే కానా అక్షరాల మధ్య వ్యత్యాసాలను మెరుగుపరచడానికి కింద ఉన్న ప్రత్యక సాధనలను ఉపయోగించండి.
                    </p>
                  </div>
                )}
              </div>

              {/* Identified Clusters */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-kai-ink dark:text-white font-serif_jp flex items-center gap-2">
                  <span>Detected Error Clusters</span>
                  <span className="text-2xs font-mono text-kai-muted font-normal">
                    ({clusters.length} active)
                  </span>
                </h3>

                {clusters.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 text-center space-y-1">
                    <CheckCircle2 size={24} className="text-green-600 mx-auto" />
                    <p className="text-xs font-bold text-green-800 dark:text-green-300">
                      Zero Active Error Clusters!
                    </p>
                    <p className="text-2xs text-green-700 dark:text-green-400">
                      Your recent practice attempts demonstrate 100% recall across evaluated categories.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clusters.map((cluster) => (
                      <div
                        key={cluster.category}
                        className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-2xs font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                                cluster.severity === 'high'
                                  ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/60'
                                  : cluster.severity === 'medium'
                                  ? 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60'
                                  : 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950/60'
                              }`}
                            >
                              {cluster.severity} severity ({cluster.failRate}% failure)
                            </span>
                            <span className="text-2xs font-mono text-kai-muted">
                              {cluster.failCount} / {cluster.totalCount} failed
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                            {cluster.labelEn}
                          </h4>

                          <p className="text-xs text-kai-muted leading-relaxed">
                            {cluster.descriptionEn}
                          </p>

                          {(displayMode === 'telugu' || displayMode === 'bilingual') && cluster.descriptionTe && (
                            <p className="text-xs font-telugu text-kai-vermilion leading-relaxed">
                              {cluster.descriptionTe}
                            </p>
                          )}

                          {cluster.affectedItems.length > 0 && (
                            <div className="pt-1 flex flex-wrap gap-1">
                              <span className="text-3xs font-mono text-kai-muted mr-1">Trigger items:</span>
                              {cluster.affectedItems.slice(0, 4).map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-kai-ink dark:text-stone-300"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setActiveSection(cluster.targetSection)}
                          className="w-full mt-2 py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-kai-ink text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Launch Remediation Drill</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mistake Notebook View */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-kai-dark-card p-3 rounded-2xl border border-kai-border">
            {/* Skill Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-2xs font-mono">
              <Filter size={12} className="text-kai-muted mr-1 shrink-0" />
              {(['all', 'kana', 'vocab', 'kanji', 'grammar'] as const).map((tab) => {
                const count = mistakes.filter((m) => (tab === 'all' ? true : m.item_type === tab)).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setSkillFilter(tab)}
                    className={`px-3 py-1 rounded-xl transition-all capitalize font-medium ${
                      skillFilter === tab
                        ? 'bg-kai-ink text-white dark:bg-kai-dark-ink dark:text-kai-ink font-bold'
                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <span>{tab}</span>
                    <span className="ml-1 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Resolved toggle */}
            <label className="flex items-center gap-2 text-2xs font-mono text-kai-muted cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded accent-kai-vermilion"
              />
              <span>Show Mastered ({mistakes.filter((m) => m.resolved).length})</span>
            </label>
          </div>

          {filteredMistakes.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border text-center space-y-2 shadow-washi">
              <ShieldCheck size={36} className="text-kai-green mx-auto" />
              <h3 className="font-bold text-base text-kai-ink dark:text-white">Clean Slate!</h3>
              <p className="text-xs text-kai-muted">No unresolved mistakes found matching your selected filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMistakes.map((m) => {
                const isReattempting = reattemptMistakeId === m.id;

                return (
                  <div
                    key={m.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      m.resolved
                        ? 'bg-stone-50 dark:bg-kai-dark-bg/40 opacity-70 border-kai-border'
                        : 'bg-white dark:bg-kai-dark-card border-kai-border shadow-washi'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase bg-stone-100 dark:bg-stone-800 text-kai-vermilion">
                            {m.item_type}
                          </span>
                          <span className="font-bold text-sm text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                            {m.prompt}
                          </span>
                          <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-100 text-kai-muted">
                            Failed {m.frequency}x
                          </span>
                          {m.resolved && (
                            <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                              ✓ Mastered
                            </span>
                          )}
                        </div>

                        {!isReattempting ? (
                          <>
                            <div className="flex items-center gap-3 text-xs pt-1">
                              <span className="text-red-600 line-through font-japanese">
                                {m.mistaken_input}
                              </span>
                              <span className="text-green-700 dark:text-green-400 font-bold font-japanese flex items-center gap-1">
                                ✓ {m.correct_answer}
                                <AudioButton text={m.correct_answer} size="sm" />
                              </span>
                            </div>

                            <p className="text-2xs text-kai-muted leading-relaxed">{m.notes_en}</p>
                            {(displayMode === 'telugu' || displayMode === 'bilingual') && m.notes_te && (
                              <p className="font-telugu text-2xs text-kai-vermilion">{m.notes_te}</p>
                            )}
                          </>
                        ) : (
                          /* In-line Re-attempt card */
                          <div className="pt-2 space-y-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-kai-border">
                            <span className="text-2xs font-mono text-kai-muted block font-semibold">
                              Immediate Re-attempt: Type the correct answer
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={userAnswerInput}
                                onChange={(e) => {
                                  setUserAnswerInput(e.target.value);
                                  setAttemptFeedback(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCheckReattempt(m);
                                }}
                                placeholder="Type answer in Romaji or Japanese..."
                                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-kai-border bg-white dark:bg-stone-800 text-kai-ink dark:text-white font-japanese focus:outline-none focus:ring-1 focus:ring-kai-vermilion"
                                autoFocus
                              />
                              <button
                                onClick={() => handleCheckReattempt(m)}
                                className="px-4 py-1.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-sm transition-all"
                              >
                                Check
                              </button>
                              <button
                                onClick={() => {
                                  setReattemptMistakeId(null);
                                  setAttemptFeedback(null);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            </div>

                            {attemptFeedback && (
                              <div
                                className={`text-2xs font-semibold p-2 rounded-lg ${
                                  attemptFeedback.isCorrect
                                    ? 'bg-green-100 text-green-900 dark:bg-green-950/60 dark:text-green-300'
                                    : 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-300'
                                }`}
                              >
                                {attemptFeedback.message}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
                        {!m.resolved && !isReattempting && (
                          <button
                            onClick={() => handleStartReattempt(m)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <RotateCcw size={12} />
                            <span>Re-attempt</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveMistake(m.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            m.resolved
                              ? 'bg-stone-100 hover:bg-stone-200 text-stone-500'
                              : 'bg-stone-100 hover:bg-green-100 text-stone-700 hover:text-green-800'
                          }`}
                        >
                          {m.resolved ? 'Mark Unresolved' : 'Mark Mastered'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
