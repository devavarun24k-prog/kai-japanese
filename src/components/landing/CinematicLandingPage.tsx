// src/components/landing/CinematicLandingPage.tsx
// Full Cinematic Japanese Landing Page Orchestrator for KAI
// Seamlessly sequences Scenes 1-4 with floating audio & scene navigation,
// dark ornamental transitions, washi separators, and direct portals to learning modules.
import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Compass, ArrowUp, Sparkles, BookOpen, Layers } from 'lucide-react';
import { SceneHeroJapan } from './SceneHeroJapan';
import { SceneHiraganaWashi } from './SceneHiraganaWashi';
import { SceneJapaneseStreet } from './SceneJapaneseStreet';
import { SceneLearningCitadel } from './SceneLearningCitadel';
import { KaiMonCrest } from './OrnamentalElements';
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

  // Scene Section Refs for smooth cinematic scrolling
  const scene1Ref = useRef<HTMLDivElement | null>(null);
  const scene2Ref = useRef<HTMLDivElement | null>(null);
  const scene3Ref = useRef<HTMLDivElement | null>(null);
  const scene4Ref = useRef<HTMLDivElement | null>(null);

  const scrollToScene = (ref: React.RefObject<HTMLDivElement | null>) => {
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

  const handlePortalSelect = (moduleId: ActiveSection) => {
    onEnterApp(moduleId);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0A0E17] text-[#F0E5CE] font-sans overflow-x-hidden selection:bg-[#A84A3A] selection:text-white">
      {/* Floating Cinematic Audio & Quick Nav Header */}
      <header className="fixed top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-none">
        {/* Brand Crest Pill */}
        <div
          onClick={() => scrollToScene(scene1Ref)}
          className="pointer-events-auto cursor-pointer px-3.5 py-1.5 rounded-full bg-[#101722]/85 hover:bg-[#101722] border border-[#B99A60]/40 backdrop-blur-md text-xs font-serif_jp flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <KaiMonCrest size={24} />
          <span className="font-bold tracking-wider text-[#F0E5CE]">KAI</span>
          <span className="text-3xs font-mono text-[#B99A60] hidden sm:inline">| 日本語の世界</span>
        </div>

        {/* Center Scene Navigation Dots (Desktop) */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#101722]/85 border border-[#B99A60]/40 backdrop-blur-md shadow-lg text-3xs font-serif_jp text-[#F0E5CE]">
          <button
            onClick={() => scrollToScene(scene1Ref)}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-[#B99A60] transition-colors"
          >
            第一景 • 序章
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => scrollToScene(scene2Ref)}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-[#B99A60] transition-colors"
          >
            第二景 • 五十音
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => scrollToScene(scene3Ref)}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-[#B99A60] transition-colors"
          >
            第三景 • 日常
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => scrollToScene(scene4Ref)}
            className="px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-[#B99A60] transition-colors"
          >
            第四景 • 学舎
          </button>
        </nav>

        {/* Right Controls: Audio Mute & Enter App */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-full bg-[#101722]/85 hover:bg-[#101722] border border-[#B99A60]/40 backdrop-blur-md text-[#B99A60] hover:text-[#F0E5CE] transition-all shadow-lg hover:scale-105 active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Direct CTA */}
          <button
            onClick={() => onEnterApp('dashboard')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#A84A3A] to-[#8C3A2D] hover:from-[#B84E3E] text-white text-xs font-serif_jp font-semibold tracking-wider shadow-lg border border-[#F0E5CE]/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <Compass size={14} />
            <span>{isAuthenticated ? '学舎へ入る' : '学習を始める'}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          SCENE 1: ENTER JAPAN (日本への入口)
          ========================================================================= */}
      <div ref={scene1Ref}>
        <SceneHeroJapan
          onBeginJourney={() => scrollToScene(scene2Ref)}
          onEnterPlatform={() => onEnterApp('dashboard')}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* =========================================================================
          SCENE 2: DISCOVER THE WRITING SYSTEM (文字の発見 — Hiragana)
          ========================================================================= */}
      <div ref={scene2Ref}>
        <SceneHiraganaWashi
          onGoToKanaAcademy={() => onEnterApp('kana')}
        />
      </div>

      {/* =========================================================================
          SCENE 3: EXPERIENCE JAPANESE EVERYDAY LIFE (日常の情景)
          ========================================================================= */}
      <div ref={scene3Ref}>
        <SceneJapaneseStreet />
      </div>

      {/* =========================================================================
          SCENE 4: ENTER THE LEARNING PLATFORM (学舎の門)
          ========================================================================= */}
      <div ref={scene4Ref}>
        <SceneLearningCitadel
          onSelectModule={handlePortalSelect}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* Cinematic Footer */}
      <footer className="relative py-12 px-6 bg-[#070A10] border-t border-[#B99A60]/30 text-center text-xs text-[#F0E5CE]/60 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <KaiMonCrest size={32} />
          <span className="font-serif_jp font-bold text-sm tracking-widest text-[#F0E5CE]">
            KAI — 日本語マスター
          </span>
        </div>

        <p className="max-w-md mx-auto text-3xs font-sans text-[#F0E5CE]/50 leading-relaxed">
          Personal Japanese Mastery Platform. Combining traditional Japanese illustrated aesthetics, intelligent spaced repetition (FSRS), and trilingual support.
        </p>

        <div className="flex items-center justify-center gap-4 text-3xs font-mono text-[#B99A60]">
          <button onClick={() => scrollToScene(scene1Ref)} className="hover:underline flex items-center gap-1">
            <ArrowUp size={11} /> 序章へ戻る (Back to Top)
          </button>
          <span>•</span>
          <button onClick={() => onEnterApp('kana')} className="hover:underline">
            かな道場 (Kana Academy)
          </button>
          <span>•</span>
          <button onClick={() => onEnterApp('dashboard')} className="hover:underline">
            ダッシュボード (Dashboard)
          </button>
        </div>
      </footer>
    </div>
  );
};
