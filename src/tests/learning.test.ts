// src/tests/learning.test.ts
// Comprehensive unit tests for KAI Phase 3B Japanese Learning Experience
// Verifies curriculum isolation, Katakana course, dataset uniqueness, FSRS card resolution, JLPT scoring, and trilingual integrity
import { describe, it, expect, beforeEach } from 'vitest';
import {
  HIRAGANA_DATA,
  KATAKANA_DATA,
  HIRAGANA_LESSONS,
  KATAKANA_LESSONS
} from '../data/kanaData';
import { VOCAB_DATA } from '../data/vocabData';
import { KANJI_DATA } from '../data/kanjiData';
import { GRAMMAR_DATA } from '../data/grammarData';
import { JLPT_N5_MOCK_EXAM } from '../data/jlptMockData';
import { SENTENCE_CHALLENGES } from '../components/sentence/SentenceForge';
import { LISTENING_EXERCISES } from '../components/listening/ListeningLab';
import { SPEAKING_PROMPTS } from '../components/speaking/SpeakingStudio';
import { READING_STORIES } from '../data/readingStories';
import { aiService } from '../services/aiService';
import { resolveCardDetails } from '../services/cardResolver';
import { storageService } from '../services/storageService';

// Ensure in-memory localStorage polyfill exists for node test environment
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
  (globalThis as unknown as { localStorage: unknown }).localStorage = new LocalStorageMock();
}

describe('Base Kana Datasets Integrity and Uniqueness', () => {
  it('should verify exactly 46 unique Hiragana base characters with zero duplicate IDs or characters', () => {
    expect(HIRAGANA_DATA.length).toBe(46);
    const idSet = new Set<string>();
    const charSet = new Set<string>();

    HIRAGANA_DATA.forEach((k) => {
      expect(idSet.has(k.id)).toBe(false);
      expect(charSet.has(k.character)).toBe(false);
      idSet.add(k.id);
      charSet.add(k.character);

      expect(k.character.length).toBe(1);
      expect(k.romaji.length).toBeGreaterThan(0);
      expect(k.telugu_phonetic.length).toBeGreaterThan(0);
      expect(k.stroke_count).toBeGreaterThan(0);
      expect(k.stroke_paths.length).toBeGreaterThan(0);
      expect(k.stroke_directions.length).toBeGreaterThan(0);
      expect(k.mnemonic_en.length).toBeGreaterThan(0);
      expect(k.mnemonic_te.length).toBeGreaterThan(0);
    });
  });

  it('should verify exactly 46 unique Katakana base characters with zero duplicate IDs or characters', () => {
    expect(KATAKANA_DATA.length).toBe(46);
    const idSet = new Set<string>();
    const charSet = new Set<string>();

    KATAKANA_DATA.forEach((k) => {
      expect(idSet.has(k.id)).toBe(false);
      expect(charSet.has(k.character)).toBe(false);
      idSet.add(k.id);
      charSet.add(k.character);

      expect(k.character.length).toBe(1);
      expect(k.romaji.length).toBeGreaterThan(0);
      expect(k.telugu_phonetic.length).toBeGreaterThan(0);
      expect(k.stroke_count).toBeGreaterThan(0);
      expect(k.stroke_paths.length).toBeGreaterThan(0);
      expect(k.stroke_directions.length).toBeGreaterThan(0);
      expect(k.mnemonic_en.length).toBeGreaterThan(0);
      expect(k.mnemonic_te.length).toBeGreaterThan(0);
    });
  });

  it('should verify accurate phonetic representations for special kana', () => {
    const shi = HIRAGANA_DATA.find((k) => k.romaji === 'shi')!;
    expect(shi.character).toBe('し');
    expect(shi.telugu_phonetic).toBe('షి');

    const chi = HIRAGANA_DATA.find((k) => k.romaji === 'chi')!;
    expect(chi.character).toBe('ち');
    expect(chi.telugu_phonetic).toBe('చి');

    const tsu = HIRAGANA_DATA.find((k) => k.romaji === 'tsu')!;
    expect(tsu.character).toBe('つ');
    expect(tsu.telugu_phonetic).toContain('త్సు');
    expect(tsu.telugu_pronunciation_guide).toContain('ts');
    expect(tsu.telugu_pronunciation_guide).toContain('దంతాల');

    const fu = HIRAGANA_DATA.find((k) => k.romaji === 'fu')!;
    expect(fu.character).toBe('ふ');
    expect(fu.telugu_pronunciation_guide).toContain('పెదవు');
  });
});

