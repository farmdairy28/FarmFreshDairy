'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, X, Sparkles, ShieldCheck, Facebook, Instagram } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneDisplay = SOCIAL_LINKS.phoneDisplay;
  const phoneRaw = SOCIAL_LINKS.phoneRaw;
  const whatsappUrl = SOCIAL_LINKS.whatsapp;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="w-80 rounded-2xl bg-white/95 backdrop-blur-md border border-farm-300 shadow-float p-5 animate-slide-up text-earth-900 mb-2">
          <div className="flex items-center justify-between pb-3 border-b border-earth-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-earth-900 leading-tight">
                  Farm Fresh Dairy
                </h4>
                <span className="text-[10px] text-emerald-600 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Quick Order Desk Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-earth-400 hover:text-earth-700 hover:bg-earth-100 transition-colors"
              aria-label="Close Quick Order Widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-earth-600 mb-4 leading-relaxed">
            Order 100% Pure Cow Milk at <strong>Rs. 250 / Litre</strong>. Free Home Delivery in Shahzad Town & across Islamabad!
          </p>

          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Order on WhatsApp ({phoneDisplay})
            </a>

            <a
              href={`tel:${phoneRaw}`}
              className="w-full py-2.5 px-4 rounded-xl bg-farm-100 hover:bg-farm-200 text-farm-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-farm-300 transition-colors"
            >
              <Phone className="w-4 h-4 text-farm-700" />
              Call Helpline: {phoneDisplay}
            </a>

            {/* Social Media Links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#1877F2] hover:text-white border border-slate-200 hover:border-[#1877F2] text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors group shadow-2xs"
              >
                <Facebook className="w-3.5 h-3.5 text-[#1877F2] group-hover:text-white" />
                <span>Facebook</span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-gradient-to-tr hover:from-[#833AB4] hover:to-[#F77737] hover:text-white border border-slate-200 hover:border-transparent text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors group shadow-2xs"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C] group-hover:text-white" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-earth-100 flex items-center justify-between text-[10px] font-mono text-earth-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-farm-600" /> Lab Certified
            </span>
            <span>Chilled Morning Delivery</span>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-farm-200 shadow-md text-xs font-mono text-earth-800 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Order Now: <strong>{phoneDisplay}</strong></span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none"
          aria-label="Order via WhatsApp or Call"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 fill-current" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-farm-600 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
