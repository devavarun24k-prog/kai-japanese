// src/features/interview/components/AIFeedbackModal.tsx
// Secure AI feedback calling the Supabase kai-tutor Edge Function with zero fake data
import React, { useState } from 'react';
import { Bot, Sparkles, X, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  candidateAnswerText: string;
}

export const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({
  isOpen,
  onClose,
  questionText,
  candidateAnswerText
}) => {
  const { isAuthenticated, userEmail } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const requestFeedback = async () => {
    setErrorStatus(null);
    setFeedbackText(null);

    // 1. Enforce authentication
    if (!isAuthenticated || !userEmail) {
      setErrorStatus('AI feedback not configured. Sign in to your KAI account to invoke the secure AI tutor Edge Function.');
      return;
    }

    // 2. Check Supabase connection
    if (!isSupabaseConfigured || !supabase) {
      setErrorStatus('AI feedback not configured. Supabase backend connection is not configured.');
      return;
    }

    setLoading(true);

    try {
      // Send ONLY the question and user typed answer text
      const prompt = `Please review this technical interview response:\nQuestion: ${questionText}\nCandidate Answer: ${candidateAnswerText}\nProvide constructive feedback on technical accuracy and clarity.`;

      const { data, error } = await supabase.functions.invoke('kai-tutor', {
        body: {
          prompt,
          level: 'Technical Interview Review'
        }
      });

      if (error || !data || !data.reply) {
        throw new Error(error?.message || 'Empty response from edge function');
      }

      setFeedbackText(data.reply);
    } catch (err: unknown) {
      // Never fake feedback; show unconfigured/error state
      setErrorStatus('AI feedback not configured or failed to connect to the backend Edge Function.');
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
            <div className="w-8 h-8 rounded-xl bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                AI Sensei Feedback (Optional)
              </h3>
              <p className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
                Supabase 'kai-tutor' Edge Function
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-[#1A253D] text-[#6B6358] dark:text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy Transparency Notice */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Privacy Disclosure:</strong> Only the interview question and your typed answer text are sent to the AI tutor Edge Function. Keys stay secure server-side.
          </p>
        </div>

        {/* Question & Answer Summary */}
        <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#101726]/80 border border-[#DDD2B8] dark:border-[#253659] space-y-2 text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#6B6358] dark:text-[#94A3B8] block">Question:</span>
            <p className="font-semibold text-[#14110F] dark:text-[#F3EBDD]">{questionText}</p>
          </div>
          <div className="pt-1.5 border-t border-stone-200 dark:border-stone-800">
            <span className="font-mono text-[10px] uppercase text-[#6B6358] dark:text-[#94A3B8] block">Your Answer:</span>
            <p className="text-[#6B6358] dark:text-[#94A3B8] italic">{candidateAnswerText || '(Empty response)'}</p>
          </div>
        </div>

        {/* Error / Not Configured Notice */}
        {errorStatus && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Status: {errorStatus}</span>
              <p className="text-[11px] opacity-80 mt-0.5">
                KAI never presents fake AI responses. Use the deterministic keyword rubric in practice mode for offline, instant scoring.
              </p>
            </div>
          </div>
        )}

        {/* Feedback Response Result */}
        {feedbackText && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 font-serif_jp flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Feedback Response:
            </span>
            <p className="text-[#14110F] dark:text-[#E2E8F0] leading-relaxed whitespace-pre-wrap">
              {feedbackText}
            </p>
          </div>
        )}

        {/* Trigger Button */}
        {!feedbackText && (
          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono hover:bg-stone-200 dark:hover:bg-[#1A253D]"
            >
              Cancel
            </button>
            <button
              disabled={loading || !candidateAnswerText.trim()}
              onClick={requestFeedback}
              className="px-5 py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] disabled:opacity-40 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Calling Edge Function...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Request AI Feedback
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
