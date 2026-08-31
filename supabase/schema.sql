-- ========================================================
-- PURE PASTURES DAIRY FARM HARDENED PRODUCTION SCHEMA
-- PostgreSQL / Supabase Schema Definition & RLS Policies
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(150) NOT NULL,
  full_name VARCHAR(150),
  role VARCHAR(30) NOT NULL DEFAULT 'customer', -- 'admin' or 'customer'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current requesting user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  currency VARCHAR(10) DEFAULT 'Rs.',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sku VARCHAR(50),
  unit VARCHAR(50) NOT NULL DEFAULT 'litre',
  weight_volume VARCHAR(50),
  stock INT NOT NULL DEFAULT 100 CHECK (stock >= 0),
  availability BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  show_on_homepage BOOLEAN DEFAULT TRUE,
  seo_title VARCHAR(200),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt_text VARCHAR(200),
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DELIVERY CITIES TABLE
CREATE TABLE IF NOT EXISTS delivery_cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DELIVERY REGIONS TABLE
CREATE TABLE IF NOT EXISTS delivery_regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES delivery_cities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DELIVERY AREAS TABLE
CREATE TABLE IF NOT EXISTS delivery_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id UUID REFERENCES delivery_regions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00 CHECK (delivery_fee >= 0),
  timing_info VARCHAR(150) DEFAULT 'Morning 6:00 AM - 9:00 AM',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  delivery_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Karachi',
  delivery_area_id UUID REFERENCES delivery_areas(id) ON DELETE SET NULL,
  area_name VARCHAR(100) NOT NULL,
  delivery_notes TEXT,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00 CHECK (delivery_fee >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled')),
  payment_method VARCHAR(30) DEFAULT 'Cash on Delivery',
  payment_status VARCHAR(30) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDER ITEMS SNAPSHOT TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(150) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL CHECK (product_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FARM VALUES TABLE
CREATE TABLE IF NOT EXISTS farm_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number_prefix VARCHAR(10) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PROCESS STEPS TABLE
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_number VARCHAR(10) NOT NULL,
  title VARCHAR(150) NOT NULL,
  short_desc TEXT NOT NULL,
  detailed_desc TEXT,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  customer_name VARCHAR(100) NOT NULL,
  customer_type VARCHAR(100) DEFAULT 'Verified Farm Customer',
  review TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. HOMEPAGE SECTIONS CMS TABLE
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_regions_city ON delivery_regions(city_id);
CREATE INDEX IF NOT EXISTS idx_delivery_areas_region ON delivery_areas(region_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can update profiles" ON profiles
  FOR ALL USING (public.is_admin());

-- 2. Public Read Policies (for active customer storefront data)
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public read active delivery cities" ON delivery_cities
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active delivery regions" ON delivery_regions
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active delivery areas" ON delivery_areas
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active farm values" ON farm_values
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active process steps" ON process_steps
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active testimonials" ON testimonials
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read active homepage sections" ON homepage_sections
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT USING (true);

-- 3. Orders Insertion & Read Policies
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage all orders" ON orders
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view and manage all order items" ON order_items
  FOR ALL USING (public.is_admin());

-- 4. Admin Management Policies (Categories, Products, Content, CMS)
CREATE POLICY "Admin manage categories" ON categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage products" ON products
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage product images" ON product_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage delivery cities" ON delivery_cities
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage delivery regions" ON delivery_regions
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage delivery areas" ON delivery_areas
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage farm values" ON farm_values
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage process steps" ON process_steps
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage testimonials" ON testimonials
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage homepage sections" ON homepage_sections
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage site settings" ON site_settings
  FOR ALL USING (public.is_admin());

-- ========================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ========================================================
-- Insert storage bucket for product images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND (auth.role() = 'authenticated' OR public.is_admin()));

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());
