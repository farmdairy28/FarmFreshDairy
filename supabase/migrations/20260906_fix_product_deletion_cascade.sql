-- ================================================================
-- SUPABASE MIGRATION: Fix Product Deletion & Foreign Key Cascades
-- Run this in your Supabase Project -> SQL Editor
-- ================================================================

-- 1. Ensure product_images automatically cascades when a product is deleted
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'product_images_product_id_fkey'
  ) THEN
    ALTER TABLE product_images DROP CONSTRAINT product_images_product_id_fkey;
  END IF;
END $$;

ALTER TABLE product_images
  ADD CONSTRAINT product_images_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- 2. Ensure order_items sets product_id to NULL when a product is deleted (preserving order history)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'order_items_product_id_fkey'
  ) THEN
    ALTER TABLE order_items DROP CONSTRAINT order_items_product_id_fkey;
  END IF;
END $$;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- 3. Ensure Row Level Security allows full DELETE operations for admin & service role
DROP POLICY IF EXISTS "Admin manage products" ON products;
CREATE POLICY "Admin manage products" ON products
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage product images" ON product_images;
CREATE POLICY "Admin manage product images" ON product_images
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Reload schema cache for PostgREST
NOTIFY pgrst, 'reload schema';
