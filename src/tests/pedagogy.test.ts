// src/tests/pedagogy.test.ts
// Unit tests for pedagogical engine, curriculum data integrity, and trilingual mappings
import { describe, it, expect } from 'vitest';
import { HIRAGANA_DATA } from '../data/kanaData';
import { VOCAB_DATA } from '../data/vocabData';
import { GRAMMAR_DATA } from '../data/grammarData';
import { aiService } from '../services/aiService';

describe('Curriculum Data Integrity', () => {
  it('should verify all Hiragana characters have stroke paths and Telugu guides', () => {
    expect(HIRAGANA_DATA.length).toBeGreaterThanOrEqual(15);
    HIRAGANA_DATA.forEach((k) => {
      expect(k.character).toBeDefined();
      expect(k.romaji).toBeDefined();
      expect(k.telugu_phonetic).toBeDefined();
      expect(k.stroke_count).toBeGreaterThan(0);
      expect(k.stroke_paths.length).toBeGreaterThan(0);
      expect(k.telugu_pronunciation_guide).toBeDefined();
    });
  });

  it('should verify all vocabulary entries have English and Telugu translations', () => {
    expect(VOCAB_DATA.length).toBeGreaterThanOrEqual(10);
    VOCAB_DATA.forEach((v) => {
      expect(v.word).toBeDefined();
      expect(v.reading).toBeDefined();
      expect(v.english).toBeDefined();
      expect(v.telugu).toBeDefined();
      expect(v.example_sentences.length).toBeGreaterThan(0);
      expect(v.mnemonic_en).toBeDefined();
    });
  });

  it('should verify grammar patterns include formation rules and common pitfalls', () => {
    expect(GRAMMAR_DATA.length).toBeGreaterThanOrEqual(4);
    GRAMMAR_DATA.forEach((g) => {
      expect(g.title).toBeDefined();
      expect(g.structure).toBeDefined();
      expect(g.explanation_en).toBeDefined();
      expect(g.explanation_te).toBeDefined();
      expect(g.common_mistakes.length).toBeGreaterThan(0);
    });
  });
});

describe('Pedagogical AI Tutor Engine', () => {
  it('should explain particle は vs が with English and Telugu translations', async () => {
    const res = await aiService.generateTutorResponse('What is the difference between wa and ga?', []);
    expect(res.reply).toContain('Topic Marker');
    expect(res.teluguTranslation).toContain('టాపిక్ మార్కర్');
    expect(res.grammarBreakdown).toBeDefined();
    expect(res.providerUsed).toBeDefined();
  });

  it('should explain Te-form verb conjugations', async () => {
    const res = await aiService.generateTutorResponse('How does te-form conjugation work?', []);
    expect(res.reply).toContain('Te-form');
    expect(res.teluguTranslation).toBeDefined();
    expect(res.suggestedReplies?.length).toBeGreaterThan(0);
  });
});
