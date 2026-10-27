// src/features/dictation/types.ts
// Contracts for Dictation Studio modes, sessions, and audio engine
import { DictationVocabItem } from '../../data/vocab/types';
import { FSRSRating } from '../../types';

export type DictationMode = 'screen' | 'paper';

export type DictationAudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface DictationConfig {
  mode: DictationMode;
  questionCount: number;
}

export interface DictationAnswerRecord {
  item: DictationVocabItem;
  userInputKana: string;
  isCorrect: boolean;
  timeSpentMs: number;
  replaysCount: number;
  selfRating?: FSRSRating;
}

export interface DictationSessionResult {
  totalQuestions: number;
  correctCount: number;
  accuracyPct: number;
  xpEarned: number;
  records: DictationAnswerRecord[];
}
