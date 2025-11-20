/**
 * Profile Service
 * 
 * Business logic for user profile management including:
 * - Retrieving complete profile data
 * - Saving extracted CV data in batch
 * - Managing work experience, education, and skills
 * - Data validation
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../core/database/types';
import {
  ExperienceRepository,
  WorkExperience,
  WorkExperienceInsert,
} from '../repositories/experience.repository';
import {
  EducationRepository,
  Education,
  EducationInsert,
} from '../repositories/education.repository';
import {
  SkillsRepository,
  TechnicalSkill,
  TechnicalSkillInsert,
} from '../repositories/skills.repository';
import { ProfileRepository, Profile } from '../repositories/profile.repository';
import { CVExtraction } from '../types/ai.types';
import { ValidationError } from '../utils/errors';
import { SKILL_PROFICIENCY } from '../config/constants';

export interface CompleteProfile {
  profile: Profile | null;
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: TechnicalSkill[];
}

export interface SaveCVDataResult {
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: TechnicalSkill[];
  summary: {
    workExperienceCount: number;
    educationCount: number;
    skillsCount: number;
  };
}

/**
 * Profile Service
 */
export class ProfileService {
  private experienceRepo: ExperienceRepository;
  private educationRepo: EducationRepository;
  private skillsRepo: SkillsRepository;
  private profileRepo: ProfileRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.experienceRepo = new ExperienceRepository(supabase);
    this.educationRepo = new EducationRepository(supabase);
    this.skillsRepo = new SkillsRepository(supabase);
    this.profileRepo = new ProfileRepository(supabase);
  }

  /**
   * Get complete profile for a user
   * Aggregates work experience, education, and technical skills
   */
  async getCompleteProfile(userId: string): Promise<CompleteProfile> {
    // Fetch all profile data in parallel
    const [profile, workExperience, education, technicalSkills] = await Promise.all([
      this.profileRepo.findById(userId),
      this.experienceRepo.findByUserId(userId),
      this.educationRepo.findByUserId(userId),
      this.skillsRepo.findByUserId(userId),
    ]);

    return {
      profile,
      workExperience,
      education,
      technicalSkills,
    };
  }

  /**
   * Parse date string from CV extraction
   * Handles various date formats and returns ISO date string
   */
  private parseDate(dateStr: string): string {
    // Try to parse the date
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      // If parsing fails, try common formats
      // Format: "MM/YYYY" or "MM-YYYY"
      const monthYearMatch = dateStr.match(/^(\d{1,2})[\/-](\d{4})$/);
      if (monthYearMatch) {
        const [, month, year] = monthYearMatch;
        return `${year}-${month.padStart(2, '0')}-01`;
      }
      
      // Format: "YYYY"
      const yearMatch = dateStr.match(/^(\d{4})$/);
      if (yearMatch) {
        return `${yearMatch[1]}-01-01`;
      }
      
      // If all parsing fails, throw error
      throw new ValidationError(`Invalid date format: ${dateStr}`);
    }
    
    // Return ISO date string (YYYY-MM-DD)
    return date.toISOString().split('T')[0];
  }

  /**
   * Map proficiency string to valid proficiency level
   */
  private mapProficiency(proficiency?: string): string {
    if (!proficiency) {
      return SKILL_PROFICIENCY.INTERMEDIATE;
    }

    const normalized = proficiency.toUpperCase().trim();
    
    // Direct match
    if (Object.values(SKILL_PROFICIENCY).includes(normalized as any)) {
      return normalized;
    }

    // Fuzzy matching
    if (normalized.includes('EXPERT') || normalized.includes('ADVANCED')) {
      return SKILL_PROFICIENCY.EXPERT;
    }
    if (normalized.includes('INTERMEDIATE') || normalized.includes('PROFICIENT')) {
      return SKILL_PROFICIENCY.INTERMEDIATE;
    }
    if (normalized.includes('BEGINNER') || normalized.includes('BASIC')) {
      return SKILL_PROFICIENCY.BEGINNER;
    }

    // Default to intermediate
    return SKILL_PROFICIENCY.INTERMEDIATE;
  }

  /**
   * Normalize skill category
   */
  private normalizeCategory(category: string): string {
    const normalized = category.toUpperCase().trim().replace(/\s+/g, '_');
    
    // Map common variations
    const categoryMap: Record<string, string> = {
      'PROGRAMMING': 'PROGRAMMING_LANGUAGE',
      'LANGUAGE': 'PROGRAMMING_LANGUAGE',
      'LANGUAGES': 'PROGRAMMING_LANGUAGE',
      'FRAMEWORKS': 'FRAMEWORK',
      'LIBRARIES': 'FRAMEWORK',
      'DATABASES': 'DATABASE',
      'DB': 'DATABASE',
      'TOOLS': 'TOOL',
      'DEVOPS': 'TOOL',
      'CLOUD_PLATFORM': 'CLOUD',
      'CLOUD_PLATFORMS': 'CLOUD',
    };

    return categoryMap[normalized] || normalized;
  }

  /**
   * Save extracted CV data in batch
   * Creates work experience, education, and skills entries
   */
  async saveExtractedCVData(
    userId: string,
    cvData: CVExtraction
  ): Promise<SaveCVDataResult> {
    const result: SaveCVDataResult = {
      workExperience: [],
      education: [],
      technicalSkills: [],
      summary: {
        workExperienceCount: 0,
        educationCount: 0,
        skillsCount: 0,
      },
    };

    // Process work experience
    if (cvData.personal_info) {
      const { name, email, phone, location } = cvData.personal_info;
      let first_name = '';
      let last_name = '';
      
      if (name) {
        const nameParts = name.split(' ');
        first_name = nameParts[0];
        last_name = nameParts.slice(1).join(' ');
      }

      // Fetch existing profile to preserve data that isn't being updated
      const existingProfile = await this.profileRepo.findById(userId);

      await this.profileRepo.upsert({
        id: userId,
        first_name: first_name || existingProfile?.first_name || null,
        last_name: last_name || existingProfile?.last_name || null,
        email: email || existingProfile?.email || null,
        phone: phone || existingProfile?.phone || null,
        location: location || existingProfile?.location || null,
        summary: existingProfile?.summary || null,
        website: existingProfile?.website || null,
        linkedin_url: existingProfile?.linkedin_url || null,
        github_url: existingProfile?.github_url || null,
        avatar_url: existingProfile?.avatar_url || null
      });
    }

    if (cvData.work_experience && cvData.work_experience.length > 0) {
      const experienceData: WorkExperienceInsert[] = cvData.work_experience.map(exp => {
        try {
          return {
            user_id: userId,
            company: exp.company,
            position: exp.position,
            location: exp.location || null,
            start_date: this.parseDate(exp.start_date),
            end_date: exp.end_date ? this.parseDate(exp.end_date) : null,
            current: exp.current,
            description: exp.description || null,
            technologies: exp.technologies && exp.technologies.length > 0 ? exp.technologies : null,
          };
        } catch (error) {
          console.error('Failed to parse work experience:', exp, error);
          throw new ValidationError(
            `Invalid work experience data: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      });

      result.workExperience = await this.experienceRepo.createBatch(experienceData);
      result.summary.workExperienceCount = result.workExperience.length;
    }

    // Process education
    if (cvData.education && cvData.education.length > 0) {
      const educationData: EducationInsert[] = cvData.education.map(edu => {
        try {
          return {
            user_id: userId,
            institution: edu.institution,
            degree: edu.degree,
            field_of_study: edu.field_of_study || null,
            location: null,
            start_date: this.parseDate(edu.start_date),
            end_date: edu.end_date ? this.parseDate(edu.end_date) : null,
            current: edu.current,
            gpa: null,
            description: null,
          };
        } catch (error) {
          console.error('Failed to parse education:', edu, error);
          throw new ValidationError(
            `Invalid education data: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      });

      result.education = await this.educationRepo.createBatch(educationData);
      result.summary.educationCount = result.education.length;
    }

    // Process technical skills
    if (cvData.technical_skills && cvData.technical_skills.length > 0) {
      const skillsData: TechnicalSkillInsert[] = cvData.technical_skills.map(skill => ({
        user_id: userId,
        category: this.normalizeCategory(skill.category),
        name: skill.name,
        proficiency: this.mapProficiency(skill.proficiency),
        years_of_exp: null,
        description: null,
        verified: false,
      }));

      result.technicalSkills = await this.skillsRepo.createBatch(skillsData);
      result.summary.skillsCount = result.technicalSkills.length;
    }

    return result;
  }

  /**
   * Validate work experience data
   */
  validateWorkExperience(data: Partial<WorkExperienceInsert>): void {
    if (!data.company || data.company.trim().length === 0) {
      throw new ValidationError('Company name is required');
    }
    if (!data.position || data.position.trim().length === 0) {
      throw new ValidationError('Position is required');
    }
    if (!data.start_date) {
      throw new ValidationError('Start date is required');
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    if (isNaN(startDate.getTime())) {
      throw new ValidationError('Invalid start date');
    }

    if (data.end_date) {
      const endDate = new Date(data.end_date);
      if (isNaN(endDate.getTime())) {
        throw new ValidationError('Invalid end date');
      }
      if (endDate < startDate) {
        throw new ValidationError('End date must be after start date');
      }
    }

    if (data.current && data.end_date) {
      throw new ValidationError('Current position cannot have an end date');
    }
  }

  /**
   * Validate education data
   */
  validateEducation(data: Partial<EducationInsert>): void {
    if (!data.institution || data.institution.trim().length === 0) {
      throw new ValidationError('Institution name is required');
    }
    if (!data.degree || data.degree.trim().length === 0) {
      throw new ValidationError('Degree is required');
    }
    if (!data.start_date) {
      throw new ValidationError('Start date is required');
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    if (isNaN(startDate.getTime())) {
      throw new ValidationError('Invalid start date');
    }

    if (data.end_date) {
      const endDate = new Date(data.end_date);
      if (isNaN(endDate.getTime())) {
        throw new ValidationError('Invalid end date');
      }
      if (endDate < startDate) {
        throw new ValidationError('End date must be after start date');
      }
    }

    if (data.current && data.end_date) {
      throw new ValidationError('Current education cannot have an end date');
    }
  }

  /**
   * Validate technical skill data
   */
  validateTechnicalSkill(data: Partial<TechnicalSkillInsert>): void {
    if (!data.category || data.category.trim().length === 0) {
      throw new ValidationError('Skill category is required');
    }
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Skill name is required');
    }

    // Validate proficiency level only if provided
    if (data.proficiency && data.proficiency.trim().length > 0) {
      if (!Object.values(SKILL_PROFICIENCY).includes(data.proficiency as any)) {
        throw new ValidationError(
          `Invalid proficiency level. Must be one of: ${Object.values(SKILL_PROFICIENCY).join(', ')}`
        );
      }
    }

    // Validate years of experience if provided
    if (data.years_of_exp !== null && data.years_of_exp !== undefined) {
      if (data.years_of_exp < 0) {
        throw new ValidationError('Years of experience cannot be negative');
      }
      if (data.years_of_exp > 100) {
        throw new ValidationError('Years of experience seems unrealistic');
      }
    }
  }
}
