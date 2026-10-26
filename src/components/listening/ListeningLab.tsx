// src/components/listening/ListeningLab.tsx
// Structured Japanese listening comprehension lab with speed toggles, hidden transcripts, replay controls, and speech synthesis disclosure
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
  Gauge,
  Info
} from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';

export interface ListeningExercise {
  id: string;
  type: 'kana' | 'vocab' | 'sentence' | 'dialogue';
  audioText: string;
  transcriptJp: string;
  transcriptRomaji: string;
  meaningEn: string;
  meaningTe: string;
  question: string;
  questionTe: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationTe: string;
}

export const LISTENING_EXERCISES: ListeningExercise[] = [
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
    correctIndex: 1,
    explanationEn: 'The audio played "ki", which has two horizontal crossbars in Hiragana (き).',
    explanationTe: '"కి" (ki) శబ్దం పలకబడింది.'
  },
  {
    id: 'l_2',
    type: 'kana',
    audioText: 'す',
    transcriptJp: 'す',
    transcriptRomaji: 'su',
    meaningEn: 'Kana character "su"',
    meaningTe: 'కానా అక్షరం "సు" (లూప్ గీత ఉంటుంది)',
    question: 'Listen carefully: Which mora was spoken?',
    questionTe: 'వినండి: ఏ శబ్దం పలకబడింది?',
    options: ['す (su)', 'つ (tsu)', 'し (shi)', 'そ (so)'],
    correctIndex: 0,
    explanationEn: 'The audio pronounced "su" with unrounded lips.',
    explanationTe: '"సు" (su) శబ్దం పలకబడింది.'
  },
  {
    id: 'l_3',
    type: 'vocab',
    audioText: 'みず',
    transcriptJp: '水 (みず)',
    transcriptRomaji: 'mizu',
    meaningEn: 'Water',
    meaningTe: 'నీరు',
    question: 'Identify the English/Telugu meaning of the heard Japanese word:',
    questionTe: 'వినబడిన జపనీస్ పదానికి సరైన అర్థం ఏమిటి?',
    options: ['Water / నీరు', 'Tea / టీ', 'Rice / అన్నం', 'Fish / చేప'],
    correctIndex: 0,
    explanationEn: 'みず (mizu) means pure drinking water.',
    explanationTe: 'みず అంటే మంచినీరు.'
  },
  {
    id: 'l_4',
    type: 'vocab',
    audioText: 'ねこ',
    transcriptJp: '猫 (ねこ)',
    transcriptRomaji: 'neko',
    meaningEn: 'Cat',
    meaningTe: 'పిల్లి',
    question: 'Listen: What animal was mentioned?',
    questionTe: 'వినండి: ఏ జంతువు గురించి మాట్లాడారు?',
    options: ['Dog / కుక్క (いぬ)', 'Cat / పిల్లి (ねこ)', 'Bird / పక్షి (とり)', 'Fish / చేప (さかな)'],
    correctIndex: 1,
    explanationEn: 'ねこ (neko) is the Japanese word for cat.',
    explanationTe: 'ねこ అంటే పిల్లి.'
  },
  {
    id: 'l_5',
    type: 'vocab',
    audioText: 'ほん',
    transcriptJp: '本 (ほん)',
    transcriptRomaji: 'hon',
    meaningEn: 'Book',
    meaningTe: 'పుస్తకం',
    question: 'What object was spoken?',
    questionTe: 'వినబడిన వస్తువు ఏమిటి?',
    options: ['Book / పుస్తకం (ほん)', 'Pencil / పెన్సిల్ (えんぴつ)', 'Desk / బల్ల (つくえ)', 'Car / కారు (くるま)'],
    correctIndex: 0,
    explanationEn: 'ほん (hon) means book.',
    explanationTe: 'ほん అంటే పుస్తకం.'
  },
  {
    id: 'l_6',
    type: 'vocab',
    audioText: 'くるま',
    transcriptJp: '車 (くるま)',
    transcriptRomaji: 'kuruma',
    meaningEn: 'Car / Vehicle',
    meaningTe: 'కారు / వాహనం',
    question: 'Identify the item spoken:',
    questionTe: 'పలికిన పదాన్ని గుర్తించండి:',
    options: ['Train / రైలు (でんしゃ)', 'Car / కారు (くるま)', 'Bicycle / సైకిల్ (じてんしゃ)', 'Bus / బస్సు (バス)'],
    correctIndex: 1,
    explanationEn: 'くるま (kuruma) translates to automobile/car.',
    explanationTe: 'くるま అంటే కారు.'
  },
  {
    id: 'l_7',
    type: 'sentence',
    audioText: 'おはようございます',
    transcriptJp: 'おはようございます',
    transcriptRomaji: 'Ohayou gozaimasu',
    meaningEn: 'Good morning (polite)',
    meaningTe: 'శుభోదయం (మర్యాదపూర్వకంగా)',
    question: 'Which greeting was spoken?',
    questionTe: 'ఏ శుభాకాంక్షను పలికారు?',
    options: [
      'Good morning / శుభోదయం',
      'Good evening / శుభ సాయంత్రం',
      'Good night / శుభరాత్రి',
      'Goodbye / వీడ్కోలు'
    ],
    correctIndex: 0,
    explanationEn: 'おはようございます (Ohayou gozaimasu) is the standard polite morning greeting.',
    explanationTe: 'ఉదయం పలకరించడానికి おはようございます వాడతారు.'
  },
  {
    id: 'l_8',
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
    correctIndex: 1,
    explanationEn: '今 (now) + 何時 (what hour) + ですか (is it?).',
    explanationTe: 'సమయం ఎంత అయ్యిందో అడగడానికి 今、何時ですか అంటారు.'
  },
  {
    id: 'l_9',
    type: 'sentence',
    audioText: 'おちゃをください',
    transcriptJp: 'お茶をください',
    transcriptRomaji: 'Ocha o kudasai',
    meaningEn: 'Green tea, please.',
    meaningTe: 'దయచేసి గ్రీన్ టీ ఇవ్వండి.',
    question: 'What is being ordered?',
    questionTe: 'ఏమి ఆర్డర్ చేస్తున్నారు?',
    options: [
      'Water, please / మంచినీళ్లు',
      'Green tea, please / గ్రీన్ టీ',
      'Coffee, please / కాఫీ',
      'Juice, please / జ్యూస్'
    ],
    correctIndex: 1,
    explanationEn: 'お茶 (ocha - green tea) + を + ください (please give me).',
    explanationTe: 'గ్రీన్ టీ అడగడానికి お茶をください అంటారు.'
  },
  {
    id: 'l_10',
    type: 'sentence',
    audioText: 'えきはどこですか？',
    transcriptJp: '駅はどこですか？',
    transcriptRomaji: 'Eki wa doko desu ka?',
    meaningEn: 'Where is the station?',
    meaningTe: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది?',
    question: 'What location is the speaker trying to find?',
    questionTe: 'ఏ ప్రదేశం కోసం వెతుకుతున్నారు?',
    options: [
      'Station / రైల్వే స్టేషన్ (駅)',
      'Hospital / ఆసుపత్రి (病院)',
      'Library / గ్రంథాలయం (図書館)',
      'Bank / బ్యాంకు (銀行)'
    ],
    correctIndex: 0,
    explanationEn: '駅 (eki - train station) + はどこですか (where is).',
    explanationTe: '駅 (ఎకి) అంటే రైల్వే స్టేషన్.'
  },
  {
    id: 'l_11',
    type: 'dialogue',
    audioText: 'きのう、なにをしましたか？ほんをよみました。',
    transcriptJp: 'A: 昨日、何をしましたか？ B: 本を読みました。',
    transcriptRomaji: 'A: Kinou, nani o shimashita ka? B: Hon o yomimashita.',
    meaningEn: 'A: What did you do yesterday? B: I read a book.',
    meaningTe: 'A: నిన్న ఏమి చేసావు? B: పుస్తకం చదివాను.',
    question: 'According to person B, what activity did they do yesterday?',
    questionTe: 'వ్యక్తి B నిన్న ఏమి చేసినట్లు చెప్పారు?',
    options: [
      'Read a book / పుస్తకం చదివారు',
      'Watched TV / టీవీ చూశారు',
      'Ate sushi / సుషీ తిన్నారు',
      'Slept all day / రోజంతా పడుకున్నారు'
    ],
    correctIndex: 0,
    explanationEn: 'Person B answered "本を読みました" (I read a book - past tense of yomimasu).',
    explanationTe: 'వ్యక్తి B "本を読みました" (పుస్తకం చదివాను) అని సమాధానం ఇచ్చారు.'
  },
  {
    id: 'l_12',
    type: 'dialogue',
    audioText: 'いっしょにたべませんか？はい、たべましょう！',
    transcriptJp: 'A: 一緒に食べませんか？ B: はい、食べましょう！',
    transcriptRomaji: 'A: Issho ni tabemasen ka? B: Hai, tabemashou!',
    meaningEn: 'A: Won\'t you eat together with me? B: Yes, let\'s eat!',
    meaningTe: 'A: నాతో కలిసి తింటావా? B: అవును, కలిసి తిందాం!',
    question: 'What did person B agree to do?',
    questionTe: 'వ్యక్తి B దేనికి అంగీకరించారు?',
    options: [
      'Eat together / కలిసి తినడానికి',
      'Go shopping / షాపింగ్‌కు వెళ్లడానికి',
      'Study Japanese / చదువుకోవడానికి',
      'Leave immediately / బయలుదేరడానికి'
    ],
    correctIndex: 0,
    explanationEn: '~ませんか invites someone ("Won\'t you?"), and ~ましょう enthusiastically accepts ("Let\'s!").',
    explanationTe: '一緒に食べましょう అంటే "కలిసి తిందాం" అని అంగీకరించడం.'
  }
];

