import { Product, Category, FarmValue, ProcessStep, DeliveryRegion, Testimonial, Order, HomepageHero, HomepagePromise } from '../types';
import { INITIAL_CATEGORIES, INITIAL_VALUES, INITIAL_PROCESS, INITIAL_DELIVERY, INITIAL_TESTIMONIALS, INITIAL_HERO, INITIAL_PROMISE, INITIAL_ORDERS } from './mock-data';
import { getServerProductsStore, upsertServerProduct, deleteServerProduct, getServerCategoriesStore, upsertServerCategory, getServerTestimonialsStore } from './products-store';
import { createAdminClient } from './admin';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const isClient = typeof window !== 'undefined';

function getDbClient() {
  try {
    const admin = createAdminClient();
    if (admin) return admin;
  } catch (e) {}

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')) {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return null;
}

// Safe helper for optional local persistence during dev mode
function getLocalFallback<T>(key: string, initial: T): T {
  if (!isClient) return initial;
  try {
    const item = localStorage.getItem(`farm_fresh_${key}`) || localStorage.getItem(`pure_pastures_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    return initial;
  }
}

function normalizeProductRecord(p: any): Product {
  const shortDesc = p.short_description || p.description || '';
  const fullDesc = p.full_description || p.description || p.short_description || '';
  return {
    ...p,
    short_description: shortDesc,
    full_description: fullDesc,
    description: p.description || shortDesc || fullDesc,
    primary_image:
      p.images?.find((img: any) => img.is_primary)?.image_url ||
      p.images?.[0]?.image_url ||
      p.primary_image ||
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
  };
}

// ---------------- PRODUCTS ----------------
export async function getProducts(options?: { categorySlug?: string; featuredOnly?: boolean; search?: string }): Promise<Product[]> {
  const normalizeSlug = (s?: string) => (s || '').toLowerCase().replace(/^\/+|\/+$/g, '').trim();
  const targetCategorySlug = options?.categorySlug && options.categorySlug !== 'all'
    ? normalizeSlug(options.categorySlug)
    : null;

  // Source of truth: Supabase DB → server memory store → empty
  const serverStore = getServerProductsStore();
  const allCategories = getServerCategoriesStore();
  const categoryMap = new Map(allCategories.map(c => [c.id, c]));

  let rawList: Product[] = [];

  try {
    const client = getDbClient();
    if (client) {
      const { data, error } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        rawList = (data as any[]).map(normalizeProductRecord);
      }
    }
  } catch (err) {
    console.warn('Database getProducts fetch notice:', err);
  }

  // DB not connected: use server store (admin-added products only, no mocks)
  if (rawList.length === 0) {
    rawList = serverStore.map(normalizeProductRecord);
  } else {
    serverStore.forEach(sp => {
      if (!rawList.some(p => p.id === sp.id || (sp.slug && p.slug === sp.slug))) {
        rawList.push(normalizeProductRecord(sp));
      }
    });
  }

  // Attach category if missing
  rawList.forEach(p => {
    if (!p.category && p.category_id && categoryMap.has(p.category_id)) {
      p.category = categoryMap.get(p.category_id);
    }
  });

  // Filter out inactive products
  let filtered = rawList.filter(p => p.is_active !== false);

  if (options?.featuredOnly) {
    filtered = filtered.filter(p => p.is_featured === true);
  }

  if (targetCategorySlug) {
    filtered = filtered.filter(p => {
      const prodCatSlug = normalizeSlug(p.category?.slug);
      const prodCatId = (p.category_id || '').trim();
      return prodCatSlug === targetCategorySlug || prodCatId === targetCategorySlug;
    });
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.short_description || '').toLowerCase().includes(q) ||
      (p.full_description || '').toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const serverStore = getServerProductsStore();
  const allCategories = getServerCategoriesStore();
  const categoryMap = new Map(allCategories.map(c => [c.id, c]));

  let adminProducts: Product[] = [];

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        adminProducts = (data as any[]).map(normalizeProductRecord);
      }
    }
  } catch (err) {
    console.warn('Admin products DB fetch fallback:', err);
  }

  // Merge server store (admin-created this session) with DB results
  if (adminProducts.length === 0) {
    adminProducts = serverStore.map(normalizeProductRecord);
  } else {
    serverStore.forEach(sp => {
      if (!adminProducts.some(p => p.id === sp.id || (sp.slug && p.slug === sp.slug))) {
        adminProducts.push(normalizeProductRecord(sp));
      }
    });
  }

  // Attach category if missing
  adminProducts.forEach(p => {
    if (!p.category && p.category_id && categoryMap.has(p.category_id)) {
      p.category = categoryMap.get(p.category_id);
    }
  });

  return adminProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) {
        const mapped = normalizeProductRecord(data);
        upsertServerProduct(mapped);
        return mapped;
      }
      // DB connected but no result: product deleted or not found
      if (!error && !data) return null;
    }
  } catch (err) {
    console.warn('Product by slug DB fetch fallback:', err);
  }

  // Only fall back to server store if DB is not configured
  const serverStore = getServerProductsStore();
  const found = serverStore.find(p => p.slug === slug && p.is_active !== false);
  return found ? normalizeProductRecord(found) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const mapped = normalizeProductRecord(data);
        upsertServerProduct(mapped);
        return mapped;
      }
      if (!error && !data) return null;
    }
  } catch (err) {
    console.warn('Product by ID DB fetch fallback:', err);
  }

  const serverStore = getServerProductsStore();
  const found = serverStore.find(p => p.id === id);
  return found ? normalizeProductRecord(found) : null;
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  const serverStore = getServerProductsStore();
  const allCategories = getServerCategoriesStore();
  const categoryObj = allCategories.find(c => c.id === productData.category_id);

  const shortDesc = productData.short_description || (productData as any).description || '';
  const fullDesc = productData.full_description || (productData as any).description || shortDesc || '';

  if (productData.id) {
    const existing = serverStore.find(p => p.id === productData.id);
    if (existing) {
      const updated: Product = normalizeProductRecord({
        ...existing,
        ...productData,
        short_description: shortDesc || existing.short_description,
        full_description: fullDesc || existing.full_description,
        category: categoryObj || existing.category,
        updated_at: new Date().toISOString(),
      });
      upsertServerProduct(updated);
      return updated;
    }
  }

  const newProduct: Product = normalizeProductRecord({
    id: productData.id || `p-${Date.now()}`,
    name: productData.name || 'New Product',
    slug: productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${Date.now()}`),
    short_description: shortDesc,
    full_description: fullDesc,
    description: (productData as any).description || shortDesc || fullDesc,
    price: Number(productData.price) || 0,
    compare_at_price: productData.compare_at_price ? Number(productData.compare_at_price) : undefined,
    currency: productData.currency || 'Rs.',
    category_id: productData.category_id,
    category: categoryObj,
    sku: productData.sku || `SKU-${Date.now().toString().slice(-4)}`,
    unit: productData.unit || 'litre',
    weight_volume: productData.weight_volume || '1 Litre',
    stock: Number(productData.stock) || 100,
    availability: productData.availability !== undefined ? productData.availability : true,
    is_active: productData.is_active !== undefined ? productData.is_active : true,
    is_featured: productData.is_featured !== undefined ? productData.is_featured : false,
    show_on_homepage: productData.show_on_homepage !== undefined ? productData.show_on_homepage : true,
    primary_image: productData.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  upsertServerProduct(newProduct);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const cleanId = (id || '').trim();
  // Remove from server memory store immediately
  deleteServerProduct(cleanId);
  return true;
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  const memoryCats = getServerCategoriesStore();

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      let res = await adminClient
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (res.error && res.error.message?.includes('is_active')) {
        res = await adminClient
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
      }

      if (!res.error && res.data && res.data.length > 0) {
        const dbCats = res.data.map((c: any) => ({
          ...c,
          slug: (c.slug || '').replace(/^\/+|\/+$/g, ''),
          is_active: c.is_active !== undefined ? Boolean(c.is_active) : true,
        })) as Category[];

        const combined = [...dbCats];
        for (const mem of memoryCats) {
          const memSlug = (mem.slug || '').replace(/^\/+|\/+$/g, '');
          const exists = combined.some((c) => c.id === mem.id || (c.slug && c.slug === memSlug));
          if (!exists && mem.is_active !== false) {
            combined.push({ ...mem, slug: memSlug });
          }
        }
        return combined.filter((c) => c.is_active !== false);
      }
    }
  } catch (err) {}

  return memoryCats
    .map(c => ({ ...c, slug: (c.slug || '').replace(/^\/+|\/+$/g, '') }))
    .filter((c) => c.is_active !== false);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const memoryCats = getServerCategoriesStore();

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const res = await adminClient
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!res.error && res.data && res.data.length > 0) {
        const dbCats = res.data.map((c: any) => ({
          ...c,
          slug: (c.slug || '').replace(/^\/+|\/+$/g, ''),
          is_active: c.is_active !== undefined ? Boolean(c.is_active) : true,
        })) as Category[];

        const combined = [...dbCats];
        for (const mem of memoryCats) {
          const exists = combined.some((c) => c.id === mem.id || (c.slug && c.slug === mem.slug));
          if (!exists) combined.push(mem);
        }
        return combined;
      }
    }
  } catch (err) {}

  return memoryCats;
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  const categories = getServerCategoriesStore();
  const newCat: Category = {
    id: categoryData.id || `c-${Date.now()}`,
    name: categoryData.name || 'New Category',
    slug:
      categoryData.slug ||
      categoryData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      `cat-${Date.now()}`,
    description: categoryData.description || '',
    sort_order: categoryData.sort_order || categories.length + 1,
    is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
  };

  upsertServerCategory(newCat);

  if (isClient) localStorage.setItem('pure_pastures_categories', JSON.stringify(getServerCategoriesStore()));
  return newCat;
}

