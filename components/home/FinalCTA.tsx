'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-28 md:py-32 bg-farm-950 text-white overflow-hidden border-t border-farm-800">
      {/* Background Hero Image with Deep Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1800&q=80"
          alt="Open green dairy farm pastures producing fresh cow milk in Islamabad"
          fill
          className="object-cover object-center opacity-25 scale-105 transition-transform duration-1000"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-farm-950 via-farm-900/90 to-farm-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-farm-800/40 via-transparent to-farm-950/80"></div>
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-farm-800/90 text-brand-yellow text-xs font-mono uppercase tracking-wider font-bold border border-farm-700/80 shadow-md backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            PURE · FRESH · HEALTHY · RS. 250/LITRE
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Bring Pure Farm Milk Home Every Morning &amp; Evening.
          </h2>

          <p className="text-farm-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            100% pure cow milk delivered with temperature-controlled chilled care straight to your doorstep across Islamabad every morning and evening. Lab-certified adulterant-free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Order on WhatsApp (0310-9361932)
            </a>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-farm-800 hover:bg-farm-700 text-white font-semibold text-sm transition-all shadow-md border border-farm-700"
            >
              Order Online (Rs. 250/L)
              <ArrowRight className="w-4 h-4 text-brand-yellow" />
            </Link>

            <a
              href="tel:03109361932"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-yellow" />
              0310 9361932
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-farm-200/90 pt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" /> Lab Certified 100% Pure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> FREE Delivery in Shahzad Town, I-8 &amp; I-9
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" /> Morning &amp; Evening Delivery Routes
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
