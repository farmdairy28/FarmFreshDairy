import { Product, Category, FarmValue, ProcessStep, DeliveryRegion, Testimonial, Order, HomepageHero, HomepagePromise } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_VALUES, INITIAL_PROCESS, INITIAL_DELIVERY, INITIAL_TESTIMONIALS, INITIAL_HERO, INITIAL_PROMISE, INITIAL_ORDERS } from './mock-data';
import { getServerProductsStore, upsertServerProduct, deleteServerProduct, isProductDeleted, getServerCategoriesStore, upsertServerCategory, getServerTestimonialsStore } from './products-store';
import { createAdminClient } from './admin';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const isClient = typeof window !== 'undefined';

function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str.trim());
}

function getClientDeletedIds(): Set<string> {
  const set = new Set<string>();
  if (!isClient) return set;
  try {
    const raw = localStorage.getItem('farm_fresh_deleted_product_ids');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((item: string) => {
          if (item) {
            set.add(item);
            set.add(item.toLowerCase());
          }
        });
      }
    }
  } catch (_) {}
  return set;
}

function addClientDeletedId(idOrSlug: string) {
  if (!isClient || !idOrSlug) return;
  try {
    const set = getClientDeletedIds();
    set.add(idOrSlug);
    set.add(idOrSlug.toLowerCase());
    localStorage.setItem('farm_fresh_deleted_product_ids', JSON.stringify(Array.from(set)));
  } catch (_) {}
}

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

