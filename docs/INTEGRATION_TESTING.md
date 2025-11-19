# Integration Testing Guide

This document provides comprehensive testing procedures for the frontend-backend integration.

## Automated Testing

### Running the Integration Test Suite

The automated integration test suite covers all major API endpoints and user flows.

```bash
# Ensure the development server is running
npm run dev

# In a separate terminal, run the integration tests
npm run test:integration
```

### What the Automated Tests Cover

1. **Authentication Flows**
   - User signup
   - User login
   - Session persistence
   - User logout

2. **Application CRUD Operations**
   - Create application
   - Get all applications
   - Get application by ID
   - Update application
   - Delete application

3. **Search and Filtering**
   - Search applications by text
   - Filter applications by status

4. **Profile Management**
   - Get profile
   - Update profile
   - Add work experience
   - Add education
   - Add skills

5. **Export Functionality**
   - Export applications as CSV
   - Export applications as JSON

6. **File Upload**
   - File size validation
   - File type validation

7. **AI Extraction**
   - Job posting extraction

## Manual Testing Checklist

### Prerequisites

- [ ] Development server is running (`npm run dev`)
- [ ] Database is set up and migrations are applied
- [ ] Environment variables are configured (`.env.local`)
- [ ] Supabase project is accessible

### 1. Authentication Flow Testing

#### Signup Flow
- [ ] Navigate to `/auth`
- [ ] Click "Sign Up" tab
- [ ] Enter valid email and password
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Verify user is logged in (check header)

#### Login Flow
- [ ] Navigate to `/auth`
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Verify user session persists on page refresh

#### Logout Flow
- [ ] Click user menu in header
- [ ] Click "Logout"
- [ ] Verify redirect to landing page
- [ ] Verify cannot access protected routes

#### Session Persistence
- [ ] Login to application
- [ ] Refresh the page
- [ ] Verify still logged in
- [ ] Close browser and reopen
- [ ] Navigate to application
- [ ] Verify session persists (if "Remember me" was checked)

### 2. Application Management Testing

#### Create Application
- [ ] Navigate to `/applications`
- [ ] Click "Add Application" button
- [ ] Fill in all required fields:
  - Position title
  - Company name
  - Location
  - Position URL
  - Status
- [ ] Fill in optional fields:
  - Description
  - Tech stack (add multiple)
  - Soft skills
  - Job type
  - Tags
- [ ] Submit form
- [ ] Verify application appears in list
- [ ] Verify success toast notification

#### View Applications
- [ ] Navigate to `/applications`
- [ ] Verify all applications are displayed
- [ ] Check list view displays correctly
- [ ] Switch to Kanban view (if available)
- [ ] Verify Kanban columns show correct statuses

#### View Application Details
- [ ] Click on an application card
- [ ] Verify redirect to `/applications/[id]`
- [ ] Verify all fields are displayed correctly:
  - Position title
  - Company name
  - Location
  - Status badge
  - Applied date
  - Description
  - Tech stack
  - Soft skills
  - Job type
  - Tags
  - Notes

#### Edit Application
- [ ] On application details page, click "Edit"
- [ ] Modify several fields
- [ ] Save changes
- [ ] Verify changes are reflected immediately
- [ ] Verify success toast notification
- [ ] Refresh page and verify changes persist

#### Delete Application
- [ ] On application details page, click "Delete"
- [ ] Verify confirmation modal appears
- [ ] Confirm deletion
- [ ] Verify redirect to applications list
- [ ] Verify application is removed from list
- [ ] Verify success toast notification

### 3. Search and Filtering Testing

#### Search Functionality
- [ ] Navigate to `/applications`
- [ ] Enter search term in search bar (e.g., "Engineer")
- [ ] Verify results update in real-time
- [ ] Verify only matching applications are shown
- [ ] Clear search
- [ ] Verify all applications are shown again

#### Filter by Status
- [ ] Click status filter dropdown
- [ ] Select "Applied"
- [ ] Verify only applications with "Applied" status are shown
- [ ] Select "Interview"
- [ ] Verify only applications with "Interview" status are shown
- [ ] Select "All" or clear filter
- [ ] Verify all applications are shown

#### Combined Search and Filter
- [ ] Enter search term
- [ ] Select status filter
- [ ] Verify results match both criteria
- [ ] Clear one filter at a time
- [ ] Verify results update correctly

