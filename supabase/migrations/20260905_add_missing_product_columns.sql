-- Migration: Add optional SEO and metadata columns to products table
-- Run this in your Supabase SQL Editor to fix 'column not found' errors

ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(200);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS weight_volume VARCHAR(100);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Fix any NULL values
UPDATE products SET is_active = TRUE WHERE is_active IS NULL;
UPDATE products SET availability = TRUE WHERE availability IS NULL;
UPDATE products SET is_featured = FALSE WHERE is_featured IS NULL;
UPDATE products SET show_on_homepage = TRUE WHERE show_on_homepage IS NULL;

-- Ensure RLS public select is enabled
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can select active products" ON products;
DROP POLICY IF EXISTS "Public read active products" ON products;

CREATE POLICY "Public can select active products" ON products
  FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin manage products" ON products;
CREATE POLICY "Admin manage products" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Refresh PostgREST schema cache so new columns are immediately visible
NOTIFY pgrst, 'reload schema';
