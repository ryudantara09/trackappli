# Environment Configuration Guide

This guide provides detailed instructions for configuring environment variables for the Job Application Tracker.

## Quick Start

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Fill in the required values (see sections below)

3. Verify your configuration:
```bash
npm run verify-env
```

## Required Environment Variables

### Supabase Configuration

#### NEXT_PUBLIC_SUPABASE_URL

**Description**: Your Supabase project URL

**Where to get it**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **API**
4. Copy the **Project URL**

**Format**: `https://[your-project-ref].supabase.co`

**Example**: `https://abcdefghijklmnop.supabase.co`

---

#### NEXT_PUBLIC_SUPABASE_ANON_KEY

**Description**: Public anonymous key for client-side Supabase access

**Where to get it**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **API**
4. Copy the **anon public** key

**Security**: This key is safe to expose to the frontend as it respects Row Level Security (RLS) policies.

**Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

#### SUPABASE_SERVICE_ROLE_KEY

**Description**: Service role key for server-side admin operations

**Where to get it**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **API**
4. Copy the **service_role** key (you may need to reveal it)

**⚠️ CRITICAL SECURITY WARNING**:
- This key has **full database access** and **bypasses all RLS policies**
- **NEVER** expose this key to the frontend
- **NEVER** commit this key to version control
- Only use in server-side code (API routes, server components)
- Store securely in environment variables

**Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### AI Configuration

#### GOOGLE_GEMINI_API

**Description**: Google Gemini API key for AI-powered job posting and CV extraction

**Where to get it**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated key

**Features enabled**:
- Job posting data extraction
- CV/Resume parsing
- Automatic field population

**Example**: `AIzaSyA1234567890abcdefghijklmnopqrstuvwxyz`

---

## Optional Environment Variables

### Database

#### DATABASE_URL

**Description**: Direct PostgreSQL connection string

**When needed**:
- Running database migrations manually
- Direct database access for scripts
- Database administration tasks

**Where to get it**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Project Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

**Format**: `postgresql://postgres:[password]@[host]:5432/postgres`

**Example**: `postgresql://postgres:mypassword@db.abcdefghijklmnop.supabase.co:5432/postgres`

---

### OAuth Providers

#### GOOGLE_ID and GOOGLE_SECRET

**Description**: Google OAuth credentials for "Sign in with Google"

**Where to get it**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Select **Web application** as application type
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
8. Copy the **Client ID** and **Client Secret**

**Configuration**:
```bash
GOOGLE_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

---

### Application Settings

#### NODE_ENV

**Description**: Application environment mode

**Values**:
- `development` - Development mode with hot reload and debug info
- `production` - Production mode with optimizations
- `test` - Testing mode

**Default**: `development`

---

#### LOG_LEVEL

**Description**: Logging verbosity level

**Values**:
- `error` - Only log errors
- `warn` - Log warnings and errors
- `info` - Log info, warnings, and errors (recommended)
- `debug` - Log everything including debug info

**Default**: `info`

---

#### NEXT_PUBLIC_APP_URL

**Description**: Public URL of your application

**When needed**:
- OAuth redirect URIs
- Email verification links
- Absolute URLs in emails

**Examples**:
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

**Default**: `http://localhost:3000`

---

## Environment-Specific Configurations

### Development Environment

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GEMINI_API=your-gemini-key
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Environment (Vercel)

Configure these in **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GEMINI_API=your-gemini-key
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Testing Environment

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-role-key
GOOGLE_GEMINI_API=test-gemini-key
NODE_ENV=test
LOG_LEVEL=error
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Verification

### Automated Verification

Run the verification script to check your configuration:

```bash
npm run verify-env
```

This will:
- ✅ Check all required variables are set
- ⚠️ Warn about missing optional variables
- 📋 Display current configuration (with sensitive values masked)
- ❌ Exit with error if required variables are missing

### Manual Verification

1. **Test Supabase Connection**:
```bash
npm run dev
```
Visit `http://localhost:3000` - if the app loads without database errors, Supabase is configured correctly.

2. **Test AI Extraction**:
- Try creating a new application with job posting URL
- The AI should extract job details automatically
- If it fails, check your `GOOGLE_GEMINI_API` key

3. **Test Authentication**:
- Try signing up/logging in
- If authentication fails, check Supabase credentials

---

## Troubleshooting

### "Missing required environment variable" Error

**Problem**: Application crashes with missing environment variable error

**Solution**:
1. Ensure `.env.local` file exists in project root
2. Run `npm run verify-env` to identify missing variables
3. Add the missing variables to `.env.local`
4. Restart the development server

---

### "Invalid API Key" Error (Gemini)

**Problem**: AI extraction fails with invalid API key error

**Solution**:
1. Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Ensure the key is correctly copied (no extra spaces)
3. Check if the API key has proper permissions
4. Try generating a new API key if the issue persists

---

### "Authentication Failed" Error (Supabase)

**Problem**: Cannot sign in or sign up

**Solution**:
1. Verify Supabase URL and keys in `.env.local`
2. Check if your Supabase project is active
3. Ensure RLS policies are properly configured
4. Check Supabase Dashboard for any service issues

---

### "Service Role Key Required" Error

**Problem**: Admin operations fail

**Solution**:
1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
2. Get the key from Supabase Dashboard → Project Settings → API
3. Ensure the key is the **service_role** key, not the anon key
4. Restart the development server

---

## Security Best Practices

1. **Never commit `.env.local` to version control**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Rotate keys regularly**
   - Especially if accidentally exposed
   - Update in both Supabase and your `.env.local`

3. **Use different keys for different environments**
   - Separate Supabase projects for dev/staging/prod
   - Different API keys for each environment

4. **Restrict API key permissions**
   - Limit Gemini API key to only required operations
   - Set up billing alerts to prevent unexpected charges

5. **Use environment-specific configurations**
   - Development: More verbose logging
   - Production: Minimal logging, optimizations enabled

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
