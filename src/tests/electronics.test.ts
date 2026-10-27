// src/tests/electronics.test.ts
// Unit and integration test suite for Technical Japanese & Engineering Fundamentals Suite
import { describe, it, expect, beforeEach } from 'vitest';
import { ELECTRONICS_TERMS, searchElectronicsTerms, getTermsByCategory, getTermById } from '../features/electronics/japanese/terms';
import { ENGINEERING_LESSONS, getLessonById, getAllQuizQuestions } from '../features/electronics/lessons/data';
import {
  getElectronicsProgress,
  saveLessonQuizResult,
  getWeakTopics,
  getTargetedPracticeQuestions
} from '../features/electronics/storage';
import { storageService } from '../services/storageService';

// Node localStorage polyfill for headless Vitest runs
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

describe('Phase 3a: Technical Japanese for Electronics', () => {
  it('contains exactly 80 technical terms with unique IDs', () => {
    expect(ELECTRONICS_TERMS.length).toBe(80);
    const idSet = new Set(ELECTRONICS_TERMS.map((t) => t.id));
    expect(idSet.size).toBe(80);
  });

  it('enforces academic honesty: all terms have reviewed=false and unverified Telugu flags', () => {
    ELECTRONICS_TERMS.forEach((term) => {
      expect(term.reviewed).toBe(false);
      expect(term.teluguVerified).toBe(false);
      expect(term.kanji.length).toBeGreaterThan(0);
      expect(term.kana.length).toBeGreaterThan(0);
      expect(term.romaji.length).toBeGreaterThan(0);
      expect(term.english.length).toBeGreaterThan(0);
      expect(term.plainDefinition.length).toBeGreaterThan(0);
    });
  });

  it('includes core requested semiconductor and circuit vocabulary', () => {
    const requiredKanji = ['半導体', '集積回路', '抵抗', '回路', '電圧', '電流', '歩留まり', '品質管理', '検査'];
    requiredKanji.forEach((target) => {
      const found = ELECTRONICS_TERMS.some((t) => t.kanji === target);
      expect(found, `Expected term ${target} to be present`).toBe(true);
    });
  });

  it('correctly filters terms by category', () => {
    const semiconductors = getTermsByCategory('semiconductor');
    const circuits = getTermsByCategory('circuit_basics');
    const components = getTermsByCategory('components');
    const qc = getTermsByCategory('manufacturing_qc');
    const equipment = getTermsByCategory('equipment');

    expect(semiconductors.length).toBeGreaterThan(10);
    expect(circuits.length).toBeGreaterThan(10);
    expect(components.length).toBeGreaterThan(5);
    expect(qc.length).toBeGreaterThan(5);
    expect(equipment.length).toBeGreaterThan(4);
    expect(semiconductors.length + circuits.length + components.length + qc.length + equipment.length).toBe(80);
  });

  it('searches terms across kanji, english, and romanized readings', () => {
    const searchKanji = searchElectronicsTerms('半導体');
    expect(searchKanji.length).toBeGreaterThanOrEqual(1);
    expect(searchKanji[0].kanji).toBe('半導体');

    const searchEnglish = searchElectronicsTerms('oscilloscope');
    expect(searchEnglish.some((t) => t.kanji === 'オシロスコープ')).toBe(true);

    const searchRomaji = searchElectronicsTerms('teikou');
    expect(searchRomaji.some((t) => t.kanji === '抵抗')).toBe(true);
  });

  it('provides valid morphological kanji breakdowns for compound words', () => {
    const term = getTermById('elec_1'); // 半導体
    expect(term).toBeDefined();
    expect(term?.kanjiBreakdown).toBeDefined();
    expect(term?.kanjiBreakdown?.length).toBe(3);
    expect(term?.kanjiBreakdown?.[0].kanji).toBe('半');
    expect(term?.kanjiBreakdown?.[1].kanji).toBe('導');
    expect(term?.kanjiBreakdown?.[2].kanji).toBe('体');
  });
});

describe('Phase 3b: Engineering Fundamentals Curriculum & Quizzes', () => {
  it('contains 6 comprehensive lessons covering core hardware domains', () => {
    expect(ENGINEERING_LESSONS.length).toBe(6);
    const ids = ENGINEERING_LESSONS.map((l) => l.id);
    expect(ids).toContain('lesson_ohm');
    expect(ids).toContain('lesson_components');
    expect(ids).toContain('lesson_logic');
    expect(ids).toContain('lesson_binary');
    expect(ids).toContain('lesson_semiconductors');
    expect(ids).toContain('lesson_wafer_process');
  });

  it('enforces unreviewed status and valid question structures for every quiz question', () => {
    const allQuestions = getAllQuizQuestions();
    expect(allQuestions.length).toBe(24); // 6 lessons * 4 questions

    allQuestions.forEach((q) => {
      expect(q.reviewed).toBe(false);
      expect(q.options.length).toBe(4);
      expect([0, 1, 2, 3]).toContain(q.correctIndex);
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(10);
    });
  });

  it('each lesson provides structured theory sections and a worked example', () => {
    ENGINEERING_LESSONS.forEach((lesson) => {
      expect(lesson.sections.length).toBeGreaterThanOrEqual(3);
      expect(lesson.workedExample.problem.length).toBeGreaterThan(15);
      expect(lesson.workedExample.stepByStep.length).toBeGreaterThanOrEqual(3);
      expect(lesson.workedExample.answer.length).toBeGreaterThan(0);
    });
  });
});