// ---------------- PRODUCTS ----------------
export async function getProducts(options?: { categorySlug?: string; featuredOnly?: boolean; search?: string }): Promise<Product[]> {
  const normalizeSlug = (s?: string) => (s || '').toLowerCase().replace(/^\/+|\/+$/g, '').trim();
  const targetCategorySlug = options?.categorySlug && options.categorySlug !== 'all'
    ? normalizeSlug(options.categorySlug)
    : null;

  const clientDeletedIds = getClientDeletedIds();
  const serverStore = getServerProductsStore();
  const allCategories = getServerCategoriesStore();
  const categoryMap = new Map(allCategories.map(c => [c.id, c]));

  let rawList: Product[] = [];

  try {
    const client = getDbClient();
    if (client) {
      let query = client
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        rawList = (data as Product[]).map(p => ({
          ...p,
          primary_image:
            p.images?.find((img: any) => img.is_primary)?.image_url ||
            p.images?.[0]?.image_url ||
            p.primary_image ||
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
        }));
      }
    }
  } catch (err) {
    console.warn('Database getProducts fetch notice:', err);
  }

  // If DB returned nothing or is not configured, start with server memory store
  if (rawList.length === 0) {
    rawList = [...serverStore];
    // Also merge with client-side localStorage fallback ONLY when DB returned nothing
    if (isClient) {
      const local = getLocalFallback<Product[]>('products', []);
      local.forEach(lp => {
        if (!rawList.some(p => p.id === lp.id || (lp.slug && p.slug === lp.slug))) {
          rawList.push(lp);
        }
      });
    }
  } else {
    // DB returned active products! Merge any newly added local serverStore products that are NOT deleted
    serverStore.forEach(sp => {
      const isDeleted =
        isProductDeleted(sp.id) ||
        isProductDeleted(sp.slug) ||
        clientDeletedIds.has(sp.id) ||
        clientDeletedIds.has((sp.slug || '').toLowerCase());

      if (!isDeleted && !rawList.some(p => p.id === sp.id || (sp.slug && p.slug === sp.slug))) {
        rawList.push(sp);
      }
    });
  }

  // Ensure category object is attached if missing but category_id is set
  rawList.forEach(p => {
    if (!p.category && p.category_id && categoryMap.has(p.category_id)) {
      p.category = categoryMap.get(p.category_id);
    }
  });

  // CRITICAL: Filter out ANY deleted products from catalog
  rawList = rawList.filter(p => {
    const isDeleted =
      isProductDeleted(p.id) ||
      isProductDeleted(p.slug) ||
      clientDeletedIds.has(p.id) ||
      clientDeletedIds.has((p.slug || '').toLowerCase());
    return !isDeleted;
  });

  // Filter out inactive products (is_active === false)
  let filtered = rawList.filter(p => p.is_active !== false);

  // Filter featured
  if (options?.featuredOnly) {
    filtered = filtered.filter(p => p.is_featured === true);
  }

  // Filter by category slug (handling slashes like /fresh-milk vs fresh-milk)
  if (targetCategorySlug) {
    filtered = filtered.filter(p => {
      const prodCatSlug = normalizeSlug(p.category?.slug);
      const prodCatId = (p.category_id || '').trim();
      return prodCatSlug === targetCategorySlug || prodCatId === targetCategorySlug;
    });
  }

  // Filter search
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.short_description || '').toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const clientDeletedIds = getClientDeletedIds();
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
        adminProducts = (data as Product[]).map(p => ({
          ...p,
          primary_image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || p.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
        }));
      }
    }
  } catch (err) {
    console.warn('Admin products DB fetch fallback:', err);
  }

  if (adminProducts.length === 0) {
    adminProducts = isClient ? [...getLocalFallback<Product[]>('products', serverStore)] : [...serverStore];
  } else {
    serverStore.forEach(sp => {
      const isDeleted =
        isProductDeleted(sp.id) ||
        isProductDeleted(sp.slug) ||
        clientDeletedIds.has(sp.id) ||
        clientDeletedIds.has((sp.slug || '').toLowerCase());

      if (!isDeleted && !adminProducts.some(p => p.id === sp.id || (sp.slug && p.slug === sp.slug))) {
        adminProducts.push(sp);
      }
    });
  }

  // Attach category if missing
  adminProducts.forEach(p => {
    if (!p.category && p.category_id && categoryMap.has(p.category_id)) {
      p.category = categoryMap.get(p.category_id);
    }
  });

  // Permanently filter out any deleted products
  adminProducts = adminProducts.filter(p => {
    const isDeleted =
      isProductDeleted(p.id) ||
      isProductDeleted(p.slug) ||
      clientDeletedIds.has(p.id) ||
      clientDeletedIds.has((p.slug || '').toLowerCase());
    return !isDeleted;
  });

  // Sync localStorage with authoritative state on client
  if (isClient) {
    localStorage.setItem('farm_fresh_products', JSON.stringify(adminProducts));
  }

  return adminProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const clientDeletedIds = getClientDeletedIds();
  const cleanSlug = (slug || '').trim().toLowerCase();
  if (isProductDeleted(cleanSlug) || clientDeletedIds.has(cleanSlug)) {
    return null;
  }

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        const prod = data as Product;
        if (
          isProductDeleted(prod.id) ||
          isProductDeleted(prod.slug) ||
          clientDeletedIds.has(prod.id) ||
          clientDeletedIds.has((prod.slug || '').toLowerCase())
        ) {
          return null;
        }
        const mapped: Product = {
          ...prod,
          primary_image: prod.images?.find((img: any) => img.is_primary)?.image_url || prod.images?.[0]?.image_url || prod.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
        };
        upsertServerProduct(mapped);
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Product by slug DB fetch fallback:', err);
  }

  const serverStore = getServerProductsStore();
  const foundInServer = serverStore.find(p => p.slug === slug);
  if (foundInServer) {
    if (
      isProductDeleted(foundInServer.id) ||
      isProductDeleted(foundInServer.slug) ||
      clientDeletedIds.has(foundInServer.id) ||
      clientDeletedIds.has((foundInServer.slug || '').toLowerCase())
    ) {
      return null;
    }
    return foundInServer;
  }

  const products = getLocalFallback<Product[]>('products', serverStore);
  const foundInLocal = products.find(p => p.slug === slug);
  if (
    foundInLocal &&
    (isProductDeleted(foundInLocal.id) ||
      isProductDeleted(foundInLocal.slug) ||
      clientDeletedIds.has(foundInLocal.id) ||
      clientDeletedIds.has((foundInLocal.slug || '').toLowerCase()))
  ) {
    return null;
  }
  return foundInLocal || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const clientDeletedIds = getClientDeletedIds();
  const cleanId = (id || '').trim();
  if (isProductDeleted(cleanId) || clientDeletedIds.has(cleanId)) {
    return null;
  }

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const prod = data as Product;
        if (
          isProductDeleted(prod.id) ||
          isProductDeleted(prod.slug) ||
          clientDeletedIds.has(prod.id) ||
          clientDeletedIds.has((prod.slug || '').toLowerCase())
        ) {
          return null;
        }
        const mapped: Product = {
          ...prod,
          primary_image: prod.images?.find((img: any) => img.is_primary)?.image_url || prod.images?.[0]?.image_url || prod.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
        };
        upsertServerProduct(mapped);
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Product by ID DB fetch fallback:', err);
  }

  const serverStore = getServerProductsStore();
  const foundInServer = serverStore.find(p => p.id === id);
  if (foundInServer) {
    if (
      isProductDeleted(foundInServer.id) ||
      isProductDeleted(foundInServer.slug) ||
      clientDeletedIds.has(foundInServer.id) ||
      clientDeletedIds.has((foundInServer.slug || '').toLowerCase())
    ) {
      return null;
    }
    return foundInServer;
  }

  const products = getLocalFallback<Product[]>('products', serverStore);
  const foundInLocal = products.find(p => p.id === id);
  if (
    foundInLocal &&
    (isProductDeleted(foundInLocal.id) ||
      isProductDeleted(foundInLocal.slug) ||
      clientDeletedIds.has(foundInLocal.id) ||
      clientDeletedIds.has((foundInLocal.slug || '').toLowerCase()))
  ) {
    return null;
  }
  return foundInLocal || null;
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  const serverStore = getServerProductsStore();
  const products = getLocalFallback<Product[]>('products', serverStore);
  const categories = getLocalFallback<Category[]>('categories', INITIAL_CATEGORIES);
  const categoryObj = categories.find(c => c.id === productData.category_id);

  if (productData.id) {
    const idx = products.findIndex(p => p.id === productData.id);
    if (idx !== -1) {
      const updated: Product = {
        ...products[idx],
        ...productData,
        category: categoryObj || products[idx].category,
        updated_at: new Date().toISOString(),
      };
      products[idx] = updated;
      upsertServerProduct(updated);
      if (isClient) {
        localStorage.setItem('pure_pastures_products', JSON.stringify(products));
        localStorage.setItem('farm_fresh_products', JSON.stringify(products));
      }
      return updated;
    }
  }

  const newProduct: Product = {
    id: productData.id || `p-${Date.now()}`,
    name: productData.name || 'New Product',
    slug: productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${Date.now()}`),
    short_description: productData.short_description || '',
    full_description: productData.full_description || '',
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
  };

  upsertServerProduct(newProduct);
  products.unshift(newProduct);
  if (isClient) {
    localStorage.setItem('pure_pastures_products', JSON.stringify(products));
    localStorage.setItem('farm_fresh_products', JSON.stringify(products));
  }
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const cleanId = (id || '').trim();
  deleteServerProduct(cleanId);
  addClientDeletedId(cleanId);

  // Best effort direct DB delete on client if client has credentials
  try {
    const client = getDbClient();
    if (client) {
      if (isValidUUID(cleanId)) {
        await client.from('order_items').update({ product_id: null }).eq('product_id', cleanId);
        await client.from('product_images').delete().eq('product_id', cleanId);
        await client.from('products').update({ is_active: false, availability: false, show_on_homepage: false }).eq('id', cleanId);
        await client.from('products').delete().eq('id', cleanId);
      } else {
        await client.from('products').update({ is_active: false, availability: false, show_on_homepage: false }).eq('slug', cleanId);
        await client.from('products').delete().eq('slug', cleanId);
      }
    }
  } catch (e) {
    console.warn('[Client DB delete notice]:', e);
  }

  const serverStore = getServerProductsStore();
  let products = getLocalFallback<Product[]>('products', serverStore);
  products = products.filter(p => p.id !== cleanId && p.slug !== cleanId);
  if (isClient) {
    localStorage.setItem('pure_pastures_products', JSON.stringify(products));
    localStorage.setItem('farm_fresh_products', JSON.stringify(products));
  }
  return true;
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  const memoryCats = getServerCategoriesStore();
  let dbCats: Category[] = [];

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      // First try active query
      let res = await adminClient
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      // If is_active column doesn't exist in Supabase schema, query all categories
      if (res.error && res.error.message?.includes('is_active')) {
        res = await adminClient
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
      }

      if (!res.error && res.data && res.data.length > 0) {
        dbCats = res.data.map((c: any) => ({
          ...c,
          slug: (c.slug || '').replace(/^\/+|\/+$/g, ''),
          is_active: c.is_active !== undefined ? Boolean(c.is_active) : true,
        })) as Category[];
      }
    }
  } catch (err) {}

  if (dbCats.length > 0) {
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

  const localFallback = getLocalFallback<Category[]>('categories', memoryCats);
  return localFallback
    .map(c => ({ ...c, slug: (c.slug || '').replace(/^\/+|\/+$/g, '') }))
    .filter((c) => c.is_active !== false);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const memoryCats = getServerCategoriesStore();
  let dbCats: Category[] = [];

  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const res = await adminClient
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!res.error && res.data && res.data.length > 0) {
        dbCats = res.data.map((c: any) => ({
          ...c,
          slug: (c.slug || '').replace(/^\/+|\/+$/g, ''),
          is_active: c.is_active !== undefined ? Boolean(c.is_active) : true,
        })) as Category[];
      }
    }
  } catch (err) {}

  if (dbCats.length > 0) {
    const combined = [...dbCats];
    for (const mem of memoryCats) {
      const exists = combined.some((c) => c.id === mem.id || (c.slug && c.slug === mem.slug));
      if (!exists) {
        combined.push(mem);
      }
    }
    return combined;
  }

  return getLocalFallback<Category[]>('categories', memoryCats);
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  const categories = getLocalFallback<Category[]>('categories', getServerCategoriesStore());
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

  const existingIdx = categories.findIndex((c) => c.id === newCat.id || c.slug === newCat.slug);
  if (existingIdx > -1) {
    categories[existingIdx] = newCat;
  } else {
    categories.push(newCat);
  }

  if (isClient) localStorage.setItem('pure_pastures_categories', JSON.stringify(categories));
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
  return getLocalFallback<Testimonial[]>('testimonials', serverStore).filter(t => t.is_active);
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

  const serverStore = getServerTestimonialsStore();
  return getLocalFallback<Testimonial[]>('testimonials', serverStore);
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
