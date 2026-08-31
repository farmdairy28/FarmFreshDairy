import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Heart, Sun, Award, ArrowRight } from 'lucide-react';
import { getFarmValues } from '@/lib/supabase/api';
import { FarmValues } from '@/components/home/FarmValues';

export const metadata = {
  title: 'Our Farm Story — Pure Pastures Dairy',
  description: 'Learn about our 25-year heritage of organic pasture grazing, humane animal care, and unadulterated dairy production.',
};

export default async function AboutPage() {
  const farmValues = await getFarmValues();

  return (
    <div className="pt-32 pb-24 bg-cream-100">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            OUR HERITAGE & PHILOSOPHY
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-earth-900 leading-tight">
            RAISED WITH CARE. <br />
            MADE WITH PURPOSE.
          </h1>
          <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
            Since 1998, we have nurtured a sanctuary where cattle graze freely, land is respected, and milk reaches families without synthetic additives or thermal over-processing.
          </p>
        </div>
      </div>

      {/* Hero Farm Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-soft border border-earth-200">
            <Image
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"
              alt="Pasture cows grazing"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-soft border border-earth-200">
            <Image
              src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80"
              alt="Veterinarian animal care"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-soft border border-earth-200">
            <Image
              src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80"
              alt="Fresh glass bottle of milk"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Story Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-200/60 border border-earth-200 shadow-soft space-y-6">
          <h2 className="font-serif text-3xl font-bold text-earth-900">
            Why Honest Dairy Matters
          </h2>
          <p className="text-earth-700 leading-relaxed text-base">
            Modern commercial dairy often prioritizes shelf-life extensions, heavy homogenizing, and synthetic fat adjustments over original taste and nutritional integrity. At Pure Pastures, we do things differently.
          </p>
          <p className="text-earth-700 leading-relaxed text-base">
            Our cows are fed non-GMO forage, fresh green oats, and alfalfa grown on our own fields. They drink fresh well water and rest in well-ventilated, shaded pastures. Milking takes place in hygienic, touchless facilities, and the milk is immediately chilled to 4°C within 15 minutes.
          </p>
        </div>
      </div>

      {/* Farm Values Section Component */}
      <FarmValues values={farmValues} />

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <Link
          href="/products"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-bold text-sm uppercase tracking-wider transition-colors shadow-md"
        >
          Explore Our Fresh Dairy
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
