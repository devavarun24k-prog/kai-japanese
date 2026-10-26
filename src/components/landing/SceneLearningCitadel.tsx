// src/components/landing/SceneLearningCitadel.tsx
// Scene 4: Enter the Learning Platform (学舎の門 — KAI Learning Citadel)
// Dark ornamental Japanese aesthetic with rotating antique-gold medallions,
// cloud reveals, and direct portals to genuine KAI learning modules.
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Shapes,
  Binary,
  Layers,
  Gamepad2,
  Bot,
  Scroll,
  Award,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { OrnamentalCircle, KaiMonCrest, JapaneseCloud } from './OrnamentalElements';
import { soundEffects } from '../../services/soundEffects';
import { ActiveSection } from '../../context/LearningContext';

interface ModulePortal {
  id: ActiveSection;
  titleJp: string;
  titleEn: string;
  titleTe: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  badge: string;
}

const KAI_MODULE_PORTALS: ModulePortal[] = [
  {
    id: 'kana',
    titleJp: 'かな道場',
    titleEn: 'Kana Academy',
    titleTe: 'కానా అకాడమీ',
    description: 'Master 46 Hiragana and Katakana with stroke animations, audio, and Telugu guides.',
    icon: Sparkles,
    accentColor: '#D9483B',
    badge: '46 Syllables'
  },
  {
    id: 'vocab',
    titleJp: '単語帳',
    titleEn: 'Vocabulary Vault',
    titleTe: 'పద సంపద',
    description: 'Build your lexicon with 80+ essential JLPT N5/N4 words, audio, and example sentences.',
    icon: BookOpen,
    accentColor: '#C59B27',
    badge: 'FSRS Repetition'
  },
  {
    id: 'kanji',
    titleJp: '漢字道場',
    titleEn: 'Kanji Dojo',
    titleTe: 'కాంజీ డోజో',
    description: 'Understand Kanji characters through radical breakdown, stroke count, Onyomi & Kunyomi.',
    icon: Shapes,
    accentColor: '#1E2C4A',
    badge: 'Radicals & Strokes'
  },
  {
    id: 'grammar',
    titleJp: '文法研究所',
    titleEn: 'Grammar Lab',
    titleTe: 'వ్యాకరణ ల్యాబ్',
    description: 'Learn 12 foundational N5/N4 patterns (wa/desu, ga, o, ni, de, te-forms) step by step.',
    icon: Binary,
    accentColor: '#2D7A4D',
    badge: '12 Patterns'
  },
  {
    id: 'sentence',
    titleJp: '文鍛冶',
    titleEn: 'Sentence Forge',
    titleTe: 'వాక్యాల నిర్మాణం',
    description: 'Assemble genuine Japanese sentences tile-by-tile with intelligent syntax feedback.',
    icon: Layers,
    accentColor: '#B83226',
    badge: 'Interactive Tiles'
  },
  {
    id: 'rpg_games',
    titleJp: 'RPG道場',
    titleEn: 'KAI RPG & Games',
    titleTe: 'ఆటలు & RPG',
    description: 'Battle Youkai, solve Kana Puzzles, and earn XP across 10 interactive learning games.',
    icon: Gamepad2,
    accentColor: '#9333EA',
    badge: '10 Minigames'
  },
  {
    id: 'tutor',
    titleJp: 'AI先生',
    titleEn: 'KAI AI Tutor',
    titleTe: 'AI గురువు',
    description: 'Converse in natural Japanese with instant corrections and Telugu explanations.',
    icon: Bot,
    accentColor: '#0284C7',
    badge: 'Trilingual AI'
  },
  {
    id: 'reading',
    titleJp: '読解劇場',
    titleEn: 'Reading Theatre',
    titleTe: 'పఠన నాటకం',
    description: 'Immerse yourself in illustrated Japanese folk stories with synchronized audio.',
    icon: Scroll,
    accentColor: '#D97706',
    badge: 'Stories & Audio'
  },
  {
    id: 'jlpt',
    titleJp: 'JLPT模擬',
    titleEn: 'JLPT Prep Arena',
    titleTe: 'JLPT పరీక్షలు',
    description: 'Test your vocabulary, grammar, and listening under timed JLPT examination conditions.',
    icon: Award,
    accentColor: '#059669',
    badge: 'Mock Exams'
  }
];

