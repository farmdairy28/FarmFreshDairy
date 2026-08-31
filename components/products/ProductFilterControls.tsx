'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Category } from '@/lib/types';

export function ProductFilterControls({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'default';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const applyFilters = (newCategory?: string, newSort?: string, newSearch?: string) => {
    const params = new URLSearchParams();
    const cat = newCategory !== undefined ? newCategory : currentCategory;
    const sort = newSort !== undefined ? newSort : currentSort;
    const search = newSearch !== undefined ? newSearch : searchTerm;

    if (cat && cat !== 'all') params.set('category', cat);
    if (sort && sort !== 'default') params.set('sort', sort);
    if (search.trim()) params.set('search', search.trim());

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(undefined, undefined, searchTerm);
  };

  return (
    <div className="p-6 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft mb-10 space-y-6">
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-earth-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search milk, ghee, dahi, paneer..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-cream-100 border border-earth-300 text-earth-900 text-xs focus:outline-none focus:ring-2 focus:ring-farm-600"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-4">
          <select
            value={currentSort}
            onChange={(e) => applyFilters(undefined, e.target.value, undefined)}
            className="w-full px-4 py-3 rounded-full bg-cream-100 border border-earth-300 text-earth-900 text-xs focus:outline-none focus:ring-2 focus:ring-farm-600"
          >
            <option value="default">Default Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Filter Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-full bg-farm-700 hover:bg-farm-800 disabled:opacity-60 text-cream-100 font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            {isPending ? 'Filtering...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-earth-300/60 pt-4">
        <button
          type="button"
          onClick={() => applyFilters('all', undefined, undefined)}
          className={`px-4 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors ${
            currentCategory === 'all'
              ? 'bg-farm-700 text-cream-100 border-farm-700'
              : 'bg-cream-100 text-earth-700 border-earth-300 hover:bg-cream-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => applyFilters(cat.slug, undefined, undefined)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap border transition-colors ${
              currentCategory === cat.slug || currentCategory === cat.id
                ? 'bg-farm-700 text-cream-100 border-farm-700'
                : 'bg-cream-100 text-earth-700 border-earth-300 hover:bg-cream-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