export const ListeningLab: React.FC = () => {
  const { displayMode, awardXP, recordAttempt } = useLearning();
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const current = LISTENING_EXERCISES[exerciseIndex];

  const handlePlayAudio = () => {
    soundEffects.playClick();
    audioService.speak(current.audioText, { rate: playbackSpeed });
  };

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
      storageService.logMistake(
        current.id,
        'grammar',
        current.question,
        current.options[idx],
        current.options[current.correctIndex],
        'listening_confusion',
        current.explanationEn,
        current.explanationTe
      );
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
            12 Listening exercises: kana moras, high-yield vocabulary, and everyday dialogues ({exerciseIndex + 1}/{LISTENING_EXERCISES.length}).
          </p>
        </div>

        <span className="text-2xs font-mono px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-kai-muted">
          Exercise {exerciseIndex + 1} of {LISTENING_EXERCISES.length}
        </span>
      </div>

      {/* Main Listening Deck */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-kai-indigo-bg text-kai-indigo flex items-center justify-center mx-auto shadow-sm">
          <Headphones size={28} />
        </div>

        {/* Speed Toggles */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xs font-mono uppercase text-kai-muted flex items-center gap-1">
            <Gauge size={12} />
            <span>Speed:</span>
          </span>
          {[0.75, 1.0, 1.25].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setPlaybackSpeed(spd);
                soundEffects.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-2xs font-mono font-bold transition-colors ${
                playbackSpeed === spd
                  ? 'bg-kai-vermilion text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-kai-dark-bg text-kai-muted hover:text-kai-ink'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Big Audio Trigger Button */}
        <div className="space-y-3">
          <button
            onClick={handlePlayAudio}
            className="px-8 py-4 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-vermilion flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
          >
            <Volume2 size={20} />
            <span>Play Audio ({playbackSpeed}x)</span>
          </button>

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
            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <p className="font-telugu text-2xs text-kai-vermilion">{current.meaningTe}</p>
            )}
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

            let style = 'bg-stone-50 dark:bg-kai-dark-bg/60 border-kai-border text-kai-ink dark:text-white hover:border-kai-vermilion';
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
                className={`p-4 rounded-2xl border transition-all text-xs sm:text-sm font-medium ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanations shown upon submission */}
        {submitted && (
          <div className="p-4 rounded-2xl bg-kai-bg dark:bg-kai-dark-bg border border-kai-border text-left text-xs space-y-1 animate-in fade-in">
            <p className="font-bold text-kai-ink dark:text-white">Explanation:</p>
            <p className="text-kai-muted">{current.explanationEn}</p>
            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <p className="font-telugu text-kai-vermilion">{current.explanationTe}</p>
            )}
          </div>
        )}

        {/* Speech Synthesis Disclosure Notice */}
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-kai-border/40 text-3xs text-kai-faint text-left space-y-0.5">
          <div className="flex items-center gap-1 font-semibold text-kai-muted">
            <Info size={11} />
            <span>Speech Synthesis Disclosure</span>
          </div>
          <p>
            Audio in Listening Lab is powered by your browser's Web Speech API (speechSynthesis). While excellent for accurate Japanese mora pronunciation and listening practice, synthetic voices may exhibit subtle robotic cadence compared to living native speakers.
          </p>
        </div>

        {/* Next Question */}
        {submitted && (
          <button
            onClick={nextExercise}
            className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion flex items-center justify-center gap-2 transition-transform active:scale-95 animate-in fade-in"
          >
            <span>Next Listening Exercise ({exerciseIndex + 1 < LISTENING_EXERCISES.length ? `${exerciseIndex + 2}/${LISTENING_EXERCISES.length}` : 'Loop'})</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
