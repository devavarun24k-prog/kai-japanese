// src/tests/jobs.test.ts
// Comprehensive unit tests for Job Tracker: Status transitions, Tri-state defaults, Duplicates, Reminders, Privacy, and ICS generation
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createEmptyJobApplication,
  loadJobs,
  saveJobs,
  upsertJobApplication,
  deleteJobApplication,
  findDuplicateJob,
  loadVerifiedSources,
  saveVerifiedSources,
  isSourceStale
} from '../features/jobs/storage';
import {
  getDaysUntil,
  getDeadlineCountdown,
  getActiveReminders,
  getApplicationsThisWeek,
  getStatusCounts
} from '../features/jobs/utils/reminderCalculator';
import { generateIcsCalendar } from '../features/jobs/utils/calendarGenerator';
import { JobApplication } from '../features/jobs/types';

// Node localStorage mock for Vitest environment
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  globalThis.localStorage = new LocalStorageMock() as any;
}

describe('Job Tracker Pipeline & Tri-State Defaults', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty job list and never pre-populates synthetic vacancies', () => {
    const jobs = loadJobs('new_user_1');
    expect(jobs).toEqual([]);
  });

  it('strictly defaults tri-state sponsorship fields to "unknown"', () => {
    const newJob = createEmptyJobApplication();
    expect(newJob.overseasApplicantsAccepted.status).toBe('unknown');
    expect(newJob.relocationSupport.status).toBe('unknown');
    expect(newJob.visaSponsorship.status).toBe('unknown');
    expect(newJob.status).toBe('interested');
    expect(newJob.statusHistory.length).toBe(1);
    expect(newJob.statusHistory[0].toStatus).toBe('interested');
  });

  it('tracks status transition history when advancing an application', () => {
    const job = createEmptyJobApplication();
    job.id = 'job_test_1';
    job.employer = 'Renesas Electronics';
    job.title = 'MCU Application Engineer';
    job.sourceUrl = 'https://renesas.com/careers/123';

    // 1. Initial Insert
    upsertJobApplication(job, 'user_test');
    let loaded = loadJobs('user_test');
    expect(loaded.length).toBe(1);
    expect(loaded[0].status).toBe('interested');
    expect(loaded[0].statusHistory.length).toBe(1);

    // 2. Advance status to 'applied'
    const appliedJob: JobApplication = {
      ...loaded[0],
      status: 'applied',
      applicationDate: '2026-10-27'
    };
    upsertJobApplication(appliedJob, 'user_test', 'Submitted via portal');

    loaded = loadJobs('user_test');
    expect(loaded[0].status).toBe('applied');
    expect(loaded[0].statusHistory.length).toBe(2);
    expect(loaded[0].statusHistory[1].fromStatus).toBe('interested');
    expect(loaded[0].statusHistory[1].toStatus).toBe('applied');
    expect(loaded[0].statusHistory[1].note).toBe('Submitted via portal');

    // 3. Advance to 'interview_scheduled'
    const interviewJob: JobApplication = {
      ...loaded[0],
      status: 'interview_scheduled',
      followUpDate: '2026-11-03'
    };
    upsertJobApplication(interviewJob, 'user_test', '1st round technical interview');

    loaded = loadJobs('user_test');
    expect(loaded[0].status).toBe('interview_scheduled');
    expect(loaded[0].statusHistory.length).toBe(3);
    expect(loaded[0].statusHistory[2].toStatus).toBe('interview_scheduled');
  });
});

describe('Duplicate URL Detection', () => {
  it('detects duplicate source URLs and application URLs', () => {
    const existingJob = createEmptyJobApplication();
    existingJob.id = 'job_existing';
    existingJob.employer = 'Sony';
    existingJob.title = 'Firmware Engineer';
    existingJob.sourceUrl = 'https://sony.com/jobs/firmware-101';
    existingJob.officialApplicationUrl = 'https://ats.sony.com/apply/101';

    const jobs = [existingJob];

    // Same source URL
    expect(findDuplicateJob('https://sony.com/jobs/firmware-101', undefined, jobs)).not.toBeNull();
    // Same source URL with uppercase / spaces
    expect(findDuplicateJob('  HTTPS://SONY.COM/jobs/firmware-101  ', undefined, jobs)).not.toBeNull();
    // Same official application URL
    expect(findDuplicateJob('https://ats.sony.com/apply/101', undefined, jobs)).not.toBeNull();

    // Different URL
    expect(findDuplicateJob('https://sony.com/jobs/hardware-202', undefined, jobs)).toBeNull();

    // Editing the same job ignores itself
    expect(findDuplicateJob('https://sony.com/jobs/firmware-101', 'job_existing', jobs)).toBeNull();
  });
});

