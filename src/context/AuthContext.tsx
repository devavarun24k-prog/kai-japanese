// src/context/AuthContext.tsx
// Secure authentication context with Supabase Auth & protected local demo isolation
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';
import { hashPasswordWithSalt, generateRandomSalt, constantTimeCompare } from '../utils/crypto';

// Strict production check: Vite production build or explicit production environment
export const isProductionMode = Boolean(
  import.meta.env.PROD || import.meta.env.VITE_APP_ENV === 'production'
);

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  profile: UserProfile;
  isSupabaseMode: boolean;
  isProductionMode: boolean;
  isOwnerConfigured: boolean;
  loginWithPassword: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  setupOwnerAccount: (password: string, email: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEYS = {
  TOKEN: 'kai_auth_token',
  TOKEN_EXPIRY: 'kai_auth_token_expiry',
  EMAIL: 'kai_auth_email',
  OWNER_HASH: 'kai_owner_pwd_hash',
  OWNER_SALT: 'kai_owner_pwd_salt',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [isOwnerConfigured, setIsOwnerConfigured] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_HASH));
  });

  useEffect(() => {
    const checkSession = async () => {
      // 1. Primary path: Supabase Auth (Mandatory in production)
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            storageService.setUserId(session.user.id);
            await storageService.syncFromSupabase();
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            setProfile(storageService.getProfile());
          } else {
            storageService.setUserId(null);
            storageService.clearMemoryState();
            setIsAuthenticated(false);
            setUserEmail(null);
          }

          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session && session.user) {
              storageService.setUserId(session.user.id);
              await storageService.syncFromSupabase();
              setIsAuthenticated(true);
              setUserEmail(session.user.email || null);
              setProfile(storageService.getProfile());
            } else {
              storageService.setUserId(null);
              storageService.clearMemoryState();
              setIsAuthenticated(false);
              setUserEmail(null);
            }
          });
        } catch (e) {
          console.error('Supabase session check error:', e);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
        return;
      }

      // 2. Production Security Enforcement:
      // If running in production mode and Supabase is not configured, NEVER allow local demo authentication bypass.
      if (isProductionMode) {
        storageService.setUserId(null);
        storageService.clearMemoryState();
        setIsAuthenticated(false);
        setUserEmail(null);
        setIsLoading(false);
        return;
      }

      // 3. Development / Local Demo Mode Only:
      // Validate that local session token is valid and corresponds to an initialized owner hash & salt.
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      const expiry = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
      const email = localStorage.getItem(AUTH_STORAGE_KEYS.EMAIL);
      const storedHash = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_HASH);
      const storedSalt = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_SALT);

      // Reject arbitrary or injected tokens: both hash and salt must exist and token must have valid structure
      if (token && expiry && storedHash && storedSalt && token.startsWith('kai_demo_')) {
        const expiryTime = parseInt(expiry, 10);
        if (!isNaN(expiryTime) && Date.now() < expiryTime) {
          storageService.setUserId('local_owner');
          setIsAuthenticated(true);
          setUserEmail(email || 'owner@local.kai');
          setProfile(storageService.getProfile());
        } else {
          // Token expired: clear credentials
          localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
          localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);
          storageService.setUserId(null);
          storageService.clearMemoryState();
          setIsAuthenticated(false);
          setUserEmail(null);
        }
      } else {
        storageService.setUserId(null);
        storageService.clearMemoryState();
        setIsAuthenticated(false);
        setUserEmail(null);
      }

      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Setup owner account in local demo mode (disabled in production)
  const setupOwnerAccount = async (
    password: string,
    email: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isProductionMode) {
      return {
        success: false,
        error: 'Local owner setup is disabled in production. Please configure Supabase Auth.'
      };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid owner email address.' };
    }

    try {
      const salt = generateRandomSalt();
      const hash = await hashPasswordWithSalt(password, salt);

      localStorage.setItem(AUTH_STORAGE_KEYS.OWNER_SALT, salt);
      localStorage.setItem(AUTH_STORAGE_KEYS.OWNER_HASH, hash);
      setIsOwnerConfigured(true);

      // Create structured demo session
      const token = `kai_demo_${Date.now()}_${generateRandomSalt().slice(0, 10)}`;
      const expiry = Date.now() + 24 * 60 * 60 * 1000;

      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
      localStorage.setItem(AUTH_STORAGE_KEYS.EMAIL, email);

      storageService.setUserId('local_owner');
      const newProfile: UserProfile = {
        ...profile,
        id: 'local_owner',
        email,
        display_name: displayName.trim() || 'Sensei Learner',
        updated_at: new Date().toISOString()
      };
      setProfile(newProfile);
      storageService.saveProfile(newProfile);

      setIsAuthenticated(true);
      setUserEmail(email);

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: 'Failed to configure owner credentials: ' + String(err) };
    }
  };

  // Sign In
  const loginWithPassword = async (
    password: string,
    email?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Mode A: Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email || profile.email,
          password
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.session) {
          storageService.setUserId(data.session.user.id);
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || null);
          await storageService.syncFromSupabase();
          setProfile(storageService.getProfile());
          setIsLoading(false);
          return { success: true };
        }
      } catch (e: unknown) {
        setIsLoading(false);
        return { success: false, error: (e as Error).message };
      }
    }

    // In production, block local fallback
    if (isProductionMode) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Production requires Supabase Auth. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }

    // Mode B: Local Demo Verification
    const storedHash = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_HASH);
    const storedSalt = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_SALT);

    if (!storedHash || !storedSalt) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No owner account configured yet. Complete the initial owner setup.'
      };
    }

    try {
      const computedHash = await hashPasswordWithSalt(password, storedSalt);
      const isMatch = constantTimeCompare(computedHash, storedHash);

      if (isMatch) {
        const token = `kai_demo_${Date.now()}_${generateRandomSalt().slice(0, 10)}`;
        const expiry = Date.now() + 24 * 60 * 60 * 1000;

        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
        localStorage.setItem(AUTH_STORAGE_KEYS.EMAIL, profile.email);

        storageService.setUserId('local_owner');
        setIsAuthenticated(true);
        setUserEmail(profile.email);
        setProfile(storageService.getProfile());
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Incorrect master password. Access denied.' };
      }
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: 'Authentication error: ' + String(err) };
    }
  };

  // Sign Up with Supabase
  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase is not configured. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || 'Sensei Learner'
          }
        }
      });

      setIsLoading(false);
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        storageService.setUserId(data.session.user.id);
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email || null);
        setProfile(storageService.getProfile());
        return { success: true };
      } else {
        return {
          success: true,
          error: 'Confirmation email sent. Please verify your email to log in.'
        };
      }
    } catch (e: unknown) {
      setIsLoading(false);
      return { success: false, error: (e as Error).message };
    }
  };

  // Secure Logout: cleans up active user session and clears in-memory state
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    // Remove auth tokens
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);

    // Unset user ID and clear all memory references
    storageService.clearMemoryState();
    storageService.setUserId(null);

    setIsAuthenticated(false);
    setUserEmail(null);
    setProfile(storageService.getProfile());
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userEmail,
        profile,
        isSupabaseMode: isSupabaseConfigured,
        isProductionMode,
        isOwnerConfigured,
        loginWithPassword,
        signUp,
        setupOwnerAccount,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
