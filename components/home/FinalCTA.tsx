'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-28 bg-farm-900 text-cream-100 overflow-hidden border-t border-farm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          <span className="text-xs font-mono uppercase tracking-widest text-farm-300 font-semibold">
            START YOUR MORNING FRESH
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-cream-100 leading-tight">
            Bring Farm-Fresh Products Home.
          </h2>

          <p className="text-earth-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            100% pure dairy delivered with temperature-controlled care from our farm directly to your family's doorstep every morning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-cream-100 hover:bg-cream-200 text-farm-900 font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Order Fresh Milk Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-farm-800 hover:bg-farm-700 text-cream-100 font-semibold text-sm border border-farm-700 transition-colors"
            >
              <MapPin className="w-4 h-4 text-farm-300" />
              Visit Our Farm
            </Link>
          </div>

          <div className="text-xs font-mono text-farm-400 pt-6">
            Free Chilled Delivery • Cancel or Pause Subscriptions Anytime
          </div>

        </div>
      </div>
    </section>
  );
}
