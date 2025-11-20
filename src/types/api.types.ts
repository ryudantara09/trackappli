/**
 * API Type Definitions
 */

import { ApplicationStatus, JobType, SkillProficiency, SkillCategory } from '../config/constants';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Application {
  id: number;
  user_id: string;
  position_url: string;
  position_title: string | null;
  company_name: string | null;
  job_location: string | null;
  applied_at: string; // API returns ISO string, not Date object usually
  status: string; // API returns string, not enum usually
  cv_path: string | null;
  cover_letter_path: string | null;
  notes: string | null;
  description: string | null;
  tech_stack: string[] | null; // Json in DB, but likely parsed to array in API response?
  soft_skills: string[] | null;
  job_type: string | null;
  tags: string[] | null;
  extracted_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationRequest {
  positionUrl: string;
  positionTitle?: string;
  companyName?: string;
  jobLocation?: string;
  rawText?: string;
  status?: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
  tags?: string[];
  description?: string;
}

export interface UpdateApplicationRequest {
  positionTitle?: string;
  companyName?: string;
  jobLocation?: string;
  status?: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
  tags?: string[];
  description?: string;
  cvPath?: string;
  coverLetterPath?: string;
}

export interface WorkExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
  technologies: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  gpa: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnicalSkill {
  id: string;
  userId: string;
  skillId?: string; // Link to master skill
  category: SkillCategory;
  name: string;
  proficiency: SkillProficiency;
  yearsOfExp: number | null;
  description: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompleteProfile {
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: TechnicalSkill[];
}

export interface JobExtractionRequest {
  rawText: string;
}

export interface JobExtractionResponse {
  positionTitle?: string;
  company?: string;
  location?: string;
  jobType?: string;
  techStack?: string[];
  softSkills?: string[];
  description?: string;
  salaryRange?: string;
}

export interface CreateWorkExperienceRequest {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  technologies?: string[];
}

export interface UpdateWorkExperienceRequest {
  company?: string;
  position?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  technologies?: string[];
}

export interface CreateEducationRequest {
  institution: string;
  degree: string;
  field_of_study?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

export interface UpdateEducationRequest {
  institution?: string;
  degree?: string;
  field_of_study?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

export interface CreateTechnicalSkillRequest {
  category: string;
  name: string;
  proficiency: SkillProficiency;
  years_of_exp?: number;
  description?: string;
  verified?: boolean;
}

export interface UpdateTechnicalSkillRequest {
  category?: string;
  name?: string;
  proficiency?: SkillProficiency;
  years_of_exp?: number;
  description?: string;
  verified?: boolean;
}

export interface CVExtractionResponse {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  work_experience?: Array<{
    company: string;
    position: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
    technologies?: string[];
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
  }>;
  technical_skills?: Array<{
    category: string;
    name: string;
    proficiency?: string;
  }>;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: string;
}

// Response types for API endpoints
export interface CreateApplicationResponse {
  success: boolean;
  application: Application;
  extractedData?: JobExtractionResponse;
}

export interface GetApplicationsResponse {
  applications: Application[];
}

export interface GetApplicationResponse {
  application: Application;
}

export interface UpdateApplicationResponse {
  success: boolean;
  application: Application;
}

export interface DeleteApplicationResponse {
  success: boolean;
  message: string;
}

export interface GetProfileResponse {
  profile: CompleteProfile;
}

export interface CreateWorkExperienceResponse {
  success: boolean;
  experience: WorkExperience;
}

export interface GetWorkExperienceResponse {
  experiences: WorkExperience[];
}

export interface UpdateWorkExperienceResponse {
  success: boolean;
  experience: WorkExperience;
}

export interface DeleteWorkExperienceResponse {
  success: boolean;
  message: string;
}

export interface CreateEducationResponse {
  success: boolean;
  education: Education;
}

export interface GetEducationResponse {
  educations: Education[];
}

export interface UpdateEducationResponse {
  success: boolean;
  education: Education;
}

export interface DeleteEducationResponse {
  success: boolean;
  message: string;
}

export interface CreateTechnicalSkillResponse {
  success: boolean;
  skill: TechnicalSkill;
}

export interface GetTechnicalSkillsResponse {
  skills: TechnicalSkill[];
}

export interface UpdateTechnicalSkillResponse {
  success: boolean;
  skill: TechnicalSkill;
}

export interface DeleteTechnicalSkillResponse {
  success: boolean;
  message: string;
}
