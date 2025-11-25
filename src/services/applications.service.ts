/**
 * Applications Service
 * 
 * Business logic for job application management including:
 * - Creating applications with AI extraction
 * - Retrieving applications with search and filtering
 * - Updating and deleting applications
 * - Data validation
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../core/database/types';
import {
  ApplicationsRepository,
  Application,
  ApplicationInsert,
  ApplicationUpdate,
  ApplicationSearchParams,
} from '../repositories/applications.repository';
import { extractJobPosting } from '../core/ai/extractors/job-posting';
import { ValidationError, NotFoundError } from '../utils/errors';
import { APPLICATION_STATUS, EXTENSION_HEADER } from '../config/constants';

export interface CreateApplicationInput {
  userId: string;
  positionUrl?: string;
  positionTitle?: string;
  companyName?: string;
  jobLocation?: string;
  rawText?: string;
  status?: string;
  appliedAt?: string;
  notes?: string;
  tags?: string[];
  description?: string;
  isFromExtension?: boolean;
  techStack?: string[];
  softSkills?: string[];
  jobType?: string;
  cvPath?: string;
  coverLetterPath?: string;
}

export interface UpdateApplicationInput {
  positionTitle?: string;
  companyName?: string;
  jobLocation?: string;
  status?: string;
  appliedAt?: string;
  notes?: string;
  tags?: string[];
  description?: string;
  cvPath?: string;
  coverLetterPath?: string;
}

export interface ApplicationWithExtraction {
  application: Application;
  extractedData?: {
    position_title?: string;
    company?: string;
    location?: string | { city?: string; country?: string };
    job_type?: string;
    tech_stack?: string[];
    soft_skills?: string[];
    description?: string;
    salary_range?: string;
  };
}

/**
 * Applications Service
 */
