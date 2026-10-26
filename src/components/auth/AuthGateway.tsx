// src/components/auth/AuthGateway.tsx
// Secure entry gateway ensuring unauthenticated users cannot access private learning data
import React, { useState } from 'react';
import {
  Lock,
  Key,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../services/soundEffects';

export const AuthGateway: React.FC = () => {
  const {
    isSupabaseMode,
    isProductionMode,
    isOwnerConfigured,
    loginWithPassword,
    signUp,
    setupOwnerAccount
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'setup'>(
    !isSupabaseMode && !isOwnerConfigured ? 'setup' : 'signin'
  );

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (mode === 'setup') {
        if (password !== confirmPassword) {
          setIsLoading(false);
          setErrorMsg('Passwords do not match.');
          soundEffects.playWrong();
          return;
        }

        const res = await setupOwnerAccount(password, email, displayName);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
        } else {
          setErrorMsg(res.error || 'Failed to setup master owner credentials.');
          soundEffects.playWrong();
        }
      } else if (mode === 'signin') {
        const res = await loginWithPassword(password, email || undefined);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
        } else {
          setErrorMsg(res.error || 'Incorrect authentication credentials.');
          soundEffects.playWrong();
        }
      } else if (mode === 'signup') {
        const res = await signUp(email, password, displayName);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
          if (res.error) {
            setSuccessNotice(res.error);
          }
        } else {
          setErrorMsg(res.error || 'Registration failed.');
          soundEffects.playWrong();
        }
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMsg('Unexpected error during authentication: ' + String(err));
      soundEffects.playWrong();
    }
  };

  return (
    <div className="min-h-screen bg-kai-bg dark:bg-kai-dark-bg flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-2xl space-y-6 animate-in fade-in duration-300">
        {/* Brand Crest & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark text-white flex items-center justify-center mx-auto shadow-vermilion">
            <span className="font-serif_jp font-bold text-2xl tracking-wider">界</span>
          </div>

          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
            KAI — 日本語マスター
          </h1>

          <p className="text-xs text-kai-muted font-sans leading-relaxed">
            Personal Japanese Mastery Platform. Private single-user access control.
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-kai-dark-bg text-3xs font-mono text-kai-muted">
            <ShieldCheck size={12} className="text-kai-green" />
            <span>
              {isSupabaseMode
                ? 'Secured with Supabase Authentication & RLS'
                : isProductionMode
                ? 'Production Mode: Supabase Required'
                : 'Local Demo Mode (Development Only)'}
            </span>
          </div>
        </div>

        {/* In production mode without Supabase, block local fallback */}
        {isProductionMode && !isSupabaseMode ? (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/50 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <span>Production Setup Required</span>
            </div>
            <p className="text-kai-muted dark:text-amber-100/90 leading-relaxed text-2xs">
              To guarantee data privacy and enforce PostgreSQL Row Level Security, KAI requires Supabase Auth in production builds. Local demo authentication is disabled in production to prevent client-side bypasses.
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-kai-dark-card border border-amber-200 dark:border-amber-900/40 text-3xs font-mono text-kai-ink dark:text-white space-y-1">
              <p className="font-bold text-kai-muted">Required Environment Variables:</p>
              <p className="text-kai-vermilion">VITE_SUPABASE_URL=https://&lt;project&gt;.supabase.co</p>
              <p className="text-kai-indigo">VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
            </div>
            <p className="text-3xs text-kai-muted">
              Configure these variables in your hosting environment (e.g. Vercel, Netlify) or local .env file and reload.
            </p>
          </div>
        ) : (
          <>
            {/* Mode Selector for Supabase mode */}
            {isSupabaseMode && (
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-bg border border-kai-border/50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-kai-dark-card text-kai-ink dark:text-white shadow-sm'
                      : 'text-kai-muted'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-kai-dark-card text-kai-ink dark:text-white shadow-sm'
                      : 'text-kai-muted'
                  }`}
                >
                  Register Account
                </button>
              </div>
            )}

            {/* Initial Setup Banner if not configured in demo mode */}
            {!isSupabaseMode && !isOwnerConfigured && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Local Demo Setup:</span>
                </span>
                <p className="text-2xs leading-relaxed opacity-90">
                  Set a local demo password for development testing. In production, Supabase Auth is strictly required.
                </p>
              </div>
            )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'setup' || mode === 'signup') && (
            <div className="space-y-1">
              <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
                Your Name / Display Title
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Apprentice Sensei"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
                />
              </div>
            </div>
          )}

          {(isSupabaseMode || mode === 'setup') && (
            <div className="space-y-1">
              <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
                Owner Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
              {mode === 'setup' ? 'Set Master Owner Password' : 'Password / Passcode'}
            </label>
            <div className="relative">
              <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'setup' ? 'Minimum 8 characters...' : 'Enter your password...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
              />
            </div>
          </div>

          {mode === 'setup' && (
            <div className="space-y-1">
              <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
                Confirm Master Password
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat master password..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-900 dark:text-green-200 border border-green-200 dark:border-green-800 text-xs">
              {successNotice}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion transition-transform active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <span>
              {isLoading
                ? 'Validating Access...'
                : mode === 'setup'
                ? 'Initialize Owner Account & Unlock'
                : mode === 'signup'
                ? 'Create Account'
                : 'Authenticate & Unlock KAI'}
            </span>
            <ArrowRight size={14} />
          </button>
        </form>
        </>
        )}

        {/* Footer Info */}
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border/70 text-3xs text-kai-muted text-center space-y-1">
          <p>Single-user private architecture. Session expires automatically.</p>
          <p className="font-mono text-kai-faint">
            KAI v1.0.0 • Supabase Auth & Web Crypto Powered
          </p>
        </div>
      </div>
    </div>
  );
};
