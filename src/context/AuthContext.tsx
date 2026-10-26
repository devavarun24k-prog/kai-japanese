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

// Single-owner authorization: locked to designated owner email if configured
export const CONFIGURED_OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL as string | undefined)?.trim().toLowerCase() || null;

// Dynamic redirect URL adapter: adapts dynamically to current origin (localhost, staging, or production domain)
export const getRedirectUrl = (): string | undefined => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return undefined;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  profile: UserProfile;
  isSupabaseMode: boolean;
  isProductionMode: boolean;
  isOwnerConfigured: boolean;
  isPasswordRecovery: boolean;
  configuredOwnerEmail: string | null;
  loginWithPassword: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
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
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);
  const [isOwnerConfigured, setIsOwnerConfigured] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_HASH));
  });

  useEffect(() => {
    const checkSession = async () => {
      // 1. Primary path: Supabase Auth (Mandatory in production)
      if (isSupabaseConfigured && supabase) {
        const client = supabase;
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session && session.user) {
            // Explicit single-owner check: if configured, reject any non-owner session
            if (CONFIGURED_OWNER_EMAIL && session.user.email?.toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
              await client.auth.signOut();
              storageService.setUserId(null);
              storageService.clearMemoryState();
              setIsAuthenticated(false);
              setUserEmail(null);
              setProfile(storageService.getProfile());
              setIsLoading(false);
              return;
            }

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

          client.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
              setIsPasswordRecovery(true);
              return;
            }

            if (session && session.user) {
              // Explicit single-owner check: if configured, reject any non-owner session
              if (CONFIGURED_OWNER_EMAIL && session.user.email?.toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
                await client.auth.signOut();
                storageService.setUserId(null);
                storageService.clearMemoryState();
                setIsAuthenticated(false);
                setUserEmail(null);
                setProfile(storageService.getProfile());
                return;
              }

              storageService.setUserId(session.user.id);
              setIsAuthenticated(true);
              setUserEmail(session.user.email || null);
              setProfile(storageService.getProfile());
              storageService.syncFromSupabase().then(() => {
                setProfile(storageService.getProfile());
              }).catch(console.warn);
            } else {
              storageService.setUserId(null);
              storageService.clearMemoryState();
              setIsAuthenticated(false);
              setUserEmail(null);
              setProfile(storageService.getProfile());
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
    // Mode A: Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const targetEmail = (email || userEmail || profile.email || '').trim();
        if (!targetEmail) {
          return { success: false, error: 'Please enter your registered email address.' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password
        });

        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            return {
              success: false,
              error: 'Email not confirmed. Please check your inbox for the Supabase confirmation link, or disable "Confirm email" in Supabase Auth settings.'
            };
          }
          return { success: false, error: error.message };
        }

        if (data.session && data.session.user) {
          // Explicit single-owner check: if configured, reject non-owner credentials
          if (CONFIGURED_OWNER_EMAIL && data.session.user.email?.toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
            await supabase.auth.signOut();
            storageService.setUserId(null);
            storageService.clearMemoryState();
            setIsAuthenticated(false);
            setUserEmail(null);
            return {
              success: false,
              error: `Access Denied: This KAI instance is locked to authorized single-owner access. Account ${data.session.user.email} is not authorized.`
            };
          }

          storageService.setUserId(data.session.user.id);
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || null);
          setProfile(storageService.getProfile());

          // Sync data from Supabase in background without blocking UI entry
          storageService.syncFromSupabase().then(() => {
            setProfile(storageService.getProfile());
          }).catch(console.warn);

          return { success: true };
        }
      } catch (e: unknown) {
        return { success: false, error: (e as Error).message };
      }
    }

    // In production, block local fallback
    if (isProductionMode) {
      return {
        success: false,
        error: 'Production requires Supabase Auth. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }

    // Mode B: Local Demo Verification
    const storedHash = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_HASH);
    const storedSalt = localStorage.getItem(AUTH_STORAGE_KEYS.OWNER_SALT);

    if (!storedHash || !storedSalt) {
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
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect master password. Access denied.' };
      }
    } catch (err: unknown) {
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

    // Single-owner enforcement: prevent registering arbitrary accounts
    if (CONFIGURED_OWNER_EMAIL && email.trim().toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
      return {
        success: false,
        error: 'Registration Blocked: Single-owner mode is active. Only the designated owner account is permitted.'
      };
    }

    try {
      const redirectUrl = getRedirectUrl();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: (displayName || 'Sensei Learner').trim()
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        const isRateLimit =
          error.message.toLowerCase().includes('rate limit') ||
          error.status === 429 ||
          (error as { code?: string }).code === 'over_email_send_rate_limit' ||
          (error as { code?: string }).code === 'email_rate_limit_exceeded';

        if (isRateLimit) {
          return {
            success: false,
            error:
              'Email rate limit exceeded. An account for this email may already have been created. Please check your inbox for the earlier confirmation link or switch to Sign In.'
          };
        }
        return { success: false, error: error.message };
      }

      // Detect when email is already registered and enumeration protection is enabled
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          success: false,
          error:
            'An account with this email is already registered. Please check your inbox for the earlier confirmation link or switch to Sign In.'
        };
      }

      if (data.session && data.session.user) {
        // Explicit single-owner check on direct session creation
        if (CONFIGURED_OWNER_EMAIL && data.session.user.email?.toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
          await supabase.auth.signOut();
          storageService.setUserId(null);
          storageService.clearMemoryState();
          setIsAuthenticated(false);
          setUserEmail(null);
          return {
            success: false,
            error: 'Registration Blocked: Registered account does not match designated owner configuration.'
          };
        }

        storageService.setUserId(data.session.user.id);
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email || null);
        setProfile(storageService.getProfile());

        storageService.syncFromSupabase().then(() => {
          setProfile(storageService.getProfile());
        }).catch(console.warn);

        return { success: true };
      } else {
        return {
          success: true,
          error: 'Account registered! A confirmation email has been sent. Please verify your email to log in, or disable "Confirm email" in Supabase Dashboard.'
        };
      }
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message };
    }
  };

  // Resend Confirmation Email
  const resendConfirmationEmail = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const redirectUrl = getRedirectUrl();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) {
        const isRateLimit =
          error.message.toLowerCase().includes('rate limit') ||
          error.status === 429 ||
          (error as { code?: string }).code === 'over_email_send_rate_limit' ||
          (error as { code?: string }).code === 'email_rate_limit_exceeded';

        if (isRateLimit) {
          return {
            success: false,
            error:
              'Email rate limit exceeded. Supabase limits how often confirmation emails can be sent. Please wait approximately 15–60 minutes before requesting another email.'
          };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message };
    }
  };

  // Request Password Reset Link
  const resetPasswordForEmail = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    const targetEmail = email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (CONFIGURED_OWNER_EMAIL && targetEmail.toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
      return {
        success: false,
        error: 'Password reset is only available for the designated owner account.'
      };
    }
    try {
      const redirectUrl = getRedirectUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: redirectUrl
      });
      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: 'Password reset rate limit reached. Please wait a few minutes before trying again.'
          };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message };
    }
  };

  // Update password (used during password recovery or profile update)
  const updatePassword = async (
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      setIsPasswordRecovery(false);
      return { success: true };
    } catch (e: unknown) {
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
        isPasswordRecovery,
        configuredOwnerEmail: CONFIGURED_OWNER_EMAIL,
        loginWithPassword,
        signUp,
        resendConfirmationEmail,
        resetPasswordForEmail,
        updatePassword,
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
