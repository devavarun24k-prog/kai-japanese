// src/features/jobs/storage.ts
// User-scoped storage for Job Tracker applications and verified sources with Supabase sync
import { JobApplication, VerifiedSource, JobStatus, TriStateField } from './types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

function getLocalStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage;
  }
  return null;
}

function getJobsStorageKey(userId?: string): string {
  const uid = userId || 'anonymous';
  return `kai_user_${uid}_jobs`;
}

function getSourcesStorageKey(userId?: string): string {
  const uid = userId || 'anonymous';
  return `kai_user_${uid}_job_sources`;
}

const defaultTriState = (): TriStateField => ({
  status: 'unknown',
  note: ''
});

/**
 * Creates an empty, typed job application with strict defaults
 */
export function createEmptyJobApplication(): JobApplication {
  const now = new Date().toISOString();
  return {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    employer: '',
    title: '',
    location: '',
    sourceUrl: '',
    officialApplicationUrl: '',
    postedDate: now.slice(0, 10),
    deadline: '',
    salaryAndBenefits: 'Not stated',
    requiredQualifications: '',
    technicalSkills: [],
    japaneseLevel: 'Not Stated',
    englishLevel: 'Not Stated',
    experienceRequirement: 'Not stated',
    workArrangement: 'on_site',
    overseasApplicantsAccepted: defaultTriState(),
    relocationSupport: defaultTriState(),
    visaSponsorship: defaultTriState(),
    status: 'interested',
    statusHistory: [
      {
        id: `sh_${Date.now()}`,
        date: now,
        toStatus: 'interested',
        note: 'Saved to Job Tracker'
      }
    ],
    notes: '',
    applicationDate: '',
    followUpDate: '',
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Loads user jobs from localStorage (seed is strictly EMPTY; never injects fake vacancies)
 */
export function loadJobs(userId?: string): JobApplication[] {
  try {
    const storage = getLocalStorage();
    const raw = storage ? storage.getItem(getJobsStorageKey(userId)) : null;
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load jobs:', err);
    return [];
  }
}

/**
 * Saves jobs to user-scoped localStorage and syncs with Supabase if authenticated
 */
export async function saveJobs(jobs: JobApplication[], userId?: string): Promise<{ success: boolean; syncedRemote: boolean }> {
  try {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(getJobsStorageKey(userId), JSON.stringify(jobs));
    }

    let syncedRemote = false;
    if (isSupabaseConfigured && supabase && userId && userId !== 'anonymous') {
      try {
        // Sync to public.job_applications table if table exists
        const { error } = await supabase
          .from('job_applications')
          .upsert(
            jobs.map(job => ({
              id: job.id,
              user_id: userId,
              job_data: job,
              updated_at: new Date().toISOString()
            }))
          );
        if (!error) syncedRemote = true;
      } catch {
        syncedRemote = false;
      }
    }

    return { success: true, syncedRemote };
  } catch (err) {
    console.error('Failed to save jobs:', err);
    return { success: false, syncedRemote: false };
  }
}

/**
 * Checks whether a given URL is already tracked in existing jobs (Duplicate Warning)
 */
export function findDuplicateJob(url: string, currentJobId?: string, jobs: JobApplication[] = []): JobApplication | null {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim().toLowerCase();
  if (clean.length < 5) return null;

  return jobs.find(j => {
    if (currentJobId && j.id === currentJobId) return false;
    const sUrl = j.sourceUrl ? j.sourceUrl.trim().toLowerCase() : '';
    const oUrl = j.officialApplicationUrl ? j.officialApplicationUrl.trim().toLowerCase() : '';
    return sUrl === clean || oUrl === clean;
  }) || null;
}

/**
 * Adds or updates a job application, automatically recording status history on status changes
 */
export function upsertJobApplication(
  job: JobApplication,
  userId?: string,
  statusChangeNote?: string
): JobApplication[] {
  const currentJobs = loadJobs(userId);
  const existingIdx = currentJobs.findIndex(j => j.id === job.id);
  const now = new Date().toISOString();

  let updatedJob: JobApplication;

  if (existingIdx >= 0) {
    const existing = currentJobs[existingIdx];
    const statusChanged = existing.status !== job.status;

    const newHistory = [...existing.statusHistory];
    if (statusChanged) {
      newHistory.push({
        id: `sh_${Date.now()}`,
        date: now,
        fromStatus: existing.status,
        toStatus: job.status,
        note: statusChangeNote || `Status updated to ${job.status}`
      });
    }

    updatedJob = {
      ...job,
      statusHistory: newHistory,
      updatedAt: now
    };
    currentJobs[existingIdx] = updatedJob;
  } else {
    updatedJob = {
      ...job,
      createdAt: now,
      updatedAt: now
    };
    currentJobs.unshift(updatedJob);
  }

  saveJobs(currentJobs, userId);
  return currentJobs;
}

/**
 * Deletes a job application
 */
export function deleteJobApplication(jobId: string, userId?: string): JobApplication[] {
  const currentJobs = loadJobs(userId);
  const updated = currentJobs.filter(j => j.id !== jobId);
  saveJobs(updated, userId);
  return updated;
}

// ---------------------------------------------------------------------------
// Verified Official Career Sources Storage
// ---------------------------------------------------------------------------

export function loadVerifiedSources(userId?: string): VerifiedSource[] {
  try {
    const storage = getLocalStorage();
    const raw = storage ? storage.getItem(getSourcesStorageKey(userId)) : null;
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load verified sources:', err);
    return [];
  }
}

export function saveVerifiedSources(sources: VerifiedSource[], userId?: string): VerifiedSource[] {
  try {
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(getSourcesStorageKey(userId), JSON.stringify(sources));
    }
    return sources;
  } catch (err) {
    console.error('Failed to save verified sources:', err);
    return sources;
  }
}

export function isSourceStale(lastVerifiedDate: string, thresholdDays = 60): boolean {
  if (!lastVerifiedDate) return true;
  const verified = new Date(lastVerifiedDate);
  if (isNaN(verified.getTime())) return true;

  const diffMs = Date.now() - verified.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > thresholdDays;
}
