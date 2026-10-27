// src/features/interview/InterviewArena.tsx
// Technical & Japanese Engineering Interview Arena root coordinator
import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  BookOpen,
  Languages,
  AlertTriangle,
  Award,
  Sparkles,
  Target
} from 'lucide-react';
import { PracticeMode } from './components/PracticeMode';
import { TimedMockInterview } from './components/TimedMockInterview';
import { JapaneseWorkplaceMode } from './components/JapaneseWorkplaceMode';
import { InterviewCategory } from './types';
import { getWeakCategories } from './storage';

export type InterviewTab = 'practice' | 'mock' | 'japanese_workplace';

export const InterviewArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InterviewTab>('practice');
  const [targetedCategory, setTargetedCategory] = useState<InterviewCategory | null>(null);

  const weakCategories = getWeakCategories();

  const handlePracticeWeakAreas = (weakList: InterviewCategory[]) => {
    if (weakList.length > 0) {
      setTargetedCategory(weakList[0]);
    }
    setActiveTab('practice');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] border border-[#84231D]/20 flex items-center justify-center font-serif_jp font-bold text-lg">
                面
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#84231D] dark:text-[#FF8A80]">
                Career Suite · Technical & Japanese Workplace Interview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD] tracking-tight">
              面接道場 (Technical & Japanese Interview Arena)
            </h1>
            <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] max-w-2xl">
              Sharpen your hardware engineering answers, practice timed screenings across 8 technical domains, and master real Japanese workplace self-introductions and keigo.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C59B27]/15 text-[#C59B27] border border-[#C59B27]/30">
              60 Starter Questions · 3 Modes
            </span>
            <span className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              Deterministic Rubrics & Web Speech API
            </span>
          </div>
        </div>

        {/* Global Honesty Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p>
            <strong>Academic Integrity Disclosure:</strong> Questions, explanations, and model answers are in draft status (<code>reviewed: false</code>, <code>teluguVerified: false</code>). Descriptive responses are scored with deterministic keyword rubrics, not fabricated AI.
          </p>
        </div>

        {/* Weak Categories Quick Alert */}
        {weakCategories.length > 0 && activeTab !== 'practice' && (
          <div className="p-3 rounded-xl bg-[#84231D]/10 border border-[#84231D]/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#84231D] dark:text-[#FF8A80]">
              <Target className="w-4 h-4" />
              <span>
                <strong>Weak Categories Detected:</strong> {weakCategories.map((c) => c.replace('_', ' ')).join(', ')}
              </span>
            </div>
            <button
              onClick={() => handlePracticeWeakAreas(weakCategories)}
              className="px-3 py-1 rounded-lg bg-[#84231D] text-white text-[11px] font-mono font-semibold"
            >
              Practice Weak Areas
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48] overflow-x-auto">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              activeTab === 'practice'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            1. Technical Practice (Rubric Scored)
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              activeTab === 'mock'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <Clock className="w-4 h-4" />
            2. Timed Mock Interview (Diagnostic)
          </button>

          <button
            onClick={() => setActiveTab('japanese_workplace')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              activeTab === 'japanese_workplace'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <Languages className="w-4 h-4" />
            3. Japanese Workplace Prep (Cards & Speech)
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'practice' && <PracticeMode />}
      {activeTab === 'mock' && <TimedMockInterview onPracticeWeakAreas={handlePracticeWeakAreas} />}
      {activeTab === 'japanese_workplace' && <JapaneseWorkplaceMode />}
    </div>
  );
};
