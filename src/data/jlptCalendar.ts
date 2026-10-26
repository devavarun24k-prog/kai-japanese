// src/data/jlptCalendar.ts
// JLPT Official Exam Schedule, Cities, and Local Reminder Services
// Contains officially scheduled sessions with verified dates.
// Registration dates are set to null where not yet formally announced by the host institutions.
// Includes a lastVerified timestamp to trigger stale-data warnings if older than 60 days.

export interface JLPTCalendarEntry {
  id: string;
  session: string; // e.g. "2026-12", "2027-07"
  sessionNameEn: string;
  sessionNameJp: string;
  examDate: string; // YYYY-MM-DD
  city: string;
  country: string;
  hostInstitution: string;
  registrationOpens: string | null; // Nullable: do not invent unannounced dates
  registrationCloses: string | null; // Nullable
  officialUrl: string;
  lastVerified: string; // YYYY-MM-DD
  notesEn: string;
}

export type JLPTUserStatus = 'not_planning' | 'planning' | 'applied';

export interface JLPTUserPreferences {
  targetLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  selectedCity: string;
  selectedSession: string;
  status: JLPTUserStatus;
  remindersEnabled: boolean;
  updatedAt: string;
}

// Seed data with Dec 6, 2026 and July 2027 as officially expected JLPT test windows
export const JLPT_CALENDAR_ENTRIES: JLPTCalendarEntry[] = [
  // 1. December 6, 2026 (Global Test Session)
  {
    id: 'jlpt-2026-12-tokyo',
    session: '2026-12',
    sessionNameEn: 'December 2026 Examination',
    sessionNameJp: '2026年第2回 日本語能力試験',
    examDate: '2026-12-06',
    city: 'Tokyo',
    country: 'Japan',
    hostInstitution: 'Japan Educational Exchanges and Services (JEES)',
    registrationOpens: null, // Officially expected, confirm on official site
    registrationCloses: null,
    officialUrl: 'https://www.jlpt.jp',
    lastVerified: '2026-10-15',
    notesEn: 'Expected date based on 1st Sunday of December schedule. Confirm on official JEES site.'
  },
  {
    id: 'jlpt-2026-12-hyderabad',
    session: '2026-12',
    sessionNameEn: 'December 2026 Examination',
    sessionNameJp: '2026年第2回 日本語能力試験',
    examDate: '2026-12-06',
    city: 'Hyderabad',
    country: 'India',
    hostInstitution: 'The English and Foreign Languages University (EFLU)',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.jlpt.jp',
    lastVerified: '2026-10-15',
    notesEn: 'Local test center in Hyderabad. Registration dates will be posted by the host institution.'
  },
  {
    id: 'jlpt-2026-12-newdelhi',
    session: '2026-12',
    sessionNameEn: 'December 2026 Examination',
    sessionNameJp: '2026年第2回 日本語能力試験',
    examDate: '2026-12-06',
    city: 'New Delhi',
    country: 'India',
    hostInstitution: 'MOSAI (Mombusho Scholars Association of India)',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.mosai.org.in',
    lastVerified: '2026-10-15',
    notesEn: 'Registration administered by MOSAI in North India.'
  },
  {
    id: 'jlpt-2026-12-bengaluru',
    session: '2026-12',
    sessionNameEn: 'December 2026 Examination',
    sessionNameJp: '2026年第2回 日本語能力試験',
    examDate: '2026-12-06',
    city: 'Bengaluru',
    country: 'India',
    hostInstitution: 'Bangalore Nihongo Kyooshikai',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.jlpt.jp',
    lastVerified: '2026-10-15',
    notesEn: 'South India official test administration center.'
  },
  {
    id: 'jlpt-2026-12-london',
    session: '2026-12',
    sessionNameEn: 'December 2026 Examination',
    sessionNameJp: '2026年第2回 日本語能力試験',
    examDate: '2026-12-06',
    city: 'London',
    country: 'United Kingdom',
    hostInstitution: 'SOAS University of London',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.soas.ac.uk/jlpt',
    lastVerified: '2026-10-15',
    notesEn: 'Administered at SOAS Russell Square campus.'
  },
  {
    id: 'jlpt-2026-12-newyork',
    session: '2026-12',
    sessionNameEn: 'December 2026 Examination',
    sessionNameJp: '2026年第2回 日本語能力試験',
    examDate: '2026-12-06',
    city: 'New York',
    country: 'United States',
    hostInstitution: 'Lehman College / Japan Society',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.aatj.org/jlpt',
    lastVerified: '2026-10-15',
    notesEn: 'Administered by American Association of Teachers of Japanese (AATJ).'
  },

  // 2. July 4, 2027 (Summer Test Session)
  {
    id: 'jlpt-2027-07-tokyo',
    session: '2027-07',
    sessionNameEn: 'July 2027 Examination',
    sessionNameJp: '2027年第1回 日本語能力試験',
    examDate: '2027-07-04',
    city: 'Tokyo',
    country: 'Japan',
    hostInstitution: 'Japan Educational Exchanges and Services (JEES)',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.jlpt.jp',
    lastVerified: '2026-10-15',
    notesEn: 'Expected date based on 1st Sunday of July schedule. Registration window usually opens March.'
  },
  {
    id: 'jlpt-2027-07-hyderabad',
    session: '2027-07',
    sessionNameEn: 'July 2027 Examination',
    sessionNameJp: '2027年第1回 日本語能力試験',
    examDate: '2027-07-04',
    city: 'Hyderabad',
    country: 'India',
    hostInstitution: 'The English and Foreign Languages University (EFLU)',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.jlpt.jp',
    lastVerified: '2026-10-15',
    notesEn: 'Summer session administration.'
  },
  {
    id: 'jlpt-2027-07-newdelhi',
    session: '2027-07',
    sessionNameEn: 'July 2027 Examination',
    sessionNameJp: '2027年第1回 日本語能力試験',
    examDate: '2027-07-04',
    city: 'New Delhi',
    country: 'India',
    hostInstitution: 'MOSAI',
    registrationOpens: null,
    registrationCloses: null,
    officialUrl: 'https://www.mosai.org.in',
    lastVerified: '2026-10-15',
    notesEn: 'Summer session administration by MOSAI.'
  }
];

