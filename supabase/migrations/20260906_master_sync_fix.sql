-- ================================================================
-- MASTER MIGRATION: Full Admin-to-Storefront Data Sync Fix
-- Run every statement in your Supabase SQL Editor
-- ================================================================

-- ---- 1. ADD ALL MISSING COLUMNS (idempotent) ----
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(200);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS weight_volume VARCHAR(100);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'Rs.';
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS sku VARCHAR(50);

ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS description TEXT;

-- ---- 2. SET SAFE DEFAULTS FOR EXISTING ROWS ----
UPDATE products SET is_active = TRUE WHERE is_active IS NULL;
UPDATE products SET availability = TRUE WHERE availability IS NULL;
UPDATE products SET is_featured = FALSE WHERE is_featured IS NULL;
UPDATE products SET show_on_homepage = TRUE WHERE show_on_homepage IS NULL;
UPDATE products SET stock = 1 WHERE stock IS NULL OR stock < 0;
UPDATE categories SET is_active = TRUE WHERE is_active IS NULL;
UPDATE categories SET sort_order = 0 WHERE sort_order IS NULL;

-- ---- 3. ENABLE ROW LEVEL SECURITY ----
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

-- ---- 4. DROP ALL EXISTING CONFLICTING SELECT POLICIES ----
DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Public can select active products" ON products;
DROP POLICY IF EXISTS "Allow public read on products" ON products;
DROP POLICY IF EXISTS "Public read product images" ON product_images;
DROP POLICY IF EXISTS "Public can select product images" ON product_images;
DROP POLICY IF EXISTS "Allow public read on product images" ON product_images;
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Public can select active categories" ON categories;
DROP POLICY IF EXISTS "Public can select categories" ON categories;

-- ---- 5. CREATE PERMISSIVE PUBLIC READ POLICIES ----
-- Products: anon users can read all active products
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = TRUE);

-- Product images: anon users can always read (images don't need is_active)
CREATE POLICY "Public read product images" ON product_images
  FOR SELECT USING (true);

-- Categories: anon users can read all active categories
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (is_active = TRUE);

-- ---- 6. ENSURE SERVICE ROLE ADMIN WRITE POLICIES ----
DROP POLICY IF EXISTS "Admin manage products" ON products;
CREATE POLICY "Admin manage products" ON products
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage product images" ON product_images;
CREATE POLICY "Admin manage product images" ON product_images
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);

-- ---- 7. RELOAD POSTGREST SCHEMA CACHE ----
NOTIFY pgrst, 'reload schema';
