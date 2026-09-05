import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { FarmFreshLogo } from './FarmFreshLogo';

export function Footer() {
  return (
    <footer className="bg-farm-900 text-cream-200 pt-20 pb-12 border-t border-farm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-farm-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <FarmFreshLogo variant="light" />
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
                Free Home Delivery in <strong>Shahzad Town</strong> & regular chilled supply across Islamabad at <strong>Rs. 250 / Litre</strong>.
              </p>
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

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Fresh Products
            </h4>
            <ul className="space-y-2.5 text-sm text-sky-200/90">
              <li>100% Pure Cow Milk (Rs. 250/L)</li>
              <li>Organic Low-Fat Milk</li>
              <li>Clay-Pot Farm Dahi</li>
              <li>Bilona Desi Ghee</li>
              <li>Hand-Churned Butter</li>
              <li>Farmhouse Paneer</li>
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
                <span>Shahzad Town / Park Road, Islamabad</span>
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
                <span>orders@farmfreshdairy.pk</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-white transition-colors font-mono"
              >
                Admin CMS Access
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-300/60 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Farm Fresh Dairy. 100% Original Milk. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sky-200">Freshness You Can Trust, Quality You Deserve</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
