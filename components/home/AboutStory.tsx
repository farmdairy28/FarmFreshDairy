'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AboutStory() {
  return (
    <section className="py-24 bg-cream-200/60 border-t border-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
              OUR HERITAGE & MISSION
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900 leading-tight">
              Raised With Care. <br />
              Made With Purpose.
            </h2>

            <p className="text-earth-700 text-base sm:text-lg leading-relaxed">
              Founded on the principles of natural pasture feeding and humane animal care, Farm Fresh Dairy began with a simple belief: pure milk should reach families exactly as nature created it.
            </p>

            <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
              We reject industrial shortcuts. Our pasture cows are never subjected to synthetic growth hormones, preventative antibiotic routines, or crowded stall confinement. Each morning, our dedicated team milks in surgically sanitized parlors, chilling the milk instantly to 4°C to lock in original taste, thick cream, and vital enzymes.
            </p>

            {/* Editorial Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-earth-300/70">
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-farm-800">25+</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-earth-500 mt-1">Years Farming</div>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-farm-800">100%</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-earth-500 mt-1">Natural Care</div>
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-farm-800">5,000+</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-earth-500 mt-1">Happy Families</div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Read Our Story
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Editorial Photo Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-4 border-cream-50 shadow-float bg-earth-200">
              <Image
                src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1000&q=80"
                alt="Pasture cows and daily care"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
