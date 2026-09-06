'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/cart-context';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const formattedPrice = `Rs. ${product.price}`;
  const formattedComparePrice = product.compare_at_price && product.compare_at_price > product.price
    ? `Rs. ${product.compare_at_price}`
    : null;
  const discountDiff = product.compare_at_price && product.compare_at_price > product.price
    ? product.compare_at_price - product.price
    : null;

  return (
    <div className="group rounded-3xl bg-white border border-farm-200/90 hover:border-farm-400 shadow-soft hover:shadow-float transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
      <div className="flex flex-col flex-1">
        {/* Product Image Link */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-[4/3] bg-earth-100 overflow-hidden"
        >
          <Image
            src={product.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.category && (
            <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md text-farm-900 text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-farm-200 shadow-xs">
              {product.category.name}
            </span>
          )}
          {discountDiff && (
            <span className="absolute top-3.5 right-3.5 bg-brand-yellow text-farm-950 text-[10px] sm:text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-md border border-yellow-400/80">
              Save Rs. {discountDiff}
            </span>
          )}
        </Link>

        {/* Content Section */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase text-earth-500 truncate">
              {product.weight_volume || `Per ${product.unit}`}
            </span>
            <span className="text-[10px] font-mono font-bold text-farm-800 bg-farm-100/90 border border-farm-200 px-2 py-0.5 rounded-full shrink-0">
              {product.stock > 0 ? 'In Stock Daily' : 'Out of Stock'}
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-farm-800 transition-colors">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-earth-900 leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-earth-600 text-xs sm:text-sm line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] leading-relaxed">
            {product.short_description || product.description || '100% pure organic farm dairy, certified fresh and unadulterated.'}
          </p>
        </div>
      </div>

      {/* Footer Price & Clean ADD Button Row */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3.5 flex items-center justify-between gap-3 border-t border-earth-100 mt-auto bg-cream-50/50">
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-serif text-xl sm:text-2xl font-bold text-farm-950">
              {formattedPrice}
            </span>
            {formattedComparePrice && (
              <span className="text-xs text-earth-400 line-through font-mono">
                {formattedComparePrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-earth-500 font-mono">
            / {product.unit || 'litre'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product, 1);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-farm-800 hover:bg-farm-900 active:scale-95 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md shrink-0"
          title={`Add ${product.name} to Cart`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-brand-yellow fill-current" />
          <span>ADD</span>
        </button>
      </div>
    </div>
  );
}
