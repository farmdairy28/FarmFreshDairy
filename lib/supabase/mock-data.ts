import { Product, Category, FarmValue, ProcessStep, DeliveryRegion, Testimonial, Order, HomepageHero, HomepagePromise, HomepageFarmIntro } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Fresh Milk',
    slug: 'fresh-milk',
    description: 'Pure, unadulterated whole & low-fat farm fresh milk.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Yogurt & Dahi',
    slug: 'yogurt',
    description: 'Traditional thick, creamy artisan yogurt.',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Butter & Ghee',
    slug: 'butter-ghee',
    description: 'Slow-churned yellow butter & aromatic grass-fed desi ghee.',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Cheese & Paneer',
    slug: 'cheese-paneer',
    description: 'Fresh farm paneer and handcrafted artisan cheeses.',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Fresh Cream',
    slug: 'cream',
    description: 'Rich, thick malai and whipping cream.',
    sort_order: 5,
    is_active: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    name: '100% Pure Farm Fresh Cow Milk',
    slug: 'pure-farm-fresh-whole-milk',
    short_description: '100% pure, unadulterated cow milk straight from happy cows. Lab certified adulterant-free.',
    full_description: 'Our flagship pure cow milk comes directly from our pasture-raised healthy cows. Chilled immediately after touchless milking to preserve all natural vitamins, enzymes, and rich cream layer. Tested 100% negative for urea, formalin, and chemical adulterants.',
    price: 250,
    compare_at_price: 280,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category: INITIAL_CATEGORIES[0],
    sku: 'MILK-001',
    unit: 'litre',
    weight_volume: '1 Litre Chilled Bottle/Pouch',
    stock: 200,
    availability: true,
    is_active: true,
    is_featured: true,
    show_on_homepage: true,
    seo_title: '100% Pure Cow Milk - Farm Fresh Dairy Islamabad',
    seo_description: 'Order 100% pure raw pasture cow milk at Rs. 250/Litre. Free home delivery in Shahzad Town.',
    primary_image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-1', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true },
      { id: 'img-1b', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1000&q=80', sort_order: 2, is_primary: false }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    name: 'Organic Low-Fat Milk',
    slug: 'organic-low-fat-milk',
    short_description: 'Light, refreshing milk with all essential nutrients intact and only 1.5% fat.',
    full_description: 'Carefully toned to reduce fat content without compromising on natural calcium, protein, or delicious flavor. Perfect for health-conscious families and daily tea or smoothie brewing.',
    price: 250,
    compare_at_price: 270,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category: INITIAL_CATEGORIES[0],
    sku: 'MILK-002',
    unit: 'litre',
    weight_volume: '1 Litre Pouch',
    stock: 120,
    availability: true,
    is_active: true,
    is_featured: true,
    show_on_homepage: true,
    primary_image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-2', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    name: 'Artisan Thick Farm Dahi (Yogurt)',
    slug: 'artisan-thick-farm-dahi',
    short_description: 'Thick, creamy, naturally fermented clay-pot style yogurt rich in live probiotics.',
    full_description: 'Made using traditional slow fermentation methods in earthen containers. Contains zero thickeners, gelatin, or artificial milk solids. Naturally sweet and refreshing.',
    price: 280,
    compare_at_price: 300,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    category: INITIAL_CATEGORIES[1],
    sku: 'YOG-001',
    unit: 'kg',
    weight_volume: '1 kg Tub',
    stock: 80,
    availability: true,
    is_active: true,
    is_featured: true,
    show_on_homepage: true,
    primary_image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-3', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    name: 'Grass-Fed Pure Desi Ghee',
    slug: 'grass-fed-pure-desi-ghee',
    short_description: 'Traditional bilona method golden desi ghee with rich nuttiness and high smoke point.',
    full_description: 'Hand-crafted from cultured butter churned according to the ancient bilona technique. Rich in Omega-3 fatty acids, Vitamin A, and CLA. Imparts an unforgettable aroma to every dish.',
    price: 2400,
    compare_at_price: 2600,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category: INITIAL_CATEGORIES[2],
    sku: 'GHEE-001',
    unit: 'kg',
    weight_volume: '1 kg Glass Jar',
    stock: 50,
    availability: true,
    is_active: true,
    is_featured: true,
    show_on_homepage: true,
    primary_image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-4', image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000005',
    name: 'Hand-Churned Salted Farm Butter',
    slug: 'hand-churned-salted-farm-butter',
    short_description: 'Freshly churned golden butter with a pinch of mineral sea salt.',
    full_description: 'Batch-crafted every morning from fresh cream. Soft, spreadable, and packed with natural farm-fresh flavor. Perfect on hot toast or parathas.',
    price: 650,
    compare_at_price: 700,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category: INITIAL_CATEGORIES[2],
    sku: 'BTR-001',
    unit: 'pack',
    weight_volume: '400g Pack',
    stock: 60,
    availability: true,
    is_active: true,
    is_featured: true,
    show_on_homepage: true,
    primary_image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-5', image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000006',
    name: 'Fresh Farmhouse Paneer Block',
    slug: 'fresh-farmhouse-paneer-block',
    short_description: 'Soft, non-rubbery cottage cheese curd blocks prepared fresh daily.',
    full_description: 'Crafted by curdling fresh farm milk with natural lemon juice. Soft, spongy, and absorbs spices beautifully in curries or grills.',
    price: 550,
    compare_at_price: 600,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    category: INITIAL_CATEGORIES[3],
    sku: 'PNR-001',
    unit: 'pack',
    weight_volume: '500g Pack',
    stock: 75,
    availability: true,
    is_active: true,
    is_featured: true,
    show_on_homepage: true,
    primary_image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-6', image_url: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000007',
    name: 'Thick Malai Cream',
    slug: 'thick-malai-cream',
    short_description: 'Unskimmed extra rich farm cream skimmed straight off natural whole milk.',
    full_description: 'Dense, sweet, velvety cream ideal for desserts, fruit salads, or adding richness to savory curries.',
    price: 380,
    compare_at_price: 420,
    currency: 'Rs.',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    category: INITIAL_CATEGORIES[4],
    sku: 'CRM-001',
    unit: 'pack',
    weight_volume: '350g Tub',
    stock: 40,
    availability: true,
    is_active: true,
    is_featured: false,
    show_on_homepage: true,
    primary_image: 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 'img-7', image_url: 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?auto=format&fit=crop&w=1000&q=80', sort_order: 1, is_primary: true }
    ],
    created_at: new Date().toISOString(),
  }
];

