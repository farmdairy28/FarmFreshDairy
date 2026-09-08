import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates an authoritative Supabase client for server-side administrative operations.
 * Requires SUPABASE_SERVICE_ROLE_KEY for full administrative privileges bypassing RLS.
 * Never silently downgrades to anonymous credentials.
 */
export function createAdminClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.warn('[Supabase Warning]: NEXT_PUBLIC_SUPABASE_URL is missing or contains placeholder.');
    return null;
  }

  // Authoritative Service Role Key (Full Admin Privileges)
  if (serviceRoleKey && !serviceRoleKey.includes('your-supabase-service-role-key')) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  console.warn('[Supabase Warning]: SUPABASE_SERVICE_ROLE_KEY is missing or invalid. Server-side admin operations cannot proceed without service role key.');
  return null;
}
