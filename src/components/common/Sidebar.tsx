// src/components/common/Sidebar.tsx
// Japanese editorial RPG navigation sidebar with icons and status badges
import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Shapes,
  Binary,
  Layers,
  Bot,
  Mic,
  PenTool,
  Headphones,
  Scroll,
  Gamepad2,
  Repeat,
  BarChart3,
  CalendarDays,
  Award,
  ChevronRight
} from 'lucide-react';
import { useLearning, ActiveSection } from '../../context/LearningContext';

interface NavItem {
  id: ActiveSection;
  labelEn: string;
  labelJp: string;
  labelTe: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, stats } = useLearning();

  const navItems: NavItem[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelJp: 'ホーム', labelTe: 'డ్యాష్‌బోర్డ్', icon: LayoutDashboard },
    { id: 'kana', labelEn: 'Kana Academy', labelJp: 'かな道場', labelTe: 'కానా అకాడమీ', icon: Sparkles },
    { id: 'vocab', labelEn: 'Vocabulary', labelJp: '単語帳', labelTe: 'పద సంపద', icon: BookOpen },
    { id: 'kanji', labelEn: 'Kanji Dojo', labelJp: '漢字道場', labelTe: 'కాంజీ డోజో', icon: Shapes },
    { id: 'grammar', labelEn: 'Grammar Lab', labelJp: '文法研究所', labelTe: 'వ్యాకరణ ల్యాబ్', icon: Binary },
    { id: 'sentence', labelEn: 'Sentence Forge', labelJp: '文鍛冶', labelTe: 'వాక్యాల నిర్మాణం', icon: Layers },
    { id: 'tutor', labelEn: 'KAI AI Tutor', labelJp: 'AI先生', labelTe: 'AI గురువు', icon: Bot, badge: 'AI' },
    { id: 'speaking', labelEn: 'Speaking Studio', labelJp: '発音スタジオ', labelTe: 'స్పీకింగ్ స్టూడియో', icon: Mic, badge: 'Mic' },
    { id: 'handwriting', labelEn: 'Handwriting & OCR', labelJp: '手書き解析', labelTe: 'రాత & OCR', icon: PenTool },
    { id: 'listening', labelEn: 'Listening Lab', labelJp: '聴解ラボ', labelTe: 'వినే సాధన', icon: Headphones },
    { id: 'reading', labelEn: 'Reading Theatre', labelJp: '読解劇場', labelTe: 'పఠన నాటకం', icon: Scroll },
    { id: 'rpg_games', labelEn: 'KAI RPG & Games', labelJp: 'RPG道場', labelTe: 'ఆటలు & RPG', icon: Gamepad2, badge: '10 Games' },
    { id: 'reviews', labelEn: 'Spaced Reviews', labelJp: '復習 (FSRS)', labelTe: 'రివిజన్ డెక్', icon: Repeat, badge: stats.reviews_due_count > 0 ? stats.reviews_due_count : undefined },
    { id: 'analytics', labelEn: 'Weakness Analytics', labelJp: '弱点分析', labelTe: 'లోపాల విశ్లేషణ', icon: BarChart3 },
    { id: 'planner', labelEn: 'Study Planner', labelJp: '学習計画', labelTe: 'స్టడీ ప్లానర్', icon: CalendarDays },
    { id: 'jlpt', labelEn: 'JLPT Prep Arena', labelJp: 'JLPT模擬', labelTe: 'JLPT పరీక్షలు', icon: Award }
  ];

  return (
    <aside className="w-64 bg-white/60 dark:bg-kai-dark-surface/60 backdrop-blur-sm border-r border-kai-border dark:border-kai-dark-border flex flex-col h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto">
      {/* Navigation list */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-3xs font-bold uppercase tracking-wider text-kai-muted dark:text-kai-dark-muted font-mono">
          Curriculum & Mastery
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-kai-vermilion text-white font-medium shadow-vermilion'
                  : 'text-kai-muted dark:text-kai-dark-muted hover:bg-stone-100 dark:hover:bg-kai-dark-card hover:text-kai-ink dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  size={17}
                  className={isActive ? 'text-white' : 'text-kai-muted group-hover:text-kai-vermilion transition-colors'}
                />
                <div className="truncate">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {item.labelEn}
                  </div>
                  <div
                    className={`text-2xs font-japanese ${
                      isActive ? 'text-white/80' : 'text-kai-faint dark:text-kai-dark-faint'
                    }`}
                  >
                    {item.labelJp}
                  </div>
                </div>
              </div>

              {/* Badge if present */}
              {item.badge !== undefined && (
                <span
                  className={`text-2xs font-mono font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      : 'bg-kai-indigo-bg text-kai-indigo dark:bg-kai-dark-card dark:text-kai-vermilion-light'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Target Level */}
      <div className="p-3 border-t border-kai-border dark:border-kai-dark-border bg-kai-bg/50 dark:bg-kai-dark-bg/50">
        <div className="p-2.5 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border/80 dark:border-kai-dark-border text-2xs space-y-1">
          <div className="flex items-center justify-between text-kai-muted dark:text-kai-dark-muted font-medium">
            <span>Target Stage</span>
            <span className="font-mono font-bold text-kai-vermilion">JLPT N5</span>
          </div>
          <p className="text-kai-ink dark:text-kai-dark-ink font-semibold truncate">
            {stats.level_title}
          </p>
        </div>
      </div>
    </aside>
  );
};
