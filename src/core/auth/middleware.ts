import { User, SupabaseClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from './supabase';
import { AuthenticationError, logError } from '../../utils/errors';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { Database } from '../database/types';

/**
 * Authentication result containing user information and supabase client
 */
export interface AuthResult {
  user: User;
  userId: string;
  supabase: SupabaseClient<Database>;
}

/**
 * Require authentication for API routes
 * Throws AuthenticationError if user is not authenticated
 * Supports both cookie-based auth (browser) and Bearer token auth (API testing)
 * 
 * @returns Authenticated user information
 * @throws AuthenticationError if session is invalid or expired
 * 
 * @example
 * ```typescript
 * export async function GET() {
 *   const { user } = await requireAuth();
 *   // ... use user.id for queries
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    // Support Bearer token auth for API access
    // Check for Bearer token first (for API clients, mobile apps, etc.)
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (authorization?.startsWith('Bearer ')) {
      // Only allow Bearer token auth in development OR if explicitly enabled
      const allowBearerToken = process.env.NODE_ENV === 'development' || 
                               process.env.ALLOW_BEARER_TOKEN_AUTH === 'true';
      
      if (allowBearerToken) {
        const token = authorization.substring(7);
        
        // Create a client with the bearer token
        const supabase = createClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          throw new AuthenticationError('Invalid or expired token');
        }
        
        return {
          user,
          userId: user.id,
          supabase,
        };
      }
    }
    
    // Fall back to cookie-based auth (for browser requests)
    const supabase = await createRouteHandlerClient();
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logError('requireAuth', sessionError, { context: 'getSession' });
      throw new AuthenticationError('Failed to verify session');
    }
    
    if (!session) {
      throw new AuthenticationError('No active session found');
    }
    
    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      logError('requireAuth', userError, { context: 'getUser' });
      throw new AuthenticationError('Failed to retrieve user information');
    }
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    return {
      user,
      userId: user.id,
      supabase,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    logError('requireAuth', error, { context: 'unexpected' });
    throw new AuthenticationError('Authentication failed');
  }
}

/**
 * Optional authentication for API routes
 * Returns user information if authenticated, null otherwise
 * Does not throw errors for unauthenticated requests
 * 
 * @returns Authenticated user information or null
 * 
 * @example
 * ```typescript
 * export async function GET() {
 *   const auth = await optionalAuth();
 *   if (auth) {
 *     // User is authenticated
 *     const { user } = auth;
 *   } else {
 *     // User is not authenticated, return public data
 *   }
 * }
 * ```
 */
export async function optionalAuth(): Promise<AuthResult | null> {
  try {
    const supabase = await createRouteHandlerClient();
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return null;
    }
    
    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }
    
    return {
      user,
      userId: user.id,
      supabase,
    };
  } catch (error) {
    logError('optionalAuth', error, { context: 'unexpected' });
    return null;
  }
}

/**
 * Verify that a resource belongs to the authenticated user
 * Useful for authorization checks before update/delete operations
 * 
 * @param resourceUserId - The user ID associated with the resource
 * @param authenticatedUserId - The authenticated user's ID
 * @throws AuthenticationError if user IDs don't match
 * 
 * @example
 * ```typescript
 * const { userId } = await requireAuth();
 * const application = await getApplication(id);
 * verifyResourceOwnership(application.user_id, userId);
 * ```
 */
export function verifyResourceOwnership(
  resourceUserId: string,
  authenticatedUserId: string
): void {
  if (resourceUserId !== authenticatedUserId) {
    throw new AuthenticationError('You do not have permission to access this resource');
  }
}
