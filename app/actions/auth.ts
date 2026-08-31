'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Invalid login credentials.' };
    }

    // Verify admin role from profiles table using server client
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', authData.user.id)
      .single();

    // If profile check fails or user is not admin
    if (profileError || profileData?.role !== 'admin') {
      // Check if user is fallback admin from admins table or service role
      const adminClient = createAdminClient();
      const { data: adminRecord } = await adminClient
        .from('admins')
        .select('role')
        .eq('email', authData.user.email)
        .single();

      if (!adminRecord || adminRecord.role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, error: 'Access denied: You do not have administrator permissions.' };
      }
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email || email,
        role: 'admin',
      },
    };
  } catch (err: any) {
    console.error('Login action error:', err);
    return { success: false, error: err?.message || 'Authentication server error.' };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    console.error('Logout error:', err);
    return { success: false };
  }
}

export async function getCurrentAdminUser() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return { id: user.id, email: user.email, role: 'admin' };
    }

    // Fallback check in admins table
    const adminClient = createAdminClient();
    const { data: adminRecord } = await adminClient
      .from('admins')
      .select('role')
      .eq('email', user.email)
      .single();

    if (adminRecord?.role === 'admin') {
      return { id: user.id, email: user.email, role: 'admin' };
    }

    return null;
  } catch (err) {
    return null;
  }
}