export const INITIAL_VALUES: FarmValue[] = [
  {
    id: 'v1',
    number_prefix: '01',
    title: 'Open Air & Sunshine',
    description: 'Our cattle enjoy vast lush pastures with constant access to natural sunlight, fresh breeze, and freedom to move organically.',
    image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'v2',
    number_prefix: '02',
    title: 'Care Daily & Gentle Hands',
    description: 'Healthy cows and compassionate daily care come first. We prioritize antibiotic-free nutrition, clean deep-well water, and zero stress.',
    image_url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'v3',
    number_prefix: '03',
    title: 'Fresh By Nature',
    description: 'From our morning milking straight to your table with zero unnecessary processing, synthetic preservatives, or water dilution.',
    image_url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
    sort_order: 3,
    is_active: true,
  }
];

export const INITIAL_PROCESS: ProcessStep[] = [
  {
    id: 'ps1',
    step_number: '01',
    title: 'Pasture Grazing',
    short_desc: 'Open grass, organic feeding, and peaceful green surroundings.',
    detailed_desc: 'Our herd spends early mornings grazing outdoors on pesticide-free forage and fresh green feed tailored for optimal animal health.',
    image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'ps2',
    step_number: '02',
    title: 'Nutritional Care',
    short_desc: 'Clean deep-well drinking water, mineral salts, and veterinarian oversight.',
    detailed_desc: 'Each cow is monitored by veterinary specialists to maintain balanced nutrition, natural immunity, and zero stress.',
    image_url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'ps3',
    step_number: '03',
    title: 'Hygienic Milking',
    short_desc: 'Sanitized stainless-steel milking parlors and untouched handling.',
    detailed_desc: 'Milking takes place twice daily using touchless, surgical-grade stainless steel systems to ensure complete purity.',
    image_url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'ps4',
    step_number: '04',
    title: 'Rapid Chilling',
    short_desc: 'Cooled to 4°C within 15 minutes of milking to preserve natural taste.',
    detailed_desc: 'Immediate temperature drop inhibits bacterial growth without relying on thermal over-processing or chemical additives.',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'ps5',
    step_number: '05',
    title: 'Bottling & Packaging',
    short_desc: 'Sterilized glass bottles & sealed pouches ready for dispatch.',
    detailed_desc: 'Packaged in food-grade eco-conscious containers designed to seal in fresh aroma and nutrition.',
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
    sort_order: 5,
    is_active: true,
  },
  {
    id: 'ps6',
    step_number: '06',
    title: 'Your Doorstep',
    short_desc: 'Chilled temperature-controlled delivery direct to your doorstep.',
    detailed_desc: 'Our dedicated fleet delivers direct to your doorstep with morning and evening fresh delivery routes.',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    sort_order: 6,
    is_active: true,
  }
];

