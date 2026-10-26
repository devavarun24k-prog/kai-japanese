// src/components/landing/CinematicLandingPage.tsx
// Redesigned Japanese Editorial Landing Experience for KAI
// Features live Wanakana typing engine, Lenis smooth scrolling, scroll-driven kana assembly,
// TiltCard showcases, MagneticButton CTAs, desktop custom cursor, and lazy-loaded below-the-fold components
import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import {
  Volume2,
  VolumeX,
  Compass,
  ArrowDown,
  Sparkles,
  BookOpen,
  Mic,
  Gamepad2,
  Repeat,
  ArrowRight,
  FastForward
} from 'lucide-react';
import { PetalField, MagneticButton, TiltCard, SplitText, CustomCursor } from '../fx';
import { LiveWanakanaDemo } from './LiveWanakanaDemo';
import { ScrollAssemblySection } from './ScrollAssemblySection';
import { KaiMonCrest } from './OrnamentalElements';
import { soundEffects } from '../../services/soundEffects';
import { ActiveSection } from '../../context/LearningContext';

// Lazy-load below-the-fold interactive components to guarantee Lighthouse mobile performance
const MiniLessonPreview = lazy(() =>
  import('./MiniLessonPreview').then((m) => ({ default: m.MiniLessonPreview }))
);

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
  const wanakanaDemoRef = useRef<HTMLDivElement | null>(null);
  const assemblyRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const miniLessonRef = useRef<HTMLDivElement | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Respect user's reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.3,
      infinite: false
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

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

  const handleEnterPlatform = () => {
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
    <div className="relative w-full min-h-screen bg-kai-bg dark:bg-[#0A0F18] text-kai-ink dark:text-[#F0E5CE] font-sans overflow-x-hidden selection:bg-kai-vermilion selection:text-white transition-colors">
      {/* Desktop-only subtle Japanese ink cursor */}
      <CustomCursor />

      {/* Floating Canvas Petal Field (Strictly pointer-events-none) */}
      <PetalField className="pointer-events-none z-0" interactive={true} />

      {/* =========================================================================
          TOP FLOATING NAVIGATION HEADER (USABLE DOWN TO 375PX)
          ========================================================================= */}
      <header className="fixed top-3 inset-x-3 sm:top-4 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-none gap-2">
        {/* Brand Crest Pill */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-kai-dark-card/90 hover:bg-white border border-kai-border dark:border-kai-dark-border backdrop-blur-md flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <KaiMonCrest size={22} />
          <span className="font-serif_jp font-bold text-xs sm:text-sm tracking-wider text-kai-ink dark:text-white">
            KAI
          </span>
          <span className="text-3xs font-mono text-kai-vermilion uppercase hidden md:inline">
            | 日本語マスター
          </span>
        </div>

        {/* Center Quick Navigation (Desktop) */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/90 dark:bg-kai-dark-card/90 border border-kai-border dark:border-kai-dark-border backdrop-blur-md shadow-sm text-xs font-medium text-kai-muted dark:text-stone-300">
          <button
            onClick={() => scrollToRef(wanakanaDemoRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion transition-colors"
          >
            Romaji Engine
          </button>
          <span>&bull;</span>
          <button
            onClick={() => scrollToRef(assemblyRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion transition-colors"
          >
            Word Assembly
          </button>
          <span>&bull;</span>
          <button
            onClick={() => scrollToRef(showcaseRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion transition-colors"
          >
            Curriculum
          </button>
          <span>&bull;</span>
          <button
            onClick={() => scrollToRef(miniLessonRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion transition-colors"
          >
            Mini-Lesson
          </button>
        </nav>

        {/* Right Action Controls: Audio Toggle + Explicit Skip Intro / Enter Button */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-kai-dark-card/90 border border-kai-border dark:border-kai-dark-border backdrop-blur-md text-kai-muted dark:text-stone-300 hover:text-kai-vermilion transition-all shadow-sm active:scale-95"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Visible Skip Intro & Enter Button for Returning Users */}
          <MagneticButton
            onClick={handleEnterPlatform}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-kai-vermilion to-kai-vermilion-dark text-white text-2xs sm:text-xs font-semibold shadow-vermilion flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion"
          >
            <FastForward size={13} className="hidden sm:inline" />
            <span>{isAuthenticated ? 'Enter App' : 'Skip Intro & Enter'}</span>
          </MagneticButton>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION: EDITORIAL HEADLINE & LIVE WANAKANA DEMO
          ========================================================================= */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center px-4 sm:px-6 pt-24 sm:pt-28 pb-16 text-center overflow-hidden">
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-kai-dark-card/80 border border-kai-border dark:border-kai-dark-border text-3xs font-mono font-medium text-kai-muted dark:text-stone-300 shadow-sm backdrop-blur-sm">
            <Sparkles size={12} className="text-kai-vermilion" />
            <span>Modern Editorial Japanese Learning &bull; From Zero to Fluency</span>
          </div>

          {/* Main Headline with SplitText Entrance */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif_jp font-bold tracking-tight text-kai-ink dark:text-white leading-tight">
            <SplitText
              text="Master Japanese from zero — naturally, playfully, completely."
              by="words"
              stagger={0.04}
              delay={0.1}
            />
          </h1>

          {/* English Subtitle */}
          <p className="text-xs sm:text-base text-kai-muted dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            No endless walls of cryptic Japanese text. Master <strong>Hiragana</strong>,{' '}
            <strong>Katakana</strong>, <strong>Kanji</strong>, and natural conversation with tactile feedback,
            playful mini-games, and intelligent spaced repetition.
          </p>

          {/* Telugu Support Subtitle */}
          <p className="font-telugu text-2xs sm:text-xs text-kai-gold max-w-lg mx-auto">
            స్పష్టమైన ఆంగ్ల వివరణలతో పాటు సులభమైన తెలుగు ఉచ్ఛారణ మార్గదర్శకత్వం.
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              onClick={handleEnterPlatform}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs sm:text-sm shadow-vermilion flex items-center gap-2 transition-transform"
            >
              <Compass size={16} />
              <span>{isAuthenticated ? 'Open Learning Dashboard' : 'Start Learning Free'}</span>
              <ArrowRight size={15} />
            </MagneticButton>

            <button
              onClick={() => scrollToRef(wanakanaDemoRef)}
              className="px-4 sm:px-6 py-3 rounded-2xl bg-white/90 dark:bg-kai-dark-card/90 text-kai-ink dark:text-white border border-kai-border dark:border-kai-dark-border text-xs sm:text-sm font-semibold shadow-sm hover:border-kai-vermilion transition-all flex items-center gap-1.5"
            >
              <span>Try Romaji Converter</span>
              <ArrowDown size={14} className="text-kai-vermilion" />
            </button>
          </div>

          {/* LIVE WANAKANA DEMO IN HERO */}
          <div ref={wanakanaDemoRef} className="pt-6">
            <LiveWanakanaDemo />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SCROLL-DRIVEN KANA & SENTENCE ASSEMBLY (ROAD TO JLPT N1)
          ========================================================================= */}
      <div ref={assemblyRef} className="border-t border-kai-border/70 dark:border-kai-dark-border/70 bg-stone-50/60 dark:bg-[#0D1420]/70">
        <ScrollAssemblySection />
      </div>

      {/* =========================================================================
          SECTION 3: 3D TILT-CARD MODULE SHOWCASE
          ========================================================================= */}
      <section ref={showcaseRef} className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-kai-dark-card border border-kai-border text-3xs font-mono text-kai-muted">
            <BookOpen size={12} className="text-kai-vermilion" />
            <span>Interactive Learning Studios</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif_jp font-bold text-kai-ink dark:text-white">
            Designed for How the Brain Actually Learns
          </h2>
          <p className="text-xs sm:text-sm text-kai-muted dark:text-stone-300 max-w-lg mx-auto">
            Move your cursor across any studio card to experience tactile 3D perspective and specular glare.
          </p>
        </div>

        {/* 4 TiltCards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Studio 1: Kana Academy */}
          <TiltCard
            maxTilt={12}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi-md space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-kai-vermilion/10 text-kai-vermilion font-serif_jp font-bold text-2xl flex items-center justify-center">
              あ
            </div>
            <h3 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-white">
              Kana Academy &amp; Radicals
            </h3>
            <p className="text-xs sm:text-sm text-kai-muted dark:text-stone-300 leading-relaxed">
              Step-by-step Hiragana &amp; Katakana progression with visual mnemonics, stroke animations, and Telugu pronunciation guidance.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                46 Characters
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Sumi-e Stroke Order
              </span>
            </div>
          </TiltCard>

          {/* Studio 2: Speaking Studio */}
          <TiltCard
            maxTilt={12}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi-md space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-kai-indigo/10 text-kai-indigo font-bold text-xl flex items-center justify-center">
              <Mic size={22} className="text-kai-indigo dark:text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-white">
              Speaking &amp; Pitch Accent Studio
            </h3>
            <p className="text-xs sm:text-sm text-kai-muted dark:text-stone-300 leading-relaxed">
              Real-time voice recognition that listens to your speech, analyzes pitch curves, and helps you speak like a Tokyo native.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Voice Shadowing
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Native Speed Drills
              </span>
            </div>
          </TiltCard>

          {/* Studio 3: 10 Arcade Mini-Games */}
          <TiltCard
            maxTilt={12}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi-md space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xl flex items-center justify-center">
              <Gamepad2 size={22} />
            </div>
            <h3 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-white">
              10 Interactive Learning Games
            </h3>
            <p className="text-xs sm:text-sm text-kai-muted dark:text-stone-300 leading-relaxed">
              Assemble Shinkansen trains in SOV syntax order, solve Tokyo crime scenes in Particle Detective, and fight grammar boss monsters.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Arcade Boss Battles
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Memory Tiles
              </span>
            </div>
          </TiltCard>

          {/* Studio 4: FSRS Spaced Repetition */}
          <TiltCard
            maxTilt={12}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi-md space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xl flex items-center justify-center">
              <Repeat size={22} />
            </div>
            <h3 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-white">
              FSRS Spaced Repetition Engine
            </h3>
            <p className="text-xs sm:text-sm text-kai-muted dark:text-stone-300 leading-relaxed">
              Scientifically proven memory scheduling algorithms that prevent memory decay and guarantee 90%+ long-term retention.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Optimal Spacing
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-kai-dark-surface text-kai-muted dark:text-stone-300">
                Offline Queue Sync
              </span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LAZY-LOADED MINI-LESSON PREVIEW
          ========================================================================= */}
      <section ref={miniLessonRef} className="py-16 px-4 sm:px-6 bg-stone-100/70 dark:bg-[#0E1522] border-t border-kai-border/70 dark:border-kai-dark-border/70">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-3xs font-mono font-bold uppercase tracking-wider text-kai-vermilion">
              Hands-On Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif_jp font-bold text-kai-ink dark:text-white">
              Solve Your First Character in 60 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-kai-muted dark:text-stone-300 max-w-md mx-auto">
              Experience the mnemonic learning method without signing up.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border animate-pulse max-w-lg mx-auto text-xs text-kai-muted">
                Loading interactive mini-lesson preview...
              </div>
            }
          >
            <MiniLessonPreview onComplete={handleEnterPlatform} />
          </Suspense>
        </div>
      </section>

      {/* =========================================================================
          FOOTER INVITATION & DIRECT ACTION
          ========================================================================= */}
      <footer className="py-16 px-4 sm:px-6 bg-kai-bg dark:bg-[#070A10] border-t border-kai-border dark:border-kai-dark-border text-center space-y-6">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <KaiMonCrest size={32} />
            <span className="font-serif_jp font-bold text-base text-kai-ink dark:text-white">
              KAI — 日本語マスター
            </span>
          </div>

          <p className="text-xs text-kai-muted dark:text-stone-400 leading-relaxed">
            Personal Japanese Mastery Platform. Built for absolute beginners with trilingual English &amp; Telugu support.
          </p>

          <MagneticButton
            onClick={handleEnterPlatform}
            className="px-8 py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion flex items-center justify-center gap-2 mx-auto"
          >
            <span>{isAuthenticated ? 'Open Learning Dashboard' : 'Start Learning Free'}</span>
            <ArrowRight size={15} />
          </MagneticButton>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-3xs font-mono text-kai-muted dark:text-stone-400">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-kai-vermilion">
            Back to Top &uarr;
          </button>
          <span>&bull;</span>
          <button onClick={() => onEnterApp('kana')} className="hover:text-kai-vermilion">
            Kana Academy
          </button>
          <span>&bull;</span>
          <button onClick={() => onEnterApp('rpg_games')} className="hover:text-kai-vermilion">
            Game Arcade
          </button>
          <span>&bull;</span>
          <button onClick={() => onEnterApp('dashboard')} className="hover:text-kai-vermilion">
            Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
