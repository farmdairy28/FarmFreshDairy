'use client';

import React from 'react';
import { Testimonial } from '@/lib/types';
import { CustomerReviews } from '@/components/reviews/CustomerReviews';

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <CustomerReviews
      initialReviews={testimonials}
      title="Kind Words From Our Customers"
      subtitle="Read verified reviews from families across Islamabad and share your own experience with Farm Fresh Dairy."
      eyebrow="COMMUNITY VOICE & REVIEWS"
    />
  );
}
