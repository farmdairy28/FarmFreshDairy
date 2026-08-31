'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProcessStep } from '@/lib/types';

export function ProcessJourney({ steps }: { steps: ProcessStep[] }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-28 bg-cream-100 border-t border-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            THE JOURNEY
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-earth-900 leading-none">
            From Pasture to Pour.
          </h2>
          <p className="text-earth-600 text-base sm:text-lg">
            Six disciplined steps of daily care, hygienic processing, and rapid temperature management that deliver untouched purity to your glass.
          </p>
        </div>

        {/* Steps Journey Desktop / Tablet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Step Selector List */}
          <div className="lg:col-span-6 space-y-4">
            {steps.map((step, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-cream-200/80 border-farm-600 shadow-md translate-x-2'
                      : 'bg-cream-100 border-earth-200/80 hover:bg-cream-200/40 hover:border-earth-300'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <span
                      className={`font-serif text-3xl font-bold transition-colors ${
                        isCurrent ? 'text-farm-700' : 'text-earth-400'
                      }`}
                    >
                      {step.step_number}
                    </span>
                    <div className="space-y-1">
                      <h3
                        className={`font-serif text-xl font-bold transition-colors ${
                          isCurrent ? 'text-earth-900' : 'text-earth-700'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-earth-600 text-sm leading-relaxed">
                        {step.short_desc}
                      </p>
                      {isCurrent && step.detailed_desc && (
                        <p className="text-farm-900 text-xs font-mono pt-2 animate-fade-in border-t border-earth-300/50 mt-2">
                          {step.detailed_desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Image Showcase */}
          <div className="lg:col-span-6 relative sticky top-32">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-float border-4 border-cream-50 bg-earth-200">
              <Image
                src={steps[activeStep]?.image_url || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80'}
                alt={steps[activeStep]?.title || 'Farm process step'}
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-cream-100/90 backdrop-blur-md border border-cream-200 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-farm-800">
                    Step {steps[activeStep]?.step_number} of 06
                  </span>
                  <span className="text-xs font-serif font-bold text-earth-900">
                    {steps[activeStep]?.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
