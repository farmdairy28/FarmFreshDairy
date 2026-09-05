import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates an authoritative Supabase client for server-side database operations.
 * Prioritizes SUPABASE_SERVICE_ROLE_KEY for full administrative bypass of RLS,
 * and falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY if service role key is not yet set in environment.
 */
export function createAdminClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.warn('[Supabase Warning]: NEXT_PUBLIC_SUPABASE_URL is missing or contains placeholder.');
    return null;
  }

  // 1. Prioritize Service Role Key (Full Admin Privileges)
  if (serviceRoleKey && !serviceRoleKey.includes('your-supabase-service-role-key')) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // 2. Fallback to Anon Key for Server-Side Operations
  if (anonKey && !anonKey.includes('your-supabase-anon-key')) {
    return createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  console.warn('[Supabase Warning]: Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is configured.');
  return null;
}