### 4. Dashboard Testing

#### Summary Cards
- [ ] Navigate to `/dashboard`
- [ ] Verify summary cards display correct counts:
  - Total applications
  - Applications by status (Applied, Interview, Offer, Rejected)
- [ ] Create a new application
- [ ] Return to dashboard
- [ ] Verify counts are updated

#### Recent Applications
- [ ] Verify recent applications list shows latest applications
- [ ] Verify applications are sorted by date (newest first)
- [ ] Click on an application
- [ ] Verify navigation to application details

#### Quick Actions
- [ ] Test "Add Application" button
- [ ] Verify modal opens correctly
- [ ] Test other quick action buttons (if available)

### 5. Profile Management Testing

#### View Profile
- [ ] Navigate to `/profile`
- [ ] Verify profile information is displayed
- [ ] Verify tabs are present:
  - Personal Info
  - Work Experience
  - Education
  - Skills

#### Update Personal Info
- [ ] Click "Personal Info" tab
- [ ] Update fields:
  - Full name
  - Phone
  - Location
  - Bio
- [ ] Save changes
- [ ] Verify success notification
- [ ] Refresh page and verify changes persist

#### Add Work Experience
- [ ] Click "Work Experience" tab
- [ ] Click "Add Experience"
- [ ] Fill in fields:
  - Company
  - Position
  - Start date
  - End date (or "Current")
  - Description
- [ ] Save
- [ ] Verify experience appears in list
- [ ] Edit an experience
- [ ] Delete an experience

#### Add Education
- [ ] Click "Education" tab
- [ ] Click "Add Education"
- [ ] Fill in fields:
  - Institution
  - Degree
  - Field of study
  - Start date
  - End date
- [ ] Save
- [ ] Verify education appears in list
- [ ] Edit an education entry
- [ ] Delete an education entry

#### Manage Skills
- [ ] Click "Skills" tab
- [ ] Add new skills (type and press Enter)
- [ ] Verify skills appear as tags
- [ ] Remove a skill
- [ ] Save changes
- [ ] Verify changes persist

### 6. File Upload Testing

#### Upload CV
- [ ] Navigate to `/profile`
- [ ] Click "Upload CV" button
- [ ] Select a PDF file (< 10MB)
- [ ] Verify upload progress indicator
- [ ] Verify success notification
- [ ] Verify file name is displayed

#### Upload Cover Letter
- [ ] On application details page
- [ ] Click "Upload Cover Letter"
- [ ] Select a PDF file
- [ ] Verify upload succeeds
- [ ] Verify file is associated with application

#### File Validation
- [ ] Try uploading a file > 10MB
- [ ] Verify error message about file size
- [ ] Try uploading a non-PDF file
- [ ] Verify error message about file type

### 7. AI Extraction Testing

#### Job Posting Extraction
- [ ] Click "Add Application"
- [ ] Click "Extract from Job Posting"
- [ ] Paste job posting text
- [ ] Click "Extract"
- [ ] Verify loading indicator
- [ ] Verify extracted fields are populated:
  - Position title
  - Company name
  - Location
  - Tech stack
  - Description
- [ ] Edit extracted data if needed
- [ ] Save application

#### CV Extraction
- [ ] Navigate to `/profile`
- [ ] Upload CV file
- [ ] If extraction is enabled, verify:
  - Loading indicator appears
  - Profile fields are populated from CV
  - Work experience is extracted
  - Education is extracted
  - Skills are extracted
- [ ] Review and edit extracted data
- [ ] Save changes

### 8. Export Functionality Testing

#### Export as CSV
- [ ] Navigate to `/applications`
- [ ] Click "Export" button
- [ ] Select "CSV" format
- [ ] Verify download starts
- [ ] Open downloaded CSV file
- [ ] Verify all applications are included
- [ ] Verify all fields are present

#### Export as JSON
- [ ] Click "Export" button
- [ ] Select "JSON" format
- [ ] Verify download starts
- [ ] Open downloaded JSON file
- [ ] Verify valid JSON structure
- [ ] Verify all applications and fields are included

### 9. Responsive Design Testing