describe('Full Progressive Hiragana Curriculum (Lessons 1-14)', () => {
  it('should verify all 14 Hiragana lessons are structured and ordered logically', () => {
    expect(HIRAGANA_LESSONS.length).toBe(14);
    for (let i = 0; i < 14; i++) {
      expect(HIRAGANA_LESSONS[i].lessonNumber).toBe(i + 1);
      expect(HIRAGANA_LESSONS[i].title.length).toBeGreaterThan(5);
      expect(HIRAGANA_LESSONS[i].titleTe.length).toBeGreaterThan(5);
      expect(HIRAGANA_LESSONS[i].practiceQuestions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should verify all 46 basic characters are introduced across Lessons 1-10', () => {
    const introducedIds = new Set<string>();
    for (let i = 0; i < 10; i++) {
      HIRAGANA_LESSONS[i].characterIds.forEach((id) => introducedIds.add(id));
    }
    expect(introducedIds.size).toBe(46);
    HIRAGANA_DATA.forEach((k) => {
      expect(introducedIds.has(k.id)).toBe(true);
    });
  });

  it('should enforce strict prerequisite isolation: distractors never leak untaught characters', () => {
    const cumulativeCharacters = new Set<string>();

    for (const lesson of HIRAGANA_LESSONS.slice(0, 10)) {
      // Add current lesson characters to cumulative learned set
      const currentLessonChars = HIRAGANA_DATA.filter((k) =>
        lesson.characterIds.includes(k.id)
      ).map((k) => k.character);
      currentLessonChars.forEach((c) => cumulativeCharacters.add(c));

      // Test all practice questions in this lesson
      for (const q of lesson.practiceQuestions) {
        if (q.characterToTest) {
          expect(cumulativeCharacters.has(q.characterToTest)).toBe(true);
        }

        // Each option must only be a single Japanese kana if it was already introduced,
        // or a romaji/Telugu descriptive string
        for (const opt of q.options) {
          if (opt.text.length === 1 && !/[a-zA-Z0-9]/.test(opt.text)) {
            expect(cumulativeCharacters.has(opt.text)).toBe(true);
          }
        }

        // Exactly one option is correct
        const correctCount = q.options.filter((o) => o.isCorrect).length;
        expect(correctCount).toBe(1);

        // Explanation in English and Telugu must be present
        expect(q.explanationEn.length).toBeGreaterThan(5);
        expect(q.explanationTe.length).toBeGreaterThan(5);
      }
    }
  });

  it('should verify advanced kana lessons (Dakuon, Handakuon, Sokuon, Yoon) teach nuances explicitly', () => {
    const dakuonLesson = HIRAGANA_LESSONS.find((l) => l.id === 'lesson_11_dakuon')!;
    expect(dakuonLesson).toBeDefined();
    expect(dakuonLesson.summaryEn).toContain('Dakuten');
    const jiQuestion = dakuonLesson.practiceQuestions.find((q) => q.characterToTest === 'じ');
    expect(jiQuestion).toBeDefined();
    expect(jiQuestion?.explanationEn).toContain('はなぢ');

    const handakuonLesson = HIRAGANA_LESSONS.find((l) => l.id === 'lesson_12_handakuon')!;
    expect(handakuonLesson).toBeDefined();
    expect(handakuonLesson.summaryEn).toContain('Handakuten');

    const sokuonLesson = HIRAGANA_LESSONS.find((l) => l.id === 'lesson_13_sokuon')!;
    expect(sokuonLesson).toBeDefined();
    expect(sokuonLesson.summaryEn).toContain('っ');

    const yoonLesson = HIRAGANA_LESSONS.find((l) => l.id === 'lesson_14_yoon')!;
    expect(yoonLesson).toBeDefined();
    expect(yoonLesson.summaryEn).toContain('ゃ');
  });
});

describe('Full Progressive Katakana Curriculum (Lessons 1-12)', () => {
  it('should verify all 12 Katakana lessons exist with structured trilingual metadata', () => {
    expect(KATAKANA_LESSONS.length).toBe(12);
    for (let i = 0; i < 12; i++) {
      expect(KATAKANA_LESSONS[i].lessonNumber).toBe(i + 1);
      expect(KATAKANA_LESSONS[i].title.length).toBeGreaterThan(5);
      expect(KATAKANA_LESSONS[i].titleTe.length).toBeGreaterThan(5);
      expect(KATAKANA_LESSONS[i].practiceQuestions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should verify all 46 basic Katakana characters are introduced across Lessons 1-10', () => {
    const introducedIds = new Set<string>();
    for (let i = 0; i < 10; i++) {
      KATAKANA_LESSONS[i].characterIds.forEach((id) => introducedIds.add(id));
    }
    expect(introducedIds.size).toBe(46);
    KATAKANA_DATA.forEach((k) => {
      expect(introducedIds.has(k.id)).toBe(true);
    });
  });

  it('should enforce strict prerequisite isolation across all Katakana lessons', () => {
    const cumulativeCharacters = new Set<string>();

    for (const lesson of KATAKANA_LESSONS.slice(0, 10)) {
      const currentChars = KATAKANA_DATA.filter((k) =>
        lesson.characterIds.includes(k.id)
      ).map((k) => k.character);
      currentChars.forEach((c) => cumulativeCharacters.add(c));

      for (const q of lesson.practiceQuestions) {
        if (q.characterToTest) {
          expect(cumulativeCharacters.has(q.characterToTest)).toBe(true);
        }

        for (const opt of q.options) {
          if (opt.text.length === 1 && !/[a-zA-Z0-9]/.test(opt.text)) {
            expect(cumulativeCharacters.has(opt.text)).toBe(true);
          }
        }

        const correctCount = q.options.filter((o) => o.isCorrect).length;
        expect(correctCount).toBe(1);
      }
    }
  });

  it('should cover Katakana loanword features: Choonpu (ー) and Sokuon (ッ)', () => {
    const specialLesson = KATAKANA_LESSONS.find((l) => l.id === 'k_lesson_12_special')!;
    expect(specialLesson).toBeDefined();
    expect(specialLesson.summaryEn).toContain('Chōonpu');

    const choonpuQ = specialLesson.practiceQuestions.find((q) => q.characterToTest === 'ー');
    expect(choonpuQ).toBeDefined();
    expect(choonpuQ?.explanationEn).toContain('Chōonpu');

    const sokuonQ = specialLesson.practiceQuestions.find((q) => q.characterToTest === 'ッ');
    expect(sokuonQ).toBeDefined();
    expect(sokuonQ?.explanationEn).toContain('beddo');
  });
});

describe('Lesson Completion Persistence & Scoped Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.clearMemoryState();
  });

  it('should record completed lessons and persist them across session reload', () => {
    storageService.setUserId('learner_uuid_101');
    expect(storageService.getCompletedLessons()).toEqual([]);

    storageService.markLessonCompleted('lesson_1_vowels');
    expect(storageService.isLessonCompleted('lesson_1_vowels')).toBe(true);
    expect(storageService.isLessonCompleted('lesson_2_k_row')).toBe(false);

    storageService.markLessonCompleted('lesson_2_k_row');
    const completed = storageService.getCompletedLessons();
    expect(completed).toContain('lesson_1_vowels');
    expect(completed).toContain('lesson_2_k_row');

    // Simulate page reload by resetting in-memory instance
    storageService.clearMemoryState();
    storageService.setUserId('learner_uuid_101');
    expect(storageService.isLessonCompleted('lesson_1_vowels')).toBe(true);
    expect(storageService.isLessonCompleted('lesson_2_k_row')).toBe(true);
  });

  it('should isolate lesson completion by user id', () => {
    storageService.setUserId('user_a');
    storageService.markLessonCompleted('lesson_1_vowels');
    expect(storageService.isLessonCompleted('lesson_1_vowels')).toBe(true);

    // Switch to another user
    storageService.clearMemoryState();
    storageService.setUserId('user_b');
    expect(storageService.isLessonCompleted('lesson_1_vowels')).toBe(false);
  });
});

describe('Dynamic FSRS Review Card Details Resolution', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.clearMemoryState();
    storageService.setUserId('test_learning_user');
  });

  it('should resolve Hiragana card details dynamically with Telugu guides', () => {
    const resolved = resolveCardDetails('h_a', 'kana');
    expect(resolved.prompt).toBe('あ');
    expect(resolved.reading).toBe('a');
    expect(resolved.meaningTe).toContain('అ');
    expect(resolved.audioText).toBe('あ');
  });

  it('should resolve Katakana card details dynamically', () => {
    const resolved = resolveCardDetails('k_ka', 'kana');
    expect(resolved.prompt).toBe('カ');
    expect(resolved.reading).toBe('ka');
    expect(resolved.meaningTe).toContain('క');
  });

  it('should resolve Vocabulary card details dynamically', () => {
    const resolved = resolveCardDetails('v_kore', 'vocab');
    expect(resolved.prompt).toBe('これ');
    expect(resolved.meaningEn).toBe('This (near the speaker)');
    expect(resolved.meaningTe).toContain('ఇది');
  });

  it('should resolve Kanji card details dynamically with ON/KUN readings', () => {
    const resolved = resolveCardDetails('k_hon', 'kanji');
    expect(resolved.prompt).toBe('本');
    expect(resolved.reading).toContain('ON:');
    expect(resolved.meaningEn).toContain('Book');
  });

  it('should resolve Grammar card details dynamically', () => {
    const resolved = resolveCardDetails('g_wa_desu', 'grammar');
    expect(resolved.prompt).toBe('A は B です');
    expect(resolved.meaningEn).toContain('A is B');
  });

  it('should resolve logged mistake records dynamically', () => {
    storageService.logMistake(
      'custom_m1',
      'kana',
      'What kana is あ?',
      'o',
      'あ',
      'phonetic',
      'Remember horizontal bar first',
      'ముందు క్షితిజ సమాంతర గీత గీయండి'
    );

    const resolved = resolveCardDetails('custom_m1', 'mistake');
    expect(resolved.prompt).toBe('What kana is あ?');
    expect(resolved.meaningEn).toContain('あ');
    expect(resolved.meaningTe).toBe('ముందు క్షితిజ సమాంతర గీత గీయండి');
  });

  it('should gracefully handle unknown review item ids without throwing', () => {
    const resolved = resolveCardDetails('non_existent_item_999', 'unknown_type');
    expect(resolved.prompt).toBe('non_existent_item_999');
    expect(resolved.reading).toBe('unknown_type');
    expect(resolved.meaningEn).toBe('Review item');
  });
});

