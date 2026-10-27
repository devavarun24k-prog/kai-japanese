// src/features/jobs/components/JobCard.tsx
// Mobile-friendly card representing a tracked job application with status chips and countdowns
import React from 'react';
import { ExternalLink, Calendar, MapPin, DollarSign, Globe, Trash2, Edit2, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { JobApplication, JobStatus } from '../types';
import { getDeadlineCountdown } from '../utils/reminderCalculator';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (job: JobApplication, newStatus: JobStatus) => void;
}

const ALL_STATUSES: { id: JobStatus; label: string }[] = [
  { id: 'interested', label: 'Interested' },
  { id: 'planned', label: 'Planned' },
  { id: 'applied', label: 'Applied' },
  { id: 'interview_scheduled', label: 'Interview' },
  { id: 'offer_received', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'closed', label: 'Closed' }
];

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, onStatusChange }) => {
  const countdown = getDeadlineCountdown(job.deadline);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] shadow-sm hover:shadow-md transition-shadow space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-kai-vermilion">
            {job.employer}
          </span>
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
            {job.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(job)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            title="Edit job"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            title="Delete job"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Meta tags: Location, Work Arrangement, Japanese Level */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
        {job.location && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 font-medium">
            <MapPin size={11} />
            {job.location}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 capitalize">
          {job.workArrangement.replace('_', ' ')}
        </span>
        {job.japaneseLevel !== 'Not Stated' && (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 font-semibold">
            {job.japaneseLevel}
          </span>
        )}
        {job.overseasApplicantsAccepted.status === 'yes' && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-medium">
            Overseas OK
          </span>
        )}
      </div>

      {/* Salary & Deadline */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 dark:border-stone-800/60">
        <div className="text-[11px] text-stone-500 font-medium">
          {job.salaryAndBenefits !== 'Not stated' ? job.salaryAndBenefits : 'Salary: Not stated'}
        </div>
        {countdown && (
          <div
            className={`flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-full font-bold ${
              countdown.alertLevel === 'danger'
                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                : countdown.alertLevel === 'warning'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            <Clock size={11} />
            {countdown.label}
          </div>
        )}
      </div>

      {/* Skills */}
      {job.technicalSkills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.technicalSkills.slice(0, 4).map(skill => (
            <span key={skill} className="px-1.5 py-0.5 rounded bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 text-[10px] font-mono text-stone-600 dark:text-stone-300">
              {skill}
            </span>
          ))}
          {job.technicalSkills.length > 4 && (
            <span className="text-[10px] text-stone-400 self-center">
              +{job.technicalSkills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Attached Resume Tag & Links */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        {job.attachedResumeVersion ? (
          <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-[10px] truncate max-w-[150px]">
            <FileText size={11} className="text-kai-indigo" />
            {job.attachedResumeVersion.name}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {job.sourceUrl && (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-kai-vermilion hover:underline text-[11px]"
            >
              Listing <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Status Switcher (Dropdown / Chips) */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
        <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
          Status Pipeline:
        </label>
        <select
          value={job.status}
          onChange={e => onStatusChange(job, e.target.value as JobStatus)}
          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-medium"
        >
          {ALL_STATUSES.map(st => (
            <option key={st.id} value={st.id}>
              {st.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
