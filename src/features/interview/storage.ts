// src/features/interview/storage.ts
// User-scoped storage for interview attempts, candidate profile fields, and weak category analytics
import { storageService } from '../../services/storageService';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import {
  CandidateProfileFields,
  InterviewCategory,
  MockSessionSummary
} from './types';

export interface InterviewProgressState {
  profileFields: CandidateProfileFields;
  sessions: MockSessionSummary[];
  categoryStats: Record<InterviewCategory, { total: number; correct: number }>;
  weakCategories: InterviewCategory[];
}

const DEFAULT_PROFILE_FIELDS: CandidateProfileFields = {
  candidateName: '',
  university: '',
  major: '',
  project: '',
  targetRole: '',
  experienceYears: ''
};

function getStorageKey(): string {
  const userId = storageService.getUserId() || 'guest';
  return `kai_user_${userId}_interview_progress`;
}

export function getInterviewProgress(): InterviewProgressState {
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
    profileFields: { ...DEFAULT_PROFILE_FIELDS },
    sessions: [],
    categoryStats: {
      ece_fundamentals: { total: 0, correct: 0 },
      semiconductors: { total: 0, correct: 0 },
      manufacturing_process: { total: 0, correct: 0 },
      embedded_systems: { total: 0, correct: 0 },
      quality_testing: { total: 0, correct: 0 },
      troubleshooting: { total: 0, correct: 0 },
      projects: { total: 0, correct: 0 },
      behavioral_hr: { total: 0, correct: 0 }
    },
    weakCategories: []
  };
}

export function saveCandidateProfileFields(fields: Partial<CandidateProfileFields>): CandidateProfileFields {
  const current = getInterviewProgress();
  const updatedProfile: CandidateProfileFields = {
    ...current.profileFields,
    ...fields
  };
  current.profileFields = updatedProfile;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getStorageKey(), JSON.stringify(current));
    }
  } catch {}

  // Sync to Supabase if configured and user is logged in
  const userId = storageService.getUserId();
  if (userId && isSupabaseConfigured && supabase) {
    try {
      void supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', userId);
    } catch {}
  }

  return updatedProfile;
}

export function saveMockInterviewSession(session: MockSessionSummary): InterviewProgressState {
  const current = getInterviewProgress();
  current.sessions.unshift(session);
  // Keep last 30 sessions
  if (current.sessions.length > 30) {
    current.sessions = current.sessions.slice(0, 30);
  }

  // Update cumulative category stats
  Object.entries(session.categoryScores).forEach(([catKey, data]) => {
    const cat = catKey as InterviewCategory;
    if (!current.categoryStats[cat]) {
      current.categoryStats[cat] = { total: 0, correct: 0 };
    }
    current.categoryStats[cat].total += data.total;
    current.categoryStats[cat].correct += Math.round(data.scoreSum);
  });

  // Calculate weak categories (accuracy < 70% with at least 2 attempts)
  const weakCats: InterviewCategory[] = [];
  Object.entries(current.categoryStats).forEach(([catKey, stat]) => {
    if (stat.total >= 2) {
      const pct = (stat.correct / stat.total) * 100;
      if (pct < 70) {
        weakCats.push(catKey as InterviewCategory);
      }
    }
  });

  // Also include session-level weak categories
  session.weakCategories.forEach((cat) => {
    if (!weakCats.includes(cat)) {
      weakCats.push(cat);
    }
  });

  current.weakCategories = weakCats;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getStorageKey(), JSON.stringify(current));
    }
  } catch {}

  return current;
}

export function getWeakCategories(): InterviewCategory[] {
  const progress = getInterviewProgress();
  return progress.weakCategories;
}
