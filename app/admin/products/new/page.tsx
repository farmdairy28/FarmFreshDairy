import React from 'react';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Add New Product</h2>
        <p className="text-xs text-slate-500 font-mono">Fill in information to publish a new farm dairy product</p>
      </div>

      <ProductForm />
    </div>
  );
}
