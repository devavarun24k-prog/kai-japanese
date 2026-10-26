// src/services/supabaseClient.ts
// Supabase Client with graceful fallback, offline capability, and URL normalization
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Robust URL normalizer: strips trailing slashes and /rest/v1 subpaths if present
const normalizeUrl = (raw?: string): string => {
  if (!raw) return '';
  try {
    return new URL(raw.trim()).origin;
  } catch {
    return raw.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  }
};

export const supabaseUrl = normalizeUrl(rawSupabaseUrl);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
