-- ========================================================
-- Migration: Add missing columns to orders table
-- Run this in Supabase SQL Editor to support city and notes
-- ========================================================

ALTER TABLE IF EXISTS orders 
ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Islamabad',
ADD COLUMN IF NOT EXISTS area_name VARCHAR(100) DEFAULT 'Islamabad',
ADD COLUMN IF NOT EXISTS delivery_notes TEXT,
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0.00;
