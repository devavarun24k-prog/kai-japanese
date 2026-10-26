// src/context/LearningContext.tsx
// Global learning state context managing progress, XP, display modes, and sound
import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserStats, DisplayMode, SkillType, LearningAttempt, FSRSRating } from '../types';
import { storageService } from '../services/storageService';
import { soundEffects } from '../services/soundEffects';
import { fsrsService } from '../services/fsrsService';

export type ActiveSection =
  | 'dashboard'
  | 'kana'
  | 'vocab'
  | 'kanji'
  | 'grammar'
  | 'sentence'
  | 'tutor'
  | 'speaking'
  | 'handwriting'
  | 'listening'
  | 'reading'
  | 'rpg_games'
  | 'reviews'
  | 'analytics'
  | 'planner'
  | 'jlpt';

interface XPNotification {
  id: string;
  amount: number;
  message: string;
}

interface LearningContextType {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  stats: UserStats;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  romajiEnabled: boolean;
  setRomajiEnabled: (enabled: boolean) => void;
  furiganaEnabled: boolean;
  setFuriganaEnabled: (enabled: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  awardXP: (amount: number, reason: string) => void;
  xpNotifications: XPNotification[];
  recordAttempt: (attempt: {
    item_id: string;
    item_type: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'sentence' | 'listening' | 'speaking';
    skill: SkillType;
    question_type: string;
    user_response: string;
    expected_response: string;
    is_correct: boolean;
    error_category?: string;
    response_time_ms: number;
    hint_used: boolean;
    retry_count: number;
  }) => void;
  rateFSRSCard: (
    itemId: string,
    itemType: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'mistake',
    rating: FSRSRating
  ) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [stats, setStats] = useState<UserStats>(() => storageService.getStats());
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [displayMode, setDisplayModeState] = useState<DisplayMode>(profile.display_mode || 'bilingual');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(profile.sound_enabled ?? true);
  const [romajiEnabled, setRomajiEnabledState] = useState<boolean>(profile.romaji_enabled ?? true);
  const [furiganaEnabled, setFuriganaEnabledState] = useState<boolean>(profile.furigana_enabled ?? true);
  const [theme, setThemeState] = useState<'light' | 'dark'>(profile.theme || 'light');
  const [xpNotifications, setXpNotifications] = useState<XPNotification[]>([]);

  useEffect(() => {
    soundEffects.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setDisplayMode = (mode: DisplayMode) => {
    setDisplayModeState(mode);
    const updated = { ...profile, display_mode: mode };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundEffects.setMuted(!enabled);
    const updated = { ...profile, sound_enabled: enabled };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const setRomajiEnabled = (enabled: boolean) => {
    setRomajiEnabledState(enabled);
    const updated = { ...profile, romaji_enabled: enabled };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const setFuriganaEnabled = (enabled: boolean) => {
    setFuriganaEnabledState(enabled);
    const updated = { ...profile, furigana_enabled: enabled };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    const updated = { ...profile, theme: t };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const awardXP = (amount: number, reason: string) => {
    const result = storageService.addXP(amount);
    setStats(storageService.getStats());

    // Sound effect
    if (result.leveledUp) {
      soundEffects.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      soundEffects.playCorrect();
    }

    // Add floating notification
    const noteId = `xp_${Date.now()}`;
    setXpNotifications((prev) => [...prev, { id: noteId, amount, message: reason }]);
    setTimeout(() => {
      setXpNotifications((prev) => prev.filter((n) => n.id !== noteId));
    }, 3000);
  };

  const recordAttempt = (attempt: Parameters<LearningContextType['recordAttempt']>[0]) => {
    storageService.logAttempt(attempt);
    setStats(storageService.getStats());
  };

  const rateFSRSCard = (
    itemId: string,
    itemType: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'mistake',
    rating: FSRSRating
  ) => {
    const cards = storageService.getCards();
    let card = cards.find((c) => c.item_id === itemId && c.item_type === itemType);
    if (!card) {
      card = fsrsService.createCard(itemId, itemType);
    }
    const updated = fsrsService.schedule(card, rating);
    storageService.upsertCard(updated);
    setStats(storageService.getStats());
  };

  return (
    <LearningContext.Provider
      value={{
        activeSection,
        setActiveSection,
        stats,
        displayMode,
        setDisplayMode,
        soundEnabled,
        setSoundEnabled,
        romajiEnabled,
        setRomajiEnabled,
        furiganaEnabled,
        setFuriganaEnabled,
        theme,
        setTheme,
        awardXP,
        xpNotifications,
        recordAttempt,
        rateFSRSCard
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error('useLearning must be used within a LearningProvider');
  return ctx;
};
