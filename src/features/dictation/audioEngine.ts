// src/features/dictation/audioEngine.ts
// Finite state machine audio engine for dictation with single-channel enforcement and watchdog timer
import { DictationAudioState } from './types';
import { audioService } from '../../services/audioService';

export class DictationAudioEngine {
  private state: DictationAudioState = 'idle';
  private stateListeners: Set<(state: DictationAudioState) => void> = new Set();
  private watchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private currentPromiseResolve: ((success: boolean) => void) | null = null;

  public getState(): DictationAudioState {
    return this.state;
  }

  public subscribeState(listener: (state: DictationAudioState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => this.stateListeners.delete(listener);
  }

  private setState(newState: DictationAudioState): void {
    if (this.state === newState) return;
    this.state = newState;
    this.stateListeners.forEach((fn) => fn(newState));
  }

  private clearWatchdog(): void {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  // Cancel any ongoing audio immediately
  public stop(): void {
    this.clearWatchdog();
    audioService.stop();
    if (this.currentPromiseResolve) {
      this.currentPromiseResolve(false);
      this.currentPromiseResolve = null;
    }
    this.setState('idle');
  }

  // Play audio with single-channel guarantee and 6-second watchdog timeout fallback
  public play(text: string, rate: number = 0.95): Promise<boolean> {
    return new Promise((resolve) => {
      // 1. Force cancellation of any previous audio
      this.stop();

      this.currentPromiseResolve = resolve;
      this.setState('loading');

      // 2. Set 6-second watchdog timeout in case browser TTS stalls
      this.watchdogTimer = setTimeout(() => {
        console.warn('DictationAudioEngine: Watchdog timeout triggered (6s). Forcing state reset to idle.');
        this.stop();
        resolve(false);
      }, 6000);

      // 3. Initiate playback
      this.setState('playing');

      audioService.speak(text, {
        rate,
        onStart: () => {
          this.setState('playing');
        },
        onEnd: () => {
          this.clearWatchdog();
          this.setState('idle');
          this.currentPromiseResolve = null;
          resolve(true);
        },
        onError: (err) => {
          console.warn('DictationAudioEngine playback error:', err);
          this.clearWatchdog();
          this.setState('error');
          setTimeout(() => this.setState('idle'), 800);
          this.currentPromiseResolve = null;
          resolve(false);
        }
      });
    });
  }

  // Convenience helper for slow analysis playback (0.72x speed)
  public playSlow(text: string): Promise<boolean> {
    return this.play(text, 0.72);
  }
}

export const dictationAudio = new DictationAudioEngine();
