// src/components/jlpt/JLPTArena.tsx
// Realistic timed JLPT N5 diagnostic exam simulator with score report and trilingual explanations
import React, { useState, useEffect } from 'react';
import {
  Award,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { JLPT_N5_MOCK_EXAM } from '../../data/jlptMockData';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const JLPTArena: React.FC = () => {
  const { awardXP, recordAttempt, displayMode } = useLearning();
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(JLPT_N5_MOCK_EXAM.time_limit_minutes * 60);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [scoreReport, setScoreReport] = useState<{
    totalScorePct: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  // Flatten questions from all sections
  const allQuestions = JLPT_N5_MOCK_EXAM.sections.flatMap((s) => s.questions);

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
    let correct = 0;
    allQuestions.forEach((q) => {
      if (answers[q.id] === q.correct_index) correct += 1;
    });

    const scorePct = Math.round((correct / allQuestions.length) * 100);
    const passed = scorePct >= JLPT_N5_MOCK_EXAM.passing_score_pct;

    setScoreReport({
      totalScorePct: scorePct,
      passed,
      correctAnswers: correct,
      totalQuestions: allQuestions.length
    });

    if (passed) {
      soundEffects.playLevelUp();
      awardXP(150, 'Passed JLPT N5 Official Format Mock Exam');
    } else {
      soundEffects.playWrong();
      awardXP(40, 'Completed JLPT N5 Mock Exam Attempt');
    }

    recordAttempt({
      item_id: JLPT_N5_MOCK_EXAM.id,
      item_type: 'grammar',
      skill: 'reading',
      question_type: 'jlpt_mock_exam',
      user_response: `${scorePct}% (${correct}/${allQuestions.length})`,
      expected_response: `60%+ to pass`,
      is_correct: passed,
      response_time_ms: (JLPT_N5_MOCK_EXAM.time_limit_minutes * 60 - timeLeft) * 1000,
      hint_used: false,
      retry_count: 0
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>JLPT模擬試験場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">JLPT Exam Arena</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Timed diagnostic test adhering to official JLPT N5 language knowledge, grammar, and listening formats.
          </p>
        </div>

        {examStarted && !examSubmitted && (
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-kai-vermilion bg-red-50 dark:bg-red-950/40 px-3.5 py-1.5 rounded-2xl border border-red-200">
            <Timer size={16} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {!examStarted ? (
        /* Pre-exam Briefing Screen */
        <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 text-center">
          <Award size={56} className="text-kai-gold mx-auto" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
              {JLPT_N5_MOCK_EXAM.title}
            </h2>
            <p className="text-xs text-kai-muted max-w-md mx-auto">
              Test your proficiency across vocabulary, grammar patterns, and listening comprehension. Passing score is 60%.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
              <span className="text-2xs font-mono text-kai-muted uppercase block">Time</span>
              <span className="font-bold text-base">{JLPT_N5_MOCK_EXAM.time_limit_minutes} Min</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
              <span className="text-2xs font-mono text-kai-muted uppercase block">Questions</span>
              <span className="font-bold text-base">{allQuestions.length} Items</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
              <span className="text-2xs font-mono text-kai-muted uppercase block">Passing Mark</span>
              <span className="font-bold text-base text-kai-vermilion">60%</span>
            </div>
          </div>

          <button
            onClick={() => {
              setExamStarted(true);
              soundEffects.playLevelUp();
            }}
            className="px-8 py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion transition-transform active:scale-95"
          >
            Begin Timed Examination
          </button>
        </div>
      ) : (
        /* Exam in Progress or Results */
        <div className="space-y-6">
          {/* Result Banner if submitted */}
          {scoreReport && (
            <div
              className={`p-6 rounded-3xl border text-center space-y-3 animate-in fade-in ${
                scoreReport.passed
                  ? 'bg-green-50 dark:bg-green-950/40 border-green-300 text-green-900 dark:text-green-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="text-4xl font-bold font-mono">
                {scoreReport.totalScorePct}% Score
              </div>
              <h3 className="text-lg font-bold">
                {scoreReport.passed ? '🎉 Congratulations! You Passed JLPT N5 Simulation!' : 'Good Effort! Keep Reviewing Your Weak Points.'}
              </h3>
              <p className="text-xs">
                Correct: {scoreReport.correctAnswers} of {scoreReport.totalQuestions} questions. Review the full explanations below.
              </p>
            </div>
          )}

          {/* Sections Questions */}
          {JLPT_N5_MOCK_EXAM.sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-5"
            >
              <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp border-b border-kai-border/50 pb-2">
                Section {sIdx + 1}: {section.name}
              </h3>

              <div className="space-y-6">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-3 p-4 rounded-2xl bg-kai-bg/50 dark:bg-kai-dark-bg/60 border border-kai-border/60">
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
                      {q.options.map((opt, optIdx) => {
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

                    {/* Explanations shown upon submission */}
                    {examSubmitted && (
                      <div className="p-3 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border text-2xs space-y-1">
                        <span className="font-bold text-kai-ink dark:text-white block">Explanation:</span>
                        <p className="text-kai-muted">{q.explanation_en}</p>
                        {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                          <p className="font-telugu text-kai-vermilion">{q.explanation_te}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Exam Button */}
          {!examSubmitted ? (
            <button
              onClick={handleSubmitExam}
              className="w-full py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion transition-transform active:scale-95"
            >
              Submit Exam For Official Scoring
            </button>
          ) : (
            <button
              onClick={() => {
                setExamStarted(false);
                setExamSubmitted(false);
                setAnswers({});
                setTimeLeft(JLPT_N5_MOCK_EXAM.time_limit_minutes * 60);
              }}
              className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-kai-ink font-bold text-xs"
            >
              Reset Exam
            </button>
          )}
        </div>
      )}
    </div>
  );
};
