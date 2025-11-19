import type { User } from '@supabase/supabase-js';
import { AuthorizationError } from './errors';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const adminEmailSet = new Set(ADMIN_EMAILS);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmailSet.has(email.toLowerCase());
}

export function assertAdminUser(user?: User | null) {
  if (!user || !isAdminEmail(user.email)) {
    throw new AuthorizationError('Admin access required');
  }
}

