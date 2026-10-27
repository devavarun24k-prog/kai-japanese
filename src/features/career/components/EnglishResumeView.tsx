// src/features/career/components/EnglishResumeView.tsx
// English CV & One-Page Resume Generator built from the same unified Profile
import React, { useState } from 'react';
import { FileText, Printer, Edit3, Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { CareerProfile } from '../types';

interface EnglishResumeViewProps {
  profile: CareerProfile;
  onChange?: (updated: CareerProfile) => void;
}

export const EnglishResumeView: React.FC<EnglishResumeViewProps> = ({ profile, onChange }) => {
  const [layoutMode, setLayoutMode] = useState<'one_page' | 'detailed_cv'>('one_page');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#EFE8DC] dark:bg-[#0D1526] border border-[#DDD2B8] dark:border-[#223354] print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#141D33] p-1 rounded-xl border border-stone-300 dark:border-stone-700">
            <button
              onClick={() => setLayoutMode('one_page')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                layoutMode === 'one_page'
                  ? 'bg-kai-indigo text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              One-Page Tech Resume
            </button>
            <button
              onClick={() => setLayoutMode('detailed_cv')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                layoutMode === 'detailed_cv'
                  ? 'bg-kai-indigo text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Multi-Page Academic / Tech CV
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isEditing
                ? 'bg-kai-gold text-white border-kai-gold'
                : 'bg-white dark:bg-[#141D33] text-[#544D42] dark:text-[#CBD5E1] border-stone-300 dark:border-stone-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Editing Mode' : 'Quick Edit'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-kai-vermilion text-white shadow-sm hover:opacity-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* English Resume Sheet */}
      <div className="english-resume-sheet bg-white text-[#1E293B] p-8 sm:p-12 rounded-2xl shadow-md border border-stone-300 max-w-4xl mx-auto font-sans leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full space-y-5">
        {/* Header */}
        <header className="border-b-2 border-stone-800 pb-4 text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
            {profile.personalDetails.fullNameRomaji || profile.personalDetails.fullNameKanji || 'Your Full Name'}
          </h1>
          {profile.targetRoles.length > 0 && (
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-stone-600 uppercase">
              {profile.targetRoles.join(' • ')}
            </p>
          )}

          {/* Contact Details & Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-600 pt-1 font-mono">
            {profile.personalDetails.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {profile.personalDetails.email}
              </span>
            )}
            {profile.personalDetails.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {profile.personalDetails.phone}
              </span>
            )}
            {profile.personalDetails.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.personalDetails.address}
              </span>
            )}
            {profile.personalDetails.workAuthorization && (
              <span className="font-semibold text-kai-vermilion">
                [{profile.personalDetails.workAuthorization}]
              </span>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {profile.selfPR && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-stone-300 pb-0.5 text-stone-800">
              Professional Summary
            </h2>
            {isEditing ? (
              <textarea
                rows={3}
                value={profile.selfPR}
                onChange={e => onChange && onChange({ ...profile, selfPR: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded text-xs"
              />
            ) : (
              <p className="text-xs text-stone-700 leading-normal">{profile.selfPR}</p>
            )}
          </section>
        )}

        {/* Technical Skills */}
        {profile.skills.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-stone-300 pb-0.5 text-stone-800">
              Technical Competencies
            </h2>
            <div className="text-xs space-y-1 text-stone-700">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-stone-900 w-28 flex-shrink-0">Proficient:</span>
                <span className="font-mono">
                  {profile.skills.filter(s => s.level === 'expert' || s.level === 'advanced').map(s => s.name).join(', ') || '—'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-stone-900 w-28 flex-shrink-0">Familiar With:</span>
                <span className="font-mono">
                  {profile.skills.filter(s => s.level === 'intermediate' || s.level === 'beginner').map(s => s.name).join(', ') || '—'}
                </span>
              </div>
              {profile.languages.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-stone-900 w-28 flex-shrink-0">Languages:</span>
                  <span>
                    {profile.languages.map(l => `${l.language} (${l.proficiency}${l.jlptLevel ? ` - ${l.jlptLevel}` : ''})`).join('; ')}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Technical Projects */}
        {profile.projects.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-stone-300 pb-0.5 text-stone-800">
              Featured Engineering Projects
            </h2>
            <div className="space-y-2.5">
              {profile.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="text-xs space-y-0.5">
                  <div className="flex items-baseline justify-between font-semibold">
                    <span className="text-stone-900 text-[13px]">{proj.title}</span>
                    <span className="text-stone-500 font-mono text-[11px]">{proj.role}</span>
                  </div>
                  {proj.tools.length > 0 && (
                    <div className="text-stone-500 font-mono text-[10px]">
                      Tech Stack: {proj.tools.join(', ')}
                    </div>
                  )}
                  <p className="text-stone-700 leading-normal pl-2 border-l-2 border-stone-200">
                    {proj.whatIDid}
                  </p>
                  {proj.measurableResult && (
                    <p className="text-stone-800 font-medium text-[11px] pl-2">
                      <span className="text-emerald-700 font-bold">Result:</span> {proj.measurableResult}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work & Internship Experience */}
        {profile.workHistory.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-stone-300 pb-0.5 text-stone-800">
              Work & Internship Experience
            </h2>
            <div className="space-y-2.5">
              {profile.workHistory.map((work, idx) => (
                <div key={work.id || idx} className="text-xs space-y-0.5">
                  <div className="flex items-baseline justify-between font-semibold">
                    <span className="text-stone-900 text-[13px]">{work.companyName} — {work.role}</span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      {work.startDate} – {work.isCurrent ? 'Present' : (work.endDate || '')}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-normal pl-2 border-l-2 border-stone-200">
                    {work.responsibilities}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.educationHistory.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-stone-300 pb-0.5 text-stone-800">
              Education
            </h2>
            <div className="space-y-1.5">
              {profile.educationHistory.map((edu, idx) => (
                <div key={edu.id || idx} className="text-xs flex items-baseline justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">{edu.institution}</span>
                    {edu.major && <span className="text-stone-600"> — {edu.major}</span>}
                  </div>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {edu.endDate || edu.startDate} ({edu.status})
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-stone-300 pb-0.5 text-stone-800">
              Certifications & Credentials
            </h2>
            <div className="text-xs space-y-0.5">
              {profile.certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex items-baseline justify-between">
                  <span className="font-medium text-stone-800">{cert.name}</span>
                  <span className="text-stone-500 font-mono text-[11px]">{cert.dateObtained}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
