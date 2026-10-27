// src/features/jobs/components/JobDashboardSummary.tsx
// High-level metrics: pipeline counts, weekly application velocity, and active reminder alerts
import React from 'react';
import { Target, Send, Clock, Calendar, AlertTriangle, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import { JobApplication } from '../types';
import { getStatusCounts, getApplicationsThisWeek, getActiveReminders, getDeadlineCountdown } from '../utils/reminderCalculator';

interface JobDashboardSummaryProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
}

export const JobDashboardSummary: React.FC<JobDashboardSummaryProps> = ({ jobs, onSelectJob }) => {
  const counts = getStatusCounts(jobs);
  const weeklyVelocity = getApplicationsThisWeek(jobs);
  const activeReminders = getActiveReminders(jobs);

  const upcomingDeadlines = jobs
    .filter(j => j.deadline && j.status !== 'rejected' && j.status !== 'closed' && j.status !== 'offer_received')
    .map(j => ({ job: j, countdown: getDeadlineCountdown(j.deadline)! }))
    .filter(item => item.countdown !== null && !item.countdown.isOverdue)
    .sort((a, b) => a.countdown.daysRemaining - b.countdown.daysRemaining)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. In-App Urgent Reminders Banner (7/3/1 Days and Follow-ups) */}
      {activeReminders.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-900 dark:text-amber-200">
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>Active Pipeline Reminders ({activeReminders.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeReminders.map(rem => (
              <div
                key={rem.id}
                onClick={() => {
                  const targetJob = jobs.find(j => j.id === rem.jobId);
                  if (targetJob) onSelectJob(targetJob);
                }}
                className="cursor-pointer p-2.5 rounded-xl bg-white/90 dark:bg-[#10192C] border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs hover:border-kai-vermilion transition-colors"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{rem.employer}: </span>
                  <span className="text-stone-600 dark:text-stone-400">{rem.message}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold flex-shrink-0 ${
                  rem.urgency === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {rem.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Active */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Active Leads</span>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-white">
            {counts.interested + counts.planned + counts.applied + counts.interview_scheduled}
          </div>
          <p className="text-[10px] text-stone-500">{counts.interested} interested, {counts.applied} applied</p>
        </div>

        {/* Interviews */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Interviews Active</span>
          <div className="text-2xl font-bold font-mono text-kai-indigo dark:text-sky-300">
            {counts.interview_scheduled}
          </div>
          <p className="text-[10px] text-stone-500">Scheduled rounds</p>
        </div>

        {/* Offers Received */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Offers Received</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {counts.offer_received}
          </div>
          <p className="text-[10px] text-stone-500">Target outcomes</p>
        </div>

        {/* Applications This Week */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Velocity This Week</span>
          <div className="text-2xl font-bold font-mono text-kai-vermilion">
            {weeklyVelocity}
          </div>
          <p className="text-[10px] text-stone-500">Sent in last 7 days</p>
        </div>
      </div>

      {/* 3. Upcoming Deadlines with Live Countdown */}
      {upcomingDeadlines.length > 0 && (
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-3">
          <div className="flex items-center justify-between border-b border-[#E7DECE] dark:border-[#1E2C48] pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-kai-vermilion" />
              Upcoming Application Deadlines (Live Countdowns)
            </h3>
            <span className="text-[11px] text-stone-500">{upcomingDeadlines.length} scheduled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingDeadlines.map(({ job, countdown }) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="cursor-pointer p-3 rounded-2xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-800 flex items-center justify-between hover:border-kai-indigo transition-all"
              >
                <div>
                  <div className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1">{job.employer}</div>
                  <div className="text-[11px] text-stone-500 line-clamp-1">{job.title}</div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">Deadline: {job.deadline}</div>
                </div>
                <div className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold ${
                  countdown.alertLevel === 'danger'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                }`}>
                  {countdown.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
