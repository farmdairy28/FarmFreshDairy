'use client';

import React from 'react';
import Image from 'next/image';
import { FarmValue } from '@/lib/types';

export function FarmValues({ values }: { values: FarmValue[] }) {
  return (
    <section className="py-24 bg-cream-50 border-t border-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
              CORE PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-earth-900 mt-2">
              Our Farm Pillars
            </h2>
          </div>
          <p className="text-earth-600 max-w-md text-sm sm:text-base">
            Guided by respect for our cattle, land stewardship, and an unwavering commitment to unadulterated freshness.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => (
            <div
              key={val.id}
              className="group rounded-3xl bg-cream-100 p-8 border border-earth-200 shadow-soft hover:shadow-float transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Number & Image */}
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-4xl text-farm-700">
                    {val.number_prefix}
                  </span>
                  {val.image_url && (
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-earth-200 shrink-0">
                      <Image
                        src={val.image_url}
                        alt={val.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="64px"
                      />
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-earth-900 group-hover:text-farm-800 transition-colors">
                  {val.title}
                </h3>

                <p className="text-earth-600 text-sm leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-earth-200/60 flex items-center text-xs font-mono uppercase tracking-wider text-earth-400 font-semibold group-hover:text-farm-700 transition-colors">
                <span>Pillars of Excellence</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
