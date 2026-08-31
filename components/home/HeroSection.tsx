'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HomepageHero } from '@/lib/types';

export function HeroSection({ data }: { data: HomepageHero }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8 z-10">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100 text-farm-800 text-xs font-mono font-semibold tracking-wider uppercase border border-farm-200">
              <span className="w-2 h-2 rounded-full bg-farm-600"></span>
              {data.eyebrow}
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-earth-900 leading-[1.08]">
              {data.heading}
            </h1>

            {/* Supporting Text */}
            <p className="text-earth-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              {data.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {data.primaryCtaText}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-cream-200 hover:bg-cream-300 text-earth-800 font-semibold text-sm border border-earth-300 transition-colors"
              >
                {data.secondaryCtaText}
              </Link>
            </div>

            {/* Statistics Bar */}
            <div className="pt-8 border-t border-earth-200/80 grid grid-cols-3 gap-3 sm:gap-6">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="space-y-1 min-w-0">
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-farm-800 truncate">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-earth-500 break-words leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-float border-4 border-cream-50 bg-earth-200">
              <Image
                src={data.imageUrl || "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80"}
                alt="Pasture-raised cows on lush green farm"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/40 via-transparent to-transparent"></div>
              
              {/* Floating Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-cream-100/90 backdrop-blur-md border border-cream-200/80 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-farm-700 text-cream-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-farm-900">
                    Chilled Within Minutes
                  </div>
                  <div className="text-[11px] text-earth-600">
                    Zero thermal pasteurization over-processing
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
