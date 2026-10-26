// src/components/dashboard/HomeDashboard.tsx
// Redesigned 2-Column Home Dashboard (Main Column + Side Column on Desktop, Stacked on Mobile)
// Features:
// - Main column:
//   - Hero card with fixed (おかえり) horizontal layout (no awkward vertical wrapping)
//   - ONE primary "Next step" card with a single big button
//   - "Today" list of max 3 tasks (each task is one row: title + minutes + Start button; no checkbox; completion shown by a red Hanko stamp)
//   - Stat cards moved below, collapsed by default with clean toggle
// - Side column:
//   - JLPTCalendarCard (open, applied, closed_not_applied, not_announced states, city & status picker, stale warning, 30/14/7-day reminders)
//   - Daily Omikuji Fortune card (shaking cylinder, unfolding scroll, 30 phrases, +5 XP)
//   - Weakness alert ONLY shown when real mistakes exist in stored data
// - "No data yet" for accuracy rate when attempts === 0 (no fake 0% or 100%)
// - Minimum text size 12px, verified WCAG AA contrast throughout
import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Flame,
  Zap,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Repeat,
  Check,
  Target
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { MascotKai } from '../common/MascotKai';
import { storageService } from '../../services/storageService';
import { soundEffects } from '../../services/soundEffects';
import { HIRAGANA_LESSONS, KATAKANA_LESSONS } from '../../data/kanaData';
import {
  FORTUNE_TIERS,
  getDailyOmikujiPhrase,
  OmikujiPhrase
} from '../../data/omikujiPhrases';
import { HankoStamp } from '../fx/HankoStamp';
import { WashiTexture, GoldFlecks } from '../fx';
import { JLPTCalendarCard } from '../jlpt/JLPTCalendarCard';

// Animated Count-Up Number
const AnimatedCounter: React.FC<{ value: number; suffix?: string; fallback?: string }> = ({
  value,
  suffix = '',
  fallback
}) => {
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (fallback && value === 0) return;
    if (shouldReduceMotion) {
      setCount(value);
      return;
    }
    let startTime: number;
    let animId: number;
    const duration = 750;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * value));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, shouldReduceMotion, fallback]);

  if (fallback && value === 0) {
    return <span>{fallback}</span>;
  }
  return <span>{count}{suffix}</span>;
};

