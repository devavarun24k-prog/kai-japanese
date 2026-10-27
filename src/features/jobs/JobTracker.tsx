// src/features/jobs/JobTracker.tsx
// Job Tracker Pipeline & Applications Chamber
import React, { useState } from 'react';
import { Plus, Download, LayoutDashboard, Kanban, ListFilter, ShieldCheck, Calendar, Bell, HelpCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { JobApplication, JobStatus } from './types';
import { loadJobs, saveJobs, upsertJobApplication, deleteJobApplication, createEmptyJobApplication } from './storage';
import { downloadIcsFile } from './utils/calendarGenerator';
import { platformService } from '../../services/platformService';
import { JobDashboardSummary } from './components/JobDashboardSummary';
import { JobBoardView } from './components/JobBoardView';
import { JobListView } from './components/JobListView';
import { VerifiedSourcesView } from './components/VerifiedSourcesView';
import { AddJobModal } from './components/AddJobModal';

export const JobTracker: React.FC = () => {
  const { userEmail } = useAuth();
  const userId = userEmail || 'anonymous';

  const [jobs, setJobs] = useState<JobApplication[]>(() => loadJobs(userId));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'board' | 'list' | 'sources'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobApplication>(() => createEmptyJobApplication());

  const handleOpenAddModal = (jobToEdit?: JobApplication) => {
    if (jobToEdit) {
      setEditingJob(jobToEdit);
    } else {
      setEditingJob(createEmptyJobApplication());
    }
    setIsModalOpen(true);
  };

  const handleSaveJob = (job: JobApplication) => {
    const updated = upsertJobApplication(job, userId);
    setJobs(updated);

    // Platform notification for deadline
    if (job.deadline) {
      try {
        platformService.showNotification({
          title: `Application Tracked: ${job.employer}`,
          body: `Deadline set for ${job.deadline} (${job.title})`
        });
      } catch {}
    }
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tracked application?')) {
      const updated = deleteJobApplication(id, userId);
      setJobs(updated);
    }
  };

  const handleStatusChange = (job: JobApplication, newStatus: JobStatus) => {
    const updatedJob: JobApplication = {
      ...job,
      status: newStatus
    };
    const updated = upsertJobApplication(updatedJob, userId, `Status changed to ${newStatus}`);
    setJobs(updated);
  };

  const handleExportIcs = () => {
    if (jobs.length === 0) {
      alert('No jobs currently in your tracker to export.');
      return;
    }
    downloadIcsFile(jobs);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#F3EBDD] to-[#EAE0CD] dark:from-[#0E1729] dark:to-[#080D18] border border-[#DDD2B8] dark:border-[#1E2E4E] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-kai-indigo/10 text-kai-indigo dark:text-sky-300 border border-kai-indigo/20">
              Pipeline Tracker • 求人応募管理
            </span>
            <span className="text-[11px] text-stone-500 font-mono">
              {jobs.length} {jobs.length === 1 ? 'Opportunity' : 'Opportunities'}
            </span>
          </div>
          <h1 className="text-2xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
            Japan Tech Job Tracker
          </h1>
          <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
            Manual-first pipeline tracking with authentic verified career sources, tri-state visa verification, and deadline countdowns.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportIcs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141D33] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 shadow-sm"
            title="Download .ics calendar with all deadlines and follow-up dates"
          >
            <Download className="w-3.5 h-3.5 text-kai-indigo" />
            Export Calendar (.ics)
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-kai-vermilion text-white hover:opacity-95 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDD2B8] dark:border-[#203050] pb-2 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard & Reminders', icon: LayoutDashboard },
          { id: 'board', label: 'Pipeline Board (Kanban)', icon: Kanban },
          { id: 'list', label: 'All Applications (Filterable)', icon: ListFilter },
          { id: 'sources', label: 'Verified Career Sources', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-kai-indigo text-white shadow-sm'
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
        {activeTab === 'dashboard' && (
          <JobDashboardSummary
            jobs={jobs}
            onSelectJob={job => handleOpenAddModal(job)}
          />
        )}
        {activeTab === 'board' && (
          <JobBoardView
            jobs={jobs}
            onEdit={job => handleOpenAddModal(job)}
            onDelete={id => handleDeleteJob(id)}
            onStatusChange={(job, st) => handleStatusChange(job, st)}
          />
        )}
        {activeTab === 'list' && (
          <JobListView
            jobs={jobs}
            onEdit={job => handleOpenAddModal(job)}
            onDelete={id => handleDeleteJob(id)}
            onStatusChange={(job, st) => handleStatusChange(job, st)}
          />
        )}
        {activeTab === 'sources' && (
          <VerifiedSourcesView userId={userId} />
        )}
      </div>

      {/* Manual Add / Edit Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        initialJob={editingJob}
        existingJobs={jobs}
        userId={userId}
      />
    </div>
  );
};
