// src/types/index.ts
// Comprehensive TypeScript definitions for KAI Japanese Mastery Platform

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type DisplayMode = 'english' | 'telugu' | 'bilingual';
export type SkillType = 'reading' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'vocabulary';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  jlpt_target: JLPTLevel;
  current_level: string; // e.g. "Beginner — Early Hiragana"
  daily_goal_minutes: number;
  sound_enabled: boolean;
  display_mode: DisplayMode;
  romaji_enabled: boolean;
  furigana_enabled: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_xp: number;
  level: number;
  level_title: string;
  streak_days: number;
  last_study_date: string;
  total_study_seconds: number;
  kana_mastery_pct: number;
  vocab_mastered_count: number;
  kanji_mastered_count: number;
  grammar_mastered_count: number;
  reviews_due_count: number;
  accuracy_rate: number;
}

// Kana types
export type KanaSystem = 'hiragana' | 'katakana';
export type KanaGroup = 'gojuon' | 'dakuten' | 'handakuten' | 'youon' | 'special';

export interface KanaExampleWord {
  word: string;
  reading: string;
  romaji: string;
  english: string;
  telugu: string;
  telugu_phonetic: string;
}

export interface KanaItem {
  id: string;
  character: string;
  katakana_counterpart: string;
  system: KanaSystem;
  group: KanaGroup;
  romaji: string;
  telugu_phonetic: string; // Telugu script representation e.g. "ఆ", "కా", "కి"
  telugu_pronunciation_guide: string; // Helpful Telugu explanation
  row: string; // a, ka, sa, ta, na, ha, ma, ya, ra, wa, n
  column: number; // 0..4 (a, i, u, e, o)
  stroke_count: number;
  stroke_paths: string[]; // SVG Path data (M... C...) for stroke order animation & tracing
  stroke_directions: string[]; // e.g. ["Horizontal left to right", "Vertical down curve"]
  mnemonic_en: string;
  mnemonic_te: string;
  example_words: KanaExampleWord[];
  common_mistakes: string[]; // Confusable characters e.g. ["さ", "き", "ち"]
}

// Vocabulary types
export type VocabCategory =
  | 'greetings'
  | 'numbers'
  | 'time_dates'
  | 'family'
  | 'food'
  | 'transport'
  | 'school_work'
  | 'directions'
  | 'shopping'
  | 'daily_life'
  | 'adjectives'
  | 'verbs';

export interface SentenceExample {
  japanese: string;
  romaji: string;
  telugu_phonetic: string;
  english: string;
  telugu: string;
  grammar_notes: string;
}

export interface VocabItem {
  id: string;
  word: string;
  reading: string;
  kanji?: string;
  furigana: string;
  romaji: string;
  part_of_speech: string;
  english: string;
  telugu: string;
  telugu_phonetic: string;
  jlpt_level: JLPTLevel;
  category: VocabCategory;
  example_sentences: SentenceExample[];
  mnemonic_en: string;
  mnemonic_te: string;
  related_words?: string[];
  antonym?: string;
}

// Kanji types
export interface KanjiRadical {
  symbol: string;
  meaning_en: string;
  meaning_te: string;
}

export interface KanjiCompound {
  word: string;
  reading: string;
  romaji: string;
  english: string;
  telugu: string;
}

export interface KanjiItem {
  id: string;
  character: string;
  on_readings: string[];
  kun_readings: string[];
  on_telugu: string[];
  kun_telugu: string[];
  meaning_en: string[];
  meaning_te: string[];
  stroke_count: number;
  stroke_paths: string[];
  radicals: KanjiRadical[];
  jlpt_level: JLPTLevel;
  mnemonic_en: string;
  mnemonic_te: string;
  compounds: KanjiCompound[];
  confusable_with?: { character: string; difference: string }[];
}

// Grammar types
export type GrammarCategory =
  | 'particles'
  | 'sentence_structure'
  | 'verb_conjugation'
  | 'adjectives'
  | 'politeness'
  | 'questions'
  | 'counters'
  | 'requests';

export interface GrammarBreakdownPart {
  part: string;
  role: string;
  meaning_en: string;
  meaning_te: string;
}

export interface GrammarExample {
  japanese: string;
  romaji: string;
  telugu_phonetic: string;
  english: string;
  telugu: string;
  breakdown: GrammarBreakdownPart[];
}

export interface GrammarMistake {
  incorrect: string;
  correct: string;
  explanation_en: string;
  explanation_te: string;
}

export interface GrammarPattern {
  id: string;
  title: string;
  title_jp: string;
  structure: string;
  jlpt_level: JLPTLevel;
  category: GrammarCategory;
  meaning_en: string;
  meaning_te: string;
  explanation_en: string;
  explanation_te: string;
  formation_rules: { rule: string; example: string }[];
  examples: GrammarExample[];
  common_mistakes: GrammarMistake[];
}