export const INITIAL_DELIVERY: DeliveryRegion[] = [
  {
    id: 'dr1',
    name: 'Shahzad Town & Park Road (Priority Area)',
    sort_order: 1,
    is_active: true,
    areas: [
      { id: 'da14', name: 'Shahzad Town (FREE Doorstep Delivery)', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 1, is_active: true },
      { id: 'da15', name: 'Chak Shahzad Farm Houses & Park Road', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 2, is_active: true },
      { id: 'da16', name: 'Park View City & Bani Gala Surrounds', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 3, is_active: true },
      { id: 'da17', name: 'Naval Anchorage & Gulberg Greens', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 4, is_active: true },
    ]
  },
  {
    id: 'dr2',
    name: 'Capital Core (F-Sectors)',
    sort_order: 2,
    is_active: true,
    areas: [
      { id: 'da1', name: 'F-6 (Super Market & Embassy Area)', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 1, is_active: true },
      { id: 'da2', name: 'F-7 (Jinnah Super & Surrounds)', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 2, is_active: true },
      { id: 'da3', name: 'F-8 & F-10 Sectors', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 3, is_active: true },
      { id: 'da4', name: 'F-11 (Markaz & Residential Blocks)', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 4, is_active: true },
    ]
  },
  {
    id: 'dr3',
    name: 'Central Islamabad (E & G Sectors)',
    sort_order: 3,
    is_active: true,
    areas: [
      { id: 'da5', name: 'E-7 & E-11 (FECHS / MPCHS)', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 1, is_active: true },
      { id: 'da6', name: 'G-6, G-7 & G-8 Sectors', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 2, is_active: true },
      { id: 'da7', name: 'G-9, G-10 & G-11 Sectors', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 3, is_active: true },
    ]
  },
  {
    id: 'dr4',
    name: 'H & I Sectors',
    sort_order: 4,
    is_active: true,
    areas: [
      { id: 'da8', name: 'I-8 Sector (All Sub-Sectors)', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 1, is_active: true },
      { id: 'da9', name: 'I-9, I-10 & H-8/H-9', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 2, is_active: true },
    ]
  },
  {
    id: 'dr5',
    name: 'DHA & Bahria Town Islamabad',
    sort_order: 5,
    is_active: true,
    areas: [
      { id: 'da10', name: 'DHA Phase 1 & Phase 2', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 1, is_active: true },
      { id: 'da11', name: 'DHA Phase 3, 5 & Valley', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 2, is_active: true },
      { id: 'da12', name: 'Bahria Town Phase 1-8', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 3, is_active: true },
      { id: 'da13', name: 'Bahria Enclave Islamabad', delivery_fee: 0, timing_info: 'Morning & Evening Delivery', sort_order: 4, is_active: true },
    ]
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    rating: 5,
    customer_name: 'Dr. Ayesha Malik',
    customer_type: 'Family Physician & Parent',
    review: 'The difference in purity and aroma between supermarket milk and Farm Fresh Dairy is astounding. The lab test report gave me complete peace of mind, and our morning tea finally tastes like authentic pure milk.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 't2',
    rating: 5,
    customer_name: 'Chef Tariq Hameed',
    customer_type: 'Executive Pastry Chef',
    review: 'Their desi ghee and whole cow milk at Rs. 250 are unmatched. In pastry making, ingredient consistency is key, and Farm Fresh Dairy delivers 100% pure quality every single morning.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 't3',
    rating: 5,
    customer_name: 'Zainab Ahmed',
    customer_type: 'Resident (Shahzad Town)',
    review: 'I have been subscribing to morning deliveries for 8 months. The free delivery in Shahzad Town is always prompt by 7 AM, chilled, with a thick natural malai cream layer.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sort_order: 3,
    is_active: true,
  }
];

