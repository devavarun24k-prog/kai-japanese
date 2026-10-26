// src/App.tsx
// Main application shell coordinating modules, navigation, and state
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningProvider, useLearning } from './context/LearningContext';
import { platformService } from './services/platformService';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGateway } from './components/auth/AuthGateway';
import { SettingsModal } from './components/settings/SettingsModal';

// Core and Fast Modules
import { HomeDashboard } from './components/dashboard/HomeDashboard';
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
  <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border animate-pulse space-y-4 max-w-2xl mx-auto shadow-washi">
    <div className="h-6 w-48 bg-stone-200 dark:bg-stone-800 rounded-xl" />
    <div className="h-4 w-72 bg-stone-100 dark:bg-stone-800/60 rounded-lg" />
    <div className="h-48 w-full bg-stone-50 dark:bg-stone-800/40 rounded-2xl" />
  </div>
);

import { Settings, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeSection, setActiveSection } = useLearning();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showAuthGateway, setShowAuthGateway] = useState<boolean>(false);

  // Cross-Platform Back Button Handler (Mobile/Android & Universal Navigation)
  useEffect(() => {
    const unsub = platformService.registerBackButtonHandler(() => {
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
  }, [isSettingsOpen, isAuthModalOpen, showAuthGateway, activeSection]);

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
      <div className="min-h-screen bg-kai-bg dark:bg-kai-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark flex items-center justify-center text-white font-serif_jp font-bold text-xl shadow-vermilion animate-pulse">
            界
          </div>
          <span className="text-xs font-mono text-kai-muted">Loading KAI System...</span>
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
    <div className="min-h-screen flex flex-col bg-kai-bg dark:bg-kai-dark-bg text-kai-ink dark:text-kai-dark-ink transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Editorial Sidebar on tablet & desktop */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full">
          <React.Suspense fallback={<ModuleLoadingSkeleton />}>
            {renderModule()}
          </React.Suspense>
        </main>
      </div>

      {/* Floating Settings Button in corner */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border text-kai-muted hover:text-kai-vermilion shadow-washi-lg transition-transform hover:scale-105"
        title="Settings & Display Preferences"
      >
        <Settings size={20} />
      </button>

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
