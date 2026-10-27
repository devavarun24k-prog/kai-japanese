// src/tests/career.test.ts
// Unit tests for Career Studio: Era converter, Profile integrity, Consistency checker, Versioning, Job Tailoring, and Template Engine
import { describe, it, expect, beforeEach } from 'vitest';
import { convertToJapaneseEra, formatRirekishoDate } from '../features/career/utils/eraConverter';
import { checkProfileConsistency } from '../features/career/utils/consistencyChecker';
import { analyzeJobDescription } from '../features/career/utils/jobAnalyzer';
import { fillTemplateFromProfile } from '../features/career/utils/templateEngine';
import {
  createEmptyProfile,
  loadCareerProfile,
  saveCareerProfile,
  saveDocumentVersion,
  loadDocumentVersions,
  duplicateDocumentVersion,
  deleteDocumentVersion
} from '../features/career/storage';
import { CareerProfile, DocumentVersion } from '../features/career/types';

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

describe('Japanese Era Date Converter (Showa, Heisei, Reiwa)', () => {
  it('converts Showa boundary: 1989-01-07 is Showa 64 (昭和64年)', () => {
    const res = convertToJapaneseEra('1989-01-07');
    expect(res).not.toBeNull();
    expect(res?.era).toBe('Showa');
    expect(res?.eraJp).toBe('昭和');
    expect(res?.yearInEra).toBe(64);
    expect(res?.formattedYear).toBe('昭和64年');
    expect(res?.formattedFull).toBe('昭和64年1月7日');
  });

  it('converts Heisei start boundary: 1989-01-08 is Heisei 1 (平成元年)', () => {
    const res = convertToJapaneseEra('1989-01-08');
    expect(res).not.toBeNull();
    expect(res?.era).toBe('Heisei');
    expect(res?.eraJp).toBe('平成');
    expect(res?.yearInEra).toBe(1);
    expect(res?.formattedYear).toBe('平成元年');
    expect(res?.formattedFull).toBe('平成元年1月8日');
  });

  it('converts Heisei end boundary: 2019-04-30 is Heisei 31 (平成31年)', () => {
    const res = convertToJapaneseEra('2019-04-30');
    expect(res).not.toBeNull();
    expect(res?.era).toBe('Heisei');
    expect(res?.eraJp).toBe('平成');
    expect(res?.yearInEra).toBe(31);
    expect(res?.formattedYear).toBe('平成31年');
    expect(res?.formattedFull).toBe('平成31年4月30日');
  });

  it('converts Reiwa start boundary: 2019-05-01 is Reiwa 1 (令和元年)', () => {
    const res = convertToJapaneseEra('2019-05-01');
    expect(res).not.toBeNull();
    expect(res?.era).toBe('Reiwa');
    expect(res?.eraJp).toBe('令和');
    expect(res?.yearInEra).toBe(1);
    expect(res?.formattedYear).toBe('令和元年');
    expect(res?.formattedFull).toBe('令和元年5月1日');
  });

  it('converts current era dates: 2026-10-27 is Reiwa 8 (令和8年)', () => {
    const res = convertToJapaneseEra('2026-10-27');
    expect(res).not.toBeNull();
    expect(res?.era).toBe('Reiwa');
    expect(res?.eraJp).toBe('令和');
    expect(res?.yearInEra).toBe(8);
    expect(res?.formattedYear).toBe('令和8年');
    expect(res?.formattedFull).toBe('令和8年10月27日');
  });

  it('formats month-only date correctly for Rirekisho', () => {
    expect(formatRirekishoDate('2024-04')).toBe('令和6年4月');
    expect(formatRirekishoDate('2019-04')).toBe('平成31年4月');
    expect(formatRirekishoDate('2019-05')).toBe('令和元年5月');
  });

  it('gracefully handles invalid date formats', () => {
    expect(convertToJapaneseEra('')).toBeNull();
    expect(convertToJapaneseEra('invalid-date')).toBeNull();
  });
});

describe('Career Profile Integrity & Serialization', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty profile with zero invented data', () => {
    const profile = createEmptyProfile();
    expect(profile.personalDetails.fullNameKanji).toBe('');
    expect(profile.personalDetails.fullNameRomaji).toBe('');
    expect(profile.personalDetails.dateOfBirth).toBe('');
    expect(profile.educationHistory).toEqual([]);
    expect(profile.workHistory).toEqual([]);
    expect(profile.projects).toEqual([]);
    expect(profile.skills).toEqual([]);
    expect(profile.languages).toEqual([]);
  });

  it('saves and loads profile without modifying or auto-injecting fields', async () => {
    const testProfile = createEmptyProfile();
    testProfile.personalDetails.fullNameKanji = '鈴木 一郎';
    testProfile.personalDetails.email = 'suzuki@example.jp';
    testProfile.skills.push({ id: 's1', name: 'Verilog', category: 'hardware', level: 'advanced' });

    const saveResult = await saveCareerProfile(testProfile, 'test_user_123');
    expect(saveResult.success).toBe(true);

    const loaded = loadCareerProfile('test_user_123');
    expect(loaded.personalDetails.fullNameKanji).toBe('鈴木 一郎');
    expect(loaded.personalDetails.email).toBe('suzuki@example.jp');
    expect(loaded.skills.length).toBe(1);
    expect(loaded.skills[0].name).toBe('Verilog');
  });
});

