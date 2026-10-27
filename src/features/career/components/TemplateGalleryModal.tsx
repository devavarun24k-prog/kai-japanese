// src/features/career/components/TemplateGalleryModal.tsx
// Business Communication Template Gallery (Cover Letter, Recruiter Reply, Thank You, Follow-up, Self-Intro)
import React, { useState } from 'react';
import { Mail, Copy, Check, AlertTriangle, Globe, X, Edit3 } from 'lucide-react';
import { CareerProfile, CareerTemplate } from '../types';
import { CAREER_TEMPLATES } from '../data/careerTemplates';
import { fillTemplateFromProfile } from '../utils/templateEngine';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CareerProfile;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({ isOpen, onClose, profile }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(CAREER_TEMPLATES[0].id);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'en' | 'ja'>('all');
  const [editedText, setEditedText] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const selectedTemplate = CAREER_TEMPLATES.find(t => t.id === selectedTemplateId) || CAREER_TEMPLATES[0];

  // Whenever selected template changes or opens, re-populate filled text
  React.useEffect(() => {
    if (selectedTemplate) {
      const filled = fillTemplateFromProfile(selectedTemplate.template, profile, {
        currentDate: new Date().toLocaleDateString('ja-JP')
      });
      setEditedText(filled);
    }
  }, [selectedTemplateId, profile]);

  if (!isOpen) return null;

  const filteredTemplates = CAREER_TEMPLATES.filter(t => {
    if (languageFilter === 'all') return true;
    return t.language === languageFilter;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F3EBDD] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-kai-indigo/10 text-kai-indigo dark:text-sky-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">
                Job Search Business Templates
              </h2>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">
                Templates filled with your profile facts. Unfilled blanks stay visible as &#123;placeholder&#125;.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['all', 'ja', 'en'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguageFilter(lang)}
              className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                languageFilter === lang
                  ? 'bg-kai-indigo text-white border-kai-indigo shadow-sm'
                  : 'bg-white dark:bg-[#141D33] text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang === 'ja' ? '日本語 (Japanese)' : 'English'}
            </button>
          ))}
        </div>

        {/* Main Content: Left Selector + Right Editor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="space-y-2">
            {filteredTemplates.map(tmpl => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-[#141D33] border-kai-vermilion shadow-sm'
                      : 'bg-white/40 dark:bg-[#10192C]/40 border-stone-200 dark:border-stone-800 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                      {tmpl.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">{tmpl.description}</p>
                  {tmpl.needsNativeReview && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      Needs native review
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Template Preview & Customizer */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{selectedTemplate.title}</span>
                  {selectedTemplate.needsNativeReview && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Needs Native Review
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-500">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kai-vermilion text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>

            <textarea
              rows={14}
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#203050] text-xs text-stone-900 dark:text-stone-100 font-mono leading-relaxed focus:outline-none focus:border-kai-vermilion"
            />
            <p className="text-[11px] text-stone-500 italic">
              Notice: You can edit any sentence or fill in specific &#123;companyName&#125; / &#123;recruiterName&#125; details directly before copying.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
