'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, MessageCircle, Phone, ShieldCheck, Sparkles, MapPin, Heart, Leaf, Truck } from 'lucide-react';
import { HomepageHero } from '@/lib/types';

export function HeroSection({ data }: { data: HomepageHero }) {
  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 bg-gradient-to-b from-farm-50 via-white to-farm-100/40 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-farm-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-800 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                Pure · Natural · Healthy
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold border border-emerald-300/80">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                FREE Delivery in Shahzad Town
              </div>
            </div>

            {/* Main Brand Artwork Headline & Splash Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-earth-900 tracking-tight">
                  Fresh
                </span>
                <span className="inline-block px-4 py-1 rounded-2xl bg-brand-blue text-white font-serif font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight shadow-md transform -rotate-1">
                  Cow Milk
                </span>
              </div>

              {/* Price Highlight Splash Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-brand-yellow text-farm-900 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight shadow-md transform rotate-1 border border-yellow-400/60">
                  <span>Rs. 250/-</span>
                  <span className="text-xs sm:text-sm uppercase font-mono font-bold text-farm-950/80">Per Litre</span>
                </div>
                <span className="text-xs font-mono text-farm-800 font-semibold bg-white/90 px-3 py-1.5 rounded-xl border border-farm-200 shadow-xs">
                  Goodness Straight from Our Farms ♡
                </span>
              </div>

              {/* Urdu Authentic Line */}
              <p className="font-serif text-lg sm:text-xl text-farm-800 font-semibold leading-normal pt-1" dir="rtl">
                تازہ اور خالص گائے کا دودھ براہ راست فارم سے آپ کے گھر تک
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-earth-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Delivering unadulterated, certified wholesome milk straight to your doorstep every morning in Islamabad. Zero preservatives, zero water dilution, rich in natural cream and calcium.
            </p>

            {/* 4 Iconic Circular Feature Badges (Matching Brand Artwork) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-white border border-farm-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                  🐮
                </div>
                <div className="text-[11px] font-bold text-farm-950 leading-tight">
                  100% Pure<br /><span className="text-earth-500 font-normal">Cow Milk</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-farm-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-[11px] font-bold text-farm-950 leading-tight">
                  No<br /><span className="text-earth-500 font-normal">Additives</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-farm-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                </div>
                <div className="text-[11px] font-bold text-farm-950 leading-tight">
                  Safe &amp;<br /><span className="text-earth-500 font-normal">Hygienic</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-farm-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-4 h-4 text-rose-400 fill-current" />
                </div>
                <div className="text-[11px] font-bold text-farm-950 leading-tight">
                  Rich in<br /><span className="text-earth-500 font-normal">Nutrition</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Order on WhatsApp (0310-9361932)
              </a>

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-farm-800 hover:bg-farm-900 text-white font-semibold text-sm transition-all shadow-md hover:shadow"
              >
                Order Online
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="tel:03109361932"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-farm-50 text-earth-800 font-semibold text-sm border border-earth-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-farm-700" />
                0310 9361932
              </a>
            </div>

            {/* Brand Artwork Home Delivery Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-farm-900 via-farm-800 to-farm-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-md border border-farm-700">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-brand-yellow shrink-0" />
                <div className="text-xs">
                  <span className="font-bold tracking-wide">Home Delivery Available</span>
                  <span className="text-farm-200 text-[11px] block">Free in Shahzad Town · Other areas via Rider</span>
                </div>
              </div>

              <div className="text-xs font-serif font-semibold text-emerald-300 italic">
                Choose Health Choose Farm Fresh ♡
              </div>
            </div>

          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-float border-4 border-white bg-farm-100">
              <Image
                src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80"
                alt="Pasture-raised cows on lush green farm"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-farm-950/70 via-transparent to-transparent"></div>
              
              {/* Top Floating Badge */}
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-farm-200 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono font-bold text-earth-900">
                  Shahzad Town &amp; Islamabad
                </span>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-farm-200 shadow-lg flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-farm-800 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-brand-yellow" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-farm-950">
                    Lab Certified Pure
                  </div>
                  <div className="text-[11px] text-earth-600">
                    Tested 100% negative for urea, formalin, and adulterants
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
