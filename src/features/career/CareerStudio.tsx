// src/features/career/CareerStudio.tsx
// Main Career Studio Hub: Profile Single-Source-of-Truth, Rirekisho, Shokumukeirekisho, English Resume, CV
import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Printer,
  Sparkles,
  History,
  Target,
  Mail,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CareerProfile } from './types';
import { loadCareerProfile, saveCareerProfile } from './storage';
import { checkProfileConsistency } from './utils/consistencyChecker';
import { ProfileEditor } from './components/ProfileEditor';
import { RirekishoView } from './components/RirekishoView';
import { ShokumukeirekishoView } from './components/ShokumukeirekishoView';
import { EnglishResumeView } from './components/EnglishResumeView';
import { JobTailoringModal } from './components/JobTailoringModal';
import { DocumentVersionManager } from './components/DocumentVersionManager';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { AIPolishModal } from './components/AIPolishModal';

export const CareerStudio: React.FC = () => {
  const { userEmail } = useAuth();
  const userId = userEmail || 'anonymous';

  const [profile, setProfile] = useState<CareerProfile>(() => loadCareerProfile(userId));
  const [activeTab, setActiveTab] = useState<'profile' | 'rirekisho' | 'shokumu' | 'english'>('profile');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [showWarnings, setShowWarnings] = useState<boolean>(false);

  // Modals state
  const [isTailoringOpen, setIsTailoringOpen] = useState<boolean>(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [aiPolishContext, setAiPolishContext] = useState<{ text: string; callback: (res: string) => void } | null>(null);

  // Consistency checks
  const warnings = useMemo(() => checkProfileConsistency(profile), [profile]);

  // Autosave with debounce
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      await saveCareerProfile(profile, userId);
      setSaveStatus('saved');
    }, 800);

    return () => clearTimeout(timer);
  }, [profile, userId]);

  // Warn before unload if actively saving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#F3EBDD] to-[#EAE0CD] dark:from-[#0E1729] dark:to-[#080D18] border border-[#DDD2B8] dark:border-[#1E2E4E] shadow-sm print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-kai-vermilion/10 text-kai-vermilion border border-kai-vermilion/20">
              Career Studio • 就職活動
            </span>
            {saveStatus === 'saved' ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                All changes autosaved
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                <Save className="w-3.5 h-3.5 animate-pulse" />
                Saving...
              </span>
            )}
          </div>
          <h1 className="text-2xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
            Engineering Career & Resume Studio
          </h1>
          <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
            One single source of truth Profile generates your JIS 履歴書, 職務経歴書, English CV, and tailored outreach.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTailoringOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 shadow-sm"
          >
            <Target className="w-3.5 h-3.5 text-kai-indigo" />
            Tailor to Job Description
          </button>
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-kai-gold" />
            Templates
          </button>
          <button
            onClick={() => setIsVersionsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-kai-vermilion" />
            Versions
          </button>
        </div>
      </div>

      {/* DOCX Notice & Consistency Warning Alert */}
      <div className="space-y-3 print:hidden">
        {/* DOCX & PDF Export Notice */}
        <div className="p-3 rounded-2xl bg-stone-100 dark:bg-[#10192C] border border-stone-300 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-kai-indigo flex-shrink-0" />
            <span>
              <strong className="font-semibold">Notice:</strong> DOCX export is not available. Please use the{' '}
              <strong className="font-semibold text-kai-vermilion">Print &gt; Save as PDF</strong> function for standard Japanese A4 PDF submission.
            </span>
          </div>
          {warnings.length > 0 && (
            <button
              onClick={() => setShowWarnings(!showWarnings)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-semibold border border-amber-300 dark:border-amber-800 hover:opacity-90 flex-shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'}
            </button>
          )}
        </div>

        {/* Warning Checklist Drawer */}
        {showWarnings && warnings.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span>Profile Consistency & Completeness Checklist (Warnings only, never auto-fixed):</span>
              <button onClick={() => setShowWarnings(false)} className="text-amber-700 text-[11px] underline">Hide</button>
            </div>
            <ul className="space-y-1 pl-4 list-disc">
              {warnings.map(w => (
                <li key={w.id} className={w.severity === 'warning' ? 'text-amber-900 dark:text-amber-200 font-medium' : 'text-stone-600 dark:text-stone-400'}>
                  {w.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDD2B8] dark:border-[#203050] pb-2 print:hidden overflow-x-auto">
        {[
          { id: 'profile', label: '1. Profile (Source of Truth)', icon: User },
          { id: 'rirekisho', label: '2. 履歴書 (Rirekisho)', icon: FileText },
          { id: 'shokumu', label: '3. 職務経歴書 (Shokumu)', icon: Briefcase },
          { id: 'english', label: '4. English Resume / CV', icon: GraduationCap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-kai-vermilion text-white shadow-sm'
                  : 'bg-white/60 dark:bg-[#10192C]/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'profile' && (
          <ProfileEditor
            profile={profile}
            onChange={setProfile}
            onOpenAIPolish={(text, callback) => setAiPolishContext({ text, callback })}
          />
        )}
        {activeTab === 'rirekisho' && (
          <RirekishoView profile={profile} onChange={setProfile} />
        )}
        {activeTab === 'shokumu' && (
          <ShokumukeirekishoView profile={profile} onChange={setProfile} />
        )}
        {activeTab === 'english' && (
          <EnglishResumeView profile={profile} onChange={setProfile} />
        )}
      </div>

      {/* Modals */}
      <JobTailoringModal
        isOpen={isTailoringOpen}
        onClose={() => setIsTailoringOpen(false)}
        profile={profile}
      />
      <TemplateGalleryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        profile={profile}
      />
      <DocumentVersionManager
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        currentProfile={profile}
        userId={userId}
        onRestoreVersion={restored => setProfile(restored)}
      />
      {aiPolishContext && (
        <AIPolishModal
          isOpen={true}
          onClose={() => setAiPolishContext(null)}
          inputText={aiPolishContext.text}
          onApplyPolishedText={aiPolishContext.callback}
        />
      )}
    </div>
  );
};