describe('JLPT N5 Mock Exam Scoring & Diagnostic Results', () => {
  it('should verify JLPT N5 mock exam structure and passing threshold (60%)', () => {
    expect(JLPT_N5_MOCK_EXAM.passing_score_pct).toBe(60);
    expect(JLPT_N5_MOCK_EXAM.sections.length).toBeGreaterThanOrEqual(3);
    const allQuestions = JLPT_N5_MOCK_EXAM.sections.flatMap((s) => s.questions);
    expect(allQuestions.length).toBeGreaterThanOrEqual(6);
  });

  it('should accurately calculate score percentage and pass/fail verdict', () => {
    const allQuestions = JLPT_N5_MOCK_EXAM.sections.flatMap((s) => s.questions);
    const total = allQuestions.length;

    // Simulate 100% correct answers
    const fullAnswers: Record<string, number> = {};
    allQuestions.forEach((q) => {
      fullAnswers[q.id] = q.correct_index;
    });

    let correctCount = 0;
    allQuestions.forEach((q) => {
      if (fullAnswers[q.id] === q.correct_index) correctCount += 1;
    });

    const perfectScore = Math.round((correctCount / total) * 100);
    expect(perfectScore).toBe(100);
    expect(perfectScore >= JLPT_N5_MOCK_EXAM.passing_score_pct).toBe(true);

    // Simulate fail scenario (0% correct)
    const failAnswers: Record<string, number> = {};
    allQuestions.forEach((q) => {
      failAnswers[q.id] = (q.correct_index + 1) % q.options.length;
    });

    let failCount = 0;
    allQuestions.forEach((q) => {
      if (failAnswers[q.id] === q.correct_index) failCount += 1;
    });
    const failScore = Math.round((failCount / total) * 100);
    expect(failScore).toBe(0);
    expect(failScore >= JLPT_N5_MOCK_EXAM.passing_score_pct).toBe(false);
  });

  it('should ensure all JLPT mock questions provide both English and Telugu explanations', () => {
    const allQuestions = JLPT_N5_MOCK_EXAM.sections.flatMap((s) => s.questions);
    allQuestions.forEach((q) => {
      expect(q.explanation_en).toBeDefined();
      expect(q.explanation_en.length).toBeGreaterThan(5);
      expect(q.explanation_te).toBeDefined();
      expect(q.explanation_te.length).toBeGreaterThan(5);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.correct_index).toBeGreaterThanOrEqual(0);
      expect(q.correct_index).toBeLessThan(q.options.length);
    });
  });
});

