-- Migration: Allow public to insert reviews into testimonials table

-- Drop existing public insert policy if any
DROP POLICY IF EXISTS "Public can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public insert testimonials" ON testimonials;

-- Create policy allowing anyone to submit a review with is_active = true
CREATE POLICY "Public can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
