import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters'),
  full_description: z.string().min(20, 'Full description must be at least 20 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compare_at_price: z.coerce.number().optional(),
  unit: z.string().min(1, 'Unit is required (e.g. litre, kg)'),
  weight_volume: z.string().optional(),
  category_id: z.string().optional(),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  show_on_homepage: z.boolean().default(true),
  primary_image: z.string().url('Invalid image URL').or(z.string().min(1)),
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

export const AdminLoginSchema = z.object({
  email: z.string().email('Valid admin email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
