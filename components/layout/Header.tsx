'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

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
    { name: 'Delivery', href: '/delivery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream-100/90 backdrop-blur-md border-b border-earth-200/60 py-3.5 shadow-soft'
            : 'bg-cream-100/60 backdrop-blur-sm py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Emblem */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-farm-700 flex items-center justify-center text-cream-100 font-serif font-bold text-lg group-hover:bg-farm-600 transition-colors shadow-sm">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold tracking-tight text-earth-900 text-lg leading-none">
                  PURE PASTURES
                </span>
                <span className="text-[10px] tracking-widest text-earth-500 uppercase font-mono mt-0.5">
                  Dairy Farm Est. 1998
                </span>
              </div>
            </Link>

            {/* Desktop Minimal Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-farm-700 ${
                      isActive ? 'text-farm-700 font-semibold underline underline-offset-8 decoration-farm-500' : 'text-earth-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full text-earth-800 hover:bg-earth-200/50 transition-colors"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-farm-700 text-cream-100 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-cream-100 animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Visit Us CTA */}
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cream-100 bg-farm-700 hover:bg-farm-800 rounded-full transition-all shadow-sm hover:shadow"
              >
                Visit Us
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-earth-800 hover:bg-earth-200/50 transition-colors"
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
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-cream-100 animate-fade-in">
          <div className="flex items-center justify-between px-6 py-5 border-b border-earth-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-farm-700 flex items-center justify-center text-cream-100 font-serif font-bold text-base">
                P
              </div>
              <span className="font-serif font-bold tracking-tight text-earth-900 text-lg">
                PURE PASTURES
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-earth-800 hover:bg-earth-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl font-medium text-earth-900 hover:text-farm-700 transition-colors"
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
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-full bg-farm-700 text-cream-100 font-medium text-sm shadow-sm"
              >
                Order Fresh Dairy
              </Link>
              <div className="text-center text-xs text-earth-500 font-mono">
                Morning Chilled Delivery 6:00 AM - 9:00 AM
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
