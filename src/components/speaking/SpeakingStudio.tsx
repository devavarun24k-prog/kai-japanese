// src/components/speaking/SpeakingStudio.tsx
// Microphone-enabled Japanese speaking practice with mora-level evaluation, shadowing, and self-evaluation fallback
import React, { useState, useRef } from 'react';
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
  Headphones,
  Info,
  ShieldCheck
} from 'lucide-react';
import { speechRecognitionService } from '../../services/speechRecognition';
import { SpeechAssessmentResult } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { storageService } from '../../services/storageService';

export interface ShadowingSentence {
  id: string;
  japanese: string;
  romaji: string;
  telugu_phonetic: string;
  english: string;
  telugu: string;
  situation: string;
  pitch_tip: string;
}

export const SPEAKING_PROMPTS: ShadowingSentence[] = [
  {
    id: 'sp_1',
    japanese: 'はじめまして。',
    romaji: 'Hajimemashite.',
    telugu_phonetic: 'హజిమెమాషితె.',
    english: 'Nice to meet you (for the first time).',
    telugu: 'మిమ్మల్ని మొదటిసారి కలవడం సంతోషంగా ఉంది.',
    situation: 'Meeting someone for the first time',
    pitch_tip: 'Starts low, rises gently on "ji-me", and resolves softly on "te".'
  },
  {
    id: 'sp_2',
    japanese: 'これは本です。',
    romaji: 'Kore wa hon desu.',
    telugu_phonetic: 'కొరె వా హొన్ దెసు.',
    english: 'This is a book.',
    telugu: 'ఇది ఒక పుస్తకం.',
    situation: 'Identifying objects nearby',
    pitch_tip: 'Particle "wa" carries a neutral pitch contour.'
  },
  {
    id: 'sp_3',
    japanese: 'お水をください。',
    romaji: 'Omizu o kudasai.',
    telugu_phonetic: 'ఒమిజు ఒ కుదాసాయ్.',
    english: 'Water, please.',
    telugu: 'దయచేసి కొంచెం మంచినీళ్లు ఇవ్వండి.',
    situation: 'Ordering at a restaurant / cafe',
    pitch_tip: 'Honorific "o" blends naturally into "mizu".'
  },
  {
    id: 'sp_4',
    japanese: 'いま、何時ですか？',
    romaji: 'Ima, nanji desu ka?',
    telugu_phonetic: 'ఇమా, నాంజి దెసు కా?',
    english: 'What time is it now?',
    telugu: 'ఇప్పుడు సమయం ఎంత అయ్యింది?',
    situation: 'Asking for time on the street',
    pitch_tip: 'Intonation rises slightly on the final question particle "ka".'
  },
  {
    id: 'sp_5',
    japanese: '駅はどこですか？',
    romaji: 'Eki wa doko desu ka?',
    telugu_phonetic: 'ఎకి వా దొకొ దెసు కా?',
    english: 'Where is the station?',
    telugu: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది?',
    situation: 'Asking for directions in a city',
    pitch_tip: 'High pitch on "E", drops down on "ki".'
  },
  {
    id: 'sp_6',
    japanese: 'ありがとうございます。',
    romaji: 'Arigatou gozaimasu.',
    telugu_phonetic: 'అరిగాతౌ గొజాయ్మాసు.',
    english: 'Thank you very much (polite).',
    telugu: 'చాలా ధన్యవాదాలు (మర్యాదపూర్వకంగా).',
    situation: 'Expressing gratitude',
    pitch_tip: 'Elongate the "tou" sound smoothly: a-ri-ga-to-o.'
  },
  {
    id: 'sp_7',
    japanese: 'すみません、もう一度お願いします。',
    romaji: 'Sumimasen, mou ichido onegaishimasu.',
    telugu_phonetic: 'సుమిమాసెన్, మో ఇచిదొ ఒనెగాయిషిమాసు.',
    english: 'Excuse me, could you repeat that once more?',
    telugu: 'క్షమించండి, దయచేసి ఇంకొకసారి చెబుతారా?',
    situation: 'Clarification during conversation',
    pitch_tip: 'Pause naturally after "Sumimasen" before making the request.'
  },
  {
    id: 'sp_8',
    japanese: 'これを一つください。',
    romaji: 'Kore o hitotsu kudasai.',
    telugu_phonetic: 'కొరె ఒ హితొత్సు కుదాసాయ్.',
    english: 'One of this, please.',
    telugu: 'దయచేసి ఇందులో ఒకటి ఇవ్వండి.',
    situation: 'Shopping at a bakery or kiosk',
    pitch_tip: 'Counters like "hitotsu" keep each mora equal in duration.'
  },
  {
    id: 'sp_9',
    japanese: '今日はとてもいい天気ですね。',
    romaji: 'Kyou wa totemo ii tenki desu ne.',
    telugu_phonetic: 'క్యో వా తొతెమొ ఈ తెంకి దెసు నె.',
    english: 'The weather is very nice today, isn\'t it?',
    telugu: 'ఈ రోజు వాతావరణం చాలా బాగుంది కదా.',
    situation: 'Casual small talk with a neighbor',
    pitch_tip: 'Sentence-ending particle "ne" seeks gentle agreement.'
  },
  {
    id: 'sp_10',
    japanese: '日本語を勉強しています。',
    romaji: 'Nihongo o benkyou shite imasu.',
    telugu_phonetic: 'నిహొంగొ ఒ బెంక్యో షితె ఇమాసు.',
    english: 'I am studying Japanese.',
    telugu: 'నేను జపనీస్ భాషను చదువుకుంటున్నాను.',
    situation: 'Self-introduction & language exchange',
    pitch_tip: 'Smooth continuous flow from "benkyou" to "shite imasu".'
  }
];

