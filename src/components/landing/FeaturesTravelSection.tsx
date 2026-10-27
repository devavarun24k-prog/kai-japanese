// src/components/landing/FeaturesTravelSection.tsx
// Seven Gate Travel with floating 3D glassmorphic cards and live interactive mini-demos
import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Layers,
  Award,
  TrendingUp,
  Bot,
  PenTool,
  ArrowRight,
  Volume2,
  Check,
  RotateCw
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { audioService } from '../../services/audioService';
import { ActiveSection } from '../../context/LearningContext';

interface FeaturesTravelSectionProps {
  onEnterApp: (section?: ActiveSection) => void;
}

// 3D Glass Tilt Card Wrapper
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  gateNumber: string;
  gateKanji: string;
}> = ({ children, className = '', gateNumber, gateKanji }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -9;
    const rotY = ((x - centerX) / centerX) * 9;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className={`relative rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-[#0E1424]/75 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_25px_60px_rgba(230,57,70,0.25)] hover:border-[#E63946]/40 ${className}`}
    >
      {/* Gate Label Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono tracking-widest text-[#E63946] uppercase font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-pulse" />
          <span>{gateNumber} • {gateKanji}</span>
        </span>
        <div className="w-6 h-6 rounded-md border border-[#F4C26B]/30 flex items-center justify-center text-[11px] font-serif_jp text-[#F4C26B]">
          門
        </div>
      </div>

      {children}
    </div>
  );
};

export const FeaturesTravelSection: React.FC<FeaturesTravelSectionProps> = ({ onEnterApp }) => {
  // Live Demo 1: Stroke Order Step
  const [strokeStep, setStrokeStep] = useState(3);
  // Live Demo 2: Kanji 3D Flip
  const [kanjiFlipped, setKanjiFlipped] = useState(false);
  // Live Demo 3: FSRS Retention
  const [retentionLevel, setRetentionLevel] = useState(94);
  // Live Demo 4: Active JLPT Level
  const [activeJlpt, setActiveJlpt] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  // Live Demo 6: AI Chat Speech
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const playDemoAudio = (text: string) => {
    soundEffects.playClick();
    setIsAiSpeaking(true);
    audioService.speak(text, { rate: 0.95 });
    setTimeout(() => setIsAiSpeaking(false), 1600);
  };

  return (
    <section id="features-scene" className="relative py-24 sm:py-36 px-4 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16 sm:mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63946]/10 border border-[#E63946]/30 text-[#E63946] text-xs font-mono font-bold tracking-widest uppercase">
          <span>奥義 • THE SEVEN GATES OF MASTERY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-serif_jp text-[#F5EFE6] tracking-tight">
          One journey. Seven distinct arts.
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto font-sans">
          Pass through each torii gate to unlock deep, lasting Japanese fluency without rote memorization.
        </p>
      </div>

      {/* Grid of 7 Floating 3D Tilt Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* GATE 1: KANA MASTERY */}
        <TiltCard gateNumber="GATE I" gateKanji="仮名">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
              Hiragana &amp; Katakana Mastery
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Learn the 46 foundational sounds with animated stroke-order paths, tactile canvas brush feedback, and authentic native pitch playback.
            </p>

            {/* Live Mini-Demo: Animated Stroke Order */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl bg-[#E63946]/15 border border-[#E63946]/40 flex items-center justify-center">
                  <span className="font-japanese font-bold text-3xl text-[#F5EFE6]">あ</span>
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono text-[#F4C26B]">
                    #{strokeStep}/3
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F5EFE6]">Character: &quot;a&quot; (あ)</span>
                  <span className="block text-2xs font-mono text-white/50">3 curved strokes</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setStrokeStep((prev) => (prev % 3) + 1);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#E63946] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCw size={13} />
                <span>Next Stroke</span>
              </button>
            </div>

            <button
              onClick={() => onEnterApp('kana')}
              className="w-full py-2.5 rounded-xl bg-[#E63946] hover:bg-[#D93441] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_rgba(230,57,70,0.3)]"
            >
              <span>Enter Kana Academy</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </TiltCard>

        {/* GATE 2: KANJI MNEMONICS */}
        <TiltCard gateNumber="GATE II" gateKanji="漢字">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
              Kanji with Radical Mnemonics
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Demystify 2,136 Joyo characters by breaking them down into natural story radicals: Sun (日) + Moon (月) fuses into Bright (明).
            </p>

            {/* Live Mini-Demo: 3D Flip Card */}
            <div
              onClick={() => {
                soundEffects.playCardFlip();
                setKanjiFlipped((prev) => !prev);
              }}
              className="cursor-pointer p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between transition-colors hover:border-[#F4C26B]/50 select-none"
            >
              {!kanjiFlipped ? (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#F4C26B]/15 border border-[#F4C26B]/40 flex items-center justify-center">
                    <span className="font-serif_jp font-bold text-3xl text-[#F4C26B]">明</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Kanji: 明 (Bright)</span>
                    <span className="block text-2xs font-mono text-[#F4C26B]">Tap to reveal story mnemonic</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-xl bg-[#E63946]/20 border border-[#E63946] flex flex-col items-center justify-center text-center">
                    <span className="text-2xs font-mono text-white/70">日 + 月</span>
                    <span className="text-[10px] font-bold text-[#F4C26B]">Sun + Moon</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F5EFE6]">&quot;When the Sun &amp; Moon unite, all is Bright.&quot;</span>
                    <span className="block text-2xs font-mono text-white/50">On: メイ (mei) • Kun: あか (aka)</span>
                  </div>
                </div>
              )}
              <span className="text-3xs font-mono text-white/40">Flip ↻</span>
            </div>

            <button
              onClick={() => onEnterApp('kanji')}
              className="w-full py-2.5 rounded-xl bg-[#F4C26B] hover:bg-[#E5B55E] text-[#07070C] font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              <span>Explore Kanji Dojo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </TiltCard>

        {/* GATE 3: VOCABULARY & FSRS */}
        <TiltCard gateNumber="GATE III" gateKanji="語彙">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
              Vocabulary &amp; Spaced Repetition
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Powered by the state-of-the-art Free Spaced Repetition Scheduler (FSRS). Reviews are calculated to hit your memory right before forgetting occurs.
            </p>

            {/* Live Mini-Demo: Retention Meter */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Target Retention Level</span>
                <span className="font-mono font-bold text-[#F4C26B]">{retentionLevel}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E63946] via-[#F4C26B] to-[#2D7A4D] transition-all duration-300"
                  style={{ width: `${retentionLevel}%` }}
                />
              </div>
              <div className="flex justify-between text-3xs font-mono text-white/50 pt-1">
                <button onClick={() => setRetentionLevel(85)} className="hover:text-white">85% (Casual)</button>
                <button onClick={() => setRetentionLevel(94)} className="hover:text-white font-bold text-[#F4C26B]">94% (Optimal)</button>
                <button onClick={() => setRetentionLevel(98)} className="hover:text-white">98% (Mastery)</button>
              </div>
            </div>

            <button
              onClick={() => onEnterApp('vocab')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/20 transition-all hover:scale-[1.02]"
            >
              <span>Open Vocabulary Bank</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </TiltCard>

        {/* GATE 4: JLPT ROADMAP */}
        <TiltCard gateNumber="GATE IV" gateKanji="試練">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
              JLPT N5 &rarr; N1 Illuminated Path
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Progressive mastery milestones with full diagnostic mock exams, official section scoring, and personalized weakness recommendations.
            </p>

            {/* Live Mini-Demo: Interactive JLPT Level Stepper */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-1">
              {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => {
                const isSelected = activeJlpt === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      soundEffects.playClick();
                      setActiveJlpt(lvl);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                      isSelected
                        ? 'bg-[#E63946] text-white shadow-[0_0_12px_rgba(230,57,70,0.6)] scale-105'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onEnterApp('jlpt')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/20 transition-all hover:scale-[1.02]"
            >
              <span>View {activeJlpt} Syllabus &amp; Mocks</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </TiltCard>

        {/* GATE 5: PROGRESS, XP & STREAKS */}
        <TiltCard gateNumber="GATE V" gateKanji="修練">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
              Living Streaks, XP &amp; Analytics
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Gain daily mastery points, maintain study streaks, and inspect automatic confusion matrices that catch your specific mistakes before tests.
            </p>

            {/* Live Mini-Demo: Dynamic Stats Strip */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-mono text-white/50 block">STREAK</span>
                <span className="text-lg font-bold font-mono text-[#F4C26B]">🔥 14d</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-mono text-white/50 block">XP</span>
                <span className="text-lg font-bold font-mono text-[#E63946]">2,480</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-mono text-white/50 block">ACCURACY</span>
                <span className="text-lg font-bold font-mono text-[#2D7A4D]">96.2%</span>
              </div>
            </div>

            <button
              onClick={() => onEnterApp('analytics')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/20 transition-all hover:scale-[1.02]"
            >
              <span>Inspect Weakness Analytics</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </TiltCard>

        {/* GATE 6: AI SENSEI & VOICE SPEECH */}
        <TiltCard gateNumber="GATE VI" gateKanji="対話">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
              AI Sensei &amp; Pitch Conversation
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Speak and converse freely with a native-tuned conversational AI tutor. Ask grammar nuances in English or practice roleplays in Tokyo.
            </p>

            {/* Live Mini-Demo: Interactive Audio Dialog */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAiSpeaking ? 'bg-[#E63946] animate-pulse text-white' : 'bg-white/10 text-white/80'}`}>
                  <Bot size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">「今日は何を勉強しますか？」</span>
                  <span className="text-3xs font-mono text-white/50">What will you study today?</span>
                </div>
              </div>

              <button
                onClick={() => playDemoAudio('今日は何を勉強しますか？')}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#E63946] text-white transition-colors"
                title="Play Audio"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <button
              onClick={() => onEnterApp('tutor')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/20 transition-all hover:scale-[1.02]"
            >
              <span>Chat with AI Sensei</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </TiltCard>

        {/* GATE 7: DICTATION & 10 ARCADE GAMES (SPAN FULL WIDTH) */}
        <div className="md:col-span-2">
          <TiltCard gateNumber="GATE VII" gateKanji="遊戯">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h3 className="text-xl sm:text-2xl font-bold font-serif_jp text-[#F5EFE6]">
                  Dictation Studio &amp; 10 Playable Arcade Games
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                  Fast-paced retrieval games (Kana Reflex, Shinkansen Sentence Builder, Kanji Forge, Dungeon Crawl) plus paper &amp; screen audio dictation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => onEnterApp('dictation')}
                  className="flex-1 lg:flex-initial px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <PenTool size={15} />
                  <span>Dictation Studio</span>
                </button>

                <button
                  onClick={() => onEnterApp('rpg_games')}
                  className="flex-1 lg:flex-initial px-6 py-3 rounded-2xl bg-[#E63946] hover:bg-[#D93441] text-white font-bold text-xs shadow-vermilion transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>Enter 10 RPG Arcade Games</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};
