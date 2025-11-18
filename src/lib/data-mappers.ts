/**
 * Data Mapping Layer
 * 
 * Handles bidirectional transformation between backend and frontend data structures.
 * This ensures seamless data flow while maintaining different naming conventions
 * and enum values between backend (database) and frontend (UI).
 */

import { Application as BackendApplication } from '../types/api.types';
import { 
  FrontendApplication, 
  ApplicationStatus as FrontendStatus,
  JobType as FrontendJobType,
  ApplicationFormData 
} from '../types/frontend.types';
import { 
  ApplicationStatus as BackendStatus,
  JobType as BackendJobType 
} from '../config/constants';

/**
 * ApplicationMapper
 * 
 * Provides static methods for transforming Application data between
 * backend and frontend formats.
 */
export class ApplicationMapper {
  /**
   * Transform backend Application to frontend format
   * 
   * Field mappings:
   * - id: number → string
   * - positionTitle → position
   * - companyName → company
   * - jobLocation → location
   * - appliedAt: Date → dateApplied: string (ISO format)
   * - positionUrl → url
   * - techStack → skills
   * - status: APPLIED → Applied (enum mapping)
   * 
   * @param backend - Backend Application object
   * @returns Frontend-formatted Application
   */
  static toFrontend(backend: BackendApplication): FrontendApplication {
    return {
      id: backend.id.toString(),
      position: backend.positionTitle || '',
      company: backend.companyName || '',
      location: backend.jobLocation || '',
      status: this.mapStatusToFrontend(backend.status),
      dateApplied: backend.appliedAt.toISOString(),
      url: backend.positionUrl,
      description: backend.description || undefined,
      notes: backend.notes || undefined,
      skills: backend.techStack || undefined,
      softSkills: backend.softSkills || undefined,
      jobType: backend.jobType ? this.mapJobTypeToFrontend(backend.jobType) : undefined,
      tags: backend.tags || undefined,
      cvPath: backend.cvPath || undefined,
      coverLetterPath: backend.coverLetterPath || undefined,
    };
  }

  /**
   * Transform frontend Application data to backend format
   * 
   * Used for create/update operations. Reverses the field mappings
   * from toFrontend().
   * 
   * Field mappings:
   * - position → position_title
   * - company → company_name
   * - location → job_location
   * - dateApplied: string → applied_at: string
   * - url → position_url
   * - skills → tech_stack
   * - status: Applied → APPLIED (enum mapping)
   * 
   * @param frontend - Frontend Application or form data
   * @returns Backend-formatted data object
   */
  static toBackend(frontend: Partial<FrontendApplication> | ApplicationFormData) {
    const backendData: Record<string, any> = {};

    if (frontend.position !== undefined) {
      backendData.position_title = frontend.position;
    }
    if (frontend.company !== undefined) {
      backendData.company_name = frontend.company;
    }
    if (frontend.location !== undefined) {
      backendData.job_location = frontend.location;
    }
    if (frontend.url !== undefined) {
      backendData.position_url = frontend.url;
    }
    if (frontend.status !== undefined) {
      backendData.status = this.mapStatusToBackend(frontend.status);
    }
    if (frontend.dateApplied !== undefined) {
      backendData.applied_at = frontend.dateApplied;
    }
    if (frontend.description !== undefined) {
      backendData.description = frontend.description;
    }
    if (frontend.notes !== undefined) {
      backendData.notes = frontend.notes;
    }
    if (frontend.skills !== undefined) {
      backendData.tech_stack = frontend.skills;
    }
    if (frontend.softSkills !== undefined) {
      backendData.soft_skills = frontend.softSkills;
    }
    if (frontend.jobType !== undefined) {
      backendData.job_type = this.mapJobTypeToBackend(frontend.jobType);
    }
    if (frontend.tags !== undefined) {
      backendData.tags = frontend.tags;
    }
    if (frontend.cvPath !== undefined) {
      backendData.cv_path = frontend.cvPath;
    }
    if (frontend.coverLetterPath !== undefined) {
      backendData.cover_letter_path = frontend.coverLetterPath;
    }

    return backendData;
  }