describe('Deadline & Reminder Calculations', () => {
  const baseDate = new Date('2026-10-27T10:00:00Z');

  it('calculates days remaining and countdown labels accurately', () => {
    // 3 days left
    const in3Days = getDeadlineCountdown('2026-10-30', baseDate);
    expect(in3Days?.daysRemaining).toBe(3);
    expect(in3Days?.isOverdue).toBe(false);
    expect(in3Days?.label).toBe('3 days left');
    expect(in3Days?.alertLevel).toBe('warning');

    // 1 day left
    const in1Day = getDeadlineCountdown('2026-10-28', baseDate);
    expect(in1Day?.daysRemaining).toBe(1);
    expect(in1Day?.label).toBe('1 day left');
    expect(in1Day?.alertLevel).toBe('danger');

    // Today
    const today = getDeadlineCountdown('2026-10-27', baseDate);
    expect(today?.daysRemaining).toBe(0);
    expect(today?.isToday).toBe(true);
    expect(today?.label).toBe('Deadline is TODAY');

    // Overdue
    const overdue = getDeadlineCountdown('2026-10-24', baseDate);
    expect(overdue?.isOverdue).toBe(true);
    expect(overdue?.label).toContain('Expired');
    expect(overdue?.alertLevel).toBe('danger');
  });

  it('generates in-app reminders for 7d, 3d, 1d, and today deadlines and follow-ups', () => {
    const job1 = createEmptyJobApplication();
    job1.id = 'j1';
    job1.employer = 'Company A';
    job1.title = 'Dev';
    job1.deadline = '2026-10-28'; // 1 day left

    const job2 = createEmptyJobApplication();
    job2.id = 'j2';
    job2.employer = 'Company B';
    job2.title = 'QA';
    job2.deadline = '2026-10-30'; // 3 days left

    const job3 = createEmptyJobApplication();
    job3.id = 'j3';
    job3.employer = 'Company C';
    job3.title = 'PM';
    job3.followUpDate = '2026-10-27'; // Follow-up due today

    const reminders = getActiveReminders([job1, job2, job3], baseDate);
    expect(reminders.length).toBe(3);
    expect(reminders.some(r => r.type === 'deadline_1d' && r.jobId === 'j1')).toBe(true);
    expect(reminders.some(r => r.type === 'deadline_3d' && r.jobId === 'j2')).toBe(true);
    expect(reminders.some(r => r.type === 'followup_today' && r.jobId === 'j3')).toBe(true);
  });

  it('calculates applications submitted this week', () => {
    const jobThisWeek = createEmptyJobApplication();
    jobThisWeek.applicationDate = '2026-10-25'; // 2 days ago

    const jobOld = createEmptyJobApplication();
    jobOld.applicationDate = '2026-10-01'; // 26 days ago

    const count = getApplicationsThisWeek([jobThisWeek, jobOld], baseDate);
    expect(count).toBe(1);
  });
});

describe('User Privacy & Storage Isolation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('isolates job applications between different user accounts', () => {
    const jobA = createEmptyJobApplication();
    jobA.employer = 'User A Company';
    saveJobs([jobA], 'user_alice');

    const jobB = createEmptyJobApplication();
    jobB.employer = 'User B Company';
    saveJobs([jobB], 'user_bob');

    const aliceJobs = loadJobs('user_alice');
    const bobJobs = loadJobs('user_bob');

    expect(aliceJobs.length).toBe(1);
    expect(aliceJobs[0].employer).toBe('User A Company');

    expect(bobJobs.length).toBe(1);
    expect(bobJobs[0].employer).toBe('User B Company');
  });

  it('flags stale verified sources when past 60 days', () => {
    expect(isSourceStale('2026-08-01', 60)).toBe(true);
    expect(isSourceStale(new Date().toISOString().slice(0, 10), 60)).toBe(false);
  });
});

describe('RFC 5545 iCalendar (.ics) Export', () => {
  it('generates standard RFC 5545 calendar with VEVENT and VALARM', () => {
    const job = createEmptyJobApplication();
    job.id = 'ics_test_1';
    job.employer = 'Tokyo Tech Corp';
    job.title = 'Robotics Engineer';
    job.sourceUrl = 'https://tokyotech.example/job';
    job.deadline = '2026-11-15';
    job.followUpDate = '2026-11-20';

    const ics = generateIcsCalendar([job]);

    // RFC 5545 structural tags
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Deadline: Tokyo Tech Corp - Robotics Engineer');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261115');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('SUMMARY:Follow-Up: Tokyo Tech Corp (Robotics Engineer)');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261120');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });
});
