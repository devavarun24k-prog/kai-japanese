// src/components/dashboard/HomeDashboard.tsx
// Personalized Home Dashboard with real persisted metrics, today's mission, and weakness highlights
import React from 'react';
import {
  Flame,
  Zap,
  Clock,
  Repeat,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Award,
  ChevronRight,
  Target
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { MascotKai } from '../common/MascotKai';
import { storageService } from '../../services/storageService';

export const HomeDashboard: React.FC = () => {
  const { stats, setActiveSection, displayMode, awardXP } = useLearning();
  const { profile } = useAuth();
  const quests = storageService.getQuests();
  const mistakes = storageService.getMistakes();

  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);

  const startTodaysMission = () => {
    if (stats.reviews_due_count > 0) {
      setActiveSection('reviews');
    } else {
      setActiveSection('kana');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-kai-indigo to-kai-indigo-dark text-white p-6 sm:p-8 shadow-washi-lg">
        {/* Subtle Japanese pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-kai-gold font-mono text-xs border border-white/15">
              <Sparkles size={13} />
              <span>{profile.current_level}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif_jp tracking-tight text-white">
              おかえりなさい、{profile.display_name}！
            </h1>

            <p className="text-sm text-stone-200 font-sans leading-relaxed">
              {displayMode === 'telugu' || displayMode === 'bilingual' ? (
                <span className="font-telugu block text-stone-100">
                  జపనీస్ నేర్చుకోవడానికి, జపనీస్‌లో ఆలోచించడానికి సిద్ధంగా ఉండండి. నేటి లక్ష్యం ప్రారంభించండి!
                </span>
              ) : null}
              <span>
                Every stroke brings you closer to thinking naturally in Japanese. Complete today's mission to protect your streak.
              </span>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={startTodaysMission}
                className="px-5 py-2.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-sm shadow-vermilion flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span>Start Today's Mission</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setActiveSection('tutor')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm transition-colors border border-white/20"
              >
                Talk to KAI Tutor
              </button>
            </div>
          </div>

          {/* Interactive Mascot with Speech */}
          <div className="hidden sm:flex flex-col items-center">
            <MascotKai
              mood={stats.reviews_due_count > 0 ? 'thinking' : 'cheerful'}
              speechText={
                stats.reviews_due_count > 0
                  ? `You have ${stats.reviews_due_count} card(s) ready for review! Let's reinforce them!`
                  : `Terrific progress! Ready for new Hiragana characters?`
              }
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-1">
          <div className="flex items-center justify-between text-kai-muted dark:text-kai-dark-muted text-xs">
            <span>Study Streak</span>
            <Flame size={16} className="text-orange-500 fill-orange-500" />
          </div>
          <div className="text-2xl font-bold text-kai-ink dark:text-kai-dark-ink font-mono">
            {stats.streak_days} <span className="text-sm font-sans font-normal text-kai-muted">days</span>
          </div>
          <p className="text-2xs text-kai-green font-medium">Active streak protected</p>
        </div>

        {/* Total XP & Level */}
        <div className="p-4 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-1">
          <div className="flex items-center justify-between text-kai-muted dark:text-kai-dark-muted text-xs">
            <span>Mastery Level</span>
            <Zap size={16} className="text-kai-gold" />
          </div>
          <div className="text-2xl font-bold text-kai-ink dark:text-kai-dark-ink font-mono">
            Lv. {stats.level}
          </div>
          <p className="text-2xs text-kai-muted truncate">{stats.level_title}</p>
        </div>

        {/* Spaced Reviews Due */}
        <div
          onClick={() => setActiveSection('reviews')}
          className="p-4 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-kai-muted dark:text-kai-dark-muted text-xs">
            <span>Due for Review</span>
            <Repeat size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-kai-ink dark:text-kai-dark-ink font-mono">
            {stats.reviews_due_count} <span className="text-sm font-sans font-normal text-kai-muted">cards</span>
          </div>
          <p className="text-2xs text-amber-600 dark:text-amber-400 font-medium">FSRS Spaced Repetition</p>
        </div>

        {/* Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-1">
          <div className="flex items-center justify-between text-kai-muted dark:text-kai-dark-muted text-xs">
            <span>Accuracy Rate</span>
            <TrendingUp size={16} className="text-kai-green" />
          </div>
          <div className="text-2xl font-bold text-kai-ink dark:text-kai-dark-ink font-mono">
            {stats.accuracy_rate}%
          </div>
          <p className="text-2xs text-kai-muted">Based on real practice attempts</p>
        </div>
      </div>

      {/* Main Content Split: Today's Quests & Weakness remediation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Quests & Skill Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-kai-vermilion" />
                <h2 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                  Today's Mastery Quests (今日のクエスト)
                </h2>
              </div>
              <span className="text-xs text-kai-muted font-mono">
                {quests.filter((q) => q.completed).length} / {quests.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/70 dark:border-kai-dark-border flex items-center justify-between gap-4 transition-all hover:bg-stone-50"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${q.completed ? 'line-through text-kai-muted' : 'text-kai-ink dark:text-kai-dark-ink'}`}>
                        {q.title}
                      </span>
                      <span className="text-2xs px-1.5 py-0.5 rounded bg-kai-gold/15 text-kai-gold font-mono font-bold">
                        +{q.reward_xp} XP
                      </span>
                    </div>

                    {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                      <p className="font-telugu text-2xs text-kai-vermilion-dark dark:text-kai-vermilion-light">
                        {q.title_te}
                      </p>
                    )}

                    <div className="w-40 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-kai-vermilion transition-all duration-300"
                        style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    {q.completed ? (
                      <span className="text-xs font-bold text-kai-green font-mono px-2 py-1 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800">
                        Done ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (q.id === 'q_kana_recall') setActiveSection('kana');
                          else if (q.id === 'q_vocab_flash') setActiveSection('vocab');
                          else if (q.id === 'q_speaking_shadow') setActiveSection('speaking');
                          else setActiveSection('reviews');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border text-xs font-semibold text-kai-ink dark:text-kai-dark-ink hover:border-kai-vermilion hover:text-kai-vermilion transition-colors shadow-sm"
                      >
                        Action
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Breakdown Radar / Bars */}
          <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-4">
            <h2 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
              Core Competencies (4技能の習得状況)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>Kana Mastery (かな)</span>
                  <span className="font-mono">{stats.kana_mastery_pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div className="h-full bg-kai-vermilion" style={{ width: `${stats.kana_mastery_pct}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>Vocabulary (単語)</span>
                  <span className="font-mono">{stats.vocab_mastered_count} words</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div className="h-full bg-kai-indigo" style={{ width: `${Math.min(100, stats.vocab_mastered_count * 10)}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>Kanji Recognition (漢字)</span>
                  <span className="font-mono">{stats.kanji_mastered_count} kanji</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div className="h-full bg-kai-gold" style={{ width: `${Math.min(100, stats.kanji_mastered_count * 15)}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>Grammar Patterns (文法)</span>
                  <span className="font-mono">{stats.grammar_mastered_count} patterns</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div className="h-full bg-kai-green" style={{ width: `${Math.min(100, stats.grammar_mastered_count * 20)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Personal Weakness Alert & Next Recommendations */}
        <div className="space-y-6">
          {/* Weakness Alert Card */}
          <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle size={17} />
              <span>Personalized Remediation</span>
            </div>

            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              {unresolvedMistakes.length > 0 ? (
                <>
                  You have <strong>{unresolvedMistakes.length} recurring mistake(s)</strong> logged in your notebook. Focusing on these will quickly boost your retention!
                </>
              ) : (
                <>
                  Hiragana characters like <strong>さ (sa) vs き (ki)</strong> and <strong>わ (wa) vs れ (re)</strong> are the most frequent confusion points for beginners.
                </>
              )}
            </p>

            <button
              onClick={() => setActiveSection('analytics')}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Weakness Diagnosis</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Featured Minigame */}
          <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold uppercase tracking-wider text-kai-muted">
                Daily Game Arcade
              </span>
              <span className="text-2xs text-kai-vermilion font-semibold">10 Games Available</span>
            </div>

            <h3 className="text-sm font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
              Kana Reflex (早押しかなラッシュ)
            </h3>

            <p className="text-xs text-kai-muted dark:text-kai-dark-muted">
              Speed-drill identification for early Hiragana before time expires!
            </p>

            <button
              onClick={() => setActiveSection('rpg_games')}
              className="w-full py-2.5 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Play Now & Earn XP</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
