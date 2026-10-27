// src/features/electronics/lessons/types.ts
// Contracts for beginner engineering fundamentals lessons and quizzes

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  reviewed: boolean; // Flag to show expert review status (strictly false in draft)
}

export interface LessonSection {
  heading: string;
  content: string;
  formula?: string;
  tip?: string;
}

export interface EngineeringLesson {
  id: string;
  title: string;
  titleJp: string;
  track: 'circuits' | 'digital' | 'semiconductors' | 'fabrication';
  level: 'Beginner' | 'Intermediate';
  estimatedMinutes: number;
  summary: string;
  sections: LessonSection[];
  workedExample: {
    problem: string;
    stepByStep: string[];
    answer: string;
  };
  quizQuestions: QuizQuestion[];
  reviewed: boolean; // Flag to show expert review status
}
