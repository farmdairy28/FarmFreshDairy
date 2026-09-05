'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();

  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            YOUR DAILY SELECTION
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Shopping Cart ({cartCount})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-cream-200/50 rounded-3xl border border-earth-200 space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-100 text-earth-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-earth-900">
              Your cart is currently empty
            </h2>
            <p className="text-earth-600 text-sm max-w-sm mx-auto">
              Add fresh farm whole milk, clay-pot dahi, or pure desi ghee to start your order.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3.5 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-6 rounded-3xl bg-cream-50 border border-earth-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="relative w-20 h-20 rounded-2xl bg-earth-200 overflow-hidden shrink-0">
                      <Image
                        src={product.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-lg text-earth-900">
                        {product.name}
                      </h3>
                      <div className="text-xs font-mono text-earth-500">
                        {product.currency} {product.price} / {product.unit} ({product.weight_volume})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-earth-200">
                    <div className="flex items-center border border-earth-300 rounded-full bg-cream-100">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-2 hover:text-farm-700 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-mono font-bold text-sm text-earth-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-2 hover:text-farm-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-serif font-bold text-xl text-farm-900">
                        {product.currency} {product.price * quantity}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-earth-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 p-8 rounded-3xl bg-cream-200/60 border border-earth-200 shadow-soft space-y-6">
              <h2 className="font-serif font-bold text-2xl text-earth-900">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm border-t border-b border-earth-300/60 py-4">
                <div className="flex justify-between text-earth-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">Rs. {cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-earth-600">
                  <span>Chilled Delivery</span>
                  <span className="font-mono font-bold text-farm-700 uppercase text-xs">FREE</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-xl text-earth-900 pt-2 border-t border-earth-300/40">
                  <span>Total Payable</span>
                  <span className="text-farm-900">Rs. {cartSubtotal}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-farm-600 hover:bg-farm-700 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/923109361932?text=${encodeURIComponent(
                    `🥛 *FARM FRESH DAIRY ORDER*\n━━━━━━━━━━━━━━━━━━━━\nI would like to order:\n${items.map((it, i) => `${i + 1}. *${it.product.name}* (Qty: ${it.quantity}) = Rs. ${it.product.price * it.quantity}`).join('\n')}\n━━━━━━━━━━━━━━━━━━━━\n💰 *Total:* Rs. ${cartSubtotal}\n🚚 *Delivery:* FREE in Shahzad Town & Islamabad\n\nPlease confirm morning delivery!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Order on WhatsApp (0310-9361932)
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
