// src/components/common/CommandPalette.tsx
// Quick Command Palette triggered by Ctrl+K / Cmd+K
// Features:
// - Jump to any learning studio or module instantly
// - Keyboard navigation (Up/Down arrows, Enter to execute, Escape to dismiss)
// - Focus trapping within the palette
// - Authentic Washi / Sumi-e styling with Japanese character tags
import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Search,
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
  Cpu,
  Briefcase,
  Volume2,
  Bot,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLearning, ActiveSection } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

interface CommandItem {
  id: ActiveSection;
  titleEn: string;
  titleJp: string;
  category: string;
  icon: React.ElementType;
  keywords: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: 'dashboard', titleEn: 'Home Dashboard', titleJp: 'ダッシュボード', category: 'Navigation', icon: LayoutDashboard, keywords: 'home stats streak level' },
  { id: 'planner', titleEn: 'Daily Study Routine', titleJp: '学習計画', category: 'Navigation', icon: CalendarDays, keywords: 'planner schedule daily goals' },
  { id: 'kana', titleEn: 'Kana Academy', titleJp: 'かな道場', category: 'Learning Studios', icon: Sparkles, keywords: 'hiragana katakana alphabet vowels mnemonics' },
  { id: 'vocab', titleEn: 'Vocabulary Academy', titleJp: '単語帳', category: 'Learning Studios', icon: BookOpen, keywords: 'words flashcards n5 core audio' },
  { id: 'kanji', titleEn: 'Kanji Dojo', titleJp: '漢字道場', category: 'Learning Studios', icon: Shapes, keywords: 'kanji strokes radicals onyomi kunyomi' },
  { id: 'grammar', titleEn: 'Grammar Lab', titleJp: '文法研究所', category: 'Learning Studios', icon: Binary, keywords: 'particles sentences rules conjugations' },
  { id: 'sentence', titleEn: 'Sentence Forge', titleJp: '文鍛冶', category: 'Practice Studios', icon: Layers, keywords: 'syntax builder sov order structure' },
  { id: 'speaking', titleEn: 'Speaking Studio', titleJp: '発音スタジオ', category: 'Practice Studios', icon: Mic, keywords: 'voice mic shadowing pitch accent speech recognition' },
  { id: 'listening', titleEn: 'Listening Lab', titleJp: '聴解ラボ', category: 'Practice Studios', icon: Headphones, keywords: 'audio listening comprehension fast natural' },
  { id: 'dictation', titleEn: 'Dictation Studio (Audio Spelling)', titleJp: '聴解 & 綴り道場', category: 'Practice Studios', icon: Volume2, keywords: 'dictation audio spelling hearing kana paper screen moras' },
  { id: 'electronics', titleEn: 'Electronics & Semiconductor Lab', titleJp: '電子・半導体工学道場', category: 'Learning Studios', icon: Cpu, keywords: 'electronics semiconductor wafer cleanroom ohm circuit transistor diode logic gate' },
  { id: 'interview', titleEn: 'Interview Arena', titleJp: '面接道場', category: 'Learning Studios', icon: Briefcase, keywords: 'interview mock technical screening behavioral hr jikoshoukai keigo questions' },
  { id: 'reading', titleEn: 'Reading Theatre', titleJp: '読解劇場', category: 'Practice Studios', icon: Scroll, keywords: 'stories passages dialogues reading' },
  { id: 'handwriting', titleEn: 'Handwriting & OCR Studio', titleJp: '手書き解析', category: 'Practice Studios', icon: PenTool, keywords: 'canvas draw stroke recognition tesseract' },
  { id: 'rpg_games', titleEn: 'Arcade Hub & 10 RPG Games', titleJp: 'RPG道場', category: 'Arcade & RPG', icon: Gamepad2, keywords: 'minigames shinkansen kanji match boss battle' },
  { id: 'reviews', titleEn: 'Spaced Reviews (FSRS Engine)', titleJp: 'FSRS 復習', category: 'Memory & Review', icon: Repeat, keywords: 'spaced repetition fsrs memory decay cards due' },
  { id: 'analytics', titleEn: 'Weakness Notebook & Analytics', titleJp: '弱点分析', category: 'Memory & Review', icon: BarChart3, keywords: 'mistakes remediate errors charts' },
  { id: 'jlpt', titleEn: 'JLPT Prep Arena (N5)', titleJp: 'JLPT模擬', category: 'Assessment', icon: Award, keywords: 'test exam readiness diagnostic mock score' },
  { id: 'tutor', titleEn: 'KAI AI Sensei Tutor', titleJp: 'AI先生', category: 'AI Assistant', icon: Bot, keywords: 'chat tutor ask explain questions bot' },
  { id: 'landing', titleEn: 'Welcome Guide & Introduction', titleJp: 'はじめに', category: 'Navigation', icon: Compass, keywords: 'guide welcome intro landing matsuri' }
];

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { setActiveSection } = useLearning();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Filter items
  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_ITEMS;
    return COMMAND_ITEMS.filter(
      (item) =>
        item.titleEn.toLowerCase().includes(q) ||
        item.titleJp.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          soundEffects.playClick();
          setActiveSection(filteredItems[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Tab') {
        // Trap focus inside modal
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, setActiveSection, onClose]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-2xl overflow-hidden text-[#14110F] dark:text-[#FAF5ED] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#DDD2B8] dark:border-[#2E4370]/60 bg-white/60 dark:bg-[#0E1626]/60">
          <Search size={18} className="text-[#6B6358] dark:text-[#C59B27] flex-shrink-0" />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a studio name or keyword (e.g. 'kana', 'speaking', 'review')..."
            className="flex-1 bg-transparent text-sm font-medium placeholder:text-[#6B6358]/60 dark:placeholder:text-[#94A3B8]/60 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-[#1C2945] text-3xs font-mono font-semibold text-[#6B6358] dark:text-stone-300 border border-[#DDD2B8] dark:border-[#2E4370]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2 space-y-1 select-none"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B6358] dark:text-stone-400">
              No learning modules found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveSection(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-kai-vermilion text-white font-medium shadow-sm'
                      : 'hover:bg-[#E8DEC8]/50 dark:hover:bg-[#1C2945] text-[#14110F] dark:text-[#FAF5ED]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-white/80 dark:bg-[#0A101C] text-kai-vermilion border border-[#DDD2B8] dark:border-[#2E4370]'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {item.titleEn}
                      </div>
                      <div
                        className={`text-3xs font-japanese truncate ${
                          isSelected ? 'text-white/85' : 'text-[#6B6358] dark:text-[#94A3B8]'
                        }`}
                      >
                        {item.titleJp} &bull; {item.category}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    className={`flex-shrink-0 transition-transform ${
                      isSelected ? 'translate-x-0.5 text-white' : 'opacity-20'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-5 py-2.5 border-t border-[#DDD2B8] dark:border-[#2E4370]/60 bg-[#E8DEC8]/30 dark:bg-[#0E1626]/40 flex items-center justify-between text-3xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&bull;</span>
            <span>&crarr; Jump</span>
          </div>
          <span>KAI Quick Navigation</span>
        </div>
      </div>
    </div>
  );
};
