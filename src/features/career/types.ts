// src/features/career/types.ts
// Single source of truth types for KAI Career Studio (Rirekisho, Shokumukeirekisho, English Resume, CV)

export interface PersonalDetails {
  fullNameKanji: string;
  fullNameKana: string;
  fullNameRomaji: string;
  dateOfBirth: string; // YYYY-MM-DD
  email: string;
  phone: string;
  postalCode: string;
  address: string;
  addressKana: string;
  photoUrl?: string; // Local data URL or private storage reference
  photoOptInPrivateUpload?: boolean;
  workAuthorization?: string; // e.g. "Requires Visa Sponsorship" or "Permanent Resident"
}

export interface EducationItem {
  id: string;
  institution: string;
  faculty?: string;
  major?: string;
  degree?: string;
  status: 'enrolled' | 'graduated' | 'expected' | 'withdrawn';
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM
}

export interface WorkItem {
  id: string;
  companyName: string;
  department?: string;
  role: string;
  isCurrent: boolean;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM
  responsibilities: string;
  achievements?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  tools: string[]; // e.g. ["React", "TypeScript", "Verilog"]
  whatIDid: string;
  measurableResult?: string;
  link?: string;
  startDate?: string; // YYYY-MM
  endDate?: string; // YYYY-MM
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkillItem {
  id: string;
  name: string;
  category: 'software' | 'hardware' | 'embedded' | 'tools' | 'languages' | 'other';
  level: SkillLevel;
}

export interface CertificationItem {
  id: string;
  name: string;
  dateObtained: string; // YYYY-MM
  credentialId?: string;
}

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g., Native, Business, Conversational, Basic
  jlptLevel?: JLPTLevel; // Optional, ONLY if user specifies
}

export interface LinkItem {
  id: string;
  label: string; // e.g. GitHub, Portfolio, LinkedIn
  url: string;
}

export interface CareerProfile {
  personalDetails: PersonalDetails;
  educationHistory: EducationItem[];
  workHistory: WorkItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  targetRoles: string[];
  links: LinkItem[];
  selfPR: string; // 自己PR
  reasonForApplication: string; // 志望動機
  hopesAndWishes: string; // 本人希望記入欄
  lastUpdated: string;
}

export interface DocumentVersion {
  id: string;
  name: string; // e.g. "Tokyo Startup - QA Engineer"
  createdAt: string;
  updatedAt: string;
  targetCompany?: string;
  notes?: string;
  profileSnapshot: CareerProfile;
}

export interface ProfileWarning {
  id: string;
  field: string;
  message: string;
  severity: 'warning' | 'info';
}

export interface JobMatchAnalysis {
  matchingSkills: string[];
  missingSkills: string[];
  recommendedProjects: {
    project: ProjectItem;
    matchCount: number;
    matchedKeywords: string[];
  }[];
  suggestedBulletPoints: string[];
}

export interface CareerTemplate {
  id: string;
  category: 'cover_letter' | 'recruiter_message' | 'thank_you' | 'follow_up' | 'self_intro';
  language: 'en' | 'ja';
  title: string;
  description: string;
  template: string;
  needsNativeReview?: boolean;
}