export const AVAILABLE_CITIES = Array.from(
  new Set(JLPT_CALENDAR_ENTRIES.map((e) => e.city))
).sort();

export const AVAILABLE_SESSIONS = Array.from(
  new Set(JLPT_CALENDAR_ENTRIES.map((e) => e.session))
).sort();

// Check if verification date is older than 60 days
export const isCalendarDataStale = (lastVerifiedIso: string): boolean => {
  const verified = new Date(lastVerifiedIso).getTime();
  const now = Date.now();
  const diffDays = (now - verified) / (1000 * 60 * 60 * 24);
  return diffDays > 60;
};

// Calculate calendar state for a given entry and user status
export type JLPTCardState = 'open' | 'applied' | 'closed_not_applied' | 'not_announced';

export const getJLPTCardState = (
  entry: JLPTCalendarEntry,
  userStatus: JLPTUserStatus
): { state: JLPTCardState; label: string; badgeColor: string } => {
  if (userStatus === 'applied') {
    return {
      state: 'applied',
      label: 'Exam Application Confirmed',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200'
    };
  }

  const now = new Date();
  if (!entry.registrationOpens || !entry.registrationCloses) {
    return {
      state: 'not_announced',
      label: 'Registration Dates Not Yet Announced',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200'
    };
  }

  const openDate = new Date(entry.registrationOpens);
  const closeDate = new Date(entry.registrationCloses);

  if (now >= openDate && now <= closeDate) {
    return {
      state: 'open',
      label: 'Registration Open Now',
      badgeColor: 'bg-green-100 text-green-900 border-green-300 dark:bg-green-950/80 dark:text-green-200'
    };
  }

  if (now > closeDate) {
    return {
      state: 'closed_not_applied',
      label: 'Registration Closed (Not Applied)',
      badgeColor: 'bg-stone-200 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300'
    };
  }

  return {
    state: 'not_announced',
    label: 'Registration Opening Soon',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200'
  };
};

// Calculate days remaining until exam
export const getDaysUntilExam = (examDateIso: string): number => {
  const exam = new Date(examDateIso).getTime();
  const now = Date.now();
  const diff = exam - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Reminder milestone detection (30, 14, 7 days)
export interface JLPTReminderAlert {
  type: '30_days' | '14_days' | '7_days' | 'exam_week';
  daysLeft: number;
  message: string;
  messageTe: string;
}

export const checkJLPTReminders = (examDateIso: string): JLPTReminderAlert | null => {
  const days = getDaysUntilExam(examDateIso);
  if (days <= 7 && days > 0) {
    return {
      type: '7_days',
      daysLeft: days,
      message: `Final stretch: ${days} day(s) until your JLPT exam! Review high-yield particles and mock timing.`,
      messageTe: `పరీక్షకు కేవలం ${days} రోజులు మాత్రమే మిగిలి ఉన్నాయి! విభక్తులు మరియు ముఖ్యమైన పదాలను పునశ్చరణ చేయండి.`
    };
  }
  if (days <= 14 && days > 7) {
    return {
      type: '14_days',
      daysLeft: days,
      message: `2 weeks remaining (${days} days) until JLPT! Prioritize timed reading passages and Kanji recall.`,
      messageTe: `JLPT పరీక్షకు 2 వారాలు మిగిలి ఉన్నాయి! రీడింగ్ మరియు కాంజీలపై ప్రత్యేక శ్రద్ధ పెట్టండి.`
    };
  }
  if (days <= 30 && days > 14) {
    return {
      type: '30_days',
      daysLeft: days,
      message: `1 month horizon (${days} days) until JLPT! Solidify your daily routine and clear all FSRS review queues.`,
      messageTe: `పరీక్షకు 1 నెల సమయం ఉంది! రోజువారీ సమీక్షలను క్రమం తప్పకుండా పూర్తి చేయండి.`
    };
  }
  return null;
};
