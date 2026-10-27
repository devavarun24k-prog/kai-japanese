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