#### Mobile View (< 768px)
- [ ] Resize browser to mobile width
- [ ] Verify navigation menu collapses to hamburger
- [ ] Verify all pages are usable on mobile
- [ ] Test forms on mobile
- [ ] Verify modals work correctly
- [ ] Test touch interactions

#### Tablet View (768px - 1024px)
- [ ] Resize browser to tablet width
- [ ] Verify layout adapts appropriately
- [ ] Test all major features
- [ ] Verify sidebar behavior (if applicable)

#### Desktop View (> 1024px)
- [ ] Verify full layout is displayed
- [ ] Test all features
- [ ] Verify optimal use of screen space

### 10. Dark Mode Testing

#### Theme Toggle
- [ ] Click theme toggle in header
- [ ] Verify smooth transition to dark mode
- [ ] Verify all components render correctly in dark mode
- [ ] Check color contrast and readability
- [ ] Toggle back to light mode
- [ ] Verify smooth transition

#### Theme Persistence
- [ ] Set theme to dark mode
- [ ] Refresh page
- [ ] Verify dark mode persists
- [ ] Close and reopen browser
- [ ] Verify theme preference is remembered

### 11. Error Handling Testing

#### Network Errors
- [ ] Disconnect from internet
- [ ] Try to create an application
- [ ] Verify error message is displayed
- [ ] Reconnect to internet
- [ ] Verify retry functionality works

#### Validation Errors
- [ ] Try to submit form with missing required fields
- [ ] Verify validation messages appear
- [ ] Verify form cannot be submitted
- [ ] Fill in required fields
- [ ] Verify form can now be submitted

#### 404 Errors
- [ ] Navigate to non-existent route (e.g., `/applications/999999`)
- [ ] Verify 404 page is displayed
- [ ] Verify navigation back to valid pages works

#### Authentication Errors
- [ ] Try to access protected route while logged out
- [ ] Verify redirect to login page
- [ ] Verify intended destination is preserved
- [ ] Login
- [ ] Verify redirect to intended destination

### 12. Performance Testing

#### Page Load Times
- [ ] Measure time to first contentful paint
- [ ] Verify pages load in < 2 seconds
- [ ] Check for layout shifts
- [ ] Verify smooth animations

#### API Response Times
- [ ] Monitor network tab
- [ ] Verify API calls complete in < 500ms
- [ ] Check for unnecessary API calls
- [ ] Verify proper caching

#### Bundle Size
- [ ] Run `npm run build`
- [ ] Check bundle size in output
- [ ] Verify no excessive bundle sizes
- [ ] Check for code splitting

## Test Results Template

Use this template to document your test results:

```
Date: [Date]
Tester: [Name]
Environment: [Development/Staging/Production]
Browser: [Chrome/Firefox/Safari/Edge]
Device: [Desktop/Mobile/Tablet]

Test Results:
- Authentication: ✓ / ✗
- Application CRUD: ✓ / ✗
- Search & Filter: ✓ / ✗
- Dashboard: ✓ / ✗
- Profile Management: ✓ / ✗
- File Upload: ✓ / ✗
- AI Extraction: ✓ / ✗
- Export: ✓ / ✗
- Responsive Design: ✓ / ✗
- Dark Mode: ✓ / ✗
- Error Handling: ✓ / ✗
- Performance: ✓ / ✗

Issues Found:
1. [Description of issue]
2. [Description of issue]

Notes:
[Any additional observations]
```

## Common Issues and Solutions

### Issue: Tests fail with "Network Error"
**Solution**: Ensure the development server is running on the correct port (default: 3000)

### Issue: Authentication tests fail
**Solution**: Check that Supabase credentials are correctly configured in `.env.local`

### Issue: File upload tests fail
**Solution**: Verify file upload directory exists and has correct permissions

### Issue: AI extraction tests fail
**Solution**: Ensure `GOOGLE_GEMINI_API` key is configured in `.env.local`

### Issue: Database errors
**Solution**: Run database migrations: `npm run db:push`

## Continuous Integration

For CI/CD pipelines, add the integration test script to your workflow:

```yaml
- name: Run Integration Tests
  run: |
    npm run dev &
    sleep 10
    npm run test:integration
```

## Reporting Issues

When reporting issues found during testing:

1. Include test environment details
2. Provide steps to reproduce
3. Include screenshots or videos if applicable
4. Note expected vs actual behavior
5. Include browser console errors
6. Include network tab information for API issues
