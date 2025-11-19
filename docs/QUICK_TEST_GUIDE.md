# Quick Testing Guide

This is a quick reference for running integration tests.

## Prerequisites

- Node.js 18+ installed
- Dependencies installed (`npm install`)
- Environment variables configured in `.env.local`
- Supabase project set up and accessible

## Quick Start

### 1. Check Environment

```bash
npm run test:pre-check
```

This validates:
- ✓ Environment variables are configured
- ✓ Supabase connection is working
- ✓ Development server is running (if applicable)
- ✓ API endpoints are accessible

### 2. Start Development Server

If not already running:

```bash
npm run dev
```

Wait for the server to start (usually takes 5-10 seconds).

### 3. Run Integration Tests

In a separate terminal:

```bash
npm run test:integration
```

## Expected Output

### Successful Test Run

```
=== Starting Integration Test Suite ===

▶ Running: 1. User Signup
✓ Passed: 1. User Signup (234ms)

▶ Running: 2. User Login
✓ Passed: 2. User Login (156ms)

...

=== Test Summary ===

Total Tests: 20
Passed: 20
Failed: 0
Total Duration: 5432ms

=== Integration Test Complete ===
```

### Failed Test Run

```
▶ Running: 4. Create Application
✗ Failed: 4. Create Application - Create application failed: 401 Unauthorized

=== Test Summary ===

Total Tests: 20
Passed: 3
Failed: 1
Total Duration: 1234ms

=== Failed Tests ===

✗ 4. Create Application
  Error: Create application failed: 401 Unauthorized
```

## Troubleshooting

### "Environment is not ready for integration testing"

**Problem**: Missing environment variables or server not running

**Solution**:
1. Check `.env.local` file exists and has all required variables
2. Start the development server: `npm run dev`
3. Run `npm run test:pre-check` again

### "Supabase connection failed"

**Problem**: Invalid Supabase credentials or project not accessible

**Solution**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
3. Check Supabase project is active at https://app.supabase.com

### "Development server is not running"

**Problem**: Server not started or running on different port

**Solution**:
1. Start server: `npm run dev`
2. Verify it's running on port 3000
3. If using different port, update `NEXT_PUBLIC_APP_URL` in `.env.local`

### Tests fail with "401 Unauthorized"

**Problem**: Authentication not working correctly

**Solution**:
1. Check Supabase auth is enabled
2. Verify RLS policies are set up correctly
3. Check service role key is configured (if needed)

### Tests fail with "Network Error"

**Problem**: Cannot connect to API

**Solution**:
1. Verify development server is running
2. Check firewall/antivirus not blocking connections
3. Try accessing http://localhost:3000 in browser

## Test Scope

### What Gets Tested

✓ User authentication (signup, login, logout)  
✓ Application CRUD operations  
✓ Search and filtering  
✓ Profile management  
✓ File upload validation  
✓ AI extraction (if API key configured)  
✓ Export functionality  
✓ API endpoint responses  

### What Doesn't Get Tested

✗ UI rendering and styling  
✗ Browser compatibility  
✗ Responsive design  
✗ Accessibility  
✗ Performance metrics  

For comprehensive testing including UI, see [INTEGRATION_TESTING.md](INTEGRATION_TESTING.md).

## CI/CD Integration

To run tests in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Integration Tests
  run: |
    npm install
    npm run dev &
    sleep 10
    npm run test:integration
```

## Test Data Cleanup

The integration tests create a temporary test user and test data. To clean up:

1. The test user is created with a unique email: `test-[timestamp]@example.com`
2. All test data is deleted at the end of the test run
3. If tests fail mid-run, you may need to manually delete test data from Supabase

## Next Steps

- Review [INTEGRATION_TESTING.md](INTEGRATION_TESTING.md) for manual testing procedures
- Use [TEST_REPORT_TEMPLATE.md](TEST_REPORT_TEMPLATE.md) to document results
- Check [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for environment configuration help
