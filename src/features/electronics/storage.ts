// src/features/electronics/storage.ts
// User-scoped storage for Engineering Fundamentals track progress and weak-topic analysis
import { storageService } from '../../services/storageService';
import { ENGINEERING_LESSONS, getAllQuizQuestions } from './lessons/data';
import { QuizQuestion } from './lessons/types';

export interface LessonProgressRecord {
  lessonId: string;
  completed: boolean;
  attempts: number;
  lastScore: number;
  bestScore: number;
  totalQuestions: number;
  missedQuestionIds: string[];
  lastAttemptDate: string;
}

export interface ElectronicsProgressState {
  lessons: Record<string, LessonProgressRecord>;
  totalAttempts: number;
}

export interface WeakTopicInfo {
  lessonId: string;
  lessonTitle: string;
  track: string;
  accuracyPct: number;
  missedQuestionCount: number;
}

function getStorageKey(): string {
  const userId = storageService.getUserId() || 'guest';
  return `kai_user_${userId}_electronics_progress`;
}

export function getElectronicsProgress(): ElectronicsProgressState {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {
    // Return default on parse failure
  }
  return {
    lessons: {},
    totalAttempts: 0
  };
}

export function saveLessonQuizResult(
  lessonId: string,
  score: number,
  totalQuestions: number,
  missedQuestionIds: string[]
): LessonProgressRecord {
  const progress = getElectronicsProgress();
  const existing = progress.lessons[lessonId] || {
    lessonId,
    completed: false,
    attempts: 0,
    lastScore: 0,
    bestScore: 0,
    totalQuestions,
    missedQuestionIds: [],
    lastAttemptDate: ''
  };

  const updated: LessonProgressRecord = {
    lessonId,
    completed: existing.completed || score / totalQuestions >= 0.75, // Completed if >= 75%
    attempts: existing.attempts + 1,
    lastScore: score,
    bestScore: Math.max(existing.bestScore, score),
    totalQuestions,
    missedQuestionIds: Array.from(new Set([...existing.missedQuestionIds, ...missedQuestionIds])),
    lastAttemptDate: new Date().toISOString()
  };

  // If score was perfect, clear the missed questions for this lesson
  if (score === totalQuestions) {
    updated.missedQuestionIds = [];
  }

  progress.lessons[lessonId] = updated;
  progress.totalAttempts += 1;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getStorageKey(), JSON.stringify(progress));
    }
  } catch {
    // Storage write fail safe
  }

  return updated;
}

export function getWeakTopics(): WeakTopicInfo[] {
  const progress = getElectronicsProgress();
  const weakTopics: WeakTopicInfo[] = [];

  ENGINEERING_LESSONS.forEach((lesson) => {
    const record = progress.lessons[lesson.id];
    if (!record || record.attempts === 0) return;

    const accuracyPct = Math.round((record.lastScore / record.totalQuestions) * 100);
    // Flag as weak if accuracy is below 70% or if there are outstanding missed questions
    if (accuracyPct < 70 || record.missedQuestionIds.length > 0) {
      weakTopics.push({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        track: lesson.track,
        accuracyPct,
        missedQuestionCount: record.missedQuestionIds.length
      });
    }
  });

  return weakTopics;
}

export function getTargetedPracticeQuestions(): QuizQuestion[] {
  const progress = getElectronicsProgress();
  const allMissedIds = new Set<string>();

  Object.values(progress.lessons).forEach((l) => {
    l.missedQuestionIds.forEach((id) => allMissedIds.add(id));
  });

  const allQuestions = getAllQuizQuestions();
  const targeted = allQuestions.filter((q) => allMissedIds.has(q.id));

  // If learner has no missed questions yet, return a random mix of 4 fundamental questions
  if (targeted.length === 0) {
    return allQuestions.slice(0, 4);
  }

  return targeted;
}
