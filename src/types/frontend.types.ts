/**
 * Frontend-facing Type Definitions
 * 
 * These types match the structure expected by the frontend UI components.
 * They differ from backend types in field naming and enum values.
 */

/**
 * Frontend Application Status Enum
 * Uses display-friendly capitalized values (e.g., "Applied" instead of "APPLIED")
 */
export enum ApplicationStatus {
  APPLIED = 'Applied',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn',
}

/**
 * Frontend Job Type Enum
 * Uses display-friendly values
 */
export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
  FREELANCE = 'Freelance',
}

/**
 * Frontend Application Interface
 * Field names match the original frontend implementation
 */
export interface FrontendApplication {
  id: string;
  position: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  dateApplied: string;
  url: string;
  description?: string;
  notes?: string;
  skills?: string[];
  softSkills?: string[];
  jobType?: JobType;
  tags?: string[];
  cvPath?: string;
  coverLetterPath?: string;
  salary?: string;
}

/**
 * Form input types for creating/updating applications
 */
export interface ApplicationFormData {
  position: string;
  company: string;
  location: string;
  url: string;
  status: ApplicationStatus;
  dateApplied?: string;
  description?: string;
  notes?: string;
  skills?: string[];
  softSkills?: string[];
  jobType?: JobType;
  tags?: string[];
  cvPath?: string;
  coverLetterPath?: string;
  salary?: string;
}

/**
 * Toast notification state
 */
export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImageUrl?: string;
  content: string;
  authorId?: string;
  authorName?: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}
