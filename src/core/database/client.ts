import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * Database client utilities for Supabase
 * 
 * IMPORTANT: For API routes and server components, use the clients from
 * src/core/auth/supabase.ts instead, as they handle cookie-based session
 * management properly for Next.js 15 App Router.
 * 
 * These utilities are provided for:
 * - Admin operations that need to bypass RLS
 * - Background jobs and scripts
 * - Testing and development
 */

/**
 * Create a Supabase admin client with service role key
 * This client bypasses Row Level Security (RLS) - use with caution!
 * 
 * Use cases:
 * - Admin operations that need full database access
 * - Background jobs and cron tasks
 * - Data migrations and seeding
 * 
 * WARNING: This client has unrestricted database access.
 * Never expose this client to the frontend or use in user-facing API routes.
 * 
 * @throws Error if SUPABASE_SERVICE_ROLE_KEY is not set
 * @returns Supabase client with admin privileges
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create a basic Supabase client with anon key
 * This client respects Row Level Security (RLS)
 * 
 * Use cases:
 * - Testing and development scripts
 * - Public data access without authentication
 * 
 * For API routes, use createRouteHandlerClient() from src/core/auth/supabase.ts
 * For server components, use createServerClient() from src/core/auth/supabase.ts
 * 
 * @throws Error if environment variables are not set
 * @returns Supabase client with anon key
 */
export function createAnonClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Type exports for convenience
 */
export type { Database } from './types';
export type { Tables, TablesInsert, TablesUpdate } from './types';
