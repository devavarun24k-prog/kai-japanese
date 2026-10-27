// src/data/vocab/reportUnverified.ts
// Audit utility reporting unreviewed Telugu entries to maintain zero fake/unverified data integrity
import { N5_KANA_WORDS } from './n5KanaWords';

export interface UnreviewedReport {
  totalWords: number;
  unverifiedMeaningsCount: number;
  unverifiedExamplesCount: number;
  unverifiedWordIds: string[];
  allVerified: boolean;
}

export function generateTeluguVerificationReport(): UnreviewedReport {
  const unverifiedWords: string[] = [];
  let unverifiedExamples = 0;

  N5_KANA_WORDS.forEach((item) => {
    if (!item.teluguVerified) {
      unverifiedWords.push(item.id);
    }
    if (!item.example.teVerified) {
      unverifiedExamples += 1;
    }
  });

  return {
    totalWords: N5_KANA_WORDS.length,
    unverifiedMeaningsCount: unverifiedWords.length,
    unverifiedExamplesCount: unverifiedExamples,
    unverifiedWordIds: unverifiedWords,
    allVerified: unverifiedWords.length === 0 && unverifiedExamples === 0
  };
}

// Standalone execution logger
export function printTeluguVerificationSummary(): void {
  const report = generateTeluguVerificationReport();
  console.log('=== KAI VOCABULARY TELUGU VERIFICATION REPORT ===');
  console.log(`Total N5 Words: ${report.totalWords}`);
  console.log(`Unverified Word Meanings: ${report.unverifiedMeaningsCount}`);
  console.log(`Unverified Example Sentences: ${report.unverifiedExamplesCount}`);
  console.log(`Integrity Status: ${report.allVerified ? 'All Verified by Human Linguist' : 'Pending Verification Flagged Cleanly'}`);
}
