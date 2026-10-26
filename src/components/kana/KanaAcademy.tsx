// src/components/kana/KanaAcademy.tsx
// Comprehensive Kana Academy with progressive beginner lessons, Gojuon grid, stroke order tracing, and Telugu phonetics
import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Volume2,
  PenTool,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  Trophy,
  Edit3
} from 'lucide-react';
import * as wanakana from 'wanakana';
import { HIRAGANA_DATA, KATAKANA_DATA, HIRAGANA_LESSONS, KATAKANA_LESSONS } from '../../data/kanaData';
import { KanaItem, KanaLesson } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { DrawingCanvas } from '../common/DrawingCanvas';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { storageService } from '../../services/storageService';

export const KanaAcademy: React.FC = () => {
  const { displayMode, romajiEnabled, awardXP, recordAttempt, rateFSRSCard } = useLearning();

  // Script selection (Hiragana vs Katakana)
  const [selectedScript, setSelectedScript] = useState<'hiragana' | 'katakana'>('hiragana');
  const currentDataset = selectedScript === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;

  // Active view tab
  const [activeTab, setActiveTab] = useState<'lessons' | 'grid' | 'practice' | 'quiz'>('lessons');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);

  // Grid row filtering
  const [activeGroup, setActiveGroup] = useState<
    'all' | 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa'
  >('all');

  // Handwriting Practice state
  const [practiceMode, setPracticeMode] = useState<'trace' | 'freehand'>('trace');
  const [isTracingComplete, setIsTracingComplete] = useState<boolean>(false);

  // --- Beginner Lessons State ---
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [lessonStage, setLessonStage] = useState<'learn' | 'practice' | 'completed'>('learn');
  const [practiceType, setPracticeType] = useState<'multiple_choice' | 'typing'>('multiple_choice');
  const [lessonTypingInput, setLessonTypingInput] = useState<string>('');
  const [lessonQuestionIndex, setLessonQuestionIndex] = useState<number>(0);
  const [selectedLessonOption, setSelectedLessonOption] = useState<number | null>(null);
  const [lessonAnswered, setLessonAnswered] = useState<boolean>(false);
  const [lessonScore, setLessonScore] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() =>
    storageService.getCompletedLessons()
  );

  const currentLessons: KanaLesson[] =
    selectedScript === 'hiragana' ? HIRAGANA_LESSONS : KATAKANA_LESSONS;
  const activeLesson: KanaLesson = currentLessons[activeLessonIndex] || currentLessons[0];
  const lessonQuestions = activeLesson.practiceQuestions;
  const currentLessonQuestion = lessonQuestions[lessonQuestionIndex] || lessonQuestions[0];

  // Calculate recommended next lesson based on logged mistakes or progression
  const recommendedLesson = useMemo(() => {
    const mistakes = storageService.getMistakes().filter((m) => !m.resolved);
    for (const lesson of currentLessons) {
      const charsInLesson = currentDataset
        .filter((k) => lesson.characterIds.includes(k.id))
        .map((k) => k.character);
      const hasMistake = mistakes.some(
        (m) =>
          charsInLesson.includes(m.correct_answer) || charsInLesson.includes(m.mistaken_input)
      );
      if (hasMistake) return { lesson, reason: 'mistake_focus' as const };
    }
    const firstUncompleted = currentLessons.find((l) => !completedLessons.includes(l.id));
    return { lesson: firstUncompleted || currentLessons[0], reason: 'progression' as const };
  }, [currentLessons, currentDataset, completedLessons]);

  // Grid filtered kana
  const filteredKana = currentDataset.filter((item) => {
    if (activeGroup === 'all') return true;
    return item.row === activeGroup;
  });

  const handleSelectKana = (item: KanaItem) => {
    setSelectedKana(item);
    setIsTracingComplete(false);
    soundEffects.playClick();
  };

  const handleStrokeComplete = (strokeCount: number) => {
    if (strokeCount >= selectedKana.stroke_count) {
      setIsTracingComplete(true);
      soundEffects.playCorrect();
      awardXP(10, `Traced ${selectedScript === 'hiragana' ? 'Hiragana' : 'Katakana'} ${selectedKana.character}`);
      recordAttempt({
        item_id: selectedKana.id,
        item_type: 'kana',
        skill: 'writing',
        question_type: 'stroke_tracing',
        user_response: `${strokeCount} strokes`,
        expected_response: `${selectedKana.stroke_count} strokes`,
        is_correct: true,
        response_time_ms: 2500,
        hint_used: practiceMode === 'trace',
        retry_count: 0
      });
      rateFSRSCard(selectedKana.id, 'kana', 3);
    }
  };

  // --- Timed Quiz State ---
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  const currentQuizItem = currentDataset[quizQuestionIndex % currentDataset.length];
  const quizOptions = useMemo(() => {
    const distractors = currentDataset
      .filter((k) => k.id !== currentQuizItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentQuizItem, ...distractors].sort(() => 0.5 - Math.random());
  }, [quizQuestionIndex, currentQuizItem, currentDataset]);

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIndex);
    setQuizAnswered(true);

    const isCorrect = quizOptions[optionIndex].id === currentQuizItem.id;
    if (isCorrect) {
      soundEffects.playCorrect();
      setQuizScore((prev) => prev + 1);
      awardXP(15, 'Correct Kana Recall');
      recordAttempt({
        item_id: currentQuizItem.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'multiple_choice',
        user_response: quizOptions[optionIndex].character,
        expected_response: currentQuizItem.character,
        is_correct: true,
        response_time_ms: 1800,
        hint_used: false,
        retry_count: 0
      });
      rateFSRSCard(currentQuizItem.id, 'kana', 4);
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: currentQuizItem.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'multiple_choice',
        user_response: quizOptions[optionIndex].character,
        expected_response: currentQuizItem.character,
        is_correct: false,
        error_category: 'kana_confusion',
        response_time_ms: 2200,
        hint_used: false,
        retry_count: 1
      });
      rateFSRSCard(currentQuizItem.id, 'kana', 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizQuestionIndex((prev) => prev + 1);
    setQuizAnswered(false);
    setSelectedQuizOption(null);
  };

  // --- Beginner Lesson Practice Answer Handler ---
  const handleLessonAnswer = (optionIdx: number) => {
    if (lessonAnswered) return;
    setSelectedLessonOption(optionIdx);
    setLessonAnswered(true);

    const chosenOption = currentLessonQuestion.options[optionIdx];
    const isCorrect = chosenOption.isCorrect;

    if (isCorrect) {
      soundEffects.playCorrect();
      setLessonScore((prev) => prev + 1);
      awardXP(15, `Mastered ${activeLesson.title}`);
      recordAttempt({
        item_id: currentLessonQuestion.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'lesson_practice',
        user_response: chosenOption.text,
        expected_response: currentLessonQuestion.options.find((o) => o.isCorrect)?.text || '',
        is_correct: true,
        response_time_ms: 2100,
        hint_used: false,
        retry_count: 0
      });
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: currentLessonQuestion.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'lesson_practice',
        user_response: chosenOption.text,
        expected_response: currentLessonQuestion.options.find((o) => o.isCorrect)?.text || '',
        is_correct: false,
        error_category: 'kana_confusion',
        response_time_ms: 2400,
        hint_used: false,
        retry_count: 1
      });
    }
  };

  const handleLessonTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lessonAnswered || !lessonTypingInput.trim()) return;

    const correctOption = currentLessonQuestion.options.find((o) => o.isCorrect);
    const correctText = (correctOption?.text || '').trim();
    const correctReading = (correctOption?.reading || '').trim().toLowerCase();
    const inputClean = lessonTypingInput.trim().toLowerCase();
    const inputHiragana = wanakana.toHiragana(inputClean);
    const inputRomaji = wanakana.toRomaji(inputClean).toLowerCase();

    const isCorrect =
      inputClean === correctReading ||
      inputClean === correctText.toLowerCase() ||
      inputHiragana === correctText ||
      inputRomaji === correctReading ||
      inputClean === (currentLessonQuestion.characterToTest || '').toLowerCase();

    setLessonAnswered(true);
    const chosenIdx = isCorrect
      ? currentLessonQuestion.options.findIndex((o) => o.isCorrect)
      : currentLessonQuestion.options.findIndex((o) => !o.isCorrect);
    setSelectedLessonOption(chosenIdx >= 0 ? chosenIdx : 0);

    if (isCorrect) {
      soundEffects.playCorrect();
      setLessonScore((prev) => prev + 1);
      awardXP(15, `Typed recall mastered: ${activeLesson.title}`);
      recordAttempt({
        item_id: currentLessonQuestion.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'lesson_typing',
        user_response: inputClean,
        expected_response: correctReading || correctText,
        is_correct: true,
        response_time_ms: 2200,
        hint_used: false,
        retry_count: 0
      });
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: currentLessonQuestion.id,
        item_type: 'kana',
        skill: 'reading',
        question_type: 'lesson_typing',
        user_response: inputClean,
        expected_response: correctReading || correctText,
        is_correct: false,
        error_category: 'kana_confusion',
        response_time_ms: 2500,
        hint_used: false,
        retry_count: 1
      });
      storageService.recordMistake({
        item_id: currentLessonQuestion.id,
        item_type: 'kana',
        prompt: currentLessonQuestion.characterToTest || currentLessonQuestion.prompt,
        mistaken_input: inputClean,
        correct_answer: correctReading || correctText,
        error_category: 'kana_typing_confusion',
        notes_en: currentLessonQuestion.explanationEn,
        notes_te: currentLessonQuestion.explanationTe
      });
    }
  };

  const nextLessonQuestion = () => {
    if (lessonQuestionIndex + 1 < lessonQuestions.length) {
      setLessonQuestionIndex((prev) => prev + 1);
      setLessonAnswered(false);
      setSelectedLessonOption(null);
      setLessonTypingInput('');
    } else {
      // Completed current lesson practice -> Celebrate!
      soundEffects.playLevelUp();
      awardXP(30, `Completed ${activeLesson.title} Practice Session`);
      storageService.markLessonCompleted(activeLesson.id);
      setCompletedLessons(storageService.getCompletedLessons());
      setLessonStage('completed');
    }
  };

  const resetLessonPractice = () => {
    setLessonQuestionIndex(0);
    setLessonAnswered(false);
    setSelectedLessonOption(null);
    setLessonTypingInput('');
    setLessonScore(0);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header with Script Switcher & Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-kai-border dark:border-kai-dark-border pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
              <span>{selectedScript === 'hiragana' ? 'ひらがな道場' : 'カタカナ道場'}</span>
              <span className="text-sm font-sans font-normal text-kai-muted">
                {selectedScript === 'hiragana' ? 'Hiragana Academy' : 'Katakana Academy'}
              </span>
            </h1>

            {/* Script Toggle Pill */}
            <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSelectedScript('hiragana');
                  setSelectedKana(HIRAGANA_DATA[0]);
                  setActiveLessonIndex(0);
                  setLessonStage('learn');
                  resetLessonPractice();
                }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedScript === 'hiragana'
                    ? 'bg-kai-vermilion text-white shadow-sm'
                    : 'text-kai-muted hover:text-kai-ink'
                }`}
              >
                Hiragana (ひらがな)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedScript('katakana');
                  setSelectedKana(KATAKANA_DATA[0]);
                  setActiveLessonIndex(0);
                  setLessonStage('learn');
                  resetLessonPractice();
                }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedScript === 'katakana'
                    ? 'bg-kai-indigo text-white shadow-sm'
                    : 'text-kai-muted hover:text-kai-ink'
                }`}
              >
                Katakana (カタカナ)
              </button>
            </div>
          </div>

          <p className="text-xs text-kai-muted dark:text-kai-dark-muted mt-1">
            Step-by-step beginner progression with Telugu phonetic guides and stroke order tracing.
          </p>
        </div>

        {/* View Switcher: Lessons, Grid, Handwriting Practice, Timed Quiz */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'lessons'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            <BookOpen size={13} className="text-kai-vermilion" />
            <span>Beginner Lessons</span>
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'grid'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            Gojuon Grid
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'practice'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            Tracing
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-kai-dark-surface text-kai-ink dark:text-white shadow-sm'
                : 'text-kai-muted hover:text-kai-ink'
            }`}
          >
            Timed Quiz
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: PROGRESSIVE BEGINNER LESSONS (No answer pre-reveals, pure mastery) */}
      {/* ========================================================================= */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Recommended Next Lesson Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-2xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span>{recommendedLesson.reason === 'mistake_focus' ? 'Focused Review (Recent Mistakes)' : 'Recommended Next Lesson'}</span>
                </div>
                <h3 className="text-sm font-bold text-kai-ink dark:text-white">
                  Lesson {recommendedLesson.lesson.lessonNumber}: {recommendedLesson.lesson.title}
                </h3>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-2xs text-amber-700 dark:text-amber-300">
                    {recommendedLesson.lesson.titleTe}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const idx = currentLessons.findIndex((l) => l.id === recommendedLesson.lesson.id);
                if (idx >= 0) setActiveLessonIndex(idx);
                setLessonStage('learn');
                resetLessonPractice();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition-transform active:scale-95 shadow-sm"
            >
              <span>Start Recommended</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Lesson Selector Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-2xs font-mono font-bold uppercase tracking-wider text-kai-vermilion">
                  {selectedScript === 'hiragana' ? 'Hiragana Basic to Advanced Curriculum' : 'Katakana Loanwords Curriculum'}
                </span>
                <h2 className="text-base font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  {activeLesson.title}
                </h2>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-xs text-kai-vermilion mt-0.5 font-medium">
                    {activeLesson.titleTe}
                  </p>
                )}
              </div>

              {/* Stage Switcher within Lesson: Learn First vs Practice Quiz */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-bg border border-kai-border/50 text-xs">
                <button
                  type="button"
                  onClick={() => setLessonStage('learn')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    lessonStage === 'learn'
                      ? 'bg-white dark:bg-kai-dark-card text-kai-ink dark:text-white shadow-sm'
                      : 'text-kai-muted'
                  }`}
                >
                  1. Learn Characters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLessonStage('practice');
                    resetLessonPractice();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    lessonStage === 'practice'
                      ? 'bg-kai-vermilion text-white shadow-sm'
                      : 'text-kai-muted hover:text-kai-ink'
                  }`}
                >
                  2. Practice Quiz
                </button>
              </div>
            </div>

            {/* Lesson Selection Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
              {currentLessons.map((les, idx) => {
                const isCompleted = completedLessons.includes(les.id);
                const isActive = activeLessonIndex === idx;
                return (
                  <button
                    key={les.id}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setLessonStage('learn');
                      resetLessonPractice();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                      isActive
                        ? selectedScript === 'hiragana'
                          ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion font-bold'
                          : 'bg-kai-indigo text-white border-kai-indigo shadow-sm font-bold'
                        : isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-stone-50 dark:bg-kai-dark-bg border-kai-border dark:border-kai-dark-border text-kai-muted hover:text-kai-ink'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 size={12} className={isActive ? 'text-white' : 'text-emerald-600'} />}
                    <span>Lesson {les.lessonNumber}: {les.row.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STAGE A: LEARN FIRST */}
          {lessonStage === 'learn' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <p>
                  <strong>Lesson Guidance:</strong> {activeLesson.summaryEn}
                </p>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu mt-1 text-2xs text-amber-950 dark:text-amber-100">
                    {activeLesson.summaryTe}
                  </p>
                )}
              </div>

              {/* Characters Taught in this Lesson */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {activeLesson.characterIds.map((charId) => {
                  const item = currentDataset.find((k) => k.id === charId);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi flex flex-col items-center justify-between gap-3 text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border flex items-center justify-center">
                        <span className="font-japanese text-4xl font-bold text-kai-ink dark:text-white">
                          {item.character}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-mono text-sm font-bold text-kai-indigo dark:text-indigo-300">
                          {item.romaji}
                        </div>
                        <div className="font-telugu text-xs font-semibold text-kai-vermilion">
                          {item.telugu_phonetic}
                        </div>
                        <div className="text-3xs font-mono text-kai-muted">
                          {item.stroke_count} strokes
                        </div>
                      </div>

                      <p className="text-3xs text-kai-muted leading-tight">
                        {item.mnemonic_en}
                      </p>

                      <div className="pt-2 border-t border-kai-border/50 w-full flex items-center justify-center gap-2">
                        <AudioButton text={item.character} size="sm" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKana(item);
                            setActiveTab('practice');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-3xs font-semibold text-kai-ink dark:text-white"
                        >
                          Trace
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action to proceed to practice */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLessonStage('practice');
                    resetLessonPractice();
                  }}
                  className="px-6 py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion flex items-center gap-2 transition-transform active:scale-95"
                >
                  <span>Ready for Practice Test (No Answers Shown)</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STAGE B: PRACTICE DRILL (Pure, isolated beginner questions without revealing answer) */}
          {lessonStage === 'practice' && (
            <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
              {/* Question Progress Header & Practice Mode Switch */}
              <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-mono text-kai-muted uppercase">
                      Question {lessonQuestionIndex + 1} of {lessonQuestions.length}
                    </span>
                    <div className="flex items-center p-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-3xs">
                      <button
                        type="button"
                        onClick={() => setPracticeType('multiple_choice')}
                        className={`px-2 py-0.5 rounded font-medium ${
                          practiceType === 'multiple_choice'
                            ? 'bg-white dark:bg-kai-dark-card shadow-xs text-kai-ink dark:text-white'
                            : 'text-kai-muted'
                        }`}
                      >
                        Multiple Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => setPracticeType('typing')}
                        className={`px-2 py-0.5 rounded font-medium ${
                          practiceType === 'typing'
                            ? 'bg-white dark:bg-kai-dark-card shadow-xs text-kai-ink dark:text-white'
                            : 'text-kai-muted'
                        }`}
                      >
                        Typing
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-kai-ink dark:text-white">
                    {activeLesson.title} — Active Recall
                  </h3>
                </div>
                <div className="text-xs font-mono font-bold text-kai-green">
                  Score: {lessonScore} / {lessonQuestions.length}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-3 text-center py-2">
                <p className="text-xs text-kai-muted font-sans">{currentLessonQuestion.prompt}</p>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && currentLessonQuestion.promptTe && (
                  <p className="font-telugu text-xs text-kai-vermilion font-medium">
                    {currentLessonQuestion.promptTe}
                  </p>
                )}

                {currentLessonQuestion.characterToTest && (
                  <div className="text-6xl font-bold font-japanese text-kai-ink dark:text-white py-2 select-none animate-in zoom-in-95">
                    {currentLessonQuestion.characterToTest}
                  </div>
                )}
              </div>

              {/* Multiple Choice Mode */}
              {practiceType === 'multiple_choice' ? (
                <div className="grid grid-cols-2 gap-3">
                  {currentLessonQuestion.options.map((opt, idx) => {
                    const isSelected = selectedLessonOption === idx;
                    let btnClass =
                      'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink dark:text-white hover:border-kai-vermilion';

                    if (lessonAnswered) {
                      if (opt.isCorrect) {
                        btnClass =
                          'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-300 font-bold';
                      } else if (isSelected) {
                        btnClass =
                          'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={lessonAnswered}
                        onClick={() => handleLessonAnswer(idx)}
                        className={`p-4 rounded-2xl border text-center transition-all ${btnClass}`}
                      >
                        <div className="font-japanese text-xl font-bold">{opt.text}</div>
                        {opt.reading && (
                          <div className="font-mono text-xs text-kai-muted mt-0.5">{opt.reading}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Direct Typing / Recall Mode */
                <form onSubmit={handleLessonTypingSubmit} className="space-y-3">
                  <input
                    type="text"
                    autoFocus
                    disabled={lessonAnswered}
                    value={lessonTypingInput}
                    onChange={(e) => setLessonTypingInput(e.target.value)}
                    placeholder="Type in Romaji or Kana (e.g. a, ka, shi)..."
                    className="w-full px-4 py-3 rounded-2xl border border-kai-border bg-stone-50 dark:bg-stone-900 text-center font-mono text-base outline-none focus:ring-2 focus:ring-kai-indigo/20"
                  />
                  {!lessonAnswered && (
                    <button
                      type="submit"
                      disabled={!lessonTypingInput.trim()}
                      className="w-full py-2.5 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark disabled:opacity-40 text-white font-bold text-xs transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                </form>
              )}

              {/* Immediate Feedback with Explanation (Shown ONLY after user answers) */}
              {lessonAnswered && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                    currentLessonQuestion.options[selectedLessonOption || 0]?.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 text-red-900 dark:text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {currentLessonQuestion.options[selectedLessonOption || 0]?.isCorrect ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Correct! (+15 XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-600" />
                        <span>Mistake Logged — Review Below</span>
                      </>
                    )}
                  </div>

                  <p className="leading-relaxed text-2xs opacity-90">
                    {currentLessonQuestion.explanationEn}
                  </p>

                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <p className="font-telugu leading-relaxed text-2xs pt-1 border-t border-kai-border/40 font-medium">
                      {currentLessonQuestion.explanationTe}
                    </p>
                  )}
                </div>
              )}

              {/* Next Question / Finish Button */}
              {lessonAnswered && (
                <button
                  type="button"
                  onClick={nextLessonQuestion}
                  className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <span>
                    {lessonQuestionIndex + 1 < lessonQuestions.length
                      ? 'Next Question'
                      : 'Complete Lesson Practice'}
                  </span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}

          {/* STAGE C: CELEBRATION & LESSON SUMMARY */}
          {lessonStage === 'completed' && (
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi-lg space-y-6 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                <Trophy size={32} />
              </div>

              <div className="space-y-1">
                <span className="text-2xs font-mono font-bold uppercase tracking-wider text-kai-vermilion">
                  Lesson Completed! • レッスン完了
                </span>
                <h3 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-white">
                  {activeLesson.title}
                </h3>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-sm font-semibold text-kai-vermilion">
                    {activeLesson.titleTe}
                  </p>
                )}
              </div>

              {/* Performance Summary Pill Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-kai-border/60">
                  <span className="text-3xs font-mono text-kai-muted uppercase block">Accuracy</span>
                  <span className="text-xl font-bold font-mono text-kai-ink dark:text-white">
                    {Math.round((lessonScore / (lessonQuestions.length || 1)) * 100)}%
                  </span>
                  <span className="text-2xs font-mono text-kai-muted block">({lessonScore}/{lessonQuestions.length})</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60">
                  <span className="text-3xs font-mono text-amber-800 dark:text-amber-300 uppercase block">Bonus XP</span>
                  <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">+30 XP</span>
                  <span className="text-2xs font-mono text-amber-700/80 block">Completed</span>
                </div>
              </div>

              {/* Mastered Characters Review */}
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Characters Mastered in this Lesson:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {activeLesson.characterIds.map((charId) => {
                    const char = currentDataset.find((k) => k.id === charId);
                    if (!char) return null;
                    return (
                      <div
                        key={charId}
                        className="p-2.5 rounded-xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border flex flex-col items-center justify-center text-center"
                      >
                        <span className="text-2xl font-bold font-japanese text-kai-ink dark:text-white">
                          {char.character}
                        </span>
                        <span className="font-mono text-2xs text-kai-indigo">{char.romaji}</span>
                        <div className="mt-1">
                          <AudioButton text={char.character} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-2 pt-2">
                {activeLessonIndex + 1 < currentLessons.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLessonIndex((prev) => prev + 1);
                      setLessonStage('learn');
                      resetLessonPractice();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <span>Advance to Lesson {activeLessonIndex + 2}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-green-50 text-green-800 font-bold text-xs">
                    🎉 Congratulations! You have completed all {selectedScript === 'hiragana' ? 'Hiragana' : 'Katakana'} lessons!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLessonStage('practice');
                      resetLessonPractice();
                    }}
                    className="py-2.5 rounded-xl border border-kai-border hover:bg-stone-50 dark:hover:bg-kai-dark-card text-xs font-semibold text-kai-ink dark:text-white"
                  >
                    Practice Again
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLessonStage('learn');
                      resetLessonPractice();
                    }}
                    className="py-2.5 rounded-xl border border-kai-border hover:bg-stone-50 dark:hover:bg-kai-dark-card text-xs font-semibold text-kai-ink dark:text-white"
                  >
                    Review Characters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: GOJUON GRID VIEW                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Kana Grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Row Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All (すべて)' },
                { id: 'a', label: 'あ-Row' },
                { id: 'ka', label: 'か-Row (K)' },
                { id: 'sa', label: 'さ-Row (S)' },
                { id: 'ta', label: 'た-Row (T)' },
                { id: 'na', label: 'な-Row (N)' },
                { id: 'ha', label: 'は-Row (H)' },
                { id: 'ma', label: 'ま-Row (M)' },
                { id: 'ya', label: 'や-Row (Y)' },
                { id: 'ra', label: 'ら-Row (R)' },
                { id: 'wa', label: 'わ-Row (W)' }
              ].map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setActiveGroup(grp.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    activeGroup === grp.id
                      ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion'
                      : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border text-kai-muted hover:text-kai-ink'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Kana Tiles Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {filteredKana.map((item) => {
                const isSelected = selectedKana.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectKana(item)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col items-center justify-center relative select-none ${
                      isSelected
                        ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion scale-105 z-10'
                        : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border hover:border-kai-vermilion/50 hover:shadow-washi text-kai-ink dark:text-kai-dark-ink'
                    }`}
                  >
                    <span className="font-japanese text-3xl font-bold tracking-tight">
                      {item.character}
                    </span>

                    <div className="flex items-center gap-1.5 mt-1">
                      {romajiEnabled && (
                        <span
                          className={`font-mono text-xs ${
                            isSelected ? 'text-white/90' : 'text-kai-indigo dark:text-indigo-300'
                          }`}
                        >
                          {item.romaji}
                        </span>
                      )}

                      {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                        <span
                          className={`font-telugu text-2xs font-semibold ${
                            isSelected ? 'text-white/90' : 'text-kai-vermilion'
                          }`}
                        >
                          {item.telugu_phonetic}
                        </span>
                      )}
                    </div>

                    <span
                      className={`absolute top-1.5 right-2 text-3xs font-mono opacity-60 ${
                        isSelected ? 'text-white' : 'text-kai-muted'
                      }`}
                    >
                      {item.stroke_count}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Selected Kana Detail Inspector */}
          <div className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-5">
            <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
              <div>
                <span className="text-2xs font-mono text-kai-muted uppercase tracking-wider">
                  Character Detail
                </span>
                <h2 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                  {selectedKana.character} ({selectedKana.katakana_counterpart})
                </h2>
              </div>
              <AudioButton text={selectedKana.character} size="md" showSpeedControl={true} />
            </div>

            <div className="flex items-center gap-4 bg-kai-bg/70 dark:bg-kai-dark-bg/60 p-4 rounded-2xl border border-kai-border/50">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-kai-dark-card shadow-sm flex items-center justify-center border border-kai-border">
                <span className="font-japanese text-5xl font-bold text-kai-ink dark:text-kai-dark-ink">
                  {selectedKana.character}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-kai-indigo dark:text-indigo-300 font-bold">
                  Romaji: {selectedKana.romaji}
                </div>
                <div className="font-telugu text-sm font-semibold text-kai-vermilion">
                  తెలుగు శబ్దం: {selectedKana.telugu_phonetic}
                </div>
                <div className="text-2xs font-mono text-kai-muted">
                  Strokes: {selectedKana.stroke_count}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 text-xs space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 font-telugu block">
                ఉచ్చారణ మార్గదర్శి:
              </span>
              <p className="font-telugu text-amber-900/90 dark:text-amber-200/90 text-2xs leading-relaxed">
                {selectedKana.telugu_pronunciation_guide}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-kai-ink dark:text-kai-dark-ink">Memory Mnemonic:</span>
              <p className="text-kai-muted dark:text-kai-dark-muted text-2xs leading-relaxed">
                {selectedKana.mnemonic_en}
              </p>
            </div>

            {selectedKana.example_words && selectedKana.example_words.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Example Words:
                </span>
                <div className="space-y-1.5">
                  {selectedKana.example_words.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/50 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-japanese font-bold text-sm text-kai-ink dark:text-kai-dark-ink">
                            {ex.word}
                          </span>
                          <span className="font-mono text-xs text-kai-muted">{ex.romaji}</span>
                        </div>
                        <div className="text-2xs text-kai-muted mt-0.5">
                          {ex.english} • <span className="font-telugu">{ex.telugu}</span>
                        </div>
                      </div>
                      <AudioButton text={ex.word} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveTab('practice')}
              className="w-full py-2.5 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-colors"
            >
              <PenTool size={15} />
              <span>Practice Writing {selectedKana.character}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: HANDWRITING & TRACING STUDIO                                      */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-0.5">
                <span className="text-2xs font-mono text-kai-muted uppercase">Guided Writing</span>
                <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                  Trace & Write: {selectedKana.character}
                </h3>
              </div>

              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
                <button
                  onClick={() => setPracticeMode('trace')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    practiceMode === 'trace'
                      ? 'bg-white dark:bg-kai-dark-card shadow-sm text-kai-ink'
                      : 'text-kai-muted'
                  }`}
                >
                  Trace Guide
                </button>
                <button
                  onClick={() => setPracticeMode('freehand')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    practiceMode === 'freehand'
                      ? 'bg-white dark:bg-kai-dark-card shadow-sm text-kai-ink'
                      : 'text-kai-muted'
                  }`}
                >
                  Freehand
                </button>
              </div>
            </div>

            <DrawingCanvas
              width={260}
              height={260}
              guideCharacter={selectedKana.character}
              showGuide={practiceMode === 'trace'}
              onStrokeComplete={handleStrokeComplete}
            />

            {isTracingComplete && (
              <div className="w-full p-3 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 flex items-center justify-between text-xs animate-in zoom-in-95">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span className="font-bold">Stroke target reached! (+10 XP)</span>
                </div>
                <button
                  onClick={() => setIsTracingComplete(false)}
                  className="font-semibold underline text-2xs"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-4">
            <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp flex items-center gap-2">
              <Layers size={17} className="text-kai-vermilion" />
              <span>Stroke Order Breakdown (筆順)</span>
            </h3>

            <p className="text-xs text-kai-muted leading-relaxed">
              Proper stroke order maintains character balance and prepares you for natural handwriting.
            </p>

            <div className="space-y-3">
              {selectedKana.stroke_directions &&
                selectedKana.stroke_directions.map((dir, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/50 flex items-center gap-3 text-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-kai-vermilion text-white flex items-center justify-center font-mono font-bold text-2xs flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-kai-ink dark:text-kai-dark-ink font-medium">{dir}</span>
                  </div>
                ))}
            </div>

            {selectedKana.common_mistakes && selectedKana.common_mistakes.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 dark:text-amber-300">
                  ⚠️ Confusable Characters:
                </span>
                <p className="text-2xs text-amber-900/80 dark:text-amber-200/80">
                  Do not confuse <strong>{selectedKana.character}</strong> with{' '}
                  <strong>{selectedKana.common_mistakes.join(', ')}</strong>. Pay close attention to loop direction and stroke counts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: TIMED QUIZ MODE                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div className="space-y-0.5">
              <span className="text-2xs font-mono text-kai-muted">Score: {quizScore}</span>
              <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink">
                Kana Recall Challenge
              </h3>
            </div>
            <AudioButton text={currentQuizItem.character} size="md" />
          </div>

          <div className="text-center py-6 space-y-2">
            <span className="text-xs font-mono text-kai-muted">Identify this character:</span>
            <div className="text-6xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink animate-in zoom-in-95">
              {currentQuizItem.character}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = opt.id === currentQuizItem.id;

              let btnStyle =
                'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink dark:text-kai-dark-ink hover:border-kai-vermilion';
              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-300 font-bold';
                } else if (isSelected) {
                  btnStyle =
                    'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={quizAnswered}
                  className={`p-4 rounded-2xl border text-center transition-all ${btnStyle}`}
                >
                  <div className="font-mono text-lg font-bold">{opt.romaji}</div>
                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <div className="font-telugu text-xs text-kai-vermilion mt-1">
                      {opt.telugu_phonetic}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <button
              onClick={nextQuizQuestion}
              className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-sm shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95 animate-in fade-in"
            >
              <span>Next Kana Question</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
