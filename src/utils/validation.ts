/**
 * Validation Schemas using Zod
 */

import { z } from 'zod';
import { APPLICATION_STATUS, SKILL_PROFICIENCY, JOB_TYPE } from '../config/constants';

/**
 * Custom validation helpers
 */

// Validate that end_date is after start_date
const dateRangeRefinement = (data: { start_date?: string; end_date?: string; current?: boolean }) => {
  if (data.current) {
    return true; // If current, end_date is optional
  }
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date);
  }
  return true;
};

// Validate URL format more strictly
const urlSchema = z.string().min(1, 'URL is required').refine(
  (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid URL' }
);

// Validate date format (YYYY-MM-DD)
const dateStringSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must be in YYYY-MM-DD format'
);

// Validate ISO datetime string
const isoDateTimeSchema = z.string().refine(
  (date) => {
    try {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid ISO datetime string' }
);

/**
 * Schema for creating a new application
 */
export const createApplicationSchema = z.object({
  positionUrl: urlSchema,
  positionTitle: z.string().min(1).max(500).optional(),
  companyName: z.string().min(1).max(200).optional(),
  jobLocation: z.string().min(1).max(200).optional(),
  rawText: z.string().max(50000).optional(), // Limit raw text size
  status: z.enum([
    APPLICATION_STATUS.APPLIED,
    APPLICATION_STATUS.INTERVIEWING,
    APPLICATION_STATUS.OFFERED,
    APPLICATION_STATUS.REJECTED,
  ]).optional().default(APPLICATION_STATUS.APPLIED),
  appliedAt: isoDateTimeSchema.optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  description: z.string().max(10000).optional(),
  jobType: z.enum([
    JOB_TYPE.FULL_TIME,
    JOB_TYPE.PART_TIME,
    JOB_TYPE.CONTRACT,
    JOB_TYPE.INTERNSHIP,
    JOB_TYPE.FREELANCE,
  ]).optional(),
  techStack: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  cvPath: z.string().optional(),
  coverLetterPath: z.string().optional(),
});

/**
 * Schema for updating an application
 */
export const updateApplicationSchema = z.object({
  positionTitle: z.string().min(1).max(500).optional(),
  companyName: z.string().min(1).max(200).optional(),
  jobLocation: z.string().min(1).max(200).optional(),
  status: z.enum([
    APPLICATION_STATUS.APPLIED,
    APPLICATION_STATUS.INTERVIEWING,
    APPLICATION_STATUS.OFFERED,
    APPLICATION_STATUS.REJECTED,
  ]).optional(),
  appliedAt: isoDateTimeSchema.optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  description: z.string().max(10000).optional(),
  cvPath: z.string().max(500).optional(),
  coverLetterPath: z.string().max(500).optional(),
  jobType: z.enum([
    JOB_TYPE.FULL_TIME,
    JOB_TYPE.PART_TIME,
    JOB_TYPE.CONTRACT,
    JOB_TYPE.INTERNSHIP,
    JOB_TYPE.FREELANCE,
  ]).optional(),
});

/**
 * Schema for query parameters in GET /api/applications
 */
export const getApplicationsQuerySchema = z.object({
  q: z.string().min(1).max(200).optional(),
  status: z.enum([
    APPLICATION_STATUS.APPLIED,
    APPLICATION_STATUS.INTERVIEWING,
    APPLICATION_STATUS.OFFERED,
    APPLICATION_STATUS.REJECTED,
  ]).optional(),
  jobType: z.enum([
    JOB_TYPE.FULL_TIME,
    JOB_TYPE.PART_TIME,
    JOB_TYPE.CONTRACT,
    JOB_TYPE.INTERNSHIP,
    JOB_TYPE.FREELANCE,
  ]).optional(),
  limit: z.string().optional().default('50').transform(Number).pipe(z.number().int().positive().max(100)),
  offset: z.string().optional().default('0').transform(Number).pipe(z.number().int().nonnegative()),
});

/**
 * Schema for job extraction request
 */
export const jobExtractionSchema = z.object({
  rawText: z.string().min(10, 'Raw text must be at least 10 characters').max(50000, 'Raw text is too long'),
});

/**
 * Validate request body against a schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await request.json();
  return schema.parse(body);
}

/**
 * Validate query parameters against a schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}

/**
 * Schema for creating work experience
 */
export const createWorkExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(200),
  position: z.string().min(1, 'Position is required').max(200),
  location: z.string().max(200).optional(),
  start_date: dateStringSchema,
  end_date: dateStringSchema.optional(),
  current: z.boolean().default(false),
  description: z.string().max(5000).optional(),
  technologies: z.array(z.string().min(1).max(100)).max(50).optional(),
}).refine(
  (data) => dateRangeRefinement(data),
  { message: 'End date must be after or equal to start date', path: ['end_date'] }
);

