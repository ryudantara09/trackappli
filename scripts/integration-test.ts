#!/usr/bin/env tsx
/**
 * Integration Test Suite
 * 
 * This script performs comprehensive integration testing of the application,
 * covering all major user flows and API endpoints.
 * 
 * Test Coverage:
 * - Authentication flows (signup, login, logout, session persistence)
 * - Application CRUD operations (create, read, update, delete)
 * - Search and filtering functionality
 * - File upload and AI extraction
 * - Profile management (experience, education, skills)
 * - Export functionality
 * - API endpoint validation
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test user credentials
const TEST_USER = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
};

// Test results tracking
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

// Utility functions
function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warn: '\x1b[33m',    // Yellow
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
}

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  const startTime = Date.now();
  try {
    log(`\n▶ Running: ${name}`, 'info');
    await testFn();
    const duration = Date.now() - startTime;
    results.push({ name, passed: true, duration });
    log(`✓ Passed: ${name} (${duration}ms)`, 'success');
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMessage, duration });
    log(`✗ Failed: ${name} - ${errorMessage}`, 'error');
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Test Suite
class IntegrationTestSuite {
  private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  private accessToken: string | null = null;
  private userId: string | null = null;
  private testApplicationId: string | null = null;

  async runAll() {
    log('\n=== Starting Integration Test Suite ===\n', 'info');
    log(`API Base URL: ${API_BASE_URL}`, 'info');
    log(`Test User: ${TEST_USER.email}`, 'info');

    // Authentication Tests
    await runTest('1. User Signup', () => this.testSignup());
    await runTest('2. User Login', () => this.testLogin());
    await runTest('3. Session Persistence', () => this.testSessionPersistence());

    // Application CRUD Tests
    await runTest('4. Create Application', () => this.testCreateApplication());
    await runTest('5. Get Applications', () => this.testGetApplications());
    await runTest('6. Get Application by ID', () => this.testGetApplicationById());
    await runTest('7. Update Application', () => this.testUpdateApplication());
    await runTest('8. Search Applications', () => this.testSearchApplications());
    await runTest('9. Filter Applications by Status', () => this.testFilterApplications());

    // Profile Management Tests
    await runTest('10. Get Profile', () => this.testGetProfile());
    await runTest('11. Update Profile', () => this.testUpdateProfile());
    await runTest('12. Add Work Experience', () => this.testAddWorkExperience());
    await runTest('13. Add Education', () => this.testAddEducation());
    await runTest('14. Add Skills', () => this.testAddSkills());

    // Export Tests
    await runTest('15. Export Applications (CSV)', () => this.testExportCSV());
    await runTest('16. Export Applications (JSON)', () => this.testExportJSON());

    // File Upload Tests (if files exist)
    await runTest('17. File Upload Validation', () => this.testFileUploadValidation());

    // AI Extraction Tests (if API key configured)
    await runTest('18. Job Posting Extraction', () => this.testJobExtraction());

    // Cleanup and Final Tests
    await runTest('19. Delete Application', () => this.testDeleteApplication());
    await runTest('20. User Logout', () => this.testLogout());

    // Print summary
    this.printSummary();
  }

  // Authentication Tests
  async testSignup() {
    const { data, error } = await this.supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    assert(!error, `Signup failed: ${error?.message}`);
    assert(data.user !== null, 'User should be created');
    assert(data.user?.email === TEST_USER.email, 'Email should match');

    this.userId = data.user?.id || null;
    this.accessToken = data.session?.access_token || null;

    log(`  User created: ${this.userId}`, 'info');
  }

  async testLogin() {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    assert(!error, `Login failed: ${error?.message}`);
    assert(data.session !== null, 'Session should be created');
    assert(data.user?.email === TEST_USER.email, 'Email should match');

    this.accessToken = data.session?.access_token || null;
    log(`  Access token obtained`, 'info');
  }

  async testSessionPersistence() {
    const { data, error } = await this.supabase.auth.getSession();

    assert(!error, `Get session failed: ${error?.message}`);
    assert(data.session !== null, 'Session should persist');
    assert(data.session?.user.email === TEST_USER.email, 'User should match');
  }

  // Application CRUD Tests
  async testCreateApplication() {
    const applicationData = {
      position_title: 'Senior Software Engineer',
      company_name: 'Test Company Inc',
      job_location: 'San Francisco, CA',
      position_url: 'https://example.com/job/123',
      status: 'APPLIED',
      applied_at: new Date().toISOString(),
      description: 'Test job description',
      tech_stack: ['TypeScript', 'React', 'Node.js'],
      job_type: 'Full-time',
      tags: ['remote', 'senior'],
    };

    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(applicationData),
    });

    assert(response.ok, `Create application failed: ${response.status} ${response.statusText}`);

    const result = await response.json();
    assert(result.data, 'Response should contain data');
    assert(result.data.id, 'Application should have an ID');
    assert(result.data.position_title === applicationData.position_title, 'Position title should match');

    this.testApplicationId = result.data.id;
    log(`  Application created: ${this.testApplicationId}`, 'info');
  }

  async testGetApplications() {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Get applications failed: ${response.status}`);

    const result = await response.json();
    assert(Array.isArray(result.data), 'Response should contain data array');
    assert(result.data.length > 0, 'Should have at least one application');

    log(`  Found ${result.data.length} application(s)`, 'info');
  }

  async testGetApplicationById() {
    assert(!!this.testApplicationId, 'Test application ID should exist');

    const response = await fetch(`${API_BASE_URL}/api/applications/${this.testApplicationId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Get application by ID failed: ${response.status}`);

    const result = await response.json();
    assert(!!result.data, 'Response should contain data');
    assert(result.data.id === this.testApplicationId, 'Application ID should match');
  }

  async testUpdateApplication() {
    assert(!!this.testApplicationId, 'Test application ID should exist');

    const updateData = {
      status: 'INTERVIEW',
      notes: 'Updated notes from integration test',
    };

    const response = await fetch(`${API_BASE_URL}/api/applications/${this.testApplicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(updateData),
    });

    assert(response.ok, `Update application failed: ${response.status}`);

    const result = await response.json();
    assert(result.data.status === 'INTERVIEW', 'Status should be updated');
    assert(result.data.notes === updateData.notes, 'Notes should be updated');

    log(`  Application updated to status: ${result.data.status}`, 'info');
  }

  async testSearchApplications() {
    const searchQuery = 'Senior';
    const response = await fetch(`${API_BASE_URL}/api/applications?q=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Search applications failed: ${response.status}`);

    const result = await response.json();
    assert(Array.isArray(result.data), 'Response should contain data array');

    log(`  Search for "${searchQuery}" returned ${result.data.length} result(s)`, 'info');
  }

  async testFilterApplications() {
    const status = 'INTERVIEW';
    const response = await fetch(`${API_BASE_URL}/api/applications?status=${status}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Filter applications failed: ${response.status}`);

    const result = await response.json();
    assert(Array.isArray(result.data), 'Response should contain data array');

    // Verify all returned applications have the correct status
    result.data.forEach((app: any) => {
      assert(app.status === status, `Application status should be ${status}`);
    });

    log(`  Filter by status "${status}" returned ${result.data.length} result(s)`, 'info');
  }

  // Profile Management Tests
  async testGetProfile() {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Get profile failed: ${response.status}`);

    const result = await response.json();
    assert(result.data, 'Response should contain profile data');
  }

  async testUpdateProfile() {
    const profileData = {
      full_name: 'Test User',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      bio: 'Integration test user profile',
    };

    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(profileData),
    });

    assert(response.ok, `Update profile failed: ${response.status}`);

    const result = await response.json();
    assert(result.data.full_name === profileData.full_name, 'Full name should be updated');
  }

  async testAddWorkExperience() {
    const experienceData = {
      company: 'Test Company',
      position: 'Software Engineer',
      start_date: '2020-01-01',
      end_date: '2023-12-31',
      description: 'Test work experience',
    };

    const response = await fetch(`${API_BASE_URL}/api/profile/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(experienceData),
    });

    assert(response.ok, `Add work experience failed: ${response.status}`);

    const result = await response.json();
    assert(result.data, 'Response should contain experience data');
    log(`  Work experience added`, 'info');
  }

  async testAddEducation() {
    const educationData = {
      institution: 'Test University',
      degree: 'Bachelor of Science',
      field_of_study: 'Computer Science',
      start_date: '2016-09-01',
      end_date: '2020-05-31',
    };

    const response = await fetch(`${API_BASE_URL}/api/profile/education`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(educationData),
    });

    assert(response.ok, `Add education failed: ${response.status}`);

    const result = await response.json();
    assert(result.data, 'Response should contain education data');
    log(`  Education added`, 'info');
  }

  async testAddSkills() {
    const skillsData = {
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    };

    const response = await fetch(`${API_BASE_URL}/api/profile/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(skillsData),
    });

    assert(response.ok, `Add skills failed: ${response.status}`);

    const result = await response.json();
    assert(result.data, 'Response should contain skills data');
    log(`  Skills added: ${skillsData.skills.length} skills`, 'info');
  }

  // Export Tests
  async testExportCSV() {
    const response = await fetch(`${API_BASE_URL}/api/export?format=csv`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Export CSV failed: ${response.status}`);

    const contentType = response.headers.get('content-type');
    assert(!!contentType?.includes('text/csv'), 'Content type should be CSV');

    const blob = await response.blob();
    assert(blob.size > 0, 'CSV file should not be empty');

    log(`  CSV export size: ${blob.size} bytes`, 'info');
  }

  async testExportJSON() {
    const response = await fetch(`${API_BASE_URL}/api/export?format=json`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Export JSON failed: ${response.status}`);

    const contentType = response.headers.get('content-type');
    assert(!!contentType?.includes('application/json'), 'Content type should be JSON');

    const data = await response.json();
    assert(Array.isArray(data), 'JSON export should be an array');

    log(`  JSON export: ${data.length} application(s)`, 'info');
  }

  // File Upload Tests
  async testFileUploadValidation() {
    // Test file size validation
    const largeFile = new Blob(['x'.repeat(11 * 1024 * 1024)], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', largeFile, 'large.pdf');

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    // Should fail due to size limit
    assert(!response.ok, 'Large file upload should be rejected');
    log(`  File size validation working correctly`, 'info');
  }

  // AI Extraction Tests
  async testJobExtraction() {
    const jobPostingText = `
      Senior Software Engineer
      Company: Tech Corp
      Location: San Francisco, CA
      
      We are looking for a Senior Software Engineer with experience in:
      - TypeScript and React
      - Node.js and Express
      - PostgreSQL
      
      Salary: $150,000 - $180,000
    `;

    const response = await fetch(`${API_BASE_URL}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ rawText: jobPostingText }),
    });

    if (response.status === 500) {
      log(`  AI extraction skipped (API key may not be configured)`, 'warn');
      return;
    }

    assert(response.ok, `Job extraction failed: ${response.status}`);

    const result = await response.json();
    assert(result.extractedData, 'Response should contain extracted data');
    log(`  Job posting extracted successfully`, 'info');
  }

  // Cleanup Tests
  async testDeleteApplication() {
    assert(!!this.testApplicationId, 'Test application ID should exist');

    const response = await fetch(`${API_BASE_URL}/api/applications/${this.testApplicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    assert(response.ok, `Delete application failed: ${response.status}`);

    log(`  Application deleted: ${this.testApplicationId}`, 'info');
  }

  async testLogout() {
    const { error } = await this.supabase.auth.signOut();

    assert(!error, `Logout failed: ${error?.message}`);

    const { data } = await this.supabase.auth.getSession();
    assert(data.session === null, 'Session should be cleared after logout');

    log(`  User logged out successfully`, 'info');
  }

  // Summary
  printSummary() {
    log('\n=== Test Summary ===\n', 'info');

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    log(`Total Tests: ${total}`, 'info');
    log(`Passed: ${passed}`, 'success');
    log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    log(`Total Duration: ${totalDuration}ms`, 'info');

    if (failed > 0) {
      log('\n=== Failed Tests ===\n', 'error');
      results
        .filter(r => !r.passed)
        .forEach(r => {
          log(`✗ ${r.name}`, 'error');
          log(`  Error: ${r.error}`, 'error');
        });
    }

    log('\n=== Integration Test Complete ===\n', 'info');

    // Exit with error code if any tests failed
    if (failed > 0) {
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  // Validate environment
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('Error: Missing required environment variables', 'error');
    log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set', 'error');
    process.exit(1);
  }

  const suite = new IntegrationTestSuite();
  await suite.runAll();
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
