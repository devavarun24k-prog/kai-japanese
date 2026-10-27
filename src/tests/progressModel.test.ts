// src/tests/progressModel.test.ts
// Vitest unit tests for Character Mastery model, classification, and migration
import { describe, it, expect, beforeEach } from 'vitest';
import {
  classifyGlyph,
  computeGlyphState,
  characterMasteryService
} from '../features/learning/characterMastery';
import { storageService } from '../services/storageService';
import { FSRSCard } from '../types';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  globalThis.localStorage = new LocalStorageMock() as any;
}

describe('classifyGlyph', () => {
  it('should classify standard Gojuon kana', () => {
    expect(classifyGlyph('あ')).toEqual({ group: 'gojuon', system: 'hiragana' });
    expect(classifyGlyph('カ')).toEqual({ group: 'gojuon', system: 'katakana' });
  });

  it('should classify dakuten and handakuten', () => {
    expect(classifyGlyph('が')).toEqual({ group: 'dakuten', system: 'hiragana' });
    expect(classifyGlyph('ぱ')).toEqual({ group: 'handakuten', system: 'hiragana' });
    expect(classifyGlyph('ポ')).toEqual({ group: 'handakuten', system: 'katakana' });
  });

  it('should classify youon digraphs', () => {
    expect(classifyGlyph('きゃ')).toEqual({ group: 'youon', system: 'hiragana' });
    expect(classifyGlyph('シュ')).toEqual({ group: 'youon', system: 'katakana' });
  });

  it('should classify sokuon small tsu and chouon prolonged mark', () => {
    expect(classifyGlyph('っ')).toEqual({ group: 'sokuon', system: 'hiragana' });
    expect(classifyGlyph('ッ')).toEqual({ group: 'sokuon', system: 'katakana' });
    expect(classifyGlyph('ー')).toEqual({ group: 'chouon', system: 'symbol' });
  });
});

describe('computeGlyphState', () => {
  it('should return unseen when seen is 0', () => {
    expect(computeGlyphState(0, 0)).toBe('unseen');
  });

  it('should return learning for few attempts', () => {
    expect(computeGlyphState(2, 2)).toBe('learning');
  });

  it('should return known for solid accuracy over multiple reps', () => {
    expect(computeGlyphState(4, 3)).toBe('known');
  });

  it('should return mastered for high reps and high accuracy', () => {
    expect(computeGlyphState(6, 6)).toBe('mastered');
  });

  it('should return struggling for low accuracy over multiple attempts', () => {
    expect(computeGlyphState(4, 1)).toBe('struggling');
  });

  it('should prioritize manual override as mastered', () => {
    expect(computeGlyphState(0, 0, true)).toBe('mastered');
  });
});

describe('characterMasteryService & Migration', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.setUserId('test_learner');
  });

  it('should initialize baseline records without deleting anything', () => {
    const records = characterMasteryService.getGlyphRecords();
    expect(records['あ']).toBeDefined();
    expect(records['あ'].state).toBe('unseen');
  });

  it('should correctly record attempts and update state', () => {
    characterMasteryService.recordGlyphAttempt('あ', true);
    characterMasteryService.recordGlyphAttempt('あ', true);
    characterMasteryService.recordGlyphAttempt('あ', true);

    const records = characterMasteryService.getGlyphRecords();
    expect(records['あ'].seenCount).toBe(3);
    expect(records['あ'].correctCount).toBe(3);
    expect(records['あ'].state).toBe('known');
  });

  it('should support manual override to mark a character learned', () => {
    characterMasteryService.setGlyphOverride('か', true);
    const learned = characterMasteryService.getLearnedGlyphs();
    expect(learned.has('か')).toBe(true);

    characterMasteryService.setGlyphOverride('か', false);
    const updatedLearned = characterMasteryService.getLearnedGlyphs();
    expect(updatedLearned.has('か')).toBe(false);
  });

  it('should non-destructively migrate existing FSRS kana cards', () => {
    const mockCard: FSRSCard = {
      card_id: 'c_kana_h_i',
      item_id: 'h_i', // 'い'
      item_type: 'kana',
      state: 2,
      due: '2026-10-30T00:00:00Z',
      stability: 3.5,
      difficulty: 2.0,
      elapsed_days: 3,
      scheduled_days: 7,
      reps: 5,
      lapses: 0
    };
    storageService.saveCards([mockCard]);

    const migrated = characterMasteryService.migrateFromExistingProgress();
    expect(migrated['い']).toBeDefined();
    expect(migrated['い'].seenCount).toBe(5);
    expect(migrated['い'].state).toBe('mastered');
  });

  it('should guarantee a brand new user starts with an EMPTY learned set', () => {
    // New user with no FSRS cards, no attempts, no overrides
    storageService.setUserId('brand_new_user_' + Date.now());
    const learned = characterMasteryService.getLearnedGlyphs();
    expect(learned.size).toBe(0);
  });

  it('should not mark a character known if FSRS card is only in learning (1) or relearning (3) state', () => {
    const learningCard: FSRSCard = {
      card_id: 'c_kana_h_u',
      item_id: 'h_u', // 'う'
      item_type: 'kana',
      state: 1, // Learning
      due: '2026-10-30T00:00:00Z',
      stability: 0.8,
      difficulty: 6.0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 1,
      lapses: 0
    };
    storageService.saveCards([learningCard]);

    const migrated = characterMasteryService.migrateFromExistingProgress();
    expect(migrated['う'].state).toBe('learning');
    const learned = characterMasteryService.getLearnedGlyphs();
    expect(learned.has('う')).toBe(false);
  });
});
