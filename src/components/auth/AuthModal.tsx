// src/components/auth/AuthModal.tsx
// Secure master login modal with Supabase authentication and owner passkey mode
import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, AlertCircle, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { soundEffects } from '../../services/soundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPassword } = useAuth();
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const result = await loginWithPassword(password);
    setIsLoading(false);

    if (result.success) {
      soundEffects.playLevelUp();
      onClose();
    } else {
      soundEffects.playWrong();
      setErrorMsg(result.error || 'Authentication failed. Please verify your passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-kai-muted hover:text-kai-ink transition-colors"
        >
          <X size={18} />
        </button>

        {/* Brand Lock Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark text-white flex items-center justify-center mx-auto shadow-vermilion">
            <Lock size={26} />
          </div>

          <h2 className="text-xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
            KAI Personal Access Control
          </h2>

          <p className="text-xs text-kai-muted">
            {isSupabaseConfigured
              ? 'Authorized Single-User Supabase Authentication'
              : 'Authorized Single-User Master Passcode Security (Default: kai2025)'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-2xs font-mono font-bold uppercase text-kai-muted">
              Owner Master Passcode
            </label>
            <div className="relative">
              <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master passcode (e.g. kai2025)..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion transition-transform active:scale-95 disabled:opacity-40"
          >
            {isLoading ? 'Verifying Session...' : 'Authenticate & Unlock KAI'}
          </button>
        </form>

        <div className="p-3.5 rounded-2xl bg-kai-bg dark:bg-kai-dark-bg border border-kai-border text-3xs text-kai-muted space-y-1">
          <div className="flex items-center gap-1 font-bold text-kai-ink dark:text-white">
            <ShieldCheck size={12} className="text-kai-green" />
            <span>Privacy Guarantee:</span>
          </div>
          <p>
            Zero telemetry. Voice transcripts, handwriting submissions, and learning analytics remain strictly private.
          </p>
        </div>
      </div>
    </div>
  );
};
