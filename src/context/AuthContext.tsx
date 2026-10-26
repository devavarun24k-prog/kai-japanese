// src/context/AuthContext.tsx
// Secure authentication context with Supabase Auth & cryptographic salted owner authentication
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';
import { hashPasswordWithSalt, generateRandomSalt, constantTimeCompare } from '../utils/crypto';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  profile: UserProfile;
  isSupabaseMode: boolean;
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
      // 1. Check Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            await storageService.syncFromSupabase();
            setProfile(storageService.getProfile());
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
          }

          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session && session.user) {
              setIsAuthenticated(true);
              setUserEmail(session.user.email || null);
              await storageService.syncFromSupabase();
              setProfile(storageService.getProfile());
            } else {
              setIsAuthenticated(false);
              setUserEmail(null);
            }
          });
        } catch (e) {
          console.error('Supabase session check error:', e);
        }
        setIsLoading(false);
        return;
      }

      // 2. Check local owner session token validity (24-hour expiration)
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      const expiry = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
      const email = localStorage.getItem(AUTH_STORAGE_KEYS.EMAIL);

      if (token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() < expiryTime) {
          setIsAuthenticated(true);
          setUserEmail(email || profile.email);
        } else {
          // Token expired: clear credentials
          localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
          localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);
          setIsAuthenticated(false);
          setUserEmail(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }

      setIsLoading(false);
    };

    checkSession();
  }, []);

  // First-time owner setup when Supabase is not configured
  const setupOwnerAccount = async (
    password: string,
    email: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long for adequate entropy.' };
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

      // Create session
      const token = `kai_owner_${Date.now()}_${generateRandomSalt().slice(0, 8)}`;
      const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
      localStorage.setItem(AUTH_STORAGE_KEYS.EMAIL, email);

      const newProfile: UserProfile = {
        ...profile,
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

    // Mode B: Cryptographic Salted Owner Verification
    const storedHash = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_HASH);
    const storedSalt = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_SALT);

    if (!storedHash || !storedSalt) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No owner account has been configured yet. Please complete the initial owner setup.'
      };
    }

    try {
      const computedHash = await hashPasswordWithSalt(password, storedSalt);
      const isMatch = constantTimeCompare(computedHash, storedHash);

      if (isMatch) {
        const token = `kai_owner_${Date.now()}_${generateRandomSalt().slice(0, 8)}`;
        const expiry = Date.now() + 24 * 60 * 60 * 1000;

        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
        localStorage.setItem(AUTH_STORAGE_KEYS.EMAIL, profile.email);

        setIsAuthenticated(true);
        setUserEmail(profile.email);
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
        error: 'Supabase is not configured in this environment. Set up an owner password or configure Supabase keys.'
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
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email || null);
        return { success: true };
      } else {
        return {
          success: true,
          error: 'Registration confirmation email sent. Please check your inbox to verify your email.'
        };
      }
    } catch (e: unknown) {
      setIsLoading(false);
      return { success: false, error: (e as Error).message };
    }
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);
    setIsAuthenticated(false);
    setUserEmail(null);
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