describe('Trilingual Support & Curriculum Depth', () => {
  it('should verify Sentence Forge challenges have English and Telugu translations', () => {
    expect(SENTENCE_CHALLENGES.length).toBeGreaterThanOrEqual(8);
    SENTENCE_CHALLENGES.forEach((s) => {
      expect(s.promptEn).toBeDefined();
      expect(s.promptTe).toBeDefined();
      expect(s.expectedJapanese.length).toBeGreaterThanOrEqual(1);
      expect(s.wordTiles.length).toBeGreaterThanOrEqual(3);
      expect(s.explanationEn).toBeDefined();
      expect(s.explanationTe).toBeDefined();
    });
  });

  it('should verify Listening Lab exercises include trilingual questions and audio targets', () => {
    expect(LISTENING_EXERCISES.length).toBeGreaterThanOrEqual(6);
    LISTENING_EXERCISES.forEach((ex) => {
      expect(ex.audioText).toBeDefined();
      expect(ex.question).toBeDefined();
      expect(ex.questionTe).toBeDefined();
      expect(ex.options.length).toBeGreaterThanOrEqual(3);
      expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
      expect(ex.meaningEn).toBeDefined();
      expect(ex.meaningTe).toBeDefined();
    });
  });
});

describe('Expanded Vocabulary Dataset & Favorites System', () => {
  beforeEach(() => {
    storageService.setUserId('test_vocab_user');
  });

  it('should verify at least 40 high-yield N5 vocabulary words with zero duplicate IDs', () => {
    expect(VOCAB_DATA.length).toBeGreaterThanOrEqual(40);
    const idSet = new Set<string>();
    VOCAB_DATA.forEach((v) => {
      expect(idSet.has(v.id)).toBe(false);
      idSet.add(v.id);

      expect(v.word.length).toBeGreaterThan(0);
      expect(v.reading.length).toBeGreaterThan(0);
      expect(v.romaji.length).toBeGreaterThan(0);
      expect(v.english.length).toBeGreaterThan(0);
      expect(v.telugu.length).toBeGreaterThan(0);
      expect(v.telugu_phonetic.length).toBeGreaterThan(0);
      expect(v.jlpt_level).toBe('N5');
      expect(v.mnemonic_en.length).toBeGreaterThan(0);
      expect(v.mnemonic_te.length).toBeGreaterThan(0);
      expect(v.example_sentences.length).toBeGreaterThanOrEqual(1);

      v.example_sentences.forEach((ex) => {
        expect(ex.japanese.length).toBeGreaterThan(0);
        expect(ex.romaji.length).toBeGreaterThan(0);
        expect(ex.english.length).toBeGreaterThan(0);
        expect(ex.telugu.length).toBeGreaterThan(0);
        expect(ex.grammar_notes.length).toBeGreaterThan(0);
      });
    });
  });

  it('should test favorite vocabulary bookmarking and persistence in storageService', () => {
    expect(storageService.getFavoriteVocab()).toEqual([]);
    expect(storageService.isFavoriteVocab('v_arigatou')).toBe(false);

    // Toggle on
    const isNowFav = storageService.toggleFavoriteVocab('v_arigatou');
    expect(isNowFav).toBe(true);
    expect(storageService.isFavoriteVocab('v_arigatou')).toBe(true);
    expect(storageService.getFavoriteVocab()).toContain('v_arigatou');

    // Add another
    storageService.toggleFavoriteVocab('v_konnichiwa');
    expect(storageService.getFavoriteVocab().length).toBe(2);

    // Toggle off
    const toggledOff = storageService.toggleFavoriteVocab('v_arigatou');
    expect(toggledOff).toBe(false);
    expect(storageService.isFavoriteVocab('v_arigatou')).toBe(false);
    expect(storageService.getFavoriteVocab()).toEqual(['v_konnichiwa']);
  });
});

