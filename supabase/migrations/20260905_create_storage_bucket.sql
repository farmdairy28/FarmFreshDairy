-- ========================================================
-- Migration: Create product-images storage bucket & policies
-- Run this in Supabase SQL Editor if bucket is missing
-- ========================================================

-- 1. Create public bucket for product images if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

-- 2. Drop existing policies to prevent conflict errors
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- 3. Public read policy (anyone can see product images)
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- 4. Upload policy (service role, authenticated users, and admins)
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- 5. Update policy
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

-- 6. Delete policy
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
