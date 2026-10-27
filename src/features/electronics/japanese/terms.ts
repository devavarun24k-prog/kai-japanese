// src/features/electronics/japanese/terms.ts
// Re-export aggregated 80 electronics terms and lookup helpers
import { TechnicalTermItem } from './types';
import { ELECTRONICS_TERMS_PART_1 } from './termsPart1';
import { ELECTRONICS_TERMS_PART_2 } from './termsPart2';

export const ELECTRONICS_TERMS: TechnicalTermItem[] = [
  ...ELECTRONICS_TERMS_PART_1,
  ...ELECTRONICS_TERMS_PART_2
];

export function getTermById(id: string): TechnicalTermItem | undefined {
  return ELECTRONICS_TERMS.find((t) => t.id === id);
}

export function getTermsByCategory(category: TechnicalTermItem['category']): TechnicalTermItem[] {
  return ELECTRONICS_TERMS.filter((t) => t.category === category);
}

export function searchElectronicsTerms(query: string): TechnicalTermItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return ELECTRONICS_TERMS;
  return ELECTRONICS_TERMS.filter((t) =>
    t.kanji.toLowerCase().includes(q) ||
    t.kana.toLowerCase().includes(q) ||
    t.romaji.toLowerCase().includes(q) ||
    t.english.toLowerCase().includes(q) ||
    (t.telugu && t.telugu.toLowerCase().includes(q)) ||
    t.plainDefinition.toLowerCase().includes(q)
  );
}
