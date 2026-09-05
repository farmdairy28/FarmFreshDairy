import { Product, Category, Testimonial } from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_TESTIMONIALS } from './mock-data';

declare global {
  // eslint-disable-next-line no-var
  var __ffd_products_store: Product[] | undefined;
  // eslint-disable-next-line no-var
  var __ffd_categories_store: Category[] | undefined;
  // eslint-disable-next-line no-var
  var __ffd_testimonials_store: Testimonial[] | undefined;
}

if (!globalThis.__ffd_products_store) {
  globalThis.__ffd_products_store = [...INITIAL_PRODUCTS];
}

if (!globalThis.__ffd_categories_store) {
  globalThis.__ffd_categories_store = [...INITIAL_CATEGORIES];
}

if (!globalThis.__ffd_testimonials_store) {
  globalThis.__ffd_testimonials_store = [...INITIAL_TESTIMONIALS];
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
  const cleanId = (productId || '').trim();
  if (!cleanId) return;
  const store = getServerProductsStore();
  globalThis.__ffd_products_store = store.filter(
    (p) => p.id !== cleanId && p.slug !== cleanId
  );
}

export function getServerCategoriesStore(): Category[] {
  if (!globalThis.__ffd_categories_store || globalThis.__ffd_categories_store.length === 0) {
    globalThis.__ffd_categories_store = [...INITIAL_CATEGORIES];
  }
  return globalThis.__ffd_categories_store;
}

export function upsertServerCategory(category: Category): void {
  const store = getServerCategoriesStore();
  const existingIdx = store.findIndex((c) => c.id === category.id || (category.slug && c.slug === category.slug));
  if (existingIdx > -1) {
    store[existingIdx] = { ...store[existingIdx], ...category };
  } else {
    store.push(category);
  }
}

export function deleteServerCategory(categoryId: string): void {
  const store = getServerCategoriesStore();
  const idx = store.findIndex((c) => c.id === categoryId);
  if (idx > -1) {
    store.splice(idx, 1);
  }
}

export function getServerTestimonialsStore(): Testimonial[] {
  if (!globalThis.__ffd_testimonials_store || globalThis.__ffd_testimonials_store.length === 0) {
    globalThis.__ffd_testimonials_store = [...INITIAL_TESTIMONIALS];
  }
  return globalThis.__ffd_testimonials_store;
}

export function upsertServerTestimonial(testimonial: Testimonial): void {
  const store = getServerTestimonialsStore();
  const existingIdx = store.findIndex((t) => t.id === testimonial.id);
  if (existingIdx > -1) {
    store[existingIdx] = { ...store[existingIdx], ...testimonial };
  } else {
    store.unshift(testimonial);
  }
}

export function deleteServerTestimonial(testimonialId: string): void {
  const store = getServerTestimonialsStore();
  const idx = store.findIndex((t) => t.id === testimonialId);
  if (idx > -1) {
    store.splice(idx, 1);
  }
}