export class ApplicationsService {
  private repository: ApplicationsRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new ApplicationsRepository(supabase);
  }

  /**
   * Validate application creation input
   */
  private validateCreateInput(input: CreateApplicationInput): void {
    // Validate status if provided
    if (input.status && !Object.values(APPLICATION_STATUS).includes(input.status as any)) {
      throw new ValidationError(
        `Invalid status. Must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`
      );
    }

    // Validate appliedAt date if provided
    if (input.appliedAt) {
      const date = new Date(input.appliedAt);
      if (isNaN(date.getTime())) {
        throw new ValidationError('Applied date must be a valid ISO date string');
      }
    }

    // Validate URL format if provided
    if (input.positionUrl && input.positionUrl.trim().length > 0) {
      try {
        new URL(input.positionUrl);
      } catch {
        throw new ValidationError('Position URL must be a valid URL');
      }
    }
  }

  /**
   * Validate application update input
   */
  private validateUpdateInput(input: UpdateApplicationInput): void {
    // Validate status if provided
    if (input.status && !Object.values(APPLICATION_STATUS).includes(input.status as any)) {
      throw new ValidationError(
        `Invalid status. Must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`
      );
    }

    // Validate appliedAt date if provided
    if (input.appliedAt) {
      const date = new Date(input.appliedAt);
      if (isNaN(date.getTime())) {
        throw new ValidationError('Applied date must be a valid ISO date string');
      }
    }
  }

  /**
   * Create a new application with optional AI extraction
   */
  async createApplication(input: CreateApplicationInput): Promise<ApplicationWithExtraction> {
    // Validate input
    this.validateCreateInput(input);

    let extractedData;
    let finalData = {
      positionTitle: input.positionTitle,
      companyName: input.companyName,
      jobLocation: input.jobLocation,
      description: input.description,
      techStack: input.techStack || (null as any),
      softSkills: input.softSkills || (null as any),
      jobType: input.jobType || (null as string | null),
    };

    // Attempt AI extraction if raw text provided
    if (input.rawText && input.rawText.trim().length > 0) {
      try {
        const extractionResult = await extractJobPosting(input.rawText);
        
        if (extractionResult.success && extractionResult.data) {
          extractedData = extractionResult.data;

          // Use extracted data to fill in missing fields
          if (!finalData.positionTitle && extractedData.position_title) {
            finalData.positionTitle = extractedData.position_title;
          }
          if (!finalData.companyName && extractedData.company) {
            finalData.companyName = extractedData.company;
          }
          if (!finalData.jobLocation && extractedData.location) {
            // Normalize location to string
            if (typeof extractedData.location === 'string') {
              finalData.jobLocation = extractedData.location;
            } else if (extractedData.location) {
              // Handle object format
              const parts = [];
              if (extractedData.location.city) parts.push(extractedData.location.city);
              if (extractedData.location.country) parts.push(extractedData.location.country);
              finalData.jobLocation = parts.length > 0 ? parts.join(', ') : undefined;
            }
          }
          if (!finalData.description && extractedData.description) {
            finalData.description = extractedData.description;
          }

          // Store tech stack and soft skills as JSONB arrays
          if (extractedData.tech_stack && extractedData.tech_stack.length > 0) {
            finalData.techStack = extractedData.tech_stack;
          }
          if (extractedData.soft_skills && extractedData.soft_skills.length > 0) {
            finalData.softSkills = extractedData.soft_skills;
          }
          if (extractedData.job_type) {
            finalData.jobType = extractedData.job_type;
          }
        }
      } catch (error) {
        // Log extraction error but don't fail the application creation
        console.error('AI extraction failed:', error);
      }
    }

    // Prepare tags
    let tags = input.tags || [];
    if (input.isFromExtension) {
      tags = [...tags, 'chrome-extension'];
    }

    // Prepare application data for insertion
    const applicationData: ApplicationInsert = {
      user_id: input.userId,
      position_url: input.positionUrl ?? '',
      position_title: finalData.positionTitle || null,
      company_name: finalData.companyName || null,
      job_location: finalData.jobLocation || null,
      status: input.status || APPLICATION_STATUS.APPLIED,
      applied_at: input.appliedAt ? new Date(input.appliedAt).toISOString() : new Date().toISOString(),
      notes: input.notes || null,
      description: finalData.description || null,
      tech_stack: finalData.techStack,
      soft_skills: finalData.softSkills,
      job_type: finalData.jobType,
      tags: tags.length > 0 ? tags : null,
      extracted_json: extractedData ? JSON.parse(JSON.stringify(extractedData)) : null,
      cv_path: input.cvPath || null,
      cover_letter_path: input.coverLetterPath || null,
    };

    // Create application in database
    const application = await this.repository.create(applicationData);

    return {
      application,
      extractedData,
    };
  }

  /**
   * Get applications for a user with optional search and filtering
   */
  async getApplications(
    userId: string,
    params?: ApplicationSearchParams
  ): Promise<Application[]> {
    return this.repository.findByUserId(userId, params);
  }

  /**
   * Get a single application by ID
   */
  async getApplicationById(id: number, userId: string): Promise<Application> {
    const application = await this.repository.findById(id);

    if (!application) {
      throw new NotFoundError('Application');
    }

    // Verify ownership (additional check beyond RLS)
    if (application.user_id !== userId) {
      throw new NotFoundError('Application');
    }

    return application;
  }

  /**
   * Update an application
   */
  async updateApplication(
    id: number,
    userId: string,
    input: UpdateApplicationInput
  ): Promise<Application> {
    // Validate input
    this.validateUpdateInput(input);

    // Verify application exists and user owns it
    await this.getApplicationById(id, userId);

    // Prepare update data
    const updateData: ApplicationUpdate = {};

    if (input.positionTitle !== undefined) {
      updateData.position_title = input.positionTitle || null;
    }
    if (input.companyName !== undefined) {
      updateData.company_name = input.companyName || null;
    }
    if (input.jobLocation !== undefined) {
      updateData.job_location = input.jobLocation || null;
    }
    if (input.status !== undefined) {
      updateData.status = input.status;
    }
    if (input.appliedAt !== undefined) {
      updateData.applied_at = new Date(input.appliedAt).toISOString();
    }
    if (input.notes !== undefined) {
      updateData.notes = input.notes || null;
    }
    if (input.description !== undefined) {
      updateData.description = input.description || null;
    }
    if (input.tags !== undefined) {
      updateData.tags = input.tags.length > 0 ? input.tags : null;
    }
    if (input.cvPath !== undefined) {
      updateData.cv_path = input.cvPath || null;
    }
    if (input.coverLetterPath !== undefined) {
      updateData.cover_letter_path = input.coverLetterPath || null;
    }

    // Update application
    return this.repository.update(id, updateData);
  }

  /**
   * Delete an application
   */
  async deleteApplication(id: number, userId: string): Promise<void> {
    // Verify application exists and user owns it
    await this.getApplicationById(id, userId);

    // Delete application
    await this.repository.delete(id);
  }

  /**
   * Search applications with advanced filtering
   */
  async searchApplications(
    userId: string,
    query?: string,
    status?: string,
    limit?: number,
    offset?: number
  ): Promise<Application[]> {
    return this.repository.search(userId, {
      query,
      status,
      limit,
      offset,
    });
  }

  /**
   * Get application count for a user
   */
  async getApplicationCount(userId: string, status?: string): Promise<number> {
    return this.repository.count(userId, status);
  }
}
