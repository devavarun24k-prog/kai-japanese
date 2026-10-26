// src/components/common/Sidebar.tsx
// Structured Japanese Editorial Navigation with 5 clear beginner-friendly groups
// Features:
// - Sliding active indicator via framer-motion layoutId
// - 2px icon nudge on hover, 0.98 tap scale
// - Minimum 12px subtitles with verified WCAG AA contrast
// - Authentic Washi paper light & Midnight indigo dark theme
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  BookOpen,
  Shapes,
  Binary,
  Layers,
  Mic,
  PenTool,
  Headphones,
  Scroll,
  Gamepad2,
  Repeat,
  BarChart3,
  Award,
  Bot,
  Compass,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useLearning, ActiveSection } from '../../context/LearningContext';

interface NavItemDef {
  id: ActiveSection;
  titleEn: string;
  titleJp: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: 'vermilion' | 'gold' | 'indigo' | 'green';
}

interface NavGroup {
  id: string;
  label: string;
  labelJp: string;
  items: NavItemDef[];
}

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, stats } = useLearning();

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'home',
      label: 'Home',
      labelJp: 'ホーム',
      items: [
        { id: 'dashboard', titleEn: 'Dashboard', titleJp: 'ダッシュボード', icon: LayoutDashboard },
        { id: 'planner', titleEn: 'Daily Routine', titleJp: '学習計画', icon: CalendarDays },
        { id: 'landing', titleEn: 'Welcome Guide', titleJp: 'はじめに', icon: Compass }
      ]
    },
    {
      id: 'learn',
      label: 'Learn',
      labelJp: '学習',
      items: [
        { id: 'kana', titleEn: 'Kana Academy', titleJp: 'かな道場', icon: Sparkles },
        { id: 'vocab', titleEn: 'Vocabulary', titleJp: '単語帳', icon: BookOpen },
        { id: 'kanji', titleEn: 'Kanji Dojo', titleJp: '漢字道場', icon: Shapes },
        { id: 'grammar', titleEn: 'Grammar Lab', titleJp: '文法研究所', icon: Binary }
      ]
    },
    {
      id: 'practice',
      label: 'Practice',
      labelJp: '練習',
      items: [
        { id: 'sentence', titleEn: 'Sentence Forge', titleJp: '文鍛冶', icon: Layers },
        { id: 'speaking', titleEn: 'Speaking Studio', titleJp: '発音スタジオ', icon: Mic, badge: 'Voice', badgeColor: 'vermilion' },
        { id: 'listening', titleEn: 'Listening Lab', titleJp: '聴解ラボ', icon: Headphones },
        { id: 'reading', titleEn: 'Reading Theatre', titleJp: '読解劇場', icon: Scroll },
        { id: 'handwriting', titleEn: 'Handwriting & OCR', titleJp: '手書き解析', icon: PenTool }
      ]
    },
    {
      id: 'games',
      label: 'Games',
      labelJp: 'ゲーム',
      items: [
        { id: 'rpg_games', titleEn: 'Game Hub & RPG', titleJp: 'RPG道場', icon: Gamepad2, badge: '10 Games', badgeColor: 'gold' }
      ]
    },
    {
      id: 'progress',
      label: 'Progress & AI',
      labelJp: '進捗 & AI',
      items: [
        {
          id: 'reviews',
          titleEn: 'Spaced Reviews',
          titleJp: 'FSRS 復習',
          icon: Repeat,
          badge: stats.reviews_due_count > 0 ? stats.reviews_due_count : undefined,
          badgeColor: 'gold'
        },
        { id: 'analytics', titleEn: 'Weakness Notebook', titleJp: '弱点分析', icon: BarChart3 },
        { id: 'jlpt', titleEn: 'JLPT Prep Arena', titleJp: 'JLPT模擬', icon: Award },
        { id: 'tutor', titleEn: 'KAI AI Tutor', titleJp: 'AI先生', icon: Bot, badge: 'AI', badgeColor: 'indigo' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#F3EBDD]/95 dark:bg-[#0A101C]/95 backdrop-blur-md border-r border-[#DDD2B8] dark:border-[#1C2945] flex flex-col h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto select-none transition-colors">
      <nav className="p-3 space-y-4 flex-1">
        {navGroups.map((group) => {
          const isCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-left text-3xs font-bold uppercase tracking-wider text-[#524B42] dark:text-[#94A3B8] hover:text-[#14110F] dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono">{group.label}</span>
                  <span className="text-3xs font-japanese font-medium opacity-75">
                    ({group.labelJp})
                  </span>
                </div>
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </span>
              </button>

              {/* Group Items */}
              {!isCollapsed && (
                <div className="space-y-0.5 animate-in fade-in duration-150">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors duration-150 group overflow-hidden ${
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
                          {/* 2px icon nudge on hover */}
                          <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.15 }}
                            className="flex-shrink-0"
                          >
                            <Icon
                              size={16}
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
                            {/* Subtitle with guaranteed minimum 12px (text-xs) and WCAG AA contrast */}
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

                        {/* Badges */}
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
              )}
            </div>
          );
        })}
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
