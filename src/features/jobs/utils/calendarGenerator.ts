// src/features/jobs/utils/calendarGenerator.ts
// Standard RFC 5545 iCalendar (.ics) export generator for application deadlines and follow-up dates
import { JobApplication } from '../types';

function formatIcsDate(dateStr: string): string {
  // Converts YYYY-MM-DD to YYYYMMDD
  return dateStr.replace(/[^0-9]/g, '');
}

/**
 * Generates an iCalendar (.ics) string for jobs with upcoming deadlines or follow-ups
 */
export function generateIcsCalendar(jobs: JobApplication[]): string {
  const events: string[] = [];
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  jobs.forEach(job => {
    // 1. Deadline Event
    if (job.deadline) {
      const cleanDate = formatIcsDate(job.deadline);
      events.push([
        'BEGIN:VEVENT',
        `UID:job-deadline-${job.id}@kai.mastery`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:Deadline: ${job.employer} - ${job.title}`,
        `DESCRIPTION:Application deadline for ${job.title} at ${job.employer}.\\nSource: ${job.sourceUrl}${job.notes ? '\\nNotes: ' + job.notes.replace(/\n/g, '\\n') : ''}`,
        `URL:${job.officialApplicationUrl || job.sourceUrl}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: 1 day until deadline for ${job.employer}`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n'));
    }

    // 2. Follow-Up Event
    if (job.followUpDate) {
      const cleanDate = formatIcsDate(job.followUpDate);
      events.push([
        'BEGIN:VEVENT',
        `UID:job-followup-${job.id}@kai.mastery`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:Follow-Up: ${job.employer} (${job.title})`,
        `DESCRIPTION:Scheduled candidate follow-up for application at ${job.employer}.\\nApplication Date: ${job.applicationDate || 'N/A'}\\nSource: ${job.sourceUrl}`,
        `URL:${job.officialApplicationUrl || job.sourceUrl}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT9H', // 9:00 AM morning reminder
        'ACTION:DISPLAY',
        `DESCRIPTION:Follow up with ${job.employer} today`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n'));
    }
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KAI Japanese Mastery//Job Tracker Pipeline//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events.join('\r\n'),
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Triggers a browser file download of the generated .ics calendar
 */
export function downloadIcsFile(jobs: JobApplication[], filename = 'kai_job_reminders.ics'): void {
  const content = generateIcsCalendar(jobs);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