describe('Profile Consistency & Completeness Checker', () => {
  it('flags missing name and contact info as warnings', () => {
    const profile = createEmptyProfile();
    const warnings = checkProfileConsistency(profile);
    expect(warnings.some(w => w.id === 'missing-name')).toBe(true);
    expect(warnings.some(w => w.id === 'missing-contact')).toBe(true);
    expect(warnings.some(w => w.id === 'empty-experience')).toBe(true);
  });

  it('flags education end date prior to start date', () => {
    const profile = createEmptyProfile();
    profile.personalDetails.fullNameRomaji = 'Alice Doe';
    profile.personalDetails.email = 'alice@example.com';
    profile.educationHistory.push({
      id: 'e1',
      institution: 'Tech University',
      status: 'graduated',
      startDate: '2024-04',
      endDate: '2022-03' // invalid: end before start
    });

    const warnings = checkProfileConsistency(profile);
    expect(warnings.some(w => w.id.includes('edu-end-before-start'))).toBe(true);
  });

  it('flags overlapping full-time work dates as informational warning', () => {
    const profile = createEmptyProfile();
    profile.personalDetails.fullNameRomaji = 'Bob Smith';
    profile.personalDetails.email = 'bob@example.com';
    profile.workHistory.push(
      {
        id: 'w1',
        companyName: 'Company A',
        role: 'Engineer',
        isCurrent: false,
        startDate: '2022-01',
        endDate: '2023-06',
        responsibilities: 'Firmware'
      },
      {
        id: 'w2',
        companyName: 'Company B',
        role: 'Developer',
        isCurrent: false,
        startDate: '2023-01', // Overlaps with Company A
        endDate: '2023-12',
        responsibilities: 'Cloud'
      }
    );

    const warnings = checkProfileConsistency(profile);
    expect(warnings.some(w => w.id.includes('work-overlap'))).toBe(true);
  });
});

describe('Document Versioning System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves, loads, duplicates, and deletes document versions', () => {
    const profile = createEmptyProfile();
    profile.personalDetails.fullNameRomaji = 'Charlie Brown';

    const version1: DocumentVersion = {
      id: 'ver_test_1',
      name: 'Sony - Hardware Engineer',
      targetCompany: 'Sony',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileSnapshot: profile
    };

    saveDocumentVersion(version1, 'user_v');
    const loaded = loadDocumentVersions('user_v');
    expect(loaded.length).toBe(1);
    expect(loaded[0].name).toBe('Sony - Hardware Engineer');

    // Duplicate version
    const duplicated = duplicateDocumentVersion('ver_test_1', 'Sony - Copy', 'user_v');
    expect(duplicated).not.toBeNull();
    expect(duplicated?.name).toBe('Sony - Copy');
    expect(loadDocumentVersions('user_v').length).toBe(2);

    // Delete version
    const remaining = deleteDocumentVersion('ver_test_1', 'user_v');
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(duplicated?.id);
  });
});

describe('Deterministic Job Description Keyword Analysis', () => {
  it('extracts matching skills, reports gaps, and NEVER automatically claims missing skills', () => {
    const profile = createEmptyProfile();
    profile.skills.push(
      { id: 's1', name: 'C++', category: 'languages', level: 'advanced' },
      { id: 's2', name: 'RTOS', category: 'embedded', level: 'intermediate' }
    );
    profile.projects.push({
      id: 'p1',
      title: 'Drone Autopilot',
      role: 'Firmware Lead',
      tools: ['C++', 'RTOS', 'SPI'],
      whatIDid: 'Wrote drone sensor drivers using C++ over SPI.',
      measurableResult: 'Reduced latency by 30%'
    });

    const jobDescription = `
      We are hiring an Embedded Software Engineer.
      Requirements:
      - Strong experience with C++ and RTOS.
      - Experience with Python and FPGA / Verilog is a major plus.
    `;

    const analysis = analyzeJobDescription(jobDescription, profile);

    // Matching skills
    expect(analysis.matchingSkills).toContain('c++');
    expect(analysis.matchingSkills).toContain('rtos');

    // Missing skills strictly reported as gaps
    expect(analysis.missingSkills).toContain('python');
    expect(analysis.missingSkills).toContain('fpga');
    expect(analysis.missingSkills).toContain('verilog');

    // Confirm gaps were NOT added to profile
    expect(profile.skills.some(s => s.name.toLowerCase() === 'python')).toBe(false);
    expect(profile.skills.some(s => s.name.toLowerCase() === 'verilog')).toBe(false);

    // Recommended projects ranking
    expect(analysis.recommendedProjects.length).toBe(1);
    expect(analysis.recommendedProjects[0].project.title).toBe('Drone Autopilot');
    expect(analysis.suggestedBulletPoints[0]).toContain('Drone Autopilot');
  });
});

describe('Template Engine Placeholder Filling', () => {
  it('replaces known profile placeholders and leaves unfilled blanks strictly visible', () => {
    const profile = createEmptyProfile();
    profile.personalDetails.fullNameRomaji = 'Deva Varun';
    profile.targetRoles = ['Embedded Systems Engineer'];
    profile.skills.push({ id: 's1', name: 'Verilog', category: 'hardware', level: 'expert' });

    const template = `Dear Hiring Team at {companyName},\n\nMy name is {fullName}. I am applying for the {targetRole} position. My core skill is {skills}.\n\nSincerely,\n{fullName}`;

    const filled = fillTemplateFromProfile(template, profile);

    // Replaced fields
    expect(filled).toContain('My name is Deva Varun.');
    expect(filled).toContain('applying for the Embedded Systems Engineer position.');
    expect(filled).toContain('core skill is Verilog.');

    // Unfilled blank MUST remain visible
    expect(filled).toContain('{companyName}');
    expect(filled).not.toContain('{fullName}');
  });
});
