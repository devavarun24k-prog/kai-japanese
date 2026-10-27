import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Compass,
  BookOpen,
  Mic,
  Gamepad2,
  Sparkles,
  Layers,
  ChevronRight,
  BrainCircuit,
  Volume2
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface AppShowcaseSectionProps {
  onEnterApp?: () => void;
}

export const AppShowcaseSection: React.FC<AppShowcaseSectionProps> = ({ onEnterApp }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'kana' | 'kanji' | 'sentence' | 'sensei' | 'rpg'>('kanji');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const rotateX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [12, 0, -8]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.92, 1, 0.95]);

  const tabs = [
    { id: 'kanji', label: '漢字道場 Kanji Dojo', kanji: '漢', icon: BookOpen },
    { id: 'kana', label: '仮名アカデミー Kana', kanji: '仮', icon: Sparkles },
    { id: 'sentence', label: '文法工房 Sentence Forge', kanji: '文', icon: Layers },
    { id: 'sensei', label: 'AI指導員 AI Sensei', kanji: '先', icon: Mic },
    { id: 'rpg', label: '冒険館 RPG Arcade', kanji: '遊', icon: Gamepad2 }
  ] as const;

  return (
    <section
      ref={containerRef}
      id="showcase"
      className="relative min-h-[120vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-32 pointer-events-auto"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-14">
          <div className="w-10 h-10 rounded-full border border-kai-gold/30 flex items-center justify-center bg-stone-900/60 backdrop-blur-md shadow-[0_0_15px_rgba(244,194,107,0.15)]">
            <span className="font-shippori text-kai-gold text-sm font-bold">肆</span>
          </div>
          <span className="font-mono text-2xs uppercase tracking-[0.3em] text-kai-gold/80">
            Chapter IV • The Sanctuary Architecture (構造)
          </span>
          <h2 className="font-shippori text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight">
            Crafted for <span className="text-kai-gold">Unbroken Flow</span>
          </h2>
          <p className="font-serif_jp text-sm sm:text-base text-stone-400 max-w-xl">
            A unified Japanese learning operating system. No disjointed apps, no ads, no context-switching friction.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-serif_jp transition-all duration-300 ${
                  isActive
                    ? 'bg-kai-vermilion/20 border-kai-vermilion text-white shadow-[0_0_20px_rgba(230,57,70,0.3)] border'
                    : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <span className="font-shippori text-kai-gold font-bold">{tab.kanji}</span>
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Perspective Glass Mockup */}
        <div className="perspective-[1200px] w-full">
          <motion.div
            style={{ rotateX, scale }}
            className="w-full rounded-2xl sm:rounded-3xl bg-stone-950/80 border border-stone-800/80 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(244,194,107,0.1)] p-4 sm:p-8 relative overflow-hidden"
          >
            {/* Top window bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-kai-vermilion/80" />
                <div className="w-3 h-3 rounded-full bg-kai-gold/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-2xs text-stone-400 hidden sm:inline-block">
                  kai://sanctuary/{activeTab}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
                <span className="flex items-center gap-1.5 text-kai-gold">
                  <BrainCircuit size={13} />
                  FSRS-v5 Engine Active
                </span>
                <span className="font-shippori text-stone-400">界・学習環境</span>
              </div>
            </div>

            {/* Dynamic preview content based on activeTab */}
            <div className="min-h-[340px] sm:min-h-[420px] flex items-center justify-center">
              {activeTab === 'kanji' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-center">
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-8 bg-stone-900/50 rounded-2xl border border-stone-800">
                    <div className="relative group">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-stone-950 border border-kai-gold/30 flex items-center justify-center shadow-inner relative overflow-hidden">
                        {/* Grid lines inside kanji tile */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20 border border-dashed border-stone-600" />
                        <span className="font-shippori text-7xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#F5EFE6] to-stone-400">
                          改
                        </span>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-kai-vermilion text-white text-2xs font-mono rounded-full uppercase tracking-wider">
                        JLPT N3 • 7 Strokes
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-xs font-serif_jp text-stone-300">
                      <div>
                        <span className="text-stone-400 block text-2xs font-mono">ONYOMI</span>
                        <span className="text-kai-gold font-bold">カイ (kai)</span>
                      </div>
                      <div className="w-px h-6 bg-stone-800" />
                      <div>
                        <span className="text-stone-400 block text-2xs font-mono">KUNYOMI</span>
                        <span className="text-stone-200">あらた-める</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800">
                      <span className="text-2xs font-mono uppercase text-kai-gold tracking-widest block mb-1">
                        Radical Etymology Breakdown
                      </span>
                      <p className="font-serif_jp text-sm text-stone-300">
                        Composed of <strong className="text-white">己</strong> (oneself / snake) and <strong className="text-white">攵</strong> (action / folding whip). Striking oneself to renew or reform.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800">
                      <span className="text-2xs font-mono uppercase text-kai-vermilion tracking-widest block mb-1">
                        Contextual High-Frequency Compounds
                      </span>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs font-serif_jp">
                          <span className="text-white font-medium">改善 (かいぜん) • Kaizen</span>
                          <span className="text-stone-400">Continuous refinement</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-serif_jp">
                          <span className="text-white font-medium">改革 (かいかく) • Kaikaku</span>
                          <span className="text-stone-400">Fundamental transformation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'kana' && (
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 w-full max-w-3xl">
                  {['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'].map((kana, i) => (
                    <motion.div
                      key={kana}
                      whileHover={{ scale: 1.08, borderColor: '#F4C26B' }}
                      className="aspect-square rounded-xl bg-stone-900/60 border border-stone-800 flex flex-col items-center justify-center p-2 cursor-pointer transition-colors"
                      onClick={() => soundEffects.playClick()}
                    >
                      <span className="font-shippori text-xl sm:text-2xl text-[#F5EFE6]">{kana}</span>
                      <span className="text-3xs font-mono text-stone-400 mt-1">{i % 5 === 0 ? 'a' : i % 5 === 1 ? 'i' : i % 5 === 2 ? 'u' : i % 5 === 3 ? 'e' : 'o'}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'sentence' && (
                <div className="w-full max-w-2xl space-y-4">
                  <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800">
                    <span className="text-2xs font-mono uppercase text-kai-gold tracking-widest block mb-2">
                      Interactive Sentence Construction
                    </span>
                    <div className="flex flex-wrap gap-2 py-4">
                      {['私', 'は', '毎朝', '神社', 'へ', '散歩に', '行きます'].map((token, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-stone-950 border border-kai-gold/30 text-white font-serif_jp text-sm sm:text-base hover:border-kai-vermilion cursor-pointer"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-stone-400 font-serif_jp italic">
                      "I go for a walk to the shrine every morning."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'sensei' && (
                <div className="w-full max-w-xl space-y-3">
                  <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-left">
                    <span className="text-2xs font-mono text-kai-gold block mb-1">AI SENSEI • 先生</span>
                    <p className="font-serif_jp text-sm text-[#F5EFE6]">
                      「こんにちは！今日の調子はいかがですか？京都について話しましょうか。」
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-kai-vermilion/10 border border-kai-vermilion/40 text-right ml-12">
                    <span className="text-2xs font-mono text-kai-vermilion block mb-1">YOU • 学習者</span>
                    <p className="font-serif_jp text-sm text-[#F5EFE6]">
                      「はい、秋の紅葉を見に行きたいです。」
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-stone-400">Pitch Accent: 98% Native Match</span>
                  </div>
                </div>
              )}

              {activeTab === 'rpg' && (
                <div className="text-center p-6 space-y-4">
                  <div className="inline-block p-4 rounded-2xl bg-stone-900/80 border border-kai-gold/40 shadow-[0_0_30px_rgba(244,194,107,0.15)]">
                    <Gamepad2 className="w-12 h-12 text-kai-gold mx-auto mb-2" />
                    <span className="font-shippori text-xl text-white block">漢字クエスト Kanji Quest</span>
                    <span className="text-2xs font-mono text-stone-400">16-BIT RETRO DUNGEON CRAWLER</span>
                  </div>
                  <p className="font-serif_jp text-sm text-stone-300 max-w-md mx-auto">
                    Battle mythical Yokai by typing radical components and vocabulary on the beat. Gain EXP and unlock mastery scrolls.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom action bar */}
            <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-stone-400">
                100% Client-side privacy or synced to Supabase
              </span>
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-kai-vermilion hover:bg-kai-vermilion-dark text-white text-xs font-mono tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(230,57,70,0.4)]"
              >
                <span>Launch Sanctuary Sandbox</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
