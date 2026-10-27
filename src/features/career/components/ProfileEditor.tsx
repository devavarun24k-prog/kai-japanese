// src/features/career/components/ProfileEditor.tsx
// Editable Profile - The single source of truth for all career documents
import React, { useState } from 'react';
import { User, GraduationCap, Briefcase, Code, Award, Globe, FileText, Plus, Trash2, HelpCircle, Calendar, Sparkles } from 'lucide-react';
import { CareerProfile, EducationItem, WorkItem, ProjectItem, SkillItem, CertificationItem, LanguageItem, SkillLevel, JLPTLevel } from '../types';
import { convertToJapaneseEra } from '../utils/eraConverter';

interface ProfileEditorProps {
  profile: CareerProfile;
  onChange: (updated: CareerProfile) => void;
  onOpenAIPolish?: (text: string, onPolished: (res: string) => void) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange, onOpenAIPolish }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'projects' | 'skills' | 'pr'>('personal');

  const updatePersonal = (field: string, val: any) => {
    onChange({
      ...profile,
      personalDetails: {
        ...profile.personalDetails,
        [field]: val
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updatePersonal('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dobEra = profile.personalDetails.dateOfBirth ? convertToJapaneseEra(profile.personalDetails.dateOfBirth) : null;

  return (
    <div className="space-y-6">
      {/* Editor Sub-Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#EBE2D3] dark:bg-[#0D1527] border border-[#DDD2B8] dark:border-[#223354]">
        {[
          { id: 'personal', label: '1. Personal Details', icon: User },
          { id: 'experience', label: '2. Education & Work', icon: GraduationCap },
          { id: 'projects', label: '3. Technical Projects', icon: Code },
          { id: 'skills', label: '4. Skills & Certifications', icon: Award },
          { id: 'pr', label: '5. Self-PR & Target Roles', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#1E2D4A] text-kai-vermilion dark:text-kai-gold shadow-sm font-semibold'
                  : 'text-[#6B6358] dark:text-[#94A3B8] hover:text-[#231F1A] dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Personal Details */}
      {activeTab === 'personal' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-6">
          <div className="flex items-start justify-between border-b border-[#E7DECE] dark:border-[#1E2C48] pb-3">
            <div>
              <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Personal Details (基本情報)</h3>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">All fields are optional. Nothing is ever prefilled or invented.</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7DA] dark:bg-[#192742] text-[11px] text-[#6B6358] dark:text-[#A0AEC0]">
              <HelpCircle className="w-3.5 h-3.5 text-kai-vermilion" />
              <span>MHLW Standard (No gender field)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Upload Slot */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-[#DDD2B8] dark:border-[#283C62] bg-[#FAF6EE] dark:bg-[#0A101C] text-center space-y-2">
              <div className="w-24 h-32 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 flex items-center justify-center relative">
                {profile.personalDetails.photoUrl ? (
                  <img src={profile.personalDetails.photoUrl} alt="Resume Photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-stone-400 text-[10px]">
                    <User className="w-8 h-8 mx-auto mb-1 text-stone-300" />
                    3 × 4 cm Photo
                  </div>
                )}
              </div>
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-kai-indigo text-white dark:bg-[#203254] text-xs hover:opacity-90">
                Choose Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="text-[10px] text-stone-500">Local-only on your device</p>
            </div>

            {/* Name Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Full Name (Kanji / Official)</label>
                  <input
                    type="text"
                    value={profile.personalDetails.fullNameKanji}
                    onChange={e => updatePersonal('fullNameKanji', e.target.value)}
                    placeholder="e.g. 山田 太郎"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Furigana (Katakana Reading)</label>
                  <input
                    type="text"
                    value={profile.personalDetails.fullNameKana}
                    onChange={e => updatePersonal('fullNameKana', e.target.value)}
                    placeholder="e.g. ヤマダ タロウ"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Romaji / English Name</label>
                <input
                  type="text"
                  value={profile.personalDetails.fullNameRomaji}
                  onChange={e => updatePersonal('fullNameRomaji', e.target.value)}
                  placeholder="e.g. Taro Yamada"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.personalDetails.dateOfBirth}
                    onChange={e => updatePersonal('dateOfBirth', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                  />
                  {dobEra && (
                    <p className="text-[11px] text-kai-vermilion mt-1 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      Japanese Era: {dobEra.formattedFull}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Work Authorization in Japan</label>
                  <input
                    type="text"
                    value={profile.personalDetails.workAuthorization || ''}
                    onChange={e => updatePersonal('workAuthorization', e.target.value)}
                    placeholder="e.g. Requires Visa Sponsorship / Permanent Resident"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48]">
            <div>
              <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Email Address</label>
              <input
                type="email"
                value={profile.personalDetails.email}
                onChange={e => updatePersonal('email', e.target.value)}
                placeholder="e.g. taro.yamada@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.personalDetails.phone}
                onChange={e => updatePersonal('phone', e.target.value)}
                placeholder="e.g. +81 90-1234-5678"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48]">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Postal Code</label>
                <input
                  type="text"
                  value={profile.personalDetails.postalCode}
                  onChange={e => updatePersonal('postalCode', e.target.value)}
                  placeholder="e.g. 100-0001"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Address (住所)</label>
                <input
                  type="text"
                  value={profile.personalDetails.address}
                  onChange={e => updatePersonal('address', e.target.value)}
                  placeholder="e.g. 東京都千代田区千代田1-1"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Address Furigana (ふりがな)</label>
              <input
                type="text"
                value={profile.personalDetails.addressKana}
                onChange={e => updatePersonal('addressKana', e.target.value)}
                placeholder="e.g. トウキョウトチヨダクチヨダ"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Education & Work History */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Education */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
              <div>
                <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Educational Background (学歴)</h3>
                <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">In Japan, starting from high school graduation or university entrance is customary.</p>
              </div>
              <button
                onClick={() => {
                  const newEdu: EducationItem = {
                    id: `edu_${Date.now()}`,
                    institution: '',
                    major: '',
                    status: 'graduated',
                    startDate: '',
                    endDate: ''
                  };
                  onChange({ ...profile, educationHistory: [...profile.educationHistory, newEdu] });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kai-vermilion text-white text-xs hover:opacity-90 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </button>
            </div>

            {profile.educationHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">No education entries added yet.</p>
            ) : (
              <div className="space-y-4">
                {profile.educationHistory.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#E7DECE] dark:border-[#1E2C48] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6B6358] dark:text-[#94A3B8]">Education #{idx + 1}</span>
                      <button
                        onClick={() => {
                          onChange({
                            ...profile,
                            educationHistory: profile.educationHistory.filter((_, i) => i !== idx)
                          });
                        }}
                        className="text-stone-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Institution Name</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={e => {
                            const updated = [...profile.educationHistory];
                            updated[idx].institution = e.target.value;
                            onChange({ ...profile, educationHistory: updated });
                          }}
                          placeholder="e.g. Tokyo Institute of Technology"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Major / Faculty</label>
                        <input
                          type="text"
                          value={edu.major || ''}
                          onChange={e => {
                            const updated = [...profile.educationHistory];
                            updated[idx].major = e.target.value;
                            onChange({ ...profile, educationHistory: updated });
                          }}
                          placeholder="e.g. Electrical Engineering"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Start Date (YYYY-MM)</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={e => {
                            const updated = [...profile.educationHistory];
                            updated[idx].startDate = e.target.value;
                            onChange({ ...profile, educationHistory: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">End Date (YYYY-MM)</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={e => {
                            const updated = [...profile.educationHistory];
                            updated[idx].endDate = e.target.value;
                            onChange({ ...profile, educationHistory: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Status</label>
                        <select
                          value={edu.status}
                          onChange={e => {
                            const updated = [...profile.educationHistory];
                            updated[idx].status = e.target.value as any;
                            onChange({ ...profile, educationHistory: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                        >
                          <option value="graduated">Graduated (卒業)</option>
                          <option value="enrolled">Enrolled (在学中)</option>
                          <option value="expected">Expected Graduation (卒業見込み)</option>
                          <option value="withdrawn">Withdrawn (中途退学)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work History */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
              <div>
                <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Work & Internship History (職歴)</h3>
                <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">Full-time jobs, contracts, or technical internships.</p>
              </div>
              <button
                onClick={() => {
                  const newWork: WorkItem = {
                    id: `work_${Date.now()}`,
                    companyName: '',
                    role: '',
                    isCurrent: false,
                    startDate: '',
                    endDate: '',
                    responsibilities: ''
                  };
                  onChange({ ...profile, workHistory: [...profile.workHistory, newWork] });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kai-indigo text-white dark:bg-[#203254] text-xs hover:opacity-90 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            {profile.workHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">No work history added yet. (If early-career, you can rely on the Project-based layout!)</p>
            ) : (
              <div className="space-y-4">
                {profile.workHistory.map((work, idx) => (
                  <div key={work.id || idx} className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#E7DECE] dark:border-[#1E2C48] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6B6358] dark:text-[#94A3B8]">Job #{idx + 1}</span>
                      <button
                        onClick={() => {
                          onChange({
                            ...profile,
                            workHistory: profile.workHistory.filter((_, i) => i !== idx)
                          });
                        }}
                        className="text-stone-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={work.companyName}
                          onChange={e => {
                            const updated = [...profile.workHistory];
                            updated[idx].companyName = e.target.value;
                            onChange({ ...profile, workHistory: updated });
                          }}
                          placeholder="e.g. Sony Corporation"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Role / Title</label>
                        <input
                          type="text"
                          value={work.role}
                          onChange={e => {
                            const updated = [...profile.workHistory];
                            updated[idx].role = e.target.value;
                            onChange({ ...profile, workHistory: updated });
                          }}
                          placeholder="e.g. Embedded Firmware Engineer"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Start Date (YYYY-MM)</label>
                        <input
                          type="month"
                          value={work.startDate}
                          onChange={e => {
                            const updated = [...profile.workHistory];
                            updated[idx].startDate = e.target.value;
                            onChange({ ...profile, workHistory: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">End Date (YYYY-MM)</label>
                        <input
                          type="month"
                          value={work.endDate || ''}
                          disabled={work.isCurrent}
                          onChange={e => {
                            const updated = [...profile.workHistory];
                            updated[idx].endDate = e.target.value;
                            onChange({ ...profile, workHistory: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-mono disabled:opacity-50"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
                          <input
                            type="checkbox"
                            checked={work.isCurrent}
                            onChange={e => {
                              const updated = [...profile.workHistory];
                              updated[idx].isCurrent = e.target.checked;
                              if (e.target.checked) updated[idx].endDate = '';
                              onChange({ ...profile, workHistory: updated });
                            }}
                            className="rounded text-kai-vermilion"
                          />
                          Currently Working Here (現在に至る)
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Responsibilities & Achievements</label>
                      <textarea
                        rows={3}
                        value={work.responsibilities}
                        onChange={e => {
                          const updated = [...profile.workHistory];
                          updated[idx].responsibilities = e.target.value;
                          onChange({ ...profile, workHistory: updated });
                        }}
                        placeholder="What you built, engineered, or optimized..."
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Technical Projects */}
      {activeTab === 'projects' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
            <div>
              <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Technical Projects (プロジェクト経歴)</h3>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">Crucial for demonstrating hands-on technical competence, especially for engineers.</p>
            </div>
            <button
              onClick={() => {
                const newProj: ProjectItem = {
                  id: `proj_${Date.now()}`,
                  title: '',
                  role: '',
                  tools: [],
                  whatIDid: '',
                  measurableResult: ''
                };
                onChange({ ...profile, projects: [...profile.projects, newProj] });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kai-vermilion text-white text-xs hover:opacity-90 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </button>
          </div>

          {profile.projects.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-2">No projects added yet.</p>
          ) : (
            <div className="space-y-4">
              {profile.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#E7DECE] dark:border-[#1E2C48] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B6358] dark:text-[#94A3B8]">Project #{idx + 1}</span>
                    <button
                      onClick={() => {
                        onChange({
                          ...profile,
                          projects: profile.projects.filter((_, i) => i !== idx)
                        });
                      }}
                      className="text-stone-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={e => {
                          const updated = [...profile.projects];
                          updated[idx].title = e.target.value;
                          onChange({ ...profile, projects: updated });
                        }}
                        placeholder="e.g. RISC-V 5-Stage Pipelined Processor"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Your Role</label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={e => {
                          const updated = [...profile.projects];
                          updated[idx].role = e.target.value;
                          onChange({ ...profile, projects: updated });
                        }}
                        placeholder="e.g. Lead RTL Designer"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Tools & Technologies (Comma-separated)</label>
                    <input
                      type="text"
                      value={proj.tools.join(', ')}
                      onChange={e => {
                        const updated = [...profile.projects];
                        updated[idx].tools = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        onChange({ ...profile, projects: updated });
                      }}
                      placeholder="e.g. Verilog, SystemC, Modelsim, FPGA, C++"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">What I Did (Architecture, Implementation, Testing)</label>
                    <textarea
                      rows={2}
                      value={proj.whatIDid}
                      onChange={e => {
                        const updated = [...profile.projects];
                        updated[idx].whatIDid = e.target.value;
                        onChange({ ...profile, projects: updated });
                      }}
                      placeholder="Designed hazard detection unit and forwarded ALU operands..."
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Measurable Result (if any)</label>
                    <input
                      type="text"
                      value={proj.measurableResult || ''}
                      onChange={e => {
                        const updated = [...profile.projects];
                        updated[idx].measurableResult = e.target.value;
                        onChange({ ...profile, projects: updated });
                      }}
                      placeholder="e.g. Achieved 120MHz clock frequency on Artix-7 FPGA with 0 timing violations"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Skills, Certifications, Languages */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Skills */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
              <div>
                <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Technical Skills (活かせるスキル)</h3>
                <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">Rate your honest self-assessed level (never exaggerated).</p>
              </div>
              <button
                onClick={() => {
                  const newSkill: SkillItem = {
                    id: `sk_${Date.now()}`,
                    name: '',
                    category: 'software',
                    level: 'intermediate'
                  };
                  onChange({ ...profile, skills: [...profile.skills, newSkill] });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kai-vermilion text-white text-xs hover:opacity-90 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>

            {profile.skills.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">No skills registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.skills.map((skill, idx) => (
                  <div key={skill.id || idx} className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#E7DECE] dark:border-[#1E2C48] flex items-center gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => {
                        const updated = [...profile.skills];
                        updated[idx].name = e.target.value;
                        onChange({ ...profile, skills: updated });
                      }}
                      placeholder="e.g. C / C++"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-semibold"
                    />
                    <select
                      value={skill.level}
                      onChange={e => {
                        const updated = [...profile.skills];
                        updated[idx].level = e.target.value as SkillLevel;
                        onChange({ ...profile, skills: updated });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <button
                      onClick={() => {
                        onChange({
                          ...profile,
                          skills: profile.skills.filter((_, i) => i !== idx)
                        });
                      }}
                      className="text-stone-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages & JLPT */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
              <div>
                <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Languages & JLPT (語学力)</h3>
                <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">Only add JLPT level if you have officially obtained or are studying for it.</p>
              </div>
              <button
                onClick={() => {
                  const newLang: LanguageItem = {
                    id: `lang_${Date.now()}`,
                    language: '',
                    proficiency: 'Conversational'
                  };
                  onChange({ ...profile, languages: [...profile.languages, newLang] });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-kai-indigo text-white dark:bg-[#203254] text-xs hover:opacity-90 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Language
              </button>
            </div>

            {profile.languages.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">No languages listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#E7DECE] dark:border-[#1E2C48] flex items-center gap-2">
                    <input
                      type="text"
                      value={lang.language}
                      onChange={e => {
                        const updated = [...profile.languages];
                        updated[idx].language = e.target.value;
                        onChange({ ...profile, languages: updated });
                      }}
                      placeholder="e.g. Japanese"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs font-medium"
                    />
                    <select
                      value={lang.jlptLevel || ''}
                      onChange={e => {
                        const updated = [...profile.languages];
                        updated[idx].jlptLevel = e.target.value ? (e.target.value as JLPTLevel) : undefined;
                        onChange({ ...profile, languages: updated });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-white dark:bg-[#141D33] border border-stone-200 dark:border-stone-700 text-xs"
                    >
                      <option value="">No JLPT</option>
                      <option value="N5">JLPT N5</option>
                      <option value="N4">JLPT N4</option>
                      <option value="N3">JLPT N3</option>
                      <option value="N2">JLPT N2</option>
                      <option value="N1">JLPT N1</option>
                    </select>
                    <button
                      onClick={() => {
                        onChange({
                          ...profile,
                          languages: profile.languages.filter((_, i) => i !== idx)
                        });
                      }}
                      className="text-stone-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Self-PR, Reason for Application, Hopes */}
      {activeTab === 'pr' && (
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-6">
          <div className="border-b border-[#E7DECE] dark:border-[#1E2C48] pb-3">
            <h3 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">Self-PR & Target Roles (自己PR・志望動機)</h3>
            <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">These texts directly populate your Rirekisho, Shokumukeirekisho, and English CV.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1]">Self-PR (自己PR)</label>
              {onOpenAIPolish && (
                <button
                  type="button"
                  onClick={() => onOpenAIPolish(profile.selfPR, res => onChange({ ...profile, selfPR: res }))}
                  className="flex items-center gap-1 text-[11px] text-kai-vermilion hover:underline font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  Polish with AI
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={profile.selfPR}
              onChange={e => onChange({ ...profile, selfPR: e.target.value })}
              placeholder="Highlight your key engineering strengths, problem-solving mindset, and passion..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Reason for Application (志望動機)</label>
            <textarea
              rows={3}
              value={profile.reasonForApplication}
              onChange={e => onChange({ ...profile, reasonForApplication: e.target.value })}
              placeholder="Why you wish to join Japanese engineering teams in your target domain..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#544D42] dark:text-[#CBD5E1] mb-1">Hopes and Requests (本人希望記入欄)</label>
            <input
              type="text"
              value={profile.hopesAndWishes}
              onChange={e => onChange({ ...profile, hopesAndWishes: e.target.value })}
              placeholder="e.g. 貴社の規定に従います (Standard: 'I abide by company regulations')"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#283C62] text-sm text-[#14110F] dark:text-[#F3EBDD] focus:outline-none focus:border-kai-vermilion"
            />
          </div>
        </div>
      )}
    </div>
  );
};
