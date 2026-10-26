// src/components/dashboard/HomeDashboard.tsx
// Personalized Home Dashboard with Midnight Matsuri + Sumi-e Aesthetics
// Features:
// - Washi stat cards with gold hairline borders and count-up numbers
// - Level card with SVG circular ring gauge
// - Accuracy displays "—" when 0 attempts
// - Hero card with unclipped Mascot and bounded speech bubble with pointer tail
// - Weekly 7-day Chochin Lanterns streak row (lit days glow, today pulses)
// - Quest completion: Red hanko "済" stamp, floating XP chip, spring bar, sakura confetti burst
// - Verbs for quest actions (Start, Practice, Review)
// - Daily Omikuji (おみくじ) Fortune card with shaking box, stick reveal, 30 curated phrases, and +5 XP award
// - Strict prefers-reduced-motion support, whileHover lift 3px, whileTap scale 0.98
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Flame,
  Zap,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Award,
  ChevronRight,
  Target,
  Repeat,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Check
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { MascotKai } from '../common/MascotKai';
import { storageService } from '../../services/storageService';
import { soundEffects } from '../../services/soundEffects';
import { HIRAGANA_LESSONS, KATAKANA_LESSONS } from '../../data/kanaData';
import {
  OMIKUJI_PHRASES,
  FORTUNE_TIERS,
  getDailyOmikujiPhrase,
  OmikujiPhrase,
  FortuneTier
} from '../../data/omikujiPhrases';
import { HankoStamp } from '../fx/HankoStamp';
import { WashiTexture, GoldFlecks } from '../fx';

// ============================================================================
// HELPER: Animated Count-Up Number
// ============================================================================
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

// ============================================================================
// HELPER: Circular Ring Gauge for Level / XP Progress
// ============================================================================
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

