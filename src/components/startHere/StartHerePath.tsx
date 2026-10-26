// src/components/startHere/StartHerePath.tsx
// "Start Here" Progressive Disclosure Learning Path (Stages 0 - 7)
// Features:
// - First launch placement assessment: "I know nothing" / "Some kana" / "N5 level"
// - Interactive stages following: Watch > Hear > Trace > Write > Quiz > auto-add to FSRS
// - Unlock next stage at quiz >= 80%, with immediate "Test Out" option
// - Merged Today / Daily Routine tab and Welcome Guide access
// - Full Midnight Matsuri + Sumi-e theme styling and motion safety
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  Volume2,
  PenTool,
  Brain,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Repeat,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import {
  START_HERE_STAGES,
  PathStageDef,
  StageStepQuizQuestion,
  PlacementChoice
} from '../../data/startHerePathData';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { storageService } from '../../services/storageService';
import { fsrsService } from '../../services/fsrsService';
import { AudioButton } from '../common/AudioButton';
import { HankoStamp } from '../fx/HankoStamp';
import { WashiTexture, GoldFlecks } from '../fx';

const STORAGE_KEY_PLACEMENT = 'kai_start_here_placement';
const STORAGE_KEY_COMPLETED_STAGES = 'kai_start_here_completed_stages';

