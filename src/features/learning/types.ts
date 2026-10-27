// src/features/learning/types.ts
// Character-level mastery types distinct from vocabulary recognition

export type GlyphState = 'unseen' | 'learning' | 'known' | 'mastered' | 'struggling';

export type KanaUnitGroup =
  | 'gojuon'      // Basic 46 (あ..ん)
  | 'dakuten'     // Voiced (が, ざ, だ, ば)
  | 'handakuten'  // Semi-voiced (ぱ, ぴ, ぷ, ぺ, ぽ)
  | 'youon'       // Contracted / digraphs (きゃ, しゅ, ちょ, etc.)
  | 'sokuon'      // Small tsu / geminate stop (っ, ッ)
  | 'chouon';     // Prolonged sound mark (ー)

export interface GlyphMasteryRecord {
  glyph: string; // The atomic character or mora digraph e.g. "あ", "が", "きゃ", "っ", "ー"
  system: 'hiragana' | 'katakana' | 'symbol';
  group: KanaUnitGroup;
  state: GlyphState;
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
  lastSeen?: string; // ISO date
  fsrsDue?: string;  // ISO date if tracked via FSRS
  manualOverride?: boolean; // If user manually marked it learned/known
}

export interface LearnedGlyphSet {
  userId: string;
  glyphs: Record<string, GlyphMasteryRecord>;
  updatedAt: string;
}
