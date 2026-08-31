import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-farm-900 text-cream-200 pt-20 pb-12 border-t border-farm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-farm-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-100 text-farm-900 font-serif font-bold text-lg flex items-center justify-center">
                P
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-cream-100">
                PURE PASTURES
              </span>
            </div>
            <p className="text-earth-400 text-sm leading-relaxed max-w-sm">
              Pasture-raised, unadulterated fresh dairy delivered from our organic farm directly to your family breakfast table every morning.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-farm-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Daily Milking & Chilled Morning Delivery
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-farm-400 font-semibold">
              Explore Farm
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-cream-100 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-cream-100 transition-colors">
                  Farm Process
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-cream-100 transition-colors">
                  Fresh Products
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-cream-100 transition-colors">
                  Delivery Coverage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream-100 transition-colors">
                  Visit Farm
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-farm-400 font-semibold">
              Fresh Products
            </h4>
            <ul className="space-y-2.5 text-sm text-earth-300">
              <li>Pure Farm Whole Milk</li>
              <li>Organic Low-Fat Milk</li>
              <li>Clay-Pot Farm Dahi</li>
              <li>Bilona Desi Ghee</li>
              <li>Hand-Churned Butter</li>
              <li>Farmhouse Paneer</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-farm-400 font-semibold">
              Farm Desk
            </h4>
            <ul className="space-y-3 text-sm text-earth-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-farm-400 shrink-0 mt-0.5" />
                <span>Park Road, Chak Shahzad Valley, Islamabad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-farm-400 shrink-0" />
                <span>+92 (051) 111-787-332</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-farm-400 shrink-0" />
                <span>fresh@purepasturesfarm.com</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 text-xs text-farm-400 hover:text-cream-100 transition-colors font-mono"
              >
                Admin CMS Access
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-earth-500 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Pure Pastures Dairy Farm. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-earth-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-earth-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
