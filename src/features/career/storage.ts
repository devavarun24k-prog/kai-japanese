// src/features/career/storage.ts
// User-scoped storage for Career Profile, Document Versions, and photo management
import { CareerProfile, DocumentVersion } from './types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

export function createEmptyProfile(): CareerProfile {
  return {
    personalDetails: {
      fullNameKanji: '',
      fullNameKana: '',
      fullNameRomaji: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      postalCode: '',
      address: '',
      addressKana: '',
      photoUrl: undefined,
      photoOptInPrivateUpload: false,
      workAuthorization: ''
    },
    educationHistory: [],
    workHistory: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
    targetRoles: [],
    links: [],
    selfPR: '',
    reasonForApplication: '',
    hopesAndWishes: '',
    lastUpdated: new Date().toISOString()
  };
}

function getLocalStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage;
  }
  return null;
}

function getStorageKey(userId?: string): string {
  const uid = userId || 'anonymous';
  return `kai_user_${uid}_career_profile`;
}

function getVersionsStorageKey(userId?: string): string {
  const uid = userId || 'anonymous';
  return `kai_user_${uid}_career_versions`;
}

/**
 * Loads the user's career profile from localStorage with fallback to empty profile
 */
export function loadCareerProfile(userId?: string): CareerProfile {
  try {
    const storage = getLocalStorage();
    const raw = storage ? storage.getItem(getStorageKey(userId)) : null;
    if (!raw) return createEmptyProfile();
    const parsed = JSON.parse(raw);
    return {
      ...createEmptyProfile(),
      ...parsed,
      personalDetails: {
        ...createEmptyProfile().personalDetails,
        ...(parsed.personalDetails || {})
      }
    };
  } catch (err) {
    console.error('Failed to load career profile:', err);
    return createEmptyProfile();
  }
}

/**
 * Saves career profile to localStorage and syncs with Supabase if configured and authenticated
 */
export async function saveCareerProfile(profile: CareerProfile, userId?: string): Promise<{ success: boolean; syncedRemote: boolean }> {
  try {
    const updated = {
      ...profile,
      lastUpdated: new Date().toISOString()
    };
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(getStorageKey(userId), JSON.stringify(updated));
    }

    let syncedRemote = false;
    if (isSupabaseConfigured && supabase && userId && userId !== 'anonymous') {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            career_profile_data: updated,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (!error) syncedRemote = true;
      } catch {
        // Fallback silently if table or column is absent in local dev
        syncedRemote = false;
      }
    }

    return { success: true, syncedRemote };
  } catch (err) {
    console.error('Failed to save career profile:', err);
    return { success: false, syncedRemote: false };
  }
}

/**
 * Load saved document versions
 */
export function loadDocumentVersions(userId?: string): DocumentVersion[] {
  try {
    const storage = getLocalStorage();
    const raw = storage ? storage.getItem(getVersionsStorageKey(userId)) : null;
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load document versions:', err);
    return [];
  }
}

/**
 * Save a document version
 */
export function saveDocumentVersion(version: DocumentVersion, userId?: string): DocumentVersion[] {
  try {
    const current = loadDocumentVersions(userId);
    const existingIdx = current.findIndex(v => v.id === version.id);
    let updated: DocumentVersion[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...version, updatedAt: new Date().toISOString() };
    } else {
      updated = [version, ...current];
    }
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(getVersionsStorageKey(userId), JSON.stringify(updated));
    }
    return updated;
  } catch (err) {
    console.error('Failed to save version:', err);
    return loadDocumentVersions(userId);
  }
}

/**
 * Delete a document version
 */
export function deleteDocumentVersion(versionId: string, userId?: string): DocumentVersion[] {
  try {
    const current = loadDocumentVersions(userId);
    const updated = current.filter(v => v.id !== versionId);
    const storage = getLocalStorage();
    if (storage) {
      storage.setItem(getVersionsStorageKey(userId), JSON.stringify(updated));
    }
    return updated;
  } catch (err) {
    console.error('Failed to delete version:', err);
    return loadDocumentVersions(userId);
  }
}

/**
 * Duplicate a document version
 */
export function duplicateDocumentVersion(versionId: string, newName: string, userId?: string): DocumentVersion | null {
  const current = loadDocumentVersions(userId);
  const found = current.find(v => v.id === versionId);
  if (!found) return null;

  const duplicated: DocumentVersion = {
    ...found,
    id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: newName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveDocumentVersion(duplicated, userId);
  return duplicated;
}