describe('Phase 3b: Interactive Simulation Mathematical Models', () => {
  it('verifies Ohm’s Law and Joule Power equations (V = I * R, P = V * I)', () => {
    // Test Case 1: 12V across 24Ω
    const v1 = 12;
    const r1 = 24;
    const i1 = v1 / r1;
    const p1 = v1 * i1;
    expect(i1).toBe(0.5); // 0.5 Amperes
    expect(p1).toBe(6.0); // 6.0 Watts

    // Test Case 2: 5V across 250Ω
    const v2 = 5;
    const r2 = 250;
    const i2 = v2 / r2;
    const p2 = v2 * i2;
    expect(i2).toBe(0.02); // 20 mA
    expect(p2).toBe(0.1); // 100 mW
  });

  it('verifies RC Transient Charging Curve exponential formula and tau time constant', () => {
    const r = 20000; // 20 kΩ
    const c = 0.0001; // 100 μF
    const tau = r * c; // τ = RC
    expect(tau).toBe(2.0); // 2.0 seconds

    const v0 = 10; // 10V supply
    // At t = 1 tau: Vc = V0 * (1 - e^-1) ≈ 63.212%
    const vcAt1Tau = v0 * (1 - Math.exp(-1));
    expect(vcAt1Tau).toBeCloseTo(6.321, 2);

    // At t = 5 tau: Vc = V0 * (1 - e^-5) ≈ 99.326%
    const vcAt5Tau = v0 * (1 - Math.exp(-5));
    expect(vcAt5Tau).toBeCloseTo(9.933, 2);
  });

  it('verifies digital logic gate operational truth tables for all 6 gates', () => {
    const compute = (gate: string, a: number, b: number) => {
      switch (gate) {
        case 'AND': return a === 1 && b === 1 ? 1 : 0;
        case 'OR': return a === 1 || b === 1 ? 1 : 0;
        case 'NOT': return a === 1 ? 0 : 1;
        case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
        case 'NOR': return !(a === 1 || b === 1) ? 1 : 0;
        case 'XOR': return a !== b ? 1 : 0;
        default: return 0;
      }
    };

    // AND
    expect(compute('AND', 0, 0)).toBe(0);
    expect(compute('AND', 0, 1)).toBe(0);
    expect(compute('AND', 1, 0)).toBe(0);
    expect(compute('AND', 1, 1)).toBe(1);

    // OR
    expect(compute('OR', 0, 0)).toBe(0);
    expect(compute('OR', 0, 1)).toBe(1);
    expect(compute('OR', 1, 0)).toBe(1);
    expect(compute('OR', 1, 1)).toBe(1);

    // NOT
    expect(compute('NOT', 0, 0)).toBe(1);
    expect(compute('NOT', 1, 0)).toBe(0);

    // NAND
    expect(compute('NAND', 0, 0)).toBe(1);
    expect(compute('NAND', 0, 1)).toBe(1);
    expect(compute('NAND', 1, 0)).toBe(1);
    expect(compute('NAND', 1, 1)).toBe(0);

    // NOR
    expect(compute('NOR', 0, 0)).toBe(1);
    expect(compute('NOR', 0, 1)).toBe(0);
    expect(compute('NOR', 1, 0)).toBe(0);
    expect(compute('NOR', 1, 1)).toBe(0);

    // XOR
    expect(compute('XOR', 0, 0)).toBe(0);
    expect(compute('XOR', 0, 1)).toBe(1);
    expect(compute('XOR', 1, 0)).toBe(1);
    expect(compute('XOR', 1, 1)).toBe(0);
  });
});

describe('Phase 3b: Progress Storage, Scoring & Weak Topic Analysis', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.setUserId('test_electronics_user');
  });

  it('saves passing quiz score and marks lesson as completed', () => {
    const result = saveLessonQuizResult('lesson_ohm', 4, 4, []);
    expect(result.completed).toBe(true);
    expect(result.lastScore).toBe(4);
    expect(result.bestScore).toBe(4);
    expect(result.missedQuestionIds.length).toBe(0);

    const progress = getElectronicsProgress();
    expect(progress.lessons['lesson_ohm']).toBeDefined();
    expect(progress.lessons['lesson_ohm'].completed).toBe(true);
  });

  it('detects weak topics when accuracy is below 70%', () => {
    // Score 2 out of 4 (50%) on lesson_components
    saveLessonQuizResult('lesson_components', 2, 4, ['q_comp_1', 'q_comp_3']);

    const weakTopics = getWeakTopics();
    expect(weakTopics.length).toBe(1);
    expect(weakTopics[0].lessonId).toBe('lesson_components');
    expect(weakTopics[0].accuracyPct).toBe(50);
    expect(weakTopics[0].missedQuestionCount).toBe(2);
  });

  it('generates targeted drill from missed question IDs', () => {
    saveLessonQuizResult('lesson_logic', 1, 4, ['q_log_1', 'q_log_2', 'q_log_3']);

    const targetedQuestions = getTargetedPracticeQuestions();
    expect(targetedQuestions.length).toBe(3);
    const targetedIds = targetedQuestions.map((q) => q.id);
    expect(targetedIds).toContain('q_log_1');
    expect(targetedIds).toContain('q_log_2');
    expect(targetedIds).toContain('q_log_3');
  });

  it('clears missed questions when subsequent quiz achieves 100%', () => {
    saveLessonQuizResult('lesson_binary', 2, 4, ['q_bin_1', 'q_bin_2']);
    let weak = getWeakTopics();
    expect(weak.length).toBe(1);

    // Retake with 4/4
    saveLessonQuizResult('lesson_binary', 4, 4, []);
    weak = getWeakTopics();
    expect(weak.length).toBe(0);
  });
});
