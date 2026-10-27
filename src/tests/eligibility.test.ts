// src/tests/eligibility.test.ts
// Vitest unit tests for Kana unit splitting, eligibility filtering, and shortage explanation
import { describe, it, expect } from 'vitest';
import {
  splitKanaUnits,
  isWordEligible,
  buildPool,
  explainShortage,
  pickWords
} from '../features/dictation/eligibility';
import { DictationVocabItem } from '../data/vocab/types';
import { N5_KANA_WORDS } from '../data/vocab/n5KanaWords';
import { generateTeluguVerificationReport } from '../data/vocab/reportUnverified';
import { FSRSCard } from '../types';

describe('splitKanaUnits (Atomic Mora & Digraph Separation)', () => {
  it('should split standard Gojuon kana into single moras', () => {
    expect(splitKanaUnits('あさ')).toEqual(['あ', 'さ']);
    expect(splitKanaUnits('いぬ')).toEqual(['い', 'ぬ']);
    expect(splitKanaUnits('ほん')).toEqual(['ほ', 'ん']);
  });

  it('should properly keep dakuten and handakuten characters as single units', () => {
    expect(splitKanaUnits('たまご')).toEqual(['た', 'ま', 'ご']);
    expect(splitKanaUnits('パン')).toEqual(['パ', 'ン']);
    expect(splitKanaUnits('みず')).toEqual(['み', 'ず']);
  });

  it('should bundle contracted youon into digraph units', () => {
    expect(splitKanaUnits('きょう')).toEqual(['きょ', 'う']);
    expect(splitKanaUnits('きょうしつ')).toEqual(['きょ', 'う', 'し', 'つ']);
    expect(splitKanaUnits('かいしゃ')).toEqual(['か', 'い', 'しゃ']);
    expect(splitKanaUnits('でんしゃ')).toEqual(['で', 'ん', 'しゃ']);
  });

  it('should treat sokuon (small tsu っ / ッ) as an independent spelling unit', () => {
    expect(splitKanaUnits('がっこう')).toEqual(['が', 'っ', 'こ', 'う']);
    expect(splitKanaUnits('サンドイッチ')).toEqual(['サ', 'ン', 'ド', 'イ', 'ッ', 'チ']);
  });

  it('should treat chouon (prolonged mark ー) as an independent spelling unit', () => {
    expect(splitKanaUnits('コーヒー')).toEqual(['コ', 'ー', 'ヒ', 'ー']);
    expect(splitKanaUnits('デパート')).toEqual(['デ', 'パ', 'ー', 'ト']);
    expect(splitKanaUnits('タクシー')).toEqual(['タ', 'ク', 'シ', 'ー']);
  });

  it('should handle complex katakana foreign sounds like フォ', () => {
    expect(splitKanaUnits('フォーク')).toEqual(['フォ', 'ー', 'ク']);
  });
});

describe('isWordEligible & buildPool', () => {
  const sampleWord: DictationVocabItem = {
    id: 'test_asa',
    kana: 'あさ',
    romaji: 'asa',
    meaningEn: 'Morning',
    teluguVerified: false,
    englishPron: 'ah-sah',
    level: 'N5',
    tags: ['test'],
    example: {
      ja: 'あさ',
      kana: 'あさ',
      romaji: 'asa',
      en: 'morning',
      teVerified: false
    }
  };

  it('should return false if the learned set is empty', () => {
    const emptySet = new Set<string>();
    expect(isWordEligible(sampleWord, emptySet)).toBe(false);
  });

  it('should return false if only some glyphs are learned', () => {
    const partialSet = new Set<string>(['あ']); // missing 'さ'
    expect(isWordEligible(sampleWord, partialSet)).toBe(false);
  });

  it('should return true when all glyphs of the word are present in the learned set', () => {
    const fullSet = new Set<string>(['あ', 'さ']);
    expect(isWordEligible(sampleWord, fullSet)).toBe(true);
  });

  it('should accurately build a pool of eligible words from a candidate list', () => {
    const words: DictationVocabItem[] = [
      sampleWord,
      {
        ...sampleWord,
        id: 'test_inu',
        kana: 'いぬ'
      }
    ];
    const learned = new Set<string>(['あ', 'さ']); // knows 'あさ' but not 'い' or 'ぬ'
    const pool = buildPool(words, learned);
    expect(pool.length).toBe(1);
    expect(pool[0].id).toBe('test_asa');
  });
});

describe('explainShortage', () => {
  it('should return 0 shortage if pool meets or exceeds target count', () => {
    const sampleSet = new Set<string>(['あ', 'さ', 'い', 'ぬ', 'め', 'て', 'き', 'み', 'ず']);
    const explanation = explainShortage(1, N5_KANA_WORDS, sampleSet);
    expect(explanation.shortageCount).toBe(0);
  });

  it('should calculate shortage and provide high-yield unlock recommendations', () => {
    const partialSet = new Set<string>(['あ', 'い', 'う', 'え', 'お']); // only 5 vowels
    const explanation = explainShortage(10, N5_KANA_WORDS, partialSet);

    expect(explanation.shortageCount).toBeGreaterThan(0);
    expect(explanation.missingGlyphs.length).toBeGreaterThan(0);
    expect(typeof explanation.unlockedIfLearned).toBe('object');
  });
});

describe('pickWords (Spaced Review Weighting)', () => {
  const pool = N5_KANA_WORDS.slice(0, 10);

  it('should pick exactly the requested count when pool is large enough', () => {
    const picked = pickWords(pool, 5);
    expect(picked.length).toBe(5);
  });

  it('should return the full pool if requested count exceeds pool size', () => {
    const smallPool = pool.slice(0, 3);
    const picked = pickWords(smallPool, 10);
    expect(picked.length).toBe(3);
  });

  it('should prioritize words with overdue FSRS cards', () => {
    const now = new Date('2026-10-27T12:00:00Z');
    const overdueCard: FSRSCard = {
      card_id: 'c_overdue',
      item_id: pool[0].id,
      item_type: 'vocab',
      state: 2,
      due: '2026-10-25T00:00:00Z', // 2 days overdue
      stability: 1.0,
      difficulty: 5.0,
      elapsed_days: 2,
      scheduled_days: 1,
      reps: 3,
      lapses: 1
    };

    const notDueCard: FSRSCard = {
      card_id: 'c_future',
      item_id: pool[1].id,
      item_type: 'vocab',
      state: 2,
      due: '2026-11-05T00:00:00Z', // Not due for 9 days
      stability: 10.0,
      difficulty: 3.0,
      elapsed_days: 1,
      scheduled_days: 10,
      reps: 5,
      lapses: 0
    };

    const picked = pickWords(pool, 1, [overdueCard, notDueCard], now);
    expect(picked[0].id).toBe(pool[0].id);
  });
});

describe('Zero Fake Data & Telugu Verification Audit', () => {
  it('should correctly flag all unreviewed Telugu entries without presenting them as verified', () => {
    const report = generateTeluguVerificationReport();
    expect(report.totalWords).toBe(150);
    expect(report.unverifiedMeaningsCount).toBe(150); // Explicitly unverified until human review
    expect(report.allVerified).toBe(false); // Validates honesty principle
  });
});
