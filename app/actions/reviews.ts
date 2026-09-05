'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Testimonial } from '@/lib/types';
import { upsertServerTestimonial } from '@/lib/supabase/products-store';
import { revalidatePath } from 'next/cache';

export interface CreateReviewInput {
  customer_name: string;
  customer_type?: string;
  rating: number;
  review: string;
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
      avatar_url: undefined,
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
