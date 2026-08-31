import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/supabase/api';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Edit Product: {product.name}</h2>
        <p className="text-xs text-slate-500 font-mono">Update pricing, inventory, SEO, or media</p>
      </div>

      <ProductForm initialProduct={product} />
    </div>
  );
}
