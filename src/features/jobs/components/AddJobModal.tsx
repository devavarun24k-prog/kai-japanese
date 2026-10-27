// src/features/jobs/components/AddJobModal.tsx
// Manual job application creation and edit form with tri-state visa checks and ISA link
import React, { useState } from 'react';
import { X, AlertTriangle, ExternalLink, ShieldAlert, Check, Calendar, Plus, Building2 } from 'lucide-react';
import { JobApplication, JobStatus, TriState, TriStateField, JapaneseRequirement, EnglishRequirement, WorkArrangement } from '../types';
import { findDuplicateJob } from '../storage';
import { loadDocumentVersions } from '../../career/storage';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobApplication) => void;
  initialJob: JobApplication;
  existingJobs: JobApplication[];
  userId?: string;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialJob,
  existingJobs,
  userId
}) => {
  const [formData, setFormData] = useState<JobApplication>(initialJob);
  const [skillsInput, setSkillsInput] = useState<string>(initialJob.technicalSkills.join(', '));
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const documentVersions = React.useMemo(() => loadDocumentVersions(userId), [userId]);

  if (!isOpen) return null;

  const handleSourceUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, sourceUrl: url }));
    const duplicate = findDuplicateJob(url, formData.id, existingJobs);
    if (duplicate) {
      setDuplicateWarning(`Warning: URL is already tracked in your pipeline as "${duplicate.employer} - ${duplicate.title}".`);
    } else {
      setDuplicateWarning(null);
    }
  };

  const updateTriState = (field: 'overseasApplicantsAccepted' | 'relocationSupport' | 'visaSponsorship', status: TriState) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        status
      }
    }));
  };

  const updateTriStateNote = (field: 'overseasApplicantsAccepted' | 'relocationSupport' | 'visaSponsorship', note: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        note
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employer.trim() || !formData.title.trim() || !formData.sourceUrl.trim()) {
      alert('Employer name, job title, and source URL are required.');
      return;
    }

    const cleanedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    onSave({
      ...formData,
      technicalSkills: cleanedSkills
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#F3EBDD] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-kai-indigo/10 text-kai-indigo dark:text-sky-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">
                {initialJob.employer ? 'Edit Job Application' : 'Track New Job Application'}
              </h2>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">
                Manual entry. Enter details directly from official job listings.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate URL Alert Banner */}
        {duplicateWarning && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold">{duplicateWarning}</p>
              <p className="text-[11px] mt-0.5 text-amber-700 dark:text-amber-300">You may still save if this represents a distinct opening or re-application.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Core Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Employer / Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.employer}
                onChange={e => setFormData({ ...formData, employer: e.target.value })}
                placeholder="e.g. Sony, Renesas, Mercari"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Firmware Engineer, QA Automation"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Location / Prefecture</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Tokyo, Kanagawa, Remote"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Work Arrangement</label>
              <select
                value={formData.workArrangement}
                onChange={e => setFormData({ ...formData, workArrangement: e.target.value as WorkArrangement })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
              >
                <option value="on_site">On-Site (出社)</option>
                <option value="hybrid">Hybrid (ハイブリッド)</option>
                <option value="remote">Full Remote (フルリモート)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Initial Pipeline Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as JobStatus })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-medium"
              >
                <option value="interested">Interested (関心)</option>
                <option value="planned">Planned (応募予定)</option>
                <option value="applied">Applied (応募済み)</option>
                <option value="interview_scheduled">Interview Scheduled (面接調整中)</option>
                <option value="offer_received">Offer Received (内定)</option>
                <option value="rejected">Rejected (お見送り)</option>
                <option value="closed">Closed (募集終了)</option>
              </select>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Source URL (Required) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.sourceUrl}
                onChange={e => handleSourceUrlChange(e.target.value)}
                placeholder="https://company.com/careers/job123"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Official Application Portal URL (Optional)</label>
              <input
                type="url"
                value={formData.officialApplicationUrl || ''}
                onChange={e => setFormData({ ...formData, officialApplicationUrl: e.target.value })}
                placeholder="https://ats.workday.com/apply/..."
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Dates & Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Posted / Verified Date</label>
              <input
                type="date"
                value={formData.postedDate}
                onChange={e => setFormData({ ...formData, postedDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline || ''}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Next Follow-Up Date</label>
              <input
                type="date"
                value={formData.followUpDate || ''}
                onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs font-mono"
              />
            </div>
          </div>

          {/* 2. Tri-State Sponsorship & Immigration Section */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#10192C] border border-stone-300 dark:border-stone-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                  Visa & Relocation Status (Tri-State Verification)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Strictly defaults to "unknown". Never infer sponsorship without explicit statement in the listing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Visa Sponsorship */}
              <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 space-y-2">
                <span className="block text-xs font-semibold text-stone-800 dark:text-stone-200">Visa Sponsorship</span>
                <div className="flex gap-1 text-[11px]">
                  {(['yes', 'not_stated', 'unknown'] as TriState[]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => updateTriState('visaSponsorship', val)}
                      className={`flex-1 py-1 rounded text-center font-medium capitalize transition-all ${
                        formData.visaSponsorship.status === val
                          ? 'bg-kai-indigo text-white shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200'
                      }`}
                    >
                      {val.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overseas Applicants */}
              <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 space-y-2">
                <span className="block text-xs font-semibold text-stone-800 dark:text-stone-200">Overseas Applicants</span>
                <div className="flex gap-1 text-[11px]">
                  {(['yes', 'not_stated', 'unknown'] as TriState[]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => updateTriState('overseasApplicantsAccepted', val)}
                      className={`flex-1 py-1 rounded text-center font-medium capitalize transition-all ${
                        formData.overseasApplicantsAccepted.status === val
                          ? 'bg-kai-indigo text-white shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200'
                      }`}
                    >
                      {val.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Relocation Support */}
              <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 space-y-2">
                <span className="block text-xs font-semibold text-stone-800 dark:text-stone-200">Relocation Support</span>
                <div className="flex gap-1 text-[11px]">
                  {(['yes', 'not_stated', 'unknown'] as TriState[]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => updateTriState('relocationSupport', val)}
                      className={`flex-1 py-1 rounded text-center font-medium capitalize transition-all ${
                        formData.relocationSupport.status === val
                          ? 'bg-kai-indigo text-white shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200'
                      }`}
                    >
                      {val.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Neutral Immigration Services Agency Notice */}
            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p>
                  <strong>Immigration Disclaimer:</strong> KAI cannot determine whether you qualify for a work status in Japan. Official visa qualifications (such as the "Engineer / Specialist in Humanities / International Services" status) are determined solely by the Japanese government.
                </p>
                <a
                  href="https://www.isa.go.jp/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 font-semibold underline hover:opacity-80"
                >
                  Immigration Services Agency of Japan (出入国在留管理庁) Official Guidelines
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Language & Skills Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Japanese Level Requirement</label>
              <select
                value={formData.japaneseLevel}
                onChange={e => setFormData({ ...formData, japaneseLevel: e.target.value as JapaneseRequirement })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs"
              >
                <option value="Not Stated">Not Stated</option>
                <option value="None">None (English only)</option>
                <option value="N5">JLPT N5 (Basic)</option>
                <option value="N4">JLPT N4 (Conversational)</option>
                <option value="N3">JLPT N3 (Daily Business)</option>
                <option value="N2">JLPT N2 (Business Fluent)</option>
                <option value="N1">JLPT N1 (Advanced/Native)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">English Level Requirement</label>
              <select
                value={formData.englishLevel}
                onChange={e => setFormData({ ...formData, englishLevel: e.target.value as EnglishRequirement })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs"
              >
                <option value="Not Stated">Not Stated</option>
                <option value="None">None</option>
                <option value="Conversational">Conversational</option>
                <option value="Business">Business</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Attached Career Studio Version</label>
              <select
                value={formData.attachedResumeVersion?.id || ''}
                onChange={e => {
                  const selectedVer = documentVersions.find(v => v.id === e.target.value);
                  setFormData({
                    ...formData,
                    attachedResumeVersion: selectedVer ? { id: selectedVer.id, name: selectedVer.name } : undefined
                  });
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs"
              >
                <option value="">None Attached</option>
                {documentVersions.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Technical Skills (Comma-separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="e.g. C++, Verilog, RTOS, React, Docker"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Salary & Benefits (Free text / "Not stated")</label>
            <input
              type="text"
              value={formData.salaryAndBenefits}
              onChange={e => setFormData({ ...formData, salaryAndBenefits: e.target.value })}
              placeholder="e.g. ¥5,000,000 - ¥7,500,000, Commute allowance, Social insurance"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Notes & Follow-up Plan</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Contact person, interview preparation focus, tech test dates..."
              className="w-full p-3 rounded-xl bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-xs leading-relaxed"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7DECE] dark:border-[#1E2C48]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-kai-vermilion text-white text-xs font-semibold hover:opacity-95 shadow-sm"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