// Reading Stories
export interface ReadingLexicon {
  word: string;
  reading: string;
  romaji: string;
  meaning_en: string;
  meaning_te: string;
}

export interface StoryParagraph {
  japanese: string;
  romaji: string;
  telugu_phonetic: string;
  english: string;
  telugu: string;
  vocabulary: ReadingLexicon[];
}

export interface StoryComprehensionQuestion {
  question_en: string;
  question_te: string;
  options: string[];
  correct_index: number;
  explanation_en: string;
  explanation_te: string;
}

export interface ReadingStory {
  id: string;
  title_jp: string;
  title_en: string;
  title_te: string;
  jlpt_level: JLPTLevel;
  cover_emoji: string;
  synopsis_en: string;
  synopsis_te: string;
  paragraphs: StoryParagraph[];
  questions: StoryComprehensionQuestion[];
}

// Spaced Repetition (FSRS)
export type FSRSState = 0 | 1 | 2 | 3; // 0: New, 1: Learning, 2: Review, 3: Relearning
export type FSRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface FSRSCard {
  card_id: string;
  item_id: string;
  item_type: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'mistake';
  state: FSRSState;
  due: string; // ISO date
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  last_review?: string; // ISO date
}

// Learning Attempts & Analytics
export interface LearningAttempt {
  id: string;
  timestamp: string;
  item_id: string;
  item_type: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'sentence' | 'listening' | 'speaking';
  skill: SkillType;
  question_type: string;
  user_response: string;
  expected_response: string;
  is_correct: boolean;
  error_category?: string;
  response_time_ms: number;
  hint_used: boolean;
  retry_count: number;
}

export interface MistakeRecord {
  id: string;
  item_id: string;
  item_type: 'kana' | 'vocab' | 'kanji' | 'grammar';
  prompt: string;
  mistaken_input: string;
  correct_answer: string;
  error_category: string;
  notes_en: string;
  notes_te: string;
  frequency: number;
  first_occurred: string;
  last_occurred: string;
  resolved: boolean;
}

export interface WeaknessCategory {
  category: string;
  label_en: string;
  label_te: string;
  severity: 'high' | 'medium' | 'low';
  frequency: number;
  description_en: string;
  description_te: string;
  recommended_action: string;
  affected_items: string[];
}

// RPG & Gamification
export type GameId =
  | 'kana_reflex'
  | 'memory_match'
  | 'particle_detective'
  | 'kanji_forge'
  | 'sentence_builder'
  | 'listening_hunter'
  | 'grammar_boss'
  | 'word_quest'
  | 'daily_challenge'
  | 'jlpt_arena';

export interface Achievement {
  id: string;
  title: string;
  title_jp: string;
  description: string;
  icon: string;
  reward_xp: number;
  progress: number;
  max_progress: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  title_te: string;
  description: string;
  reward_xp: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
}

// AI Tutor
export interface AIMessage {
  id: string;
  sender: 'user' | 'kai' | 'system';
  content: string;
  telugu_translation?: string;
  grammar_breakdown?: { token: string; furigana?: string; pos: string; meaning: string }[];
  audio_text?: string;
  suggested_replies?: string[];
  timestamp: string;
}

// Speaking Practice
export interface SpeakingPracticeItem {
  id: string;
  japanese: string;
  romaji: string;
  telugu_phonetic: string;
  english: string;
  telugu: string;
  context_situation: string;
  difficulty: 'beginner' | 'intermediate';
  key_phrases: string[];
}

export interface SpeechAssessmentResult {
  transcript: string;
  expected: string;
  similarity_score: number; // 0..100
  accuracy_rating: 'Mastery' | 'Great' | 'Good' | 'Needs Practice';
  mismatched_moras: { mora: string; heard: string }[];
  feedback_en: string;
  feedback_te: string;
  is_match: boolean;
}

// Handwriting & Homework OCR
export interface HandwritingStroke {
  points: { x: number; y: number; time: number }[];
}

export interface HandwritingAnalysisResult {
  detected_text: string;
  target_character: string;
  confidence: number; // 0..100
  is_correct: boolean;
  stroke_count_detected: number;
  expected_stroke_count: number;
  stroke_feedback: string[];
  explanations_en: string;
  explanations_te: string;
  candidate_readings: string[];
  mistake_logged: boolean;
}

// JLPT Mock Exam
export interface JLPTQuestion {
  id: string;
  section: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  question_jp: string;
  question_en: string;
  question_te?: string;
  context?: string;
  audio_text?: string;
  options: string[];
  correct_index: number;
  explanation_en: string;
  explanation_te: string;
}

export interface JLPTExam {
  id: string;
  title: string;
  level: JLPTLevel;
  time_limit_minutes: number;
  passing_score_pct: number;
  sections: {
    name: string;
    questions: JLPTQuestion[];
  }[];
}