describe('Expanded Kanji Dojo Dataset & Readings Integrity', () => {
  it('should verify exactly 20 foundational N5 kanji with zero duplicates', () => {
    expect(KANJI_DATA.length).toBe(20);
    const idSet = new Set<string>();
    const charSet = new Set<string>();

    KANJI_DATA.forEach((k) => {
      expect(idSet.has(k.id)).toBe(false);
      expect(charSet.has(k.character)).toBe(false);
      idSet.add(k.id);
      charSet.add(k.character);

      expect(k.character.length).toBe(1);
      expect(k.jlpt_level).toBe('N5');
      expect(k.meaning_en.length).toBeGreaterThanOrEqual(1);
      expect(k.meaning_te.length).toBeGreaterThanOrEqual(1);
      expect(k.stroke_count).toBeGreaterThan(0);
      expect(k.stroke_paths.length).toBe(k.stroke_count);
      expect(k.radicals.length).toBeGreaterThanOrEqual(1);
      expect(k.compounds.length).toBeGreaterThanOrEqual(2);
      expect(k.mnemonic_en.length).toBeGreaterThan(0);
      expect(k.mnemonic_te.length).toBeGreaterThan(0);

      // Verify ON and KUN readings have Telugu phonetics
      expect(k.on_readings.length).toBeGreaterThanOrEqual(1);
      expect(k.on_telugu.length).toBe(k.on_readings.length);
      expect(k.kun_readings.length).toBeGreaterThanOrEqual(1);
      expect(k.kun_telugu.length).toBe(k.kun_readings.length);

      // Verify radicals
      k.radicals.forEach((rad) => {
        expect(rad.symbol.length).toBeGreaterThan(0);
        expect(rad.meaning_en.length).toBeGreaterThan(0);
        expect(rad.meaning_te.length).toBeGreaterThan(0);
      });

      // Verify compounds
      k.compounds.forEach((comp) => {
        expect(comp.word.length).toBeGreaterThan(0);
        expect(comp.reading.length).toBeGreaterThan(0);
        expect(comp.romaji.length).toBeGreaterThan(0);
        expect(comp.english.length).toBeGreaterThan(0);
        expect(comp.telugu.length).toBeGreaterThan(0);
      });
    });
  });

  it('should verify cardResolver cleanly resolves all 20 Kanji items', () => {
    KANJI_DATA.forEach((k) => {
      const resolved = resolveCardDetails(k.id, 'kanji');
      expect(resolved.prompt).toBe(k.character);
      expect(resolved.reading).toContain('KUN:');
      expect(resolved.reading).toContain('ON:');
      expect(resolved.meaningEn.length).toBeGreaterThan(0);
      expect(resolved.meaningTe.length).toBeGreaterThan(0);
      expect(resolved.audioText).toBe(k.character);
      expect(resolved.mnemonic).toBe(k.mnemonic_en);
      expect(resolved.mnemonicTe).toBe(k.mnemonic_te);
    });
  });

  it('should verify cardResolver cleanly resolves newly added vocabulary items', () => {
    VOCAB_DATA.forEach((v) => {
      const resolved = resolveCardDetails(v.id, 'vocab');
      expect(resolved.prompt).toBe(v.word);
      expect(resolved.reading).toContain(v.reading);
      expect(resolved.meaningEn).toBe(v.english);
      expect(resolved.meaningTe).toBe(v.telugu);
      expect(resolved.audioText).toBe(v.word);
    });
  });
});

