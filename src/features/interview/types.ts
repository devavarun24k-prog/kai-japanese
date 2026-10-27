// src/features/interview/types.ts
// Contracts for technical & behavioral interviews, rubric evaluations, and Japanese workplace prep

export type InterviewCategory =
  | 'ece_fundamentals'
  | 'semiconductors'
  | 'manufacturing_process'
  | 'embedded_systems'
  | 'quality_testing'
  | 'troubleshooting'
  | 'projects'
  | 'behavioral_hr';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType = 'mcq' | 'descriptive';

export interface KeyPoint {
  id: string;
  label: string;
  keywords: string[]; // Synonyms and phrases to detect in the candidate's typed response
}

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  difficulty: DifficultyLevel;
  type: QuestionType;
  question: string;
  explanation: string;
  reviewed: boolean; // Flag to show expert review status (strictly false in draft)
  // For MCQs:
  options?: [string, string, string, string];
  correctIndex?: 0 | 1 | 2 | 3;
  // For Descriptive questions:
  modelAnswer?: string;
  requiredKeyPoints?: KeyPoint[];
}

export interface RubricMatchResult {
  foundKeyPoints: KeyPoint[];
  missingKeyPoints: KeyPoint[];
  scorePct: number;
  totalPoints: number;
  matchedCount: number;
  evaluationNote: string;
}

export interface MockSessionSummary {
  id: string;
  date: string;
  durationSeconds: number;
  totalQuestions: number;
  overallScorePct: number;
  categoryScores: Record<InterviewCategory, { total: number; scoreSum: number; pct: number }>;
  strongCategories: InterviewCategory[];
  weakCategories: InterviewCategory[];
}

export interface CandidateProfileFields {
  candidateName?: string;
  university?: string;
  major?: string;
  project?: string;
  targetRole?: string;
  experienceYears?: string;
}

export interface JapaneseInterviewCard {
  id: string;
  topic:
    | 'self_intro'
    | 'education'
    | 'projects'
    | 'strengths_weaknesses'
    | 'why_japan'
    | 'reverse_questions'
    | 'polite_phrases';
  titleJp: string;
  titleEn: string;
  questionJp: string;
  questionKana: string;
  questionRomaji: string;
  questionEn: string;
  questionTe?: string;
  teluguVerified: boolean; // Flag to maintain zero unverified data integrity
  reviewed: boolean; // Flag to show expert review status
  sampleAnswerTemplate: string;
  sampleAnswerRomaji: string;
  sampleAnswerEn: string;
  sampleAnswerTe?: string;
  scriptForSpeaking: string; // Phonetic script used for pronunciation similarity check
  expectedKeywords: string[];
}
