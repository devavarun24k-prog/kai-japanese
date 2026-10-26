// src/components/landing/CinematicLandingPage.tsx
// Redesigned Japanese Editorial Landing Experience for KAI
// Beginner-first design, interactive KAI mentor companion, live mini-lesson preview, and progressive curriculum revelation
import React, { useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  ArrowDown,
  Sparkles,
  BookOpen,
  Mic,
  PenTool,
  Gamepad2,
  Repeat,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Scroll,
  Layers,
  Award
} from 'lucide-react';
import { MascotKai } from '../common/MascotKai';
import { MiniLessonPreview } from './MiniLessonPreview';
import { KaiMonCrest } from './OrnamentalElements';
import { SakuraCanvas } from './SakuraCanvas';
import { soundEffects } from '../../services/soundEffects';
import { ActiveSection } from '../../context/LearningContext';

interface CinematicLandingPageProps {
  onEnterApp: (targetSection?: ActiveSection) => void;
  onOpenAuth?: () => void;
  isAuthenticated?: boolean;
}

export const CinematicLandingPage: React.FC<CinematicLandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  isAuthenticated = false
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getIsMuted());

  // Section Refs for smooth navigation
  const miniLessonRef = useRef<HTMLDivElement | null>(null);
  const curriculumRef = useRef<HTMLDivElement | null>(null);
  const gamesRef = useRef<HTMLDivElement | null>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    soundEffects.playClick();
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playCorrect();
    }
  };

  const handleStartLearning = () => {
    soundEffects.playClick();
    if (isAuthenticated) {
      onEnterApp('dashboard');
    } else if (onOpenAuth) {
      onOpenAuth();
    } else {
      onEnterApp('dashboard');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAF7F2] dark:bg-[#0B1019] text-[#1A1817] dark:text-[#F0E5CE] font-sans overflow-x-hidden selection:bg-[#D9483B] selection:text-white transition-colors">
      {/* Floating Header */}
      <header className="fixed top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-none">
        {/* Brand Crest Pill */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto cursor-pointer px-4 py-2 rounded-full bg-white/90 dark:bg-[#151D28]/90 hover:bg-white dark:hover:bg-[#1A2433] border border-[#E5DEC9] dark:border-[#2D3A4F] backdrop-blur-md flex items-center gap-2.5 shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <KaiMonCrest size={24} />
          <div className="flex items-center gap-1.5">
            <span className="font-serif_jp font-bold text-sm tracking-wider text-[#1A1817] dark:text-[#F0E5CE]">
              KAI
            </span>
            <span className="text-3xs font-mono text-[#D9483B] uppercase hidden sm:inline">
              | Japanese Mastery
            </span>
          </div>
        </div>

        {/* Center Quick Nav (Desktop) */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#151D28]/90 border border-[#E5DEC9] dark:border-[#2D3A4F] backdrop-blur-md shadow-md text-xs font-medium text-[#554E45] dark:text-[#CBD5E1]">
          <button
            onClick={() => scrollToRef(miniLessonRef)}
            className="px-3 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-[#1F2B3B] hover:text-[#D9483B] transition-colors"
          >
            Try a Lesson
          </button>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <button
            onClick={() => scrollToRef(curriculumRef)}
            className="px-3 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-[#1F2B3B] hover:text-[#D9483B] transition-colors"
          >
            Curriculum
          </button>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <button
            onClick={() => scrollToRef(gamesRef)}
            className="px-3 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-[#1F2B3B] hover:text-[#D9483B] transition-colors"
          >
            Arcade & Games
          </button>
        </nav>

        {/* Right Controls: Sound & Primary Action */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-full bg-white/90 dark:bg-[#151D28]/90 hover:bg-white dark:hover:bg-[#1A2433] border border-[#E5DEC9] dark:border-[#2D3A4F] backdrop-blur-md text-[#554E45] dark:text-[#CBD5E1] hover:text-[#D9483B] transition-all shadow-md hover:scale-105 active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={handleStartLearning}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D9483B] to-[#B83226] hover:from-[#E05448] hover:to-[#C4382B] text-white text-xs font-semibold tracking-wide shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <Compass size={14} />
            <span>{isAuthenticated ? 'Open Dashboard' : 'Start Learning Free'}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION: BEGINNER-FOCUSED WARM EDITORIAL SANCTUARY
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 pt-24 pb-16 text-center overflow-hidden">
        {/* Dynamic Subtle Sakura Petal Animation */}
        <SakuraCanvas petalCount={28} interactive={true} />

        {/* Ambient Radial Washi Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(217,72,59,0.06),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Beginner Welcome Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#151D28] border border-[#E5DEC9] dark:border-[#2D3A4F] text-xs font-mono font-medium text-[#7A7165] dark:text-[#CBD5E1] shadow-sm animate-in fade-in duration-300">
            <Sparkles size={13} className="text-[#D9483B]" />
            <span>Designed for absolute beginners learning from zero</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif_jp font-bold tracking-tight text-[#1A1817] dark:text-[#F0E5CE] leading-tight">
            Master Japanese from zero —{' '}
            <span className="text-[#D9483B] block sm:inline">naturally & playfully.</span>
          </h1>

          {/* Subtitle in Plain English */}
          <p className="text-base sm:text-lg text-[#554E45] dark:text-[#CBD5E1] max-w-2xl mx-auto font-sans leading-relaxed">
            No endless walls of unexplained Japanese characters. Learn <strong>Hiragana</strong>,{' '}
            <strong>Katakana</strong>, <strong>Kanji</strong>, and real speaking patterns through warm
            illustrated lessons, interactive arcade games, and intelligent spaced repetition.
          </p>

          {/* Telugu Mnemonic & Native Pronunciation Note */}
          <p className="font-telugu text-xs sm:text-sm text-[#B99A60] dark:text-[#E2C385] max-w-xl mx-auto">
            స్పష్టమైన ఆంగ్ల వివరణలు మరియు సహజమైన తెలుగు ఉచ్ఛారణ మార్గదర్శకత్వంతో సులభంగా నేర్చుకోండి.
          </p>

          {/* Companion Mascot Presence */}
          <div className="pt-2 flex flex-col items-center justify-center">
            <MascotKai
              mood="welcoming"
              speechText="Konnichiwa! I'm Kai, your mentor spirit. Let's make Japanese delightful!"
              bubblePlacement="top"
              size="lg"
            />
          </div>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStartLearning}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D9483B] to-[#B83226] hover:from-[#E05448] text-white font-semibold text-sm sm:text-base tracking-wide shadow-lg shadow-[#D9483B]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Learning Free'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => scrollToRef(miniLessonRef)}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#151D28] hover:bg-stone-50 dark:hover:bg-[#1A2433] text-[#1A1817] dark:text-[#F0E5CE] border border-[#E5DEC9] dark:border-[#2D3A4F] font-semibold text-sm sm:text-base shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Try a 1-Minute Lesson</span>
              <ArrowDown size={16} className="text-[#D9483B]" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE MINI-LESSON PREVIEW: EXPERIENCE BEFORE SIGNUP
          ========================================================================= */}
      <section ref={miniLessonRef} className="py-16 px-6 bg-[#F4EFE6] dark:bg-[#0E1522] border-y border-[#E5DEC9] dark:border-[#222E3F] transition-colors">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1A2433] text-2xs font-mono font-bold text-[#D9483B] border border-[#E5DEC9] dark:border-[#2D3A4F]">
              <Sparkles size={12} />
              <span>Interactive Taste Test</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif_jp font-bold">
              Try Your Very First Lesson in 60 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7165] dark:text-[#94A3B8] max-w-lg mx-auto">
              No account required. Solve your first character right now and see how easy it is to
              learn with visual mnemonics and instant native audio.
            </p>
          </div>

          {/* Embedded Interactive Mini-Lesson */}
          <MiniLessonPreview onComplete={handleStartLearning} />
        </div>
      </section>

      {/* =========================================================================
          PROGRESSIVE PRODUCT REVELATION: 4 CLEAR PILLARS
          ========================================================================= */}
      <section ref={curriculumRef} className="py-20 px-6 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-[#D9483B] uppercase tracking-wider">
            Curriculum Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif_jp font-bold">
            How KAI Teaches Japanese from Scratch
          </h2>
          <p className="text-sm text-[#7A7165] dark:text-[#94A3B8]">
            We break Japanese into manageable, bite-sized stages so you never feel lost or overwhelmed.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Writing Systems */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#151D28] border border-[#E5DEC9] dark:border-[#263345] shadow-washi-md space-y-4 hover:border-[#D9483B]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D9483B]/10 text-[#D9483B] flex items-center justify-center font-bold text-xl">
              あ
            </div>
            <h3 className="text-xl font-bold font-serif_jp">1. The 3 Scripts Made Fearless</h3>
            <p className="text-xs sm:text-sm text-[#554E45] dark:text-[#CBD5E1] leading-relaxed">
              Master <strong>Hiragana</strong> (the 46 basic phonetic sounds), transition smoothly into{' '}
              <strong>Katakana</strong> (for loanwords like coffee and pizza), and demystify{' '}
              <strong>Kanji</strong> through root radicals and vivid visual stories.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                46 Hiragana Lessons
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Radical Etymology
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Telugu Pronunciation Guides
              </span>
            </div>
          </div>

          {/* Card 2: Sensory Practice Studios */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#151D28] border border-[#E5DEC9] dark:border-[#263345] shadow-washi-md space-y-4 hover:border-[#2B3A4A]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#2B3A4A] dark:text-indigo-300 flex items-center justify-center">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif_jp">2. Speaking, Listening & Handwriting</h3>
            <p className="text-xs sm:text-sm text-[#554E45] dark:text-[#CBD5E1] leading-relaxed">
              Don&apos;t just read off a screen. Train your voice in the <strong>Speaking Studio</strong> with
              speech recognition, tune your ear in the <strong>Listening Lab</strong>, and practice authentic
              sumi-e calligraphy on a digital <strong>genkō yōshi</strong> practice canvas.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Pitch Accent Feedback
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Stroke Order OCR
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Native Audio Speeds
              </span>
            </div>
          </div>

          {/* Card 3: 10 Playful Arcade Games */}
          <div ref={gamesRef} className="p-8 rounded-3xl bg-white dark:bg-[#151D28] border border-[#E5DEC9] dark:border-[#263345] shadow-washi-md space-y-4 hover:border-[#B99A60]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-[#B99A60] flex items-center justify-center">
              <Gamepad2 size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif_jp">3. 10 Interactive Learning Games</h3>
            <p className="text-xs sm:text-sm text-[#554E45] dark:text-[#CBD5E1] leading-relaxed">
              Say goodbye to boring flashcard grinding. Assemble trains in proper Japanese word order,
              solve Shibuya crime scenes in <strong>Particle Detective</strong>, and battle grammar monsters
              with verb conjugation spells.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Shinkansen Builder
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Kana Reflex Sprint
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Grammar Boss Battle
              </span>
            </div>
          </div>

          {/* Card 4: FSRS Memory Guarantee */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#151D28] border border-[#E5DEC9] dark:border-[#263345] shadow-washi-md space-y-4 hover:border-green-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Repeat size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif_jp">4. FSRS Spaced Repetition Engine</h3>
            <p className="text-xs sm:text-sm text-[#554E45] dark:text-[#CBD5E1] leading-relaxed">
              KAI is powered by the <strong>Free Spaced Repetition Scheduler (FSRS)</strong>. It calculates
              the exact second your brain is about to forget a word or kanji, and prompts a quick 5-minute
              review so it sticks in long-term memory forever.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                90%+ Target Retention
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Zero Memory Overload
              </span>
              <span className="text-2xs font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1F2B3B] text-[#554E45] dark:text-[#CBD5E1]">
                Offline & Cloud Sync
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL INVITATION BANNER
          ========================================================================= */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#FAF7F2] to-[#EFE8DA] dark:from-[#0B1019] dark:to-[#070A10] border-t border-[#E5DEC9] dark:border-[#222E3F]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <KaiMonCrest size={48} className="mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-serif_jp font-bold">
            Ready to Begin Your Japanese Mastery?
          </h2>
          <p className="text-sm text-[#7A7165] dark:text-[#94A3B8] max-w-lg mx-auto">
            Step into your private Japanese learning sanctuary. Available on the web, Windows
            desktop, and Android.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartLearning}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D9483B] to-[#B83226] hover:from-[#E05448] text-white font-semibold text-base shadow-lg shadow-[#D9483B]/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Enter Your Sanctuary' : 'Start Learning Free Now'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-[#FAF7F2] dark:bg-[#070A10] border-t border-[#E5DEC9] dark:border-[#1E293B] text-center text-xs text-[#7A7165] dark:text-[#64748B] space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="font-serif_jp font-bold text-sm text-[#1A1817] dark:text-[#F0E5CE]">
            KAI — 日本語マスター
          </span>
        </div>
        <p className="max-w-md mx-auto text-3xs leading-relaxed">
          Art-directed Japanese learning platform. Built for beginners with trilingual English & Telugu support, sensory practice studios, and FSRS memory reinforcement.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-3xs font-mono text-[#D9483B]">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:underline">
            Back to Top ↑
          </button>
          <span>•</span>
          <button onClick={() => onEnterApp('kana')} className="hover:underline">
            Kana Academy
          </button>
          <span>•</span>
          <button onClick={() => onEnterApp('rpg_games')} className="hover:underline">
            Game Arcade
          </button>
          <span>•</span>
          <button onClick={() => onEnterApp('dashboard')} className="hover:underline">
            Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
