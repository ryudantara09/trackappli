# Database Migrations

This directory contains SQL migration files for the Supabase database schema.

## Prerequisites

1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Ensure you have your Supabase project credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Applying Migrations

### Option 1: Using Supabase Dashboard (Recommended for first-time setup)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `001_initial_schema.sql`
4. Paste and run the SQL in the editor

### Option 2: Using Supabase CLI

1. Link your local project to your Supabase project:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

2. Push migrations to your Supabase project:
   ```bash
   npx supabase db push
   ```

### Option 3: Using Direct Database Connection

If you have direct database access:
```bash
psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql
```

## Generating TypeScript Types

After applying migrations, generate TypeScript types:

1. Set your Supabase project ID in `.env.local`:
   ```
   SUPABASE_PROJECT_ID=your-project-id
   ```

2. Run the type generation script:
   ```bash
   npm run supabase:gen-types
   ```

   Or manually:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/core/database/types.ts
   ```

## Migration Files

- `001_initial_schema.sql` - Initial database schema with:
  - Applications table with RLS policies
  - Work Experience table with RLS policies
  - Education table with RLS policies
  - Technical Skills table with RLS policies
  - Indexes for performance optimization
  - Triggers for automatic `updated_at` timestamps

## Verifying Migrations

After applying migrations, verify the schema:

1. Check tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. Check RLS policies:
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. Check indexes:
   ```sql
   SELECT tablename, indexname 
   FROM pg_indexes 
   WHERE schemaname = 'public';
   ```

## Troubleshooting

### Error: "relation already exists"
If you see this error, the table already exists. You can either:
- Drop the existing tables and re-run the migration
- Skip this migration if the schema is already correct

### Error: "permission denied"
Ensure you're using the service role key or have proper database permissions.

### Type generation fails
- Verify your project ID is correct
- Ensure you have network access to Supabase
- Check that migrations have been applied successfully
