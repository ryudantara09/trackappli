# Middleware Testing Guide

This document explains how to manually test the route protection middleware.

## Overview

The middleware (`middleware.ts`) protects routes and handles authentication redirects:

1. **Protected Routes**: Requires authentication
   - `/dashboard`
   - `/applications`
   - `/profile`
   - `/settings`
   - `/analytics`

2. **Auth Page**: Redirects authenticated users away
   - `/auth`

3. **Public Routes**: Accessible to everyone
   - `/` (landing page)
   - `/about`
   - `/help`
   - `/privacy`
   - `/terms`

## Manual Testing Scenarios

### Scenario 1: Unauthenticated User Accessing Protected Route

**Steps:**
1. Ensure you're logged out (clear cookies or use incognito)
2. Navigate to `/dashboard` or any protected route
3. **Expected Result**: Redirected to `/auth?redirect=/dashboard`
4. After login, should redirect back to `/dashboard`

### Scenario 2: Authenticated User Accessing Auth Page

**Steps:**
1. Log in to the application
2. Navigate to `/auth`
3. **Expected Result**: Redirected to `/dashboard`

### Scenario 3: Authenticated User Accessing Auth Page with Redirect

**Steps:**
1. Log in to the application
2. Navigate to `/auth?redirect=/applications`
3. **Expected Result**: Redirected to `/applications`

### Scenario 4: Unauthenticated User Accessing Public Route

**Steps:**
1. Ensure you're logged out
2. Navigate to `/` or `/about` or `/help`
3. **Expected Result**: Page loads normally, no redirect

### Scenario 5: Authenticated User Accessing Public Route

**Steps:**
1. Log in to the application
2. Navigate to `/` or `/about` or `/help`
3. **Expected Result**: Page loads normally, no redirect

### Scenario 6: Preserve Intended Destination

**Steps:**
1. Ensure you're logged out
2. Navigate to `/applications/123` (specific application)
3. **Expected Result**: Redirected to `/auth?redirect=/applications/123`
4. Log in
5. **Expected Result**: Redirected to `/applications/123`

## Testing with Browser DevTools

1. Open Browser DevTools (F12)
2. Go to Application/Storage tab
3. Check cookies to verify Supabase auth cookies are set/cleared
4. Monitor Network tab to see redirect responses (302/307)

## Automated Testing (Future)

To add automated tests for middleware:

1. Use `@supabase/ssr` test utilities
2. Mock Next.js request/response objects
3. Test each scenario programmatically
4. Add to CI/CD pipeline

Example test structure:
```typescript
import { describe, it, expect } from 'node:test';
import { middleware } from './middleware';

describe('Middleware', () => {
  it('should redirect unauthenticated users from protected routes', async () => {
    // Mock request to /dashboard without auth
    // Assert redirect to /auth?redirect=/dashboard
  });
  
  it('should redirect authenticated users away from /auth', async () => {
    // Mock request to /auth with valid session
    // Assert redirect to /dashboard
  });
});
```

## Troubleshooting

### Issue: Infinite redirect loop
- Check that middleware matcher doesn't include `/api` routes
- Verify Supabase cookies are being set correctly

### Issue: Not redirecting when expected
- Check environment variables are set correctly
- Verify Supabase client is initialized properly
- Check browser console for errors

### Issue: Redirect parameter not preserved
- Verify URL encoding is correct
- Check that auth page reads `searchParams.get('redirect')`
