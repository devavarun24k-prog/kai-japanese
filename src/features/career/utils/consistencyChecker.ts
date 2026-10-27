// src/features/career/utils/consistencyChecker.ts
// Validates profile completeness and date consistency without auto-modifying user data
import { CareerProfile, ProfileWarning } from '../types';

export function checkProfileConsistency(profile: CareerProfile): ProfileWarning[] {
  const warnings: ProfileWarning[] = [];

  // 1. Crucial Personal Details
  if (!profile.personalDetails.fullNameKanji && !profile.personalDetails.fullNameRomaji) {
    warnings.push({
      id: 'missing-name',
      field: 'personalDetails.fullName',
      message: 'Name is empty. Enter your name in Kanji or Romaji.',
      severity: 'warning'
    });
  }

  if (!profile.personalDetails.email && !profile.personalDetails.phone) {
    warnings.push({
      id: 'missing-contact',
      field: 'personalDetails.contact',
      message: 'No contact information provided. Add at least an email or phone number.',
      severity: 'warning'
    });
  }

  if (!profile.personalDetails.dateOfBirth) {
    warnings.push({
      id: 'missing-dob',
      field: 'personalDetails.dateOfBirth',
      message: 'Date of birth is not set. Japanese Rirekisho standardly includes age and birth date.',
      severity: 'info'
    });
  }

  // 2. Education Date Checks
  profile.educationHistory.forEach((edu, idx) => {
    if (edu.startDate && edu.endDate) {
      if (edu.endDate < edu.startDate && edu.status !== 'enrolled') {
        warnings.push({
          id: `edu-end-before-start-${edu.id || idx}`,
          field: `educationHistory[${idx}]`,
          message: `Education at "${edu.institution || 'entry ' + (idx + 1)}" has end date (${edu.endDate}) before start date (${edu.startDate}).`,
          severity: 'warning'
        });
      }
    }
  });

  // 3. Work History Date Checks & Overlaps
  profile.workHistory.forEach((work, idx) => {
    if (work.startDate && work.endDate && !work.isCurrent) {
      if (work.endDate < work.startDate) {
        warnings.push({
          id: `work-end-before-start-${work.id || idx}`,
          field: `workHistory[${idx}]`,
          message: `Position at "${work.companyName || 'entry ' + (idx + 1)}" has end date (${work.endDate}) before start date (${work.startDate}).`,
          severity: 'warning'
        });
      }
    }
  });

  // Check for overlapping full-time employment dates
  for (let i = 0; i < profile.workHistory.length; i++) {
    for (let j = i + 1; j < profile.workHistory.length; j++) {
      const w1 = profile.workHistory[i];
      const w2 = profile.workHistory[j];
      if (!w1.startDate || !w2.startDate) continue;

      const end1 = w1.isCurrent ? '9999-99' : (w1.endDate || w1.startDate);
      const end2 = w2.isCurrent ? '9999-99' : (w2.endDate || w2.startDate);

      const overlap = w1.startDate <= end2 && w2.startDate <= end1;
      if (overlap) {
        warnings.push({
          id: `work-overlap-${w1.id}-${w2.id}`,
          field: `workHistory`,
          message: `Work periods for "${w1.companyName || 'Job ' + (i + 1)}" and "${w2.companyName || 'Job ' + (j + 1)}" overlap. Verify if these were concurrent roles.`,
          severity: 'info'
        });
      }
    }
  }

  // 4. Projects Checks
  profile.projects.forEach((proj, idx) => {
    if (proj.startDate && proj.endDate) {
      if (proj.endDate < proj.startDate) {
        warnings.push({
          id: `proj-end-before-start-${proj.id || idx}`,
          field: `projects[${idx}]`,
          message: `Project "${proj.title || 'Project ' + (idx + 1)}" has end date before start date.`,
          severity: 'warning'
        });
      }
    }
  });

  // 5. Section Completeness Check
  if (profile.educationHistory.length === 0 && profile.workHistory.length === 0 && profile.projects.length === 0) {
    warnings.push({
      id: 'empty-experience',
      field: 'experience',
      message: 'No education, work history, or projects recorded yet. Add at least one to produce a valid resume.',
      severity: 'warning'
    });
  }

  return warnings;
}
