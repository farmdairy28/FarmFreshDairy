'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/cart-context';

export function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between sm:justify-start border-2 border-earth-300 rounded-full bg-cream-100 p-1 shrink-0">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-earth-700 hover:text-farm-800 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-5 font-serif font-bold text-lg text-earth-900 text-center min-w-[2.5rem]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-earth-700 hover:text-farm-800 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={() => addToCart(product, quantity)}
          className="flex-1 inline-flex items-center justify-center gap-3 py-4 px-6 sm:px-8 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 text-center"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Add To Cart — {product.currency} {product.price * quantity}</span>
        </button>
      </div>
    </div>
  );
}