export const StartHerePath: React.FC = () => {
  const { setActiveSection, awardXP, soundEnabled, displayMode } = useLearning();
  const shouldReduceMotion = useReducedMotion();

  // Placement state
  const [placement, setPlacement] = useState<PlacementChoice | null>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY_PLACEMENT) as PlacementChoice) || null;
    } catch (e) {
      return null;
    }
  });

  // Completed stage IDs
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_STAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Active Stage currently viewing / studying
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'watch' | 'hear' | 'trace' | 'write' | 'quiz'>('watch');

  // Test-out state
  const [testOutStageId, setTestOutStageId] = useState<string | null>(null);

  // Active Sub-tab in Start Here (Path vs Today's Routine)
  const [subTab, setSubTab] = useState<'path' | 'today'>('path');

  // Save completed stages
  const markStageCompleted = (stage: PathStageDef) => {
    if (!completedStageIds.includes(stage.id)) {
      const next = [...completedStageIds, stage.id];
      setCompletedStageIds(next);
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED_STAGES, JSON.stringify(next));
      } catch (e) {
        // ignore
      }

      // Automatically add stage flashcard items to FSRS review deck
      if (stage.fsrsItems && stage.fsrsItems.length > 0) {
        const existingCards = storageService.getCards();
        const newCards = stage.fsrsItems.map((item) => {
          const initialCard = fsrsService.createCard(item.id, item.itemType);
          return {
            ...initialCard,
            front: item.front,
            back: item.back,
            reading: item.reading,
            meaning_en: item.meaningEn,
            meaning_te: item.meaningTe
          };
        });

        // Filter out existing cards to prevent duplicates
        const filteredNewCards = newCards.filter(
          (nc) => !existingCards.some((ec) => ec.item_id === nc.item_id)
        );

        if (filteredNewCards.length > 0) {
          storageService.saveCards([...existingCards, ...filteredNewCards]);
        }
      }

      // Award XP
      awardXP(25, `Stage ${stage.stageNumber} Completed (${stage.titleEn})`);

      if (soundEnabled) {
        soundEffects.playLevelUp();
      }

      // Confetti
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D9483B', '#C59B27', '#FFB7C5', '#FFFFFF'],
        disableForReducedMotion: true
      });
    }
  };

  // First Launch Placement Handler
  const handleSelectPlacement = (choice: PlacementChoice) => {
    soundEffects.playClick();
    setPlacement(choice);
    try {
      localStorage.setItem(STORAGE_KEY_PLACEMENT, choice);
    } catch (e) {
      // ignore
    }

    if (choice === 'some_kana') {
      // Auto-unlock stages 0 and 1
      const initial = ['stage_0_how_japanese_works', 'stage_1_vowels'];
      setCompletedStageIds(initial);
      localStorage.setItem(STORAGE_KEY_COMPLETED_STAGES, JSON.stringify(initial));
      setActiveStageId('stage_2_hiragana_rows');
    } else if (choice === 'n5_level') {
      // Auto-unlock stages 0 through 5
      const initial = [
        'stage_0_how_japanese_works',
        'stage_1_vowels',
        'stage_2_hiragana_rows',
        'stage_3_katakana',
        'stage_4_first_50_words',
        'stage_5_first_sentences'
      ];
      setCompletedStageIds(initial);
      localStorage.setItem(STORAGE_KEY_COMPLETED_STAGES, JSON.stringify(initial));
      setActiveStageId('stage_6_first_20_kanji');
    } else {
      setActiveStageId('stage_0_how_japanese_works');
    }
  };

  const isStageUnlocked = (stageNumber: number): boolean => {
    if (stageNumber === 0) return true;
    const prevStage = START_HERE_STAGES[stageNumber - 1];
    return completedStageIds.includes(prevStage.id);
  };

  const currentActiveStage = useMemo(() => {
    return START_HERE_STAGES.find((s) => s.id === activeStageId);
  }, [activeStageId]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [writeInput, setWriteInput] = useState<string>('');

  const resetStageSession = (stageId: string) => {
    setActiveStageId(stageId);
    setActiveStep('watch');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setWriteInput('');
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* =====================================================================
          1. PLACEMENT ASSESSMENT MODAL (IF FIRST LAUNCH)
          ===================================================================== */}
      {!placement && (
        <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0A101C] bg-gradient-to-r from-[#0A101C] via-[#0E1626] to-[#141D33] text-[#FAF5ED] border border-[#2E4370] shadow-2xl space-y-5 text-center">
          <div className="max-w-lg mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141D33] border border-[#2E4370] text-3xs font-mono text-[#E2BA4E]">
              <Sparkles size={12} />
              <span>Initial Placement Assessment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif_jp font-bold">
              Where would you like to start your journey?
            </h2>
            <p className="text-xs text-[#DDD2B8] leading-relaxed">
              We personalize your curriculum so you never waste time on things you already know, while making sure your foundations are solid.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlacement('know_nothing')}
              className="p-5 rounded-2xl bg-[#141D33]/90 hover:bg-[#1C2945] border border-[#2E4370] text-left space-y-2 shadow-sm transition-colors"
            >
              <span className="text-2xl block">🌱</span>
              <h3 className="font-bold text-sm font-serif_jp text-white">I know nothing</h3>
              <p className="text-3xs text-[#DDD2B8] leading-relaxed">
                Absolute zero beginner. Start from Stage 0: How Japanese works and the 5 pure vowels.
              </p>
            </motion.button>

            <motion.button
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlacement('some_kana')}
              className="p-5 rounded-2xl bg-[#141D33]/90 hover:bg-[#1C2945] border border-[#2E4370] text-left space-y-2 shadow-sm transition-colors"
            >
              <span className="text-2xl block">🎏</span>
              <h3 className="font-bold text-sm font-serif_jp text-white">Some Kana</h3>
              <p className="text-3xs text-[#DDD2B8] leading-relaxed">
                Familiar with basic vowels and characters. Jump into systematic rows and Katakana.
              </p>
            </motion.button>

            <motion.button
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlacement('n5_level')}
              className="p-5 rounded-2xl bg-[#141D33]/90 hover:bg-[#1C2945] border border-[#2E4370] text-left space-y-2 shadow-sm transition-colors"
            >
              <span className="text-2xl block">⛩️</span>
              <h3 className="font-bold text-sm font-serif_jp text-white">N5 Level Horizon</h3>
              <p className="text-3xs text-[#DDD2B8] leading-relaxed">
                Can read Kana comfortably. Focus on Core Kanji, SOV grammar, and full N5 foundation.
              </p>
            </motion.button>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. HEADER WITH INTEGRATED TABS (PATH vs TODAY / ROUTINE)
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DDD2B8] dark:border-[#2E4370]/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-kai-vermilion" />
            <h1 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
              Start Here: Beginner Path (入門コース)
            </h1>
          </div>
          <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
            Progressive 8-stage mastery with Watch &gt; Hear &gt; Trace &gt; Write &gt; Quiz &gt; FSRS scheduling.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-[#E8DEC8]/80 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] text-xs">
          <button
            type="button"
            onClick={() => setSubTab('path')}
            className={`py-1.5 px-3 rounded-xl font-semibold transition-all ${
              subTab === 'path'
                ? 'bg-kai-vermilion text-white shadow-sm'
                : 'text-[#6B6358] dark:text-stone-300 hover:text-[#14110F]'
            }`}
          >
            Stages 0 &ndash; 7
          </button>
          <button
            type="button"
            onClick={() => setSubTab('today')}
            className={`py-1.5 px-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              subTab === 'today'
                ? 'bg-kai-vermilion text-white shadow-sm'
                : 'text-[#6B6358] dark:text-stone-300 hover:text-[#14110F]'
            }`}
          >
            <CalendarDays size={13} />
            <span>Today / Routine</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          3. SUBTAB: TODAY'S ROUTINE & WELCOME GUIDE MERGE
          ===================================================================== */}
      {subTab === 'today' && (
        <div className="space-y-6">
          <div className="relative p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-sm space-y-4 overflow-hidden">
            <WashiTexture opacity={0.06} tone="light" />
            <div className="relative z-10 flex items-center justify-between border-b border-[#DDD2B8] dark:border-[#2E4370]/60 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-kai-vermilion" />
                <h2 className="text-base font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  Today&apos;s Recommended Study Routine
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('planner')}
                className="text-xs font-semibold text-kai-vermilion hover:underline flex items-center gap-1"
              >
                <span>Full Study Planner</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <p className="relative z-10 text-xs text-[#524B42] dark:text-[#DDD2B8] leading-relaxed">
              Consistently completing your 3 daily tasks prevents memory decay through the FSRS spaced repetition engine.
            </p>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#0E1626]/80 border border-[#DDD2B8] dark:border-[#2E4370]/50 space-y-1">
                <span className="text-3xs font-mono uppercase text-kai-vermilion font-bold">1. Review</span>
                <h3 className="text-xs font-bold text-[#14110F] dark:text-white">Clear Spaced Memory Cards</h3>
                <p className="text-3xs text-[#6B6358] dark:text-stone-300">5-10 minutes</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#0E1626]/80 border border-[#DDD2B8] dark:border-[#2E4370]/50 space-y-1">
                <span className="text-3xs font-mono uppercase text-[#C59B27] font-bold">2. Input</span>
                <h3 className="text-xs font-bold text-[#14110F] dark:text-white">Complete Next Stage Lesson</h3>
                <p className="text-3xs text-[#6B6358] dark:text-stone-300">10-15 minutes</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#0E1626]/80 border border-[#DDD2B8] dark:border-[#2E4370]/50 space-y-1">
                <span className="text-3xs font-mono uppercase text-[#2D7A4D] font-bold">3. Output</span>
                <h3 className="text-xs font-bold text-[#14110F] dark:text-white">Write or Voice Shadowing</h3>
                <p className="text-3xs text-[#6B6358] dark:text-stone-300">5 minutes</p>
              </div>
            </div>

            {/* Quick Link to Landing Guide */}
            <div className="relative z-10 pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSection('landing')}
                className="text-xs text-[#524B42] dark:text-[#94A3B8] hover:text-kai-vermilion flex items-center gap-1.5"
              >
                <BookOpen size={13} />
                <span>Need a refresher on KAI’s full methodology? View Welcome Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. SUBTAB: STAGES 0 - 7 ROADMAP
          ===================================================================== */}
      {subTab === 'path' && !currentActiveStage && !testOutStageId && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {START_HERE_STAGES.map((stage) => {
              const isUnlocked = isStageUnlocked(stage.stageNumber);
              const isCompleted = completedStageIds.includes(stage.id);

              return (
                <motion.div
                  key={stage.id}
                  whileHover={isUnlocked && !shouldReduceMotion ? { y: -2 } : undefined}
                  className={`relative p-5 rounded-3xl border transition-all ${
                    isCompleted
                      ? 'bg-[#F3EBDD] dark:bg-[#141D33] border-[#2D7A4D]/50 shadow-sm'
                      : isUnlocked
                      ? 'bg-[#F3EBDD] dark:bg-[#141D33] border-[#C59B27]/60 shadow-md hover:border-kai-vermilion'
                      : 'bg-[#E8DEC8]/40 dark:bg-[#0E1626]/40 border-stone-300 dark:border-stone-800 opacity-60'
                  }`}
                >
                  <WashiTexture opacity={0.05} tone="light" />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-3xs font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370]">
                          Stage {stage.stageNumber} &bull; {stage.badge}
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-3xs font-bold text-[#2D7A4D] font-mono">
                            <CheckCircle2 size={13} /> Completed
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                        {stage.titleEn}
                      </h2>
                      <p className="text-3xs font-serif_jp text-[#C59B27]">
                        {stage.titleJp} &bull; {stage.titleTe}
                      </p>
                      <p className="text-xs text-[#524B42] dark:text-[#DDD2B8] leading-relaxed pt-1">
                        {stage.descriptionEn}
                      </p>
                    </div>

                    {isCompleted ? (
                      <HankoStamp text="済" size={38} shape="square" playSound={false} />
                    ) : isUnlocked ? (
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-[#1C2945] text-[#C59B27]">
                        <Unlock size={18} />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500">
                        <Lock size={18} />
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="relative z-10 pt-4 flex items-center justify-between gap-2 border-t border-[#DDD2B8]/60 dark:border-[#2E4370]/40 mt-3">
                    <span className="text-3xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
                      ~{stage.estimatedMinutes} mins
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Test Out Button */}
                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => setTestOutStageId(stage.id)}
                          className="px-2.5 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-3xs font-semibold text-[#524B42] dark:text-stone-300 hover:text-kai-vermilion hover:border-kai-vermilion transition-colors"
                        >
                          Test Out &rarr;
                        </button>
                      )}

                      {/* Start / Review Button */}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={!isUnlocked}
                        onClick={() => resetStageSession(stage.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isUnlocked
                            ? 'bg-kai-vermilion text-white hover:bg-kai-vermilion-dark shadow-sm'
                            : 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <span>{isCompleted ? 'Review Stage' : 'Start Stage'}</span>
                        <ArrowRight size={13} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          5. STAGE LESSON STUDIO: WATCH > HEAR > TRACE > WRITE > QUIZ
          ===================================================================== */}
      {currentActiveStage && (
        <div className="space-y-6">
          {/* Top Bar to Return to Overview */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveStageId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6B6358] dark:text-[#94A3B8] hover:text-kai-vermilion"
            >
              <ArrowLeft size={14} />
              <span>&larr; Back to Stage Map</span>
            </button>

            <span className="text-xs font-mono font-bold text-kai-vermilion">
              Stage {currentActiveStage.stageNumber}: {currentActiveStage.titleEn}
            </span>
          </div>

          {/* 5-Step Process Indicator */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-medium">
            {(['watch', 'hear', 'trace', 'write', 'quiz'] as const).map((stepName, sIdx) => {
              const isCurrent = activeStep === stepName;
              return (
                <button
                  key={stepName}
                  type="button"
                  onClick={() => setActiveStep(stepName)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center text-3xs sm:text-xs font-semibold capitalize transition-all ${
                    isCurrent
                      ? 'bg-kai-vermilion text-white shadow-sm'
                      : 'text-[#6B6358] dark:text-stone-300 hover:text-[#14110F]'
                  }`}
                >
                  <span>{sIdx + 1}. {stepName}</span>
                </button>
              );
            })}
          </div>

          {/* Step 1: WATCH */}
          {activeStep === 'watch' && (
            <div className="relative p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] space-y-4">
              <WashiTexture opacity={0.06} tone="light" />
              <div className="relative z-10 space-y-2">
                <span className="text-3xs font-mono uppercase text-kai-vermilion font-bold block">
                  Step 1 &bull; Visual Concept Overview
                </span>
                <h3 className="text-lg font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  {currentActiveStage.watchContent.heading}
                </h3>
                <p className="text-xs sm:text-sm text-[#524B42] dark:text-[#DDD2B8] leading-relaxed">
                  {currentActiveStage.watchContent.bodyEn}
                </p>
                <p className="font-telugu text-xs text-[#C59B27] leading-relaxed">
                  {currentActiveStage.watchContent.bodyTe}
                </p>
              </div>

              {/* Key points box */}
              <div className="relative z-10 p-4 rounded-2xl bg-white/80 dark:bg-[#0E1626]/80 border border-[#DDD2B8] dark:border-[#2E4370]/60 space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase text-[#14110F] dark:text-white">
                  Key Principles to Remember:
                </h4>
                <ul className="space-y-1.5 text-xs text-[#524B42] dark:text-stone-300">
                  {currentActiveStage.watchContent.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-kai-vermilion font-bold">&bull;</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep('hear')}
                  className="px-5 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion flex items-center gap-1.5"
                >
                  <span>Continue to Step 2: Hear</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: HEAR */}
          {activeStep === 'hear' && (
            <div className="relative p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] space-y-4">
              <WashiTexture opacity={0.06} tone="light" />
              <div className="relative z-10 space-y-1">
                <span className="text-3xs font-mono uppercase text-kai-vermilion font-bold block">
                  Step 2 &bull; Native Audio Tuning &amp; Mora Timing
                </span>
                <h3 className="text-lg font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  Listen and Shadow Native Pronunciation
                </h3>
                <p className="text-xs text-[#524B42] dark:text-[#DDD2B8]">
                  Click the speaker icon to hear authentic Tokyo mora resonance. Shadow aloud immediately after listening.
                </p>
              </div>

              <div className="relative z-10 space-y-3">
                {currentActiveStage.hearContent.audioItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/90 dark:bg-[#0E1626]/90 border border-[#DDD2B8] dark:border-[#2E4370]/60 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-serif_jp text-kai-vermilion">
                          {item.text}
                        </span>
                        <span className="font-mono text-xs text-[#6B6358] dark:text-[#94A3B8]">
                          [{item.romaji}]
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#14110F] dark:text-white">
                        {item.meaningEn} &bull; <span className="font-telugu text-[#C59B27]">{item.meaningTe}</span>
                      </p>
                      <p className="text-3xs text-[#6B6358] dark:text-stone-400">
                        {item.notes}
                      </p>
                    </div>

                    <AudioButton text={item.text} size="md" />
                  </div>
                ))}
              </div>

              <div className="relative z-10 pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('watch')}
                  className="px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-medium"
                >
                  &larr; Back to Watch
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('trace')}
                  className="px-5 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion flex items-center gap-1.5"
                >
                  <span>Continue to Step 3: Trace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: TRACE */}
          {activeStep === 'trace' && (
            <div className="relative p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] space-y-4 text-center">
              <WashiTexture opacity={0.06} tone="light" />
              <div className="relative z-10 space-y-1">
                <span className="text-3xs font-mono uppercase text-kai-vermilion font-bold block">
                  Step 3 &bull; Stroke Order &amp; Motor Memory Tracing
                </span>
                <h3 className="text-lg font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  Trace: {currentActiveStage.traceContent.character} ({currentActiveStage.traceContent.romaji})
                </h3>
                <p className="text-xs text-[#524B42] dark:text-[#DDD2B8] max-w-md mx-auto">
                  {currentActiveStage.traceContent.guidanceEn}
                </p>
              </div>

              {/* Tracing Canvas SVG Display */}
              <div className="relative z-10 w-44 h-44 mx-auto p-4 rounded-3xl bg-white dark:bg-[#0E1626] border-2 border-[#DDD2B8] dark:border-[#2E4370] flex items-center justify-center shadow-inner">
                {/* Crosshairs guide grid */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
                  <div className="w-full border-t border-dashed border-[#14110F] dark:border-white" />
                  <div className="h-full border-l border-dashed border-[#14110F] dark:border-white absolute" />
                </div>

                <span className="text-7xl font-serif_jp font-bold text-kai-vermilion select-none drop-shadow-sm">
                  {currentActiveStage.traceContent.character}
                </span>
              </div>

              <div className="relative z-10 pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('hear')}
                  className="px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-medium"
                >
                  &larr; Back to Hear
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('write')}
                  className="px-5 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion flex items-center gap-1.5"
                >
                  <span>Continue to Step 4: Write</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: WRITE */}
          {activeStep === 'write' && (
            <div className="relative p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] space-y-4 text-center">
              <WashiTexture opacity={0.06} tone="light" />
              <div className="relative z-10 space-y-1">
                <span className="text-3xs font-mono uppercase text-kai-vermilion font-bold block">
                  Step 4 &bull; Active Recall From Memory
                </span>
                <h3 className="text-lg font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                  Write from Memory Drill
                </h3>
                <p className="text-xs text-[#524B42] dark:text-[#DDD2B8] max-w-md mx-auto">
                  {currentActiveStage.writeContent.prompt}
                </p>
              </div>

              {/* Memory Write Input Box */}
              <div className="relative z-10 max-w-xs mx-auto space-y-2">
                <input
                  type="text"
                  value={writeInput}
                  onChange={(e) => setWriteInput(e.target.value)}
                  placeholder="Type character here..."
                  className="w-full text-center text-3xl font-serif_jp py-3 px-4 rounded-2xl bg-white dark:bg-[#0E1626] border-2 border-[#DDD2B8] dark:border-[#2E4370] text-[#14110F] dark:text-white focus:outline-none focus:border-kai-vermilion"
                />

                <p className="text-3xs text-[#6B6358] dark:text-[#94A3B8]">
                  Hint: {currentActiveStage.writeContent.hintEn}
                </p>

                {writeInput.trim() === currentActiveStage.writeContent.expectedCharacter && (
                  <div className="p-2 rounded-xl bg-green-100 text-[#2D7A4D] font-bold text-xs animate-in zoom-in-95">
                    Correct recall! Memory trace verified ✓
                  </div>
                )}
              </div>

              <div className="relative z-10 pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('trace')}
                  className="px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-medium"
                >
                  &larr; Back to Trace
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('quiz')}
                  className="px-5 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion flex items-center gap-1.5"
                >
                  <span>Continue to Step 5: Quiz</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: QUIZ */}
          {activeStep === 'quiz' && (
            <div className="relative p-6 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] space-y-5">
              <WashiTexture opacity={0.06} tone="light" />
              <div className="relative z-10 flex items-center justify-between border-b border-[#DDD2B8] dark:border-[#2E4370]/60 pb-3">
                <div>
                  <span className="text-3xs font-mono uppercase text-kai-vermilion font-bold block">
                    Step 5 &bull; Mastery Verification Quiz
                  </span>
                  <h3 className="text-lg font-bold font-serif_jp text-[#14110F] dark:text-[#FAF5ED]">
                    Score 80%+ to Complete Stage &amp; Unlock FSRS Cards
                  </h3>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                {currentActiveStage.quizQuestions.map((q, qIdx) => {
                  const selected = quizAnswers[q.id];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-white/90 dark:bg-[#0E1626]/90 border border-[#DDD2B8] dark:border-[#2E4370]/60 space-y-2.5"
                    >
                      <p className="text-xs sm:text-sm font-bold text-[#14110F] dark:text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (!quizSubmitted) {
                                soundEffects.playClick();
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                              }
                            }}
                            className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                              selected === optIdx
                                ? quizSubmitted
                                  ? isCorrect
                                    ? 'bg-green-100 text-green-950 border-green-500 font-bold'
                                    : 'bg-red-100 text-red-950 border-red-500 font-bold'
                                  : 'bg-kai-vermilion text-white font-bold border-kai-vermilion shadow-sm'
                                : quizSubmitted && optIdx === q.correctIndex
                                ? 'bg-green-100 text-green-950 border-green-500 font-bold'
                                : 'bg-stone-50 dark:bg-[#1C2945] text-[#14110F] dark:text-stone-200 border-[#DDD2B8] dark:border-[#2E4370]/60 hover:border-kai-vermilion'
                            }`}
                          >
                            <span>{opt}</span>
                          </button>
                        ))}
                      </div>

                      {quizSubmitted && (
                        <p className={`text-3xs font-medium ${isCorrect ? 'text-[#2D7A4D]' : 'text-kai-vermilion'}`}>
                          {q.explanationEn}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz or Finalize */}
              <div className="relative z-10 pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('write')}
                  className="px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-medium"
                >
                  &larr; Back to Write
                </button>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={Object.keys(quizAnswers).length < currentActiveStage.quizQuestions.length}
                    onClick={() => {
                      setQuizSubmitted(true);
                      const correctCount = currentActiveStage.quizQuestions.filter(
                        (q) => quizAnswers[q.id] === q.correctIndex
                      ).length;
                      const scorePct = Math.round((correctCount / currentActiveStage.quizQuestions.length) * 100);

                      if (scorePct >= 80) {
                        markStageCompleted(currentActiveStage);
                      } else {
                        if (soundEnabled) soundEffects.playWrong();
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion disabled:opacity-40"
                  >
                    Submit Quiz &amp; Grade
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveStageId(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#2D7A4D] text-white font-bold text-xs shadow-sm"
                  >
                    Return to Stage Map
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          6. TEST-OUT MODAL
          ===================================================================== */}
      {testOutStageId && (
        <div className="p-6 rounded-3xl bg-[#0A101C] text-white border border-[#2E4370] shadow-2xl space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#2E4370] pb-2">
            <h3 className="font-bold text-sm font-serif_jp">
              Test Out of Stage
            </h3>
            <button
              onClick={() => setTestOutStageId(null)}
              className="text-xs text-stone-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-stone-300">
            Answer both questions correctly to skip directly ahead to the next stage!
          </p>

          <div className="space-y-3">
            {START_HERE_STAGES.find((s) => s.id === testOutStageId)?.testOutQuestions.map((q) => (
              <div key={q.id} className="p-3.5 rounded-2xl bg-[#141D33] border border-[#2E4370] space-y-2">
                <p className="text-xs font-bold text-white">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => {
                        if (oIdx === q.correctIndex) {
                          const target = START_HERE_STAGES.find((s) => s.id === testOutStageId);
                          if (target) markStageCompleted(target);
                          setTestOutStageId(null);
                        } else {
                          if (soundEnabled) soundEffects.playWrong();
                        }
                      }}
                      className="p-2 rounded-xl bg-[#1C2945] hover:bg-kai-vermilion text-xs font-semibold text-white border border-[#2E4370] text-center transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
