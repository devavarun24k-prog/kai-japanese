// src/components/planner/StudyPlanner.tsx
// Personalized Japanese study scheduler and interleaving memory coach with real lesson progression and task persistence
import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Brain,
  RotateCcw,
  CheckSquare,
  Square,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../services/soundEffects';
import { storageService } from '../../services/storageService';
import { fsrsService } from '../../services/fsrsService';
import { HIRAGANA_LESSONS, KATAKANA_LESSONS } from '../../data/kanaData';

interface PlannedTask {
  id: string;
  title: string;
  titleTe: string;
  durationMinutes: number;
  description: string;
  section: string;
  icon: string;
  tag: string;
}

export const StudyPlanner: React.FC = () => {
  const { stats, setActiveSection, awardXP, displayMode } = useLearning();
  const { profile, updateProfile } = useAuth();
  const [targetMinutes, setTargetMinutes] = useState<number>(profile.daily_goal_minutes || 20);
  const [streakFrozen, setStreakFrozen] = useState<boolean>(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const storageKey = `kai_planner_tasks_${todayStr}`;

  // Completed task IDs for today
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [routineRewarded, setRoutineRewarded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`kai_routine_rewarded_${todayStr}`) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Calculate real metrics
  const cards = storageService.getCards();
  const dueCardsCount = fsrsService.getDueCards(cards).length;
  const completedLessons = storageService.getCompletedLessons();
  const mistakes = storageService.getMistakes().filter((m) => !m.resolved);

  // Next incomplete lesson
  const nextLesson = useMemo(() => {
    // 1. Check Hiragana lessons
    const nextH = HIRAGANA_LESSONS.find((l) => !completedLessons.includes(l.id));
    if (nextH) {
      return {
        id: nextH.id,
        title: `Hiragana: ${nextH.title}`,
        titleTe: nextH.titleTe,
        system: 'kana'
      };
    }
    // 2. Check Katakana lessons
    const nextK = KATAKANA_LESSONS.find((l) => !completedLessons.includes(l.id));
    if (nextK) {
      return {
        id: nextK.id,
        title: `Katakana: ${nextK.title}`,
        titleTe: nextK.titleTe,
        system: 'kana'
      };
    }
    return {
      id: 'kana_mastered',
      title: 'Kana Academy Mastered (46/46)',
      titleTe: 'కానా అభ్యాసం పూర్తయింది',
      system: 'vocab'
    };
  }, [completedLessons]);

  const durations = [10, 15, 20, 30, 45];

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

  // Generate interleaved study tasks dynamically based on user's real state
  const sessionPlan: PlannedTask[] = useMemo(() => {
    const tasks: PlannedTask[] = [];

    // Task 1: Spaced Repetition (5 min)
    tasks.push({
      id: 'task_fsrs_review',
      title: `FSRS Spaced Repetition (${dueCardsCount} due)`,
      titleTe: `జ్ఞాపకశక్తి పునశ్చరణ (${dueCardsCount} అంశాలు)`,
      durationMinutes: 5,
      description:
        dueCardsCount > 0
          ? `Clear your ${dueCardsCount} due memory review cards before stability decays.`
          : 'Keep memory stability peaked with quick active recall cards.',
      section: 'reviews',
      icon: '🔁',
      tag: 'Recall'
    });

    // Task 2: Core Next Lesson (5 min)
    tasks.push({
      id: `task_lesson_${nextLesson.id}`,
      title: `Core Lesson: ${nextLesson.title}`,
      titleTe: nextLesson.titleTe,
      durationMinutes: 5,
      description: 'Progress through sequential curriculum with stroke order and Telugu phonetics.',
      section: nextLesson.system,
      icon: '✍️',
      tag: 'New Input'
    });

    // Task 3: Sentence Formation / Particle drill (5 min)
    tasks.push({
      id: 'task_sentence_forge',
      title: 'Sentence Forge Construction',
      titleTe: 'వాక్య నిర్మాణం మరియు విభక్తులు',
      durationMinutes: 5,
      description: 'Arrange word tiles and fill particles to produce natural SOV Japanese sentences.',
      section: 'sentence',
      icon: '🔨',
      tag: 'Production'
    });

    // Task 4: Targeted Weakness Practice (strictly only when real mistakes exist in stored data)
    if (mistakes.length > 0) {
      const topMistake = mistakes[0];
      tasks.push({
        id: 'task_weakness_remediation',
        title: `Weakness Drill: ${topMistake.prompt}`,
        titleTe: 'పొరపాట్లు సరిచేసుకునే ప్రత్యేక సాధన',
        durationMinutes: 5,
        description: `Reinforce "${topMistake.correct_answer}" to resolve recurring error: ${topMistake.notes_en}`,
        section: 'analytics',
        icon: '🎯',
        tag: 'Remediation'
      });
    }

    // Task 5: Speaking Studio (if 30+ min plan)
    if (targetMinutes >= 30) {
      tasks.push({
        id: 'task_speaking_shadow',
        title: 'Speaking Studio Shadowing',
        titleTe: 'స్పీకింగ్ సాధన & ఉచ్చారణ',
        durationMinutes: 5,
        description: 'Vocal shadow training to master Japanese mora timing and conversational pitch.',
        section: 'speaking',
        icon: '🎙️',
        tag: 'Speaking'
      });
    }

    // Task 6: Graded Reader Reading (if 45 min plan)
    if (targetMinutes >= 45) {
      tasks.push({
        id: 'task_reading_theatre',
        title: 'Reading Theatre: Graded Reader Story',
        titleTe: 'కథల ద్వారా జపనీస్ పఠనం',
        durationMinutes: 10,
        description: 'Read immersive cultural stories with clickable lexicon and comprehension tests.',
        section: 'reading',
        icon: '📖',
        tag: 'Comprehension'
      });

      tasks.push({
        id: 'task_arcade_challenge',
        title: 'RPG Arcade Sprint',
        titleTe: 'గేమ్స్ ద్వారా వేగవంతమైన పునశ్చరణ',
        durationMinutes: 5,
        description: 'Test your reflexes and recall speed under timed pressure in Word Quest Dungeon.',
        section: 'rpg_games',
        icon: '🎮',
        tag: 'Game Challenge'
      });
    }

    return tasks;
  }, [targetMinutes, dueCardsCount, nextLesson, mistakes]);

  const toggleTaskCompletion = (taskId: string) => {
    let updated: string[];
    if (completedTaskIds.includes(taskId)) {
      updated = completedTaskIds.filter((id) => id !== taskId);
    } else {
      updated = [...completedTaskIds, taskId];
      soundEffects.playCorrect();
      awardXP(10, 'Completed Study Task');
    }

    setCompletedTaskIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    // Check if entire plan is completed
    const allDone = sessionPlan.length > 0 && sessionPlan.every((t) => updated.includes(t.id));
    if (allDone && !routineRewarded) {
      soundEffects.playLevelUp();
      awardXP(50, 'Completed Full Daily Study Routine!');
      setRoutineRewarded(true);
      try {
        localStorage.setItem(`kai_routine_rewarded_${todayStr}`, 'true');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const completedCount = sessionPlan.filter((t) => completedTaskIds.includes(t.id)).length;
  const isAllComplete = sessionPlan.length > 0 && completedCount === sessionPlan.length;

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

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => handleSetDuration(d)}
              className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all ${
                targetMinutes === d
                  ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-md ring-2 ring-kai-vermilion/30 scale-[1.02]'
                  : 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-muted hover:text-kai-ink hover:border-kai-vermilion/40'
              }`}
            >
              {d} Minutes
            </button>
          ))}
        </div>
      </div>

      {/* Routine Completion Progress Banner */}
      {isAllComplete && (
        <div className="p-5 rounded-3xl bg-green-50 dark:bg-green-950/40 border border-green-300 text-green-900 dark:text-green-200 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Award size={32} className="text-kai-gold shrink-0" />
            <div>
              <h3 className="font-bold text-sm font-serif_jp">
                Daily Study Routine Complete! (本日の学習達成)
              </h3>
              <p className="text-xs text-green-800 dark:text-green-300">
                You completed all {sessionPlan.length} tasks for your {targetMinutes}-minute plan today. Streak protected and +50 XP bonus earned!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-green-200/60 text-green-900 shrink-0">
            100% Done
          </span>
        </div>
      )}

      {/* Generated Interleaved Session Plan */}
      <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-4">
        <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-kai-gold" />
            <h2 className="text-base font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
              Today's Interleaved Learning Routine ({targetMinutes} min total)
            </h2>
          </div>
          <span className="text-2xs font-mono text-kai-muted">
            {completedCount} / {sessionPlan.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {sessionPlan.map((step) => {
            const isCompleted = completedTaskIds.includes(step.id);

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  isCompleted
                    ? 'bg-stone-50 dark:bg-stone-900/40 border-kai-border/40 opacity-70'
                    : 'bg-white dark:bg-kai-dark-card border-kai-border shadow-washi hover:border-kai-vermilion/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleTaskCompletion(step.id)}
                    className="text-kai-muted hover:text-kai-vermilion transition-colors shrink-0"
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <CheckSquare size={20} className="text-green-600" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>

                  <span className="text-2xl shrink-0">{step.icon}</span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-xs ${
                          isCompleted
                            ? 'line-through text-kai-muted'
                            : 'text-kai-ink dark:text-kai-dark-ink'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-3xs font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold">
                        {step.durationMinutes} min
                      </span>
                      <span className="text-3xs font-mono px-2 py-0.5 rounded-full bg-kai-indigo/10 text-kai-indigo dark:text-indigo-300 font-semibold">
                        {step.tag}
                      </span>
                    </div>

                    {(displayMode === 'telugu' || displayMode === 'bilingual') && step.titleTe && (
                      <p className="font-telugu text-2xs text-kai-vermilion mt-0.5">
                        {step.titleTe}
                      </p>
                    )}

                    <p className="text-2xs text-kai-muted mt-0.5 line-clamp-1">{step.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSection(step.section as any)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-50 hover:bg-kai-vermilion hover:text-white dark:bg-stone-800 border border-kai-border text-xs font-semibold text-kai-ink dark:text-white shadow-sm flex items-center gap-1 shrink-0 transition-all"
                >
                  <span>Launch</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
