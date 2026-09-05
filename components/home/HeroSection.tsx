'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, MessageCircle, Phone, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { HomepageHero } from '@/lib/types';

export function HeroSection({ data }: { data: HomepageHero }) {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-farm-100/70 via-white to-farm-100/30 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-farm-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-600 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                100% ORIGINAL COW MILK
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold border border-emerald-300/80">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                FREE Delivery in Shahzad Town
              </div>
            </div>

            {/* Main Editorial Headline & Urdu Subtitle */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-earth-900 leading-[1.08]">
                Fresh & Pure Cow Milk <br />
                <span className="text-farm-600">Straight From Happy Cows</span>
              </h1>

              {/* Urdu Authentic Line */}
              <p className="font-serif text-xl sm:text-2xl text-farm-800 font-semibold leading-normal pt-1" dir="rtl">
                تازہ اور خالص گائے کا دودھ براہ راست فارم سے آپ کے گھر تک
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-earth-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Delivering unadulterated, certified wholesome milk straight to your doorstep every morning in Islamabad. Zero preservatives, zero water dilution, rich in natural cream and calcium.
            </p>

            {/* Pricing Highlight Pill */}
            <div className="p-4 rounded-2xl bg-white border border-farm-200 shadow-sm flex flex-wrap items-center justify-between gap-4 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-farm-100 text-farm-700 flex flex-col items-center justify-center font-bold font-mono leading-none border border-farm-300">
                  <span className="text-[10px] uppercase">Only</span>
                  <span className="text-base font-extrabold">250</span>
                </div>
                <div>
                  <div className="font-serif font-bold text-earth-900 text-base">
                    Rs. 250 / Litre
                  </div>
                  <div className="text-xs font-mono text-emerald-600 font-semibold">
                    100% Pure Cow Milk · Chilled Daily Morning
                  </div>
                </div>
              </div>

              <Link
                href="#milk-report"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-farm-600 hover:text-farm-800 underline underline-offset-4 decoration-farm-400"
              >
                <ShieldCheck className="w-4 h-4" />
                View Lab Test Report
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Order on WhatsApp (0310-9361932)
              </a>

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-farm-600 hover:bg-farm-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow"
              >
                Order Online
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="tel:03109361932"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white hover:bg-farm-50 text-earth-800 font-semibold text-sm border border-earth-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-farm-600" />
                Call Helpline
              </a>
            </div>

            {/* Statistics Bar */}
            <div className="pt-6 border-t border-earth-200/80 grid grid-cols-3 gap-3 sm:gap-6">
              <div className="space-y-1">
                <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-farm-700">
                  100% Pure
                </div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-earth-500">
                  Adulterant Free
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-farm-700">
                  Rs. 250
                </div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-earth-500">
                  Per Litre Glass/Pouch
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-farm-700">
                  6:00 AM
                </div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-earth-500">
                  Morning Doorstep Chilled
                </div>
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
              <div className="absolute inset-0 bg-gradient-to-t from-farm-900/60 via-transparent to-transparent"></div>
              
              {/* Top Floating Badge */}
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-farm-200 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono font-bold text-earth-900">
                  Shahzad Town & Islamabad
                </span>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-farm-200 shadow-lg flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-farm-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-farm-900">
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
