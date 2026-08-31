-- ========================================================
-- PURE PASTURES DAIRY FARM SEED DATA
-- Populate demo categories, products, farm values, process, delivery areas, and testimonials
-- ========================================================

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order, is_active) VALUES
('c1000000-0000-0000-0000-000000000001', 'Fresh Milk', 'fresh-milk', 'Pure, unadulterated whole & low-fat farm fresh milk.', 1, true),
('c1000000-0000-0000-0000-000000000002', 'Yogurt & Dahi', 'yogurt', 'Traditional thick, creamy artisan yogurt.', 2, true),
('c1000000-0000-0000-0000-000000000003', 'Butter & Ghee', 'butter-ghee', 'Slow-churned yellow butter & aromatic grass-fed desi ghee.', 3, true),
('c1000000-0000-0000-0000-000000000004', 'Cheese & Paneer', 'cheese-paneer', 'Fresh farm paneer and handcrafted artisan cheeses.', 4, true),
('c1000000-0000-0000-0000-000000000005', 'Fresh Cream', 'cream', 'Rich, thick malai and whipping cream.', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, slug, short_description, full_description, price, compare_at_price, category_id, sku, unit, weight_volume, stock, availability, is_active, is_featured, show_on_homepage) VALUES
('p1000000-0000-0000-0000-000000000001', 'Pure Farm Fresh Whole Milk', 'pure-farm-fresh-whole-milk', '100% pure, unpasteurized farm-fresh milk straight from pasture-raised cows.', 'Our flagship whole milk comes directly from our pasture-raised cows who graze on nutrient-rich green grass. Chilled immediately after milking to preserve all natural vitamins, enzymes, and rich cream layer. Delivered within hours of milking.', 260.00, 280.00, 'c1000000-0000-0000-0000-000000000001', 'MILK-001', 'litre', '1 Litre Glass Bottle', 150, true, true, true, true),
('p1000000-0000-0000-0000-000000000002', 'Organic Low-Fat Milk', 'organic-low-fat-milk', 'Light, refreshing milk with all essential nutrients intact and only 1.5% fat.', 'Carefully toned to reduce fat content without compromising on natural calcium, protein, or delicious flavor. Perfect for health-conscious families and daily tea or smoothie brewing.', 250.00, 270.00, 'c1000000-0000-0000-0000-000000000001', 'MILK-002', 'litre', '1 Litre Pouch', 120, true, true, true, true),
('p1000000-0000-0000-0000-000000000003', 'Artisan Thick Farm Dahi (Yogurt)', 'artisan-thick-farm-dahi', 'Thick, creamy, naturally fermented clay-pot style yogurt rich in live probiotics.', 'Made using traditional slow fermentation methods in earthen containers. Contains zero thickeners, gelatin, or artificial milk solids. Naturally sweet and refreshing.', 280.00, 300.00, 'c1000000-0000-0000-0000-000000000002', 'YOG-001', 'kg', '1 kg Tub', 80, true, true, true, true),
('p1000000-0000-0000-0000-000000000004', 'Grass-Fed Pure Desi Ghee', 'grass-fed-pure-desi-ghee', 'Traditional bilona method golden desi ghee with rich nuttiness and high smoke point.', 'Hand-crafted from cultured butter churned according to the ancient bilona technique. Rich in Omega-3 fatty acids, Vitamin A, and CLA. Imparts an unforgettable aroma to every dish.', 2400.00, 2600.00, 'c1000000-0000-0000-0000-000000000003', 'GHEE-001', 'kg', '1 kg Glass Jar', 50, true, true, true, true),
('p1000000-0000-0000-0000-000000000005', 'Hand-Churned Salted Farm Butter', 'hand-churned-salted-farm-butter', 'Freshly churned golden butter with a pinch of mineral sea salt.', 'Batch-crafted every morning from fresh cream. Soft, spreadable, and packed with natural farm-fresh flavor. Perfect on hot toast or parathas.', 650.00, 700.00, 'c1000000-0000-0000-0000-000000000003', 'BTR-001', 'pack', '400g Pack', 60, true, true, true, true),
('p1000000-0000-0000-0000-000000000006', 'Fresh Farmhouse Paneer Block', 'fresh-farmhouse-paneer-block', 'Soft, non-rubbery cottage cheese curd blocks prepared fresh daily.', 'Crafted by curdling fresh farm milk with natural lemon juice. Soft, spongy, and absorbs spices beautifully in curries or grills.', 550.00, 600.00, 'c1000000-0000-0000-0000-000000000004', 'PNR-001', 'pack', '500g Pack', 75, true, true, true, true),
('p1000000-0000-0000-0000-000000000007', 'Thick Malai Cream', 'thick-malai-cream', 'Unskimmed extra rich farm cream skimmed straight off natural whole milk.', 'Dense, sweet, velvety cream ideal for desserts, fruit salads, or adding richness to savory curries.', 380.00, 420.00, 'c1000000-0000-0000-0000-000000000005', 'CRM-001', 'pack', '350g Tub', 40, true, true, true, false)
ON CONFLICT (id) DO NOTHING;

