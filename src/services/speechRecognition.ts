// src/services/speechRecognition.ts
// Real speech recognition service for Japanese speaking practice & shadowing
import * as wanakana from 'wanakana';
import { SpeechAssessmentResult } from '../types';

// Web Speech API interface definitions
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type RecognitionState = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private state: RecognitionState = 'idle';

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.lang = 'ja-JP';
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
        this.recognition.continuous = false;
        this.isSupported = true;
      } else {
        this.state = 'unsupported';
      }
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public getState(): RecognitionState {
    return this.state;
  }

  // Calculate Levenshtein distance between two strings
  private levenshtein(a: string, b: string): number {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;

    const matrix: number[][] = [];
    for (let i = 0; i <= bn; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= an; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= bn; i++) {
      for (let j = 1; j <= an; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }
    return matrix[bn][an];
  }

  // Assess spoken transcript against target sentence
  public evaluatePronunciation(
    transcript: string,
    expectedJapanese: string,
    expectedRomaji: string
  ): SpeechAssessmentResult {
    // Normalize both to hiragana and phonetic particle equivalence (ha/wa sound identical)
    const normTranscript = wanakana
      .toHiragana(transcript.replace(/[\s\u3000,.!?、。！？]/g, ''))
      .replace(/は/g, 'わ');
    // Use expectedRomaji converted to hiragana so kanji becomes pure phonetic kana
    const rawExpected = expectedRomaji
      ? wanakana.toHiragana(expectedRomaji.replace(/[\s\u3000,.!?、。！？]/g, ''))
      : wanakana.toHiragana(expectedJapanese.replace(/[\s\u3000,.!?、。！？]/g, ''));
    const normExpected = rawExpected.replace(/は/g, 'わ');

    const distance = this.levenshtein(normTranscript, normExpected);
    const maxLen = Math.max(normTranscript.length, normExpected.length, 1);
    const similarity = Math.max(0, Math.round((1 - distance / maxLen) * 100));

    let accuracyRating: 'Mastery' | 'Great' | 'Good' | 'Needs Practice' = 'Needs Practice';
    if (similarity >= 90) accuracyRating = 'Mastery';
    else if (similarity >= 75) accuracyRating = 'Great';
    else if (similarity >= 55) accuracyRating = 'Good';

    // Mismatched moras analysis
    const mismatchedMoras: { mora: string; heard: string }[] = [];
    const minLen = Math.min(normExpected.length, normTranscript.length);
    for (let i = 0; i < minLen; i++) {
      if (normExpected[i] !== normTranscript[i]) {
        mismatchedMoras.push({
          mora: normExpected[i],
          heard: normTranscript[i] || '—'
        });
      }
    }
    if (normTranscript.length < normExpected.length) {
      for (let i = minLen; i < normExpected.length; i++) {
        mismatchedMoras.push({ mora: normExpected[i], heard: '(missing)' });
      }
    }

    let feedbackEn = '';
    let feedbackTe = '';

    if (similarity >= 90) {
      feedbackEn = 'Outstanding pitch and mora timing! Your pronunciation is crisp and natural.';
      feedbackTe = 'అద్భుతమైన ఉచ్చారణ! జపనీస్ పదాల లయ మరియు ఉచ్చారణ చాలా స్పష్టంగా ఉన్నాయి.';
    } else if (similarity >= 75) {
      feedbackEn = 'Very good attempt! A native speaker would readily understand you.';
      feedbackTe = 'చాలా మంచి ప్రయత్నం! జపనీయులు మీరు మాట్లాడినది సులభంగా అర్థం చేసుకోగలరు.';
    } else if (similarity >= 55) {
      feedbackEn = 'Understood, but pay closer attention to vowel length and clear mora separation.';
      feedbackTe = 'అర్థమైంది, కానీ దీర్ఘాలు (long vowels) మరియు స్పష్టమైన అక్షర ఉచ్చారణపై దృష్టి పెట్టండి.';
    } else {
      feedbackEn = 'Review the romaji guide and listen to the sample audio before trying again.';
      feedbackTe = 'మరొకసారి ఆడియోను శ్రద్ధగా విని, తెలుగు ఉచ్చారణ సహాయంతో మళ్లీ ప్రయత్నించండి.';
    }

    return {
      transcript,
      expected: expectedJapanese,
      similarity_score: similarity,
      accuracy_rating: accuracyRating,
      mismatched_moras: mismatchedMoras,
      feedback_en: feedbackEn,
      feedback_te: feedbackTe,
      is_match: similarity >= 70
    };
  }

  // Start listening session
  public startListening(
    onInterim: (text: string) => void,
    onResult: (finalText: string) => void,
    onError: (err: string) => void
  ): () => void {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return () => {};
    }

    try {
      this.state = 'listening';

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (interim) onInterim(interim);
        if (final) {
          this.state = 'processing';
          onResult(final);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.state = 'error';
        let msg = 'Recognition error';
        if (event.error === 'not-allowed') {
          msg = 'Microphone access was denied. Please allow microphone permissions in your browser.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please speak closer to your microphone.';
        } else if (event.error === 'network') {
          msg = 'Network issue connecting to speech recognition service.';
        }
        onError(msg);
      };

      this.recognition.onend = () => {
        if (this.state === 'listening') {
          this.state = 'idle';
        }
      };

      this.recognition.start();

      return () => {
        try {
          this.recognition.stop();
          this.state = 'idle';
        } catch (e) {}
      };
    } catch (err: unknown) {
      this.state = 'error';
      onError('Failed to start microphone: ' + String(err));
      return () => {};
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
