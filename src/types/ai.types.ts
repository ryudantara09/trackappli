/**
 * AI Extraction Type Definitions
 */

export interface JobExtraction {
  position_title?: string;
  company?: string;
  location?: string | { city?: string; country?: string };
  job_type?: string;
  tech_stack?: string[];
  soft_skills?: string[];
  description?: string;
  salary_range?: string;
}

export interface CVPersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface CVWorkExperience {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  technologies?: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
}

export interface CVTechnicalSkill {
  category: string;
  name: string;
  proficiency?: string;
}

export interface CVExtraction {
  personal_info?: CVPersonalInfo;
  work_experience?: CVWorkExperience[];
  education?: CVEducation[];
  technical_skills?: CVTechnicalSkill[];
}

export interface ExtractionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
}
