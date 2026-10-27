// src/features/interview/data/index.ts
// Re-export combined 60 interview starter questions and query helpers
import { InterviewQuestion, InterviewCategory, DifficultyLevel } from '../types';
import { INTERVIEW_QUESTIONS_PART_1 } from './questionsPart1';
import { INTERVIEW_QUESTIONS_PART_2 } from './questionsPart2';
import { INTERVIEW_QUESTIONS_PART_3 } from './questionsPart3';

export const STARTER_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  ...INTERVIEW_QUESTIONS_PART_1,
  ...INTERVIEW_QUESTIONS_PART_2,
  ...INTERVIEW_QUESTIONS_PART_3
];

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return STARTER_INTERVIEW_QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByCategory(category: InterviewCategory): InterviewQuestion[] {
  return STARTER_INTERVIEW_QUESTIONS.filter((q) => q.category === category);
}

export function getQuestionsByDifficulty(level: DifficultyLevel): InterviewQuestion[] {
  return STARTER_INTERVIEW_QUESTIONS.filter((q) => q.difficulty === level);
}

export function filterInterviewQuestions(options: {
  category?: InterviewCategory | 'all';
  difficulty?: DifficultyLevel | 'all';
  type?: 'mcq' | 'descriptive' | 'all';
}): InterviewQuestion[] {
  return STARTER_INTERVIEW_QUESTIONS.filter((q) => {
    if (options.category && options.category !== 'all' && q.category !== options.category) {
      return false;
    }
    if (options.difficulty && options.difficulty !== 'all' && q.difficulty !== options.difficulty) {
      return false;
    }
    if (options.type && options.type !== 'all' && q.type !== options.type) {
      return false;
    }
    return true;
  });
}