// ---------------- ORDERS ----------------
export async function getOrders(): Promise<Order[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data as Order[];
      }
    }
  } catch (err) {
    console.warn('Orders DB fetch fallback:', err);
  }

  return getLocalFallback<Order[]>('orders', INITIAL_ORDERS);
}

export async function createOrder(orderInput: Omit<Order, 'id' | 'order_number' | 'created_at' | 'status' | 'payment_status'>): Promise<Order> {
  const orders = getLocalFallback<Order[]>('orders', INITIAL_ORDERS);
  const newOrder: Order = {
    ...orderInput,
    id: `ord-${Date.now()}`,
    order_number: `PP-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending',
    payment_status: 'Pending',
    created_at: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  if (isClient) localStorage.setItem('pure_pastures_orders', JSON.stringify(orders));
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  const orders = getLocalFallback<Order[]>('orders', INITIAL_ORDERS);
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    if (status === 'Delivered') {
      orders[idx].payment_status = 'Paid';
    }
    if (isClient) localStorage.setItem('pure_pastures_orders', JSON.stringify(orders));
    return orders[idx];
  }
  return null;
}

// ---------------- FARM VALUES ----------------
export async function getFarmValues(): Promise<FarmValue[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('farm_values')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as FarmValue[];
      }
    }
  } catch (err) {}

  return getLocalFallback<FarmValue[]>('values', INITIAL_VALUES).filter(v => v.is_active);
}

// ---------------- PROCESS STEPS ----------------
export async function getProcessSteps(): Promise<ProcessStep[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('process_steps')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as ProcessStep[];
      }
    }
  } catch (err) {}

  return getLocalFallback<ProcessStep[]>('process', INITIAL_PROCESS).filter(p => p.is_active);
}

// ---------------- DELIVERY REGIONS ----------------
export async function getDeliveryRegions(): Promise<DeliveryRegion[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('delivery_regions')
        .select('*, areas:delivery_areas(*)')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as DeliveryRegion[];
      }
    }
  } catch (err) {}

  return getLocalFallback<DeliveryRegion[]>('delivery', INITIAL_DELIVERY);
}

// ---------------- TESTIMONIALS ----------------
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Testimonial[];
      }
    }
  } catch (err) {}

  const serverStore = getServerTestimonialsStore();
  return serverStore.filter(t => t.is_active);
}

export async function getAllReviewsAdmin(): Promise<Testimonial[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Testimonial[];
      }
    }
  } catch (err) {}

  return getServerTestimonialsStore();
}

// ---------------- HOMEPAGE CMS ----------------
export async function getHomepageHero(): Promise<HomepageHero> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('homepage_sections')
        .select('content_json, title')
        .eq('section_key', 'hero')
        .single();

      if (!error && data && data.content_json) {
        return {
          ...INITIAL_HERO,
          ...data.content_json,
          heading: data.title || data.content_json.heading || INITIAL_HERO.heading,
        };
      }
    }
  } catch (err) {}

  return getLocalFallback<HomepageHero>('cms_hero', INITIAL_HERO);
}

export async function saveHomepageHero(hero: HomepageHero): Promise<HomepageHero> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      await adminClient
        .from('homepage_sections')
        .upsert({
          section_key: 'hero',
          title: hero.heading,
          content_json: hero,
          is_active: true,
          updated_at: new Date().toISOString(),
        });
    }
  } catch (err) {}

  if (isClient) localStorage.setItem('pure_pastures_cms_hero', JSON.stringify(hero));
  return hero;
}

export async function getHomepagePromise(): Promise<HomepagePromise> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('homepage_sections')
        .select('content_json, title, subtitle')
        .eq('section_key', 'promise')
        .single();

      if (!error && data && data.content_json) {
        return {
          ...INITIAL_PROMISE,
          ...data.content_json,
          heading: data.title || data.content_json.heading || INITIAL_PROMISE.heading,
          subtitle: data.subtitle || data.content_json.subtitle || INITIAL_PROMISE.subtitle,
        };
      }
    }
  } catch (err) {}

  return getLocalFallback<HomepagePromise>('cms_promise', INITIAL_PROMISE);
}

export async function saveHomepagePromise(promise: HomepagePromise): Promise<HomepagePromise> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      await adminClient
        .from('homepage_sections')
        .upsert({
          section_key: 'promise',
          title: promise.heading,
          subtitle: promise.subtitle,
          content_json: promise,
          is_active: true,
          updated_at: new Date().toISOString(),
        });
    }
  } catch (err) {}

  if (isClient) localStorage.setItem('pure_pastures_cms_promise', JSON.stringify(promise));
  return promise;
}
