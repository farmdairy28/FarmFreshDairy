import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from './mock-data';

declare global {
  // eslint-disable-next-line no-var
  var __ffd_products_store: Product[] | undefined;
}

if (!globalThis.__ffd_products_store) {
  globalThis.__ffd_products_store = [...INITIAL_PRODUCTS];
}

export function getServerProductsStore(): Product[] {
  if (!globalThis.__ffd_products_store || globalThis.__ffd_products_store.length === 0) {
    globalThis.__ffd_products_store = [...INITIAL_PRODUCTS];
  }
  return globalThis.__ffd_products_store;
}

export function upsertServerProduct(product: Product): void {
  const normalized: Product = { ...product };
  if (normalized.primary_image && (!normalized.images || normalized.images.length === 0)) {
    normalized.images = [
      {
        id: `img-${Date.now()}`,
        product_id: normalized.id,
        image_url: normalized.primary_image,
        is_primary: true,
        sort_order: 1,
      },
    ];
  } else if (normalized.images && normalized.images.length > 0 && !normalized.primary_image) {
    normalized.primary_image =
      normalized.images.find((img) => img.is_primary)?.image_url || normalized.images[0].image_url;
  }

  const store = getServerProductsStore();
  const existingIdx = store.findIndex((p) => p.id === normalized.id || (normalized.slug && p.slug === normalized.slug));
  if (existingIdx > -1) {
    store[existingIdx] = { ...store[existingIdx], ...normalized };
  } else {
    store.unshift(normalized);
  }
}

export function deleteServerProduct(productId: string): void {
  const store = getServerProductsStore();
  const idx = store.findIndex((p) => p.id === productId);
  if (idx > -1) {
    store.splice(idx, 1);
  }
}
