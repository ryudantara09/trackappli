# Database Setup Guide

This guide will help you set up the Supabase database for the Job Application Tracker.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js 18+ installed
3. Project dependencies installed (`npm install`)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - Name: `job-tracker` (or your preferred name)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region to your users
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project API keys**:
     - `anon` `public` key
     - `service_role` `secret` key (keep this secure!)
3. Get your **Project ID** from **Settings** → **General**

## Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Fill in the values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# For type generation
SUPABASE_PROJECT_ID=your-project-id-here

# Database URL (optional, for direct access)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Step 4: Apply Database Migrations

You have three options to apply the migrations:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`
7. Verify success (you should see "Success. No rows returned")

### Option B: Using Supabase CLI

1. Link your local project to Supabase:
   ```bash
   npm run supabase:link
   ```
   - Enter your project reference when prompted
   - Enter your database password

2. Push migrations:
   ```bash
   npm run db:push
   ```

### Option C: Using Direct Database Connection

If you have `psql` installed:
```bash
psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql
```

## Step 5: Verify Database Schema

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - `applications`
   - `work_experience`
   - `education`
   - `technical_skills`

3. Click on any table to verify the columns match the schema

## Step 6: Generate TypeScript Types

Generate type-safe TypeScript definitions from your database schema:

```bash
npm run supabase:gen-types
```

This will update `src/core/database/types.ts` with the latest schema types.

## Step 7: Configure Authentication (Optional)

If you want to enable OAuth providers:

### Google OAuth

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Google**
3. Follow the instructions to create OAuth credentials in Google Cloud Console
4. Add the credentials to Supabase

### LinkedIn OAuth

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **LinkedIn**
3. Follow the instructions to create an app in LinkedIn Developer Portal
4. Add the credentials to Supabase

## Step 8: Test Database Connection

Create a simple test to verify everything works:

```typescript
// test-db.ts
import { getSupabaseClient } from './src/core/database';

async function testConnection() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('applications').select('count');
  
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Database connection successful!');
  }
}

testConnection();
```

Run with:
```bash
npx tsx test-db.ts
```

## Troubleshooting

### "Missing Supabase environment variables"
- Double-check that all environment variables are set in `.env.local`
- Restart your development server after changing environment variables

### "relation already exists"
- The tables already exist in your database
- You can skip the migration or reset the database with `npm run db:reset`

### "permission denied for schema public"
- Ensure you're using the correct credentials
- Check that your database password is correct

### Type generation fails
- Verify `SUPABASE_PROJECT_ID` is set correctly
- Ensure you have network access to Supabase
- Try running the command manually with your project ID

### RLS policies not working
- Ensure you're using the correct Supabase client (server vs browser)
- Check that `auth.uid()` matches the `user_id` in your queries
- Verify users are authenticated before making requests

## Next Steps

After completing the database setup:

1. Configure Google Gemini API for AI extraction (see main README)
2. Start the development server: `npm run dev`
3. Begin implementing API routes (see `tasks.md`)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript Support](https://supabase.com/docs/reference/javascript/typescript-support)
