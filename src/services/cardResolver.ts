// src/services/cardResolver.ts
// Resolves item details from Kana, Vocab, Kanji, Grammar datasets, and logged mistakes
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { VOCAB_DATA } from '../data/vocabData';
import { KANJI_DATA } from '../data/kanjiData';
import { GRAMMAR_DATA } from '../data/grammarData';
import { SENTENCE_CHALLENGES } from '../components/sentence/SentenceForge';
import { storageService } from './storageService';

export interface ResolvedCardDetails {
  prompt: string;
  reading: string;
  meaningEn: string;
  meaningTe: string;
  audioText: string;
  mnemonic?: string;
  mnemonicTe?: string;
}

export function resolveCardDetails(itemId: string, itemType: string): ResolvedCardDetails {
  if (itemType === 'kana') {
    const found =
      HIRAGANA_DATA.find((k) => k.id === itemId) ||
      KATAKANA_DATA.find((k) => k.id === itemId);
    if (found) {
      return {
        prompt: found.character,
        reading: found.romaji,
        meaningEn: `Kana sound: "${found.romaji}" (${found.stroke_count} strokes)`,
        meaningTe: `తెలుగు ఉచ్చారణ: ${found.telugu_phonetic}`,
        audioText: found.character,
        mnemonic: found.mnemonic_en,
        mnemonicTe: found.mnemonic_te
      };
    }
  }

  if (itemType === 'vocab') {
    const found = VOCAB_DATA.find((v) => v.id === itemId);
    if (found) {
      return {
        prompt: found.word,
        reading: `${found.reading} (${found.romaji})`,
        meaningEn: found.english,
        meaningTe: found.telugu,
        audioText: found.word,
        mnemonic: found.mnemonic_en,
        mnemonicTe: found.mnemonic_te
      };
    }
  }

  if (itemType === 'kanji') {
    const found = KANJI_DATA.find((k) => k.id === itemId);
    if (found) {
      return {
        prompt: found.character,
        reading: `KUN: ${(found.kun_readings || []).join(', ')} | ON: ${(found.on_readings || []).join(', ')}`,
        meaningEn: Array.isArray(found.meaning_en) ? found.meaning_en.join(', ') : found.meaning_en,
        meaningTe: Array.isArray(found.meaning_te) ? found.meaning_te.join(', ') : found.meaning_te,
        audioText: found.character,
        mnemonic: found.mnemonic_en,
        mnemonicTe: found.mnemonic_te
      };
    }
  }

  if (itemType === 'grammar') {
    const found = GRAMMAR_DATA.find((g) => g.id === itemId);
    if (found) {
      return {
        prompt: found.title_jp || found.title,
        reading: found.structure,
        meaningEn: found.meaning_en,
        meaningTe: found.meaning_te,
        audioText: found.examples?.[0]?.japanese || found.title_jp || found.title,
        mnemonic: found.explanation_en,
        mnemonicTe: found.explanation_te
      };
    }
  }

  if (itemType === 'sentence') {
    const found = SENTENCE_CHALLENGES.find((s) => s.id === itemId);
    if (found) {
      return {
        prompt: found.expectedJapanese[0],
        reading: found.promptEn,
        meaningEn: found.explanationEn,
        meaningTe: `${found.promptTe} — ${found.explanationTe}`,
        audioText: found.expectedJapanese[0],
        mnemonic: found.hint,
        mnemonicTe: found.explanationTe
      };
    }
  }

  // Check in logged mistake notebook
  const mistakes = storageService.getMistakes();
  const foundMistake = mistakes.find((m) => m.item_id === itemId || m.id === itemId);
  if (foundMistake) {
    return {
      prompt: foundMistake.prompt || foundMistake.correct_answer,
      reading: foundMistake.error_category,
      meaningEn: `Correct answer: ${foundMistake.correct_answer}. Notes: ${foundMistake.notes_en}`,
      meaningTe: foundMistake.notes_te,
      audioText: foundMistake.correct_answer,
      mnemonic: `Your previous entry: "${foundMistake.mistaken_input}"`
    };
  }

  return {
    prompt: itemId,
    reading: itemType,
    meaningEn: 'Review item',
    meaningTe: 'పునశ్చరణ అంశం',
    audioText: itemId
  };
}
