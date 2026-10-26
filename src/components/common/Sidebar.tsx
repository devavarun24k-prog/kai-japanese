// src/components/common/Sidebar.tsx
// Structured Japanese Editorial Navigation with 5 clear beginner-friendly groups
// English primary with subtle Japanese secondary notation, live badges, and clean collapsible groups
import React, { useState } from 'react';
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

  // Track collapsed groups if user wants to tidy up navigation
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
    <aside className="w-64 bg-[#FAF7F2]/90 dark:bg-[#151D28]/95 backdrop-blur-md border-r border-[#E5DEC9] dark:border-[#263345] flex flex-col h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto select-none transition-colors">
      <nav className="p-3 space-y-4 flex-1">
        {navGroups.map((group) => {
          const isCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-left text-3xs font-bold uppercase tracking-wider text-[#7A7165] dark:text-[#94A3B8] hover:text-[#1A1817] dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono">{group.label}</span>
                  <span className="text-4xs font-japanese font-normal opacity-60">
                    ({group.labelJp})
                  </span>
                </div>
                <span className="opacity-40 group-hover:opacity-100 transition-opacity">
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
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group ${
                          isActive
                            ? 'bg-[#D9483B] text-white font-medium shadow-md shadow-[#D9483B]/20'
                            : 'text-[#4A453E] dark:text-[#CBD5E1] hover:bg-[#EFE9DC] dark:hover:bg-[#1F2B3B] hover:text-[#1A1817] dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            size={16}
                            className={`flex-shrink-0 transition-colors ${
                              isActive
                                ? 'text-white'
                                : 'text-[#8A8174] dark:text-[#94A3B8] group-hover:text-[#D9483B]'
                            }`}
                          />
                          <div className="truncate">
                            <div className="text-xs font-semibold truncate leading-tight">
                              {item.titleEn}
                            </div>
                            <div
                              className={`text-3xs font-japanese truncate ${
                                isActive ? 'text-white/80' : 'text-[#A0988A] dark:text-[#64748B]'
                              }`}
                            >
                              {item.titleJp}
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        {item.badge !== undefined && (
                          <span
                            className={`text-3xs font-mono font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.badgeColor === 'gold'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50'
                                : item.badgeColor === 'indigo'
                                ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-[#D9483B]/10 text-[#D9483B] dark:bg-[#D9483B]/20 dark:text-[#F87171]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Target Level Footer Card */}
      <div className="p-3 border-t border-[#E5DEC9] dark:border-[#263345] bg-[#FAF7F2]/60 dark:bg-[#151D28]/60">
        <div className="p-2.5 rounded-2xl bg-white dark:bg-[#1A2433] border border-[#E5DEC9] dark:border-[#263345] shadow-sm text-2xs space-y-1">
          <div className="flex items-center justify-between text-[#7A7165] dark:text-[#94A3B8] font-medium">
            <span>Target Level</span>
            <span className="font-mono font-bold text-[#D9483B]">JLPT N5</span>
          </div>
          <p className="text-[#1A1817] dark:text-[#F0E5CE] font-semibold truncate">
            {stats.level_title}
          </p>
        </div>
      </div>
    </aside>
  );
};