  /**
   * Map backend status enum to frontend status enum
   * 
   * Backend: APPLIED, INTERVIEWING, OFFERED, REJECTED
   * Frontend: Applied, Interview, Offer, Rejected, Withdrawn
   * 
   * @param backendStatus - Backend status string
   * @returns Frontend ApplicationStatus enum value
   */
  private static mapStatusToFrontend(backendStatus: BackendStatus): FrontendStatus {
    const mapping: Record<string, FrontendStatus> = {
      'APPLIED': FrontendStatus.APPLIED,
      'INTERVIEWING': FrontendStatus.INTERVIEW,
      'OFFERED': FrontendStatus.OFFER,
      'REJECTED': FrontendStatus.REJECTED,
      // Backend doesn't have WITHDRAWN, but frontend does
      // Default to WITHDRAWN if unknown status
    };

    return mapping[backendStatus] || FrontendStatus.WITHDRAWN;
  }

  /**
   * Map frontend status enum to backend status enum
   * 
   * Frontend: Applied, Interview, Offer, Rejected, Withdrawn
   * Backend: APPLIED, INTERVIEWING, OFFERED, REJECTED
   * 
   * Note: Frontend's "Withdrawn" maps to backend's "REJECTED" as
   * the backend doesn't have a separate withdrawn status.
   * 
   * @param frontendStatus - Frontend ApplicationStatus enum value
   * @returns Backend status string
   */
  private static mapStatusToBackend(frontendStatus: FrontendStatus): BackendStatus {
    const mapping: Record<FrontendStatus, BackendStatus> = {
      [FrontendStatus.APPLIED]: 'APPLIED',
      [FrontendStatus.INTERVIEW]: 'INTERVIEWING',
      [FrontendStatus.OFFER]: 'OFFERED',
      [FrontendStatus.REJECTED]: 'REJECTED',
      // Map WITHDRAWN to REJECTED since backend doesn't have WITHDRAWN
      [FrontendStatus.WITHDRAWN]: 'REJECTED',
    };

    return mapping[frontendStatus];
  }

  /**
   * Map backend job type enum to frontend job type enum
   * 
   * Backend: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
   * Frontend: Full-time, Part-time, Contract, Internship, Freelance
   * 
   * @param backendJobType - Backend JobType string
   * @returns Frontend JobType enum value
   */
  private static mapJobTypeToFrontend(backendJobType: BackendJobType): FrontendJobType {
    const mapping: Record<string, FrontendJobType> = {
      'FULL_TIME': FrontendJobType.FULL_TIME,
      'PART_TIME': FrontendJobType.PART_TIME,
      'CONTRACT': FrontendJobType.CONTRACT,
      'INTERNSHIP': FrontendJobType.INTERNSHIP,
      'FREELANCE': FrontendJobType.FREELANCE,
    };

    return mapping[backendJobType] || FrontendJobType.FULL_TIME;
  }

  /**
   * Map frontend job type enum to backend job type enum
   * 
   * Frontend: Full-time, Part-time, Contract, Internship, Freelance
   * Backend: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
   * 
   * @param frontendJobType - Frontend JobType enum value
   * @returns Backend JobType string
   */
  private static mapJobTypeToBackend(frontendJobType: FrontendJobType): BackendJobType {
    const mapping: Record<FrontendJobType, BackendJobType> = {
      [FrontendJobType.FULL_TIME]: 'FULL_TIME',
      [FrontendJobType.PART_TIME]: 'PART_TIME',
      [FrontendJobType.CONTRACT]: 'CONTRACT',
      [FrontendJobType.INTERNSHIP]: 'INTERNSHIP',
      [FrontendJobType.FREELANCE]: 'FREELANCE',
    };

    return mapping[frontendJobType];
  }

  /**
   * Transform an array of backend Applications to frontend format
   * 
   * Convenience method for bulk transformations.
   * 
   * @param backendApplications - Array of backend Applications
   * @returns Array of frontend-formatted Applications
   */
  static toFrontendArray(backendApplications: BackendApplication[]): FrontendApplication[] {
    return backendApplications.map(app => this.toFrontend(app));
  }
}
