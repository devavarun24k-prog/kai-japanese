// src/features/career/components/JobTailoringModal.tsx
// Deterministic Job Description Tailoring & Gap Analysis
import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Sparkles, X, ChevronRight, Copy, Check } from 'lucide-react';
import { CareerProfile, JobMatchAnalysis } from '../types';
import { analyzeJobDescription } from '../utils/jobAnalyzer';

interface JobTailoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CareerProfile;
}

export const JobTailoringModal: React.FC<JobTailoringModalProps> = ({ isOpen, onClose, profile }) => {
  const [jobText, setJobText] = useState<string>('');
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!jobText.trim()) return;
    const result = analyzeJobDescription(jobText, profile);
    setAnalysis(result);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F3EBDD] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-kai-indigo/10 dark:bg-kai-indigo/30 text-kai-indigo dark:text-sky-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">
                Job Description Tailoring & Gap Analysis
              </h2>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">
                Deterministic analysis comparing job requirements with your real profile facts.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1]">
            Paste Job Posting Description / Requirements:
          </label>
          <textarea
            rows={5}
            value={jobText}
            onChange={e => setJobText(e.target.value)}
            placeholder="Paste technical requirements from Wantedly, Daijob, LinkedIn, or corporate careers page (e.g., 'Looking for an engineer proficient in C++, FPGA, Verilog, RTOS...')"
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#203050] text-xs text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!jobText.trim()}
              className="px-4 py-2 rounded-xl bg-kai-vermilion text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-sm"
            >
              Analyze Match & Extract Gaps
            </button>
          </div>
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-5 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48]">
            {/* Matching vs Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matching Skills */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Matching Skills You Have ({analysis.matchingSkills.length})
                </div>
                {analysis.matchingSkills.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No direct keyword overlaps detected.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.matchingSkills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-medium">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Skills (GAPS) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Missing Skills / Gaps ({analysis.missingSkills.length})
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300/80">
                  These keywords are in the JD but not found in your profile. They are marked as gaps and NEVER automatically claimed.
                </p>
                {analysis.missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-medium">Zero skill gaps found against extracted tech keywords!</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missingSkills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-mono font-medium">
                        ! {skill} (Gap)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Projects to Emphasize */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-3">
              <h3 className="text-xs font-bold text-[#14110F] dark:text-[#F3EBDD] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-kai-gold" />
                Which of Your Projects to Emphasize (Ranked by Overlap)
              </h3>
              {analysis.recommendedProjects.length === 0 ? (
                <p className="text-xs text-stone-500 italic">None of your current projects matched the extracted keywords directly.</p>
              ) : (
                <div className="space-y-2">
                  {analysis.recommendedProjects.map(({ project, matchCount, matchedKeywords }) => (
                    <div key={project.id} className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                          <span>{project.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-kai-vermilion/10 text-kai-vermilion font-mono">
                            {matchCount} keywords matched
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-600 dark:text-stone-300">
                          Matched: <span className="font-mono text-kai-indigo dark:text-sky-300 font-semibold">{matchedKeywords.join(', ')}</span>
                        </div>
                        <p className="text-stone-500 text-[11px] line-clamp-1">{project.whatIDid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Fact-Based Talking Points */}
            {analysis.suggestedBulletPoints.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-3">
                <h3 className="text-xs font-bold text-[#14110F] dark:text-[#F3EBDD]">
                  Suggested Fact-Based Statements (Derived Solely from Your Real Projects)
                </h3>
                <div className="space-y-2">
                  {analysis.suggestedBulletPoints.map((point, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-2 text-xs">
                      <p className="text-stone-700 dark:text-stone-300 leading-normal">{point}</p>
                      <button
                        onClick={() => copyToClipboard(point, idx)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-stone-500 hover:text-kai-vermilion hover:bg-white dark:hover:bg-stone-800"
                        title="Copy statement"
                      >
                        {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
