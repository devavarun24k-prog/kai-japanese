import React, { useState, useEffect } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Languages,
  Sun,
  Moon,
  LogOut,
  Bell,
  Sparkles,
  Repeat,
  WifiOff,
  CloudUpload,
  Minimize2,
  Maximize2,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { platformService } from '../../services/platformService';
import { storageService } from '../../services/storageService';

interface NavbarProps {
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenAuth }) => {
  const { isAuthenticated, logout, profile } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(() => platformService.isOnline());
  const [pendingSync, setPendingSync] = useState<number>(() => storageService.getPendingSyncCount());
  const [isQuickPractice, setIsQuickPractice] = useState<boolean>(false);

  useEffect(() => {
    const unsub = platformService.onNetworkStatusChange((online) => {
      setIsOnline(online);
      if (online) {
        storageService.flushOfflineSyncQueue().then((res) => {
          setPendingSync(res.remaining);
        });
      }
    });

    const interval = setInterval(() => {
      setPendingSync(storageService.getPendingSyncCount());
    }, 5000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);
  const {
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
    setActiveSection,
    xpNotifications
  } = useLearning();

  const cycleDisplayMode = () => {
    if (displayMode === 'bilingual') setDisplayMode('english');
    else if (displayMode === 'english') setDisplayMode('telugu');
    else setDisplayMode('bilingual');
  };

  const displayModeLabels = {
    bilingual: 'ద్విభాషా (Bilingual)',
    english: 'English',
    telugu: 'తెలుగు (Telugu)'
  };

  return (
    <header className="sticky top-0 z-30 bg-kai-bg/90 dark:bg-kai-dark-bg/90 backdrop-blur-md border-b border-kai-border dark:border-kai-dark-border px-4 lg:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo and Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveSection('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark flex items-center justify-center shadow-vermilion group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="font-serif_jp font-bold text-white text-lg tracking-wider">界</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                KAI
              </span>
              <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-kai-vermilion-bg dark:bg-kai-dark-card text-kai-vermilion-dark dark:text-kai-vermilion-light border border-kai-vermilion/20">
                マスター
              </span>
            </div>
            <p className="text-2xs text-kai-muted dark:text-kai-dark-muted hidden sm:block">
              Learn • Think • Master Japanese
            </p>
          </div>
        </div>

        {/* Floating XP Rewards notification */}
        <div className="fixed top-16 right-6 z-50 pointer-events-none flex flex-col gap-2">
          {xpNotifications.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-kai-dark-card border border-kai-gold shadow-washi-lg px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold text-kai-ink dark:text-kai-dark-ink animate-bounce"
            >
              <Sparkles size={16} className="text-kai-gold" />
              <span>+{note.amount} XP</span>
              <span className="text-kai-muted dark:text-kai-dark-muted font-normal text-2xs">
                {note.message}
              </span>
            </div>
          ))}
        </div>

        {/* Center / Right Stats & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline / Sync State Indicator */}
          {!isOnline ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-2xs font-mono font-semibold"
              title="Offline Mode: Progress is safely preserved in local storage and will automatically sync when reconnected"
            >
              <WifiOff size={13} className="text-amber-600" />
              <span className="hidden md:inline">Offline (Local Active)</span>
            </div>
          ) : pendingSync > 0 ? (
            <button
              onClick={() => storageService.flushOfflineSyncQueue().then((r) => setPendingSync(r.remaining))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-2xs font-mono font-semibold hover:bg-blue-100 transition-colors"
              title={`${pendingSync} change(s) queued for cloud sync. Click to sync now.`}
            >
              <CloudUpload size={13} className="animate-pulse" />
              <span>{pendingSync} to sync</span>
            </button>
          ) : null}

          {/* Windows Desktop Quick Practice Mini-Window Toggle */}
          {platformService.isElectron() && (
            <button
              onClick={() => {
                const next = !isQuickPractice;
                setIsQuickPractice(next);
                platformService.toggleQuickPracticeMode(next);
              }}
              className="p-1.5 rounded-xl border border-kai-border text-kai-muted hover:text-kai-ink dark:hover:text-white transition-colors"
              title={isQuickPractice ? 'Restore Full Learning Studio' : 'Toggle Compact Quick Practice Mini-Window'}
            >
              {isQuickPractice ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
            </button>
          )}

          {/* Reviews Due Pill */}
          {stats.reviews_due_count > 0 && (
            <button
              onClick={() => setActiveSection('reviews')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium hover:bg-amber-100 transition-colors animate-pulse"
              title="Cards due for FSRS review"
            >
              <Repeat size={14} />
              <span>{stats.reviews_due_count} Due</span>
            </button>
          )}

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-kai-dark-card border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 text-xs font-bold"
            title={`${stats.streak_days} Day Study Streak!`}
          >
            <Flame size={15} className="fill-orange-500 text-orange-500 animate-pulse" />
            <span>{stats.streak_days}d</span>
          </div>

          {/* Level & XP Badge */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-kai-indigo-bg dark:bg-kai-dark-card border border-kai-indigo/20 dark:border-kai-dark-border text-kai-indigo dark:text-indigo-300 text-xs"
            title={`Total: ${stats.total_xp} XP`}
          >
            <span className="font-semibold">Lv.{stats.level}</span>
            <div className="w-16 h-1.5 bg-kai-indigo/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-kai-indigo dark:bg-indigo-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.total_xp % 100))}%` }}
              />
            </div>
            <span className="font-mono text-2xs opacity-80">{stats.total_xp} XP</span>
          </div>

          {/* Trilingual Display Mode Switcher */}
          <button
            onClick={cycleDisplayMode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border hover:border-kai-vermilion text-xs font-medium text-kai-ink dark:text-kai-dark-ink transition-colors shadow-sm"
            title="Toggle Language: Bilingual (English + Telugu) / English / Telugu"
          >
            <Languages size={15} className="text-kai-vermilion" />
            <span className="hidden sm:inline">{displayModeLabels[displayMode]}</span>
          </button>

          {/* Furigana Quick Toggle */}
          <button
            onClick={() => setFuriganaEnabled(!furiganaEnabled)}
            className={`hidden lg:flex items-center px-2 py-1 rounded-lg text-xs font-mono transition-colors border ${
              furiganaEnabled
                ? 'bg-kai-vermilion-bg border-kai-vermilion/30 text-kai-vermilion-dark dark:text-kai-vermilion-light font-semibold'
                : 'bg-transparent border-kai-border dark:border-kai-dark-border text-kai-faint'
            }`}
            title="Toggle Japanese Furigana readings"
          >
            ふりがな
          </button>

          {/* Romaji Quick Toggle */}
          <button
            onClick={() => setRomajiEnabled(!romajiEnabled)}
            className={`hidden lg:flex items-center px-2 py-1 rounded-lg text-xs font-mono transition-colors border ${
              romajiEnabled
                ? 'bg-kai-indigo-bg border-kai-indigo/30 text-kai-indigo dark:text-indigo-300 font-semibold'
                : 'bg-transparent border-kai-border dark:border-kai-dark-border text-kai-faint'
            }`}
            title="Toggle Romaji pronunciation guide"
          >
            Romaji
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-kai-muted dark:text-kai-dark-muted hover:text-kai-ink dark:hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* Welcome Guide / Introduction Portal */}
          <button
            onClick={() => setActiveSection('landing')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1A2433] hover:bg-stone-200 dark:hover:bg-[#253245] text-kai-ink dark:text-[#F0E5CE] text-xs font-medium shadow-sm hover:scale-105 active:scale-95 transition-all border border-[#E5DEC9] dark:border-[#2D3A4F]"
            title="Open Welcome Guide & Interactive Introduction"
          >
            <Compass size={13} className="text-[#D9483B]" />
            <span>Guide</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-kai-muted dark:text-kai-dark-muted hover:text-kai-ink dark:hover:text-white transition-colors"
            title="Toggle Light / Sumi-e Dark Theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Logout / User Account */}
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-kai-muted hover:text-kai-vermilion transition-colors"
              title="Secure Logout"
            >
              <LogOut size={17} />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white text-xs font-semibold shadow-vermilion transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
