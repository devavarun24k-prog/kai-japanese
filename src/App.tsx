// src/App.tsx
// Main application shell coordinating modules, navigation, and state
// Theme: "Midnight Matsuri + Sumi-e"
// Light mode: Washi (#F3EBDD) with static WashiTexture
// Dark mode: Deep ai-indigo gradient with faint Seigaiha waves
// Smooth page transitions via AnimatePresence (fade + 8px slide, 180ms)
// Command palette on Ctrl/Cmd+K
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningProvider, useLearning } from './context/LearningContext';
import { platformService } from './services/platformService';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGateway } from './components/auth/AuthGateway';
import { SettingsModal } from './components/settings/SettingsModal';
import { CommandPalette } from './components/common/CommandPalette';
import { WashiTexture, Seigaiha } from './components/fx';

// Core and Fast Modules
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { StartHerePath } from './components/startHere/StartHerePath';
import { KanaAcademy } from './components/kana/KanaAcademy';
import { VocabAcademy } from './components/vocab/VocabAcademy';
import { GrammarLab } from './components/grammar/GrammarLab';
import { SentenceForge } from './components/sentence/SentenceForge';
import { AITutorChat } from './components/tutor/AITutorChat';
import { SpacedRepetitionDeck } from './components/reviews/SpacedRepetitionDeck';
import { WeaknessAnalytics } from './components/analytics/WeaknessAnalytics';
import { StudyPlanner } from './components/planner/StudyPlanner';
import { CinematicLandingPage } from './components/landing/CinematicLandingPage';

// Code-split Heavy Modules via React.lazy
const KanjiDojo = React.lazy(() => import('./components/kanji/KanjiDojo').then((m) => ({ default: m.KanjiDojo })));
const SpeakingStudio = React.lazy(() => import('./components/speaking/SpeakingStudio').then((m) => ({ default: m.SpeakingStudio })));
const HandwritingStudio = React.lazy(() => import('./components/handwriting/HandwritingStudio').then((m) => ({ default: m.HandwritingStudio })));
const ListeningLab = React.lazy(() => import('./components/listening/ListeningLab').then((m) => ({ default: m.ListeningLab })));
const ReadingTheatre = React.lazy(() => import('./components/reading/ReadingTheatre').then((m) => ({ default: m.ReadingTheatre })));
const RPGGameHub = React.lazy(() => import('./components/games/RPGGameHub').then((m) => ({ default: m.RPGGameHub })));
const JLPTArena = React.lazy(() => import('./components/jlpt/JLPTArena').then((m) => ({ default: m.JLPTArena })));

const ModuleLoadingSkeleton: React.FC = () => (
  <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] animate-pulse space-y-4 max-w-2xl mx-auto shadow-washi">
    <div className="h-6 w-48 bg-stone-200 dark:bg-stone-800 rounded-xl" />
    <div className="h-4 w-72 bg-stone-100 dark:bg-stone-800/60 rounded-lg" />
    <div className="h-48 w-full bg-stone-50 dark:bg-stone-800/40 rounded-2xl" />
  </div>
);

const AppContent: React.FC = () => {
  const { activeSection, setActiveSection } = useLearning();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showAuthGateway, setShowAuthGateway] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Listen for Ctrl+K or Cmd+K to open Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cross-Platform Back Button Handler (Mobile/Android & Universal Navigation)
  useEffect(() => {
    const unsub = platformService.registerBackButtonHandler(() => {
      if (isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
        return true;
      }
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return true;
      }
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return true;
      }
      if (showAuthGateway) {
        setShowAuthGateway(false);
        return true;
      }
      if (activeSection !== 'dashboard') {
        setActiveSection('dashboard');
        return true;
      }
      return false; // On dashboard: allow standard exit
    });
    return unsub;
  }, [isCommandPaletteOpen, isSettingsOpen, isAuthModalOpen, showAuthGateway, activeSection, setActiveSection]);

  // Render active module
  const renderModule = () => {
    switch (activeSection) {
      case 'landing':
        return (
          <CinematicLandingPage
            onEnterApp={(target) => setActiveSection(target || 'dashboard')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            isAuthenticated={isAuthenticated}
          />
        );
      case 'dashboard':
        return <HomeDashboard />;
      case 'start_here':
        return <StartHerePath />;
      case 'kana':
        return <KanaAcademy />;
      case 'vocab':
        return <VocabAcademy />;
      case 'kanji':
        return <KanjiDojo />;
      case 'grammar':
        return <GrammarLab />;
      case 'sentence':
        return <SentenceForge />;
      case 'tutor':
        return <AITutorChat />;
      case 'speaking':
        return <SpeakingStudio />;
      case 'handwriting':
        return <HandwritingStudio />;
      case 'listening':
        return <ListeningLab />;
      case 'reading':
        return <ReadingTheatre />;
      case 'rpg_games':
        return <RPGGameHub />;
      case 'reviews':
        return <SpacedRepetitionDeck />;
      case 'analytics':
        return <WeaknessAnalytics />;
      case 'planner':
        return <StudyPlanner />;
      case 'jlpt':
        return <JLPTArena />;
      default:
        return <HomeDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3EBDD] dark:bg-[#0A101C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark flex items-center justify-center text-white font-serif_jp font-bold text-xl shadow-vermilion animate-pulse">
            界
          </div>
          <span className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
            Loading KAI System...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showAuthGateway) {
      return <AuthGateway onBackToLanding={() => setShowAuthGateway(false)} />;
    }
    return (
      <CinematicLandingPage
        onEnterApp={(target) => {
          if (target && target !== 'dashboard') {
            setActiveSection(target);
          }
          setShowAuthGateway(true);
        }}
        onOpenAuth={() => setShowAuthGateway(true)}
        isAuthenticated={false}
      />
    );
  }

  // Full-screen Cinematic Experience for authenticated users when requested
  if (activeSection === 'landing') {
    return (
      <CinematicLandingPage
        onEnterApp={(target) => setActiveSection(target || 'dashboard')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAuthenticated={true}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F3EBDD] dark:bg-gradient-to-b dark:from-[#0A101C] dark:via-[#0E1626] dark:to-[#141D33] text-[#14110F] dark:text-[#FAF5ED] transition-colors duration-200">
      {/* Light mode: Static Washi paper texture overlay */}
      <div className="dark:hidden">
        <WashiTexture opacity={0.06} tone="light" />
      </div>

      {/* Dark mode: Subtle Seigaiha ocean waves pattern overlay */}
      <div className="hidden dark:block">
        <Seigaiha color="#2E4370" opacity={0.05} size={54} />
      </div>

      {/* Top Streamlined Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        {/* Editorial Sidebar on tablet & desktop */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area with AnimatePresence page transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                ease: 'easeOut'
              }}
            >
              <React.Suspense fallback={<ModuleLoadingSkeleton />}>
                {renderModule()}
              </React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette on Ctrl/Cmd+K */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <AppContent />
      </LearningProvider>
    </AuthProvider>
  );
}

export default App;
