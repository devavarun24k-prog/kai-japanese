// src/services/audioService.ts
// Native Japanese Speech Synthesis service with voice selection, speed controls, and repetition

export interface AudioPlaybackOptions {
  rate?: number; // 0.7 = slow, 1.0 = normal, 1.25 = fast
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class AudioService {
  private synth: SpeechSynthesis | null = null;
  private japaneseVoices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isAvailable: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isAvailable = true;
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const allVoices = this.synth.getVoices();
    this.japaneseVoices = allVoices.filter(
      (v) => v.lang.startsWith('ja') || v.lang.includes('JP') || v.lang === 'ja_JP'
    );

    if (this.japaneseVoices.length > 0) {
      // Prefer Google or Microsoft or Apple natural voices
      const naturalVoice = this.japaneseVoices.find(
        (v) =>
          v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Kyoko') ||
          v.name.includes('Otoya') ||
          v.name.includes('Nanami') ||
          v.name.includes('Keiko')
      );
      this.selectedVoice = naturalVoice || this.japaneseVoices[0];
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.japaneseVoices;
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  public isSupported(): boolean {
    return this.isAvailable;
  }

  public stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public speak(text: string, options: AudioPlaybackOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve(false);
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      } else if (this.japaneseVoices.length > 0) {
        utterance.voice = this.japaneseVoices[0];
      }

      utterance.rate = options.rate ?? 0.95;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
        resolve(true);
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        options.onError?.(e);
        resolve(false);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  // Speak slowly for learner analysis
  public speakSlow(text: string, options: AudioPlaybackOptions = {}): Promise<boolean> {
    return this.speak(text, { ...options, rate: 0.72 });
  }

  // Speak with repeated loop
  public async speakLoop(text: string, times: number = 2, delayMs: number = 800): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.speak(text);
      if (i < times - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
}

export const audioService = new AudioService();
