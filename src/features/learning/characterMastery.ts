// src/features/learning/characterMastery.ts
// Character-level mastery store with non-destructive migration and learned-set derivation
import { GlyphMasteryRecord, GlyphState, KanaUnitGroup } from './types';
import { storageService } from '../../services/storageService';
import { HIRAGANA_DATA } from '../../data/kanaData';

const GLYPH_STORAGE_KEY_BASE = 'glyph_mastery';

// Classify any kana unit into its group and system
export function classifyGlyph(glyph: string): { group: KanaUnitGroup; system: 'hiragana' | 'katakana' | 'symbol' } {
  if (glyph === 'ー') {
    return { group: 'chouon', system: 'symbol' };
  }
  if (glyph === 'っ') {
    return { group: 'sokuon', system: 'hiragana' };
  }
  if (glyph === 'ッ') {
    return { group: 'sokuon', system: 'katakana' };
  }
  if (glyph.length === 2 && 'ゃゅょャュョぁぃぅぇぉァィゥェォ'.includes(glyph[1])) {
    const isKatakana = /[\u30A0-\u30FF]/.test(glyph);
    return { group: 'youon', system: isKatakana ? 'katakana' : 'hiragana' };
  }
  const isKatakana = /[\u30A0-\u30FF]/.test(glyph);
  const dakutenList = 'がぎぐげござじずぜぞだぢづでどばびぶべぼガギグゲゴザジズゼゾダヂヅデドバビブベボ';
  const handakutenList = 'ぱぴぷぺぽパピプペポ';

  if (dakutenList.includes(glyph)) {
    return { group: 'dakuten', system: isKatakana ? 'katakana' : 'hiragana' };
  }
  if (handakutenList.includes(glyph)) {
    return { group: 'handakuten', system: isKatakana ? 'katakana' : 'hiragana' };
  }
  return { group: 'gojuon', system: isKatakana ? 'katakana' : 'hiragana' };
}

// Compute state based on accuracy and exposure
export function computeGlyphState(seen: number, correct: number, manualOverride?: boolean): GlyphState {
  if (manualOverride) return 'mastered';
  if (seen === 0) return 'unseen';
  const accuracy = correct / seen;
  if (seen >= 5 && accuracy >= 0.85) return 'mastered';
  if (seen >= 3 && accuracy >= 0.7) return 'known';
  if (seen >= 3 && accuracy < 0.5) return 'struggling';
  return 'learning';
}

class CharacterMasteryService {
  private getStorageKey(): string {
    const userId = storageService.getUserId() || 'guest';
    return `kai_user_${userId}_${GLYPH_STORAGE_KEY_BASE}`;
  }

