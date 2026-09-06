'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-28 bg-gradient-to-br from-farm-900 via-farm-800 to-farm-900 text-white overflow-hidden border-t border-farm-800">
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-700/80 text-sky-200 text-xs font-mono uppercase tracking-wider font-semibold border border-farm-600/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PURE · FRESH · HEALTHY · RS. 250/LITRE
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Bring Pure Farm Milk Home Every Morning.
          </h2>

          <p className="text-sky-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            100% pure cow milk delivered with temperature-controlled chilled care straight to your doorstep across Islamabad. Lab-certified adulterant-free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Order on WhatsApp (0310-9361932)
            </a>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-farm-600 hover:bg-farm-700 text-white font-semibold text-sm transition-all shadow-md"
            >
              Order Online (Rs. 250/L)
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:03109361932"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              <Phone className="w-4 h-4 text-sky-300" />
              0310 9361932
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-sky-300/90 pt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Lab Certified 100% Pure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> FREE Delivery in Shahzad Town, I-8 &amp; I-9
            </span>
            <span>•</span>
            <span>Morning Chilled Delivery 6-9 AM</span>
          </div>

        </div>
      </div>
    </section>
  );
}
