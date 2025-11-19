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
        userId: 'user-123',
        positionUrl: 'https://example.com/job',
        positionTitle: 'Senior Developer',
        companyName: 'Tech Corp',
        jobLocation: 'San Francisco, CA',
        appliedAt: new Date('2024-01-15T10:00:00Z'),
        status: 'APPLIED',
        cvPath: '/uploads/cv.pdf',
        coverLetterPath: '/uploads/cover.pdf',
        notes: 'Great opportunity',
        description: 'Full stack role',
        techStack: ['React', 'Node.js'],
        softSkills: ['Communication', 'Leadership'],
        jobType: 'FULL_TIME',
        tags: ['remote', 'senior'],
        extractedJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        userId: 'user-456',
        positionUrl: 'https://example.com/job2',
        positionTitle: null,
        companyName: null,
        jobLocation: null,
        appliedAt: new Date('2024-01-20T10:00:00Z'),
        status: 'REJECTED',
        cvPath: null,
        coverLetterPath: null,
        notes: null,
        description: null,
        techStack: null,
        softSkills: null,
        jobType: null,
        tags: null,
        extractedJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        dateApplied: '2024-02-01T10:00:00Z',
        description: 'Backend development role',
        notes: 'Interesting startup',
        skills: ['Python', 'Django'],
        softSkills: ['Problem Solving'],
        jobType: FrontendJobType.CONTRACT,
        tags: ['python', 'backend'],
      };

      const backendData = ApplicationMapper.toBackend(frontendData);

      assert.strictEqual(backendData.position_title, 'Backend Engineer');
      assert.strictEqual(backendData.company_name, 'StartupCo');
      assert.strictEqual(backendData.job_location, 'Remote');
      assert.strictEqual(backendData.position_url, 'https://example.com/backend-job');
      assert.strictEqual(backendData.status, 'INTERVIEWING');
      assert.strictEqual(backendData.applied_at, '2024-02-01T10:00:00Z');
      assert.strictEqual(backendData.description, 'Backend development role');
      assert.strictEqual(backendData.notes, 'Interesting startup');
      assert.deepStrictEqual(backendData.tech_stack, ['Python', 'Django']);
      assert.deepStrictEqual(backendData.soft_skills, ['Problem Solving']);
      assert.strictEqual(backendData.job_type, 'CONTRACT');
      assert.deepStrictEqual(backendData.tags, ['python', 'backend']);
    });

    it('should handle partial data correctly', () => {
      const partialData = {
        position: 'Frontend Developer',
        status: FrontendStatus.OFFER,
      };

      const backendData = ApplicationMapper.toBackend(partialData);

      assert.strictEqual(backendData.position_title, 'Frontend Developer');
      assert.strictEqual(backendData.status, 'OFFERED');
      assert.strictEqual(backendData.company_name, undefined);
      assert.strictEqual(backendData.job_location, undefined);
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
          userId: 'test',
          positionUrl: 'test',
          positionTitle: 'test',
          companyName: 'test',
          jobLocation: 'test',
          appliedAt: new Date(),
          status: backend as any,
          cvPath: null,
          coverLetterPath: null,
          notes: null,
          description: null,
          techStack: null,
          softSkills: null,
          jobType: null,
          tags: null,
          extractedJson: null,
          createdAt: new Date(),
          updatedAt: new Date(),
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
        assert.strictEqual(backendResult.job_type, backend);

        // Backend to frontend
        const backendApp: BackendApplication = {
          id: 1,
          userId: 'test',
          positionUrl: 'test',
          positionTitle: 'test',
          companyName: 'test',
          jobLocation: 'test',
          appliedAt: new Date(),
          status: 'APPLIED',
          cvPath: null,
          coverLetterPath: null,
          notes: null,
          description: null,
          techStack: null,
          softSkills: null,
          jobType: backend as any,
          tags: null,
          extractedJson: null,
          createdAt: new Date(),
          updatedAt: new Date(),
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
          userId: 'user-1',
          positionUrl: 'https://example.com/job1',
          positionTitle: 'Job 1',
          companyName: 'Company 1',
          jobLocation: 'Location 1',
          appliedAt: new Date(),
          status: 'APPLIED',
          cvPath: null,
          coverLetterPath: null,
          notes: null,
          description: null,
          techStack: null,
          softSkills: null,
          jobType: null,
          tags: null,
          extractedJson: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId: 'user-2',
          positionUrl: 'https://example.com/job2',
          positionTitle: 'Job 2',
          companyName: 'Company 2',
          jobLocation: 'Location 2',
          appliedAt: new Date(),
          status: 'INTERVIEWING',
          cvPath: null,
          coverLetterPath: null,
          notes: null,
          description: null,
          techStack: null,
          softSkills: null,
          jobType: null,
          tags: null,
          extractedJson: null,
          createdAt: new Date(),
          updatedAt: new Date(),
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
        userId: 'user-999',
        positionUrl: 'https://example.com/job',
        positionTitle: 'Test Job',
        companyName: 'Test Company',
        jobLocation: 'Test Location',
        appliedAt: new Date(),
        status: 'UNKNOWN_STATUS' as any,
        cvPath: null,
        coverLetterPath: null,
        notes: null,
        description: null,
        techStack: null,
        softSkills: null,
        jobType: null,
        tags: null,
        extractedJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      assert.strictEqual(frontendApp.status, FrontendStatus.WITHDRAWN);
    });

    it('should handle unknown backend job type by defaulting to FULL_TIME', () => {
      const backendApp: BackendApplication = {
        id: 999,
        userId: 'user-999',
        positionUrl: 'https://example.com/job',
        positionTitle: 'Test Job',
        companyName: 'Test Company',
        jobLocation: 'Test Location',
        appliedAt: new Date(),
        status: 'APPLIED',
        cvPath: null,
        coverLetterPath: null,
        notes: null,
        description: null,
        techStack: null,
        softSkills: null,
        jobType: 'UNKNOWN_TYPE' as any,
        tags: null,
        extractedJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      assert.strictEqual(frontendApp.jobType, FrontendJobType.FULL_TIME);
    });

    it('should handle empty arrays correctly', () => {
      const backendApp: BackendApplication = {
        id: 789,
        userId: 'user-789',
        positionUrl: 'https://example.com/job',
        positionTitle: 'Test Job',
        companyName: 'Test Company',
        jobLocation: 'Test Location',
        appliedAt: new Date(),
        status: 'APPLIED',
        cvPath: null,
        coverLetterPath: null,
        notes: null,
        description: null,
        techStack: [],
        softSkills: [],
        jobType: null,
        tags: [],
        extractedJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      
      // Empty arrays should be preserved as empty arrays, not undefined
      assert.deepStrictEqual(frontendApp.skills, []);
      assert.deepStrictEqual(frontendApp.softSkills, []);
      assert.deepStrictEqual(frontendApp.tags, []);
    });

    it('should preserve ISO date format in toFrontend', () => {
      const testDate = new Date('2024-03-15T14:30:00.000Z');
      const backendApp: BackendApplication = {
        id: 111,
        userId: 'user-111',
        positionUrl: 'https://example.com/job',
        positionTitle: 'Test Job',
        companyName: 'Test Company',
        jobLocation: 'Test Location',
        appliedAt: testDate,
        status: 'APPLIED',
        cvPath: null,
        coverLetterPath: null,
        notes: null,
        description: null,
        techStack: null,
        softSkills: null,
        jobType: null,
        tags: null,
        extractedJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const frontendApp = ApplicationMapper.toFrontend(backendApp);
      assert.strictEqual(frontendApp.dateApplied, '2024-03-15T14:30:00.000Z');
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

      assert.strictEqual(backendData.position_title, 'Test Position');
      assert.strictEqual(backendData.position_url, 'https://example.com/job');
      assert.strictEqual(backendData.status, 'APPLIED');
      // Undefined values should be included as undefined
      assert.strictEqual(backendData.company_name, undefined);
      assert.strictEqual(backendData.job_location, undefined);
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
      assert.strictEqual(backendData.position_title, '');
      assert.strictEqual(backendData.company_name, '');
      assert.strictEqual(backendData.position_url, '');
      assert.strictEqual(backendData.job_location, 'Remote');
    });

    it('should handle all fields being undefined in toBackend', () => {
      const frontendData = {};

      const backendData = ApplicationMapper.toBackend(frontendData);

      // Should return an empty object when no fields are provided
      assert.deepStrictEqual(backendData, {});
    });
  });
});