-- Product Images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80', 'Pure Farm Fresh Whole Milk Glass Bottle', 1, true),
('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1000&q=80', 'Organic Low-Fat Milk Pouch', 1, true),
('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80', 'Artisan Thick Farm Dahi Yogurt', 1, true),
('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80', 'Grass-Fed Pure Desi Ghee Jar', 1, true),
('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1000&q=80', 'Hand-Churned Salted Farm Butter', 1, true),
('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=1000&q=80', 'Fresh Farmhouse Paneer Block', 1, true),
('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?auto=format&fit=crop&w=1000&q=80', 'Thick Malai Cream Tub', 1, true);

-- Farm Values
INSERT INTO farm_values (id, number_prefix, title, description, image_url, sort_order, is_active) VALUES
('v1000000-0000-0000-0000-000000000001', '01', 'Open Air & Sunshine', 'Our cattle enjoy vast lush pastures with constant access to natural sunlight, fresh breeze, and freedom to move organically.', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80', 1, true),
('v1000000-0000-0000-0000-000000000002', '02', 'Care Daily & Gentle Hands', 'Healthy cows and compassionate daily care come first. We prioritize antibiotic-free nutrition, clean deep-well water, and zero hormones.', 'https://images.unsplash.com/photo-1570042707208-148298728997?auto=format&fit=crop&w=800&q=80', 2, true),
('v1000000-0000-0000-0000-000000000003', '03', 'Fresh By Nature', 'From our morning milking straight to your table with zero unnecessary processing, synthetic preservatives, or water dilution.', 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Process Steps
INSERT INTO process_steps (id, step_number, title, short_desc, detailed_desc, image_url, sort_order, is_active) VALUES
('ps1000000-0000-0000-0000-000000000001', '01', 'Pasture Grazing', 'Open grass, organic feeding, and peaceful green surroundings.', 'Our herd spends early mornings grazing outdoors on pesticide-free forage and fresh green feed tailored for optimal animal health.', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80', 1, true),
('ps1000000-0000-0000-0000-000000000002', '02', 'Nutritional Care', 'Clean deep-well drinking water, mineral salts, and veterinarian oversight.', 'Each cow is monitored by veterinary specialists to maintain balanced nutrition, natural immunity, and zero stress.', 'https://images.unsplash.com/photo-1570042707208-148298728997?auto=format&fit=crop&w=800&q=80', 2, true),
('ps1000000-0000-0000-0000-000000000003', '03', 'Hygienic Milking', 'Sanitized stainless-steel milking parlors and untouched handling.', 'Milking takes place twice daily using touchless, surgical-grade stainless steel systems to ensure complete purity.', 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80', 3, true),
('ps1000000-0000-0000-0000-000000000004', '04', 'Rapid Chilling', 'Cooled to 4°C within 15 minutes of milking to preserve natural taste.', 'Immediate temperature drop inhibits bacterial growth without relying on thermal over-processing or chemical additives.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', 4, true),
('ps1000000-0000-0000-0000-000000000005', '05', 'Bottling & Packaging', 'Sterilized glass bottles & sealed pouches ready for dispatch.', 'Packaged in food-grade eco-conscious containers designed to seal in fresh aroma and nutrition.', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80', 5, true),
('ps1000000-0000-0000-0000-000000000006', '06', 'Your Doorstep', 'Chilled temperature-controlled delivery before your morning breakfast.', 'Our dedicated fleet delivers direct to your doorstep every morning between 6:00 AM and 9:00 AM.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Delivery Locations (Islamabad Capital Territory)
INSERT INTO delivery_cities (id, name, is_active) VALUES
('dc100000-0000-0000-0000-000000000001', 'Islamabad', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_regions (id, city_id, name, sort_order, is_active) VALUES
('dr100000-0000-0000-0000-000000000001', 'dc100000-0000-0000-0000-000000000001', 'Capital Core (F-Sectors)', 1, true),
('dr100000-0000-0000-0000-000000000002', 'dc100000-0000-0000-0000-000000000001', 'Central Islamabad (E & G Sectors)', 2, true),
('dr100000-0000-0000-0000-000000000003', 'dc100000-0000-0000-0000-000000000001', 'H & I Sectors', 3, true),
('dr100000-0000-0000-0000-000000000004', 'dc100000-0000-0000-0000-000000000001', 'DHA & Bahria Town Islamabad', 4, true),
('dr100000-0000-0000-0000-000000000005', 'dc100000-0000-0000-0000-000000000001', 'Park Road, Chak Shahzad & Suburbs', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_areas (id, region_id, name, delivery_fee, timing_info, sort_order, is_active) VALUES
('da100000-0000-0000-0000-000000000001', 'dr100000-0000-0000-0000-000000000001', 'F-6 (Super Market & Embassy Area)', 0.00, '6:00 AM - 8:30 AM', 1, true),
('da100000-0000-0000-0000-000000000002', 'dr100000-0000-0000-0000-000000000001', 'F-7 (Jinnah Super & Surrounds)', 0.00, '6:00 AM - 8:30 AM', 2, true),
('da100000-0000-0000-0000-000000000003', 'dr100000-0000-0000-0000-000000000001', 'F-8 & F-10 Sectors', 0.00, '6:00 AM - 8:30 AM', 3, true),
('da100000-0000-0000-0000-000000000004', 'dr100000-0000-0000-0000-000000000001', 'F-11 (Markaz & Residential Blocks)', 0.00, '6:00 AM - 8:30 AM', 4, true),
('da100000-0000-0000-0000-000000000005', 'dr100000-0000-0000-0000-000000000002', 'E-7 & E-11 (FECHS / MPCHS)', 0.00, '6:00 AM - 8:30 AM', 1, true),
('da100000-0000-0000-0000-000000000006', 'dr100000-0000-0000-0000-000000000002', 'G-6, G-7 & G-8 Sectors', 0.00, '6:00 AM - 8:30 AM', 2, true),
('da100000-0000-0000-0000-000000000007', 'dr100000-0000-0000-0000-000000000002', 'G-9, G-10 & G-11 Sectors', 0.00, '6:00 AM - 8:30 AM', 3, true),
('da100000-0000-0000-0000-000000000008', 'dr100000-0000-0000-0000-000000000003', 'I-8 Sector (All Sub-Sectors)', 0.00, '6:00 AM - 8:30 AM', 1, true),
('da100000-0000-0000-0000-000000000009', 'dr100000-0000-0000-0000-000000000003', 'I-9, I-10 & H-8/H-9', 0.00, '6:00 AM - 8:30 AM', 2, true),
('da100000-0000-0000-0000-000000000010', 'dr100000-0000-0000-0000-000000000004', 'DHA Phase 1 & Phase 2', 0.00, '6:30 AM - 9:00 AM', 1, true),
('da100000-0000-0000-0000-000000000011', 'dr100000-0000-0000-0000-000000000004', 'DHA Phase 3, 5 & Valley', 0.00, '6:30 AM - 9:00 AM', 2, true),
('da100000-0000-0000-0000-000000000012', 'dr100000-0000-0000-0000-000000000004', 'Bahria Town Phase 1-8', 0.00, '6:30 AM - 9:00 AM', 3, true),
('da100000-0000-0000-0000-000000000013', 'dr100000-0000-0000-0000-000000000004', 'Bahria Enclave Islamabad', 0.00, '6:30 AM - 9:00 AM', 4, true),
('da100000-0000-0000-0000-000000000014', 'dr100000-0000-0000-0000-000000000005', 'Chak Shahzad Farm Houses', 0.00, '6:30 AM - 9:00 AM', 1, true),
('da100000-0000-0000-0000-000000000015', 'dr100000-0000-0000-0000-000000000005', 'Park View City & Bani Gala', 0.00, '6:30 AM - 9:00 AM', 2, true),
('da100000-0000-0000-0000-000000000016', 'dr100000-0000-0000-0000-000000000005', 'Naval Anchorage & Gulberg Greens', 0.00, '6:30 AM - 9:00 AM', 3, true),
('da100000-0000-0000-0000-000000000017', 'dr100000-0000-0000-0000-000000000005', 'Diplomatic Enclave', 0.00, '6:00 AM - 8:30 AM', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO testimonials (id, rating, customer_name, customer_type, review, avatar_url, sort_order, is_active) VALUES
('t1000000-0000-0000-0000-000000000001', 5, 'Dr. Ayesha Malik', 'Family Physician & Parent', 'The difference in purity and aroma between supermarket milk and Pure Pastures is astounding. My children drink it whole, and our morning tea finally tastes like authentic farm milk.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 1, true),
('t1000000-0000-0000-0000-000000000002', 5, 'Chef Tariq Hameed', 'Executive Pastry Chef', 'Their desi ghee and thick malai are unmatched. In professional pastry making, ingredient consistency is key, and Pure Pastures delivers 100% pure quality every morning without fail.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 2, true),
('t1000000-0000-0000-0000-000000000003', 5, 'Zainab Ahmed', 'Home Customer (Clifton)', 'I have been subscribing to morning bottle deliveries for 8 months now. The delivery is always chilled, prompt by 7 AM, and the glass bottle system feels so clean and sustainable.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Homepage Content Sections CMS Initial Data
INSERT INTO homepage_sections (id, section_key, title, subtitle, content_json, is_active) VALUES
('hs100000-0000-0000-0000-000000000001', 'hero', 'Pure. Naturally. From our farm to your table.', 'PASTURE-RAISED DAIRY DIRECT FROM OUR HERD', '{"eyebrow": "100% PURE PASTURE DAIRY", "description": "Nurtured under open skies with wholesome green pastures and daily veterinarian care. Pure, unadulterated fresh milk chilled within minutes of milking.", "primaryCtaText": "Explore Fresh Products", "secondaryCtaText": "Our Farm Story", "stats": [{"label": "Fresh Dairy", "value": "100%"}, {"label": "Pasture Raised", "value": "25+ Yrs"}, {"label": "Local Delivery", "value": "Daily Morning"}]}', true),
('hs100000-0000-0000-0000-000000000002', 'promise', 'Nothing unnecessary.', 'OUR FARM GUARANTEE', '{"eyebrow": "OUR PROMISE", "subtitle": "100% Pure. Farm to table. Naturally pure.", "description": "We never add water, synthetic thickeners, preservatives, or artificial milk powders. What you receive is pure, natural milk just as nature intended.", "stats": [{"number": "0%", "label": "Chemicals or Preservatives"}, {"number": "100%", "label": "Grass-fed Pasture Care"}, {"number": "6-9 AM", "label": "Chilled Morning Delivery"}]}', true),
('hs100000-0000-0000-0000-000000000003', 'farm_intro', 'Life begins in the pasture.', 'OUR HERD & ENVIRONMENT', '{"eyebrow": "OPEN AIR & Sunshine", "description": "Surrounded by wide pastures, fresh breeze, and continuous access to natural shade and clean deep-well water. Our cows lead relaxed lives, yielding milk of exceptional creaminess and nutritional richness.", "imageUrl": "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80"}', true)
ON CONFLICT (id) DO NOTHING;
