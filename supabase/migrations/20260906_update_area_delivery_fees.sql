-- Migration: Set Free delivery only for Shahzad Town, rider delivery for other areas

UPDATE delivery_areas
SET delivery_fee = 0.00, timing_info = 'FREE Doorstep Delivery · Morning & Evening'
WHERE LOWER(name) LIKE '%shahzad town%' AND LOWER(name) NOT LIKE '%chak shahzad%';

UPDATE delivery_areas
SET delivery_fee = 0.00, timing_info = 'Delivered via Rider (Charges as per Rider)'
WHERE LOWER(name) NOT LIKE '%shahzad town%' OR LOWER(name) LIKE '%chak shahzad%';

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
