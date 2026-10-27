// src/features/interview/utils/rubricMatcher.ts
// Deterministic keyword and concept rubric matcher for descriptive engineering interview answers
import { KeyPoint, RubricMatchResult } from '../types';

export function evaluateDescriptiveAnswer(
  candidateAnswer: string,
  requiredKeyPoints: KeyPoint[]
): RubricMatchResult {
  const normalized = candidateAnswer.trim().toLowerCase();

  if (!normalized || requiredKeyPoints.length === 0) {
    return {
      foundKeyPoints: [],
      missingKeyPoints: requiredKeyPoints,
      scorePct: 0,
      totalPoints: requiredKeyPoints.length,
      matchedCount: 0,
      evaluationNote: 'No response submitted or no key points defined.'
    };
  }

  const foundKeyPoints: KeyPoint[] = [];
  const missingKeyPoints: KeyPoint[] = [];

  requiredKeyPoints.forEach((point) => {
    // Check if any keyword or synonym in the key point is matched in the answer
    const isMatched = point.keywords.some((kw) => {
      const cleanKw = kw.trim().toLowerCase();
      if (!cleanKw) return false;
      // Check for exact substring inclusion or word boundary
      if (normalized.includes(cleanKw)) return true;

      // Also check simple plural/suffix matches or regex boundary
      const escaped = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(normalized);
    });

    if (isMatched) {
      foundKeyPoints.push(point);
    } else {
      missingKeyPoints.push(point);
    }
  });

  const matchedCount = foundKeyPoints.length;
  const totalPoints = requiredKeyPoints.length;
  const scorePct = totalPoints > 0 ? Math.round((matchedCount / totalPoints) * 100) : 0;

  let evaluationNote = '';
  if (scorePct === 100) {
    evaluationNote = 'Exceptional: All required core technical concepts and keywords were addressed.';
  } else if (scorePct >= 75) {
    evaluationNote = 'Proficient: Majority of core technical concepts were covered with minor omissions.';
  } else if (scorePct >= 50) {
    evaluationNote = 'Developing: Partial understanding demonstrated; several critical points were missed.';
  } else {
    evaluationNote = 'Needs Review: Key technical mechanisms and keywords were absent from the answer.';
  }

  return {
    foundKeyPoints,
    missingKeyPoints,
    scorePct,
    totalPoints,
    matchedCount,
    evaluationNote
  };
}
