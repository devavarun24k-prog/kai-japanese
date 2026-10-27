// src/features/interview/utils/templateFiller.ts
// Pure template filling engine for Japanese interview response templates
import { CandidateProfileFields } from '../types';

export function fillTemplate(
  template: string,
  profile: CandidateProfileFields | null | undefined
): string {
  if (!template) return '';

  return template.replace(/\{(\w+)\}/g, (match, fieldName) => {
    if (!profile) return match; // Leave {fieldName} visible

    const key = fieldName.toLowerCase();
    let value: string | undefined;

    switch (key) {
      case 'name':
      case 'candidatename':
        value = profile.candidateName?.trim();
        break;
      case 'university':
      case 'college':
      case 'school':
        value = profile.university?.trim();
        break;
      case 'major':
      case 'department':
        value = profile.major?.trim();
        break;
      case 'project':
      case 'thesistitle':
        value = profile.project?.trim();
        break;
      case 'targetrole':
      case 'role':
        value = profile.targetRole?.trim();
        break;
      case 'experienceyears':
      case 'years':
        value = profile.experienceYears?.trim();
        break;
      default:
        value = (profile as Record<string, string | undefined>)[fieldName]?.trim();
        break;
    }

    // Never invent fake values. If empty or undefined, keep the blank visible
    return value && value.length > 0 ? value : match;
  });
}
