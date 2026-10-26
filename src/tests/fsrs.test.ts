// src/tests/fsrs.test.ts
// Unit tests for FSRS spaced repetition and speech evaluation
import { describe, it, expect } from 'vitest';
import { fsrsService } from '../services/fsrsService';
import { speechRecognitionService } from '../services/speechRecognition';

describe('FSRS Spaced Repetition Engine', () => {
  it('should initialize a new card with state 0 (New)', () => {
    const card = fsrsService.createCard('h_a', 'kana');
    expect(card.state).toBe(0);
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.item_id).toBe('h_a');
  });

  it('should transition a new card to Review state on Good (3) rating', () => {
    const card = fsrsService.createCard('h_a', 'kana');
    const scheduled = fsrsService.schedule(card, 3);
    expect(scheduled.state).toBe(2); // Review
    expect(scheduled.reps).toBe(1);
    expect(scheduled.scheduled_days).toBeGreaterThanOrEqual(1);
  });

  it('should transition a new card to Learning state on Again (1) rating', () => {
    const card = fsrsService.createCard('h_a', 'kana');
    const scheduled = fsrsService.schedule(card, 1);
    expect(scheduled.state).toBe(1); // Learning
    expect(scheduled.lapses).toBe(1);
  });

  it('should calculate retrievability decay over elapsed days', () => {
    const card = fsrsService.createCard('v_kore', 'vocab');
    const reviewed = fsrsService.schedule(card, 4); // Easy
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days later
    const retrievability = fsrsService.getRetrievability(reviewed, futureDate);
    expect(retrievability).toBeGreaterThan(0);
    expect(retrievability).toBeLessThanOrEqual(1.0);
  });
});

describe('Speech Recognition & Mora Pronunciation Evaluation', () => {
  it('should score exact Japanese mora matches with Mastery', () => {
    const result = speechRecognitionService.evaluatePronunciation(
      'これはほんです',
      'これは本です',
      'kore wa hon desu'
    );
    expect(result.similarity_score).toBeGreaterThanOrEqual(90);
    expect(result.accuracy_rating).toBe('Mastery');
    expect(result.is_match).toBe(true);
  });

  it('should identify mismatched moras in near misses', () => {
    const result = speechRecognitionService.evaluatePronunciation(
      'これわほんです', // used わ instead of は
      'これは本です',
      'kore wa hon desu'
    );
    expect(result.similarity_score).toBeGreaterThanOrEqual(70);
    expect(result.feedback_en).toBeDefined();
    expect(result.feedback_te).toBeDefined();
  });
});
