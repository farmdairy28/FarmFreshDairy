'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section className="py-24 bg-cream-100 border-t border-earth-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
              COMMUNITY VOICE
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
              Kind Words From Our Customers.
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-cream-200 text-earth-800 hover:bg-farm-700 hover:text-cream-100 transition-colors border border-earth-300"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-cream-200 text-earth-800 hover:bg-farm-700 hover:text-cream-100 transition-colors border border-earth-300"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Card */}
        {current && (
          <div className="relative p-8 sm:p-12 md:p-16 rounded-3xl bg-cream-200/70 border border-earth-200 shadow-soft max-w-4xl mx-auto">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-farm-300/40 pointer-events-none" />

            <div className="space-y-8">
              {/* Rating Stars */}
              <div className="flex items-center gap-1.5 text-gold-500">
                {Array.from({ length: current.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-earth-900 leading-snug font-medium italic">
                "{current.review}"
              </p>

              {/* Author Details */}
              <div className="flex items-center gap-4 pt-6 border-t border-earth-300/60">
                {current.avatar_url ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-farm-600 shrink-0">
                    <Image
                      src={current.avatar_url}
                      alt={current.customer_name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-farm-700 text-cream-100 font-serif font-bold text-xl flex items-center justify-center shrink-0">
                    {current.customer_name.charAt(0)}
                  </div>
                )}

                <div>
                  <div className="font-serif font-bold text-lg text-earth-900">
                    {current.customer_name}
                  </div>
                  <div className="text-xs font-mono uppercase text-farm-700 font-medium">
                    {current.customer_type}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
