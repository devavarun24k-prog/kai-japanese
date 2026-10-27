// src/features/dictation/eligibility.ts
// Pure eligibility and word selection engine for KAI Dictation Studio
import { DictationVocabItem } from '../../data/vocab/types';
import { FSRSCard } from '../../types';

const SMALL_KANA_REGEX = /^[ゃゅょャュョぁぃぅぇぉァィゥェォ]/;

// Split any kana string into atomic mora / dictation units
export function splitKanaUnits(kana: string): string[] {
  const units: string[] = [];
  const clean = kana.replace(/[\s\u3000,.!?、。！？]/g, '');
  let i = 0;

  while (i < clean.length) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    // Check for digraph / youon combination (e.g., き + ゃ = きゃ, フ + ォ = フォ)
    if (nextChar && SMALL_KANA_REGEX.test(nextChar)) {
      units.push(char + nextChar);
      i += 2;
    } else {
      units.push(char);
      i += 1;
    }
  }

  return units;
}

// Check whether all kana units of a word exist in the learner's learned set
export function isWordEligible(word: DictationVocabItem, learnedSet: Set<string>): boolean {
  if (learnedSet.size === 0) return false;
  const units = splitKanaUnits(word.kana);
  return units.every((unit) => learnedSet.has(unit));
}

// Filter the full vocabulary database to eligible words based on the learned glyph set
export function buildPool(allWords: DictationVocabItem[], learnedSet: Set<string>): DictationVocabItem[] {
  return allWords.filter((w) => isWordEligible(w, learnedSet));
}

export interface ShortageExplanation {
  shortageCount: number;
  missingGlyphs: string[];
  unlockedIfLearned: Record<string, number>; // glyph -> count of words unlocked if this glyph was added
}

// Explain why the available pool is smaller than the target question count
export function explainShortage(
  targetCount: number,
  allWords: DictationVocabItem[],
  learnedSet: Set<string>
): ShortageExplanation {
  const currentPool = buildPool(allWords, learnedSet);
  const shortageCount = Math.max(0, targetCount - currentPool.length);

  // Map how many words are blocked by each missing glyph
  const unlockedIfLearned: Record<string, number> = {};
  const missingGlyphsSet = new Set<string>();

  allWords.forEach((word) => {
    if (!isWordEligible(word, learnedSet)) {
      const units = splitKanaUnits(word.kana);
      const missingForWord = units.filter((u) => !learnedSet.has(u));

      // If a word is missing only 1 single glyph, learning that glyph immediately unlocks this word!
      if (missingForWord.length === 1) {
        const glyph = missingForWord[0];
        unlockedIfLearned[glyph] = (unlockedIfLearned[glyph] || 0) + 1;
      }
      missingForWord.forEach((g) => missingGlyphsSet.add(g));
    }
  });

  return {
    shortageCount,
    missingGlyphs: Array.from(missingGlyphsSet),
    unlockedIfLearned
  };
}

// Select 'count' words from the pool using spaced-repetition priority and retrievability
export function pickWords(
  pool: DictationVocabItem[],
  count: number,
  historyCards: FSRSCard[] = [],
  now: Date = new Date()
): DictationVocabItem[] {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];

  const nowIso = now.toISOString();

  // Create card lookup
  const cardMap = new Map<string, FSRSCard>();
  historyCards.forEach((c) => {
    if (c.item_type === 'vocab') {
      cardMap.set(c.item_id, c);
    }
  });

  // Calculate weight for each item
  const scored = pool.map((item) => {
    const card = cardMap.get(item.id);
    let priorityWeight = 10; // Baseline for new unseen words

    if (card) {
      // Overdue cards get highest urgency
      if (card.due <= nowIso) {
        const overdueDays = Math.max(0, (now.getTime() - new Date(card.due).getTime()) / (1000 * 60 * 60 * 24));
        priorityWeight = 50 + Math.min(50, overdueDays * 10);
      } else {
        // Not due yet: lower priority based on stability
        priorityWeight = Math.max(1, 10 - card.stability);
      }
      // Penalize/boost if lapsed
      if (card.lapses > 0) {
        priorityWeight += card.lapses * 5;
      }
    } else {
      // Fresh new word: medium-high priority to introduce new material
      priorityWeight = 25;
    }

    // Add jitter so items with equal priority shuffle naturally
    const jitter = Math.random() * 2;

    return { item, weight: priorityWeight + jitter };
  });

  // Sort descending by weight
  scored.sort((a, b) => b.weight - a.weight);

  return scored.slice(0, count).map((s) => s.item);
}
