// src/components/speaking/SpeakingStudio.tsx
// Microphone-enabled Japanese speaking practice with mora-level evaluation and shadowing
import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Headphones
} from 'lucide-react';
import { speechRecognitionService } from '../../services/speechRecognition';
import { SpeechAssessmentResult } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

interface ShadowingSentence {
  id: string;
  japanese: string;
  romaji: string;
  telugu_phonetic: string;
  english: string;
  telugu: string;
  situation: string;
}

const SPEAKING_PROMPTS: ShadowingSentence[] = [
  {
    id: 'sp_1',
    japanese: 'はじめまして。',
    romaji: 'Hajimemashite.',
    telugu_phonetic: 'హజిమెమాషితె.',
    english: 'Nice to meet you (for the first time).',
    telugu: 'మిమ్మల్ని మొదటిసారి కలవడం సంతోషంగా ఉంది.',
    situation: 'Meeting someone for the first time'
  },
  {
    id: 'sp_2',
    japanese: 'これは本です。',
    romaji: 'Kore wa hon desu.',
    telugu_phonetic: 'కొరె వా హొన్ దెసు.',
    english: 'This is a book.',
    telugu: 'ఇది ఒక పుస్తకం.',
    situation: 'Identifying objects'
  },
  {
    id: 'sp_3',
    japanese: 'お水をください。',
    romaji: 'Omizu o kudasai.',
    telugu_phonetic: 'ఒమిజు ఒ కుదాసాయ్.',
    english: 'Water, please.',
    telugu: 'దయచేసి కొంచెం మంచినీళ్లు ఇవ్వండి.',
    situation: 'Ordering at a restaurant / cafe'
  },
  {
    id: 'sp_4',
    japanese: 'いま、何時ですか？',
    romaji: 'Ima, nanji desu ka?',
    telugu_phonetic: 'ఇమా, నాంజి దెసు కా?',
    english: 'What time is it now?',
    telugu: 'ఇప్పుడు సమయం ఎంత అయ్యింది?',
    situation: 'Asking for time on the street'
  }
];

