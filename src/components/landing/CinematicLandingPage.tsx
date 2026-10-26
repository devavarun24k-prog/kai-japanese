// src/components/landing/CinematicLandingPage.tsx
// "Midnight Matsuri + Sumi-e" Authentic Japanese Editorial Landing Experience for KAI
// Features:
// - Traditional Noren entrance curtain (skippable, session-cached, reduced-motion aware)
// - Layered deep-indigo gradient (#0A101C -> #141D33) with Seigaiha wave pattern at 6% opacity
// - Hanging Chochin festival lanterns swaying with spring physics & pointer proximity glow
// - Dynamic Zen Enso calligraphy circle behind the hero headline
// - Vertical decorative Japanese calligraphy headline: 「真の日本語へ、夜の祭りから」
// - Alternating authentic Washi-paper sections (#F3EBDD) with static WashiTexture & Kinpaku GoldFlecks
// - Section numbers stamped with Daiji Hanko seals (壱, 弐, 参, 肆)
// - Real-time Romaji-to-Hiragana engine projecting typed kana onto the glowing center lantern
// - TiltCard studio showcases, MagneticButton CTAs, desktop ink cursor, and Lenis smooth scrolling
// - Full WCAG AA contrast compliance, strictly animating transform & opacity, mobile-responsive down to 375px
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
import {
  PetalField,
  MagneticButton,
  TiltCard,
  SplitText,
  CustomCursor,
  EnsoCircle,
  NorenCurtain,
  ChochinLanterns,
  Seigaiha,
  Asanoha,
  WashiTexture,
  GoldFlecks,
  HankoStamp
} from '../fx';
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
  const [heroKanaText, setHeroKanaText] = useState<string>('さくら');

  // Section Refs for smooth navigation
  const wanakanaDemoRef = useRef<HTMLDivElement | null>(null);
  const assemblyRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const miniLessonRef = useRef<HTMLDivElement | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
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
    <div className="relative w-full min-h-screen bg-[#0A101C] text-[#F3EBDD] font-sans overflow-x-hidden selection:bg-kai-vermilion selection:text-white transition-colors">
      {/* Traditional Noren Entrance Curtain (Parting on load, skippable) */}
      <NorenCurtain />

      {/* Desktop-only subtle Japanese ink cursor */}
      <CustomCursor />

      {/* Floating Sakura Petals (Strictly pointer-events-none, pauses when hidden) */}
      <PetalField className="pointer-events-none z-0" interactive={true} />

      {/* =========================================================================
          TOP FLOATING NAVIGATION HEADER (USABLE DOWN TO 375PX)
          ========================================================================= */}
      <header className="fixed top-3 inset-x-3 sm:top-4 sm:inset-x-8 z-40 flex items-center justify-between pointer-events-none gap-2">
        {/* Brand Crest Pill */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#141D33]/90 hover:bg-[#1C2945] border border-[#2E4370]/60 backdrop-blur-md flex items-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <KaiMonCrest size={22} />
          <span className="font-serif_jp font-bold text-xs sm:text-sm tracking-wider text-[#FAF5ED]">
            KAI
          </span>
          <span className="text-3xs font-mono text-[#E2BA4E] uppercase hidden md:inline">
            | 日本語マスター
          </span>
        </div>

        {/* Center Quick Navigation (Desktop) */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#141D33]/85 border border-[#2E4370]/60 backdrop-blur-md shadow-lg text-xs font-medium text-[#DDD2B8]">
          <button
            onClick={() => scrollToRef(wanakanaDemoRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion-light transition-colors"
          >
            Romaji Engine
          </button>
          <span className="opacity-40">&bull;</span>
          <button
            onClick={() => scrollToRef(assemblyRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion-light transition-colors"
          >
            Kana Assembly
          </button>
          <span className="opacity-40">&bull;</span>
          <button
            onClick={() => scrollToRef(showcaseRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion-light transition-colors"
          >
            Curriculum
          </button>
          <span className="opacity-40">&bull;</span>
          <button
            onClick={() => scrollToRef(miniLessonRef)}
            className="px-2.5 py-1 rounded-full hover:text-kai-vermilion-light transition-colors"
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
            className="p-2 sm:p-2.5 rounded-full bg-[#141D33]/90 border border-[#2E4370]/60 backdrop-blur-md text-[#DDD2B8] hover:text-[#E2BA4E] transition-all shadow-md active:scale-95"
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
          HERO SECTION: MIDNIGHT MATSURI ATMOSPHERE & CHOCHIN LANTERNS
          ========================================================================= */}
      <section className="relative min-h-[96vh] flex flex-col justify-center items-center px-4 sm:px-6 pt-28 sm:pt-32 pb-20 text-center overflow-hidden bg-gradient-to-b from-[#0A101C] via-[#0E1626] to-[#141D33]">
        {/* Seigaiha Traditional Wave Pattern at 6% Opacity */}
        <Seigaiha color="#2E4370" opacity={0.06} size={54} />

        {/* Radial Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,8,15,0.75)_100%)]"
          aria-hidden="true"
        />

        {/* Hanging Chochin Festival Lanterns (Desktop: 3 with proximity glow, Mobile: 2) */}
        <ChochinLanterns centerKanaText={heroKanaText} />

        {/* Vertical Decorative Japanese Calligraphy Headline (Desktop Side Accent) */}
        <div className="hidden xl:flex flex-col items-center absolute left-8 top-36 z-20 pointer-events-none select-none opacity-80 border-l border-[#C59B27]/30 pl-3">
          <span
            className="font-serif_jp text-sm text-[#C59B27] tracking-[0.45em] leading-loose"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            真の日本語へ、夜の祭りから
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-kai-vermilion mt-3" />
        </div>

        {/* Right Vertical Accent (Desktop) */}
        <div className="hidden xl:flex flex-col items-center absolute right-8 top-36 z-20 pointer-events-none select-none opacity-80 border-r border-[#C59B27]/30 pr-3">
          <span
            className="font-serif_jp text-sm text-[#DDD2B8] tracking-[0.45em] leading-loose"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            界・一文字の無限
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27] mt-3" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 mt-10 sm:mt-12">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141D33]/85 border border-[#2E4370]/60 text-3xs font-mono font-medium text-[#DDD2B8] shadow-md backdrop-blur-sm">
            <Sparkles size={12} className="text-[#E2BA4E]" />
            <span>Midnight Matsuri &bull; Real Japanese Mastery from Zero</span>
          </div>

          {/* Main Headline with SplitText Entrance & Enso Circle Behind */}
          <div className="relative py-2">
            {/* Dynamic Enso Circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <EnsoCircle
                size={340}
                color="#C59B27"
                opacity={0.24}
                duration={2.2}
                delay={0.2}
              />
            </div>

            <h1 className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-serif_jp font-bold tracking-tight text-[#FAF5ED] leading-tight">
              <SplitText
                text="Master Japanese from zero — naturally, playfully, completely."
                by="words"
                stagger={0.04}
                delay={0.15}
              />
            </h1>
          </div>

          {/* English Subtitle */}
          <p className="text-xs sm:text-base text-[#DDD2B8] max-w-2xl mx-auto leading-relaxed">
            No endless walls of cryptic Japanese text. Master <strong>Hiragana</strong>,{' '}
            <strong>Katakana</strong>, <strong>Kanji</strong>, and natural conversation with tactile feedback,
            playful mini-games, and intelligent spaced repetition.
          </p>

          {/* Telugu Support Subtitle */}
          <p className="font-telugu text-2xs sm:text-xs text-[#E2BA4E] max-w-lg mx-auto">
            స్పష్టమైన ఆంగ్ల వివరణలతో పాటు సులభమైన తెలుగు ఉచ్ఛారణ మార్గదర్శకత్వం.
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              onClick={handleEnterPlatform}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs sm:text-sm shadow-vermilion flex items-center gap-2 transition-transform"
            >
              <Compass size={16} />
              <span>{isAuthenticated ? 'Open Learning Dashboard' : 'Start Learning Free'}</span>
              <ArrowRight size={15} />
            </MagneticButton>

            <button
              onClick={() => scrollToRef(wanakanaDemoRef)}
              className="px-4 sm:px-6 py-3.5 rounded-2xl bg-[#141D33]/90 text-[#FAF5ED] border border-[#2E4370]/70 text-xs sm:text-sm font-semibold shadow-md hover:border-[#C59B27] transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Try Romaji Converter</span>
              <ArrowDown size={14} className="text-[#E2BA4E]" />
            </button>
          </div>

          {/* LIVE WANAKANA DEMO IN HERO (Linked to glowing center lantern) */}
          <div ref={wanakanaDemoRef} className="pt-6">
            <LiveWanakanaDemo onKanaChange={setHeroKanaText} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1 (壱): SCROLL-DRIVEN KANA & SENTENCE ASSEMBLY (WASHI SECTION)
          ========================================================================= */}
      <section
        ref={assemblyRef}
        className="relative py-20 px-4 sm:px-6 bg-[#F3EBDD] text-[#14110F] border-t border-b border-[#DDD2B8] overflow-hidden"
      >
        {/* Authentic Mulberry Paper Grain & Sparse Kinpaku Flecks */}
        <WashiTexture opacity={0.07} tone="light" />
        <GoldFlecks density="sparse" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          {/* Section Header with Daiji Hanko Seal 壱 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <HankoStamp text="壱" size={44} shape="square" playSound={false} />
            <div>
              <span className="text-3xs font-mono font-bold uppercase tracking-wider text-[#9E2B1E]">
                Stage 壱 &bull; Progression Map
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif_jp font-bold text-[#14110F]">
                From First Stroke to Fluency
              </h2>
            </div>
          </div>

          <ScrollAssemblySection />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 (弐): 3D TILT-CARD MODULE SHOWCASE (MIDNIGHT INDIGO SECTION)
          ========================================================================= */}
      <section
        ref={showcaseRef}
        className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#0A101C] via-[#0E1626] to-[#141D33] overflow-hidden"
      >
        {/* Asanoha sacred hemp lattice pattern at low opacity */}
        <Asanoha color="#C59B27" opacity={0.045} size={50} />

        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          {/* Section Header with Daiji Hanko Seal 弐 */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2">
              <HankoStamp text="弐" size={44} shape="square" playSound={false} />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141D33] border border-[#2E4370]/60 text-3xs font-mono text-[#DDD2B8]">
                <BookOpen size={12} className="text-[#E2BA4E]" />
                <span>Interactive Learning Studios</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif_jp font-bold text-[#FAF5ED]">
                Designed for How the Brain Actually Learns
              </h2>
              <p className="text-xs sm:text-sm text-[#DDD2B8] max-w-lg mx-auto">
                Move your cursor across any studio card to experience tactile 3D perspective and specular glare.
              </p>
            </div>
          </div>

          {/* 4 TiltCards Grid (Styled with Sumi-Lacquer / Washi Card Aesthetics) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Studio 1: Kana Academy */}
            <TiltCard
              maxTilt={12}
              className="p-6 sm:p-8 rounded-3xl bg-[#141D33]/90 border border-[#2E4370]/70 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#C59B27]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-kai-vermilion/20 border border-kai-vermilion/40 text-kai-vermilion font-serif_jp font-bold text-2xl flex items-center justify-center">
                あ
              </div>
              <h3 className="text-lg font-bold font-serif_jp text-[#FAF5ED]">
                Kana Academy &amp; Radicals
              </h3>
              <p className="text-xs sm:text-sm text-[#DDD2B8] leading-relaxed">
                Step-by-step Hiragana &amp; Katakana progression with visual mnemonics, stroke animations, and Telugu pronunciation guidance.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  46 Characters
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Sumi-e Stroke Order
                </span>
              </div>
            </TiltCard>

            {/* Studio 2: Speaking Studio */}
            <TiltCard
              maxTilt={12}
              className="p-6 sm:p-8 rounded-3xl bg-[#141D33]/90 border border-[#2E4370]/70 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#C59B27]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#2E4370]/30 border border-[#2E4370]/60 text-[#E2BA4E] font-bold text-xl flex items-center justify-center">
                <Mic size={22} className="text-[#E2BA4E]" />
              </div>
              <h3 className="text-lg font-bold font-serif_jp text-[#FAF5ED]">
                Speaking &amp; Pitch Accent Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#DDD2B8] leading-relaxed">
                Real-time voice recognition that listens to your speech, analyzes pitch curves, and helps you speak like a Tokyo native.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Voice Shadowing
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Native Speed Drills
                </span>
              </div>
            </TiltCard>

            {/* Studio 3: 10 Arcade Mini-Games */}
            <TiltCard
              maxTilt={12}
              className="p-6 sm:p-8 rounded-3xl bg-[#141D33]/90 border border-[#2E4370]/70 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#C59B27]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-[#E2BA4E] font-bold text-xl flex items-center justify-center">
                <Gamepad2 size={22} />
              </div>
              <h3 className="text-lg font-bold font-serif_jp text-[#FAF5ED]">
                10 Interactive Learning Games
              </h3>
              <p className="text-xs sm:text-sm text-[#DDD2B8] leading-relaxed">
                Assemble Shinkansen trains in SOV syntax order, solve Tokyo crime scenes in Particle Detective, and fight grammar boss monsters.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Arcade Boss Battles
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Memory Tiles
                </span>
              </div>
            </TiltCard>

            {/* Studio 4: FSRS Spaced Repetition */}
            <TiltCard
              maxTilt={12}
              className="p-6 sm:p-8 rounded-3xl bg-[#141D33]/90 border border-[#2E4370]/70 shadow-2xl space-y-3 relative overflow-hidden group hover:border-[#C59B27]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[#3C9B64] font-bold text-xl flex items-center justify-center">
                <Repeat size={22} />
              </div>
              <h3 className="text-lg font-bold font-serif_jp text-[#FAF5ED]">
                FSRS Spaced Repetition Engine
              </h3>
              <p className="text-xs sm:text-sm text-[#DDD2B8] leading-relaxed">
                Scientifically proven memory scheduling algorithms that prevent memory decay and guarantee 90%+ long-term retention.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-3xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Optimal Spacing
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1C2945] text-[#FAF5ED] border border-[#2E4370]/50">
                  Offline Queue Sync
                </span>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 (参): MINI-LESSON PREVIEW (WASHI PAPER SECTION)
          ========================================================================= */}
      <section
        ref={miniLessonRef}
        className="relative py-20 px-4 sm:px-6 bg-[#F3EBDD] text-[#14110F] border-t border-b border-[#DDD2B8] overflow-hidden"
      >
        {/* Authentic Mulberry Paper Grain & Sparse Kinpaku Flecks */}
        <WashiTexture opacity={0.07} tone="light" />
        <GoldFlecks density="sparse" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <HankoStamp text="参" size={44} shape="square" playSound={false} />
            <span className="text-3xs font-mono font-bold uppercase tracking-wider text-[#9E2B1E]">
              Hands-On Demonstration &bull; 60 Seconds
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif_jp font-bold text-[#14110F]">
              Solve Your First Character in 60 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-[#524B42] max-w-md mx-auto">
              Experience the mnemonic learning method without signing up.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="p-8 rounded-3xl bg-white border border-[#DDD2B8] animate-pulse max-w-lg mx-auto text-xs text-[#524B42]">
                Loading interactive mini-lesson preview...
              </div>
            }
          >
            <MiniLessonPreview onComplete={handleEnterPlatform} />
          </Suspense>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 (肆) & FOOTER: MIDNIGHT MATSURI DEPARTURE
          ========================================================================= */}
      <footer className="relative py-20 px-4 sm:px-6 bg-[#0A101C] border-t border-[#2E4370]/60 text-center space-y-6 overflow-hidden">
        {/* Seigaiha waves in footer */}
        <Seigaiha color="#2E4370" opacity={0.05} size={54} />

        <div className="relative z-10 max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <HankoStamp text="肆" size={38} shape="square" playSound={false} />
            <KaiMonCrest size={32} />
            <span className="font-serif_jp font-bold text-base text-[#FAF5ED]">
              KAI — 日本語マスター
            </span>
          </div>

          <p className="text-xs text-[#DDD2B8] leading-relaxed">
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

        <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-4 text-3xs font-mono text-[#DDD2B8]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-kai-vermilion-light transition-colors"
          >
            Back to Top &uarr;
          </button>
          <span>&bull;</span>
          <button
            onClick={() => onEnterApp('kana')}
            className="hover:text-kai-vermilion-light transition-colors"
          >
            Kana Academy
          </button>
          <span>&bull;</span>
          <button
            onClick={() => onEnterApp('rpg_games')}
            className="hover:text-kai-vermilion-light transition-colors"
          >
            Game Arcade
          </button>
          <span>&bull;</span>
          <button
            onClick={() => onEnterApp('dashboard')}
            className="hover:text-kai-vermilion-light transition-colors"
          >
            Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
