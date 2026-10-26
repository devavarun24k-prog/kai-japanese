// src/components/jlpt/JLPTArena.tsx
// Comprehensive JLPT Arena: Goal selection, exam date feasibility, section readiness index with real attempt auditing, weekly plan, and timed section mocks
import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ShieldAlert,
  Compass,
  FileText,
  BarChart2,
  Sparkles,
  ChevronRight,
  BookOpen,
  ExternalLink,
  Calendar,
  Clock,
  Target,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { JLPT_N5_MOCK_EXAM } from '../../data/jlptMockData';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../services/soundEffects';
import { platformService } from '../../services/platformService';
import { storageService } from '../../services/storageService';
import {
  JLPT_CALENDAR_ENTRIES,
  JLPTUserPreferences,
  getDaysUntilExam,
  checkJLPTReminders
} from '../../data/jlptCalendar';
import { JLPTQuestion, JLPTExam } from '../../types';

type JLPTExamSection = JLPTExam['sections'][number];

interface SectionScore {
  name: string;
  correct: number;
  total: number;
  pct: number;
}

export const JLPTArena: React.FC = () => {
  const { awardXP, recordAttempt, displayMode, setActiveSection } = useLearning();
  const { profile, updateProfile } = useAuth();

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'arena' | 'weekly_plan' | 'roadmap'>('arena');

  // JLPT Preferences from storage
  const [preferences, setPreferences] = useState<JLPTUserPreferences>(() => {
    try {
      const saved = localStorage.getItem('kai_user_jlpt_preferences');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      targetLevel: 'N5',
      selectedCity: 'Tokyo',
      selectedSession: '2026-12',
      status: 'planning',
      remindersEnabled: true,
      updatedAt: new Date().toISOString()
    };
  });

  const savePreferences = (updated: Partial<JLPTUserPreferences>) => {
    const next = { ...preferences, ...updated, updatedAt: new Date().toISOString() };
    setPreferences(next);
    try {
      localStorage.setItem('kai_user_jlpt_preferences', JSON.stringify(next));
    } catch (e) {}
    if (updated.targetLevel && updated.targetLevel !== profile.jlpt_target) {
      updateProfile({ jlpt_target: updated.targetLevel });
    }
  };

  // Selected session entry
  const selectedEntry = useMemo(() => {
    return (
      JLPT_CALENDAR_ENTRIES.find(
        (e) => e.session === preferences.selectedSession && e.city === preferences.selectedCity
      ) ||
      JLPT_CALENDAR_ENTRIES.find((e) => e.session === preferences.selectedSession) ||
      JLPT_CALENDAR_ENTRIES[0]
    );
  }, [preferences.selectedSession, preferences.selectedCity]);

  // Feasibility calculations
  const daysUntilExam = useMemo(() => getDaysUntilExam(selectedEntry.examDate), [selectedEntry.examDate]);
  const dailyGoalMinutes = profile.daily_goal_minutes || 20;
  const projectedStudyHours = Math.round((daysUntilExam * dailyGoalMinutes) / 60);

  // Recommended hours benchmark by level
  const benchmarkHours: Record<string, number> = {
    N5: 150,
    N4: 300,
    N3: 450,
    N2: 600,
    N1: 900
  };
  const requiredHours = benchmarkHours[preferences.targetLevel] || 150;
  const feasibilityRatio = projectedStudyHours / requiredHours;

  // Real attempts audit for section readiness
  const attempts = useMemo(() => storageService.getAttempts(), []);

  const sectionReadiness = useMemo(() => {
    const getStats = (filterFn: (a: any) => boolean) => {
      const matched = attempts.filter(filterFn);
      const count = matched.length;
      if (count < 10) {
        return { count, sufficient: false, accuracy: 0, status: 'insufficient' as const };
      }
      const correct = matched.filter((a) => a.is_correct).length;
      const accuracy = Math.round((correct / count) * 100);
      let status: 'ready' | 'proficient' | 'review' = 'review';
      if (accuracy >= 80) status = 'ready';
      else if (accuracy >= 60) status = 'proficient';
      return { count, sufficient: true, accuracy, status };
    };

    return {
      vocab: getStats(
        (a) =>
          a.item_type === 'vocab' ||
          a.item_type === 'kanji' ||
          a.skill === 'vocabulary' ||
          a.skill === 'kanji'
      ),
      grammar: getStats(
        (a) =>
          a.item_type === 'grammar' ||
          a.item_type === 'sentence' ||
          a.skill === 'grammar'
      ),
      reading: getStats((a) => a.skill === 'reading'),
      listening: getStats((a) => a.skill === 'listening' || a.item_type === 'listening')
    };
  }, [attempts]);

  // Exam state
  const [activeMockType, setActiveMockType] = useState<'full' | 'vocab' | 'grammar' | 'reading' | 'listening'>('full');
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(JLPT_N5_MOCK_EXAM.time_limit_minutes * 60);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [sectionBreakdown, setSectionBreakdown] = useState<SectionScore[]>([]);
  const [scoreReport, setScoreReport] = useState<{
    totalScorePct: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  // Active mock sections based on mode
  const activeSections = useMemo((): JLPTExamSection[] => {
    if (activeMockType === 'full') return JLPT_N5_MOCK_EXAM.sections;
    if (activeMockType === 'vocab') {
      return JLPT_N5_MOCK_EXAM.sections.filter((s) => s.name.includes('Vocabulary'));
    }
    if (activeMockType === 'grammar') {
      return JLPT_N5_MOCK_EXAM.sections.filter(
        (s) => s.name.includes('Grammar') || s.name.includes('Assembly')
      );
    }
    if (activeMockType === 'reading') {
      return JLPT_N5_MOCK_EXAM.sections.filter((s) => s.name.includes('Reading'));
    }
    if (activeMockType === 'listening') {
      return JLPT_N5_MOCK_EXAM.sections.filter((s) => s.name.includes('Listening'));
    }
    return JLPT_N5_MOCK_EXAM.sections;
  }, [activeMockType]);

  const activeQuestions = useMemo(() => {
    return activeSections.flatMap((s) => s.questions);
  }, [activeSections]);

  // Start a specific mock
  const handleStartMock = (type: 'full' | 'vocab' | 'grammar' | 'reading' | 'listening') => {
    setActiveMockType(type);
    let seconds = JLPT_N5_MOCK_EXAM.time_limit_minutes * 60;
    if (type === 'vocab') seconds = 5 * 60;
    if (type === 'grammar') seconds = 7 * 60;
    if (type === 'reading') seconds = 5 * 60;
    if (type === 'listening') seconds = 5 * 60;

    setTimeLeft(seconds);
    setAnswers({});
    setExamSubmitted(false);
    setScoreReport(null);
    setExamStarted(true);
    soundEffects.playLevelUp();
  };

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (examStarted && !examSubmitted && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (examStarted && !examSubmitted && timeLeft === 0) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [examStarted, examSubmitted, timeLeft]);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (examSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    soundEffects.playClick();
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    let totalCorrect = 0;

    const sectionsScored: SectionScore[] = activeSections.map((sec: JLPTExamSection) => {
      let secCorrect = 0;
      sec.questions.forEach((q: JLPTQuestion) => {
        if (answers[q.id] === q.correct_index) {
          secCorrect += 1;
          totalCorrect += 1;
        }
      });
      return {
        name: sec.name,
        correct: secCorrect,
        total: sec.questions.length,
        pct: Math.round((secCorrect / sec.questions.length) * 100)
      };
    });

    setSectionBreakdown(sectionsScored);

    const totalPct = Math.round((totalCorrect / activeQuestions.length) * 100);
    const passed = totalPct >= JLPT_N5_MOCK_EXAM.passing_score_pct;

    setScoreReport({
      totalScorePct: totalPct,
      passed,
      correctAnswers: totalCorrect,
      totalQuestions: activeQuestions.length
    });

    if (passed) {
      soundEffects.playLevelUp();
      awardXP(200, `Passed ${activeMockType === 'full' ? 'Full JLPT Mock' : `${activeMockType} Section Mock`}`);
    } else {
      soundEffects.playWrong();
      awardXP(50, `Completed ${activeMockType} Section Mock Attempt`);
    }

    recordAttempt({
      item_id: `jlpt_mock_${activeMockType}`,
      item_type: activeMockType === 'vocab' ? 'vocab' : activeMockType === 'reading' ? 'grammar' : 'grammar',
      skill: activeMockType === 'listening' ? 'listening' : activeMockType === 'reading' ? 'reading' : 'reading',
      question_type: `jlpt_mock_${activeMockType}`,
      user_response: `${totalPct}% (${totalCorrect}/${activeQuestions.length})`,
      expected_response: '60%+ to pass',
      is_correct: passed,
      response_time_ms: 1000,
      hint_used: false,
      retry_count: 0
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Reminder alert
  const reminderAlert = useMemo(() => checkJLPTReminders(selectedEntry.examDate), [selectedEntry.examDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>日本語能力試験</span>
            <span className="text-sm font-sans font-normal text-kai-muted">JLPT Arena & Diagnostic Center</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Target exam alignment, study pace feasibility check, section readiness auditing, and timed mock tests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border text-xs">
            <button
              onClick={() => setActiveTab('arena')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'arena'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold'
                  : 'text-kai-muted'
              }`}
            >
              Arena & Mocks
            </button>
            <button
              onClick={() => setActiveTab('weekly_plan')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'weekly_plan'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold'
                  : 'text-kai-muted'
              }`}
            >
              Weekly Plan
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'roadmap'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold'
                  : 'text-kai-muted'
              }`}
            >
              N5 → N1 Roadmap
            </button>
          </div>

          {examStarted && !examSubmitted && activeTab === 'arena' && (
            <div className="flex items-center gap-2 font-mono font-bold text-sm text-kai-vermilion bg-red-50 dark:bg-red-950/40 px-3.5 py-1.5 rounded-2xl border border-red-200 shrink-0">
              <Timer size={16} />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {reminderAlert && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-amber-600" />
            <div>
              <span className="font-bold">{reminderAlert.message}</span>
              {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                <p className="font-telugu text-2xs mt-0.5">{reminderAlert.messageTe}</p>
              )}
            </div>
          </div>
          <span className="text-2xs font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-200/60 shrink-0">
            {reminderAlert.daysLeft}d left
          </span>
        </div>
      )}

      {/* Main Arena Tab */}
      {activeTab === 'arena' && (
        <div className="space-y-6">
          {/* Section 1: Goal Selection Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-5">
            <div className="flex items-center justify-between border-b border-kai-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-kai-vermilion" />
                <h2 className="text-base font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  JLPT Target Goal Selection
                </h2>
              </div>
              <span className="text-2xs font-mono text-kai-muted">
                {selectedEntry.city} • {selectedEntry.examDate}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Target Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-kai-muted">Target Level</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => savePreferences({ targetLevel: lvl })}
                      className={`py-2 rounded-xl border text-center font-bold text-xs transition-all ${
                        preferences.targetLevel === lvl
                          ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-kai-border text-kai-muted hover:text-kai-ink'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Session */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-kai-muted">Target Exam Session</label>
                <select
                  value={preferences.selectedSession}
                  onChange={(e) => savePreferences({ selectedSession: e.target.value })}
                  aria-label="Target Exam Session"
                  className="w-full p-2.5 rounded-xl border border-kai-border bg-white dark:bg-stone-900 text-xs font-medium text-kai-ink dark:text-white"
                >
                  <option value="2026-12">Dec 6, 2026 (Global Examination)</option>
                  <option value="2027-07">July 4, 2027 (Summer Session)</option>
                </select>
              </div>

              {/* Target City */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-kai-muted">Host City / Test Site</label>
                <select
                  value={preferences.selectedCity}
                  onChange={(e) => savePreferences({ selectedCity: e.target.value })}
                  aria-label="Host City / Test Site"
                  className="w-full p-2.5 rounded-xl border border-kai-border bg-white dark:bg-stone-900 text-xs font-medium text-kai-ink dark:text-white"
                >
                  {Array.from(new Set(JLPT_CALENDAR_ENTRIES.map((e) => e.city))).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Feasibility Check Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-kai-gold" />
                <h3 className="text-base font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  Feasibility Check: Daily Pace vs. Exam Date
                </h3>
              </div>
              <span
                className={`text-2xs font-mono font-bold px-3 py-1 rounded-xl ${
                  feasibilityRatio >= 1.0
                    ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                    : feasibilityRatio >= 0.7
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                }`}
              >
                {feasibilityRatio >= 1.0
                  ? 'Highly Feasible'
                  : feasibilityRatio >= 0.7
                  ? 'Moderate Pace'
                  : 'Tight Timeline'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Days to Exam</span>
                <span className="font-bold text-lg font-mono text-kai-ink dark:text-white">
                  {daysUntilExam} Days
                </span>
                <span className="text-3xs text-kai-muted block mt-0.5">{selectedEntry.examDate}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Daily Goal</span>
                <span className="font-bold text-lg font-mono text-kai-ink dark:text-white">
                  {dailyGoalMinutes} min/day
                </span>
                <span className="text-3xs text-kai-muted block mt-0.5">Configured pace</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Projected Study</span>
                <span className="font-bold text-lg font-mono text-kai-vermilion">
                  ~{projectedStudyHours} Hours
                </span>
                <span className="text-3xs text-kai-muted block mt-0.5">By exam date</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Benchmark Need</span>
                <span className="font-bold text-lg font-mono text-kai-ink dark:text-white">
                  {requiredHours} Hours
                </span>
                <span className="text-3xs text-kai-muted block mt-0.5">{preferences.targetLevel} standard</span>
              </div>
            </div>

            {/* Feasibility Progress Gauge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-2xs font-mono">
                <span className="text-kai-muted">Pace coverage:</span>
                <span className="font-bold text-kai-ink dark:text-white">
                  {Math.min(100, Math.round(feasibilityRatio * 100))}% of benchmark hours
                </span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    feasibilityRatio >= 1.0 ? 'bg-green-500' : feasibilityRatio >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round(feasibilityRatio * 100))}%` }}
                />
              </div>
              <p className="text-2xs text-kai-muted leading-relaxed">
                {feasibilityRatio >= 1.0
                  ? `At your current pace of ${dailyGoalMinutes} min/day, you will accumulate ~${projectedStudyHours} study hours by ${selectedEntry.examDate}, comfortably meeting the ${requiredHours}-hour milestone for ${preferences.targetLevel}.`
                  : `At ${dailyGoalMinutes} min/day, you will log ~${projectedStudyHours} hours vs. the recommended ${requiredHours} hours. Consider increasing your daily goal to ~${Math.ceil(
                      (requiredHours * 60) / Math.max(1, daysUntilExam)
                    )} min/day in the Study Planner.`}
              </p>
            </div>
          </div>

          {/* Section 3: Readiness by Section with "Not Enough Data" Badging */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-4">
            <div className="flex items-center justify-between border-b border-kai-border/50 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-kai-indigo" />
                <div>
                  <h3 className="text-base font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                    Section Readiness Audit
                  </h3>
                  <p className="text-2xs text-kai-muted">
                    Evidence-based accuracy from your real learning attempts. Requires ≥10 attempts per studio to avoid statistical skew.
                  </p>
                </div>
              </div>
              <span className="text-2xs font-mono text-kai-muted">
                {attempts.length} Total Answers Audited
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Vocabulary & Kanji */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-kai-ink dark:text-white">
                    1. Kanji & Vocabulary (文字・語彙)
                  </span>
                  {sectionReadiness.vocab.sufficient ? (
                    <span
                      className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        sectionReadiness.vocab.accuracy >= 80
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {sectionReadiness.vocab.accuracy}% Accuracy
                    </span>
                  ) : (
                    <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-kai-muted">
                      Not enough data yet
                    </span>
                  )}
                </div>

                {sectionReadiness.vocab.sufficient ? (
                  <p className="text-2xs text-kai-muted">
                    Based on {sectionReadiness.vocab.count} logged answers. {sectionReadiness.vocab.accuracy >= 80 ? 'Mastery confirmed.' : 'Reinforce N5 word pairs.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xs text-kai-muted">
                      Logged {sectionReadiness.vocab.count} / 10 answers. Complete 10+ vocabulary exercises to compute your readiness.
                    </p>
                    <button
                      onClick={() => setActiveSection('vocab')}
                      className="text-2xs font-semibold text-kai-vermilion hover:underline flex items-center gap-1"
                    >
                      <span>Practice in Vocabulary Academy</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Grammar & Particles */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-kai-ink dark:text-white">
                    2. Grammar & Particles (文法・組み立て)
                  </span>
                  {sectionReadiness.grammar.sufficient ? (
                    <span
                      className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        sectionReadiness.grammar.accuracy >= 80
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {sectionReadiness.grammar.accuracy}% Accuracy
                    </span>
                  ) : (
                    <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-kai-muted">
                      Not enough data yet
                    </span>
                  )}
                </div>

                {sectionReadiness.grammar.sufficient ? (
                  <p className="text-2xs text-kai-muted">
                    Based on {sectionReadiness.grammar.count} logged answers. {sectionReadiness.grammar.accuracy >= 80 ? 'Solid particle comprehension.' : 'Review particle drills.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xs text-kai-muted">
                      Logged {sectionReadiness.grammar.count} / 10 answers. Need at least 10 drills in Grammar Lab & Sentence Forge.
                    </p>
                    <button
                      onClick={() => setActiveSection('grammar')}
                      className="text-2xs font-semibold text-kai-vermilion hover:underline flex items-center gap-1"
                    >
                      <span>Practice in Grammar Lab</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Reading Comprehension */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-kai-ink dark:text-white">
                    3. Reading Comprehension (読解)
                  </span>
                  {sectionReadiness.reading.sufficient ? (
                    <span
                      className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        sectionReadiness.reading.accuracy >= 80
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {sectionReadiness.reading.accuracy}% Accuracy
                    </span>
                  ) : (
                    <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-kai-muted">
                      Not enough data yet
                    </span>
                  )}
                </div>

                {sectionReadiness.reading.sufficient ? (
                  <p className="text-2xs text-kai-muted">
                    Based on {sectionReadiness.reading.count} logged reading answers. Passage pace confirmed.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xs text-kai-muted">
                      Logged {sectionReadiness.reading.count} / 10 answers. Read graded stories and answer comprehension questions.
                    </p>
                    <button
                      onClick={() => setActiveSection('reading')}
                      className="text-2xs font-semibold text-kai-vermilion hover:underline flex items-center gap-1"
                    >
                      <span>Read in Reading Theatre</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Listening Comprehension */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-kai-ink dark:text-white">
                    4. Listening Comprehension (聴解)
                  </span>
                  {sectionReadiness.listening.sufficient ? (
                    <span
                      className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        sectionReadiness.listening.accuracy >= 80
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {sectionReadiness.listening.accuracy}% Accuracy
                    </span>
                  ) : (
                    <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-kai-muted">
                      Not enough data yet
                    </span>
                  )}
                </div>

                {sectionReadiness.listening.sufficient ? (
                  <p className="text-2xs text-kai-muted">
                    Based on {sectionReadiness.listening.count} logged listening exercises. Mora perception confirmed.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xs text-kai-muted">
                      Logged {sectionReadiness.listening.count} / 10 answers. Train pitch and conversation in Listening Lab.
                    </p>
                    <button
                      onClick={() => setActiveSection('listening')}
                      className="text-2xs font-semibold text-kai-vermilion hover:underline flex items-center gap-1"
                    >
                      <span>Train in Listening Lab</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Timed Section Mocks & Diagnostic Exam */}
          {!examStarted ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
              <div className="text-center space-y-2">
                <Award size={48} className="text-kai-gold mx-auto" />
                <h3 className="text-xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  Timed JLPT Diagnostic Mocks
                </h3>
                <p className="text-xs text-kai-muted max-w-lg mx-auto">
                  Take the complete timed official diagnostic examination or drill individual timed sections under real exam pressure.
                </p>
              </div>

              {/* Mock Launch Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {/* Full Mock */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border-2 border-kai-vermilion space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-kai-vermilion uppercase">Official Format</span>
                      <span className="text-3xs font-mono bg-red-100 dark:bg-red-950/60 text-kai-vermilion px-2 py-0.5 rounded-full font-bold">
                        25 Min
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-kai-ink dark:text-white mt-1">
                      Complete Diagnostic Exam
                    </h4>
                    <p className="text-2xs text-kai-muted mt-1">
                      All 5 sections: Kanji, Vocab, Grammar, Star Assembly, Reading, and Listening.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartMock('full')}
                    className="w-full py-2.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                  >
                    Start Full Exam
                  </button>
                </div>

                {/* Section Mock 1: Vocab */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-kai-indigo uppercase">Section 1</span>
                      <span className="text-3xs font-mono bg-stone-200 dark:bg-stone-800 text-kai-muted px-2 py-0.5 rounded-full font-bold">
                        5 Min
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-kai-ink dark:text-white mt-1">
                      Vocabulary & Kanji Mock
                    </h4>
                    <p className="text-2xs text-kai-muted mt-1">
                      Kanji readings, word selection, context predicates.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartMock('vocab')}
                    className="w-full py-2.5 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-kai-ink text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                  >
                    Start Vocab Mock
                  </button>
                </div>

                {/* Section Mock 2: Grammar */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-kai-indigo uppercase">Section 2</span>
                      <span className="text-3xs font-mono bg-stone-200 dark:bg-stone-800 text-kai-muted px-2 py-0.5 rounded-full font-bold">
                        7 Min
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-kai-ink dark:text-white mt-1">
                      Grammar & Star Assembly
                    </h4>
                    <p className="text-2xs text-kai-muted mt-1">
                      Particle assignment and official ★ sentence unscrambling.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartMock('grammar')}
                    className="w-full py-2.5 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-kai-ink text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                  >
                    Start Grammar Mock
                  </button>
                </div>

                {/* Section Mock 3: Reading */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-kai-indigo uppercase">Section 3</span>
                      <span className="text-3xs font-mono bg-stone-200 dark:bg-stone-800 text-kai-muted px-2 py-0.5 rounded-full font-bold">
                        5 Min
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-kai-ink dark:text-white mt-1">
                      Reading Comprehension
                    </h4>
                    <p className="text-2xs text-kai-muted mt-1">
                      Short passage analysis and factual extraction questions.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartMock('reading')}
                    className="w-full py-2.5 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-kai-ink text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                  >
                    Start Reading Mock
                  </button>
                </div>

                {/* Section Mock 4: Listening */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-kai-indigo uppercase">Section 4</span>
                      <span className="text-3xs font-mono bg-stone-200 dark:bg-stone-800 text-kai-muted px-2 py-0.5 rounded-full font-bold">
                        5 Min
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-kai-ink dark:text-white mt-1">
                      Listening Comprehension
                    </h4>
                    <p className="text-2xs text-kai-muted mt-1">
                      Native audio dialogues and time/action retrieval.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartMock('listening')}
                    className="w-full py-2.5 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-kai-ink text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                  >
                    Start Listening Mock
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Exam Active Screen */
            <div className="space-y-6">
              {/* Score Report Header if submitted */}
              {scoreReport && (
                <div
                  className={`p-6 rounded-3xl border text-center space-y-4 animate-in fade-in shadow-washi ${
                    scoreReport.passed
                      ? 'bg-green-50/90 dark:bg-green-950/40 border-green-300 text-green-900 dark:text-green-200'
                      : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <div className="text-5xl font-bold font-mono">{scoreReport.totalScorePct}%</div>
                  <h3 className="text-lg font-bold font-serif_jp">
                    {scoreReport.passed
                      ? '🎉 合格 (Passed) — Demonstrated diagnostic competency!'
                      : 'もう一歩 (Keep Going) — Review flagged questions and explanations below.'}
                  </h3>
                  <p className="text-xs max-w-md mx-auto">
                    Score: {scoreReport.correctAnswers} of {scoreReport.totalQuestions} questions correct. Detailed trilingual explanations provided below.
                  </p>

                  {/* Section-by-Section Score Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
                    {sectionBreakdown.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-kai-border text-center space-y-1"
                      >
                        <span className="text-3xs font-mono text-kai-muted uppercase block truncate" title={sec.name}>
                          {sec.name.split('(')[0]}
                        </span>
                        <span className="text-lg font-bold font-mono text-kai-ink dark:text-white">
                          {sec.pct}%
                        </span>
                        <span className="text-3xs text-kai-muted block font-mono">
                          {sec.correct}/{sec.total} correct
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Targeted Revision Advice */}
                  <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-kai-border text-left space-y-2 text-xs">
                    <span className="font-bold text-kai-ink dark:text-white flex items-center gap-1.5">
                      <Compass size={16} className="text-kai-indigo" />
                      <span>Recommended Follow-up Drills:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-kai-muted">
                      {sectionBreakdown.map((sec, idx) => {
                        if (sec.pct >= 80) return null;
                        const advice = sec.name.includes('Vocabulary')
                          ? { label: 'Reinforce N5 Vocab & Kanji', target: 'vocab' }
                          : sec.name.includes('Grammar') || sec.name.includes('Assembly')
                          ? { label: 'Review Particle Lab (は, が, で, に)', target: 'grammar' }
                          : sec.name.includes('Reading')
                          ? { label: 'Read Graded Reader Stories', target: 'reading' }
                          : { label: 'Practice Dialogue in Listening Lab', target: 'listening' };

                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveSection(advice.target as any)}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-left flex items-center justify-between gap-2 border border-kai-border text-xs text-kai-ink dark:text-white transition-colors"
                          >
                            <span className="line-clamp-1">{advice.label}</span>
                            <ChevronRight size={13} className="shrink-0 text-kai-vermilion" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Rendered by Active Section */}
              {activeSections.map((section: JLPTExamSection, sIdx: number) => (
                <div
                  key={sIdx}
                  className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-kai-border/50 pb-2">
                    <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                      {section.name}
                    </h3>
                    <span className="text-2xs font-mono text-kai-muted">
                      {section.questions.length} Items
                    </span>
                  </div>

                  <div className="space-y-6">
                    {section.questions.map((q: JLPTQuestion, qIdx: number) => (
                      <div
                        key={q.id}
                        className="space-y-3 p-4 rounded-2xl bg-kai-bg/50 dark:bg-kai-dark-bg/60 border border-kai-border/60"
                      >
                        {/* Context passage for reading questions */}
                        {q.context && (
                          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-japanese text-sm leading-relaxed whitespace-pre-line text-kai-ink dark:text-stone-100 shadow-sm">
                            {q.context}
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-mono font-bold text-kai-muted mr-2">
                              Q{qIdx + 1}.
                            </span>
                            <span className="font-japanese font-bold text-base text-kai-ink dark:text-kai-dark-ink">
                              {q.question_jp}
                            </span>
                            <p className="text-xs text-kai-muted mt-1">{q.question_en}</p>
                            {(displayMode === 'telugu' || displayMode === 'bilingual') && q.question_te && (
                              <p className="font-telugu text-2xs text-kai-vermilion mt-0.5">
                                {q.question_te}
                              </p>
                            )}
                          </div>

                          {q.audio_text && <AudioButton text={q.audio_text} size="sm" />}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt: string, optIdx: number) => {
                            const isSelected = answers[q.id] === optIdx;
                            const isCorrect = optIdx === q.correct_index;

                            let style = 'bg-white dark:bg-kai-dark-card border-kai-border hover:border-kai-vermilion';
                            if (examSubmitted) {
                              if (isCorrect) style = 'bg-green-100 dark:bg-green-950/60 border-green-500 font-bold';
                              else if (isSelected) style = 'bg-red-100 dark:bg-red-950/60 border-red-500';
                            } else if (isSelected) {
                              style = 'bg-kai-vermilion-bg border-kai-vermilion font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(q.id, optIdx)}
                                disabled={examSubmitted}
                                className={`p-3 rounded-xl border text-left text-xs transition-colors ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanations shown only after submit */}
                        {examSubmitted && (
                          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-kai-border text-2xs space-y-1 animate-in fade-in">
                            <span className="font-bold text-kai-ink dark:text-white block">Explanation:</span>
                            <p className="text-kai-muted leading-relaxed">{q.explanation_en}</p>
                            {(displayMode === 'telugu' || displayMode === 'bilingual') && q.explanation_te && (
                              <p className="font-telugu text-kai-vermilion mt-1 leading-relaxed">
                                {q.explanation_te}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Submit or Reset Buttons */}
              {!examSubmitted ? (
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-4 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion transition-transform active:scale-95"
                >
                  Submit Mock For Scoring & Diagnosis
                </button>
              ) : (
                <button
                  onClick={() => {
                    setExamStarted(false);
                    setExamSubmitted(false);
                    setAnswers({});
                    setTimeLeft(JLPT_N5_MOCK_EXAM.time_limit_minutes * 60);
                    setScoreReport(null);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-kai-ink dark:text-white font-bold text-xs transition-colors"
                >
                  Back to Diagnostic Arena
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Weekly Study Plan */}
      {activeTab === 'weekly_plan' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-2">
            <h2 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
              <Calendar size={20} className="text-kai-vermilion" />
              <span>Structured Weekly Study Plan — Target: {selectedEntry.sessionNameEn}</span>
            </h2>
            <p className="text-xs text-kai-muted leading-relaxed">
              Calculated for your target date of {selectedEntry.examDate} ({daysUntilExam} days remaining). Follow these sequential 4-week phase milestones to peak readiness.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'Phase 1 (Weeks 1 - 4)',
                title: 'Kana Academy & Core Vocabulary Foundation',
                focus: 'Complete 46 Hiragana & 46 Katakana with KanjiVG stroke order. Master first 100 core words with Telugu phonetics.',
                milestone: 'Kana Academy 100% completion & 0 due review backlog.',
                studio: 'kana'
              },
              {
                phase: 'Phase 2 (Weeks 5 - 8)',
                title: 'Grammar Particles & Essential Conjugations',
                focus: 'Master basic particles (は, が, を, に, で, へ, と, も), Desu/Masu inflection, and polite past tense 〜ました.',
                milestone: 'Grammar Lab 12 patterns audited & Sentence Forge 100% assembly rate.',
                studio: 'grammar'
              },
              {
                phase: 'Phase 3 (Weeks 9 - 12)',
                title: 'Kanji Dojo & Reading Passages',
                focus: 'Master 20 canonical N5 Kanji with stroke order. Complete Graded Reader stories in Reading Theatre with lexicon lookups.',
                milestone: 'Read 3 graded stories with ≥80% comprehension score.',
                studio: 'reading'
              },
              {
                phase: 'Phase 4 (Final 4 Weeks)',
                title: 'Timed Mocks & Weakness Clearing',
                focus: 'Weekly timed section mocks in JLPT Arena. Clear all persistent errors in Weakness Notebook.',
                milestone: 'Score ≥75% on full timed diagnostic exam.',
                studio: 'arena'
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-kai-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-kai-vermilion/10 text-kai-vermilion font-bold font-mono text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-kai-ink dark:text-white font-serif_jp">
                      {plan.phase}: {plan.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      if (plan.studio === 'arena') setActiveTab('arena');
                      else setActiveSection(plan.studio as any);
                    }}
                    className="text-2xs font-semibold text-kai-vermilion hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-kai-muted block mb-0.5 text-2xs uppercase tracking-wide">
                      Weekly Focus
                    </span>
                    <p className="text-2xs text-kai-ink dark:text-stone-300 leading-relaxed">
                      {plan.focus}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-kai-muted block mb-0.5 text-2xs uppercase tracking-wide">
                      Target Milestone
                    </span>
                    <p className="text-2xs text-green-700 dark:text-green-400 font-medium leading-relaxed">
                      ✓ {plan.milestone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Progression Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-2">
            <h2 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
              <Compass size={20} className="text-kai-vermilion" />
              <span>Japanese Language Proficiency Test (JLPT) Mastery Roadmap</span>
            </h2>
            <p className="text-xs text-kai-muted leading-relaxed">
              Standardized five-level curriculum progression. KAI provides full beginner foundational coverage across N5, preparing you systematically for upper milestones.
            </p>
          </div>

          <div className="space-y-4">
            {(
              [
                {
                  level: 'N5',
                  title: 'Novice Foundation (入門・初級)',
                  status: 'Active Curriculum (KAI Native)',
                  statusColor: 'bg-green-100 text-green-900 dark:bg-green-950/60 dark:text-green-300',
                  kanjiCount: '~100 Kanji',
                  vocabCount: '~800 Words',
                  grammarPoints: 'Gojuon Hiragana & Katakana, Basic particles (は, が, を, に, で), Desu/Masu politeness, SOV sentence order, Numbers & Dates',
                  kaiFeatures: 'Kana Academy (46 Gojuon), Vocab Academy (55 core items), Kanji Dojo (20 canonical N5), 12 Grammar Lab patterns, 16 Sentence Forge drills',
                  isCurrent: true
                },
                {
                  level: 'N4',
                  title: 'Elementary Conversational (初中級)',
                  status: 'Next Planned Milestone',
                  statusColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
                  kanjiCount: '~300 Kanji total',
                  vocabCount: '~1,500 Words',
                  grammarPoints: 'Te-form conjugations, Conditional (-tara, -ba), Potential forms (できる), Comparative (-yori, -no hou ga), Giving & Receiving (ageru, kureru, morau)',
                  kaiFeatures: 'Roadmap expansion scheduled following N5 mastery certification',
                  isCurrent: false
                },
                {
                  level: 'N3',
                  title: 'Intermediate Bridge (中級ブリッジ)',
                  status: 'Planned Milestone',
                  statusColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
                  kanjiCount: '~650 Kanji total',
                  vocabCount: '~3,750 Words',
                  grammarPoints: 'Transitive/Intransitive verb pairs, Passive & Causative voice, Natural conversational nuances, Abstract contextual reading',
                  kaiFeatures: 'Intermediate dialogue engine & extended graded readers',
                  isCurrent: false
                },
                {
                  level: 'N2',
                  title: 'Pre-Advanced Business (ビジネス・実用)',
                  status: 'Planned Milestone',
                  statusColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
                  kanjiCount: '~1,000 Kanji total',
                  vocabCount: '~6,000 Words',
                  grammarPoints: 'Honorifics (Keigo: Sonkeigo & Kenjougo), Editorial articles, Media broadcasts, Nuanced colloquial expressions',
                  kaiFeatures: 'Professional business communication simulations',
                  isCurrent: false
                },
                {
                  level: 'N1',
                  title: 'Advanced Mastery (上級・完全習得)',
                  status: 'Final Horizon',
                  statusColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
                  kanjiCount: '~2,000+ Kanji total',
                  vocabCount: '~10,000+ Words',
                  grammarPoints: 'Literary & classical grammar remnants, Abstract philosophical analysis, Full-speed native broadcasts',
                  kaiFeatures: 'Native Japanese literature reading & critical writing',
                  isCurrent: false
                }
              ] as const
            ).map((tier) => (
              <div
                key={tier.level}
                className={`p-6 rounded-3xl border transition-all ${
                  tier.isCurrent
                    ? 'bg-white dark:bg-kai-dark-card border-2 border-kai-vermilion shadow-washi-lg'
                    : 'bg-stone-50/80 dark:bg-stone-900/40 border-kai-border opacity-90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-kai-ink text-white dark:bg-kai-dark-ink dark:text-kai-ink flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                      {tier.level}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-kai-ink dark:text-white font-serif_jp">
                        {tier.title}
                      </h3>
                      <div className="flex items-center gap-2 text-2xs font-mono text-kai-muted">
                        <span>{tier.kanjiCount}</span>
                        <span>•</span>
                        <span>{tier.vocabCount}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-2xs font-mono font-bold px-3 py-1 rounded-xl self-start sm:self-auto ${tier.statusColor}`}>
                    {tier.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-kai-border/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-kai-ink dark:text-white block mb-0.5">
                      Target Grammar & Linguistic Goals:
                    </span>
                    <p className="text-2xs text-kai-muted leading-relaxed">{tier.grammarPoints}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-kai-ink dark:text-white block mb-0.5">
                      KAI Learning Modules:
                    </span>
                    <p className="text-2xs text-kai-indigo dark:text-indigo-300 leading-relaxed font-mono">
                      {tier.kaiFeatures}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Official JLPT Portal Notice */}
          <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                <Compass size={17} />
                <span>Official JLPT Administration & Verification</span>
              </div>
              <button
                onClick={() => platformService.openExternal('https://www.jlpt.jp/e/')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Visit Official JLPT Portal</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <p className="text-2xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              Official examination schedules, host institution registration windows, and test site availability are administered exclusively by Japan Educational Exchanges and Services (JEES) and the Japan Foundation. Registration windows vary by country and region. KAI does not schedule live official exams; always verify deadlines and test center locations directly on the official portal at <strong className="font-mono">https://www.jlpt.jp/e/</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
