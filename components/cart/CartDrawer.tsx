'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-earth-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-96 md:w-[28rem] bg-cream-100 shadow-2xl flex flex-col border-l border-earth-200">
          
          {/* Header */}
          <div className="p-6 border-b border-earth-200 flex items-center justify-between bg-cream-50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-farm-700" />
              <h2 className="font-serif font-bold text-xl text-earth-900">
                Your Basket ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-earth-600 hover:bg-earth-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-200 text-earth-500 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif text-lg text-earth-800 font-medium">
                  Your cart is currently empty
                </p>
                <p className="text-xs text-earth-500 max-w-xs mx-auto">
                  Add fresh whole milk, dahi, or desi ghee from our farm collection.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-farm-700 text-cream-100 text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 rounded-2xl bg-cream-50 border border-earth-200/80 shadow-soft"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl bg-earth-200 overflow-hidden shrink-0">
                    <Image
                      src={product.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-earth-900 leading-tight">
                          {product.name}
                        </h4>
                        <span className="text-[10px] font-mono text-earth-500 uppercase">
                          {product.currency} {product.price} / {product.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-earth-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-earth-300 rounded-full bg-cream-100">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:text-farm-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-earth-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 hover:text-farm-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="font-serif font-bold text-base text-farm-900">
                        {product.currency} {product.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-earth-200 bg-cream-50 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-earth-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">Rs. {cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-earth-600">
                  <span>Morning Delivery</span>
                  <span className="font-mono text-farm-700 font-bold uppercase text-xs">FREE</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-lg text-earth-900 pt-2 border-t border-earth-200">
                  <span>Total Amount</span>
                  <span className="text-farm-900">Rs. {cartSubtotal}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-bold text-sm uppercase tracking-wider transition-all shadow-md"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center text-[11px] font-mono text-earth-500">
                Cash on Delivery • Free Doorstep Morning Delivery
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
