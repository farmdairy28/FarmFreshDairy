'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sun, ShieldCheck, Heart } from 'lucide-react';
import { HomepageFarmIntro } from '@/lib/types';

export function FarmIntro({ data }: { data: HomepageFarmIntro }) {
  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Farm Imagery with Organic Corner */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-float border-2 border-earth-200">
              <Image
                src={data.imageUrl || "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80"}
                alt="Pasture-grazed healthy dairy cows on green farmland in Islamabad"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Small Overlay Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 p-4 rounded-2xl bg-farm-900 text-cream-100 shadow-xl border border-farm-700 max-w-xs">
              <div className="text-xs font-mono uppercase tracking-widest text-farm-300 mb-1">
                Zero Hormones
              </div>
              <p className="text-xs text-cream-200">
                100% natural feed, fresh well-water & veterinary care.
              </p>
            </div>
          </div>

          {/* Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
              {data.eyebrow}
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900 leading-tight uppercase">
              {data.heading}
            </h2>

            <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
              {data.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-200/70 border border-earth-200">
                <Sun className="w-5 h-5 text-farm-700 shrink-0" />
                <span className="text-xs font-semibold text-earth-800">Open Grazing</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-200/70 border border-earth-200">
                <Heart className="w-5 h-5 text-farm-700 shrink-0" />
                <span className="text-xs font-semibold text-earth-800">Gentle Hands</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-200/70 border border-earth-200">
                <ShieldCheck className="w-5 h-5 text-farm-700 shrink-0" />
                <span className="text-xs font-semibold text-earth-800">Pure Quality</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-farm-800 hover:text-farm-900 underline underline-offset-4"
              >
                Read our complete farm philosophy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
