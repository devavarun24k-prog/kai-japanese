// src/features/career/utils/templateEngine.ts
// Pure template filling engine: fills placeholders from profile, keeping unprovided blanks strictly visible
import { CareerProfile } from '../types';

export function fillTemplateFromProfile(templateStr: string, profile: CareerProfile, customReplacements: Record<string, string> = {}): string {
  if (!templateStr) return '';

  const primaryRole = profile.targetRoles && profile.targetRoles.length > 0 ? profile.targetRoles[0] : '';
  const topSkills = profile.skills.map(s => s.name).slice(0, 4).join(', ');
  const latestSchool = profile.educationHistory.length > 0 ? profile.educationHistory[profile.educationHistory.length - 1].institution : '';
  const latestMajor = profile.educationHistory.length > 0 && profile.educationHistory[profile.educationHistory.length - 1].major ? profile.educationHistory[profile.educationHistory.length - 1].major : '';

  const lookup: Record<string, string | undefined> = {
    fullName: profile.personalDetails.fullNameRomaji || profile.personalDetails.fullNameKanji || undefined,
    fullNameKanji: profile.personalDetails.fullNameKanji || undefined,
    fullNameKana: profile.personalDetails.fullNameKana || undefined,
    email: profile.personalDetails.email || undefined,
    phone: profile.personalDetails.phone || undefined,
    targetRole: primaryRole || undefined,
    skills: topSkills || undefined,
    university: latestSchool || undefined,
    major: latestMajor || undefined,
    ...customReplacements
  };

  // Replace {key} only if value is non-empty string; otherwise preserve {key}
  return templateStr.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    const val = lookup[key];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
    return match; // Keep {key} visible
  });
}
