// src/features/career/utils/jobAnalyzer.ts
// Deterministic keyword analysis comparing a job description against the user's profile
// NEVER invents qualifications; missing skills are strictly reported as gaps.
import { CareerProfile, JobMatchAnalysis, ProjectItem } from '../types';

const COMMON_TECH_KEYWORDS = [
  // Programming & Scripting
  'javascript', 'typescript', 'python', 'c++', 'c#', 'c', 'rust', 'go', 'golang', 'java', 'kotlin', 'swift', 'ruby', 'php',
  // Frontend
  'react', 'vue', 'angular', 'next.js', 'svelte', 'html', 'css', 'tailwind', 'sass', 'webpack', 'vite',
  // Backend & Cloud
  'node.js', 'express', 'django', 'fastapi', 'flask', 'spring', 'postgresql', 'mysql', 'sqlite', 'mongodb', 'redis', 'graphql', 'rest', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'linux',
  // Hardware & Embedded
  'verilog', 'vhdl', 'fpga', 'arm', 'microcontroller', 'stm32', 'esp32', 'arduino', 'raspberry pi', 'pcb', 'altium', 'kicad', 'spice', 'oscilloscope', 'logic analyzer', 'uart', 'spi', 'i2c', 'can bus', 'rtos', 'freertos',
  // Semiconductors & Manufacturing
  'semiconductor', 'wafer', 'lithography', 'etching', 'cleanroom', 'cmos', 'vlsi', 'asic', 'yield', 'quality control', 'iso 9001',
  // Testing & Quality
  'unit testing', 'jest', 'vitest', 'cypress', 'playwright', 'qa', 'debugging', 'troubleshooting',
  // Engineering Practices
  'git', 'github', 'gitlab', 'agile', 'scrum', 'kanban', 'jira'
];

/**
 * Extracts recognized technical keywords from any text string
 */
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  for (const kw of COMMON_TECH_KEYWORDS) {
    // Regex boundary matching word or special symbols like c++ or .js
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(lower)) {
      matched.add(kw);
    }
  }

  return Array.from(matched);
}

/**
 * Analyzes a pasted job description against the user's profile
 */
export function analyzeJobDescription(jobText: string, profile: CareerProfile): JobMatchAnalysis {
  const jdKeywords = extractKeywordsFromText(jobText);

  // Collect user's registered skills
  const userSkillNames = new Set<string>();
  profile.skills.forEach(s => userSkillNames.add(s.name.toLowerCase().trim()));

  // Also collect tools used across user's projects
  const userProjectTools = new Set<string>();
  profile.projects.forEach(p => {
    p.tools.forEach(t => userProjectTools.add(t.toLowerCase().trim()));
  });

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  jdKeywords.forEach(kw => {
    if (userSkillNames.has(kw) || userProjectTools.has(kw)) {
      matchingSkills.push(kw);
    } else {
      missingSkills.push(kw);
    }
  });

  // Evaluate which projects to emphasize
  const scoredProjects: { project: ProjectItem; matchCount: number; matchedKeywords: string[] }[] = [];

  profile.projects.forEach(proj => {
    const projText = `${proj.title} ${proj.role} ${proj.whatIDid} ${proj.tools.join(' ')} ${proj.measurableResult || ''}`.toLowerCase();
    const matchedForProject: string[] = [];

    jdKeywords.forEach(kw => {
      if (projText.includes(kw.toLowerCase())) {
        matchedForProject.push(kw);
      }
    });

    if (matchedForProject.length > 0) {
      scoredProjects.push({
        project: proj,
        matchCount: matchedForProject.length,
        matchedKeywords: matchedForProject
      });
    }
  });

  // Sort projects descending by match count
  scoredProjects.sort((a, b) => b.matchCount - a.matchCount);

  // Suggest bullet points strictly derived from facts in user's matching projects
  const suggestedBulletPoints: string[] = [];
  scoredProjects.slice(0, 3).forEach(({ project, matchedKeywords }) => {
    let point = `Demonstrated ${matchedKeywords.join(', ')} experience in "${project.title}" (${project.role}): ${project.whatIDid}`;
    if (project.measurableResult) {
      point += ` Resulting in: ${project.measurableResult}`;
    }
    suggestedBulletPoints.push(point);
  });

  return {
    matchingSkills,
    missingSkills,
    recommendedProjects: scoredProjects,
    suggestedBulletPoints
  };
}
