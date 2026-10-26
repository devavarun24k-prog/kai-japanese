// src/components/planner/StudyPlanner.tsx
// Personalized Japanese study scheduler and interleaving memory coach
import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Brain,
  RotateCcw
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../services/soundEffects';

export const StudyPlanner: React.FC = () => {
  const { stats, setActiveSection, awardXP, displayMode } = useLearning();
  const { profile, updateProfile } = useAuth();
  const [targetMinutes, setTargetMinutes] = useState<number>(profile.daily_goal_minutes || 20);
  const [streakFrozen, setStreakFrozen] = useState<boolean>(false);

  const durations = [10, 20, 30, 45];

  const handleSetDuration = (min: number) => {
    setTargetMinutes(min);
    updateProfile({ daily_goal_minutes: min });
    soundEffects.playClick();
  };

  const handleFreezeStreak = () => {
    setStreakFrozen(true);
    soundEffects.playLevelUp();
    awardXP(10, 'Activated Streak Shield protection');
  };

  // Generate interleaved study session blocks based on minutes
  const sessionPlan = [
    { title: 'FSRS Spaced Repetition Queue', duration: '5 min', desc: 'Clear due reviews while retrievability is high', section: 'reviews', icon: '🔁' },
    { title: 'New Hiragana Stroke Practice', duration: '5 min', desc: 'Trace 2 new characters on the genkō yōshi grid', section: 'kana', icon: '✍️' },
    { title: 'Sentence Forge Construction', duration: '5 min', desc: 'Build 3 natural sentences using SOV particle grammar', section: 'sentence', icon: '🔨' },
    ...(targetMinutes >= 20 ? [{ title: 'Speaking Studio Shadowing', duration: '5 min', desc: 'Push-to-talk vocal practice to cement mora timing', section: 'speaking', icon: '🎙️' }] : []),
    ...(targetMinutes >= 30 ? [{ title: 'Reading Graded Reader Story', duration: '10 min', desc: 'Comprehend vocabulary in context with furigana', section: 'reading', icon: '📖' }] : []),
    ...(targetMinutes >= 45 ? [{ title: 'RPG Boss Battle Drill', duration: '15 min', desc: 'Test verb conjugation and speed recall in the arcade', section: 'rpg_games', icon: '🎮' }] : [])
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>学習計画</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Study Planner & Memory Coach</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Science-backed interleaving schedule balancing recall, production, and revision.
          </p>
        </div>

        {/* Streak Shield Status */}
        <div className="flex items-center gap-2">
          {streakFrozen ? (
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              🛡️ Streak Shield Active
            </span>
          ) : (
            <button
              onClick={handleFreezeStreak}
              className="px-3 py-1 rounded-xl bg-orange-50 text-orange-800 text-xs font-semibold border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              Protect Today's Streak
            </button>
          )}
        </div>
      </div>

      {/* Study Duration Selector */}
      <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-kai-ink dark:text-kai-dark-ink">
            <Clock size={16} className="text-kai-vermilion" />
            <span>Select Available Daily Study Time</span>
          </div>
          <span className="font-mono text-xs text-kai-muted">{targetMinutes} minutes/day</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => handleSetDuration(d)}
              className={`p-3.5 rounded-2xl border text-center font-bold text-sm transition-all ${
                targetMinutes === d
                  ? 'bg-kai-indigo text-white border-kai-indigo shadow-sm scale-105'
                  : 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-muted hover:text-kai-ink'
              }`}
            >
              {d} Minutes
            </button>
          ))}
        </div>
      </div>

      {/* Generated Interleaved Session Plan */}
      <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-4">
        <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-kai-gold" />
            <h2 className="text-base font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
              Today's Interleaved Learning Routine ({targetMinutes} min total)
            </h2>
          </div>
          <span className="text-2xs font-mono text-kai-muted">Cognitive Load Balanced</span>
        </div>

        <div className="space-y-3">
          {sessionPlan.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/70 flex items-center justify-between gap-4 transition-all hover:bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-kai-ink dark:text-kai-dark-ink">
                      {step.title}
                    </span>
                    <span className="text-3xs font-mono px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-2xs text-kai-muted mt-0.5">{step.desc}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveSection(step.section as any)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border text-xs font-semibold text-kai-ink dark:text-white hover:border-kai-vermilion hover:text-kai-vermilion shadow-sm flex items-center gap-1 flex-shrink-0"
              >
                <span>Launch</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
