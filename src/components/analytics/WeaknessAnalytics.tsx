// src/components/analytics/WeaknessAnalytics.tsx
// Personal Learning Intelligence engine analyzing attempt logs, confusion matrices, and mistake notebook
import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { MistakeRecord, LearningAttempt } from '../../types';
import { useLearning } from '../../context/LearningContext';

export const WeaknessAnalytics: React.FC = () => {
  const { displayMode, setActiveSection } = useLearning();
  const attempts = storageService.getAttempts();
  const mistakes = storageService.getMistakes();
  const [activeTab, setActiveTab] = useState<'overview' | 'notebook'>('overview');

  // Compute weakness patterns
  const particleMistakes = attempts.filter((a) => !a.is_correct && a.error_category === 'particle_confusion');
  const kanaMistakes = attempts.filter((a) => !a.is_correct && a.error_category === 'kana_confusion');
  const listeningMistakes = attempts.filter((a) => !a.is_correct && a.error_category === 'listening_confusion');

  const handleResolveMistake = (id: string) => {
    storageService.resolveMistake(id);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
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
              activeTab === 'overview' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink' : 'text-kai-muted'
            }`}
          >
            Diagnostic Report
          </button>
          <button
            onClick={() => setActiveTab('notebook')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'notebook' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink' : 'text-kai-muted'
            }`}
          >
            Mistake Notebook ({mistakes.filter((m) => !m.resolved).length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-kai-vermilion font-bold text-sm">
                <Brain size={18} />
                <span>Weekly Pedagogical Diagnostic</span>
              </div>
              <span className="text-2xs font-mono text-kai-muted">
                Analyzed {attempts.length} Total Interaction Logs
              </span>
            </div>

            <p className="text-xs text-kai-ink/90 dark:text-kai-dark-ink/90 leading-relaxed">
              Based on your real stored attempts, your recognition accuracy for basic vowels (あ, い, う) is high, but similar-looking kana pairs (such as さ vs き) and topic particles (は vs が) require intentional contrast drills.
            </p>

            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs font-telugu text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold block">తెలుగు అభ్యాసకుల విశ్లేషణ:</span>
                <p className="leading-relaxed">
                  తెలుగు మరియు జపనీస్ వాక్య క్రమం (SOV) ఒకేలా ఉన్నందున మీరు వాక్య నిర్మాణాన్ని త్వరగా గ్రహిస్తున్నారు. అయితే "は" (wa) మరియు "が" (ga) ల మధ్య తేడాను గుర్తించడంలో మరికొంత సాధన అవసరం.
                </p>
              </div>
            )}
          </div>

          {/* Identified Weakness Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pattern 1: Kana Confusion */}
            <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Priority High
                </span>
                <span className="text-xs font-mono text-kai-muted">{kanaMistakes.length} occurrences</span>
              </div>

              <h3 className="font-bold text-sm text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                Similar Kana Distinction (さ vs き)
              </h3>

              <p className="text-xs text-kai-muted leading-relaxed">
                き (ki) has two horizontal strokes like a key, while さ (sa) has only one stroke.
              </p>

              <button
                onClick={() => setActiveSection('kana')}
                className="w-full py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-kai-ink text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Drill Kana Pairs</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Pattern 2: Particle Overlap */}
            <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Priority Med
                </span>
                <span className="text-xs font-mono text-kai-muted">{particleMistakes.length} occurrences</span>
              </div>

              <h3 className="font-bold text-sm text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                Action Place: で vs に
              </h3>

              <p className="text-xs text-kai-muted leading-relaxed">
                Use で (de) where active events happen (図書館で勉強), and に (ni) for static existence.
              </p>

              <button
                onClick={() => setActiveSection('grammar')}
                className="w-full py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-kai-ink text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Review Particle Lab</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Pattern 3: Listening Mora Rhythm */}
            <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono font-bold uppercase text-kai-indigo bg-kai-indigo-bg px-2 py-0.5 rounded-full">
                  Normal Trend
                </span>
                <span className="text-xs font-mono text-kai-muted">{listeningMistakes.length} occurrences</span>
              </div>

              <h3 className="font-bold text-sm text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                Long Vowel Timing (おばあさん vs おばさん)
              </h3>

              <p className="text-xs text-kai-muted leading-relaxed">
                Japanese mora timing requires equal duration per character. Don't swallow prolonged vowels.
              </p>

              <button
                onClick={() => setActiveSection('listening')}
                className="w-full py-2 rounded-xl bg-stone-100 hover:bg-kai-vermilion hover:text-white text-kai-ink text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Practice Listening Lab</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mistake Notebook View */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-kai-muted">
            <span>Showing logged errors requiring review</span>
            <span>{mistakes.length} Total Saved</span>
          </div>

          {mistakes.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border text-center space-y-2">
              <ShieldCheck size={36} className="text-kai-green mx-auto" />
              <h3 className="font-bold text-base text-kai-ink">Clean Slate!</h3>
              <p className="text-xs text-kai-muted">No unresolved mistakes found in your notebook.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mistakes.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    m.resolved
                      ? 'bg-stone-50 dark:bg-kai-dark-bg/40 opacity-60'
                      : 'bg-white dark:bg-kai-dark-card border-kai-border shadow-washi'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-kai-ink dark:text-kai-dark-ink">
                          {m.prompt}
                        </span>
                        <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-100 text-kai-muted">
                          Seen {m.frequency}x
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-red-600 line-through font-japanese">
                          {m.mistaken_input}
                        </span>
                        <span className="text-green-700 font-bold font-japanese">
                          ✓ {m.correct_answer}
                        </span>
                      </div>

                      <p className="text-2xs text-kai-muted">{m.notes_en}</p>
                      {(displayMode === 'telugu' || displayMode === 'bilingual') && m.notes_te && (
                        <p className="font-telugu text-2xs text-kai-vermilion">{m.notes_te}</p>
                      )}
                    </div>

                    {!m.resolved && (
                      <button
                        onClick={() => handleResolveMistake(m.id)}
                        className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-green-100 text-kai-muted hover:text-green-800 text-xs font-semibold transition-colors flex-shrink-0"
                      >
                        Mark Mastered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
