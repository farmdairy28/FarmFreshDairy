'use server';

import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAuthorizedAdminEmail, isAuthorizedAdminUser } from '@/lib/auth/admin-auth';
import { Testimonial } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface CreateReviewInput {
  customer_name: string;
  customer_type?: string;
  rating: number;
  review: string;
  avatar_url?: string;
}

export interface ReviewActionResult {
  success: boolean;
  testimonial?: Testimonial;
  error?: string;
}

export interface AdminReviewsResult {
  success: boolean;
  data: Testimonial[];
  error?: string;
}

// Helper to check if string is a valid PostgreSQL UUID
function isValidUUID(str?: string | null): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

/**
 * Verifies that the current request has authorized administrative credentials.
 */
async function verifyAdminAuthorization(): Promise<boolean> {
  // 1. Check fallback/direct admin cookie session
  try {
    const cookieStore = cookies();
    const fallbackEmail = cookieStore.get('ffd_admin_session')?.value;
    if (fallbackEmail && isAuthorizedAdminEmail(fallbackEmail)) {
      return true;
    }
  } catch (e) {
    // Cookie access error
  }

  // 2. Check Supabase Auth user session
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user && isAuthorizedAdminUser(user)) {
      return true;
    }
  } catch (e) {
    // Supabase auth check error
  }

  return false;
}

/**
 * Submits a new customer review directly to the database.
 */
export async function submitReviewAction(input: CreateReviewInput): Promise<ReviewActionResult> {
  const name = (input.customer_name || '').trim();
  const reviewText = (input.review || '').trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));
  const customerType = (input.customer_type || '').trim() || 'Verified Customer';
  const avatarUrl = (input.avatar_url || '').trim() || null;

  if (!name || name.length < 2) {
    return { success: false, error: 'Please provide your name (at least 2 characters).' };
  }

  if (!reviewText || reviewText.length < 5) {
    return { success: false, error: 'Please write a review comment (at least 5 characters).' };
  }

  try {
    const adminClient = createAdminClient();
    if (!adminClient) {
      console.error('[Submit Review Error]: Admin Supabase client could not be initialized.');
      return { success: false, error: 'Database service is currently unavailable. Please try again.' };
    }

    const payload = {
      rating,
      customer_name: name,
      customer_type: customerType,
      review: reviewText,
      avatar_url: avatarUrl,
      sort_order: 0,
      is_active: true,
    };

    const { data, error } = await adminClient
      .from('testimonials')
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      console.error('[Review DB Insert Error]:', error?.message || 'No row returned after insert');
      return { success: false, error: error?.message || 'Failed to save review to database. Please try again.' };
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/reviews');
    } catch (e) {
      // Catch for static build context
    }

    return {
      success: true,
      testimonial: data as Testimonial,
    };
  } catch (err: any) {
    console.error('[Submit Review Exception]:', err);
    return { success: false, error: err?.message || 'An unexpected error occurred while submitting review.' };
  }
}

/**
 * Fetches all reviews (both active and hidden) for the Admin Reviews management page.
 */
export async function getAdminReviewsAction(): Promise<AdminReviewsResult> {
  const isAuthorized = await verifyAdminAuthorization();
  if (!isAuthorized) {
    return { success: false, data: [], error: 'Unauthorized: Admin access required.' };
  }

  try {
    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, data: [], error: 'Database service is currently unavailable.' };
    }

    const { data, error } = await adminClient
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Fetch Admin Reviews Error]:', error.message);
      return { success: false, data: [], error: error.message };
    }

    return {
      success: true,
      data: (data || []) as Testimonial[],
    };
  } catch (err: any) {
    console.error('[Fetch Admin Reviews Exception]:', err);
    return { success: false, data: [], error: err?.message || 'Failed to fetch reviews.' };
  }
}

/**
 * Permanently deletes a review from the database.
 */
export async function deleteReviewAction(id: string): Promise<{ success: boolean; error?: string }> {
  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Review ID is required.' };
  }

  const cleanId = id.trim();
  if (!isValidUUID(cleanId)) {
    return { success: false, error: 'Invalid review ID format.' };
  }

  const isAuthorized = await verifyAdminAuthorization();
  if (!isAuthorized) {
    return { success: false, error: 'Unauthorized: Admin privileges required.' };
  }

  try {
    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: 'Database service is currently unavailable.' };
    }

    const { error } = await adminClient
      .from('testimonials')
      .delete()
      .eq('id', cleanId);

    if (error) {
      console.error('[Delete Review DB Error]:', error.message);
      return { success: false, error: error.message || 'Failed to delete review from database.' };
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/reviews');
    } catch (e) {}

    return { success: true };
  } catch (err: any) {
    console.error('[Delete Review Exception]:', err);
    return { success: false, error: err?.message || 'Failed to delete review.' };
  }
}

/**
 * Toggles the public active/visibility status of a review.
 */
export async function toggleReviewStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; testimonial?: Testimonial; error?: string }> {
  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Review ID is required.' };
  }

  const cleanId = id.trim();
  if (!isValidUUID(cleanId)) {
    return { success: false, error: 'Invalid review ID format.' };
  }

  const isAuthorized = await verifyAdminAuthorization();
  if (!isAuthorized) {
    return { success: false, error: 'Unauthorized: Admin privileges required.' };
  }

  try {
    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: 'Database service is currently unavailable.' };
    }

    const { data, error } = await adminClient
      .from('testimonials')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', cleanId)
      .select()
      .single();

    if (error || !data) {
      console.error('[Toggle Review DB Error]:', error?.message || 'No row updated');
      return { success: false, error: error?.message || 'Failed to update review status in database.' };
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/reviews');
    } catch (e) {}

    return {
      success: true,
      testimonial: data as Testimonial,
    };
  } catch (err: any) {
    console.error('[Toggle Review Exception]:', err);
    return { success: false, error: err?.message || 'Failed to toggle review status.' };
  }
}