export const INITIAL_HERO: HomepageHero = {
  eyebrow: "100% PURE COW MILK",
  heading: "Fresh & Pure Cow Milk Straight From Happy Cows",
  description: "Certified adulterant-free, whole cow milk delivered direct to your home every morning. Pure, fresh, and healthy for your whole family.",
  primaryCtaText: "Order Milk (Rs. 250/L)",
  secondaryCtaText: "View Lab Report",
  stats: [
    { label: "Adulterant-Free", value: "100% Pure" },
    { label: "Per Litre", value: "Rs. 250" },
    { label: "Morning Supply", value: "Chilled Daily" }
  ],
  imageUrl: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80"
};

export const INITIAL_PROMISE: HomepagePromise = {
  eyebrow: "OUR PROMISE",
  heading: "100% Original Milk.",
  subtitle: "Pure · Fresh · Healthy — Straight From Happy Cows",
  description: "We never add water, synthetic thickeners, preservatives, or artificial milk powders. What you receive is pure, natural milk just as nature intended.",
  stats: [
    { number: "0%", label: "Chemicals or Preservatives" },
    { number: "100%", label: "Grass-fed Pasture Care" },
    { number: "Rs. 250", label: "Per Litre Whole Cow Milk" }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'PP-1001',
    customer_name: 'Sadia Hassan',
    customer_email: 'sadia.hassan@example.com',
    customer_phone: '+92 300 1234567',
    delivery_address: 'House 42, Street 14, DHA Phase 5',
    city: 'Karachi',
    area_name: 'DHA Phase 1-8',
    delivery_notes: 'Please leave at doorstep if before 7 AM.',
    delivery_fee: 0,
    subtotal: 780,
    total_amount: 780,
    status: 'Delivered',
    payment_method: 'Cash on Delivery',
    payment_status: 'Paid',
    items: [
      { product_name: 'Pure Farm Fresh Whole Milk', product_price: 260, quantity: 2, subtotal: 520 },
      { product_name: 'Artisan Thick Farm Dahi (Yogurt)', product_price: 260, quantity: 1, subtotal: 260 }
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-1002',
    order_number: 'PP-1002',
    customer_name: 'Bilal Khan',
    customer_email: 'bilal.k@example.com',
    customer_phone: '+92 321 9876543',
    delivery_address: 'Apartment 4B, Clifton Heights, Block 4',
    city: 'Karachi',
    area_name: 'Clifton Blocks 1-9',
    delivery_notes: 'Ring doorbell twice.',
    delivery_fee: 0,
    subtotal: 2400,
    total_amount: 2400,
    status: 'Out for Delivery',
    payment_method: 'Cash on Delivery',
    payment_status: 'Pending',
    items: [
      { product_name: 'Grass-Fed Pure Desi Ghee', product_price: 2400, quantity: 1, subtotal: 2400 }
    ],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];
