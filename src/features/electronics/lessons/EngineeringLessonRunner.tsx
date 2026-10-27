// src/features/electronics/lessons/EngineeringLessonRunner.tsx
// Interactive Lesson Viewer & Quiz Runner with honesty disclaimer and weak-topic remediation
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  Award,
  AlertTriangle,
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';
import { ENGINEERING_LESSONS, getLessonById } from './data';
import { EngineeringLesson, QuizQuestion } from './types';
import {
  getElectronicsProgress,
  saveLessonQuizResult,
  getWeakTopics,
  getTargetedPracticeQuestions,
  LessonProgressRecord
} from '../storage';
import { useLearning } from '../../../context/LearningContext';

export const EngineeringLessonRunner: React.FC = () => {
  const { awardXP } = useLearning();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'study' | 'quiz'>('study');
  const [progressState, setProgressState] = useState(getElectronicsProgress());

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isTargetedMode, setIsTargetedMode] = useState<boolean>(false);
  const [targetedQuestions, setTargetedQuestions] = useState<QuizQuestion[]>([]);

  // Refresh progress state
  const refreshProgress = () => {
    setProgressState(getElectronicsProgress());
  };

  const selectedLesson = selectedLessonId ? getLessonById(selectedLessonId) : null;
  const currentQuizQuestions: QuizQuestion[] = isTargetedMode
    ? targetedQuestions
    : selectedLesson?.quizQuestions || [];

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuizQuestions.length) return;
    let correct = 0;
    const missedIds: string[] = [];

    currentQuizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct += 1;
      } else {
        missedIds.push(q.id);
      }
    });

    setQuizScore(correct);
    setIsQuizSubmitted(true);

    if (selectedLesson && !isTargetedMode) {
      saveLessonQuizResult(selectedLesson.id, correct, currentQuizQuestions.length, missedIds);
      refreshProgress();
      awardXP(correct * 10, `Completed ${selectedLesson.title} Quiz`);
    } else if (isTargetedMode) {
      awardXP(correct * 15, `Targeted Practice Drill`);
      refreshProgress();
    }
  };

  const startTargetedPractice = () => {
    const questions = getTargetedPracticeQuestions();
    setTargetedQuestions(questions);
    setIsTargetedMode(true);
    setSelectedLessonId(null);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setActiveTab('quiz');
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(0);
  };

  const weakTopics = getWeakTopics();

  return (
    <div className="space-y-6">
      {/* Honesty Disclosure Banner */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Content Status:</strong> Fundamentals modules & quizzes are in draft status (
            <code className="text-[10px] bg-amber-500/20 px-1 py-0.5 rounded font-mono">reviewed: false</code>
            ). Not yet expert-reviewed by certified semiconductor faculty.
          </span>
        </div>
      </div>

      {/* Target Weak Practice Alert if user has mistakes */}
      {weakTopics.length > 0 && !selectedLessonId && !isTargetedMode && (
        <div className="p-4 rounded-2xl bg-[#84231D]/10 border border-[#84231D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#84231D] text-white flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#84231D] dark:text-[#FF8A80]">
                Weak Topics Detected ({weakTopics.length})
              </h4>
              <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
                {weakTopics.map((w) => w.lessonTitle.split(':')[0]).join(', ')} need reinforcement.
              </p>
            </div>
          </div>
          <button
            onClick={startTargetedPractice}
            className="px-4 py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] transition-all flex items-center gap-1.5"
          >
            Launch Targeted Drill <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* LESSON LIST VIEW */}
      {!selectedLessonId && !isTargetedMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
              基礎学習トラック (Engineering Fundamentals Curriculum)
            </h3>
            <span className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
              {ENGINEERING_LESSONS.length} Structured Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENGINEERING_LESSONS.map((lesson, idx) => {
              const rec: LessonProgressRecord | undefined = progressState.lessons[lesson.id];
              const isCompleted = rec?.completed || false;
              const hasAttempted = (rec?.attempts || 0) > 0;

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setActiveTab('study');
                    resetQuiz();
                  }}
                  className="p-5 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi hover:border-[#C59B27]/70 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-[#1A253D] text-[#6B6358] dark:text-[#94A3B8] capitalize">
                        {lesson.track} · {lesson.estimatedMinutes} mins
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Mastered ({rec.bestScore}/{rec.totalQuestions})
                        </span>
                      ) : hasAttempted ? (
                        <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                          Score: {rec.lastScore}/{rec.totalQuestions}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
                          Not Started
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-[#14110F] dark:text-[#F3EBDD] font-serif_jp">
                      {idx + 1}. {lesson.title}
                    </h4>
                    <p className="text-xs font-serif_jp text-[#84231D] dark:text-[#FF8A80]">
                      {lesson.titleJp}
                    </p>
                    <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] line-clamp-2">
                      {lesson.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#E7DECE] dark:border-[#1E2C48] flex items-center justify-between text-xs">
                    <span className="text-[#6B6358] dark:text-[#94A3B8] font-mono text-[11px]">
                      {lesson.quizQuestions.length} Quiz Questions
                    </span>
                    <span className="font-mono text-[#84231D] dark:text-[#FF8A80] hover:underline flex items-center gap-1 font-semibold">
                      Start Lesson <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LESSON DETAIL & QUIZ VIEW */}
      {(selectedLesson || isTargetedMode) && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-[#0E1526]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi">
            <button
              onClick={() => {
                setSelectedLessonId(null);
                setIsTargetedMode(false);
                resetQuiz();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono hover:bg-stone-100 dark:hover:bg-[#1A253D]"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Curriculum
            </button>

            {!isTargetedMode && selectedLesson && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('study')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    activeTab === 'study'
                      ? 'bg-[#84231D] text-white shadow-sm'
                      : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
                  }`}
                >
                  <BookOpen className="w-3 h-3 inline mr-1" /> Lesson Theory
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-[#84231D] text-white shadow-sm'
                      : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
                  }`}
                >
                  <Award className="w-3 h-3 inline mr-1" /> Knowledge Quiz ({selectedLesson.quizQuestions.length})
                </button>
              </div>
            )}
          </div>

          {/* STUDY TAB */}
          {activeTab === 'study' && selectedLesson && (
            <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#E7DECE] dark:border-[#1E2C48]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#84231D] dark:text-[#FF8A80]">
                  Track: {selectedLesson.track} · {selectedLesson.estimatedMinutes} Minutes
                </span>
                <h2 className="text-2xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                  {selectedLesson.title}
                </h2>
                <p className="text-sm font-serif_jp text-[#84231D] dark:text-[#FF8A80]">
                  {selectedLesson.titleJp}
                </p>
                <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] pt-2 leading-relaxed">
                  {selectedLesson.summary}
                </p>
              </div>

              {/* Lesson Sections */}
              <div className="space-y-6">
                {selectedLesson.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-bold font-serif_jp text-[#14110F] dark:text-[#F3EBDD]">
                      {sec.heading}
                    </h3>
                    <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
                      {sec.content}
                    </p>
                    {sec.formula && (
                      <div className="p-3 rounded-xl bg-[#0A101C] text-emerald-400 font-mono text-xs border border-[#1E2C48] shadow-inner">
                        {sec.formula}
                      </div>
                    )}
                    {sec.tip && (
                      <div className="p-3 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/30 text-xs text-[#14110F] dark:text-[#E2E8F0] flex items-start gap-2">
                        <Zap className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                        <span>{sec.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Worked Example */}
              <div className="p-5 rounded-2xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] space-y-3">
                <span className="text-xs font-mono font-bold text-[#84231D] dark:text-[#FF8A80] block">
                  Worked Engineering Problem (演習例)
                </span>
                <p className="text-xs font-semibold text-[#14110F] dark:text-[#F3EBDD]">
                  {selectedLesson.workedExample.problem}
                </p>
                <div className="space-y-1.5 pl-3 border-l-2 border-[#84231D]">
                  {selectedLesson.workedExample.stepByStep.map((step, sIdx) => (
                    <p key={sIdx} className="text-xs text-[#6B6358] dark:text-[#94A3B8] font-mono">
                      • {step}
                    </p>
                  ))}
                </div>
                <div className="pt-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  Result: {selectedLesson.workedExample.answer}
                </div>
              </div>

              {/* Bottom CTA to Quiz */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab('quiz');
                    resetQuiz();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] flex items-center gap-1.5"
                >
                  Proceed to Knowledge Quiz <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                    {isTargetedMode ? 'Targeted Weak Topic Drill' : `${selectedLesson?.title} Quiz`}
                  </h3>
                  <p className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
                    {currentQuizQuestions.length} Questions · Instant Feedback
                  </p>
                </div>
                {isQuizSubmitted && (
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    quizScore >= currentQuizQuestions.length * 0.75
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-500/20 text-red-700 dark:text-red-300'
                  }`}>
                    Score: {quizScore} / {currentQuizQuestions.length}
                  </span>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {currentQuizQuestions.map((q, qIdx) => {
                  const selectedOpt = userAnswers[qIdx];
                  const isCorrect = isQuizSubmitted && selectedOpt === q.correctIndex;
                  const isWrong = isQuizSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border-2 ${
                        isQuizSubmitted
                          ? isCorrect
                            ? 'border-emerald-500/60'
                            : 'border-red-500/60'
                          : 'border-[#DDD2B8] dark:border-[#253659]'
                      } shadow-washi space-y-4`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm font-semibold text-[#14110F] dark:text-[#F3EBDD]">
                          {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          const isOptionCorrect = isQuizSubmitted && optIdx === q.correctIndex;
                          const isOptionWrongSelection = isQuizSubmitted && isOptionSelected && !isOptionCorrect;

                          return (
                            <button
                              key={optIdx}
                              disabled={isQuizSubmitted}
                              onClick={() => handleSelectAnswer(qIdx, optIdx)}
                              className={`p-3 rounded-xl text-left text-xs font-mono transition-all flex items-center justify-between ${
                                isOptionCorrect
                                  ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                                  : isOptionWrongSelection
                                  ? 'bg-red-500/20 border-2 border-red-500 text-red-800 dark:text-red-200'
                                  : isOptionSelected
                                  ? 'bg-[#84231D]/15 border-2 border-[#84231D] text-[#84231D] dark:text-[#FF8A80] font-bold'
                                  : 'bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-[#14110F] dark:text-[#F3EBDD] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
                              }`}
                            >
                              <span>{opt}</span>
                              {isOptionCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {isQuizSubmitted && (
                        <div className="p-3 rounded-xl bg-stone-100 dark:bg-[#141D33] text-xs space-y-1">
                          <span className="font-mono font-bold text-[#84231D] dark:text-[#FF8A80] block">
                            Explanation:
                          </span>
                          <p className="text-[#6B6358] dark:text-[#94A3B8]">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2">
                {!isQuizSubmitted ? (
                  <button
                    disabled={Object.keys(userAnswers).length < currentQuizQuestions.length}
                    onClick={handleSubmitQuiz}
                    className="w-full py-3 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] disabled:opacity-40 transition-all font-mono"
                  >
                    Submit Answers ({Object.keys(userAnswers).length}/{currentQuizQuestions.length} Selected)
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="w-full py-3 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] flex items-center justify-center gap-2 font-mono"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Quiz Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
