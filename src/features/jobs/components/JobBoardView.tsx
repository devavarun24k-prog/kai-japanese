// src/features/jobs/components/JobBoardView.tsx
// Mobile-friendly Kanban-style Board view grouped by pipeline stages
import React from 'react';
import { JobApplication, JobStatus } from '../types';
import { JobCard } from './JobCard';

interface JobBoardViewProps {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (job: JobApplication, newStatus: JobStatus) => void;
}

const BOARD_COLUMNS: { status: JobStatus; title: string; color: string }[] = [
  { status: 'interested', title: 'Interested', color: 'border-t-stone-400' },
  { status: 'planned', title: 'Planned', color: 'border-t-blue-500' },
  { status: 'applied', title: 'Applied', color: 'border-t-kai-indigo' },
  { status: 'interview_scheduled', title: 'Interviewing', color: 'border-t-amber-500' },
  { status: 'offer_received', title: 'Offer Received', color: 'border-t-emerald-500' },
  { status: 'rejected', title: 'Rejected', color: 'border-t-red-400' },
  { status: 'closed', title: 'Closed', color: 'border-t-stone-500' }
];

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  jobs,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[500px]">
      {BOARD_COLUMNS.map(col => {
        const columnJobs = jobs.filter(j => j.status === col.status);

        return (
          <div
            key={col.status}
            className={`w-72 flex-shrink-0 flex flex-col rounded-3xl bg-[#FAF6EE]/80 dark:bg-[#0D1527]/80 border border-[#DDD2B8] dark:border-[#203050] border-t-4 ${col.color} p-3.5 space-y-3`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  {col.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white dark:bg-[#141D33] text-stone-600 dark:text-stone-400 shadow-2xs">
                  {columnJobs.length}
                </span>
              </div>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
              {columnJobs.length === 0 ? (
                <div className="p-8 text-center text-stone-400 dark:text-stone-600 text-xs italic border-2 border-dashed border-stone-200 dark:border-stone-800/80 rounded-2xl">
                  No applications
                </div>
              ) : (
                columnJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
