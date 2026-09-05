import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Truck, Clock, ArrowLeft } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/supabase/api';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductDetailClient } from './product-detail-client';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — Farm Fresh Dairy`,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [product.primary_image || ''],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-earth-600 hover:text-farm-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Media Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-earth-200 shadow-float bg-earth-200">
              <Image
                src={product.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80'}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.category && (
                <span className="absolute top-6 left-6 bg-cream-100/90 backdrop-blur-md text-earth-800 text-xs font-mono font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-earth-200 shadow-sm">
                  {product.category.name}
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-earth-300">
                    <Image src={img.image_url} alt="Product view" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Interactive Client Form */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-farm-700 bg-farm-100 px-3 py-1 rounded-full">
                  {product.stock > 0 ? 'In Stock Daily' : 'Out of Stock'}
                </span>
                <span className="text-xs font-mono text-earth-500">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-earth-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-farm-900">
                  {product.currency} {product.price}
                </span>
                {product.compare_at_price && (
                  <span className="text-base text-earth-400 line-through font-mono">
                    {product.currency} {product.compare_at_price}
                  </span>
                )}
                <span className="text-xs text-earth-500 font-mono">/ {product.unit} ({product.weight_volume})</span>
              </div>
            </div>

            <p className="text-earth-700 text-base leading-relaxed border-t border-b border-earth-200/80 py-6">
              {product.full_description || product.short_description}
            </p>

            {/* Client Add to Cart Component */}
            <ProductDetailClient product={product} />

            {/* Value Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-cream-200/60 border border-earth-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-farm-700 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-earth-900">100% Pure</div>
                  <div className="text-earth-600">Zero Additives</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-200/60 border border-earth-200 flex items-center gap-3">
                <Truck className="w-5 h-5 text-farm-700 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-earth-900">Chilled Fleet</div>
                  <div className="text-earth-600">Doorstep Delivery</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-200/60 border border-earth-200 flex items-center gap-3">
                <Clock className="w-5 h-5 text-farm-700 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-earth-900">Fresh Daily</div>
                  <div className="text-earth-600">6 AM - 9 AM</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8 pt-12 border-t border-earth-200">
            <h2 className="font-serif text-3xl font-bold text-earth-900">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
