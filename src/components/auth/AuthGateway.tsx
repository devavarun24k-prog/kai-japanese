// src/components/auth/AuthGateway.tsx
// "Midnight Matsuri + Sumi-e" Japanese Editorial Authentication Gateway
// Features:
// - Deep indigo matsuri backdrop (#0A101C -> #141D33) with Seigaiha waves and vignette
// - Left column: Enso calligraphy circle behind stroke-by-stroke InkKanji, vertical Japanese headline, SplitText entrance
// - Right column: Washi paper card (#F3EBDD) with static WashiTexture, sparse GoldFlecks, sumi (#14110F) typography
// - Floating-label inputs, visible focus rings, aria-live alerts, autocomplete attributes
// - MagneticButton with HankoStamp success seal
// - 100% preservation of all existing props, security rules, and Supabase auth calls.
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../services/soundEffects';
import {
  InkKanji,
  PetalField,
  MagneticButton,
  HankoStamp,
  SplitText,
  EnsoCircle,
  Seigaiha,
  WashiTexture,
  GoldFlecks
} from '../fx';
import { MascotKai } from '../common/MascotKai';

export interface AuthGatewayProps {
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

  const shouldReduceMotion = useReducedMotion();

  const [mode, setMode] = useState<'signin' | 'signup' | 'setup' | 'forgot' | 'reset'>(
    !isSupabaseMode && !isOwnerConfigured ? 'setup' : 'signin'
  );

  const [email, setEmail] = useState<string>(configuredOwnerEmail || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSuccessStamp, setIsSuccessStamp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  useEffect(() => {
    if (configuredOwnerEmail && !email) {
      setEmail(configuredOwnerEmail);
    }
  }, [configuredOwnerEmail, email]);

  // Automatically switch to password reset mode when recovery token is detected in URL
  useEffect(() => {
    if (isPasswordRecovery) {
      setMode('reset');
      setErrorMsg(null);
      setSuccessNotice('Security verification confirmed. Please set your new master password below.');
    }
  }, [isPasswordRecovery]);

  const triggerErrorShake = (message: string) => {
    setErrorMsg(message);
    setShakeKey((prev) => prev + 1);
    soundEffects.playWrong();
  };

  const handleResendEmail = async () => {
    if (!email) {
      triggerErrorShake('Please enter your email address to resend verification.');
      return;
    }
    setIsResending(true);
    setErrorMsg(null);
    const res = await resendConfirmationEmail(email);
    setIsResending(false);
    if (res.success) {
      setSuccessNotice('Verification email resent. Please check your inbox and spam folder.');
    } else {
      triggerErrorShake(res.error || 'Failed to resend confirmation email.');
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
          triggerErrorShake('Passwords do not match.');
          return;
        }

        const res = await setupOwnerAccount(password, email, displayName);
        setIsLoading(false);
        if (res.success) {
          setIsSuccessStamp(true);
          soundEffects.playLevelUp();
        } else {
          triggerErrorShake(res.error || 'Failed to setup master owner credentials.');
        }
      } else if (mode === 'signin') {
        if (isSupabaseMode && !email.trim()) {
          setIsLoading(false);
          triggerErrorShake('Please enter your registered email address.');
          return;
        }

        const res = await loginWithPassword(password, email || undefined);
        setIsLoading(false);
        if (res.success) {
          setIsSuccessStamp(true);
          soundEffects.playLevelUp();
        } else {
          triggerErrorShake(res.error || 'Incorrect authentication credentials.');
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
          setIsSuccessStamp(true);
          soundEffects.playLevelUp();
          if (res.error) {
            setSuccessNotice(res.error);
            setMode('signin');
          }
        } else {
          triggerErrorShake(res.error || 'Registration failed.');
        }
      } else if (mode === 'forgot') {
        if (!email.trim() || !email.includes('@')) {
          setIsLoading(false);
          triggerErrorShake('Please enter your registered owner email address.');
          return;
        }

        const res = await resetPasswordForEmail(email);
        setIsLoading(false);
        if (res.success) {
          soundEffects.playLevelUp();
          setSuccessNotice(`Password recovery link dispatched to ${email}. Please check your inbox and spam folder.`);
        } else {
          triggerErrorShake(res.error || 'Failed to send password recovery link.');
        }
      } else if (mode === 'reset') {
        if (password.length < 8) {
          setIsLoading(false);
          triggerErrorShake('Password must be at least 8 characters long.');
          return;
        }
        if (password !== confirmPassword) {
          setIsLoading(false);
          triggerErrorShake('Passwords do not match.');
          return;
        }

        const res = await updatePassword(password);
        setIsLoading(false);
        if (res.success) {
          setIsSuccessStamp(true);
          soundEffects.playLevelUp();
          setSuccessNotice('Master password successfully updated! You may now sign in.');
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        } else {
          triggerErrorShake(res.error || 'Failed to update password.');
        }
      }
    } catch (err: unknown) {
      setIsLoading(false);
      triggerErrorShake('Unexpected error during authentication: ' + String(err));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A101C] bg-gradient-to-b from-[#0A101C] via-[#0E1626] to-[#141D33] text-[#F3EBDD] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden selection:bg-kai-vermilion selection:text-white">
      {/* Background Interactive Petal Field (Strictly pointer-events-none) */}
      <PetalField className="pointer-events-none z-0" interactive={true} />

      {/* Traditional Seigaiha ocean waves pattern at 6% opacity */}
      <Seigaiha color="#2E4370" opacity={0.06} size={54} />

      {/* Atmospheric Midnight Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,8,15,0.75)_100%)]"
        aria-hidden="true"
      />

      {/* Main Split Layout Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
        {/* =====================================================================
            LEFT COLUMN (DESKTOP) / BANNER (MOBILE): INK KANJI & SUMI-E TITLE
            ===================================================================== */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          {/* Back button on desktop */}
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#DDD2B8]/80 hover:text-kai-vermilion-light transition-colors rounded-lg px-2 py-1 -ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion"
            >
              <span>&larr; Back to Welcome Guide</span>
            </button>
          )}

