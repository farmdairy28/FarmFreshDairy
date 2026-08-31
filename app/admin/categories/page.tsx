'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Save } from 'lucide-react';
import { Category } from '@/lib/types';
import { getAllCategoriesAdmin, saveCategory } from '@/lib/supabase/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCats = async () => {
    const data = await getAllCategoriesAdmin();
    setCategories(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    await saveCategory({ name, description });
    setName('');
    setDescription('');
    setLoading(false);
    fetchCats();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Category Management</h2>
        <p className="text-xs text-slate-500 font-mono">Organize dairy products into categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Create Form */}
        <form onSubmit={handleAdd} className="md:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            Add New Category
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fresh Milk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category overview..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase transition-colors shadow-sm"
          >
            {loading ? 'Creating...' : 'Save Category'}
          </button>
        </form>

        {/* Existing Categories */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Existing Categories ({categories.length})
          </h3>

          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Slug: {c.slug}</div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
