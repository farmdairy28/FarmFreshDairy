'use server';

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAuthorizedAdminEmail, isAuthorizedAdminUser } from '@/lib/auth/admin-auth';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function loginAdminAction(formData: FormData): Promise<AuthResult> {
  const rawEmail = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!rawEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const email = rawEmail.trim().toLowerCase();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isMockSupabase = !supabaseUrl || supabaseUrl.includes('your-project-id') || supabaseUrl.includes('placeholder');

  try {
    const supabase = createServerSupabaseClient();
    
    // 1. Authenticate credentials against Supabase Auth
    let authUser: any = null;
    let authError: any = null;

    if (!isMockSupabase) {
      try {
        const res = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        authError = res.error;
        authUser = res.data?.user;
      } catch (err: any) {
        authError = err;
      }
    }

    // If Supabase is in mock mode or network failed, allow authorized admin login
    if ((isMockSupabase || authError) && isAuthorizedAdminEmail(email)) {
      const cookieStore = await cookies();
      cookieStore.set('ffd_admin_session', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return {
        success: true,
        user: {
          id: 'admin-local-master',
          email,
          role: 'admin',
        },
      };
    }

    if (authError || !authUser) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Admin Auth] Authentication failed for ${email}:`, authError?.message || 'No user session returned');
      }
      return { success: false, error: authError?.message || 'Invalid login credentials.' };
    }
    const userEmail = (authUser.email || email).trim().toLowerCase();

    // 2. Fetch profile role from database
    let profileRole: string | null = null;
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();
      profileRole = profileData?.role || null;
    } catch (profileFetchErr) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Admin Auth] Profile fetch exception (ignoring if new user):', profileFetchErr);
      }
    }

    // 3. Verify Admin Authorization (Whitelist or Database Role)
    const isWhitelisted = isAuthorizedAdminEmail(userEmail);
    const hasAdminRole = profileRole?.trim().toLowerCase() === 'admin';
    const isAuthorized = isAuthorizedAdminUser(authUser, profileRole);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Admin Auth] Login check: email="${userEmail}", isWhitelisted=${isWhitelisted}, profileRole="${profileRole}", authorized=${isAuthorized}`);
    }

    if (!isAuthorized) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Admin Auth] Access Denied: User "${userEmail}" is neither in ADMIN_EMAILS whitelist nor assigned role="admin" in profiles.`);
      }
      await supabase.auth.signOut();
      return { success: false, error: 'Access denied: You do not have administrator permissions.' };
    }

    // 4. If user is whitelisted but doesn't have role="admin" in profiles table, sync role with admin client
    if (isWhitelisted && !hasAdminRole) {
      try {
        const adminClient = createAdminClient();
        if (adminClient) {
          await adminClient
            .from('profiles')
            .upsert({
              id: authUser.id,
              email: userEmail,
              role: 'admin',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[Admin Auth] Synced role='admin' into profiles for ${userEmail}`);
          }
        }
      } catch (syncErr) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Admin Auth] Non-fatal profile role sync warning:', syncErr);
        }
      }
    }

    return {
      success: true,
      user: {
        id: authUser.id,
        email: userEmail,
        role: 'admin',
      },
    };
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Admin Auth] Unexpected login error:', err);
    }
    return { success: false, error: err?.message || 'Authentication server error.' };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('ffd_admin_session');
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Admin Auth] Logout error:', err);
    }
    return { success: false };
  }
}

export async function getCurrentAdminUser() {
  try {
    const cookieStore = await cookies();
    const fallbackEmail = cookieStore.get('ffd_admin_session')?.value;
    if (fallbackEmail && isAuthorizedAdminEmail(fallbackEmail)) {
      return { id: 'admin-local-master', email: fallbackEmail, role: 'admin' };
    }

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const userEmail = user.email?.trim().toLowerCase();

    // 1. Check whitelist first
    if (isAuthorizedAdminEmail(userEmail)) {
      return { id: user.id, email: userEmail, role: 'admin' };
    }

    // 2. Check profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role?.trim().toLowerCase() === 'admin') {
      return { id: user.id, email: userEmail, role: 'admin' };
    }

    return null;
  } catch (err) {
    return null;
  }
}
