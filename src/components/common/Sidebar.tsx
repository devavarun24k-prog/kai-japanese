// src/components/common/Sidebar.tsx
// Progressive Disclosure Navigation for KAI
// Primary items: Start Here, Practice, Reviews, Write, Tutor
// Other modules show as locked with tooltip indicating the stage unlock condition and unlock automatically
// All subtitles minimum 12px (text-xs) with verified WCAG AA contrast
// Sliding layoutId active indicator, 2px icon hover nudge, 0.98 tap scale
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Layers,
  Repeat,
  PenTool,
  Bot,
  Lock,
  Sparkles,
  BookOpen,
  Shapes,
  Binary,
  Mic,
  Headphones,
  Volume2,
  Scroll,
  Gamepad2,
  BarChart3,
  Award,
  Cpu,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLearning, ActiveSection } from '../../context/LearningContext';
import { storageService } from '../../services/storageService';

interface PrimaryNavItem {
  id: ActiveSection;
  titleEn: string;
  titleJp: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: 'vermilion' | 'gold' | 'indigo' | 'green';
}

interface LockedModuleDef {
  id: ActiveSection;
  titleEn: string;
  titleJp: string;
  icon: React.ElementType;
  requiredStage: number;
  stageName: string;
  isSpecialLock?: boolean;
  specialCondition?: string;
}

