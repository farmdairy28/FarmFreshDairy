import { User } from '@supabase/supabase-js';

/**
 * Returns a list of normalized, lowercase administrator emails.
 * Supports comma-separated list in ADMIN_EMAILS environment variable,
 * with 'farmfreshdairy28@gmail.com' as the guaranteed baseline admin.
 */
export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || '';
  const defaultAdmin = 'farmfreshdairy28@gmail.com';
  
  const parsed = envEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);

  const combined = Array.from(new Set([defaultAdmin, ...parsed]));
  return combined;
}

/**
 * Checks if a given email is in the admin whitelist.
 * Normalizes email by trimming whitespace and lowercasing.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const whitelist = getAdminEmails();
  return whitelist.includes(normalized);
}

/**
 * Validates whether a Supabase user is an authorized administrator.
 * Checks both the email whitelist and optional database role.
 */
export function isAuthorizedAdminUser(
  user: User | null | undefined,
  profileRole?: string | null
): boolean {
  if (!user) return false;

  const email = user.email?.trim().toLowerCase();
  const emailWhitelisted = isAuthorizedAdminEmail(email);

  if (emailWhitelisted) {
    return true;
  }

  if (profileRole && profileRole.trim().toLowerCase() === 'admin') {
    return true;
  }

  return false;
}
