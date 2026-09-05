'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowUpRight, Phone, MessageCircle, ShieldCheck, Facebook, Instagram } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { FarmFreshLogo } from './FarmFreshLogo';
import { SOCIAL_LINKS } from '@/lib/constants';

export function Header() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Our Story', href: '/about' },
    { name: 'Process', href: '/process' },
    { name: 'Products', href: '/products' },
    { name: 'Milk Report', href: '/#milk-report' },
    { name: 'Delivery', href: '/delivery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-farm-900 text-sky-100 py-1.5 px-4 text-xs font-mono border-b border-farm-800 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">
              <strong>FREE Home Delivery</strong> in Shahzad Town · Islamabad Delivery Available · <strong>Rs. 250 / Litre</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 shrink-0 text-sky-200">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>WhatsApp: <strong>0310-9361932</strong></span>
            </a>
            <span className="text-farm-700">|</span>
            <a href={`tel:${SOCIAL_LINKS.phoneRaw}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-300" />
              <span>0310 9361932</span>
            </a>
            <span className="text-farm-700">|</span>
            <div className="flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook Page"
                title="Follow on Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram Profile"
                title="Follow on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`fixed top-[29px] left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-farm-200/80 py-3 shadow-soft'
            : 'bg-white/80 backdrop-blur-sm py-4 border-b border-farm-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Emblem */}
            <Link href="/" className="group">
              <FarmFreshLogo />
            </Link>

            {/* Desktop Minimal Nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-farm-600 ${
                      isActive ? 'text-farm-600 font-semibold underline underline-offset-8 decoration-farm-500' : 'text-earth-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* WhatsApp Quick Link */}
              <a
                href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300/80 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>0310-9361932</span>
              </a>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full text-earth-800 hover:bg-farm-100 transition-colors"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-farm-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Order Fresh CTA */}
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-farm-600 hover:bg-farm-700 rounded-full transition-all shadow-sm hover:shadow"
              >
                Order Milk
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-earth-800 hover:bg-farm-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white animate-fade-in">
          <div className="flex items-center justify-between px-6 py-5 border-b border-earth-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <FarmFreshLogo />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-earth-800 hover:bg-earth-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl font-medium text-earth-900 hover:text-farm-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-earth-500 font-mono pt-4 border-t border-earth-200"
              >
                Admin CMS Portal
              </Link>
            </nav>

            <div className="pt-6 border-t border-earth-200 flex flex-col gap-3">
              <a
                href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Order on WhatsApp (0310-9361932)
              </a>

              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-farm-600 text-white font-medium text-sm shadow-sm"
              >
                Order Fresh Dairy (Rs. 250/L)
              </Link>
              <div className="text-center text-xs text-earth-500 font-mono">
                Morning &amp; Evening Chilled Delivery
              </div>

              {/* Social Media Links in Mobile Drawer */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 text-[#1877F2] font-semibold text-xs border border-blue-200 shadow-2xs"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-50 text-[#E1306C] font-semibold text-xs border border-pink-200 shadow-2xs"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
