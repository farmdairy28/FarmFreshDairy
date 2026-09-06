-- Migration: Set Free delivery for Shahzad Town, I-8 Sector, and I-9 Sector; rider delivery for other areas

UPDATE delivery_areas
SET delivery_fee = 0.00, timing_info = 'FREE Doorstep Delivery · Morning & Evening'
WHERE (LOWER(name) LIKE '%shahzad town%' AND LOWER(name) NOT LIKE '%chak shahzad%')
   OR LOWER(name) LIKE '%i-8%'
   OR LOWER(name) LIKE '%i8%'
   OR LOWER(name) LIKE '%i-9%'
   OR LOWER(name) LIKE '%i9%';

UPDATE delivery_areas
SET delivery_fee = 0.00, timing_info = 'Delivered via Rider (Charges as per Rider)'
WHERE NOT (
  (LOWER(name) LIKE '%shahzad town%' AND LOWER(name) NOT LIKE '%chak shahzad%')
  OR LOWER(name) LIKE '%i-8%'
  OR LOWER(name) LIKE '%i8%'
  OR LOWER(name) LIKE '%i-9%'
  OR LOWER(name) LIKE '%i9%'
);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
