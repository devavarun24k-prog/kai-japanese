// src/components/common/Navbar.tsx
// Streamlined Midnight Matsuri + Sumi-e Navbar
// Keeps visible ONLY: Logo, Streak, Level/XP bar, Display Popover, Profile/Logout
// Consolidates: Sync, Language mode, Furigana, Romaji, Sound, Guide, and Theme into "Display" popover
import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Languages,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  WifiOff,
  CloudUpload,
  Compass,
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { platformService } from '../../services/platformService';
import { storageService } from '../../services/storageService';

interface NavbarProps {
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { isAuthenticated, logout, profile } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(() => platformService.isOnline());
  const [pendingSync, setPendingSync] = useState<number>(() => storageService.getPendingSyncCount());
  const [isDisplayOpen, setIsDisplayOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  // Close popover on outside click or escape
  useEffect(() => {
    if (!isDisplayOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsDisplayOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDisplayOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDisplayOpen]);

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
    english: 'English Only',
    telugu: 'తెలుగు (Telugu Only)'
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F3EBDD]/90 dark:bg-[#0A101C]/90 backdrop-blur-md border-b border-[#DDD2B8] dark:border-[#1C2945] px-4 lg:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* ===================================================================
            1. LOGO & BRAND IDENTITY
            =================================================================== */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => setActiveSection('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark flex items-center justify-center shadow-vermilion group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="font-serif_jp font-bold text-white text-lg tracking-wider">界</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-[#14110F] dark:text-[#FAF5ED] font-serif_jp">
                KAI
              </span>
              <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-kai-vermilion-bg dark:bg-[#141D33] text-kai-vermilion-dark dark:text-kai-vermilion-light border border-kai-vermilion/20">
                マスター
              </span>
            </div>
            <p className="text-3xs text-[#6B6358] dark:text-[#94A3B8] hidden sm:block">
              Learn • Think • Master Japanese
            </p>
          </div>
        </div>

        {/* Floating XP Rewards notification */}
        <div className="fixed top-16 right-6 z-50 pointer-events-none flex flex-col gap-2">
          {xpNotifications.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-[#141D33] border border-kai-gold shadow-washi-lg px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#14110F] dark:text-[#FAF5ED] animate-bounce"
            >
              <Sparkles size={16} className="text-kai-gold" />
              <span>+{note.amount} XP</span>
              <span className="text-[#6B6358] dark:text-[#94A3B8] font-normal text-2xs">
                {note.message}
              </span>
            </div>
          ))}
        </div>

        {/* ===================================================================
            2. VISIBLE CONTROLS: STREAK, LEVEL/XP BAR, DISPLAY POPOVER, LOGOUT
            =================================================================== */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Flame Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-[#141D33] border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 text-xs font-bold shadow-sm"
            title={`${stats.streak_days} Day Study Streak!`}
          >
            <Flame size={15} className="fill-orange-500 text-orange-500 animate-pulse" />
            <span>{stats.streak_days}d</span>
          </div>

          {/* Level & XP Progress Bar */}
          <div
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#E8DEC8]/70 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370]/60 text-[#14110F] dark:text-[#FAF5ED] text-xs shadow-sm"
            title={`Total XP: ${stats.total_xp}`}
          >
            <span className="font-semibold text-xs font-mono text-[#1E2C4A] dark:text-[#E2BA4E]">
              Lv.{stats.level}
            </span>
            <div className="w-16 sm:w-20 h-2 bg-stone-300/80 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-kai-vermilion to-kai-gold transition-all duration-500"
                style={{ width: `${Math.min(100, stats.total_xp % 100)}%` }}
              />
            </div>
            <span className="font-mono text-2xs opacity-80 hidden sm:inline">
              {stats.total_xp} XP
            </span>
          </div>

          {/* =================================================================
              CONSOLIDATED "DISPLAY" POPOVER TRIGGER
              ================================================================= */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setIsDisplayOpen((prev) => !prev)}
              aria-expanded={isDisplayOpen}
              aria-label="Display & Preferences Settings"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm active:scale-95 ${
                isDisplayOpen
                  ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion'
                  : 'bg-white dark:bg-[#141D33] border-[#DDD2B8] dark:border-[#2E4370]/60 text-[#14110F] dark:text-[#FAF5ED] hover:border-kai-vermilion'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Display</span>
              {/* Indicator dot if offline or pending sync */}
              {(!isOnline || pendingSync > 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {/* Popover Dropdown Panel */}
            {isDisplayOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi-lg p-4 space-y-4 z-50 text-xs text-[#14110F] dark:text-[#FAF5ED] animate-in fade-in slide-in-from-top-2 duration-150 select-none"
                role="dialog"
                aria-label="Display & Study Controls"
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-[#DDD2B8] dark:border-[#2E4370]/60 pb-2.5">
                  <span className="font-serif_jp font-bold text-xs uppercase tracking-wider text-[#6B6358] dark:text-[#C59B27]">
                    Display &amp; Audio Controls
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDisplayOpen(false)}
                    className="p-1 rounded-lg text-[#6B6358] hover:text-[#14110F] dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* 1. Sync & Offline State */}
                <div className="flex items-center justify-between py-1 border-b border-[#DDD2B8]/60 dark:border-[#2E4370]/40">
                  <div className="flex items-center gap-2">
                    {!isOnline ? (
                      <WifiOff size={15} className="text-amber-600" />
                    ) : (
                      <CloudUpload size={15} className="text-[#2D7A4D] dark:text-[#3C9B64]" />
                    )}
                    <span className="font-medium">Cloud Storage &amp; Sync</span>
                  </div>
                  <div>
                    {!isOnline ? (
                      <span className="text-3xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Offline Mode
                      </span>
                    ) : pendingSync > 0 ? (
                      <button
                        onClick={() =>
                          storageService
                            .flushOfflineSyncQueue()
                            .then((r) => setPendingSync(r.remaining))
                        }
                        className="text-3xs font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-300 hover:bg-blue-200 transition-colors"
                      >
                        Sync {pendingSync}
                      </button>
                    ) : (
                      <span className="text-3xs font-mono text-[#2D7A4D] dark:text-[#3C9B64] flex items-center gap-1">
                        <Check size={12} /> Synced
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Language Mode Switcher */}
                <div className="space-y-1.5 py-1 border-b border-[#DDD2B8]/60 dark:border-[#2E4370]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-1.5">
                      <Languages size={14} className="text-kai-vermilion" />
                      <span>Explanations Language</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    {(['bilingual', 'english', 'telugu'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDisplayMode(m)}
                        className={`py-1.5 px-2 rounded-xl text-3xs font-medium text-center transition-all ${
                          displayMode === m
                            ? 'bg-kai-vermilion text-white font-bold shadow-sm'
                            : 'bg-white/80 dark:bg-[#1C2945] text-[#524B42] dark:text-stone-300 border border-[#DDD2B8] dark:border-[#2E4370]/60 hover:border-kai-vermilion'
                        }`}
                      >
                        {m === 'bilingual' ? 'Bilingual' : m === 'english' ? 'English' : 'తెలుగు'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Furigana & Romaji Toggles */}
                <div className="grid grid-cols-2 gap-2 py-1 border-b border-[#DDD2B8]/60 dark:border-[#2E4370]/40">
                  {/* Furigana */}
                  <button
                    type="button"
                    onClick={() => setFuriganaEnabled(!furiganaEnabled)}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                      furiganaEnabled
                        ? 'bg-kai-vermilion-bg border-kai-vermilion/40 text-kai-vermilion-dark font-bold'
                        : 'bg-white/80 dark:bg-[#1C2945] border-[#DDD2B8] dark:border-[#2E4370]/60 text-[#6B6358] dark:text-stone-400'
                    }`}
                  >
                    <span>ふりがな Furigana</span>
                    {furiganaEnabled && <Check size={14} className="text-kai-vermilion" />}
                  </button>

                  {/* Romaji */}
                  <button
                    type="button"
                    onClick={() => setRomajiEnabled(!romajiEnabled)}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                      romajiEnabled
                        ? 'bg-kai-indigo-bg border-kai-indigo/40 text-kai-indigo dark:text-indigo-300 font-bold'
                        : 'bg-white/80 dark:bg-[#1C2945] border-[#DDD2B8] dark:border-[#2E4370]/60 text-[#6B6358] dark:text-stone-400'
                    }`}
                  >
                    <span>Romaji Guide</span>
                    {romajiEnabled && <Check size={14} className="text-kai-indigo" />}
                  </button>
                </div>

                {/* 4. Sound & Theme Quick Rows */}
                <div className="flex items-center justify-between py-1 border-b border-[#DDD2B8]/60 dark:border-[#2E4370]/40">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? (
                      <Volume2 size={16} className="text-[#2D7A4D]" />
                    ) : (
                      <VolumeX size={16} className="text-stone-400" />
                    )}
                    <span className="font-medium">Sound Effects</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      soundEnabled
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {soundEnabled ? 'Enabled' : 'Muted'}
                  </button>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#DDD2B8]/60 dark:border-[#2E4370]/40">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Moon size={16} className="text-indigo-400" />
                    ) : (
                      <Sun size={16} className="text-amber-500" />
                    )}
                    <span className="font-medium">Color Atmosphere</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/90 dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370]/60 text-[#14110F] dark:text-[#FAF5ED] hover:border-kai-vermilion transition-colors"
                  >
                    {theme === 'dark' ? 'Midnight Sumi-e' : 'Washi Paper Light'}
                  </button>
                </div>

                {/* 5. Welcome Guide / Introduction Portal */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDisplayOpen(false);
                      setActiveSection('landing');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white/90 dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370] text-[#14110F] dark:text-[#FAF5ED] hover:border-kai-vermilion hover:text-kai-vermilion transition-all flex items-center justify-center gap-2 text-xs font-medium"
                  >
                    <Compass size={14} className="text-kai-vermilion" />
                    <span>Open Welcome Guide Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile / Logout Button */}
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-[#6B6358] dark:text-[#94A3B8] hover:text-kai-vermilion transition-colors"
              title="Secure Logout"
            >
              <LogOut size={16} />
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
