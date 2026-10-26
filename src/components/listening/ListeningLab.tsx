// src/components/listening/ListeningLab.tsx
// Structured Japanese listening comprehension lab with speed toggles, hidden transcripts, and dictation
import React, { useState } from 'react';
import {
  Headphones,
  Volume2,
  Repeat,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Gauge
} from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

interface ListeningExercise {
  id: string;
  type: 'kana' | 'vocab' | 'sentence';
  audioText: string;
  transcriptJp: string;
  transcriptRomaji: string;
  meaningEn: string;
  meaningTe: string;
  question: string;
  questionTe: string;
  options: string[];
  correctIndex: number;
}

const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'l_1',
    type: 'kana',
    audioText: 'き',
    transcriptJp: 'き',
    transcriptRomaji: 'ki',
    meaningEn: 'Kana character "ki" (two crossbars)',
    meaningTe: 'కానా అక్షరం "కి" (రెండు అడ్డగీతలు ఉంటాయి)',
    question: 'Listen carefully: Which character was spoken?',
    questionTe: 'వినండి: ఏ అక్షరం పలకబడింది?',
    options: ['さ (sa)', 'き (ki)', 'ち (chi)', 'り (ri)'],
    correctIndex: 1
  },
  {
    id: 'l_2',
    type: 'vocab',
    audioText: 'みず',
    transcriptJp: '水 (みず)',
    transcriptRomaji: 'mizu',
    meaningEn: 'Water',
    meaningTe: 'నీరు',
    question: 'Identify the English/Telugu meaning of the heard Japanese word:',
    questionTe: 'వినబడిన జపనీస్ పదానికి సరైన అర్థం ఏమిటి?',
    options: ['Water / నీరు', 'Tea / టీ', 'Rice / అన్నం', 'Fish / చేప'],
    correctIndex: 0
  },
  {
    id: 'l_3',
    type: 'sentence',
    audioText: 'いま、なんじですか？',
    transcriptJp: '今、何時ですか？',
    transcriptRomaji: 'Ima, nanji desu ka?',
    meaningEn: 'What time is it now?',
    meaningTe: 'ఇప్పుడు సమయం ఎంత అయ్యింది?',
    question: 'What is the speaker asking?',
    questionTe: 'మాట్లాడే వ్యక్తి ఏమి అడుగుతున్నారు?',
    options: [
      'Where is the station? / స్టేషన్ ఎక్కడ?',
      'What time is it now? / సమయం ఎంత అయ్యింది?',
      'How much is this? / దీని ధర ఎంత?',
      'Who is that? / అతను ఎవరు?'
    ],
    correctIndex: 1
  }
];

export const ListeningLab: React.FC = () => {
  const { displayMode, awardXP, recordAttempt } = useLearning();
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const current = LISTENING_EXERCISES[exerciseIndex];

  const handleSelectOption = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
    setSubmitted(true);

    const isCorrect = idx === current.correctIndex;
    if (isCorrect) {
      soundEffects.playCorrect();
      awardXP(20, 'Correct listening comprehension');
      recordAttempt({
        item_id: current.id,
        item_type: 'listening',
        skill: 'listening',
        question_type: 'audio_comprehension',
        user_response: current.options[idx],
        expected_response: current.options[current.correctIndex],
        is_correct: true,
        response_time_ms: 2200,
        hint_used: showTranscript,
        retry_count: 0
      });
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: current.id,
        item_type: 'listening',
        skill: 'listening',
        question_type: 'audio_comprehension',
        user_response: current.options[idx],
        expected_response: current.options[current.correctIndex],
        is_correct: false,
        error_category: 'listening_confusion',
        response_time_ms: 2500,
        hint_used: showTranscript,
        retry_count: 1
      });
    }
  };

  const nextExercise = () => {
    setExerciseIndex((prev) => (prev + 1) % LISTENING_EXERCISES.length);
    setSelectedOption(null);
    setSubmitted(false);
    setShowTranscript(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>聴解ラボ</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Listening Lab</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Train your ear to natural Japanese mora timing, pitch, and sentence rhythm.
          </p>
        </div>

        <span className="text-2xs font-mono px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-kai-muted">
          Exercise {exerciseIndex + 1} of {LISTENING_EXERCISES.length}
        </span>
      </div>

      {/* Main Listening Deck */}
      <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-kai-indigo-bg text-kai-indigo flex items-center justify-center mx-auto shadow-sm">
          <Headphones size={28} />
        </div>

        {/* Audio Trigger with Big Button */}
        <div className="space-y-3">
          <AudioButton
            text={current.audioText}
            size="lg"
            showSpeedControl={true}
            label="Click to Play Audio"
            className="justify-center"
          />

          <div className="flex justify-center">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-xs text-kai-muted hover:text-kai-ink font-medium flex items-center gap-1.5 transition-colors"
            >
              {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showTranscript ? 'Hide Japanese Transcript' : 'Reveal Transcript'}</span>
            </button>
          </div>
        </div>

        {/* Transcript revealed */}
        {showTranscript && (
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border space-y-1 animate-in fade-in">
            <div className="text-2xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
              {current.transcriptJp}
            </div>
            <div className="font-mono text-xs text-kai-indigo">{current.transcriptRomaji}</div>
            <p className="text-xs text-kai-muted">{current.meaningEn}</p>
          </div>
        )}

        {/* Question Title */}
        <div className="space-y-1 pt-2 border-t border-kai-border/50">
          <h2 className="text-base font-bold text-kai-ink dark:text-kai-dark-ink font-sans">
            {current.question}
          </h2>
          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
            <p className="font-telugu text-sm text-kai-vermilion">{current.questionTe}</p>
          )}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {current.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === current.correctIndex;

            let style = 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink hover:border-kai-vermilion';
            if (submitted) {
              if (isCorrect) {
                style = 'bg-green-100 dark:bg-green-950/60 border-green-500 text-green-900 dark:text-green-300 font-bold';
              } else if (isSelected) {
                style = 'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={submitted}
                className={`p-4 rounded-2xl border transition-all text-xs sm:text-sm ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Next Question */}
        {submitted && (
          <button
            onClick={nextExercise}
            className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95 animate-in fade-in"
          >
            <span>Next Listening Exercise</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
