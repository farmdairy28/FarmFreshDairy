-- Migration: Add delivery_slot column to orders table
-- Default is 'Morning'

ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_slot VARCHAR(50) DEFAULT 'Morning';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
