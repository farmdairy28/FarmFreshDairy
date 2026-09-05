import { Product, Category, FarmValue, ProcessStep, DeliveryRegion, Testimonial, Order, HomepageHero, HomepagePromise } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_VALUES, INITIAL_PROCESS, INITIAL_DELIVERY, INITIAL_TESTIMONIALS, INITIAL_HERO, INITIAL_PROMISE, INITIAL_ORDERS } from './mock-data';
import { getServerProductsStore, upsertServerProduct, deleteServerProduct } from './products-store';
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

// ---------------- PRODUCTS ----------------
export async function getProducts(options?: { categorySlug?: string; featuredOnly?: boolean; search?: string }): Promise<Product[]> {
  try {
    const client = getDbClient();
    if (client) {
      let query = client
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (options?.featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        let filtered = data as Product[];
        if (options?.categorySlug && options.categorySlug !== 'all') {
          filtered = filtered.filter(p => p.category?.slug === options.categorySlug || p.category_id === options.categorySlug);
        }
        if (options?.search) {
          const q = options.search.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q));
        }
        const mapped = filtered.map(p => ({
          ...p,
          primary_image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || p.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
        }));

        mapped.forEach(prod => upsertServerProduct(prod));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Database query fallback to store products:', err);
  }

  // Fallback to server & local store
  const serverStore = getServerProductsStore();
  let products = getLocalFallback<Product[]>('products', serverStore);

  // Sync products from server store if not already present in local fallback
  serverStore.forEach(sp => {
    if (!products.some(p => p.id === sp.id || (sp.slug && p.slug === sp.slug))) {
      products.push(sp);
    }
  });

  if (options?.categorySlug && options.categorySlug !== 'all') {
    products = products.filter(p => p.category?.slug === options.categorySlug || p.category_id === options.categorySlug);
  }
  if (options?.featuredOnly) {
    products = products.filter(p => p.is_featured);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q));
  }
  return products.filter(p => p.is_active);
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = (data as Product[]).map(p => ({
          ...p,
          primary_image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || p.primary_image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
        }));
        mapped.forEach(prod => upsertServerProduct(prod));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Admin products DB fetch fallback:', err);
  }

  const serverStore = getServerProductsStore();
  let products = getLocalFallback<Product[]>('products', serverStore);
  serverStore.forEach(sp => {
    if (!products.some(p => p.id === sp.id || (sp.slug && p.slug === sp.slug))) {
      products.push(sp);
    }
  });
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
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
  if (foundInServer) return foundInServer;

  const products = getLocalFallback<Product[]>('products', serverStore);
  return products.find(p => p.slug === slug) || null;
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
        const prod = data as Product;
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
  if (foundInServer) return foundInServer;

  const products = getLocalFallback<Product[]>('products', serverStore);
  return products.find(p => p.id === id) || null;
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
  deleteServerProduct(id);
  const serverStore = getServerProductsStore();
  let products = getLocalFallback<Product[]>('products', serverStore);
  products = products.filter(p => p.id !== id);
  if (isClient) {
    localStorage.setItem('pure_pastures_products', JSON.stringify(products));
    localStorage.setItem('farm_fresh_products', JSON.stringify(products));
  }
  return true;
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    }
  } catch (err) {}

  return getLocalFallback<Category[]>('categories', INITIAL_CATEGORIES).filter(c => c.is_active);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    }
  } catch (err) {}

  return getLocalFallback<Category[]>('categories', INITIAL_CATEGORIES);
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  try {
    const adminClient = getDbClient();
    if (adminClient) {
      const payload = {
        name: categoryData.name!,
        slug: categoryData.slug || categoryData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: categoryData.description || null,
        sort_order: categoryData.sort_order || 1,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
        updated_at: new Date().toISOString(),
      };

      if (categoryData.id) {
        const { data } = await adminClient
          .from('categories')
          .update(payload)
          .eq('id', categoryData.id)
          .select()
          .single();
        if (data) return data as Category;
      } else {
        const { data } = await adminClient
          .from('categories')
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select()
          .single();
        if (data) return data as Category;
      }
    }
  } catch (err) {}

  const categories = getLocalFallback<Category[]>('categories', INITIAL_CATEGORIES);
  const newCat: Category = {
    id: `c-${Date.now()}`,
    name: categoryData.name || 'New Category',
    slug: categoryData.slug || `cat-${Date.now()}`,
    description: categoryData.description || '',
    sort_order: categories.length + 1,
    is_active: true,
  };
  categories.push(newCat);
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

  return getLocalFallback<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS).filter(t => t.is_active);
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
