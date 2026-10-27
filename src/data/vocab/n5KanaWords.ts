// src/data/vocab/n5KanaWords.ts
// Combined 150-word N5 Vocabulary database for Dictation Studio
import { DictationVocabItem } from './types';
import { N5_WORDS_PART_1 } from './n5WordsPart1';
import { N5_WORDS_PART_2 } from './n5WordsPart2';
import { N5_WORDS_PART_3 } from './n5WordsPart3';

export const N5_KANA_WORDS: DictationVocabItem[] = [
  ...N5_WORDS_PART_1,
  ...N5_WORDS_PART_2,
  ...N5_WORDS_PART_3
];

export { N5_WORDS_PART_1 } from './n5WordsPart1';
export { N5_WORDS_PART_2 } from './n5WordsPart2';
export { N5_WORDS_PART_3 } from './n5WordsPart3';
export type { DictationVocabItem, VocabExampleSentence } from './types';
