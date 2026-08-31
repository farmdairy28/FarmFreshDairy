'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/cart-context';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group rounded-3xl bg-cream-100 border border-earth-200 shadow-soft hover:shadow-float transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-earth-100 overflow-hidden">
          <Image
            src={product.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.category && (
            <span className="absolute top-4 left-4 bg-cream-100/90 backdrop-blur-md text-earth-800 text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-earth-200">
              {product.category.name}
            </span>
          )}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="absolute top-4 right-4 bg-gold-500 text-cream-100 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-sm">
              Save {product.currency}{product.compare_at_price - product.price}
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-earth-500">
              {product.weight_volume || `Per ${product.unit}`}
            </span>
            <span className="text-[11px] font-mono font-semibold text-farm-700 bg-farm-100 px-2 py-0.5 rounded">
              {product.stock > 0 ? 'In Stock Daily' : 'Out of Stock'}
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-farm-800 transition-colors">
            <h3 className="font-serif text-xl font-bold text-earth-900 leading-tight">
              {product.name}
            </h3>
          </Link>

          <p className="text-earth-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add to Cart */}
      <div className="px-6 pb-6 pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-earth-200/50 mt-2">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-serif text-xl sm:text-2xl font-bold text-farm-900">
            {product.currency} {product.price}
          </span>
          {product.compare_at_price && (
            <span className="text-xs text-earth-400 line-through font-mono">
              {product.currency} {product.compare_at_price}
            </span>
          )}
          <span className="text-[10px] text-earth-500 font-mono">/ {product.unit}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/products/${product.slug}`}
            className="p-2 rounded-full text-earth-600 hover:text-earth-900 hover:bg-earth-200/60 transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
