/**
 * Unit Tests for Data Mappers
 * 
 * Tests the bidirectional transformation between backend and frontend data formats.
 * Run with: node --test src/lib/__tests__/data-mappers.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ApplicationMapper } from '../data-mappers';
import { Application as BackendApplication } from '../../types/api.types';
import { ApplicationStatus as FrontendStatus, JobType as FrontendJobType } from '../../types/frontend.types';

describe('ApplicationMapper', () => {
  describe('toFrontend', () => {
    it('should transform backend application to frontend format', () => {
      const backendApp: BackendApplication = {
        id: 123,
        user_id: 'user-123',
        position_url: 'https://example.com/job',
        position_title: 'Senior Developer',
        company_name: 'Tech Corp',
        job_location: 'San Francisco, CA',
        applied_at: '2025-01-15T10:00:00Z',
        status: 'APPLIED',
        cv_path: '/uploads/cv.pdf',
        cover_letter_path: '/uploads/cover.pdf',
        notes: 'Great opportunity',
        description: 'Full stack role',
        tech_stack: ['React', 'Node.js'],
        soft_skills: ['Communication', 'Leadership'],
        job_type: 'FULL_TIME',
        tags: ['remote', 'senior'],
        extracted_json: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);

      assert.strictEqual(frontendApp.id, '123');
      assert.strictEqual(frontendApp.position, 'Senior Developer');
      assert.strictEqual(frontendApp.company, 'Tech Corp');
      assert.strictEqual(frontendApp.location, 'San Francisco, CA');
      assert.strictEqual(frontendApp.status, FrontendStatus.APPLIED);
      assert.strictEqual(frontendApp.url, 'https://example.com/job');
      assert.strictEqual(frontendApp.notes, 'Great opportunity');
      assert.strictEqual(frontendApp.description, 'Full stack role');
      assert.deepStrictEqual(frontendApp.skills, ['React', 'Node.js']);
      assert.deepStrictEqual(frontendApp.softSkills, ['Communication', 'Leadership']);
      assert.strictEqual(frontendApp.jobType, FrontendJobType.FULL_TIME);
      assert.deepStrictEqual(frontendApp.tags, ['remote', 'senior']);
    });

    it('should handle null values correctly', () => {
      const backendApp: BackendApplication = {
        id: 456,
        user_id: 'user-456',
        position_url: 'https://example.com/job2',
        position_title: null,
        company_name: null,
        job_location: null,
        applied_at: '2025-01-20T10:00:00Z',
        status: 'REJECTED',
        cv_path: null,
        cover_letter_path: null,
        notes: null,
        description: null,
        tech_stack: null,
        soft_skills: null,
        job_type: null,
        tags: null,
        extracted_json: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);

      assert.strictEqual(frontendApp.position, '');
      assert.strictEqual(frontendApp.company, '');
      assert.strictEqual(frontendApp.location, '');
      assert.strictEqual(frontendApp.status, FrontendStatus.REJECTED);
      assert.strictEqual(frontendApp.description, undefined);
      assert.strictEqual(frontendApp.skills, undefined);
      assert.strictEqual(frontendApp.jobType, undefined);
    });
  });

  describe('toBackend', () => {
    it('should transform frontend data to backend format', () => {
      const frontendData = {
        position: 'Backend Engineer',
        company: 'StartupCo',
        location: 'Remote',
        url: 'https://example.com/backend-job',
        status: FrontendStatus.INTERVIEW,
        dateApplied: '2025-02-01T10:00:00Z',
        description: 'Backend development role',
        notes: 'Interesting startup',
        skills: ['Python', 'Django'],
        softSkills: ['Problem Solving'],
        jobType: FrontendJobType.CONTRACT,
        tags: ['python', 'backend'],
      };

      const backendData = ApplicationMapper.toBackend(frontendData);

      assert.strictEqual(backendData.positionTitle, 'Backend Engineer');
      assert.strictEqual(backendData.companyName, 'StartupCo');
      assert.strictEqual(backendData.jobLocation, 'Remote');
      assert.strictEqual(backendData.positionUrl, 'https://example.com/backend-job');
      assert.strictEqual(backendData.status, 'INTERVIEWING');
      assert.strictEqual(backendData.appliedAt, '2025-02-01T10:00:00Z');
      assert.strictEqual(backendData.description, 'Backend development role');
      assert.strictEqual(backendData.notes, 'Interesting startup');
      assert.deepStrictEqual(backendData.techStack, ['Python', 'Django']);
      assert.deepStrictEqual(backendData.softSkills, ['Problem Solving']);
      assert.strictEqual(backendData.jobType, 'CONTRACT');
      assert.deepStrictEqual(backendData.tags, ['python', 'backend']);
    });

    it('should handle partial data correctly', () => {
      const partialData = {
        position: 'Frontend Developer',
        status: FrontendStatus.OFFER,
      };

      const backendData = ApplicationMapper.toBackend(partialData);

      assert.strictEqual(backendData.positionTitle, 'Frontend Developer');
      assert.strictEqual(backendData.status, 'OFFERED');
      assert.strictEqual(backendData.companyName, undefined);
      assert.strictEqual(backendData.jobLocation, undefined);
    });
  });

  describe('status mapping', () => {
    it('should map all frontend statuses to backend', () => {
      const testCases = [
        { frontend: FrontendStatus.APPLIED, backend: 'APPLIED' },
        { frontend: FrontendStatus.INTERVIEW, backend: 'INTERVIEWING' },
        { frontend: FrontendStatus.OFFER, backend: 'OFFERED' },
        { frontend: FrontendStatus.REJECTED, backend: 'REJECTED' },
        { frontend: FrontendStatus.WITHDRAWN, backend: 'REJECTED' }, // Maps to REJECTED
      ];

      testCases.forEach(({ frontend, backend }) => {
        const result = ApplicationMapper.toBackend({ status: frontend });
        assert.strictEqual(result.status, backend, `${frontend} should map to ${backend}`);
      });
    });

    it('should map all backend statuses to frontend', () => {
      const testCases = [
        { backend: 'APPLIED', frontend: FrontendStatus.APPLIED },
        { backend: 'INTERVIEWING', frontend: FrontendStatus.INTERVIEW },
        { backend: 'OFFERED', frontend: FrontendStatus.OFFER },
        { backend: 'REJECTED', frontend: FrontendStatus.REJECTED },
      ];

      testCases.forEach(({ backend, frontend }) => {
        const backendApp: BackendApplication = {
          id: 1,
          user_id: 'test',
          position_url: 'test',
          position_title: 'test',
          company_name: 'test',
          job_location: 'test',
          applied_at: new Date().toISOString(),
          status: backend as any,
          cv_path: null,
          cover_letter_path: null,
          notes: null,
          description: null,
          tech_stack: null,
          soft_skills: null,
          job_type: null,
          tags: null,
          extracted_json: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const result = ApplicationMapper.toFrontend(backendApp);
        assert.strictEqual(result.status, frontend, `${backend} should map to ${frontend}`);
      });
    });
  });

  describe('job type mapping', () => {
    it('should map all job types bidirectionally', () => {
      const testCases = [
        { frontend: FrontendJobType.FULL_TIME, backend: 'FULL_TIME' },
        { frontend: FrontendJobType.PART_TIME, backend: 'PART_TIME' },
        { frontend: FrontendJobType.CONTRACT, backend: 'CONTRACT' },
        { frontend: FrontendJobType.INTERNSHIP, backend: 'INTERNSHIP' },
        { frontend: FrontendJobType.FREELANCE, backend: 'FREELANCE' },
      ];

      testCases.forEach(({ frontend, backend }) => {
        // Frontend to backend
        const backendResult = ApplicationMapper.toBackend({ jobType: frontend });
        assert.strictEqual(backendResult.jobType, backend);

        // Backend to frontend
        const backendApp: BackendApplication = {
          id: 1,
          user_id: 'test',
          position_url: 'test',
          position_title: 'test',
          company_name: 'test',
          job_location: 'test',
          applied_at: new Date().toISOString(),
          status: 'APPLIED',
          cv_path: null,
          cover_letter_path: null,
          notes: null,
          description: null,
          tech_stack: null,
          soft_skills: null,
          job_type: backend as any,
          tags: null,
          extracted_json: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const frontendResult = ApplicationMapper.toFrontend(backendApp);
        assert.strictEqual(frontendResult.jobType, frontend);
      });
    });
  });

  describe('toFrontendArray', () => {
    it('should transform array of backend applications', () => {
      const backendApps: BackendApplication[] = [
        {
          id: 1,
          user_id: 'user-1',
          position_url: 'https://example.com/job1',
          position_title: 'Job 1',
          company_name: 'Company 1',
          job_location: 'Location 1',
          applied_at: new Date().toISOString(),
          status: 'APPLIED',
          cv_path: null,
          cover_letter_path: null,
          notes: null,
          description: null,
          tech_stack: null,
          soft_skills: null,
          job_type: null,
          tags: null,
          extracted_json: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_id: 'user-2',
          position_url: 'https://example.com/job2',
          position_title: 'Job 2',
          company_name: 'Company 2',
          job_location: 'Location 2',
          applied_at: new Date().toISOString(),
          status: 'INTERVIEWING',
          cv_path: null,
          cover_letter_path: null,
          notes: null,
          description: null,
          tech_stack: null,
          soft_skills: null,
          job_type: null,
          tags: null,
          extracted_json: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const frontendApps = ApplicationMapper.toFrontendArray(backendApps);

      assert.strictEqual(frontendApps.length, 2);
      assert.strictEqual(frontendApps[0].id, '1');
      assert.strictEqual(frontendApps[0].position, 'Job 1');
      assert.strictEqual(frontendApps[1].id, '2');
      assert.strictEqual(frontendApps[1].status, FrontendStatus.INTERVIEW);
    });

    it('should handle empty array', () => {
      const frontendApps = ApplicationMapper.toFrontendArray([]);
      assert.strictEqual(frontendApps.length, 0);
    });
  });

  describe('edge cases', () => {
    it('should handle unknown backend status by defaulting to WITHDRAWN', () => {
      const backendApp: BackendApplication = {
        id: 999,
        user_id: 'user-999',
        position_url: 'https://example.com/job',
        position_title: 'Test Job',
        company_name: 'Test Company',
        job_location: 'Test Location',
        applied_at: new Date().toISOString(),
        status: 'UNKNOWN_STATUS' as any,
        cv_path: null,
        cover_letter_path: null,
        notes: null,
        description: null,
        tech_stack: null,
        soft_skills: null,
        job_type: null,
        tags: null,
        extracted_json: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      assert.strictEqual(frontendApp.status, FrontendStatus.WITHDRAWN);
    });

    it('should handle unknown backend job type by defaulting to FULL_TIME', () => {
      const backendApp: BackendApplication = {
        id: 999,
        user_id: 'user-999',
        position_url: 'https://example.com/job',
        position_title: 'Test Job',
        company_name: 'Test Company',
        job_location: 'Test Location',
        applied_at: new Date().toISOString(),
        status: 'APPLIED',
        cv_path: null,
        cover_letter_path: null,
        notes: null,
        description: null,
        tech_stack: null,
        soft_skills: null,
        job_type: 'UNKNOWN_TYPE' as any,
        tags: null,
        extracted_json: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      assert.strictEqual(frontendApp.jobType, FrontendJobType.FULL_TIME);
    });

    it('should handle empty arrays correctly', () => {
      const backendApp: BackendApplication = {
        id: 789,
        user_id: 'user-789',
        position_url: 'https://example.com/job',
        position_title: 'Test Job',
        company_name: 'Test Company',
        job_location: 'Test Location',
        applied_at: new Date().toISOString(),
        status: 'APPLIED',
        cv_path: null,
        cover_letter_path: null,
        notes: null,
        description: null,
        tech_stack: [],
        soft_skills: [],
        job_type: null,
        tags: [],
        extracted_json: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);

      // Empty arrays should be preserved as empty arrays, not undefined
      assert.deepStrictEqual(frontendApp.skills, []);
      assert.deepStrictEqual(frontendApp.softSkills, []);
      assert.deepStrictEqual(frontendApp.tags, []);
    });

    it('should preserve ISO date format in toFrontend', () => {
      const testDate = '2025-03-15T14:30:00.000Z';
      const backendApp: BackendApplication = {
        id: 111,
        user_id: 'user-111',
        position_url: 'https://example.com/job',
        position_title: 'Test Job',
        company_name: 'Test Company',
        job_location: 'Test Location',
        applied_at: testDate,
        status: 'APPLIED',
        cv_path: null,
        cover_letter_path: null,
        notes: null,
        description: null,
        tech_stack: null,
        soft_skills: null,
        job_type: null,
        tags: null,
        extracted_json: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      assert.strictEqual(frontendApp.dateApplied, '2025-03-15T14:30:00.000Z');
    });

    it('should handle undefined values in toBackend', () => {
      const frontendData = {
        position: 'Test Position',
        company: undefined,
        location: undefined,
        url: 'https://example.com/job',
        status: FrontendStatus.APPLIED,
      };

      const backendData = ApplicationMapper.toBackend(frontendData);

      assert.strictEqual(backendData.positionTitle, 'Test Position');
      assert.strictEqual(backendData.positionUrl, 'https://example.com/job');
      assert.strictEqual(backendData.status, 'APPLIED');
      // Undefined values should be included as undefined
      assert.strictEqual(backendData.companyName, undefined);
      assert.strictEqual(backendData.jobLocation, undefined);
    });

    it('should handle empty strings in toBackend', () => {
      const frontendData = {
        position: '',
        company: '',
        location: 'Remote',
        url: '',
        status: FrontendStatus.APPLIED,
      };

      const backendData = ApplicationMapper.toBackend(frontendData);

      // Empty strings should be preserved
      assert.strictEqual(backendData.positionTitle, '');
      assert.strictEqual(backendData.companyName, '');
      assert.strictEqual(backendData.positionUrl, '');
      assert.strictEqual(backendData.jobLocation, 'Remote');
    });

    it('should handle all fields being undefined in toBackend', () => {
      const frontendData = {};

      const backendData = ApplicationMapper.toBackend(frontendData);

      // positionUrl is always set to ensure API validation works
      assert.deepStrictEqual(backendData, { positionUrl: '' });
    });
  });
});
