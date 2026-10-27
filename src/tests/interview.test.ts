// src/tests/interview.test.ts
// Unit and integration test suite for Interview Arena, Rubrics, Templates, and Weak-area diagnosis
import { describe, it, expect, beforeEach } from 'vitest';
import { STARTER_INTERVIEW_QUESTIONS, getQuestionById, filterInterviewQuestions } from '../features/interview/data';
import { JAPANESE_INTERVIEW_CARDS } from '../features/interview/data/japaneseQuestions';
import { evaluateDescriptiveAnswer } from '../features/interview/utils/rubricMatcher';
import { fillTemplate } from '../features/interview/utils/templateFiller';
import {
  getInterviewProgress,
  saveCandidateProfileFields,
  saveMockInterviewSession,
  getWeakCategories
} from '../features/interview/storage';
import { KeyPoint, MockSessionSummary } from '../features/interview/types';
import { speechRecognitionService } from '../services/speechRecognition';
import { storageService } from '../services/storageService';

// Node localStorage mock
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  globalThis.localStorage = new LocalStorageMock() as any;
}

describe('Interview Question Bank & Academic Honesty', () => {
  it('contains exactly 60 starter questions with unique IDs', () => {
    expect(STARTER_INTERVIEW_QUESTIONS.length).toBe(60);
    const idSet = new Set(STARTER_INTERVIEW_QUESTIONS.map((q) => q.id));
    expect(idSet.size).toBe(60);
  });

  it('covers all 8 technical and workplace domains', () => {
    const requiredCategories = [
      'ece_fundamentals',
      'semiconductors',
      'manufacturing_process',
      'embedded_systems',
      'quality_testing',
      'troubleshooting',
      'projects',
      'behavioral_hr'
    ];

    requiredCategories.forEach((cat) => {
      const count = STARTER_INTERVIEW_QUESTIONS.filter((q) => q.category === cat).length;
      expect(count, `Category ${cat} must have questions`).toBeGreaterThanOrEqual(5);
    });
  });

  it('strictly enforces unreviewed draft status on all questions', () => {
    STARTER_INTERVIEW_QUESTIONS.forEach((q) => {
      expect(q.reviewed).toBe(false);
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(10);

      if (q.type === 'mcq') {
        expect(q.options).toBeDefined();
        expect(q.options?.length).toBe(4);
        expect([0, 1, 2, 3]).toContain(q.correctIndex);
      } else if (q.type === 'descriptive') {
        expect(q.modelAnswer).toBeDefined();
        expect(q.modelAnswer?.length).toBeGreaterThan(20);
        expect(q.requiredKeyPoints).toBeDefined();
        expect(q.requiredKeyPoints?.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  it('filters questions by category, level, and question type', () => {
    const advancedSemis = filterInterviewQuestions({
      category: 'semiconductors',
      difficulty: 'advanced'
    });
    expect(advancedSemis.length).toBeGreaterThanOrEqual(1);
    expect(advancedSemis[0].category).toBe('semiconductors');
    expect(advancedSemis[0].difficulty).toBe('advanced');

    const mcqsOnly = filterInterviewQuestions({ type: 'mcq' });
    expect(mcqsOnly.every((q) => q.type === 'mcq')).toBe(true);
  });
});

describe('Deterministic Rubric Evaluation Engine', () => {
  const sampleKeyPoints: KeyPoint[] = [
    { id: 'kp_1', label: 'Proximity to power pin', keywords: ['close to pin', 'physically close', 'near the pin'] },
    { id: 'kp_2', label: 'Local charge reservoir', keywords: ['reservoir', 'transient current', 'switching surge'] },
    { id: 'kp_3', label: 'Noise shunting to ground', keywords: ['shunt noise', 'filter noise', 'bypass to ground'] }
  ];

  it('evaluates candidate response accurately detecting all matched keywords (100%)', () => {
    const candidateAnswer = 'Decoupling caps must be placed physically close to the pin to act as a local charge reservoir and shunt noise directly to ground.';
    const result = evaluateDescriptiveAnswer(candidateAnswer, sampleKeyPoints);

    expect(result.scorePct).toBe(100);
    expect(result.matchedCount).toBe(3);
    expect(result.foundKeyPoints.length).toBe(3);
    expect(result.missingKeyPoints.length).toBe(0);
  });

  it('detects partial matches and accurately separates missing points', () => {
    const candidateAnswer = 'They are placed near the pin to filter noise.';
    const result = evaluateDescriptiveAnswer(candidateAnswer, sampleKeyPoints);

    expect(result.matchedCount).toBe(2); // kp_1 and kp_3 matched
    expect(result.scorePct).toBe(67);
    expect(result.foundKeyPoints.map((k) => k.id)).toEqual(['kp_1', 'kp_3']);
    expect(result.missingKeyPoints.map((k) => k.id)).toEqual(['kp_2']);
  });

  it('handles empty or completely off-topic response safely (0%)', () => {
    const candidateAnswer = 'I do not remember this topic.';
    const result = evaluateDescriptiveAnswer(candidateAnswer, sampleKeyPoints);

    expect(result.scorePct).toBe(0);
    expect(result.matchedCount).toBe(0);
    expect(result.foundKeyPoints.length).toBe(0);
    expect(result.missingKeyPoints.length).toBe(3);
  });
});

describe('Template Filling Engine & Candidate Data Integrity', () => {
  const template = 'はじめまして。{name}と申します。{university}にて{major}を専攻し、{project}を開発しました。';

  it('replaces template blanks with user profile fields when provided', () => {
    const profile = {
      candidateName: 'Enosh',
      university: 'Tokyo Institute of Technology',
      major: 'Applied Physics',
      project: 'Silicon Photonic IC'
    };

    const filled = fillTemplate(template, profile);
    expect(filled).toBe('はじめまして。Enoshと申します。Tokyo Institute of TechnologyにてApplied Physicsを専攻し、Silicon Photonic ICを開発しました。');
  });

  it('strictly preserves blanks as visible placeholders when profile fields are empty or undefined', () => {
    const partialProfile = {
      candidateName: 'Kenji',
      university: '', // Empty
      major: undefined, // Undefined
      project: ''
    };

    const filled = fillTemplate(template, partialProfile);
    expect(filled).toContain('Kenjiと申します。');
    expect(filled).toContain('{university}');
    expect(filled).toContain('{major}');
    expect(filled).toContain('{project}');
    // Confirms no hallucinated or fake universities were inserted
    expect(filled).not.toContain('Tokyo');
  });

  it('leaves all blanks intact when profile is null', () => {
    const filled = fillTemplate(template, null);
    expect(filled).toBe(template);
  });
});

describe('Japanese Workplace Interview Cards', () => {
  it('covers all 7 required workplace interview themes', () => {
    expect(JAPANESE_INTERVIEW_CARDS.length).toBe(7);
    const topics = JAPANESE_INTERVIEW_CARDS.map((c) => c.topic);
    expect(topics).toContain('self_intro');
    expect(topics).toContain('education');
    expect(topics).toContain('projects');
    expect(topics).toContain('strengths_weaknesses');
    expect(topics).toContain('why_japan');
    expect(topics).toContain('reverse_questions');
    expect(topics).toContain('polite_phrases');
  });

  it('strictly marks Telugu translations unverified and keeps review status draft', () => {
    JAPANESE_INTERVIEW_CARDS.forEach((card) => {
      expect(card.reviewed).toBe(false);
      expect(card.teluguVerified).toBe(false);
      expect(card.questionJp.length).toBeGreaterThan(0);
      expect(card.sampleAnswerTemplate).toContain('{');
    });
  });
});

describe('Mock Interview Session Persistence & Weak Area Diagnosis', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.setUserId('interview_tester');
  });

  it('persists candidate profile edits without data loss', () => {
    saveCandidateProfileFields({
      candidateName: 'Aoi Tanaka',
      university: 'Waseda University',
      targetRole: 'Firmware Engineer'
    });

    const state = getInterviewProgress();
    expect(state.profileFields.candidateName).toBe('Aoi Tanaka');
    expect(state.profileFields.university).toBe('Waseda University');
    expect(state.profileFields.targetRole).toBe('Firmware Engineer');
  });

  it('diagnoses strong (>=75%) and weak (<70%) categories from mock session', () => {
    const mockSummary: MockSessionSummary = {
      id: 'mock_test_1',
      date: new Date().toISOString(),
      durationSeconds: 300,
      totalQuestions: 5,
      overallScorePct: 60,
      categoryScores: {
        ece_fundamentals: { total: 2, scoreSum: 2, pct: 100 }, // Strong
        semiconductors: { total: 2, scoreSum: 0.5, pct: 25 }, // Weak
        manufacturing_process: { total: 1, scoreSum: 0.5, pct: 50 }, // Weak
        embedded_systems: { total: 0, scoreSum: 0, pct: 0 },
        quality_testing: { total: 0, scoreSum: 0, pct: 0 },
        troubleshooting: { total: 0, scoreSum: 0, pct: 0 },
        projects: { total: 0, scoreSum: 0, pct: 0 },
        behavioral_hr: { total: 0, scoreSum: 0, pct: 0 }
      },
      strongCategories: ['ece_fundamentals'],
      weakCategories: ['semiconductors', 'manufacturing_process']
    };

    saveMockInterviewSession(mockSummary);
    const weak = getWeakCategories();
    expect(weak).toContain('semiconductors');
    expect(weak).toContain('manufacturing_process');
    expect(weak).not.toContain('ece_fundamentals');
  });
});

describe('Speech Recognition Service Support & Phonetic Scoring', () => {
  it('detects browser SpeechRecognition support state reliably', () => {
    // In headless Node, Web Speech API is not defined
    expect(typeof speechRecognitionService.getIsSupported()).toBe('boolean');
  });

  it('accurately evaluates phonetic pronunciation similarity score', () => {
    const transcript = 'はじめまして。よろしくおねがいします。';
    const expected = 'はじめまして。よろしくお願いいたします。';
    const assessment = speechRecognitionService.evaluatePronunciation(transcript, expected, '');

    expect(assessment.similarity_score).toBeGreaterThanOrEqual(75);
    expect(assessment.accuracy_rating).toBe('Great');
  });
});