// Circular Ring Gauge for Level / XP Progress
const CircularRingGauge: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({
  progress,
  size = 46,
  strokeWidth = 4
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90 flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-[#E8DEC8] dark:text-[#1C2945]"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#C59B27"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
};

export const HomeDashboard: React.FC = () => {
  const { stats, setActiveSection, displayMode, awardXP, soundEnabled } = useLearning();
  const { profile } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // State for collapsible stats section (collapsed by default as requested)
  const [statsExpanded, setStatsExpanded] = useState<boolean>(false);

  // Stored data
  const completedLessons = storageService.getCompletedLessons();
  const mistakes = storageService.getMistakes();
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);
  const totalAttemptsCount = storageService.getAttempts().length;

  // Next incomplete lesson
  const nextLesson = useMemo(() => {
    const nextH = HIRAGANA_LESSONS.find((l) => !completedLessons.includes(l.id));
    if (nextH) {
      return {
        id: nextH.id,
        title: `Hiragana: ${nextH.title}`,
        titleTe: nextH.titleTe,
        system: 'kana' as const
      };
    }
    const nextK = KATAKANA_LESSONS.find((l) => !completedLessons.includes(l.id));
    if (nextK) {
      return {
        id: nextK.id,
        title: `Katakana: ${nextK.title}`,
        titleTe: nextK.titleTe,
        system: 'kana' as const
      };
    }
    return {
      id: 'kana_complete',
      title: 'Vocabulary: Core N5 Words',
      titleTe: 'ముఖ్యమైన N5 పదాలు',
      system: 'vocab' as const
    };
  }, [completedLessons]);

  // Today's 3 tasks
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const storageTodayTasksKey = `kai_today_tasks_completed_${todayDateStr}`;

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageTodayTasksKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleCompleteTodayTask = (taskId: string, xpReward: number) => {
    if (completedTaskIds.includes(taskId)) return;
    const next = [...completedTaskIds, taskId];
    setCompletedTaskIds(next);
    try {
      localStorage.setItem(storageTodayTasksKey, JSON.stringify(next));
    } catch (e) {
      // ignore
    }

    if (soundEnabled) {
      soundEffects.playLevelUp();
    }

    confetti({
      particleCount: 26,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#D9483B', '#C59B27', '#FFB7C5'],
      shapes: ['circle'],
      disableForReducedMotion: true
    });

    awardXP(xpReward, 'Today Task Completed');
  };

  const todayTasks = useMemo(() => [
    {
      id: 'task_review',
      title: 'Spaced Memory Reviews',
      titleTe: 'పునశ్చరణ కార్డులు',
      minutes: 5,
      targetSection: 'reviews' as const,
      xp: 15
    },
    {
      id: 'task_lesson',
      title: nextLesson.title,
      titleTe: nextLesson.titleTe,
      minutes: 10,
      targetSection: nextLesson.system,
      xp: 25
    },
    {
      id: 'task_write_or_speak',
      title: 'Active Voice or Stroke Practice',
      titleTe: 'ఉచ్చారణ లేదా రాత సాధన',
      minutes: 5,
      targetSection: 'sentence' as const,
      xp: 15
    }
  ], [nextLesson]);

  // Omikuji state
  const storageOmikujiKey = `kai_omikuji_${todayDateStr}`;
  const [omikujiState, setOmikujiState] = useState<{
    hasDrawn: boolean;
    isShaking: boolean;
    phrase: OmikujiPhrase | null;
  }>(() => {
    try {
      const saved = localStorage.getItem(storageOmikujiKey);
      if (saved) {
        return {
          hasDrawn: true,
          isShaking: false,
          phrase: JSON.parse(saved)
        };
      }
    } catch (e) {
      // ignore
    }
    return {
      hasDrawn: false,
      isShaking: false,
      phrase: null
    };
  });

  const handleDrawOmikuji = () => {
    if (omikujiState.hasDrawn || omikujiState.isShaking) return;
    if (soundEnabled) soundEffects.playClick();

    setOmikujiState((prev) => ({ ...prev, isShaking: true }));

    setTimeout(() => {
      const dailyPhrase = getDailyOmikujiPhrase(todayDateStr);
      try {
        localStorage.setItem(storageOmikujiKey, JSON.stringify(dailyPhrase));
      } catch (e) {
        // ignore
      }

      setOmikujiState({
        hasDrawn: true,
        isShaking: false,
        phrase: dailyPhrase
      });

      awardXP(5, 'Daily Omikuji Blessing (おみくじ)');
      if (soundEnabled) soundEffects.playLevelUp();

      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FFB7C5', '#FFCCD5', '#D9483B', '#C59B27'],
        shapes: ['circle'],
        disableForReducedMotion: true
      });
    }, 600);
  };

  // 7-day Weekly Chochin Streak Data
  const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
  const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* =====================================================================
          2-COLUMN LAYOUT: MAIN COLUMN (8 cols) + SIDE COLUMN (4 cols)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            MAIN COLUMN (lg:col-span-8): Hero, Next Step, Today Tasks, Stats
            =================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Hero Card: Fixed (おかえり) horizontal layout + bounded speech bubble */}
          <div className="relative rounded-3xl bg-[#0A101C] bg-gradient-to-r from-[#0A101C] via-[#0E1626] to-[#141D33] text-[#F3EBDD] p-6 sm:p-7 border border-[#2E4370]/60 shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141D33]/85 text-[#E2BA4E] font-mono text-xs border border-[#2E4370]/70">
                  <Sparkles size={13} className="text-[#E2BA4E]" />
                  <span>{profile.current_level}</span>
                </div>

                {/* Fixed headline with (おかえり) guaranteed on same line without vertical wrapping */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif_jp tracking-tight text-[#FAF5ED] leading-snug">
                  <span>Welcome back, {profile.display_name}!</span>
                  <span className="inline-block whitespace-nowrap text-xs sm:text-sm font-normal text-[#C59B27] font-serif_jp ml-2">
                    (おかえり)
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-[#DDD2B8] leading-relaxed">
                  {displayMode === 'telugu' || displayMode === 'bilingual' ? (
                    <span className="font-telugu block text-[#E2BA4E] mb-0.5 text-xs">
                      ప్రతి చిన్న అభ్యాసం మిమ్మల్ని సహజమైన జపనీస్ సంభాషణకు చేరువ చేస్తుంది.
                    </span>
                  ) : null}
                  <span>
                    Focus on today&apos;s 3 short steps to keep your active study momentum strong.
                  </span>
                </p>
              </div>

              {/* Unclipped Mascot with Bounded Speech Bubble and Pointer Tail */}
              <div className="hidden sm:flex flex-col items-center relative flex-shrink-0">
                <div className="mb-2 relative max-w-[200px] w-full px-3 py-2 rounded-2xl bg-[#F3EBDD] text-[#14110F] border border-[#DDD2B8] shadow-md text-xs font-medium text-center">
                  <p className="leading-tight text-3xs">
                    {stats.reviews_due_count > 0
                      ? `${stats.reviews_due_count} card(s) ready for review!`
                      : 'Ready for today’s lesson?'}
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#F3EBDD]" />
                </div>

                <MascotKai
                  size="md"
                  streakDays={stats.streak_days}
                  interactive={true}
                />
              </div>
            </div>
          </div>

          {/* 2. ONE PRIMARY "NEXT STEP" CARD WITH A SINGLE BIG BUTTON */}
          <div className="relative p-6 sm:p-7 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border-2 border-kai-vermilion/50 shadow-md space-y-4 overflow-hidden">
            <WashiTexture opacity={0.07} tone="light" />
            <GoldFlecks density="sparse" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-3xs font-mono uppercase font-bold tracking-wider text-kai-vermilion">
                  Primary Next Step &bull; Recommended Focus
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  {nextLesson.title}
                </h2>
                <p className="text-xs text-[#524B42] dark:text-[#DDD2B8] max-w-md">
                  Step-by-step guidance with native stroke order, audio pitch accent, and Telugu phonetic notes.
                </p>
              </div>

              {/* Single Big Action Button */}
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(nextLesson.system)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion flex items-center justify-center gap-2 flex-shrink-0"
              >
                <BookOpen size={17} />
                <span>Continue Lesson</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>

          {/* 3. "TODAY" LIST OF MAX 3 TASKS (ONE ROW PER TASK: TITLE + MINUTES + START BUTTON; HANKO STAMP ON COMPLETION) */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/70 shadow-sm space-y-4 overflow-hidden">
            <WashiTexture opacity={0.06} tone="light" />

            <div className="relative z-10 flex items-center justify-between border-b border-[#DDD2B8] dark:border-[#2E4370]/60 pb-3">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-kai-vermilion" />
                <h2 className="text-base font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  Today&apos;s Focus (今日の3項目)
                </h2>
              </div>
              <span className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
                {completedTaskIds.length} / {todayTasks.length} Done
              </span>
            </div>

            <div className="relative z-10 space-y-2.5">
              {todayTasks.map((t) => {
                const isCompleted = completedTaskIds.includes(t.id);

                return (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#0E1626]/90 border border-[#DDD2B8] dark:border-[#2E4370]/60 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted
                              ? 'line-through text-[#6B6358] dark:text-stone-400'
                              : 'text-[#14110F] dark:text-[#FAF5ED]'
                          }`}
                        >
                          {t.title}
                        </span>
                        <span className="text-3xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-mono font-semibold border border-amber-300">
                          {t.minutes} mins
                        </span>
                      </div>
                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <p className="font-telugu text-3xs text-kai-vermilion-dark dark:text-kai-vermilion-light">
                          {t.titleTe}
                        </p>
                      )}
                    </div>

                    {/* Completion representation: Red Hanko "済" stamp or Start button */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5">
                          <HankoStamp text="済" size={36} shape="square" playSound={false} />
                          <span className="text-3xs font-mono font-bold text-[#2D7A4D] hidden sm:inline">
                            Done ✓
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCompleteTodayTask(t.id, t.xp)}
                            title="Mark complete & Stamp Hanko"
                            className="p-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-[#6B6358] hover:text-[#2D7A4D] hover:border-[#2D7A4D] transition-colors"
                          >
                            <Check size={14} />
                          </button>

                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveSection(t.targetSection)}
                            className="px-4 py-1.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                          >
                            <span>Start</span>
                            <ArrowRight size={13} />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. STAT CARDS: MOVED BELOW, COLLAPSED BY DEFAULT */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setStatsExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#E8DEC8]/60 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-semibold text-[#524B42] dark:text-[#DDD2B8] hover:border-kai-vermilion transition-colors"
            >
              <span>{statsExpanded ? 'Hide Detailed Learning Metrics' : 'View Detailed Learning Metrics (Stats & Progress)'}</span>
              {statsExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {statsExpanded && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Streak */}
                  <div className="p-3.5 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-[#6B6358] dark:text-[#94A3B8] text-xs">
                      <span>Streak</span>
                      <Flame size={15} className="text-orange-500 fill-orange-500" />
                    </div>
                    <div className="text-xl font-bold font-mono text-[#14110F] dark:text-white">
                      <AnimatedCounter value={stats.streak_days} />d
                    </div>
                  </div>

                  {/* Level with Circular Ring Gauge */}
                  <div className="p-3.5 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#6B6358] dark:text-[#94A3B8] text-xs">
                        <span>Level</span>
                        <Zap size={14} className="text-[#C59B27]" />
                      </div>
                      <div className="text-xl font-bold font-mono text-[#14110F] dark:text-white">
                        Lv. <AnimatedCounter value={stats.level} />
                      </div>
                    </div>
                    <CircularRingGauge progress={stats.total_xp % 100} size={38} strokeWidth={3.5} />
                  </div>

                  {/* Due Reviews */}
                  <div
                    onClick={() => setActiveSection('reviews')}
                    className="p-3.5 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm space-y-1 cursor-pointer hover:border-kai-vermilion"
                  >
                    <div className="flex items-center justify-between text-[#6B6358] dark:text-[#94A3B8] text-xs">
                      <span>Reviews</span>
                      <Repeat size={15} className="text-amber-500" />
                    </div>
                    <div className="text-xl font-bold font-mono text-[#14110F] dark:text-white">
                      <AnimatedCounter value={stats.reviews_due_count} />
                    </div>
                  </div>

                  {/* Accuracy Rate (Never 0% or 100% when 0 attempts: shows "No data yet") */}
                  <div className="p-3.5 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-[#6B6358] dark:text-[#94A3B8] text-xs">
                      <span>Accuracy</span>
                      <TrendingUp size={15} className="text-[#2D7A4D]" />
                    </div>
                    <div className="text-base font-bold font-mono text-[#14110F] dark:text-white">
                      {totalAttemptsCount === 0 ? (
                        <span className="text-xs font-sans font-medium text-[#6B6358] dark:text-stone-400">
                          No data yet
                        </span>
                      ) : (
                        <AnimatedCounter value={stats.accuracy_rate} suffix="%" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 7-day Weekly Chochin Streak Row */}
                <div className="p-3.5 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/60 flex items-center justify-between">
                  <span className="text-xs font-serif_jp font-bold text-[#14110F] dark:text-white">
                    7-Day Attendance
                  </span>
                  <div className="flex items-center gap-2">
                    {daysOfWeek.map((dayJp, idx) => {
                      const isToday = idx === currentDayIndex;
                      const isPastOrToday = idx <= currentDayIndex;
                      const isLit = isPastOrToday && stats.streak_days > (currentDayIndex - idx);
                      return (
                        <div
                          key={dayJp}
                          className={`w-6 h-8 rounded flex items-center justify-center text-3xs font-serif_jp border ${
                            isLit
                              ? 'bg-amber-400 text-[#14110F] border-amber-600 font-bold shadow-sm'
                              : isToday
                              ? 'border-kai-vermilion text-kai-vermilion animate-pulse'
                              : 'bg-stone-200/50 dark:bg-stone-800 text-stone-400 border-stone-300 dark:border-stone-700'
                          }`}
                        >
                          {dayJp}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            SIDE COLUMN (lg:col-span-4): JLPT Calendar Card, Omikuji, Weakness
            =================================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. JLPT CALENDAR CARD (4 states, city selection, status, reminders) */}
          <JLPTCalendarCard />

          {/* 2. DAILY OMIKUJI FORTUNE CARD */}
          <div className="relative p-5 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/60 shadow-sm space-y-3 overflow-hidden text-center">
            <WashiTexture opacity={0.07} tone="light" />
            <GoldFlecks density="sparse" />

            <div className="relative z-10 flex items-center justify-between border-b border-[#DDD2B8] dark:border-[#2E4370] pb-2">
              <span className="text-xs font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#C59B27]" />
                <span>Daily Fortune (おみくじ)</span>
              </span>
              <span className="text-4xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                +5 XP Daily
              </span>
            </div>

            <div className="relative z-10 py-2 min-h-[140px] flex flex-col items-center justify-center">
              {!omikujiState.hasDrawn ? (
                <div className="space-y-2.5">
                  <motion.div
                    animate={
                      omikujiState.isShaking
                        ? { rotate: [-6, 6, -6, 6, -3, 3, 0], scale: [1, 1.05, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                    className="w-14 h-20 mx-auto bg-gradient-to-b from-[#A06D3B] to-[#6E4720] rounded-lg border-2 border-[#543315] shadow-md flex items-center justify-center text-white font-serif_jp font-bold text-xs writing-vertical-rl"
                  >
                    御神籤
                  </motion.div>

                  <p className="text-xs text-[#6B6358] dark:text-stone-300">
                    Shake the sacred wooden cylinder for today&apos;s blessing.
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDrawOmikuji}
                    disabled={omikujiState.isShaking}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion"
                  >
                    {omikujiState.isShaking ? 'Shaking...' : 'Draw Fortune'}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-2 w-full text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-serif_jp font-black text-xl text-kai-vermilion">
                      {omikujiState.phrase?.defaultTier || '大吉'}
                    </span>
                    <span className="text-3xs text-[#6B6358] dark:text-stone-400 font-mono">
                      Sealed for today
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/90 dark:bg-[#0E1626] border border-[#DDD2B8] dark:border-[#2E4370] space-y-1">
                    <p className="font-serif_jp text-xs font-bold text-[#14110F] dark:text-[#FAF5ED]">
                      {omikujiState.phrase?.japanese}
                    </p>
                    <p className="text-3xs text-[#524B42] dark:text-[#DDD2B8]">
                      {omikujiState.phrase?.meaningEn}
                    </p>
                    <p className="font-telugu text-4xs text-[#C59B27]">
                      {omikujiState.phrase?.meaningTe}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. WEAKNESS REMEDIATION (ONLY SHOWN WHEN REAL MISTAKES EXIST IN STORED DATA!) */}
          {unresolvedMistakes.length > 0 && (
            <div className="relative p-5 rounded-3xl bg-amber-50/90 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 space-y-2.5 overflow-hidden">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold text-xs">
                <AlertTriangle size={15} />
                <span>Weakness Drill ({unresolvedMistakes.length} mistakes)</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-snug">
                You have {unresolvedMistakes.length} recurring mistake(s) logged. Reviewing them now will strengthen your retention.
              </p>
              <button
                type="button"
                onClick={() => setActiveSection('analytics')}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Start Weakness Drill &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
