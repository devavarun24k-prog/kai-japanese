// src/features/electronics/japanese/types.ts
// Contracts for technical Japanese vocabulary and compound kanji breakdowns

export interface KanjiMorpheme {
  kanji: string;
  reading: string;
  meaningEn: string;
}

export interface TechnicalTermItem {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  telugu?: string;
  teluguVerified: boolean; // Flag to maintain zero unverified data integrity
  reviewed: boolean; // Flag to show expert review status
  category: 'semiconductor' | 'circuit_basics' | 'components' | 'manufacturing_qc' | 'equipment';
  plainDefinition: string;
  kanjiBreakdown?: KanjiMorpheme[];
  workplaceExample?: {
    ja: string;
    romaji: string;
    en: string;
  };
}
