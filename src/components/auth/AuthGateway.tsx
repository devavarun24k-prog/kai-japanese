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

interface AuthGatewayProps {
  onBackToLanding?: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onBackToLanding }) => {
  const {
    isSupabaseMode,
    isProductionMode,
    isOwnerConfigured,
    isPasswordRecovery,
    configuredOwnerEmail,
    loginWithPassword,
    signUp,
    resendConfirmationEmail,
    resetPasswordForEmail,
    updatePassword,
    setupOwnerAccount
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'setup' | 'forgot' | 'reset'>(
    !isSupabaseMode && !isOwnerConfigured ? 'setup' : 'signin'
  );

  const [email, setEmail] = useState<string>(configuredOwnerEmail || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  React.useEffect(() => {
    if (configuredOwnerEmail && !email) {
      setEmail(configuredOwnerEmail);
    }
  }, [configuredOwnerEmail]);

  // Automatically switch to password reset mode when recovery token is detected in URL
  React.useEffect(() => {
    if (isPasswordRecovery) {
      setMode('reset');
      setErrorMsg(null);
      setSuccessNotice('Security verification confirmed. Please set your new master password below.');
    }
  }, [isPasswordRecovery]);

  const handleResendEmail = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address to resend verification.');
      return;
    }
    setIsResending(true);
    setErrorMsg(null);
    const res = await resendConfirmationEmail(email);
    setIsResending(false);
    if (res.success) {
      setSuccessNotice('Verification email resent. Please check your inbox and spam folder.');
    } else {
      setErrorMsg(res.error || 'Failed to resend confirmation email.');
    }
  };

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
        if (isSupabaseMode && !email.trim()) {
          setIsLoading(false);
          setErrorMsg('Please enter your registered email address.');
          soundEffects.playWrong();
          return;
        }

        const res = await loginWithPassword(password, email || undefined);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
        } else {
          setErrorMsg(res.error || 'Incorrect authentication credentials.');
          soundEffects.playWrong();
        }
      } else if (mode === 'signup') {
        if (
          errorMsg &&
          (errorMsg.toLowerCase().includes('rate limit') ||
            errorMsg.toLowerCase().includes('already registered') ||
            errorMsg.toLowerCase().includes('already exists'))
        ) {
          setIsLoading(false);
          setMode('signin');
          setErrorMsg(null);
          return;
        }

        const res = await signUp(email, password, displayName);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
          if (res.error) {
            setSuccessNotice(res.error);
            setMode('signin');
          }
        } else {
          setErrorMsg(res.error || 'Registration failed.');
          soundEffects.playWrong();
        }
      } else if (mode === 'forgot') {
        if (!email.trim() || !email.includes('@')) {
          setIsLoading(false);
          setErrorMsg('Please enter your registered owner email address.');
          soundEffects.playWrong();
          return;
        }

        const res = await resetPasswordForEmail(email);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
          setSuccessNotice(`Password recovery link dispatched to ${email}. Please check your inbox and spam folder.`);
        } else {
          setErrorMsg(res.error || 'Failed to send password recovery link.');
          soundEffects.playWrong();
        }
      } else if (mode === 'reset') {
        if (password.length < 8) {
          setIsLoading(false);
          setErrorMsg('Password must be at least 8 characters long.');
          soundEffects.playWrong();
          return;
        }
        if (password !== confirmPassword) {
          setIsLoading(false);
          setErrorMsg('Passwords do not match.');
          soundEffects.playWrong();
          return;
        }

        const res = await updatePassword(password);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
          setSuccessNotice('Master password successfully updated! You may now sign in.');
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        } else {
          setErrorMsg(res.error || 'Failed to update password.');
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
        {/* Back to Cinematic Landing Page if accessible */}
        {onBackToLanding && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-kai-muted hover:text-kai-vermilion transition-colors -mt-2 mb-1"
            >
              <span>← 界ワールドへ戻る (Back to World)</span>
            </button>
          </div>
        )}

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
                ? (configuredOwnerEmail ? `Single-Owner Protected (${configuredOwnerEmail})` : 'Secured with Supabase Authentication & RLS')
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
            {/* Mode Selector / Single-Owner Status */}
            {isSupabaseMode && !configuredOwnerEmail && mode !== 'forgot' && mode !== 'reset' && (
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

            {isSupabaseMode && configuredOwnerEmail && mode === 'signin' && (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-100/80 dark:bg-kai-dark-bg border border-kai-border/60 text-xs text-kai-ink dark:text-white">
                <div className="flex items-center gap-2">
                  <Lock size={13} className="text-kai-vermilion flex-shrink-0" />
                  <span className="font-semibold text-2xs">Owner Access Only</span>
                </div>
                <span className="text-3xs font-mono text-kai-muted px-2 py-0.5 rounded bg-white dark:bg-kai-dark-card border border-kai-border/50">
                  Public Signup Disabled
                </span>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Key size={13} className="text-amber-600 flex-shrink-0" />
                  <span className="font-semibold text-2xs">Master Password Recovery</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className="text-3xs underline text-amber-700 dark:text-amber-300 hover:text-amber-900"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-kai-green flex-shrink-0" />
                  <span className="font-semibold text-2xs">Set New Master Password</span>
                </div>
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

          {(isSupabaseMode || mode === 'setup') && mode !== 'reset' && (
            <div className="space-y-1">
              <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
                {configuredOwnerEmail ? 'Owner Email Address' : 'Email Address'}
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

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
                {mode === 'setup'
                  ? 'Set Master Owner Password'
                  : mode === 'reset'
                  ? 'New Master Password'
                  : 'Master Password'}
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === 'setup' || mode === 'reset'
                      ? 'Minimum 8 characters...'
                      : 'Enter your password...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
                />
              </div>

              {mode === 'signin' && isSupabaseMode && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessNotice(null);
                    }}
                    className="text-3xs text-kai-muted hover:text-kai-vermilion transition-colors"
                  >
                    Forgot master password?
                  </button>
                </div>
              )}
            </div>
          )}

          {(mode === 'setup' || mode === 'reset') && (
            <div className="space-y-1">
              <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
                {mode === 'reset' ? 'Confirm New Password' : 'Confirm Master Password'}
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
            <div
              className={`p-4 rounded-2xl border text-xs space-y-3 ${
                errorMsg.toLowerCase().includes('rate limit') ||
                errorMsg.toLowerCase().includes('already registered') ||
                errorMsg.toLowerCase().includes('already exists')
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  size={17}
                  className={`flex-shrink-0 mt-0.5 ${
                    errorMsg.toLowerCase().includes('rate limit') ||
                    errorMsg.toLowerCase().includes('already registered') ||
                    errorMsg.toLowerCase().includes('already exists')
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                />
                <div className="space-y-1">
                  <p className="font-bold">
                    {errorMsg.toLowerCase().includes('rate limit')
                      ? 'Email Rate Limit Reached'
                      : errorMsg.toLowerCase().includes('already registered') ||
                        errorMsg.toLowerCase().includes('already exists')
                      ? 'Account Already Registered'
                      : 'Authentication Notice'}
                  </p>
                  <p className="leading-relaxed text-2xs opacity-90">{errorMsg}</p>
                </div>
              </div>

              {/* Actionable Guidance for Rate Limits & Existing Accounts */}
              {(errorMsg.toLowerCase().includes('rate limit') ||
                errorMsg.toLowerCase().includes('already registered') ||
                errorMsg.toLowerCase().includes('already exists')) && (
                <div className="pt-2.5 border-t border-amber-200 dark:border-amber-900/60 space-y-2.5 text-2xs">
                  <div className="p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 space-y-1 text-3xs leading-relaxed">
                    <p className="font-bold">Important Notice:</p>
                    <p>
                      An account for <strong>{email || 'this email'}</strong> was likely already registered. <strong>Do not submit repeated registration requests</strong>, as this prolongs Supabase&apos;s email rate limit.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-semibold text-kai-ink dark:text-amber-100">Recommended Next Steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-3xs text-kai-muted dark:text-amber-200/90 leading-normal">
                      <li>
                        <strong>Check your inbox &amp; spam folder:</strong> A confirmation link was sent during your initial registration.
                      </li>
                      <li>
                        <strong>Switch to Sign In:</strong> If you already clicked the link (or if email confirmation is turned off in Supabase), sign in with your password.
                      </li>
                      <li>
                        <strong>Wait for cooldown:</strong> Supabase free projects limit email dispatches to ~3 emails/hour. If you need a new confirmation email, please wait approximately 15–60 minutes.
                      </li>
                      <li>
                        <strong>Bypass email confirmation:</strong> If this is your personal system, turn OFF <em>&quot;Confirm email&quot;</em> in Supabase Dashboard &rarr; <em>Authentication</em> &rarr; <em>Providers</em> &rarr; <em>Email</em>.
                      </li>
                    </ul>
                  </div>

                  {mode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Switch to Sign In with {email || 'this email'}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              )}

              {/* Actionable Guidance for Unconfirmed Email on Sign-In */}
              {!errorMsg.toLowerCase().includes('rate limit') &&
                !errorMsg.toLowerCase().includes('already registered') &&
                errorMsg.toLowerCase().includes('email not confirmed') && (
                  <div className="pt-2 border-t border-red-200 dark:border-red-800/60 space-y-2 text-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-kai-muted dark:text-stone-300">Didn&apos;t receive or need a new link?</span>
                      <button
                        type="button"
                        disabled={isResending}
                        onClick={handleResendEmail}
                        className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/60 dark:hover:bg-red-800 text-red-900 dark:text-red-100 font-semibold transition-colors disabled:opacity-50"
                      >
                        {isResending ? 'Sending...' : 'Resend Link'}
                      </button>
                    </div>
                    <p className="text-3xs text-kai-muted dark:text-stone-400 leading-normal">
                      <strong>Tip:</strong> In Supabase Dashboard &rarr; <em>Authentication</em> &rarr; <em>Providers</em> &rarr; <em>Email</em>, turn OFF <em>&quot;Confirm email&quot;</em> for immediate single-owner sign-in.
                    </p>
                  </div>
                )}
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <p className="font-semibold">{successNotice}</p>
              {isSupabaseMode && (
                <p className="text-3xs text-kai-muted dark:text-stone-300">
                  If email confirmation is required, click the link in your email, then enter your password above to sign in.
                </p>
              )}
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
                ? (errorMsg && (errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('already registered'))
                  ? 'Switch to Sign In'
                  : 'Create Account')
                : mode === 'forgot'
                ? 'Send Password Recovery Link'
                : mode === 'reset'
                ? 'Update Master Password & Sign In'
                : 'Authenticate & Unlock KAI'}
            </span>
            <ArrowRight size={14} />
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className="w-full text-center text-2xs text-kai-muted hover:text-kai-ink dark:hover:text-white transition-colors pt-1"
            >
              &larr; Return to Sign In
            </button>
          )}

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className="w-full text-center text-2xs text-kai-muted hover:text-kai-ink dark:hover:text-white transition-colors pt-1"
            >
              Cancel &amp; Return to Sign In
            </button>
          )}
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
