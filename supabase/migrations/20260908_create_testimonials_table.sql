-- ================================================================
-- MIGRATION: Profiles, is_admin() Function, and Testimonials Table
-- Target: Supabase PostgreSQL (Run in Supabase Dashboard SQL Editor)
-- ================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Prerequisite for is_admin() helper)
-- Exactly matching supabase/schema.sql (lines 10-17)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(150) NOT NULL,
  full_name VARCHAR(150),
  role VARCHAR(30) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 3. Define the project's standard is_admin() helper function
-- Exactly matching supabase/schema.sql (lines 41-49)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create testimonials Table
-- Exactly matching supabase/schema.sql (lines 193-204)
CREATE TABLE IF NOT EXISTS public.testimonials (
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

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON public.testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials(sort_order ASC);

-- 6. Enable Row Level Security (RLS) on testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public read active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;

-- 8. Public Read Policy (Storefront reads active reviews)
CREATE POLICY "Public read active testimonials" ON public.testimonials
  FOR SELECT
  USING (is_active = true OR public.is_admin());

-- 9. Public Insert Policy (Customers can submit reviews)
CREATE POLICY "Public can insert testimonials" ON public.testimonials
  FOR INSERT
  WITH CHECK (true);

-- 10. Admin Management Policy (Admins & Service Role can manage all)
CREATE POLICY "Admin manage testimonials" ON public.testimonials
  FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

-- 11. Insert Baseline Seed Data (idempotent — strictly valid hexadecimal UUIDs)
INSERT INTO public.testimonials (id, rating, customer_name, customer_type, review, avatar_url, sort_order, is_active) VALUES
('10000000-0000-0000-0000-000000000001', 5, 'Dr. Ayesha Malik', 'Family Physician (F-7 Islamabad)', 'The difference in purity and aroma between supermarket milk and Farm Fresh Dairy Products is astounding. The lab test report gives complete peace of mind, and our morning tea finally tastes like authentic pure milk.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 1, true),
('10000000-0000-0000-0000-000000000002', 5, 'Chef Tariq Hameed', 'Executive Pastry Chef', 'Their desi ghee and whole cow milk at Rs. 250 are unmatched. In pastry making, ingredient consistency is key, and Farm Fresh Dairy delivers 100% pure quality every single morning without fail.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 2, true),
('10000000-0000-0000-0000-000000000003', 5, 'Zainab Ahmed', 'Resident (Shahzad Town)', 'I have been subscribing to morning deliveries for 8 months. The free delivery in Shahzad Town is always prompt by 7 AM, chilled, with a thick natural malai cream layer.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 3, true)
ON CONFLICT (id) DO NOTHING;

-- 12. Reload PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
