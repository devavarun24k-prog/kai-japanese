// src/features/interview/components/TimedMockInterview.tsx
// Timed mock interview simulation with per-question timer, strict evaluation, and weak-area diagnosis
import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  Target,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { STARTER_INTERVIEW_QUESTIONS } from '../data';
import { InterviewQuestion, InterviewCategory, MockSessionSummary } from '../types';
import { evaluateDescriptiveAnswer } from '../utils/rubricMatcher';
import { saveMockInterviewSession } from '../storage';
import { useLearning } from '../../../context/LearningContext';

interface TimedMockInterviewProps {
  onPracticeWeakAreas: (weakCategories: InterviewCategory[]) => void;
}

export const TimedMockInterview: React.FC<TimedMockInterviewProps> = ({ onPracticeWeakAreas }) => {
  const { awardXP, rateFSRSCard } = useLearning();

  // Setup state
  const [sessionLength, setSessionLength] = useState<number>(5);
  const [timerSecondsPerQ, setTimerSecondsPerQ] = useState<number>(60);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  // Active session state
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number>>({});
  const [sessionSummary, setSessionSummary] = useState<MockSessionSummary | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new mock interview
  const handleStartInterview = () => {
    // Shuffle and pick random mix of questions across categories
    const shuffled = [...STARTER_INTERVIEW_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, sessionLength);
    setSessionQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(timerSecondsPerQ);
    setIsSessionActive(true);
    setIsSessionFinished(false);
    setSessionSummary(null);
  };

  // Timer tick
  useEffect(() => {
    if (!isSessionActive || isSessionFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto advance to next question on timer expiry
          handleAdvanceQuestion();
          return timerSecondsPerQ;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, isSessionFinished, currentIndex, sessionQuestions.length, timerSecondsPerQ]);

  const handleAdvanceQuestion = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(timerSecondsPerQ);
    } else {
      finalizeSession();
    }
  };

  const finalizeSession = () => {
    setIsSessionActive(false);
    setIsSessionFinished(true);

    // Compute category breakdown and scores
    const categoryScores: Record<InterviewCategory, { total: number; scoreSum: number; pct: number }> = {
      ece_fundamentals: { total: 0, scoreSum: 0, pct: 0 },
      semiconductors: { total: 0, scoreSum: 0, pct: 0 },
      manufacturing_process: { total: 0, scoreSum: 0, pct: 0 },
      embedded_systems: { total: 0, scoreSum: 0, pct: 0 },
      quality_testing: { total: 0, scoreSum: 0, pct: 0 },
      troubleshooting: { total: 0, scoreSum: 0, pct: 0 },
      projects: { total: 0, scoreSum: 0, pct: 0 },
      behavioral_hr: { total: 0, scoreSum: 0, pct: 0 }
    };

    let totalPointsEarned = 0;

    sessionQuestions.forEach((q, idx) => {
      const answer = userAnswers[idx];
      let questionScore = 0;

      if (q.type === 'mcq') {
        if (answer !== undefined && Number(answer) === q.correctIndex) {
          questionScore = 1;
        } else if (answer !== undefined) {
          // Add to FSRS mistakes
          rateFSRSCard(q.id, 'mistake', 1);
        }
      } else if (q.type === 'descriptive' && q.requiredKeyPoints) {
        const text = typeof answer === 'string' ? answer : '';
        const rubric = evaluateDescriptiveAnswer(text, q.requiredKeyPoints);
        questionScore = rubric.scorePct / 100;
      }

      categoryScores[q.category].total += 1;
      categoryScores[q.category].scoreSum += questionScore;
      totalPointsEarned += questionScore;
    });

    // Calculate percentages
    const strongCategories: InterviewCategory[] = [];
    const weakCategories: InterviewCategory[] = [];

    Object.entries(categoryScores).forEach(([catKey, data]) => {
      const cat = catKey as InterviewCategory;
      if (data.total > 0) {
        data.pct = Math.round((data.scoreSum / data.total) * 100);
        if (data.pct >= 75) {
          strongCategories.push(cat);
        } else if (data.pct < 70) {
          weakCategories.push(cat);
        }
      }
    });

    const overallPct = Math.round((totalPointsEarned / sessionQuestions.length) * 100);

    const summary: MockSessionSummary = {
      id: `mock_${Date.now()}`,
      date: new Date().toISOString(),
      durationSeconds: sessionQuestions.length * timerSecondsPerQ,
      totalQuestions: sessionQuestions.length,
      overallScorePct: overallPct,
      categoryScores,
      strongCategories,
      weakCategories
    };

    setSessionSummary(summary);
    saveMockInterviewSession(summary);
    awardXP(overallPct >= 70 ? 50 : 25, `Completed Timed Mock Interview (${overallPct}%)`);
  };

  const currentQ = sessionQuestions[currentIndex];

  return (
    <div className="space-y-6">
      {/* INITIAL SETUP SCREEN */}
      {!isSessionActive && !isSessionFinished && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] border border-[#84231D]/20 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
              Timed Mock Technical Interview (模擬面接)
            </h3>
            <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
              Simulate a real hardware engineering technical screening. Questions are timed per item with no hints. At the conclusion, receive a comprehensive diagnostic identifying your strong domains and weak areas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
                Interview Length:
              </label>
              <select
                value={sessionLength}
                onChange={(e) => setSessionLength(parseInt(e.target.value, 10))}
                className="w-full text-xs font-mono rounded-xl p-2.5 bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              >
                <option value={5}>5 Questions (Rapid Screening)</option>
                <option value={10}>10 Questions (Standard Round)</option>
                <option value={15}>15 Questions (Full Technical Deep-Dive)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
                Time per Question:
              </label>
              <select
                value={timerSecondsPerQ}
                onChange={(e) => setTimerSecondsPerQ(parseInt(e.target.value, 10))}
                className="w-full text-xs font-mono rounded-xl p-2.5 bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              >
                <option value={45}>45 Seconds (Fast Paced)</option>
                <option value={60}>60 Seconds (Standard)</option>
                <option value={90}>90 Seconds (Thoughtful)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full py-3.5 rounded-2xl bg-[#84231D] text-white text-xs font-bold font-mono shadow-sm hover:bg-[#6e1c17] transition-all flex items-center justify-center gap-2"
          >
            Start Timed Interview <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ACTIVE TIMED QUESTION VIEW */}
      {isSessionActive && currentQ && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Timer and Progress Bar */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
              Question {currentIndex + 1} of {sessionQuestions.length}
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className={`text-sm font-bold flex items-center gap-1.5 ${
                timeLeft <= 15 ? 'text-red-500 animate-pulse' : 'text-[#84231D] dark:text-[#FF8A80]'
              }`}>
                <Clock className="w-4 h-4" /> {timeLeft}s remaining
              </span>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 md:p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-[#1A253D] capitalize">
                {currentQ.category.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#C59B27]/15 text-[#C59B27] capitalize">
                {currentQ.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#14110F] dark:text-[#F3EBDD] leading-snug">
              {currentQ.question}
            </h3>

            {/* MCQ Options */}
            {currentQ.type === 'mcq' && currentQ.options && (
              <div className="grid grid-cols-1 gap-2 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))}
                      className={`p-3.5 rounded-2xl text-left text-xs font-mono transition-all ${
                        isSelected
                          ? 'bg-[#84231D]/15 border-2 border-[#84231D] text-[#84231D] dark:text-[#FF8A80] font-bold'
                          : 'bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-[#14110F] dark:text-[#F3EBDD] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Descriptive Text Input */}
            {currentQ.type === 'descriptive' && (
              <div className="space-y-2">
                <textarea
                  rows={5}
                  value={String(userAnswers[currentIndex] || '')}
                  onChange={(e) => setUserAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }))}
                  placeholder="Type your structured explanation here before the timer expires..."
                  className="w-full p-4 rounded-2xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-xs text-[#14110F] dark:text-[#F3EBDD] font-mono focus:outline-none focus:ring-2 focus:ring-[#84231D]"
                />
              </div>
            )}

            {/* Next / Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleAdvanceQuestion}
                className="px-6 py-2.5 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] transition-all font-mono"
              >
                {currentIndex < sessionQuestions.length - 1 ? 'Save & Next Question →' : 'Submit Interview Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUMMARY DIAGNOSTIC REPORT */}
      {isSessionFinished && sessionSummary && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/30 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6358] dark:text-[#94A3B8]">
                Screening Performance Assessment
              </span>
              <h3 className="text-3xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                Score: {sessionSummary.overallScorePct}%
              </h3>
              <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
                {sessionSummary.overallScorePct >= 75
                  ? 'Excellent readiness across technical and systems engineering domains.'
                  : 'Solid baseline. Focus revision on identified weak categories below.'}
              </p>
            </div>

            {/* Strong and Weak Category Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Strong Areas */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Strong Domains (≥75%):
                </span>
                {sessionSummary.strongCategories.length > 0 ? (
                  <ul className="space-y-1 text-xs text-emerald-900 dark:text-emerald-200 font-mono">
                    {sessionSummary.strongCategories.map((c) => (
                      <li key={c} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="capitalize">{c.replace('_', ' ')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] italic">No categories achieved 75% threshold in this round.</p>
                )}
              </div>

              {/* Weak Areas */}
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-2">
                <span className="text-xs font-mono font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" /> Weak Areas (&lt;70%):
                </span>
                {sessionSummary.weakCategories.length > 0 ? (
                  <ul className="space-y-1 text-xs text-red-900 dark:text-red-200 font-mono">
                    {sessionSummary.weakCategories.map((c) => (
                      <li key={c} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="capitalize">{c.replace('_', ' ')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 italic">No critical weak areas identified.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={handleStartInterview}
                className="px-5 py-2.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-stone-100 dark:hover:bg-[#1A253D]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Mock Interview
              </button>

              {sessionSummary.weakCategories.length > 0 && (
                <button
                  onClick={() => onPracticeWeakAreas(sessionSummary.weakCategories)}
                  className="px-5 py-2.5 rounded-xl bg-[#84231D] text-white text-xs font-bold font-mono shadow-sm hover:bg-[#6e1c17] transition-all flex items-center justify-center gap-1.5"
                >
                  <Target className="w-4 h-4" /> Practice My Weak Areas Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
