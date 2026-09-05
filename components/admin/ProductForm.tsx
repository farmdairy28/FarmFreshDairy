'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, CheckCircle2, AlertCircle, Trash2, Plus, FolderPlus, X } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { getCategories, saveProduct } from '@/lib/supabase/api';
import { uploadProductImageAction } from '@/app/actions/storage';
import { saveProductAction } from '@/app/actions/products';
import { saveCategoryAction } from '@/app/actions/categories';

const UNIT_PRESETS = [
  { label: 'Dozen', value: 'dozen' },
  { label: 'Kilo / Kg', value: 'kg' },
  { label: 'Litre', value: 'litre' },
  { label: 'Half Dozen', value: 'half dozen' },
  { label: 'Pack', value: 'pack' },
  { label: 'Bottle', value: 'bottle' },
  { label: 'Grams', value: 'grams' },
  { label: 'Piece', value: 'piece' },
  { label: 'Box', value: 'box' },
  { label: 'Pot / Handi', value: 'pot' },
];

const WEIGHT_VOLUME_PRESETS = [
  '1 Litre Glass Bottle',
  '1 Kg Pack',
  '1 Dozen Fresh Eggs',
  '1/2 Dozen Eggs',
  '500g Clay Handi',
  '1 Kg Sealed Pouch',
  '250g Jar',
  '5 Litre Family Can',
];

export function ProductForm({ initialProduct }: { initialProduct?: Product }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formError, setFormError] = useState('');

  // Quick category modal state
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLoading, setNewCatLoading] = useState(false);
  const [newCatError, setNewCatError] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    short_description: initialProduct?.short_description || '',
    full_description: initialProduct?.full_description || '',
    price: initialProduct?.price || 260,
    compare_at_price: initialProduct?.compare_at_price || 280,
    currency: initialProduct?.currency || 'Rs.',
    category_id: initialProduct?.category_id || '',
    sku: initialProduct?.sku || `SKU-${Date.now().toString().slice(-4)}`,
    unit: initialProduct?.unit || 'litre',
    weight_volume: initialProduct?.weight_volume || '1 Litre Glass Bottle',
    stock: initialProduct?.stock !== undefined ? initialProduct.stock : 100,
    is_active: initialProduct?.is_active !== undefined ? initialProduct.is_active : true,
    is_featured: initialProduct?.is_featured !== undefined ? initialProduct.is_featured : false,
    show_on_homepage: initialProduct?.show_on_homepage !== undefined ? initialProduct.show_on_homepage : true,
    primary_image: initialProduct?.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
    seo_title: initialProduct?.seo_title || '',
    seo_description: initialProduct?.seo_description || '',
  });

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: initialProduct?.id ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const result = await uploadProductImageAction(uploadData);

      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, primary_image: result.url }));
      } else {
        setUploadError(result.error || 'Failed to upload image to Supabase Storage.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload error.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleQuickAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setNewCatLoading(true);
    setNewCatError('');

    try {
      const res = await saveCategoryAction({
        name: newCatName.trim(),
        slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        is_active: true,
      });

      if (res.success && res.category) {
        await loadCategories();
        setFormData((prev) => ({ ...prev, category_id: res.category!.id }));
        setNewCatName('');
        setShowQuickCategoryModal(false);
      } else {
        setNewCatError(res.error || 'Failed to create category');
      }
    } catch (err: any) {
      setNewCatError(err.message || 'Error creating category');
    } finally {
      setNewCatLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    try {
      const payload = {
        ...formData,
        id: initialProduct?.id,
      };

      // 1. Save via Server Action for database persistence
      const actionResult = await saveProductAction(payload);

      if (!actionResult.success && actionResult.error) {
        // Fallback to local storage API if database connection failed
        await saveProduct(payload);
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Basic Product Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Fresh Farm Whole Milk, Pure Desi Ghee"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Product Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. fresh-farm-whole-milk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Short Description *
          </label>
          <input
            type="text"
            required
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Pure, creamy and fresh milk delivered daily from our farm."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Full Description
          </label>
          <textarea
            rows={4}
            value={formData.full_description}
            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
            placeholder="Detailed pasture feeding story, nutrition benefits, and storage instructions..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Pricing & Inventory</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Selling Price (Rs.) *
            </label>
            <input
              type="number"
              required
              min={1}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Compare At / Original Price (Optional)
            </label>
            <input
              type="number"
              value={formData.compare_at_price || ''}
              onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g. 280"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Custom Unit Configuration */}
        <div className="pt-2 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Product Unit (Customizable) *
              </label>
              <span className="text-[11px] text-slate-500 font-mono">e.g. dozen, kilo, kg, litre, pack</span>
            </div>

            {/* Quick Unit Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {UNIT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, unit: preset.value }))}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                    formData.unit?.toLowerCase() === preset.value.toLowerCase()
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="Type any custom unit (e.g. dozen, kilo, 500g, crate)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Weight / Volume / Packaging Label
                </label>
              </div>

              {/* Weight volume quick suggestions */}
              <div className="flex flex-wrap gap-1 mb-2">
                {WEIGHT_VOLUME_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, weight_volume: preset }))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={formData.weight_volume || ''}
                onChange={(e) => setFormData({ ...formData, weight_volume: e.target.value })}
                placeholder="e.g. 1 Litre Glass Bottle, 1 Dozen Fresh Eggs, 1 Kg Pack"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Stock Quantity (Available Units) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category & Visibility */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Category & Visibility</h3>
          <button
            type="button"
            onClick={() => setShowQuickCategoryModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            + Quick Add Category
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Category
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Category (Optional)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            Active Product (Visible in Store)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            Featured Product (Badge & Highlights)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={formData.show_on_homepage}
              onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            Show on Homepage Carousel
          </label>
        </div>
      </div>

      {/* Supabase Storage Media Upload */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Product Media & Storage Upload</h3>

        {uploadError && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Image Upload Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-6">{uploadError}</p>
            <p className="text-[11px] text-amber-700 pl-6 font-medium">
              💡 <strong>Alternative:</strong> You can directly paste any online image link into the <strong>&quot;Image Public URL&quot;</strong> input below.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase">
            Upload Image to Supabase Storage (Bucket: product-images)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-300"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              {uploadingImage ? 'Uploading to Supabase Storage...' : 'Upload Image File'}
            </button>
            <span className="text-[11px] text-slate-500">Max 5MB (JPG, PNG, WEBP)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 mt-3">
              Image Public URL
            </label>
            <input
              type="text"
              required
              value={formData.primary_image}
              onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {formData.primary_image && (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-300 group">
            <img src={formData.primary_image} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, primary_image: '' }))}
              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SEO Information */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Search Engine Optimization (SEO)</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            SEO Title
          </label>
          <input
            type="text"
            value={formData.seo_title || ''}
            onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
            placeholder="Fresh Farm Whole Milk - Farm Fresh Dairy Islamabad"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            SEO Description
          </label>
          <textarea
            rows={2}
            value={formData.seo_description || ''}
            onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
            placeholder="Order pure raw pasture milk delivered daily to your doorstep..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm uppercase transition-colors shadow-md"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving Product to Database...' : 'Save Product Record'}
        </button>
      </div>

      {/* Quick Add Category Modal */}
      {showQuickCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-emerald-600" />
                Add New Category
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newCatError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                {newCatError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Organic Eggs, Dairy Sweets, Paneer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuickCategoryModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickAddCategory}
                disabled={newCatLoading || !newCatName.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
              >
                {newCatLoading ? 'Creating...' : 'Create & Select'}
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  );
}