interface SceneLearningCitadelProps {
  onSelectModule: (moduleId: ActiveSection) => void;
  isAuthenticated?: boolean;
}

export const SceneLearningCitadel: React.FC<SceneLearningCitadelProps> = ({
  onSelectModule,
  isAuthenticated = false
}) => {
  const handlePortalClick = (moduleId: ActiveSection) => {
    soundEffects.playLevelUp();
    onSelectModule(moduleId);
  };

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#0C121D] text-[#F0E5CE] overflow-hidden select-none">
      {/* Background Japanese Cloud & Celestial Radiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(185,154,96,0.1),transparent_70%)] blur-3xl" />
        <div className="absolute top-10 right-10 opacity-25">
          <JapaneseCloud className="w-80" fillColor="#070A10" strokeColor="#B99A60" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-25">
          <JapaneseCloud className="w-96" fillColor="#070A10" strokeColor="#B99A60" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-14">
        {/* Central Ornamental Crest & Scene Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Rotating Ornamental Medallion */}
          <div className="relative flex items-center justify-center">
            <OrnamentalCircle size={220} className="opacity-50 scale-90 sm:scale-100" />
            <div className="relative z-10">
              <KaiMonCrest size={64} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101722] border border-[#B99A60]/40 text-xs font-mono text-[#B99A60]">
            <Sparkles size={13} className="text-[#A84A3A]" />
            <span>第四景 • SCENE FOUR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-serif_jp text-[#F0E5CE] tracking-tight">
            学舎の門 — Enter the Learning Citadel
          </h2>

          <p className="text-sm sm:text-base text-[#F0E5CE]/80 font-sans leading-relaxed">
            All paths converge here. Select any realm below to enter directly into KAI's interactive learning environment.
          </p>
        </div>

        {/* 9-Module Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {KAI_MODULE_PORTALS.map((portal) => {
            const Icon = portal.icon;

            return (
              <motion.div
                key={portal.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePortalClick(portal.id)}
                className="group cursor-pointer p-6 rounded-3xl bg-[#101722]/90 hover:bg-[#141E2F] border border-[#B99A60]/35 hover:border-[#B99A60] shadow-xl transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden backdrop-blur-md"
              >
                {/* Subtle top gold sheen on hover */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B99A60] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#090E17] border border-[#B99A60]/30 flex items-center justify-center text-[#B99A60] group-hover:text-white group-hover:bg-[#A84A3A] transition-colors shadow-inner">
                      <Icon size={22} />
                    </div>

                    <span className="text-3xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#090E17] border border-[#B99A60]/30 text-[#B99A60]">
                      {portal.badge}
                    </span>
                  </div>

                  {/* Japanese & English Titles */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold font-serif_jp text-[#F0E5CE] group-hover:text-white transition-colors">
                        {portal.titleJp}
                      </h3>
                      <span className="text-xs font-mono text-[#B99A60]">
                        {portal.titleEn}
                      </span>
                    </div>
                    <span className="text-3xs font-telugu text-[#F0E5CE]/60">
                      {portal.titleTe}
                    </span>
                  </div>

                  {/* Module Summary */}
                  <p className="text-xs text-[#F0E5CE]/75 font-sans leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                {/* Enter Button Action */}
                <div className="pt-2 flex items-center justify-between border-t border-[#B99A60]/20 text-xs font-serif_jp text-[#B99A60] group-hover:text-[#F0E5CE] transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Compass size={13} className="group-hover:rotate-45 transition-transform" />
                    <span>道場に入る • Enter Dojo</span>
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform text-[#A84A3A]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Platform Guarantee Banner */}
        <div className="p-6 rounded-3xl bg-[#101722]/60 border border-[#B99A60]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#3C9B64] flex-shrink-0" />
            <div className="text-left space-y-0.5">
              <span className="font-bold text-[#F0E5CE] block">
                {isAuthenticated ? 'Authenticated & Synchronized' : 'Private Single-User Learning Platform'}
              </span>
              <span className="text-3xs text-[#F0E5CE]/70 block">
                All learning progress, XP, streak days, mistake logs, and FSRS memory cards are stored securely.
              </span>
            </div>
          </div>

          <button
            onClick={() => handlePortalClick('dashboard')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A84A3A] to-[#8C3A2D] hover:from-[#B84E3E] text-white font-serif_jp font-semibold text-xs tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <span>ダッシュボードを開く • Open Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
