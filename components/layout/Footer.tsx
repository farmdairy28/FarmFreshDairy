import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Facebook, Instagram, Star } from 'lucide-react';
import { FarmFreshLogo } from './FarmFreshLogo';
import { SOCIAL_LINKS } from '@/lib/constants';
import { getProducts } from '@/lib/supabase/api';

export async function Footer() {
  const products = await getProducts();
  const displayProducts = products.filter(p => p.is_active !== false).slice(0, 6);

  return (
    <footer className="bg-farm-900 text-cream-200 pt-20 pb-12 border-t border-farm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-farm-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <FarmFreshLogo variant="light" size="lg" />
            </Link>

            <p className="text-sky-200/80 text-sm leading-relaxed max-w-sm">
              100% Pure, wholesome, unadulterated cow milk delivered straight from healthy cows to your home in Islamabad. Lab tested and certified 100% adulterant-free.
            </p>

            <div className="p-4 rounded-2xl bg-farm-800/80 border border-farm-700/60 space-y-2">
              <div className="text-xs font-mono uppercase text-sky-300 font-bold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Fresh Supply & Free Delivery
              </div>
              <p className="text-xs text-sky-100/90 font-medium">
                Free Home Delivery in <strong>Shahzad Town, I-8 &amp; I-9</strong> &amp; regular chilled supply across Islamabad at <strong>Rs. 250 / Litre</strong>.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="pt-1">
              <div className="text-xs font-mono uppercase text-sky-400 font-semibold mb-2.5 tracking-wider">
                Follow & Connect With Us
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-farm-800 hover:bg-[#1877F2] text-sky-100 hover:text-white border border-farm-700 hover:border-[#1877F2] transition-all text-xs font-semibold shadow-xs group"
                  aria-label="Farm Fresh Dairy on Facebook"
                >
                  <Facebook className="w-4 h-4 text-sky-300 group-hover:text-white transition-colors" />
                  <span>Facebook</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-farm-800 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] text-sky-100 hover:text-white border border-farm-700 hover:border-transparent transition-all text-xs font-semibold shadow-xs group"
                  aria-label="Farm Fresh Dairy on Instagram"
                >
                  <Instagram className="w-4 h-4 text-sky-300 group-hover:text-white transition-colors" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Explore Farm
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-white transition-colors">
                  Farm Process
                </Link>
              </li>
              <li>
                <Link href="/#milk-report" className="hover:text-white transition-colors flex items-center gap-1.5 text-sky-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Milk Lab Report
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors flex items-center gap-1.5 text-brand-yellow font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Fresh Products
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors">
                  Delivery Coverage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Fresh Products */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Fresh Products
            </h4>
            <ul className="space-y-2.5 text-sm text-sky-200/90">
              {displayProducts.length > 0 ? (
                displayProducts.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} className="hover:text-white transition-colors block truncate">
                      {p.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Explore All Products
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Order & Helpline Desk
            </h4>
            <ul className="space-y-3 text-sm text-sky-200/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <a
                  href={SOCIAL_LINKS.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors group flex items-center gap-1.5"
                  title="View Farm Location on Google Maps"
                >
                  <span>Shahzad Town / Chak Shahzad, Islamabad</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded group-hover:bg-emerald-500/30">
                    Map ↗
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:03109361932" className="hover:text-white transition-colors font-mono">
                  0310 9361932
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 fill-current" />
                <a 
                  href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors font-mono text-emerald-300 font-bold"
                >
                  WhatsApp: 0310-9361932
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:farmfreshdairy28@gmail.com" className="hover:text-white transition-colors">
                  farmfreshdairy28@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-farm-300/80 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Farm Fresh Dairy Products. Pure · Natural · Healthy. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sky-200 hidden md:inline">Freshness You Can Trust, Quality You Deserve</span>
            <div className="flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-farm-800 hover:bg-[#1877F2] text-sky-200 hover:text-white flex items-center justify-center transition-all border border-farm-700"
                aria-label="Facebook Page"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-farm-800 hover:bg-gradient-to-tr hover:from-[#833AB4] hover:to-[#F77737] text-sky-200 hover:text-white flex items-center justify-center transition-all border border-farm-700"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