// ============================================================================
// MAIN COMPONENT: HomeDashboard
// ============================================================================
export const HomeDashboard: React.FC = () => {
  const { stats, setActiveSection, displayMode, awardXP, soundEnabled } = useLearning();
  const { profile } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [quests, setQuests] = useState(() => storageService.getQuests());
  const [stampedQuestId, setStampedQuestId] = useState<string | null>(null);
  const [floatingXp, setFloatingXp] = useState<{ id: string; amount: number } | null>(null);

  const mistakes = storageService.getMistakes();
  const completedLessons = storageService.getCompletedLessons();
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);

  // Dynamic next incomplete lesson
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

  // JLPT N5 Readiness Score (0..100%)
  const jlptReadiness = useMemo(() => {
    const kanaScore = (stats.kana_mastery_pct / 100) * 30;
    const vocabScore = Math.min(30, (stats.vocab_mastered_count / 30) * 30);
    const kanjiScore = Math.min(20, (stats.kanji_mastered_count / 15) * 20);
    const grammarScore = Math.min(20, (stats.grammar_mastered_count / 10) * 20);
    return Math.min(100, Math.round(kanaScore + vocabScore + kanjiScore + grammarScore));
  }, [stats]);

  // ==========================================================================
  // OMIKUJI (DAILY FORTUNE) STATE & LOGIC
  // ==========================================================================
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);
  const storageOmikujiKey = `kai_omikuji_${todayKey}`;

  const [omikujiState, setOmikujiState] = useState<{
    hasDrawn: boolean;
    isShaking: boolean;
    isUnfolded: boolean;
    phrase: OmikujiPhrase | null;
  }>(() => {
    try {
      const saved = localStorage.getItem(storageOmikujiKey);
      if (saved) {
        return {
          hasDrawn: true,
          isShaking: false,
          isUnfolded: true,
          phrase: JSON.parse(saved)
        };
      }
    } catch (e) {
      // ignore
    }
    return {
      hasDrawn: false,
      isShaking: false,
      isUnfolded: false,
      phrase: null
    };
  });

  const handleDrawOmikuji = () => {
    if (omikujiState.hasDrawn || omikujiState.isShaking) return;

    if (soundEnabled) {
      soundEffects.playClick();
    }

    setOmikujiState((prev) => ({ ...prev, isShaking: true }));

    setTimeout(() => {
      const dailyPhrase = getDailyOmikujiPhrase(todayKey);

      try {
        localStorage.setItem(storageOmikujiKey, JSON.stringify(dailyPhrase));
      } catch (e) {
        // ignore
      }

      setOmikujiState({
        hasDrawn: true,
        isShaking: false,
        isUnfolded: true,
        phrase: dailyPhrase
      });

      // Award +5 XP
      awardXP(5, 'Daily Omikuji Blessing (おみくじ)');

      if (soundEnabled) {
        soundEffects.playLevelUp();
      }

      // Sakura petal confetti burst
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FFB7C5', '#FFCCD5', '#D9483B', '#C59B27', '#FFF0F5'],
        shapes: ['circle'],
        scalar: 1.1,
        disableForReducedMotion: true
      });
    }, 600);
  };

  // ==========================================================================
  // QUEST COMPLETION INTERACTION
  // ==========================================================================
  const handleCompleteQuest = (questId: string, xpReward: number) => {
    setStampedQuestId(questId);
    setFloatingXp({ id: questId, amount: xpReward });

    if (soundEnabled) {
      soundEffects.playLevelUp();
    }

    // Sakura petal burst
    confetti({
      particleCount: 26,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#FFB7C5', '#FFCCD5', '#D9483B', '#C59B27'],
      shapes: ['circle'],
      disableForReducedMotion: true
    });

    awardXP(xpReward, 'Daily Quest Completed');

    // Update quest state
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true, progress: q.target } : q))
    );

    setTimeout(() => {
      setFloatingXp(null);
    }, 1200);
  };

  const allQuestsDone = quests.length > 0 && quests.every((q) => q.completed);

  // 7-day Weekly Chochin Streak Data
  const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
  const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* =====================================================================
          1. HERO WELCOME CARD WITH UNCLIPPED MASCOT & POINTED SPEECH BUBBLE
          ===================================================================== */}
      <div className="relative rounded-3xl bg-[#0A101C] bg-gradient-to-r from-[#0A101C] via-[#0E1626] to-[#141D33] text-[#F3EBDD] p-6 sm:p-8 border border-[#2E4370]/60 shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
        {/* Subtle indigo wave texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2E4370_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Text & Actions */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141D33]/80 backdrop-blur-md text-[#E2BA4E] font-mono text-xs border border-[#2E4370]/70">
              <Sparkles size={13} className="text-[#E2BA4E]" />
              <span>{profile.current_level}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif_jp tracking-tight text-[#FAF5ED] flex items-center gap-2">
              <span>Welcome back, {profile.display_name}!</span>
              <span className="text-xs font-normal text-[#C59B27] font-serif_jp hidden sm:inline">
                (おかえり)
              </span>
            </h1>

            <p className="text-sm text-[#DDD2B8] leading-relaxed">
              {displayMode === 'telugu' || displayMode === 'bilingual' ? (
                <span className="font-telugu block text-[#E2BA4E] mb-1 text-xs">
                  జపనీస్ నేర్చుకోవడానికి, సహజంగా ఆలోచించడానికి సిద్ధంగా ఉండండి. నేటి పాఠం ప్రారంభించండి!
                </span>
              ) : null}
              <span>
                Every small step brings you closer to thinking naturally in Japanese. Focus on today&apos;s routine to keep your streak alive.
              </span>
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(nextLesson.system)}
                className="px-6 py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion flex items-center gap-2.5 transition-colors"
              >
                <BookOpen size={16} />
                <span>Continue: {nextLesson.title}</span>
                <ArrowRight size={15} />
              </motion.button>

              {stats.reviews_due_count > 0 && (
                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection('reviews')}
                  className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                >
                  <Repeat size={15} />
                  <span>{stats.reviews_due_count} Reviews Due</span>
                </motion.button>
              )}

              <motion.button
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection('planner')}
                className="px-4 py-3 rounded-2xl bg-[#141D33]/90 hover:bg-[#1C2945] text-[#FAF5ED] font-medium text-sm border border-[#2E4370]/70 flex items-center gap-1.5 transition-colors"
              >
                <CalendarDays size={15} />
                <span>Study Routine</span>
              </motion.button>
            </div>
          </div>

          {/* Right Mascot with Bounded Speech Bubble (pointing tail) */}
          <div className="hidden sm:flex flex-col items-center relative flex-shrink-0 pt-2 lg:pt-0">
            {/* Context-aware speech bubble bounded inside the card */}
            <div className="mb-2 relative max-w-xs w-full px-4 py-2.5 rounded-2xl bg-[#F3EBDD] text-[#14110F] border border-[#DDD2B8] shadow-lg text-xs font-medium text-center">
              <p className="leading-snug">
                {allQuestsDone
                  ? 'Subarashii! All quests conquered for today! Feel proud of your progress!'
                  : stats.reviews_due_count > 0
                  ? `You have ${stats.reviews_due_count} card(s) ready for review! A quick session keeps them fresh!`
                  : stats.streak_days >= 7
                  ? `7+ days on fire! The Matsuri festival spirit is roaring inside you!`
                  : `Terrific dedication! Ready to conquer ${nextLesson.title}?`}
              </p>
              {/* Pointer Tail pointing down at Mascot */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#F3EBDD]" />
            </div>

            <MascotKai
              size="lg"
              streakDays={stats.streak_days}
              questsCompleted={allQuestsDone}
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. WEEKLY 7-DAY CHOCHIN LANTERNS STREAK ROW
          ===================================================================== */}
      <div className="p-4 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/70 shadow-sm relative overflow-hidden">
        <WashiTexture opacity={0.05} tone="light" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
            <div>
              <span className="font-serif_jp font-bold text-xs uppercase tracking-wider text-[#14110F] dark:text-[#FAF5ED]">
                Weekly Matsuri Streak ({stats.streak_days} Days Active)
              </span>
              <p className="text-3xs text-[#6B6358] dark:text-[#94A3B8]">
                Lit lanterns honor completed practice; today&apos;s lantern pulses gently.
              </p>
            </div>
          </div>

          {/* 7 Chochin Lanterns Row */}
          <div className="flex items-center gap-2 sm:gap-3">
            {daysOfWeek.map((dayJp, idx) => {
              const isToday = idx === currentDayIndex;
              const isPastOrToday = idx <= currentDayIndex;
              const isLit = isPastOrToday && stats.streak_days > (currentDayIndex - idx);

              return (
                <div key={dayJp} className="flex flex-col items-center gap-1">
                  <div
                    className={`relative w-7 h-9 sm:w-8 sm:h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                      isLit
                        ? 'bg-gradient-to-b from-[#FFF2D6] via-[#F5A25D] to-[#D9483B] border-[#9E2B1E] text-[#14110F] font-bold shadow-[0_0_12px_rgba(217,72,59,0.5)]'
                        : isToday
                        ? 'bg-[#E8DEC8] dark:bg-[#1C2945] border-[#C59B27] text-[#C59B27] animate-pulse'
                        : 'bg-stone-200/60 dark:bg-[#0E1626] border-stone-300 dark:border-[#2E4370]/40 text-stone-400 opacity-60'
                    }`}
                  >
                    <span className="font-serif_jp text-xs select-none">{dayJp}</span>
                    {/* Top lantern hook */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#14110F] rounded-t-sm" />
                  </div>
                  <span className="text-4xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
                    {dayNamesEn[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. STAT CARDS: WASHI PAPER + GOLD HAIRLINE BORDER + COUNT-UP NUMBERS
          ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Streak */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -3 }}
          whileTap={{ scale: 0.98 }}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="relative p-4 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm space-y-1 overflow-hidden"
        >
          <WashiTexture opacity={0.06} tone="light" />
          <div className="relative z-10 flex items-center justify-between text-[#6B6358] dark:text-[#94A3B8] text-xs">
            <span>Study Streak</span>
            <Flame size={16} className="text-orange-500 fill-orange-500" />
          </div>
          <div className="relative z-10 text-2xl font-bold text-[#14110F] dark:text-[#FAF5ED] font-mono">
            <AnimatedCounter value={stats.streak_days} /> <span className="text-sm font-sans font-normal text-[#6B6358]">days</span>
          </div>
          <p className="relative z-10 text-3xs text-[#2D7A4D] dark:text-[#3C9B64] font-medium">
            Active streak protected
          </p>
        </motion.div>

        {/* Card 2: Level & Ring Gauge */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -3 }}
          whileTap={{ scale: 0.98 }}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="relative p-4 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm overflow-hidden flex items-center justify-between"
        >
          <WashiTexture opacity={0.06} tone="light" />
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#6B6358] dark:text-[#94A3B8] text-xs">
              <span>Mastery Level</span>
              <Zap size={15} className="text-[#C59B27]" />
            </div>
            <div className="text-2xl font-bold text-[#14110F] dark:text-[#FAF5ED] font-mono">
              Lv. <AnimatedCounter value={stats.level} />
            </div>
            <p className="text-3xs text-[#6B6358] dark:text-[#94A3B8] truncate max-w-[110px]">
              {stats.level_title}
            </p>
          </div>
          {/* Circular Ring Gauge */}
          <div className="relative z-10">
            <CircularRingGauge progress={stats.total_xp % 100} size={48} strokeWidth={4.5} />
          </div>
        </motion.div>

        {/* Card 3: Spaced Reviews Due */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -3 }}
          whileTap={{ scale: 0.98 }}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          onClick={() => setActiveSection('reviews')}
          className="relative p-4 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm space-y-1 cursor-pointer overflow-hidden hover:border-[#C59B27] transition-colors"
        >
          <WashiTexture opacity={0.06} tone="light" />
          <div className="relative z-10 flex items-center justify-between text-[#6B6358] dark:text-[#94A3B8] text-xs">
            <span>Due for Review</span>
            <Repeat size={16} className="text-amber-500" />
          </div>
          <div className="relative z-10 text-2xl font-bold text-[#14110F] dark:text-[#FAF5ED] font-mono">
            <AnimatedCounter value={stats.reviews_due_count} /> <span className="text-sm font-sans font-normal text-[#6B6358]">cards</span>
          </div>
          <p className="relative z-10 text-3xs text-amber-700 dark:text-amber-300 font-medium">
            FSRS Spaced Repetition
          </p>
        </motion.div>

        {/* Card 4: Overall Accuracy (Shows "—" when 0 attempts) */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -3 }}
          whileTap={{ scale: 0.98 }}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24 }}
          className="relative p-4 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/40 shadow-sm space-y-1 overflow-hidden"
        >
          <WashiTexture opacity={0.06} tone="light" />
          <div className="relative z-10 flex items-center justify-between text-[#6B6358] dark:text-[#94A3B8] text-xs">
            <span>Accuracy Rate</span>
            <TrendingUp size={16} className="text-[#2D7A4D] dark:text-[#3C9B64]" />
          </div>
          <div className="relative z-10 text-2xl font-bold text-[#14110F] dark:text-[#FAF5ED] font-mono">
            {stats.accuracy_rate === 0 || stats.accuracy_rate === null ? (
              <span>—</span>
            ) : (
              <AnimatedCounter value={stats.accuracy_rate} suffix="%" />
            )}
          </div>
          <p className="relative z-10 text-3xs text-[#6B6358] dark:text-[#94A3B8]">
            {stats.accuracy_rate === 0 ? 'No practice attempts yet' : 'Real-time practice retention'}
          </p>
        </motion.div>
      </div>

      {/* =====================================================================
          4. MAIN CONTENT SPLIT: QUESTS & SKILLS (LEFT) / OMIKUJI & JLPT (RIGHT)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quests & Skill Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests Card */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/70 shadow-sm overflow-hidden">
            <WashiTexture opacity={0.06} tone="light" />

            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-kai-vermilion" />
                <h2 className="text-base font-bold text-[#14110F] dark:text-[#FAF5ED] font-serif_jp">
                  Today&apos;s Study Quests (今日のクエスト)
                </h2>
              </div>
              <span className="text-xs text-[#6B6358] dark:text-[#94A3B8] font-mono">
                {quests.filter((q) => q.completed).length} / {quests.length} Completed
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              {quests.map((q) => {
                const isStamped = stampedQuestId === q.id || q.completed;
                const verbText =
                  q.id === 'q_kana_recall'
                    ? 'Practice'
                    : q.id === 'q_vocab_flash'
                    ? 'Review'
                    : q.id === 'q_speaking_shadow'
                    ? 'Start'
                    : 'Review';

                return (
                  <motion.div
                    key={q.id}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    className="relative p-3.5 rounded-2xl bg-white/80 dark:bg-[#0E1626]/80 border border-[#DDD2B8] dark:border-[#2E4370]/60 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            q.completed
                              ? 'line-through text-[#6B6358] dark:text-stone-400'
                              : 'text-[#14110F] dark:text-[#FAF5ED]'
                          }`}
                        >
                          {q.title}
                        </span>
                        <span className="text-3xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-mono font-bold border border-amber-300">
                          +{q.reward_xp} XP
                        </span>
                      </div>

                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <p className="font-telugu text-3xs text-kai-vermilion-dark dark:text-kai-vermilion-light">
                          {q.title_te}
                        </p>
                      )}

                      <div className="w-36 sm:w-44 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-kai-vermilion"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        />
                      </div>
                    </div>

                    <div className="relative flex items-center gap-2">
                      {/* Red Hanko "済" Stamp upon completion */}
                      {isStamped ? (
                        <div className="flex items-center gap-1.5">
                          <HankoStamp text="済" size={36} shape="square" playSound={false} />
                          <span className="text-3xs font-mono font-bold text-[#2D7A4D] dark:text-[#3C9B64] hidden sm:inline">
                            Done ✓
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Quick Complete / Mark as Done button */}
                          <button
                            type="button"
                            onClick={() => handleCompleteQuest(q.id, q.reward_xp)}
                            title="Complete Quest & Stamp Hanko"
                            className="p-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-[#6B6358] hover:text-[#2D7A4D] hover:border-[#2D7A4D] transition-colors"
                          >
                            <Check size={14} />
                          </button>

                          {/* Specific Action Verb Button */}
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (q.id === 'q_kana_recall') setActiveSection('kana');
                              else if (q.id === 'q_vocab_flash') setActiveSection('vocab');
                              else if (q.id === 'q_speaking_shadow') setActiveSection('speaking');
                              else setActiveSection('reviews');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-kai-vermilion text-white text-xs font-semibold shadow-sm hover:bg-kai-vermilion-dark transition-colors flex items-center gap-1"
                          >
                            <span>{verbText}</span>
                            <ArrowRight size={12} />
                          </motion.button>
                        </div>
                      )}

                      {/* Floating XP Chip Animation */}
                      {floatingXp?.id === q.id && (
                        <motion.span
                          initial={{ opacity: 1, y: 0, scale: 1 }}
                          animate={{ opacity: 0, y: -30, scale: 1.2 }}
                          transition={{ duration: 1.0, ease: 'easeOut' }}
                          className="absolute -top-6 right-0 font-mono font-bold text-xs text-[#C59B27] pointer-events-none"
                        >
                          +{floatingXp.amount} XP!
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Skill Competencies Grid */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/70 shadow-sm space-y-4 overflow-hidden">
            <WashiTexture opacity={0.06} tone="light" />

            <div className="relative z-10 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#14110F] dark:text-[#FAF5ED] font-serif_jp">
                Core Competencies (4技能の習得状況)
              </h2>
              <span className="text-3xs font-mono text-[#C59B27]">Live Sync</span>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/70 dark:bg-[#0E1626]/70 border border-[#DDD2B8] dark:border-[#2E4370]/50">
                <div className="flex justify-between text-xs font-medium">
                  <span>Kana Mastery (かな)</span>
                  <span className="font-mono">{stats.kana_mastery_pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-kai-vermilion" style={{ width: `${stats.kana_mastery_pct}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-white/70 dark:bg-[#0E1626]/70 border border-[#DDD2B8] dark:border-[#2E4370]/50">
                <div className="flex justify-between text-xs font-medium">
                  <span>Vocabulary (単語)</span>
                  <span className="font-mono">{stats.vocab_mastered_count} words</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-kai-indigo" style={{ width: `${Math.min(100, stats.vocab_mastered_count * 10)}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-white/70 dark:bg-[#0E1626]/70 border border-[#DDD2B8] dark:border-[#2E4370]/50">
                <div className="flex justify-between text-xs font-medium">
                  <span>Kanji Recognition (漢字)</span>
                  <span className="font-mono">{stats.kanji_mastered_count} kanji</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-kai-gold" style={{ width: `${Math.min(100, stats.kanji_mastered_count * 15)}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-white/70 dark:bg-[#0E1626]/70 border border-[#DDD2B8] dark:border-[#2E4370]/50">
                <div className="flex justify-between text-xs font-medium">
                  <span>Grammar Patterns (文法)</span>
                  <span className="font-mono">{stats.grammar_mastered_count} patterns</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-[#2D7A4D]" style={{ width: `${Math.min(100, stats.grammar_mastered_count * 20)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: OMIKUJI FORTUNE & JLPT Meter */}
        <div className="space-y-6">
          {/* ===================================================================
              5. OMIKUJI: DAILY FORTUNE CARD (おみくじ)
              =================================================================== */}
          <div className="relative p-5 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/60 shadow-md space-y-3 overflow-hidden text-center">
            <WashiTexture opacity={0.07} tone="light" />
            <GoldFlecks density="sparse" />

            <div className="relative z-10 flex items-center justify-between border-b border-[#DDD2B8] dark:border-[#2E4370] pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                <Sparkles size={14} className="text-[#C59B27]" />
                <span>Daily Fortune (おみくじ)</span>
              </div>
              <span className="text-3xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                +5 XP Daily
              </span>
            </div>

            {/* Omikuji Visual Container */}
            <div className="relative z-10 py-3 flex flex-col items-center justify-center min-h-[160px]">
              {!omikujiState.hasDrawn ? (
                <div className="space-y-3">
                  {/* Shaking Hexagonal Wooden Box */}
                  <motion.div
                    animate={
                      omikujiState.isShaking
                        ? { rotate: [-6, 6, -6, 6, -3, 3, 0], scale: [1, 1.05, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                    className="w-16 h-24 mx-auto bg-gradient-to-b from-[#A06D3B] to-[#6E4720] rounded-lg border-2 border-[#543315] shadow-lg flex flex-col items-center justify-between py-2 relative"
                  >
                    <span className="font-serif_jp font-bold text-white text-xs writing-vertical-rl">
                      御神籤
                    </span>
                    <div className="w-3 h-1 bg-[#2C180B] rounded-full" />
                  </motion.div>

                  <p className="text-xs text-[#6B6358] dark:text-stone-300">
                    Shake the sacred wooden cylinder to receive today&apos;s Japanese blessing and phrase.
                  </p>

                  <motion.button
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDrawOmikuji}
                    disabled={omikujiState.isShaking}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion flex items-center justify-center gap-2 mx-auto"
                  >
                    <Sparkles size={14} />
                    <span>{omikujiState.isShaking ? 'Shaking Box...' : 'Draw Daily Fortune'}</span>
                  </motion.button>
                </div>
              ) : (
                /* Unfolded Fortune Scroll */
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full space-y-2.5"
                >
                  {/* Fortune Tier Badge */}
                  <div className="inline-flex items-center gap-2">
                    <span className="font-serif_jp font-black text-2xl text-kai-vermilion">
                      {omikujiState.phrase?.defaultTier || '大吉'}
                    </span>
                    <span className="text-2xs font-bold text-[#14110F] dark:text-white">
                      {FORTUNE_TIERS[omikujiState.phrase?.defaultTier || '大吉'].titleEn}
                    </span>
                  </div>

                  {/* Japanese Phrase in Noto Serif JP */}
                  <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#0E1626] border border-[#DDD2B8] dark:border-[#2E4370] space-y-1">
                    <p className="font-serif_jp text-sm font-bold text-[#14110F] dark:text-[#FAF5ED]">
                      {omikujiState.phrase?.japanese}
                    </p>
                    <p className="font-mono text-3xs text-[#6B6358] dark:text-[#94A3B8]">
                      [{omikujiState.phrase?.reading}]
                    </p>
                    <p className="text-xs font-medium text-[#14110F] dark:text-[#DDD2B8] pt-1">
                      {omikujiState.phrase?.meaningEn}
                    </p>
                    <p className="font-telugu text-3xs text-[#C59B27]">
                      {omikujiState.phrase?.meaningTe}
                    </p>
                  </div>

                  <p className="text-3xs text-[#6B6358] dark:text-stone-400 font-mono">
                    Fortune sealed for today &bull; Come back tomorrow!
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* JLPT Readiness Meter */}
          <div className="relative p-5 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/70 shadow-sm space-y-3 overflow-hidden">
            <WashiTexture opacity={0.06} tone="light" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#14110F] dark:text-white font-bold text-sm">
                <Award size={17} className="text-[#C59B27]" />
                <span>JLPT N5 Readiness</span>
              </div>
              <span className="text-xs font-mono font-bold text-kai-vermilion">
                {jlptReadiness}% Ready
              </span>
            </div>

            <div className="relative z-10 w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-kai-gold to-kai-vermilion transition-all duration-500"
                style={{ width: `${jlptReadiness}%` }}
              />
            </div>

            <p className="relative z-10 text-xs text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
              Calculated from your mastered kana, vocabulary bank, kanji recognition, and particle grammar.
            </p>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('jlpt')}
              className="relative z-10 w-full py-2.5 px-3 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Take N5 Diagnostic Exam</span>
              <ChevronRight size={14} />
            </motion.button>
          </div>

          {/* Weakness Alert Card */}
          <div className="relative p-5 rounded-3xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle size={17} />
              <span>Personalized Remediation</span>
            </div>

            <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
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

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('analytics')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Weakness Diagnosis</span>
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
