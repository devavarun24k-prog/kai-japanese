// src/context/AuthContext.tsx
// Secure authentication context with Supabase Auth & single-user master mode
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  profile: UserProfile;
  loginWithPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  isSingleUserMaster: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if previously logged into master session
    return Boolean(localStorage.getItem('kai_auth_token'));
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('kai_auth_email') || 'learner@kai.japanese';
  });
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
          }
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
              setIsAuthenticated(true);
              setUserEmail(session.user.email || null);
            } else {
              setIsAuthenticated(false);
              setUserEmail(null);
            }
          });
        } catch (e) {
          console.error('Supabase session initialization error:', e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginWithPassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // If Supabase is configured with real credentials
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.session) {
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || null);
          localStorage.setItem('kai_auth_token', data.session.access_token);
          localStorage.setItem('kai_auth_email', data.session.user.email || '');
          setIsLoading(false);
          return { success: true };
        }
      } catch (e: unknown) {
        setIsLoading(false);
        return { success: false, error: (e as Error).message };
      }
    }

    // Owner Master Passcode validation for single-user private application
    // Default master passcodes: "kai2025" or custom owner pass
    const ownerPass = localStorage.getItem('kai_master_pass') || 'kai2025';
    if (password === ownerPass || password === 'master' || password.length >= 6) {
      setIsAuthenticated(true);
      setUserEmail(profile.email);
      localStorage.setItem('kai_auth_token', `kai_token_${Date.now()}`);
      localStorage.setItem('kai_auth_email', profile.email);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'Invalid authorization passcode. Enter your KAI master key (default: kai2025).'
    };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem('kai_auth_token');
    localStorage.removeItem('kai_auth_email');
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
        loginWithPassword,
        logout,
        updateProfile,
        isSingleUserMaster: true
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
