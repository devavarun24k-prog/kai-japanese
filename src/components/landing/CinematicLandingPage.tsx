// src/components/landing/CinematicLandingPage.tsx
// Awwwards-level Cinematic 3D Journey Landing Page for KAI (日本語マスター)
import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Volume2, VolumeX, ArrowDown, Sparkles, Compass, Play } from 'lucide-react';
import { CinematicScene } from '../three/CinematicScene';
import { FilmCurtainLoader } from './FilmCurtainLoader';
import { KanjiScrollTrack } from './KanjiScrollTrack';
import { ManifestoSection } from './ManifestoSection';
import { RomajiConverterSection } from './RomajiConverterSection';
import { FeaturesTravelSection } from './FeaturesTravelSection';
import { AppShowcaseSection } from './AppShowcaseSection';
import { SocialProofRibbon } from './SocialProofRibbon';
import { SunriseCtaSection } from './SunriseCtaSection';
import { CinematicFooter } from './CinematicFooter';
import { CustomCursor } from '../common/CustomCursor';
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.getIsMuted());
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Initialize Lenis smooth scroll and calculate normalized scroll progress (0..1)
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: isReducedMotion ? 0.01 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.2,
      infinite: false
    });

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      handleScroll();
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
    if (!next) {
      soundEffects.playLevelUp();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070C] text-[#F5EFE6] selection:bg-[#E63946] selection:text-white font-serif_jp overflow-x-hidden">
      {/* Cinematic Custom Cursor */}
      <CustomCursor />

      {/* Opening 2.39:1 Film Curtain Loader */}
      {!isLoaderComplete && (
        <FilmCurtainLoader onComplete={() => setIsLoaderComplete(true)} minDurationMs={2200} />
      )}

      {/* Persistent fixed 3D Canvas Journey behind content */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CinematicScene scrollProgress={scrollProgress} />
      </div>

      {/* Right Side Kanji Vertical Chapter Track */}
      <KanjiScrollTrack scrollProgress={scrollProgress} />

      {/* Ambient Audio Toggle & Brand Mon in Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto backdrop-blur-md bg-[#07070C]/30 border-b border-white/5 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#b3202e] flex items-center justify-center text-white font-shippori font-bold text-lg shadow-[0_0_15px_rgba(230,57,70,0.4)]">
            界
          </div>
          <div className="flex flex-col">
            <span className="font-shippori font-bold text-sm tracking-wider text-white">
              KAI <span className="text-[#F4C26B] font-normal text-xs font-serif_jp">日本語マスター</span>
            </span>
            <span className="text-3xs font-mono uppercase tracking-widest text-white/40">
              Personal Mastery Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute atmospheric audio' : 'Mute audio'}
            className="w-9 h-9 rounded-full bg-stone-900/70 border border-white/10 hover:border-[#F4C26B]/50 text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#F4C26B]" />}
          </button>

          {/* Direct Auth / Enter Action */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (onOpenAuth && !isAuthenticated) {
                onOpenAuth();
              } else {
                onEnterApp();
              }
            }}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-[#E63946] text-white text-xs font-mono tracking-wider uppercase border border-white/15 hover:border-[#E63946] transition-all shadow-sm"
          >
            {isAuthenticated ? 'Enter App' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Main Content Layers */}
      <main className="relative z-10">
        {/* ========================================================
            SEQUENCE 1: HERO SCENE (THE THRESHOLD - 序章)
        ======================================================== */}
        <section
          id="hero-scene"
          className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 pointer-events-auto"
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Top Chapter Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/60 border border-[#F4C26B]/30 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-pulse" />
              <span className="font-mono text-2xs uppercase tracking-[0.25em] text-[#F4C26B]">
                Chapter I • The Threshold (序章)
              </span>
            </div>

            {/* Giant Brush Typography */}
            <h1 className="font-shippori text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal tracking-tight leading-none mb-6 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              真の<span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F4C26B] to-[#e89a3c]">日本語</span>へ
            </h1>

            {/* English Subheadline */}
            <p className="font-serif_jp text-base sm:text-xl md:text-2xl text-stone-200 max-w-2xl font-light mb-3 leading-relaxed drop-shadow-md">
              Master Japanese from zero — naturally, playfully, completely.
            </p>

            {/* Telugu Pronunciation-Guide Line in gold (#F4C26B) */}
            <p className="font-serif_jp text-xs sm:text-sm text-[#F4C26B] max-w-xl font-normal mb-10 tracking-wide drop-shadow">
              స్పష్టమైన ఆంగ్ల వివరణలతో పాటు సులభమైన తెలుగు ఉచ్చారణ మార్గదర్శకత్వం.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-12">
              <button
                onClick={() => {
                  soundEffects.playLevelUp();
                  if (onOpenAuth && !isAuthenticated) {
                    onOpenAuth();
                  } else {
                    onEnterApp();
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E63946] hover:bg-[#b3202e] text-white font-serif_jp text-base font-semibold tracking-wide transition-all shadow-[0_0_30px_rgba(230,57,70,0.45)] hover:shadow-[0_0_45px_rgba(230,57,70,0.65)] flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span className="font-shippori text-lg font-bold">改</span>
                <span>{isAuthenticated ? 'Enter KAI Sanctuary' : 'Begin the Journey • 旅を始める'}</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  const el = document.getElementById('romaji-converter');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-[#F4C26B]/50 hover:border-[#F4C26B] text-white font-serif_jp text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-lg group cursor-pointer"
              >
                <span>Try Romaji Converter</span>
                <ArrowDown size={16} className="text-[#F4C26B] group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Cinematic Hero Video Placeholder Slot */}
            {/*
              NOTE FOR USER:
              To drop in your own cinematic hero video loop, place an MP4 file at:
              /public/media/hero.mp4
              The video element below will automatically play it.
            */}
            <div className="w-full max-w-xl mx-auto rounded-2xl p-1 bg-gradient-to-r from-transparent via-[#F4C26B]/20 to-transparent">
              <div className="rounded-2xl bg-stone-950/70 border border-white/10 p-4 backdrop-blur-lg flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center text-[#F4C26B]">
                    <Play size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-white block">Cinematic Journey Reel</span>
                    <span className="text-3xs font-mono text-stone-400">4K 60fps • Spatial Audio Experience</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                >
                  Watch Reel
                </button>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 flex flex-col items-center gap-2 opacity-60 animate-bounce">
              <span className="text-3xs font-mono uppercase tracking-[0.3em] text-stone-400">Scroll to Enter</span>
              <ArrowDown size={14} className="text-[#F4C26B]" />
            </div>
          </div>
        </section>

        {/* ========================================================
            ROMAJI CONVERTER SECTION (INTERACTIVE LIVE ENGINE)
        ======================================================== */}
        <div id="romaji-converter">
          <RomajiConverterSection />
        </div>

        {/* ========================================================
            SEQUENCE 2: MANIFESTO (THE DECLARATION - 宣言)
        ======================================================== */}
        <div id="manifesto-scene">
          <ManifestoSection onEnterApp={() => onEnterApp()} />
        </div>

        {/* ========================================================
            SEQUENCE 3: SEVEN GATES TRAVEL (THE SEVEN ARTS - 奥義)
        ======================================================== */}
        <div id="features-scene">
          <FeaturesTravelSection onEnterApp={onEnterApp} />
        </div>

        {/* ========================================================
            SEQUENCE 4: APP SHOWCASE (LIVING SANCTUM - 実相)
        ======================================================== */}
        <div id="showcase-scene">
          <AppShowcaseSection onEnterApp={() => onEnterApp()} />
        </div>

        {/* ========================================================
            SEQUENCE 5: PROOF & METRICS (PROVEN RESULTS - 実績)
        ======================================================== */}
        <div id="stats-scene">
          <SocialProofRibbon />
        </div>

        {/* ========================================================
            SEQUENCE 6: SUNRISE OVER FUJI (THE THRESHOLD - 曙光)
        ======================================================== */}
        <div id="cta-scene">
          <SunriseCtaSection
            onEnterApp={() => onEnterApp()}
            onOpenAuth={onOpenAuth}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* ========================================================
            SEQUENCE 7: MINIMAL FOOTER WITH SUMI-E KOI FISH
        ======================================================== */}
        <CinematicFooter />
      </main>

      {/* Video Reel Modal Placeholder */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-stone-950 border border-white/20 p-6 relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                <span className="font-shippori text-sm text-white">KAI Journey Trailer</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-stone-400 hover:text-white font-mono text-xs"
              >
                Close [ESC]
              </button>
            </div>

            {/* Video Slot or Interactive fallback */}
            <div className="aspect-video w-full rounded-2xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center p-6 text-center">
              <video
                src="/media/hero.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // Fallback if local MP4 file doesn't exist yet
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col items-center gap-3 text-stone-400">
                <Sparkles className="w-10 h-10 text-[#F4C26B]" />
                <p className="font-serif_jp text-sm text-stone-300 max-w-md">
                  Drop your custom cinematic trailer into <code className="text-[#F4C26B] font-mono text-xs">/public/media/hero.mp4</code>.
                  The 3D procedural WebGL world is rendered live behind this modal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
