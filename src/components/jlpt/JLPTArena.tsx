// src/components/jlpt/JLPTArena.tsx
// Realistic timed JLPT N5 diagnostic exam simulator with section breakdowns, targeted revision advice, and N5->N1 roadmap
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
  BookOpen
} from 'lucide-react';
import { JLPT_N5_MOCK_EXAM } from '../../data/jlptMockData';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

interface SectionScore {
  name: string;
  correct: number;
  total: number;
  pct: number;
}

export const JLPTArena: React.FC = () => {
  const { awardXP, recordAttempt, displayMode, setActiveSection } = useLearning();
  const [activeTab, setActiveTab] = useState<'exam' | 'roadmap'>('exam');

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

  // Flatten questions from all sections
  const allQuestions = useMemo(() => {
    return JLPT_N5_MOCK_EXAM.sections.flatMap((s) => s.questions);
  }, []);

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

    const sectionsScored: SectionScore[] = JLPT_N5_MOCK_EXAM.sections.map((sec) => {
      let secCorrect = 0;
      sec.questions.forEach((q) => {
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

    const totalPct = Math.round((totalCorrect / allQuestions.length) * 100);
    const passed = totalPct >= JLPT_N5_MOCK_EXAM.passing_score_pct;

    setScoreReport({
      totalScorePct: totalPct,
      passed,
      correctAnswers: totalCorrect,
      totalQuestions: allQuestions.length
    });

    if (passed) {
      soundEffects.playLevelUp();
      awardXP(200, 'Passed Official-Format JLPT N5 Diagnostic Exam');
    } else {
      soundEffects.playWrong();
      awardXP(50, 'Completed JLPT N5 Diagnostic Exam Attempt');
    }

    recordAttempt({
      item_id: JLPT_N5_MOCK_EXAM.id,
      item_type: 'grammar',
      skill: 'reading',
      question_type: 'jlpt_mock_exam',
      user_response: `${totalPct}% (${totalCorrect}/${allQuestions.length})`,
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
            <span>日本語能力試験</span>
            <span className="text-sm font-sans font-normal text-kai-muted">JLPT Arena & Progression</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Official format diagnostic test and structured milestone roadmap from N5 Novice to N1 Mastery.
          </p>
        </div>

        {/* Tab Switcher & Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border text-xs">
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'exam'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white font-bold'
                  : 'text-kai-muted'
              }`}
            >
              Mock Exam
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

          {examStarted && !examSubmitted && activeTab === 'exam' && (
            <div className="flex items-center gap-2 font-mono font-bold text-sm text-kai-vermilion bg-red-50 dark:bg-red-950/40 px-3.5 py-1.5 rounded-2xl border border-red-200 shrink-0">
              <Timer size={16} />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'exam' ? (
        !examStarted ? (
          /* Pre-exam Briefing Screen */
          <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 text-center">
            <Award size={56} className="text-kai-gold mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                {JLPT_N5_MOCK_EXAM.title}
              </h2>
              <p className="text-xs text-kai-muted max-w-lg mx-auto leading-relaxed">
                A timed diagnostic test covering 5 official sections: Kanji/Vocabulary, Grammar & Particles, Sentence Assembly (Star question ★), Reading Comprehension, and Listening.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Time</span>
                <span className="font-bold text-base">{JLPT_N5_MOCK_EXAM.time_limit_minutes} Min</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Questions</span>
                <span className="font-bold text-base">{allQuestions.length} Items</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border">
                <span className="text-2xs font-mono text-kai-muted uppercase block">Sections</span>
                <span className="font-bold text-base">5 Areas</span>
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
              Begin Timed Diagnostic Exam
            </button>
          </div>
        ) : (
          /* Exam in Progress or Results */
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
                <div className="text-5xl font-bold font-mono">
                  {scoreReport.totalScorePct}%
                </div>
                <h3 className="text-lg font-bold font-serif_jp">
                  {scoreReport.passed
                    ? '🎉 合格 (Passed) — You have achieved JLPT N5 diagnostic proficiency!'
                    : 'もう一歩 (Keep Going) — Review your flagged weak sections below.'}
                </h3>
                <p className="text-xs max-w-md mx-auto">
                  Correct: {scoreReport.correctAnswers} of {scoreReport.totalQuestions} questions. Review the section breakdown and comprehensive explanations below.
                </p>

                {/* Section-by-Section Score Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-left">
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
                    <span>Personalized Revision Recommendations:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-kai-muted">
                    {sectionBreakdown.map((sec, idx) => {
                      if (sec.pct >= 80) return null;
                      const advice =
                        sec.name.includes('Vocabulary')
                          ? { label: 'Expand N5 Kanji & Vocab in Vocabulary Academy', target: 'vocab' }
                          : sec.name.includes('Grammar')
                          ? { label: 'Review Particle Lab (は vs が, で vs に) in Grammar Lab', target: 'grammar' }
                          : sec.name.includes('Sentence')
                          ? { label: 'Practice SOV Star Assembly in Sentence Forge', target: 'sentence' }
                          : sec.name.includes('Reading')
                          ? { label: 'Read Graded Reader Stories in Reading Theatre', target: 'reading' }
                          : { label: 'Practice Mora Timing in Listening Lab', target: 'listening' };

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

            {/* Questions by Section */}
            {JLPT_N5_MOCK_EXAM.sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-5"
              >
                <div className="flex items-center justify-between border-b border-kai-border/50 pb-2">
                  <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
                    Section {sIdx + 1}: {section.name}
                  </h3>
                  <span className="text-2xs font-mono text-kai-muted">
                    {section.questions.length} Questions
                  </span>
                </div>

                <div className="space-y-6">
                  {section.questions.map((q, qIdx) => (
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
                Submit Exam For Scoring & Diagnosis
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
                Retake Exam
              </button>
            )}
          </div>
        )
      ) : (
        /* JLPT N5 -> N1 Progression Roadmap */
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
        </div>
      )}
    </div>
  );
};