export const SpeakingStudio: React.FC = () => {
  const { displayMode, awardXP, recordAttempt } = useLearning();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [assessment, setAssessment] = useState<SpeechAssessmentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stopRecordingRef = React.useRef<(() => void) | null>(null);

  const current = SPEAKING_PROMPTS[currentIndex];
  const isSpeechSupported = speechRecognitionService.getIsSupported();

  const handleStartRecording = () => {
    setErrorMessage(null);
    setInterimText('');
    setAssessment(null);

    if (!isSpeechSupported) {
      setErrorMessage(
        'Web Speech Recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari for microphone features.'
      );
      return;
    }

    soundEffects.playClick();
    setIsRecording(true);

    const stopFn = speechRecognitionService.startListening(
      (interim) => setInterimText(interim),
      (finalText) => {
        setIsRecording(false);
        setInterimText(finalText);

        const result = speechRecognitionService.evaluatePronunciation(
          finalText,
          current.japanese,
          current.romaji
        );
        setAssessment(result);

        if (result.is_match) {
          soundEffects.playCorrect();
          awardXP(30, 'Shadowed Japanese sentence aloud');
          recordAttempt({
            item_id: current.id,
            item_type: 'speaking',
            skill: 'speaking',
            question_type: 'shadowing',
            user_response: finalText,
            expected_response: current.japanese,
            is_correct: true,
            response_time_ms: 3000,
            hint_used: false,
            retry_count: 0
          });
        } else {
          soundEffects.playWrong();
          recordAttempt({
            item_id: current.id,
            item_type: 'speaking',
            skill: 'speaking',
            question_type: 'shadowing',
            user_response: finalText,
            expected_response: current.japanese,
            is_correct: false,
            error_category: 'pronunciation_error',
            response_time_ms: 3000,
            hint_used: false,
            retry_count: 1
          });
        }
      },
      (err) => {
        setIsRecording(false);
        setErrorMessage(err);
      }
    );

    stopRecordingRef.current = stopFn;
  };

  const handleStopRecording = () => {
    if (stopRecordingRef.current) {
      stopRecordingRef.current();
      stopRecordingRef.current = null;
    }
    setIsRecording(false);
  };

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % SPEAKING_PROMPTS.length);
    setAssessment(null);
    setInterimText('');
    setErrorMessage(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>発音スタジオ</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Speaking Studio</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Microphone push-to-talk shadowing with Japanese mora-timing analysis.
          </p>
        </div>

        {/* Browser Microphone Status Indicator */}
        <div className="flex items-center gap-2 text-2xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isSpeechSupported ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-kai-muted">
            {isSpeechSupported ? 'Microphone Ready' : 'Browser STT Unavailable'}
          </span>
        </div>
      </div>

      {/* Target Sentence Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kai-indigo-bg text-kai-indigo text-2xs font-mono font-bold">
          <Headphones size={13} />
          <span>{current.situation}</span>
        </div>

        {/* Japanese Big Sentence */}
        <div className="space-y-2">
          <div className="text-3xl sm:text-4xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
            {current.japanese}
          </div>
          <div className="font-mono text-sm text-kai-indigo dark:text-indigo-300 font-semibold">
            {current.romaji}
          </div>
          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
            <div className="font-telugu text-sm text-kai-vermilion font-medium">
              తెలుగు ఉచ్చారణ: {current.telugu_phonetic}
            </div>
          )}
        </div>

        <div className="text-xs text-kai-muted space-y-0.5">
          <p>Meaning: {current.english}</p>
          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
            <p className="font-telugu text-kai-ink/80 dark:text-kai-dark-ink/80">
              తెలుగు: {current.telugu}
            </p>
          )}
        </div>

        {/* Audio Sample Player with slow rate option */}
        <div className="pt-2 flex justify-center">
          <AudioButton text={current.japanese} size="md" showSpeedControl={true} label="Listen to Native Sample" />
        </div>
      </div>

      {/* Push-to-Talk Microphone Controller */}
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={handleStartRecording}
            className="w-20 h-20 rounded-full bg-kai-vermilion hover:bg-kai-vermilion-dark text-white flex items-center justify-center shadow-vermilion transition-transform hover:scale-110 active:scale-95 group focus:outline-none"
            title="Click to Record Japanese Speech"
          >
            <Mic size={32} className="group-hover:animate-pulse" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStopRecording}
            className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg animate-pulse transition-transform scale-110"
            title="Click to Stop Recording"
          >
            <MicOff size={32} />
          </button>
        )}

        <span className="text-xs font-mono text-kai-muted">
          {isRecording ? 'Listening... Speak Japanese now!' : 'Click the microphone & repeat the sentence'}
        </span>

        {/* Live Interim Transcript */}
        {isRecording && interimText && (
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-japanese text-kai-ink animate-pulse">
            Heard so far: "{interimText}"
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Assessment Feedback Report */}
      {assessment && (
        <div
          className={`p-6 rounded-3xl border space-y-4 animate-in fade-in ${
            assessment.is_match
              ? 'bg-green-50/80 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {assessment.is_match ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-base">
                Pronunciation Rating: {assessment.accuracy_rating} ({assessment.similarity_score}%)
              </span>
            </div>

            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/30">
              Score: {assessment.similarity_score}/100
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/30 space-y-2 text-xs">
            <div>
              <span className="text-3xs font-mono uppercase text-kai-muted">What the system heard:</span>
              <p className="font-japanese font-bold text-base text-kai-ink dark:text-white">
                "{assessment.transcript || '(silence)'}"
              </p>
            </div>

            <p className="leading-relaxed">{assessment.feedback_en}</p>

            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <p className="font-telugu text-kai-vermilion">{assessment.feedback_te}</p>
            )}
          </div>

          {/* Mismatched moras if any */}
          {assessment.mismatched_moras.length > 0 && (
            <div className="space-y-1 text-2xs">
              <span className="font-bold font-mono">Phonetic Mora Discrepancies:</span>
              <div className="flex flex-wrap gap-2">
                {assessment.mismatched_moras.map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-white dark:bg-black/40 border border-kai-border font-japanese"
                  >
                    Expected <strong>{m.mora}</strong> vs Heard <strong>{m.heard}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={nextPrompt}
            className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>Next Speaking Exercise</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
