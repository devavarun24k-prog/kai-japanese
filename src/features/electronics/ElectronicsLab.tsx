// src/features/electronics/ElectronicsLab.tsx
// Electronics & Semiconductor Engineering Suite root coordinator
import React, { useState } from 'react';
import {
  Cpu,
  BookOpen,
  Sliders,
  Layers,
  Activity,
  AlertTriangle,
  Repeat,
  Sparkles,
  Zap
} from 'lucide-react';
import { TechnicalVocabDeck } from './japanese/TechnicalVocabDeck';
import { EngineeringLessonRunner } from './lessons/EngineeringLessonRunner';
import { OhmLawSimulator } from './simulations/OhmLawSimulator';
import { RCChargingSimulator } from './simulations/RCChargingSimulator';
import { LogicGatePlayground } from './simulations/LogicGatePlayground';
import { WaferProcessDiagram } from './simulations/WaferProcessDiagram';

export type ElectronicsTab = 'japanese' | 'fundamentals' | 'simulations';
export type SimulationSubTab = 'ohm' | 'rc' | 'logic' | 'wafer';

export const ElectronicsLab: React.FC = () => {
  const isKanaDone = React.useMemo(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('kai_start_here_completed_stages') : null;
      const stages: string[] = saved ? JSON.parse(saved) : [];
      return stages.includes('stage_3_katakana') || stages.includes('stage_2_hiragana_rows');
    } catch {
      return false;
    }
  }, []);

  const [activeTab, setActiveTab] = useState<ElectronicsTab>(() => (isKanaDone ? 'japanese' : 'fundamentals'));
  const [simSubTab, setSimSubTab] = useState<SimulationSubTab>('ohm');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] border border-[#84231D]/20 flex items-center justify-center font-serif_jp font-bold text-lg">
                電
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#84231D] dark:text-[#FF8A80]">
                Engineering Suite · Technical Japanese & Hardware
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD] tracking-tight">
              電子・半導体工学道場 (Electronics & Semiconductor Lab)
            </h1>
            <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] max-w-2xl">
              Master technical Japanese terminology for semiconductor fabs, circuit fundamentals, and device physics alongside interactive SVG engineering simulations.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C59B27]/15 text-[#C59B27] border border-[#C59B27]/30">
              80 Terms · 6 Modules · 4 Simulators
            </span>
            <span className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              Spaced Repetition & Pure SVG
            </span>
          </div>
        </div>

        {/* Global Honesty Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p>
            <strong>Academic Integrity Disclosure:</strong> Technical vocabulary, Telugu transliterations, and lesson quizzes are in draft status (<code>reviewed: false</code>, <code>teluguVerified: false</code>). No fake or unverified data is presented as real.
          </p>
        </div>

        {/* Primary Tabs Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48] overflow-x-auto">
          <button
            onClick={() => setActiveTab('japanese')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              activeTab === 'japanese'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <Repeat className="w-4 h-4" />
            1. Technical Japanese (80 Terms)
          </button>

          <button
            onClick={() => setActiveTab('fundamentals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              activeTab === 'fundamentals'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            2. Engineering Curriculum (6 Lessons)
          </button>

          <button
            onClick={() => setActiveTab('simulations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
              activeTab === 'simulations'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <Activity className="w-4 h-4" />
            3. Interactive Simulations (4 Labs)
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: TECHNICAL JAPANESE */}
      {activeTab === 'japanese' && (
        <div className="space-y-4">
          {!isKanaDone ? (
            <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border-2 border-dashed border-[#DDD2B8] dark:border-[#253659] text-center space-y-4 max-w-xl mx-auto shadow-washi">
              <div className="w-14 h-14 rounded-2xl bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] border border-[#84231D]/20 flex items-center justify-center mx-auto text-2xl font-serif_jp font-bold">
                鍵
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                  Technical Japanese Deck Locked
                </h3>
                <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
                  Complete the fundamental Kana stages (Stage 2: Hiragana or Stage 3: Katakana) in <strong>Start Here</strong> to unlock the 80 technical vocabulary flashcards.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                ⚡ <strong>Engineering Fundamentals</strong> and <strong>Simulations</strong> are fully unlocked and available right now!
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('fundamentals')}
                  className="px-4 py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] transition-all"
                >
                  Explore Fundamentals Lessons
                </button>
                <button
                  onClick={() => setActiveTab('simulations')}
                  className="px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono hover:bg-stone-100 dark:hover:bg-[#1A253D] transition-all"
                >
                  Try Circuit Simulators
                </button>
              </div>
            </div>
          ) : (
            <TechnicalVocabDeck />
          )}
        </div>
      )}

      {/* TAB 2: ENGINEERING FUNDAMENTALS */}
      {activeTab === 'fundamentals' && (
        <div className="space-y-4">
          <EngineeringLessonRunner />
        </div>
      )}

      {/* TAB 3: SIMULATIONS */}
      {activeTab === 'simulations' && (
        <div className="space-y-6">
          {/* Sub-tab Pills */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/90 dark:bg-[#0E1526]/90 border border-[#DDD2B8] dark:border-[#253659]">
            <button
              onClick={() => setSimSubTab('ohm')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                simSubTab === 'ohm'
                  ? 'bg-[#84231D] text-white shadow-sm'
                  : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Ohm's Law (V, I, R)
            </button>

            <button
              onClick={() => setSimSubTab('rc')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                simSubTab === 'rc'
                  ? 'bg-[#84231D] text-white shadow-sm'
                  : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> RC Charging Curve
            </button>

            <button
              onClick={() => setSimSubTab('logic')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                simSubTab === 'logic'
                  ? 'bg-[#84231D] text-white shadow-sm'
                  : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Logic Gate Playground
            </button>

            <button
              onClick={() => setSimSubTab('wafer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                simSubTab === 'wafer'
                  ? 'bg-[#84231D] text-white shadow-sm'
                  : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Wafer Process Flow (8 Steps)
            </button>
          </div>

          {/* Render Active Simulation */}
          {simSubTab === 'ohm' && <OhmLawSimulator />}
          {simSubTab === 'rc' && <RCChargingSimulator />}
          {simSubTab === 'logic' && <LogicGatePlayground />}
          {simSubTab === 'wafer' && <WaferProcessDiagram />}
        </div>
      )}
    </div>
  );
};