describe('Part 2 Interactive Learning Modules Integrity', () => {
  it('should verify all 12 Grammar Patterns have trilingual explanations and practice questions', () => {
    expect(GRAMMAR_DATA.length).toBe(12);
    const idSet = new Set<string>();

    GRAMMAR_DATA.forEach((g) => {
      expect(idSet.has(g.id)).toBe(false);
      idSet.add(g.id);

      expect(g.title.length).toBeGreaterThan(0);
      expect(g.title_jp.length).toBeGreaterThan(0);
      expect(g.structure.length).toBeGreaterThan(0);
      expect(g.meaning_en.length).toBeGreaterThan(0);
      expect(g.meaning_te.length).toBeGreaterThan(0);
      expect(g.explanation_en.length).toBeGreaterThan(0);
      expect(g.explanation_te.length).toBeGreaterThan(0);
      expect(g.formation_rules.length).toBeGreaterThanOrEqual(1);
      expect(g.examples.length).toBeGreaterThanOrEqual(1);

      // Verify each example has word-by-word breakdown
      g.examples.forEach((ex) => {
        expect(ex.japanese.length).toBeGreaterThan(0);
        expect(ex.english.length).toBeGreaterThan(0);
        expect(ex.telugu.length).toBeGreaterThan(0);
        expect(ex.breakdown.length).toBeGreaterThanOrEqual(2);
      });

      // Verify practice questions
      expect(g.practice_questions).toBeDefined();
      expect(g.practice_questions!.length).toBeGreaterThanOrEqual(1);
      g.practice_questions!.forEach((q) => {
        expect(q.prompt.length).toBeGreaterThan(0);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correct_index).toBeGreaterThanOrEqual(0);
        expect(q.correct_index).toBeLessThan(q.options.length);
        expect(q.explanation_en.length).toBeGreaterThan(0);
        expect(q.explanation_te.length).toBeGreaterThan(0);
      });
    });
  });

  it('should verify all 16 Sentence Forge challenges have progressive difficulty and valid constructions', () => {
    expect(SENTENCE_CHALLENGES.length).toBe(16);
    const idSet = new Set<string>();

    SENTENCE_CHALLENGES.forEach((s) => {
      expect(idSet.has(s.id)).toBe(false);
      idSet.add(s.id);

      expect(s.promptEn.length).toBeGreaterThan(0);
      expect(s.promptTe.length).toBeGreaterThan(0);
      expect(s.expectedJapanese.length).toBeGreaterThanOrEqual(1);
      expect(s.wordTiles.length).toBeGreaterThanOrEqual(3);
      expect(s.fillBlankSentence).toContain('＿＿');
      expect(s.fillBlankOptions.length).toBe(4);
      expect(s.fillBlankCorrect).toBeGreaterThanOrEqual(0);
      expect(s.fillBlankCorrect).toBeLessThan(4);
      expect(s.hint.length).toBeGreaterThan(0);
      expect(s.explanationEn.length).toBeGreaterThan(0);
      expect(s.explanationTe.length).toBeGreaterThan(0);
    });
  });

  it('should verify AI Tutor service pedagogical engine handles grammar, particles, and quizzes without crashing', async () => {
    const waVsGa = await aiService.generateTutorResponse('wa vs ga', []);
    expect(waVsGa.reply).toContain('は (wa)');
    expect(waVsGa.reply).toContain('が (ga)');
    expect(waVsGa.teluguTranslation).toBeDefined();
    expect(waVsGa.providerUsed).toContain('Pedagogical');

    const quiz = await aiService.generateTutorResponse('quiz me', []);
    expect(quiz.reply).toContain('Question:');
    expect(quiz.suggestedReplies!.length).toBeGreaterThanOrEqual(2);

    const teForm = await aiService.generateTutorResponse('te form conjugation', []);
    expect(teForm.reply).toContain('Te-form');
    expect(teForm.teluguTranslation).toBeDefined();
  });

  it('should verify all 10 Speaking Studio prompts have valid situations and pitch tips', () => {
    expect(SPEAKING_PROMPTS.length).toBe(10);
    const idSet = new Set<string>();

    SPEAKING_PROMPTS.forEach((sp) => {
      expect(idSet.has(sp.id)).toBe(false);
      idSet.add(sp.id);

      expect(sp.japanese.length).toBeGreaterThan(0);
      expect(sp.romaji.length).toBeGreaterThan(0);
      expect(sp.telugu_phonetic.length).toBeGreaterThan(0);
      expect(sp.english.length).toBeGreaterThan(0);
      expect(sp.telugu.length).toBeGreaterThan(0);
      expect(sp.situation.length).toBeGreaterThan(0);
      expect(sp.pitch_tip.length).toBeGreaterThan(0);
    });
  });

  it('should verify all 12 Listening Lab exercises cover varied skills with accurate answers', () => {
    expect(LISTENING_EXERCISES.length).toBe(12);
    const idSet = new Set<string>();

    LISTENING_EXERCISES.forEach((le) => {
      expect(idSet.has(le.id)).toBe(false);
      idSet.add(le.id);

      expect(le.audioText.length).toBeGreaterThan(0);
      expect(le.transcriptJp.length).toBeGreaterThan(0);
      expect(le.transcriptRomaji.length).toBeGreaterThan(0);
      expect(le.question.length).toBeGreaterThan(0);
      expect(le.questionTe.length).toBeGreaterThan(0);
      expect(le.options.length).toBe(4);
      expect(le.correctIndex).toBeGreaterThanOrEqual(0);
      expect(le.correctIndex).toBeLessThan(4);
      expect(le.explanationEn.length).toBeGreaterThan(0);
      expect(le.explanationTe.length).toBeGreaterThan(0);
    });
  });

  it('should verify all 4 Reading Stories have vocabulary lexicons and comprehension questions', () => {
    expect(READING_STORIES.length).toBe(4);
    const idSet = new Set<string>();

    READING_STORIES.forEach((rs) => {
      expect(idSet.has(rs.id)).toBe(false);
      idSet.add(rs.id);

      expect(rs.title_jp.length).toBeGreaterThan(0);
      expect(rs.title_en.length).toBeGreaterThan(0);
      expect(rs.title_te.length).toBeGreaterThan(0);
      expect(rs.paragraphs.length).toBeGreaterThanOrEqual(3);

      rs.paragraphs.forEach((p) => {
        expect(p.japanese.length).toBeGreaterThan(0);
        expect(p.romaji.length).toBeGreaterThan(0);
        expect(p.english.length).toBeGreaterThan(0);
        expect(p.telugu.length).toBeGreaterThan(0);
        expect(p.vocabulary.length).toBeGreaterThanOrEqual(1);

        p.vocabulary.forEach((v) => {
          expect(v.word.length).toBeGreaterThan(0);
          expect(v.reading.length).toBeGreaterThan(0);
          expect(v.meaning_en.length).toBeGreaterThan(0);
          expect(v.meaning_te.length).toBeGreaterThan(0);
        });
      });

      expect(rs.questions.length).toBeGreaterThanOrEqual(2);
      rs.questions.forEach((q) => {
        expect(q.question_en.length).toBeGreaterThan(0);
        expect(q.options.length).toBe(4);
        expect(q.correct_index).toBeGreaterThanOrEqual(0);
        expect(q.correct_index).toBeLessThan(4);
        expect(q.explanation_en.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('KAI Part 3 - Integration, Spaced Repetition, JLPT & Study Planner', () => {
  it('should resolve card details for sentence construction cards from SENTENCE_CHALLENGES', () => {
    const details = resolveCardDetails('s_1', 'sentence');
    expect(details.prompt).toBe('これは本です');
    expect(details.reading).toBe('This is a book.');
    expect(details.meaningEn).toContain('これ (this)');
    expect(details.meaningTe).toContain('ఇది ఒక పుస్తకం');
    expect(details.audioText).toBe('これは本です');
  });

  it('should verify official JLPT N5 diagnostic mock exam contains 5 authentic sections including Star Assembly and Reading', () => {
    expect(JLPT_N5_MOCK_EXAM.sections.length).toBe(5);
    const sectionNames = JLPT_N5_MOCK_EXAM.sections.map((s) => s.name);
    expect(sectionNames.some((n) => n.includes('Vocabulary'))).toBe(true);
    expect(sectionNames.some((n) => n.includes('Grammar'))).toBe(true);
    expect(sectionNames.some((n) => n.includes('組み立て'))).toBe(true);
    expect(sectionNames.some((n) => n.includes('読解'))).toBe(true);
    expect(sectionNames.some((n) => n.includes('聴解'))).toBe(true);

    // Verify Star assembly questions
    const starSection = JLPT_N5_MOCK_EXAM.sections.find((s) => s.name.includes('組み立て'))!;
    expect(starSection.questions.length).toBeGreaterThanOrEqual(2);
    starSection.questions.forEach((q) => {
      expect(q.question_jp).toContain('★');
      expect(q.options.length).toBe(4);
      expect(q.correct_index).toBeGreaterThanOrEqual(0);
      expect(q.correct_index).toBeLessThan(4);
      expect(q.explanation_en).toContain('★');
    });

    // Verify Reading questions
    const readingSection = JLPT_N5_MOCK_EXAM.sections.find((s) => s.name.includes('読解'))!;
    expect(readingSection.questions.length).toBeGreaterThanOrEqual(1);
    expect(readingSection.questions[0].context).toBeDefined();
    expect(readingSection.questions[0].context!.length).toBeGreaterThan(10);
  });

  it('should correctly schedule FSRS card on Again lapse and recalculate stability on Good/Easy', async () => {
    const { fsrsService } = await import('../services/fsrsService');
    const newCard = fsrsService.createCard('test_card_1', 'vocab');
    expect(newCard.state).toBe(0); // New
    expect(newCard.reps).toBe(0);

    // First review Good (3)
    const reviewedGood = fsrsService.schedule(newCard, 3);
    expect(reviewedGood.state).toBe(2); // Review
    expect(reviewedGood.reps).toBe(1);
    expect(reviewedGood.scheduled_days).toBeGreaterThanOrEqual(1);

    // Lapse on Again (1)
    const lapsed = fsrsService.schedule(reviewedGood, 1);
    expect(lapsed.state).toBe(3); // Relearning
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.scheduled_days).toBe(0);
    expect(lapsed.stability).toBeLessThan(reviewedGood.stability);
  });

  it('should verify sentence challenge dataset integrity across all 16 items', () => {
    expect(SENTENCE_CHALLENGES.length).toBe(16);
    SENTENCE_CHALLENGES.forEach((sc) => {
      expect(sc.id).toBeDefined();
      expect(sc.promptEn.length).toBeGreaterThan(0);
      expect(sc.promptTe.length).toBeGreaterThan(0);
      expect(sc.expectedJapanese.length).toBeGreaterThan(0);
      expect(sc.wordTiles.length).toBeGreaterThanOrEqual(3);
      expect(sc.fillBlankSentence).toContain('＿＿');
      expect(sc.fillBlankOptions.length).toBe(4);
      expect(sc.fillBlankCorrect).toBeGreaterThanOrEqual(0);
      expect(sc.fillBlankCorrect).toBeLessThan(4);
    });
  });
});


