'use client';

import React from 'react';
import { HomepagePromise } from '@/lib/types';

export function OurPromise({ data }: { data: HomepagePromise }) {
  return (
    <section className="py-24 bg-cream-200/60 border-y border-earth-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            {data.eyebrow}
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-earth-900 leading-tight">
            {data.heading}
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl font-serif text-farm-800 font-medium">
            {data.subtitle}
          </p>

          <p className="text-earth-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {data.description}
          </p>

          {/* Promise Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-earth-300/60">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-cream-100/80 border border-earth-200/80 shadow-soft">
                <div className="font-serif text-4xl font-bold text-farm-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-earth-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