const LOCKED_MODULE_DEFS: LockedModuleDef[] = [
  { id: 'kana', titleEn: 'Kana Academy', titleJp: 'かな道場', icon: Sparkles, requiredStage: 1, stageName: 'Stage 1: Vowels' },
  { id: 'vocab', titleEn: 'Vocabulary', titleJp: '単語帳', icon: BookOpen, requiredStage: 4, stageName: 'Stage 4: First 50 Words' },
  { id: 'kanji', titleEn: 'Kanji Dojo', titleJp: '漢字道場', icon: Shapes, requiredStage: 6, stageName: 'Stage 6: First 20 Kanji' },
  { id: 'grammar', titleEn: 'Grammar Lab', titleJp: '文法研究所', icon: Binary, requiredStage: 5, stageName: 'Stage 5: First Sentences' },
  { id: 'speaking', titleEn: 'Speaking Studio', titleJp: '発音スタジオ', icon: Mic, requiredStage: 4, stageName: 'Stage 4: First 50 Words' },
  { id: 'listening', titleEn: 'Listening Lab', titleJp: '聴解ラボ', icon: Headphones, requiredStage: 4, stageName: 'Stage 4: First 50 Words' },
  { id: 'dictation', titleEn: 'Dictation Studio', titleJp: '聴解 & 綴り', icon: Volume2, requiredStage: 2, stageName: 'Stage 2: Hiragana Rows' },
  { id: 'electronics', titleEn: 'Electronics Lab', titleJp: '電子・半導体', icon: Cpu, requiredStage: 0, stageName: '' },
  { id: 'interview', titleEn: 'Interview Arena', titleJp: '面接道場', icon: Briefcase, requiredStage: 0, stageName: '' },
  { id: 'career', titleEn: 'Career Studio', titleJp: '就職・履歴書', icon: FileText, requiredStage: 0, stageName: '' },
  { id: 'reading', titleEn: 'Reading Theatre', titleJp: '読解劇場', icon: Scroll, requiredStage: 5, stageName: 'Stage 5: First Sentences' },
  { id: 'rpg_games', titleEn: 'Game Hub & RPG', titleJp: 'RPG道場', icon: Gamepad2, requiredStage: 2, stageName: 'Stage 2: Hiragana Rows' },
  { id: 'jlpt', titleEn: 'JLPT Prep Arena', titleJp: 'JLPT模擬', icon: Award, requiredStage: 7, stageName: 'Stage 7: N5 Foundation' },
  {
    id: 'analytics',
    titleEn: 'Weakness Notebook',
    titleJp: '弱点分析',
    icon: BarChart3,
    requiredStage: 0,
    stageName: '',
    isSpecialLock: true,
    specialCondition: 'Requires >=50 practice attempts'
  }
];

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, stats } = useLearning();
  const [showAdvancedModules, setShowAdvancedModules] = useState<boolean>(true);
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  // Get completed stages to calculate automatic unlocks
  const completedStageIds = useMemo(() => {
    try {
      const saved = localStorage.getItem('kai_start_here_completed_stages');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }, [activeSection]);

  const attemptsCount = useMemo(() => {
    return storageService.getAttempts().length;
  }, [activeSection]);

  // Primary 5 Navigation Items requested: Start Here, Practice, Reviews, Write, Tutor
  const primaryNavItems: PrimaryNavItem[] = [
    {
      id: 'start_here',
      titleEn: 'Start Here',
      titleJp: 'はじめに & 今日の学習',
      icon: Compass,
      badge: 'Curriculum',
      badgeColor: 'vermilion'
    },
    {
      id: 'sentence',
      titleEn: 'Practice',
      titleJp: '文章 & 練習道場',
      icon: Layers
    },
    {
      id: 'reviews',
      titleEn: 'Reviews',
      titleJp: 'FSRS 復習',
      icon: Repeat,
      badge: stats.reviews_due_count > 0 ? stats.reviews_due_count : undefined,
      badgeColor: 'gold'
    },
    {
      id: 'handwriting',
      titleEn: 'Write',
      titleJp: '手書き & OCR',
      icon: PenTool
    },
    {
      id: 'tutor',
      titleEn: 'Tutor',
      titleJp: 'KAI AI 先生',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'indigo'
    }
  ];

  // Helper to check if a locked module has met its unlock condition
  const checkIsUnlocked = (def: LockedModuleDef): boolean => {
    if (def.isSpecialLock) {
      return attemptsCount >= 50;
    }
    if (def.requiredStage === 0) {
      return true;
    }
    // Check if stage is completed
    const stageKeyMap: Record<number, string> = {
      1: 'stage_1_vowels',
      2: 'stage_2_hiragana_rows',
      3: 'stage_3_katakana',
      4: 'stage_4_first_50_words',
      5: 'stage_5_first_sentences',
      6: 'stage_6_first_20_kanji',
      7: 'stage_7_n5_foundation'
    };
    const key = stageKeyMap[def.requiredStage];
    return key ? completedStageIds.includes(key) : false;
  };

  return (
    <aside className="w-64 bg-[#F3EBDD]/95 dark:bg-[#0A101C]/95 backdrop-blur-md border-r border-[#DDD2B8] dark:border-[#1C2945] flex flex-col h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto select-none transition-colors">
      <nav className="p-3 space-y-4 flex-1">
        {/* ===================================================================
            1. PRIMARY ESSENTIAL NAVIGATION (Start Here, Practice, Reviews, Write, Tutor)
            =================================================================== */}
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-left text-3xs font-bold uppercase tracking-wider text-[#524B42] dark:text-[#94A3B8]">
            Core Path
          </div>

          <div className="space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTooltipMessage(null);
                    setActiveSection(item.id);
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 group overflow-hidden ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-[#14110F] dark:text-[#CBD5E1] hover:bg-[#E8DEC8]/60 dark:hover:bg-[#141D33] hover:text-[#14110F] dark:hover:text-white'
                  }`}
                >
                  {/* Sliding Active Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark shadow-md shadow-kai-vermilion/25 z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                      className="flex-shrink-0"
                    >
                      <Icon
                        size={17}
                        className={`transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-[#6B6358] dark:text-[#94A3B8] group-hover:text-kai-vermilion'
                        }`}
                      />
                    </motion.div>

                    <div className="truncate">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {item.titleEn}
                      </div>
                      <div
                        className={`text-xs font-japanese truncate leading-snug mt-0.5 ${
                          isActive
                            ? 'text-white/90'
                            : 'text-[#524B42] dark:text-[#94A3B8] font-normal'
                        }`}
                      >
                        {item.titleJp}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`relative z-10 text-3xs font-mono font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor === 'gold'
                          ? 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                          : item.badgeColor === 'indigo'
                          ? 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-200'
                          : 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border border-red-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            2. PROGRESSIVE DISCLOSURE: STUDIOS & ADVANCED MODULES (WITH LOCK TOOLTIPS)
            =================================================================== */}
        <div className="space-y-1 pt-2 border-t border-[#DDD2B8] dark:border-[#1C2945]">
          <button
            type="button"
            onClick={() => setShowAdvancedModules((prev) => !prev)}
            className="w-full flex items-center justify-between px-2.5 py-1 text-left text-3xs font-bold uppercase tracking-wider text-[#524B42] dark:text-[#94A3B8] hover:text-[#14110F] dark:hover:text-white transition-colors"
          >
            <span>Learning Studios</span>
            <span className="opacity-50">
              {showAdvancedModules ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          </button>

          {showAdvancedModules && (
            <div className="space-y-0.5 animate-in fade-in duration-150">
              {LOCKED_MODULE_DEFS.map((mod) => {
                const Icon = mod.icon;
                const isUnlocked = checkIsUnlocked(mod);
                const isActive = activeSection === mod.id;

                const unlockConditionText = mod.isSpecialLock
                  ? `Unlocks at 50 practice answers (${attemptsCount}/50 completed)`
                  : `Unlocks upon completing ${mod.stageName}`;

                return (
                  <div key={mod.id} className="relative group">
                    <motion.button
                      type="button"
                      whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                      onClick={() => {
                        if (isUnlocked) {
                          setTooltipMessage(null);
                          setActiveSection(mod.id);
                        } else {
                          setTooltipMessage(unlockConditionText);
                          setTimeout(() => setTooltipMessage(null), 3500);
                        }
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors duration-150 overflow-hidden ${
                        isActive
                          ? 'text-white font-medium'
                          : isUnlocked
                          ? 'text-[#14110F] dark:text-[#CBD5E1] hover:bg-[#E8DEC8]/60 dark:hover:bg-[#141D33]'
                          : 'text-[#6B6358]/60 dark:text-stone-500 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark shadow-md z-0"
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={15}
                          className={`flex-shrink-0 ${
                            isActive
                              ? 'text-white'
                              : isUnlocked
                              ? 'text-[#6B6358] dark:text-[#94A3B8]'
                              : 'text-stone-400'
                          }`}
                        />
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate leading-tight">
                            {mod.titleEn}
                          </div>
                          <div
                            className={`text-xs font-japanese truncate leading-snug mt-0.5 ${
                              isActive
                                ? 'text-white/90'
                                : 'text-[#524B42] dark:text-[#94A3B8] font-normal'
                            }`}
                          >
                            {mod.titleJp}
                          </div>
                        </div>
                      </div>

                      {/* Lock Icon if not yet unlocked */}
                      {!isUnlocked && (
                        <div
                          className="relative z-10 p-1 rounded text-stone-400"
                          title={unlockConditionText}
                        >
                          <Lock size={13} />
                        </div>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Tooltip Banner for Locked Modules */}
        {tooltipMessage && (
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 text-amber-950 dark:text-amber-200 text-3xs flex items-start gap-1.5 animate-in fade-in duration-150">
            <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{tooltipMessage}</p>
          </div>
        )}
      </nav>

      {/* Target Level Footer Card */}
      <div className="p-3 border-t border-[#DDD2B8] dark:border-[#1C2945] bg-[#E8DEC8]/40 dark:bg-[#0E1626]/60">
        <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/60 shadow-sm text-2xs space-y-1">
          <div className="flex items-center justify-between text-[#524B42] dark:text-[#94A3B8] font-medium">
            <span>Target Level</span>
            <span className="font-mono font-bold text-kai-vermilion">JLPT N5</span>
          </div>
          <p className="text-[#14110F] dark:text-[#FAF5ED] font-semibold truncate text-xs">
            {stats.level_title}
          </p>
        </div>
      </div>
    </aside>
  );
};
