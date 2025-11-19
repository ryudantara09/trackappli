/**
 * Client-side authentication utilities using Supabase
 * This module provides browser-side auth functions for login, signup, logout, etc.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../core/database/types';

/**
 * Create a Supabase client for browser/client-side use
 * This client handles authentication in Client Components
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton instance for the browser client
let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the Supabase browser client instance
 */
export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

/**
 * Sign in with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Authentication data including user and session
 * @throws Error if sign in fails
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

/**
 * Sign up a new user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Authentication data including user and session
 * @throws Error if sign up fails
 */
export async function signUp(email: string, password: string) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

/**
 * Sign out the current user
 * Clears the session and removes auth cookies
 * @throws Error if sign out fails
 */
export async function signOut() {
  const supabase = getSupabase();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current session
 * @returns Current session or null if not authenticated
 */
export async function getSession() {
  const supabase = getSupabase();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

/**
 * Get the current authenticated user
 * @returns Current user or null if not authenticated
 */
export async function getUser() {
  const supabase = getSupabase();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

/**
 * Reset password for a user
 * Sends a password reset email
 * @param email - User's email address
 * @throws Error if password reset fails
 */
export async function resetPassword(email: string) {
  const supabase = getSupabase();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update user password
 * @param newPassword - New password
 * @throws Error if password update fails
 */
export async function updatePassword(newPassword: string) {
  const supabase = getSupabase();
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    throw new Error(error.message);
  }
}
