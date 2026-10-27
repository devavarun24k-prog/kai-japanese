// src/features/jobs/components/JobListView.tsx
// Filterable and searchable tabular list view of job applications
import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { JobApplication, JobFilterState, JobStatus, JapaneseRequirement, WorkArrangement } from '../types';
import { JobCard } from './JobCard';
import { getDaysUntil } from '../utils/reminderCalculator';

interface JobListViewProps {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (job: JobApplication, newStatus: JobStatus) => void;
}

export const JobListView: React.FC<JobListViewProps> = ({ jobs, onEdit, onDelete, onStatusChange }) => {
  const [filters, setFilters] = useState<JobFilterState>({
    searchQuery: '',
    status: 'all',
    location: '',
    japaneseLevel: 'all',
    workArrangement: 'all',
    overseasAcceptedOnly: false,
    deadlineSoonOnly: false
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // 1. Search Query (Employer, Title, or Skills)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesEmployer = job.employer.toLowerCase().includes(q);
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesSkills = job.technicalSkills.some(s => s.toLowerCase().includes(q));
        if (!matchesEmployer && !matchesTitle && !matchesSkills) return false;
      }

      // 2. Status
      if (filters.status && filters.status !== 'all' && job.status !== filters.status) {
        return false;
      }

      // 3. Location / Prefecture
      if (filters.location && filters.location.trim()) {
        if (!job.location.toLowerCase().includes(filters.location.toLowerCase().trim())) {
          return false;
        }
      }

      // 4. Japanese Level
      if (filters.japaneseLevel && filters.japaneseLevel !== 'all') {
        if (job.japaneseLevel !== filters.japaneseLevel) return false;
      }

      // 5. Work Arrangement
      if (filters.workArrangement && filters.workArrangement !== 'all') {
        if (job.workArrangement !== filters.workArrangement) return false;
      }

      // 6. Overseas Accepted
      if (filters.overseasAcceptedOnly && job.overseasApplicantsAccepted.status !== 'yes') {
        return false;
      }

      // 7. Deadline Soon (<= 7 days and not overdue)
      if (filters.deadlineSoonOnly) {
        if (!job.deadline) return false;
        const days = getDaysUntil(job.deadline);
        if (days === null || days < 0 || days > 7) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-3">
        {/* Search Input & Status Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search employer, title, or skills (e.g. Sony, C++, RTOS)..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filters.status || 'all'}
              onChange={e => setFilters({ ...filters, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white"
            >
              <option value="all">All Pipeline Stages</option>
              <option value="interested">Interested</option>
              <option value="planned">Planned</option>
              <option value="applied">Applied</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="offer_received">Offer Received</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Granular Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80 text-xs">
          {/* Japanese Level */}
          <select
            value={filters.japaneseLevel || 'all'}
            onChange={e => setFilters({ ...filters, japaneseLevel: e.target.value as any })}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 text-xs"
          >
            <option value="all">Japanese: Any</option>
            <option value="None">None</option>
            <option value="N5">JLPT N5</option>
            <option value="N4">JLPT N4</option>
            <option value="N3">JLPT N3</option>
            <option value="N2">JLPT N2</option>
            <option value="N1">JLPT N1</option>
          </select>

          {/* Work Arrangement */}
          <select
            value={filters.workArrangement || 'all'}
            onChange={e => setFilters({ ...filters, workArrangement: e.target.value as any })}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 text-xs"
          >
            <option value="all">Work Arrangement: All</option>
            <option value="on_site">On-Site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>

          {/* Location Search */}
          <input
            type="text"
            value={filters.location || ''}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            placeholder="Prefecture (Tokyo, etc.)"
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 text-xs w-36"
          />

          {/* Overseas Accepted Checkbox */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 cursor-pointer text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={filters.overseasAcceptedOnly}
              onChange={e => setFilters({ ...filters, overseasAcceptedOnly: e.target.checked })}
              className="rounded text-kai-vermilion"
            />
            <span>Overseas Applicants OK</span>
          </label>

          {/* Deadline Soon Checkbox */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 cursor-pointer text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={filters.deadlineSoonOnly}
              onChange={e => setFilters({ ...filters, deadlineSoonOnly: e.target.checked })}
              className="rounded text-kai-vermilion"
            />
            <span>Deadline in &le; 7 Days</span>
          </label>

          {(filters.searchQuery || filters.status !== 'all' || filters.location || filters.japaneseLevel !== 'all' || filters.workArrangement !== 'all' || filters.overseasAcceptedOnly || filters.deadlineSoonOnly) && (
            <button
              onClick={() => setFilters({
                searchQuery: '',
                status: 'all',
                location: '',
                japaneseLevel: 'all',
                workArrangement: 'all',
                overseasAcceptedOnly: false,
                deadlineSoonOnly: false
              })}
              className="text-stone-400 hover:text-kai-vermilion flex items-center gap-1 text-[11px] ml-auto"
            >
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/40 dark:bg-[#10192C]/40 border border-stone-200 dark:border-stone-800 space-y-2">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">No applications match your active filters.</p>
          <p className="text-xs text-stone-500">Add a new manual application or reset your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
