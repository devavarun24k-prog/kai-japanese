// src/data/vocab/types.ts
// Strict vocabulary contract for Dictation Studio and Curriculum

export interface VocabExampleSentence {
  ja: string;
  kana: string;
  romaji: string;
  en: string;
  te?: string;
  teVerified: boolean;
}

export interface DictationVocabItem {
  id: string;
  kana: string; // Exact kana phonetic dictation spelling (e.g. "あさ", "がっこう", "コーヒー")
  kanji?: string;
  romaji: string;
  meaningEn: string;
  meaningTe?: string;
  teluguVerified: boolean; // Flag to guarantee zero unverified fake data
  teluguPron?: string;
  englishPron: string;
  level: 'N5' | 'N4' | 'N3';
  tags: string[];
  audioUrl?: string;
  example: VocabExampleSentence;
}
