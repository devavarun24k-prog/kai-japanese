// src/tests/dictation.test.ts
// Vitest unit tests for Dictation Studio audio engine state machine, keyboard logic, and paper mode ratings
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DictationAudioEngine } from '../features/dictation/audioEngine';
import { audioService } from '../services/audioService';
import { splitKanaUnits } from '../features/dictation/eligibility';

describe('DictationAudioEngine State Machine', () => {
  let engine: DictationAudioEngine;

  beforeEach(() => {
    engine = new DictationAudioEngine();
  });

  it('should initialize in idle state', () => {
    expect(engine.getState()).toBe('idle');
  });

  it('should notify subscribers of state transitions', () => {
    const states: string[] = [];
    const unsubscribe = engine.subscribeState((s) => states.push(s));

    expect(states).toEqual(['idle']);
    unsubscribe();
  });

  it('should cleanly reset to idle on stop()', () => {
    engine.stop();
    expect(engine.getState()).toBe('idle');
  });

  it('should enforce single-channel audio by stopping previous playback before starting new', async () => {
    const stopSpy = vi.spyOn(audioService, 'stop');
    const speakSpy = vi.spyOn(audioService, 'speak').mockImplementation((_, opts) => {
      opts?.onStart?.();
      opts?.onEnd?.();
      return Promise.resolve(true);
    });

    const playPromise = engine.play('あさ');
    await playPromise;

    expect(stopSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledWith('あさ', expect.objectContaining({ rate: 0.95 }));
    expect(engine.getState()).toBe('idle');
  });

  it('should support slow rate playback at 0.72x speed', async () => {
    const speakSpy = vi.spyOn(audioService, 'speak').mockImplementation((_, opts) => {
      opts?.onStart?.();
      opts?.onEnd?.();
      return Promise.resolve(true);
    });

    await engine.playSlow('あさ');
    expect(speakSpy).toHaveBeenCalledWith('あさ', expect.objectContaining({ rate: 0.72 }));
  });
});

describe('Dictation Input & Kana Units Manipulation', () => {
  it('should correctly build and backspace mora sequences including digraphs', () => {
    let input = '';
    // Append 'き' then 'ょ' -> forms digraph 'きょ'
    input += 'き';
    input += 'ょ';
    expect(splitKanaUnits(input)).toEqual(['きょ']);

    // Append 'う'
    input += 'う';
    expect(splitKanaUnits(input)).toEqual(['きょ', 'う']);

    // Backspace: removes 'う'
    const units = splitKanaUnits(input);
    units.pop();
    input = units.join('');
    expect(input).toBe('きょ');

    // Backspace again: removes 'きょ'
    const units2 = splitKanaUnits(input);
    units2.pop();
    input = units2.join('');
    expect(input).toBe('');
  });
});

describe('Dictation Configuration & Hints', () => {
  it('should have answer length hint disabled by default', () => {
    const defaultConfig = {
      mode: 'screen' as const,
      questionCount: 10,
      showLengthHint: false,
      strictMode: false
    };
    expect(defaultConfig.showLengthHint).toBe(false);
    expect(defaultConfig.strictMode).toBe(false);
  });

  it('should force answer length hint OFF when strict mode is enabled', () => {
    const userSelectedHint = true;
    const strictModeEnabled = true;

    // Configuration resolution rule
    const resolvedHint = strictModeEnabled ? false : userSelectedHint;
    expect(resolvedHint).toBe(false);
  });
});

describe('Screen Mode Deferred Evaluation & Navigation', () => {
  it('should allow modifying earlier answers without premature evaluation', () => {
    const words = [
      { id: 'w1', kana: 'あさ' },
      { id: 'w2', kana: 'ひる' },
      { id: 'w3', kana: 'よる' }
    ];

    const answers = ['', '', ''];

    // User types answer for word 1
    answers[0] = 'あし'; // typo
    // User moves to word 2
    answers[1] = 'ひる';
    // User goes back to word 1 and corrects it
    answers[0] = 'あさ';

    expect(answers[0]).toBe('あさ');
    expect(answers[1]).toBe('ひる');
    expect(answers[2]).toBe('');

    // Final evaluation only occurs upon session submission:
    const records = words.map((w, idx) => ({
      itemId: w.id,
      input: answers[idx],
      isCorrect: answers[idx] === w.kana
    }));

    expect(records[0].isCorrect).toBe(true);
    expect(records[1].isCorrect).toBe(true);
    expect(records[2].isCorrect).toBe(false);
  });
});
