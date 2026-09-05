'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Testimonial } from '@/lib/types';
import { upsertServerTestimonial, deleteServerTestimonial } from '@/lib/supabase/products-store';
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

export async function submitReviewAction(input: CreateReviewInput): Promise<ReviewActionResult> {
  const name = (input.customer_name || '').trim();
  const reviewText = (input.review || '').trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));
  const customerType = (input.customer_type || '').trim() || 'Verified Customer';
  const avatarUrl = (input.avatar_url || '').trim() || undefined;

  if (!name || name.length < 2) {
    return { success: false, error: 'Please provide your name (at least 2 characters).' };
  }

  if (!reviewText || reviewText.length < 5) {
    return { success: false, error: 'Please write a review comment (at least 5 characters).' };
  }

  try {
    const adminClient = createAdminClient();
    const reviewId = `rev-${Date.now()}`;

    const newTestimonial: Testimonial = {
      id: reviewId,
      rating,
      customer_name: name,
      customer_type: customerType,
      review: reviewText,
      avatar_url: avatarUrl,
      sort_order: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (adminClient) {
      try {
        const payload: Record<string, any> = {
          rating,
          customer_name: name,
          customer_type: customerType,
          review: reviewText,
          avatar_url: avatarUrl || null,
          sort_order: 0,
          is_active: true,
        };

        const { data, error } = await adminClient
          .from('testimonials')
          .insert(payload)
          .select()
          .single();

        if (!error && data) {
          newTestimonial.id = data.id || reviewId;
          if (data.created_at) newTestimonial.created_at = data.created_at;
        } else if (error) {
          console.warn('[Review DB Insert Notice]:', error.message);
        }
      } catch (dbErr) {
        console.warn('[Review DB Insert Exception]:', dbErr);
      }
    }

    // Always update server memory store so it immediately shows on page
    upsertServerTestimonial(newTestimonial);

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/reviews');
    } catch (e) {
      // Invariant catch for build/static context
    }

    return {
      success: true,
      testimonial: newTestimonial,
    };
  } catch (err: any) {
    console.error('[Submit Review Error]:', err);
    return { success: false, error: err?.message || 'Failed to submit review. Please try again.' };
  }
}

export async function deleteReviewAction(id: string): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Review ID is required.' };
  }

  try {
    const adminClient = createAdminClient();
    if (adminClient) {
      try {
        const { error } = await adminClient
          .from('testimonials')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('[Review DB Delete Notice]:', error.message);
        }
      } catch (dbErr) {
        console.warn('[Review DB Delete Exception]:', dbErr);
      }
    }

    // Delete from server singleton memory store
    deleteServerTestimonial(id);

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/reviews');
    } catch (e) {
      // Invariant catch for build/static context
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Delete Review Error]:', err);
    return { success: false, error: err?.message || 'Failed to delete review.' };
  }
}

export async function toggleReviewStatusAction(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Review ID is required.' };
  }

  try {
    const adminClient = createAdminClient();
    if (adminClient) {
      try {
        await adminClient
          .from('testimonials')
          .update({ is_active: isActive })
          .eq('id', id);
      } catch (dbErr) {
        console.warn('[Review DB Update Exception]:', dbErr);
      }
    }

    // Update memory store
    const store = (await import('@/lib/supabase/products-store')).getServerTestimonialsStore();
    const item = store.find((t) => t.id === id);
    if (item) {
      item.is_active = isActive;
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/reviews');
    } catch (e) {}

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to toggle review status.' };
  }
}
