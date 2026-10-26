// src/components/reading/ReadingTheatre.tsx
// Graded Reader Stories with sentence audio, clickable vocabulary lexicon, and Telugu translations
import React, { useState } from 'react';
import {
  Scroll,
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { READING_STORIES } from '../../data/readingStories';
import { ReadingStory, ReadingLexicon } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const ReadingTheatre: React.FC = () => {
  const { displayMode, furiganaEnabled, romajiEnabled, awardXP, recordAttempt } = useLearning();
  const [selectedStory, setSelectedStory] = useState<ReadingStory>(READING_STORIES[0]);
  const [activeLexicon, setActiveLexicon] = useState<ReadingLexicon | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const handleSelectWord = (word: ReadingLexicon) => {
    setActiveLexicon(word);
    soundEffects.playClick();
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    selectedStory.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_index) correctCount += 1;
    });

    if (correctCount === selectedStory.questions.length) {
      soundEffects.playLevelUp();
      awardXP(50, `Completed story: ${selectedStory.title_en}`);
    } else {
      soundEffects.playCorrect();
      awardXP(20, 'Submitted reading comprehension test');
    }

    recordAttempt({
      item_id: selectedStory.id,
      item_type: 'reading' as any,
      skill: 'reading',
      question_type: 'reading_comprehension',
      user_response: `${correctCount}/${selectedStory.questions.length}`,
      expected_response: `${selectedStory.questions.length}/${selectedStory.questions.length}`,
      is_correct: correctCount === selectedStory.questions.length,
      response_time_ms: 12000,
      hint_used: false,
      retry_count: 0
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>読解劇場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Reading Theatre</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Original N5 graded reader stories with clickable vocabulary, audio, and Telugu guides.
          </p>
        </div>

        {/* Story Selector */}
        <div className="flex items-center gap-2">
          {READING_STORIES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStory(s);
                setActiveLexicon(null);
                setAnswers({});
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedStory.id === s.id
                  ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion'
                  : 'bg-white dark:bg-kai-dark-card border-kai-border text-kai-muted hover:text-kai-ink'
              }`}
            >
              <span>{s.cover_emoji}</span>
              <span>{s.title_en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
        {/* Title Header */}
        <div className="space-y-1 border-b border-kai-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedStory.cover_emoji}</span>
            <h2 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
              {selectedStory.title_jp}
            </h2>
            <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-kai-indigo-bg text-kai-indigo font-bold">
              {selectedStory.jlpt_level} Graded
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 text-xs text-kai-muted">
            <span>{selectedStory.title_en}</span>
            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <span className="font-telugu text-kai-vermilion font-medium">
                {selectedStory.title_te}
              </span>
            )}
          </div>
        </div>

        {/* Story Paragraphs */}
        <div className="space-y-6">
          {selectedStory.paragraphs.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-kai-bg/50 dark:bg-kai-dark-bg/60 border border-kai-border/60 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="font-japanese text-base sm:text-lg text-kai-ink dark:text-kai-dark-ink leading-loose">
                    {p.japanese}
                  </p>

                  {romajiEnabled && (
                    <p className="font-mono text-xs text-kai-indigo dark:text-indigo-300">
                      {p.romaji}
                    </p>
                  )}

                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <p className="font-telugu text-2xs text-kai-vermilion-dark dark:text-kai-vermilion-light">
                      ఉచ్చారణ: {p.telugu_phonetic}
                    </p>
                  )}
                </div>

                <AudioButton text={p.japanese} size="sm" />
              </div>

              {/* English & Telugu sentence translations */}
              <div className="text-xs text-kai-muted pt-2 border-t border-kai-border/40 space-y-0.5">
                <p>{p.english}</p>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-kai-ink/80 dark:text-kai-dark-ink/80">{p.telugu}</p>
                )}
              </div>

              {/* Clickable Vocabulary in this sentence */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-3xs font-mono uppercase text-kai-faint mr-1">Lexicon:</span>
                {p.vocabulary.map((vocab, vIdx) => (
                  <button
                    key={vIdx}
                    onClick={() => handleSelectWord(vocab)}
                    className="px-2 py-0.5 rounded-lg bg-white dark:bg-kai-dark-card border border-kai-border hover:border-kai-vermilion text-2xs font-japanese font-semibold text-kai-ink dark:text-kai-dark-ink transition-colors"
                  >
                    {vocab.word} ({vocab.reading})
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Word Popover Inspector */}
        {activeLexicon && (
          <div className="p-4 rounded-2xl bg-kai-indigo-bg dark:bg-kai-dark-card border border-kai-indigo/30 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-japanese font-bold text-base text-kai-indigo dark:text-indigo-300">
                  {activeLexicon.word}
                </span>
                <span className="font-mono text-xs text-kai-muted">[{activeLexicon.reading}]</span>
                <span className="font-mono text-2xs text-kai-indigo">{activeLexicon.romaji}</span>
              </div>
              <div className="text-xs text-kai-ink dark:text-white">
                {activeLexicon.meaning_en} • <span className="font-telugu">{activeLexicon.meaning_te}</span>
              </div>
            </div>

            <AudioButton text={activeLexicon.word} size="sm" />
          </div>
        )}

        {/* Comprehension Questions */}
        <div className="space-y-4 pt-4 border-t border-kai-border/70">
          <h3 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-serif_jp">
            Comprehension Questions (読解確認問題)
          </h3>

          <div className="space-y-4">
            {selectedStory.questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/60 space-y-3"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                    {qIdx + 1}. {q.question_en}
                  </p>
                  {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                    <p className="font-telugu text-2xs text-kai-vermilion">{q.question_te}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[qIdx] === optIdx;
                    const isCorrect = optIdx === q.correct_index;

                    let optStyle = 'bg-white dark:bg-kai-dark-card border-kai-border hover:border-kai-vermilion';
                    if (quizSubmitted) {
                      if (isCorrect) optStyle = 'bg-green-100 dark:bg-green-950/60 border-green-500 font-bold';
                      else if (isSelected) optStyle = 'bg-red-100 dark:bg-red-950/60 border-red-500';
                    } else if (isSelected) {
                      optStyle = 'bg-kai-vermilion-bg border-kai-vermilion font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                        disabled={quizSubmitted}
                        className={`p-3 rounded-xl border text-left text-xs transition-colors ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-2xs text-kai-muted font-mono pt-1">
                    Explanation: {q.explanation_en}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < selectedStory.questions.length}
              className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion disabled:opacity-40 transition-transform active:scale-95"
            >
              Submit Comprehension Answers
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs font-semibold flex items-center justify-between">
              <span>Quiz Completed! Full comprehension recorded.</span>
              <span className="font-mono text-kai-green font-bold">+50 XP</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
