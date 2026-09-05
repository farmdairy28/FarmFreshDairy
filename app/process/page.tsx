import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProcessSteps } from '@/lib/supabase/api';

export const metadata = {
  title: 'Farm Process — From Pasture to Pour | Farm Fresh Dairy',
  description: 'Discover our 6-step hygienic journey from open pasture grazing to chilled morning doorstep delivery across Islamabad.',
};

export default async function ProcessPage() {
  const steps = await getProcessSteps();

  return (
    <div className="pt-36 pb-24 bg-cream-100">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            THE UNTOUCHED JOURNEY
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-earth-900">
            From Pasture to Pour.
          </h1>
          <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
            Six meticulous steps designed to preserve natural enzymes, rich cream layer, and authentic farm freshness.
          </p>
        </div>
      </div>

      {/* 6 Steps List Detailed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mb-24">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image */}
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-float border-2 border-earth-200 bg-earth-200">
                <Image
                  src={step.image_url}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content */}
            <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-4xl text-farm-700">
                  Step {step.step_number}
                </span>
                <span className="h-px flex-1 bg-earth-300"></span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
                {step.title}
              </h2>

              <p className="text-earth-700 text-base leading-relaxed">
                {step.short_desc}
              </p>

              {step.detailed_desc && (
                <p className="text-earth-600 text-sm leading-relaxed p-4 rounded-2xl bg-cream-200/60 border border-earth-200/80">
                  {step.detailed_desc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-bold text-sm uppercase tracking-wider transition-colors shadow-md"
        >
          Taste The Difference — Order Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
