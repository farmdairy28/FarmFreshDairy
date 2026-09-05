'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import { DeliveryRegion } from '@/lib/types';

export function DeliverySection({ regions }: { regions: DeliveryRegion[] }) {
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0]?.id || '');

  const activeRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  return (
    <section className="py-24 bg-cream-200/50 border-t border-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-farm-100 text-farm-800 text-xs font-mono font-semibold uppercase border border-farm-200">
            <MapPin className="w-3.5 h-3.5" />
            FREE MORNING DOORSTEP DELIVERY
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Where Should We Deliver?
          </h2>

          <p className="text-earth-600 text-base sm:text-lg">
            We deliver temperature-controlled, chilled morning milk across Islamabad between 6:00 AM and 9:00 AM daily.
          </p>
        </div>

        {/* Region Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10">
          {regions.map((reg, idx) => {
            const isSelected = reg.id === selectedRegionId;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegionId(reg.id)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider transition-all border ${
                  isSelected
                    ? 'bg-farm-700 text-cream-100 border-farm-700 shadow-sm'
                    : 'bg-cream-100 text-earth-700 border-earth-300 hover:bg-cream-200'
                }`}
              >
                0{idx + 1} — {reg.name} ({reg.areas?.length || 0})
              </button>
            );
          })}
        </div>

        {/* Selected Region Area Cards */}
        {activeRegion && (
          <div className="p-6 sm:p-8 rounded-3xl bg-cream-100 border border-earth-200 shadow-soft max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-earth-200 gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-earth-900">
                  {activeRegion.name}
                </h3>
                <span className="text-xs font-mono text-farm-700">
                  {activeRegion.areas?.length || 0} Verified Morning Delivery Routes
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-farm-100 text-farm-800 text-xs font-mono font-semibold shrink-0">
                <Clock className="w-4 h-4 text-farm-600" />
                6:00 AM - 9:00 AM
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {activeRegion.areas?.map((area) => (
                <div
                  key={area.id}
                  className="p-3.5 sm:p-4 rounded-xl bg-cream-50 border border-earth-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Check className="w-4 h-4 text-farm-700 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-earth-800 truncate">
                      {area.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-farm-100 text-farm-800 px-2 py-0.5 rounded font-bold shrink-0">
                    Free
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-8 mt-6 border-t border-earth-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-earth-500 font-mono text-center sm:text-left">
                Don&apos;t see your area listed? Contact our farm desk for custom morning delivery.
              </span>
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0 text-center"
              >
                Schedule Delivery
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
