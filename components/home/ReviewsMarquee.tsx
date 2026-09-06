'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles, MapPin } from 'lucide-react';
import { Testimonial } from '@/lib/types';

interface ReviewsMarqueeProps {
  reviews?: Testimonial[];
}

export function ReviewsMarquee({ reviews = [] }: ReviewsMarqueeProps) {
  // Ensure we have reviews to display
  if (!reviews || reviews.length === 0) return null;

  // Duplicate the array for a seamless, continuous infinite loop
  const marqueeItems = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-20 bg-gradient-to-b from-cream-50 via-white to-cream-100 border-t border-earth-200 overflow-hidden relative">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100 text-farm-800 text-xs font-mono uppercase font-bold tracking-wider border border-farm-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow fill-current" />
              Verified Customer Experiences
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-earth-900 leading-tight">
              Loved by Families Across Islamabad.
            </h2>
            <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
              Real feedback from households, physicians, and chefs enjoying fresh, unadulterated pure cow milk every morning.
            </p>
          </div>

          {/* Social Proof Trust Badge */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-farm-200 shadow-sm shrink-0 self-start md:self-auto">
            <div className="flex items-center text-brand-yellow">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-brand-yellow" />
              ))}
            </div>
            <div className="border-l border-earth-200 pl-3">
              <div className="text-xs font-bold text-farm-950 font-mono">4.9 / 5.0 Rating</div>
              <div className="text-[11px] text-earth-500 font-mono">100% Pure Certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Strip Container */}
      <div className="relative w-full overflow-hidden select-none pause-on-hover">
        {/* Left & Right Gradient Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-cream-50 via-cream-50/80 to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-cream-100 via-cream-100/80 to-transparent z-10"></div>

        {/* Continuous Scrolling Strip */}
        <div className="animate-marquee-smooth py-4">
          {marqueeItems.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="w-[310px] sm:w-[360px] md:w-[400px] shrink-0 mx-3 p-5 sm:p-6 rounded-3xl bg-white/95 border border-farm-200/90 shadow-soft hover:shadow-float hover:border-farm-400 transition-all duration-300 flex flex-col justify-between group backdrop-blur-xs transform hover:-translate-y-1"
            >
              {/* Top Row: Stars + Verified Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-brand-yellow"
                    />
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  Verified Customer
                </span>
              </div>

              {/* Review Body */}
              <div className="relative mb-5 flex-1">
                <Quote className="w-6 h-6 text-farm-300/40 absolute -top-1 -left-1 pointer-events-none" />
                <p className="text-earth-700 text-xs sm:text-sm leading-relaxed pl-3 italic line-clamp-4">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              {/* Customer Info Footer */}
              <div className="flex items-center gap-3 pt-3 border-t border-earth-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-farm-800 to-farm-950 text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-xs border border-farm-700/60">
                  {review.customer_name?.trim().charAt(0).toUpperCase() || 'C'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-farm-950 text-xs sm:text-sm truncate">
                    {review.customer_name}
                  </div>
                  <div className="text-[11px] text-earth-500 font-mono truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-farm-600 shrink-0" />
                    <span className="truncate">{review.customer_type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
