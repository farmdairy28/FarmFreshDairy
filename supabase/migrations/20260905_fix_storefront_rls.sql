-- ========================================================
-- Migration: Ensure Public Storefront Read Access for Products, Images & Categories
-- Run this in Supabase SQL Editor if products are not visible to storefront customers
-- ========================================================

-- 1. Ensure RLS is active
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop any conflicting or restrictive SELECT policies
DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Public can select active products" ON products;
DROP POLICY IF EXISTS "Allow public read on products" ON products;
DROP POLICY IF EXISTS "Public read product images" ON product_images;
DROP POLICY IF EXISTS "Public can select product images" ON product_images;
DROP POLICY IF EXISTS "Allow public read on product images" ON product_images;
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Public can select active categories" ON categories;

-- 3. Create simple, fast, non-blocking SELECT policies for storefront customers
CREATE POLICY "Public can select active products" ON products
  FOR SELECT USING (is_active = true OR auth.role() = 'service_role');

CREATE POLICY "Public can select product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can select categories" ON categories
  FOR SELECT USING (is_active = true OR auth.role() = 'service_role');

-- 4. Ensure admin full management policies
DROP POLICY IF EXISTS "Admin manage products" ON products;
CREATE POLICY "Admin manage products" ON products
  FOR ALL USING (auth.role() = 'service_role' OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage product images" ON product_images;
CREATE POLICY "Admin manage product images" ON product_images
  FOR ALL USING (auth.role() = 'service_role' OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories
  FOR ALL USING (auth.role() = 'service_role' OR (SELECT public.is_admin()));
