// src/features/jobs/types.ts
// Data models for KAI Job Application Pipeline & Tracker

export type JobStatus =
  | 'interested'
  | 'planned'
  | 'applied'
  | 'interview_scheduled'
  | 'offer_received'
  | 'rejected'
  | 'closed';

export type TriState = 'yes' | 'not_stated' | 'unknown';

export interface TriStateField {
  status: TriState;
  note?: string; // Optional source citation or excerpt
}

export type JapaneseRequirement = 'None' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Not Stated';
export type EnglishRequirement = 'None' | 'Conversational' | 'Business' | 'Fluent' | 'Native' | 'Not Stated';
export type WorkArrangement = 'on_site' | 'hybrid' | 'remote';

export interface StatusHistoryItem {
  id: string;
  date: string; // ISO string
  fromStatus?: JobStatus;
  toStatus: JobStatus;
  note?: string;
}

export interface JobApplication {
  id: string;
  employer: string;
  title: string;
  location: string; // e.g. "Tokyo", "Kanagawa", "Osaka", "Remote Japan"
  sourceUrl: string; // Required source URL where job was found
  officialApplicationUrl?: string; // Optional direct portal link
  postedDate: string; // YYYY-MM-DD
  deadline?: string; // YYYY-MM-DD
  salaryAndBenefits: string; // Free text, e.g. "¥5.5M - ¥7M/yr" or "Not stated"
  requiredQualifications: string; // Free text
  technicalSkills: string[];
  japaneseLevel: JapaneseRequirement;
  englishLevel: EnglishRequirement;
  experienceRequirement: string; // e.g. "Entry / 0-2 yrs" or "Not stated"
  workArrangement: WorkArrangement;

  // Tri-State Sponsorship & Relocation Fields (Default to "unknown")
  overseasApplicantsAccepted: TriStateField;
  relocationSupport: TriStateField;
  visaSponsorship: TriStateField;

  // Pipeline Status & Audit
  status: JobStatus;
  statusHistory: StatusHistoryItem[];

  // Notes, Dates & Attached Resume Version
  notes: string;
  applicationDate?: string; // YYYY-MM-DD
  followUpDate?: string; // YYYY-MM-DD
  attachedResumeVersion?: {
    id: string;
    name: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface VerifiedSource {
  id: string;
  name: string;
  url: string;
  note: string;
  lastVerifiedDate: string; // YYYY-MM-DD
}

export interface JobFilterState {
  searchQuery: string;
  status?: JobStatus | 'all';
  location?: string;
  japaneseLevel?: JapaneseRequirement | 'all';
  workArrangement?: WorkArrangement | 'all';
  overseasAcceptedOnly: boolean;
  deadlineSoonOnly: boolean; // within 7 days
}
