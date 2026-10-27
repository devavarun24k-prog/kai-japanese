// src/components/jlpt/JLPTCalendarCard.tsx
// Dashboard side-column card for official JLPT registration, test countdown, and reminder milestones
// Supports 4 states: 'open', 'applied', 'closed_not_applied', 'not_announced'
// Alerts when verification date is >60 days old, and manages 30/14/7-day local reminder banners
import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  ExternalLink,
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  JLPTCalendarEntry,
  JLPT_CALENDAR_ENTRIES,
  AVAILABLE_CITIES,
  AVAILABLE_SESSIONS,
  JLPTUserStatus,
  JLPTUserPreferences,
  getJLPTCardState,
  getDaysUntilExam,
  isCalendarDataStale,
  checkJLPTReminders
} from '../../data/jlptCalendar';
import { useLearning } from '../../context/LearningContext';
import { platformService } from '../../services/platformService';
import { soundEffects } from '../../services/soundEffects';
import { WashiTexture } from '../fx';

const STORAGE_KEY_JLPT_PREFS = 'kai_user_jlpt_preferences';

export const JLPTCalendarCard: React.FC = () => {
  const { setActiveSection } = useLearning();

  // Load preferences from localStorage or default
  const [preferences, setPreferences] = useState<JLPTUserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JLPT_PREFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      targetLevel: 'N5',
      selectedCity: 'Hyderabad',
      selectedSession: '2026-12',
      status: 'planning',
      remindersEnabled: true,
      updatedAt: new Date().toISOString()
    };
  });

  const savePreferences = (updated: Partial<JLPTUserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY_JLPT_PREFS, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Find relevant calendar entry based on selected city & session
  const currentEntry: JLPTCalendarEntry = useMemo(() => {
    const match = JLPT_CALENDAR_ENTRIES.find(
      (e) => e.city.toLowerCase() === preferences.selectedCity.toLowerCase() && e.session === preferences.selectedSession
    );
    if (match) return match;

    // Fallback to first entry for session
    return (
      JLPT_CALENDAR_ENTRIES.find((e) => e.session === preferences.selectedSession) ||
      JLPT_CALENDAR_ENTRIES[0]
    );
  }, [preferences.selectedCity, preferences.selectedSession]);

  const cardState = useMemo(() => {
    return getJLPTCardState(currentEntry, preferences.status);
  }, [currentEntry, preferences.status]);

  const daysLeft = useMemo(() => {
    return getDaysUntilExam(currentEntry.examDate);
  }, [currentEntry.examDate]);

  const isStale = useMemo(() => {
    return isCalendarDataStale(currentEntry.lastVerified);
  }, [currentEntry.lastVerified]);

  const reminderAlert = useMemo(() => {
    if (!preferences.remindersEnabled || preferences.status === 'not_planning') return null;
    return checkJLPTReminders(currentEntry.examDate);
  }, [currentEntry.examDate, preferences.remindersEnabled, preferences.status]);

  // Dispatch system notification if milestone matches and user is planning/applied
  useEffect(() => {
    if (reminderAlert && preferences.remindersEnabled) {
      platformService.showNotification({
        title: `JLPT ${preferences.targetLevel} Alert (${preferences.selectedCity})`,
        body: reminderAlert.message
      });
    }
  }, [reminderAlert, preferences.targetLevel, preferences.selectedCity, preferences.remindersEnabled]);

  const handleStatusChange = (newStatus: JLPTUserStatus) => {
    soundEffects.playClick();
    savePreferences({ status: newStatus });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    savePreferences({ selectedCity: e.target.value });
  };

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    savePreferences({ selectedSession: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    savePreferences({ targetLevel: e.target.value as any });
  };

  return (
    <div className="relative p-5 rounded-3xl bg-[#F3EBDD] dark:bg-[#141D33] border border-[#C59B27]/60 shadow-sm space-y-4 overflow-hidden select-none">
      <WashiTexture opacity={0.06} tone="light" />

      {/* Card Header: Session and State Badge */}
      <div className="relative z-10 flex items-start justify-between gap-2 border-b border-[#DDD2B8] dark:border-[#2E4370]/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[#14110F] dark:text-[#FAF5ED] font-serif_jp font-bold text-sm">
            <Calendar size={15} className="text-kai-vermilion" />
            <span>JLPT Official Schedule</span>
          </div>
          <p className="text-3xs text-[#6B6358] dark:text-[#94A3B8]">
            {currentEntry.sessionNameJp}
          </p>
        </div>

        {/* 4-State Badge */}
        <span
          className={`text-4xs font-mono font-bold px-2 py-0.5 rounded-full border text-center ${cardState.badgeColor}`}
        >
          {cardState.label}
        </span>
      </div>

      {/* Stale Data Warning (null or >60 days) */}
      {isStale && (
        <div className="relative z-10 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-3xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Schedule Note:</strong> Verified schedule data is unconfirmed or older than 60 days. Please verify opening dates at the official host institution.
          </p>
        </div>
      )}

      {/* Unverified Entry Alert */}
      {currentEntry.unverified && (
        <div className="relative z-10 p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-300 text-3xs text-orange-900 dark:text-orange-200 flex items-center gap-1.5 font-semibold">
          <AlertCircle size={13} className="text-orange-600 flex-shrink-0" />
          <span>Unverified, confirm on the official site</span>
        </div>
      )}

      {/* In-App Milestone Reminder Banner (30, 14, 7 days) */}
      {reminderAlert && (
        <div className="relative z-10 p-2.5 rounded-2xl bg-kai-vermilion-bg dark:bg-red-950/40 border border-kai-vermilion/30 text-3xs text-kai-vermilion-dark dark:text-red-200 flex items-start gap-2 animate-pulse">
          <Bell size={14} className="text-kai-vermilion flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{reminderAlert.message}</p>
            <p className="font-telugu text-4xs opacity-80 mt-0.5">{reminderAlert.messageTe}</p>
          </div>
        </div>
      )}

      {/* Countdown and Test Details */}
      <div className="relative z-10 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/80 dark:bg-[#0E1626]/80 border border-[#DDD2B8] dark:border-[#2E4370]/50">
        <div>
          <span className="text-4xs font-mono uppercase text-[#6B6358] dark:text-[#94A3B8] block">
            Exam Date
          </span>
          <span className="text-xs font-bold font-mono text-[#14110F] dark:text-white">
            {currentEntry.examDate}
          </span>
          {currentEntry.expected && (
            <span className="text-4xs text-amber-700 dark:text-amber-400 block font-sans font-semibold mt-0.5">
              Expected, confirm on the official site
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-4xs font-mono uppercase text-[#6B6358] dark:text-[#94A3B8] block">
            Days Remaining
          </span>
          <span className="text-xs font-bold font-mono text-kai-vermilion">
            {daysLeft} days
          </span>
        </div>
      </div>

      {/* User Selection Controls: Level, Session, City */}
      <div className="relative z-10 space-y-2">
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {/* Target Level */}
          <div>
            <label className="text-4xs font-mono text-[#6B6358] dark:text-[#94A3B8] uppercase block mb-1">
              Target Level
            </label>
            <select
              value={preferences.targetLevel}
              onChange={handleLevelChange}
              className="w-full px-2 py-1.5 rounded-xl bg-white dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-mono text-[#14110F] dark:text-white focus:outline-none focus:ring-1 focus:ring-kai-vermilion"
            >
              <option value="N5">JLPT N5</option>
              <option value="N4">JLPT N4</option>
              <option value="N3">JLPT N3</option>
              <option value="N2">JLPT N2</option>
              <option value="N1">JLPT N1</option>
            </select>
          </div>

          {/* Test Session */}
          <div>
            <label className="text-4xs font-mono text-[#6B6358] dark:text-[#94A3B8] uppercase block mb-1">
              Session
            </label>
            <select
              value={preferences.selectedSession}
              onChange={handleSessionChange}
              className="w-full px-2 py-1.5 rounded-xl bg-white dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-mono text-[#14110F] dark:text-white focus:outline-none focus:ring-1 focus:ring-kai-vermilion"
            >
              {AVAILABLE_SESSIONS.map((s) => (
                <option key={s} value={s}>
                  {s === '2026-12' ? 'Dec 2026' : 'July 2027'}
                </option>
              ))}
            </select>
          </div>

          {/* Test City */}
          <div>
            <label className="text-4xs font-mono text-[#6B6358] dark:text-[#94A3B8] uppercase block mb-1">
              City
            </label>
            <select
              value={preferences.selectedCity}
              onChange={handleCityChange}
              className="w-full px-2 py-1.5 rounded-xl bg-white dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370] text-xs font-mono text-[#14110F] dark:text-white focus:outline-none focus:ring-1 focus:ring-kai-vermilion"
            >
              {AVAILABLE_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Application Status Selector */}
        <div className="pt-1">
          <label className="text-4xs font-mono text-[#6B6358] dark:text-[#94A3B8] uppercase block mb-1">
            My Registration Status
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['not_planning', 'planning', 'applied'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`py-1.5 px-2 rounded-xl text-3xs font-medium text-center transition-all ${
                  preferences.status === st
                    ? st === 'applied'
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : st === 'planning'
                      ? 'bg-kai-vermilion text-white font-bold shadow-sm'
                      : 'bg-stone-400 text-white font-bold shadow-sm'
                    : 'bg-white/80 dark:bg-[#1C2945] text-[#524B42] dark:text-stone-300 border border-[#DDD2B8] dark:border-[#2E4370]/60'
                }`}
              >
                {st === 'not_planning' ? 'Not Planning' : st === 'planning' ? 'Planning' : 'Applied ✓'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Host Institution & Official Site Link */}
      <div className="relative z-10 pt-1 border-t border-[#DDD2B8]/70 dark:border-[#2E4370]/50 flex items-center justify-between text-3xs text-[#6B6358] dark:text-[#94A3B8]">
        <div className="truncate max-w-[190px]">
          <span className="block truncate font-medium text-[#14110F] dark:text-stone-200">
            {currentEntry.hostInstitution}
          </span>
          <span className="text-4xs text-[#6B6358] dark:text-stone-400">
            Verified {currentEntry.lastVerified}
          </span>
        </div>

        <button
          type="button"
          onClick={() => platformService.openExternal(currentEntry.officialUrl)}
          className="inline-flex items-center gap-1 text-kai-vermilion hover:underline font-semibold"
        >
          <span>Official Site</span>
          <ExternalLink size={11} />
        </button>
      </div>

      {/* Button to Open Full JLPT Arena */}
      <button
        type="button"
        onClick={() => setActiveSection('jlpt')}
        className="relative z-10 w-full py-2 px-3 rounded-xl bg-white/90 dark:bg-[#1C2945] border border-[#DDD2B8] dark:border-[#2E4370] text-[#14110F] dark:text-[#FAF5ED] hover:border-kai-vermilion text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
      >
        <span>Open JLPT Readiness Arena</span>
        <ChevronRight size={13} />
      </button>
    </div>
  );
};
