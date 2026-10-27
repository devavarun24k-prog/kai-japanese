// src/features/electronics/lessons/data/index.ts
// Re-export aggregated engineering lessons and helpers
import { EngineeringLesson } from '../types';
import { LESSON_OHM } from './lessonOhm';
import { LESSON_COMPONENTS } from './lessonComponents';
import { LESSON_LOGIC } from './lessonLogic';
import { LESSON_BINARY } from './lessonBinary';
import { LESSON_SEMICONDUCTORS } from './lessonSemiconductors';
import { LESSON_WAFER_PROCESS } from './lessonWaferProcess';

export const ENGINEERING_LESSONS: EngineeringLesson[] = [
  LESSON_OHM,
  LESSON_COMPONENTS,
  LESSON_LOGIC,
  LESSON_BINARY,
  LESSON_SEMICONDUCTORS,
  LESSON_WAFER_PROCESS
];

export function getLessonById(id: string): EngineeringLesson | undefined {
  return ENGINEERING_LESSONS.find((l) => l.id === id);
}

export function getAllQuizQuestions() {
  return ENGINEERING_LESSONS.flatMap((lesson) =>
    lesson.quizQuestions.map((q) => ({
      ...q,
      lessonId: lesson.id,
      lessonTitle: lesson.title
    }))
  );
}
