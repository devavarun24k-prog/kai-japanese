// src/features/career/components/AIPolishModal.tsx
// Secure AI polish using Supabase kai-tutor Edge Function
// Never sends the whole profile by default; requires authenticated sign-in and click-to-confirm.
import React, { useState } from 'react';
import { Bot, Sparkles, X, AlertCircle, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

interface AIPolishModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputText: string;
  targetTone?: 'formal_japanese' | 'english_concise' | 'tech_impact';
  onApplyPolishedText: (polished: string) => void;
}

export const AIPolishModal: React.FC<AIPolishModalProps> = ({
  isOpen,
  onClose,
  inputText,
  targetTone = 'tech_impact',
  onApplyPolishedText
}) => {
  const { isAuthenticated, userEmail } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [polishedResult, setPolishedResult] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestPolish = async () => {
    setErrorStatus(null);
    setPolishedResult(null);

    // 1. Enforce authentication
    if (!isAuthenticated || !userEmail) {
      setErrorStatus('AI not configured. You must be signed in to invoke the secure AI tutor Edge Function.');
      return;
    }

    // 2. Check Supabase connection
    if (!isSupabaseConfigured || !supabase) {
      setErrorStatus('AI not configured. Supabase backend connection is not configured.');
      return;
    }

    setLoading(true);

    try {
      // Send ONLY the specific selected sentence/paragraph
      const prompt = `Please polish the following resume statement to enhance technical clarity, concise impact, and professional tone:\n\n"${inputText}"\n\nProvide the refined version with no unnecessary preamble.`;

      const { data, error } = await supabase.functions.invoke('kai-tutor', {
        body: {
          prompt,
          level: 'Career Resume Polish'
        }
      });

      if (error || !data || !data.reply) {
        throw new Error(error?.message || 'Empty response from edge function');
      }

      setPolishedResult(data.reply.trim());
    } catch {
      setErrorStatus('AI not configured or failed to connect to the backend Edge Function.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F3EBDD] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-kai-gold/10 text-kai-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">
                Polish Statement with AI
              </h2>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">
                Strict privacy: Only this specific excerpt is transmitted to the server.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text to be sent disclosure */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1]">
            Exact Text Being Sent for Review:
          </label>
          <div className="p-3 rounded-2xl bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
            {inputText || '(Empty text selected)'}
          </div>
        </div>

        {/* Error or Not Configured notice */}
        {errorStatus && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <span>{errorStatus}</span>
          </div>
        )}

        {/* Polished Result */}
        {polishedResult && (
          <div className="space-y-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900/60 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              Suggested Refinement:
            </span>
            <p className="font-mono text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
              {polishedResult}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-kai-indigo" />
            <span>Server-side API keys only</span>
          </div>

          <div className="flex items-center gap-2">
            {polishedResult ? (
              <button
                onClick={() => {
                  onApplyPolishedText(polishedResult);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm"
              >
                Apply Polished Text
              </button>
            ) : (
              <button
                onClick={handleRequestPolish}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-kai-vermilion text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 shadow-sm"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm & Request Polish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
