# Pure Pastures Dairy Farm — Web Application & Dynamic Admin CMS

Production-ready, highly dynamic Next.js 14 full-stack application inspired by high-end editorial farm-to-table web designs. Features a storytelling landing page, e-commerce catalog, shopping cart, Cash-on-Delivery checkout, and a separate data-driven Admin CMS.

---

## Technical Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Client Components)
- **Language**: Strict TypeScript
- **Styling**: Tailwind CSS with custom editorial tokens (`cream-50..400`, `earth-100..900`, `farm-100..900`)
- **Database & Storage**: Supabase PostgreSQL + Local Storage API fallback
- **State & Validation**: React Context API, Zod Validation
- **Icons & Animation**: Lucide Icons, CSS Marquee & Framer-Motion keyframes

---

## System Architecture & Features

### 1. Public Website Pages
- `/` — Editorial Storytelling Home Page (Hero, Our Promise, Farm Intro, Farm Values, Brand Marquee, Process Journey, Delivery Lookup, Product Collection, About Story, Testimonials, Final CTA)
- `/about` — Farm Heritage, Mission, and Pasture Philosophy
- `/process` — Detailed 6-Step Pasture-to-Pour Hygienic Journey
- `/products` — Dynamic Product Catalog with Category Filter Pills & Search
- `/products/[slug]` — Product Detail Page with high-res photography, quantity selector, and value badges
- `/delivery` — Chilled Morning Route Coverage Lookup
- `/contact` — Inquiry Form & Guided Farm Tour Information
- `/cart` — Full Cart Drawer & Cart Page
- `/checkout` — Customer Info, Delivery Area Selection, and Cash on Delivery order placement

### 2. Admin CMS Management (`/admin`)
- `/admin/login` — Secure Admin Authentication Portal
- `/admin/dashboard` — Gross Revenue, Total Orders, Active/Featured Product Counts, Recent Dispatches
- `/admin/products` — Product CRUD Table with Search, Active Toggle, and Featured Star Toggle
- `/admin/products/new` & `[id]/edit` — Product Editor (Pricing, Stock, SKU, Unit, Media, SEO)
- `/admin/categories` — Category Management
- `/admin/orders` - Order Status Updater (Pending → Confirmed → Processing → Out for Delivery → Delivered) & Snapshot Inspector
- `/admin/content` — Real-time Homepage CMS Editor (Hero Eyebrow/Heading/Paragraph, Promise Copy)
- `/admin/delivery` — Delivery Areas & Timing Configuration
- `/admin/settings` — Store Brand Settings

---

## Database Setup

1. Execute `supabase/schema.sql` in your Supabase SQL Editor to create all 14 normalized tables, foreign keys, indices, and RLS policies.
2. Execute `supabase/seed.sql` to populate initial demo categories, products, values, process steps, and delivery routes.
3. Configure `.env.local` with your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Local Development & Build

Run the local development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```