export const SpeakingStudio: React.FC = () => {
  const { displayMode, awardXP, recordAttempt } = useLearning();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [assessment, setAssessment] = useState<SpeechAssessmentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selfShadowedDone, setSelfShadowedDone] = useState<boolean>(false);
  const stopRecordingRef = useRef<(() => void) | null>(null);

  const current = SPEAKING_PROMPTS[currentIndex];
  const isSpeechSupported = speechRecognitionService.getIsSupported();

  const handleStartRecording = () => {
    setErrorMessage(null);
    setInterimText('');
    setAssessment(null);
    setSelfShadowedDone(false);

    if (!isSpeechSupported) {
      setErrorMessage(
        'Web Speech Recognition is not supported by your browser. You can use the Listen & Shadow Self-Evaluation flow below!'
      );
      return;
    }

    soundEffects.playClick();
    setIsRecording(true);

    try {
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
              response_time_ms: 3200,
              hint_used: false,
              retry_count: 0
            });
          } else {
            soundEffects.playWrong();
            storageService.logMistake(
              current.id,
              'grammar',
              current.japanese,
              finalText,
              current.japanese,
              'pronunciation_mismatch',
              `Recognized: ${finalText}. Expected: ${current.japanese} (${current.romaji})`,
              `గుర్తించబడింది: ${finalText}. సరైన రూపం: ${current.japanese}`
            );
            recordAttempt({
              item_id: current.id,
              item_type: 'speaking',
              skill: 'speaking',
              question_type: 'shadowing',
              user_response: finalText,
              expected_response: current.japanese,
              is_correct: false,
              error_category: 'pronunciation_mismatch',
              response_time_ms: 3800,
              hint_used: false,
              retry_count: 1
            });
          }
        },
        (errorStr) => {
          setIsRecording(false);
          setErrorMessage(`Microphone error: ${errorStr}. You can still practice via Self-Shadowing below!`);
        }
      );
      stopRecordingRef.current = stopFn;
    } catch (err: any) {
      setIsRecording(false);
      setErrorMessage(`Microphone permission or connection issue: ${err?.message || err}. Use Self-Shadowing mode below.`);
    }
  };

  const handleStopRecording = () => {
    if (stopRecordingRef.current) {
      stopRecordingRef.current();
      stopRecordingRef.current = null;
    }
    setIsRecording(false);
  };

  // Self-Evaluation Mode handler (works 100% on all browsers without mic)
  const handleSelfEvaluation = (accurate: boolean) => {
    setSelfShadowedDone(true);
    if (accurate) {
      soundEffects.playCorrect();
      awardXP(25, 'Shadowed Japanese phrase (Self-Evaluated)');
      recordAttempt({
        item_id: current.id,
        item_type: 'speaking',
        skill: 'speaking',
        question_type: 'shadowing_self',
        user_response: 'Self-reported accurate',
        expected_response: current.japanese,
        is_correct: true,
        response_time_ms: 4000,
        hint_used: true,
        retry_count: 0
      });
    } else {
      soundEffects.playClick();
      recordAttempt({
        item_id: current.id,
        item_type: 'speaking',
        skill: 'speaking',
        question_type: 'shadowing_self',
        user_response: 'Self-reported needs practice',
        expected_response: current.japanese,
        is_correct: false,
        error_category: 'pronunciation_self_practice',
        response_time_ms: 4000,
        hint_used: true,
        retry_count: 1
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPEAKING_PROMPTS.length);
    setAssessment(null);
    setInterimText('');
    setErrorMessage(null);
    setSelfShadowedDone(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>発音道場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Speaking Studio</span>
          </h1>
          <p className="text-xs text-kai-muted">
            10 Practical dialogue situations with mora evaluation, audio shadowing, and Telugu phonetic guides.
          </p>
        </div>

        <span className="text-2xs font-mono px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-kai-muted">
          Prompt {currentIndex + 1} of {SPEAKING_PROMPTS.length}
        </span>
      </div>

      {/* Main Practice Deck */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6">
        {/* Situation tag */}
        <div className="flex items-center justify-between">
          <span className="text-2xs font-mono px-2.5 py-0.5 rounded-full bg-kai-indigo-bg text-kai-indigo font-bold">
            Scenario: {current.situation}
          </span>
          <AudioButton text={current.japanese} size="md" />
        </div>

        {/* Japanese Target Phrase */}
        <div className="space-y-2 text-center py-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink tracking-wide">
            {current.japanese}
          </h2>

          <p className="font-mono text-sm text-kai-indigo font-semibold">{current.romaji}</p>

          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
            <p className="font-telugu text-sm text-kai-vermilion font-medium">
              తెలుగు ఉచ్చారణ: {current.telugu_phonetic}
            </p>
          )}

          <div className="pt-2 text-xs text-kai-muted space-y-0.5">
            <p>"{current.english}"</p>
            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <p className="font-telugu text-kai-ink/80 dark:text-kai-dark-ink/80">"{current.telugu}"</p>
            )}
          </div>
        </div>

        {/* Pitch Accent & Mora Tip */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/60 text-xs flex items-start gap-2 text-kai-muted">
          <Info size={16} className="text-kai-indigo flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-kai-ink dark:text-kai-dark-ink">Pitch & Mora Advice: </strong>
            {current.pitch_tip}
          </div>
        </div>

        {/* Microphone / Recognition Controls */}
        <div className="text-center space-y-3 pt-2 border-t border-kai-border/50">
          {isSpeechSupported ? (
            <div className="space-y-3">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="px-6 py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
                >
                  <Mic size={18} />
                  <span>Start Microphone Speaking Test</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 mx-auto animate-pulse"
                >
                  <MicOff size={18} />
                  <span>Listening... Click to Finish</span>
                </button>
              )}

              {interimText && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs font-japanese font-semibold text-kai-ink dark:text-white">
                  Heard: "{interimText}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-bold">Microphone API Note</p>
              <p>Your browser does not expose Web Speech Recognition. Use the Self-Shadowing evaluation mode below!</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Assessment Results */}
        {assessment && (
          <div
            className={`p-5 rounded-3xl border space-y-3 animate-in fade-in ${
              assessment.is_match
                ? 'bg-green-50 dark:bg-green-950/40 border-green-300 text-green-900 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-900 dark:text-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {assessment.is_match ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span className="font-bold text-sm">
                  {assessment.is_match ? 'Speech Recognition Match!' : 'Pronunciation Needs Adjustment'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-black/40">
                {assessment.similarity_score}% Match
              </span>
            </div>

            <p className="text-xs">
              {displayMode === 'telugu' ? assessment.feedback_te : assessment.feedback_en}
            </p>
          </div>
        )}

        {/* Listen-Repeat Shadowing Self-Evaluation Fallback */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono uppercase text-kai-muted font-bold flex items-center gap-1.5">
              <Headphones size={13} />
              <span>Shadowing & Self-Evaluation Mode:</span>
            </span>
            <span className="text-3xs text-kai-muted">Always accessible</span>
          </div>
          <p className="text-2xs text-kai-muted">
            Listen to the audio, shadow the phrase aloud 2-3 times, and evaluate your delivery:
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleSelfEvaluation(true)}
              className="flex-1 py-2 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border hover:border-green-500 text-xs font-medium text-kai-ink dark:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 size={14} className="text-green-600" />
              <span>I shadowed it cleanly (+25 XP)</span>
            </button>
            <button
              onClick={() => handleSelfEvaluation(false)}
              className="flex-1 py-2 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border hover:border-amber-500 text-xs font-medium text-kai-muted hover:text-kai-ink flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} className="text-amber-600" />
              <span>Needs more practice</span>
            </button>
          </div>
          {selfShadowedDone && (
            <p className="text-3xs text-green-700 dark:text-green-400 font-mono text-center pt-1 animate-in fade-in">
              ✓ Self-evaluation attempt recorded in your learning log.
            </p>
          )}
        </div>

        {/* Pitch Accent Disclosure Notice */}
        <div className="p-3 rounded-xl bg-kai-bg/50 dark:bg-kai-dark-bg/40 border border-kai-border/40 text-3xs text-kai-faint space-y-0.5">
          <p>
            <strong>Note on Acoustic Pitch Accent:</strong> Web Speech Recognition evaluates mora transcription and phoneme match. It does not measure subtle acoustic pitch contours (e.g. atamadaka vs heiban). Practice shadowing against the native audio model for pitch accent mastery.
          </p>
        </div>

        {/* Next Prompt Button */}
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <span>Next Speaking Prompt ({currentIndex + 1 < SPEAKING_PROMPTS.length ? `${currentIndex + 2}/${SPEAKING_PROMPTS.length}` : 'Loop'})</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
