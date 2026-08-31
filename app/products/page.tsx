import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/supabase/api';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilterControls } from '@/components/products/ProductFilterControls';

export const metadata = {
  title: 'Fresh Farm Products — Pure Pastures Dairy',
  description: 'Browse our complete dynamic collection of fresh pasture milk, clay-pot dahi, bilona desi ghee, paneer, and malai.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string };
}) {
  const categoryParam = searchParams.category || 'all';
  const searchQuery = searchParams.search || '';
  const sortParam = searchParams.sort || 'default';

  const categories = await getCategories();
  let products = await getProducts({
    categorySlug: categoryParam,
    search: searchQuery,
  });

  if (sortParam === 'price-low') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortParam === 'price-high') {
    products = [...products].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            100% PURE & UNADULTERATED
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Fresh Farm Products
          </h1>
          <p className="text-earth-600 text-base sm:text-lg">
            Directly from our pasture herd. Chilled within minutes of milking and delivered to your home every morning.
          </p>
        </div>

        {/* Search & Filters Controls with Suspense */}
        <Suspense fallback={<div className="h-32 bg-cream-200/40 rounded-3xl animate-pulse mb-10"></div>}>
          <ProductFilterControls categories={categories} />
        </Suspense>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-cream-200/40 rounded-3xl border border-earth-200 space-y-3">
            <h3 className="font-serif text-2xl font-bold text-earth-800">
              No products found
            </h3>
            <p className="text-earth-600 text-sm max-w-sm mx-auto">
              Our fresh collection is being prepared or try adjusting your search filters.
            </p>
            <a
              href="/products"
              className="inline-block mt-4 px-6 py-2.5 rounded-full bg-farm-700 text-cream-100 text-xs font-semibold uppercase"
            >
              Clear Filters
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
