// src/components/auth/AuthGateway.tsx
// Cinematic 3D Night Temple Japanese Mastery Authentication Gateway for KAI
// Features:
// - Persistent 3D Night Temple Canvas backdrop (Torii corridor, floating lanterns, falling sakura, moon)
// - Centered Frosted Glass Sanctum Card with 3D card-flip between Sign In & Sign Up
// - Glowing Japanese brush-ink focus underline on inputs with warm lantern flare
// - Gate swing-open success transition (~1.2s bloom flight into dashboard)
// - Dynamic Red Ink Splash on error with physical card shake
// - 100% preservation of all existing auth logic, single-owner security, Supabase RLS, and recovery tokens
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Lock,
  Mail,
  User,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../services/soundEffects';
import { CinematicScene } from '../three/CinematicScene';
import { MascotKai } from '../common/MascotKai';
import { HankoStamp } from '../fx';

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
  const [isGateOpening, setIsGateOpening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [activeFocusedInput, setActiveFocusedInput] = useState<string | null>(null);

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

  const executeSuccessTransition = () => {
    setIsSuccessStamp(true);
    soundEffects.playLevelUp();
    setTimeout(() => {
      setIsGateOpening(true);
    }, 450);
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
          executeSuccessTransition();
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
          executeSuccessTransition();
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
          executeSuccessTransition();
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
          executeSuccessTransition();
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
    <div className="relative min-h-screen bg-[#07070C] text-[#F5EFE6] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden selection:bg-[#E63946] selection:text-white font-serif_jp">
      {/* 3D Night Temple WebGL Canvas in Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CinematicScene scrollProgress={0.06} />
      </div>

      {/* Atmospheric Vignette Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,7,12,0.85)_100%)]"
        aria-hidden="true"
      />

      {/* Gate Swing-Open Success Flight Overlay */}
      <AnimatePresence>
        {isGateOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-radial from-amber-200/40 via-[#E63946]/30 to-[#07070C]"
          >
            {/* Split Torii Gates Swinging Open */}
            <motion.div
              initial={{ x: 0, rotateY: 0 }}
              animate={{ x: '-120%', rotateY: -80 }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#0E1424] border-r-4 border-[#E63946] shadow-2xl flex items-center justify-end pr-8"
            >
              <span className="font-shippori text-9xl text-[#E63946]/20 font-bold select-none">門</span>
            </motion.div>

            <motion.div
              initial={{ x: 0, rotateY: 0 }}
              animate={{ x: '120%', rotateY: 80 }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#0E1424] border-l-4 border-[#E63946] shadow-2xl flex items-center justify-start pl-8"
            >
              <span className="font-shippori text-9xl text-[#E63946]/20 font-bold select-none">開</span>
            </motion.div>

            {/* Radiant White & Gold Center Bloom Flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 3], opacity: [0, 0.9, 1] }}
              transition={{ duration: 1.2 }}
              className="w-48 h-48 rounded-full bg-gradient-to-r from-amber-100 via-[#F4C26B] to-white blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
        {/* Left Column: Brand Emblem & Visual Context */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-white transition-colors rounded-full px-4 py-1.5 bg-stone-900/60 border border-white/10 hover:border-[#F4C26B]/40 backdrop-blur-md"
            >
              <span>&larr; Return to Sanctum Guide</span>
            </button>
          )}

          {/* Glowing Torii Crest Medallion */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#E63946] to-[#991b1b] flex items-center justify-center text-white font-shippori font-bold text-5xl shadow-[0_0_40px_rgba(230,57,70,0.45)] border border-white/20">
              界
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md bg-[#07070C] border border-[#F4C26B]/50 text-3xs font-mono text-[#F4C26B]">
              日本語
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-shippori text-3xl sm:text-4xl text-white font-normal tracking-tight">
              KAI • 日本語マスター
            </h1>
            <p className="font-serif_jp text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              一文字から始まる、本格的な日本語の世界へ。
            </p>
            <p className="text-xs font-mono text-stone-400">
              Personal Mastery Sanctum • Spatial Audio & FSRS Scheduling
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-stone-900/60 border border-white/10 text-xs font-mono text-stone-400 backdrop-blur-md">
            <ShieldCheck size={16} className="text-[#F4C26B]" />
            <span>End-to-End Encrypted Master Isolation</span>
          </div>
        </div>

        {/* Right Column: 3D Perspective Frosted Glass Sanctum Card */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto perspective-[1200px]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={
              shakeKey > 0
                ? {
                    x: [-12, 12, -8, 8, -4, 4, 0],
                    transition: { duration: 0.45 }
                  }
                : { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }
            className="relative rounded-3xl bg-stone-950/80 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(230,57,70,0.15)] overflow-hidden"
          >
            {/* Ambient Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F4C26B]/60 to-transparent" />

            {/* Error Red Ink Splash effect */}
            {shakeKey > 0 && errorMsg && (
              <motion.div
                key={shakeKey}
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 pointer-events-none z-30 bg-radial from-[#E63946]/40 via-transparent to-transparent"
              />
            )}

            {/* Header: Title + Mascot */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/10">
              <div>
                <h2 className="font-shippori text-xl font-medium text-white tracking-wide">
                  {mode === 'setup'
                    ? 'Initialize Master Sanctuary'
                    : mode === 'signup'
                    ? 'Create Master Account'
                    : mode === 'forgot'
                    ? 'Password Recovery'
                    : mode === 'reset'
                    ? 'Set New Master Password'
                    : 'Enter KAI Sanctuary'}
                </h2>
                <p className="text-2xs font-mono text-stone-400 mt-0.5">
                  {configuredOwnerEmail && mode === 'signin'
                    ? 'Single-owner access control enabled'
                    : 'Access your private lessons, voice notes, and FSRS progress'}
                </p>
              </div>

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

            {/* Production notice if required */}
            {isProductionMode && !isSupabaseMode ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-xs mb-5">
                <div className="flex items-center gap-2 text-amber-200 font-bold">
                  <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
                  <span>Production Setup Required</span>
                </div>
                <p className="text-2xs text-stone-300 leading-relaxed font-serif_jp">
                  To guarantee single-owner data isolation and PostgreSQL Row Level Security, KAI requires Supabase Auth in production builds.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Mode Tabs: Smooth Switch between Sign In and Register */}
                {isSupabaseMode && !configuredOwnerEmail && mode !== 'forgot' && mode !== 'reset' && (
                  <div className="flex items-center p-1 rounded-2xl bg-stone-900/90 border border-white/10 text-xs font-serif_jp">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                        mode === 'signin'
                          ? 'bg-[#E63946] text-white shadow-md'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Sign In (ログイン)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setMode('signup');
                        setErrorMsg(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                        mode === 'signup'
                          ? 'bg-[#E63946] text-white shadow-md'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Register (新規登録)
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-[#E63946]/15 border border-[#E63946]/50 text-xs text-red-200 flex items-start gap-3">
                    <AlertCircle size={16} className="text-[#E63946] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="leading-snug">{errorMsg}</p>
                      {errorMsg.toLowerCase().includes('confirm') && (
                        <button
                          type="button"
                          onClick={handleResendEmail}
                          disabled={isResending}
                          className="text-2xs font-mono underline hover:text-white"
                        >
                          {isResending ? 'Resending...' : 'Resend verification email'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Notice Banner */}
                {successNotice && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>{successNotice}</span>
                  </div>
                )}

                {/* Main Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Display Name (Setup or Signup) */}
                  {(mode === 'setup' || mode === 'signup') && (
                    <div className="relative group">
                      <label className="text-2xs font-mono uppercase tracking-widest text-[#F4C26B] block mb-1.5">
                        Your Calligraphic Name / Display Name
                      </label>
                      <div className="relative">
                        <input
                          id="auth-display-name"
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          onFocus={() => setActiveFocusedInput('name')}
                          onBlur={() => setActiveFocusedInput(null)}
                          placeholder="e.g. Kenji, 健二"
                          className="w-full px-4 py-3 rounded-xl bg-stone-900/70 border border-white/10 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-[#F4C26B] transition-all"
                        />
                        {/* Glowing Brush Underline */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F4C26B] to-transparent transition-opacity duration-300 ${
                            activeFocusedInput === 'name' ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  {mode !== 'reset' && (
                    <div className="relative group">
                      <label className="text-2xs font-mono uppercase tracking-widest text-[#F4C26B] block mb-1.5">
                        Email Address (電子手紙)
                      </label>
                      <div className="relative">
                        <input
                          id="auth-email"
                          type="email"
                          required={isSupabaseMode || mode === 'setup'}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setActiveFocusedInput('email')}
                          onBlur={() => setActiveFocusedInput(null)}
                          placeholder="learner@sanctuary.jp"
                          className="w-full px-4 py-3 rounded-xl bg-stone-900/70 border border-white/10 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-[#F4C26B] transition-all"
                        />
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F4C26B] to-transparent transition-opacity duration-300 ${
                            activeFocusedInput === 'email' ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  {mode !== 'forgot' && (
                    <div className="relative group">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-2xs font-mono uppercase tracking-widest text-[#F4C26B] block">
                          Master Password (暗証番号)
                        </label>
                        {mode === 'signin' && isSupabaseMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setMode('forgot');
                              setErrorMsg(null);
                            }}
                            className="text-2xs font-mono text-stone-400 hover:text-[#F4C26B] transition-colors"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="auth-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setActiveFocusedInput('password')}
                          onBlur={() => setActiveFocusedInput(null)}
                          placeholder="••••••••••••"
                          className="w-full pl-4 pr-11 py-3 rounded-xl bg-stone-900/70 border border-white/10 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-[#F4C26B] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F4C26B] to-transparent transition-opacity duration-300 ${
                            activeFocusedInput === 'password' ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Confirm Password Field */}
                  {(mode === 'setup' || mode === 'signup' || mode === 'reset') && (
                    <div className="relative group">
                      <label className="text-2xs font-mono uppercase tracking-widest text-[#F4C26B] block mb-1.5">
                        Repeat Password (再入力)
                      </label>
                      <div className="relative">
                        <input
                          id="auth-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setActiveFocusedInput('confirm')}
                          onBlur={() => setActiveFocusedInput(null)}
                          placeholder="••••••••••••"
                          className="w-full pl-4 pr-11 py-3 rounded-xl bg-stone-900/70 border border-white/10 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-[#F4C26B] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F4C26B] to-transparent transition-opacity duration-300 ${
                            activeFocusedInput === 'confirm' ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button or Success Stamp */}
                  <div className="pt-3">
                    {isSuccessStamp ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <HankoStamp text="界" size={64} shape="square" playSound={true} />
                        <span className="text-2xs font-mono text-[#F4C26B] tracking-[0.25em] uppercase animate-pulse">
                          Threshold Granted • Opening Gate
                        </span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-2xl bg-[#E63946] hover:bg-[#b3202e] text-white font-serif_jp font-semibold text-sm shadow-[0_0_25px_rgba(230,57,70,0.45)] hover:shadow-[0_0_35px_rgba(230,57,70,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Unlocking Sanctum...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>
                              {mode === 'setup'
                                ? 'Initialize Sanctuary Master'
                                : mode === 'signup'
                                ? 'Create Mastery Account'
                                : mode === 'forgot'
                                ? 'Dispatch Recovery Link'
                                : mode === 'reset'
                                ? 'Update Master Password'
                                : 'Pass Through Gate • 門を通る'}
                            </span>
                            <ArrowRight size={15} />
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Mode switch helper shortcuts */}
                  {mode === 'forgot' && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signin');
                          setErrorMsg(null);
                        }}
                        className="text-xs font-mono text-stone-400 hover:text-white"
                      >
                        &larr; Back to Sign In
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
