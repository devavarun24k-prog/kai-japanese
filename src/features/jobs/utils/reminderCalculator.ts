// src/features/jobs/utils/reminderCalculator.ts
// Calculates days until deadlines, alerts (7/3/1 days), weekly applications, and status metrics
import { JobApplication, JobStatus } from '../types';

export interface DeadlineCountdown {
  daysRemaining: number;
  isOverdue: boolean;
  isToday: boolean;
  label: string;
  alertLevel: 'danger' | 'warning' | 'info' | 'none';
}

export interface JobReminder {
  id: string;
  jobId: string;
  employer: string;
  title: string;
  type: 'deadline_today' | 'deadline_1d' | 'deadline_3d' | 'deadline_7d' | 'followup_today' | 'overdue';
  message: string;
  urgency: 'high' | 'medium' | 'low';
}

/**
 * Calculates calendar days remaining until target date (YYYY-MM-DD)
 */
export function getDaysUntil(dateStr?: string, relativeTo = new Date()): number | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('-');
  if (parts.length < 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;

  // Compare calendar days at UTC midnight
  const targetUtc = Date.UTC(y, m, d);
  const relUtc = Date.UTC(relativeTo.getFullYear(), relativeTo.getMonth(), relativeTo.getDate());

  return Math.round((targetUtc - relUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Returns structured countdown and urgency for a job application's deadline
 */
export function getDeadlineCountdown(deadlineStr?: string, relativeTo = new Date()): DeadlineCountdown | null {
  if (!deadlineStr) return null;
  const days = getDaysUntil(deadlineStr, relativeTo);
  if (days === null) return null;

  if (days < 0) {
    return {
      daysRemaining: days,
      isOverdue: true,
      isToday: false,
      label: `Expired ${Math.abs(days)}d ago`,
      alertLevel: 'danger'
    };
  }

  if (days === 0) {
    return {
      daysRemaining: 0,
      isOverdue: false,
      isToday: true,
      label: 'Deadline is TODAY',
      alertLevel: 'danger'
    };
  }

  if (days === 1) {
    return {
      daysRemaining: 1,
      isOverdue: false,
      isToday: false,
      label: '1 day left',
      alertLevel: 'danger'
    };
  }

  if (days <= 3) {
    return {
      daysRemaining: days,
      isOverdue: false,
      isToday: false,
      label: `${days} days left`,
      alertLevel: 'warning'
    };
  }

  if (days <= 7) {
    return {
      daysRemaining: days,
      isOverdue: false,
      isToday: false,
      label: `${days} days left`,
      alertLevel: 'info'
    };
  }

  return {
    daysRemaining: days,
    isOverdue: false,
    isToday: false,
    label: `${days} days left`,
    alertLevel: 'none'
  };
}

/**
 * Derives in-app reminder banners (7/3/1 days before deadline and follow-up date)
 */
export function getActiveReminders(jobs: JobApplication[], relativeTo = new Date()): JobReminder[] {
  const reminders: JobReminder[] = [];
  const relYear = relativeTo.getFullYear();
  const relMonth = String(relativeTo.getMonth() + 1).padStart(2, '0');
  const relDay = String(relativeTo.getDate()).padStart(2, '0');
  const todayStr = `${relYear}-${relMonth}-${relDay}`;

  jobs.forEach(job => {
    // Only check active jobs (not closed or rejected)
    if (job.status === 'rejected' || job.status === 'closed' || job.status === 'offer_received') {
      return;
    }

    // 1. Deadline reminders (7, 3, 1 days or today)
    if (job.deadline) {
      const days = getDaysUntil(job.deadline, relativeTo);
      if (days !== null) {
        if (days === 0) {
          reminders.push({
            id: `rem_dl_0_${job.id}`,
            jobId: job.id,
            employer: job.employer,
            title: job.title,
            type: 'deadline_today',
            message: `Application deadline for ${job.employer} (${job.title}) is TODAY!`,
            urgency: 'high'
          });
        } else if (days === 1) {
          reminders.push({
            id: `rem_dl_1_${job.id}`,
            jobId: job.id,
            employer: job.employer,
            title: job.title,
            type: 'deadline_1d',
            message: `Only 1 day left to submit application to ${job.employer} (${job.title}).`,
            urgency: 'high'
          });
        } else if (days === 3) {
          reminders.push({
            id: `rem_dl_3_${job.id}`,
            jobId: job.id,
            employer: job.employer,
            title: job.title,
            type: 'deadline_3d',
            message: `3 days remaining for ${job.employer} application deadline.`,
            urgency: 'medium'
          });
        } else if (days === 7) {
          reminders.push({
            id: `rem_dl_7_${job.id}`,
            jobId: job.id,
            employer: job.employer,
            title: job.title,
            type: 'deadline_7d',
            message: `1 week until application deadline for ${job.employer}.`,
            urgency: 'low'
          });
        }
      }
    }

    // 2. Follow-Up Reminders
    if (job.followUpDate && job.followUpDate === todayStr) {
      reminders.push({
        id: `rem_fu_${job.id}`,
        jobId: job.id,
        employer: job.employer,
        title: job.title,
        type: 'followup_today',
        message: `Scheduled follow-up with ${job.employer} (${job.title}) is due today!`,
        urgency: 'medium'
      });
    }
  });

  return reminders;
}

/**
 * Counts applications submitted in the current 7-day rolling window
 */
export function getApplicationsThisWeek(jobs: JobApplication[], relativeTo = new Date()): number {
  const oneWeekAgo = new Date(relativeTo.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneWeekAgoStr = oneWeekAgo.toISOString().slice(0, 10);

  return jobs.filter(job => {
    if (!job.applicationDate) return false;
    return job.applicationDate >= oneWeekAgoStr;
  }).length;
}

/**
 * Counts jobs per pipeline status
 */
export function getStatusCounts(jobs: JobApplication[]): Record<JobStatus, number> {
  const counts: Record<JobStatus, number> = {
    interested: 0,
    planned: 0,
    applied: 0,
    interview_scheduled: 0,
    offer_received: 0,
    rejected: 0,
    closed: 0
  };

  jobs.forEach(job => {
    if (counts[job.status] !== undefined) {
      counts[job.status]++;
    }
  });

  return counts;
}
