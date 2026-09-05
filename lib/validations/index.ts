import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  short_description: z.string().min(1, 'Short description is required'),
  full_description: z.string().optional().nullable().or(z.literal('')),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compare_at_price: z.coerce.number().optional().nullable(),
  unit: z.string().min(1, 'Unit is required (e.g. litre, kg)'),
  weight_volume: z.string().optional().nullable(),
  category_id: z.string().optional().nullable().or(z.literal('')),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative').default(100),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  show_on_homepage: z.boolean().default(true),
  primary_image: z.string().optional().nullable().or(z.literal('')),
});

export const CheckoutSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
  delivery_address: z.string().min(10, 'Detailed delivery address is required'),
  city: z.string().min(2, 'City is required'),
  area_name: z.string().min(2, 'Delivery area selection is required'),
  delivery_notes: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  sort_order: z.coerce.number().optional().default(1),
  is_active: z.boolean().default(true),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Valid admin email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

