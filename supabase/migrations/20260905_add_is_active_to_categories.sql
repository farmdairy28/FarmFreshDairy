-- Migration: Add is_active and standard columns to categories table
-- Description: Ensures categories table has is_active, sort_order, image_url, and description columns.

ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update any existing rows that have NULL is_active
UPDATE categories SET is_active = TRUE WHERE is_active IS NULL;
UPDATE categories SET sort_order = 0 WHERE sort_order IS NULL;

-- Ensure RLS is active and permissive for public reads
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can select categories" ON categories;
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Public can select active categories" ON categories;

CREATE POLICY "Public can select categories" ON categories
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
