// src/features/interview/components/PracticeMode.tsx
// Technical interview practice mode with instant MCQ grading and deterministic rubric evaluation
import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  X,
  Repeat
} from 'lucide-react';
import { filterInterviewQuestions } from '../data';
import { InterviewCategory, DifficultyLevel, InterviewQuestion, RubricMatchResult } from '../types';
import { evaluateDescriptiveAnswer } from '../utils/rubricMatcher';
import { AIFeedbackModal } from './AIFeedbackModal';
import { useLearning } from '../../../context/LearningContext';

export const PracticeMode: React.FC = () => {
  const { rateFSRSCard, awardXP } = useLearning();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Question interaction state
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [descriptiveText, setDescriptiveText] = useState<string>('');
  const [rubricResult, setRubricResult] = useState<RubricMatchResult | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  // Filtered pool
  const questions = useMemo(() => {
    return filterInterviewQuestions({
      category: selectedCategory,
      difficulty: selectedDifficulty
    });
  }, [selectedCategory, selectedDifficulty]);

  const currentQ: InterviewQuestion | undefined = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedMcqOption(idx);
    setIsAnswerSubmitted(true);

    if (currentQ) {
      const isCorrect = idx === currentQ.correctIndex;
      if (isCorrect) {
        awardXP(15, `Correct technical MCQ answer`);
      } else {
        // Enters FSRS as a mistake card
        rateFSRSCard(currentQ.id, 'mistake', 1);
      }
    }
  };

  const handleScoreDescriptive = () => {
    if (!currentQ || !currentQ.requiredKeyPoints) return;
    const result = evaluateDescriptiveAnswer(descriptiveText, currentQ.requiredKeyPoints);
    setRubricResult(result);
    setIsAnswerSubmitted(true);
    awardXP(result.scorePct >= 75 ? 20 : 10, `Completed descriptive interview response`);
  };

  const handleNext = () => {
    setSelectedMcqOption(null);
    setDescriptiveText('');
    setRubricResult(null);
    setIsAnswerSubmitted(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setSelectedMcqOption(null);
    setDescriptiveText('');
    setRubricResult(null);
    setIsAnswerSubmitted(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleResetCurrent = () => {
    setSelectedMcqOption(null);
    setDescriptiveText('');
    setRubricResult(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Category & Difficulty Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/95 dark:bg-[#0E1526]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
          <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as InterviewCategory | 'all');
              setCurrentIndex(0);
              handleResetCurrent();
            }}
            className="text-xs rounded-xl px-3 py-1.5 bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-[#14110F] dark:text-[#F3EBDD] font-mono focus:outline-none"
          >
            <option value="all">All Domains (60 Questions)</option>
            <option value="ece_fundamentals">ECE Fundamentals</option>
            <option value="semiconductors">Semiconductors & Physics</option>
            <option value="manufacturing_process">Manufacturing & Process</option>
            <option value="embedded_systems">Embedded Systems</option>
            <option value="quality_testing">Quality & Testing</option>
            <option value="troubleshooting">Troubleshooting</option>
            <option value="projects">Engineering Projects</option>
            <option value="behavioral_hr">Behavioral & HR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
            Level:
          </span>
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value as DifficultyLevel | 'all');
              setCurrentIndex(0);
              handleResetCurrent();
            }}
            className="text-xs rounded-xl px-3 py-1.5 bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-[#14110F] dark:text-[#F3EBDD] font-mono focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Header Stats */}
          <div className="flex items-center justify-between text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-[#1A253D] capitalize">
                {currentQ.category.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C59B27]/15 text-[#C59B27] font-semibold capitalize">
                {currentQ.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] uppercase text-[10px]">
                {currentQ.type}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-[#14110F] dark:text-[#F3EBDD] leading-snug">
              {currentQ.question}
            </h3>

            {/* MCQ INTERACTION */}
            {currentQ.type === 'mcq' && currentQ.options && (
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedMcqOption === optIdx;
                  const isCorrect = isAnswerSubmitted && optIdx === currentQ.correctIndex;
                  const isWrong = isAnswerSubmitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3.5 rounded-2xl text-left text-xs font-mono transition-all flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                          : isWrong
                          ? 'bg-red-500/20 border-2 border-red-500 text-red-900 dark:text-red-100'
                          : isSelected
                          ? 'bg-[#84231D]/15 border-2 border-[#84231D] text-[#84231D] dark:text-[#FF8A80] font-bold'
                          : 'bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-[#14110F] dark:text-[#F3EBDD] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrong && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* DESCRIPTIVE INTERACTION */}
            {currentQ.type === 'descriptive' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#6B6358] dark:text-[#94A3B8]">
                    Your Technical Answer:
                  </label>
                  <textarea
                    rows={6}
                    disabled={isAnswerSubmitted}
                    value={descriptiveText}
                    onChange={(e) => setDescriptiveText(e.target.value)}
                    placeholder="Type your structured explanation here (covering core mechanisms, parameters, and trade-offs)..."
                    className="w-full p-4 rounded-2xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-xs text-[#14110F] dark:text-[#F3EBDD] font-mono focus:outline-none focus:ring-2 focus:ring-[#84231D] leading-relaxed"
                  />
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    disabled={!descriptiveText.trim()}
                    onClick={handleScoreDescriptive}
                    className="px-6 py-2.5 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] disabled:opacity-40 transition-all font-mono"
                  >
                    Evaluate Answer via Rubric
                  </button>
                ) : (
                  <div className="space-y-4 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48] animate-fadeIn">
                    {/* Rubric Evaluation Box */}
                    {rubricResult && (
                      <div className="p-5 rounded-2xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
                            Deterministic Rubric Score:
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                            rubricResult.scorePct >= 75
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}>
                            {rubricResult.matchedCount} of {rubricResult.totalPoints} Points ({rubricResult.scorePct}%)
                          </span>
                        </div>

                        {/* Keyword-based disclaimer */}
                        <div className="p-2.5 rounded-xl bg-stone-200/60 dark:bg-[#0A101C]/60 text-[11px] font-mono text-[#6B6358] dark:text-[#94A3B8] flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Evaluation is calculated strictly using deterministic keyword & concept matching, not artificial intelligence.</span>
                        </div>

                        {/* Key Points Checklist */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
                            Key Concepts Detected:
                          </span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {currentQ.requiredKeyPoints?.map((kp) => {
                              const wasFound = rubricResult.foundKeyPoints.some((f) => f.id === kp.id);
                              return (
                                <div
                                  key={kp.id}
                                  className={`p-2 rounded-xl text-xs flex items-center justify-between font-mono ${
                                    wasFound
                                      ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 border border-emerald-500/30'
                                      : 'bg-stone-100 dark:bg-[#101726] text-[#6B6358] dark:text-[#94A3B8] border border-stone-200 dark:border-stone-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {wasFound ? (
                                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-500 shrink-0" />
                                    )}
                                    <span>{kp.label}</span>
                                  </div>
                                  <span className="text-[10px] opacity-75">
                                    {wasFound ? 'Found' : 'Missing'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Official Model Answer */}
                        <div className="p-4 rounded-xl bg-white dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] space-y-1.5">
                          <span className="text-[11px] font-mono font-bold text-[#84231D] dark:text-[#FF8A80] block">
                            Official Model Answer (模範解答):
                          </span>
                          <p className="text-xs text-[#14110F] dark:text-[#E2E8F0] leading-relaxed">
                            {currentQ.modelAnswer}
                          </p>
                        </div>

                        {/* AI Feedback Trigger */}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-[#C59B27]/15 hover:bg-[#C59B27]/25 text-[#C59B27] border border-[#C59B27]/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Request AI Sensei Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MCQ Explanation if submitted */}
            {isAnswerSubmitted && currentQ.type === 'mcq' && (
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-[#141D33] text-xs space-y-1.5 border border-[#DDD2B8] dark:border-[#253659] animate-fadeIn">
                <span className="font-mono font-bold text-[#84231D] dark:text-[#FF8A80] block">
                  Technical Explanation:
                </span>
                <p className="text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Navigation & Reset Controls */}
            <div className="pt-4 border-t border-[#E7DECE] dark:border-[#1E2C48] flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              {isAnswerSubmitted && (
                <button
                  onClick={handleResetCurrent}
                  className="px-3 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono flex items-center gap-1 text-[#6B6358] dark:text-[#94A3B8]"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] font-mono"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
          No questions found matching your filter criteria.
        </div>
      )}

      {/* AI Feedback Modal */}
      {currentQ && (
        <AIFeedbackModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          questionText={currentQ.question}
          candidateAnswerText={descriptiveText}
        />
      )}
    </div>
  );
};