          {/* Stroke-by-stroke Animated Ink Kanji with Enso Calligraphy Background */}
          <div className="relative flex items-center justify-center py-2">
            {/* Dynamic Enso Circle Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -m-4">
              <EnsoCircle
                size={160}
                color="#C59B27"
                opacity={0.32}
                duration={1.8}
                delay={0.1}
              />
            </div>

            {/* InkKanji Box with dark lacquer finish */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-3xl bg-[#14110F]/80 border border-[#2E4370]/50 shadow-2xl backdrop-blur-md flex items-center justify-center">
              <InkKanji
                size={96}
                duration={1.8}
                color="#D9483B"
                className="drop-shadow-[0_2px_8px_rgba(217,72,59,0.35)]"
              />
            </div>

            {/* Subtle decorative stamp watermark */}
            <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none opacity-90">
              <span className="font-serif_jp text-3xs font-bold text-[#E2BA4E] uppercase border border-[#C59B27]/70 px-1.5 py-0.5 rounded bg-[#0A101C]/90 shadow-sm">
                日本語
              </span>
            </div>
          </div>

          {/* Staggered Title & Tagline in Noto Serif JP with Vertical Calligraphy Accent */}
          <div className="space-y-3 relative">
            <div className="flex items-start justify-center lg:justify-start gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-serif_jp font-bold tracking-tight text-[#FAF5ED]">
                  <SplitText text="KAI — 界" by="characters" delay={0.2} />
                </h1>

                <div className="space-y-1.5">
                  <SplitText
                    text="一文字から始まる、本格的な日本語の世界へ。"
                    by="characters"
                    delay={1.4}
                    duration={0.4}
                    className="font-serif_jp text-sm sm:text-base font-semibold text-[#F3EBDD] block"
                  />
                  <SplitText
                    text="Master Japanese from zero — naturally, playfully, completely."
                    by="words"
                    delay={1.8}
                    duration={0.4}
                    className="text-xs text-[#DDD2B8]/80 block leading-relaxed"
                  />
                </div>
              </div>

              {/* Vertical Japanese Calligraphy Accent (Desktop) */}
              <div className="hidden lg:block pt-1 select-none">
                <span
                  className="font-serif_jp text-xs text-[#C59B27] tracking-[0.35em] opacity-80 block border-l border-[#C59B27]/30 pl-2"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                  真の日本語・唯一の門
                </span>
              </div>
            </div>
          </div>

          {/* Security & Access Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141D33]/70 border border-[#2E4370]/60 text-3xs font-mono text-[#DDD2B8] backdrop-blur-sm">
            <ShieldCheck size={13} className="text-[#3C9B64]" />
            <span>
              {isSupabaseMode
                ? configuredOwnerEmail
                  ? `Single-Owner Protected (${configuredOwnerEmail})`
                  : 'Secured with Supabase Authentication & RLS'
                : isProductionMode
                ? 'Production Mode: Supabase Required'
                : 'Local Demo Mode (Development Only)'}
            </span>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: WASHI PAPER AUTH CARD (#F3EBDD) WITH SUMI TYPOGRAPHY
            ===================================================================== */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={
            shakeKey > 0
              ? {
                  x: [-8, 8, -6, 6, -3, 3, 0],
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4 }
                }
              : { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } }
          }
          className="relative lg:col-span-7 w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-[#F3EBDD] text-[#14110F] border border-[#DDD2B8] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden space-y-6"
        >
          {/* Authentic Mulberry Paper Texture (Zero CPU cost) */}
          <WashiTexture opacity={0.07} tone="light" />

          {/* Sparse Kinpaku Gold Leaf Flecks */}
          <GoldFlecks density="sparse" />

          {/* Card Top: Mode Header & Mascot */}
          <div className="relative z-10 flex items-center justify-between gap-4 border-b border-[#DDD2B8] pb-4">
            <div>
              <h2 className="text-lg font-bold font-serif_jp text-[#14110F]">
                {mode === 'setup'
                  ? 'Initialize Owner Account'
                  : mode === 'signup'
                  ? 'Register Sanctuary Account'
                  : mode === 'forgot'
                  ? 'Master Password Recovery'
                  : mode === 'reset'
                  ? 'Set New Master Password'
                  : 'Enter Learning Sanctuary'}
              </h2>
              <p className="text-2xs text-[#524B42] mt-0.5">
                {configuredOwnerEmail && mode === 'signin'
                  ? 'Single-owner access control enabled'
                  : 'Access your private lessons, voice notes, and FSRS progress'}
              </p>
            </div>

            {/* Mascot Presence */}
            <MascotKai
              mood={
                isSuccessStamp
                  ? 'celebrating'
                  : isLoading
                  ? 'thinking'
                  : errorMsg
                  ? 'reacting_to_mistake'
                  : 'welcoming'
              }
              size="xs"
              interactive={false}
            />
          </div>

          {/* Production requirement block if Supabase not configured in prod */}
          {isProductionMode && !isSupabaseMode ? (
            <div className="relative z-10 p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
                <span>Production Setup Required</span>
              </div>
              <p className="text-2xs text-[#524B42] leading-relaxed">
                To guarantee single-owner data isolation and PostgreSQL Row Level Security, KAI requires Supabase Auth in production builds. Local authentication is disabled in production.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-3xs font-mono space-y-0.5 text-[#14110F]">
                <p className="text-kai-vermilion">VITE_SUPABASE_URL=https://&lt;project&gt;.supabase.co</p>
                <p className="text-[#1E2C4A]">VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-5">
              {/* Tab Selector between Sign In and Register */}
              {isSupabaseMode && !configuredOwnerEmail && mode !== 'forgot' && mode !== 'reset' && (
                <div className="flex items-center p-1 rounded-2xl bg-[#E8DEC8] border border-[#DDD2B8] text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion ${
                      mode === 'signin'
                        ? 'bg-white text-[#14110F] shadow-sm'
                        : 'text-[#635F59] hover:text-[#14110F]'
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
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion ${
                      mode === 'signup'
                        ? 'bg-white text-[#14110F] shadow-sm'
                        : 'text-[#635F59] hover:text-[#14110F]'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Forgot password switch pill */}
              {mode === 'forgot' && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <span className="font-semibold text-2xs text-amber-900">
                    Password Recovery Mode
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                    }}
                    className="text-3xs underline text-amber-700 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion rounded"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}

              {/* Status Message Containers with ARIA LIVE */}
              <div aria-live="polite" className="space-y-3">
                {errorMsg && (
                  <div
                    role="alert"
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 animate-in fade-in duration-200 ${
                      errorMsg.toLowerCase().includes('rate limit') ||
                      errorMsg.toLowerCase().includes('already registered') ||
                      errorMsg.toLowerCase().includes('already exists')
                        ? 'bg-amber-50 text-amber-950 border-amber-300'
                        : 'bg-red-50 text-red-950 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle
                        size={16}
                        className={`flex-shrink-0 mt-0.5 ${
                          errorMsg.toLowerCase().includes('rate limit') ||
                          errorMsg.toLowerCase().includes('already registered') ||
                          errorMsg.toLowerCase().includes('already exists')
                            ? 'text-amber-600'
                            : 'text-red-600'
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

                    {/* Rate limit guidance */}
                    {(errorMsg.toLowerCase().includes('rate limit') ||
                      errorMsg.toLowerCase().includes('already registered') ||
                      errorMsg.toLowerCase().includes('already exists')) && (
                      <div className="pt-2 border-t border-amber-200 space-y-2 text-2xs">
                        <p className="text-3xs text-[#524B42] leading-normal">
                          An account for <strong>{email || 'this email'}</strong> was already created. If you need a new confirmation email, please wait approximately 15–60 minutes for the provider cooldown.
                        </p>
                        {mode === 'signup' && (
                          <button
                            type="button"
                            onClick={() => {
                              setMode('signin');
                              setErrorMsg(null);
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion"
                          >
                            <span>Switch to Sign In with {email || 'this email'}</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Unconfirmed email resend guidance */}
                    {!errorMsg.toLowerCase().includes('rate limit') &&
                      !errorMsg.toLowerCase().includes('already registered') &&
                      errorMsg.toLowerCase().includes('email not confirmed') && (
                        <div className="pt-2 border-t border-red-200 flex items-center justify-between gap-2 text-2xs">
                          <span className="text-[#524B42]">Need a new confirmation link?</span>
                          <button
                            type="button"
                            disabled={isResending}
                            onClick={handleResendEmail}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion"
                          >
                            {isResending ? 'Sending...' : 'Resend Link'}
                          </button>
                        </div>
                      )}
                  </div>
                )}

                {successNotice && (
                  <div
                    role="status"
                    className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200"
                  >
                    <CheckCircle2 size={16} className="text-[#2D7A4D] flex-shrink-0" />
                    <p className="font-semibold text-2xs leading-snug">{successNotice}</p>
                  </div>
                )}
              </div>

              {/* Interactive Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Display Name (Setup or Signup) */}
                {(mode === 'setup' || mode === 'signup') && (
                  <div className="relative">
                    <input
                      id="auth-display-name"
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder=" "
                      autoComplete="name"
                      className="peer w-full px-4 pt-5 pb-2 rounded-2xl bg-white/90 border border-[#DDD2B8] text-xs text-[#14110F] placeholder-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion focus-visible:border-transparent transition-all shadow-sm"
                    />
                    <label
                      htmlFor="auth-display-name"
                      className="absolute left-4 top-2 text-3xs font-mono font-bold uppercase text-[#6B6358] transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-3xs peer-focus:font-mono peer-focus:font-bold peer-focus:text-kai-vermilion"
                    >
                      Display Title / Name
                    </label>
                  </div>
                )}

                {/* 2. Email Address (Supabase or Setup) */}
                {(isSupabaseMode || mode === 'setup') && mode !== 'reset' && (
                  <div className="relative">
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      autoComplete="email"
                      className="peer w-full px-4 pt-5 pb-2 rounded-2xl bg-white/90 border border-[#DDD2B8] text-xs text-[#14110F] placeholder-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion focus-visible:border-transparent transition-all shadow-sm"
                    />
                    <label
                      htmlFor="auth-email"
                      className="absolute left-4 top-2 text-3xs font-mono font-bold uppercase text-[#6B6358] transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-3xs peer-focus:font-mono peer-focus:font-bold peer-focus:text-kai-vermilion"
                    >
                      {configuredOwnerEmail ? 'Configured Owner Email' : 'Email Address'}
                    </label>
                  </div>
                )}

                {/* 3. Password */}
                {mode !== 'forgot' && (
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      className="peer w-full pl-4 pr-11 pt-5 pb-2 rounded-2xl bg-white/90 border border-[#DDD2B8] text-xs text-[#14110F] placeholder-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion focus-visible:border-transparent transition-all shadow-sm"
                    />
                    <label
                      htmlFor="auth-password"
                      className="absolute left-4 top-2 text-3xs font-mono font-bold uppercase text-[#6B6358] transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-3xs peer-focus:font-mono peer-focus:font-bold peer-focus:text-kai-vermilion"
                    >
                      {mode === 'setup'
                        ? 'Master Owner Password'
                        : mode === 'reset'
                        ? 'New Master Password (8+ chars)'
                        : 'Master Password'}
                    </label>

                    {/* Show/Hide Password Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#6B6358] hover:text-[#14110F] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                )}

                {/* 4. Confirm Password (Setup, Signup, Reset) */}
                {(mode === 'setup' || mode === 'signup' || mode === 'reset') && (
                  <div className="relative">
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=" "
                      autoComplete="new-password"
                      className="peer w-full pl-4 pr-11 pt-5 pb-2 rounded-2xl bg-white/90 border border-[#DDD2B8] text-xs text-[#14110F] placeholder-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion focus-visible:border-transparent transition-all shadow-sm"
                    />
                    <label
                      htmlFor="auth-confirm-password"
                      className="absolute left-4 top-2 text-3xs font-mono font-bold uppercase text-[#6B6358] transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-3xs peer-focus:font-mono peer-focus:font-bold peer-focus:text-kai-vermilion"
                    >
                      Repeat Master Password
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#6B6358] hover:text-[#14110F] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                )}

                {/* Submit Action: MagneticButton transforms to HankoStamp on success */}
                <div className="pt-2 flex justify-center">
                  {isSuccessStamp ? (
                    <div className="flex flex-col items-center gap-2 py-1">
                      <HankoStamp text="界" size={60} shape="square" playSound={true} />
                      <span className="text-2xs font-mono font-bold text-kai-vermilion uppercase tracking-widest animate-pulse">
                        Access Verified
                      </span>
                    </div>
                  ) : (
                    <MagneticButton
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-6 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion transition-all disabled:opacity-40 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EBDD]"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Validating Credentials...</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span>
                            {mode === 'setup'
                              ? 'Initialize Sanctuary Master'
                              : mode === 'signup'
                              ? 'Create Learning Account'
                              : mode === 'forgot'
                              ? 'Send Recovery Link'
                              : mode === 'reset'
                              ? 'Update Master Password'
                              : 'Unlock KAI Sanctuary'}
                          </span>
                          <ArrowRight size={14} />
                        </span>
                      )}
                    </MagneticButton>
                  )}
                </div>

                {/* Mode switch shortcuts */}
                {isSupabaseMode && mode === 'signin' && (
                  <div className="pt-1 flex items-center justify-between text-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessNotice(null);
                      }}
                      className="text-[#524B42] hover:text-kai-vermilion transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion rounded"
                    >
                      Forgot password?
                    </button>

                    {!configuredOwnerEmail && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setErrorMsg(null);
                        }}
                        className="text-[#524B42] hover:text-kai-vermilion transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion rounded"
                      >
                        Create an account &rarr;
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
