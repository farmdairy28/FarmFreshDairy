export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  currency: string;
  category_id?: string | null;
  category?: Category | null;
  sku?: string | null;
  unit: string; // e.g. 'litre', 'kg', 'pack'
  weight_volume?: string | null;
  stock: number;
  availability: boolean;
  is_active: boolean;
  is_featured: boolean;
  show_on_homepage: boolean;
  seo_title?: string;
  seo_description?: string;
  images?: ProductImage[];
  primary_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FarmValue {
  id: string;
  number_prefix: string;
  title: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  short_desc: string;
  detailed_desc?: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface DeliveryArea {
  id: string;
  region_id?: string;
  name: string;
  delivery_fee: number;
  timing_info: string;
  sort_order: number;
  is_active: boolean;
}

export interface DeliveryRegion {
  id: string;
  city_id?: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  areas: DeliveryArea[];
}

export interface DeliveryCity {
  id: string;
  name: string;
  is_active: boolean;
  regions: DeliveryRegion[];
}

export interface Testimonial {
  id: string;
  rating: number;
  customer_name: string;
  customer_type: string;
  review: string;
  avatar_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  product?: Product;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  delivery_area_id?: string;
  area_name: string;
  delivery_slot?: string;
  delivery_notes?: string;
  delivery_fee: number;
  subtotal: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  payment_status: string;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface HomepageHero {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  stats: Array<{ label: string; value: string }>;
  imageUrl?: string;
}

export interface HomepagePromise {
  eyebrow: string;
  heading: string;
  subtitle: string;
  description: string;
  stats: Array<{ number: string; label: string }>;
}

export interface HomepageFarmIntro {
  eyebrow: string;
  heading: string;
  description: string;
  imageUrl: string;
}