/**
 * Schema for updating work experience
 */
export const updateWorkExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(200).optional(),
  position: z.string().min(1, 'Position is required').max(200).optional(),
  location: z.string().max(200).optional(),
  start_date: dateStringSchema.optional(),
  end_date: dateStringSchema.optional(),
  current: z.boolean().optional(),
  description: z.string().max(5000).optional(),
  technologies: z.array(z.string().min(1).max(100)).max(50).optional(),
}).refine(
  (data) => dateRangeRefinement(data),
  { message: 'End date must be after or equal to start date', path: ['end_date'] }
);

/**
 * Schema for creating education
 */
export const createEducationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(200),
  field_of_study: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  start_date: dateStringSchema,
  end_date: dateStringSchema.optional(),
  current: z.boolean().default(false),
  gpa: z.string().max(10).optional(),
  description: z.string().max(2000).optional(),
}).refine(
  (data) => dateRangeRefinement(data),
  { message: 'End date must be after or equal to start date', path: ['end_date'] }
);

/**
 * Schema for updating education
 */
export const updateEducationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required').max(200).optional(),
  degree: z.string().min(1, 'Degree is required').max(200).optional(),
  field_of_study: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  start_date: dateStringSchema.optional(),
  end_date: dateStringSchema.optional(),
  current: z.boolean().optional(),
  gpa: z.string().max(10).optional(),
  description: z.string().max(2000).optional(),
}).refine(
  (data) => dateRangeRefinement(data),
  { message: 'End date must be after or equal to start date', path: ['end_date'] }
);

/**
 * Schema for creating technical skill
 */
export const createTechnicalSkillSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Skill name is required'),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  years_of_exp: z.number().int().min(0).max(100).optional(),
  description: z.string().optional(),
  verified: z.boolean().default(false),
});

/**
 * Schema for updating technical skill
 */
export const updateTechnicalSkillSchema = z.object({
  category: z.string().min(1, 'Category is required').optional(),
  name: z.string().min(1, 'Skill name is required').optional(),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  years_of_exp: z.number().int().min(0).max(100).optional(),
  description: z.string().optional(),
  verified: z.boolean().optional(),
});

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = z.object({
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(200).optional(),
  summary: z.string().max(1000).optional(),
  website: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  avatar_url: z.string().url().optional(),
});

/**
 * Schema for export query parameters
 */
export const exportQuerySchema = z.object({
  status: z.enum([
    APPLICATION_STATUS.APPLIED,
    APPLICATION_STATUS.INTERVIEWING,
    APPLICATION_STATUS.OFFERED,
    APPLICATION_STATUS.REJECTED,
  ]).optional(),
  includeNotes: z.string().optional().default('true').transform((val) => val !== 'false'),
  includeDescription: z.string().optional().default('true').transform((val) => val !== 'false'),
});

/**
 * Helper function to validate file uploads
 */
export function validateFile(
  file: File | null,
  options: {
    required?: boolean;
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): void {
  const {
    required = true,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf'],
  } = options;

  if (!file) {
    if (required) {
      throw new Error('File is required');
    }
    return;
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`
    );
  }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const getArticlesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .default('3')
    .transform(Number)
    .pipe(z.number().int().positive().max(50)),
});

export const createArticleSchema = z.object({
  title: z.string().min(4, 'Title is required').max(200),
  summary: z.string().max(500).optional(),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(slugPattern, 'Slug may only contain lowercase letters, numbers, and hyphens')
    .optional(),
  coverImageUrl: z.string().url('Cover image must be a valid URL').optional(),
  publishedAt: isoDateTimeSchema.optional(),
  authorName: z.string().max(120).optional(),
});

export const updateArticleSchema = createArticleSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
  );
