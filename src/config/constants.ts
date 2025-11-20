/**
 * Application Constants
 */

export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  INTERVIEWING: 'INTERVIEWING',
  OFFERED: 'OFFERED',
  REJECTED: 'REJECTED',
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];

export const JOB_TYPE = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP',
  FREELANCE: 'FREELANCE',
} as const;

export type JobType = typeof JOB_TYPE[keyof typeof JOB_TYPE];

export const SKILL_PROFICIENCY = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
} as const;

export type SkillProficiency = typeof SKILL_PROFICIENCY[keyof typeof SKILL_PROFICIENCY];

export const SKILL_CATEGORY = {
  PROGRAMMING_LANGUAGE: 'PROGRAMMING_LANGUAGE',
  FRAMEWORK: 'FRAMEWORK',
  DATABASE: 'DATABASE',
  TOOL: 'TOOL',
  CLOUD: 'CLOUD',
  OTHER: 'OTHER',
} as const;

export type SkillCategory = typeof SKILL_CATEGORY[keyof typeof SKILL_CATEGORY];

export const API_ROUTES = {
  APPLICATIONS: '/api/applications',
  PROFILE: '/api/profile',
  EXTRACT: '/api/extract',
  EXPORT: '/api/export',
} as const;

export const EXTENSION_HEADER = 'X-Extension-Version';
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
export const GEMINI_MODEL = 'gemini-1.5-flash';
export const MAX_EXTRACTION_RETRIES = 2;
export const EXTRACTION_TIMEOUT = 30000; // 30 seconds