  public getGlyphRecords(): Record<string, GlyphMasteryRecord> {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.getStorageKey());
        if (raw) {
          return JSON.parse(raw);
        }
      }
    } catch (e) {
      console.warn('Failed to parse glyph records from storage', e);
    }
    // Return migrated or initialized baseline
    return this.migrateFromExistingProgress();
  }

  public saveGlyphRecords(records: Record<string, GlyphMasteryRecord>): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(records));
      }
    } catch (e) {
      console.warn('Failed to save glyph records to storage', e);
    }
  }

  // Derive active "learned set" of glyphs (either known, mastered, or manually overridden)
  public getLearnedGlyphs(): Set<string> {
    const records = this.getGlyphRecords();
    const learned = new Set<string>();
    Object.values(records).forEach((r) => {
      if (r.manualOverride || r.state === 'mastered' || r.state === 'known') {
        learned.add(r.glyph);
      }
    });
    return learned;
  }

  // Record an attempt for a specific glyph
  public recordGlyphAttempt(glyph: string, isCorrect: boolean, fsrsDue?: string): GlyphMasteryRecord {
    const records = this.getGlyphRecords();
    const existing = records[glyph] || this.createInitialRecord(glyph);

    existing.seenCount += 1;
    if (isCorrect) {
      existing.correctCount += 1;
    } else {
      existing.incorrectCount += 1;
    }
    existing.lastSeen = new Date().toISOString();
    if (fsrsDue) {
      existing.fsrsDue = fsrsDue;
    }
    existing.state = computeGlyphState(existing.seenCount, existing.correctCount, existing.manualOverride);

    records[glyph] = existing;
    this.saveGlyphRecords(records);
    return existing;
  }

  // Manually override a glyph's learned status
  public setGlyphOverride(glyph: string, isLearned: boolean): GlyphMasteryRecord {
    const records = this.getGlyphRecords();
    const existing = records[glyph] || this.createInitialRecord(glyph);
    existing.manualOverride = isLearned;
    existing.state = isLearned ? 'mastered' : computeGlyphState(existing.seenCount, existing.correctCount, false);
    records[glyph] = existing;
    this.saveGlyphRecords(records);
    return existing;
  }

  private createInitialRecord(glyph: string): GlyphMasteryRecord {
    const { group, system } = classifyGlyph(glyph);
    return {
      glyph,
      system,
      group,
      state: 'unseen',
      seenCount: 0,
      correctCount: 0,
      incorrectCount: 0
    };
  }

  // Safely seed and migrate from legacy FSRS cards, kana data, and attempts
  public migrateFromExistingProgress(): Record<string, GlyphMasteryRecord> {
    const records: Record<string, GlyphMasteryRecord> = {};

    // 1. Initialize all baseline Gojuon Hiragana from kanaData so nothing is missing
    HIRAGANA_DATA.forEach((item) => {
      records[item.character] = this.createInitialRecord(item.character);
    });

    // 2. Read existing FSRS cards (non-destructive)
    try {
      const cards = storageService.getCards();
      cards.forEach((card) => {
        if (card.item_type === 'kana') {
          // Resolve kana character: card.item_id might be 'h_a' or 'あ'
          let char = card.item_id;
          const matchedItem = HIRAGANA_DATA.find((k) => k.id === card.item_id);
          if (matchedItem) char = matchedItem.character;

          if (!records[char]) {
            records[char] = this.createInitialRecord(char);
          }
          const rec = records[char];
          rec.seenCount = Math.max(rec.seenCount, card.reps);
          rec.fsrsDue = card.due;
          rec.lastSeen = card.last_review || card.due;

          // If FSRS state is Review (2) and stability >= 1.0, consider known/mastered
          if (card.state === 2 && card.stability >= 2.0) {
            rec.state = 'mastered';
            rec.correctCount = Math.max(rec.correctCount, rec.seenCount);
          } else if (card.state === 2) {
            rec.state = 'known';
            rec.correctCount = Math.max(rec.correctCount, Math.ceil(rec.seenCount * 0.75));
          } else if (card.state === 1) {
            rec.state = 'learning';
          }
        }
      });
    } catch (e) {
      console.warn('Error reading FSRS cards during glyph migration', e);
    }

    // 3. Read learning attempts for kana
    try {
      const attempts = storageService.getAttempts();
      attempts.forEach((att) => {
        if (att.item_type === 'kana') {
          let char = att.item_id;
          const matchedItem = HIRAGANA_DATA.find((k) => k.id === att.item_id);
          if (matchedItem) char = matchedItem.character;

          if (!records[char]) {
            records[char] = this.createInitialRecord(char);
          }
          // Only tally if not already accounted for by FSRS reps
          if (records[char].seenCount === 0) {
            records[char].seenCount += 1;
            if (att.is_correct) records[char].correctCount += 1;
            else records[char].incorrectCount += 1;
            records[char].lastSeen = att.timestamp;
            records[char].state = computeGlyphState(records[char].seenCount, records[char].correctCount);
          }
        }
      });
    } catch (e) {
      console.warn('Error reading attempts during glyph migration', e);
    }

    this.saveGlyphRecords(records);
    return records;
  }
}

export const characterMasteryService = new CharacterMasteryService();
