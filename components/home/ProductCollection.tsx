'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';

export function ProductCollection({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredProducts = selectedCat === 'all'
    ? products
    : products.filter((p) => p.category_id === selectedCat || p.category?.slug === selectedCat);

  return (
    <section className="py-24 bg-cream-100 border-t border-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
              DYNAMIC FARM SELECTION
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
              Fresh From Our Farm
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-farm-800 hover:text-farm-900 group"
          >
            View Full Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-5 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border ${
              selectedCat === 'all'
                ? 'bg-farm-700 text-cream-100 border-farm-700'
                : 'bg-cream-200/60 text-earth-700 border-earth-300 hover:bg-cream-200'
            }`}
          >
            All Dairy ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                selectedCat === cat.id
                  ? 'bg-farm-700 text-cream-100 border-farm-700'
                  : 'bg-cream-200/60 text-earth-700 border-earth-300 hover:bg-cream-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-cream-200/40 rounded-3xl border border-earth-200">
            <p className="text-earth-600 font-serif text-lg">
              Our fresh collection is being prepared for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
